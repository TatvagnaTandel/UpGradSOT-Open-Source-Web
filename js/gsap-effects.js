/** Scroll-distance choreography. No timed autoplay for content reveals. */
(function () {
  'use strict';
  const REVEALS = window.portalRevealSelectors || '[data-scroll-reveal]';
  class GsapEffectsEngine {
    constructor() {
      this.media = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.exempt = new WeakSet();
      this.stages = new Map();
      this.active = new Map();
      this.listeners = [];
      this.observers = [];
      this.frame = null;
      this.destroyed = false;
      this.needsMeasure = false;
      this.dom = new MutationObserver(records => {
        for (const record of records) for (const node of record.addedNodes) {
          if (node.nodeType === 1) this.scan(node);
        }
        for (const [node] of this.stages) if (!node.isConnected) this.expose(node);
        for (const [node] of this.active) if (!node.isConnected) this.cancel(node);
        this.schedule(true);
      });
      this.dom.observe(document.body, { childList: true, subtree: true });
      this.bind(window, 'scroll', () => this.schedule());
      this.bind(window, 'resize', () => this.schedule(true));
      this.bind(window, 'load', () => this.schedule(true));
      this.bind(document, 'click', () => this.schedule(true));
      this.bind(this.media, 'change', () => this.syncPreference());
      this.bind(document, 'visibilitychange', () => {
        this.active.forEach(animation => document.hidden ? animation.pause() : animation.play());
        if (!document.hidden) this.schedule(true);
      });
      this.bind(document, 'focusin', event => {
        for (const [node] of this.stages) if (node.contains(event.target)) this.expose(node);
        for (const [node] of this.active) if (node.contains(event.target)) this.cancel(node);
      });
      this.bind(window, 'pagehide', event => { if (!event.persisted) this.destroy(); });
      this.bind(window, 'pageshow', () => this.schedule(true));
      this.syncPreference();
      // Release pre-paint protection only after every target is staged.
      delete document.documentElement.dataset.revealBoot;
      document.fonts?.ready.then(() => this.schedule(true));
      this.hookCountdown();
    }
    bind(target, type, listener) {
      target.addEventListener(type, listener, { passive: true });
      this.listeners.push(() => target.removeEventListener(type, listener));
    }
    syncPreference() {
      document.documentElement.dataset.motion = this.media.matches ? 'reduced' : 'full';
      if (this.media.matches) {
        if (this.frame !== null) window.cancelAnimationFrame(this.frame);
        this.frame = null;
        for (const [node] of this.active) this.cancel(node);
        for (const [node] of this.stages) this.expose(node, false);
      } else {
        this.scan(document);
        this.measure();
        this.render();
      }
    }
    scan(root) {
      if (this.media.matches || typeof window.requestAnimationFrame !== 'function') return;
      const nodes = [...root.querySelectorAll(REVEALS)];
      if (root.nodeType === 1 && root.matches(REVEALS)) nodes.unshift(root);
      for (const node of nodes) {
        if (this.exempt.has(node) || this.stages.has(node)) continue;
        if (node.closest?.('.modal') || node.parentElement?.closest('.scroll-reveal')) continue;
        const bounds = node.getBoundingClientRect();
        // Keep the opening view and live results fully usable, without autoplay.
        if (bounds.top < window.innerHeight || node.contains(document.activeElement)) {
          this.exempt.add(node);
          continue;
        }
        this.stages.set(node, { top: bounds.top + (window.scrollY || 0), shift: 0 });
        node.classList.add('scroll-reveal');
      }
      this.render();
    }
    measure() {
      // Read layout before writing styles. Subtract our own translation so
      // repeated measurements never drift an element's natural position.
      const positions = [...this.stages].map(([node, stage]) =>
        [stage, node.getBoundingClientRect().top - stage.shift + (window.scrollY || 0)]);
      for (const [stage, top] of positions) stage.top = top;
    }
    schedule(measure = false) {
      this.needsMeasure ||= measure;
      if (this.destroyed || this.media.matches || document.hidden || this.frame !== null ||
          typeof window.requestAnimationFrame !== 'function') return;
      this.frame = window.requestAnimationFrame(() => {
        this.frame = null;
        if (this.needsMeasure) { this.measure(); this.needsMeasure = false; }
        this.render();
      });
    }
    render() {
      if (this.media.matches || document.hidden) return;
      const height = window.innerHeight, scroll = window.scrollY || 0;
      for (const [node, stage] of this.stages) {
        const t = Math.max(0, Math.min(1, (scroll + height * 0.9 - stage.top) / (height * 0.35)));
        const progress = t * t * (3 - 2 * t);
        stage.shift = 48 * (1 - progress);
        node.style.setProperty('--reveal-opacity', progress.toFixed(4));
        node.style.setProperty('--reveal-shift', stage.shift.toFixed(3) + 'px');
        node.classList.toggle('scroll-reveal-pending', progress < 1);
      }
    }
    expose(node, remember = true) {
      this.stages.delete(node);
      if (remember) this.exempt.add(node);
      node.classList.remove('scroll-reveal');
      node.classList.remove('scroll-reveal-pending');
      node.style.removeProperty('--reveal-opacity');
      node.style.removeProperty('--reveal-shift');
    }
    play(node, keyframes, options) {
      if (this.media.matches || document.hidden || typeof node.animate !== 'function') return;
      this.cancel(node);
      const animation = node.animate(keyframes, {
        easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards', ...options
      });
      this.active.set(node, animation);
      const clear = () => { if (this.active.get(node) === animation) this.active.delete(node); };
      animation.addEventListener('finish', clear, { once: true });
      animation.addEventListener('cancel', clear, { once: true });
    }
    cancel(node) {
      this.active.get(node)?.cancel(); this.active.delete(node);
    }
    hookCountdown() {
      document.querySelectorAll('#timer-weeks, #timer-days, #timer-hours, #timer-minutes, #timer-seconds').forEach(node => {
        let previous = node.textContent;
        const observer = new MutationObserver(() => {
          const next = node.textContent;
          const bounds = node.getBoundingClientRect();
          if (next !== previous && bounds.bottom > 0 && bounds.top < window.innerHeight) {
            this.play(node, [{ opacity: 0.35, translate: '0 5px' }, { opacity: 1, translate: '0 0' }], { duration: 180 });
          }
          previous = next;
        });
        observer.observe(node, { childList: true, characterData: true, subtree: true });
        this.observers.push(observer);
      });
    }
    destroy() {
      this.destroyed = true;
      if (this.frame !== null) window.cancelAnimationFrame(this.frame);
      this.frame = null;
      for (const [node] of this.active) this.cancel(node);
      for (const [node] of this.stages) this.expose(node);
      this.dom.disconnect();
      this.observers.forEach(observer => observer.disconnect());
      this.listeners.forEach(remove => remove());
      delete document.documentElement.dataset.revealBoot;
    }
  }
  window.GsapEffectsEngine = GsapEffectsEngine;
  document.addEventListener('DOMContentLoaded', () => { window.gsapEffects = new GsapEffectsEngine(); });
})();
