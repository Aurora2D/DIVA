/* ============ FILA / HÁBITOS ============ */
let filaItemAtual=null;
function abrirModalFila(item){
  filaItemAtual=item;const overlay=$('filaModal');
  $('filaModalEmoji').textContent=item.emoji;$('filaModalPergunta').textContent='Você quer inserir esse novo hábito na sua rotina hoje?';
  $('filaModalNome').textContent=item.nome;
  const unidParts=[item.unidade,item.paraQue].filter(Boolean);
  $('filaModalUnidade').textContent=unidParts.join(' · ');
  const instr=item.texto||item.paraQue||'';
  if(instr){$('filaModalPara').textContent=instr;$('filaModalPara').style.display='block';}
  else{$('filaModalPara').style.display='none';$('filaModalPara').textContent='';}
  $('filaModalBotoes').innerHTML=`<button class="modal-btn sec" id="filaNao">Ainda não</button><button class="modal-btn prim" id="filaSim">Sim, quero</button>`;
  $('filaNao').onclick=mostrarTudoBemFila;$('filaSim').onclick=mostrarImportanciaFila;
  abrirOverlay(overlay);
}
function mostrarImportanciaFila(){
  if(!filaItemAtual)return;
  $('filaModalPergunta').textContent='Por que isso importa';
  $('filaModalPara').textContent=filaItemAtual.texto||'';$('filaModalPara').style.display='block';
  $('filaModalBotoes').innerHTML=`<button class="modal-btn sec" id="filaCancelar">Voltar</button><button class="modal-btn prim" id="filaAdicionar">Adicionar à minha rotina</button>`;
  $('filaCancelar').onclick=fecharModalFila;
  $('filaAdicionar').onclick=()=>{adicionarHabitoFila(filaItemAtual);fecharModalFila();};
}
function mostrarTudoBemFila(){
  $('filaModalEmoji').textContent='🌿';
  $('filaModalPergunta').textContent='Tudo bem, no seu tempo';
  $('filaModalNome').textContent='';$('filaModalUnidade').textContent='';
  $('filaModalPara').textContent='Essa sugestão continua na fila. Quando fizer sentido para você, é só voltar.';$('filaModalPara').style.display='block';
  $('filaModalBotoes').innerHTML=`<button class="modal-btn prim" id="filaOk">Ok</button>`;
  $('filaOk').onclick=fecharModalFila;
}
function fecharModalFila(){const o=$('filaModal');fecharOverlay(o);filaItemAtual=null;}
function adicionarHabitoFila(item){
  if(S.habitos.some(h=>h.nome===item.nome||(item.id&&h.id===item.id))){avisar('Você já tem esse hábito. 💛');return;}
  const hist=S.historicoRemovidos[item.nome];
  const feitos=hist?{...hist.feitos}:{};
  const completo=Object.keys(feitos).length>=21;
  const novoId=item.id||('h'+Date.now());
  S.habitos.push({id:novoId,emoji:item.emoji,emojis:item.emojis||[item.emoji,'✨','🌸'],nome:item.nome,paraQue:item.paraQue||'-',unidade:item.unidade,feitos,cor:CORES[S.habitos.length%CORES.length],grupo:item.grupo||'outros',festejou21:completo,premioPego:hist?!!hist.premioPego:false,dims:(item.dims||[]).slice()});
  if(hist)delete S.historicoRemovidos[item.nome];
  const nFeitos=Object.keys(feitos).length;
  if(nFeitos>=3){S.proximoHabitoEm=null;S.habitoTravaId=null;}
  else{S.proximoHabitoEm=Date.now()+3*86400000;S.habitoTravaId=novoId;}
  S.ultimoConviteEm=Date.now();
  salva();confete([item.emoji,'✨','🌸']);renderHoje();renderHabitos();
}
function filaCompleta(){
  const base=filaBase();
  const nomes=new Set(base.flatMap(c=>c.itens.map(i=>i.nome)));
  const extras=Object.entries(S.historicoRemovidos||{})
    .filter(([n,v])=>v&&v.meta&&!nomes.has(n)&&!S.habitos.some(h=>h.nome===n))
    .map(([n,v])=>({id:v.meta.id,nome:n,emoji:v.meta.emoji||'⭐',emojis:v.meta.emojis,unidade:v.meta.unidade||'',paraQue:v.meta.paraQue,grupo:v.meta.grupo||'outros',texto:'Você já teve esse hábito, e os dias que você marcou continuam guardados. Quando fizer sentido, ele volta.',dims:v.meta.dims||[]}));
  return extras.length?[...base,{nome:'💛 Os que já foram seus',itens:extras}]:base;
}
function renderHabitos(){
  const nome=S.onboarding.nome||'';
  const ativos=S.habitos.filter(h=>!h.pausado);
  const recente=ativos[ativos.length-1];
  const diasMarcados=recente?Object.keys(recente.feitos).length:0;
  let aviso='';
  if(ativos.length&&!habitoLiberado()){
    const dias=diasAteLiberar();
    aviso=`<div class="card2 mut" style="font-size:12.5px;line-height:1.55">🌱 Sem pressa. O próximo hábito libera em <b>${dias} dia${dias===1?'':'s'}</b>.</div>`;
  } else if(diasMarcados>=3){
    aviso=`<div class="okmsg">Você cumpriu 3 dias! Quando quiser, olhe as sugestões abaixo.</div>`;
  } else {
    aviso=`<div class="card2 mut" style="font-size:12.5px;line-height:1.55">Um hábito de cada vez. Conforme você for marcando, o app libera o próximo, sem atropelo.</div>`;
  }
  $('avisoRitmo').innerHTML=aviso;
  // atalho estilo de autocuidado
  let estBox=$('estiloAtalhoGerenciar');
  if(!estBox){
    estBox=document.createElement('div');estBox.id='estiloAtalhoGerenciar';
    const ar=$('avisoRitmo');if(ar&&ar.parentNode)ar.parentNode.insertBefore(estBox,ar.nextSibling);
  }
  if(estBox){
    const feito=S.estiloAutocuidado&&S.estiloAutocuidado.feito;
    estBox.innerHTML=`<button type="button" class="btn btn-full" id="btnEstiloGerenciar" style="margin:8px 0 10px">${feito?'🪞 Ver meu estilo de autocuidado':'🪞 Personalizar sugestões (estilo de autocuidado)'}</button>`;
    const b=$('btnEstiloGerenciar');if(b)b.onclick=()=>{fecharOverlay($('gerenciarModal'),()=>{if(feito)estiloMostrarResultado();else estiloIniciar();});};
  }

  // sugestões vindas do menor passo (fila enquanto espera 3 dias)
  const pend=(S.habitosSugestoes||[]).filter(s=>!(S.habitos||[]).some(h=>h.nome===s.texto));
  let sugHtml='';
  if(false){
    sugHtml=`<div class="card2" style="margin-bottom:10px"><div class="mut" style="font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px">🌱 Suas sugestões (do desejo)</div>`+
      pend.map(s=>{
        const g=s.grupo?todosGrupos().find(x=>x.id===s.grupo):null;
        const cat=g?(g.emoji+' '+g.nome):'';
        return`<div class="cat-sugestao" data-hab-sug="${esc(s.id)}" style="margin-bottom:6px"><div class="txt"><b>🌱 ${esc(s.texto)}</b>${cat?`<br><span class="mut">${esc(cat)}</span>`:''}</div><div class="add">+</div></div>`;
      }).join('')+
      `</div>`;
  }
  if($('sugestoesPendentesBox'))$('sugestoesPendentesBox').innerHTML=sugHtml;
  else {
    // inject before progresso if no dedicated box
    const pb=$('progressoBox');
    if(pb && sugHtml){
      let holder=$('sugestoesPendentesBox');
      if(!holder){holder=document.createElement('div');holder.id='sugestoesPendentesBox';pb.parentNode.insertBefore(holder,pb);}
      holder.innerHTML=sugHtml;
    } else if($('sugestoesPendentesBox'))$('sugestoesPendentesBox').innerHTML='';
  }
  const bindSugHab=()=>document.querySelectorAll('[data-hab-sug]').forEach(el=>{
    const ativar=()=>{
      const s=(S.habitosSugestoes||[]).find(x=>x.id===el.dataset.habSug);if(!s)return;
      if(S.habitos.some(h=>!h.pausado) && !habitoLiberado()){
        avisar('Sem pressa. Próximo hábito libera em '+diasAteLiberar()+' dia(s).');
        return;
      }
      const d=(S.leiAtracao.desejos||[]).find(x=>x.id===s.desejoId)||{id:s.desejoId||'x',texto:s.texto,area:'outros'};
      abrirHabitoSugestao(d, s.texto);
      setTimeout(()=>{
        if(s.grupo && habSugCtx){
          const cats=$('habSugCats');
          if(cats){
            cats.querySelectorAll('.chip').forEach(c=>{
              if(c.dataset.habCat===s.grupo){c.click();}
            });
          }
        }
      },100);
    };
    const menu=()=>{
      const s=(S.habitosSugestoes||[]).find(x=>x.id===el.dataset.habSug);if(!s)return;
      abrirSugMenu({tipo:'habSug',id:s.id,nome:s.texto,grupo:s.grupo,desejoId:s.desejoId});
    };
    el.onclick=null;
    bindLongPress(el, menu, ativar, 550);
  });

  $('progressoBox').innerHTML=S.habitos.map(hb=>{
    const feitos=Object.keys(hb.feitos).length;const pronto=feitos>=21;
    const g=todosGrupos().find(x=>x.id===grupoDe(hb));
    const pausado=!!hb.pausado;
    return`<div class="hab ${pausado?'pausado':''}"><div class="linha"><div><div class="nome">${hb.emoji||'⭐'} ${esc(hb.nome)} ${pausado?'<span class="tag pausado">pausado</span>':''} <span class="mut" style="font-size:10px">· ${g?g.nome:''}</span></div><div class="para">Para: ${esc(hb.paraQue||'—')} · ${esc(hb.unidade||'')}</div></div></div><div class="barra"><div class="fill ${pronto?'ok':''}" style="width:${Math.min(100,(feitos/21)*100)}%"></div></div><div class="info"><span>${feitos} de 21 dias</span><span>${pronto?'✓ completo':'faltam '+Math.max(0,21-feitos)}</span></div><div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">${pausado?`<button class="btn prim" data-retomar="${hb.id}" style="flex:1">↩ Retomar</button>`:''}${!pausado&&pronto?`<button class="btn prim" data-premiar="${hb.id}" style="flex:1">🎁 Pegar meu prêmio</button>`:''}<button class="btn" data-editar="${hb.id}">✏️ Editar</button><button class="btn fant" data-remover="${hb.id}">remover</button></div></div>`;
  }).join('');
  if(!S.habitos.length)$('progressoBox').innerHTML='<div class="aviso">Nada por aqui ainda, e tudo bem. Escolha o primeiro nas sugestões abaixo, no seu tempo.</div>';
  document.querySelectorAll('#progressoBox [data-remover]').forEach(b=>{b.onclick=()=>{const hb=S.habitos.find(x=>x.id===b.dataset.remover);if(hb)abrirRemover(hb);};});
  document.querySelectorAll('#progressoBox [data-retomar]').forEach(b=>{b.onclick=()=>{const hb=S.habitos.find(x=>x.id===b.dataset.retomar);if(hb){delete hb.pausado;salva();renderHabitos();renderHoje();}};});
  document.querySelectorAll('#progressoBox [data-premiar]').forEach(b=>{b.onclick=()=>{abrirContextoPremio(21,ctx=>procurarPremio('G',ctx,p=>mostrarPremioModal(p,{tier:'G',ctx})));};});
  document.querySelectorAll('#progressoBox [data-editar]').forEach(b=>{b.onclick=()=>{const hb=S.habitos.find(x=>x.id===b.dataset.editar);if(hb)abrirHabMenu(hb);};});

    const ocultas=new Set(S.habitosFilaOcultas||[]);
  const GCAT={rituais:'🕯️ Rituais',musica:'🎵 Música',arte:'🎨 Arte e prazer',mente:'🧘 Mente',corpo:'🏃 Corpo',lar:'🏡 Lar doce lar',aurora:'🌙 Ritmo de '+(nomeCuidado()||'{nome}')};
  const filaCats=filaCompleta();
  const nomesCats=new Set(filaCats.map(c=>c.nome));
  const sugPorCat={},sugExtras={};
  pend.forEach(sg=>{
    const alvo=GCAT[sg.grupo];
    if(alvo&&nomesCats.has(alvo)){(sugPorCat[alvo]=sugPorCat[alvo]||[]).push(sg);}
    else{const g=todosGrupos().find(x=>x.id===sg.grupo)||{emoji:'🌱',nome:'Outros'};const t=g.emoji+' '+g.nome;(sugExtras[t]=sugExtras[t]||[]).push(sg);}
  });
  const sugRow=sg=>{const g=sg.grupo?todosGrupos().find(x=>x.id===sg.grupo):null;const cat=g?(g.emoji+' '+g.nome):'';return`<div class="cat-sugestao" data-hab-sug="${esc(sg.id)}"><div class="txt"><b>🌱 ${esc(sg.texto)}</b><br><span class="mut">${cat?esc(cat)+' · ':''}veio do seu desejo · na fila</span></div><div class="add">+</div></div>`;};
  const itemRow=item=>{const jaTem=S.habitos.some(h=>h.nome===item.nome);const instr=[item.paraQue,item.unidade,item.texto].filter(Boolean).filter((v,i,a)=>a.indexOf(v)===i);const sub=instr.length?instr.map(t=>esc(t)).join(' · '):'';return`<div class="cat-sugestao ${jaTem?'ja-tem':''}" data-fila="${esc(item.nome)}"><div class="txt"><b>${item.emoji} ${esc(item.nome)}</b>${sub?`<br><span class="mut">${sub}</span>`:''}</div><div class="add">${jaTem?'✓':'+'}</div></div>`;};
  const blocoCat=(nome,sugs,itens)=>`<div class="cat-bloco"><div class="cat-titulo">${nome}</div>${sugs.map(sugRow).join('')}${itens.map(itemRow).join('')}</div>`;
  $('sugestoesFilaBox').innerHTML=filaCats.map(cat=>{
    const itens=cat.itens.filter(item=>!ocultas.has(item.nome));
    const sugs=sugPorCat[cat.nome]||[];
    if(!itens.length&&!sugs.length)return '';
    return blocoCat(cat.nome,sugs,itens);
  }).join('')+Object.entries(sugExtras).map(([n2,l2])=>blocoCat(n2,l2,[])).join('');
  document.querySelectorAll('#sugestoesFilaBox [data-fila]').forEach(el=>{
    const ativar=()=>{
      const nome2=el.dataset.fila;
      const item=filaCompleta().flatMap(c=>c.itens).find(i=>i.nome===nome2);
      if(!item)return;
      if(S.habitos.some(h=>h.nome===item.nome)){avisar('Você já tem esse hábito. 💛');return;}
      if(S.habitos.some(h=>!h.pausado) && !habitoLiberado()){
        const dias=diasAteLiberar();
        avisar('Sem pressa. Próximo hábito libera em '+dias+' dia'+(dias===1?'':'s')+'.');
        return;
      }
      abrirModalFila(item);
    };
    const menu=()=>{
      const nome=el.dataset.fila;
      const item=filaCompleta().flatMap(c=>c.itens).find(i=>i.nome===nome);
      if(!item)return;
      abrirSugMenu({tipo:'fila',nome:item.nome,emoji:item.emoji,grupo:item.grupo,unidade:item.unidade,paraQue:item.paraQue,texto:item.texto});
    };
    el.onclick=null;
    bindLongPress(el, menu, ativar, 550);
  });


  bindSugHab();


}

