/* ============ Passo 1: contraste handlers ============ */

function abrirListaContrastesPopup(){
  renderContrastesEsperando();
  const src=$('contrastesEsperando');
  const dest=$('contrastesListaModalBody');
  if(dest&&src)dest.innerHTML=src.innerHTML;
  // rebind buttons inside modal
  if(dest){
    dest.querySelectorAll('[data-ct-processar]').forEach(btn=>{
      btn.onclick=()=>{fecharOverlay($('contrastesListaModal'),()=>abrirProcessarContraste(btn.dataset.ctProcessar));};
    });
    dest.querySelectorAll('[data-ct-apagar]').forEach(btn=>{
      btn.onclick=(e)=>{
        e.stopPropagation();
        const id=btn.dataset.ctApagar;
        S.leiAtracao.contrastes=(S.leiAtracao.contrastes||[]).filter(x=>x.id!==id);
        salva();renderAtracaoTudo();abrirListaContrastesPopup();mostrarToast('Contraste removido');
      };
    });
  }
  abrirOverlay($('contrastesListaModal'));
}
$('btnVerContrastes')&&($('btnVerContrastes').onclick=()=>{
  abrirListaContrastesPopup();
  if(!(S.leiAtracao.contrastes||[]).length)mostrarToast('Lista vazia — registre um contraste');
});
$('contrastesListaFechar')&&($('contrastesListaFechar').onclick=()=>fecharOverlay($('contrastesListaModal')));


/* ============ DESEJO DIRETO (sem contraste) ============ */
function abrirDesejoDireto(){
  const o=$('desejoDiretoModal');
  $('ddTexto').value='';
  $('ddArea').innerHTML=S.leiAtracao.areas.map(a=>`<option value="${esc(a.id)}">${esc(a.nome)}</option>`).join('');
  const bem=S.leiAtracao.areas.find(a=>a.id==='bemestar');
  $('ddArea').value=bem?bem.id:(S.leiAtracao.areas[0]&&S.leiAtracao.areas[0].id)||'';
  abrirOverlay(o);
  setTimeout(()=>{const i=$('ddTexto');if(i)i.focus();},280);
}
$('ddCancelar')&&($('ddCancelar').onclick=()=>fecharOverlay($('desejoDiretoModal')));
$('ddSalvar')&&($('ddSalvar').onclick=()=>{
  const t=($('ddTexto').value||'').trim();
  if(!t){avisar('Escreva o que você quer.');return;}
  const area=$('ddArea').value||'vontades';
  const d=novoDesejo(area,t);
  d.nucleo='';
  S.leiAtracao.desejos.push(d);
  salva();
  fecharOverlay($('desejoDiretoModal'),()=>renderAtracaoTudo());
  setTimeout(()=>{mostrarToast('Desejo guardado ✓');abrirDesejo(d.id,1);},400);
});
$('btnNovoDesejoDireto')&&($('btnNovoDesejoDireto').onclick=abrirDesejoDireto);

$('btnNovoContraste').onclick=()=>{
  const o=$('contrasteModal');$('ctNaoQuero').value='';
  $('ctArea').innerHTML=S.leiAtracao.areas.map(a=>`<option value="${esc(a.id)}">${esc(a.nome)}</option>`).join('');
  const bem=S.leiAtracao.areas.find(a=>a.id==='bemestar');$('ctArea').value=bem?bem.id:S.leiAtracao.areas[0].id;
  abrirOverlay(o);
};
$('ctCancelar').onclick=()=>fecharOverlay($('contrasteModal'));
$('ctSalvar').onclick=()=>{
  const naoQ=$('ctNaoQuero').value.trim();
  const area=$('ctArea').value;
  if(!naoQ){avisar('Escreva pelo menos o que te incomodou.');return;}
  if(!Array.isArray(S.leiAtracao.contrastes))S.leiAtracao.contrastes=[];
  S.leiAtracao.contrastes.push({
    id:'c'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),
    naoQuero:naoQ,
    area,
    criadoEm:hoje()
  });
  salva();
  fecharOverlay($('contrasteModal'),()=>renderAtracaoTudo());
  setTimeout(()=>mostrarToast('Contraste na lista ✓','Ver lista',()=>{
    abrirListaContrastesPopup();
  }),420);
};
$('prAinda').onclick=fecharProcessarContraste;
$('prSalvar').onclick=()=>{
  const cl=limparTextoDesejo($('prClareza').value)||$('prClareza').value.trim();
  if(!cl){avisar('Escreva o que você quer, ou toque em "Ainda não sei".');return;}
  const id=ctProcessando;
  const c=(S.leiAtracao.contrastes||[]).find(x=>x.id===id);
  if(!c){fecharProcessarContraste();return;}
  const area=$('prArea').value||c.area;
  const d=novoDesejo(area,cl);
  d.contrasteOrigem=c.naoQuero;
  d.nucleo=''; // só preenche se a pessoa editar o substantivo
  S.leiAtracao.desejos.push(d);
  S.leiAtracao.contrastes=(S.leiAtracao.contrastes||[]).filter(x=>x.id!==id);
  salva();
  fecharProcessarContraste();
  setTimeout(()=>renderAtracaoTudo(),340);
  setTimeout(()=>abrirDesejo(d.id,2),700);
};
$('desejoInput') && ($('desejoInput').onkeydown=e=>{if(e.key==='Enter')$('btnAddDesejo').click();});

