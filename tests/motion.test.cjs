const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');
class Target {
  constructor(candidate=false,top=1000){this.listeners={};this.top=top;this.candidate=candidate;this.isConnected=true;this.nodeType=1;this.animations=[];this.children=[];const classes=new Set();this.classList={contains:c=>classes.has(c),add:c=>classes.add(c),remove:c=>classes.delete(c)};this.textContent='01';}
  addEventListener(type,fn){(this.listeners[type] ||= new Set()).add(fn);}
  removeEventListener(type,fn){this.listeners[type]?.delete(fn);}
  emit(type,event={}){for(const fn of this.listeners[type]||[])fn(event);}
  matches(){return this.candidate;}
  querySelectorAll(){return this.children;}
  querySelector(){return null;}
  contains(target){return target===this||this.children.includes(target);}
  getBoundingClientRect(){return {top:this.top,bottom:this.top+100};}
  animate(frames,options){const a={frames,options,cancelled:false,paused:false,cancel(){this.cancelled=true;},pause(){this.paused=true;},play(){this.paused=false;},addEventListener(){}};this.animations.push(a);return a;}
}
function setup(reduced=false,top=1000){
  const card=new Target(true,top),second=new Target(true,top+120),document=new Target(),window=new Target(),media=new Target();
  document.getElementById=()=>null;document.documentElement={dataset:{}};document.body=new Target();document.querySelectorAll=selector=>selector==='.modal'||selector.startsWith('#timer-')?[]:[card,second];
  document.hidden=false;window.innerHeight=800;media.matches=reduced;window.matchMedia=()=>media;
  const intersections=[],mutations=[];
  const ctx=vm.createContext({window,document,console,Set,Map,WeakSet,
    IntersectionObserver:class{constructor(callback){this.callback=callback;this.observed=new Set();intersections.push(this);}observe(node){this.observed.add(node);}unobserve(node){this.observed.delete(node);}disconnect(){this.observed.clear();}},
    MutationObserver:class{constructor(callback){this.callback=callback;mutations.push(this);}observe(){}disconnect(){}},
    gsap:{fromTo(){},timeline(){return{}}}
  });
  vm.runInContext(fs.readFileSync('js/gsap-effects.js','utf8'),ctx);
  const engine=new window.GsapEffectsEngine();
  const enter=(target)=>{assert.ok(intersections.length,'Scroll reveals must observe content');intersections[0].callback([{target,isIntersecting:true}]);};
  return{engine,card,second,document,window,media,intersections,mutations,enter};
}
test('scroll reveals play once and never leave hidden styles behind',()=>{
  const e=setup();e.enter(e.card);assert.equal(e.card.animations.length,1);assert.ok(['none','backwards'].includes(e.card.animations[0].options.fill));
  e.enter(e.card);assert.equal(e.card.animations.length,1);
});
test('system reduced motion skips entrances and cancels running animations immediately',()=>{
  const e=setup(true);assert.equal(e.card.animations.length,0);assert.equal(e.document.documentElement.dataset.motion,'reduced');
  e.media.matches=false;e.media.emit('change');e.enter(e.card);assert.equal(e.card.animations.length,1);
  e.media.matches=true;e.media.emit('change');assert.equal(e.card.animations[0].cancelled,true);
});
test('dynamic filtered cards receive reveals without reanimating existing cards',()=>{
  const e=setup();e.enter(e.card);const card=new Target(true);
  assert.ok(e.mutations.length,'Dynamically rendered cards must be discovered');
  e.mutations[0].callback([{type:'childList',addedNodes:[card],removedNodes:[]}]);
  assert.ok(e.intersections[0].observed.has(card));e.enter(card);
  assert.equal(card.animations.length,1);assert.equal(e.card.animations.length,1);
});
test('keyboard focus cancels an entrance instead of moving the focused control',()=>{
  const e=setup();e.enter(e.card);e.document.emit('focusin',{target:e.card});assert.equal(e.card.animations[0].cancelled,true);
});
test('hidden tabs pause in-flight effects and resume when visible',()=>{
  const e=setup();e.enter(e.card);e.document.hidden=true;e.document.emit('visibilitychange');assert.equal(e.card.animations[0].paused,true);
  e.document.hidden=false;e.document.emit('visibilitychange');assert.equal(e.card.animations[0].paused,false);
});
test('an already-focused card stays still when it first enters the viewport',()=>{
  const e=setup();e.document.activeElement=e.card;e.enter(e.card);assert.equal(e.card.animations.length,0);
});

test('below-fold content stays hidden until it enters the viewport',()=>{
  const e=setup();assert.equal(e.card.classList.contains('scroll-reveal-pending'),true);assert.equal(e.card.animations.length,0);
  e.intersections[0].callback([{target:e.card,isIntersecting:false}]);assert.equal(e.card.classList.contains('scroll-reveal-pending'),true);
  e.enter(e.card);assert.equal(e.card.classList.contains('scroll-reveal-pending'),false);assert.equal(e.card.animations.length,1);
});
test('opening viewport content is visible immediately without an entrance animation',()=>{
  const e=setup(false,100);assert.equal(e.card.classList.contains('scroll-reveal-pending'),false);assert.equal(e.card.animations.length,0);assert.equal(e.intersections[0].observed.has(e.card),false);
});
test('keyboard focus immediately exposes a pending card without motion',()=>{
  const e=setup();e.document.activeElement=e.card;e.document.emit('focusin',{target:e.card});assert.equal(e.card.classList.contains('scroll-reveal-pending'),false);assert.equal(e.intersections[0].observed.has(e.card),false);assert.equal(e.card.animations.length,0);
});
test('reduced motion and teardown expose all pending content',()=>{
  const e=setup();e.media.matches=true;e.media.emit('change');assert.equal(e.card.classList.contains('scroll-reveal-pending'),false);
  e.media.matches=false;e.media.emit('change');assert.equal(e.card.classList.contains('scroll-reveal-pending'),true);e.engine.destroy();assert.equal(e.card.classList.contains('scroll-reveal-pending'),false);
});
test('returning to a visible tab reveals entries whose intersection happened while hidden',()=>{
  const e=setup();e.document.hidden=true;e.card.top=100;e.enter(e.card);assert.equal(e.card.animations.length,0);e.document.hidden=false;e.document.emit('visibilitychange');assert.equal(e.card.classList.contains('scroll-reveal-pending'),false);assert.equal(e.card.animations.length,1);
});
test('new content remains visible when the animation API is unavailable',()=>{
  const e=setup(),card=new Target(true);card.animate=undefined;e.mutations[0].callback([{addedNodes:[card]}]);assert.equal(card.classList.contains('scroll-reveal-pending'),false);assert.equal(e.intersections[0].observed.has(card),false);
});
