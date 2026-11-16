/* ============ A TELA DO PRÊMIO, COM A CARA DO DIVA ============
   Fundo claro em aquarela (segue o tema), a Biju comemorando no lugar do presente,
   pétalas caindo no lugar dos fogos, a prática em destaque e um botão principal só.
   A festa cresce com o marco: 3 dias, 7 dias (mais pétalas) e 21 dias (brilho dourado).
   O visual fica em estilo/app.css (bloco "Tela do prêmio"). Carregue depois de premio-pratica.js. */

/* ---- pétalas (mesmo contrato do iniciarFogos: devolve {parar}) ---- */
function iniciarPetalas(canvas,qtd){
  const reduz=!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
  const ctx=canvas.getContext('2d');
  const CORES=['#EFBCCB','#D9A3D9','#BD80D1','#F4D0C2','#E7C78A','#C9B8EE'];
  let w=0,h=0,parado=false,id=null,antes=0;
  function setup(){w=canvas.width=canvas.clientWidth||innerWidth;h=canvas.height=canvas.clientHeight||innerHeight;}
  setup();window.addEventListener('resize',setup);
  const nova=topo=>({x:Math.random()*w,y:topo?-20-Math.random()*h*.3:Math.random()*h,r:5+Math.random()*7,vy:18+Math.random()*26,
    bal:Math.random()*6.28,vb:.6+Math.random()*1.2,amp:10+Math.random()*22,g:Math.random()*6.28,vg:(Math.random()-.5)*1.6,
    cor:CORES[Math.floor(Math.random()*CORES.length)],a:.35+Math.random()*.4});
  const ps=[];for(let i=0;i<qtd;i++)ps.push(nova(false));
  function desenha(){
    ctx.clearRect(0,0,w,h);
    ps.forEach(p=>{ctx.save();ctx.translate(p.x+Math.sin(p.bal)*p.amp,p.y);ctx.rotate(p.g);ctx.globalAlpha=p.a;ctx.fillStyle=p.cor;
      ctx.beginPath();ctx.moveTo(0,-p.r);ctx.bezierCurveTo(p.r*.9,-p.r*.6,p.r*.7,p.r*.8,0,p.r);ctx.bezierCurveTo(-p.r*.7,p.r*.8,-p.r*.9,-p.r*.6,0,-p.r);ctx.fill();ctx.restore();});
  }
  function passo(t){
    if(parado)return;id=requestAnimationFrame(passo);
    const dt=Math.min(.05,(t-(antes||t))/1000);antes=t;
    if(document.hidden)return;
    ps.forEach((p,i)=>{p.y+=p.vy*dt;p.bal+=p.vb*dt;p.g+=p.vg*dt;if(p.y>h+20)ps[i]=nova(true);});
    desenha();
  }
  if(reduz)desenha();else id=requestAnimationFrame(passo);
  return{parar(){parado=true;if(id)cancelAnimationFrame(id);window.removeEventListener('resize',setup);ctx.clearRect(0,0,w,h);}};
}

let petalasAnim=null;
window.mostrarPremioModal=(function(orig){return function(premio,info){
  const r=orig.apply(this,arguments);
  try{
    const o=$('premioModal');const tier=(info&&info.tier)||'P';
    o.dataset.marco=tier;
    /* pétalas no lugar dos fogos (em tela própria: a dos fogos é opaca e deixaria o fundo preto) */
    if(premioAnim){premioAnim.parar();premioAnim=null;}
    let tela=$('premioPetalas');
    if(!tela){tela=document.createElement('canvas');tela.id='premioPetalas';o.insertBefore(tela,o.firstChild);}
    if(petalasAnim)petalasAnim.parar();
    petalasAnim=iniciarPetalas(tela,tier==='G'?46:tier==='M'?32:18);
    /* a Biju comemorando no lugar do presente (não recomeça ao trocar de prática) */
    const e=o.querySelector('.premio-emoji');
    if(e&&!e.querySelector('img')){
      const parada=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
      e.innerHTML=`<img src="atracao/biju-celebrando${parada?'-parada':''}.webp?v=2&t=${Date.now()}" alt="" aria-hidden="true">`;
    }
    /* o tipo de cuidado, com os nomes do app (sem "linguagens do amor") */
    o.querySelectorAll('#premioModalTags .premio-tag').forEach(t=>{t.textContent=catVer(t.textContent).replace(/^[^\p{L}]+/u,'');});
    /* um botão principal; os outros viram links discretos */
    const ok=$('premioOk');if(ok){ok.className='modal-btn prim premio-principal';}
    o.querySelectorAll('#premioModalBotoes .premio-btn.sec').forEach(b=>{b.className='premio-link';b.textContent=b.textContent.replace(/^[^\p{L}]+/u,'');});
  }catch(e){console.warn('tela do prêmio',e);}
  return r;
};})(window.mostrarPremioModal);

window.fecharPremioModal=(function(orig){return function(){
  const r=orig.apply(this,arguments);
  setTimeout(()=>{if($('premioModal').hidden&&petalasAnim){petalasAnim.parar();petalasAnim=null;}},450);
  setTimeout(()=>{const e=document.querySelector('#premioModal .premio-emoji');if(e&&$('premioModal').hidden)e.innerHTML='';},450);
  return r;
};})(window.fecharPremioModal);
