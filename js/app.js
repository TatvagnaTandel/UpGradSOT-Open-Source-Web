/**
 * upGrad School of Technology - Open Source Events
 * Main Application Controller & Shell
 */

class App {
  constructor() {
    this.toastTimer = null;
  }

  init() {
    this.renderSections();

    if (window.countdownEngine) window.countdownEngine.init();
    if (window.eventsManager) window.eventsManager.init();
    if (window.hacktoberfestFestsManager) window.hacktoberfestFestsManager.init();
    if (window.authManager) window.authManager.init();
    if (window.adminDashboard) window.adminDashboard.init();

    this.renderLeaderboard();
    this.bindGlobalModals();
    this.initTerminal();
    this.initSoundFX();
    this.initMobileNav();
  }

  renderSections() {
    const sections = window.clubStore.getSections();

    sections.forEach(sec => {
      const sectionEl = document.getElementById(`${sec.id}-section`);
      if (sectionEl) {
        // Toggle visibility
        if (sec.enabled) {
          sectionEl.classList.remove('hidden-section');
        } else {
          sectionEl.classList.add('hidden-section');
        }

        // Update titles if available
        const titleEl = sectionEl.querySelector('.section-header-title');
        const subEl = sectionEl.querySelector('.section-header-sub');
        if (titleEl && sec.title) titleEl.textContent = sec.title;
        if (subEl && sec.subtitle) subEl.textContent = sec.subtitle;
      }
    });
  }

  renderLeaderboard() {
    // 1. Mini preview list on Home page
    const container = document.getElementById('leaderboard-list-container');
    if (container) {
      const students = [...window.clubStore.getStudents()]
        .sort((a, b) => (b.devXp || 0) - (a.devXp || 0))
        .slice(0, 5); // top 5

      const medals = ['🥇', '🥈', '🥉', '4th', '5th'];

      container.innerHTML = students.map((std, idx) => `
        <div class="leaderboard-item ${idx === 0 ? 'leaderboard-champion' : ''}">
          <div class="lb-rank">${medals[idx]}</div>
          <div class="lb-user">
            <div class="user-avatar-circle small ${idx === 0 ? 'champion-glow' : ''}">
              ${std.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
            </div>
            <div>
              <strong>${std.name}</strong>
              <span class="text-muted small">${std.year || 'Student'}</span>
            </div>
          </div>
          <div class="lb-badges">
            ${(std.badges || []).slice(0, 2).map(b => `<span class="tag-pill">${b}</span>`).join('')}
          </div>
          <div class="lb-xp">
            <span class="xp-val">${std.devXp || 0}</span>
            <span class="xp-unit">XP</span>
          </div>
        </div>
      `).join('');
    }

    // 2. Full Leaderboard & Podium on dedicated leaderboard.html page
    this.renderFullLeaderboard();
  }

