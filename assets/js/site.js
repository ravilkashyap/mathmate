(async function(){
  // Footer year (set after injection as well)
  function setYear(){ const y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear(); }

  // Shared header injection for consistency
  const header = document.querySelector('header[data-shared]');
  if(header){
    try{ const res = await fetch('/assets/partials/header.html'); if(res.ok){ header.outerHTML = await res.text(); } }catch(e){}
  }

  // Shared footer injection
  const footer = document.querySelector('footer[data-shared]');
  if(footer){
    try{ const res = await fetch('/assets/partials/footer.html'); if(res.ok){ footer.outerHTML = await res.text(); setYear(); } }catch(e){ setYear(); }
  } else { setYear(); }

  // Mobile nav toggle
  function initMobileNav(){
    const toggle = document.querySelector('[data-menu-toggle]');
    const menu = document.getElementById('mobileNav');
    if(!toggle || !menu) return;
    function closeOnEscape(e){ if(e.key==='Escape'){ menu.classList.add('hidden'); toggle.setAttribute('aria-expanded','false'); toggle.focus(); document.removeEventListener('keydown', closeOnEscape); } }
    toggle.addEventListener('click', ()=>{
      const isOpen = !menu.classList.contains('hidden');
      if(isOpen){ menu.classList.add('hidden'); toggle.setAttribute('aria-expanded','false'); document.removeEventListener('keydown', closeOnEscape); }
      else { menu.classList.remove('hidden'); toggle.setAttribute('aria-expanded','true'); document.addEventListener('keydown', closeOnEscape); }
    });
  }
  // Delay a tick to ensure header is injected
  setTimeout(initMobileNav, 0);
})();
