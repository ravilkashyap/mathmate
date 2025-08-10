(async function(){
  const grid = document.getElementById('storiesGrid');
  if(!grid) return;

  async function fetchGbp(){
    try{ const r = await fetch('/.netlify/functions/gbp-posts'); if(!r.ok) return []; return await r.json(); }catch{ return []; }
  }
  async function fetchLocal(){
    try{ const r = await fetch('/assets/data/stories.json'); if(!r.ok) return []; return await r.json(); }catch{ return []; }
  }

  const posts = (await fetchGbp());
  const items = posts.length? posts : (await fetchLocal());
  if(!items.length){ grid.remove(); return; }

  items.slice(0,6).forEach(s=>{
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <a href="${s.link||'#'}" class="block">
        <div class="aspect-[16/9] w-full overflow-hidden rounded mb-2">${s.image?`<img src="${s.image}" alt="${s.title||'Update'}" class="w-full h-full object-cover">`:''}</div>
        <div class="text-xs text-gray-500">${s.date? new Date(s.date).toLocaleDateString():''}</div>
        <h3 class="font-semibold mt-1">${s.title||'Update'}</h3>
        <p class="text-sm text-gray-600 mt-1">${s.excerpt||''}</p>
        ${s.link?'<span class="btn-link text-sm mt-2 inline-block">View →</span>':''}
      </a>`;
    grid.appendChild(card);
  });
})();
