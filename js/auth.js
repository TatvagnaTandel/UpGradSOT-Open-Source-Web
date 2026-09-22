/**
 * upGrad School of Technology - Open Source Events
 * Authentication, Student Profile & Role Switcher
 */

class AuthManager {
  constructor() {
    this.currentMode = 'login'; // 'login' or 'signup'
  }

  init() {
    this.bindEvents();
    this.updateUserUI();
  }

  bindEvents() {
    // Auth Modal Toggles
    const openAuthBtns = document.querySelectorAll('.trigger-auth-modal');
    openAuthBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = e.currentTarget.dataset.authMode || 'login';
        this.openAuthModal(mode);
      });
    });

    // Tab switchers inside auth modal
    const tabBtns = document.querySelectorAll('.auth-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.switchMode(e.currentTarget.dataset.mode);
      });
    });

    // Form Submissions
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => this.handleSignup(e));
    }

    // Password strength meter
    const signupPass = document.getElementById('signup-password');
    if (signupPass) {
      signupPass.addEventListener('input', (e) => this.checkPasswordStrength(e.target.value));
    }
  }

  openAuthModal(mode = 'login') {
    const modal = document.getElementById('auth-modal');
    if (!modal) return;
    this.switchMode(mode);
    modal.classList.add('active');
  }

  switchMode(mode) {
    this.currentMode = mode;
    const loginSection = document.getElementById('auth-login-section');
    const signupSection = document.getElementById('auth-signup-section');
    const tabs = document.querySelectorAll('.auth-tab-btn');

    tabs.forEach(t => t.classList.toggle('active', t.dataset.mode === mode));

    if (mode === 'login') {
      if (loginSection) loginSection.classList.remove('hidden');
      if (signupSection) signupSection.classList.add('hidden');
    } else {
      if (loginSection) loginSection.classList.add('hidden');
      if (signupSection) signupSection.classList.remove('hidden');
    }
  }

  checkPasswordStrength(pwd) {
    const meter = document.getElementById('pwd-strength-bar');
    const label = document.getElementById('pwd-strength-text');
    if (!meter || !label) return;

    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    let width = '25%';
    let color = '#ef4444';
    let text = 'Weak (Needs 8+ chars, numbers, caps)';

    if (score >= 3) {
      width = '75%';
      color = '#eab308';
      text = 'Good password';
    }
    if (score >= 4) {
      width = '100%';
      color = '#10b981';
      text = 'Strong & Secure 💪';
    }

    meter.style.width = width;
    meter.style.backgroundColor = color;
    label.textContent = text;
  }

  handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const pass = document.getElementById('login-password').value;

    if (!email || !pass) {
      window.app.showToast('Please fill in both email and password.', 'error');
      return;
    }

    const res = window.clubStore.login(email, pass);
    if (res.success) {
      window.app.showToast(`Welcome back, ${res.user.name}! 🚀`, 'success');
      window.app.closeAllModals();
      this.updateUserUI();
      window.eventsManager.renderEvents();
      window.countdownEngine.renderEventBannerDetails();
    } else {
      window.app.showToast(res.message, 'error');
    }
  }

  handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const studentId = document.getElementById('signup-studentid').value.trim();
    const year = document.getElementById('signup-year') ? document.getElementById('signup-year').value.trim() : '1st Year';
    const pass = document.getElementById('signup-password').value;

    if (!name || !email || !pass) {
      window.app.showToast('Please fill out all required fields.', 'error');
      return;
    }

    if (pass.length < 6) {
      window.app.showToast('Password must be at least 6 characters.', 'error');
      return;
    }

    const res = window.clubStore.signup(name, email, studentId, year);
    if (res.success) {
      window.app.showToast(`Welcome to UGSOT Open Source Events, ${name}! +100 XP awarded!`, 'success');
      window.app.closeAllModals();
      this.updateUserUI();
      window.eventsManager.renderEvents();
      window.countdownEngine.renderEventBannerDetails();
    } else {
      window.app.showToast(res.message, 'error');
    }
  }

  quickSwitch(role) {
    const user = window.clubStore.switchRole(role);
    window.app.showToast(`Switched active profile to ${user.name} (${user.role.toUpperCase()})`, 'info');
    this.updateUserUI();
    window.eventsManager.renderEvents();
    window.countdownEngine.renderEventBannerDetails();

    if (role === 'admin') {
      window.app.showToast('Admin Mode Enabled! Access the Admin Dashboard from the nav.', 'success');
    }
  }

  logout() {
    window.clubStore.setCurrentUser(null);
    window.app.showToast('Logged out successfully.', 'info');
    window.app.closeAllModals();
    this.updateUserUI();
    window.eventsManager.renderEvents();
    window.countdownEngine.renderEventBannerDetails();
  }

  updateUserUI() {
    const user = window.clubStore.getCurrentUser();
    const userArea = document.getElementById('nav-user-area');
    const adminLink = document.getElementById('nav-admin-link');

    if (!userArea) return;

    if (user) {
      const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
      const isAdmin = user.role === 'admin';

      if (adminLink) {
        adminLink.style.display = isAdmin ? 'inline-flex' : 'none';
      }

      userArea.innerHTML = `
        <div class="user-pill-badge" onclick="window.authManager.openProfileModal()">
          <div class="user-avatar-circle ${isAdmin ? 'admin-glow' : ''}">${initials}</div>
          <div class="user-text-meta">
            <span class="user-name">${user.name.split(' ')[0]}</span>
            <span class="user-role-tag ${isAdmin ? 'tag-admin' : 'tag-student'}">${isAdmin ? '👑 ADMIN LEAD' : `LVL ${user.level || 1} DEV`}</span>
          </div>
        </div>
      `;
    } else {
      if (adminLink) adminLink.style.display = 'none';
      userArea.innerHTML = `
        <button class="btn btn-outline btn-sm trigger-auth-modal" data-auth-mode="login">Sign In</button>
        <button class="btn btn-primary btn-sm trigger-auth-modal" data-auth-mode="signup">Join Club</button>
      `;
      // Re-bind listeners
      userArea.querySelectorAll('.trigger-auth-modal').forEach(btn => {
        btn.addEventListener('click', (e) => this.openAuthModal(e.currentTarget.dataset.authMode));
      });
    }
  }

  openProfileModal() {
    const user = window.clubStore.getCurrentUser();
    if (!user) return;

    const modal = document.getElementById('user-profile-modal');
    const content = document.getElementById('user-profile-content');
    if (!modal || !content) return;

    const allEvents = window.clubStore.getEvents();
    const myEvents = allEvents.filter(e => user.rsvps && user.rsvps.includes(e.id));
    const nextLevelXp = (user.level || 1) * 300;
    const currentLevelProgress = Math.min(100, Math.round(((user.devXp || 100) % 300) / 300 * 100));

    content.innerHTML = `
      <div class="profile-header-card">
        <div class="profile-big-avatar">${user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</div>
        <div class="profile-title-area">
          <h3>${user.name}</h3>
          <p class="profile-subtitle">${user.studentId || 'UGSOT-MEMBER'} • ${user.year || 'Student'}</p>
          <div class="profile-tags">
            <span class="badge ${user.role === 'admin' ? 'badge-admin' : 'badge-student'}">${user.role.toUpperCase()}</span>
            <span class="badge badge-xp">⚡ ${user.devXp || 0} Dev XP</span>
            <span class="badge badge-level">Level ${user.level || 1}</span>
          </div>
        </div>
      </div>

      <!-- XP Progress -->
      <div class="level-progress-box">
        <div class="level-progress-labels">
          <span>Level ${user.level || 1} Progress</span>
          <span>Next Rank in ${300 - ((user.devXp || 100) % 300)} XP</span>
        </div>
        <div class="meter-bar">
          <div class="meter-fill gradient-accent" style="width: ${currentLevelProgress}%"></div>
        </div>
      </div>

      <!-- Badges Showcase -->
      <h4 class="section-subheading">Earned Badges & Achievements</h4>
      <div class="badges-row">
        ${(user.badges || ['Club Member']).map(badge => `
          <div class="achievement-badge">
            <span class="badge-icon">🏅</span>
            <span class="badge-name">${badge}</span>
          </div>
        `).join('')}
      </div>

      <!-- Registered Events -->
      <h4 class="section-subheading">My Active Event Registrations (${myEvents.length})</h4>
      <div class="profile-rsvps-list">
        ${myEvents.length === 0 ? `
          <p class="empty-state-text">You haven't RSVP'd to any upcoming events yet. Check out the event list below!</p>
        ` : myEvents.map(evt => `
          <div class="profile-rsvp-card">
            <div>
              <strong>${evt.title}</strong>
              <div class="rsvp-card-meta">📅 ${new Date(evt.targetDate).toLocaleDateString()} • 📍 ${evt.venue.split(',')[0]}</div>
            </div>
            <button class="btn btn-sm btn-primary" onclick="window.eventsManager.openHackerPassModal('${evt.id}', window.clubStore.getCurrentUser())">
              View Ticket
            </button>
          </div>
        `).join('')}
      </div>

      <div class="profile-modal-footer">
        <button class="btn btn-outline" onclick="window.authManager.quickSwitch('${user.role === 'admin' ? 'student' : 'admin'}')">
          Switch to ${user.role === 'admin' ? 'Student View' : 'Admin View'}
        </button>
        <button class="btn btn-danger-ghost" onclick="window.authManager.logout()">
          Sign Out
        </button>
      </div>
    `;

    modal.classList.add('active');
  }
}

window.authManager = new AuthManager();
