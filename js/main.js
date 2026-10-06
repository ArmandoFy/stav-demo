(function (){
'use strict';
var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.add('js-ready');
var $=function (s,c){return (c||document).querySelector(s);};
var $$=function (s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s));};
var hdr=$('.hdr');
var bar=$('.progress');
var ticking=false;
function onScroll(){
if (ticking) return;
ticking=true;
requestAnimationFrame(function (){
var y=window.scrollY||0;
if (hdr) hdr.classList.toggle('scrolled',y>24);
if (bar){
var max=document.documentElement.scrollHeight - window.innerHeight;
bar.style.transform='scaleX(' + (max>0?Math.min(y / max,1):0) + ')';
}
ticking=false;
});
}
window.addEventListener('scroll',onScroll,{passive:true});
onScroll();
var toggle=$('.nav-toggle');
var nav=$('#nav');
if (toggle&&nav){
toggle.addEventListener('click',function (){
var open=nav.classList.toggle('open');
toggle.setAttribute('aria-expanded',String(open));
toggle.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');
});
nav.addEventListener('click',function (e){
var a=e.target.closest('a');
if (a){
nav.classList.remove('open');
toggle.setAttribute('aria-expanded','false');
}
});
}
function docTop(el){var t=0;while (el){t +=el.offsetTop;el=el.offsetParent;}return t;}
function anchorY(target){
var h=hdr?hdr.offsetHeight:0;
var avail=window.innerHeight - h;
if (target.tagName!=='SECTION') return Math.max(0,Math.round(docTop(target) - h - 24));
var focus=target.querySelector('[data-focus]')||target.querySelector('.wrap')||target;
var top=docTop(focus),height=focus.offsetHeight;
var y=(height + 48<=avail)?top - h - (avail - height) / 2:top - h - 36;
return Math.max(0,Math.round(y));
}
var normPath=function (p){return p.replace(/index\.html$/,'');};
document.addEventListener('click',function (e){
var a=e.target.closest('a[href*="#"]');
if (!a||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target==='_blank') return;
var url;
try{url=new URL(a.href,window.location.href);}catch (err){return;}
if (url.origin!==window.location.origin||normPath(url.pathname)!==normPath(window.location.pathname)) return;
var id=decodeURIComponent(url.hash.slice(1));
if (id==='top'){
e.preventDefault();
window.scrollTo({top:0,behavior:reduce?'auto':'smooth'});
return;
}
if (!id||id==='contenido') return;
var target=document.getElementById(id);
if (!target) return;
e.preventDefault();
window.scrollTo({top:anchorY(target),behavior:reduce?'auto':'smooth'});
if (window.history&&history.pushState) history.pushState(null,'','#' + id);
});
if (window.location.hash.length>1){
var hashTarget=document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
if (hashTarget&&hashTarget.id!=='top'&&hashTarget.id!=='contenido'){
window.addEventListener('load',function (){
setTimeout(function (){window.scrollTo({top:anchorY(hashTarget),left:0,behavior:'instant'});},80);
});
}
}
var year=$('#year');
if (year) year.textContent=new Date().getFullYear();
var eq=$('#eq');
if (eq){
var n=window.innerWidth<640?28:64;
var frag=document.createDocumentFragment();
for (var i=0;i<n;i++){
var s=document.createElement('span');
var hi=0.28 + 0.72*Math.abs(Math.sin(i*0.55)*Math.cos(i*0.19 + 1));
s.style.setProperty('--hi',hi.toFixed(2));
s.style.setProperty('--lo',(hi*0.28).toFixed(2));
s.style.setProperty('--d',(0.9 + ((i*37)%17) / 14).toFixed(2) + 's');
s.style.setProperty('--dl',(-((i*53)%23) / 10).toFixed(2) + 's');
frag.appendChild(s);
}
eq.appendChild(frag);
}
function loadBg(el){
var v=el&&el.getAttribute('data-bg');
if (v){el.style.backgroundImage=v;el.removeAttribute('data-bg');}
}
var lazyGroups=[['[data-bento]','.svc-bg'],['.sp','.sp-slide:first-child .sp-bg']];
lazyGroups.forEach(function (g){
var root=$(g[0]);
if (!root) return;
var load=function (){$$(g[1],root).forEach(loadBg);};
if ('IntersectionObserver' in window){
var lio=new IntersectionObserver(function (en){
if (en[0].isIntersecting){load();lio.disconnect();}
},{rootMargin:'700px 0px'});
lio.observe(root);
}else{load();}
});
var rot=$('[data-rot]');
if (rot&&!reduce){
var words=$$('span',rot),cur=0,timer=null;
var step=function (){
var prev=words[cur];
cur=(cur + 1)%words.length;
var next=words[cur];
prev.classList.remove('on');prev.classList.add('out');prev.setAttribute('aria-hidden','true');
next.classList.remove('out');next.classList.add('on');next.removeAttribute('aria-hidden');
setTimeout(function (){prev.classList.remove('out');},650);
};
var start=function (){if (!timer) timer=setInterval(step,2600);};
var stop=function (){clearInterval(timer);timer=null;};
start();
document.addEventListener('visibilitychange',function (){document.hidden?stop():start();});
}
var vis=$('[data-parallax]');
var hero=$('.hero');
if (vis&&hero&&!reduce&&window.matchMedia('(hover: hover) and (pointer: fine)').matches){
var cards=$$('.vcard',vis);
hero.addEventListener('pointermove',function (e){
var r=hero.getBoundingClientRect();
var nx=(e.clientX - r.left) / r.width - 0.5;
var ny=(e.clientY - r.top) / r.height - 0.5;
cards.forEach(function (c){
var d=parseFloat(c.getAttribute('data-depth'))||0;
c.style.transform='translate3d(' + (nx*d).toFixed(1) + 'px,' + (ny*d).toFixed(1) + 'px,0)';
});
});
hero.addEventListener('pointerleave',function (){
cards.forEach(function (c){c.style.transform='';});
});
}
$$('[data-marquee]').forEach(function (m){
var track=$('.marquee-track',m);
if (!track) return;
Array.prototype.slice.call(track.children).forEach(function (li){
var c=li.cloneNode(true);
c.setAttribute('aria-hidden','true');
var img=$('img',c);
if (img) img.alt='';
track.appendChild(c);
});
});
var targets=$$('.rv, .ab-vis, [data-steps]');
if ('IntersectionObserver' in window&&!reduce){
var io=new IntersectionObserver(function (entries){
entries.forEach(function (en){
if (en.isIntersecting){
en.target.classList.add('in');
io.unobserve(en.target);
}
});
},{threshold:0.14,rootMargin:'0px 0px -6% 0px'});
targets.forEach(function (t){io.observe(t);});
}else{
targets.forEach(function (t){t.classList.add('in');});
}
function countUp(el){
var end=parseInt(el.getAttribute('data-count'),10);
var suffix=el.getAttribute('data-suffix')||'';
if (reduce||isNaN(end)){el.textContent=end + suffix;return;}
var dur=1400,t0=null;
function step(t){
if (t0===null) t0=t;
var p=Math.min((t - t0) / dur,1);
var eased=1 - Math.pow(1 - p,4);
el.textContent=Math.round(end*eased) + (p===1?suffix:'');
if (p<1) requestAnimationFrame(step);
}
requestAnimationFrame(step);
}
var counters=$$('[data-count]');
if ('IntersectionObserver' in window){
var cio=new IntersectionObserver(function (entries){
entries.forEach(function (en){
if (en.isIntersecting){countUp(en.target);cio.unobserve(en.target);}
});
},{threshold:0.6});
counters.forEach(function (c){cio.observe(c);});
}
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches&&!reduce){
$$('.svc').forEach(function (card){
card.addEventListener('pointermove',function (e){
var r=card.getBoundingClientRect();
card.style.setProperty('--mx',(e.clientX - r.left) + 'px');
card.style.setProperty('--my',(e.clientY - r.top) + 'px');
});
});
}
$$('[data-tabs]').forEach(function (root){
var tabs=$$('[role=tab]',root);
var panels=$$('[role=tabpanel]',root);
function select(i,focus){
tabs.forEach(function (t,k){
var on=k===i;
t.setAttribute('aria-selected',String(on));
t.tabIndex=on?0:-1;
panels[k].classList.toggle('is-on',on);
});
loadBg($('.sp-bg',panels[i]));
if (focus) tabs[i].focus();
var t=tabs[i];
if (t.scrollIntoView&&root.querySelector('.sp-list').scrollWidth>root.querySelector('.sp-list').clientWidth){
t.scrollIntoView({block:'nearest',inline:'center',behavior:reduce?'auto':'smooth'});
}
}
tabs.forEach(function (t,i){
t.addEventListener('click',function (){select(i,false);});
t.addEventListener('keydown',function (e){
var k=e.key,n=tabs.length,j=-1;
if (k==='ArrowDown'||k==='ArrowRight') j=(i + 1)%n;
else if (k==='ArrowUp'||k==='ArrowLeft') j=(i - 1 + n)%n;
else if (k==='Home') j=0;
else if (k==='End') j=n - 1;
if (j>-1){e.preventDefault();select(j,true);}
});
});
});
var cfg=window.STAV_CFG||null;
var CONSENT_KEY='stav_consent';
var gtagLoaded=false;
function getConsent(){try{return localStorage.getItem(CONSENT_KEY);}catch (e){return null;}}
function setConsent(v){try{localStorage.setItem(CONSENT_KEY,v);}catch (e){ }}
function loadGtag(){
if (!cfg||gtagLoaded) return;
var main=cfg.ga||cfg.ads;
if (!main) return;
gtagLoaded=true;
window.dataLayer=window.dataLayer||[];
window.gtag=function (){window.dataLayer.push(arguments);};
window.gtag('js',new Date());
if (cfg.ga) window.gtag('config',cfg.ga);
if (cfg.ads) window.gtag('config',cfg.ads);
var s=document.createElement('script');
s.async=true;
s.src='https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(main);
document.head.appendChild(s);
}
var banner=$('#cookie');
function showBanner(){if (banner) banner.hidden=false;}
function hideBanner(){if (banner) banner.hidden=true;}
if (cfg){
var saved=getConsent();
if (saved==='granted') loadGtag();
else if (!saved) showBanner();
$$('[data-consent]').forEach(function (b){
b.addEventListener('click',function (){
var v=b.getAttribute('data-consent');
setConsent(v);
hideBanner();
if (v==='granted') loadGtag();
});
});
$$('[data-cookie-prefs]').forEach(function (b){
b.addEventListener('click',function (){showBanner();});
});
}
function track(name,params){
if (typeof window.gtag==='function') window.gtag('event',name,params||{});
}
document.addEventListener('click',function (e){
var el=e.target.closest('[data-track]');
if (el) track(el.getAttribute('data-track'));
});
var conv=$('[data-conversion]');
if (conv){
track(conv.getAttribute('data-conversion'));
if (cfg&&cfg.ads&&cfg.label) track('conversion',{send_to:cfg.ads + '/' + cfg.label});
}
var utm={};
try{
var qs=new URLSearchParams(window.location.search);
['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid'].forEach(function (k){
var v=qs.get(k);
if (v){utm[k]=v;sessionStorage.setItem(k,v);}
else{var s=sessionStorage.getItem(k);if (s) utm[k]=s;}
});
}catch (e){ }
$$('[data-quiz]').forEach(function (qz){
var service=qz.getAttribute('data-service');
var wa=qz.getAttribute('data-wa');
var sum=$('.quiz-sum',qz);
var link=$('[data-quiz-link]',qz);
var prog=$('.quiz-prog i',qz);
var total=$$('fieldset',qz).length;
function update(){
var picks=[];
$$('input:checked',qz).forEach(function (i){picks.push({q:i.getAttribute('data-q'),v:i.value});});
if (prog) prog.style.transform='scaleX(' + (picks.length / total) + ')';
var lines=picks.map(function (p){return p.q + ' ' + p.v;});
var text='Hola STAV Electrónica, me interesa ' + service + '.' + (lines.length?'\n' + lines.join('\n'):'') + '\nQuisiera una cotización.';
link.href='https://wa.me/' + wa + '?text=' + encodeURIComponent(text);
if (!picks.length){
sum.textContent='Elige una opción en cada pregunta.';
}else if (picks.length<total){
sum.innerHTML='<b>' + picks.length + ' de ' + total + '</b> listas. ' + picks.map(function (p){return p.v;}).join(' · ');
}else{
sum.innerHTML='<b>Todo listo:</b> ' + picks.map(function (p){return p.v;}).join(' · ');
}
}
qz.addEventListener('change',update);
});
var WA_NUMBER='5215539004795';
var MAIL_TO='ventas@stavelectronica.com';
var form=$('#form');
if (form){
var endpoint=form.getAttribute('data-endpoint')||'';
var thanks=form.getAttribute('data-thanks')||'';
var serviceName=form.getAttribute('data-service')||'';
var msg=$('.form-msg',form);
var field=function (n){return form.elements[n]||null;};
var value=function (n){var el=field(n);return el?el.value.trim():'';};
function setErr(el,text){
if (!el) return;
var holder=el.closest('.f');
var err=holder?$('.f-err',holder):$('.f-err-check',form);
if (err) err.textContent=text||'';
if (el.type!=='checkbox') el.setAttribute('aria-invalid',text?'true':'false');
}
['nombre','telefono','email','mensaje','privacidad'].forEach(function (n){
var el=field(n);
if (el) el.addEventListener(el.type==='checkbox'?'change':'input',function (){setErr(el,'');});
});
function validate(){
var bad=null;
function fail(el,t){setErr(el,t);if (!bad) bad=el;}
['nombre','telefono','email','mensaje','privacidad'].forEach(function (n){setErr(field(n),'');});
if (field('nombre')&&value('nombre').length<2) fail(field('nombre'),'Escribe tu nombre.');
if (field('telefono')&&value('telefono').replace(/\D/g,'').length<8) fail(field('telefono'),'Escribe un teléfono válido.');
if (field('email')&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value('email'))) fail(field('email'),'Revisa tu correo electrónico.');
if (field('mensaje')&&value('mensaje').length<5) fail(field('mensaje'),'Cuéntanos brevemente tu proyecto.');
if (field('privacidad')&&!field('privacidad').checked) fail(field('privacidad'),'Debes aceptar el aviso de privacidad.');
if (bad){bad.focus();return null;}
var interes=$$('input[name=interes]:checked',form).map(function (i){return i.value;});
if (!interes.length&&serviceName) interes=[serviceName];
return{nombre:value('nombre'),tel:value('telefono'),email:value('email'),mensaje:value('mensaje'),interes:interes};
}
function goThanks(){if (thanks) window.location.href=thanks;}
function setBusy(on){$$('[data-via]',form).forEach(function (b){b.disabled=on;});}
function send(via){
msg.className='form-msg';
msg.textContent='';
var trap=field('_gotcha');
if (trap&&trap.value) return;
var d=validate();
if (!d){msg.className='form-msg err';msg.textContent='Revisa los campos marcados.';return;}
var texto='Hola STAV Electrónica, soy ' + d.nombre + '.\n' +
(d.interes.length?'Me interesa: ' + d.interes.join(', ') + '.\n':'') +
d.mensaje + '\n\nTeléfono: ' + d.tel + (d.email?'\nCorreo: ' + d.email:'');
if (via==='post'&&endpoint){
setBusy(true);
msg.textContent='Enviando…';
var payload={nombre:d.nombre,telefono:d.tel,email:d.email,interes:d.interes.join(', '),mensaje:d.mensaje,pagina:window.location.href};
Object.keys(utm).forEach(function (k){payload[k]=utm[k];});
fetch(endpoint,{method:'POST',headers:{'Accept':'application/json','Content-Type':'application/json'},body:JSON.stringify(payload)})
.then(function (r){
if (!r.ok) throw new Error('http ' + r.status);
track('generate_lead',{method:'formulario_web'});
msg.className='form-msg ok';
msg.textContent='Recibimos tu solicitud. ¡Gracias!';
form.reset();
goThanks();
})
.catch(function (){
setBusy(false);
msg.className='form-msg err';
msg.textContent='No pudimos enviar tu solicitud. Intenta por WhatsApp o llama al 800 623 1131.';
});
return;
}
track('generate_lead',{method:via==='wa'?'formulario_whatsapp':'formulario_correo'});
if (via==='wa'){
window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(texto),'_blank','noopener');
msg.textContent='Listo: abrimos WhatsApp con tu mensaje. Solo da clic en enviar.';
}else{
window.location.href='mailto:' + MAIL_TO + '?subject=' + encodeURIComponent('Cotización: ' + (d.interes[0]||'proyecto') + ' (' + d.nombre + ')') + '&body=' + encodeURIComponent(texto);
msg.textContent='Listo: abrimos tu correo con el mensaje. Solo da clic en enviar.';
}
msg.className='form-msg ok';
if (thanks) setTimeout(goThanks,1200);
}
$$('[data-via]',form).forEach(function (b){
b.addEventListener('click',function (){send(b.getAttribute('data-via'));});
});
form.addEventListener('submit',function (e){e.preventDefault();send(endpoint?'post':'wa');});
}
})();
