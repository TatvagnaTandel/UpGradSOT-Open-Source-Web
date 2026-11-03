/** Explicit browser-local demo profiles; no password or production authentication. */
class AuthManager {
  init(){this.updateUserUI();}
  openAuthModal(){
    const modal=document.getElementById('auth-modal'),content=document.getElementById('auth-modal-content');if(!modal||!content)return;
    content.innerHTML='<h2 id="demo-auth-title" tabindex="-1" data-modal-heading>Explore the portal</h2><p class="demo-auth-copy">Choose a sample profile. No account or password is created. Changes stay in this browser.</p><div class="demo-auth-actions"><button class="btn btn-primary" data-role="student">Try student demo</button><button class="btn btn-outline" data-role="admin">Try admin demo</button></div>';
    content.querySelectorAll('[data-role]').forEach(button=>button.addEventListener('click',()=>{this.quickSwitch(button.dataset.role);window.PortalUI.closeAll();if(button.dataset.role==='admin')window.location.href='admin.html';}));
    modal.setAttribute('aria-labelledby','demo-auth-title');window.PortalUI.openModal(modal);
  }
  quickSwitch(role){window.clubStore.switchRole(role);this.updateUserUI();window.eventsManager?.renderEvents();window.countdownEngine?.renderEventBannerDetails();window.app?.showToast('Sample profile selected. This does not grant production access.','info');if(window.PortalUI.current?.id==='user-profile-modal')this.renderProfile();}
  logout(){window.clubStore.setCurrentUser(null);this.updateUserUI();window.PortalUI.closeAll();window.eventsManager?.renderEvents();window.countdownEngine?.renderEventBannerDetails();window.app?.showToast('Signed out of the sample profile.','info');}
  updateUserUI(){
    const area=document.getElementById('nav-user-area');if(!area)return;const user=window.clubStore.getCurrentUser(),esc=window.PortalUI.escape;
    if(user){const initials=user.name.split(' ').map(n=>n[0]).join('').slice(0,2);area.innerHTML=`<button class="user-pill-badge" type="button" aria-label="Open sample profile"><span class="user-avatar-circle">${esc(initials)}</span><span class="user-text-meta"><span class="user-name">${esc(user.name.split(' ')[0])}</span><span class="user-role-tag">${user.role==='admin'?'ADMIN DEMO':'STUDENT DEMO'}</span></span></button>`;area.querySelector('button').addEventListener('click',()=>this.openProfileModal());}
    else{area.innerHTML='<button class="btn btn-outline btn-sm" type="button">Explore demo</button>';area.querySelector('button').addEventListener('click',()=>this.openAuthModal());}
  }
  openProfileModal(){if(!window.clubStore.getCurrentUser())return;this.renderProfile();window.PortalUI.openModal(document.getElementById('user-profile-modal'));}
  renderProfile(){
    const user=window.clubStore.getCurrentUser(),content=document.getElementById('user-profile-content');if(!user||!content)return;const esc=window.PortalUI.escape;
    const events=window.clubStore.getEvents().filter(e=>user.rsvps?.includes(e.id));
    content.innerHTML=`<h2 id="sample-profile-title" tabindex="-1" data-modal-heading>Your sample profile</h2><p class="demo-auth-copy">${esc(user.name)} · ${esc(user.year)}<br>Browser-local demo · ${Number(user.devXp)||0} sample XP. Not an organizer registration.</p><h3>Saved programs (${events.length})</h3><div class="profile-rsvps-list">${events.length?events.map(e=>`<div class="profile-rsvp-card"><div><strong>${esc(e.title)}</strong><p class="text-muted small">${esc(e.dateBadge||'Dates not verified')}</p></div><button class="btn btn-outline btn-sm" data-pass="${esc(e.id)}">Sample pass</button></div>`).join(''):'<p>No saved programs yet. Explore the directory to try a sample RSVP.</p>'}</div><div class="profile-modal-footer"><button class="btn btn-outline" data-switch>Try ${user.role==='admin'?'student':'admin'} demo</button><button class="btn btn-primary" data-logout>Sign out</button></div>`;
    content.querySelectorAll('[data-pass]').forEach(button=>button.addEventListener('click',()=>window.eventsManager.openHackerPassModal(button.dataset.pass,user)));
    content.querySelector('[data-switch]').addEventListener('click',()=>this.quickSwitch(user.role==='admin'?'student':'admin'));
    content.querySelector('[data-logout]').addEventListener('click',()=>this.logout());
  }
}
window.authManager=new AuthManager();
