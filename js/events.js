/**
 * upGrad School of Technology - Open Source Events
 * Events Hub: Filtering, Card Rendering, Details Modal, Calendar Export & Hacker Pass Generator
 */

class EventsManager {
  constructor() {
    this.currentCategory = 'all';
    this.currentStatus = 'all';
    this.searchQuery = '';
  }

  init() {
    this.bindFilters();
    this.renderEvents();
  }

  bindFilters() {
    const filterBtns = document.querySelectorAll('.filter-pill');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.currentCategory = e.currentTarget.dataset.category;
        this.renderEvents();
      });
    });

    const statusBtns = document.querySelectorAll('.status-toggle-btn');
    statusBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        statusBtns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.currentStatus = e.currentTarget.dataset.status;
        this.renderEvents();
      });
    });

    const searchInput = document.getElementById('event-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderEvents();
      });
    }
  }

  getFilteredEvents() {
    const all = window.clubStore.getEvents();
    const now = new Date().getTime();

    return all.filter(event => {
      const isOngoing = Boolean(event.isOngoing || event.status === 'ongoing');
      const eventTime = new Date(event.targetDate).getTime();
      const endTime = event.endDate ? new Date(event.endDate).getTime() : eventTime;
      const isPast = !isOngoing && (endTime < now || event.status === 'past');
      const isUpcoming = !isOngoing && !isPast;
      
      // Status filter
      if (this.currentStatus === 'ongoing' && !isOngoing) return false;
      if (this.currentStatus === 'upcoming' && !isUpcoming) return false;
      if (this.currentStatus === 'past' && !isPast) return false;

      // Category filter
      if (this.currentCategory !== 'all' && event.category !== this.currentCategory) return false;

      // Search query
      if (this.searchQuery) {
        const titleMatch = event.title.toLowerCase().includes(this.searchQuery);
        const descMatch = (event.description || '').toLowerCase().includes(this.searchQuery);
        const tagMatch = (event.tags || []).some(t => t.toLowerCase().includes(this.searchQuery));
        const venueMatch = (event.venue || '').toLowerCase().includes(this.searchQuery);
        if (!titleMatch && !descMatch && !tagMatch && !venueMatch) return false;
      }

      return true;
    }).sort((a, b) => {
      if (this.currentStatus === 'past') {
        return new Date(b.targetDate) - new Date(a.targetDate);
      }
      // Ongoing first, then upcoming by targetDate
      const aOngoing = a.isOngoing || a.status === 'ongoing' ? 1 : 0;
      const bOngoing = b.isOngoing || b.status === 'ongoing' ? 1 : 0;
      if (aOngoing !== bOngoing) return bOngoing - aOngoing;
      return new Date(a.targetDate) - new Date(b.targetDate);
    });
  }

  renderEvents() {
    const container = document.getElementById('events-grid-container');
    if (!container) return;

    const events = this.getFilteredEvents();
    const currentUser = window.clubStore.getCurrentUser();

    if (events.length === 0) {
      container.innerHTML = `
        <div class="empty-events-state">
          <div class="empty-icon">⚡</div>
          <h3>No Events Found</h3>
          <p>Try tweaking your filters or search keywords, or check back soon for newly announced UGSOT open source events.</p>
          <button class="btn btn-secondary" onclick="window.eventsManager.resetFilters()">Reset All Filters</button>
        </div>
      `;
      return;
    }

    container.innerHTML = events.map(evt => {
      const targetDate = new Date(evt.targetDate);
      const isRsvpd = currentUser && currentUser.rsvps && currentUser.rsvps.includes(evt.id);
      const percentFull = Math.min(100, Math.round(((evt.spotsFilled || 0) / (evt.spotsTotal || 100)) * 100));
      const isOngoing = Boolean(evt.isOngoing || evt.status === 'ongoing');
      const isPast = !isOngoing && (targetDate.getTime() < Date.now() || evt.status === 'past');

      // Relative calculation
      const daysDiff = Math.ceil((targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      let relativeLabel = '';
      if (isOngoing) {
        relativeLabel = '🔴 LIVE & ONGOING';
      } else if (isPast) {
        relativeLabel = 'Archived Event';
      } else if (daysDiff === 0) {
        relativeLabel = '🔥 Happening Today!';
      } else if (daysDiff === 1) {
        relativeLabel = '⚡ Tomorrow!';
      } else if (daysDiff < 7) {
        relativeLabel = `In ${daysDiff} days`;
      } else {
        const weeks = Math.floor(daysDiff / 7);
        const remDays = daysDiff % 7;
        relativeLabel = `In ${weeks}w ${remDays}d`;
      }

      const formattedDate = targetDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      return `
        <div class="event-card bento-card ${evt.isFlagship ? 'flagship-card-glow' : ''}">
          <div class="event-card-media">
            <img src="${evt.banner || 'assets/flagship_banner.jpg'}" alt="${evt.title}" loading="lazy" class="event-card-img" />
            <div class="media-overlay"></div>
            <div class="card-top-badges">
              <span class="category-badge cat-${evt.category}">${evt.category.toUpperCase()}</span>
              <span class="countdown-mini-badge ${isOngoing ? 'badge-ongoing-pulse' : (isPast ? 'badge-past' : '')}">${relativeLabel}</span>
            </div>
          </div>

          <div class="event-card-content">
            <div class="event-time-meta">
              <span class="calendar-icon">📅</span>
              <span class="time-string">${evt.dateBadge || formattedDate}</span>
              <span class="dot-separator">•</span>
              <span class="mode-pill">${evt.mode || 'Online / global'}</span>
            </div>

            ${evt.stipend ? `<div class="stipend-card-badge">💰 ${evt.stipend}</div>` : ''}

            <h3 class="event-card-title">${evt.title}</h3>
            <p class="event-card-desc">${evt.description ? evt.description.slice(0, 110) + '...' : ''}</p>

            <div class="event-venue-meta">
              <span class="venue-icon">📍</span>
              <span class="venue-text">${evt.venue || 'Online / global'}</span>
            </div>

            <div class="spots-meter-wrapper">
              <div class="spots-label">
                <span>Registration Capacity</span>
                <span class="spots-count">${evt.spotsFilled}/${evt.spotsTotal} (${percentFull}%)</span>
              </div>
              <div class="meter-bar">
                <div class="meter-fill" style="width: ${percentFull}%"></div>
              </div>
            </div>

            <div class="card-tags">
              ${(evt.tags || []).map(tag => `<span class="tag-pill">#${tag}</span>`).join('')}
            </div>

            <div class="card-actions">
              ${!isPast ? `
                <button class="btn btn-sm ${isRsvpd ? 'btn-success-active' : 'btn-primary'}" onclick="window.eventsManager.handleRsvpClick('${evt.id}')">
                  ${isRsvpd ? '✓ Hacker Pass' : '⚡ RSVP Now'}
                </button>
              ` : `
                <button class="btn btn-sm btn-ghost" onclick="window.eventsManager.openDetailsModal('${evt.id}')">
                  View Recap
                </button>
              `}
              <button class="btn btn-sm btn-outline" onclick="window.eventsManager.openDetailsModal('${evt.id}')">
                Details & Agenda
              </button>
              <button class="btn-icon-pin" title="Track on Countdown Timer" onclick="window.eventsManager.pinToTimer('${evt.id}')">
                ⏱️
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  resetFilters() {
    this.currentCategory = 'all';
    this.currentStatus = 'all';
    this.searchQuery = '';
    const searchInput = document.getElementById('event-search-input');
    if (searchInput) searchInput.value = '';
    
    document.querySelectorAll('.filter-pill').forEach(b => {
      b.classList.toggle('active', b.dataset.category === 'all');
    });
    document.querySelectorAll('.status-toggle-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.status === 'all');
    });
    this.renderEvents();
  }

  pinToTimer(eventId) {
    const event = window.clubStore.getEventById(eventId);
    if (!event) return;
    window.countdownEngine.setTargetEvent(event);

    // Scroll smoothly to countdown section
    const countdownSec = document.getElementById('countdown-section');
    if (countdownSec) {
      countdownSec.scrollIntoView({ behavior: 'smooth' });
    }
    window.app.showToast(`Now tracking "${event.title.slice(0, 25)}..." on live timer!`, 'info');
  }

  handleRsvpClick(eventId) {
    const currentUser = window.clubStore.getCurrentUser();
    if (!currentUser) {
      window.authManager.openAuthModal('login');
      return;
    }

    const isAlreadyRsvpd = currentUser.rsvps && currentUser.rsvps.includes(eventId);
    if (isAlreadyRsvpd) {
      // Show Digital Ticket / Hacker Pass modal!
      this.openHackerPassModal(eventId, currentUser);
    } else {
      // Execute RSVP
      const result = window.clubStore.rsvpToEvent(eventId, currentUser.id || currentUser.studentId);
      if (result.success) {
        window.app.showToast(result.message, 'success');
        this.renderEvents();
        window.countdownEngine.renderEventBannerDetails();
        window.app.updateHeaderUser();
        // Immediately show off their new Hacker Pass!
        setTimeout(() => {
          this.openHackerPassModal(eventId, window.clubStore.getCurrentUser());
        }, 300);
      } else {
        window.app.showToast(result.message, 'warning');
      }
    }
  }

  openDetailsModal(eventId) {
    const event = window.clubStore.getEventById(eventId);
    if (!event) return;

    const modal = document.getElementById('event-details-modal');
    const content = document.getElementById('event-details-content');
    if (!modal || !content) return;

    const currentUser = window.clubStore.getCurrentUser();
    const isRsvpd = currentUser && currentUser.rsvps && currentUser.rsvps.includes(eventId);
    const targetDate = new Date(event.targetDate);

    content.innerHTML = `
      <div class="modal-event-hero">
        <img src="${event.banner || 'assets/flagship_banner.jpg'}" alt="${event.title}" class="modal-hero-img"/>
        <div class="modal-hero-overlay">
          <span class="category-badge cat-${event.category}">${event.category.toUpperCase()}</span>
          <h2>${event.title}</h2>
          <p class="modal-hero-sub">${event.subtitle || ''}</p>
        </div>
      </div>

      <div class="modal-body-grid">
        <div class="modal-main-info">
          <div class="meta-row">
            <div class="meta-item">
              <span class="meta-icon">📅</span>
              <div>
                <strong>Program Timeline & Cycle</strong>
                <p style="color:var(--brand-red); font-weight:800; font-size:1.05rem;">${event.dateBadge || ''}</p>
                <p style="font-size:0.8rem; color:var(--text-muted);">Upcoming Target: ${targetDate.toLocaleDateString('en-US', { dateStyle: 'full' })}</p>
              </div>
            </div>
            <div class="meta-item">
              <span class="meta-icon">📍</span>
              <div>
                <strong>Format & Mode</strong>
                <p>${event.venue} (${event.mode || 'Online / global'})</p>
              </div>
            </div>
            <div class="meta-item">
              <span class="meta-icon">🏆</span>
              <div>
                <strong>Stipend & Rewards</strong>
                <p>${event.prizePool || 'Certificates & Swag'}</p>
              </div>
            </div>
          </div>

          ${event.timelineInfo ? `
            <div class="timeline-info-card">
              <div class="timeline-info-title"><span>🕒</span> Verified Program Milestone Timeline</div>
              <div class="timeline-info-row">
                <div class="timeline-info-item"><span class="timeline-info-label">📝 Applications:</span><span>${event.timelineInfo.registration || 'Check official site'}</span></div>
                <div class="timeline-info-item"><span class="timeline-info-label">🚀 Active Phase:</span><span>${event.timelineInfo.activePhase || event.dateBadge}</span></div>
                <div class="timeline-info-item"><span class="timeline-info-label">🏁 Evaluation:</span><span>${event.timelineInfo.reviewPhase || 'Milestone reviews'}</span></div>
              </div>
            </div>
          ` : ''}

          <h4>About this Open Source Program</h4>
          <p class="modal-description">${event.description}</p>

          <h4>Event Agenda & Roadmap</h4>
          <ul class="agenda-timeline">
            ${(event.agenda || []).map((step, idx) => `
              <li class="agenda-item">
                <span class="agenda-marker">${idx + 1}</span>
                <span class="agenda-text">${step}</span>
              </li>
            `).join('')}
          </ul>

          <h4>Speakers & Mentors</h4>
          <div class="speakers-grid">
            ${(event.speakers || []).map(s => `
              <div class="speaker-pill">
                <div class="speaker-avatar">${s.avatar || 'UGSOT'}</div>
                <div class="speaker-info">
                  <strong>${s.name}</strong>
                  <span>${s.role}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="modal-sidebar-card">
          <div class="sidebar-box">
            <h4>Registration Status</h4>
            <div class="spots-status">
              <span class="spots-num">${event.spotsFilled} / ${event.spotsTotal}</span>
              <span>spots filled</span>
            </div>
            <div class="meter-bar">
              <div class="meter-fill" style="width: ${Math.round((event.spotsFilled/event.spotsTotal)*100)}%"></div>
            </div>

            <div class="sidebar-actions">
              ${event.officialUrl ? `
                <a href="${event.officialUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-block btn-secondary" style="margin-bottom: 10px; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 6px; font-weight: 800;">
                  🌐 Official Program Site ↗
                </a>
              ` : ''}

              <button class="btn btn-block ${isRsvpd ? 'btn-success-active' : 'btn-primary'}" onclick="window.eventsManager.handleRsvpClick('${event.id}')">
                ${isRsvpd ? '✓ View My Hacker Pass' : '⚡ RSVP Instant Entry'}
              </button>
              
              <button class="btn btn-block btn-outline" onclick="window.eventsManager.downloadIcs('${event.id}')">
                📅 Add to Calendar (.ics)
              </button>

              <button class="btn btn-block btn-ghost" onclick="window.eventsManager.pinToTimer('${event.id}')">
                ⏱️ Pin to Live Countdown
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');
  }

  openHackerPassModal(eventId, user) {
    const event = window.clubStore.getEventById(eventId);
    if (!event || !user) return;

    const modal = document.getElementById('hacker-pass-modal');
    const container = document.getElementById('hacker-pass-render');
    if (!modal || !container) return;

    const dateStr = new Date(event.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const ticketHash = 'UGSOT-' + Math.abs(event.id.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0)).toString(16).toUpperCase().padStart(6, 'X');

    container.innerHTML = `
      <div class="hacker-ticket-badge" id="printable-ticket">
        <div class="ticket-header">
          <div class="ticket-brand">
            <img src="assets/upgrad_sot_official.png" alt="UGSOT" class="ticket-logo" />
            <div>
              <span class="ticket-school">upGrad School of Technology</span>
              <span class="ticket-club">Open Source Events • Official Pass</span>
            </div>
          </div>
          <div class="ticket-chip">CONFIRMED ACCESS</div>
        </div>

        <div class="ticket-body">
          <div class="ticket-event-name">${event.title}</div>
          <div class="ticket-meta-grid">
            <div>
              <span class="t-label">ATTENDEE</span>
              <span class="t-val">${user.name}</span>
            </div>
            <div>
              <span class="t-label">STUDENT ID</span>
              <span class="t-val">${user.studentId || 'UGSOT-MEMBER'}</span>
            </div>
            <div>
              <span class="t-label">DATE & TIME</span>
              <span class="t-val">${dateStr}</span>
            </div>
            <div>
              <span class="t-label">LOCATION</span>
              <span class="t-val">${event.venue.split(',')[0]}</span>
            </div>
          </div>
        </div>

        <div class="ticket-footer">
          <div class="ticket-qr-box">
            <canvas id="ticket-qr-canvas" width="90" height="90"></canvas>
          </div>
          <div class="ticket-barcodes">
            <span class="t-label">TICKET HASH</span>
            <span class="barcode-font">${ticketHash}</span>
            <span class="ticket-instruction">Scan at entrance for Dev XP verification</span>
          </div>
        </div>
      </div>

      <div class="pass-modal-actions">
        <button class="btn btn-primary" onclick="window.eventsManager.downloadIcs('${event.id}')">
          📅 Export to Apple / Google Calendar
        </button>
        <button class="btn btn-outline" onclick="window.print()">
          🖨️ Print / Save Pass
        </button>
        <button class="btn btn-danger-ghost" onclick="window.eventsManager.cancelRsvp('${event.id}')">
          Cancel Reservation
        </button>
      </div>
    `;

    modal.classList.add('active');

    // Draw high tech pixel QR pattern
    setTimeout(() => {
      this.drawTechQrPattern('ticket-qr-canvas', `${event.id}:${user.studentId}`);
    }, 50);
  }

  drawTechQrPattern(canvasId, seed) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    ctx.clearRect(0, 0, size, size);

    // Clean white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Matrix dots
    const grid = 15;
    const cellSize = size / grid;

    // Seeded pseudo random
    let hash = 0;
    for (let i = 0; i < seed.length; i++) hash = (hash << 5) - hash + seed.charCodeAt(i);

    for (let r = 0; r < grid; r++) {
      for (let c = 0; c < grid; c++) {
        // Corner squares (standard QR locator anchors)
        const isAnchor1 = r < 4 && c < 4;
        const isAnchor2 = r < 4 && c >= grid - 4;
        const isAnchor3 = r >= grid - 4 && c < 4;

        if (isAnchor1 || isAnchor2 || isAnchor3) {
          ctx.fillStyle = '#e62529'; // upGrad scarlet red
          ctx.fillRect(c * cellSize + 1, r * cellSize + 1, cellSize - 2, cellSize - 2);
        } else {
          const bit = (Math.sin(hash + r * 13 + c * 7) + 1) / 2;
          if (bit > 0.45) {
            ctx.fillStyle = '#121212'; // stark black
            ctx.fillRect(c * cellSize + 1.2, r * cellSize + 1.2, cellSize - 2.4, cellSize - 2.4);
          }
        }
      }
    }
  }

  cancelRsvp(eventId) {
    const user = window.clubStore.getCurrentUser();
    if (!user) return;
    
    if (confirm('Are you sure you want to cancel your registration? Your spot will be released.')) {
      window.clubStore.cancelRsvp(eventId, user.id);
      window.app.showToast('Reservation cancelled.', 'info');
      window.app.closeAllModals();
      this.renderEvents();
      window.countdownEngine.renderEventBannerDetails();
      window.app.updateHeaderUser();
    }
  }

  downloadIcs(eventId) {
    const event = window.clubStore.getEventById(eventId);
    if (!event) return;

    const startDate = new Date(event.targetDate);
    const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000); // 3 hours duration

    const formatIcsDate = (date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//upGrad School of Technology//Open Source Events//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${event.id}@ugsot.upgrad.edu`,
      `DTSTAMP:${formatIcsDate(new Date())}`,
      `DTSTART:${formatIcsDate(startDate)}`,
      `DTEND:${formatIcsDate(endDate)}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${(event.description || '').replace(/\n/g, ' ')}`,
      `LOCATION:${event.venue}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.app.showToast('Calendar invite (.ics) downloaded!', 'success');
  }
}

window.eventsManager = new EventsManager();
