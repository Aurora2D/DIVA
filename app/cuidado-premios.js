/* ============ QUEM VOCÊ CUIDA, SITUAÇÕES E CARDÁPIO DE PRÊMIOS ============ */
function cuida(){return !!(S.cuidado&&S.cuidado.cuida&&(S.cuidado.nome||'').trim());}
function nomeCuidado(){return cuida()?S.cuidado.nome.trim():'';}
function situacoesPadrao(c){
  return c?[
    {id:'perto',rot:'{nome} por perto',tag:'junto'},
    {id:'dormindo',rot:'{nome} dormindo ou descansando',tag:'descanso',noite:true},
    {id:'alguem',rot:'Alguém fica com {nome}',tag:'livre'}
  ]:[
    {id:'t5',rot:'Tenho 5 minutos',durMax:5},
    {id:'t15',rot:'Tenho uns 15 minutos',durMax:15},
    {id:'tmais',rot:'Tenho mais tempo hoje',durMax:999}
  ];
}
function sitRotulo(sit){return sit?String(sit.rot||'').replace(/\{nome\}/g,nomeCuidado()||'quem eu cuido'):'';}
function situacoes(){if(!Array.isArray(S.situacoes)||!S.situacoes.length)S.situacoes=situacoesPadrao(cuida());return S.situacoes;}
function sitPorId(id){return situacoes().find(s=>s.id===id)||null;}
const TAG_ROTULO=()=>({junto:cuida()?'Com '+nomeCuidado()+' junto':'Com alguém junto',descanso:cuida()?'Quando '+nomeCuidado()+' descansa':'Em casa, em silêncio',livre:cuida()?'Quando alguém fica com '+nomeCuidado():'Quando estou livre'});
/* prêmios que só fazem sentido à noite (ver a lua, as estrelas...) não saem de dia */
function premioRotuloCabe(p){
  if(!cuida()){const d=p.dur||15;return d<=5?'5 min':d<=15?'até 15 min':d<=30?'até 30 min':'mais tempo';}
  const t=TAG_ROTULO();const c=p.cabe||['junto','descanso','livre'];
  return c.length===3?'qualquer hora':c.map(x=>t[x]).join(' · ');
}
/* estilo de autocuidado: o que pesa mais no sorteio */
function estiloDoPremio(nome){for(const [k,re] of Object.entries(ESTILO_PALAVRAS_CHAVE))if(re.test(nome||''))return k;return 'tempo';}
function pesoEstilo(est){
  const e=S.estiloAutocuidado;if(!e||!e.feito||e.diversificado)return 1;
  return est===e.principal?3:est===e.secundaria?2:1;
}
function premioAprender(p,gostou){
  if(!p)return;const real=S.premios.find(x=>x.id===p.id)||p;
  const atual=typeof real.peso==='number'?real.peso:1;
  real.peso=gostou?Math.min(3,atual+0.25):Math.max(0.3,atual*0.85);salva();
}
/* migração dos prêmios antigos (campo "onde") para cabe/dur/custo/estilo */
function migrarPremio(p){
  if(!Array.isArray(p.cabe)){
    p.cabe=p.onde==='Aurora'?['junto','descanso','livre']:p.onde==='só eu em casa'?['descanso','livre']:['livre'];
  }
  if(!p.dur)p.dur=p.tamanho==='P'?5:p.tamanho==='M'?15:30;
  if(!p.custo)p.custo=p.gratis?'gratis':'pequeno';
  if(!p.estilo)p.estilo=estiloDoPremio(p.nome);
  return p;
}
/* botões de situação na hora do prêmio (a de noite vem primeiro à noite) */
function botoesSituacao(cont,clsPrim,clsSec,onEscolher){
  const h=new Date().getHours();const noite=h>=19||h<6;
  let lista=situacoes().slice();
  if(noite){const i=lista.findIndex(s=>s.noite);if(i>0){const [x]=lista.splice(i,1);lista.unshift(x);}}
  cont.innerHTML='';
  lista.forEach((s,i)=>{const b=document.createElement('button');b.className=i===0?clsPrim:clsSec;if(clsPrim.indexOf('festa')===0)b.style.width='100%';b.textContent=sitRotulo(s);b.onclick=()=>onEscolher(s.id);cont.appendChild(b);});
}
/* ---- catálogo neutro de prêmios (cabe = em que situação dá pra fazer) ---- */

