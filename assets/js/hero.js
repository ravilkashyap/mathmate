(function(){
  const hero = document.getElementById('hero');
  if(!hero) return;
  const images = [
    'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2000&auto=format&fit=crop'
  ];
  const bgWrap = hero.querySelector('.bg-wrap');
  const dots = hero.querySelector('.dots');
  let index = 0; let timer = 0; let isHover = false;

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

  function update(){
    [...bgWrap.children].forEach((el, i)=> el.classList.toggle('is-active', i===index));
    [...dots.children].forEach((d, i)=> d.setAttribute('aria-current', i===index? 'true':'false'));
  }
  function go(i){ index = (i+images.length)%images.length; update(); }
  function next(){ go(index+1); }

  hero.addEventListener('mouseenter', ()=> isHover=true);
  hero.addEventListener('mouseleave', ()=> isHover=false);
  hero.tabIndex = 0;
  hero.addEventListener('keydown', e=>{ if(e.key==='ArrowRight') next(); if(e.key==='ArrowLeft') go(index-1); });

  function auto(){ clearInterval(timer); timer = setInterval(()=>{ if(!isHover) next(); }, 5000); }

  go(0); auto();
})();
