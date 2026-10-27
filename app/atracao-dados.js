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
  {palavras:['sou mae','sendo mae','como mae','mae','maternidade','filha','filho','filhos','filhas','crianca','criancas'],
   categoria:'mães',
   frases:[
     'Centenas de mães voltaram a fazer algo que amam no mês passado.',
     'Milhares de mães estão cuidando de si hoje.',
     'Milhões de mães realizam sonhos enquanto criam os filhos.',
     'Centenas de milhares de mães vão fazer algo só pra elas esta semana.'
   ]},
  {palavras:['sem tempo','ter tempo','tenho tempo','falta de tempo','pouco tempo','rotina cheia','correria','corrida','sobrecarga','sobrecarregada','exausta','cansada','cansaco','ocupada'],
   categoria:'pessoas com tempo pro que importa',
   frases:[
     'Milhares de pessoas ganharam horas livres na semana passada.',
     'Centenas de milhares de pessoas estão descansando neste momento.',
     'Milhões de pessoas dedicam tempo ao que amam todos os dias.',
     'Alguém acabou de terminar o dia com tempo de sobra pra si.'
   ]},
  {palavras:['mereco','merecer','digna','digno','capaz','suficiente','incapaz','nao sou boa','fraca','vergonha'],
   categoria:'pessoas se valorizando',
   frases:[
     'Centenas de milhares de pessoas começaram a se levar a sério no mês passado.',
     'Milhares de pessoas estão cobrando o que valem hoje.',
     'Milhões de pessoas se tratam com respeito e carinho todos os dias.',
     'Cada vez mais pessoas se permitem o que querem.'
   ]},
  {palavras:['idade','velho','velha','jovem','tarde','tempo passou','ja passou','altura da vida','anos'],
   categoria:'pessoas em qualquer idade',
   frases:[
     'Milhares de pessoas começaram uma nova fase da vida no mês passado.',
     'Neste momento, milhões de pessoas, em todas as idades, estão realizando algo importante.',
     'Centenas de pessoas vão começar um projeto novo esta semana.',
     'Cada vez mais pessoas descobrem que é a hora certa de começar.'
   ]},
  {palavras:['dinheiro','grana','caro','cara','custa','pagar','preco','gastar','renda','salario','divida','dividas','conta','contas','sem condicoes','apertado'],
   categoria:'pessoas prosperando',
   frases:[
     'Milhões de pessoas recebem dinheiro pelo que sabem fazer todos os dias.',
     'Milhares de pessoas fecharam um bom negócio esta semana.',
     'Centenas de milhares de pessoas ganharam um aumento no mês passado.',
     'Alguém acabou de vender algo que criou.'
   ]},
  {palavras:['nao sei','nao sei como','como fazer','por onde comecar','por onde','perdida','nao entendo'],
   categoria:'pessoas descobrindo o caminho',
   frases:[
     'Milhares de pessoas deram o primeiro passo hoje.',
     'Centenas de milhares de pessoas descobriram o caminho enquanto andavam, no ano passado.',
     'Milhões de pessoas estão aprendendo algo novo neste momento.',
     'Cada vez mais pessoas começam e vão descobrindo o resto pelo caminho.'
   ]}
];

const SUGESTOES_GENERICAS=[
  'Centenas de milhares de pessoas viram o que queriam se aproximar na semana passada.',
  'Milhares de pessoas estão conseguindo o que querem hoje, do jeito delas.',
  'Milhões de coisas boas acontecem todos os dias, por caminhos que ninguém imaginava.',
  'Cada vez mais pessoas realizam seus desejos.'
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

