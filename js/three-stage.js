/** Shared, demand-rendered Three.js viewport. No animation runs outside the viewport. */
(function () {
  'use strict';
  class ThreeStage {
    constructor({ container, canvas, radius = 3, background = 0xf2eee4, controls = [] }) {
      this.container = container;
      this.canvas = canvas;
      this.radius = radius;
      this.controls = controls;
      this.ready = false;
      this.frame = null;
      this.listeners = [];
      this.visible = false;
      this.playing = true;
      this.dragging = false;
      this.media = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (typeof THREE === 'undefined') { this.fallback(); return; }
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(background);
      this.model = new THREE.Group();
      this.scene.add(this.model);
      this.camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
      this.resetRotation = { x: 0.12, y: -0.28 };
      this.model.rotation.set(this.resetRotation.x, this.resetRotation.y, 0);
      try {
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'low-power' });
      } catch (_) { this.fallback(); return; }
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      this.renderer.outputEncoding = THREE.sRGBEncoding;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 0.95;
      this.scene.add(new THREE.HemisphereLight(0xffffff, 0x8d8174, 0.6));
      const key = new THREE.DirectionalLight(0xfffaf0, 1.3);
      key.position.set(-3, 5, 7);
      this.scene.add(key);
      const fill = new THREE.DirectionalLight(0xc9deec, 0.45);
      fill.position.set(5, 1, -3);
      this.scene.add(fill);
      this.ready = true;
      container.dataset.sceneState = 'ready';
      this.resize();
      this.bind(canvas, 'webglcontextlost', (event) => { event.preventDefault(); this.fallback(); });
      this.bind(canvas, 'webglcontextrestored', () => {
        container.dataset.sceneState = 'ready'; this.ready = true;
        this.controls.forEach(button => { button.disabled = false; });
        this.updateControls?.(); this.resize(); this.sync();
      });
      this.bind(document, 'visibilitychange', () => this.sync());
      this.bind(this.media, 'change', () => { this.updateControls?.(); this.sync(); });
      this.bind(window, 'pagehide', event => {
        if (event.persisted) { this.suspended = true; this.sync(); }
        else this.destroy();
      });
      this.bind(window, 'pageshow', () => { this.suspended = false; this.sync(); });
      this.bind(canvas, 'pointerdown', (event) => {
        if (!this.ready || (event.button !== undefined && event.button !== 0)) return;
        this.dragging = true; this.pointer = event.pointerId;
        this.lastX = event.clientX; this.lastY = event.clientY;
        canvas.setPointerCapture(event.pointerId);
      });
      this.bind(canvas, 'pointermove', (event) => {
        if (!this.dragging || event.pointerId !== this.pointer) return;
        this.model.rotation.y += (event.clientX - this.lastX) * 0.008;
        this.model.rotation.x = Math.max(-0.7, Math.min(0.7, this.model.rotation.x + (event.clientY - this.lastY) * 0.006));
        this.lastX = event.clientX; this.lastY = event.clientY;
        this.render();
      });
      const release = () => { this.dragging = false; this.pointer = null; };
      this.bind(canvas, 'pointerup', release);
      this.bind(canvas, 'pointercancel', release);
      this.bind(canvas, 'lostpointercapture', release);
      this.bind(canvas, 'keydown', (event) => {
        if (!this.ready) return;
        const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', ' '];
        if (!keys.includes(event.key)) return;
        event.preventDefault();
        if (event.key === 'Home') this.reset();
        else if (event.key === ' ') this.setPlaying(!this.playing);
        else {
          if (event.key === 'ArrowLeft') this.model.rotation.y -= 0.15;
          if (event.key === 'ArrowRight') this.model.rotation.y += 0.15;
          if (event.key === 'ArrowUp') this.model.rotation.x -= 0.1;
          if (event.key === 'ArrowDown') this.model.rotation.x += 0.1;
          this.render();
        }
      });
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(container);
      if ('IntersectionObserver' in window || typeof IntersectionObserver !== 'undefined') {
        this.observer = new IntersectionObserver(entries => {
          this.visible = entries[0].isIntersecting;
          this.sync();
        }, { threshold: 0.01 });
        this.observer.observe(container);
      } else { this.visible = true; this.sync(); }
    }
    bind(target, type, fn) {
      target.addEventListener(type, fn);
      this.listeners.push(() => target.removeEventListener(type, fn));
    }
    resize() {
      if (!this.ready) return;
      const width = Math.max(1, this.container.clientWidth);
      const height = Math.max(1, this.container.clientHeight);
      this.camera.aspect = width / height;
      const vertical = this.camera.fov * Math.PI / 360;
      const horizontal = Math.atan(Math.tan(vertical) * this.camera.aspect);
      this.camera.position.set(0, 0, this.radius * 1.15 / Math.sin(Math.min(vertical, horizontal)));
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height, false);
      this.render();
    }
    render() { if (this.ready && !document.hidden) this.renderer.render(this.scene, this.camera); }
    sync() {
      if (this.frame !== null) cancelAnimationFrame(this.frame);
      this.frame = null; this.lastTime = null;
      if (!this.ready || !this.visible || document.hidden || this.suspended) return;
      this.render();
      if (this.playing && !this.media.matches) this.frame = requestAnimationFrame(time => this.tick(time));
    }
    tick(time) {
      this.frame = null;
      if (!this.ready || !this.visible || document.hidden || this.suspended || !this.playing || this.media.matches) return;
      const delta = this.lastTime === null ? 0 : Math.min((time - this.lastTime) / 1000, 0.05);
      this.lastTime = time;
      if (!this.dragging) this.model.rotation.y += delta * 0.16;
      this.render();
      this.frame = requestAnimationFrame(next => this.tick(next));
    }
    setPlaying(value) { this.playing = value; this.updateControls?.(); this.sync(); }
    reset() { this.model.rotation.set(this.resetRotation.x, this.resetRotation.y, 0); this.render(); }
    fallback() {
      this.ready = false;
      if (this.frame !== null) cancelAnimationFrame(this.frame);
      this.frame = null;
      this.container.dataset.sceneState = 'fallback';
      this.controls.forEach(button => { button.disabled = true; });
    }
    destroy() {
      if (this.frame !== null) cancelAnimationFrame(this.frame);
      this.frame = null; this.ready = false;
      this.listeners.forEach(remove => remove()); this.listeners = [];
      this.observer?.disconnect(); this.resizeObserver?.disconnect();
      const geometries = new Set(), materials = new Set(), textures = new Set();
      this.scene?.traverse(object => {
        if (object.geometry) geometries.add(object.geometry);
        if (object.material) (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => materials.add(material));
      });
      materials.forEach(material => {
        Object.values(material).forEach(value => { if (value?.isTexture) textures.add(value); });
        material.dispose();
      });
      textures.forEach(texture => texture.dispose());
      geometries.forEach(geometry => geometry.dispose());
      this.renderer?.dispose();
    }
  }
  window.ThreeStage = ThreeStage;
})();
