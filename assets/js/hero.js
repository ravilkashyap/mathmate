(function(){
  const hero = document.getElementById('hero');
  if(!hero) return;
  const bgWrap = hero.querySelector('.bg-wrap');
  const dots = hero.querySelector('.dots');

  const fallback = [
    'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2000&auto=format&fit=crop'
  ];

  async function loadImages(){
    try{
      const r = await fetch('/assets/data/slides.json', { cache: 'no-store' });
      if(!r.ok) throw new Error('no slides');
      const data = await r.json();
      const imgs = Array.isArray(data) ? data.map(s => s.image).filter(Boolean) : [];
      return imgs.length ? imgs : fallback;
    }catch{ return fallback; }
  }

  function render(images){
    images.forEach((src, i)=>{
      const d = document.createElement('button');
      d.setAttribute('aria-label', `Go to slide ${i+1}`);
      d.addEventListener('click', ()=> go(i));
      dots.appendChild(d);

      const div = document.createElement('div');
      div.className = 'hero-bg';
      div.style.backgroundImage = `url(${src})`;
      bgWrap.appendChild(div);
    });

    go(0); auto();
  }

  let index = 0, timer = 0, isHover = false;
  function update(){
    const total = bgWrap.children.length;
    [...bgWrap.children].forEach((el, i)=> el.classList.toggle('is-active', i===index));
    [...dots.children].forEach((d, i)=> d.setAttribute('aria-current', i===index? 'true':'false'));
  }
  function go(i){ index = (i + bgWrap.children.length) % bgWrap.children.length; update(); }
  function next(){ go(index+1); }

  hero.addEventListener('mouseenter', ()=> isHover = true);
  hero.addEventListener('mouseleave', ()=> isHover = false);
  hero.tabIndex = 0;
  hero.addEventListener('keydown', e=>{ if(e.key==='ArrowRight') next(); if(e.key==='ArrowLeft') go(index-1); });
  function auto(){
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce) return;
    clearInterval(timer);
    timer = setInterval(()=>{ if(!isHover) next(); }, 5000);
  }

  loadImages().then(render);
})();
