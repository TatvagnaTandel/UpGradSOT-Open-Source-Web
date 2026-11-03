/** Site-wide motion, using the browser animation API with visible-by-default content. */
(function () {
  'use strict';
  const REVEALS = [
    '.hero-pill-badge', '.hero-title', '.hero-description', '.hero-cta-group',
    '.section-header', '.admin-top-bar', '.events-filter-bar', '.table-toolbar',
    '.countdown-container-card', '.gateway-card', '.event-card', '.fest-card',
    '.manifesto-card', '.leaderboard-item', '.podium-card', '.metric-card',
    '.faq-card', '.terminal-window', '.lab-figure', '.three-lab-sidebar',
    '.table-responsive-container'
  ].join(',');
  class GsapEffectsEngine {
    constructor() {
      this.media = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.seen = new WeakSet();
      this.pending = new Set();
      this.active = new Map();
      this.listeners = [];
      this.observers = [];
      if (typeof IntersectionObserver !== 'undefined') {
        this.reveals = new IntersectionObserver(entries => {
          let stagger = 0;
          entries.forEach(entry => {
            if (!entry.isIntersecting || this.media.matches || document.hidden) return;
            this.reveal(entry.target, Math.min(stagger++ * 45, 180));
          });
        }, { threshold: 0.06 });
      }
      // Observe inserted cards as search/filter/admin results are rendered.
      this.dom = new MutationObserver(records => {
        records.forEach(record => {
          record.addedNodes.forEach(node => { if (node.nodeType === 1) this.scan(node); });
        });
        for (const node of this.pending) {
          if (!node.isConnected) { this.pending.delete(node); this.reveals?.unobserve(node); }
        }
        for (const [node] of this.active) if (!node.isConnected) this.cancel(node);
      });
      this.dom.observe(document.body, { childList: true, subtree: true });
      this.bind(this.media, 'change', () => this.syncPreference());
      this.bind(document, 'visibilitychange', () => {
        this.active.forEach(animation => document.hidden ? animation.pause() : animation.play());
        if (!document.hidden) this.scan(document);
      });
      this.bind(document, 'focusin', event => {
        // Never animate a control away from a keyboard user's current focus.
        for (const [node] of this.active) if (node.contains(event.target)) this.cancel(node);
      });
      this.bind(window, 'pagehide', event => { if (!event.persisted) this.destroy(); });
      this.syncPreference();
      this.hookCountdown();
    }
    bind(target, type, listener) {
      target.addEventListener(type, listener);
      this.listeners.push(() => target.removeEventListener(type, listener));
    }
    syncPreference() {
      document.documentElement.dataset.motion = this.media.matches ? 'reduced' : 'full';
      if (this.media.matches) {
        for (const [node] of this.active) this.cancel(node);
        this.pending.clear(); this.reveals?.disconnect();
      } else this.scan(document);
    }
    scan(root) {
      if (this.media.matches || !this.reveals) return;
      const nodes = [...root.querySelectorAll(REVEALS)];
      if (root.nodeType === 1 && root.matches(REVEALS)) nodes.unshift(root);
      nodes.forEach(node => {
        if (!this.seen.has(node) && !this.pending.has(node)) {
          this.pending.add(node); this.reveals.observe(node);
        }
      });
    }
    reveal(node, delay = 0) {
      if (this.seen.has(node)) return;
      this.seen.add(node); this.pending.delete(node); this.reveals?.unobserve(node);
      if (node.contains(document.activeElement)) return;
      this.play(node, [
        { opacity: 0, translate: '0 14px' },
        { opacity: 1, translate: '0 0' }
      ], { duration: 420, delay });
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
      for (const [node] of this.active) this.cancel(node);
      this.reveals?.disconnect(); this.dom.disconnect();
      this.observers.forEach(observer => observer.disconnect());
      this.listeners.forEach(remove => remove()); this.pending.clear();
    }
  }
  // Retain the existing global name and script URL used by every page shell.
  window.GsapEffectsEngine = GsapEffectsEngine;
  document.addEventListener('DOMContentLoaded', () => { window.gsapEffects = new GsapEffectsEngine(); });
})();
