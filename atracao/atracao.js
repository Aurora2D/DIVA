/* ============ SESSÕES GUIADAS DA ATRAÇÃO (atracao/atracao.js) ============
   Visual: capa e sessões em tela cheia, sobre aquarela, uma ideia por tela (#sessaoModal).
   Trilha (7 sessões, na ordem): Abertura, Deixar sair, Olhar com outros olhos, Passo 1 Clareza,
   Passo 2 Declaração, Passo 3 Permissão, Menor passo.
   Este arquivo é carregado pelo index.html depois do script principal e usa as funções dele
   (S, salva, novoDesejo, desejosAtivos, montarDeclaracao...). Os estilos estão em atracao.css.
   Tudo grava no modelo que já existe (S.leiAtracao). O progresso fica em S.leiAtracao.trilha:
   { feitas:{id:'done'|'skipped'}, tela:{id:n}, rasc:{rascunhos}, foco:{contrasteId,desejoId,gravetoId} }.
   Texto das telas: está dentro de cada função sessaoXxx, em listas de blocos:
   ['p',txt] ['pergunta',txt] ['sub',txt] ['fecho',txt] ['chips',[...]] ['cuidado',txt]
   ['atalho',{rot,acao}] ['lembrete',{titulo,texto:fn}] ['campo',{key,rot,dica,opcional,grande,ph}]
   ['html',string|fn,bind?]. Uma tela pode ter também seguir:fn (roda ao continuar; false trava),
   botoes:[{rot,prim,acao}] (no lugar do Continuar) e semVoltar:true. */
/* A gatinha vem do repositório Aurora2D/Mascote, copiado em mascote/ (script: scripts/atualizar-mascote.sh).
   Aqui só a usamos: <gatinha-fantoche> + cat.play('acao'). Ações disponíveis: ver mascote/LEIA-ME.md.
   Se o motor dela não carregar, a tela funciona sem a gatinha. */
