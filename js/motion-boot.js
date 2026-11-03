/** Install the reveal gate before the first paint; fail open if startup fails. */
(function () {
  'use strict';
  window.portalRevealSelectors = [
    '.hero-webgl-wrapper', '.section-header', '.events-filter-bar', '.table-toolbar',
    '.countdown-container-card', '.gateway-card', '.event-card', '.fest-card',
    '.bento-box', '.leaderboard-item', '.podium-card', '.metric-card',
    '.lab-figure', '.three-lab-sidebar', '.table-responsive-container'
  ].join(',');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      typeof window.requestAnimationFrame !== 'function') return;
  const root = document.documentElement;
  root.dataset.revealBoot = 'pending';
  const style = document.createElement('style');
  style.textContent = 'html[data-reveal-boot="pending"] :is(' + window.portalRevealSelectors + ') { opacity: 0; }';
  document.head.appendChild(style);
  window.setTimeout(() => { delete root.dataset.revealBoot; style.remove(); }, 2500);
})();
