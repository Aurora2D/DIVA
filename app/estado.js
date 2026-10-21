/* ============ ESTADO INICIAL ============ */
/* dados do catálogo de prêmios (precisam existir antes do estado inicial) */
const RELACOES=['filha','filho','mãe','pai','avó','avô','irmã','irmão','companheira','companheiro','outra pessoa'];
const ESTILO_PALAVRAS_CHAVE={
  palavras:/carta|escrev|frase|conquista|elogi|incentiv|áudio|ligar|conversa/i,
  servico:/pedir comida|tarefa|louça|organizar|preparar|ajuda|noite livre|sem tarefas/i,
  presentes:/comprar|novo|nova|perfume|batom|base|sombra|creme novo|flor|docinho|sorvete|açaí|pizza|bolo|pipoca|presente|coisinha|sapato|roupa/i,
  toque:/banho|creme|hidrata|skincare|massag|dançar|alongar|cabelo|maquiagem|dormir|meia luz|cafuné/i,
  tempo:/ler|livro|filme|série|episódio|música|puzzle|videogame|piano|cantar|passe|lua|hora só|barbixas|youtube|jardim/i
};
const TUDO=['junto','descanso','livre'];
const CATALOGO_PREMIOS=[
  ['Escrever uma frase gentil pra mim','palavras','P',5,'gratis',TUDO],
  ['Reler meu Livro de Conquistas','palavras','P',5,'gratis',TUDO],
  ['Gravar um áudio de incentivo pra ouvir depois','palavras','P',5,'gratis',['descanso','livre']],
  ['Escrever uma carta pra mim, sem pressa','palavras','M',15,'gratis',['descanso','livre']],
  ['Ligar pra alguém que me faz bem','palavras','M',15,'gratis',['descanso','livre']],
  ['Uma conversa longa com uma amiga','palavras','G',60,'gratis',['livre']],
  ['Uma música inteira, sem fazer mais nada','tempo','P',5,'gratis',TUDO],
  ['Um chá ou café tomado com calma','tempo','P',5,'gratis',TUDO],
  ['Ler 15 minutos de um livro','tempo','M',15,'gratis',['descanso','livre']],
  ['Brincar de algo que eu também goste','tempo','M',15,'gratis',['junto']],
  ['Um episódio da minha série','tempo','M',30,'gratis',['descanso','livre']],
  ['Uma hora só minha, pra fazer o que eu quiser','tempo','G',60,'gratis',['livre']],
  ['O filme que eu quero ver há tempo','tempo','G',120,'gratis',['descanso','livre']],
  ['Um passeio sem pressa num lugar bonito','tempo','G',60,'gratis',['junto','livre']],
  ['Usar a peça ou o perfume que eu guardo pra ocasião especial','presentes','P',5,'gratis',TUDO],
  ['Um docinho que eu gosto','presentes','P',5,'pequeno',TUDO],
  ['Preparar um lanche especial','presentes','M',15,'pequeno',TUDO],
  ['Uma flor pra casa','presentes','M',15,'pequeno',TUDO],
  ['Um batom ou creme novo','presentes','G',30,'pequeno',['junto','livre']],
  ['Um livro novo','presentes','G',30,'pequeno',['junto','livre']],
  ['Uma coisinha nova pro meu canto','presentes','G',30,'pequeno',TUDO],
  ['Tirar uma tarefa da lista de hoje, sem culpa','servico','P',5,'gratis',TUDO],
  ['Deixar a louça pra amanhã','servico','P',5,'gratis',TUDO],
  ['Organizar um cantinho que me incomoda','servico','M',15,'gratis',TUDO],
  ['Deixar a manhã de amanhã encaminhada','servico','M',15,'gratis',['junto','descanso']],
  ['Pedir comida e não cozinhar hoje','servico','G',30,'pequeno',TUDO],
  ['Uma noite inteira sem tarefas','servico','G',120,'gratis',['descanso','livre']],
  ['Pedir ajuda com uma tarefa grande','servico','G',60,'gratis',['livre']],
  ['Passar creme nas mãos com atenção','toque','P',5,'gratis',TUDO],
  ['Dançar uma música','toque','P',5,'gratis',TUDO],
  ['Alongar o corpo por uns minutos','toque','P',5,'gratis',TUDO],
  ['Banho longo com música','toque','M',15,'gratis',['descanso','livre']],
  ['Skincare sem pressa','toque','M',15,'gratis',['descanso','livre']],
  ['Hidratação no cabelo','toque','M',30,'gratis',['descanso','livre']],
  ['Dormir até mais tarde','toque','G',120,'gratis',['livre']],
  ['Cortar ou arrumar o cabelo','toque','G',60,'pequeno',['livre']],
  ['Uma massagem','toque','G',60,'pequeno',['livre']]
].map(([nome,estilo,tamanho,dur,custo,cabe])=>({nome,estilo,tamanho,dur,custo,cabe,gratis:custo==='gratis'}));
const CATALOGO_QUANDO_DER=['Uma viagem curta','Um show ou uma peça de teatro','Um passeio de dia inteiro','Um dia de spa','Um jantar especial fora'];
function estadoInicial(){
  return{
    versao:25,
    iniciadoEm:fmtD(new Date()),
    onboarding:{feito:false,nome:''},
    habitos:[],
    habitosSugestoes:[],
    gruposCustom:[],
    habitosFilaOcultas:[],
    proximoHabitoEm:null,
    habitoTravaId:null,
    ultimoConviteEm:null,
    tresDiasJaMostradoEm:null,
    estiloAutocuidado:null,
    perfilOriginal:false,
    premios:CATALOGO_PREMIOS.filter(p=>p.custo==='gratis').filter((p,i,a)=>a.filter(x=>x.tamanho===p.tamanho).indexOf(p)<4).map((p,i)=>({...p,id:'p'+i+'_'+Math.random().toString(36).slice(2,6),usado:false,peso:1})),
    premiosGuardados:[],
    conquistas:{itens:[],arquivadas:[],semanais:{}},
    desejos:[],
    leiAtracao:{areas:AREAS_BASE(),desejos:[],legado:null,termometro:{},historico:[],contrastes:[]},
    acontecendo:[],
    ciclo:{atual:null,historico:[],proximoEm:null,usados:{aberturas:[],despedidas:[]}},
    resumo:{ultimoEm:null,historico:[]},
    resumoMensal:{ultimoEm:null,historico:[]},
    ultimoAcesso:null,
    ultimoLembreteSaude:null,
    historicoRemovidos:{},
    lembretes:[],checkins:{},ui:{gruposFechados:[]}
  };
}
function adivinharArea(txt){
  const t=(txt||'').toLowerCase();
  if(/empresa|pj|trabalho|contrat|cliente|negócio|negocio|freela|projeto/.test(t))return'trabalho';
  if(/emagrec|corpo|exerc|ginást|ginast|dieta|saúde|saude|academia|alonga/.test(t))return'corpo';
  if(/piano|música|musica|canção|cancao|canto|voz|grava|take|peruca|zoom|cantar|show|palco|composi/.test(t))return'voz';
  return'casa';
}