/* ============ MENU DO HÁBITO (segurar a bolinha) ============ */

/* ============ MENU DAS SUGESTÕES NA FILA ============ */
function abrirSugMenu(info){
  $('smEmoji').textContent=info.emoji||'🌱';
  $('smNome').textContent=info.nome||'';
  const g=info.grupo?todosGrupos().find(x=>x.id===info.grupo):null;
  let infoTxt='';
  if(info.tipo==='habSug')infoTxt=(g?g.emoji+' '+g.nome+' · ':'')+'sugestão do desejo · na fila';
  else {
    const parts=[];
    if(g)parts.push(g.emoji+' '+g.nome);
    if(info.unidade)parts.push(info.unidade);
    if(info.paraQue)parts.push(info.paraQue);
    infoTxt=parts.join(' · ')||'sugestão da fila';
  }
  $('smInfo').textContent=infoTxt;
  const c=$('smBotoes');c.innerHTML='';
  const add=(rot,cls,fn)=>{const b=document.createElement('button');b.className='modal-btn '+cls;b.textContent=rot;b.onclick=()=>fecharOverlay($('sugMenuModal'),fn);c.appendChild(b);};
  if(info.tipo==='habSug'){
    add('✏️ Editar nome','prim',()=>{
      const s=(S.habitosSugestoes||[]).find(x=>x.id===info.id);if(!s)return;
      const v=prompt('Nome do hábito',s.texto||'');
      if(v===null)return;
      const t=v.trim();if(!t)return;
      s.texto=t;salva();renderHabitos();mostrarToast('Nome atualizado ✓');
    });
    add('📂 Mover de categoria','sec',()=>{
      const s=(S.habitosSugestoes||[]).find(x=>x.id===info.id);if(!s)return;
      const lista=todosGrupos();
      const nomes=lista.map((g,i)=> (i+1)+'. '+g.emoji+' '+g.nome).join('\\n');
      const v=prompt('Número da categoria:\\n'+nomes, '1');
      if(v===null)return;
      const idx=parseInt(v,10)-1;
      if(idx>=0&&idx<lista.length){s.grupo=lista[idx].id;salva();renderHabitos();mostrarToast('Categoria atualizada ✓');}
    });
    add('🗑️ Remover da fila','sec',()=>{
      confirmar('Remover essa sugestão da lista?',()=>{
        S.habitosSugestoes=(S.habitosSugestoes||[]).filter(x=>x.id!==info.id);
        salva();renderHabitos();mostrarToast('Sugestão removida');
      },'Remover');
    });
  } else {
    add('✏️ Ver instrução','prim',()=>{
      const item=filaCompleta().flatMap(c=>c.itens).find(i=>i.nome===info.nome);
      if(!item)return;
      const txt=[item.paraQue&&('Para: '+item.paraQue),item.unidade&&('Medida: '+item.unidade),item.texto].filter(Boolean).join('\\n\\n');
      avisar(txt||'Sem instrução extra.');
    });
    add('📂 Mover de categoria','sec',()=>{
      /* só para itens da fila fixa não movemos o catálogo; escondemos e recriamos como sugestão custom */
      const lista=todosGrupos();
      const nomes=lista.map((g,i)=> (i+1)+'. '+g.emoji+' '+g.nome).join('\\n');
      const v=prompt('Mover para (vira sugestão na fila com essa categoria):\\n'+nomes,'1');
      if(v===null)return;
      const idx=parseInt(v,10)-1;
      if(idx<0||idx>=lista.length)return;
      if(!Array.isArray(S.habitosSugestoes))S.habitosSugestoes=[];
      S.habitosSugestoes.push({id:'hs'+Date.now().toString(36),texto:info.nome,grupo:lista[idx].id,criadoEm:hoje(),deFila:true});
      if(!Array.isArray(S.habitosFilaOcultas))S.habitosFilaOcultas=[];
      if(!S.habitosFilaOcultas.includes(info.nome))S.habitosFilaOcultas.push(info.nome);
      salva();renderHabitos();mostrarToast('Movido para '+lista[idx].nome+' ✓');
    });
    add('🗑️ Esconder da fila','sec',()=>{
      confirmar('Esconder essa sugestão da fila?',()=>{
        if(!Array.isArray(S.habitosFilaOcultas))S.habitosFilaOcultas=[];
        if(!S.habitosFilaOcultas.includes(info.nome))S.habitosFilaOcultas.push(info.nome);
        salva();renderHabitos();mostrarToast('Sugestão escondida');
      },'Esconder');
    });
  }
  add('Fechar','sec',()=>{});
  abrirOverlayTopo($('sugMenuModal'));
}
function abrirHabMenu(hb){
  $('hmEmoji').textContent=hb.emoji||'⭐';
  $('hmNome').textContent=hb.nome;
  const g=todosGrupos().find(x=>x.id===grupoDe(hb));
  const dias=Object.keys(hb.feitos||{}).length;
  $('hmInfo').textContent=(g?g.emoji+' '+g.nome+' · ':'')+dias+' dia'+(dias===1?'':'s')+' marcado'+(dias===1?'':'s');
  const c=$('hmBotoes');c.innerHTML='';
  const add=(rot,cls,fn)=>{const b=document.createElement('button');b.className='modal-btn '+cls;b.textContent=rot;b.onclick=()=>fecharOverlay($('habMenuModal'),fn);c.appendChild(b);};
  add('✏️ Editar','prim',()=>abrirHabEditar(hb));
  add('💬 O que já disse sobre ele'+(relatoUteis(hb).length?' ('+relatoUteis(hb).length+')':''),'sec',()=>abrirRelatosHab(hb));
  add('📂 Mover de categoria','sec',()=>abrirHabMover(hb));
  if(hb.pausado)add('↩ Retomar','sec',()=>{delete hb.pausado;salva();renderHabitos();renderHoje();mostrarToast('Hábito retomado ✓');});
  else add('⏸️ Pausar por enquanto','sec',()=>{hb.pausado=true;salva();renderHabitos();renderHoje();mostrarToast('Em pausa','Desfazer',()=>{delete hb.pausado;salva();renderHabitos();renderHoje();});});
  add('🗑️ Excluir','sec',()=>abrirRemover(hb));
  add('Fechar','sec',()=>{});
  abrirOverlayTopo($('habMenuModal'));
}
function abrirHabEditar(hb,depois){
  $('heEmoji').value=hb.emoji||'';
  let icoSel=hb.icone==='emoji'?'emoji':(hb.icone&&ICONES_HAB.includes(hb.icone)?hb.icone:(EMOJI_ICONE[(hb.emoji||'').trim()]||'emoji'));
  const renderIco=()=>{
    $('heIcones').innerHTML=ICONES_HAB.map(n=>`<button type="button" class="${n===icoSel?'on':''}" data-ico="${n}">${svgIc(n)}</button>`).join('')+`<button type="button" class="${icoSel==='emoji'?'on':''}" data-ico="emoji"><span class="emo">emoji</span></button>`;
    $('heIcones').querySelectorAll('[data-ico]').forEach(b=>{b.onclick=()=>{icoSel=b.dataset.ico;renderIco();};});
    $('heEmojiBox').style.display=icoSel==='emoji'?'':'none';
  };
  renderIco();
  hb._icoSel=()=>icoSel;
  $('heNome').value=hb.nome||'';
  $('hePara').value=(hb.paraQue&&hb.paraQue!=='-')?hb.paraQue:'';
  $('heUnid').value=hb.unidade||'';
  $('heAcao').value=acaoDoHabito(hb);
  const prevAcao=()=>{const t=$('heAcao').value.trim()||relatoAcaoSugerida($('heNome').value);$('heAcaoPrev').textContent='Vai aparecer assim: “Vem cá… o hábito de '+t+' está fazendo diferença na sua vida?”';};
  $('heAcao').oninput=prevAcao;prevAcao();
  const dimsSel=new Set(habDimsDe(hb.nome,hb.id,hb.dims,hb.dimsDefinidas));
  const renderDims=()=>{const box=$('heDims');box.innerHTML=CICLO_DIMS.map(d=>`<button type="button" class="chip ${dimsSel.has(d.key)?'on':''}" data-d="${d.key}">${d.emoji} ${esc(d.nome)}</button>`).join('');box.querySelectorAll('.chip').forEach(c=>{c.onclick=()=>{const k=c.dataset.d;if(dimsSel.has(k))dimsSel.delete(k);else dimsSel.add(k);renderDims();};});};
  renderDims();
  const o=$('habEditModal');
  $('heCancelar').onclick=()=>fecharOverlay(o);
  $('heSalvar').onclick=()=>{
    const nome=$('heNome').value.trim();
    if(!nome){mostrarToast('Escreva o nome do hábito');return;}
    if(S.habitos.some(x=>x!==hb&&x.nome===nome)){mostrarToast('Você já tem um hábito com esse nome');return;}
    const emoji=$('heEmoji').value.trim()||hb.emoji||'⭐';
    hb.nome=nome;
    if(emoji!==hb.emoji){hb.emojis=[emoji].concat((hb.emojis||[]).slice(1));hb.emoji=emoji;}
    if(hb._icoSel){hb.icone=hb._icoSel();delete hb._icoSel;}
    hb.paraQue=$('hePara').value.trim()||'-';
    hb.unidade=$('heUnid').value.trim();
    const acaoDig=$('heAcao').value.trim();
    hb.acao=(acaoDig&&acaoDig!==relatoAcaoSugerida(nome))?acaoDig:'';
    hb.dims=[...dimsSel];hb.dimsDefinidas=true;
    salva();fecharOverlay(o);renderHoje();renderHabitos();mostrarToast('Hábito atualizado ✓');if(depois)depois();
  };
  abrirOverlayTopo(o);
}
function abrirHabMover(hb){
  let escolhido=grupoDe(hb);
  const cats=$('hmCats'),box=$('hmNovaBox'),o=$('habMoverModal');
  box.style.display='none';$('hmNovaNome').value='';$('hmNovaEmoji').value='✨';
  const render=()=>{
    cats.innerHTML=todosGrupos().map(g=>`<button type="button" class="chip ${g.id===escolhido?'on':''}" data-c="${esc(g.id)}">${g.emoji||'✨'} ${esc(g.nome)}</button>`).join('')+`<button type="button" class="chip ${escolhido==='__nova'?'on':''}" data-c="__nova">＋ Nova categoria</button>`;
    cats.querySelectorAll('.chip').forEach(c=>{c.onclick=()=>{escolhido=c.dataset.c;box.style.display=escolhido==='__nova'?'block':'none';render();};});
  };
  render();
  $('hmCancelar').onclick=()=>fecharOverlay(o);
  $('hmMover').onclick=()=>{
    let id=escolhido;
    if(id==='__nova'){
      const nome=$('hmNovaNome').value.trim();
      if(!nome){mostrarToast('Dê um nome à categoria');return;}
      const emoji=$('hmNovaEmoji').value.trim()||'✨';
      id='g'+Date.now().toString(36);
      if(!Array.isArray(S.gruposCustom))S.gruposCustom=[];
      S.gruposCustom.push({id,emoji,nome});
    }
    hb.grupo=id;salva();fecharOverlay(o);renderHoje();renderHabitos();mostrarToast('Movido ✓');
  };
  abrirOverlayTopo(o);
}

