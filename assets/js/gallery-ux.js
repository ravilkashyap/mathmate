(function(){
  const masonry = document.getElementById('galleryMasonry');
  const lightbox = document.getElementById('lightbox');
  if(!masonry || !lightbox) return;
  const imgTag = lightbox.querySelector('img');

  // Delegate clicks for images once gallery.js has populated the DOM
  document.addEventListener('click', (e)=>{
    if(e.target.closest('#galleryMasonry img')){
      const img = e.target.closest('img');
      imgTag.src = img.src;
      lightbox.classList.add('open');
    }
    if(e.target===lightbox){
      lightbox.classList.remove('open');
      imgTag.src = '';
    }
  });
})();
