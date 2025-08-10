(function(){
  const wrap = document.getElementById('homeGmapsReviews');
  if(!wrap) return;
  function starText(n){
    const full = Math.round(n||0);
    return '★★★★★'.slice(0, full) + '☆☆☆☆☆'.slice(0, 5-full);
  }
  async function renderList(list){
    list.slice(0,10).forEach(r=>{
      const card = document.createElement('article');
      card.className = 'card review-card';
      const text = (r.text||'').trim();
      const short = text.length>180 ? text.slice(0,180)+'…' : text;
      card.innerHTML = `
        <div class="flex items-center gap-2">
          <div class="h-8 w-8 rounded-full overflow-hidden bg-gray-200">${r.profile_photo_url?`<img src="${r.profile_photo_url}" alt="${r.author_name||'Reviewer'} profile photo" class="h-full w-full object-cover" loading="lazy">`:''}</div>
          <div>
            <div class="font-semibold">${r.author_name||'Reviewer'}</div>
            <div class="stars text-sm">${starText(r.rating)}</div>
          </div>
        </div>
        <p class="mt-2 text-sm" data-full="${text.replace(/"/g,'&quot;')}">${short}</p>
        ${text.length>180?'<button class="btn-link text-xs mt-1">Read more</button>':''}
      `;
      wrap.appendChild(card);
    });
    wrap.addEventListener('click', (e)=>{
      if(e.target.matches('button.btn-link')){
        const p = e.target.previousElementSibling; const full = p.getAttribute('data-full'); p.textContent = full; e.target.remove();
      }
    });
  }

  (async ()=>{
    try{
      const r = await fetch('/.netlify/functions/places-reviews', { cache: 'no-store' });
      const reviews = await r.json();
      if(Array.isArray(reviews) && reviews.length){ await renderList(reviews); return; }
    }catch{}
    // Fallback for local dev
    try{
      const r2 = await fetch('/assets/data/reviews.json', { cache: 'no-store' });
      const local = await r2.json();
      if(Array.isArray(local) && local.length){ await renderList(local); return; }
    }catch{}
    wrap.innerHTML = '<div class="text-sm text-gray-500">No reviews to show yet.</div>';
  })();
})();
