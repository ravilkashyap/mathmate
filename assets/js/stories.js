(
  async function(){
    const grid = document.getElementById('storiesGrid');
    if(!grid) return;

    function deriveTitle(item){
      const rawTitle = (item.title||'').trim();
      if(rawTitle && rawTitle.toLowerCase() !== 'update') return rawTitle;
      let source = (item.excerpt || item.text || '').trim();
      if(!source) return 'Math‑Mate Update';
      // Take first sentence or first line
      let candidate = source.split(/[.!?]\s|\n/)[0] || source.slice(0,80);
      // Clean quotes and excessive punctuation
      candidate = candidate.replace(/^\s*["'“”‘’]+|["'“”‘’]+\s*$/g,'');
      // Friendly tweaks
      const tweaks = [
        [/Visualization of\s+/i, 'Visualising '],
        [/An Educational Trip to\s+/i, 'Visit to '],
        [/Teaching Aids for\s+/i, 'Hands‑on '],
        [/Trekking and Nature Exploration!?/i, 'Trek & Nature Walk'],
        [/Fun Activities!?/i, 'Fun Activities Day'],
        [/Visited\s+/i, 'Visit: ']
      ];
      for(const [re, rep] of tweaks){ candidate = candidate.replace(re, rep); }
      if(candidate.length > 72) candidate = candidate.slice(0,69).replace(/\s+\S*$/, '') + '…';
      return candidate;
    }

    async function fetchUpdates(){
      try{ const r = await fetch('/assets/data/updates.json', { cache: 'no-store' }); if(!r.ok) return []; return await r.json(); }catch{return []}
    }
    async function fetchLocal(){
      try{ const r = await fetch('/assets/data/stories.json', { cache: 'no-store' }); if(!r.ok) return []; return await r.json(); }catch{return []}
    }

    const updates = await fetchUpdates();
    const items = updates.length? updates : (await fetchLocal());
    if(!items.length){ grid.innerHTML = '<div class="text-gray-500">No updates yet.</div>'; return; }

    items.slice(0,6).forEach((s, idx)=>{
      const id = s.id || `u-${(s.title||'').slice(0,20).replace(/[^a-z0-9]+/gi,'-').toLowerCase() || 'item'}-${idx+1}`;
      const card = document.createElement('article');
      card.className = 'card';
      const img = s.image || (Array.isArray(s.media)&&s.media[0]?.src) || '';
      const title = deriveTitle(s);
      card.innerHTML = `
        <a href="/pages/updates.html#${id}" class="block">
          <div class="aspect-[16/9] w-full overflow-hidden rounded mb-2">${img?`<img src="${img}" alt="${title}" class="w-full h-full object-cover" loading="lazy">`:''}</div>
          <div class="text-xs text-gray-500">${s.date? new Date(s.date).toLocaleDateString():''}</div>
          <h3 class="font-semibold mt-1">${title}</h3>
          <p class="text-sm text-gray-600 mt-1">${s.excerpt||''}</p>
          <span class="btn-link text-sm mt-2 inline-block">Read more →</span>
        </a>`;
      grid.appendChild(card);
    });
  }
)();
