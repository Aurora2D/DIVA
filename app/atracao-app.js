/* ============ ATRAÇÃO ============ */
function contarDias7(d){
  if(!d||!d.diasNotados)return 0;
  let n=0;const agora=new Date();
  for(let i=0;i<7;i++){const dia=fmtD(addDias(agora,-i));if(d.diasNotados[dia])n++;}
  return n;
}
/* ============ PASSO 1 · CLAREZA ============ */
function renderClarezaLista(){
  const box=$('clarezaLista');if(!box)return;
  const la=S.leiAtracao;
  const todos=desejosAtivos();
  if(!todos.length){
    box.innerHTML='<div class="card mut" style="font-size:12.5px;line-height:1.55;text-align:center">Nada ainda. Toque em <b>+ Contraste</b> e comece pelo que te incomoda.</div>';
    return;
  }
  let html='';
  la.areas.forEach(area=>{
    const ds=todos.filter(d=>d.area===area.id);
    if(!ds.length)return;
    html+=`<details class="grupo-card" style="margin-bottom:8px"><summary><span class="grupo-nome">${esc(area.nome)}</span><span class="grupo-badge">${ds.length}</span></summary><div class="grupo-conteudo">`;
    ds.forEach(d=>{
      const contraste=(d.contrasteOrigem||'').trim();
      const pendente=!d.corpo||!d.corpo.length;
      html+=`<div class="clareza-par ${pendente?'pendente':''}" data-clareza-id="${esc(d.id)}">`;
      if(contraste)html+=`<div class="ce">${esc(contraste)}</div>`;
      html+=`<div class="cd">${esc(limparTextoDesejo(d.texto)||d.texto)}</div>`;
      html+=`<div class="dz-status">`;
      if(d.corpo&&d.corpo.length)html+=`<span class="dz-pill ok">2 ✓</span>`;else html+=`<span class="dz-pill pend">2 pendente</span>`;
      const abertos=(d.gravetos||[]).filter(g=>!g.solto).length;
      if(abertos)html+=`<span class="dz-pill pend">${abertos} ${abertos===1?'dúvida':'dúvidas'}</span>`;
      else if(d.gravetos&&d.gravetos.length)html+=`<span class="dz-pill ok">3 ✓</span>`;
      html+=`</div></div>`;
    });
    html+=`</div></details>`;
  });
  // vontades / sem área
  const idsArea=new Set(la.areas.map(a=>a.id));
  const outros=todos.filter(d=>!idsArea.has(d.area));
  if(outros.length){
    html+=`<details class="grupo-card" style="margin-bottom:8px"><summary><span class="grupo-nome">Outros</span><span class="grupo-badge">${outros.length}</span></summary><div class="grupo-conteudo">`;
    outros.forEach(d=>{
      html+=`<div class="clareza-par" data-clareza-id="${esc(d.id)}"><div class="cd">${esc(limparTextoDesejo(d.texto)||d.texto)}</div></div>`;
    });
    html+=`</div></details>`;
  }
  const arq=desejosArquivados();
  if(arq.length){
    html+=`<details class="grupo-card" style="margin-top:12px;opacity:.85"><summary><span class="grupo-nome">🍃 Soltos / arquivados</span><span class="grupo-badge">${arq.length}</span></summary><div class="grupo-conteudo">`;
    arq.forEach(d=>{
      html+=`<div class="clareza-par" style="opacity:.9" data-clareza-arq="${esc(d.id)}">`;
      html+=`<div class="cd">${esc(limparTextoDesejo(d.texto)||d.texto)}</div>`;
      if(d.soltoNoLugar)html+=`<div class="mut" style="font-size:11.5px;margin-top:4px">No lugar: ${esc(d.soltoNoLugar)}</div>`;
      html+=`<button class="btn" style="margin-top:6px;font-size:12px;padding:6px 10px" data-restaurar="${esc(d.id)}">Restaurar</button>`;
      html+=`</div>`;
    });
    html+=`</div></details>`;
  }
  box.innerHTML=html;
  box.querySelectorAll('[data-clareza-id]').forEach(el=>{
    const id=el.dataset.clarezaId;
    const abrir=()=>abrirDesejo(id);
    const menu=()=>{
      const d=(S.leiAtracao.desejos||[]).find(x=>x.id===id);if(!d)return;
      abrirClarezaMenu(d);
    };
    el.onclick=null;
    bindLongPress(el, menu, abrir, 550);
  });
  box.querySelectorAll('[data-restaurar]').forEach(b=>{
    b.onclick=e=>{
      e.stopPropagation();
      const d=(S.leiAtracao.desejos||[]).find(x=>x.id===b.dataset.restaurar);
      if(!d)return;
      d.arquivado=false;delete d.arquivadoEm;salva();renderAtracaoTudo();mostrarToast('Desejo de volta à lista');
    };
  });
}
function abrirClarezaMenu(d){
  $('cmNome').textContent=limparTextoDesejo(d.texto)||d.texto||'Desejo';
  const area=(S.leiAtracao.areas.find(a=>a.id===d.area)||{}).nome||'';
  $('cmInfo').textContent=area+(d.contrasteOrigem?(' · do contraste'):'');
  const c=$('cmBotoes');c.innerHTML='';
  const add=(rot,cls,fn)=>{const b=document.createElement('button');b.className='modal-btn '+cls;b.textContent=rot;b.onclick=()=>fecharOverlay($('clarezaMenuModal'),fn);c.appendChild(b);};
  add('✏️ Abrir / editar','prim',()=>abrirDesejo(d.id));
  add('📝 Renomear','sec',()=>{
    const v=prompt('O que eu quero', limparTextoDesejo(d.texto)||d.texto||'');
    if(v===null)return;
    const t=v.trim();if(!t)return;
    d.texto=t;salva();renderAtracaoTudo();mostrarToast('Atualizado ✓');
  });
  add('🗑️ Apagar','sec',()=>{
    confirmar('Apagar este desejo de vez?',()=>{
      S.leiAtracao.desejos=(S.leiAtracao.desejos||[]).filter(x=>x.id!==d.id);
      salva();renderAtracaoTudo();mostrarToast('Desejo apagado');
    },'Apagar');
  });
  add('Fechar','sec',()=>{});
  abrirOverlayTopo($('clarezaMenuModal'));
}
function renderContrastesEsperando(){
  const el=$('contrastesEsperando');if(!el)return;
  const cs=S.leiAtracao.contrastes||[];
  let html='<div class="ct-lista-card" id="listaContrastesCard">';
  html+='<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px">';
  html+='<div style="font-size:11px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:var(--b)">🪺 Contrastes</div>';
  html+=`<span class="mut" style="font-size:11px">${cs.length?cs.length+' aguardando':'lista vazia'}</span>`;
  html+='</div>';
  if(!cs.length){
    html+='<p class="mut" style="font-size:12.5px;line-height:1.55;margin:0">Nada aqui ainda. Toque em <b>＋ Contraste</b> quando algo te incomodar. Depois, do lado de cada um, você escreve o que quer.</p>';
  } else {
    html+='<p class="mut" style="font-size:12.5px;line-height:1.55;margin-bottom:10px">Ainda não virou "o que eu quero". Toque em <b>O que eu quero</b> ao lado de cada um.</p>';
    cs.forEach(c=>{
      const areaNome=(S.leiAtracao.areas.find(a=>a.id===c.area)||{}).nome||'';
      html+=`<div style="background:var(--surf-mid);border:1px solid var(--borda);border-radius:12px;padding:10px 12px;margin-bottom:8px">`;
      if(areaNome)html+=`<div style="font-size:10px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;color:var(--mut2);margin-bottom:4px">${esc(areaNome)}</div>`;
      html+=`<div style="font-size:13.5px;color:var(--txt);line-height:1.45;margin-bottom:8px"><span style="color:var(--mut2);font-size:11px;font-weight:700">Não quero:</span> ${esc(c.naoQuero)}</div>`;
      html+=`<div style="display:flex;gap:6px;flex-wrap:wrap">`;
      html+=`<button class="btn prim" data-ct-processar="${esc(c.id)}" style="flex:1;min-width:140px;font-size:12.5px;padding:8px 12px">✨ O que eu quero</button>`;
      html+=`<button class="btn fant" data-ct-apagar="${esc(c.id)}" style="font-size:12px">apagar</button>`;
      html+=`</div></div>`;
    });
  }
  html+='</div>';
  el.innerHTML=html;
  el.querySelectorAll('[data-ct-processar]').forEach(btn=>{
    btn.onclick=()=>abrirProcessarContraste(btn.dataset.ctProcessar);
  });
  el.querySelectorAll('[data-ct-apagar]').forEach(btn=>{
    btn.onclick=(e)=>{
      e.stopPropagation();
      const id=btn.dataset.ctApagar;
      S.leiAtracao.contrastes=(S.leiAtracao.contrastes||[]).filter(x=>x.id!==id);
      salva();renderAtracaoTudo();mostrarToast('Contraste removido');
    };
  });
}
let ctProcessando=null;
function abrirProcessarContraste(id){
  const c=(S.leiAtracao.contrastes||[]).find(x=>x.id===id);
  if(!c){avisar('Esse contraste já foi trabalhado.');return;}
  ctProcessando=id;
  const o=$('processarModal');
  $('prContrasteTxt').textContent=c.naoQuero;
  $('prClareza').value='';
  $('prArea').innerHTML=S.leiAtracao.areas.map(a=>`<option value="${esc(a.id)}">${esc(a.nome)}</option>`).join('');
  $('prArea').value=c.area||(S.leiAtracao.areas[0]&&S.leiAtracao.areas[0].id);
  abrirOverlay(o);
  setTimeout(()=>{const inp=$('prClareza');if(inp)inp.focus();},300);
}
function fecharProcessarContraste(){
  fecharOverlay($('processarModal'),()=>{ctProcessando=null;});
}

