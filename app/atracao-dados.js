/* ===== Losier: modelos do corpo da Declaração de Desejo ===== */
const MODELOS_CORPO=[
  {k:'entusiasmada',pre:'Me sinto entusiasmada ao pensar que posso',ph:'ex: dividir as tarefas e ter tempo pra mim'},
  {k:'amo_quando',pre:'Amo quando eu posso',ph:'ex: ter tempo pra mim'},
  {k:'ad_ideia',pre:'Adoro a ideia de',ph:'ex: decidir o meu valor com autonomia'},
  {k:'ad_saber',pre:'Amo saber que posso',ph:'ex: sustentar o meu preço com leveza'},
  {k:'animado_ideia',pre:'Amo a ideia de',ph:'ex: honrar o preço das minhas aulas'},
  {k:'ad_sensacao',pre:'Me sinto feliz ao imaginar que posso',ph:'ex: valorizar o que eu ensino'},
  {k:'eu_decidi',pre:'Eu decidi',ph:'ex: cobrar com base no que ofereço'},
  {k:'e_bom_saber',pre:'É tão bom saber que posso',ph:'ex: escolher os meus horários'},
  {k:'me_empolga',pre:'Me empolga pensar em',ph:'ex: abrir uma turma nova'},
  {k:'amo_sentir',pre:'Amo sentir que posso',ph:'ex: contar com o meu próprio ritmo'},
  {k:'sinto_alegria',pre:'Sinto alegria em',ph:'ex: ver o meu trabalho reconhecido'},
  /* inícios antigos: só aparecem em frases já escritas, não são oferecidos de novo */
  {k:'cada_vez',pre:'Eu decidi',ph:'',oculto:true},
  {k:'me_anima',pre:'Amo a ideia de',ph:'',oculto:true}
];
const ABERTURA_FIXA=t=>{
  let nucleo=(t||'').trim()||'o desejo ideal';
  // se ainda não tem "ideal" logo após o substantivo, formata
  if(!/\bideal\b/i.test(nucleo)) nucleo=formatarNucleoIdeal(nucleo);
  nucleo=nucleo.charAt(0).toLowerCase()+nucleo.slice(1);
  // verbo encaixa direto ("ter tempo pra mim", "me alimentar bem"); o resto ganha "ter" na frente
  const frase=/^(?:(?:me|te|se|nos)\s+)?[a-záàâãéêíóôõúç]+(ar|er|ir|ôr)\b/i.test(nucleo)?nucleo:'ter '+nucleo;
  return`Eu estou em processo de <b>${esc(frase)}</b>, do meu jeito e no meu tempo.`;
};
const FECHAMENTO_FIXO=`Eu deixo essa ideia descansar em mim, e ela segue trabalhando enquanto eu vivo o meu dia.`;

function novoIdDz(){return 'd'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);}

function desejosAtivos(){
  return (S.leiAtracao.desejos||[]).filter(d=>!d.arquivado);
}

function novoDesejo(area,texto){
  return{
    id:novoIdDz(),area,texto,
    nucleo:'',
    corpo:[],
    sensacao:null,
    gravetos:[],
    evidencias:[],
    menorPasso:null,
    menorPassos:[],
    arquivado:false,
    notas:[],
    diasNotados:{},
    criadoEm:fmtD(new Date())
  };
}
function AREAS_BASE(){return AREAS_INICIAIS().map(a=>({id:a.id,nome:a.nome})).concat([{id:'vontades',nome:'🌟 Vontades e metas'}]);}
function migrarAtracao(s){
  const la=s.leiAtracao;
  const velhas=Array.isArray(la.areas)?la.areas:[];
  const base=AREAS_BASE();const ids=new Set(base.map(a=>a.id));
  const des=[];
  velhas.forEach(a=>{(a.clareza||[]).forEach(t=>des.push(novoDesejo(ids.has(a.id)?a.id:'vontades',t)));});
  (Array.isArray(s.desejos)?s.desejos:[]).forEach(d=>des.push(novoDesejo('vontades',d.texto)));
  la.legado={areas:velhas,termometro:la.termometro||{},historico:la.historico||[]};
  la.areas=base;la.desejos=des;
}
const CORES=['c1','c2','c3','c4','c5','c6'];

