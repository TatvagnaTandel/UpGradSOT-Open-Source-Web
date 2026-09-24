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
    const container = document.getElementById('leaderboard-list-container');
    if (!container) return;

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
          • <strong>countdown</strong>: show remaining time to flagship event<br>
          • <strong>whoami</strong>: display active authenticated session<br>
          • <strong>matrix</strong>: trigger neon matrix pulse<br>
          • <strong>clear</strong>: clear the terminal console`);
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
