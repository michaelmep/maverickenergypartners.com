
(function(){
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target);}});},{threshold:0.1,rootMargin:'0px 0px -10% 0px'}) : null;
  document.querySelectorAll('.fade-in').forEach(function(el){ if(io) io.observe(el); else el.classList.add('is-visible'); });
  var t=document.querySelector('[data-nav-toggle]'), l=document.getElementById('nav-links');
  if(t&&l){ t.addEventListener('click',function(){ var o=l.classList.toggle('open'); t.setAttribute('aria-expanded',o?'true':'false'); t.textContent=o?'CLOSE':'MENU'; }); }
  document.querySelectorAll('form[data-mailto]').forEach(function(f){
    var seg=f.querySelector('.form-segmented'); var roleInput=f.querySelector('input[name=role]');
    function setRole(r){ if(roleInput) roleInput.value=r; f.querySelectorAll('[data-role]').forEach(function(g){ g.style.display = g.getAttribute('data-role')===r?'':'none'; g.querySelectorAll('input,select,textarea').forEach(function(i){ i.disabled = g.getAttribute('data-role')!==r; }); }); if(seg) seg.querySelectorAll('button').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-set-role')===r); }); }
    if(seg){ seg.querySelectorAll('button').forEach(function(b){ b.addEventListener('click',function(){ setRole(b.getAttribute('data-set-role')); }); }); }
    var q=new URLSearchParams(location.search).get('role'); setRole(q||(roleInput?roleInput.value:'landowner'));
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var lines=[]; var name='';
      f.querySelectorAll('input:not([disabled]),select:not([disabled]),textarea:not([disabled])').forEach(function(i){ if(i.type==='hidden'&&i.name!=='role') return; var v=(i.value||'').trim(); if(!v) return; var lab=i.getAttribute('data-label')||i.name; if(i.name==='name') name=v; lines.push(lab+': '+v); });
      var subj=encodeURIComponent((f.getAttribute('data-subject')||'Website inquiry')+(name?' — '+name:''));
      var body=encodeURIComponent(lines.join('\n')+'\n\nSent from '+location.href);
      var s=f.querySelector('.form-status'); var btn=f.querySelector('button[type=submit]');
      function msg(t){ if(s){ s.textContent=t; s.style.display='block'; } }
      var hp=f.querySelector('input[name=_honey]'); if(hp&&hp.value) return;
      var data={_subject:decodeURIComponent(subj), _template:'table', page:location.href};
      f.querySelectorAll('input:not([disabled]),select:not([disabled]),textarea:not([disabled])').forEach(function(i){ if(!i.name||i.name==='_honey') return; var v=(i.value||'').trim(); if(v) data[i.getAttribute('data-label')||i.name]=v; });
      if(btn){ btn.disabled=true; } msg('Sending...');
      fetch('https://formsubmit.co/ajax/info@maverickenergypartners.com',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)})
        .then(function(r){ return r.json().then(function(j){ if(!r.ok||String(j.success)!=='true') throw 0; }); })
        .then(function(){ f.reset(); setRole(roleInput?roleInput.value:'landowner'); msg('Thank you. We received your details and will reply within one business day.'); if(window.gtag) gtag('event','generate_lead',{form_subject:f.getAttribute('data-subject')||''}); })
        .catch(function(){ msg('Could not send automatically. Opening your email app instead.'); window.location.href='mailto:info@maverickenergypartners.com?subject='+subj+'&body='+body; })
        .then(function(){ if(btn){ btn.disabled=false; } });
    });
  });
})();
