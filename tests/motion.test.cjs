const {test}=require('node:test');
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
class Target {
  constructor(candidate=false,top=1000){this.listeners={};this.candidate=candidate;this.top=top;this.isConnected=true;this.nodeType=1;this.children=[];this.dataset={};this.animations=[];this.textContent='01';const classes=new Set(),props=new Map();this.classList={contains:c=>classes.has(c),add:c=>classes.add(c),remove:c=>classes.delete(c),toggle(c,on){on?classes.add(c):classes.delete(c)}};this.style={setProperty:(k,v)=>props.set(k,String(v)),getPropertyValue:k=>props.get(k)||'',removeProperty:k=>props.delete(k)};}
  addEventListener(t,f){(this.listeners[t] ||= new Set()).add(f)}
  removeEventListener(t,f){this.listeners[t]?.delete(f)}
  emit(t,e={}){for(const f of this.listeners[t]||[])f(e)}
  matches(){return this.candidate}
  querySelectorAll(){return this.children}
  closest(){return null}
  contains(node){return this===node||this.children.includes(node)}
  getBoundingClientRect(){return{top:this.top-(this.scroll?.()||0)+(parseFloat(this.style.getPropertyValue('--reveal-shift'))||0),bottom:this.top+100-(this.scroll?.()||0),height:100}}
  animate(frames,options){const a={frames,options,cancelled:false,paused:false,cancel(){this.cancelled=true},pause(){this.paused=true},play(){this.paused=false},addEventListener(){}};this.animations.push(a);return a}
}
function setup(reduced=false,top=1000){
 const card=new Target(true,top),second=new Target(true,top+120),document=new Target(),window=new Target(),media=new Target();
 document.documentElement={dataset:{revealBoot:'pending'}};document.body=new Target();document.getElementById=()=>null;document.querySelectorAll=s=>s.startsWith('#timer-')?[]:[card,second];document.hidden=false;
 window.scrollY=0;window.innerHeight=800;media.matches=reduced;window.matchMedia=()=>media;const frames=new Map();let next=0;window.requestAnimationFrame=f=>{frames.set(++next,f);return next};window.cancelAnimationFrame=id=>frames.delete(id);
 const mutations=[];const ctx=vm.createContext({window,document,console,Set,Map,WeakSet,MutationObserver:class{constructor(f){this.callback=f;mutations.push(this)}observe(){}disconnect(){}}});
 card.scroll=second.scroll=()=>window.scrollY;
 vm.runInContext(fs.readFileSync('js/gsap-effects.js','utf8'),ctx);const engine=new window.GsapEffectsEngine();
 const flush=()=>{for(const[id,f]of[...frames]){frames.delete(id);f()}};
 const scroll=y=>{window.scrollY=y;window.emit('scroll');flush()};flush();
 return{engine,card,second,document,window,media,frames,mutations,flush,scroll};
}
const opacity=node=>Number(node.style.getPropertyValue('--reveal-opacity'));
test('below-fold content is staged before the boot visibility gate is released',()=>{const e=setup();assert.equal(e.card.classList.contains('scroll-reveal'),true);assert.equal(opacity(e.card),0);assert.equal(e.document.documentElement.dataset.revealBoot,undefined)});
test('reveal progress follows scroll distance and stops at a partial state',()=>{const e=setup();e.scroll(450);const partial=opacity(e.card);assert.ok(partial>0&&partial<1);e.flush();assert.equal(opacity(e.card),partial);assert.equal(e.card.animations.length,0);e.scroll(650);assert.equal(opacity(e.card),1)});
test('scrolling back reverses the reveal rather than replaying a timer',()=>{const e=setup();e.scroll(650);assert.equal(opacity(e.card),1);e.scroll(450);assert.ok(opacity(e.card)>0&&opacity(e.card)<1);e.scroll(0);assert.equal(opacity(e.card),0)});
test('opening viewport content stays visible without being staged',()=>{const e=setup(false,100);assert.equal(e.card.classList.contains('scroll-reveal'),false);assert.equal(e.card.animations.length,0)});
test('initially visible live filter results remain available immediately',()=>{const e=setup(),card=new Target(true,100);e.mutations[0].callback([{addedNodes:[card]}]);e.flush();assert.equal(card.classList.contains('scroll-reveal'),false)});
test('new below-fold filter results receive scroll staging',()=>{const e=setup(),card=new Target(true,1500);e.mutations[0].callback([{addedNodes:[card]}]);e.flush();assert.equal(card.classList.contains('scroll-reveal'),true);assert.equal(opacity(card),0)});
test('keyboard focus exposes a pending card permanently without motion',()=>{const e=setup();e.document.activeElement=e.card;e.document.emit('focusin',{target:e.card});assert.equal(e.card.classList.contains('scroll-reveal'),false);e.scroll(450);e.scroll(0);assert.equal(e.card.classList.contains('scroll-reveal'),false)});
test('reduced motion exposes every staged item and cancels active effects',()=>{const e=setup();e.engine.play(e.card,[{opacity:0},{opacity:1}],{});e.media.matches=true;e.media.emit('change');assert.equal(e.card.classList.contains('scroll-reveal'),false);assert.equal(e.card.animations[0].cancelled,true)});
test('reduced motion starts with all content visible',()=>{const e=setup(true);assert.equal(e.card.classList.contains('scroll-reveal'),false);assert.equal(e.document.documentElement.dataset.revealBoot,undefined)});
test('a hidden-tab scroll is reconciled on return without autoplay',()=>{const e=setup();e.document.hidden=true;e.window.scrollY=450;e.window.emit('scroll');assert.equal(e.frames.size,0);e.document.hidden=false;e.document.emit('visibilitychange');e.flush();assert.ok(opacity(e.card)>0&&opacity(e.card)<1)});
test('layout shifts refresh natural positions without counting the reveal offset',()=>{const e=setup();e.scroll(450);const before=opacity(e.card);e.card.top+=200;e.window.emit('resize');e.flush();assert.ok(opacity(e.card)<before);e.window.emit('resize');e.flush();assert.equal(opacity(e.card),0)});
test('teardown cancels queued frames and exposes all content',()=>{const e=setup();e.window.emit('scroll');e.engine.destroy();assert.equal(e.frames.size,0);assert.equal(e.card.classList.contains('scroll-reveal'),false)});