/* ============ REMOVER / PAUSAR ============ */
let hbRemover=null;
function abrirRemover(hb){
  hbRemover=hb;
  const nome=S.onboarding.nome||'amiga';
  const dias=Object.keys(hb.feitos).length;
  $('removerTitulo').textContent='Esse hábito ainda faz sentido pra você?';
  $('removerTexto').innerHTML=nome+', você pode tirar da sua lista quando quiser. Hábito que não cabe na sua vida agora não é falha sua, é só informação. Talvez o horário não encaixou, talvez ele não fosse seu, talvez o momento mude. Tudo bem.<br><br>Você tem <b>'+dias+' dia'+(dias===1?'':'s')+'</b> marcados em <b>'+esc(hb.nome)+'</b>. Esses dias foram reais e não somem da sua história.';
  $('removerBotoes').innerHTML=`
    <button class="modal-btn prim" id="removerSim">Remover da lista</button>
    <button class="modal-btn sec" id="removerPausar">Pausar por enquanto</button>
    <button class="modal-btn sec" id="removerManter">Manter</button>
  `;
  $('removerSim').onclick=()=>{
    removerHabitoDaLista(hb);
    fecharRemover();
    setTimeout(()=>avisar('A vida muda, e os interesses também.\n\nQuando quiser voltar, é só chamar. Ele fica guardado nas sugestões. 💛'),350);
    renderHabitos();renderHoje();
  };
  $('removerPausar').onclick=()=>{
    hb.pausado=true;salva();fecharRemover();
    setTimeout(()=>avisar('Em pausa.\n\n'+hb.nome+' vai ficar guardado, sem aparecer na tela Hoje. Quando quiser retomar, ele está esperando em Gerenciar hábitos.'),350);
    renderHabitos();renderHoje();
  };
  $('removerManter').onclick=fecharRemover;
  $('removerModal').hidden=false;requestAnimationFrame(()=>$('removerModal').classList.add('ativo'));document.body.style.overflow='hidden';
}
function fecharRemover(){const o=$('removerModal');o.classList.remove('ativo');setTimeout(()=>{o.hidden=true;document.body.style.overflow='';},320);hbRemover=null;}

