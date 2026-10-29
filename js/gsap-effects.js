/**
 * upGrad School of Technology — Open Source Events
 * GSAP Motion & 3D Perspective Card Physics
 */

(function () {
  'use strict';

  class GsapEffectsEngine {
    constructor() {
      this.isGsapAvailable = typeof gsap !== 'undefined';
      if (!this.isGsapAvailable) {
        console.warn('[GsapEffectsEngine] GSAP is not loaded.');
        return;
      }

      this.init();
    }

    init() {
      this.initHeroEntrance();
      this.init3dCardTilt();
      this.initButtonPhysics();
      this.hookCountdownEngine();
      this.initModalTransitions();
    }

    // 1. Hero Stagger Entrance Choreography
    initHeroEntrance() {
      const hero = document.querySelector('.hero-section');
      if (!hero) return;

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      const badge = hero.querySelector('.hero-pill-badge');
      const title = hero.querySelector('.hero-title');
      const desc = hero.querySelector('.hero-description');
      const btns = hero.querySelectorAll('.hero-cta-group .btn');
      const canvasBox = document.getElementById('three-hero-canvas-container');
      const marquee = document.querySelector('.tech-marquee-wrapper');

      if (badge) {
        tl.fromTo(badge, { scale: 0.8, opacity: 0, y: -20 }, { scale: 1, opacity: 1, y: 0, duration: 0.5 });
      }

      if (title) {
        tl.fromTo(title, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.25');
      }

      if (desc) {
        tl.fromTo(desc, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.3');
      }

      if (btns && btns.length) {
        tl.fromTo(btns, { y: 15, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.45, ease: 'back.out(1.5)' }, '-=0.2');
      }

      if (canvasBox) {
        tl.fromTo(canvasBox, { scale: 0.95, opacity: 0, y: 30 }, { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.3');
      }

      if (marquee) {
        tl.fromTo(marquee, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.4');
      }
    }

    // 2. Physics-based 3D Perspective Card Tilt
    init3dCardTilt() {
      const tiltSelectors = [
        '.countdown-container-card',
        '.gateway-card',
        '.event-card',
        '.fest-card',
        '.manifesto-card',
        '.stat-card',
        '.leaderboard-rank-card'
      ];

      const cards = document.querySelectorAll(tiltSelectors.join(', '));

      cards.forEach((card) => {
        // Setup card wrapper for 3D perspective
        card.classList.add('gsap-3d-tilt');

        // Add dynamic glare layer if missing
        if (!card.querySelector('.card-glare-overlay')) {
          const glare = document.createElement('div');
          glare.className = 'card-glare-overlay';
          card.style.position = 'relative';
          card.appendChild(glare);
        }

        const glare = card.querySelector('.card-glare-overlay');

        // Mouse move tracking
        const onMouseMove = (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const normX = (x / rect.width - 0.5) * 2; // -1 to 1
          const normY = (y / rect.height - 0.5) * 2; // -1 to 1

          const maxTilt = 10; // degrees
          const rotateY = normX * maxTilt;
          const rotateX = -normY * maxTilt;

          gsap.to(card, {
            rotateY: rotateY,
            rotateX: rotateX,
            transformPerspective: 1000,
            scale: 1.015,
            duration: 0.25,
            ease: 'power2.out'
          });

          if (glare) {
            const glareX = (x / rect.width) * 100;
            const glareY = (y / rect.height) * 100;
            glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 65%)`;
            glare.style.opacity = '1';
          }
        };

        const onMouseLeave = () => {
          gsap.to(card, {
            rotateY: 0,
            rotateX: 0,
            scale: 1,
            duration: 0.6,
            ease: 'elastic.out(1, 0.4)'
          });

          if (glare) {
            glare.style.opacity = '0';
          }
        };

        card.addEventListener('mousemove', onMouseMove);
        card.addEventListener('mouseleave', onMouseLeave);
      });
    }

    // 3. Interactive Button Physics (Subtle Magnetic Pull)
    initButtonPhysics() {
      const buttons = document.querySelectorAll('.btn-primary, .btn-glow-primary, .btn-outline');

      buttons.forEach((btn) => {
        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;

          gsap.to(btn, {
            x: x * 0.15,
            y: y * 0.15,
            duration: 0.2,
            ease: 'power1.out'
          });
        });

        btn.addEventListener('mouseleave', () => {
          gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.4,
            ease: 'elastic.out(1, 0.3)'
          });
        });
      });
    }

    // 4. Hook Countdown Engine for Digit Bounce
    hookCountdownEngine() {
      const prevVals = { weeks: '', days: '', hours: '', mins: '', secs: '' };

      const digitIds = [
        { id: 'timer-weeks', key: 'weeks' },
        { id: 'timer-days', key: 'days' },
        { id: 'timer-hours', key: 'hours' },
        { id: 'timer-minutes', key: 'mins' },
        { id: 'timer-seconds', key: 'secs' }
      ];

      // Mutation Observer on digit boxes
      digitIds.forEach(({ id, key }) => {
        const el = document.getElementById(id);
        if (!el) return;

        el.classList.add('timer-digit', 'gsap-ticking');

        const observer = new MutationObserver(() => {
          const currentVal = el.textContent.trim();
          if (currentVal !== prevVals[key] && prevVals[key] !== '') {
            this.punchDigit(el);
          }
          prevVals[key] = currentVal;
        });

        observer.observe(el, { childList: true, characterData: true, subtree: true });
      });
    }

    punchDigit(element) {
      if (!this.isGsapAvailable || !element) return;

      gsap.fromTo(
        element,
        { scale: 1.25, color: '#ff3366' },
        { scale: 1, color: '', duration: 0.35, ease: 'back.out(2)' }
      );
    }

    // 5. Modal 3D Opening Animation
    initModalTransitions() {
      const modals = document.querySelectorAll('.modal');
      modals.forEach((modal) => {
        const dialog = modal.querySelector('.modal-dialog');
        if (!dialog) return;

        const observer = new MutationObserver((mutations) => {
          mutations.forEach((m) => {
            if (m.attributeName === 'class') {
              const isActive = modal.classList.contains('active');
              if (isActive) {
                gsap.fromTo(
                  dialog,
                  { scale: 0.85, rotateX: 10, y: 30, opacity: 0 },
                  { scale: 1, rotateX: 0, y: 0, opacity: 1, duration: 0.35, ease: 'back.out(1.4)' }
                );
              }
            }
          });
        });

        observer.observe(modal, { attributes: true });
      });
    }
  }

  // Export
  window.GsapEffectsEngine = GsapEffectsEngine;

  document.addEventListener('DOMContentLoaded', () => {
    window.gsapEffects = new GsapEffectsEngine();
  });
})();
