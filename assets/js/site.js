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
})();
