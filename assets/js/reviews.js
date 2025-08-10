(function(){
  const wrap = document.getElementById('homeGmapsReviews');
  if(!wrap) return;
  function starText(n){
    const full = Math.round(n||0);
    return '★★★★★'.slice(0, full) + '☆☆☆☆☆'.slice(0, 5-full);
  }
  fetch('/.netlify/functions/places-reviews').then(r=>r.json()).then(reviews=>{
    if(!Array.isArray(reviews) || reviews.length===0){
      wrap.innerHTML = '<div class="text-sm text-gray-500">Reviews will appear after deployment.</div>';
      return;
    }
    reviews.slice(0,10).forEach(r=>{
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
        const p = e.target.previousElementSibling;
        const full = p.getAttribute('data-full');
        p.textContent = full;
        e.target.remove();
      }
    });
  }).catch(()=>{
    wrap.innerHTML = '<div class="text-sm text-gray-500">Reviews will appear after deployment.</div>';
  });
})();
