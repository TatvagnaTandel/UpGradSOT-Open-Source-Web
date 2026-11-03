/** Accessible dialog lifecycle shared by every static page. */
(function(){
  'use strict';
  const focusSelector='button:not([disabled]),a[href],input:not([disabled]),select,textarea,[tabindex="0"]';
  const UI={current:null,origin:null,background:new Map(),installed:false,
    escape(value){return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));},
    safeUrl(value){try{const url=new URL(value);return url.protocol==='https:'&&!url.username&&!url.password?url.href:null;}catch{return null;}},
    focusables(){return this.current?[...this.current.querySelectorAll(focusSelector)].filter(e=>!e.hidden&&e.getAttribute('aria-hidden')!=='true'&&(typeof e.getClientRects!=='function'||e.getClientRects().length)):[];},
    openModal(modal){
      if(!modal||this.current===modal)return;
      if(!this.current)this.origin=document.activeElement;
      else {this.current.classList.remove('active');window.threePassViewer?.destroy();}
      this.current=modal;
      for(const child of document.body.children){if(!this.background.has(child))this.background.set(child,child.inert);child.inert=child!==modal;}
      modal.inert=false;modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');
      if(!modal.hasAttribute('aria-label')&&!modal.hasAttribute('aria-labelledby'))modal.setAttribute('aria-label','Program information');
      modal.classList.add('active');
      (modal.querySelector('[data-modal-heading]')||this.focusables()[0]||modal).focus();
    },
    closeAll(){
      const previous=this.current;if(!previous)return;
      previous.classList.remove('active');this.current=null;
      this.background.forEach((inert,node)=>{node.inert=inert;});this.background.clear();
      window.threePassViewer?.destroy();
      this.onClose?.(previous);
      const replacement=this.origin?.dataset?.action?[...document.querySelectorAll('[data-action]')].find(node=>node.dataset.action===this.origin.dataset.action&&node.dataset.id===this.origin.dataset.id):null;
      const target=this.origin?.isConnected?this.origin:replacement||document.querySelector('#nav-user-area button');
      target?.focus();this.origin=null;
    },
    install(){
      if(this.installed)return;this.installed=true;
      document.addEventListener('keydown',event=>{
        if(!this.current)return;
        if(event.key==='Escape'){event.preventDefault();this.closeAll();return;}
        if(event.key==='Tab'){
          const controls=this.focusables();const first=controls[0],last=controls[controls.length-1];
          if(!first){event.preventDefault();return;}
          if(event.shiftKey&&(document.activeElement===first||!controls.includes(document.activeElement))){event.preventDefault();last.focus();}
          else if(!event.shiftKey&&(document.activeElement===last||!controls.includes(document.activeElement))){event.preventDefault();first.focus();}
        }
      });
      document.addEventListener('click',event=>{
        if(!this.current)return;
        if(event.target===this.current||event.target.closest?.('.modal-close-btn'))this.closeAll();
      });
      // Adopt dialogs opened by the retained admin/fest controllers as well.
      new MutationObserver(records=>records.forEach(({target})=>{
        if(target.matches?.('.modal')&&target.classList.contains('active')&&this.current!==target)this.openModal(target);
      })).observe(document.body,{attributes:true,attributeFilter:['class'],subtree:true});
    }
  };
  window.PortalUI=UI;
})();