/* ============ PASSO 2 · DECLARAÇÕES ============ */
function renderDeclaracoesLista(){
  const box=$('declaracoesLista');if(!box)return;
  const todos=desejosAtivos();
  const ds=todos.filter(d=>d.corpo&&d.corpo.some(c=>(c.texto||'').trim()));
  const semCorpo=todos.filter(d=>!d.corpo||!d.corpo.some(c=>(c.texto||'').trim()));
  if(!todos.length){
    box.innerHTML='<div class="card mut" style="font-size:12.5px;line-height:1.55;text-align:center">Sem clareza ainda. Comece pelo Passo 1.</div>';
    return;
  }
  let html='';
  if(ds.length){
    html+=renderDeclaracaoTodosBloco();
  }
  if(semCorpo.length){
    html+=`<div class="mut" style="font-size:11px;letter-spacing:1.2px;text-transform:uppercase;font-weight:800;color:var(--aviso);margin-bottom:6px">Falta montar · ${semCorpo.length}</div>`;
    semCorpo.forEach(d=>{
      html+=`<div class="dz-card" data-decl-id="${esc(d.id)}"><div class="dz-txt">${esc(limparTextoDesejo(d.texto)||d.texto)}</div><span class="dz-badge-status pend">+ Montar declaração</span></div>`;
    });
  }
  if(ds.length){
    html+=`<div class="mut" style="font-size:11px;letter-spacing:1.2px;text-transform:uppercase;font-weight:800;color:var(--ok);margin:12px 0 6px">Com declaração · ${ds.length}</div>`;
    ds.forEach(d=>{
      const n=(d.corpo||[]).filter(c=>(c.texto||'').trim()).length;
      const s=d.sensacao==='boa'?'✓ fez bem':d.sensacao==='duvida'?'dúvida — reformular':'sentir de novo';
      const cls=d.sensacao==='boa'?'ok':d.sensacao==='duvida'?'pend':'';
      html+=`<div class="dz-card" data-decl-id="${esc(d.id)}"><div class="dz-txt">${esc(limparTextoDesejo(d.texto)||d.texto)}</div><span class="dz-badge-status ${cls}">${n} ${n===1?'frase':'frases'} · ${s}</span></div>`;
    });
  }
  box.innerHTML=html;
  box.querySelectorAll('[data-decl-id]').forEach(el=>{
    el.onclick=()=>abrirDesejo(el.dataset.declId,2);
  });
}

/* ============ PASSO 3 · PERMITIR ============ */
function renderPermitirLista(){
  const box=$('permitirLista');if(!box)return;
  const ds=desejosAtivos();
  const comDuvidas=ds.filter(d=>(d.gravetos||[]).some(g=>!g.solto));
  const livres=ds.filter(d=>(d.gravetos||[]).length&&!(d.gravetos||[]).some(g=>!g.solto));
  const semDuvidas=ds.filter(d=>!(d.gravetos||[]).length);
  if(!ds.length){
    box.innerHTML='<div class="card mut" style="font-size:12.5px;line-height:1.55;text-align:center">Nenhum desejo ainda — use a <b>dúvida rápida</b> acima, ou comece pela Clareza. A dúvida não precisa esperar declaração.</div>';
    return;
  }
  let html='';
  if(comDuvidas.length){
    html+=`<div class="mut" style="font-size:11px;letter-spacing:1.2px;text-transform:uppercase;font-weight:800;color:var(--aviso);margin-bottom:6px">Com dúvida aberta</div>`;
    comDuvidas.forEach(d=>{
      const n=d.gravetos.filter(g=>!g.solto).length;
      html+=`<div class="dz-card" data-perm-id="${esc(d.id)}"><div class="dz-txt">${esc(limparTextoDesejo(d.texto)||d.texto)}</div><span class="dz-badge-status pend">${n} ${n===1?'graveto':'gravetos'}</span></div>`;
    });
  }
  if(semDuvidas.length){
    html+=`<div class="mut" style="font-size:11px;letter-spacing:1.2px;text-transform:uppercase;font-weight:800;color:var(--mut2);margin:12px 0 6px">Sem dúvidas registradas</div>`;
    semDuvidas.forEach(d=>{
      html+=`<div class="dz-card" data-perm-id="${esc(d.id)}"><div class="dz-txt">${esc(limparTextoDesejo(d.texto)||d.texto)}</div><span class="dz-badge-status">+ anotar dúvida</span></div>`;
    });
  }
  if(livres.length){
    html+=`<div class="mut" style="font-size:11px;letter-spacing:1.2px;text-transform:uppercase;font-weight:800;color:var(--ok);margin:12px 0 6px">Sem dúvidas abertas ✓</div>`;
    livres.forEach(d=>{
      html+=`<div class="dz-card" data-perm-id="${esc(d.id)}"><div class="dz-txt">${esc(limparTextoDesejo(d.texto)||d.texto)}</div><span class="dz-badge-status ok">permitindo</span></div>`;
    });
  }
  box.innerHTML=html;
  box.querySelectorAll('[data-perm-id]').forEach(el=>{
    el.onclick=()=>abrirDesejo(el.dataset.permId,3);
  });
}


