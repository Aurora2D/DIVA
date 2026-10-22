/* ============ COMO ESTOU HOJE + O QUE O QUIZ DIZ DE CADA MOMENTO ============
   Notas do check-in: seis pra todo mundo, mais "Cuidado do meu jeito" (quem fez o quiz)
   e dança/belting/lírico (só pra quem canta ou toca). Notas antigas (organização e limpeza
   do lar) continuam em ESCALAS só pra mostrar o histórico.
   O quiz agora guarda cada resposta e, a partir delas, a linguagem que a pessoa escolheu
   em cada tipo de momento (cansada, triste, se criticando...). Quando uma nota vem baixa,
   o check-in sugere uma prática dessa linguagem e explica o porquê. Nos marcos de 3, 7 e 21
   dias, a prática sorteada puxa pra linguagem de comemorar. Carregue depois de premio-pratica.js. */

const ESCALAS_BASE=['fisica','mental','humor','calma','casa','autoconf'];
const ESCALAS_MUSICA=['danca','belting','lirico'];
const LINGUAGEM_ESCALA={palavras:'Fui gentil comigo nas palavras',tempo:'Tive um tempo só meu',presentes:'Me dei algum agrado',servico:'Minha vida esteve mais leve',toque:'Meu corpo se sentiu cuidado'};
function quizFeito(){return !!(S.estiloAutocuidado&&S.estiloAutocuidado.feito);}
function escalasHoje(){
  const rot=Object.fromEntries(ESCALAS);
  const l=ESCALAS_BASE.map(k=>[k,rot[k]]);
  if(quizFeito())l.push(['linguagem',LINGUAGEM_ESCALA[S.estiloAutocuidado.principal]||rot.linguagem]);
  if(musicaAtiva())ESCALAS_MUSICA.forEach(k=>l.push([k,rot[k]]));
  return l;
}

/* ---- momentos do quiz (índices das perguntas, começando em 0) ---- */
const QUIZ_MOMENTOS={
  cansaco:{perguntas:[0,10,13],frase:'cansada'},
  tristeza:{perguntas:[11],frase:'triste'},
  desconexao:{perguntas:[12],frase:'distante de si'},
  autocritica:{perguntas:[3,27],frase:'se criticando'},
  cuidandoOutros:{perguntas:[2],frase:'depois de cuidar dos outros o dia todo'},
  casa:{perguntas:[19],frase:'com a casa pesando'},
  comemorar:{perguntas:[1,5,20,29],frase:'comemorando'}
};
/* qual momento cada nota baixa representa */
const NOTA_MOMENTO={fisica:'cansaco',mental:'cansaco',humor:'tristeza',calma:'desconexao',autoconf:'autocritica',casa:'casa'};
const LINGUAGEM_NOME={palavras:'palavras de afirmação',tempo:'tempo de qualidade',presentes:'presentes',servico:'atos de serviço',toque:'toque físico'};
function quizMomentos(respostas,scores){
  const out={};
  const catId=c=>(ESTILO_CATS[c]||{}).id;
  Object.entries(QUIZ_MOMENTOS).forEach(([m,def])=>{
    const cont={};def.perguntas.forEach(i=>{const c=respostas[i];if(c)cont[c]=(cont[c]||0)+1;});
    const ord=Object.keys(cont).sort((a,b)=>cont[b]-cont[a]||((scores||{})[catId(b)]||0)-((scores||{})[catId(a)]||0));
    if(ord.length)out[m]=catId(ord[0]);
  });
  return out;
}
function linguagemDoMomento(m){
  const e=S.estiloAutocuidado;if(!e||!e.feito)return null;
  return (e.momentos&&e.momentos[m])||e.principal||null;
}
/* guarda as respostas e os momentos ao terminar o quiz */
window.estiloFinalizar=(function(orig){return function(){
  const resp=(estiloRespostas||[]).slice();
  const r=orig.apply(this,arguments);
  try{const e=S.estiloAutocuidado;e.respostas=resp;e.momentos=quizMomentos(resp,e.scores);salva();ciRemontar();}catch(err){console.warn('quiz momentos',err);}
  return r;
};})(window.estiloFinalizar);
function ciRemontar(){try{ciMontado=false;montaCheckin();atualizaStatusCheckin();}catch(e){}}

/* ---- prática de uma linguagem, da lista da própria pessoa ---- */
function praticaDaLinguagem(lang,praticasHoje,ja){
  const grupos=Object.entries(S.praticas||{}).filter(([g])=>estiloDoGrupo(g)===lang);
  for(const [g,itens] of grupos)for(const it of itens){const k=g+'|'+it;if(!(praticasHoje||{})[k]&&!ja.has(k))return{key:k,label:it,grupo:g};}
  return null;
}
window.sugerirPraticas=(function(orig){return function(notas,praticas){
  const base=orig(notas,praticas)||[];
  if(!quizFeito())return base;
  const ja=new Set(),pers=[];
  const baixas=Object.entries(notas||{}).filter(([k,v])=>typeof v==='number'&&v>=1&&v<=4&&(NOTA_MOMENTO[k]||k==='linguagem')).sort((a,b)=>a[1]-b[1]);
  baixas.forEach(([k])=>{
    const m=NOTA_MOMENTO[k];
    const lang=k==='linguagem'?S.estiloAutocuidado.principal:linguagemDoMomento(m);
    const p=lang&&praticaDaLinguagem(lang,praticas,ja);if(!p)return;
    ja.add(p.key);
    p.motivo=(k==='linguagem'?'faltou o seu jeito':QUIZ_MOMENTOS[m].frase)+' → '+LINGUAGEM_NOME[lang];
    pers.push(p);
  });
  return pers.concat(base.filter(s=>!ja.has(s.key)));
};})(window.sugerirPraticas);

/* ---- marcos: a prática puxa pra linguagem de comemorar ---- */
/* o peso é por linguagem (dividido pelo número de práticas dela), pra uma lista grande não passar na frente */
window.pesoPratica=function(p){
  const est=estiloDoGrupo(p.grupo);if(!est)return 1;
  const n=Object.entries(S.praticas||{}).filter(([g])=>estiloDoGrupo(g)===est).reduce((a,[,l])=>a+(l||[]).length,0)||1;
  const m=S.estiloAutocuidado&&S.estiloAutocuidado.momentos;
  let w;try{w=pesoEstilo(est);}catch(e){w=1;}
  if(m&&m.comemorar&&est===m.comemorar)w=6;
  return w/n;
};

/* quando a pessoa liga ou desliga a música, as notas se ajustam */
(function(){const c=$('cfgMusica');document.addEventListener('change',e=>{if(e.target&&e.target.id==='cfgMusica')ciRemontar();});})();