/* ============ O QUE TÁ ACONTECENDO ============ */
/* "O que tá acontecendo" removido */


/* Keyboard / visualViewport: keep toast above soft keyboard */
(function(){
  const toast=$('toast');
  if(!toast||!window.visualViewport)return;
  function reposicionar(){
    const vv=window.visualViewport;
    const keyboardOpen=vv.height < window.innerHeight * 0.75;
    if(keyboardOpen){
      const bottomGap=window.innerHeight - (vv.offsetTop + vv.height);
      toast.style.bottom=(bottomGap + 12)+'px';
    } else {
      toast.style.bottom='';
    }
  }
  window.visualViewport.addEventListener('resize',reposicionar);
  window.visualViewport.addEventListener('scroll',reposicionar);
})();


/* ============ PRÁTICAS EDITÁVEIS ============ */
function clonarPraticas(o){const r={};Object.entries(o||{}).forEach(([g,l])=>{r[g]=(Array.isArray(l)?l:[]).slice();});return r;}
function iniciarPraticas(){
  if(!S.praticas||typeof S.praticas!=='object'){
    let base;
    if(S.perfilOriginal){base=clonarPraticas(PRATICAS);}
    else{
      // quem já marcava práticas antes continua com a lista que conhecia
      const usou=Object.values(S.checkins||{}).some(ci=>ci&&ci.praticas&&Object.keys(ci.praticas).length);
      if(usou){
        base=clonarPraticas(PRATICAS);
        base['🤍 Toque físico']=base['🤍 Toque físico'].filter(x=>x!=='Carinho na Nica').map(x=>x==='Carinho no Pituca'?'Carinho num bichinho':x);
        base['💌 Palavras de afirmação']=base['💌 Palavras de afirmação'].map(x=>x==='Vídeos da Ana Beatriz'?'Vídeos que me inspiram':x);
      }else{base=clonarPraticas(PRATICAS_GENERICAS);S.praticasModo='generica';}
    }
    S.praticas=base;salva();
  }
  if(!S.praticasModo&&!S.perfilOriginal&&S.praticas['🛠️ Atos de serviço']){S.praticasModo='generica';salva();}
  PRATICAS=S.praticas;
}
/* Depois do teste: abre mais práticas nos estilos em que ela pontuou alto. Devolve quantas entraram. */
function praticasExpandirPorEstilo(principal,secundaria){
  if(S.praticasModo!=='generica')return 0;
  const removidas=new Set(S.praticasRemovidas||[]);
  const todas=new Set(Object.values(S.praticas).flat());
  let n=0;
  [[principal,PRATICAS_PRINCIPAL],[secundaria,PRATICAS_SECUNDARIA]].forEach(([id,qtd])=>{
    const cat=PRATICAS_CATALOGO.find(c=>c.id===id);if(!cat)return;
    const lista=S.praticas[cat.grupo]||(S.praticas[cat.grupo]=[]);
    cat.itens.slice(0,qtd).forEach(it=>{if(!todas.has(it)&&!removidas.has(it)){lista.push(it);todas.add(it);n++;}});
  });
  // estilo principal e secundário sobem para o topo do check-in
  const topo=[principal,secundaria].map(id=>(PRATICAS_CATALOGO.find(c=>c.id===id)||{}).grupo).filter(g=>g&&S.praticas[g]);
  const novo={};topo.forEach(g=>novo[g]=S.praticas[g]);Object.keys(S.praticas).forEach(g=>{if(!novo[g])novo[g]=S.praticas[g];});
  S.praticas=novo;PRATICAS=S.praticas;salva();
  try{renderPraticasCheckin();}catch(e){}
  return n;
}
/* ============ PRÁTICA SÓ SUA ============ */
const GRUPO_PROPRIAS='⭐ Minhas práticas';
const PRATICAS_PROPRIAS_EX=['Cantar uma música que eu amo','Regar minhas plantas','Tocar violão por 10 minutos','Brincar com meu bichinho'];
function praticaPropriaHTML(pref){
  return `<div class="pp-box">
    <h4>⭐ Tem alguma prática só sua?</h4>
    <p class="mut" style="font-size:12.5px;line-height:1.45;margin:0">Algo que você adora e gostaria de ver aqui.</p>
    <div class="pp-linha"><input type="text" id="${pref}PpInput" maxlength="60" placeholder="Escreva a sua prática"><button type="button" class="btn prim" id="${pref}PpBtn">Adicionar</button></div>
    <div class="mut pp-ex">Por exemplo: ${PRATICAS_PROPRIAS_EX.map(esc).join(' · ')}</div>
    <div class="pp-add" id="${pref}PpLista"></div>
  </div>`;
}
/* coloca a prática no grupo "Minhas práticas" (no topo) de um conjunto de práticas */
function praticaPropriaNoConjunto(conj,txt){
  const ja=Object.values(conj).some(l=>l.includes(txt));
  if(ja)return {conj,novo:false};
  const novo={[GRUPO_PROPRIAS]:(conj[GRUPO_PROPRIAS]||[]).concat(txt)};
  Object.keys(conj).forEach(g=>{if(g!==GRUPO_PROPRIAS)novo[g]=conj[g];});
  return {conj:novo,novo:true};
}
function ligarPraticaPropria(pref,aoAdicionar){
  const inp=$(pref+'PpInput'),btn=$(pref+'PpBtn'),lista=$(pref+'PpLista');if(!inp||!btn)return;
  const vai=()=>{
    const txt=(inp.value||'').trim().replace(/\s+/g,' ');if(!txt){inp.focus();return;}
    const ok=aoAdicionar(txt);
    if(ok){lista.insertAdjacentHTML('beforeend',`<span class="chip on">✓ ${esc(txt)}</span>`);mostrarToast('Adicionada ✓');}
    else mostrarToast('Essa você já tem 💛');
    inp.value='';inp.focus();
  };
  btn.onclick=vai;inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();vai();}};
}
function adicionarPraticaPropria(txt){
  const r=praticaPropriaNoConjunto(S.praticas||PRATICAS,txt);
  if(!r.novo)return false;
  S.praticas=r.conj;PRATICAS=S.praticas;
  if(S.praticasRemovidas)S.praticasRemovidas=S.praticasRemovidas.filter(x=>x!==txt);
  salva();try{renderPraticasCheckin();}catch(e){}
  return true;
}
let _peRascunho=null;
function abrirEditorPraticas(){
  _peRascunho=clonarPraticas(PRATICAS);
  renderEditorPraticas();
  $('peProprias').innerHTML=praticaPropriaHTML('pe');
  ligarPraticaPropria('pe',txt=>{lerEditorPraticas();const r=praticaPropriaNoConjunto(_peRascunho,txt);if(!r.novo)return false;_peRascunho=r.conj;renderEditorPraticas();return true;});
  $('peNovoGrupo').value='';
  abrirOverlay($('praticasEditorModal'));
}
function lerEditorPraticas(){
  // copia o que está digitado nos campos para o rascunho
  const novo={};
  $('praticasEditorCorpo').querySelectorAll('.pe-grupo').forEach(gEl=>{
    const nome=(gEl.querySelector('[data-pe-gnome]').value||'').trim()||gEl.dataset.peOrig;
    const itens=[...gEl.querySelectorAll('[data-pe-item]')].map(i=>i.value.trim()).filter(Boolean);
    const k=novo[nome]?nome+' ':nome;
    novo[k]=[...new Set(itens)];
  });
  _peRascunho=novo;
}
function renderEditorPraticas(){
  const corpo=$('praticasEditorCorpo');
  corpo.innerHTML=Object.entries(_peRascunho).map(([g,itens],gi)=>`<div class="pe-grupo" data-pe-orig="${esc(g)}" data-gi="${gi}">
    <div class="pe-grupo-tit"><input type="text" maxlength="40" data-pe-gnome value="${esc(g)}" aria-label="Nome do grupo"><button type="button" class="pe-x" data-pe-delg="${gi}" aria-label="Apagar grupo">🗑️</button></div>
    ${itens.map((it,ii)=>`<div class="pe-linha"><input type="text" maxlength="60" data-pe-item value="${esc(it)}" aria-label="Prática"><button type="button" class="pe-x" data-pe-deli="${gi}|${ii}" aria-label="Tirar prática">✕</button></div>`).join('')}
    <div class="pe-linha"><input type="text" maxlength="60" data-pe-nova placeholder="Nova prática neste grupo"><button type="button" class="btn" data-pe-add="${gi}">+</button></div>
  </div>`).join('')||`<p class="mut" style="font-size:13px">Nenhum grupo ainda. Crie um abaixo.</p>`;
  corpo.onclick=e=>{
    const grupos=()=>Object.keys(_peRascunho);
    const di=e.target.closest('[data-pe-deli]');
    const dg=e.target.closest('[data-pe-delg]');
    const ad=e.target.closest('[data-pe-add]');
    if(!di&&!dg&&!ad)return;
    const novaTxt=ad?(ad.parentElement.querySelector('[data-pe-nova]').value||'').trim():'';
    lerEditorPraticas();
    if(di){const[gi,ii]=di.dataset.peDeli.split('|').map(Number);_peRascunho[grupos()[gi]].splice(ii,1);}
    else if(dg){const g=grupos()[+dg.dataset.peDelg];if(!confirm('Apagar o grupo "'+g+'" e as práticas dele?'))return;delete _peRascunho[g];}
    else if(ad){const g=grupos()[+ad.dataset.peAdd];if(!novaTxt)return;if(!_peRascunho[g].includes(novaTxt))_peRascunho[g].push(novaTxt);}
    renderEditorPraticas();
    if(ad){const inp=$('praticasEditorCorpo').querySelectorAll('[data-pe-nova]')[+ad.dataset.peAdd];if(inp)inp.focus();}
  };
  corpo.onkeydown=e=>{if(e.key==='Enter'&&e.target.matches('[data-pe-nova]')){e.preventDefault();const b=e.target.parentElement.querySelector('[data-pe-add]');if(b)b.click();}};
}
$('peAddGrupo').onclick=()=>{
  const nome=($('peNovoGrupo').value||'').trim();if(!nome)return;
  lerEditorPraticas();
  if(_peRascunho[nome]){mostrarToast('Esse grupo já existe');return;}
  _peRascunho[nome]=[];$('peNovoGrupo').value='';renderEditorPraticas();
  const ins=$('praticasEditorCorpo').querySelectorAll('[data-pe-nova]');if(ins.length)ins[ins.length-1].focus();
};
$('peNovoGrupo').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();$('peAddGrupo').click();}};
$('peCancelar').onclick=()=>fecharOverlay($('praticasEditorModal'));
$('peSalvar').onclick=()=>{
  // texto digitado em "nova prática" e não confirmado também entra
  $('praticasEditorCorpo').querySelectorAll('[data-pe-nova]').forEach(inp=>{const v=inp.value.trim();if(v){const linha=document.createElement('input');linha.setAttribute('data-pe-item','');linha.value=v;linha.hidden=true;inp.closest('.pe-grupo').appendChild(linha);}});
  lerEditorPraticas();
  const antes=new Set(Object.values(PRATICAS).flat()),depois=new Set(Object.values(_peRascunho).flat());
  const tiradas=[...antes].filter(x=>!depois.has(x));
  if(tiradas.length)S.praticasRemovidas=[...new Set([...(S.praticasRemovidas||[]),...tiradas])].filter(x=>!depois.has(x));
  else if(S.praticasRemovidas)S.praticasRemovidas=S.praticasRemovidas.filter(x=>!depois.has(x));
  S.praticas=_peRascunho;PRATICAS=S.praticas;salva();
  fecharOverlay($('praticasEditorModal'),()=>{renderPraticasCheckin();const box=$('ciPratBox');if(box)box.open=true;mostrarToast('Guardado ✓');});
};