/* ============ PRÊMIOS ============ */
const tamNome=t=>t==='P'?'Pequeno':t==='M'?'Médio':'Grande';
/* ===== Mensagens dos marcos de 3, 7 e 21 dias (12 por marco, 3 de cada tom) =====
   {hábito} é trocado pelo nome do hábito na hora de mostrar. */
const MENSAGENS_MARCO={
  3:[
    {tom:"acolhedor",p:["Três dias de {hábito}. Isso não foi sorte, foi decisão repetida. Cada vez que você cumpriu o que combinou consigo mesma, mesmo com pouca energia, seu cérebro registrou uma prova concreta de que você é confiável.","É assim que a autoconfiança se constrói, tijolo por tijolo, e você acabou de colocar três. Aproveite o prêmio e sinta orgulho de verdade."]},
    {tom:"acolhedor",p:["Você apareceu por {hábito} três dias seguidos, e isso diz muito sobre como você está se tratando. Cuidar de si não costuma ser feito de grandes gestos, e sim de escolhas pequenas como essa, repetidas.","Se nesses dias houve cansaço, pressa ou pouca energia, e mesmo assim você cumpriu, o mérito é ainda maior. Curta o prêmio com carinho, ele é seu."]},
    {tom:"acolhedor",p:["Começar é a parte que mais pesa, e você já atravessou três dias disso com {hábito}. Quem começa está fazendo algo que muita gente só deixa na intenção.","Respeite o que você construiu. Força de vontade não é um traço fixo, é um músculo, e hoje ele ficou um pouco mais forte. Aproveite o prêmio e sinta orgulho."]},
    {tom:"tcc",p:["Na TCC, a mudança começa pelo comportamento: o que você faz altera o que você pensa sobre si. Em 3 dias de {hábito} você reuniu evidências reais contra aquele pensamento de \"eu não consigo manter nada\".","Isso se chama autoeficácia, a crença na própria capacidade, e ela cresce principalmente com experiências concretas como a sua. Não é discurso, é dado."]},
    {tom:"tcc",p:["Ações pequenas e repetidas, como {hábito}, ajudam a regular o humor, reduzem a sensação de caos e devolvem senso de controle. Em 3 dias você já deu ao seu cérebro um sinal claro de que a rotina está nas suas mãos.","Na TCC isso se chama ativação comportamental: agir primeiro, e deixar o ânimo acompanhar depois. Você não esperou a vontade chegar, e funcionou."]},
    {tom:"tcc",p:["Cada dia de {hábito} é um dado novo sobre quem você é. Três dias já formam um pequeno conjunto de provas, e sua mente começa a revisar uma crença antiga: a de que você não sustenta o que começa.","Na TCC, crenças mudam quando a experiência real as contradiz. Guarde isso, porque você está produzindo essa experiência com as próprias mãos, e é ela que sustenta o que você quer para a sua vida."]},
    {tom:"desafiador",p:["Os três primeiros dias de {hábito} são os mais traiçoeiros, justamente quando a motivação já baixou e a rotina ainda não se firmou. Você atravessou essa fase. Repara que nenhum desses dias precisou ser perfeito, e mesmo assim você apareceu.","Agora o próximo passo é só repetir. Não precisa ser melhor, só precisa acontecer de novo."]},
    {tom:"desafiador",p:["Constância imperfeita vence perfeição que dura um dia. Três dias de {hábito} provam que você sabe aparecer mesmo quando não está a fim, e é essa habilidade que sustenta qualquer mudança.","Não espere o dia ideal para continuar. O dia 4 só pede o que você já fez nos três primeiros."]},
    {tom:"desafiador",p:["A fase de empolgação acabou, e você continuou com {hábito}. É aí que a maioria desiste, e é aí que se separa a vontade de começar da capacidade de manter.","Você acabou de mostrar que tem a segunda. Aproveite o prêmio, mas já vai se preparando: o dia 4 pode vir com a bateria mais baixa, e tudo bem fazer a versão pequena do hábito."]},
    {tom:"leve",p:["Três dias de {hábito}! Seu cérebro acabou de perceber que você fala sério. Ele ainda vai tentar poupar energia (\"hoje não dá\"), mas já tem três provas de que você consegue quando decide.","Isso faz bem pra mente, pro humor e pra imagem que você tem de si mesma. Pega o prêmio, que foi merecido, e bora pro dia 4."]},
    {tom:"leve",p:["Plot twist: você cumpriu {hábito} por três dias seguidos, e energia não cai do céu. Você foi atrás dela e achou.","Autoconfiança subindo, humor agradecendo, cérebro anotando que você é confiável. O prêmio é seu, e o dia 4 já está te esperando."]},
    {tom:"leve",p:["Alerta de conquista: três dias de {hábito}! Seu eu do futuro acabou de mandar um joinha, porque ele sabe quanto trabalho você está poupando dele.","Cada dia cumprido é um depósito na conta da autoconfiança, e você já está com saldo positivo. Pega o prêmio e bora pro próximo."]},
  ],
  7:[
    {tom:"acolhedor",p:["Uma semana inteira de {hábito}. Teve dia fácil e dia difícil, e você cumpriu nos dois. Isso é cuidar de si com consistência, e não é pouca coisa.","Sete dias atrás isso era só uma intenção, e hoje já faz parte da sua semana. Aproveite o prêmio e se permita sentir orgulho do que construiu."]},
    {tom:"acolhedor",p:["Você chegou a uma semana de {hábito} sem precisar de perfeição, só de presença. Essa gentileza com você mesma é o que sustenta qualquer mudança de verdade.","Descanse um pouco na conquista. Você não está correndo atrás de uma versão ideal, está construindo uma rotina que cabe na sua vida, e ela está funcionando."]},
    {tom:"acolhedor",p:["Sete dias cuidando de si com {hábito}. Talvez você ainda não note tudo o que mudou, mas seu corpo e sua mente já estão registrando que existe uma pessoa cuidando deles com regularidade.","Isso traz uma sensação de segurança que vai além do hábito em si. Curta o prêmio e reconheça o seu esforço."]},
    {tom:"tcc",p:["Sete dias de {hábito} mostram à sua mente um padrão, não um acaso. É assim que a autoeficácia se fortalece: repetição com resultado concreto, dia após dia.","A crença de que \"eu não sou constante\" perde força a cada semana como essa. Você está desmontando uma ideia antiga com a evidência mais forte que existe, a sua própria prática."]},
    {tom:"tcc",p:["Uma semana é tempo suficiente para começar a notar efeitos de {hábito} no humor, na energia ou na sensação de controle. Vale reparar no que mudou, mesmo que seja pouco.","Na TCC, registrar essas pequenas mudanças reforça o comportamento, porque o cérebro passa a associar o hábito a uma recompensa real. Perceber o benefício é parte do processo."]},
    {tom:"tcc",p:["Na TCC, aprendemos que o ânimo muitas vezes vem depois da ação, e não antes. Sete dias de {hábito} são a prova de que você não precisou esperar vontade para começar.","Você inverteu a ordem que costuma travar as pessoas, e funcionou. Essa é uma das lições mais úteis para qualquer hábito novo que você quiser criar."]},
    {tom:"desafiador",p:["Uma semana de {hábito} já é muito mais do que intenção. Teve dia de pouca energia e você foi mesmo assim, e é exatamente esse tipo de força que fica.","Agora o desafio é simples: mais uma semana igual a essa. Sem pressa de ser perfeita, só sem deixar a corrente quebrar de vez."]},
    {tom:"desafiador",p:["A empolgação do início já passou, e você continua. Sete dias de {hábito} mostram disciplina de verdade, aquela que aparece quando ninguém está olhando.","A partir daqui, o hábito começa a pedir menos decisão e mais rotina. Segure mais um pouco, porque é nessa transição que se ganha ou se perde a mudança."]},
    {tom:"desafiador",p:["Se um dia ruim aparecer, lembre que você já passou por sete com {hábito}. Um tropeço não apaga uma semana, e uma falha não define o seu caminho.","O que conta é voltar no dia seguinte, sem culpa e sem drama. Você já provou que sabe fazer isso, então use essa prova a seu favor."]},
    {tom:"leve",p:["Sete dias de {hábito}! Seu cérebro já está desconfiado de que isso virou rotina, e a bateria está aprendendo a recarregar.","Sua semana está ganhando de goleada, e a autoconfiança está de camarote. Pega o prêmio, que foi muito bem merecido."]},
    {tom:"leve",p:["Uma semana inteira! Teve dia de bateria baixa, e {hábito} aconteceu mesmo assim. Isso merece medalha, e não é exagero.","Seu cérebro está anotando que você é capaz de se mover até no modo econômico. Prêmio liberado, e aplaudido de pé."]},
    {tom:"leve",p:["Sete dias seguidos de {hábito} e nenhum atestado médico. Meus parabéns, você é oficialmente do tipo que cumpre!","Isso faz bem pra mente, pro humor e pro seu currículo interno de pessoa confiável. Aproveita o prêmio, você mereceu cada dia dessa semana."]},
  ],
  21:[
    {tom:"acolhedor",p:["Vinte e um dias de {hábito}. Três semanas cuidando de você com constância é algo grande. Seu corpo e sua mente já sentem a diferença de ter uma rotina que te sustenta.","Que orgulho, de verdade. Olhe para trás e reconheça tudo o que você enfrentou para chegar até aqui, e aproveite o prêmio sem pressa."]},
    {tom:"acolhedor",p:["Lá no começo, {hábito} pedia esforço a cada dia. Agora, depois de 21 dias, ele provavelmente pesa menos, e isso é fruto direto da sua dedicação.","Celebre com calma e carinho. Você construiu algo que não depende mais só de força de vontade, e isso é um presente que você deu a si mesma."]},
    {tom:"acolhedor",p:["Você prometeu algo a si mesma e sustentou por três semanas. Isso constrói uma confiança que ninguém pode tirar de você, porque ela nasceu da sua própria prática com {hábito}.","Aproveite o prêmio, ele conta uma história de cuidado e constância. Que bom que você escolheu aparecer para si mesma todos os dias."]},
    {tom:"tcc",p:["Vinte e um dias de {hábito} começam a mudar a forma como você se enxerga: de \"alguém que tenta\" para \"alguém que faz\". Na TCC, isso é mudança de crença central, construída por comportamento repetido.","É um tipo de mudança profunda e duradoura, porque não veio de uma promessa, veio de três semanas de evidências que você mesma produziu."]},
    {tom:"tcc",p:["Com a repetição, o cérebro vai automatizando o que antes exigia decisão consciente. Depois de três semanas de {hábito}, é comum que o esforço seja menor do que no início.","A rotina passa a trabalhar a seu favor, e não contra você. Isso libera energia mental para outras coisas, e é um dos grandes benefícios de manter um hábito por tempo suficiente."]},
    {tom:"tcc",p:["Três semanas de {hábito} geram um acervo grande de evidências sobre a sua capacidade. Dá para revisitar aquele pensamento de \"eu não consigo\" e ver o quanto ele já não se sustenta diante dos fatos.","Seus próprios dados respondem por você. Na TCC, é exatamente assim que uma crença limitante perde o poder: sendo confrontada, dia após dia, com a realidade do que você faz."]},
    {tom:"desafiador",p:["Vinte e um dias de {hábito} e você ainda está aqui. A maioria desiste muito antes disso, e você não desistiu. Esses dias são a prova.","Agora é manter, sem pressa e sem culpa se um dia falhar. O hábito agora tem raiz, e raiz se cuida com atenção, não com perfeição."]},
    {tom:"desafiador",p:["O hábito ainda não é eterno, e tudo bem. O que você construiu em 21 dias é uma base sólida, e bases se mantêm com atenção, não com piloto automático total.","Siga com {hábito} como quem cuida de algo valioso. O mais difícil já passou, mas manter também é uma escolha diária, e você já mostrou que sabe fazê-la."]},
    {tom:"desafiador",p:["Três semanas atrás você decidiu começar {hábito}. Hoje você tem 21 provas de que decisão e ação andam juntas no seu caso, e isso não é detalhe.","O próximo marco é só continuar sendo essa pessoa. Você não precisa se reinventar, só precisa não largar o que já provou que funciona."]},
    {tom:"leve",p:["Vinte e um dias de {hábito}! Seu cérebro já parou de negociar e começou a achar normal, o que é sinal de que você venceu a fase chata.","E repara: o que antes pedia uma energia enorme agora pede bem menos. Prêmio mais que merecido, você ganhou no braço."]},
    {tom:"leve",p:["Três semanas, gente! {hábito} deixou de ser projeto e virou parte de você. A energia que faltava no começo foi aparecendo, dia após dia.","Seu cérebro agora acha que isso é normal, e isso é uma ótima notícia para o humor, para a autoconfiança e para o seu futuro eu. Pega o prêmio!"]},
    {tom:"leve",p:["Vinte e um dias seguidos de {hábito}. Se isso fosse série, já estaria renovada para a próxima temporada, com elenco fixo e tudo.","Você é a protagonista dessa história e está entregando episódios consistentes. Aproveita o prêmio, que foi merecido, e segue o roteiro."]},
  ],
};
/* Convite para Gerenciar hábitos: entra no fim da mensagem, no mesmo tom dela */
const CONVITES_MARCO={
  acolhedor:"Agora que essa área está aberta, que tal dar uma olhada em *Gerenciar hábitos*? Talvez exista algo mais que você queira cuidar na sua vida, no seu ritmo.",
  tcc:"Você acabou de reunir evidências de que consegue. Vale entrar em *Gerenciar hábitos* e escolher o próximo comportamento que gostaria de testar, começando por algo pequeno.",
  desafiador:"*Gerenciar hábitos* está desbloqueado. Você já provou que sabe começar e sustentar, então olha lá e escolhe o próximo.",
  leve:"Desbloqueou *Gerenciar hábitos*! Dá uma espiada lá e vê se tem mais alguma coisa que você quer trazer pra sua vida.",
};
/* ===== Revisão de hábitos a cada 90 dias ===== */
const REVISAO_DIAS=90;
function removerHabitoDaLista(hb){
  S.historicoRemovidos[hb.nome]={feitos:{...hb.feitos},premioPego:!!hb.premioPego,meta:{id:hb.id,emoji:hb.emoji,emojis:hb.emojis,unidade:hb.unidade,paraQue:hb.paraQue,grupo:hb.grupo,dims:habDimsDe(hb.nome,hb.id,hb.dims,hb.dimsDefinidas),dimsDefinidas:!!hb.dimsDefinidas}};
  S.habitos=S.habitos.filter(x=>x.id!==hb.id);
  salva();
}
function revisaoDevida(){
  if(!S.habitos||!S.habitos.length)return false;
  const r=S.revisaoHabitos||{};
  if(!r.ultima)return false;
  if(hoje()<fmtD(addDias(new Date(r.ultima+'T12:00:00'),REVISAO_DIAS)))return false;
  if(r.adiarAte&&hoje()<r.adiarAte)return false;
  return true;
}
function renderRevisaoCard(){
  const box=$('revisaoHabitosBox');if(!box)return;
  if(!revisaoDevida()){box.innerHTML='';return;}
  box.innerHTML=`<div class="revisao-card"><div class="rv-k mut">Um momento para você</div><h3>Você também pode mudar. 🌱</h3><p>Há algum tempo, você escolheu algumas práticas para fazer parte da sua vida. Talvez elas continuem fazendo sentido. Talvez você tenha mudado um pouquinho pelo caminho.</p><p>Que tal olhar para elas com carinho? Sem cobranças, sem notas. Você escolhe o que fica.</p><div style="display:flex;flex-direction:column;gap:8px;margin-top:10px"><button class="btn prim btn-full" id="revIniciar">Vamos olhar para meus hábitos</button><button class="btn btn-full" id="revAdiar">Agora não</button></div></div>`;
  $('revIniciar').onclick=()=>abrirRevisaoHabitos();
  $('revAdiar').onclick=()=>{S.revisaoHabitos.adiarAte=fmtD(addDias(new Date(),7));salva();renderRevisaoCard();mostrarToast('Tudo bem, eu te convido de novo em alguns dias');};
}
function abrirRevisaoHabitos(){
  const lista=S.habitos.slice();
  if(!lista.length){mostrarToast('Você ainda não tem hábitos para revisar');return;}
  const cont={manteve:0,ajustou:0,pausou:0,saiu:0};
  const o=$('revisaoModal');
  let i=0;
  const dias90=hb=>{const ini=fmtD(addDias(new Date(),-89));return Object.keys(hb.feitos||{}).filter(x=>x>=ini&&x<=hoje()).length;};
  const dimsTxt=hb=>habDimsDe(hb.nome,hb.id,hb.dims,hb.dimsDefinidas).map(k=>{const d=CICLO_DIMS.find(x=>x.key===k);return d?d.emoji+' '+d.nome:'';}).filter(Boolean);
  const add=(pai,txt,cls,fn)=>{const b=document.createElement('button');b.className='modal-btn '+cls;b.textContent=txt;b.onclick=fn;pai.appendChild(b);};
  const proximo=()=>{i++;passo();};
  function passo(){
    const bt=$('revBotoes');bt.innerHTML='';
    if(i>=lista.length){fim();return;}
    const hb=lista[i];
    const dias=dias90(hb);const dims=dimsTxt(hb);
    $('revEmoji').textContent=hb.emoji||'⭐';
    $('revCorpo').innerHTML=`<div class="mut" style="text-align:center;font-size:12px">Hábito ${i+1} de ${lista.length}</div><div class="modal-pergunta" style="text-align:center;margin:4px 0 6px">${esc(hb.nome)}</div>${hb.pausado?'<p class="mut" style="text-align:center;margin:0 0 6px">Em pausa</p>':''}<p style="text-align:center;margin:0 0 6px">Nos últimos 90 dias, você marcou <b>${dias}</b> ${dias===1?'dia':'dias'}.</p>${dims.length?'<div class="rev-chips">'+dims.map(t=>'<span>'+esc(t)+'</span>').join('')+'</div>':''}<p style="text-align:center;margin:8px 0 0">Isso ainda combina com a vida que você tem hoje?</p>`;
    add(bt,'Manter','prim',()=>{cont.manteve++;proximo();});
    const g=document.createElement('div');g.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:8px';bt.appendChild(g);
    add(g,'Ajustar','sec',()=>abrirHabEditar(hb,()=>{cont.ajustou++;passo();}));
    if(hb.pausado)add(g,'Retomar','sec',()=>{delete hb.pausado;salva();renderHoje();renderHabitos();cont.manteve++;proximo();});
    else add(g,'Pausar','sec',()=>{hb.pausado=true;salva();renderHoje();renderHabitos();cont.pausou++;proximo();});
    add(g,'Deixar ir','sec',()=>{removerHabitoDaLista(hb);renderHoje();renderHabitos();cont.saiu++;proximo();});
    add(g,'Pular','sec',proximo);
    add(bt,'Continuar depois','sec',()=>fecharOverlay(o));
  }
  function fim(){
    S.revisaoHabitos={ultima:hoje(),adiarAte:null};salva();
    const l=[];
    if(cont.manteve)l.push(cont.manteve+(cont.manteve===1?' hábito ficou':' hábitos ficaram'));
    if(cont.ajustou)l.push(cont.ajustou+(cont.ajustou===1?' foi ajustado':' foram ajustados'));
    if(cont.pausou)l.push(cont.pausou+(cont.pausou===1?' ficou em pausa':' ficaram em pausa'));
    if(cont.saiu)l.push(cont.saiu+(cont.saiu===1?' saiu da lista':' saíram da lista'));
    $('revEmoji').textContent='🌱';
    $('revCorpo').innerHTML=`<div class="modal-pergunta" style="text-align:center;margin:4px 0 8px">Pronto. Você escolheu o que fica.</div>${l.length?'<p style="text-align:center;margin:0 0 6px">'+l.join(' · ')+'</p>':''}<p style="text-align:center;margin:0">Os dias que você já marcou continuam sendo seus. Daqui a uns 3 meses eu te convido para olhar de novo.</p>`;
    const bt=$('revBotoes');bt.innerHTML='';
    add(bt,'Fechar','prim',()=>fecharOverlay(o,()=>{renderRevisaoCard();renderHoje();}));
  }
  passo();
  abrirOverlayTopo(o);
}
(function(){const b=$('btnRevisarHabitos');if(b)b.onclick=()=>{$('gerenciarFechar').click();setTimeout(()=>abrirRevisaoHabitos(),450);};})();

