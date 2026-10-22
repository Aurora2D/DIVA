/* ============ O PRÊMIO VIRA PRÁTICA ============
   Nos marcos de 3, 7 e 21 dias, em vez de sortear um prêmio de um cardápio separado, o app sugere uma das
   práticas de autocuidado da própria pessoa (as mesmas do check-in). Se ela fizer, conta como prática do dia.
   Não existe mais "guardar prêmio pra depois": ou faz agora, ou fica pra outro dia, sem pendência.
   A comemoração aparece a cada hábito marcado (é na hora que ela ajuda o cérebro).
   A aba Celebrar vira o lugar de olhar pra trás: o caminho percorrido e o Livro de Conquistas.
   Este arquivo só substitui funções de habitos.js, celebrar.js e hoje.js; carregue depois deles. */

/* ---- lista de práticas como "prêmios" ---- */
function praticasComoPremio(){
  const out=[];
  Object.entries(S.praticas||{}).forEach(([g,itens])=>(itens||[]).forEach(it=>out.push({id:'pr|'+g+'|'+it,nome:it,grupo:g,key:g+'|'+it,pratica:true})));
  return out;
}
let ultimaPraticaPremio=null;
/* a que estilo do teste cada grupo de práticas pertence (vale para as listas novas e as antigas) */
function estiloDoGrupo(g){
  const t=String(g||'').toLowerCase();
  if(/palavra/.test(t))return 'palavras';
  if(/tempo/.test(t))return 'tempo';
  if(/presente/.test(t))return 'presentes';
  if(/servi/.test(t))return 'servico';
  if(/toque|contato|f[ií]sico/.test(t))return 'toque';
  return null; // ex.: treino vocal, que é prática mas não é mimo
}
function pesoPratica(p){const est=estiloDoGrupo(p.grupo);try{return est?pesoEstilo(est):1;}catch(e){return 1;}}
function sortearPratica(excluirId){
  let todas=praticasComoPremio();
  const deMimo=todas.filter(p=>estiloDoGrupo(p.grupo));if(deMimo.length)todas=deMimo;
  const feitas=((S.checkins||{})[hoje()]||{}).praticas||{};
  let l=todas.filter(p=>!feitas[p.key]&&p.id!==excluirId&&p.id!==ultimaPraticaPremio);
  if(!l.length)l=todas.filter(p=>p.id!==excluirId);
  if(!l.length)return null;
  const tot=l.reduce((a,x)=>a+pesoPratica(x),0);let r=Math.random()*tot,p=l[0];
  for(const x of l){r-=pesoPratica(x);if(r<=0){p=x;break;}}
  ultimaPraticaPremio=p.id;
  return p;
}
function marcarPraticaPremio(p){
  if(!p||!p.key)return;
  const ci=S.checkins[hoje()]||(S.checkins[hoje()]={});
  ci.praticas=ci.praticas||{};ci.praticas[p.key]=true;salva();
  try{montaCheckin();}catch(e){}
  mostrarToast('Anotado nas suas práticas de hoje ✓');
}
const PREMIO_PRATICA_FRASE='Hoje você merece uma das suas práticas.';

/* ---- sorteio: sempre das práticas ---- */
window.premiosDoContexto=function(){return praticasComoPremio();};
window.sortearPremioCtx=function(tam,ctx,excluirId){return sortearPratica(excluirId);};
window.procurarPremio=function(tier,ctx,onShow,onCancel){
  const p=sortearPratica(null);
  if(p){onShow(p);return;}
  mostrarToast('Escolha suas práticas no check-in e elas aparecem aqui 💛');
  if(onCancel)onCancel();
};
window.premioAprender=(function(orig){return function(p,ok){if(p&&p.pratica)return;try{return orig(p,ok);}catch(e){}};})(window.premioAprender);

/* ---- o marco não pergunta mais "como está agora?": parabeniza e mostra a prática ---- */
window.abrirContextoPremio=function(n,onEscolher){
  const M=MARCOS[n]||{tit:'Parabéns!'};
  $('marcoEmoji').textContent=n===3?'🎉':n===7?'🌟':'👑';
  $('marcoTitulo').textContent=M.tit;
  $('marcoSub').textContent=PREMIO_PRATICA_FRASE;
  const lbl=$('marcoBotoes').previousElementSibling;if(lbl)lbl.style.display='none';
  const bt=$('marcoBotoes');bt.innerHTML='';
  const b=document.createElement('button');b.className='modal-btn prim';b.textContent='Ver qual é 💛';
  b.onclick=()=>fecharOverlay($('marcoModal'),()=>onEscolher(null));
  bt.appendChild(b);
  abrirOverlayTopo($('marcoModal'));
};

