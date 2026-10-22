/* ============ O QUIZ VIRA PRÁTICAS (com as palavras da própria pessoa) ============
   Cada resposta do quiz que é um gesto possível vira uma prática no check-in, no grupo
   "🪞 Escolhidas por você no quiz". As respostas também passam a ser usadas:
   - quando uma nota do "Como estou hoje" vem baixa: sugere a resposta do momento certo;
   - nos marcos de 3, 7 e 21 dias: o mimo sai dessa lista, puxando pras respostas sobre comemorar;
   - nas dicas dos hábitos de água, leitura e movimento;
   - na pergunta do campo Observações e na frase-guia do resultado.
   Os textos ficam em QUIZ_PRATICAS (por pergunta, uma frase por alternativa A-E; null = não vira prática).
   Carregue depois de estilo-autocuidado.js e premio-pratica.js. */

const QUIZ_GRUPO='🪞 Escolhidas por você no quiz';
/* índice da pergunta (começando em 1) -> frases das alternativas A, B, C, D, E */
const QUIZ_PRATICAS={
  1:['Escrever pra mim algo que eu gostaria de ouvir','Ter um tempo só meu, sem pressa e sem celular','Preparar uma bebida especial ou algo que eu aprecio','Tirar da frente uma pendência pequena','Tomar um banho confortável e passar creme'],
  2:['Anotar três coisas que consegui hoje','Ficar uns minutos presente comigo, sem tarefa','Me dar uma pequena recompensa','Facilitar algo do dia seguinte','Alongar o corpo ou buscar uma sensação boa'],
  3:['Lembrar, com palavras claras, que eu também mereço cuidado','Ter um momento só meu, sem atender ninguém','Preparar um mimo pro resto do dia','Fazer uma coisa que deixe a rotina mais leve','Dar ao corpo um momento de conforto'],
  4:['Falar comigo como falaria com uma amiga','Fazer uma pausa pra entender o que aconteceu','Criar um pequeno ritual de conforto','Separar o que dá pra ajustar agora do que pode esperar','Respirar fundo e soltar os ombros'],
  5:['Escrever uma mensagem de incentivo pra mim','Ler, ouvir música ou tomar um chá sem fazer outra coisa','Usar algo especial que eu costumo guardar','Organizar uma coisa que facilite os próximos dias','Dançar, alongar ou curtir uma sensação boa no corpo'],
  6:['Reconhecer, com palavras, algo em que melhorei','Proteger um tempo pra algo importante pra mim','Me dar algo bonito ou prazeroso','Fazer um ajuste que deixe a rotina mais fácil','Fazer algo que deixe meu corpo mais confortável'],
  7:['Ler uma frase que defina uma intenção gentil pro dia','Tomar minha bebida favorita sem olhar o celular','Usar uma caneca, roupa ou perfume que me dê prazer','Deixar o essencial pronto na noite anterior','Fazer movimentos suaves ao acordar'],
  8:['Escrever um balanço do que eu enfrentei na semana','Reservar um tempo pra um hobby de que sinto falta','Me dar um agrado por ter chegado até aqui','Resolver algo que deixe a próxima semana mais tranquila','Tomar um banho relaxante no fim da semana'],
  11:['Dizer pra mim que começar pequeno já conta','Dedicar 5 minutos a algo de que eu gosto','Escolher uma coisa agradável pra começar mais leve','Fazer uma tarefa mínima que tire uma preocupação','Levantar, me espreguiçar e buscar conforto'],
  12:['Escrever o que estou sentindo, sem me julgar','Ficar um pouco em silêncio, com música ou só observando','Criar um momento de aconchego com algo de que gosto','Ver se alguma necessidade prática ficou de lado','Respirar com calma, tomar um banho ou relaxar o corpo'],
  13:['Escrever sobre quem eu sou além das obrigações','Retomar algo que eu fazia só por gosto','Escolher um objeto, aroma ou detalhe que tenha significado pra mim','Ajustar um canto da casa pro que eu preciso agora','Dançar ou caminhar devagar, prestando atenção no corpo'],
  14:['Lembrar que descansar não precisa ser prêmio','Agendar um intervalo de verdade, como um compromisso','Preparar algo gostoso pra acompanhar o descanso','Escolher o que pode esperar e liberar um tempo','Deitar com conforto e deixar o corpo descansar'],
  15:['Validar com palavras o esforço que fiz hoje','Me dar um tempo sem cobrança','Me oferecer um pequeno prazer sem precisar merecer','Preparar o mínimo pro dia seguinte pesar menos','Cuidar das necessidades do corpo que ficaram pra depois'],
  19:['Valorizar as escolhas possíveis que fiz na alimentação','Fazer uma refeição com calma e atenção','Comer algo que me dá prazer de verdade','Deixar uma refeição simples encaminhada','Prestar atenção na fome e na saciedade'],
  20:['Reconhecer o que já melhorou na casa','Reservar um tempo tranquilo pra cuidar da casa','Deixar um cantinho da casa mais agradável','Criar um jeito simples de a casa funcionar','Arrumar a casa fazendo pausas'],
  21:['Nomear o esforço que fiz pra concluir algo','Usar o tempo que sobrou pro que importa','Comemorar uma conquista com algo gostoso','Aproveitar a rotina mais simples','Sentir o corpo mais leve depois de resolver algo'],
  22:['Escrever uma carta pra mim','Fazer algo de que gosto, com atenção só nisso','Montar um pequeno presente pra mim com o que já tenho','Fazer por mim uma coisa prática que eu vinha precisando','Massagear as mãos ou me aconchegar numa manta'],
  26:['Anotar algo de que me orgulho','Ouvir uma música de que gosto, sem fazer outra coisa','Preparar uma bebida ou um pequeno agrado','Resolver uma pendência minúscula','Alongar, passar creme nas mãos ou respirar com calma'],
  27:['Escrever algo que eu reconheço em mim hoje','Ter alguns minutos de tranquilidade antes de dormir','Deixar o quarto gostoso: aroma, luz suave','Deixar coisas prontas pra manhã seguinte','Cuidar da pele ou alongar antes de dormir'],
  28:['Olhar pra minha autocrítica com mais justiça','Dar um passo atrás e fazer algo que me faça bem','Me permitir um prazer sem transformar em merecimento','Cortar o que não é essencial agora','Pausar e perceber a tensão no corpo']
};
/* dicas dos hábitos (água 16, leitura 17, movimento 18), escritas pra ela */
const QUIZ_DICAS={
  16:['Anote as vezes em que bebeu e repare na sua constância.','Faça da pausa da água um momento só seu, mesmo que curto.','Use um copo ou uma garrafa de que você goste de verdade.','Deixe a água no caminho por onde você já passa.','Repare em como o corpo responde quando está hidratado.'],
  17:['Anote o que sentiu ou pensou com a leitura.','Reserve um horário protegido, sem interrupções.','Escolha um livro bonito ou prepare um cantinho gostoso.','Deixe o livro à vista e fácil de pegar.','Leia numa posição confortável, com uma manta ou uma bebida.'],
  18:['Reconheça cada vez que você cumpriu o combinado consigo.','Escolha uma atividade em que dê pra curtir o momento.','Separe uma roupa ou um detalhe que dê vontade de começar.','Deixe horário, percurso ou materiais já encaminhados.','Escolha movimentos que tragam prazer ao corpo.']
};
const QUIZ_DICA_HABITO=[[16,/água/i],[17,/ler |leitura|livro/i],[18,/caminhar|exerc|dançar|alongar|ginást|movim/i]];
/* que pergunta responde a cada nota baixa do "Como estou hoje", e como chamar o momento */
const QUIZ_NOTA={fisica:[11,'sem disposição'],mental:[1,'cansada'],humor:[12,'triste'],calma:[14,'sem conseguir descansar'],autoconf:[4,'se criticando'],casa:[20,'com a casa pesando'],organizacao:[20,'com a casa pesando'],limpeza:[20,'com a casa pesando']};
/* perguntas sobre comemorar: o mimo dos marcos sai daqui primeiro */
const QUIZ_COMEMORAR=[2,6,8,15,21];