/* ===== Editar prêmio (nome, categoria, tamanho) ===== */
function abrirPremioEdit(p){
  migrarPremio(p);$('peNome').value=p.nome||'';$('peCampos').innerHTML=htmlCamposPremio(p);ligarCamposPremio($('peCampos'));
  const o=$('premioEditModal');
  $('peCancelar').onclick=()=>fecharOverlay(o);
  $('peSalvar').onclick=()=>{
    const nome=$('peNome').value.trim();
    if(!nome){mostrarToast('Escreva o nome do prêmio');return;}
    const f=lerCamposPremio($('peCampos'));
    if(f.custo==='planejar'){S.premios=S.premios.filter(x=>x.id!==p.id);S.quandoDer.push({id:'q'+Date.now().toString(36),nome,criadoEm:hoje(),feitoEm:null});salva();renderPremios();renderQuandoDer();fecharOverlay(o);mostrarToast('Movido pra Quando der ✓');return;}
    Object.assign(p,f,{nome});
    salva();renderPremios();fecharOverlay(o);mostrarToast('Prêmio atualizado ✓');
  };
  abrirOverlayTopo(o);
}
const MARCOS={
  3:{tit:'3 dias, hein? Você conseguiu, sua diva!',sub:'Pega esse prêmio aqui e segue brilhando.'},
  7:{tit:'7 dias, mulher! O puro suco do sucesso!',sub:'Isso é que é poder pessoal! Pega esse prêmio aqui e segue brilhando.'},
  21:{tit:'21 dias! Diva master! Está sentindo o gostinho do sucesso já?',sub:'Toma aqui esse prêmio, sua maravilhosa! E segue glamourosa!'}
};
/* total de dias -> tamanho do prêmio (só dispara exatamente no marco; 21 testado primeiro) */
function tierParaTotal(total){return total===21?'G':total===7?'M':total===3?'P':null;}
let marcoEmAndamento=false;
/* Ordem do marco: prêmio, depois a mensagem (com o convite no fim), por último o popup de novo hábito */
let marcoAtual=null;
function tresDiasVaiAparecer(){
  if(!habitoLiberado())return false;
  if(S.ultimoConviteEm&&hoje()<fmtD(addDias(new Date(S.ultimoConviteEm),3)))return false;
  if(!S.habitos.filter(x=>!x.pausado).some(hb=>Object.keys(hb.feitos).length>=3))return false;
  if(S.tresDiasJaMostradoEm===hoje()||S.tresDiasUnicaVez)return false;
  return true;
}
function sortearMensagemMarco(n){
  const lista=MENSAGENS_MARCO[n];
  if(!S.msgMarcoVistas||typeof S.msgMarcoVistas!=='object')S.msgMarcoVistas={};
  let vistas=Array.isArray(S.msgMarcoVistas[n])?S.msgMarcoVistas[n]:[];
  let livres=lista.map((m,i)=>i).filter(i=>!vistas.includes(i));
  if(!livres.length){const ult=vistas[vistas.length-1];vistas=[];livres=lista.map((m,i)=>i).filter(i=>i!==ult);}
  const i=livres[Math.floor(Math.random()*livres.length)];
  vistas.push(i);S.msgMarcoVistas[n]=vistas;salva();
  return lista[i];
}
function abrirMensagemMarco(hb,n,depois){
  const lista=MENSAGENS_MARCO[n];
  if(!lista||!lista.length){depois();return;}
  const m=sortearMensagemMarco(n);
  const fmt=t=>esc(t).replace(/\{hábito\}/g,'<b>“'+esc(hb.nome)+'”</b>').replace(/\*(.+?)\*/g,'<i>$1</i>');
  const convite=''; /* a mensagem de marco só celebra, sem convite para hábito novo */
  $('msgMarcoEmoji').textContent=n===3?'🎉':n===7?'🌟':'👑';
  $('msgMarcoTexto').innerHTML=m.p.map(p=>'<p>'+fmt(p)+'</p>').join('')+(convite?'<div class="msg-convite">'+fmt(convite)+'</div>':'')+extraMarco(hb);
  const o=$('msgMarcoModal');
  const botoes=$('msgMarcoBotoes');botoes.innerHTML='';
  /* se o popup de novo hábito não vai aparecer logo depois, o convite ganha o próprio botão */
  if(convite&&!tresDiasVaiAparecer()){
    const bg=document.createElement('button');bg.className='modal-btn sec';bg.textContent='Abrir Gerenciar hábitos 🌱';
    bg.onclick=()=>fecharOverlay(o,()=>{depois();renderHabitos();abrirOverlay($('gerenciarModal'));});
    botoes.appendChild(bg);
  }
  const bc=document.createElement('button');bc.className='modal-btn prim';bc.textContent='Continuar 💛';
  bc.onclick=()=>fecharOverlay(o,depois);
  botoes.appendChild(bc);
  abrirOverlayTopo(o);
}
function concluirMarco(){
  marcoEmAndamento=false;
  setTimeout(checarTresDias,500);
}
function finalizarMarco(){
  if(!marcoEmAndamento)return;
  const m=marcoAtual;marcoAtual=null;
  if(m&&m.hb&&MENSAGENS_MARCO[m.n]){setTimeout(()=>abrirMensagemMarco(m.hb,m.n,concluirMarco),450);return;}
  concluirMarco();
}
function premiosDoContexto(tam,ctx){
  const sit=sitPorId(ctx);
  return S.premios.filter(p=>p.tamanho===tam&&p.custo!=='planejar'&&premioCabe(migrarPremio(p),sit));
}
let ultimoPremioId=null;
function sortearPremioCtx(tam,ctx,excluirId){
  let l=premiosDoContexto(tam,ctx);
  if(excluirId)l=l.filter(p=>p.id!==excluirId);
  if(!l.length)return null;
  const alt=l.filter(p=>p.id!==ultimoPremioId);
  const pool=alt.length?alt:l;
  const tot=pool.reduce((a,x)=>a+pesoPremio(x),0);let r=Math.random()*tot,p=pool[0];
  for(const x of pool){r-=pesoPremio(x);if(r<=0){p=x;break;}}
  ultimoPremioId=p.id;
  return p;
}
function renderPremios(){$('listaPremios').innerHTML=S.premios.map(p=>`<div class="premio" data-pid="${p.id}"><div style="flex:1"><div class="nm">${esc(p.nome)}</div><div class="tg"><span class="tag">${esc(premioRotuloCabe(migrarPremio(p)))}</span><span class="tag c">${tamNome(p.tamanho)}</span>${p.gratis?'<span class="tag r">grátis</span>':''}</div></div><div class="mut" style="font-size:14px">✏️</div></div>`).join('')||'<div class="mut" style="font-size:12.5px">Nenhum prêmio ainda. Monte seu cardápio pelo seu estilo ou adicione um abaixo.</div>';$('listaPremios').querySelectorAll('.premio').forEach(el=>{el.onclick=()=>{const p=S.premios.find(x=>x.id===el.dataset.pid);if(p)abrirPremioEdit(p);};});}