/* hábitos sempre no infinitivo: converte nomes antigos uma vez */
const NOMES_ANTIGOS={'Passei batom':'Passar batom','Dei risada':'Dar risada','Creme no rosto e protetor solar':'Passar creme no rosto e protetor solar','Skincare à noite':'Fazer skincare à noite','Hidratação nos cabelos':'Hidratar os cabelos','Vocalize':'Fazer vocalize','Respiração':'Respirar com calma','Alongamento':'Alongar o corpo','Ginástica':'Fazer ginástica','Caminhada':'Caminhar','Marmita no trabalho':'Levar marmita pro trabalho','Completar: Hoje eu reconheço que…':'Completar a frase: hoje eu reconheço que…','Cinco minutos sem celular':'Ficar cinco minutos sem celular','Pausa consciente com chá ou café':'Fazer uma pausa com chá ou café','Caminhada lenta só para estar consigo':'Caminhar devagar, só pra estar comigo','Alongamentos suaves por poucos minutos':'Fazer alongamentos suaves por poucos minutos','Banho relaxante ou aconchego com manta':'Tomar um banho relaxante ou me aconchegar numa manta','Respiração percebendo ombros e mandíbula':'Respirar soltando ombros e mandíbula'};
function nomeHabitoInfinitivo(n){
  const t=String(n||'').trim();if(!t)return t;
  if(NOMES_ANTIGOS[t])return NOMES_ANTIGOS[t];
  if(/^aurora dorme de pijama$/i.test(t))return 'Vestir Aurora de pijama pra dormir';
  if(/^copo d.?água ao acordar$/i.test(t))return 'Beber um copo d’água ao acordar';
  const m=t.match(/^([A-Za-zÀ-ÿ]+)\b(.*)$/);
  if(m){const v=m[1].toLowerCase();if(RELATO_PRETERITO[v]||(/ei$/.test(v)&&v.length>3)){const inf=relatoAcaoSugerida(t);return inf.charAt(0).toUpperCase()+inf.slice(1);}}
  return t;
}
function migrarNomesInfinitivo(s){
  if(s.migradoNomesInfinitivo)return;
  (s.habitos||[]).forEach(h=>{const n=nomeHabitoInfinitivo(h.nome);if(n!==h.nome){h.nome=n;h.acao='';}});
  if(s.historicoRemovidos){const novo={};Object.entries(s.historicoRemovidos).forEach(([k,v])=>{novo[nomeHabitoInfinitivo(k)]=v;});s.historicoRemovidos=novo;}
  if(Array.isArray(s.habitosFilaOcultas))s.habitosFilaOcultas=s.habitosFilaOcultas.map(nomeHabitoInfinitivo);
  (s.habitosSugestoes||[]).forEach(x=>{x.texto=nomeHabitoInfinitivo(x.texto);});
  s.migradoNomesInfinitivo=true;
}
function garanteNovosCampos(s){
  if(!s.leiAtracao)s.leiAtracao={areas:AREAS_INICIAIS(),termometro:{},historico:[],contrastes:[]};
  if(!s.leiAtracao.areas||!s.leiAtracao.areas.length)s.leiAtracao.areas=AREAS_INICIAIS();
  if(!s.leiAtracao.termometro)s.leiAtracao.termometro={};
  if(!s.leiAtracao.historico)s.leiAtracao.historico=[];
  if(!Array.isArray(s.leiAtracao.contrastes))s.leiAtracao.contrastes=[];
  if(!s.conquistas)s.conquistas={itens:[],arquivadas:[],semanais:{}};
  if(!Array.isArray(s.conquistas.arquivadas))s.conquistas.arquivadas=[];
  if(!Array.isArray(s.acontecendo))s.acontecendo=[];
  if(!Array.isArray(s.habitosSugestoes))s.habitosSugestoes=[];
  if(!Array.isArray(s.gruposCustom))s.gruposCustom=[];
  if(!Array.isArray(s.habitosFilaOcultas))s.habitosFilaOcultas=[];
  if(!s.desejos||!Array.isArray(s.desejos))s.desejos=[];
  if(!Array.isArray(s.leiAtracao.desejos))migrarAtracao(s);
  (s.leiAtracao.desejos||[]).forEach(d=>{
    if(!Array.isArray(d.notas))d.notas=[];
    if(!d.diasNotados||typeof d.diasNotados!=='object')d.diasNotados={};
    if(!d.criadoEm)d.criadoEm=hoje();
    if(!Array.isArray(d.gravetos))d.gravetos=[];
    if(!Array.isArray(d.evidencias))d.evidencias=[];
    if(typeof d.menorPasso==='undefined')d.menorPasso=null;
    if(typeof d.arquivado==='undefined')d.arquivado=false;
    if(!Array.isArray(d.menorPassos)){
      d.menorPassos=[];
      if(d.menorPasso&&d.menorPasso.texto){
        d.menorPassos.push({id:'mp'+Date.now().toString(36),texto:d.menorPasso.texto,criadoEm:d.menorPasso.criadoEm||hoje(),sugestao:d.menorPasso.sugestao||''});
      }
    }
    if(typeof d.nucleo==='undefined')d.nucleo='';
    if(!Array.isArray(d.corpo))d.corpo=[];
    // migração: declaracao antiga vira primeiro item do corpo
    if(d.declaracao && !d.corpo.length){
      const txt=limparTextoDesejo(d.declaracao);
      if(txt) d.corpo.push({k:'ad_ideia',texto:txt});
      delete d.declaracao;
    }
    // migração: clareza e corpo sem prefixos de processo
    if(d.texto){
      const lim=limparTextoDesejo(d.texto);
      if(lim && lim!==d.texto) d.texto=lim;
    }
    (d.corpo||[]).forEach(c=>{
      if(c && c.texto){
        const lim=limparTextoDesejo(c.texto);
        if(lim) c.texto=lim;
      }
    });
  });

  // migração única: textos de desejo/corpo/núcleo → infinitivo
  if(!s.leiAtracao.migradoInfinitivoV1){
    (s.leiAtracao.desejos||[]).forEach(d=>{
      if(d.texto) d.texto=paraInfinitivoSugestao(limparTextoDesejo(d.texto)||d.texto);
      if(d.nucleo) d.nucleo=paraInfinitivoSugestao(limparTextoDesejo(d.nucleo)||d.nucleo);
      (d.corpo||[]).forEach(c=>{
        if(c&&c.texto) c.texto=paraInfinitivoSugestao(limparTextoDesejo(c.texto)||c.texto);
      });
      if(d.menorPasso&&d.menorPasso.texto){
        d.menorPasso.texto=paraInfinitivoSugestao(d.menorPasso.texto);
      }
    });
    s.leiAtracao.migradoInfinitivoV1=true;
  }

  if(!s.ciclo)s.ciclo={atual:null,historico:[],proximoEm:null,usados:{aberturas:[],despedidas:[]}};
  if(!s.ciclo.usados)s.ciclo.usados={aberturas:[],despedidas:[]};
  if(!s.lembretes)s.lembretes=[];
  if(!s.ui)s.ui={gruposFechados:[]};
  if(!Array.isArray(s.ui.gruposFechados))s.ui.gruposFechados=[];
  if(!s.aurora)s.aurora={meta:'00:00',historico:{}};
  if(!s.onboarding)s.onboarding={feito:false,nome:''};
  if(!s.historicoRemovidos)s.historicoRemovidos={};
  if(!s.iniciadoEm)s.iniciadoEm=hoje();
  if(!s.resumo)s.resumo={ultimoEm:null,historico:[]};
  if(!Array.isArray(s.resumo.historico))s.resumo.historico=[];
  if(!s.resumoMensal)s.resumoMensal={ultimoEm:null,historico:[]};
  if(!Array.isArray(s.resumoMensal.historico))s.resumoMensal.historico=[];
  if(typeof s.ultimoAcesso==='undefined')s.ultimoAcesso=null;
  if(typeof s.ultimoLembreteSaude==='undefined')s.ultimoLembreteSaude=null;
  if(typeof s.tresDiasJaMostradoEm==='undefined')s.tresDiasJaMostradoEm=null;
  if(typeof s.habitoTravaId==='undefined')s.habitoTravaId=null;
  if(typeof s.estiloAutocuidado==='undefined')s.estiloAutocuidado=null;
  if(typeof s.estiloConviteVisto==='undefined')s.estiloConviteVisto=false;
  (s.conquistas.itens||[]).forEach(c=>{if(!c.criadoEm)c.criadoEm='2020-01-01';if(!c.area){c.area=adivinharArea(c.txt);}});
  (s.conquistas.arquivadas||[]).forEach(c=>{if(!c.criadoEm)c.criadoEm='2020-01-01';if(!c.area){c.area=adivinharArea(c.txt);}});
  if(s.ciclo&&s.ciclo.proximoEm&&s.ciclo.atual&&(!s.ciclo.atual.respostas||Object.keys(s.ciclo.atual.respostas).length===0)){s.ciclo.atual=null;s.ciclo.proximoEm=null;}
  if(!s.checkins||typeof s.checkins!=='object')s.checkins={};
  if(!s.habitos||!Array.isArray(s.habitos))s.habitos=[];
  if(!Array.isArray(s.premiosGuardados))s.premiosGuardados=[];
  if(!s.relatos||typeof s.relatos!=='object')s.relatos={log:[]};
  if(!Array.isArray(s.relatos.log))s.relatos.log=[];
  if(!s.celebracao||typeof s.celebracao!=='object')s.celebracao={atual:null,historico:[],conviteVisto:false,contador:0};
  if(!Array.isArray(s.celebracao.historico))s.celebracao.historico=[];
  if(!s.sons||typeof s.sons!=='object')s.sons={ligado:true};
  if(typeof s.perfilOriginal==='undefined')s.perfilOriginal=!!(s.onboarding&&s.onboarding.feito);
  if(typeof s.cuidado==='undefined')s.cuidado=s.perfilOriginal?{cuida:true,nome:'Aurora',relacao:'filha'}:null;
  if(!Array.isArray(s.situacoes)||!s.situacoes.length)s.situacoes=situacoesPadrao(!!(s.cuidado&&s.cuidado.cuida));
  if(!Array.isArray(s.quandoDer))s.quandoDer=[];
  (s.premios||[]).forEach(migrarPremio);
  if(!Array.isArray(s.cuidados))s.cuidados=[
    {id:'c_clinico',texto:'Ir ao clínico geral e checar a vitamina D',feitoEm:null},
    {id:'c_terapia',texto:'Escolher um terapeuta pra chamar de meu',feitoEm:null}];
  (s.habitos||[]).forEach(h=>{
    if(!Array.isArray(h.relatos))h.relatos=[];
    if(!Array.isArray(h.relatoRotina))h.relatoRotina=[];
    if(typeof h.relatoPulos!=='number')h.relatoPulos=0;
    if(typeof h.relatoDescansoAte==='undefined')h.relatoDescansoAte=null;
  });
  if(!s.revisaoHabitos||typeof s.revisaoHabitos!=='object')s.revisaoHabitos={ultima:hoje(),adiarAte:null};
  try{s.habitos.forEach(h=>{if(!h.dimsDefinidas&&!(Array.isArray(h.dims)&&h.dims.length)){const d=habDimsDe(h.nome,h.id,null,false);if(d.length)h.dims=d.slice();}});}catch(e){}
  return s;
}
function carrega(){
  try{const raw=localStorage.getItem('batomRisadaV23');if(raw)return garanteNovosCampos(JSON.parse(raw));}catch(e){}
  try{const raw=localStorage.getItem('batomRisadaV22');if(raw){const s=garanteNovosCampos(JSON.parse(raw));s.versao=23;return s;}}catch(e){}
  try{const raw=localStorage.getItem('batomRisadaV21');if(raw){const s=garanteNovosCampos(JSON.parse(raw));s.versao=23;return s;}}catch(e){}
  try{const raw=localStorage.getItem('batomRisadaV20');if(raw){const s=garanteNovosCampos(JSON.parse(raw));s.versao=23;return s;}}catch(e){}
  try{const raw=localStorage.getItem('batomRisadaV19');if(raw){const s=garanteNovosCampos(JSON.parse(raw));s.versao=23;return s;}}catch(e){}
  try{const raw=localStorage.getItem('batomRisadaV18');if(raw){const s=garanteNovosCampos(JSON.parse(raw));s.versao=23;return s;}}catch(e){}
  for(const v of [17,16,15,14,13,12,11,10,9,8,7,6,5,4]){
    try{const raw=localStorage.getItem('batomRisadaV'+v);if(raw){const s=garanteNovosCampos(JSON.parse(raw));s.versao=23;return s;}}catch(e){}
  }
  return garanteNovosCampos(estadoInicial());
}
let S=carrega();
function salva(){try{localStorage.setItem('batomRisadaV23',JSON.stringify(S));}catch(e){}}

