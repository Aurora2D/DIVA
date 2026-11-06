/* ============ LISTINHA DO FIM DO DIA (app/fim-do-dia.js) ============
   Quando a pessoa abre o app depois das 19h, aparece uma vez por dia a lista do que ela fez hoje:
   hábitos marcados, práticas do check-in, conquistas anotadas, frases sobre os hábitos e o que ela trabalhou na Atração.
   O check-in em si (sono, refeições, notas) fica de fora: ele já aparece enquanto ela preenche.
   Ideia de TCC: enxergar as ações do caminho, não só "pronto ou não pronto".
   Se o dia ficou vazio, não aparece (não vira cobrança). */
const FIM_DIA_HORA=19;
function fimDoDiaItens(){
  const h=hoje(),itens=[];
  (S.habitos||[]).forEach(hb=>{if(!hb.pausado&&hb.feitos&&hb.feitos[h])itens.push({emoji:hb.emoji||'🌱',txt:hb.nome});});
  const ci=(S.checkins||{})[h]||{};
  Object.keys(ci.praticas||{}).forEach(p=>{if(ci.praticas[p]&&!itens.some(i=>i.txt===p))itens.push({emoji:'✨',txt:p});});
  ((S.conquistas&&S.conquistas.itens)||[]).forEach(c=>{if(c&&c.criadoEm===h&&c.txt)itens.push({emoji:'📖',txt:c.txt});});
  // frases sobre os hábitos ("o lado bom é que...")
  (S.habitos||[]).forEach(hb=>{(hb.relatos||[]).forEach(r=>{
    if(r&&r.data===h&&!r.naoPercebi&&(r.texto||'').trim()){
      const t=typeof relatoLimpar==='function'?relatoLimpar(r.texto):r.texto.trim();
      itens.push({emoji:'💬',txt:'Sobre '+(typeof acaoDoHabito==='function'?acaoDoHabito(hb):hb.nome)+': o lado bom é que '+t});
    }
  });});
  // Atração: o que ela trabalhou hoje (uma linha por tipo, sem contar quantas)
  const la=S.leiAtracao||{},ds=(la.desejos||[]).filter(d=>d&&!d.arquivado);
  const at=new Set();
  (la.contrastes||[]).forEach(c=>{
    if(c.criadoEm===h)at.add('Deixou sair algo que incomodava');
    if((c.trabalhados||[]).some(t=>t.em===h))at.add('Olhou uma coisa com outros olhos');
    if(c.virouDesejoEm===h)at.add('Transformou um incômodo em desejo');
  });
  ds.forEach(d=>{
    if((d.gravetos||[]).some(g=>g.soltoEm===h))at.add('Escreveu uma permissão pra você');
    if((d.evidencias||[]).some(e=>e.data===h))at.add('Anotou uma prova de que é possível');
  });
  at.forEach(t=>itens.push({emoji:'💫',txt:t}));
  ds.forEach(d=>(d.menorPassos||[]).forEach(m=>{if(m.criadoEm===h&&m.texto)itens.push({emoji:'👣',txt:'Escolheu o seu menor passo: '+m.texto});}));
  return itens;
}
function fimDoDiaOcupado(){
  return !!document.querySelector('.modal-overlay.ativo,.rel-overlay.ativo,.festa-overlay.ativo,.premio-modal.ativo,.onb-overlay.ativo,.resumo-overlay.ativo,.cm-overlay.on');
}
let _fimDiaTentativas=0;
function fimDoDiaChecar(){
  if(!S||!S.onboarding||!S.onboarding.feito)return;
  if(new Date().getHours()<FIM_DIA_HORA)return;
  if(S.fimDoDiaVisto===hoje())return;
  const itens=fimDoDiaItens();if(!itens.length)return;
  if(fimDoDiaOcupado()){if(_fimDiaTentativas++<6)setTimeout(fimDoDiaChecar,10000);return;}
  _fimDiaTentativas=0;
  S.fimDoDiaVisto=hoje();salva();
  fimDoDiaMostrar(itens);
}
function fimDoDiaMostrar(itens){
  let o=$('fimDiaModal');
  if(!o){
    o=document.createElement('div');o.className='modal-overlay';o.id='fimDiaModal';o.hidden=true;
    o.innerHTML=`<div class="modal-caixa" style="text-align:center">
      <div id="fimDiaGata" style="margin:0 auto 4px"></div>
      <div class="modal-pergunta">Olha o que você fez hoje</div>
      <div id="fimDiaLista" style="text-align:left;margin:10px 0 6px;max-height:48vh;overflow-y:auto"></div>
      <p class="mut" style="font-size:12.5px;line-height:1.5;margin:8px 0 0">Cada coisinha dessas é cuidado com você. Conta, sim.</p>
      <div class="modal-botoes" style="margin-top:14px"><button class="modal-btn prim" id="fimDiaOk" style="width:100%">Que bom 💜</button></div>
    </div>`;
    document.body.appendChild(o);
  }
  $('fimDiaLista').innerHTML=itens.map(i=>`<div class="cat-sugestao" style="cursor:default;margin-bottom:6px"><div class="txt"><b>${esc(i.emoji)} ${esc(i.txt)}</b></div><div class="add" style="color:var(--ok);font-size:14px">✓</div></div>`).join('');
  $('fimDiaOk').onclick=()=>fecharOverlay(o,()=>{const g=$('fimDiaGata');if(g)g.innerHTML='';});
  abrirOverlayTopo(o);
  try{if(typeof bijuCelebra==='function')bijuCelebra($('fimDiaGata'),120);}catch(e){}
}
setTimeout(fimDoDiaChecar,6000);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')setTimeout(fimDoDiaChecar,2500);});
