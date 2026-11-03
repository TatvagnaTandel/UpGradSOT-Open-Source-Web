/** A tangible code sculpture: beveled brackets, quiet lighting, no particle clutter. */
(function () {
  'use strict';
  class ThreeHeroScene extends window.ThreeStage {
    constructor() {
      super({ container: document.getElementById('three-hero-canvas-container'), canvas: document.getElementById('three-hero-canvas'), radius: 2.85, controls: document.querySelectorAll('[data-hero-control]') });
      if (!this.ready) return;
      const material = color => new THREE.MeshStandardMaterial({ color: new THREE.Color(color).convertSRGBToLinear(), roughness: 0.38, metalness: 0.08 });
      const shape = new THREE.Shape();
      [[0.65,1.35],[-0.8,0],[0.65,-1.35],[1.08,-0.88],[0.12,0],[1.08,0.88]].forEach(([x,y], i) => i ? shape.lineTo(x,y) : shape.moveTo(x,y));
      shape.closePath();
      const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.48, bevelEnabled: true, bevelThickness: 0.07, bevelSize: 0.07, bevelSegments: 3, steps: 1 });
      geometry.translate(0,0,-0.24);
      const left = new THREE.Mesh(geometry, material(0xf5c84b));
      left.position.x = -1.65;
      const right = new THREE.Mesh(geometry, material(0xed719b));
      right.rotation.z = Math.PI; right.position.x = 1.65; right.position.z = -0.2;
      const slash = new THREE.Mesh(new THREE.BoxGeometry(0.28,2.8,0.5), material(0x386b80));
      slash.rotation.z = -0.3;
      this.model.add(left,right,slash);
      const plinth = new THREE.Mesh(new THREE.CylinderGeometry(2.1,2.25,0.25,64), material(0xe0d9c8));
      plinth.position.y = -1.65;
      this.model.add(plinth);
      const mode = document.getElementById('three-btn-mode');
      this.bind(mode,'click',() => {
        this.wireframe = !this.wireframe;
        [left,right,slash].forEach(mesh => { mesh.material.wireframe = this.wireframe; });
        mode.textContent = this.wireframe ? 'View: wireframe' : 'View: solid';
        mode.setAttribute('aria-pressed',String(this.wireframe)); this.render();
      });
      const spin = document.getElementById('three-btn-spin');
      this.updateControls = () => {
        const moving = this.playing && !this.media.matches;
        spin.textContent = this.media.matches ? 'Motion reduced' : moving ? 'Pause motion' : 'Play motion';
        spin.disabled = this.media.matches;
        spin.setAttribute('aria-pressed',String(moving));
      };
      this.bind(spin,'click',()=>this.setPlaying(!this.playing));
      this.bind(document.getElementById('three-btn-reset'),'click',()=>this.reset());
      this.updateControls(); this.render();
    }
  }
  document.addEventListener('DOMContentLoaded',() => {
    if (document.getElementById('three-hero-canvas')) window.threeHeroScene = new ThreeHeroScene();
  });
})();
