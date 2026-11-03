const {test}=require('node:test'); const assert=require('node:assert/strict'); const vm=require('node:vm'); const fs=require('node:fs');
test('pass viewer acquires the newly created modal canvas on every open',()=>{
  let dom={}; const stages=[];
  const ctx=vm.createContext({window:{},console,document:{getElementById:id=>dom[id],createElement:()=>({getContext:()=>new Proxy({}, {get:(_,key)=>()=>{}})})}});
  vm.runInContext(fs.readFileSync('vendor/three.min.js','utf8'),ctx);
  ctx.window.ThreeStage=class {
    constructor(options){this.canvas=options.canvas;this.ready=true;this.model=new ctx.THREE.Group();stages.push(this);}
    setPlaying(){} render(){} destroy(){this.disposed=true;}
  };
  vm.runInContext(fs.readFileSync('js/three-pass-viewer.js','utf8'),ctx);
  const viewer=ctx.window.threePassViewer;
  const event={title:'A long event',targetDate:'2026-12-01',venue:'Pune, India'}; const user={name:'Sample Student'};
  for(let i=0;i<2;i++){
    const canvas={};dom={'pass-3d-viewport':{},'pass-3d-canvas':canvas};
    assert.equal(viewer.render3dPass(event,user),true);assert.equal(stages[i].canvas,canvas);
    if(i)assert.equal(stages[i-1].disposed,true);
  }
  viewer.destroy();assert.equal(stages[1].disposed,true);
});
