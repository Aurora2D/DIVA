/* ============ ABAS QUE ABREM AOS POUCOS ============
   Quem chega novo vê só a aba Hoje. As outras aparecem conforme a pessoa avança, cada uma com uma telinha de boas-vindas.
   Quem já usava o app antes continua vendo tudo ('todas'). Em Configurações dá para escolher "Mostrar todas as abas". */
const ABAS_REGRAS=[
  {tab:'diario',  ok:()=>(S.habitos||[]).some(h=>Object.keys(h.feitos||{}).length>=3),
   emoji:'📝',titulo:'Seu check-in chegou',
   texto:'Você já ficou 3 dias com um hábito, e isso mostra que dá para você. Agora abre um espaço para registrar como foi o seu dia: sono, disposição, refeições e o que você sentiu. É rápido, é só seu e não tem resposta certa.',
   botao:'Conhecer agora'},
  {tab:'mapa',    ok:()=>(S.habitos||[]).some(h=>Object.keys(h.feitos||{}).length>=7),
   emoji:'🗺️',titulo:'Seu mapa chegou',
   texto:'Depois de 7 dias com você, é hora de olhar um pouco para dentro. O mapa faz algumas perguntas e, a cada 21 dias, devolve um retrato de como você está, em forma de carta. Leva alguns minutos e não tem nota.',
   botao:'Fazer meu mapa'},
  {tab:'celebrar',ok:()=>((S.ciclo&&S.ciclo.historico)||[]).length>=1,
   emoji:'🎁',titulo:'O Celebrar chegou',
   texto:'Você completou o seu primeiro mapa, e isso já merece uma comemoração. Aqui ficam seus prêmios e suas conquistas, para você lembrar do que já fez.',
   botao:'Conhecer agora'},
  {tab:'atracao', ok:()=>((S.ciclo&&S.ciclo.historico)||[]).length>=1,
   emoji:'✨',titulo:'A Atração chegou',
   texto:'Você completou o seu primeiro ciclo. A Atração é um espaço de sete sessões para olhar para o que você quer e dar o primeiro passo, no seu ritmo.',
   botao:'Conhecer agora'}
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
      ABAS_REGRAS.forEach(r=>{if(!S.abasLiberadas[r.tab]&&r.ok()){S.abasLiberadas[r.tab]=true;S.abasPendentes.push(r.tab);mudou=true;}});
      if(mudou)salva();
    }
    document.querySelectorAll('.tabs-bar button').forEach(b=>{b.hidden=!abaLiberada(b.dataset.tab);});
    if(mostrar&&abasProgressivo()&&S.abasPendentes&&S.abasPendentes.length&&!document.querySelector('.modal-overlay.ativo,.onb-overlay.ativo'))abasBoasVindas();
  }catch(e){console.warn('abas',e);}
}
function abasBoasVindas(){
  const t=S.abasPendentes.shift();salva();
  const r=ABAS_REGRAS.find(x=>x.tab===t);const o=$('abaBoasVindasModal');if(!r||!o)return;
  $('abaBvEmoji').textContent=r.emoji;$('abaBvTitulo').textContent=r.titulo;$('abaBvTexto').textContent=r.texto;
  $('abaBvSim').textContent=r.botao;
  $('abaBvSim').onclick=()=>fecharOverlay(o,()=>trocaAba(t));
  $('abaBvNao').onclick=()=>fecharOverlay(o,()=>abasAtualizar(true));
  abrirOverlay(o);
}
/* quem já tinha o app antes de existir esse recurso continua vendo tudo */
if(S.tabsLiberadas===undefined&&S.onboarding&&S.onboarding.feito){S.tabsLiberadas='todas';salva();}
