/**
 * upGrad School of Technology - Open Source Events
 * Admin Command Center & Real-Time CMS
 */

class AdminDashboard {
  constructor() {
    this.currentTab = 'events'; // 'events' | 'sections' | 'students'
    this.studentSearch = '';
    this.studentEventFilter = 'all';
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    // Navigation tab switching
    const tabBtns = document.querySelectorAll('.admin-nav-item');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        tabBtns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.switchTab(e.currentTarget.dataset.tab);
      });
    });

    // Form handlers
    const createEventForm = document.getElementById('admin-create-event-form');
    if (createEventForm) {
      createEventForm.addEventListener('submit', (e) => this.handleSaveEvent(e));
    }

    const createStudentForm = document.getElementById('admin-create-student-form');
    if (createStudentForm) {
      createStudentForm.addEventListener('submit', (e) => this.handleSaveStudent(e));
    }

    const studentSearchInput = document.getElementById('admin-student-search');
    if (studentSearchInput) {
      studentSearchInput.addEventListener('input', (e) => {
        this.studentSearch = e.target.value.toLowerCase().trim();
        this.renderStudentsTable();
      });
    }

    const studentFilterSelect = document.getElementById('admin-student-event-filter');
    if (studentFilterSelect) {
      studentFilterSelect.addEventListener('change', (e) => {
        this.studentEventFilter = e.target.value;
        this.renderStudentsTable();
      });
    }
  }

  open() {
    const user = window.clubStore.getCurrentUser();
    if (!user || user.role !== 'admin') {
      window.app.showToast('Admin Lead credentials required. Switching to Admin view for demo.', 'warning');
      window.authManager.quickSwitch('admin');
    }

    const adminView = document.getElementById('admin-dashboard-view');
    const mainView = document.getElementById('main-content-view');
    if (adminView && mainView) {
      mainView.classList.add('hidden');
      adminView.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    this.renderStats();
    this.switchTab(this.currentTab);
  }

  close() {
    const adminView = document.getElementById('admin-dashboard-view');
    const mainView = document.getElementById('main-content-view');
    if (adminView && mainView) {
      adminView.classList.add('hidden');
      mainView.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // Refresh main view components
    window.eventsManager.renderEvents();
    window.countdownEngine.renderEventBannerDetails();
    window.app.renderSections();
  }

  switchTab(tab) {
    this.currentTab = tab;
    document.querySelectorAll('.admin-tab-pane').forEach(p => p.classList.add('hidden'));
    
    const activePane = document.getElementById(`admin-pane-${tab}`);
    if (activePane) activePane.classList.remove('hidden');

    if (tab === 'events') this.renderEventsTable();
    if (tab === 'sections') this.renderSectionsList();
    if (tab === 'students') this.renderStudentsView();
  }

  renderStats() {
    const events = window.clubStore.getEvents();
    const students = window.clubStore.getStudents();

    const totalRsvps = students.reduce((acc, s) => acc + (s.rsvps ? s.rsvps.length : 0), 0);
    const upcomingCount = events.filter(e => new Date(e.targetDate) > new Date()).length;

    const statMembers = document.getElementById('stat-total-members');
    const statEvents = document.getElementById('stat-upcoming-events');
    const statRsvps = document.getElementById('stat-total-rsvps');
    const statCap = document.getElementById('stat-avg-capacity');

    if (statMembers) statMembers.textContent = students.length;
    if (statEvents) statEvents.textContent = upcomingCount;
    if (statRsvps) statRsvps.textContent = totalRsvps;
    if (statCap) {
      const avg = Math.round(events.reduce((acc, e) => acc + ((e.spotsFilled||0) / (e.spotsTotal||100)), 0) / (events.length || 1) * 100);
      statCap.textContent = `${avg}%`;
    }
  }

  // --- EVENTS CMS ---
  renderEventsTable() {
    const tbody = document.getElementById('admin-events-tbody');
    if (!tbody) return;

    const events = window.clubStore.getEvents();

    tbody.innerHTML = events.map(evt => {
      const d = new Date(evt.targetDate);
      const isPast = d < new Date();
      return `
        <tr>
          <td>
            <div class="table-event-cell">
              <span class="category-badge cat-${evt.category}">${evt.category.toUpperCase()}</span>
              <div>
                <strong>${evt.title}</strong>
                <span class="text-muted small">${evt.venue}</span>
              </div>
            </div>
          </td>
          <td>
            <strong style="font-size:0.85rem;">${evt.dateBadge || ''}</strong>
            <div class="${isPast ? 'text-danger' : 'text-success'} small">
              Target: ${d.toLocaleDateString()}
            </div>
          </td>
          <td>
            <div class="table-capacity">
              <span>${evt.spotsFilled} / ${evt.spotsTotal}</span>
              <div class="mini-bar"><div class="mini-fill" style="width: ${Math.round((evt.spotsFilled/evt.spotsTotal)*100)}%"></div></div>
            </div>
          </td>
          <td>
            ${evt.isFlagship ? `<span class="badge badge-flagship">Flagship</span>` : `<span class="badge badge-standard">Standard</span>`}
          </td>
          <td>
            <div class="table-actions">
              <button class="btn btn-xs btn-outline" onclick="window.adminDashboard.openEditEventModal('${evt.id}')">Edit</button>
              <button class="btn btn-xs btn-primary" onclick="window.adminDashboard.setFlagship('${evt.id}')" title="Set as Countdown Target">⏱️ Pin</button>
              <button class="btn btn-xs btn-danger-ghost" onclick="window.adminDashboard.deleteEvent('${evt.id}')">Delete</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  openCreateEventModal() {
    const modal = document.getElementById('admin-event-modal');
    const form = document.getElementById('admin-create-event-form');
    const titleEl = document.getElementById('admin-event-modal-title');
    if (!modal || !form) return;

    form.reset();
    document.getElementById('admin-event-id').value = '';
    titleEl.textContent = 'Create New Club Event';

    // Default datetime to 7 days from now formatted for datetime-local
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 7);
    defaultDate.setMinutes(defaultDate.getMinutes() - defaultDate.getTimezoneOffset());
    document.getElementById('admin-evt-date').value = defaultDate.toISOString().slice(0, 16);

    modal.classList.add('active');
  }

  openEditEventModal(id) {
    const event = window.clubStore.getEventById(id);
    if (!event) return;

    const modal = document.getElementById('admin-event-modal');
    const titleEl = document.getElementById('admin-event-modal-title');
    if (!modal) return;

    titleEl.textContent = 'Edit Event Details';
    document.getElementById('admin-event-id').value = event.id;
    document.getElementById('admin-evt-title').value = event.title;
    document.getElementById('admin-evt-category').value = event.category;
    document.getElementById('admin-evt-venue').value = event.venue;
    document.getElementById('admin-evt-mode').value = event.mode || 'Hybrid';
    document.getElementById('admin-evt-spots').value = event.spotsTotal || 100;
    document.getElementById('admin-evt-prize').value = event.prizePool || '';
    document.getElementById('admin-evt-tags').value = (event.tags || []).join(', ');
    document.getElementById('admin-evt-desc').value = event.description || '';
    document.getElementById('admin-evt-banner').value = event.banner || '';

    const d = new Date(event.targetDate);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    document.getElementById('admin-evt-date').value = d.toISOString().slice(0, 16);

    modal.classList.add('active');
  }

  handleSaveEvent(e) {
    e.preventDefault();
    const id = document.getElementById('admin-event-id').value;
    const title = document.getElementById('admin-evt-title').value.trim();
    const category = document.getElementById('admin-evt-category').value;
    const dateVal = document.getElementById('admin-evt-date').value;
    const venue = document.getElementById('admin-evt-venue').value.trim();
    const mode = document.getElementById('admin-evt-mode').value;
    const spotsTotal = parseInt(document.getElementById('admin-evt-spots').value) || 100;
    const prizePool = document.getElementById('admin-evt-prize').value.trim();
    const tagsStr = document.getElementById('admin-evt-tags').value.trim();
    const description = document.getElementById('admin-evt-desc').value.trim();
    let banner = document.getElementById('admin-evt-banner').value.trim();

    if (!banner) {
      banner = category === 'workshop' ? 'assets/workshop_banner.jpg' :
               category === 'sprint' ? 'assets/codesprint_banner.jpg' : 'assets/flagship_banner.jpg';
    }

    const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()) : [category.toUpperCase(), 'UGSOT'];
    const targetDate = new Date(dateVal).toISOString();

    const eventPayload = {
      title,
      category,
      targetDate,
      venue,
      mode,
      spotsTotal,
      prizePool,
      tags,
      description,
      banner
    };

    if (id) {
      window.clubStore.updateEvent(id, eventPayload);
      window.app.showToast('Event updated successfully!', 'success');
    } else {
      window.clubStore.addEvent(eventPayload);
      window.app.showToast('New event published to live site!', 'success');
    }

    window.app.closeAllModals();
    this.renderEventsTable();
    this.renderStats();
  }

  deleteEvent(id) {
    if (confirm('Are you sure you want to delete this event? This cannot be undone.')) {
      window.clubStore.deleteEvent(id);
      window.app.showToast('Event deleted.', 'info');
      this.renderEventsTable();
      this.renderStats();
    }
  }

  setFlagship(id) {
    const events = window.clubStore.getEvents();
    events.forEach(e => {
      e.isFlagship = (e.id === id);
    });
    window.clubStore.save(STORAGE_KEYS.EVENTS, events);
    const updated = window.clubStore.getEventById(id);
    window.countdownEngine.setTargetEvent(updated);
    window.app.showToast(`"${updated.title}" set as Flagship Countdown target!`, 'success');
    this.renderEventsTable();
  }

  // --- SECTIONS CMS ---
  renderSectionsList() {
    const container = document.getElementById('admin-sections-list');
    if (!container) return;

    const sections = window.clubStore.getSections();

    container.innerHTML = sections.map(sec => `
      <div class="admin-section-card ${sec.enabled ? '' : 'section-disabled'}">
        <div class="section-card-header">
          <div class="section-badge-id">#${sec.order} • ${sec.id.toUpperCase()}</div>
          <div class="section-toggle-control">
            <label class="switch">
              <input type="checkbox" ${sec.enabled ? 'checked' : ''} onchange="window.adminDashboard.toggleSection('${sec.id}', this.checked)">
              <span class="slider round"></span>
            </label>
            <span class="toggle-status">${sec.enabled ? 'Live Visible' : 'Hidden'}</span>
          </div>
        </div>

        <div class="section-edit-fields">
          <div class="form-group">
            <label>Section Display Title</label>
            <input type="text" class="input" value="${sec.title}" id="sec-title-${sec.id}" />
          </div>
          <div class="form-group">
            <label>Subtitle / Description</label>
            <input type="text" class="input" value="${sec.subtitle}" id="sec-sub-${sec.id}" />
          </div>
        </div>

        <div class="section-save-row">
          <button class="btn btn-sm btn-primary" onclick="window.adminDashboard.saveSectionDetails('${sec.id}')">Save Changes</button>
        </div>
      </div>
    `).join('');
  }

  toggleSection(id, enabled) {
    window.clubStore.updateSection(id, { enabled });
    window.app.showToast(`Section "${id}" is now ${enabled ? 'VISIBLE' : 'HIDDEN'} on landing page.`, 'info');
    window.app.renderSections();
  }

  saveSectionDetails(id) {
    const title = document.getElementById(`sec-title-${id}`).value.trim();
    const subtitle = document.getElementById(`sec-sub-${id}`).value.trim();

    window.clubStore.updateSection(id, { title, subtitle });
    window.app.showToast(`Section copy updated!`, 'success');
    window.app.renderSections();
  }

  // --- STUDENT DATABASE ---
  renderStudentsView() {
    // Populate event filter dropdown
    const filterSelect = document.getElementById('admin-student-event-filter');
    if (filterSelect) {
      const events = window.clubStore.getEvents();
      filterSelect.innerHTML = `
        <option value="all">Filter by RSVP (All Events)</option>
        ${events.map(e => `<option value="${e.id}">${e.title.slice(0, 35)}...</option>`).join('')}
      `;
      filterSelect.value = this.studentEventFilter;
    }

    this.renderStudentsTable();
  }

  renderStudentsTable() {
    const tbody = document.getElementById('admin-students-tbody');
    if (!tbody) return;

    let students = window.clubStore.getStudents();
    const allEvents = window.clubStore.getEvents();

    // Filter by search
    if (this.studentSearch) {
      students = students.filter(s => 
        s.name.toLowerCase().includes(this.studentSearch) ||
        s.email.toLowerCase().includes(this.studentSearch) ||
        (s.studentId && s.studentId.toLowerCase().includes(this.studentSearch))
      );
    }

    // Filter by RSVP'd event
    if (this.studentEventFilter !== 'all') {
      students = students.filter(s => s.rsvps && s.rsvps.includes(this.studentEventFilter));
    }

    if (students.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted">No student records found matching filter.</td></tr>`;
      return;
    }

    tbody.innerHTML = students.map(s => {
      const rsvpCount = (s.rsvps || []).length;
      return `
        <tr>
          <td>
            <div class="table-student-profile">
              <div class="user-avatar-circle small">${s.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
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
            <div class="table-actions">
              <button class="btn btn-xs btn-outline" onclick="window.adminDashboard.awardBonusXp('${s.id}')">+XP</button>
              <button class="btn btn-xs btn-danger-ghost" onclick="window.adminDashboard.deleteStudent('${s.id}')">Remove</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  openAddStudentModal() {
    const modal = document.getElementById('admin-student-modal');
    if (modal) modal.classList.add('active');
  }

  handleSaveStudent(e) {
    e.preventDefault();
    const name = document.getElementById('new-std-name').value.trim();
    const email = document.getElementById('new-std-email').value.trim();
    const studentId = document.getElementById('new-std-id').value.trim();
    const year = document.getElementById('new-std-year') ? document.getElementById('new-std-year').value.trim() : '1st Year';

    if (!name || !email) {
      window.app.showToast('Please fill out name and email.', 'error');
      return;
    }

    window.clubStore.addStudent({
      name,
      email,
      studentId: studentId || `UGSOT-${new Date().getFullYear()}-${Math.floor(100 + Math.random()*900)}`,
      year: year || '1st Year'
    });

    window.app.showToast(`Student ${name} added to database!`, 'success');
    window.app.closeAllModals();
    this.renderStudentsTable();
    this.renderStats();
  }

  awardBonusXp(studentId) {
    const student = window.clubStore.getStudents().find(s => s.id === studentId);
    if (!student) return;
    student.devXp = (student.devXp || 0) + 200;
    student.level = Math.floor(student.devXp / 300) + 1;
    window.clubStore.save(STORAGE_KEYS.STUDENTS, window.clubStore.getStudents());
    window.app.showToast(`Awarded +200 XP to ${student.name}!`, 'success');
    this.renderStudentsTable();
  }

  deleteStudent(id) {
    if (confirm('Are you sure you want to remove this student record?')) {
      window.clubStore.deleteStudent(id);
      window.app.showToast('Student removed from database.', 'info');
      this.renderStudentsTable();
      this.renderStats();
    }
  }

  exportStudentsCsv() {
    const students = window.clubStore.getStudents();
    const events = window.clubStore.getEvents();

    const headers = ['Student ID', 'Full Name', 'Email', 'Academic Year', 'Dev XP', 'Level', 'RSVP Count', 'Events List'];
    const rows = students.map(s => {
      const eventTitles = (s.rsvps || []).map(eId => {
        const ev = events.find(e => e.id === eId);
        return ev ? ev.title : eId;
      }).join('; ');

      return [
        `"${s.studentId || ''}"`,
        `"${s.name || ''}"`,
        `"${s.email || ''}"`,
        `"${s.year || '1st Year'}"`,
        s.devXp || 0,
        s.level || 1,
        (s.rsvps || []).length,
        `"${eventTitles}"`
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `UGSOT_OpenSourceEvents_Students_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.app.showToast('Student database exported to CSV!', 'success');
  }

  resetAllData() {
    if (confirm('Reset all club events, sections, and students back to default sample state?')) {
      window.clubStore.resetToDefault();
      window.app.showToast('All data reset to factory defaults.', 'info');
      this.init();
      this.renderStats();
      this.switchTab(this.currentTab);
      window.eventsManager.renderEvents();
      window.countdownEngine.init();
    }
  }
}

window.adminDashboard = new AdminDashboard();