/* ============ SUGESTÕES DE PERMISSÃO ============ */
const SUGESTOES_IMPEDIMENTO=[
  {palavras:['sou mae','sendo mae','como mae','maternidade','filha pequena','filho pequeno'],
   categoria:'mães',
   frases:[
     'Hoje, milhares de mães encontram tempo para si dentro de rotinas cheias.',
     'Na semana passada, centenas de mães retomaram algo que amavam fazer.',
     'Neste exato momento, milhares de mães cuidam de filhos pequenos e ainda acham espaço para o que importa.'
   ]},
  {palavras:['sem tempo','rotina cheia','correria','sobrecarga','exausta','cansada'],
   categoria:'pessoas com rotina cheia',
   frases:[
     'Hoje mesmo, milhares de pessoas com rotina cheia encontram espaço para o que importa.',
     'Na semana passada, centenas de pessoas reorganizaram o tempo sem deixar de dar conta.',
     'Todos os dias, milhares de pessoas cansadas conseguem parar alguns minutos e se cuidar.'
   ]},
  {palavras:['mereco','merecer','digna','digno','capaz','suficiente'],
   categoria:'pessoas aprendendo a se valorizar',
   frases:[
     'Todos os dias, milhares de pessoas aprendem a se valorizar antes de qualquer conquista.',
     'Na semana passada, centenas de milhares de pessoas começaram a se levar a sério.',
     'Neste momento, milhões de pessoas estão se permitindo o que querem.'
   ]},
  {palavras:['idade','velho','velha','jovem','tarde','tempo passou'],
   categoria:'pessoas em qualquer idade',
   frases:[
     'Todos os dias, milhares de pessoas conseguem o que querem em idades muito variadas.',
     'Na semana passada, centenas de pessoas começaram algo novo numa idade em que achavam que já era tarde.',
     'Neste momento, milhões de pessoas, em todas as idades, estão realizando algo importante.'
   ]},
  {palavras:['dinheiro','grana','caro','pagar','preco','sem condicoes','apertado'],
   categoria:'pessoas prosperando',
   frases:[
     'Todos os dias, milhões de pessoas recebem dinheiro pelo que sabem fazer.',
     'Hoje, milhares de pessoas estão fechando um negócio, ganhando um aumento ou vendendo algo que criaram.',
     'Neste exato momento, alguém está recebendo um pagamento que deixou o dia mais leve.'
   ]},
  {palavras:['nao sei','nao sei como','por onde comecar'],
   categoria:'pessoas que ainda não sabem o como',
   frases:[
     'Todos os dias, milhares de pessoas começam sem saber como, e o caminho aparece no meio.',
     'Na semana passada, centenas de pessoas descobriram o como enquanto andavam.',
     'Neste momento, milhões de pessoas estão descobrindo o próximo passo sem ter o mapa inteiro.'
   ]}
];
const SUGESTOES_GENERICAS=[
  'Todos os dias, milhares de pessoas conseguem o que querem, do jeito que dá.',
  'Neste momento, coisas boas estão acontecendo para milhões de pessoas, por caminhos que nem imaginam.',
  'Na semana passada, centenas de milhares de pessoas viram o que queriam se aproximar.'
];
function normalizarSug(s){
  return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
}
function contemTermo(textoNorm,termoNorm){
  const esc=termoNorm.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const re=new RegExp('(^|[^a-z0-9])'+esc+'([^a-z0-9]|$)');
  return re.test(textoNorm);
}
function sugerirPermissoes(texto){
  const t=normalizarSug(texto).trim();
  if(!t)return{categoria:null,frases:SUGESTOES_GENERICAS.slice()};
  let melhor=null;let melhorCount=0;
  for(const cat of SUGESTOES_IMPEDIMENTO){
    let c=0;
    for(const p of cat.palavras){
      if(contemTermo(t,normalizarSug(p)))c++;
    }
    if(c>melhorCount){melhor=cat;melhorCount=c;}
  }
  if(!melhor)return{categoria:null,frases:SUGESTOES_GENERICAS.slice()};
  return{categoria:melhor.categoria,frases:melhor.frases.slice()};
}