/* ---- a tela do prêmio, com a prática ---- */
window.mostrarPremioModal=(function(orig){return function(premio,info){
  const pre=document.querySelector('#premioModal .premio-pretitulo');
  if(!premio||!premio.pratica){if(pre)pre.textContent='Você tirou';return orig(premio,info);}
  som('caixinha');
  premioAtual=premio;
  const overlay=$('premioModal');
  if(pre)pre.textContent=PREMIO_PRATICA_FRASE;
  $('premioModalNome').textContent=premio.nome;
  $('premioModalTags').innerHTML=`<span class="premio-tag">${esc(premio.grupo)}</span>`;
  const temOutra=praticasComoPremio().filter(p=>estiloDoGrupo(p.grupo)).length>1;
  $('premioModalBotoes').innerHTML=(temOutra?`<button class="premio-btn sec" id="premioOutro">🎲 Outra</button>`:'')+`<button class="premio-btn sec" id="premioHojeNao">Hoje não</button><button class="premio-btn" id="premioOk">Vou fazer agora 💛</button>`;
  if(temOutra)$('premioOutro').onclick=()=>{const p2=sortearPratica(premio.id);if(p2){mostrarPremioModal(p2,info);confete(['✨','💫']);}};
  $('premioHojeNao').onclick=()=>fecharPremioModal();
  $('premioOk').onclick=()=>{marcarPraticaPremio(premio);fecharPremioModal();};
  overlay.hidden=false;requestAnimationFrame(()=>overlay.classList.add('ativo'));document.body.style.overflow='hidden';
  if(premioAnim)premioAnim.parar();premioAnim=iniciarFogos($('premioCanvas'));confete(['✨','💛','💜']);
};})(window.mostrarPremioModal);

/* ---- 21 dias: a festa mostra a prática direto, sem perguntar o contexto ---- */
window.atualizarBonusFesta=(function(orig){return function(){
  const b=festaBonusAtual;
  if(b&&b.pratica){$('festaBonusNome').textContent=b.nome;$('festaBonusTag').textContent=b.grupo;return;}
  return orig();
};})(window.atualizarBonusFesta);
window.abrirFesta=(function(orig){return function(hb){
  orig(hb);
  const tit=document.querySelector('#festaBonusBox .festa-bonus-tit');
  if(tit)tit.textContent='🎁 '+PREMIO_PRATICA_FRASE;
  $('festaCtx').style.display='none';
  const g=$('festaGuardar');if(g)g.style.display='none';
  const p=sortearPratica(null);
  festaBonusAtual=p;festaCtxInfo={tier:'G',ctx:null};
  if(p){atualizarBonusFesta();$('festaBonusBox').style.display='';$('festaBtn').textContent='Vou fazer agora 💛';$('festaResortear').style.display=praticasComoPremio().length>1?'':'none';$('festaResortear').textContent='🎲 Outra';}
  else{$('festaBonusBox').style.display='none';$('festaBtn').textContent='Continuar 💛';$('festaResortear').style.display='none';}
  $('festaBtnRow').style.display='';
  $('festaBtn').onclick=()=>{if(festaBonusAtual&&festaBonusAtual.pratica)marcarPraticaPremio(festaBonusAtual);fecharFesta();};
};})(window.abrirFesta);

/* ---- a comemoração aparece toda vez que ela marca um hábito ---- */
window.celebraToastTexto=function(){
  const c=celebraAtual();if(!c)return 'Marcado ✓';
  return 'Marcado ✓ · agora: '+c.texto+' 🎉';
};

/* ---- aba Celebrar: o caminho percorrido ---- */
function dataCurta(d){try{return new Date(d+'T12:00:00').toLocaleDateString('pt-BR',{day:'numeric',month:'short'}).replace('.','');}catch(e){return d;}}
function caminhoItens(){
  const itens=[];
  (S.habitos||[]).forEach(hb=>{
    const dias=Object.keys(hb.feitos||{}).sort();
    [3,7,21].forEach(n=>{if(dias.length>=n)itens.push({data:dias[n-1],txt:`${n} dias de <b>${esc(hb.nome)}</b>`,emoji:n===21?'👑':n===7?'🌟':'🎉'});});
  });
  ((S.ciclo&&S.ciclo.historico)||[]).forEach((c,i)=>{if(c&&c.concluidoEm)itens.push({data:c.concluidoEm,txt:i===0?'Seu primeiro mapa emocional':`Seu ${i+1}º mapa emocional`,emoji:'🗺️'});});
  return itens.sort((a,b)=>a.data<b.data?1:-1);
}
function renderCaminho(){
  const box=$('caminhoBox');if(!box)return;
  const l=caminhoItens();
  box.innerHTML=l.length
    ?`<div class="caminho">${l.map(x=>`<div class="caminho-item"><span class="caminho-emo">${x.emoji}</span><span class="caminho-txt">${x.txt}</span><span class="caminho-data">${esc(dataCurta(x.data))}</span></div>`).join('')}</div>`
    :'<p class="mut" style="font-size:12.5px;line-height:1.55;margin:0">Seu caminho começa a aparecer aqui quando um hábito completar 3 dias.</p>';
  const g=$('cardGuardados');if(g)g.hidden=!((S.premiosGuardados||[]).length);
}
window.renderCelebrar=(function(orig){return function(){try{orig();}catch(e){console.warn('celebrar',e);}renderCaminho();};})(window.renderCelebrar);