  renderFullLeaderboard() {
    const tbody = document.getElementById('full-leaderboard-tbody');
    const podiumContainer = document.getElementById('leaderboard-podium-container');
    if (!tbody && !podiumContainer) return;

    let students = [...window.clubStore.getStudents()]
      .sort((a, b) => (b.devXp || 0) - (a.devXp || 0));

    // Render podium if container exists
    if (podiumContainer && students.length >= 3) {
      const p1 = students[0];
      const p2 = students[1];
      const p3 = students[2];

      podiumContainer.innerHTML = `
        <div class="podium-card rank-2">
          <div class="podium-medal">🥈</div>
          <div class="podium-avatar">${p2.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
          <div class="podium-name">${p2.name}</div>
          <div class="podium-year">${p2.year || '2nd Year'} • ${p2.studentId || ''}</div>
          <div class="podium-xp-badge">⚡ ${p2.devXp} XP (Lvl ${p2.level || 1})</div>
        </div>
        <div class="podium-card rank-1">
          <div class="podium-medal">👑 🥇</div>
          <div class="podium-avatar" style="width:72px; height:72px; font-size:1.5rem; background:#ffd166;">${p1.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
          <div class="podium-name" style="font-size:1.45rem;">${p1.name}</div>
          <div class="podium-year">${p1.year || '1st Year'} • ${p1.studentId || ''}</div>
          <div class="podium-xp-badge" style="background:#70e000; font-size:1.1rem;">⚡ ${p1.devXp} XP (Lvl ${p1.level || 1})</div>
        </div>
        <div class="podium-card rank-3">
          <div class="podium-medal">🥉</div>
          <div class="podium-avatar">${p3.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
          <div class="podium-name">${p3.name}</div>
          <div class="podium-year">${p3.year || '3rd Year'} • ${p3.studentId || ''}</div>
          <div class="podium-xp-badge">⚡ ${p3.devXp} XP (Lvl ${p3.level || 1})</div>
        </div>
      `;
    }

    if (!tbody) return;

    // Filter controls for table
    const searchInput = document.getElementById('leaderboard-search-input');
    const yearSelect = document.getElementById('leaderboard-year-filter');

    const filterAndRenderTable = () => {
      const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
      const yearFilter = yearSelect ? yearSelect.value : 'all';

      let filtered = students.filter(s => {
        if (query) {
          const matchName = (s.name || '').toLowerCase().includes(query);
          const matchId = (s.studentId || '').toLowerCase().includes(query);
          const matchEmail = (s.email || '').toLowerCase().includes(query);
          if (!matchName && !matchId && !matchEmail) return false;
        }
        if (yearFilter !== 'all' && (s.year || '') !== yearFilter) {
          return false;
        }
        return true;
      });

      const totalCountEl = document.getElementById('total-hackers-count');
      if (totalCountEl) totalCountEl.textContent = `${filtered.length} builders ranked`;

      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px;">No students match your filter.</td></tr>`;
        return;
      }

      tbody.innerHTML = filtered.map((s, idx) => {
        const rank = idx + 1;
        const rankDisplay = rank === 1 ? '🥇 1st' : rank === 2 ? '🥈 2nd' : rank === 3 ? '🥉 3rd' : `#${rank}`;
        const rsvpCount = (s.rsvps || []).length;

        return `
          <tr>
            <td style="font-weight:900; font-family:var(--font-heading); font-size:1.05rem;">${rankDisplay}</td>
            <td>
              <div class="table-student-profile">
                <div class="user-avatar-circle small ${rank === 1 ? 'champion-glow' : ''}">${s.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
                <div>
                  <strong>${s.name}</strong>
                  <span class="text-muted small">${s.email}</span>
                </div>
              </div>
            </td>
            <td><code>${s.studentId || 'N/A'}</code></td>
            <td><span class="tag-pill" style="font-weight:800;">${s.year || '1st Year'}</span></td>
            <td>
              <span class="badge badge-xp">⚡ ${s.devXp || 0} XP</span>
              <span class="badge badge-level">Lvl ${s.level || 1}</span>
            </td>
            <td>
              <span class="badge ${rsvpCount > 0 ? 'badge-rsvps' : 'badge-standard'}">${rsvpCount} events</span>
            </td>
            <td>
              <div style="display:flex; gap:4px; flex-wrap:wrap;">
                ${(s.badges || []).map(b => `<span class="tag-pill" style="font-size:0.75rem;">${b}</span>`).join('')}
              </div>
            </td>
          </tr>
        `;
      }).join('');
    };

    filterAndRenderTable();

