/* ============ QUE BOM VOCÊ DE VOLTA ============
   Aparece uma vez, quando a pessoa abre o app depois de 14 dias ou mais longe (avisosIniciais, em resumos.js).
   Nunca cobra hábito: reconhece que a vida ocupou ela e convida pra algo leve, conforme o que já está aberto
   (check-in, mapa ou só os hábitos). No fim, discretamente, dá pra pausar todos os hábitos ou revisar.
   Para mudar os textos, mexa só em DV_TEXTOS. */
const DV_TEXTOS={
  titulo:'Que bom você de volta',
  abertura:'Se você ficou um tempo longe, é porque a vida precisou de você em outro lugar, e tudo bem. Não tem nada pra recuperar nem pra dar conta agora.',
  conviteCheckin:'Se tiver um minutinho, que tal só contar como você está hoje?',
  conviteHabitos:'Quando der vontade, um gesto pequeno já é recomeço.',
  esperando:'Com 3 dias de hábito, uma parte nova do app se abre pra você. Ela está aqui esperando, no seu tempo.',
  pausa:'Se a vida está pedindo muito agora, dá pra dar uma pausa nos seus hábitos e voltar quando fizer sentido. Os dias que você já marcou ficam guardados.',
  pausou:'Seus hábitos estão em pausa. Quando quiser voltar, é só retomar em Gerenciar hábitos.'
};
function deVolta(depois){
  let o=$('dvModal');
  if(!o){
    o=document.createElement('div');o.className='modal-overlay';o.id='dvModal';o.hidden=true;o.style.zIndex='270';
    o.innerHTML='<div class="modal-caixa" style="max-width:420px"><div id="dvGata" class="dv-gata"></div><div class="modal-pergunta" id="dvTitulo" style="text-align:center"></div><div id="dvCorpo"></div><div class="modal-botoes dv-botoes" id="dvBotoes"></div><div id="dvRodape" class="dv-rodape"></div></div>';
    document.body.appendChild(o);
  }
  const ativos=(S.habitos||[]).filter(h=>!h.pausado);
  const temCheckin=abaLiberada('diario'),temMapa=abaLiberada('mapa');
  const nadaAberto=abasProgressivo()&&!temCheckin;
  const fechar=fn=>fecharOverlay(o,()=>{if(fn)fn();else if(typeof depois==='function')depois();});
  // gatinha acenando (se o motor dela carregou)
  const gata=window.customElements&&customElements.get('gatinha-fantoche');
  $('dvGata').innerHTML=gata?'<gatinha-fantoche pose="sentada" src-base="mascote/assets/pecas/" aria-hidden="true" style="width:110px;display:block;margin:0 auto"></gatinha-fantoche>':'<div class="modal-emoji">🌿</div>';
  const g=$('dvGata').querySelector('gatinha-fantoche');
  if(g)g.addEventListener('ready',()=>setTimeout(()=>{try{g.play('tchau');}catch(e){}},350),{once:true});
  $('dvTitulo').textContent=DV_TEXTOS.titulo;
  const p=t=>`<p class="mut" style="font-size:13.5px;line-height:1.6;margin:0 0 12px;text-align:center">${esc(t)}</p>`;
  $('dvCorpo').innerHTML=p(DV_TEXTOS.abertura)+p(temCheckin?DV_TEXTOS.conviteCheckin:DV_TEXTOS.conviteHabitos)+(nadaAberto?p(DV_TEXTOS.esperando):'');
  const bt=$('dvBotoes');bt.innerHTML='';
  const botao=(rot,cls,fn)=>{const b=document.createElement('button');b.type='button';b.className='modal-btn '+cls;b.textContent=rot;b.onclick=fn;bt.appendChild(b);};
  if(temCheckin)botao('Fazer o check-in','prim',()=>fechar(()=>trocaAba('diario')));
  else botao('Ver meus hábitos','prim',()=>fechar(()=>trocaAba('hoje')));
  if(temMapa)botao('Olhar meu mapa','sec',()=>fechar(()=>trocaAba('mapa')));
  botao('Só olhar hoje','sec',()=>fechar());
  // rodapé discreto: pausar tudo ou revisar, só se houver hábitos
  const rod=$('dvRodape');rod.innerHTML='';
  if(ativos.length){
    rod.innerHTML=`<p>${esc(DV_TEXTOS.pausa)}</p><div><button type="button" class="dv-link" id="dvPausar">Pausar meus hábitos por enquanto</button><button type="button" class="dv-link" id="dvRevisar">Revisar hábitos</button></div>`;
    $('dvPausar').onclick=()=>fechar(()=>{(S.habitos||[]).forEach(h=>{if(!h.pausado){h.pausado=true;h.pausaGeral=true;}});S.pausaGeralEm=Date.now();salva();renderHoje();try{renderHabitos();}catch(e){}mostrarToast(DV_TEXTOS.pausou);});
    $('dvRevisar').onclick=()=>fechar(()=>abrirRevisaoHabitos());
  }
  abrirOverlay(o);
}
