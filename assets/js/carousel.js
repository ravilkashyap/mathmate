(function(){
  const track = document.getElementById('carouselTrack');
  if(!track) return;
  const status = document.getElementById('carouselStatus');
  const dotsWrap = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const root = document.getElementById('carousel');

  const fallbackSlides = [
    { image: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1800&auto=format&fit=crop', title: 'Vedic Maths Workshop', description: 'Rapid multiplication tricks for faster problem‑solving.', link: '/pages/method.html' },
    { image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1800&auto=format&fit=crop', title: 'Chapter‑Wise Tests', description: 'Regular assessments to track progress.', link: '/pages/courses.html' },
    { image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1800&auto=format&fit=crop', title: 'Doubt‑Clearing Sessions', description: 'Small batches for personal attention.', link: '/pages/contact.html' }
  ];

  async function loadSlides(){
    try{
      const res = await fetch('/assets/data/slides.json');
      if(!res.ok) throw new Error('no slides json');
      const data = await res.json();
      if(!Array.isArray(data) || data.length===0) return fallbackSlides;
      return data;
    }catch(e){
      return fallbackSlides;
    }
  }

  function render(slides){
    slides.forEach((s, idx)=>{
      const li = document.createElement('li');
      li.innerHTML = `
        <a href="${s.link || '#'}" class="block h-full w-full relative">
          <img src="${s.image}" alt="${s.title || ''}" loading="lazy" class="h-full w-full object-cover"/>
          <div class="caption">
            <div class="title text-lg md:text-2xl">${s.title || ''}</div>
            <p class="text-xs md:text-sm opacity-90">${s.description || ''}</p>
          </div>
        </a>`;
      track.appendChild(li);

      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Go to slide ${idx+1}`);
      dot.addEventListener('click', ()=> goTo(idx));
      dotsWrap.appendChild(dot);
    });

    setStatus(); autoplay();
  }

  let index = 0; let timer = 0; let isHovered = false; let isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setStatus(){
    const total = dotsWrap.children.length || 1;
    status.textContent = `Slide ${index+1} of ${total}`;
    [...dotsWrap.children].forEach((d,i)=> d.setAttribute('aria-current', i===index ? 'true':'false'));
  }
  function goTo(i){
    const total = dotsWrap.children.length || 1;
    index = (i+total)%total;
    const offset = -index * 100;
    track.style.transform = `translateX(${offset}%)`;
    setStatus();
  }
  function next(){ goTo(index+1); }
  function prev(){ goTo(index-1); }

  nextBtn?.addEventListener('click', next);
  prevBtn?.addEventListener('click', prev);

  root.addEventListener('mouseenter', ()=>{ isHovered = true; });
  root.addEventListener('mouseleave', ()=>{ isHovered = false; });

  root.tabIndex = 0;
  root.addEventListener('keydown', (e)=>{
    if(e.key==='ArrowRight') next();
    if(e.key==='ArrowLeft') prev();
  });

  // Touch swipe
  let startX=0;
  root.addEventListener('touchstart', (e)=>{ startX = e.touches[0].clientX; }, {passive:true});
  root.addEventListener('touchmove', (e)=>{
    const dx = e.touches[0].clientX - startX;
    if(Math.abs(dx) > 60){
      if(dx<0) next(); else prev();
      startX = e.touches[0].clientX;
    }
  }, {passive:true});

  function autoplay(){
    if(isReducedMotion) return;
    clearInterval(timer);
    timer = setInterval(()=>{ if(!isHovered) next(); }, 4500);
  }

  loadSlides().then(render).then(()=> goTo(0));
})();