/* ---- popup de contexto (3, 7 e prêmio de 21 dias pelo Gerenciar) ---- */
function abrirContextoPremio(n,onEscolher){
  const M=MARCOS[n];
  $('marcoEmoji').textContent=n===3?'🎉':n===7?'🌟':'👑';
  $('marcoTitulo').textContent=M.tit;
  $('marcoSub').textContent=M.sub;
  botoesSituacao($('marcoBotoes'),'modal-btn prim','modal-btn sec',k=>fecharOverlay($('marcoModal'),()=>onEscolher(k)));
  abrirOverlayTopo($('marcoModal'));
}
/* ---- não achou prêmio: cria um agora ---- */
function abrirNovoPremio(tier,ctx,onShow,onCancel){
  $('npTitulo').textContent='Não tenho prêmio '+tamNome(tier)+' pra "'+sitRotulo(sitPorId(ctx))+'". Cria um agora e ele fica salvo pra próxima.';
  $('npNome').value='';$('npGratis').checked=false;
  const o=$('novoPremioModal');
  $('npCancelar').onclick=()=>fecharOverlay(o,()=>{if(onCancel)onCancel();});
  $('npSalvar').onclick=()=>{
    const nome=$('npNome').value.trim();
    if(!nome){mostrarToast('Escreva o nome do prêmio');return;}
    const sit=sitPorId(ctx)||{};const g=!!$('npGratis').checked;
    const p=premioNovo({nome,tamanho:tier,gratis:g,custo:g?'gratis':'pequeno',cabe:sit.tag?[sit.tag]:TUDO,dur:sit.durMax&&sit.durMax<60?sit.durMax:(tier==='P'?5:tier==='M'?15:30),estilo:estiloDoPremio(nome)});
    S.premios.push(p);ultimoPremioId=p.id;salva();renderPremios();
    fecharOverlay(o,()=>onShow(p));
  };
  $('npNome').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();$('npSalvar').click();}};
  abrirOverlayTopo(o);
  setTimeout(()=>{const i=$('npNome');if(i)i.focus();},300);
}
function procurarPremio(tier,ctx,onShow,onCancel){
  const p=sortearPremioCtx(tier,ctx,null);
  if(p){onShow(p);return;}
  abrirNovoPremio(tier,ctx,onShow,onCancel);
}
function abrirMarco(hb,n){
  marcoEmAndamento=true;marcoAtual={hb,n};
  if(n===21){abrirFesta(hb);return;}
  const tier=tierParaTotal(n);
  abrirContextoPremio(n,ctx=>procurarPremio(tier,ctx,p=>mostrarPremioModal(p,{tier,ctx}),()=>{marcoAtual=null;finalizarMarco();}));
}