function frase(){$('frase').style.opacity=0;setTimeout(()=>{$('frase').textContent=FRASES[Math.floor(Math.random()*FRASES.length)];$('frase').style.opacity=1;},250);}

let _modalZ=250;
function abrirOverlay(el){
  if(!el)return;
  _modalZ=Math.max(_modalZ+1,260);
  el.style.zIndex=String(_modalZ);
  el.hidden=false;
  requestAnimationFrame(()=>el.classList.add('ativo'));
  document.body.style.overflow='hidden';
}
function fecharOverlay(el,depois){
  if(!el)return;
  el.classList.remove('ativo');
  setTimeout(()=>{
    el.hidden=true;
    el.style.zIndex='';
    if(!document.querySelector('.modal-overlay.ativo,.rel-overlay.ativo,.festa-overlay.ativo,.premio-modal.ativo,.onb-overlay.ativo')){
      document.body.style.overflow='';
    }
    if(depois)depois();
  },320);
}

function abrirOverlayTopo(el){abrirOverlay(el);if(el)el.style.zIndex='400';}
function confete(emojis){const arr=emojis&&emojis.length?emojis:['✨','🌸','💫'];for(let i=0;i<9;i++)setTimeout(()=>{const el=document.createElement('div');el.className='confete';el.textContent=arr[Math.floor(Math.random()*arr.length)];el.style.left=Math.random()*100+'vw';el.style.fontSize=(18+Math.random()*20)+'px';document.body.appendChild(el);setTimeout(()=>el.remove(),2000);},i*55);}
function horasDormidas(dormiu,acordou){const[dh,dm]=dormiu.split(':').map(Number);const[ah,am]=acordou.split(':').map(Number);let min=(ah*60+am)-(dh*60+dm);if(min<0)min+=24*60;return Math.floor(min/60)+'h'+pad2(min%60);}