    if (searchInput && !searchInput.dataset.bound) {
      searchInput.dataset.bound = 'true';
      searchInput.addEventListener('input', filterAndRenderTable);
    }
    if (yearSelect && !yearSelect.dataset.bound) {
      yearSelect.dataset.bound = 'true';
      yearSelect.addEventListener('change', filterAndRenderTable);
    }
  }

  bindGlobalModals() {
    // Close modal on backdrop click or close button
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeAllModals();
        }
      });
      const closeBtn = modal.querySelector('.modal-close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.closeAllModals());
      }
    });

    // ESC key closes modals
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });
  }

  closeAllModals() {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
  }

  showToast(message, type = 'info') {
    const toast = document.getElementById('toast-notification');
    if (!toast) return;

    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠️',
      info: '⚡'
    };

    toast.className = `toast toast-${type} toast-show`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || '⚡'}</span>
      <span class="toast-message">${message}</span>
    `;

    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.remove('toast-show');
    }, 3800);
  }

  initTerminal() {
    const termInput = document.getElementById('terminal-input');
    const termBody = document.getElementById('terminal-output');
    if (!termInput || !termBody) return;

    termInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = termInput.value.trim().toLowerCase();
        termInput.value = '';
        this.runTerminalCommand(cmd, termBody);
      }
    });
  }

  runTerminalCommand(cmd, outputEl) {
    const appendLine = (text, isError = false) => {
      const line = document.createElement('div');
      line.className = isError ? 'term-line term-error' : 'term-line';
      line.innerHTML = text;
      outputEl.appendChild(line);
      outputEl.scrollTop = outputEl.scrollHeight;
    };

    appendLine(`<span class="term-prompt">ugsot@opensource:~$</span> ${cmd}`);

    switch (cmd) {
      case 'help':
        appendLine(`Available commands:<br>
          • <strong>events</strong>: list all live UGSOT open source events<br>
          • <strong>pune</strong>: list all 5 official Hacktoberfest Pune host campuses<br>
          • <strong>fests</strong>: show regional Hacktoberfest hubs breakdown (50 fests)<br>
          • <strong>countdown</strong>: show remaining time to flagship event<br>
          • <strong>whoami</strong>: display active authenticated session<br>
          • <strong>matrix</strong>: trigger neon matrix pulse<br>
          • <strong>clear</strong>: clear the terminal console`);
        break;
      case 'pune':
        const puneFests = (window.hacktoberfestFestsManager ? window.hacktoberfestFestsManager.events : [])
          .filter(e => e.regionGroup === 'pune');
        appendLine(`📍 <strong>${puneFests.length} Hacktoberfest Fests in Pune, Maharashtra:</strong><br>` +
          puneFests.map(f => `• <strong>${f.title}</strong><br>&nbsp;&nbsp;📅 ${new Date(f.targetDate).toLocaleDateString()} | 📍 ${f.shortVenue}`).join('<br>')
        );
        break;
      case 'fests':
        const allFests = window.hacktoberfestFestsManager ? window.hacktoberfestFestsManager.events : [];
        const puneCount = allFests.filter(e => e.regionGroup === 'pune').length;
        const mhCount = allFests.filter(e => e.regionGroup === 'maharashtra').length;
        const otherCount = allFests.length - puneCount - mhCount;
        appendLine(`🌐 <strong>Hacktoberfest Regional Fests Hub:</strong><br>
          • Total Synced Hubs: <strong>${allFests.length}</strong><br>
          • Pune Hosts: <strong>${puneCount}</strong> (MIT ADT, AIT, Gaia Apex, NST ADYPU, AIDN)<br>
          • Maharashtra Hubs: <strong>${mhCount}</strong> (Mumbai, Nagpur, Nashik, Sambhajinagar)<br>
          • Neighboring States: <strong>${otherCount}</strong> (Karnataka, MP, Telangana, Gujarat)<br>
          <em>Click the ⏱️ pin icon on any fest card to lock it to the live countdown timer!</em>`);
        break;
      case 'events':
        const events = window.clubStore.getEvents();
        appendLine(`Found ${events.length} UGSOT events:<br>` + 
          events.map(e => `• <strong>${e.title}</strong> [${new Date(e.targetDate).toLocaleDateString()}]`).join('<br>')
        );
        break;
      case 'countdown':
        const flag = window.clubStore.getFlagshipEvent();
        const diff = new Date(flag.targetDate).getTime() - Date.now();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        appendLine(`⏱️ <strong>${flag.title}</strong> takes place in ${days} days, ${hours} hours.`);
        break;
      case 'whoami':
        const user = window.clubStore.getCurrentUser();
        if (user) {
          appendLine(`Logged in as <strong>${user.name}</strong> (${user.email}) [Role: ${user.role}] - XP: ${user.devXp}`);
        } else {
          appendLine('No session active. Type login or click Sign In.');
        }
        break;
      case 'matrix':
        document.body.classList.toggle('matrix-glow-active');
        appendLine('🟢 Neon Cyber Matrix pulse toggled!');
        break;
      case 'clear':
        outputEl.innerHTML = '';
        break;
      default:
        appendLine(`command not found: "${cmd}". Type <strong>help</strong> for available commands.`, true);
    }
  }

  initSoundFX() {
    // Optional tactile audio synthesised using Web Audio API (zero external sound file needed!)
    try {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = null;
    } catch (e) {
      // Audio not supported or blocked
    }
  }

  playClickFx() {
    if (!this.audioCtx) {
      try {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) { return; }
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.audioCtx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.05);
  }

  updateHeaderUser() {
    if (window.authManager) window.authManager.updateUserUI();
    this.renderLeaderboard();
    this.syncMobileAdmin();
  }

  initMobileNav() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const drawer = document.getElementById('mobile-nav-drawer');
    if (!toggleBtn || !drawer) return;

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = drawer.classList.toggle('open');
      toggleBtn.classList.toggle('active', isOpen);
    });

    document.addEventListener('click', (e) => {
      if (drawer.classList.contains('open') && !drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
        this.closeMobileNav();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        this.closeMobileNav();
      }
    });

    this.syncMobileAdmin();
  }

  syncMobileAdmin() {
    const mobileAdminWrapper = document.getElementById('mobile-admin-link-wrapper');
    if (!mobileAdminWrapper || !window.clubStore) return;
    const user = window.clubStore.getCurrentUser();
    mobileAdminWrapper.style.display = (user && user.role === 'admin') ? 'block' : 'none';
  }

  closeMobileNav() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const drawer = document.getElementById('mobile-nav-drawer');
    if (toggleBtn) toggleBtn.classList.remove('active');
    if (drawer) drawer.classList.remove('open');
  }
}

window.app = new App();

document.addEventListener('DOMContentLoaded', () => {
  window.app.init();
});