/* ============ Atração: menu em botões + hábito infinitivo ============ */
function paraInfinitivoSugestao(t){
  let s=String(t||'').trim();
  if(!s)return s;
  // já parece infinitivo no começo → só capitaliza
  if(/^[a-záàâãéêíóôõúç]+(?:ar|er|ir|or)\b/i.test(s) && !/^(eu|você|voce)\s+/i.test(s)){
    return s.charAt(0).toUpperCase()+s.slice(1);
  }
  s=s.replace(/^(eu|você|voce|a gente)\s+/i,'');
  // irregular 1ª pessoa presente / gerúndios comuns
  const irreg1={
    'faço':'fazer','sou':'ser','estou':'estar','tenho':'ter','vou':'ir','venho':'vir',
    'digo':'dizer','trago':'trazer','ponho':'por','sei':'saber','quero':'querer','posso':'poder',
    'vejo':'ver','leio':'ler','dou':'dar','caibo':'caber','ouço':'ouvir','peço':'pedir',
    'durmo':'dormir','subo':'subir','sinto':'sentir','finjo':'fingir','sirvo':'servir',
    'consigo':'conseguir','prefiro':'preferir','divirto':'divertir','minto':'mentir',
    'cobro':'cobrar','meço':'medir','perco':'perder','valho':'valer','ponho':'por',
    'trago':'trazer','mantenho':'manter','detenho':'deter','retenho':'reter',
    'organizo':'organizar','valorizo':'valorizar','respeito':'respeitar','aceito':'aceitar',
    'permito':'permitir','decido':'decidir','escolho':'escolher','mudo':'mudar',
    'cuido':'cuidar','zelo':'zelar','amo':'amar','crio':'criar','protejo':'proteger',
    'educo':'educar','construo':'construir','melhoro':'melhorar','ganho':'ganhar',
    'trabalho':'trabalhar','descanso':'descansar','caminho':'caminhar','danço':'dançar',
    'canto':'cantar','escrevo':'escrever','falo':'falar','ouço':'ouvir','aceito':'aceitar',
    'agradeço':'agradecer','honro':'honrar','nutro':'nutrir','alimento':'alimentar',
    'fortaleço':'fortalecer','desenvolvo':'desenvolver','expando':'expandir','abro':'abrir',
    'fecho':'fechar','guardo':'guardar','mantenho':'manter','arrumo':'arrumar',
    'varro':'varrer','lavo':'lavar','pago':'pagar','economizo':'economizar','investo':'investir',
    'gosto':'gostar','celebro':'celebrar','perdoo':'perdoar','medito':'meditar',
    'estudo':'estudar','limpo':'limpar','atraio':'atrair','vivo':'viver','penso':'pensar',
    'confio':'confiar','bebo':'beber','como':'comer','parto':'partir','divido':'dividir',
    'recebo':'receber','prometo':'prometer','aprendo':'aprender','entendo':'entender',
    'respondo':'responder','dependo':'depender','ofereço':'oferecer','mereço':'merecer',
    'conheço':'conhecer','nasço':'nascer','cresço':'crescer','esqueci':'esquecer',
    'lembro':'lembrar','espero':'esperar','preciso':'precisar','uso':'usar','parto':'partir'
  };
  // 1ª palavra conjugada → infinitivo
  s=s.replace(/^([a-záàâãéêíóôõúç]+)\b/i,(m)=>{
    const low=m.toLowerCase();
    if(irreg1[low]) return irreg1[low];
    // regular -ar: arrumo→arrumar (termina em o)
    if(/[aeiouáéíóú]o$/i.test(low)===false && /o$/i.test(low) && low.length>3){
      // default: tratar como -ar (mais comum no app)
      return low.slice(0,-1)+'ar';
    }
    return m;
  });
  // condicional: varreria→varrer, faria→fazer
  s=s.replace(/\b([a-záàâãéêíóôõúç]+?)(aria|eria|iria)\b/gi,(m,stem,suf)=>{
    const low=m.toLowerCase();
    const irreg={
      'faria':'fazer','diria':'dizer','traria':'trazer','viria':'vir',
      'teria':'ter','poria':'por','seria':'ser','estaria':'estar',
      'iria':'ir','veria':'ver','poderia':'poder','gostaria':'gostar'
    };
    if(irreg[low]) return irreg[low];
    if(/aria$/i.test(suf)) return stem+'ar';
    if(/eria$/i.test(suf)) return stem+'er';
    if(/iria$/i.test(suf)) return stem+'ir';
    return m;
  });
  // futuro: varrerei→varrer
  s=s.replace(/\b([a-záàâãéêíóôõúç]+?)(arei|erei|irei)\b/gi,(m,stem,suf)=>{
    if(/arei$/i.test(suf)) return stem+'ar';
    if(/erei$/i.test(suf)) return stem+'er';
    if(/irei$/i.test(suf)) return stem+'ir';
    return m;
  });
  // gerúndio solto no começo: "arrumando a casa" → "arrumar a casa" (heurística leve)
  s=s.replace(/^([a-záàâãéêíóôõúç]+?)(ando|endo|indo)\b/i,(m,stem,suf)=>{
    if(/ando$/i.test(suf)) return stem+'ar';
    if(/endo$/i.test(suf)) return stem+'er';
    if(/indo$/i.test(suf)) return stem+'ir';
    return m;
  });
  s=s.replace(/\s+/g,' ').trim();
  if(s) s=s.charAt(0).toUpperCase()+s.slice(1);
  return s;
}
let habSugCtx=null;
function abrirHabitoSugestao(d,textoBruto){
  habSugCtx={d,textoBruto};
  const sug=paraInfinitivoSugestao(textoBruto||'');
  $('habSugNome').value=sug;
  const boxNova=$('habNovaCatBox');
  if(boxNova)boxNova.style.display='none';
  if($('habNovaCatNome'))$('habNovaCatNome').value='';
  if($('habNovaCatEmoji'))$('habNovaCatEmoji').value='✨';
  let escolhido=(d&&d.area==='bemestar')?'toque':((d&&d.area==='patrimonio')?'servico':((d&&d.area==='carreira')?'essencial':'outros'));
  const renderCats=()=>{
    const cats=$('habSugCats');if(!cats)return;
    const lista=todosGrupos();
    cats.innerHTML=lista.map(g=>`<button type="button" class="chip" data-hab-cat="${esc(g.id)}">${g.emoji||'✨'} ${esc(g.nome)}</button>`).join('')
      +`<button type="button" class="chip" data-hab-cat="__nova">＋ Nova categoria</button>`;
    const mark=()=>{cats.querySelectorAll('.chip').forEach(c=>c.classList.toggle('on',c.dataset.habCat===escolhido));};
    mark();
    cats.querySelectorAll('.chip').forEach(c=>{
      c.onclick=()=>{
        if(c.dataset.habCat==='__nova'){
          escolhido='__nova';
          mark();
          if(boxNova){boxNova.style.display='block';const n=$('habNovaCatNome');if(n)n.focus();}
          return;
        }
        escolhido=c.dataset.habCat;
        if(boxNova)boxNova.style.display='none';
        mark();
      };
    });
  };
  renderCats();
  habSugCtx.grupo=()=>{
    if(escolhido==='__nova'){
      const nome=(($('habNovaCatNome')||{}).value||'').trim();
      const emoji=(($('habNovaCatEmoji')||{}).value||'✨').trim()||'✨';
      if(!nome)return 'outros';
      const id='g'+Date.now().toString(36);
      if(!Array.isArray(S.gruposCustom))S.gruposCustom=[];
      S.gruposCustom.push({id,emoji,nome});
      salva();
      escolhido=id;
      return id;
    }
    return escolhido||'outros';
  };
  habSugCtx._renderCats=renderCats;
  const o=$('habitoSugModal');
  abrirOverlay(o);
  setTimeout(()=>{const inp=$('habSugNome');if(inp){inp.focus();inp.select();}},280);
}
$('habNovaCatOk')&&($('habNovaCatOk').onclick=()=>{
  const nome=(($('habNovaCatNome')||{}).value||'').trim();
  if(!nome){avisar('Dê um nome à categoria.');return;}
  const emoji=(($('habNovaCatEmoji')||{}).value||'✨').trim()||'✨';
  const id='g'+Date.now().toString(36);
  if(!Array.isArray(S.gruposCustom))S.gruposCustom=[];
  S.gruposCustom.push({id,emoji,nome});
  salva();
  if(habSugCtx){
    // seleciona a nova
    const boxNova=$('habNovaCatBox');if(boxNova)boxNova.style.display='none';
    if(habSugCtx._renderCats){
      // force re-render and select - use temporary
      const cats=$('habSugCats');
      if(cats){
        const lista=todosGrupos();
        cats.innerHTML=lista.map(g=>`<button type="button" class="chip ${g.id===id?'on':''}" data-hab-cat="${esc(g.id)}">${g.emoji||'✨'} ${esc(g.nome)}</button>`).join('')
          +`<button type="button" class="chip" data-hab-cat="__nova">＋ Nova categoria</button>`;
        let escolhido=id;
        habSugCtx.grupo=()=>escolhido;
        cats.querySelectorAll('.chip').forEach(c=>{
          c.onclick=()=>{
            if(c.dataset.habCat==='__nova'){
              escolhido='__nova';
              cats.querySelectorAll('.chip').forEach(x=>x.classList.toggle('on',x.dataset.habCat==='__nova'));
              if($('habNovaCatBox'))$('habNovaCatBox').style.display='block';
              return;
            }
            escolhido=c.dataset.habCat;
            cats.querySelectorAll('.chip').forEach(x=>x.classList.toggle('on',x.dataset.habCat===escolhido));
            if($('habNovaCatBox'))$('habNovaCatBox').style.display='none';
            habSugCtx.grupo=()=>escolhido;
          };
        });
      }
    }
  }
  mostrarToast('Categoria criada ✓');
});