/* ============ ESPELHO ============ */
const ESPELHO_TRIGGERS=['eu já','eu ja','eu consegui','eu mudei','eu fiz','eu falei','eu resolvi','eu comecei','eu parei','eu saí','eu sai','eu voltei','eu terminei','eu escrevi','eu liguei','eu conversei','eu disse','eu decidi','mesmo com medo','mesmo assim','apesar de','consegui ','arrumei','resolvi ','comecei ','falei ','liguei ','voltei ','terminei','decidi '];
function frasesJaFeitas(texto){
  const frases=String(texto||'').split(/(?<=[.!?])\s+|\n+/).map(s=>s.trim()).filter(s=>s.length>=8);
  const out=[];
  frases.forEach(f=>{
    const lf=' '+f.toLowerCase()+' ';
    if(ESPELHO_TRIGGERS.some(t=>lf.includes(t)))out.push(f);
  });
  return out;
}
/* ============ ONBOARDING ============ */
function iniciarOnboarding(){
  $('onbOverlay').hidden=false;
  requestAnimationFrame(()=>$('onbOverlay').classList.add('ativo'));
  document.body.style.overflow='hidden';
  mostrarOnbPasso(1);
}
function mostrarOnbPasso(p){
  [1,2,3,4,5,6].forEach(i=>$('onbP'+i).hidden=i!==p);
  if(p===6){$('onbTit6').textContent=(S.onboarding.nome?S.onboarding.nome+', você':'Você')+' cuida de alguém no dia a dia?';$('onbCuidaRel').innerHTML=RELACOES.map(r=>`<option value="${r}">${r}</option>`).join('');}
  if(p===1)setTimeout(()=>$('onbNome').focus(),200);
  if(p===2)$('onbTit2').textContent=(S.onboarding.nome||'Ei')+', vamos começar pequeno';
  if(p===5){const n=S.onboarding.nome;$('onbTit5').textContent=n?('Tudo bem, '+n+'. No seu tempo.'):'Tudo bem. No seu tempo.';}
  if(p===3)$('onbT3p1').textContent=(S.onboarding.nome||'Ei')+', antes de seguir, um pedido: não atropela.';
}
function finalizarOnboarding(){
  $('onbOverlay').classList.remove('ativo');
  setTimeout(()=>{$('onbOverlay').hidden=true;document.body.style.overflow='';},500);
  renderHoje();setTimeout(avisosIniciais,1200);
}
$('onbBtn1').onclick=()=>{const nome=$('onbNome').value.trim();if(!nome){$('onbNome').focus();return;}S.onboarding.nome=nome;salva();mostrarOnbPasso(6);};
$('onbCuidaSim').onclick=()=>{
  const box=$('onbCuidaCampos');
  if(box.hidden){box.hidden=false;$('onbCuidaSim').textContent='Continuar';setTimeout(()=>$('onbCuidaNome').focus(),150);return;}
  const n=$('onbCuidaNome').value.trim();if(!n){$('onbCuidaNome').focus();return;}
  definirCuidado(true,n,$('onbCuidaRel').value);mostrarOnbPasso(2);
};
$('onbCuidaNao').onclick=()=>{definirCuidado(false);mostrarOnbPasso(2);};
$('onbNome').addEventListener('keydown',e=>{if(e.key==='Enter')$('onbBtn1').click();});
$('onbBtn2').onclick=()=>{
  if(!S.habitos.some(h=>h.id==='agua'))S.habitos.push({id:'agua',emoji:'💧',emojis:['💧','🥤','✨'],nome:'Beber água ao acordar',paraQue:'Cuidar do meu bem-estar',unidade:'1 copo ao acordar',feitos:{},cor:'c4',grupo:'corpo',dims:['corpo','energia']});
  S.proximoHabitoEm=Date.now()+3*86400000;S.habitoTravaId='agua';salva();mostrarOnbPasso(3);
};
$('onbPular').onclick=()=>{salva();mostrarOnbPasso(5);};
$('onbBtn5').onclick=()=>{S.onboarding.feito=true;salva();finalizarOnboarding();};
$('onbBtn3').onclick=()=>{
  S.onboarding.feito=true;salva();
  const nome=S.onboarding.nome||'';
  $('onbEmojiFim').textContent=S.habitos.some(h=>h.id==='agua')?'💧':'🌱';
  $('onbTitFim').textContent='Pronto'+(nome?', '+nome:'')+'!';
  $('onbTextoFim').textContent=S.habitos.some(h=>h.id==='agua')?'Sua primeira bolinha está na tela Hoje. Amanhã de manhã, antes de qualquer outra coisa, toque nela depois do primeiro copo de água. Daqui a 3 dias, seu próximo hábito chega. Até lá, a água é a única missão. 💧':'Quando quiser, abra Gerenciar hábitos e escolha o primeiro. Sem pressa.';
  mostrarOnbPasso(4);
};
$('onbBtnFim').onclick=()=>{finalizarOnboarding();};

