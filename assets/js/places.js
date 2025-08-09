(async function(){
  const photosEls = [
    document.getElementById('gmapsPhotos'),
    document.getElementById('homeGmapsPhotos')
  ].filter(Boolean);
  const reviewsEls = [
    document.getElementById('gmapsReviews'),
    document.getElementById('homeGmapsReviews')
  ].filter(Boolean);
  if(photosEls.length===0 && reviewsEls.length===0) return;

  try{
    const [photosRes, reviewsRes] = await Promise.all([
      fetch('/.netlify/functions/places-photos'),
      fetch('/.netlify/functions/places-reviews')
    ]);

    if(photosRes.ok){
      const photos = await photosRes.json();
      photosEls.forEach(el=>{
        const max = el.id === 'homeGmapsPhotos' ? 6 : 12;
        const slice = photos.slice(0, max);
        if(slice.length===0){
          el.innerHTML = '<div class="text-sm text-gray-500">No photos yet.</div>';
          return;
        }
        slice.forEach(url=>{
          const img = document.createElement('img');
          img.src = url; img.loading = 'lazy'; img.alt = 'Google Maps photo';
          img.className = 'w-full h-40 md:h-48 object-cover rounded';
          el.appendChild(img);
        });
      });
    }

    if(reviewsRes.ok){
      const reviews = await reviewsRes.json();
      reviewsEls.forEach(el=>{
        const max = el.id === 'homeGmapsReviews' ? 3 : 6;
        const slice = reviews.slice(0, max);
        if(slice.length===0){
          el.innerHTML = '<div class="text-sm text-gray-500">No reviews yet.</div>';
          return;
        }
        slice.forEach(r=>{
          const card = document.createElement('div');
          card.className = 'card';
          const stars = '★★★★★☆☆☆☆☆'.slice(5 - Math.round(r.rating || 0), 10 - Math.round(r.rating || 0));
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
  } catch(e){
    photosEls.forEach(el=>{ el.innerHTML = '<div class="text-sm text-gray-500">Photos will appear after deployment.</div>'; });
    reviewsEls.forEach(el=>{ el.innerHTML = '<div class="text-sm text-gray-500">Reviews will appear after deployment.</div>'; });
  }
})();
