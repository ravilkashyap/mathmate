(async function(){
  const grid = document.getElementById('galleryGrid');
  const home = document.getElementById('homeGmapsPhotos');
  if(!grid && !home) return;

  const fallback = [
    'https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1529101091764-c3526daf38fe?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518131678677-a44a8b1d1ad1?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1523246191598-0a2a53b84d7b?q=80&w=1200&auto=format&fit=crop'
  ];

  async function load(){
    try{
      const res = await fetch('/assets/data/gallery.json');
      if(!res.ok) throw new Error('no gallery');
      const arr = await res.json();
      return Array.isArray(arr) && arr.length ? arr : fallback;
    }catch(e){
      return fallback;
    }
  }

  const images = await load();
  const render = (container, list, max)=>{
    if(!container) return;
    container.innerHTML = '';
    list.slice(0,max).forEach(src=>{
      const img = document.createElement('img');
      img.src = src; img.loading = 'lazy'; img.alt = 'Gallery photo';
      img.className = 'w-full h-40 md:h-48 object-cover rounded';
      container.appendChild(img);
    });
  };

  render(grid, images, 12);
  render(home, images, 6);
})();
