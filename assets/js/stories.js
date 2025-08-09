(async function(){
  const grid = document.getElementById('storiesGrid');
  if(!grid) return;
  try{
    const res = await fetch('/assets/data/stories.json');
    const stories = await res.json();
    if(!Array.isArray(stories) || stories.length===0){ grid.remove(); return; }
    stories.slice(0,6).forEach(s=>{
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <a href="${s.link||'#'}" class="block">
          <div class="aspect-[16/9] w-full overflow-hidden rounded mb-2">${s.image?`<img src="${s.image}" alt="${s.title}" class="w-full h-full object-cover">`:''}</div>
          <div class="text-xs text-gray-500">${s.date||''}</div>
          <h3 class="font-semibold mt-1">${s.title||''}</h3>
          <p class="text-sm text-gray-600 mt-1">${s.excerpt||''}</p>
          <span class="btn-link text-sm mt-2 inline-block">Read more →</span>
        </a>`;
      grid.appendChild(card);
    });
  }catch(e){ grid.remove(); }
})();
