/* ============ CONVITES GENTIS ============
   1. O PORQUÊ DO HÁBITO: no primeiro toque num hábito (ou no segundo, se o primeiro já abriu outra tela),
      a Diva pergunta por que a pessoa quer esse hábito. Fica em hb.porque e volta na cartinha do dia 15
      e na lista de Gerenciar hábitos. Pergunta uma vez só por hábito; "Agora não" não pergunta de novo.
   2. HÁBITOS QUIETINHOS: se nenhum hábito foi marcado há CONVITE_PARADO_DIAS dias, a tela Hoje mostra um
      convite pra revisar os hábitos (manter, ajustar, pausar ou tirar). "Agora não" espera mais uns dias.
   Pra mudar os textos, mexa só em CONVITE_TXT. Carregue depois de habitos.js, hoje.js e cartinhas.js. */
const CONVITE_PARADO_DIAS=7;
const CONVITE_TXT={
  porqueTitulo:'Por que você quer {acao}?',
  porqueSub:'Não precisa ser um motivo grande. Vale até "porque me faz bem". Eu guardo pra te lembrar nos dias difíceis.',
  porquePh:'Porque…',
  porqueGuardar:'Guardar',
  porqueDepois:'Agora não',
  porqueGuardado:'Guardado. Eu te lembro quando precisar 💜',
  paradoK:'Um convite',
  paradoTit:'Seus hábitos estão quietinhos 🌙',
  paradoTxt:'Faz uns dias que nenhum hábito foi marcado, e tudo bem: a vida às vezes ocupa todo o espaço. Talvez algum hábito esteja grande demais pra agora, ou já não faça tanto sentido.',
  paradoTxt2:'Quer dar uma olhada neles com carinho? Dá pra manter, diminuir, pausar ou trocar. Você escolhe.',
  paradoSim:'Revisar meus hábitos',
  paradoNao:'Agora não'
};

/* ---------- 1. o porquê ---------- */
function porqueDevePerguntar(hb){
  if(!hb||hb.pausado||(hb.porque||'').trim()||hb.porquePerguntado)return false;
  return Object.keys(hb.feitos||{}).length<=2;
}
function abrirPorque(hb){
  let o=$('porqueModal');
  if(!o){
    o=document.createElement('div');o.className='modal-overlay';o.id='porqueModal';o.hidden=true;
    o.innerHTML='<div class="modal-caixa"><div class="modal-emoji" id="porqueEmoji">🌱</div><div class="modal-pergunta" id="porqueTit"></div><p class="mut" id="porqueSub" style="font-size:13px;line-height:1.55;margin:6px 0 12px"></p><textarea id="porqueCampo" rows="3"></textarea><div class="modal-botoes" style="margin-top:14px"><button type="button" class="modal-btn sec" id="porqueNao"></button><button type="button" class="modal-btn prim" id="porqueSim"></button></div></div>';
    document.body.appendChild(o);
  }
  const acao=typeof acaoDoHabito==='function'?acaoDoHabito(hb):hb.nome;
  $('porqueEmoji').textContent=hb.emoji||'🌱';
  $('porqueTit').textContent=CONVITE_TXT.porqueTitulo.split('{acao}').join(acao);
  $('porqueSub').textContent=CONVITE_TXT.porqueSub;
  const c=$('porqueCampo');c.value='';c.placeholder=CONVITE_TXT.porquePh;
  $('porqueSim').textContent=CONVITE_TXT.porqueGuardar;$('porqueNao').textContent=CONVITE_TXT.porqueDepois;
  $('porqueSim').onclick=()=>{
    const v=c.value.trim();if(!v){c.focus();return;}
    hb.porque=v;hb.porquePerguntado=true;salva();
    fecharOverlay(o,()=>{try{renderHabitos();}catch(e){}mostrarToast(CONVITE_TXT.porqueGuardado);});
  };
  $('porqueNao').onclick=()=>{hb.porquePerguntado=true;salva();fecharOverlay(o);};
  abrirOverlayTopo(o);
  setTimeout(()=>{try{c.focus({preventScroll:true});}catch(e){}},350);
}
/* entra no lugar da pergunta do "lado bom" só quando o porquê ainda não foi perguntado; a do lado bom fica pro próximo toque */
if(typeof relatoAoMarcar==='function'){
  const _relatoAoMarcarPorque=relatoAoMarcar;
  relatoAoMarcar=function(hb,lacuna){
    if(porqueDevePerguntar(hb)){setTimeout(()=>abrirPorque(hb),800);return true;}
    return _relatoAoMarcarPorque.apply(this,arguments);
  };
}

/* ---------- 2. hábitos quietinhos ---------- */
function ultimoDiaMarcado(){
  let ult='';(S.habitos||[]).filter(h=>!h.pausado).forEach(h=>Object.keys(h.feitos||{}).forEach(d=>{if(d>ult)ult=d;}));
  return ult;
}
function conviteParadoDevido(){
  if(!(S.habitos||[]).some(h=>!h.pausado))return false;
  const ult=ultimoDiaMarcado();if(!ult)return false;
  const dias=Math.round((new Date(hoje()+'T12:00:00')-new Date(ult+'T12:00:00'))/86400000);
  if(dias<CONVITE_PARADO_DIAS)return false;
  const c=S.conviteParado||{};
  if(c.adiarAte&&hoje()<c.adiarAte)return false;
  if(c.revisouEm&&c.revisouEm>=ult)return false;   // já revisou depois da última marcação
  return true;
}
function renderConviteParado(box){
  box.innerHTML=`<div class="revisao-card"><div class="rv-k mut">${esc(CONVITE_TXT.paradoK)}</div><h3>${esc(CONVITE_TXT.paradoTit)}</h3><p>${esc(CONVITE_TXT.paradoTxt)}</p><p>${esc(CONVITE_TXT.paradoTxt2)}</p><div style="display:flex;flex-direction:column;gap:8px;margin-top:10px"><button class="btn prim btn-full" id="cpRevisar">${esc(CONVITE_TXT.paradoSim)}</button><button class="btn btn-full" id="cpAdiar">${esc(CONVITE_TXT.paradoNao)}</button></div></div>`;
  $('cpRevisar').onclick=()=>{S.conviteParado=Object.assign({},S.conviteParado,{revisouEm:hoje(),adiarAte:null});salva();box.innerHTML='';abrirRevisaoHabitos();};
  $('cpAdiar').onclick=()=>{S.conviteParado=Object.assign({},S.conviteParado,{adiarAte:fmtD(addDias(new Date(),5))});salva();box.innerHTML='';mostrarToast('Tudo bem. Eu te convido de novo daqui uns dias 💜');};
}
/* usa o mesmo espaço do convite de revisão dos 90 dias; se aquele estiver na vez, ele tem prioridade */
if(typeof renderRevisaoCard==='function'){
  const _renderRevisaoCardParado=renderRevisaoCard;
  renderRevisaoCard=function(){
    _renderRevisaoCardParado.apply(this,arguments);
    const box=$('revisaoHabitosBox');if(!box||box.innerHTML.trim())return;
    if(conviteParadoDevido())renderConviteParado(box);
  };
}