/* ---- prêmio na tela ---- */
let premioAnim=null,premioAtual=null;
function fecharPremioModal(){
  const o=$('premioModal');
  if(premioAnim){premioAnim.parar();premioAnim=null;}
  o.classList.remove('ativo');
  setTimeout(()=>{o.hidden=true;if(!document.querySelector('.modal-overlay.ativo,.rel-overlay.ativo,.festa-overlay.ativo,.onb-overlay.ativo'))document.body.style.overflow='';},400);
  finalizarMarco();
}
function mostrarPremioModal(premio,info){
  som('caixinha');
  premioAtual=premio;const overlay=$('premioModal');const canvas=$('premioCanvas');
  $('premioModalNome').textContent=premio.nome;
  const tags=[`<span class="premio-tag">${esc(premioRotuloCabe(migrarPremio(premio)))}</span>`,`<span class="premio-tag">${tamNome(premio.tamanho)}</span>`];
  if(premio.gratis)tags.push(`<span class="premio-tag dourada">✨ grátis</span>`);
  $('premioModalTags').innerHTML=tags.join('');
  const temOutro=!!info&&premiosDoContexto(info.tier,info.ctx).some(p=>p.id!==premio.id);
  $('premioModalBotoes').innerHTML=(temOutro?`<button class="premio-btn sec" id="premioOutro">🎲 Outro</button>`:'')+`<button class="premio-btn sec" id="premioGuardar">🕒 Guardar pra depois</button><button class="premio-btn" id="premioOk">Usar agora 💛</button>`;
  if(temOutro)$('premioOutro').onclick=()=>{premioAprender(premio,false);const p2=sortearPremioCtx(info.tier,info.ctx,premio.id);if(!p2)return;mostrarPremioModal(p2,info);confete(['🎁','✨','💫']);};
  $('premioGuardar').onclick=()=>{premioAprender(premio,true);abrirGuardar(premio,info,fecharPremioModal);};
  $('premioOk').onclick=()=>{premioAprender(premio,true);fecharPremioModal();};
  overlay.hidden=false;requestAnimationFrame(()=>overlay.classList.add('ativo'));document.body.style.overflow='hidden';
  if(premioAnim)premioAnim.parar();premioAnim=iniciarFogos(canvas);confete(['🎁','✨','💛','💜']);
}

