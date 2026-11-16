/* ============ DIVA COMPLETO (experimentar e pagar depois) ============
   Baixar é de graça. Os hábitos e o check-in ficam de graça pra sempre.
   Uma compra única libera o resto: Mapa emocional, Celebrar, trilha da Atração e as cartinhas
   da Biju depois da primeira semana.

   Princípio do DIVA: convite gentil, nunca pressão. Quem não compra não perde nada do que já tem,
   e o convite aparece uma vez só (depois fica guardado na aba Mapa, pra quando a pessoa quiser).

   COBRANCA_LIGADA = false: nada disso aparece e o app se comporta como sempre.
   Só ligar quando a compra de verdade (Google Play) estiver funcionando. Carregue depois de abas.js e cartinhas.js. */
const COBRANCA_LIGADA=false;
/* o preço vem da loja (cada país mostra o seu); enquanto não vier, o botão aparece sem valor */
let completoPreco='';
const COMPLETO_DIAS_GRATIS=7;
const COMPLETO_ABAS=['mapa','celebrar','atracao'];

function completoDias(){return Math.max(0,...(S.habitos||[]).map(h=>Object.keys(h.feitos||{}).length));}
/* a pessoa tem o DIVA completo? (o perfil original, da criadora, sempre tem) */
function divaCompleto(){return !COBRANCA_LIGADA||!!S.perfilOriginal||!!(S.compra&&S.compra.ok);}
/* já passou da parte grátis e ainda não comprou */
function completoNaPorta(){return !divaCompleto()&&completoDias()>=COMPLETO_DIAS_GRATIS;}

/* ---- o Mapa só abre pra quem tem o completo; Celebrar e Atração vêm depois dele, então seguem junto ---- */
(function(){
  const r=ABAS_REGRAS.find(x=>x.tab==='mapa');if(!r)return;
  const ok=r.ok;r.ok=()=>ok()&&divaCompleto();
})();
window.abaPista=(function(orig){return function(t){
  if(completoNaPorta()&&COMPLETO_ABAS.includes(t))return 'Seus hábitos e o check-in continuam com você 💜';
  return orig(t);
};})(window.abaPista);
/* no aviso do topo da tela fechada, um botão pra conhecer */
window.abaTelaTrava=(function(orig){return function(sec,t,trav){
  orig(sec,t,trav);
  try{
    const av=sec.querySelector(':scope > .aba-trava-aviso');
    if(!av||!trav||!completoNaPorta()||!COMPLETO_ABAS.includes(t))return;
    const tit=av.querySelector('b');if(tit)tit.textContent='Essa parte é do DIVA completo';
    const b=document.createElement('button');b.type='button';b.className='modal-btn prim completo-conhecer';b.textContent='Conhecer o DIVA completo';
    b.onclick=()=>abrirConviteCompleto();
    av.appendChild(b);
  }catch(e){}
};})(window.abaTelaTrava);

/* ---- cartinhas: a primeira semana é de todo mundo ---- */
window.abrirCartinha=(function(orig){return function(dia,c){
  if(!divaCompleto()&&dia>COMPLETO_DIAS_GRATIS){abrirConviteCompleto();return;}
  return orig.apply(this,arguments);
};})(window.abrirCartinha);

