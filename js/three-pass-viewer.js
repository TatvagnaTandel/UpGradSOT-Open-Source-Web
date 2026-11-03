/**
 * upGrad School of Technology — Open Source Events
 * Three.js WebGL Interactive 3D Hacker Pass Viewer
 */

(function () {
  'use strict';

  class ThreePassViewer {
    constructor() { this.stage = null; }

    render3dPass(event, user) {
      this.destroy();
      // The modal content is replaced on each open; reacquire its canvas each time.
      const container = document.getElementById('pass-3d-viewport');
      const canvas = document.getElementById('pass-3d-canvas');
      if (!container || !canvas) return false;
      this.stage = new window.ThreeStage({ container, canvas, radius: 2.1 });
      if (!this.stage.ready) return false;
      const front = new THREE.CanvasTexture(this.createFrontCanvas(event, user));
      const back = new THREE.CanvasTexture(this.createBackCanvas());
      front.encoding = back.encoding = THREE.sRGBEncoding;
      const edge = new THREE.MeshStandardMaterial({ color: 0x252d33, roughness: 0.5 });
      // Unlit faces keep the printed ticket readable from every angle.
      const materials = [edge, edge, edge, edge, new THREE.MeshBasicMaterial({ map: front }), new THREE.MeshBasicMaterial({ map: back })];
      this.stage.model.add(new THREE.Mesh(new THREE.BoxGeometry(2.2,3.2,0.07), materials));
      this.stage.setPlaying(false);
      this.stage.render();
      return true;
    }

    createFrontCanvas(event, user) {
      const canvas = document.createElement('canvas');
      canvas.width = 640; canvas.height = 960;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#faf5ea'; ctx.fillRect(0,0,640,960);
      ctx.fillStyle = '#ffd166'; ctx.fillRect(0,0,640,170);
      ctx.fillStyle = '#121212'; ctx.font = 'bold 26px sans-serif';
      ctx.fillText('UPGRAD SCHOOL OF TECHNOLOGY',36,70,568);
      ctx.font = 'bold 18px monospace'; ctx.fillText('OPEN SOURCE / BUILDERS',36,124,568);
      ctx.fillStyle = '#5b625e'; ctx.font = '18px monospace'; ctx.fillText('SAMPLE EVENT PASS',36,235);
      ctx.fillStyle = '#121212'; ctx.font = 'bold 42px sans-serif'; ctx.fillText(user.name,36,305,568);
      ctx.font = '21px monospace'; ctx.fillText(user.studentId || 'SAMPLE MEMBER',36,350,568);
      ctx.fillStyle = '#e4ded0'; ctx.fillRect(36,396,568,2);
      ctx.fillStyle = '#5b625e'; ctx.font = '18px monospace'; ctx.fillText('YOUR NEXT CHAPTER',36,452);
      ctx.fillStyle = '#121212'; ctx.font = 'bold 28px sans-serif'; ctx.fillText(event.title,36,509,568);
      ctx.font = '22px sans-serif'; ctx.fillText((event.targetDate ? new Date(event.targetDate).toLocaleDateString('en-IN') : 'Dates not verified'),36,554);
      ctx.fillText(event.venue.split(',')[0],36,596,568);
      ctx.fillStyle = '#386b80'; ctx.font = 'bold 92px monospace'; ctx.fillText('< / >',36,754);
      ctx.fillStyle = '#121212'; ctx.font = 'bold 20px monospace'; ctx.fillText('DEMO ONLY / NO VENUE ENTRY',36,881,568);
      return canvas;
    }

    createBackCanvas() {
      const canvas = document.createElement('canvas');
      canvas.width = 640; canvas.height = 960;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#386b80'; ctx.fillRect(0,0,640,960);
      ctx.fillStyle = '#faf5ea'; ctx.font = 'bold 32px sans-serif'; ctx.fillText('OPEN SOURCE STARTS WITH US.',36,94,568);
      ctx.font = 'bold 144px monospace'; ctx.fillText('< / >',36,472,568);
      ctx.font = '22px sans-serif'; ctx.fillText('Code. Collaborate. Contribute.',36,681,568);
      ctx.font = '18px monospace'; ctx.fillText('DESIGN PREVIEW / NOT FOR ADMISSION',36,880,568);
      return canvas;
    }

    destroy() {
      this.stage?.destroy();
      this.stage = null;
    }
  }
  window.threePassViewer = new ThreePassViewer();
})();
