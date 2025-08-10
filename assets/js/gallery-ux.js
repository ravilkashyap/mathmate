(function(){
  const masonry = document.getElementById('galleryMasonry');
  const lightbox = document.getElementById('lightbox');
  if(!masonry || !lightbox) return;
  const imgTag = lightbox.querySelector('img');
  let previousActiveElement = null;

  // Delegate clicks for images once gallery.js has populated the DOM
  document.addEventListener('click', (e)=>{
    if(e.target.closest('#galleryMasonry img')){
      const img = e.target.closest('img');
      imgTag.src = img.src;
      lightbox.classList.add('open');
      previousActiveElement = document.activeElement;
      lightbox.setAttribute('role','dialog');
      lightbox.setAttribute('aria-modal','true');
      lightbox.tabIndex = -1;
      lightbox.focus();
    }
    if(e.target===lightbox){
      lightbox.classList.remove('open');
      imgTag.src = '';
      lightbox.removeAttribute('role');
      lightbox.removeAttribute('aria-modal');
      if(previousActiveElement && typeof previousActiveElement.focus==='function') previousActiveElement.focus();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e)=>{
    if(e.key==='Escape' && lightbox.classList.contains('open')){
      lightbox.classList.remove('open');
      imgTag.src = '';
      if(previousActiveElement && typeof previousActiveElement.focus==='function') previousActiveElement.focus();
    }
  });
})();