function fecharHabitoSugestao(){
  fecharOverlay($('habitoSugModal'),()=>{habSugCtx=null;});
}
$('habSugCancelar')&&($('habSugCancelar').onclick=fecharHabitoSugestao);
$('habSugConfirmar')&&($('habSugConfirmar').onclick=()=>{
  if(!habSugCtx||!habSugCtx.d)return;
  const nome=($('habSugNome').value||'').trim();
  if(!nome){avisar('Escreva o nome do hábito.');return;}
  const grupo=habSugCtx.grupo?habSugCtx.grupo():'outros';
  if(grupo==='__nova'){avisar('Crie ou escolha a categoria antes.');return;}
  const d=habSugCtx.d;
  if(S.habitos.some(h=>h.nome===nome)){avisar('Você já tem um hábito com esse nome. 💛');return;}
  // trava de 3 dias: guarda sugestão COM categoria escolhida
  if(S.habitos.some(h=>!h.pausado) && !habitoLiberado()){
    const dias=diasAteLiberar();
    if(!Array.isArray(S.habitosSugestoes))S.habitosSugestoes=[];
    S.habitosSugestoes=S.habitosSugestoes.filter(s=>s.texto!==nome);
    S.habitosSugestoes.push({
      id:'hs'+Date.now().toString(36),
      texto:nome,
      desejoId:d.id,
      grupo,
      criadoEm:hoje()
    });
    /* marca o menor passo / desejo para sumir da lista "virar hábito" */
    if(d){
      if(!Array.isArray(d.menorPassos))d.menorPassos=[];
      d.menorPassos.forEach(mp=>{
        if((mp.texto||'').trim()===nome || (mp.texto||'').trim().toLowerCase()===nome.toLowerCase()){
          mp.naFila=true;mp.textoFila=nome;
        }
      });
      /* se veio do texto do desejo sem menor passo, cria um marcador */
      if(!d.menorPassos.some(mp=>mp.naFila&&(mp.textoFila===nome||mp.texto===nome))){
        d.menorPassos.push({id:'mp'+Date.now().toString(36),texto:nome,criadoEm:hoje(),naFila:true,textoFila:nome});
      }
      if(d.menorPasso&&((d.menorPasso.texto||'')===nome||(d.menorPasso.texto||'').toLowerCase()===nome.toLowerCase())){
        d.menorPasso.naFila=true;d.menorPasso.textoFila=nome;
      }
    }
    salva();
    fecharHabitoSugestao();
    avisar('Ainda faltam '+dias+' dia'+(dias===1?'':'s')+' para o próximo hábito.\n\nSugestão guardada na categoria escolhida. Quando liberar, está em Gerenciar hábitos.');
    renderHabitos();
    renderHoje();
    try{if(typeof renderMenorPassoHoje==='function')renderMenorPassoHoje();}catch(e){}
    try{if(typeof dzRender==='function')dzRender();}catch(e){}
    return;
  }
  criarHabitoDeDesejo(d,nome,grupo);fecharHabitoSugestao();
});

function atualizarMetasAtracao(){
  const todos=desejosAtivos();
  const cs=S.leiAtracao.contrastes||[];
  const comCorpo=todos.filter(d=>d.corpo&&d.corpo.some(c=>(c.texto||'').trim()));
  const duvidas=todos.reduce((n,d)=>n+(d.gravetos||[]).filter(g=>!g.solto).length,0);
  const elC=$('metaClareza');if(elC) elC.textContent=cs.length? (cs.length+' contraste(s) aguardando') : (todos.length? todos.length+' desejo(s)' : 'Comece por aqui');
  const elD=$('metaDeclaracao');if(elD) elD.textContent=comCorpo.length? (comCorpo.length+' com declaração') : (todos.length? 'Falta montar' : 'Depois da clareza');
  const elP=$('metaPermitir');if(elP) elP.textContent=duvidas? (duvidas+' dúvida(s) aberta(s)') : 'Pode anotar a qualquer momento';
}
function abrirSecaoAtracao(sec){
  const map={clareza:'secClarezaContent',declaracao:'secDeclaracaoContent',permitir:'secPermitirContent'};
  const tit={clareza:'Clareza',declaracao:'Declaração de desejo',permitir:'Permissão'};
  const src=$(map[sec]);if(!src)return;
  renderAtracaoTudo();
  if(sec==='permitir') preencherSelectPermDuvida();
  const body=$('atracaoSecaoBody');
  body.innerHTML='<div class="rel-titulo" style="margin-bottom:8px">'+tit[sec]+'</div>';
  // move nodes: clone content by innerHTML to keep ids working — re-bind after
  body.innerHTML+='<div id="atracaoSecaoInner">'+src.innerHTML+'</div>';
  // hide originals' interactive duplicates by emptying? Better: keep originals hidden and sync back on close
  // Actually use the real nodes: appendChild moves them
  body.innerHTML='<div class="rel-titulo" style="margin-bottom:8px">'+tit[sec]+'</div>';
  const wrap=document.createElement('div');wrap.id='atracaoSecaoInner';
  body.appendChild(wrap);
  while(src.firstChild) wrap.appendChild(src.firstChild);
  const o=$('atracaoSecaoModal');
  abrirOverlay(o);
  o.dataset.sec=sec;
  // rebind section-specific
  if(sec==='clareza'){
    const b1=$('btnNovoContraste');
    if(b1)b1.onclick=()=>{
      const o=$('contrasteModal');$('ctNaoQuero').value='';
      $('ctArea').innerHTML=S.leiAtracao.areas.map(a=>`<option value="${esc(a.id)}">${esc(a.nome)}</option>`).join('');
      const bem=S.leiAtracao.areas.find(a=>a.id==='bemestar');$('ctArea').value=bem?bem.id:S.leiAtracao.areas[0].id;
      abrirOverlay(o);
    };
    const b2=$('btnVerContrastes');
    if(b2)b2.onclick=()=>abrirListaContrastesPopup();
    const b3=$('btnNovoDesejoDireto');
    if(b3)b3.onclick=abrirDesejoDireto;
  }
  if(sec==='permitir'){
    preencherSelectPermDuvida();
    const btn=$('btnPermDuvidaRapida');
    if(btn)btn.onclick=salvarDuvidaRapida;
  }
  // re-render lists into moved containers
  renderAtracaoTudo();
  if(sec==='permitir') preencherSelectPermDuvida();
}
function fecharSecaoAtracao(){
  const o=$('atracaoSecaoModal');
  const sec=o.dataset.sec;
  const map={clareza:'secClarezaContent',declaracao:'secDeclaracaoContent',permitir:'secPermitirContent'};
  const src=$(map[sec]);
  const wrap=$('atracaoSecaoInner');
  if(src&&wrap){while(wrap.firstChild) src.appendChild(wrap.firstChild);}
  fecharOverlay(o,()=>{renderAtracaoTudo();atualizarMetasAtracao();});
}
function preencherSelectPermDuvida(){
  const sel=$('permDuvidaDesejo');if(!sel)return;
  const todos=desejosAtivos();
  let html='<option value="">Dúvida solta (sem desejo)</option>';
  todos.forEach(d=>{html+=`<option value="${esc(d.id)}">${esc(limparTextoDesejo(d.texto)||d.texto||'desejo')}</option>`;});
  sel.innerHTML=html;
}
function salvarDuvidaRapida(){
  const txt=($('permDuvidaRapida')||{}).value;if(!txt||!txt.trim()){avisar('Escreva a dúvida.');return;}
  const idDes=($('permDuvidaDesejo')||{}).value;
  let d;
  if(idDes){d=(S.leiAtracao.desejos||[]).find(x=>x.id===idDes);}
  if(!d){
    // criar desejo-placeholder solto em vontades
    d=novoDesejo('vontades','Dúvida solta');
    d.texto='Dúvida solta';
    S.leiAtracao.desejos.push(d);
  }
  if(!Array.isArray(d.gravetos))d.gravetos=[];
  d.gravetos.push({id:'g'+Date.now().toString(36),duvida:txt.trim(),alivio:'',solto:false,criadoEm:hoje()});
  salva();
  if($('permDuvidaRapida'))$('permDuvidaRapida').value='';
  mostrarToast('Dúvida anotada ✓');
  renderPermitirLista();
  atualizarMetasAtracao();
}

function coletarPermissoesLivro(){
  const out=[];
  (S.leiAtracao.desejos||[]).forEach(d=>{
    const desejoTxt=limparTextoDesejo(d.texto)||d.texto||'';
    (d.gravetos||[]).forEach(g=>{
      const frase=(g.alivio||'').trim();
      if(!frase)return;
      out.push({
        id:g.id,
        desejoId:d.id,
        frase,
        duvida:(g.duvida||'').trim(),
        solto:!!g.solto,
        data:g.soltoEm||g.criadoEm||'',
        desejo:desejoTxt,
        arquivado:!!d.arquivado
      });
    });
  });
  /* mais recentes primeiro */
  out.sort((a,b)=>(b.data||'').localeCompare(a.data||''));
  return out;
}
function renderLivroPermissoes(){
  const box=$('livroPermissoesLista');if(!box)return;
  const lista=coletarPermissoesLivro().filter(x=>!x.arquivado);
  if(!lista.length){
    box.innerHTML='<div class="lp-vazio">Ainda vazio. Quando você guardar uma frase de permissão no passo 3, ela aparece aqui.</div>';
    return;
  }
  box.innerHTML=lista.map(p=>{
    let data='';
    if(p.data){
      try{data=new Date(p.data+'T12:00:00').toLocaleDateString('pt-BR',{day:'numeric',month:'short'});}catch(e){data=p.data;}
    }
    const metaParts=[];
    if(p.desejo)metaParts.push('💫 '+p.desejo);
    if(data)metaParts.push(data);
    if(p.solto)metaParts.push('guardada');
    const trava=p.duvida&&p.duvida!=='(permissão direta)'?`<div class="lp-trava">Antes: “${esc(p.duvida)}”</div>`:'';
    return`<div class="lp-item" data-lp-id="${esc(p.id)}" data-lp-desejo="${esc(p.desejoId)}">
      <div class="lp-frase">“${esc(p.frase)}”</div>
      ${trava}
      <div class="lp-meta">${esc(metaParts.join(' · '))}</div>
    </div>`;
  }).join('');
  box.querySelectorAll('[data-lp-desejo]').forEach(el=>{
    el.style.cursor='pointer';
    el.onclick=()=>abrirDesejo(el.dataset.lpDesejo,3);
  });
}
function renderAtracaoTudo(){
  try{renderSessoesAtracao();}catch(e){console.warn('sessoes',e);}
  renderContrastesEsperando();
  renderClarezaLista();
  renderDeclaracoesLista();
  renderPermitirLista();
  renderLivroPermissoes();
  atualizarMetasAtracao();
}

