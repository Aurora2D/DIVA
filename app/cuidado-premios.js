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
const PREMIO_SO_NOITE=/\blua\b|\bluar\b|estrela|c[ée]u (à|a|de) noite|c[ée]u noturno/i;
function ehNoite(d){const h=(d||new Date()).getHours();return h>=18||h<5;}
function premioCabe(p,sit){
  if(PREMIO_SO_NOITE.test(p&&p.nome||'')&&!ehNoite())return false;
  if(!sit)return true;
  if(p.custo==='planejar')return false;
  const dur=p.dur||(p.tamanho==='P'?5:p.tamanho==='M'?15:30);
  if(sit.tag&&!(p.cabe||['junto','descanso','livre']).includes(sit.tag))return false;
  if(sit.durMax&&dur>sit.durMax)return false;
  return true;
}
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
function pesoPremio(p){return pesoEstilo(p.estilo||estiloDoPremio(p.nome))*(typeof p.peso==='number'?p.peso:1);}
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
function premioNovo(base){return migrarPremio({id:'p'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),usado:false,peso:1,...base});}

/* ---- cardápio montado pelo estilo ---- */
let cardapioSel=null;
function sugestoesCardapio(){
  const tem=new Set(S.premios.map(p=>p.nome.toLowerCase()));
  const sits=situacoes();
  const cand=CATALOGO_PREMIOS.filter(p=>!tem.has(p.nome.toLowerCase())&&sits.some(s=>premioCabe(p,s)));
  const out=[];
  ['P','M','G'].forEach(t=>{
    cand.filter(p=>p.tamanho===t).map(p=>({p,w:pesoEstilo(p.estilo)+Math.random()*0.9}))
      .sort((a,b)=>b.w-a.w).slice(0,3).forEach(x=>out.push(x.p));
  });
  return out;
}
function abrirCardapio(){
  const sug=sugestoesCardapio();
  const temQd=new Set((S.quandoDer||[]).map(q=>q.nome.toLowerCase()));
  const qd=CATALOGO_QUANDO_DER.filter(n=>!temQd.has(n.toLowerCase()));
  cardapioSel=new Set(sug.map(p=>p.nome));
  const e=S.estiloAutocuidado;const ep=e&&e.feito?Object.values(ESTILO_CATS).find(c=>c.id===e.principal):null;
  const nomeTam={P:'Pequenos · prêmio dos 3 dias',M:'Médios · prêmio dos 7 dias',G:'Grandes · prêmio dos 21 dias'};
  let h=`<div class="modal-emoji" style="text-align:center">🎁</div><div class="modal-pergunta" style="text-align:center">Seu cardápio de prêmios</div>
    <p class="mut" style="font-size:12.5px;line-height:1.55;margin-bottom:12px">${ep?'Escolhidos pensando no seu jeito de se cuidar ('+esc(ep.nome)+') e no que cabe na sua rotina.':'Prêmios que cabem na sua rotina.'} Desmarque o que não combina. Dá pra mudar depois.</p>`;
  if(!sug.length)h+='<div class="lp-vazio">Você já tem todos os prêmios do catálogo que combinam com você. 💛</div>';
  ['P','M','G'].forEach(t=>{
    const l=sug.filter(p=>p.tamanho===t);if(!l.length)return;
    h+=`<div class="cardapio-tit">${nomeTam[t]}</div>`;
    l.forEach(p=>{h+=`<button type="button" class="cardapio-item on" data-cp="${esc(p.nome)}"><span class="cardapio-check"></span><span class="cardapio-txt">${esc(p.nome)}<small>${esc(premioRotuloCabe(p))}${p.custo==='gratis'?' · de graça':''}</small></span></button>`;});
  });
  if(qd.length){
    h+=`<div class="cardapio-tit">Quando der · pra planejar com calma</div><p class="mut" style="font-size:11.5px;line-height:1.45;margin:-2px 0 8px">Não entram no sorteio. Ficam guardados numa lista à parte.</p>`;
    qd.forEach(n=>{h+=`<button type="button" class="cardapio-item" data-qd="${esc(n)}"><span class="cardapio-check"></span><span class="cardapio-txt">${esc(n)}</span></button>`;});
  }
  $('cardapioCorpo').innerHTML=h;
  $('cardapioCorpo').querySelectorAll('.cardapio-item').forEach(b=>{b.onclick=()=>b.classList.toggle('on');});
  abrirOverlayTopo($('cardapioModal'));
}
$('cardapioFechar').onclick=()=>fecharOverlay($('cardapioModal'));
$('cardapioSalvar').onclick=()=>{
  let n=0,q=0;
  $('cardapioCorpo').querySelectorAll('.cardapio-item.on[data-cp]').forEach(b=>{const p=CATALOGO_PREMIOS.find(x=>x.nome===b.dataset.cp);if(p){S.premios.push(premioNovo({...p}));n++;}});
  $('cardapioCorpo').querySelectorAll('.cardapio-item.on[data-qd]').forEach(b=>{S.quandoDer.push({id:'q'+Date.now().toString(36)+q,nome:b.dataset.qd,criadoEm:hoje(),feitoEm:null});q++;});
  salva();renderCelebrar();
  fecharOverlay($('cardapioModal'),()=>{confete(['🎁','✨','💛']);som('caixinha');mostrarToast((n?n+(n===1?' prêmio':' prêmios')+' no seu cardápio':'Cardápio guardado')+(q?' · '+q+' em Quando der':'')+' ✓');});
};

