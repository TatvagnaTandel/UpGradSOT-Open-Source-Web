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
    const pinned = window.clubStore ? window.clubStore.getPinnedEvent() : null;
    this.targetEvent = pinned || (window.clubStore ? window.clubStore.getFlagshipEvent() : null);
    this.renderEventBannerDetails();
    this.start();
  }

  setTargetEvent(event, isUserPin = true) {
    if (!event) return;
    this.targetEvent = event;
    if (isUserPin && window.clubStore) {
      window.clubStore.setPinnedEventId(event.id);
    }
    this.renderEventBannerDetails();
    this.update();
  }

  unpinEvent() {
    if (window.clubStore) {
      window.clubStore.clearPinnedEventId();
      this.targetEvent = window.clubStore.getFlagshipEvent();
      this.renderEventBannerDetails();
      this.update();
      if (window.app && window.app.showToast) {
        window.app.showToast('📌 Unpinned event. Returned to flagship countdown!', 'info');
      }
    }
  }

  renderEventBannerDetails() {
    if (!this.targetEvent) return;
    
    const titleEl = document.getElementById('countdown-event-title');
    const subtitleEl = document.getElementById('countdown-event-subtitle');
    const venueEl = document.getElementById('countdown-event-venue');
    const dateBadgeEl = document.getElementById('countdown-event-date');
    const rsvpBtn = document.getElementById('countdown-rsvp-btn');
    const liveBadge = document.getElementById('countdown-live-badge');
    const unpinBtn = document.getElementById('countdown-unpin-btn');

    const now = new Date();
    const isPast = window.clubStore ? window.clubStore.isEventPast(this.targetEvent, now) : false;
    const isOngoing = window.clubStore ? window.clubStore.isEventOngoing(this.targetEvent, now) : Boolean(this.targetEvent.isOngoing || this.targetEvent.status === 'ongoing');

    const pinnedId = window.clubStore ? window.clubStore.getPinnedEventId() : null;
    const isPinned = Boolean(pinnedId && this.targetEvent && this.targetEvent.id === pinnedId);

    if (liveBadge) {
      if (isPast) {
        liveBadge.textContent = isPinned ? '📌 PINNED (CONCLUDED)' : '🏁 CONCLUDED & ARCHIVED';
        liveBadge.className = 'badge-past';
      } else if (isOngoing) {
        liveBadge.textContent = isPinned ? '📌 PINNED • 🔴 LIVE & ONGOING' : '🔴 LIVE & ONGOING NOW';
        liveBadge.className = 'badge-live-pulse';
      } else if (isPinned) {
        liveBadge.textContent = '📌 PINNED EVENT TRACKER';
        liveBadge.className = 'badge-pinned';
      } else {
        liveBadge.textContent = '⚡ NEXT UPCOMING EVENT';
        liveBadge.className = 'badge-upcoming';
      }
    }

    if (unpinBtn) {
      unpinBtn.style.display = isPinned ? 'inline-flex' : 'none';
    }

    if (titleEl) titleEl.textContent = this.targetEvent.title;
    if (subtitleEl) subtitleEl.textContent = this.targetEvent.subtitle || this.targetEvent.description;
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
      const user = window.clubStore ? window.clubStore.getCurrentUser() : null;
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
        const isMlh = targetUrl.includes('mlh.io');
        officialLinkEl.textContent = isMlh ? 'Official MLH Registration ↗' : 'Official Program Site ↗';
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
    if (!this.targetEvent) {
      if (window.clubStore) {
        this.targetEvent = window.clubStore.getFlagshipEvent();
        this.renderEventBannerDetails();
      }
    }
    if (!this.targetEvent) return;

    const now = new Date();
    const nowTime = now.getTime();

    // Universal auto-archive & rollover:
    // If the tracked event has concluded, auto-advance to next flagship/upcoming program!
    if (window.clubStore && window.clubStore.isEventPast(this.targetEvent, now)) {
      if (window.clubStore.getPinnedEventId() === this.targetEvent.id) {
        window.clubStore.clearPinnedEventId();
      }
      const nextEvent = window.clubStore.getFlagshipEvent();
      if (nextEvent && nextEvent.id !== this.targetEvent.id) {
        this.setTargetEvent(nextEvent, false);
        if (window.eventsManager) {
          window.eventsManager.renderEvents();
        }
        return;
      }
    }

    const isOngoing = window.clubStore ? window.clubStore.isEventOngoing(this.targetEvent, now) : Boolean(this.targetEvent.isOngoing || this.targetEvent.status === 'ongoing');
    const startMs = this.targetEvent.startDate ? new Date(this.targetEvent.startDate).getTime() : new Date(this.targetEvent.targetDate).getTime();
    const endMs = this.targetEvent.endDate ? new Date(this.targetEvent.endDate).getTime() : startMs;

    // Determine target countdown timestamp:
    // When event is currently ongoing (now >= startMs and now < endMs), countdown to event finale (endMs)
    // When event is upcoming (now < startMs), countdown to event kickoff (startMs)
    let countdownTarget;
    if (nowTime >= startMs && nowTime < endMs) {
      countdownTarget = endMs;
    } else {
      countdownTarget = startMs;
    }

    const diff = countdownTarget - nowTime;
    const liveBadge = document.getElementById('countdown-live-badge');

    if (diff <= 0) {
      // Re-evaluate if event has concluded and roll over
      if (window.clubStore && window.clubStore.isEventPast(this.targetEvent, now)) {
        if (window.clubStore.getPinnedEventId() === this.targetEvent.id) {
          window.clubStore.clearPinnedEventId();
        }
        const nextEvent = window.clubStore.getFlagshipEvent();
        if (nextEvent && nextEvent.id !== this.targetEvent.id) {
          this.setTargetEvent(nextEvent, false);
          if (window.eventsManager) {
            window.eventsManager.renderEvents();
          }
          return;
        }
      }

      this.displayZero();
      if (liveBadge) {
        liveBadge.textContent = isOngoing ? '🏁 EVENT CONCLUDED' : '🔴 LIVE RIGHT NOW';
        liveBadge.className = 'badge-live-pulse';
      }
      return;
    }

    if (liveBadge) {
      if (isOngoing || (nowTime >= startMs && nowTime < endMs)) {
        liveBadge.textContent = '🔴 LIVE & ONGOING RIGHT NOW';
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