/* ============ ACONTECENDO + ESPELHO ============ */
function renderAcontecendo(){
  const box=$('acontecendoBox');if(!box)return;
  const list=(S.acontecendo||[]).slice().sort((a,b)=>(b.data||'').localeCompare(a.data||''));
  if(!list.length){
    box.innerHTML='<div class="card mut" style="font-size:12.5px;line-height:1.5;text-align:center">Um lugar pra escrever sem revisar. Só seu.</div>';
    return;
  }
  box.innerHTML=list.map(a=>{
    const d=new Date(a.data+'T12:00:00').toLocaleDateString('pt-BR',{day:'numeric',month:'long',year:'numeric'});
    const fez=frasesJaFeitas(a.texto);
    const espelhoHTML=fez.length?`<div class="espelho-bloco"><div class="espelho-tit">✨ O que você já fez</div>${fez.map(f=>`<div class="espelho-frase">${esc(f)}</div>`).join('')}</div>`:'';
    return`<div class="acontecendo-item">
      <div class="data-linha">${esc(d)}</div>
      <div class="corpo">${esc(a.texto)}</div>
      ${espelhoHTML}
      <button class="btn fant" data-ac-rm="${esc(a.id)}" style="font-size:11px;padding:2px 6px;margin-top:8px">apagar</button>
    </div>`;
  }).join('');
  box.querySelectorAll('[data-ac-rm]').forEach(b=>{
    b.onclick=()=>{const id=b.dataset.acRm;
      confirmar('Apagar essa anotação?',()=>{S.acontecendo=S.acontecendo.filter(x=>x.id!==id);salva();renderAcontecendo();},'Apagar');
    };
  });
}

/* ============ TEMAS RECORRENTES ============ */
/* ============ MODAL DE DESEJO ============ */
let dzAtual=null;
let dzPassoInicial=1;
const dzFind=()=>S.leiAtracao.desejos.find(d=>d.id===dzAtual);
const DZ_ETAPAS=[{k:'id',t:'🌱 Clareza',alvo:'dzPasso1'},{k:'decl',t:'💬 Declaração',alvo:'dzPasso2'},{k:'perm',t:'🪺 Permissão',alvo:'dzPasso3'}];
function dzEstagio(d){
  if(!d.corpo||!d.corpo.length)return{k:'id'};
  const abertos=(d.gravetos||[]).filter(g=>!g.solto).length;
  if(abertos>0)return{k:'perm'};
  return{k:'decl'};
}

function dzAbrirPasso(n){
  const ids=['dzPasso1','dzPasso2','dzPasso3'];
  ids.forEach((id,i)=>{
    const el=$(id);if(!el)return;
    el.open=(i===(n-1));
    el.classList.toggle('dz-acc-on', el.open);
  });
  dzPassoInicial=n;
}