/* ---- o convite ---- */
function abrirConviteCompleto(previa){
  let o=$('completoModal');
  if(!o){
    o=document.createElement('div');o.className='modal-overlay';o.id='completoModal';o.hidden=true;
    o.innerHTML=`<div class="modal-caixa completo-caixa">
      <div class="completo-gata" id="completoGata"></div>
      <div class="modal-pergunta" style="text-align:center">Uma semana com você</div>
      <p class="completo-txt">Você cuidou de você por 7 dias, e isso é seu. A partir daqui o DIVA tem mais pra te mostrar:</p>
      <ul class="completo-lista">
        <li><b>Mapa emocional.</b> Um retrato de como você está, em forma de carta.</li>
        <li><b>Celebrar.</b> Seu caminho e o seu Livro de Conquistas.</li>
        <li><b>Atração.</b> Sete sessões pra ir do que pesa até o menor passo.</li>
        <li><b>Cartinhas da Biju.</b> Uma leitura curta por dia.</li>
      </ul>
      <p class="completo-txt">É uma compra só, sem assinatura. Seus hábitos e o check-in continuam com você de qualquer jeito.</p>
      <p class="aviso" id="completoErro" hidden></p>
      <div class="completo-botoes">
        <button type="button" class="modal-btn prim" id="completoSim"></button>
        <button type="button" class="completo-link" id="completoNao">Agora não</button>
        <button type="button" class="completo-link" id="completoJa">Já comprei</button>
      </div>
    </div>`;
    document.body.appendChild(o);
  }
  const g=$('completoGata');
  if(g){
    const gata=window.customElements&&customElements.get('gatinha-fantoche');
    g.innerHTML=gata?'<gatinha-fantoche pose="sentada" src-base="mascote/assets/pecas/" style="width:120px;display:block;margin:0 auto" aria-hidden="true"></gatinha-fantoche>':'<div class="modal-emoji">💜</div>';
  }
  $('completoErro').hidden=true;
  $('completoSim').textContent='Quero o DIVA completo'+(completoPreco?' · '+completoPreco:'');
  $('completoSim').onclick=()=>completoComprar();
  $('completoJa').onclick=()=>completoRestaurar();
  $('completoNao').onclick=()=>fecharOverlay(o,()=>mostrarToast('Tudo bem. O convite fica guardado na aba Mapa 💜'));
  if(!previa){S.completoConviteVisto=true;salva();}
  abrirOverlayTopo(o);
}
function completoAviso(txt){const e=$('completoErro');if(e){e.textContent=txt;e.hidden=false;}}
/* a pessoa comprou: guarda, fecha o convite e deixa as abas abrirem do jeito de sempre */
function completoLiberar(origem){
  S.compra={ok:true,em:hoje(),origem:origem||'loja'};salva();
  const o=$('completoModal');
  const depois=()=>{try{abasAtualizar(true);renderHoje();}catch(e){}mostrarToast('Pronto! O DIVA completo é seu 💜');};
  if(o&&o.classList.contains('ativo'))fecharOverlay(o,depois);else depois();
}
/* A compra de verdade entra aqui (Google Play Billing). Enquanto não estiver ligada, só avisa. */
async function completoComprar(){
  if(window.DIVAloja&&typeof window.DIVAloja.comprar==='function'){
    try{if(await window.DIVAloja.comprar())completoLiberar('loja');}
    catch(e){console.error(e);completoAviso('A compra não foi concluída. Nada foi cobrado. Tente de novo quando quiser.');}
    return;
  }
  completoAviso('A compra ainda não está disponível nesta versão.');
}
async function completoRestaurar(){
  if(window.DIVAloja&&typeof window.DIVAloja.restaurar==='function'){
    try{if(await window.DIVAloja.restaurar()){completoLiberar('restaurada');return;}completoAviso('Não encontrei uma compra nesta conta da loja.');}
    catch(e){console.error(e);completoAviso('Não consegui consultar a loja agora. Tente de novo em instantes.');}
    return;
  }
  completoAviso('A compra ainda não está disponível nesta versão.');
}

/* ---- o convite aparece sozinho uma vez, quando a parte grátis termina e nada mais está aberto ---- */
window.abasAtualizar=(function(orig){return function(mostrar){
  const r=orig.apply(this,arguments);
  try{
    if(mostrar&&completoNaPorta()&&!S.completoConviteVisto&&!document.querySelector('.modal-overlay.ativo,.onb-overlay.ativo,.festa-overlay.ativo,.premio-modal.ativo,.rel-overlay.ativo'))abrirConviteCompleto();
  }catch(e){}
  return r;
};})(window.abasAtualizar);

/* pra ver a tela do convite sem ligar a cobrança: no console, divaPreviaConvite() */
window.divaPreviaConvite=()=>abrirConviteCompleto(true);