/* ---- cardápio montado pelo estilo ---- */

/* ---- lista "Quando der" ---- */

/* ---- formulário de prêmio (adicionar e editar) ---- */

/* ---- quem você cuida (onboarding e configurações) ---- */
function definirCuidado(c,nome,rel){
  const antes=cuida();
  S.cuidado={cuida:!!c,nome:c?(nome||'').trim():'',relacao:c?(rel||'outra pessoa'):''};
  if(antes!==cuida()||!Array.isArray(S.situacoes)||!S.situacoes.length)S.situacoes=situacoesPadrao(cuida());
  salva();
}
function abrirQuemCuida(){
  const c=S.cuidado||{cuida:false,nome:'',relacao:''};
  $('qcSim').classList.toggle('on',!!c.cuida);$('qcNao').classList.toggle('on',!c.cuida);
  $('qcNome').value=c.nome||'';
  $('qcRel').innerHTML=RELACOES.map(r=>`<option value="${r}" ${c.relacao===r?'selected':''}>${r}</option>`).join('');
  $('qcCampos').style.display=c.cuida?'':'none';
  renderSituacoesEditor();
  abrirOverlayTopo($('quemCuidaModal'));
}
function renderSituacoesEditor(){
  const box=$('qcSits');if(!box)return;
  const l=situacoes();
  box.innerHTML=l.map(s=>`<div class="cuid-item"><input class="qc-sit" data-sid="${esc(s.id)}" value="${esc(sitRotulo(s))}" style="flex:1;border:none;background:transparent;padding:4px 2px;font-size:13.5px"><button type="button" class="cuid-x" data-srm="${esc(s.id)}" aria-label="Remover">×</button></div>`).join('')
    +`<div class="qc-nova"><input id="qcNovaSit" placeholder="ex: No trabalho, na hora do almoço"><select id="qcParece">${l.map(s=>`<option value="${esc(s.id)}">parecida com: ${esc(sitRotulo(s))}</option>`).join('')}</select><button class="btn" id="qcAddSit" type="button">Adicionar situação</button></div>`;
  box.querySelectorAll('.qc-sit').forEach(inp=>{inp.onchange=()=>{const s=sitPorId(inp.dataset.sid);if(!s)return;const v=inp.value.trim();if(!v){inp.value=sitRotulo(s);return;}const n=nomeCuidado();s.rot=n?v.split(n).join('{nome}'):v;salva();};});
  box.querySelectorAll('[data-srm]').forEach(b=>{b.onclick=()=>{if(situacoes().length<=1){mostrarToast('Deixe pelo menos uma situação');return;}S.situacoes=S.situacoes.filter(s=>s.id!==b.dataset.srm);salva();renderSituacoesEditor();};});
  $('qcAddSit').onclick=()=>{const v=$('qcNovaSit').value.trim();if(!v)return;const base=sitPorId($('qcParece').value)||{};const n=nomeCuidado();S.situacoes.push({id:'s'+Date.now().toString(36),rot:n?v.split(n).join('{nome}'):v,tag:base.tag,durMax:base.durMax,noite:false});salva();renderSituacoesEditor();};
}
$('qcSim').onclick=()=>{$('qcSim').classList.add('on');$('qcNao').classList.remove('on');$('qcCampos').style.display='';};
$('qcNao').onclick=()=>{$('qcNao').classList.add('on');$('qcSim').classList.remove('on');$('qcCampos').style.display='none';};
$('qcSalvar').onclick=()=>{
  const c=$('qcSim').classList.contains('on');const nome=$('qcNome').value.trim();
  if(c&&!nome){mostrarToast('Escreva o nome de quem você cuida');return;}
  const mudouTipo=c!==cuida();
  definirCuidado(c,nome,$('qcRel').value);
  if(mudouTipo)renderSituacoesEditor();
  fecharOverlay($('quemCuidaModal'),()=>{renderConfig();renderHoje();renderCelebrar();mostrarToast('Guardado ✓');});
};
$('qcFechar').onclick=()=>fecharOverlay($('quemCuidaModal'),renderConfig);

