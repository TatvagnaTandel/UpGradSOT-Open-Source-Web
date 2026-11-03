/** One geometry at a time, with the same accessible controls as the hero. */
(function () {
  'use strict';
  class ThreeLabScene extends window.ThreeStage {
    constructor() {
      super({ container: document.getElementById('three-lab-canvas-container'), canvas: document.getElementById('three-lab-canvas'), radius: 2.65, controls: document.querySelectorAll('[data-lab-control]'), background: 0xece8df });
      if (!this.ready) return;
      const specs = [
        ['01 / Continuous loop', new THREE.TorusKnotGeometry(1.25,0.38,128,24),0x42758b],
        ['02 / Faceted form', new THREE.DodecahedronGeometry(1.8),0xf5c84b],
        ['03 / Open structure', new THREE.IcosahedronGeometry(1.9,0),0xed719b]
      ];
      this.meshes = specs.map(([name,geometry,color],index) => {
        const mesh = new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({color:new THREE.Color(color).convertSRGBToLinear(),roughness:0.4,metalness:0.08,flatShading:index===1,wireframe:index===2}));
        mesh.name=name; mesh.visible=index===0; this.model.add(mesh); return mesh;
      });
      this.activeMeshIndex=0;
      const spin=document.getElementById('lab-btn-spin');
      this.updateControls=()=>{
        const moving=this.playing && !this.media.matches;
        spin.textContent=this.media.matches ? 'Motion reduced' : moving ? 'Pause motion' : 'Play motion';
        spin.disabled=this.media.matches; spin.setAttribute('aria-pressed',String(moving));
      };
      this.bind(spin,'click',()=>this.setPlaying(!this.playing));
      this.bind(document.getElementById('lab-btn-next'),'click',()=>this.cycleGeometry());
      this.bind(document.getElementById('lab-btn-reset'),'click',()=>this.reset());
      this.updateControls(); this.render();
    }
    cycleGeometry() {
      if (!this.ready) return;
      this.meshes[this.activeMeshIndex].visible=false;
      this.activeMeshIndex=(this.activeMeshIndex+1)%this.meshes.length;
      const next=this.meshes[this.activeMeshIndex]; next.visible=true;
      document.getElementById('lab-geometry-name').textContent=next.name;
      this.reset();
    }
  }
  document.addEventListener('DOMContentLoaded',()=>{
    if(document.getElementById('three-lab-canvas')) window.threeLabScene=new ThreeLabScene();
  });
})();
