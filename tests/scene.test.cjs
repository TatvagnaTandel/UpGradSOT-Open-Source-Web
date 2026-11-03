const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname, '..');
class Target {
  constructor() { this.handlers = {}; this.clientWidth = 390; this.clientHeight = 320; this.dataset = {}; this.hidden = false; this.attributes = {}; }
  addEventListener(type, fn) { (this.handlers[type] ||= new Set()).add(fn); }
  removeEventListener(type, fn) { this.handlers[type]?.delete(fn); }
  emit(type, event = {}) { for (const fn of this.handlers[type] || []) fn({ preventDefault() {}, ...event }); }
  setAttribute(key, value) { this.attributes[key] = value; }
  setPointerCapture() {}
  releasePointerCapture() {}
  getBoundingClientRect() { return { width: this.clientWidth, height: this.clientHeight }; }
  querySelectorAll() { return []; }
}
function setup({ reduced = false, unavailable = false } = {}) {
  const window = new Target(); const document = new Target();
  const media = new Target(); media.matches = reduced;
  const frames = new Map(); let id = 0; let observer;
  const ctx = vm.createContext({ window, document, console, Math, Float32Array,
    requestAnimationFrame(fn) { frames.set(++id, fn); return id; },
    cancelAnimationFrame(id) { frames.delete(id); },
    ResizeObserver: class { observe() {} disconnect() {} },
    IntersectionObserver: class { constructor(fn) { observer = fn; } observe() {} disconnect() {} }
  });
  window.matchMedia = () => media; window.devicePixelRatio = 3;
  vm.runInContext(fs.readFileSync(path.join(root, 'vendor/three.min.js'), 'utf8'), ctx);
  const renders = [];
  ctx.THREE.WebGLRenderer = class {
    constructor() { if (unavailable) throw Error('No WebGL'); this.capabilities = { isWebGL2: true }; this.shadowMap = {}; }
    setSize(w, h) { this.size = [w,h]; }
    setPixelRatio(value) { this.ratio = value; }
    render() { renders.push(1); }
    dispose() {}
  };
  const runtime = path.join(root, 'js/three-stage.js');
  assert.ok(fs.existsSync(runtime), 'Shared scene lifecycle must exist');
  vm.runInContext(fs.readFileSync(runtime, 'utf8'), ctx);
  const container = new Target(), canvas = new Target();
  const stage = new window.ThreeStage({ container, canvas, radius: 3 });
  return { stage, container, canvas, window, document, media, frames, renders,
    visibility(value) { observer([{ isIntersecting: value }]); },
    tick(time) { const entry = frames.entries().next().value; if (entry) { frames.delete(entry[0]); entry[1](time); } }
  };
}
test('camera fits the entire object at phone and landscape aspect ratios', () => {
  const env = setup(); const {stage, container} = env;
  for (const [w,h] of [[390,320],[1024,360],[260,400]]) {
    container.clientWidth=w; container.clientHeight=h; stage.resize();
    const vertical = stage.camera.fov * Math.PI / 360;
    const horizontal = Math.atan(Math.tan(vertical) * w/h);
    assert.ok(stage.camera.position.z * Math.sin(Math.min(vertical,horizontal)) >= 3.3);
  }
  assert.ok(stage.renderer.ratio <= 1.5);
});
test('off-screen and hidden scenes cancel their frame and resume without duplication', () => {
  const env = setup(); env.visibility(true); assert.equal(env.frames.size,1);
  env.visibility(false); assert.equal(env.frames.size,0);
  env.visibility(true); env.visibility(true); assert.equal(env.frames.size,1);
  env.document.hidden=true; env.document.emit('visibilitychange'); assert.equal(env.frames.size,0);
  env.document.hidden=false; env.document.emit('visibilitychange'); assert.equal(env.frames.size,1);
});
test('pause and reduced motion render once without scheduling continuous frames', () => {
  const env = setup({ reduced: true }); env.visibility(true); assert.equal(env.frames.size,0);
  env.canvas.emit('keydown',{key:'ArrowRight'}); assert.ok(env.renders.length > 0); assert.equal(env.frames.size,0);
  env.media.matches=false; env.media.emit('change'); assert.equal(env.frames.size,1);
  env.stage.setPlaying(false); assert.equal(env.frames.size,0);
});
test('drag uses pointer capture and reset restores the initial orientation', () => {
  const env = setup(); const initial=env.stage.model.rotation.y;
  env.canvas.emit('pointerdown',{pointerId:1,clientX:0,clientY:0});
  env.canvas.emit('pointermove',{pointerId:1,clientX:60,clientY:20});
  assert.notEqual(env.stage.model.rotation.y,initial);
  env.canvas.emit('pointercancel',{pointerId:1}); assert.equal(env.stage.dragging,false);
  env.stage.reset(); assert.equal(env.stage.model.rotation.y,initial);
});
test('context loss keeps the static fallback and disables unavailable controls', () => {
  const env = setup(); env.visibility(true); env.canvas.emit('webglcontextlost');
  assert.equal(env.frames.size,0); assert.equal(env.container.dataset.sceneState,'fallback');
  assert.equal(env.stage.ready,false);
});
test('unavailable WebGL falls back without throwing and disposal releases listeners', () => {
  const env=setup({ unavailable:true }); assert.equal(env.stage.ready,false);
  assert.equal(env.container.dataset.sceneState,'fallback');
  const live=setup(); live.visibility(true); live.stage.destroy();
  assert.equal(live.frames.size,0); assert.equal(live.canvas.handlers.pointermove.size,0);
});
test('back-forward cache preserves a usable scene and resumes it on return', () => {
  const env=setup(); env.visibility(true);
  env.window.emit('pagehide',{persisted:true});
  assert.equal(env.frames.size,0); assert.equal(env.stage.ready,true);
  env.window.emit('pageshow',{persisted:true});
  assert.equal(env.frames.size,1);
  env.canvas.emit('keydown',{key:'ArrowRight'});
  assert.notEqual(env.stage.model.rotation.y,env.stage.resetRotation.y);
});