function quizRespostas(){const e=S.estiloAutocuidado;return e&&e.feito&&Array.isArray(e.respostas)?e.respostas:null;}
function quizPraticaDe(n){const r=quizRespostas();if(!r)return null;const c=r[n-1];const l=QUIZ_PRATICAS[n];if(!c||!l)return null;return l['ABCDE'.indexOf(c)]||null;}
function quizCandidatas(){
  const lista=[];
  Object.keys(QUIZ_PRATICAS).map(Number).sort((a,b)=>a-b).forEach(n=>{const t=quizPraticaDe(n);if(t&&!lista.includes(t))lista.push(t);});
  return lista;
}
function quizMontarPraticas(escolhidas){
  const r=quizRespostas();if(!r)return;
  const lista=Array.isArray(escolhidas)?escolhidas:quizCandidatas();
  const novo={};novo[QUIZ_GRUPO]=lista;
  Object.entries(S.praticas||{}).forEach(([g,l])=>{if(g!==QUIZ_GRUPO)novo[g]=l;});
  S.praticas=novo;PRATICAS=S.praticas;salva();
  try{renderPraticasCheckin();}catch(e){}
}

/* ---- ao terminar o quiz: guarda as respostas e monta as práticas ---- */
window.estiloFinalizar=(function(orig){return function(){
  const resp=(typeof estiloRespostas!=='undefined'&&estiloRespostas||[]).slice();
  const r=orig.apply(this,arguments);
  try{S.estiloAutocuidado.respostas=resp;S.estiloAutocuidado.revisarPraticas=true;salva();quizAplicarObs();if(typeof quizCardAtualizar==='function')quizCardAtualizar();}catch(e){console.warn('quiz práticas',e);}
  return r;
};})(window.estiloFinalizar);