function dzTrilha(){
  const d=dzFind();if(!d)return;
  const k=dzEstagio(d).k;
  const idx=DZ_ETAPAS.findIndex(e=>e.k===k);
  const aberto=typeof dzPassoInicial==='number'?dzPassoInicial-1:idx;
  $('dzTrilha').innerHTML=DZ_ETAPAS.map((e,j)=>`<span class="${j<idx?'ok':j===idx?'on':''}" data-passo="${j+1}">${e.t}</span>`).join('');
  document.querySelectorAll('#dzTrilha [data-passo]').forEach(s=>{
    s.onclick=()=>dzAbrirPasso(+s.dataset.passo);
  });
  // accordion: só o passo atual aberto
  dzAbrirPasso((typeof dzPassoInicial==='number'?dzPassoInicial:idx+1)||1);
  // ao expandir um details manualmente, fecha os outros
  ['dzPasso1','dzPasso2','dzPasso3'].forEach((id,i)=>{
    const el=$(id);if(!el)return;
    el.ontoggle=()=>{
      if(el.open){
        dzPassoInicial=i+1;
        ['dzPasso1','dzPasso2','dzPasso3'].forEach((oid,j)=>{if(oid!==id){const o=$(oid);if(o)o.open=false;}});
      }
    };
  });
}
function dzSalvaCampos(){
  const d=dzFind();if(!d)return;
  const t=$('dzTexto');
  if(t){const v=limparTextoDesejo(t.value)||t.value.trim();if(v&&v!==d.texto){d.texto=v;salva();}}
}
function renderCorpoCorpo(d){
  const chaves=d.corpo.map(c=>c.k);
  const modelos=MODELOS_CORPO.filter(m=>!m.oculto&&!chaves.includes(m.k));
  let html='<div class="corpo-lista">';
  d.corpo.forEach((c,i)=>{
    const mod=MODELOS_CORPO.find(m=>m.k===c.k);
    if(!mod)return;
    let corpoTxt=limparTextoDesejo(c.texto)||c.texto||'…';corpoTxt=corpoTxt.charAt(0).toLowerCase()+corpoTxt.slice(1);
    html+=`<div class="corpo-item"><span class="cp-txt"><b style="color:var(--b)">${esc(mod.pre)}</b> ${esc(corpoTxt)}</span><button class="cp-rm" data-cp-rm="${i}" title="remover">×</button></div>`;
  });
  html+='</div>';
  if(modelos.length){
    html+='<div class="corpo-modelos">';
    modelos.forEach(m=>{
      html+=`<button class="corpo-add" data-cp-add="${m.k}">+ ${esc(m.pre)}</button>`;
    });
    html+='</div>';
  }
  html+='<div class="mut dz-dica" style="margin-top:8px">Toque num prefixo: a frase da clareza entra sozinha. Toque nela se quiser ajustar. Use quantas quiser — se soar falso, apague.</div>';
  return html;
}
function montarDeclaracao(d){
  const nucleo=nucleoParaUsar(d);
  const partes=[ABERTURA_FIXA(nucleo)];
  (d.corpo||[]).forEach(c=>{
    const mod=MODELOS_CORPO.find(m=>m.k===c.k);
    let corpoTxt=limparTextoDesejo(c.texto)||'';
    if(corpoTxt) corpoTxt=corpoTxt.charAt(0).toLowerCase()+corpoTxt.slice(1);
    if(mod && corpoTxt)partes.push(`${mod.pre} ${corpoTxt}.`);
  });
  partes.push(FECHAMENTO_FIXO);
  return partes;
}
const ABERTURA_TODOS=`Eu estou em processo de ter realizações em todas as áreas da minha vida, do meu jeito e no meu tempo.`;
function montarDeclaracaoTodos(){
  const ds=desejosAtivos().filter(d=>d.corpo&&d.corpo.some(c=>limparTextoDesejo(c.texto)));
  if(!ds.length)return null;
  const partes=[ABERTURA_TODOS];
  ds.forEach(d=>{
    (d.corpo||[]).forEach(c=>{
      const mod=MODELOS_CORPO.find(m=>m.k===c.k);
      let corpoTxt=limparTextoDesejo(c.texto)||'';
      if(corpoTxt) corpoTxt=corpoTxt.charAt(0).toLowerCase()+corpoTxt.slice(1);
      if(mod && corpoTxt)partes.push(`${mod.pre} ${corpoTxt}.`);
    });
  });
  partes.push(FECHAMENTO_FIXO);
  return partes;
}
function renderDeclaracaoTodosBloco(){
  const partes=montarDeclaracaoTodos();
  if(!partes)return '';
  return`<div class="declaracao-montada" style="margin-bottom:14px"><span class="dm-lb">Declaração completa · todos os desejos</span>${partes.map(p=>`<div style="margin-bottom:8px">${p}</div>`).join('')}</div>`;
}
function renderImpedimento(g){
  const temPorque=/porque/i.test(g.duvida);
  const destacada=esc(g.duvida).replace(/porque/gi,'<b>porque</b>');
  if(g.solto){
    return`<div class="dz-grav solto">
      <div class="dz-gt">🪵 ${destacada}</div>
      <div class="mut" style="font-size:11px;margin:6px 0 4px;font-weight:700;letter-spacing:.5px;text-transform:uppercase">Frase que você guardou</div>
      <div class="dz-perm-live dz-aliv" contenteditable="true" data-gid="${esc(g.id)}" data-ph="Edite se quiser…">${esc(g.alivio||'')}</div>
      <div class="modal-botoes" style="margin-top:8px">
        <button class="modal-btn sec" data-grem="${esc(g.id)}">Apagar</button>
        <button class="modal-btn sec" data-greabrir="${esc(g.id)}">Ainda me trava</button>
      </div>
    </div>`;
  }
  const sug=sugerirPermissoes(g.duvida);
  const botoesSug=sug.frases.map(f=>`<button class="dz-sug" data-sug-frase="${esc(f)}" data-gid="${esc(g.id)}"><span class="g">em terceira pessoa</span>${esc(f)}</button>`).join('');
  const ajuda=temPorque?`<div class="porque-marca"><b>Você disse "porque".</b> Achou uma crença limitante. Tente achar outras pessoas que já fizeram o que você quer.</div>`:'';
  const pergPessoa=`<div class="perg-pessoa"><div class="pp-tit">Pra aliviar a dúvida</div>Pense em quem já vive o que você quer. Quantas pessoas, só hoje? E na última semana? E no último ano?<div class="pessoa-aviso">Escreva sobre elas, não sobre você: isso costuma pesar menos.</div></div>`;
  const outras=`<div style="margin-top:10px;padding-top:10px;border-top:1px dashed var(--borda)">
    <div class="dz-sug-tit">Outras ferramentas</div>
    <div class="mut" style="font-size:11px;line-height:1.45;margin-bottom:6px">Não são Declaração de Permissão, mas ajudam em momentos diferentes.</div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      <button class="dz-chip" data-outra-frase="Estou no processo de " data-gid="${esc(g.id)}">Estou no processo de...</button>
      <button class="dz-chip" data-outra-frase="Muitas coisas podem acontecer para " data-gid="${esc(g.id)}">Muitas coisas podem acontecer...</button>
    </div>
    <div class="mut" style="font-size:10.5px;line-height:1.45;margin-top:6px;font-style:italic">"Estou no processo de..." para quando você foca no que ainda não tem. "Muitas coisas podem acontecer..." para quando a espera te deixa impaciente.</div>
  </div>`;
  const alivioAtual=esc(g.alivio||'');
  return`<div class="dz-grav">
    <div class="dz-gt">🪵 ${destacada}</div>
    ${ajuda}
    ${pergPessoa}
    <div class="dz-dica" style="margin:8px 0 6px;font-weight:700;color:var(--txt)">Sua Declaração de Permissão</div>
    <div class="dz-duvida-eco">“${destacada}”</div>
    <div class="dz-sug-bloco">
      <div class="dz-sug-tit">Sugestões · toque pra usar, toque de novo pra editar</div>
      ${botoesSug}
    </div>
    ${outras}
    <div class="mut" style="font-size:11px;margin:8px 0 4px;font-weight:700;letter-spacing:.5px;text-transform:uppercase">Sua frase (edite aqui)</div>
    <div class="dz-perm-live dz-aliv" contenteditable="true" data-gid="${esc(g.id)}" data-ph="Toque numa sugestão ou escreva aqui…">${alivioAtual}</div>
    <div class="modal-botoes" style="margin-top:8px">
      <button class="modal-btn sec" data-grem="${esc(g.id)}">Apagar</button>
      <button class="modal-btn prim" data-gsolta="${esc(g.id)}">Guardar essa frase</button>
    </div>
  </div>`;
}
function renderMenorPasso(d){
  if(!Array.isArray(d.menorPassos))d.menorPassos=[];
  // sync legacy
  if(d.menorPasso&&d.menorPasso.texto&&!d.menorPassos.some(x=>x.texto===d.menorPasso.texto)){
    d.menorPassos.push({id:'mp'+Date.now().toString(36),texto:d.menorPasso.texto,criadoEm:d.menorPasso.criadoEm||hoje(),sugestao:d.menorPasso.sugestao||''});
  }
  const temHabitoLigado=(d.habitoVinculado && S.habitos.some(h=>h.id===d.habitoVinculado));
  const hab=temHabitoLigado?S.habitos.find(h=>h.id===d.habitoVinculado):null;
  let html=`<div class="dz-menor-passo">
    <div class="tt">🌱 Do desejo ao hábito</div>
    <div class="mut" style="font-size:12.5px;line-height:1.55;margin-bottom:10px">“${esc(limparTextoDesejo(d.texto)||d.texto||'esse desejo')}” é a direção. Antes de anotar, deixa as perguntas guiarem.</div>`;
  if(temHabitoLigado&&hab){
    html+=`<div class="dz-menor-salvo"><span class="data">hábito</span>${esc(hab.emoji||'🌱')} ${esc(hab.nome)}</div>`;
  }
  html+=`<div class="perg-pessoa" style="margin:0 0 12px">
      <div class="pp-tit">Perguntas pra concretizar</div>
      <ol style="margin:6px 0 0 18px;padding:0;font-size:12.5px;line-height:1.55;color:var(--txt)">
        <li>Se isso estivesse resolvido amanhã, o que mudaria na sua rotina?</li>
        <li>Qual a menor ação física (5–15 min) que aproxima isso?</li>
        <li>Dá pra fazer essa ação ainda esta semana, sem depender de ninguém?</li>
      </ol>
    </div>`;
  if(d.menorPassos.length){
    html+=`<div class="mut" style="font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;margin:4px 0 6px">Suas ações</div>`;
    d.menorPassos.forEach((mp,i)=>{
      const naFila=!!mp.naFila||(S.habitosSugestoes||[]).some(s=>s.desejoId===d.id&&(s.texto===mp.texto||s.texto===mp.textoFila));
      const jaHabito=(S.habitos||[]).some(h=>h.nome===mp.texto||h.nome===mp.textoFila);
      let acao='';
      if(jaHabito)acao=`<span class="mut" style="font-size:12px;font-weight:700">✓ já é hábito</span>`;
      else if(naFila)acao=`<span class="mut" style="font-size:12px;font-weight:700">📋 na fila</span>`;
      else acao=`<button type="button" class="btn prim" data-mp-hab="${esc(mp.id)}">＋ Virar hábito</button>`;
      html+=`<div class="mp-acao">
        <span class="data">${esc(mp.criadoEm||'')}</span>
        <div class="txt">${esc(mp.texto)}</div>
        <div class="acoes">
          ${acao}
          <button type="button" class="btn btn-x" data-mp-rm="${esc(mp.id)}" title="remover">×</button>
        </div>
      </div>`;
    });
  }
  html+=`<div class="dz-nova-nota" style="margin-top:8px">
      <input id="dzMenorTxt" placeholder="ex: varrer a casa às quartas…">
      <button id="dzMenorAdd" type="button">+</button>
    </div>
    <div class="mut" style="font-size:11.5px;margin-top:8px;line-height:1.45">Pode adicionar quantas ações quiser. Cada uma pode virar um hábito.</div>
  </div>`;
  return html;
}
function dzRender(){
  const d=dzFind();if(!d)return;
  const area=S.leiAtracao.areas.find(a=>a.id===d.area);
  $('dzArea').textContent=area?area.nome:'';
  $('dzTexto').value=limparTextoDesejo(d.texto)||d.texto;
  dzTrilha();
  /* Passo 2 */
  const sens=d.sensacao;
  const notaHoje=!!(d.diasNotados&&d.diasNotados[hoje()]);
  const dias7=contarDias7(d);
  const notas=(d.notas||[]).slice().reverse();
  const nucleoAtual=nucleoParaUsar(d);
  const nucleoEditavel=(d.nucleo||'').trim()||nucleoAtual;
  $('dzP2').innerHTML=
    `<div class="abertura-fixa">${ABERTURA_FIXA(nucleoAtual)}</div>`
    +`<div class="mut" style="font-size:11px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;margin:8px 0 4px">Como o desejo aparece na abertura</div>`
    +`<input id="dzNucleo" value="${esc(nucleoEditavel)}" placeholder="ex: valorizar o meu trabalho" style="margin-bottom:4px;font-size:14px">`
    +`<div class="mut" style="font-size:11.5px;margin:0 0 10px;line-height:1.45">Se quiser, ajuste aqui. Vale pra declaração inteira.</div>`
    +renderCorpoCorpo(d)
    +renderMenorPasso(d);
  const gs=d.gravetos||[];
  const evs=(d.evidencias||[]).slice().reverse();
  $('dzP3').innerHTML=`<p class="mut dz-dica">Anote o que te trava. Quando aparecer um <b>"porque"</b>, ali mora uma crença que limita. Não precisa resolver agora: só de anotar, ela perde força.</p>`
    +`<div style="margin-bottom:14px">
      <div class="mut" style="font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;margin-bottom:6px">O que trava</div>
      <input id="dzNovaDuv" placeholder="Eu não posso porque..." style="width:100%;margin-bottom:8px">
      <button class="btn prim btn-full" id="dzAddDuv">+ Adicionar dúvida</button>
    </div>`
    +gs.map(g=>renderImpedimento(g)).join('')
    +`<div style="margin:14px 0;padding-top:12px;border-top:1px dashed var(--borda)">
      <div class="mut" style="font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;margin-bottom:6px">＋ Nova permissão</div>
      <input id="dzNovaPerm" placeholder="Uma frase que alivia, mesmo que um pouco…" style="width:100%;margin-bottom:8px">
      <button class="btn prim btn-full" id="dzAddPerm">Guardar permissão</button>
    </div>`
    +`<div class="dz-evidencias-bloco" style="margin-top:14px;padding-top:12px;border-top:1px dashed var(--borda)">
      <div class="dz-sub-pt">🌟 Evidências</div>
      <div class="mut dz-dica" style="margin:0 0 8px">O que apareceu desde que você começou a querer isso? Vale como prova de que está se movendo.</div>
      <div>${evs.map(e=>`<div class="dz-ev"><span class="data">${esc(e.data)}</span>${esc(e.texto)}<button class="x" data-ev-rm="${esc(e.id)}">×</button></div>`).join('')}</div>
      <div style="display:flex;gap:8px;margin-top:8px">
        <input id="dzEvTxt" placeholder="O que apareceu?" style="flex:1">
        <button class="btn prim" id="dzEvAdd" style="flex-shrink:0;padding:0 14px">+</button>
      </div>
    </div>`;
  /* Handlers Passo 1 */
  $('dzTexto').onblur=dzSalvaCampos;
  /* Handlers Passo 2 */
  const taN=$('dzNucleo');
  if(taN)taN.onblur=()=>{
    const dd=dzFind();if(!dd)return;
    const v=taN.value.trim();
    if(v!==(dd.nucleo||'').trim()){dd.nucleo=v;salva();dzRender();}
  };
  $('dzP2').querySelectorAll('[data-cp-rm]').forEach(b=>{
    b.onclick=()=>{const dd=dzFind();dd.corpo.splice(+b.dataset.cpRm,1);salva();dzRender();};
  });
  $('dzP2').querySelectorAll('[data-cp-add]').forEach(b=>{
    b.onclick=()=>{
      const dd=dzFind();const k=b.dataset.cpAdd;
      const mod=MODELOS_CORPO.find(m=>m.k===k);if(!mod)return;
      // reusa a clareza já escrita — sem digitar de novo
      let base=(limparTextoDesejo(dd.texto)||dd.texto||'').trim();
      if(base) base=base.charAt(0).toLowerCase()+base.slice(1);
      dd.corpo.push({k,texto:base});
      salva();dzRender();
    };
  });
  // toque na frase do corpo para editar (opcional)
  $('dzP2').querySelectorAll('.corpo-item .cp-txt').forEach((el,idx)=>{
    el.style.cursor='pointer';
    el.title='Toque para editar';
    el.onclick=()=>{
      const dd=dzFind();if(!dd||!dd.corpo[idx])return;
      const c=dd.corpo[idx];
      const mod=MODELOS_CORPO.find(m=>m.k===c.k);
      const v=prompt((mod?mod.pre+' ':'')+'…', c.texto||'');
      if(v===null)return;
      const t=v.trim();
      if(!t){dd.corpo.splice(idx,1);}
      else c.texto=t.charAt(0).toLowerCase()+t.slice(1);
      salva();dzRender();
    };
  });
  if($('dzBoa'))$('dzBoa').onclick=()=>dzSensacao('boa');
  if($('dzDuvida'))$('dzDuvida').onclick=()=>dzSensacao('duvida');
  if($('dzLemb'))$('dzLemb').onclick=dzLembrete;
  /* notas de atenção removidas da Lei da Atração */
  /* Handlers Passo 3 */
  $('dzAddDuv').onclick=dzAddDuvida;
  const btnPerm=$('dzAddPerm');
  if(btnPerm)btnPerm.onclick=()=>{
    const d=dzFind();if(!d)return;
    const v=($('dzNovaPerm')||{}).value;if(!v||!v.trim()){avisar('Escreva uma frase primeiro.');return;}
    if(!Array.isArray(d.gravetos))d.gravetos=[];
    d.gravetos.push({id:'g'+Date.now().toString(36),duvida:'(permissão direta)',alivio:v.trim(),solto:true,soltoEm:hoje(),criadoEm:hoje()});
    salva();dzRender();try{renderLivroPermissoes();}catch(e){}mostrarToast('Permissão guardada no livro ✓');
  };

  $('dzNovaDuv').onkeydown=e=>{if(e.key==='Enter')dzAddDuvida();};
  $('dzP3').querySelectorAll('.dz-aliv').forEach(el=>{
    const salvar=()=>{
      const dd=dzFind();const g=dd&&(dd.gravetos||[]).find(x=>x.id===el.dataset.gid);
      if(!g)return;
      const v=(el.innerText||el.value||'').trim();
      if(v!==(g.alivio||'')){g.alivio=v;salva();}
    };
    el.onblur=salvar;
    el.onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();el.blur();}};
  });
  $('dzP3').querySelectorAll('[data-sug-frase]').forEach(b=>{
    b.onclick=()=>{
      const gid=b.dataset.gid;
      const frase=b.dataset.sugFrase;
      const dd=dzFind();if(!dd)return;
      const g=(dd.gravetos||[]).find(x=>x.id===gid);if(!g)return;
      const live=$('dzP3').querySelector('.dz-aliv[data-gid="'+gid+'"]');
      // se já está selecionada e igual, foca pra editar no lugar
      if(g.alivio===frase && live){
        live.focus();
        // coloca cursor no fim
        try{const r=document.createRange();r.selectNodeContents(live);r.collapse(false);const s=window.getSelection();s.removeAllRanges();s.addRange(r);}catch(e){}
        return;
      }
      g.alivio=frase;salva();
      if(live){
        if(live.getAttribute('contenteditable')==='true') live.textContent=frase;
        else live.value=frase;
        live.focus();
      }
      $('dzP3').querySelectorAll('[data-sug-frase][data-gid="'+gid+'"]').forEach(x=>x.classList.toggle('on',x.dataset.sugFrase===frase));
      mostrarToast('Pode editar o texto direto na frase');
    };
  });
  $('dzP3').querySelectorAll('[data-outra-frase]').forEach(b=>{
    b.onclick=()=>{
      const gid=b.dataset.gid;
      const base=b.dataset.outraFrase||'';
      const dd=dzFind();if(!dd)return;
      const g=(dd.gravetos||[]).find(x=>x.id===gid);if(!g)return;
      g.alivio=base;salva();
      const live=$('dzP3').querySelector('.dz-aliv[data-gid="'+gid+'"]');
      if(live){
        if(live.getAttribute('contenteditable')==='true') live.textContent=base;
        else live.value=base;
        live.focus();
      }
    };
  });
  $('dzP3').querySelectorAll('[data-gsolta]').forEach(b=>{b.onclick=()=>dzSoltar(b.dataset.gsolta);});
  $('dzP3').querySelectorAll('[data-grem]').forEach(b=>{b.onclick=()=>{const dd=dzFind();dd.gravetos=dd.gravetos.filter(x=>x.id!==b.dataset.grem);salva();dzRender();};});
  const btnMenorAdd=$('dzMenorAdd');
  if(btnMenorAdd)btnMenorAdd.onclick=()=>{
    const v=$('dzMenorTxt').value.trim();if(!v){avisar('Escreva a menor ação possível.');return;}
    const dd=dzFind();if(!dd)return;
    if(!Array.isArray(dd.menorPassos))dd.menorPassos=[];
    const item={id:'mp'+Date.now().toString(36),texto:v,criadoEm:hoje(),sugestao:paraInfinitivoSugestao(v)};
    dd.menorPassos.push(item);
    dd.menorPasso=item; // legado: último
    salva();
    confete(['🌱','✨','💫']);dzRender();
  };
  const inpMenorTxt=$('dzMenorTxt');
  if(inpMenorTxt)inpMenorTxt.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();if(btnMenorAdd)btnMenorAdd.click();}};
  $('dzP2')&&$('dzP2').querySelectorAll('[data-mp-rm]').forEach(b=>{
    b.onclick=()=>{
      const dd=dzFind();if(!dd)return;
      dd.menorPassos=(dd.menorPassos||[]).filter(x=>x.id!==b.dataset.mpRm);
      if(dd.menorPasso&&dd.menorPasso.id===b.dataset.mpRm)dd.menorPasso=dd.menorPassos[0]||null;
      salva();dzRender();
    };
  });
  $('dzP2')&&$('dzP2').querySelectorAll('[data-mp-hab]').forEach(b=>{
    b.onclick=()=>{
      const dd=dzFind();if(!dd)return;
      const mp=(dd.menorPassos||[]).find(x=>x.id===b.dataset.mpHab);
      if(!mp)return;
      virarDesejoEmHabito(dd, mp.texto);
    };
  });
  const btnVirar=$('dzVirar');
  if(btnVirar)btnVirar.onclick=()=>virarDesejoEmHabito(d);
  $('dzEvAdd').onclick=()=>{dzAddEvidencia($('dzEvTxt').value);};
  $('dzEvTxt').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();dzAddEvidencia($('dzEvTxt').value);}};
  $('dzP3').querySelectorAll('[data-ev-rm]').forEach(b=>{b.onclick=()=>dzRemEvidencia(b.dataset.evRm);});
}
function virarDesejoEmHabito(d,textoOpcional){
  if(!d)return;
  const bruto=textoOpcional||(d.menorPasso&&d.menorPasso.texto)||((d.menorPassos||[])[0]&&(d.menorPassos||[])[0].texto)||limparTextoDesejo(d.texto)||d.texto;
  if(!bruto){avisar('Não consigo identificar o que criar.');return;}
  abrirHabitoSugestao(d,bruto);
}
function criarHabitoDeDesejo(d,nome,grupo){
  const id='d'+Date.now().toString(36);
  const g=grupo||'outros';
  const emoji=(todosGrupos().find(x=>x.id===g)||{}).emoji||'🌱';
  S.habitos.push({
    id,emoji,emojis:[emoji,'✨','💫'],nome,
    paraQue:'Veio da minha Atração · '+(limparTextoDesejo((d&&d.texto)||'')||(d&&d.texto)||''),unidade:'conforme combinado',feitos:{},
    cor:CORES[S.habitos.length%CORES.length],grupo:g,
    festejou21:false,premioPego:false,dims:[]
  });
  if(d){
    d.habitoVinculado=id;
    if(d.menorPasso) d.menorPasso.texto=nome;
    if(Array.isArray(d.menorPassos)){
      d.menorPassos.forEach(mp=>{
        if((mp.texto||'')===nome||(mp.textoFila||'')===nome){mp.naFila=false;mp.virouHabito=true;}
      });
    }
  }
  // limpa da fila de sugestões
  if(Array.isArray(S.habitosSugestoes)){
    S.habitosSugestoes=S.habitosSugestoes.filter(s=>s.texto!==nome);
  }
  S.proximoHabitoEm=Date.now()+3*86400000;S.habitoTravaId=id;
  S.ultimoConviteEm=Date.now();
  salva();confete(['🌱','✨','💛']);
  mostrarToast('Hábito criado ✓');
  if(typeof dzRender==='function' && dzAtual)dzRender();
  renderHoje();renderHabitos();
}
function dzSensacao(v){
  const d=dzFind();if(!d)return;
  if(!d.corpo||!d.corpo.length){avisar('Monte pelo menos uma frase do corpo antes.');return;}
  d.sensacao=v;salva();
  if(v==='boa'){
    confete(['✨','💫','🌟']);
    dzRender();
    renderDeclaracoesLista();
    return;
  }
  // não me faz bem → vai direto pra Permissão
  dzPassoInicial=3;
  dzRender();
  renderDeclaracoesLista();
  setTimeout(()=>dzAbrirPasso(3),60);
  mostrarToast('Vamos olhar a dúvida · Permissão');
}
function dzAddDuvida(){
  const d=dzFind();if(!d)return;
  const inp=$('dzNovaDuv');const v=inp.value.trim();if(!v)return;
  if(!d.gravetos)d.gravetos=[];
  const temPorque=/porque/i.test(v);
  d.gravetos.push({id:'g'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),duvida:v,alivio:'',solto:false});
  salva();dzRender();
  if(temPorque)setTimeout(()=>mostrarToast('Você achou uma crença limitante. 🪵'),400);
}
function dzSoltar(id){
  const d=dzFind();if(!d)return;
  const g=(d.gravetos||[]).find(x=>x.id===id);if(!g)return;
  const inp=$('dzP3').querySelector('.dz-aliv[data-gid="'+id+'"]');
  const v=inp?((inp.innerText||inp.value||'').trim()):(g.alivio||'');
  if(!v){avisar('Escreva o que você se permite acreditar, ou toque numa sugestão.');return;}
  g.alivio=v;g.solto=true;g.soltoEm=hoje();
  salva();dzRender();
  renderPermitirLista();
  try{renderLivroPermissoes();}catch(e){}
  mostrarToast('Frase guardada no livro ✓');
}
function dzAddEvidencia(txt){
  const d=dzFind();if(!d)return;
  const v=(txt||'').trim();if(!v)return;
  if(!Array.isArray(d.evidencias))d.evidencias=[];
  d.evidencias.push({id:'e'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),texto:v,data:hoje()});
  salva();dzRender();
  const inp=$('dzEvTxt');if(inp)inp.focus();
}
function dzRemEvidencia(id){
  const d=dzFind();if(!d)return;
  d.evidencias=(d.evidencias||[]).filter(e=>e.id!==id);
  salva();dzRender();
}
function dzLembrete(){
  const d=dzFind();if(!d)return;
  const partes=montarDeclaracao(d);
  const txt=partes.join('\n').replace(/<[^>]+>/g,'');
  if(!txt){avisar('Monte a declaração primeiro.');return;}
  const hora=$('dzHora').value||'08:00';
  if(S.lembretes.some(l=>l.frase===txt)){mostrarToast('Essa declaração já está nos seus lembretes');return;}
  S.lembretes.push({id:'l'+Date.now(),frase:txt,hora});salva();
  if(typeof renderLembretes==='function')renderLembretes();
  mostrarToast('Lembrete criado para '+hora+' ✓');
}
function abrirDesejo(id,passo){
  dzAtual=id;dzPassoInicial=passo||1;
  dzRender();
  const o=$('desejoModal');abrirOverlay(o);
  document.body.style.overflow='hidden';o.querySelector('.modal-caixa').scrollTop=0;
  setTimeout(()=>dzAbrirPasso(dzPassoInicial||1),40);
}
function fecharDesejo(){
  dzSalvaCampos();
  fecharOverlay($('desejoModal'),()=>{dzAtual=null;renderAtracaoTudo();renderMenorPassoHoje();});
}

