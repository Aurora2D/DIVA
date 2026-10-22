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
    document.querySelectorAll('.tabs-bar button').forEach(b=>{b.hidden=!abaLiberada(b.dataset.tab);});
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
    const g=$('abaBvEmoji').querySelector('gatinha-fantoche');const f=()=>{try{g.play('pular');}catch(e){}};g.addEventListener('ready',()=>setTimeout(f,350),{once:true});g.onclick=()=>{try{g.play(['feliz','tchau','curiosa'][Math.floor(Math.random()*3)]);}catch(e){}};}
  else $('abaBvEmoji').textContent=r.emoji;$('abaBvTitulo').textContent=r.titulo;$('abaBvTexto').textContent=r.texto;
  $('abaBvSim').textContent=r.botao;
  $('abaBvSim').onclick=()=>fecharOverlay(o,()=>trocaAba(t));
  $('abaBvNao').onclick=()=>fecharOverlay(o);
  abrirOverlay(o);
}
/* quem já tinha o app antes de existir esse recurso continua vendo tudo */
if(S.tabsLiberadas===undefined&&S.onboarding&&S.onboarding.feito){S.tabsLiberadas='todas';salva();}