/* ---- guardar pra depois ---- */
function abrirGuardar(premio,info,depois){
  $('guardarNome').textContent=premio.nome;$('guardarHora').value='';
  const o=$('guardarModal');
  $('guardarCancelar').onclick=()=>fecharOverlay(o);
  $('guardarSalvar').onclick=()=>{
    const hora=$('guardarHora').value||'';
    if(!Array.isArray(S.premiosGuardados))S.premiosGuardados=[];
    S.premiosGuardados.push({id:'pg'+Date.now().toString(36)+Math.random().toString(36).slice(2,4),nome:premio.nome,tamanho:premio.tamanho,gratis:!!premio.gratis,ctx:(info&&info.ctx)||((situacoes()[situacoes().length-1]||{}).id),hora,dia:hoje()});
    salva();renderCelebrar();renderHoje();
    fecharOverlay(o,()=>{if(depois)depois();mostrarToast(hora?'Guardado para as '+hora+' ✓':'Guardado em Celebrar ✓');});
  };
  abrirOverlayTopo(o);
}
function renderPremiosGuardados(){
  const el=$('premiosGuardadosBox');if(!el)return;
  const l=S.premiosGuardados||[];
  if(!l.length){el.innerHTML='<div class="mut" style="font-size:12.5px;line-height:1.5">Nada guardado por agora. Quando um prêmio chegar, você pode usar na hora ou guardar pra depois.</div>';return;}
  el.innerHTML=l.map(g=>`<div class="premio" style="flex-wrap:wrap"><div style="flex:1;min-width:0"><div class="nm">🎁 ${esc(g.nome)}</div><div class="tg"><span class="tag">${esc(sitRotulo(sitPorId(g.ctx))||'guardado')}</span><span class="tag c">${tamNome(g.tamanho)}</span>${g.gratis?'<span class="tag r">grátis</span>':''}${g.hora?`<span class="tag pausado">🕒 ${esc(g.hora)}</span>`:''}</div></div><div style="display:flex;gap:6px;flex-wrap:wrap;width:100%;margin-top:6px"><button class="btn prim" data-pg-usar="${esc(g.id)}" style="flex:1">Usar</button><button class="btn" data-pg-trocar="${esc(g.id)}" style="flex:1">Trocar por outro</button><button class="btn fant" data-pg-rm="${esc(g.id)}">apagar</button></div></div>`).join('');
  el.querySelectorAll('[data-pg-usar]').forEach(b=>{b.onclick=()=>usarPremioGuardado(b.dataset.pgUsar);});
  el.querySelectorAll('[data-pg-trocar]').forEach(b=>{b.onclick=()=>{
    const g=(S.premiosGuardados||[]).find(x=>x.id===b.dataset.pgTrocar);if(!g)return;
    const cand=premiosDoContexto(g.tamanho,g.ctx).filter(p=>p.nome!==g.nome);
    if(!cand.length){mostrarToast('Não tem outro desse tamanho pra esse momento');return;}
    const p=cand[Math.floor(Math.random()*cand.length)];
    g.nome=p.nome;g.gratis=!!p.gratis;
    salva();renderCelebrar();renderHoje();mostrarToast('Trocado ✓');
  };});
  el.querySelectorAll('[data-pg-rm]').forEach(b=>{b.onclick=()=>{
    S.premiosGuardados=(S.premiosGuardados||[]).filter(x=>x.id!==b.dataset.pgRm);
    salva();renderCelebrar();renderHoje();
  };});
}
function usarPremioGuardado(id){
  const g=(S.premiosGuardados||[]).find(x=>x.id===id);if(!g)return;
  S.premiosGuardados=S.premiosGuardados.filter(x=>x.id!==id);
  salva();confete(['🎁','✨','💛']);mostrarToast('Aproveita! 💛');
  renderCelebrar();renderHoje();
}
function htmlPremiosHoje(){
  const agora=new Date();const hhmm=pad2(agora.getHours())+':'+pad2(agora.getMinutes());
  const due=(S.premiosGuardados||[]).filter(g=>g.hora&&(hoje()>g.dia||hhmm>=g.hora));
  if(!due.length)return '';
  return '<h2>Prêmio guardado</h2>'+due.map(g=>`<div class="premio"><div style="flex:1;min-width:0"><div class="nm">🎁 ${esc(g.nome)}</div><div class="tg"><span class="tag">${esc(sitRotulo(sitPorId(g.ctx))||'guardado')}</span><span class="tag c">${tamNome(g.tamanho)}</span><span class="tag pausado">🕒 ${esc(g.hora)}</span></div></div><button class="btn prim" data-pg-usar="${esc(g.id)}">Usar</button></div>`).join('');
}