const MASCOTE_BASE='mascote/assets/pecas/';
const svMascote=(cls,pose)=>window.customElements&&customElements.get('gatinha-fantoche')?`<gatinha-fantoche class="${cls}" pose="${pose||'sentada'}" src-base="${MASCOTE_BASE}" aria-hidden="true"></gatinha-fantoche>`:'';
/* reações: o que a gatinha faz em cada interação. Para mudar, troque os nomes das ações aqui. */
const MASCOTE_ENTRADA={abertura:'tchau',sair:'suspirar',clareza:'curiosa',permissao:'curiosa',passo:'feliz'};
function svReage(acao,atraso){
  const go=()=>{const c=document.querySelector('#sessaoTela gatinha-fantoche');if(!c)return;
    const f=()=>{try{if(typeof c.play==='function')c.play(acao);}catch(e){}};
    if(c.classList.contains('pronta'))f();else c.addEventListener('ready',f,{once:true});};
  setTimeout(go,atraso==null?350:atraso);
}
/* a gatinha aparece suave quando termina de carregar as peças */
document.addEventListener('ready',e=>{if(e.target&&e.target.tagName==='GATINHA-FANTOCHE')e.target.classList.add('pronta');},true);
const SV_ALT='Gatinha branca em aquarela, sentada e sorrindo, com uma mancha rosa na orelha e um olho azul e outro dourado.';
const SV_CORES={lilas:'#BD80D1',lav:'#8F80D1',ceu:'#80BBD1',rosa:'#D96B83',petala:'#EFBCCB',ouro:'#D9A441'};
const SV_PAL={abertura:['lilas','ceu','petala','ouro'],sair:['lav','ceu','lilas'],olhar:['ceu','petala','lav'],clareza:['ouro','petala','lilas'],declaracao:['rosa','petala','lav'],permissao:['lilas','rosa','petala'],passo:['ouro','ceu','rosa'],desejos:['lav','petala','ceu'],desabafos:['ceu','petala','lav'],duvida:['lilas','rosa','petala'],escolha:['lav','ceu','petala'],'capa-trilha':['lav','ceu','petala']};
const SV_IC={
  x:'<svg class="sv-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  seta:'<svg class="sv-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  check:'<svg class="sv-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'};
let _svUid=0;
function svSemente(s){let h=7;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return Math.abs(h);}
function svRng(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function svAquarela(chave,w,h,n,extra){
  const seed=svSemente(chave)+(extra||0),r=svRng(seed),pal=SV_PAL[chave]||['lav','ceu','petala'],id='wf'+(++_svUid);
  let o='<svg class="sv-wash" viewBox="0 0 '+w+' '+h+'" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><defs><filter id="'+id+'" x="-25%" y="-25%" width="150%" height="150%"><feTurbulence type="fractalNoise" baseFrequency="0.011 0.019" numOctaves="3" seed="'+(seed%97)+'" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="'+Math.round(w/9)+'"/><feGaussianBlur stdDeviation="1.1"/></filter></defs><g filter="url(#'+id+')">';
  for(let i=0;i<n;i++){
    const c=SV_CORES[pal[i%pal.length]],cx=Math.round(r()*w),cy=Math.round(r()*h),rx=Math.round(w*(.22+r()*.28)),ry=Math.round(h*(.28+r()*.3)),rot=Math.round(r()*80-40),op=(.38+r()*.3).toFixed(2);
    o+='<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="'+c+'" fill-opacity="'+op+'" stroke="'+c+'" stroke-opacity=".55" stroke-width="2" transform="rotate('+rot+' '+cx+' '+cy+')"/>';
  }
  return o+'</g></svg>';
}

/* ---------- as 8 sessões da trilha ---------- */
const TRILHA=[
  {id:'abertura',kicker:'Abertura',titulo:'Que bom que você chegou até aqui',afirma:'Eu posso cuidar da minha vida no meu ritmo.',mascote:'abertura'},
  {id:'sair',kicker:'Contraste',titulo:'Deixar sair',afirma:'Eu posso deixar sair o que pesa.',mascote:'deixar-sair'},
  {id:'olhar',kicker:'Olhar com calma',titulo:'Olhar com outros olhos',afirma:'Eu posso olhar para o que escrevi com calma.',mascote:null},
  {id:'clareza',kicker:'Passo 1',titulo:'Clareza',afirma:'Eu estou em processo de descobrir o que eu quero, em todas as áreas da minha vida, do meu jeito e no meu tempo.',mascote:'clareza'},
  {id:'declaracao',kicker:'Passo 2',titulo:'Declaração de desejo',afirma:'Eu estou em processo de ter realizações em todas as áreas da minha vida, do meu jeito e no meu tempo.',mascote:null},
  {id:'permissao',kicker:'Passo 3',titulo:'Permissão',afirma:'Eu estou em processo de me permitir receber realizações em todas as áreas da minha vida, do meu jeito e no meu tempo.',mascote:'permissao'},
  {id:'passo',kicker:'Ação',titulo:'Menor passo',afirma:'Eu posso começar pequeno.',mascote:'menor-passo'}
];
const trMeta=id=>TRILHA.find(x=>x.id===id);

/* ---------- estado e foco ---------- */
function trEst(){
  const L=S.leiAtracao;if(!L.trilha||typeof L.trilha!=='object')L.trilha={};
  const t=L.trilha;['feitas','tela','rasc','foco'].forEach(k=>{if(!t[k]||typeof t[k]!=='object')t[k]={};});return t;
}
function contrastesPendentes(){return (S.leiAtracao.contrastes||[]);}
const trDesejo=()=>{const id=trEst().foco.desejoId;return (id&&S.leiAtracao.desejos.find(x=>x.id===id&&!x.arquivado))||null;};
const trContraste=()=>{const id=trEst().foco.contrasteId;return contrastesPendentes().find(x=>x.id===id)||contrastesPendentes().slice(-1)[0]||null;};
const trGraveto=d=>{const id=trEst().foco.gravetoId;return (d&&id&&(d.gravetos||[]).find(g=>g.id===id))||null;};
/* rascunhos de uma sessão pertencem a um item (desejo, desabafo...); se o item mudou, recomeçam do que está guardado nele */
function trSinc(tag,id,chaves,inicial){
  const R=trEst().rasc;
  if(R['_'+tag]!==id){chaves.forEach(k=>delete R[k]);R['_'+tag]=id;}
  const ini=inicial||{};Object.keys(ini).forEach(k=>{if(R[k]===undefined)R[k]=ini[k];});
  return R;
}


/* ---------- motor das telas ---------- */
let _sessao=null;
const svNorm=t=>Array.isArray(t)?{b:t}:t;
const svEhTrilha=def=>!!def.id&&TRILHA.some(x=>x.id===def.id);
function svBloco(b,st,binds){
  const t=b[0],v=b[1];
  if(t==='p')return `<p class="sv-p">${esc(v)}</p>`;
  if(t==='pergunta')return `<p class="sv-pergunta">${esc(v)}</p>`;
  if(t==='sub')return `<h2 class="sv-sub">${esc(v)}</h2>`;
  if(t==='fecho')return `<p class="sv-fecho">${esc(v)}</p>`;
  if(t==='chips')return `<ul class="sv-chips">${v.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;
  if(t==='cuidado')return `<aside class="sv-cuidado"><span class="sv-k">Um cuidado</span><p>${esc(v)}</p></aside>`;
  if(t==='atalho'){const k=st.acoes.push(v.acao)-1;return `<button type="button" class="sv-atalho" data-ac="${k}"><span>${esc(v.rot)}</span>${SV_IC.seta}</button>`;}
  if(t==='lembrete'){const txt=String((typeof v.texto==='function'?v.texto():v.texto)||'').trim();if(!txt)return '';
    return `<figure class="sv-lembrete"><figcaption>${esc(v.titulo)}</figcaption><blockquote>${esc(txt)}</blockquote></figure>`;}
  if(t==='campo'){const id='c_'+v.key;
    return `<div class="sv-campo"><label class="sv-campo-rot" for="${id}">${esc(v.rot)}${v.opcional?'<span class="sv-opc">opcional</span>':''}</label>${v.dica?`<p class="sv-dica" id="${id}_d">${esc(v.dica)}</p>`:''}<textarea id="${id}" class="sv-area${v.grande?' grande':''}" data-campo="${v.key}"${v.dica?` aria-describedby="${id}_d"`:''} placeholder="${esc(v.ph||'Escreva aqui')}">${esc(st.dados[v.key]||'')}</textarea></div>`;}
  if(t==='html'){if(b[2])binds.push(b[2]);return typeof v==='function'?v():v;}
  return '';
}
function sessaoMostrar(manter){
  const st=_sessao,def=st.def,t=svNorm(st.telas[st.i]);
  st.acoes=[];const binds=[];let h='';
  if(st.i===0&&!def.compacto){
    h+=`<div class="sv-hero${def.mascote?' com-img':''}">${def.mascote?svMascote('sv-mascote'):svAquarela(def.id||'x',420,320,5)}</div><div class="sv-cab"><p class="sv-kick">${esc(def.kicker)}</p><h1 class="sv-tit">${esc(def.titulo)}</h1>${def.afirma?`<p class="sv-afirma">${esc(def.afirma)}</p>`:''}</div>`;
  }else h+=`<div class="sv-faixa">${def.compacto?svAquarela(def.id||'x',420,80,3,9):''}<span>${esc(def.kicker)} · ${esc(def.titulo)}</span>${def.compacto?'':svMascote('sv-espia')}</div>`;
  const ult=st.i===st.telas.length-1;
  h+='<div class="sv-corpo">'+(t.b||[]).map(b=>svBloco(b,st,binds)).join('');
  if(ult&&def.pular)h+=`<button type="button" class="sv-pular" id="svPular">${esc(def.pular.rot)}</button>`;
  h+='</div>';
  const el=$('sessaoTela'),modal=$('sessaoModal'),topo=manter?modal.scrollTop:0;
  el.innerHTML=h;
  if(!manter){el.classList.remove('sv-entra');void el.offsetWidth;el.classList.add('sv-entra');}
  $('sessaoDots').innerHTML=st.telas.map((_,k)=>`<span class="${k===st.i?'on':k<st.i?'ja':''}"></span>`).join('');
  let bar='';
  if(st.i>0&&!t.semVoltar)bar+='<button type="button" id="svVoltar">Voltar</button>';
  if(t.botoes)bar+=t.botoes.map((b,k)=>`<button type="button" class="${b.prim?'prim':''}" data-sb="${k}">${esc(b.rot)}</button>`).join('');
  else bar+=`<button type="button" class="prim" id="svSeguir">${esc(t.rotSeguir||(ult?'Concluir':'Continuar'))}</button>`;
  $('sessaoAcoes').innerHTML=bar;
  modal.scrollTop=topo;
  if(svEhTrilha(def)){const e=trEst();if(!ult)e.tela[def.id]=st.i;else delete e.tela[def.id];salva();}
  const vb=$('svVoltar');if(vb)vb.onclick=()=>{st.i--;sessaoMostrar();};
  const sg=$('svSeguir');if(sg)sg.onclick=sessaoSeguir;
  $('sessaoAcoes').querySelectorAll('[data-sb]').forEach(b=>b.onclick=()=>t.botoes[+b.dataset.sb].acao());
  const pb=$('svPular');if(pb)pb.onclick=()=>{
    const p=def.pular,e=trEst();const a=TRILHA.findIndex(x=>x.id===def.id),z=TRILHA.findIndex(x=>x.id===p.ate);
    for(let k=a;k<z;k++)if(!e.feitas[TRILHA[k].id])e.feitas[TRILHA[k].id]='skipped';
    delete e.tela[p.ate];salva();sessaoIr(p.ate);
  };
  binds.forEach(f=>f($('sessaoTela')));
  if(t.bind)t.bind($('sessaoTela'));
  if(!manter){const r=st.reacao;st.reacao=null;
    if(st.i===0&&!def.compacto&&def.mascote)svReage(MASCOTE_ENTRADA[def.id]||'feliz',700);else if(r)svReage(r);}
  if(!manter&&!t.semFoco){const f=el.querySelector('textarea');if(f)setTimeout(()=>{try{f.focus({preventScroll:true});}catch(e){}},300);}
}
function sessaoAtualizar(){sessaoMostrar(true);}
function sessaoAbrir(def,dados){
  const trilha=svEhTrilha(def);
  _sessao={def,telas:def.telas,i:0,dados:trilha?trEst().rasc:(dados||{}),acoes:[]};
  if(trilha){let k=trEst().tela[def.id]||0;if(k<0||k>=def.telas.length)k=0;_sessao.i=k;}
  sessaoMostrar();
  const o=$('sessaoModal');
  if(!o.classList.contains('ativo')||o.hidden)abrirOverlay(o);
  document.body.classList.add('sv-aberta');
}
function sessaoSeguir(){
  const st=_sessao,t=svNorm(st.telas[st.i]);
  if(t.seguir&&t.seguir()===false)return;
  if(st.i<st.telas.length-1){st.i++;st.reacao=t.reage||'sim';sessaoMostrar();}else sessaoConcluir();
}
function sessaoProxima(reacao){_sessao.i++;_sessao.reacao=reacao||'sim';sessaoMostrar();}
function sessaoConcluir(msg){
  const st=_sessao,def=st.def;let m=msg||'';
  if(svEhTrilha(def)){
    const e=trEst();e.feitas[def.id]='done';delete e.tela[def.id];(def.limpar||[]).forEach(k=>delete e.rasc[k]);salva();
    m=msg||(TRILHA.every(x=>e.feitas[x.id])?'Trilha concluída. Você pode voltar a qualquer sessão.':'Sessão guardada.');
  }
  sessaoFecharTudo(null,m);
}
function sessaoFecharTudo(depois,msg){
  fecharOverlay($('sessaoModal'),()=>{_sessao=null;document.body.classList.remove('sv-aberta');renderAtracaoTudo();if(msg)mostrarToast(msg);if(depois)depois();});
}
$('sessaoFechar').onclick=()=>sessaoFecharTudo();
$('sessaoTela').addEventListener('input',e=>{
  const k=e.target.dataset&&e.target.dataset.campo;if(!k||!_sessao)return;
  _sessao.dados[k]=e.target.value;if(svEhTrilha(_sessao.def))salva();
  const agora=Date.now();if(!_sessao.ouveEm||agora-_sessao.ouveEm>5000){_sessao.ouveEm=agora;svReage('orelhas',0);}   /* a gatinha "escuta" enquanto você escreve */
});
$('sessaoTela').addEventListener('click',e=>{
  const a=e.target.closest('[data-ac]');if(a&&_sessao&&_sessao.acoes[+a.dataset.ac])_sessao.acoes[+a.dataset.ac]();
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&_sessao&&$('sessaoModal').classList.contains('ativo')&&!document.querySelector('.modal-overlay.ativo:not(#sessaoModal)'))sessaoFecharTudo();});
$('btnComoFunciona').onclick=()=>abrirOverlay($('comoFuncionaModal'));
$('comoFuncionaFechar').onclick=()=>fecharOverlay($('comoFuncionaModal'));

/* escrever no campo por fora (sugestões): grava no rascunho e no campo */
function svPreencher(key,txt){const a=$('c_'+key);if(a){a.value=txt;a.focus();}if(_sessao){_sessao.dados[key]=txt;if(svEhTrilha(_sessao.def))salva();}}
/* lista de opções tocáveis (hubs, sugestões) */
function svOpcoes(lista){return lista.map((o,i)=>`<button type="button" class="sv-opt${o.on?' on':''}" data-op="${i}"><b>${o.rot}</b>${o.sub?`<span>${o.sub}</span>`:''}</button>`).join('');}
function svLigarOpcoes(r,lista){r.querySelectorAll('[data-op]').forEach(b=>b.onclick=()=>lista[+b.dataset.op].acao(b));}


/* ---------- ajudas ---------- */
const trTexto=d=>limparTextoDesejo(d.texto)||d.texto||'';
/* o exemplo do texto começa com “Quero…”; na declaração o desejo entra depois de um prefixo, então o “quero” inicial sai */
const trSemQuero=s=>String(s||'').trim().replace(/^(eu\s+)?(quero|desejo|gostaria de|preciso)\s+/i,'');
const trDeclHTML=d=>`<div class="declaracao-montada"><span class="dm-lb">Sua declaração</span>${montarDeclaracao(d).map(p=>`<div style="margin-bottom:8px">${p}</div>`).join('')}</div>`;
const trBase=d=>{const b=trTexto(d).trim();return b?b.charAt(0).toLowerCase()+b.slice(1):'';};
const trAreaPadrao=()=>{const b=S.leiAtracao.areas.find(a=>a.id==='bemestar');return b?b.id:S.leiAtracao.areas[0].id;};
const trNovaId=p=>p+Date.now().toString(36)+Math.random().toString(36).slice(2,5);
/* desejo em foco: 0 desejos → começa pela Clareza; 1 → segue; vários → pergunta qual (a escolha fica guardada) */
function trComDesejo(fn){
  const d=trDesejo();if(d){fn(d);return;}
  const ds=desejosAtivos();
  if(!ds.length){mostrarToast('Você ainda não tem um desejo. Vamos começar pela Clareza 💜');sessaoClareza({livre:true});return;}
  if(ds.length===1){trEst().foco.desejoId=ds[0].id;salva();fn(ds[0]);return;}
  sessaoEscolherDesejo(fn);
}
const sessaoComDesejo=trComDesejo;
const SV_ABRIR={abertura:()=>sessaoAbertura(),sair:()=>sessaoDeixarSair(),olhar:()=>sessaoOlhar(),clareza:()=>sessaoClareza(),
  declaracao:()=>trComDesejo(sessaoDeclaracao),permissao:()=>trComDesejo(sessaoPermissao),passo:()=>trComDesejo(sessaoMenorPasso)};
function sessaoIr(id){if(SV_ABRIR[id])SV_ABRIR[id]();}

/* ---------- a trilha na aba Atração ---------- */
function cardTrilha(cls,img,k,t,a,id,fim){
  return `<li><button type="button" class="sv-sessao ${cls}" data-sessao="${id}"><span class="sv-thumb">${svAquarela(id,120,120,3,5)}${img}</span><span class="sv-t"><span class="sv-k">${k}</span><span class="sv-n">${t}</span><span class="sv-a">${a}</span></span>${fim}</button></li>`;
}
function renderSessoesAtracao(){
  const el=$('atrSessoes');if(!el)return;
  const e=trEst(),feitas=TRILHA.filter(s=>e.feitas[s.id]).length,primeira=TRILHA.findIndex(s=>!e.feitas[s.id]);
  let h=`<header class="sv-capa">${svMascote('sv-gata')}<div class="sv-txtc"><h1>Atração</h1><p>Vamos por partes.</p><p class="sv-prog">${feitas} de ${TRILHA.length} sessões</p></div></header><ol class="sv-lista">`;
  TRILHA.forEach((s,i)=>{
    const ok=e.feitas[s.id],cur=i===primeira,emAnd=!ok&&e.tela[s.id]>0;
    /* as que vêm depois da atual ficam à vista, bem apagadas e com cadeado: uma de cada vez */
    const trav=!ok&&!cur&&!emAnd&&primeira>=0&&i>primeira;
    h+=cardTrilha(cur?'atual':trav?'travada':'',ok?SV_IC.check:'',esc(s.kicker),esc(s.titulo),esc(s.afirma),s.id,
      ok?'':trav?`<span class="sv-fim sv-cadeado" aria-label="Ainda fechada">${SV_CADEADO}</span>`:`<span class="sv-fim">${cur||emAnd?'Continuar ':''}${SV_IC.seta}</span>`);
  });
  h+='</ol>';
  const ativos=desejosAtivos(),pend=contrastesPendentes();
  h+='<p class="sv-secao">Seus desejos e ferramentas</p><ol class="sv-lista" style="padding-top:10px">';
  if(ativos.length)h+=cardTrilha('','','Seus desejos',`Meus desejos (${ativos.length})`,'Continuar de onde parou, editar, soltar ou apagar.','desejos',`<span class="sv-fim">${SV_IC.seta}</span>`);
  if(temDeclaracoes())h+=cardTrilha('','','Passo 2','Declaração completa','Todos os seus desejos numa frase só.','decltodos',`<span class="sv-fim">${SV_IC.seta}</span>`);
  if(pend.length)h+=cardTrilha('','','Contraste',`Meus desabafos (${pend.length})`,'Reler com outros olhos o que você já deixou sair.','desabafos',`<span class="sv-fim">${SV_IC.seta}</span>`);
  h+=cardTrilha('','','Permissão','Anotar uma dúvida','Sem precisar de nada antes. Só de anotar, ela perde força.','duvida',`<span class="sv-fim">${SV_IC.seta}</span>`);
  h+='</ol>';
  el.innerHTML=h;
  el.querySelectorAll('[data-sessao]').forEach(b=>b.onclick=()=>{
    if(b.classList.contains('travada')){svSessaoTravada(b,TRILHA[primeira]);return;}
    abrirSessaoPorId(b.dataset.sessao);
  });
  const gc=el.querySelector('gatinha-fantoche');if(gc)gc.onclick=()=>{try{gc.play(['feliz','tchau','curiosa'][Math.floor(Math.random()*3)]);}catch(e){}};
}
const SV_CADEADO='<svg class="sv-ic" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
/* toque numa sessão que ainda não abriu: balança e diz qual vem antes */
function svSessaoTravada(b,atual){
  b.classList.remove('balanca');void b.offsetWidth;b.classList.add('balanca');setTimeout(()=>b.classList.remove('balanca'),500);
  if(navigator.vibrate)try{navigator.vibrate(15);}catch(e){}
  mostrarToast('🔒 Essa abre depois de '+(atual?'“'+atual.titulo+'”':'a sessão atual')+'. Uma de cada vez, no seu ritmo 💜');
}
function abrirSessaoPorId(id){
  if(SV_ABRIR[id]){SV_ABRIR[id]();return;}
  ({desejos:sessaoMeusDesejos,desabafos:sessaoMeusDesabafos,duvida:sessaoDuvidaRapida,decltodos:sessaoDeclaracaoCompleta})[id]();
}

/* ---------- 1. Abertura ---------- */
function sessaoAbertura(){
  sessaoAbrir({...trMeta('abertura'),telas:[
    [['p','Que bom que você chegou até aqui.'],['p','Talvez exista alguma coisa na sua vida que você queira mudar. Talvez você ainda não saiba exatamente o quê. Tudo bem. Não precisamos resolver isso agora.']],
    [['p','Esta trilha é um convite para olhar com mais carinho para o que você deseja, reconhecer o que pode estar dificultando esse caminho e descobrir maneiras de se aproximar da vida que gostaria de viver.']],
    [['p','Nosso ponto de partida é a Lei da Atração: a proposta de voltar a atenção para aquilo que queremos cultivar, em vez de permanecer apenas naquilo que nos incomoda.'],['p','Ao longo desta experiência, vamos explorar três movimentos:'],['chips',['reconhecer o desejo','mantê-lo por perto','abrir espaço para acreditar que ele pode fazer parte da sua vida']]],
    [['p','Você não precisa ter todas as respostas, nem acreditar em tudo desde o início. Apenas venha como está.'],['fecho','O que importa agora é começar.']]
  ]});
}

/* ---------- 2. Contraste: Deixar sair ---------- */
function sessaoDeixarSair(){
  const e=trEst(),R=e.rasc;
  if(!(R.incomodo||'').trim())delete e.foco.contrasteId;
  sessaoAbrir({...trMeta('sair'),limpar:['incomodo'],pular:{rot:'Já sei o que quero: ir para a Clareza',ate:'clareza'},telas:[
    [['p','Antes de falarmos sobre o que você quer, acolha o que está sentindo agora.'],['p','Às vezes, passamos tanto tempo tentando dar conta de tudo que nem conseguimos parar para reconhecer o que nos incomoda. Na Lei da Atração, chamamos de contraste aquilo que nos mostra, pela experiência do que não queremos, o que gostaríamos de viver de outra maneira.']],
    [['p','Aqui, você não precisa organizar seus pensamentos, encontrar soluções ou buscar o lado bom das coisas. Vamos apenas colocar para fora.'],['p','Faça uma lista em tópicos: vá anotando o que está pesando, exatamente como vier à cabeça.']],
    {reage:'suspirar',b:[['campo',{key:'incomodo',rot:'Minha lista de incômodos',dica:'Anote em tópicos curtos. Não precisa filtrar, pontuar ou justificar. Podem ser dois itens ou vinte. Não existe jeito certo.',grande:true}]],
      seguir:()=>{
        const v=(R.incomodo||'').trim();if(!v){mostrarToast('Escreva o que quiser antes de continuar');return false;}
        if(!Array.isArray(S.leiAtracao.contrastes))S.leiAtracao.contrastes=[];
        let c=S.leiAtracao.contrastes.find(x=>x.id===e.foco.contrasteId);
        if(c)c.naoQuero=v;else{c={id:trNovaId('c'),naoQuero:v,area:trAreaPadrao(),criadoEm:hoje()};S.leiAtracao.contrastes.push(c);}
        e.foco.contrasteId=c.id;salva();
      }},
    [['sub','Dica de ritmo'],['p','Se puder, deixe este registro descansar por algum tempo antes de avançar. Dar espaço aos pensamentos nos ajuda a enxergar com mais clareza. Você poderá voltar e completar esta lista sempre que quiser.'],['p','Se você já tem clareza e quer continuar agora, fique à vontade para avançar.']]
  ]});
}

/* ---------- 3. Olhar com outros olhos (sobre um desabafo guardado) ---------- */
function sessaoOlhar(){
  const c=trContraste();
  if(!c){
    sessaoAbrir({id:'escolha',compacto:true,kicker:'Olhar com calma',titulo:'Olhar com outros olhos',telas:[{b:[['p','Ainda não há nada guardado para olhar.'],['p','Quando quiser, a sessão Deixar sair ajuda a colocar o que pesa em palavras.']],
      botoes:[{rot:'Fechar',acao:()=>sessaoFecharTudo()},{rot:'Deixar sair',prim:true,acao:()=>sessaoIr('sair')}]}]},{});
    return;
  }
  trEst().foco.contrasteId=c.id;
  const cam=c.camadas||{};
  const R=trSinc('olhar',c.id,['diferente','origem'],{diferente:cam.pedido||'',origem:cam.origem||''});
  const guarda=()=>{c.camadas={pedido:(R.diferente||'').trim(),origem:(R.origem||'').trim()};salva();};
  sessaoAbrir({...trMeta('olhar'),limpar:['diferente','origem'],pular:{rot:'Já sei o que quero: ir para a Clareza',ate:'clareza'},telas:[
    [["p", "Vamos voltar ao que você escreveu?"],["p", "Leia suas palavras devagar. Imagine que uma amiga querida está contando tudo isso a você. Você não precisa julgá-la, corrigir seus sentimentos ou encontrar uma solução imediatamente. Pode apenas escutá-la."],['lembrete',{titulo:'O que você escreveu',texto:()=>c.naoQuero}]],
    [["p", "Agora, observe se algum incômodo aparece mais de uma vez. Há alguma situação que parece tocar sempre no mesmo ponto? Alguma coisa que você gostaria muito que fosse diferente?"],["p", "Escolha aquilo que mais chama sua atenção e fique um instante com essa pergunta:"],["pergunta", "Se isso pudesse ser diferente, o que eu gostaria que acontecesse?"]],
    {b:[['campo',{key:'diferente',rot:'O que eu gostaria que fosse diferente?'}],["p", "Não se preocupe em encontrar uma resposta perfeita. Às vezes, conseguimos reconhecer com facilidade o que não queremos, mas precisamos de um pouco mais de tempo para descobrir o que queremos no lugar."]],seguir:guarda},
    {b:[["p", "Se sentir vontade de explorar mais, podemos olhar também para a origem desse incômodo."],["p", "Você se lembra de quando começou a pensar assim? Essa sensação acompanha você há muito tempo? Existe alguma voz familiar por trás desse pensamento, alguém que lhe ensinou a olhar para si ou para o mundo dessa maneira?"],['campo',{key:'origem',rot:'De onde pode vir esse incômodo?',opcional:true}],["cuidado", "Se isso trouxer algo muito pesado, você pode parar por aqui e conversar com alguém de confiança ou com quem te acompanha."]],seguir:guarda},
    [["p", "Algumas ideias nos acompanham por tantos anos que acabamos confundindo aquilo que aprendemos com aquilo que realmente pensamos. Ao olhar para elas com calma, podemos descobrir que certas crenças já não combinam com quem somos hoje."],["p", "Você não precisa encontrar uma origem para tudo. E não precisa decidir nada agora. Apenas observe o que faz sentido para você."],["fecho", "Talvez, por trás daquilo que incomoda, já exista uma pista sobre o que você deseja viver."]]
  ]});
}

/* ---------- 4. Passo 1 · Clareza (cria o desejo) ---------- */
function sessaoClareza(opc){
  const livre=!!(opc&&opc.livre),c=livre?null:trContraste();
  const R0=trEst().rasc,andamento=R0.desejoCriado&&S.leiAtracao.desejos.some(x=>x.id===R0.desejoCriado);
  const R=andamento?R0:trSinc('clareza',c?c.id:'livre',['quero','muda','area','desejoCriado'],{});
  if(!R.area)R.area=(c&&c.area)||trAreaPadrao();
  const pedido=()=>c?((c.camadas&&c.camadas.pedido)||c.naoQuero):'';
  const gaveta=()=>c?`<details class="sv-gaveta"><summary>Puxe para ver sua Lista de Incômodos</summary><blockquote>${esc(c.naoQuero)}</blockquote></details>`:'';
  const areas=()=>'<div class="sv-chips">'+S.leiAtracao.areas.map(a=>`<button type="button" class="sv-chip${a.id===R.area?' on':''}" data-area="${esc(a.id)}">${esc(a.nome)}</button>`).join('')+'</div>';
  const ligarAreas=r=>r.querySelectorAll('[data-area]').forEach(b=>b.onclick=()=>{R.area=b.dataset.area;salva();r.querySelectorAll('[data-area]').forEach(x=>x.classList.toggle('on',x===b));});
  const dica='<div class="sv-exemplo"><span>Dica simples</span><p>Tente escrever seu desejo no positivo, começando por um verbo.</p><p><b>Em vez de:</b> “Não quero mais viver exausta.”</p><p><b>Experimente:</b> “Quero cuidar da minha energia e ter mais disposição para viver.”</p></div>';
  sessaoAbrir({...trMeta('clareza'),limpar:['quero','muda','area','desejoCriado'],telas:[
    [['p','Passe os olhos pela sua lista de incômodos com curiosidade, como se estivesse ouvindo uma amiga querida. Sem julgar, sem se cobrar uma solução rápida.'],['html',gaveta]],
    [['p','Agora, experimente dar um passo na direção oposta: em vez de permanecer no que deseja deixar para trás, imagine o que gostaria de encontrar no lugar.'],['html',dica],['p','Perceba a diferença: não estamos apagando o que você sente, mas abrindo espaço para imaginar o que você quer cultivar.']],
    {b:[['html',gaveta],['campo',{key:'quero',rot:'O que eu quero no lugar?',dica:'Comece por um verbo, no positivo.'}]],
      seguir:()=>{if(!(R.quero||'').trim()){mostrarToast('Escreva o que você quer');return false;}}},
    {reage:'brilho',b:[['sub','Em que parte da sua vida mora esse desejo?'],['html',areas,ligarAreas]],
      seguir:()=>{
        const cl=limparTextoDesejo(trSemQuero(R.quero))||trSemQuero(R.quero);
        let d=R.desejoCriado&&S.leiAtracao.desejos.find(x=>x.id===R.desejoCriado);
        if(d){d.texto=cl;d.area=R.area;}
        else{
          d=novoDesejo(R.area||trAreaPadrao(),cl);d.nucleo='';
          if(c){d.contrasteOrigem=c.naoQuero;const cm=c.camadas||{};if(cm.pedido||cm.origem)d.camadas={pedido:cm.pedido||'',origem:cm.origem||''};
            S.leiAtracao.contrastes=(S.leiAtracao.contrastes||[]).filter(x=>x.id!==c.id);}
          S.leiAtracao.desejos.push(d);R.desejoCriado=d.id;
        }
        const f=trEst().foco;f.desejoId=d.id;delete f.contrasteId;salva();
      }},
    {b:[['p','Se quiser aprofundar um pouco mais:'],['campo',{key:'muda',rot:'Por que isso é importante para mim? O que muda na minha vida se eu me aproximar disso?',opcional:true}],['fecho','Você não precisa ter um plano inteiro agora. Basta reconhecer para onde quer caminhar.']],
      seguir:()=>{const d=S.leiAtracao.desejos.find(x=>x.id===R.desejoCriado),v=(R.muda||'').trim();if(d&&v){d.camadas=Object.assign({},d.camadas,{importa:v});salva();}}}
  ]});
}

/* ---------- 5. Passo 2 · Declaração de desejo ---------- */
const PREFIXOS_TRILHA=[['eu_decidi','para assumir um compromisso claro'],['ad_ideia','para abrir uma possibilidade leve'],['ad_saber','para reconhecer sua capacidade'],['ad_sensacao','para gerar entusiasmo suave'],['e_bom_saber','para trazer alívio e paz'],['me_empolga','para despertar curiosidade']];
function sessaoDeclaracao(d){
  if(!d)return;
  if(!Array.isArray(d.corpo))d.corpo=[];
  if(!d.corpo.length){d.corpo.push({k:'ad_ideia',texto:trBase(d)});salva();}
  const seletor=()=>`<div>${trDeclHTML(d)}</div><div style="margin-top:14px">`+
    PREFIXOS_TRILHA.map(([k,desc])=>{const m=MODELOS_CORPO.find(x=>x.k===k);const on=d.corpo.some(c=>c.k===k);
      return `<button type="button" class="sv-opt${on?' on':''}" data-pref="${k}"><b>${esc(m.pre)}…</b><span>${desc}</span></button>`;}).join('')+`</div>`+
    `<p class="sv-dica" style="margin:14px 0 8px">Toque num prefixo para incluir ou tirar. Para ajustar as palavras, toque no texto de cada frase:</p>`+
    d.corpo.map((c,i)=>{const m=MODELOS_CORPO.find(x=>x.k===c.k);return m?`<label class="sv-edit"><span>${esc(m.pre)}</span><input type="text" data-ei="${i}" value="${esc(c.texto||'')}" aria-label="${esc(m.pre)}"></label>`:'';}).join('');
  const ligar=r=>{
    r.querySelectorAll('[data-pref]').forEach(b=>b.onclick=()=>{
      const k=b.dataset.pref,i=d.corpo.findIndex(c=>c.k===k);
      if(i>=0){if(d.corpo.length<2){mostrarToast('Deixe pelo menos uma frase');return;}d.corpo.splice(i,1);}else d.corpo.push({k,texto:trBase(d)});
      salva();sessaoAtualizar();
    });
    r.querySelectorAll('[data-ei]').forEach(inp=>inp.oninput=()=>{
      const c=d.corpo[+inp.dataset.ei];const v=inp.value.trim();if(!c)return;
      c.texto=v?v.charAt(0).toLowerCase()+v.slice(1):'';salva();
      const box=r.querySelector('.declaracao-montada');if(box)box.outerHTML=trDeclHTML(d);
    });
  };
  sessaoAbrir({...trMeta('declaracao'),telas:[
    [['p','Agora que você deu nome ao seu desejo, preparamos a sua Declaração Pessoal para mantê-lo por perto na rotina.'],['p','Uma declaração não é uma cobrança: é um lembrete leve de direção.']],
    [['sub','Como sua frase foi montada'],['lembrete',{titulo:'O que você quer',texto:()=>trTexto(d)}],['p','Combinamos o desejo que você escreveu com um prefixo acolhedor. Os prefixos funcionam como uma ponte: eles tiram a resistência da mente, permitindo que você leia a frase com naturalidade e sem a sensação de estar se forçando a acreditar em algo irreal.'],['html',()=>trDeclHTML(d)]],
    {b:[['sub','Ajuste até soar verdadeiro'],['p','Leia em voz alta ou em pensamento e perceba a sensação no corpo. Busque sentir tranquilidade, alívio ou um entusiasmo suave.'],['p','Se a frase soar distante, troque o prefixo abaixo para testar novas combinações:'],['html',seletor,ligar]],
      botoes:[{rot:'Tenho dúvida',acao:()=>{d.sensacao='duvida';salva();sessaoIr('permissao');}},
        {rot:'Sim, faz bem',prim:true,acao:()=>{d.sensacao='boa';salva();confete(['✨','💫','🌟']);sessaoProxima('feliz');}}]},
    [['p','Reserve um momento do dia para reler sua declaração. Sem transformar em obrigação: o objetivo é apenas acostumar sua mente com uma sensação positiva e aberta.'],['atalho',{rot:'Transformar em hábito: ler minha declaração',acao:()=>habitoLerDeclaracao()}],...(temDeclaracoes()?[['atalho',{rot:'Ver a declaração completa, de todos os desejos',acao:sessaoDeclaracaoCompleta}]]:[])]
  ]});
}

/* ---------- 6. Passo 3 · Permissão (4 etapas numa sessão só) ---------- */
function sessaoPermissao(d){
  if(!d)return;
  if(!Array.isArray(d.gravetos))d.gravetos=[];
  const F=trEst().foco;
  const R=trSinc('perm',d.id,['voz','origemIdeia','seFosse','permissao','evid'],{});
  if(!(R.voz||'').trim())delete F.gravetoId;
  const desejoLemb=['lembrete',{titulo:'Seu desejo',texto:()=>trTexto(d)}];
  const vozLemb=['lembrete',{titulo:'O que a voz disse',texto:()=>R.voz}];
  const sugestoes=()=>{
    const fr=(sugerirPermissoes(R.voz)||{}).frases||[];
    return (fr.length?`<div>${fr.map((f,i)=>`<button type="button" class="sv-opt" data-f="${i}"><span>em terceira pessoa</span><b style="font-weight:600">${esc(f)}</b></button>`).join('')}</div>`:'')+
      `<div class="sv-chips"><button type="button" class="sv-chip" data-fi="Eu estou em processo de ">Eu estou em processo de…</button><button type="button" class="sv-chip" data-fi="Muitas coisas podem acontecer para ">Muitas coisas podem acontecer…</button></div>`;
  };
  const ligarSug=r=>{
    const fr=(sugerirPermissoes(R.voz)||{}).frases||[];
    r.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>svPreencher('permissao',fr[+b.dataset.f]));
    r.querySelectorAll('[data-fi]').forEach(b=>b.onclick=()=>svPreencher('permissao',b.dataset.fi));
  };
  const salvarEvid=()=>{
    const v=(R.evid||'').trim();if(!v)return;
    if(!Array.isArray(d.evidencias))d.evidencias=[];
    d.evidencias.push({id:trNovaId('e'),texto:v,data:hoje()});R.evid='';salva();
  };
  sessaoAbrir({...trMeta('permissao'),limpar:['voz','origemIdeia','seFosse','permissao','evid'],telas:[
    [['p','Às vezes, reconhecer o que queremos é só o começo. É comum uma parte de nós desejar muito algo, enquanto outra sussurra que não vai dar certo.'],['p','Não precisamos brigar com essa voz. Vamos escutá-la e ressignificá-la em 4 etapas curtas.']],
    {b:[['sub','1. Escute o receio'],desejoLemb,['p','Pense no desejo que você escreveu. O que essa voz interna diz quando você imagina essa conquista? Qual é o medo que surge?'],['campo',{key:'voz',rot:'O que essa voz me diz?',grande:true}]],
      seguir:()=>{
        const v=(R.voz||'').trim();if(!v){mostrarToast('Escreva o que a voz diz');return false;}
        let g=trGraveto(d);
        if(g)g.duvida=v;else{g={id:trNovaId('g'),duvida:v,alivio:'',solto:false,criadoEm:hoje()};d.gravetos.push(g);}
        F.gravetoId=g.id;salva();
        if(/porque/i.test(v))mostrarToast('Você disse “porque”: achou uma crença que pode ser trocada. 🪵');
      }},
    {b:[['sub','2. Olhe para essa voz com curiosidade'],vozLemb,['p','Tente compreender a origem desse pensamento sem se julgar:'],
        ['campo',{key:'origemIdeia',rot:'De onde vem essa ideia? Ela é uma verdade absoluta ou apenas um aprendizado do passado?',opcional:true}],
        ['campo',{key:'seFosse',rot:'Quem eu poderia ser ou o que eu experimentaria se não acreditasse totalmente nesse pensamento?',opcional:true}],
        ['p','O objetivo não é provar que a sua dúvida está errada, mas perceber que um medo antigo não precisa definir todas as suas possibilidades de futuro.']],
      seguir:()=>{const g=trGraveto(d);if(g){g.origem=(R.origemIdeia||'').trim();g.seFosse=(R.seFosse||'').trim();salva();}}},
    {reage:'brilho',b:[['sub','3. Experimente uma nova perspectiva'],vozLemb,['p','Imagine o que uma pessoa querida, que ama você e respeita seu tempo, diria sobre essa situação.'],['p','Escreva uma frase de permissão que ofereça esse mesmo olhar acolhedor. Não precisa prometer que tudo será perfeito, apenas lembrar que você pode aprender, pedir ajuda ou caminhar no seu tempo.'],['p','Se ajudar, comece com: “Eu estou em processo de...”'],['html',sugestoes,ligarSug],['campo',{key:'permissao',rot:'Minha frase de permissão'}]],
      seguir:()=>{
        const v=(R.permissao||'').trim();if(!v){mostrarToast('Escreva a sua frase ou toque numa sugestão');return false;}
        const g=trGraveto(d);if(!g)return false;
        g.alivio=v;g.solto=true;g.soltoEm=hoje();salva();
        try{renderLivroPermissoes();}catch(e){}
        mostrarToast('Frase guardada no livro ✓');
      }},
    {b:[['sub','4. Dê espaço para a mudança'],['p','Nos próximos dias, mantenha essa nova frase por perto.'],['lembrete',{titulo:'Sua frase',texto:()=>R.permissao}],['p','Conforme for percebendo pequenas coincidências, novas ideias ou oportunidades no seu dia a dia, por menores que sejam, anote no seu Livro de Permissões. Grandes transformações costumam começar com pequenos sinais.'],
        ['campo',{key:'evid',rot:'Notou algo?',opcional:true,ph:'O que apareceu?'}],
        ['atalho',{rot:'Abrir o Livro de Permissões',acao:()=>{salvarEvid();sessaoFecharTudo(()=>{try{trocaAba('atracao');}catch(e){}setTimeout(()=>{const l=$('livroPermissoes');if(l)l.scrollIntoView({behavior:'smooth',block:'start'});},200);});}}]],
      seguir:salvarEvid}
  ]});
}
/* abre a Permissão já na etapa 3, com a dúvida guardada (Retomar dúvida, Anotar e trabalhar agora) */
function sessaoPermissaoNaFrase(d,g){
  if(!d||!g)return;
  const F=trEst().foco;F.desejoId=d.id;F.gravetoId=g.id;
  const R=trSinc('perm',d.id,['voz','origemIdeia','seFosse','permissao','evid'],{});
  R.voz=g.duvida||'';R.origemIdeia=g.origem||'';R.seFosse=g.seFosse||'';R.permissao=g.alivio||'';
  trEst().tela.permissao=3;salva();
  sessaoPermissao(d);
}

/* ---------- 7. Menor passo (e virar hábito) ---------- */
function sessaoMenorPasso(d){
  if(!d)return;
  if(!Array.isArray(d.menorPassos))d.menorPassos=[];
  const R=trSinc('passo',d.id,['passo','passoId'],{passo:(d.menorPasso&&d.menorPasso.texto)||''});
  sessaoAbrir({...trMeta('passo'),limpar:['passo','passoId'],telas:[
    {reage:'feliz',b:[['lembrete',{titulo:'Seu desejo',texto:()=>trTexto(d)}],['p','Chegamos ao momento de dar corpo ao seu desejo na rotina real.'],['p','Não tente reorganizar sua vida inteira hoje. Pense em algo simples, que leve de 5 a 15 minutos, e que ajude você a dar um pequeno passo em direção ao que quer.'],['p','Exemplos: fazer uma pesquisa rápida, enviar uma mensagem, arrumar uma gaveta, guardar um material ou reservar 10 minutos de silêncio.'],
        ['campo',{key:'passo',rot:'Qual é o menor passo que posso dar hoje?'}]],
      seguir:()=>{
        const v=(R.passo||'').trim();if(!v){mostrarToast('Escreva o seu menor passo');return false;}
        let item=R.passoId&&d.menorPassos.find(x=>x.id===R.passoId);
        if(item){item.texto=v;item.sugestao=paraInfinitivoSugestao(v);}
        else{item={id:trNovaId('mp'),texto:v,criadoEm:hoje(),sugestao:paraInfinitivoSugestao(v)};d.menorPassos.push(item);R.passoId=item.id;}
        d.menorPasso=item;salva();confete(['🌱','✨','💫']);
      }},
    [['sub','Seu passo está guardado'],['lembrete',{titulo:'Meu menor passo',texto:()=>R.passo}],['p','Quando concluir, reconheça o que fez. Não porque um pequeno passo resolve tudo de uma vez, mas porque ele é a prova viva de que você já começou a construir o que deseja.'],['fecho','Você pode começar de onde está, com o que tem e no ritmo que consegue sustentar.'],
      ['html','<button type="button" class="sv-atalho" id="svVirarHab"><span>🌱 Transformar em hábito</span></button><p class="sv-dica" style="margin-top:8px">Opcional. Um hábito novo por vez: o próximo libera 3 dias depois. Se preferir, o passo fica guardado e você decide depois.</p>',r=>{const b=r.querySelector('#svVirarHab');if(b)b.onclick=()=>{svReage('brilho',0);virarDesejoEmHabito(d,R.passo);};}]]
  ]});
}


/* ---------- ferramentas: desejos, desabafos, dúvida rápida ---------- */
const svUtil=(id,kicker,titulo,blocos,botoes)=>({id,compacto:true,kicker,titulo,telas:[{b:blocos,botoes}]});
function sessaoEscolherDesejo(fn){
  const ds=desejosAtivos();
  const ac=ds.map(d=>({rot:esc(trTexto(d)),acao:()=>{trEst().foco.desejoId=d.id;salva();fn(d);}}));
  sessaoAbrir(svUtil('escolha','Escolha','Qual desejo?',[['p','Com qual desejo você quer trabalhar agora?'],['html',()=>svOpcoes(ac),r=>svLigarOpcoes(r,ac)]],
    [{rot:'Fechar',acao:()=>sessaoFecharTudo()}]),{});
}

/* Meus desejos: lista e ações de cada um */
function svLinhaDesejo(d){
  const tem=d.corpo&&d.corpo.some(c=>(c.texto||'').trim()),ab=(d.gravetos||[]).filter(g=>!g.solto).length;
  const st=[tem?'declaração ✓':'declaração pendente',ab?`${ab} ${ab===1?'dúvida aberta':'dúvidas abertas'}`:((d.gravetos||[]).length?'permissão ✓':''),d.menorPasso?'menor passo ✓':''].filter(Boolean).join(' · ');
  return {rot:esc(trTexto(d)),sub:st,acao:()=>sessaoDesejoHub(d)};
}
function sessaoMeusDesejos(){
  const ds=desejosAtivos();
  if(!ds.length){mostrarToast('Você ainda não tem um desejo. Vamos começar pela Clareza 💜');sessaoClareza({livre:true});return;}
  const grupos=[];
  S.leiAtracao.areas.forEach(a=>{const g=ds.filter(d=>d.area===a.id);if(g.length)grupos.push([a.nome,g]);});
  const ids=new Set(S.leiAtracao.areas.map(a=>a.id)),outros=ds.filter(d=>!ids.has(d.area));if(outros.length)grupos.push(['Outros',outros]);
  const todos=[];let html='';
  grupos.forEach(([nome,g])=>{html+=`<p class="sv-dica" style="margin:6px 0 8px"><b>${esc(nome)}</b></p>`;
    g.forEach(d=>{const o=svLinhaDesejo(d);todos.push(o);html+=svOpcoes([Object.assign({},o)]).replace('data-op="0"',`data-op="${todos.length-1}"`);});});
  const topo=temDeclaracoes()?[['atalho',{rot:'Ver a declaração completa, de todos os desejos',acao:sessaoDeclaracaoCompleta}]]:[];
  sessaoAbrir(svUtil('desejos','Seus desejos','Meus desejos',[...topo,['p','Escolha um desejo para continuar de onde parou.'],['html',()=>html,r=>svLigarOpcoes(r,todos)]],
    [{rot:'Fechar',acao:()=>sessaoFecharTudo()},{rot:'Novo desejo',prim:true,acao:()=>sessaoClareza({livre:true})}]),{});
}
function sessaoDesejoHub(d){
  if(!d)return;
  const abertas=(d.gravetos||[]).filter(g=>!g.solto);
  const foco=fn=>()=>{trEst().foco.desejoId=d.id;salva();fn(d);};
  const ac=[
    {rot:'Declaração',sub:'Montar ou ajustar a frase',acao:foco(sessaoDeclaracao)},
    {rot:'Permissão',sub:'Escutar a voz que duvida',acao:foco(sessaoPermissao)},
    ...abertas.map(g=>({rot:'Retomar dúvida',sub:esc(String(g.duvida).slice(0,90)),acao:()=>sessaoPermissaoNaFrase(d,g)})),
    {rot:'Menor passo',sub:d.menorPasso?esc(d.menorPasso.texto):'Algo de 5 a 15 minutos',acao:foco(sessaoMenorPasso)},
    {rot:'Editar o texto do desejo',acao:()=>sessaoEditarDesejo(d)},
    {rot:'Soltar este desejo',sub:'Arquivar e dizer o que ficou no lugar',acao:()=>sessaoSoltarDesejo(d)},
    {rot:'Apagar de vez',acao:()=>sessaoConfirmar('Apagar de vez?','Isso some pra sempre. Se só não faz mais sentido agora, use Soltar desejo: ele arquiva e pergunta o que ficou no lugar.','Apagar de vez',()=>{
      S.leiAtracao.desejos=S.leiAtracao.desejos.filter(x=>x.id!==d.id);if(trEst().foco.desejoId===d.id)delete trEst().foco.desejoId;salva();mostrarToast('Desejo apagado');
      desejosAtivos().length?sessaoMeusDesejos():sessaoFecharTudo();},()=>sessaoDesejoHub(d))}];
  sessaoAbrir(svUtil('desejos','Desejo','O que você quer fazer agora?',[['lembrete',{titulo:'Seu desejo',texto:()=>trTexto(d)}],['html',()=>svOpcoes(ac),r=>svLigarOpcoes(r,ac)]],
    [{rot:'Voltar à lista',acao:sessaoMeusDesejos}]),{});
}
function sessaoConfirmar(tit,txt,rotOk,ok,cancelar){
  sessaoAbrir(svUtil('escolha','Confirmar',tit,[['p',txt]],[{rot:'Cancelar',acao:cancelar||(()=>sessaoFecharTudo())},{rot:rotOk,prim:true,acao:ok}]),{});
}
function sessaoEditarDesejo(d){
  sessaoAbrir(svUtil('desejos','Desejo','Editar o desejo',[['p','Ajuste as palavras até soar como você.'],['campo',{key:'novo',rot:'Meu desejo',dica:'Comece por um verbo, no positivo.'}]],
    [{rot:'Cancelar',acao:()=>sessaoDesejoHub(d)},{rot:'Salvar',prim:true,acao:()=>{
      const v=trSemQuero(_sessao.dados.novo);if(!v){mostrarToast('Escreva o desejo');return;}
      d.texto=limparTextoDesejo(v)||v;salva();mostrarToast('Desejo atualizado ✓');sessaoDesejoHub(d);}}]),{novo:trTexto(d)});
}
function sessaoSoltarDesejo(d){
  sessaoAbrir(svUtil('desejos','Desejo','Soltar este desejo',[['lembrete',{titulo:'Seu desejo',texto:()=>trTexto(d)}],
    ['p','Às vezes um desejo deixa de fazer sentido, e tudo bem. Soltar não é desistir: é abrir espaço.'],['p','Ele fica arquivado. Se quiser, conte o que ficou no lugar.'],
    ['campo',{key:'lugar',rot:'O que ficou no lugar?',opcional:true}]],
    [{rot:'Cancelar',acao:()=>sessaoDesejoHub(d)},{rot:'Soltar',prim:true,acao:()=>{
      const noLugar=(_sessao.dados.lugar||'').trim();
      d.arquivado=true;d.arquivadoEm=hoje();d.soltoNoLugar=noLugar;if(trEst().foco.desejoId===d.id)delete trEst().foco.desejoId;salva();mostrarToast('Desejo arquivado 🍃');
      if(noLugar){const novo=novoDesejo(d.area||'vontades',paraInfinitivoSugestao(noLugar)||noLugar);novo.veioDeSoltar=d.id;S.leiAtracao.desejos.push(novo);salva();sessaoDesejoHub(novo);}
      else if(desejosAtivos().length)sessaoMeusDesejos();else sessaoFecharTudo();
    }}]),{lugar:''});
}

/* Declaração completa: a frase de todos os desejos juntos (o app monta abertura e fecho) */
function temDeclaracoes(){try{return !!montarDeclaracaoTodos();}catch(e){return false;}}
function sessaoDeclaracaoCompleta(){
  const partes=montarDeclaracaoTodos();
  if(!partes){mostrarToast('Monte a declaração de um desejo primeiro 💜');sessaoMeusDesejos();return;}
  sessaoAbrir(svUtil('decltodos','Passo 2','Declaração completa',[
    ['p','Aqui estão todos os seus desejos juntos, numa declaração só. O app monta o começo e o fim da frase.'],
    ['html',()=>`<div class="declaracao-montada"><span class="dm-lb">Declaração completa · todos os desejos</span>${partes.map(x=>`<div style="margin-bottom:8px">${x}</div>`).join('')}</div>`],
    ['p','Leia em voz alta. Se algo soar distante, abra o desejo e ajuste as palavras na Declaração.'],
    ['atalho',{rot:'Transformar em hábito: ler minha declaração',acao:()=>habitoLerDeclaracao()}]],
    [{rot:'Voltar',acao:()=>sessaoMeusDesejos()},{rot:'Fechar',prim:true,acao:()=>sessaoFecharTudo()}]),{});
}

/* Meus desabafos: o que já foi deixado sair */
function sessaoMeusDesabafos(){
  const ps=contrastesPendentes();
  if(!ps.length){mostrarToast('Nenhum desabafo guardado ainda 💜');sessaoIr('sair');return;}
  const ac=ps.map(c=>({rot:esc(String(c.naoQuero).slice(0,90))+(String(c.naoQuero).length>90?'…':''),sub:esc(c.criadoEm||''),acao:()=>sessaoDesabafo(c)}));
  sessaoAbrir(svUtil('desabafos','Contraste','Meus desabafos',[['p','Aqui ficam as listas que você já deixou sair. Escolha uma para olhar com calma.'],['html',()=>svOpcoes(ac),r=>svLigarOpcoes(r,ac)]],
    [{rot:'Fechar',acao:()=>sessaoFecharTudo()},{rot:'Novo desabafo',prim:true,acao:()=>sessaoIr('sair')}]),{});
}
function sessaoDesabafo(c){
  if(!c)return;
  const usa=id=>()=>{trEst().foco.contrasteId=c.id;salva();sessaoIr(id);};
  const ac=[{rot:'Olhar com outros olhos',sub:'Reler com calma e descobrir o que você quer',acao:usa('olhar')},
    {rot:'Já sei o que quero',sub:'Ir direto para a Clareza',acao:usa('clareza')},
    {rot:'Apagar este desabafo',acao:()=>sessaoConfirmar('Apagar este desabafo?','Ele some de vez. Se só não faz mais sentido agora, você pode deixá-lo guardado.','Apagar',()=>{
      S.leiAtracao.contrastes=(S.leiAtracao.contrastes||[]).filter(x=>x.id!==c.id);if(trEst().foco.contrasteId===c.id)delete trEst().foco.contrasteId;salva();mostrarToast('Desabafo removido');
      contrastesPendentes().length?sessaoMeusDesabafos():sessaoFecharTudo();},()=>sessaoDesabafo(c))}];
  sessaoAbrir(svUtil('desabafos','Contraste','Seu desabafo',[['lembrete',{titulo:'O que você escreveu',texto:()=>c.naoQuero}],['p','O que você quer fazer com ele agora?'],['html',()=>svOpcoes(ac),r=>svLigarOpcoes(r,ac)]],
    [{rot:'Voltar à lista',acao:sessaoMeusDesabafos}]),{});
}

/* Dúvida rápida: anotar sem precisar de nada antes */
function sessaoDuvidaRapida(){
  const ds=desejosAtivos();
  const dados={duv:'',dd:''};
  const escolha=()=>`<p class="sv-dica" style="margin-bottom:8px">A que desejo essa dúvida pertence?</p><div class="sv-chips"><button type="button" class="sv-chip ${!dados.dd?'on':''}" data-dd="">Dúvida solta</button>${ds.map(d=>`<button type="button" class="sv-chip ${dados.dd===d.id?'on':''}" data-dd="${esc(d.id)}">${esc(trTexto(d))}</button>`).join('')}</div>`;
  const ligar=r=>r.querySelectorAll('[data-dd]').forEach(b=>b.onclick=()=>{dados.dd=b.dataset.dd;r.querySelectorAll('[data-dd]').forEach(x=>x.classList.toggle('on',x===b));});
  const guardar=trabalhar=>{
    const txt=(dados.duv||'').trim();if(!txt){mostrarToast('Escreva a dúvida');return;}
    let d=dados.dd?S.leiAtracao.desejos.find(x=>x.id===dados.dd):null;
    if(!d){d=novoDesejo('vontades','Dúvida solta');d.texto='Dúvida solta';S.leiAtracao.desejos.push(d);}
    if(!Array.isArray(d.gravetos))d.gravetos=[];
    const g={id:trNovaId('g'),duvida:txt,alivio:'',solto:false,criadoEm:hoje()};d.gravetos.push(g);
    salva();
    if(trabalhar){sessaoPermissaoNaFrase(d,g);return;}
    sessaoFecharTudo(null,'Dúvida anotada ✓');
  };
  sessaoAbrir(svUtil('duvida','Permissão','Anotar uma dúvida',[['p','Anote o que te trava. Quando aparecer um “porque”, ali mora uma crença que limita.'],['p','Não precisa resolver agora: só de anotar, ela perde força.'],
    ['campo',{key:'duv',rot:'O que me trava?',ph:'Eu não posso porque…'}],['html',escolha,ligar]],
    [{rot:'Só anotar',acao:()=>guardar(false)},{rot:'Anotar e trabalhar agora',prim:true,acao:()=>guardar(true)}]),dados);
}


/* se a aba Atração já estava desenhada antes deste arquivo carregar, redesenha */
try{renderAtracaoTudo();}catch(e){}