/* ---- lista "Quando der" ---- */
function renderQuandoDer(){
  const el=$('quandoDerBox');if(!el)return;
  const l=(S.quandoDer||[]);const pend=l.filter(x=>!x.feitoEm),feitos=l.filter(x=>x.feitoEm);
  let h='<p class="mut" style="font-size:12.5px;line-height:1.55;margin:0 0 10px">O que precisa de planejamento, dinheiro ou ajuda de alguém. Não entra no sorteio: fica aqui pra quando der.</p>';
  if(!l.length)h+='<div class="lp-vazio" style="margin-bottom:10px">Nada por enquanto.</div>';
  pend.forEach(x=>{h+=`<div class="cuid-item"><button type="button" class="cuid-check" data-qfeito="${esc(x.id)}" aria-label="Aconteceu"></button><span class="cuid-txt">${esc(x.nome)}</span><button type="button" class="cuid-x" data-qrm="${esc(x.id)}">×</button></div>`;});
  feitos.forEach(x=>{h+=`<div class="cuid-item feito"><button type="button" class="cuid-check on" data-qdesf="${esc(x.id)}">✓</button><span class="cuid-txt">${esc(x.nome)}<small>aconteceu em ${esc(cfgDataBr(x.feitoEm))}</small></span><button type="button" class="cuid-x" data-qrm="${esc(x.id)}">×</button></div>`;});
  h+=`<div style="display:flex;gap:8px;margin-top:10px"><input id="qdNovo" placeholder="ex: levar quem eu amo pra praia" style="flex:1"><button class="btn prim" id="qdAdd" type="button" style="flex-shrink:0">Adicionar</button></div>`;
  el.innerHTML=h;
  el.querySelectorAll('[data-qfeito]').forEach(b=>{b.onclick=()=>{const x=S.quandoDer.find(i=>i.id===b.dataset.qfeito);if(!x)return;x.feitoEm=hoje();salva();confete(['🎉','✨','💛']);som('caixinha');renderQuandoDer();};});
  el.querySelectorAll('[data-qdesf]').forEach(b=>{b.onclick=()=>{const x=S.quandoDer.find(i=>i.id===b.dataset.qdesf);if(!x)return;x.feitoEm=null;salva();renderQuandoDer();};});
  el.querySelectorAll('[data-qrm]').forEach(b=>{b.onclick=()=>{const i=S.quandoDer.findIndex(x=>x.id===b.dataset.qrm);if(i<0)return;const [t]=S.quandoDer.splice(i,1);salva();renderQuandoDer();mostrarToast('Removido','Desfazer',()=>{S.quandoDer.splice(i,0,t);salva();renderQuandoDer();});};});
  $('qdAdd').onclick=()=>{const t=$('qdNovo').value.trim();if(!t)return;S.quandoDer.push({id:'q'+Date.now().toString(36),nome:t,criadoEm:hoje(),feitoEm:null});salva();renderQuandoDer();};
  $('qdNovo').onkeydown=ev=>{if(ev.key==='Enter')$('qdAdd').click();};
}

/* ---- formulário de prêmio (adicionar e editar) ---- */
function htmlCamposPremio(pref){
  const t=TAG_ROTULO();
  const cabe=pref.cabe||TUDO;
  let h='';
  if(cuida()){
    h+=`<div class="mut pf-lbl">Dá pra fazer quando</div><div class="chips pf-cabe">${TUDO.map(k=>`<button type="button" class="chip ${cabe.includes(k)?'on':''}" data-cabe="${k}">${esc(t[k])}</button>`).join('')}</div>`;
  }
  h+=`<div class="pf-grade"><label class="mut pf-lbl">Tempo<select class="pf-dur">${[[5,'5 min'],[15,'15 min'],[30,'30 min'],[60,'1 hora ou mais']].map(([v,r])=>`<option value="${v}" ${(pref.dur||15)==v||((pref.dur||15)>60&&v==60)?'selected':''}>${r}</option>`).join('')}</select></label>
    <label class="mut pf-lbl">Tamanho<select class="pf-tam">${[['P','Pequeno'],['M','Médio'],['G','Grande']].map(([v,r])=>`<option value="${v}" ${pref.tamanho===v?'selected':''}>${r}</option>`).join('')}</select></label></div>
    <div class="pf-grade"><label class="mut pf-lbl">Custo<select class="pf-custo">${[['gratis','De graça'],['pequeno','Gasto pequeno'],['planejar','Precisa planejar']].map(([v,r])=>`<option value="${v}" ${(pref.custo||'gratis')===v?'selected':''}>${r}</option>`).join('')}</select></label></div>
    <p class="mut pf-dica">"Precisa planejar" vai pra lista Quando der, fora do sorteio.</p>`;
  return h;
}
function lerCamposPremio(box){
  const cabe=[...box.querySelectorAll('[data-cabe].on')].map(b=>b.dataset.cabe);
  const custo=box.querySelector('.pf-custo').value;
  return{cabe:cuida()?(cabe.length?cabe:['livre']):TUDO,dur:+box.querySelector('.pf-dur').value,tamanho:box.querySelector('.pf-tam').value,custo,gratis:custo==='gratis'};
}
function ligarCamposPremio(box){box.querySelectorAll('[data-cabe]').forEach(b=>{b.onclick=()=>b.classList.toggle('on');});}
function renderFormNovoPremio(){
  const box=$('pCampos');if(!box)return;
  box.innerHTML=htmlCamposPremio({tamanho:'P',dur:5,custo:'gratis',cabe:TUDO});ligarCamposPremio(box);
}

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

