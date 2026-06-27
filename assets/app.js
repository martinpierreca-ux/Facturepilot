(function(){
  // header shadow on scroll
  var h=document.querySelector('.site-header');
  var onScroll=function(){ if(h) h.classList.toggle('scrolled', window.scrollY>10); };
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  // reveal on scroll
  var sel='.section-head,.card,.step,.stat,.guide-card,.faq details,.cta-banner,.aff-box,.ebook,.adslot,.bank-card,.cp-table,.prod,.ladder,.disclosure';
  var els=[].slice.call(document.querySelectorAll(sel)).filter(function(e){
    return !e.closest('.hero') && !e.closest('.shop-hero') && !e.closest('.cp-hero');
  });
  els.forEach(function(e,i){ e.classList.add('reveal'); if(i%3) e.classList.add('d'+(i%3)); });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(ents){
      ents.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target);} });
    }, {rootMargin:'0px 0px -8% 0px'});
    els.forEach(function(e){ io.observe(e); });
  } else { els.forEach(function(e){ e.classList.add('in'); }); }

  // count up
  var counters=document.querySelectorAll('[data-count]');
  function run(el){
    var to=+el.dataset.count, suf=el.dataset.suffix||'', t0=null, dur=1100;
    function step(ts){ if(!t0)t0=ts; var p=Math.min((ts-t0)/dur,1);
      el.textContent=Math.round((0.5-Math.cos(p*Math.PI)/2)*to)+suf; if(p<1)requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  if('IntersectionObserver' in window){
    var io2=new IntersectionObserver(function(ents){ ents.forEach(function(en){ if(en.isIntersecting){ run(en.target); io2.unobserve(en.target);} }); });
    counters.forEach(function(c){ io2.observe(c); });
  } else { counters.forEach(run); }

  // hero card parallax (homepage only)
  var card=document.querySelector('.inv-card'), hv=document.querySelector('.hero-visual');
  if(card && hv && matchMedia('(pointer:fine)').matches){
    hv.addEventListener('mousemove', function(e){
      var r=hv.getBoundingClientRect(); var x=(e.clientX-r.left)/r.width-0.5, y=(e.clientY-r.top)/r.height-0.5;
      card.style.transform='rotateY('+(-12+x*10)+'deg) rotateX('+(6-y*10)+'deg)';
    });
    hv.addEventListener('mouseleave', function(){ card.style.transform=''; });
  }
})();
