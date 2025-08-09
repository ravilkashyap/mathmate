(async function(){
  const reviewsEls = [
    document.getElementById('gmapsReviews'),
    document.getElementById('homeGmapsReviews')
  ].filter(Boolean);
  const photosEls = [
    document.getElementById('gmapsPhotos'),
    document.getElementById('homeGmapsPhotos')
  ].filter(Boolean);
  if(reviewsEls.length===0 && photosEls.length===0) return;

  // Reviews
  try{
    const res = await fetch('/.netlify/functions/places-reviews');
    if(res.ok){
      const reviews = await res.json();
      reviewsEls.forEach(el=>{
        const max = el.id === 'homeGmapsReviews' ? 3 : 8;
        const slice = reviews.slice(0, max);
        if(slice.length===0){
          el.innerHTML = '<div class="text-sm text-gray-500">No reviews yet.</div>';
          return;
        }
        slice.forEach(r=>{
          const card = document.createElement('div');
          card.className = 'card';
          card.innerHTML = `<div class="flex items-center gap-2">
              <div class="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">${r.profile_photo_url?`<img src="${r.profile_photo_url}" alt="${r.author_name}" class="h-full w-full object-cover">`:''}</div>
              <div class="font-semibold">${r.author_name || 'Reviewer'}</div>
            </div>
            <div class="mt-2 text-sm">${r.text || ''}</div>
            <div class="mt-1 text-xs text-gray-500">Rating: ${r.rating || '—'} • ${r.relative_time_description || ''}</div>`;
          el.appendChild(card);
        });
      });
    }
  }catch(e){
    reviewsEls.forEach(el=>{ el.innerHTML = '<div class="text-sm text-gray-500">Reviews will appear after deployment.</div>'; });
  }

  // Photos become user-provided; show prompt if container exists
  photosEls.forEach(el=>{
    el.innerHTML = '<div class="text-sm text-gray-500">Add your photos to assets/img/gallery and we will show them here.</div>';
  });
})();
