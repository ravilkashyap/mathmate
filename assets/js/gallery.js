(
  async function(){
    const homeMasonry = document.getElementById('galleryMasonry');
    const galleryGrid = document.getElementById('galleryGrid');
    const tabs = document.querySelectorAll('[data-gallery-tab]');
    const showMoreBtn = document.getElementById('showMore');
    const pageInfo = document.getElementById('pageInfo');
    const prev = document.getElementById('prev');
    const next = document.getElementById('next');

    let allItems = [];
    try{
      const res = await fetch('/assets/data/gallery.json', { cache: 'no-store' });
      allItems = await res.json();
      if(!Array.isArray(allItems)) allItems = [];
    }catch{ allItems = []; }

    // Helper filters
    const onlyPhotos = () => allItems.filter(it => (it.type||'image') !== 'video');
    const onlyVideos = () => allItems.filter(it => (it.type||'image') === 'video');

    // Home preview (masonry highlights)
    if(homeMasonry){
      const highlights = onlyPhotos().slice(0, 12);
      highlights.forEach(it => {
        const img = document.createElement('img');
        img.src = it.src; img.alt = ''; img.loading = 'lazy'; img.className = 'w-full rounded';
        homeMasonry.appendChild(img);
      });
    }

    // Full gallery page with tabs and pagination
    if(galleryGrid){
      let filter = 'all';
      let items = allItems.slice();
      let page = 0; const pageSize = 24;

      function applyFilter(){
        if(filter==='photos') items = onlyPhotos();
        else if(filter==='videos') items = onlyVideos();
        else items = allItems.slice();
        page = 0;
        render();
      }

      function render(){
        galleryGrid.innerHTML='';
        const start = page*pageSize, end = start+pageSize;
        items.slice(start, end).forEach(it => {
          if((it.type||'image')==='video'){
            const wrap = document.createElement('div');
            wrap.className = 'relative';
            const v = document.createElement('video'); v.src = it.src; v.controls = true; v.preload = 'metadata'; v.className = 'w-full rounded';
            const badge = document.createElement('span'); badge.textContent = 'Video'; badge.className = 'absolute top-2 left-2 text-xs bg-black/70 text-white px-2 py-0.5 rounded';
            wrap.appendChild(v); wrap.appendChild(badge); galleryGrid.appendChild(wrap);
          } else {
            const img = document.createElement('img'); img.src = it.src; img.alt = ''; img.loading = 'lazy'; img.className = 'w-full rounded'; galleryGrid.appendChild(img);
          }
        });
        const pages = Math.ceil(items.length / pageSize) || 1;
        if(pageInfo) pageInfo.textContent = `Page ${page+1} / ${pages}`;
        if(prev) prev.disabled = (page===0); if(next) next.disabled = (page>=pages-1);
      }

      // Tabs click
      document.addEventListener('click', (e)=>{
        const t = e.target.closest('[data-gallery-tab]');
        if(!t) return;
        filter = t.dataset.galleryTab;
        document.querySelectorAll('[data-gallery-tab]').forEach(x=> x.classList.remove('ring-2'));
        t.classList.add('ring-2');
        applyFilter();
      });

      if(prev) prev.addEventListener('click', ()=>{ if(page>0){ page--; render(); window.scrollTo({top:0,behavior:'smooth'}); } });
      if(next) next.addEventListener('click', ()=>{ const pages=Math.ceil(items.length/pageSize)||1; if(page<pages-1){ page++; render(); window.scrollTo({top:0,behavior:'smooth'}); } });

      applyFilter();
    }
  }
)();
