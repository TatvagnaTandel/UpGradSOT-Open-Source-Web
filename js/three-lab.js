/**
 * upGrad School of Technology — Open Source Events
 * Three.js WebGL Interactive Lab Section
 */

(function () {
  'use strict';

  class ThreeLabScene {
    constructor() {
      this.container = document.getElementById('three-lab-canvas-container');
      this.canvas = document.getElementById('three-lab-canvas');

      if (!this.container || !this.canvas) return;
      if (typeof THREE === 'undefined') return;

      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.meshGroup = null;
      this.activeMeshIndex = 0;
      this.meshes = [];

      this.isDragging = false;
      this.previousMousePosition = { x: 0, y: 0 };
      this.targetRotation = { x: 0.3, y: 0.4 };
      this.animId = null;

      this.init();
    }

    init() {
      this.scene = new THREE.Scene();

      const width = this.container.clientWidth;
      const height = this.container.clientHeight;
      this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      this.camera.position.set(0, 0, 7.5);

      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Lighting
      const ambLight = new THREE.AmbientLight(0xffffff, 0.7);
      this.scene.add(ambLight);

      const light1 = new THREE.DirectionalLight(0x00f0ff, 2.2);
      light1.position.set(8, 10, 8);
      this.scene.add(light1);

      const light2 = new THREE.DirectionalLight(0xff3366, 2.0);
      light2.position.set(-8, -6, 6);
      this.scene.add(light2);

      const light3 = new THREE.PointLight(0xffe600, 2.5, 15);
      light3.position.set(0, 0, 4);
      this.scene.add(light3);

      this.meshGroup = new THREE.Group();
      this.scene.add(this.meshGroup);

      // Create 3 selectable showcase geometries:
      // 1. Torus Knot (Dev Infinity)
      const knotGeo = new THREE.TorusKnotGeometry(1.6, 0.45, 100, 16);
      const knotMat = new THREE.MeshPhongMaterial({
        color: 0x00f0ff,
        emissive: 0x002244,
        shininess: 100,
        wireframe: false
      });
      const knotMesh = new THREE.Mesh(knotGeo, knotMat);
      this.meshes.push(knotMesh);

      // 2. Dodecahedron Trophy (XP Master)
      const dodecaGeo = new THREE.DodecahedronGeometry(2.1, 0);
      const dodecaMat = new THREE.MeshPhongMaterial({
        color: 0xffe600,
        emissive: 0x332200,
        shininess: 80,
        flatShading: true
      });
      const dodecaMesh = new THREE.Mesh(dodecaGeo, dodecaMat);
      this.meshes.push(dodecaMesh);

      // 3. Icosahedron Matrix (Open Source Universe)
      const icoGeo = new THREE.IcosahedronGeometry(2.2, 1);
      const icoMat = new THREE.MeshStandardMaterial({
        color: 0xff3366,
        roughness: 0.2,
        metalness: 0.8,
        wireframe: true
      });
      const icoMesh = new THREE.Mesh(icoGeo, icoMat);
      this.meshes.push(icoMesh);

      // Show first mesh
      this.meshGroup.add(this.meshes[0]);

      // Wireframe background sphere
      const bgSphereGeo = new THREE.SphereGeometry(15, 16, 16);
      const bgSphereMat = new THREE.MeshBasicMaterial({
        color: 0x1f2937,
        wireframe: true,
        transparent: true,
        opacity: 0.2
      });
      const bgSphere = new THREE.Mesh(bgSphereGeo, bgSphereMat);
      this.scene.add(bgSphere);

      this.setupInteraction();
      this.animate();
    }

    cycleGeometry() {
      if (!this.meshes.length || !this.meshGroup) return;

      const currentMesh = this.meshes[this.activeMeshIndex];
      this.meshGroup.remove(currentMesh);

      this.activeMeshIndex = (this.activeMeshIndex + 1) % this.meshes.length;
      const nextMesh = this.meshes[this.activeMeshIndex];
      this.meshGroup.add(nextMesh);

      // GSAP spin burst on switch
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(
          nextMesh.scale,
          { x: 0.4, y: 0.4, z: 0.4 },
          { x: 1, y: 1, z: 1, duration: 0.5, ease: 'back.out(2)' }
        );
      }
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
        if (!this.isDragging || !this.meshGroup) return;

        const currentX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
        const currentY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

        const deltaX = currentX - this.previousMousePosition.x;
        const deltaY = currentY - this.previousMousePosition.y;

        this.targetRotation.y += deltaX * 0.012;
        this.targetRotation.x += deltaY * 0.012;

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

      window.addEventListener('resize', () => {
        if (!this.container || !this.renderer || !this.camera) return;
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
      });
    }

    animate() {
      this.animId = requestAnimationFrame(() => this.animate());

      if (this.meshGroup) {
        if (!this.isDragging) {
          this.targetRotation.y += 0.008;
          this.targetRotation.x += 0.004;
        }

        this.meshGroup.rotation.y += (this.targetRotation.y - this.meshGroup.rotation.y) * 0.08;
        this.meshGroup.rotation.x += (this.targetRotation.x - this.meshGroup.rotation.x) * 0.08;
      }

      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    }
  }

  // Export & Auto-Initialize
  window.ThreeLabScene = ThreeLabScene;

  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('three-lab-canvas-container')) {
      window.threeLabScene = new ThreeLabScene();
    }
  });
})();
