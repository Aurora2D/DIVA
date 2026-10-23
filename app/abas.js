/* ============ ABAS QUE ABREM AOS POUCOS ============
   Quem chega novo vê só a aba Hoje. As outras aparecem conforme a pessoa avança, cada uma com uma telinha de boas-vindas.
   Quem já usava o app antes continua vendo tudo ('todas'). Em Configurações dá para escolher "Mostrar todas as abas". */
/* quando o app abriu desta vez: a Atração só chega numa abertura depois da que trouxe o Celebrar */
const ABAS_SESSAO=Date.now();
const ABAS_REGRAS=[
  {tab:'diario',  ok:()=>(S.habitos||[]).some(h=>Object.keys(h.feitos||{}).length>=3),
   emoji:'📝',titulo:'Você desbloqueou o Check-in!',
   texto:'3 dias de hábito, diva! Você está indo tão bem que abriu uma parte nova pra você: um cantinho pra contar como dormiu, comeu e se sentiu, e marcar as práticas do dia. Leva um minutinho e é só seu.',
   botao:'Conferir agora'},
  {tab:'mapa',    ok:()=>(S.habitos||[]).some(h=>Object.keys(h.feitos||{}).length>=7),
   emoji:'🗺️',titulo:'Você desbloqueou o Mapa emocional!',
   texto:'Uma semana com você! Quem chega até aqui merece se olhar mais de perto: agora dá pra fazer o seu primeiro mapa, algumas perguntas que, a cada 21 dias, viram uma carta com o retrato de como você está. Sem nota, sem certo e errado.',
   botao:'Fazer meu mapa'},
  {tab:'celebrar',ok:()=>((S.ciclo&&S.ciclo.historico)||[]).length>=1,
   emoji:'🎁',titulo:'Você desbloqueou o Celebrar!',
   texto:'Seu primeiro retrato está pronto, e foi a sua constância que te trouxe até aqui. Agora você tem um lugar pra olhar pro caminho que já fez: cada conquista fica guardada aqui, junto com o seu Livro de Conquistas.',
   botao:'Conferir agora'},
  {tab:'atracao', ok:()=>{const em=S.abasLiberadasEm&&S.abasLiberadasEm.celebrar;return !!(S.abasLiberadas&&S.abasLiberadas.celebrar)&&(!em||em<ABAS_SESSAO);},
   emoji:'✨',titulo:'Você desbloqueou a Atração!',
   texto:'Você seguiu, e o app seguiu se abrindo junto. Agora que você se conhece um pouco mais, é hora de olhar pro que você quer. São sete sessões pra transformar desejo em primeiro passo, no seu ritmo.',
   botao:'Começar a primeira'}
];
function abasProgressivo(){return S.tabsLiberadas==='progressivo';}
function abaLiberada(t){return t==='hoje'||!abasProgressivo()||!!(S.abasLiberadas&&S.abasLiberadas[t]);}
/* pista do que falta pra abrir cada aba (convite, nunca cobrança) */
function abaPista(t){
  const dias=Math.max(0,...(S.habitos||[]).map(h=>Object.keys(h.feitos||{}).length));
  const falta=n=>{const f=n-dias;return f===1?'Falta só 1 dia de hábito':'Faltam '+f+' dias de hábito';};
  if(t==='diario')return dias?falta(3)+' pra abrir o Check-in. Sem pressa 💜':'O Check-in abre quando você marcar um hábito em 3 dias. Sem pressa 💜';
  if(t==='mapa')return dias?falta(7)+' pra abrir o Mapa emocional. No seu ritmo 💜':'O Mapa emocional abre com 7 dias de hábito. No seu ritmo 💜';
  if(t==='celebrar')return abaLiberada('mapa')?'O Celebrar abre quando o seu primeiro Mapa emocional ficar pronto 🎁':'O Celebrar abre depois do Mapa emocional. Ainda tem caminho bonito antes 🎁';
  if(t==='atracao')return abaLiberada('celebrar')?'Quase! A Atração abre na próxima vez que você entrar no app ✨':'A Atração é a última a abrir, depois do Celebrar ✨';
  return 'Essa parte ainda está guardada pra você 💜';
}
/* tela ainda fechada: tudo esmaecido e inativo (inert), menos o aviso do topo */
function abaTelaTrava(sec,t,trav){
  let av=sec.querySelector(':scope > .aba-trava-aviso');
  if(trav){
    if(!av){av=document.createElement('div');av.className='aba-trava-aviso';sec.prepend(av);}
    av.innerHTML='<span class="ata-cad" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg></span><div><b>Essa parte ainda está guardada pra você</b><span>'+esc(abaPista(t))+'</span></div>';
    sec.classList.add('aba-travada');
    [...sec.children].forEach(c=>{if(c!==av)c.inert=true;});
  }else{
    if(av)av.remove();
    if(sec.classList.contains('aba-travada')){sec.classList.remove('aba-travada');[...sec.children].forEach(c=>{c.inert=false;});}
  }
}
/* toque numa aba travada: balancinho no cadeado e a pista, sem trocar de tela */
function abaTravadaToque(t){
  const b=document.querySelector('.tabs-bar button[data-tab="'+t+'"]');
  if(b){b.classList.remove('balanca');void b.offsetWidth;b.classList.add('balanca');setTimeout(()=>b.classList.remove('balanca'),500);}
  if(navigator.vibrate)try{navigator.vibrate(15);}catch(e){}
  mostrarToast('🔒 '+abaPista(t));
}
/* confere quem já merece abrir; mostrar=true também mostra a telinha de boas-vindas, se não houver outra coisa aberta */
function abasAtualizar(mostrar){
  try{
    if(abasProgressivo()){
      if(!S.abasLiberadas)S.abasLiberadas={};
      if(!Array.isArray(S.abasPendentes))S.abasPendentes=[];
      let mudou=false;
      if(!S.abasLiberadasEm)S.abasLiberadasEm={};
      ABAS_REGRAS.forEach(r=>{if(!S.abasLiberadas[r.tab]&&r.ok()){S.abasLiberadas[r.tab]=true;S.abasLiberadasEm[r.tab]=Date.now();S.abasPendentes.push(r.tab);mudou=true;}});
      if(mudou)salva();
    }
    /* a barra fica toda aberta; quem ainda não abriu é a TELA: o conteúdo aparece esmaecido, sem dar pra usar, com um aviso no topo */
    document.querySelectorAll('.tabs-bar button').forEach(b=>{
      const t=b.dataset.tab,trav=!abaLiberada(t),sec=$('tab-'+t),era=!!(sec&&sec.classList.contains('aba-travada'));
      b.hidden=false;b.classList.remove('travada');b.removeAttribute('aria-disabled');
      if(sec)abaTelaTrava(sec,t,trav);
      if(era&&!trav){b.classList.remove('abriu');void b.offsetWidth;b.classList.add('abriu');setTimeout(()=>b.classList.remove('abriu'),1400);}
    });
    if(mostrar&&!abasMostrouNestaAbertura&&abasProgressivo()&&S.abasPendentes&&S.abasPendentes.length&&!document.querySelector('.modal-overlay.ativo,.onb-overlay.ativo'))abasBoasVindas();
  }catch(e){console.warn('abas',e);}
}
/* uma telinha de desbloqueio por abertura do app; se tiver mais de uma na fila, a próxima espera a próxima abertura */
let abasMostrouNestaAbertura=false;
function abasBoasVindas(){
  const t=S.abasPendentes.shift();salva();abasMostrouNestaAbertura=true;
  const r=ABAS_REGRAS.find(x=>x.tab===t);const o=$('abaBoasVindasModal');if(!r||!o)return;
  const gataOk=window.customElements&&customElements.get('gatinha-fantoche');
  if(gataOk){$('abaBvEmoji').innerHTML='<gatinha-fantoche pose="sentada" src-base="mascote/assets/pecas/" aria-hidden="true" style="width:120px;display:block;margin:0 auto"></gatinha-fantoche>';
    const g=$('abaBvEmoji').querySelector('gatinha-fantoche');const f=()=>{try{g.play('pular');}catch(e){}};g.addEventListener('ready',()=>setTimeout(f,350),{once:true});gataTocavel(g);}
  else $('abaBvEmoji').textContent=r.emoji;$('abaBvTitulo').textContent=r.titulo;$('abaBvTexto').textContent=r.texto;
  $('abaBvSim').textContent=r.botao;
  $('abaBvSim').onclick=()=>fecharOverlay(o,()=>trocaAba(t));
  $('abaBvNao').onclick=()=>fecharOverlay(o);
  abrirOverlay(o);
}
/* quem já tinha o app antes de existir esse recurso continua vendo tudo */
if(S.tabsLiberadas===undefined&&S.onboarding&&S.onboarding.feito){S.tabsLiberadas='todas';salva();}
