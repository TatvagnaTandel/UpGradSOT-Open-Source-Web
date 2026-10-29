/**
 * upGrad School of Technology — Open Source Events
 * Three.js WebGL Interactive 3D Hacker Pass Viewer
 */

(function () {
  'use strict';

  class ThreePassViewer {
    constructor() {
      this.container = document.getElementById('pass-3d-viewport');
      this.canvas = document.getElementById('pass-3d-canvas');

      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.cardMesh = null;
      this.frontTexture = null;
      this.backTexture = null;

      this.isDragging = false;
      this.previousMousePosition = { x: 0, y: 0 };
      this.targetRotation = { x: 0.15, y: -0.2 };
      this.animId = null;
    }

    render3dPass(event, user) {
      if (!this.container || !this.canvas) return;

      if (typeof THREE === 'undefined') {
        console.warn('[ThreePassViewer] Three.js is not loaded.');
        return;
      }

      this.destroy(); // Clean any previous session

      // 1. Scene
      this.scene = new THREE.Scene();

      // 2. Camera
      const width = this.container.clientWidth || 400;
      const height = this.container.clientHeight || 380;
      this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
      this.camera.position.set(0, 0, 5.8);

      // 3. Renderer
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // 4. Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
      this.scene.add(ambientLight);

      const light1 = new THREE.DirectionalLight(0x00f0ff, 1.8);
      light1.position.set(5, 5, 4);
      this.scene.add(light1);

      const light2 = new THREE.DirectionalLight(0xff3366, 1.6);
      light2.position.set(-5, -4, 3);
      this.scene.add(light2);

      // 5. Generate Card Canvas Textures
      this.frontTexture = new THREE.CanvasTexture(this.createFrontCanvas(event, user));
      this.backTexture = new THREE.CanvasTexture(this.createBackCanvas(event, user));

      // 6. Build 3D Badge Mesh
      // BoxGeometry: width=2.2, height=3.2, depth=0.06
      const cardGeo = new THREE.BoxGeometry(2.2, 3.2, 0.06);

      // Multi-material for box sides [right, left, top, bottom, front, back]
      const edgeMat = new THREE.MeshStandardMaterial({
        color: 0x121212,
        roughness: 0.3,
        metalness: 0.8
      });

      const frontMat = new THREE.MeshStandardMaterial({
        map: this.frontTexture,
        roughness: 0.25,
        metalness: 0.3
      });

      const backMat = new THREE.MeshStandardMaterial({
        map: this.backTexture,
        roughness: 0.3,
        metalness: 0.6
      });

      const materials = [edgeMat, edgeMat, edgeMat, edgeMat, frontMat, backMat];

      this.cardGroup = new THREE.Group();
      this.cardMesh = new THREE.Mesh(cardGeo, materials);
      this.cardGroup.add(this.cardMesh);

      // Add Lanyard Top Clasp
      const claspGeo = new THREE.TorusGeometry(0.22, 0.04, 16, 32);
      const claspMat = new THREE.MeshStandardMaterial({
        color: 0xffe600,
        metalness: 0.9,
        roughness: 0.1
      });
      const claspMesh = new THREE.Mesh(claspGeo, claspMat);
      claspMesh.position.set(0, 1.7, 0);
      claspMesh.rotation.x = Math.PI / 2;
      this.cardGroup.add(claspMesh);

      this.scene.add(this.cardGroup);

      // 7. Interactive Controls (Mouse/Touch Drag)
      this.setupInteraction();

      // 8. Start Loop
      this.animate();
    }

    createFrontCanvas(event, user) {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 740;
      const ctx = c.getContext('2d');

      // Dark Cyber Background
      ctx.fillStyle = '#0f141d';
      ctx.fillRect(0, 0, 512, 740);

      // Neo Frame Border
      ctx.lineWidth = 14;
      ctx.strokeStyle = '#121212';
      ctx.strokeRect(7, 7, 498, 726);

      // Top Header Strip (Holographic Gradient)
      const grad = ctx.createLinearGradient(0, 0, 512, 0);
      grad.addColorStop(0, '#ff3366');
      grad.addColorStop(0.5, '#7000ff');
      grad.addColorStop(1, '#00f0ff');
      ctx.fillStyle = grad;
      ctx.fillRect(14, 14, 484, 100);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px "Space Grotesk", sans-serif';
      ctx.fillText('UPGRAD SCHOOL OF TECHNOLOGY', 32, 54);

      ctx.font = '800 16px "JetBrains Mono", monospace';
      ctx.fillStyle = '#ffe600';
      ctx.fillText('OFFICIAL HACKER PASS • 2026', 32, 86);

      // Attendee Badge Name
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 34px "Space Grotesk", sans-serif';
      ctx.fillText(user.name.toUpperCase(), 32, 165);

      ctx.fillStyle = '#00f0ff';
      ctx.font = '800 16px "JetBrains Mono", monospace';
      ctx.fillText(`ID: ${user.studentId || 'UGSOT-MEMBER'}`, 32, 198);

      // Event Info Box
      ctx.fillStyle = '#182232';
      ctx.fillRect(32, 225, 448, 140);
      ctx.strokeStyle = '#2d3748';
      ctx.lineWidth = 2;
      ctx.strokeRect(32, 225, 448, 140);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px "JetBrains Mono", monospace';
      ctx.fillText('EVENT REGISTRATION', 48, 255);

      ctx.fillStyle = '#ffe600';
      ctx.font = 'bold 20px "Space Grotesk", sans-serif';
      const eventTitle = event.title.length > 28 ? event.title.substring(0, 26) + '...' : event.title;
      ctx.fillText(eventTitle, 48, 290);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '14px sans-serif';
      ctx.fillText(new Date(event.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), 48, 325);
      ctx.fillText(event.venue.split(',')[0], 48, 348);

      // Dev XP Pill
      ctx.fillStyle = '#05ffa1';
      ctx.fillRect(32, 385, 180, 42);
      ctx.fillStyle = '#121212';
      ctx.font = '900 16px "JetBrains Mono", monospace';
      ctx.fillText('+150 DEV XP AWARDED', 42, 412);

      // High-Contrast QR Pattern Matrix
      const qrSize = 180;
      const qrX = 166;
      const qrY = 460;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(qrX, qrY, qrSize, qrSize);
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#121212';
      ctx.strokeRect(qrX, qrY, qrSize, qrSize);

      ctx.fillStyle = '#121212';
      // Finders
      ctx.fillRect(qrX + 10, qrY + 10, 45, 45);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(qrX + 20, qrY + 20, 25, 25);
      ctx.fillStyle = '#121212';
      ctx.fillRect(qrX + 26, qrY + 26, 13, 13);

      ctx.fillRect(qrX + 125, qrY + 10, 45, 45);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(qrX + 135, qrY + 20, 25, 25);
      ctx.fillStyle = '#121212';
      ctx.fillRect(qrX + 141, qrY + 26, 13, 13);

      ctx.fillRect(qrX + 10, qrY + 125, 45, 45);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(qrX + 20, qrY + 135, 25, 25);
      ctx.fillStyle = '#121212';
      ctx.fillRect(qrX + 26, qrY + 141, 13, 13);

      // Random Matrix Blocks
      for (let r = 0; r < 9; r++) {
        for (let col = 0; col < 9; col++) {
          if ((r < 3 && col < 3) || (r < 3 && col > 5) || (r > 5 && col < 3)) continue;
          if ((r + col) % 2 === 0 || (r * col) % 3 === 0) {
            ctx.fillRect(qrX + 15 + col * 17, qrY + 15 + r * 17, 12, 12);
          }
        }
      }

      // Hash footer
      const hashStr = 'HASH: ' + Math.abs(event.id.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0)).toString(16).toUpperCase();
      ctx.fillStyle = '#ff3366';
      ctx.font = '800 15px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(hashStr, 256, 680);
      ctx.textAlign = 'left';

      return c;
    }

    createBackCanvas() {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 740;
      const ctx = c.getContext('2d');

      // Brushed Dark Metallic Back
      ctx.fillStyle = '#0a0d14';
      ctx.fillRect(0, 0, 512, 740);

      // Outer Edge
      ctx.lineWidth = 14;
      ctx.strokeStyle = '#121212';
      ctx.strokeRect(7, 7, 498, 726);

      // Circuit Trace Lines
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(40, 80); ctx.lineTo(200, 80); ctx.lineTo(250, 130); ctx.lineTo(470, 130);
      ctx.moveTo(470, 200); ctx.lineTo(300, 200); ctx.lineTo(260, 240); ctx.lineTo(40, 240);
      ctx.moveTo(40, 520); ctx.lineTo(220, 520); ctx.lineTo(260, 560); ctx.lineTo(470, 560);
      ctx.stroke();

      // Big UGSOT Seal in Center
      ctx.strokeStyle = '#ffe600';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(256, 370, 110, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#ffe600';
      ctx.font = '900 28px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('UGSOT', 256, 355);

      ctx.font = '800 14px "JetBrains Mono", monospace';
      ctx.fillStyle = '#05ffa1';
      ctx.fillText('SECURITY SEAL', 256, 385);
      ctx.fillText('CRYPTOGRAPHIC PASS', 256, 405);

      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('CLIENT-SIDE WEBGL VERIFIED', 256, 640);
      ctx.fillText('VALID FOR CAMPUS LAB & SUMMIT ENTRY', 256, 665);
      ctx.textAlign = 'left';

      return c;
    }

    setupInteraction() {
      const onDown = (e) => {
        this.isDragging = true;
        this.previousMousePosition = {
          x: e.clientX || (e.touches && e.touches[0].clientX) || 0,
          y: e.clientY || (e.touches && e.touches[0].clientY) || 0
        };
      };

      const onMove = (e) => {
        if (!this.isDragging || !this.cardGroup) return;

        const currentX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
        const currentY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

        const deltaX = currentX - this.previousMousePosition.x;
        const deltaY = currentY - this.previousMousePosition.y;

        this.targetRotation.y += deltaX * 0.015;
        this.targetRotation.x += deltaY * 0.015;

        this.previousMousePosition = { x: currentX, y: currentY };
      };

      const onUp = () => {
        this.isDragging = false;
      };

      this.canvas.addEventListener('mousedown', onDown);
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);

      this.canvas.addEventListener('touchstart', onDown, { passive: true });
      window.addEventListener('touchmove', onMove, { passive: true });
      window.addEventListener('touchend', onUp);
    }

    animate() {
      this.animId = requestAnimationFrame(() => this.animate());

      if (this.cardGroup) {
        // Auto-wobble when not dragged
        if (!this.isDragging) {
          this.targetRotation.y += 0.006;
        }

        // Damping Lerp
        this.cardGroup.rotation.y += (this.targetRotation.y - this.cardGroup.rotation.y) * 0.1;
        this.cardGroup.rotation.x += (this.targetRotation.x - this.cardGroup.rotation.x) * 0.1;

        // Gentle vertical floating bob
        this.cardGroup.position.y = Math.sin(Date.now() * 0.002) * 0.08;
      }

      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    }

    destroy() {
      if (this.animId) {
        cancelAnimationFrame(this.animId);
        this.animId = null;
      }

      if (this.frontTexture) {
        this.frontTexture.dispose();
        this.frontTexture = null;
      }

      if (this.backTexture) {
        this.backTexture.dispose();
        this.backTexture = null;
      }

      if (this.renderer) {
        this.renderer.dispose();
        this.renderer = null;
      }
    }
  }

  // Export
  window.threePassViewer = new ThreePassViewer();
})();
