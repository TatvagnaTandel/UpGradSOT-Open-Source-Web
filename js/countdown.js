/**
 * upGrad School of Technology - Open Source Events
 * High-Precision Multi-Unit Countdown Timer Engine
 * Tracks: Weeks, Days, Hours, Minutes, Seconds
 */

class CountdownEngine {
  constructor() {
    this.targetEvent = null;
    this.timerInterval = null;
    this.prevValues = { weeks: null, days: null, hours: null, minutes: null, seconds: null };
  }

  init() {
    this.targetEvent = window.clubStore.getFlagshipEvent();
    this.renderEventBannerDetails();
    this.start();
  }

  setTargetEvent(event) {
    if (!event) return;
    this.targetEvent = event;
    this.renderEventBannerDetails();
    this.update();
  }

  renderEventBannerDetails() {
    if (!this.targetEvent) return;
    
    const titleEl = document.getElementById('countdown-event-title');
    const subtitleEl = document.getElementById('countdown-event-subtitle');
    const venueEl = document.getElementById('countdown-event-venue');
    const dateBadgeEl = document.getElementById('countdown-event-date');
    const rsvpBtn = document.getElementById('countdown-rsvp-btn');
    const liveBadge = document.getElementById('countdown-live-badge');

    const isOngoing = this.targetEvent.isOngoing || this.targetEvent.status === 'ongoing';
    if (liveBadge) {
      if (isOngoing) {
        liveBadge.textContent = '🔴 ONGOING EVENT';
        liveBadge.className = 'badge-live-pulse';
      } else {
        liveBadge.textContent = '⚡ NEXT UPCOMING EVENT';
        liveBadge.className = 'badge-upcoming';
      }
    }

    if (titleEl) titleEl.textContent = this.targetEvent.title;
    if (subtitleEl) subtitleEl.textContent = this.targetEvent.description || this.targetEvent.subtitle;
    if (venueEl) venueEl.innerHTML = `<span class="icon">📍</span> ${this.targetEvent.venue}`;
    
    if (dateBadgeEl) {
      if (this.targetEvent.dateBadge) {
        dateBadgeEl.textContent = this.targetEvent.dateBadge;
      } else {
        const dateObj = new Date(this.targetEvent.targetDate);
        dateBadgeEl.textContent = dateObj.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    }

    if (rsvpBtn) {
      const user = window.clubStore.getCurrentUser();
      const isRsvpd = user && user.rsvps && user.rsvps.includes(this.targetEvent.id);
      rsvpBtn.innerHTML = isRsvpd ? `✓ You're In (Hacker Pass)` : (isOngoing ? `⚡ Register / Join Repo Now` : `⚡ Claim Your Spot Now`);
      rsvpBtn.className = isRsvpd ? 'btn btn-glow-success' : 'btn btn-glow-primary';
      rsvpBtn.onclick = () => {
        if (window.eventsManager) {
          window.eventsManager.handleRsvpClick(this.targetEvent.id);
        }
      };
    }

    const officialLinkEl = document.getElementById('countdown-official-link');
    if (officialLinkEl) {
      const targetUrl = this.targetEvent.registrationUrl || this.targetEvent.officialUrl;
      if (targetUrl) {
        officialLinkEl.href = targetUrl;
        officialLinkEl.style.display = 'inline-flex';
        officialLinkEl.textContent = this.targetEvent.registrationUrl ? 'Official MLH Registration ↗' : 'Official Program Site ↗';
      } else {
        officialLinkEl.style.display = 'none';
      }
    }
  }

  start() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.update();
    this.timerInterval = setInterval(() => this.update(), 1000);
  }

  stop() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  update() {
    if (!this.targetEvent) return;

    const isOngoing = this.targetEvent.isOngoing || this.targetEvent.status === 'ongoing';
    // For ongoing events, countdown to conclusion (endDate), or targetDate
    const countdownTarget = (isOngoing && this.targetEvent.endDate)
      ? new Date(this.targetEvent.endDate).getTime()
      : new Date(this.targetEvent.targetDate).getTime();

    const nowTime = Date.now();
    const diff = countdownTarget - nowTime;

    const liveBadge = document.getElementById('countdown-live-badge');

    if (diff <= 0) {
      this.displayZero();
      if (liveBadge) {
        liveBadge.textContent = isOngoing ? '🏁 EVENT CONCLUDED' : '🔴 LIVE RIGHT NOW';
        liveBadge.className = 'badge-live-pulse';
      }
      return;
    }

    if (liveBadge) {
      if (isOngoing) {
        liveBadge.textContent = '🔴 ONGOING EVENT';
        liveBadge.className = 'badge-live-pulse';
      } else {
        liveBadge.textContent = '⚡ NEXT UPCOMING EVENT';
        liveBadge.className = 'badge-upcoming';
      }
    }

    const MS_PER_SEC = 1000;
    const MS_PER_MIN = MS_PER_SEC * 60;
    const MS_PER_HOUR = MS_PER_MIN * 60;
    const MS_PER_DAY = MS_PER_HOUR * 24;
    const MS_PER_WEEK = MS_PER_DAY * 7;

    const weeks = Math.floor(diff / MS_PER_WEEK);
    const days = Math.floor((diff % MS_PER_WEEK) / MS_PER_DAY);
    const hours = Math.floor((diff % MS_PER_DAY) / MS_PER_HOUR);
    const minutes = Math.floor((diff % MS_PER_HOUR) / MS_PER_MIN);
    const seconds = Math.floor((diff % MS_PER_MIN) / MS_PER_SEC);

    this.animateValue('timer-weeks', weeks, 'weeks');
    this.animateValue('timer-days', days, 'days');
    this.animateValue('timer-hours', hours, 'hours');
    this.animateValue('timer-minutes', minutes, 'minutes');
    this.animateValue('timer-seconds', seconds, 'seconds');
  }

  animateValue(elementId, val, unitKey) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const formatted = String(val).padStart(2, '0');
    if (this.prevValues[unitKey] !== val) {
      el.textContent = formatted;
      el.classList.remove('tick-pulse');
      // trigger reflow
      void el.offsetWidth;
      el.classList.add('tick-pulse');
      this.prevValues[unitKey] = val;
    }
  }

  displayZero() {
    ['timer-weeks', 'timer-days', 'timer-hours', 'timer-minutes', 'timer-seconds'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '00';
    });
  }
}

window.countdownEngine = new CountdownEngine();