let soltarCtx=null;
function abrirSoltarDesejo(){
  const d=dzFind();if(!d)return;
  soltarCtx=d;
  const inp=$('soltarNoLugar');if(inp)inp.value='';
  abrirOverlay($('soltarDesejoModal'));
  setTimeout(()=>{if(inp)inp.focus();},280);
}
function fecharSoltarDesejo(){
  fecharOverlay($('soltarDesejoModal'),()=>{soltarCtx=null;});
}
function confirmarSoltarDesejo(){
  const d=soltarCtx||dzFind();if(!d)return;
  const noLugar=(($('soltarNoLugar')||{}).value||'').trim();
  d.arquivado=true;
  d.arquivadoEm=hoje();
  d.soltoNoLugar=noLugar||'';
  salva();
  fecharSoltarDesejo();
  fecharDesejo();
  mostrarToast('Desejo arquivado 🍃');
  if(noLugar){
    const area=d.area||'vontades';
    const novo=novoDesejo(area, paraInfinitivoSugestao(noLugar)||noLugar);
    novo.veioDeSoltar=d.id;
    S.leiAtracao.desejos.push(novo);
    salva();
    renderAtracaoTudo();
    setTimeout(()=>abrirDesejo(novo.id,1),360);
  } else {
    renderAtracaoTudo();
  }
}
$('dzSoltarDesejo')&&($('dzSoltarDesejo').onclick=abrirSoltarDesejo);
$('soltarCancelar')&&($('soltarCancelar').onclick=fecharSoltarDesejo);
$('soltarConfirmar')&&($('soltarConfirmar').onclick=confirmarSoltarDesejo);
$('soltarNoLugar')&&($('soltarNoLugar').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();confirmarSoltarDesejo();}});

$('dzFechar').onclick=fecharDesejo;
$('dzApagar').onclick=()=>{const id=dzAtual;confirmar('Apagar de vez?\n\nIsso some pra sempre.\n\nSe só não faz mais sentido agora, use Soltar desejo — ele arquiva e pergunta o que ficou no lugar.',()=>{S.leiAtracao.desejos=S.leiAtracao.desejos.filter(x=>x.id!==id);salva();fecharDesejo();},'Apagar de vez');};