/* ---- nota baixa: sugere a resposta do momento certo ---- */
window.sugerirPraticas=(function(orig){return function(notas,praticas){
  const base=orig(notas,praticas)||[];
  if(!quizRespostas())return base;
  const ja=new Set(),pers=[];
  Object.entries(notas||{}).filter(([k,v])=>typeof v==='number'&&v>=1&&v<=4&&QUIZ_NOTA[k]).sort((a,b)=>a[1]-b[1]).forEach(([k])=>{
    const [n,momento]=QUIZ_NOTA[k];const t=quizPraticaDe(n);if(!t)return;
    const key=QUIZ_GRUPO+'|'+t;
    if((praticas||{})[key]||ja.has(key)||!(S.praticas[QUIZ_GRUPO]||[]).includes(t))return;
    ja.add(key);pers.push({key,label:t,grupo:QUIZ_GRUPO,momento});
  });
  return pers.concat(base.filter(s=>!ja.has(s.key)));
};})(window.sugerirPraticas);

/* ---- marcos: o mimo sai das respostas do quiz, puxando pras de comemorar ---- */
window.sortearPratica=(function(orig){return function(excluirId){
  const l=(S.praticas&&S.praticas[QUIZ_GRUPO])||[];
  if(!quizRespostas()||!l.length)return orig(excluirId);
  const feitas=((S.checkins||{})[hoje()]||{}).praticas||{};
  const comemorar=new Set(QUIZ_COMEMORAR.map(quizPraticaDe).filter(Boolean));
  let pool=l.map(t=>({id:'pr|'+QUIZ_GRUPO+'|'+t,nome:t,grupo:'Do seu quiz',key:QUIZ_GRUPO+'|'+t,pratica:true,peso:comemorar.has(t)?4:1}))
    .filter(p=>!feitas[p.key]&&p.id!==excluirId);
  if(pool.length>1)pool=pool.filter(p=>p.id!==ultimaPraticaPremio);
  if(!pool.length)return orig(excluirId);
  const tot=pool.reduce((a,x)=>a+x.peso,0);let r=Math.random()*tot,p=pool[0];
  for(const x of pool){r-=x.peso;if(r<=0){p=x;break;}}
  ultimaPraticaPremio=p.id;return p;
};})(window.sortearPratica);
window.praticasComoPremio=(function(orig){return function(){
  const l=(S.praticas&&S.praticas[QUIZ_GRUPO])||[];
  return quizRespostas()&&l.length?l.map(t=>({id:'pr|'+QUIZ_GRUPO+'|'+t,nome:t,grupo:'Do seu quiz',key:QUIZ_GRUPO+'|'+t,pratica:true})):orig();
};})(window.praticasComoPremio);
/* o grupo do quiz vale como "de autocuidado" no sorteio */
window.estiloDoGrupo=(function(orig){return function(g){return g===QUIZ_GRUPO||g==='Do seu quiz'?'quiz':orig(g);};})(window.estiloDoGrupo);

/* ---- dicas dos hábitos de água, leitura e movimento ---- */
function quizDicaHabito(nome){
  const r=quizRespostas();if(!r)return null;
  for(const [n,re] of QUIZ_DICA_HABITO)if(re.test(nome||'')){const c=r[n-1];const t=c&&QUIZ_DICAS[n][('ABCDE').indexOf(c)];if(t)return t;}
  return null;
}
window.filaBase=(function(orig){return function(){
  return orig().map(c=>({...c,itens:c.itens.map(i=>{const d=quizDicaHabito(i.nome);return d?{...i,texto:'Do seu quiz: '+d}:i;})}));
};})(window.filaBase);

