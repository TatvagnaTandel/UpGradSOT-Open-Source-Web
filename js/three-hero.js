/**
 * upGrad School of Technology — Open Source Events
 * Three.js WebGL Interactive 3D Hero Scene
 */

(function () {
  'use strict';

  class ThreeHeroScene {
    constructor() {
      this.container = document.getElementById('three-hero-canvas-container');
      this.canvas = document.getElementById('three-hero-canvas');
      this.hudStatus = document.getElementById('three-hud-status');
      this.hudFps = document.getElementById('three-hud-fps');

      if (!this.container || !this.canvas) return;

      // Check Three.js availability
      if (typeof THREE === 'undefined') {
        console.warn('[ThreeHeroScene] Three.js is not loaded.');
        return;
      }

      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.clock = new THREE.Clock();

      this.centerGroup = null;
      this.cubes = [];
      this.rings = [];
      this.particles = null;
      this.gridPlane = null;

      this.mouseX = 0;
      this.mouseY = 0;
      this.targetCameraX = 0;
      this.targetCameraY = 1;
      this.isAutoSpin = true;
      this.renderMode = 'solid'; // 'solid' | 'wireframe' | 'particles'
      this.animId = null;
      this.isIntersecting = true;

      this.raycaster = new THREE.Raycaster();
      this.mouseVec = new THREE.Vector2(-999, -999);
      this.hoveredCube = null;

      this.init();
    }

    init() {
      // 1. Scene
      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.FogExp2(0x0f131a, 0.035);

      // 2. Camera
      const aspect = this.container.clientWidth / this.container.clientHeight;
      this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
      this.camera.position.set(0, 1.2, 9);

      // 3. Renderer
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // 4. Lighting
      this.setupLighting();

      // 5. 3D Meshes & Geometry
      this.createCenterpiece();
      this.createSatelliteCubes();
      this.createOrbitalRings();
      this.createGridFloor();
      this.createParticleCloud();

      // 6. Event Listeners
      this.setupEvents();
      this.setupHudControls();

      // 7. Observer to pause when off-screen
      this.setupIntersectionObserver();

      // 8. Start loop
      this.animate();
    }

    setupLighting() {
      // Soft ambient fill
      const ambientLight = new THREE.AmbientLight(0x3b82f6, 0.7);
      this.scene.add(ambientLight);

      // Main directional light
      const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
      dirLight.position.set(12, 18, 12);
      this.scene.add(dirLight);

      // Neon Pink Point Light
      const pinkPoint = new THREE.PointLight(0xff3366, 2.5, 20);
      pinkPoint.position.set(-8, 3, 5);
      this.scene.add(pinkPoint);

      // Neon Cyan Point Light
      const cyanPoint = new THREE.PointLight(0x00f0ff, 2.8, 20);
      cyanPoint.position.set(8, -2, 6);
      this.scene.add(cyanPoint);

      // Yellow Dev Light
      const yellowPoint = new THREE.PointLight(0xffe600, 1.8, 15);
      yellowPoint.position.set(0, 6, 2);
      this.scene.add(yellowPoint);
    }

    createCenterpiece() {
      this.centerGroup = new THREE.Group();

      // Outer Wireframe Icosahedron
      const icoGeo = new THREE.IcosahedronGeometry(2.1, 0);
      const icoMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        wireframe: true,
        transparent: true,
        opacity: 0.85
      });
      this.icoMesh = new THREE.Mesh(icoGeo, icoMat);
      this.centerGroup.add(this.icoMesh);

      // Inner Faceted Core
      const coreGeo = new THREE.IcosahedronGeometry(1.4, 0);
      const coreMat = new THREE.MeshPhongMaterial({
        color: 0xff3366,
        emissive: 0x330011,
        shininess: 90,
        flatShading: true,
        transparent: true,
        opacity: 0.8
      });
      this.coreMesh = new THREE.Mesh(coreGeo, coreMat);
      this.centerGroup.add(this.coreMesh);

      // Glowing Center Seed
      const seedGeo = new THREE.OctahedronGeometry(0.7, 0);
      const seedMat = new THREE.MeshBasicMaterial({
        color: 0xffe600,
        wireframe: false
      });
      this.seedMesh = new THREE.Mesh(seedGeo, seedMat);
      this.centerGroup.add(this.seedMesh);

      this.scene.add(this.centerGroup);
    }

    createSatelliteCubes() {
      // 6 Floating Neo-Brutalist Cubes with bold outlines
      const cubeData = [
        { name: 'DEV XP ENGINE', color: 0xffe600, pos: [-3.8, 1.8, 0.5], size: 0.75, speed: 0.8 },
        { name: 'HACKTOBERFEST HUBS', color: 0xff3366, pos: [3.6, 2.0, -0.5], size: 0.85, speed: 1.1 },
        { name: 'ETHINDIA 2026', color: 0x00f0ff, pos: [-3.5, -1.6, 1.2], size: 0.7, speed: 0.9 },
        { name: 'OPEN SOURCE 27', color: 0x05ffa1, pos: [3.4, -1.4, 0.8], size: 0.8, speed: 1.0 },
        { name: 'CANVAS QR PASS', color: 0xc084fc, pos: [0.2, 3.2, -1.0], size: 0.65, speed: 1.2 },
        { name: 'WEB AUDIO SYNTH', color: 0xff6b4a, pos: [-0.3, -2.6, 0.3], size: 0.7, speed: 0.75 }
      ];

      cubeData.forEach((data) => {
        const group = new THREE.Group();
        group.position.set(...data.pos);
        group.userData = {
          name: data.name,
          basePos: new THREE.Vector3(...data.pos),
          speed: data.speed,
          baseScale: 1.0,
          color: data.color
        };

        // Solid Box
        const boxGeo = new THREE.BoxGeometry(data.size, data.size, data.size);
        const boxMat = new THREE.MeshPhongMaterial({
          color: data.color,
          emissive: 0x111111,
          shininess: 60,
          flatShading: true
        });
        const boxMesh = new THREE.Mesh(boxGeo, boxMat);
        group.add(boxMesh);

        // Neo-Brutalist Black Edge Lines
        const edgesGeo = new THREE.EdgesGeometry(boxGeo);
        const edgesMat = new THREE.LineBasicMaterial({
          color: 0x000000,
          linewidth: 2.5
        });
        const edges = new THREE.LineSegments(edgesGeo, edgesMat);
        group.add(edges);

        this.cubes.push(group);
        this.scene.add(group);
      });
    }

    createOrbitalRings() {
      const ringMat1 = new THREE.MeshBasicMaterial({
        color: 0xff3366,
        wireframe: true,
        transparent: true,
        opacity: 0.55
      });
      const ringMat2 = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        wireframe: true,
        transparent: true,
        opacity: 0.45
      });

      const ringGeo1 = new THREE.TorusGeometry(3.2, 0.03, 8, 48);
      const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
      ring1.rotation.x = Math.PI / 3;
      ring1.rotation.y = Math.PI / 6;
      this.rings.push(ring1);
      this.scene.add(ring1);

      const ringGeo2 = new THREE.TorusGeometry(3.7, 0.03, 8, 48);
      const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
      ring2.rotation.x = -Math.PI / 4;
      ring2.rotation.z = Math.PI / 4;
      this.rings.push(ring2);
      this.scene.add(ring2);
    }

    createGridFloor() {
      // Perspective Cyber Grid Plane
      const size = 32;
      const divisions = 24;
      this.gridPlane = new THREE.GridHelper(size, divisions, 0x00f0ff, 0x252c38);
      this.gridPlane.position.y = -3.8;
      this.scene.add(this.gridPlane);
    }

    createParticleCloud() {
      const count = 180;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);

      const palette = [
        new THREE.Color(0x00f0ff),
        new THREE.Color(0xff3366),
        new THREE.Color(0xffe600),
        new THREE.Color(0x05ffa1),
        new THREE.Color(0xc084fc)
      ];

      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 18;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 12;

        const color = palette[Math.floor(Math.random() * palette.length)];
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
      }

      const particleGeo = new THREE.BufferGeometry();
      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const particleMat = new THREE.PointsMaterial({
        size: 0.12,
        vertexColors: true,
        transparent: true,
        opacity: 0.85
      });

      this.particles = new THREE.Points(particleGeo, particleMat);
      this.scene.add(this.particles);
    }

    setupEvents() {
      // Mouse Parallax & Raycasting
      const onMouseMove = (e) => {
        const rect = this.container.getBoundingClientRect();
        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;

        this.mouseX = (clientX / rect.width) * 2 - 1;
        this.mouseY = -(clientY / rect.height) * 2 + 1;

        this.mouseVec.x = this.mouseX;
        this.mouseVec.y = this.mouseY;

        this.targetCameraX = this.mouseX * 1.8;
        this.targetCameraY = 1.2 + this.mouseY * 0.9;
      };

      this.container.addEventListener('mousemove', onMouseMove);

      // Click on 3D Cubes
      this.container.addEventListener('click', () => {
        if (this.hoveredCube) {
          const name = this.hoveredCube.userData.name;
          if (this.hudStatus) {
            this.hudStatus.textContent = `SELECTED: [${name}]`;
          }

          // GSAP scale burst if available
          if (typeof gsap !== 'undefined') {
            gsap.to(this.hoveredCube.scale, {
              x: 1.6,
              y: 1.6,
              z: 1.6,
              duration: 0.25,
              yoyo: true,
              repeat: 1,
              ease: 'back.out(2)'
            });
          }

          // Trigger sound if WebAudio Synth available
          if (window.app && typeof window.app.playBeep === 'function') {
            window.app.playBeep(660, 'sine', 0.15);
          }
        }
      });

      // Window Resize
      window.addEventListener('resize', () => {
        if (!this.container || !this.renderer || !this.camera) return;
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
      });
    }

    setupHudControls() {
      const modeBtn = document.getElementById('three-btn-mode');
      const spinBtn = document.getElementById('three-btn-spin');
      const resetBtn = document.getElementById('three-btn-reset');

      if (modeBtn) {
        modeBtn.addEventListener('click', () => {
          this.cycleRenderMode();
        });
      }

      if (spinBtn) {
        spinBtn.addEventListener('click', () => {
          this.isAutoSpin = !this.isAutoSpin;
          spinBtn.classList.toggle('active', !this.isAutoSpin);
          spinBtn.textContent = this.isAutoSpin ? 'AUTO: ON' : 'AUTO: OFF';
        });
      }

      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          this.targetCameraX = 0;
          this.targetCameraY = 1.2;
          this.camera.position.set(0, 1.2, 9);
          this.mouseX = 0;
          this.mouseY = 0;
          if (this.hudStatus) {
            this.hudStatus.textContent = 'SYSTEM READY: 3D ENGINE ONLINE';
          }
        });
      }
    }

    cycleRenderMode() {
      const modes = ['solid', 'wireframe', 'particles'];
      const currentIndex = modes.indexOf(this.renderMode);
      this.renderMode = modes[(currentIndex + 1) % modes.length];

      const modeBtn = document.getElementById('three-btn-mode');
      if (modeBtn) {
        modeBtn.textContent = `MODE: ${this.renderMode.toUpperCase()}`;
      }

      const isWire = this.renderMode === 'wireframe';
      const isPart = this.renderMode === 'particles';

      if (this.icoMesh) this.icoMesh.visible = !isPart;
      if (this.coreMesh) {
        this.coreMesh.material.wireframe = isWire;
        this.coreMesh.visible = !isPart;
      }
      if (this.seedMesh) {
        this.seedMesh.material.wireframe = isWire;
      }

      this.cubes.forEach((cube) => {
        cube.children.forEach((child) => {
          if (child.isMesh) {
            child.material.wireframe = isWire;
            child.visible = !isPart;
          }
        });
      });

      if (this.particles) {
        this.particles.material.size = isPart ? 0.24 : 0.12;
      }
    }

    setupIntersectionObserver() {
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              this.isIntersecting = entry.isIntersecting;
            });
          },
          { threshold: 0.05 }
        );
        observer.observe(this.container);
      }
    }

    animate() {
      this.animId = requestAnimationFrame(() => this.animate());

      if (!this.isIntersecting) return;

      const delta = this.clock.getDelta();
      const time = this.clock.getElapsedTime();

      // Camera Smooth Lerp to mouse target
      this.camera.position.x += (this.targetCameraX - this.camera.position.x) * 0.05;
      this.camera.position.y += (this.targetCameraY - this.camera.position.y) * 0.05;
      this.camera.lookAt(0, 0, 0);

      // Rotate Centerpiece
      if (this.centerGroup && this.isAutoSpin) {
        this.centerGroup.rotation.y += delta * 0.45;
        this.centerGroup.rotation.x += delta * 0.2;

        if (this.seedMesh) {
          this.seedMesh.rotation.y -= delta * 0.9;
        }
      }

      // Orbit and bob satellite cubes
      this.cubes.forEach((cube, index) => {
        const base = cube.userData.basePos;
        const speed = cube.userData.speed;

        if (this.isAutoSpin) {
          cube.rotation.x += delta * 0.6 * speed;
          cube.rotation.y += delta * 0.8 * speed;
        }

        // Float bobbing
        cube.position.y = base.y + Math.sin(time * speed + index) * 0.35;
        cube.position.x = base.x + Math.cos(time * 0.5 * speed + index) * 0.15;
      });

      // Rotate Orbital Rings
      this.rings.forEach((ring, idx) => {
        if (this.isAutoSpin) {
          ring.rotation.z += delta * (idx === 0 ? 0.3 : -0.25);
        }
      });

      // Particle Drift
      if (this.particles) {
        this.particles.rotation.y += delta * 0.08;
      }

      // Subtle Grid Ripple
      if (this.gridPlane) {
        this.gridPlane.rotation.y = Math.sin(time * 0.2) * 0.05;
      }

      // Raycasting for Hover Detection
      this.checkRaycast();

      // Render
      this.renderer.render(this.scene, this.camera);
    }

    checkRaycast() {
      if (!this.camera || !this.cubes.length) return;

      this.raycaster.setFromCamera(this.mouseVec, this.camera);
      const meshesToTest = [];
      this.cubes.forEach((group) => {
        group.children.forEach((c) => {
          if (c.isMesh) meshesToTest.push(c);
        });
      });

      const intersects = this.raycaster.intersectObjects(meshesToTest);

      if (intersects.length > 0) {
        const hitGroup = intersects[0].object.parent;
        if (this.hoveredCube !== hitGroup) {
          // Reset previous
          if (this.hoveredCube) {
            this.scaleCube(this.hoveredCube, 1.0);
          }
          this.hoveredCube = hitGroup;
          this.scaleCube(this.hoveredCube, 1.3);

          if (this.hudStatus) {
            this.hudStatus.textContent = `TARGET: ${hitGroup.userData.name} [READY]`;
          }
        }
      } else {
        if (this.hoveredCube) {
          this.scaleCube(this.hoveredCube, 1.0);
          this.hoveredCube = null;
          if (this.hudStatus) {
            this.hudStatus.textContent = 'EXPLORE 3D SCENE: HOVER OR DRAG MESHES';
          }
        }
      }
    }

    scaleCube(group, targetScale) {
      if (typeof gsap !== 'undefined') {
        gsap.to(group.scale, {
          x: targetScale,
          y: targetScale,
          z: targetScale,
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        group.scale.set(targetScale, targetScale, targetScale);
      }
    }
  }

  // Export & Auto-Initialize
  window.ThreeHeroScene = ThreeHeroScene;

  document.addEventListener('DOMContentLoaded', () => {
    // Initialize if container exists
    if (document.getElementById('three-hero-canvas-container')) {
      window.threeHeroScene = new ThreeHeroScene();
    }
  });
})();