/* ---- a pergunta das Observações e a frase-guia ---- */
const QUIZ_OBS=['Hoje, eu gostaria de ouvir que…','Se eu tivesse 15 minutos só meus, como gostaria de usá-los?','Que pequeno prazer faria diferença no meu dia?','Que coisa prática está me sobrecarregando e pode ser simplificada?','O que meu corpo está pedindo neste momento?'];
const QUIZ_FRASE=['Quero aprender a falar comigo com mais gentileza.','Quero reservar espaço na minha vida para mim.','Quero permitir que os pequenos prazeres façam parte da rotina.','Quero facilitar minha vida em vez de dificultá-la.','Quero tratar meu corpo com atenção e respeito.'];
function quizAplicarObs(){const r=quizRespostas();const el=$('ciObs');if(!r||!el)return;const c=r[23];if(c)el.placeholder=QUIZ_OBS['ABCDE'.indexOf(c)];}
/* ---- antes de inserir: ela escolhe quais têm a ver com ela ---- */
function quizAbrirRevisao(depois){
  let o=$('quizRevisaoModal');
  if(!o){
    o=document.createElement('div');o.className='modal-overlay';o.id='quizRevisaoModal';o.hidden=true;
    o.innerHTML='<div class="modal-caixa alta" style="text-align:left;max-width:460px"><div class="modal-emoji">🪞</div><div class="modal-pergunta" style="text-align:center">Quais têm a ver com você?</div><p class="mut" style="font-size:13px;line-height:1.55;text-align:center;margin:0 0 14px">Essas são as suas respostas no quiz. As que você deixar marcadas viram práticas no seu check-in. Toque pra desmarcar o que não combina.</p><div id="quizRevisaoLista" class="quiz-rev-lista"></div><div class="modal-botoes" style="margin-top:14px"><button type="button" class="modal-btn prim" id="quizRevisaoOk" style="flex:1">Guardar no meu check-in</button></div></div>';
    document.body.appendChild(o);
  }
  const atuais=(S.praticas||{})[QUIZ_GRUPO];
  const cand=quizCandidatas();
  const marcadas=new Set(Array.isArray(atuais)&&!S.estiloAutocuidado.revisarPraticas?atuais:cand);
  $('quizRevisaoLista').innerHTML=cand.map(t=>`<button type="button" class="quiz-rev ${marcadas.has(t)?'on':''}" data-t="${esc(t)}"><span class="quiz-rev-check"></span>${esc(t)}</button>`).join('');
  $('quizRevisaoLista').onclick=e=>{const b=e.target.closest('.quiz-rev');if(b)b.classList.toggle('on');};
  $('quizRevisaoOk').onclick=()=>{
    const esc2=[...$('quizRevisaoLista').querySelectorAll('.quiz-rev.on')].map(b=>b.dataset.t);
    S.estiloAutocuidado.revisarPraticas=false;quizMontarPraticas(esc2);
    fecharOverlay(o,()=>{mostrarToast(esc2.length?esc2.length+' práticas no seu check-in ✓':'Tudo bem, nenhuma entrou agora');if(depois)depois();});
  };
  abrirOverlay(o);
}
window.estiloMostrarResultado=(function(orig){return function(){
  if(S.estiloAutocuidado&&S.estiloAutocuidado.revisarPraticas&&quizRespostas()){quizAbrirRevisao(()=>window.estiloMostrarResultado());return;}
  const r=orig.apply(this,arguments);
  try{const resp=quizRespostas();const c=resp&&resp[24];const box=$('estiloResultadoCorpo');
    if(c&&box){const f=document.createElement('div');f.className='quiz-frase';f.innerHTML='<span>A sua frase</span>“'+esc(QUIZ_FRASE['ABCDE'.indexOf(c)])+'”';const ref=box.querySelector('.card2');box.insertBefore(f,ref||box.firstChild.nextSibling);}
    const n=((S.praticas||{})[QUIZ_GRUPO]||[]).length;
    if(n&&box){const a=document.createElement('div');a.className='aviso';a.style.marginBottom='12px';a.innerHTML='🪞 <b>'+n+' respostas suas viraram práticas</b> no check-in, no grupo “Escolhidas por você no quiz”. <button type="button" class="dv-link" id="quizRever">Rever quais entram</button>';const ref2=box.querySelector('.card2');box.insertBefore(a,ref2||null);
      $('quizRever').onclick=()=>fecharOverlay($('estiloResultadoModal'),()=>quizAbrirRevisao(()=>window.estiloMostrarResultado()));}
  }catch(e){}
  return r;
};})(window.estiloMostrarResultado);

/* ---- quem fez o quiz antes (sem as respostas guardadas) recebe o convite pra refazer ---- */
window.quizCardAtualizar=function(){
  const c=$('quizCard');if(!c)return;
  const e=S.estiloAutocuidado;const feito=!!(e&&e.feito);
  c.hidden=feito&&!!quizRespostas();
  if(feito&&!quizRespostas()){
    const b=c.querySelector('.quiz-txt b'),s=c.querySelector('.quiz-txt span'),bt=$('btnQuizCard');
    if(b)b.textContent='Seu quiz ficou ainda melhor';
    if(s)s.textContent='Refaça e as suas respostas viram práticas aqui no check-in, com as suas palavras.';
    if(bt)bt.textContent='Refazer o quiz';
  }
};
quizCardAtualizar();quizAplicarObs();
