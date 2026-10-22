/* ============ HOJE ============ */
function ultimoMenorPasso(){
  const ds=S.leiAtracao.desejos||[];
  let ult=null;
  ds.forEach(d=>{
    const lista=Array.isArray(d.menorPassos)&&d.menorPassos.length?d.menorPassos:(d.menorPasso&&d.menorPasso.texto?[d.menorPasso]:[]);
    lista.forEach(mp=>{
      if(mp&&mp.texto&&mp.criadoEm){
        if(!ult||mp.criadoEm>ult.criadoEm){
          ult={texto:mp.texto,criadoEm:mp.criadoEm,desejoId:d.id,desejoTexto:d.texto};
        }
      }
    });
  });
  return ult;
}
function renderMenorPassoHoje(){
  const box=$('menorPassoHojeBox');if(!box)return;
  const ult=ultimoMenorPasso();
  if(!ult){box.innerHTML='';return;}
  const naFilaSug=(S.habitosSugestoes||[]).some(s=>s.texto===ult.texto||s.desejoId===ult.desejoId);
  const dObj=(S.leiAtracao.desejos||[]).find(x=>x.id===ult.desejoId);
  const naFilaMp=!!(dObj&&((dObj.menorPasso&&dObj.menorPasso.naFila)||(dObj.menorPassos||[]).some(m=>m.naFila&&(m.texto===ult.texto||m.textoFila===ult.texto))));
  const naFila=naFilaSug||naFilaMp;
  const jaHabito=(S.habitos||[]).some(h=>h.nome===ult.texto);
  /* some da tela principal quando já foi pra fila ou já é hábito */
  if(jaHabito||naFila){box.innerHTML='';return;}
  const d=new Date(ult.criadoEm+'T12:00:00');
  const diasAtras=Math.floor((new Date(hoje())-d)/86400000);
  const quando=diasAtras===0?'hoje':diasAtras===1?'ontem':diasAtras+' dias atrás';
  const cta=`<div class="cta">
      <button type="button" class="btn prim" id="mpVirarHabito">＋ Virar hábito</button>
      <button type="button" class="btn" id="mpAbrirDesejo">Ver desejo</button>
    </div>`;
  box.innerHTML=`<div class="mp-card" id="mpCard">
    <div class="lbl">🌱 O último menor passo que você escreveu</div>
    <div class="txt">${esc(ult.texto)}</div>
    <div class="meta">${quando} · veio do desejo "${esc(ult.desejoTexto)}"</div>
    ${cta}
  </div>`;
  const btnH=$('mpVirarHabito');
  if(btnH)btnH.onclick=e=>{
    e.stopPropagation();
    const d=(S.leiAtracao.desejos||[]).find(x=>x.id===ult.desejoId);
    if(!d){avisar('Desejo não encontrado.');return;}
    virarDesejoEmHabito(d, ult.texto);
  };
  const btnD=$('mpAbrirDesejo');
  if(btnD)btnD.onclick=e=>{
    e.stopPropagation();
    trocaAba('atracao');
    setTimeout(()=>abrirDesejo(ult.desejoId),400);
  };
}

/* ============ ÍCONES DOS HÁBITOS ============ */
const ICONES_HAB=['batom','risada','agua','lua','frasco','atracao','nota','micro','livro','lotus','vento','haltere','pegadas','vassoura','prato','pote','casa','relato','coracao','vela','broto','alvo','comemora','lapis'];
const EMOJI_ICONE={'💄':'batom','💋':'batom','😄':'risada','😂':'risada','🤣':'risada','😊':'risada','💧':'agua','🥤':'agua','🌙':'lua','🧴':'frasco','💆':'frasco','✨':'atracao','⭐':'atracao','💫':'atracao','🎵':'nota','🎶':'nota','🎤':'micro','📖':'livro','📚':'livro','🧘':'lotus','🌬️':'vento','💪':'haltere','🚶':'pegadas','🏃':'pegadas','🧹':'vassoura','🍽️':'prato','🍱':'pote','💬':'relato','🏠':'casa','🏡':'casa','💛':'coracao','💜':'coracao','❤️':'coracao','🕯️':'vela','🌱':'broto','🎯':'alvo','🎉':'comemora','✍️':'lapis','📝':'lapis','🎨':'paleta','🎧':'nota','💃':'pegadas','📷':'olho','🧶':'paleta','🍳':'prato','🧸':'coracao','💊':'frasco','☕':'xicara','🌤️':'hoje','🍷':'prato','🤝':'pessoas','🗓️':'calendario','🫖':'xicara','🤍':'coracao'};
const svgIc=n=>`<svg class="ic"><use href="#i-${n}"/></svg>`;
function iconePorEmoji(e){const n=EMOJI_ICONE[(e||'').trim()];return n?svgIc(n):esc(e||'⭐');}
function iconeHab(hb){
  if(hb.icone==='emoji')return esc(hb.emoji||'⭐');
  if(hb.icone&&ICONES_HAB.includes(hb.icone))return svgIc(hb.icone);
  return iconePorEmoji(hb.emoji);
}
function renderHoje(){
  try{renderRevisaoCard();}catch(e){}
  $('data').textContent=new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'});
  if(S.onboarding.nome)$('subSaudacao').textContent=S.onboarding.nome+', você está em processo de ficar bem.';
  const h=hoje();
  const ativos=S.habitos.filter(hb=>!hb.pausado);
  const mapaGrupos={};
  ativos.forEach(hb=>{const g=grupoDe(hb);if(!mapaGrupos[g])mapaGrupos[g]=[];mapaGrupos[g].push(hb);});
  const ordemGrupos=todosGrupos().map(g=>g.id);
  const gruposUsados=Object.keys(mapaGrupos).sort((a,b)=>ordemGrupos.indexOf(a)-ordemGrupos.indexOf(b));
  $('gruposHoje').innerHTML=gruposUsados.length?gruposUsados.map(gId=>{
    const meta=todosGrupos().find(g=>g.id===gId)||{emoji:'✨',nome:gId};
    const bolinhas=mapaGrupos[gId];
    const fechado=S.ui.gruposFechados.includes(gId);
    const feitos=bolinhas.filter(hb=>hb.feitos[h]).length;
    const total=bolinhas.length;
    const bolinhasHTML=bolinhas.map(hb=>{
      const on=!!hb.feitos[h];
      const feitosHb=Object.keys(hb.feitos).length;
      const completo=feitosHb>=21;
      return`<button class="bol ${hb.cor||'c1'} ${on?'feito':''} ${completo?'marca-21':''}" data-hab="${hb.id}"><span class="ic">${iconeHab(hb)}</span><span class="nm">${esc(hb.nome)}</span><span class="prog">${feitosHb>21?feitosHb+' dias':feitosHb+' de 21'}</span></button>`;
    }).join('');
    return`<details class="grupo-card" data-grupo="${gId}" ${fechado?'':'open'}><summary><span class="grupo-emoji">${iconePorEmoji(meta.emoji)}</span><span class="grupo-nome">${esc(meta.nome)}</span><span class="grupo-badge">${feitos}/${total}</span></summary><div class="grupo-conteudo"><div class="bolinhas-grid">${bolinhasHTML}</div></div></details>`;
  }).join(''):(S.habitos.length?`<div class="aviso">Nenhum hábito ativo. Abra Gerenciar hábitos pra adicionar.</div>`:`<div class="aviso">Sua lista está em branco, e tudo bem. Quando quiser, abra Gerenciar hábitos e escolha o primeiro.</div>`);
  document.querySelectorAll('#gruposHoje .bol').forEach(b=>{
    let timer=null,segurou=false,x0=0,y0=0;
    const cancela=()=>{clearTimeout(timer);timer=null;};
    b.addEventListener('pointerdown',e=>{
      segurou=false;x0=e.clientX;y0=e.clientY;cancela();
      timer=setTimeout(()=>{
        segurou=true;timer=null;
        try{if(navigator.vibrate)navigator.vibrate(30);}catch(_){}
        const hb=S.habitos.find(x=>x.id===b.dataset.hab);if(hb)abrirHabMenu(hb);
      },600);
    });
    b.addEventListener('pointermove',e=>{if(timer&&(Math.abs(e.clientX-x0)>10||Math.abs(e.clientY-y0)>10))cancela();});
    ['pointerup','pointerleave','pointercancel'].forEach(t=>b.addEventListener(t,cancela));
    b.addEventListener('contextmenu',e=>e.preventDefault());
    b.onclick=()=>{if(segurou){segurou=false;return;}toggleHabito(b.dataset.hab);};
  });
  $('dicaRemover').textContent=ativos.length?'Toque e segure uma bolinha para editar, mover de categoria, pausar ou excluir.':'';
  document.querySelectorAll('#gruposHoje .grupo-card').forEach(card=>{card.ontoggle=()=>{const gId=card.dataset.grupo;const set=new Set(S.ui.gruposFechados);if(card.open)set.delete(gId);else set.add(gId);S.ui.gruposFechados=Array.from(set);salva();};});
  const agora=new Date();const hhmm=pad2(agora.getHours())+':'+pad2(agora.getMinutes());
  const lem=(S.lembretes||[]).filter(l=>hhmm>=l.hora);
  $('lembretesHoje').innerHTML=(lem.length?'<h2>Lembretes</h2>'+lem.map(l=>`<div class="card2">💭 ${esc(l.frase)}</div>`).join(''):'')+htmlPremiosHoje();$('lembretesHoje').onclick=e=>{const b=e.target.closest('[data-pg-usar]');if(b)usarPremioGuardado(b.dataset.pgUsar);};
  atualizaStatusCheckin();renderCheckinResumos();renderMenorPassoHoje();renderRelatoLembrete();
}
function toggleHabito(id){
  const hb=S.habitos.find(x=>x.id===id);if(!hb)return;
  const h=hoje();
  if(hb.feitos[h]){confete(hb.emojis);if(FRASES_HABITO[id])mostrarFraseHabito(id);else frase();mostrarToast('Marcado hoje ✓','Desmarcar',()=>desmarcarHabito(hb,h));return;}
  const lacunaRelato=relatoLacuna(hb,h);
  hb.feitos[h]=true;confete(hb.emojis);som('plim');
  if(FRASES_HABITO[id])mostrarFraseHabito(id);else frase();
  const total=Object.keys(hb.feitos).length;
  const tierMarco=tierParaTotal(total);
  let disparou=false;
  if(tierMarco){
    if(!hb.marcos)hb.marcos={};
    const jaFoi=hb.marcos[total]||(total===21&&hb.festejou21);
    if(!jaFoi){hb.marcos[total]=true;if(total===21)hb.festejou21=true;disparou=true;}
  }
  // Ao completar 3 dias no hábito que travava a fila, libera o próximo
  if(total>=3&&S.habitoTravaId&&hb.id===S.habitoTravaId){
    S.proximoHabitoEm=null;S.habitoTravaId=null;
  } else if(total>=3&&!S.habitoTravaId&&S.proximoHabitoEm){
    // legado sem travaId
    S.proximoHabitoEm=null;
  }
  salva();renderHoje();renderHabitos();abasAtualizar(false);
  let ocupado=false;
  if(disparou){marcoEmAndamento=true;ocupado=true;setTimeout(()=>abrirMarco(hb,total),550);}
  else if(total===1&&celebraDeveConvidar()){ocupado=true;setTimeout(abrirCelebraConvite,800);}
  else ocupado=relatoAoMarcar(hb,lacunaRelato);
  if(!disparou)mostrarToast(celebraToastTexto(),'Desfazer',()=>desmarcarHabito(hb,h));
  if(!ocupado)checarTresDias();
}

/* ============ SONS (Web Audio, gerados no código, sem arquivos) ============ */
let somCtx=null;
function somLigado(){return !(S.sons&&S.sons.ligado===false);}
function somContexto(){
  try{
    if(!somCtx){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;somCtx=new AC();somCarregar(somCtx);}
    if(somCtx.state==='suspended')somCtx.resume();
    return somCtx;
  }catch(e){return null;}
}
/* sons versão 4: gravados em audio/sons/. Se um arquivo não carregar (ex.: app aberto offline), usa o som gerado abaixo */
const SOM_ARQ={plim:'audio/sons/plim.mp3',guardado:'audio/sons/guardado.mp3',caixinha:'audio/sons/caixinha.mp3',brilho:'audio/sons/brilho.mp3'};
const somBuf={};let somCarregou=false;
function somCarregar(ctx){
  if(somCarregou||!window.fetch)return;somCarregou=true;
  Object.keys(SOM_ARQ).forEach(n=>{
    fetch(SOM_ARQ[n]).then(r=>r.ok?r.arrayBuffer():Promise.reject())
      .then(ab=>new Promise((ok,ko)=>ctx.decodeAudioData(ab,ok,ko)))
      .then(b=>{somBuf[n]=b;}).catch(()=>{});
  });
}
/* desbloqueia o áudio no primeiro toque (exigência do iPhone/Chrome) */
document.addEventListener('pointerdown',function desbloq(){if(somLigado())somContexto();document.removeEventListener('pointerdown',desbloq);},{once:true});
/* tom macio, tipo piano abafado / marimba de madeira: ataque suave, poucos harmônicos, filtro passa-baixa */
function somSino(ctx,dest,freq,t0,dur,vol,brilho){
  const f=ctx.createBiquadFilter();f.type='lowpass';f.frequency.value=brilho||2200;f.Q.value=0.4;f.connect(dest);
  const g=ctx.createGain();g.connect(f);
  g.gain.setValueAtTime(0.0001,t0);
  g.gain.exponentialRampToValueAtTime(vol,t0+0.022);
  g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
  const o1=ctx.createOscillator();o1.type='sine';o1.frequency.setValueAtTime(freq,t0);o1.connect(g);
  const g2=ctx.createGain();g2.gain.value=0.07;g2.connect(g);
  const o2=ctx.createOscillator();o2.type='triangle';o2.frequency.setValueAtTime(freq*2,t0);o2.connect(g2);
  o1.start(t0);o2.start(t0);o1.stop(t0+dur+0.05);o2.stop(t0+dur*0.4);
}
/* um pouco de ar em volta: eco curto e escuro */
function somEspaco(ctx,dest){
  const ent=ctx.createGain();ent.connect(dest);
  const d=ctx.createDelay(1);d.delayTime.value=0.19;
  const fb=ctx.createGain();fb.gain.value=0.22;
  const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1400;
  const wet=ctx.createGain();wet.gain.value=0.28;
  ent.connect(d);d.connect(lp);lp.connect(fb);fb.connect(d);lp.connect(wet);wet.connect(dest);
  return ent;
}
const SONS={
  /* marcar hábito: uma nota só, com a quinta bem de leve */
  plim:{vib:10,tocar(ctx,out,t){somSino(ctx,out,587.33,t,0.9,0.5);somSino(ctx,out,880,t+0.012,0.7,0.12);}},
  /* guardar: um toque curto e grave, como fechar um caderno */
  guardado:{vib:8,tocar(ctx,out,t){somSino(ctx,out,440,t,0.45,0.38,1500);somSino(ctx,out,587.33,t+0.01,0.35,0.1,1500);}},
  /* prêmio / comemoração: acorde quente, quase junto */
  caixinha:{vib:[10,40,12],tocar(ctx,out,t){[587.33,739.99,880,1174.66].forEach((f,i)=>somSino(ctx,out,f,t+i*0.028,1.5,i===3?0.12:0.28));}},
  /* 21 dias: acorde que se abre devagar, com um brilho discreto em cima */
  brilho:{vib:[12,60,12,60,20],tocar(ctx,out,t){
    [293.66,440,587.33,739.99,880].forEach((f,i)=>somSino(ctx,out,f,t+i*0.07,2.3,i===0?0.22:0.2,1800));
    [1174.66,1479.98].forEach((f,i)=>somSino(ctx,out,f,t+0.45+i*0.12,1.6,0.05,3000));}}
};
function som(nome){
  const s=SONS[nome];if(!s||!somLigado())return;
  try{if(navigator.vibrate)navigator.vibrate(s.vib);}catch(e){}
  const ctx=somContexto();if(!ctx)return;
  try{
    if(somBuf[nome]){                               // versão 4 (arquivo), já com reverb próprio
      const src=ctx.createBufferSource();src.buffer=somBuf[nome];
      const g=ctx.createGain();g.gain.value=1;src.connect(g);g.connect(ctx.destination);
      src.start(ctx.currentTime+0.01);return;
    }
    const out=ctx.createGain();out.gain.value=0.3;   // volume geral baixo
    out.connect(ctx.destination);
    s.tocar(ctx,somEspaco(ctx,out),ctx.currentTime+0.01);
  }catch(e){}
}
/* ============ RELATOS: "Como o hábito de X deixa o seu dia melhor?" ============
   Passo 1: dados + regra de frequência. A tela da pergunta entra no passo 2. */
const RELATO_PONTOS=[2,7,21];        // dias marcados em que a pergunta de rotina aparece
const RELATO_VOLTA_DIAS=3;           // voltou a marcar depois de 3+ dias parados
const RELATO_MAX_SEMANA=2;           // somando todos os hábitos
const RELATO_TETO=5;                 // relatos guardados por hábito; depois só mostra as frases
const RELATO_DESCANSO_DIAS=14;       // 2 pulos seguidos → hábito descansa
const RELATO_PRETERITO={dei:'dar',fiz:'fazer',fui:'ir',tive:'ter',pus:'pôr',vi:'ver',li:'ler',
  comi:'comer',bebi:'beber',dormi:'dormir',corri:'correr','saí':'sair',escrevi:'escrever',
  fiquei:'ficar',cheguei:'chegar',joguei:'jogar',toquei:'tocar',pratiquei:'praticar',
  disse:'dizer',trouxe:'trazer',quis:'querer',pude:'poder',soube:'saber',estive:'estar'};
function relatoAcaoSugerida(nome){
  let s=String(nome||'').trim();if(!s)return '';
  const m=s.match(/^([a-záàâãéêíóôõúç]+)\b([\s\S]*)$/i);
  if(m){
    const v=m[1].toLowerCase(),resto=m[2];
    let inf=RELATO_PRETERITO[v]||null;
    if(!inf&&/ei$/.test(v)&&v.length>3){                 // passei→passar, arrumei→arrumar
      const raiz=v.slice(0,-2);
      inf=raiz.endsWith('qu')?raiz.slice(0,-2)+'car':raiz.endsWith('gu')?raiz.slice(0,-2)+'gar':raiz.endsWith('c')?raiz.slice(0,-1)+'çar':raiz+'ar';
    }
    if(inf)s=inf+resto;
    else s=paraInfinitivoSugestao(s);
  }
  return s.charAt(0).toLowerCase()+s.slice(1);
}
function acaoDoHabito(hb){return (hb&&hb.acao&&hb.acao.trim())||relatoAcaoSugerida(hb&&hb.nome);}
/* dias entre o último dia marcado antes de hoje e hoje (null se é o primeiro) */
function relatoLacuna(hb,dia){
  const antes=Object.keys(hb.feitos||{}).filter(d=>d<dia).sort();
  if(!antes.length)return null;
  return Math.round((new Date(dia+'T12:00:00')-new Date(antes[antes.length-1]+'T12:00:00'))/86400000);
}
function relatoUteis(hb){return (hb.relatos||[]).filter(r=>!r.naoPercebi&&(r.texto||'').trim());}
function relatoLimiteGlobalOk(){
  const log=(S.relatos&&S.relatos.log)||[];const h=hoje();
  if(log.includes(h))return false;
  const ini=fmtD(addDias(new Date(),-6));
  return log.filter(d=>d>=ini&&d<=h).length<RELATO_MAX_SEMANA;
}
/* Decide se este hábito deve perguntar agora. Retorna null ou {tipo:'rotina',ponto} / {tipo:'volta',lacuna} */
function relatoMotivo(hb,lacuna){
  if(!hb||hb.pausado)return null;
  if(!Array.isArray(hb.relatos))hb.relatos=[];
  if(!Array.isArray(hb.relatoRotina))hb.relatoRotina=[];
  if(relatoUteis(hb).length>=RELATO_TETO)return null;
  if(hb.relatoDescansoAte&&hoje()<hb.relatoDescansoAte)return null;
  if(!relatoLimiteGlobalOk())return null;
  const total=Object.keys(hb.feitos||{}).length;
  const ponto=RELATO_PONTOS.find(p=>p<=total&&!hb.relatoRotina.includes(p));
  if(ponto)return{tipo:'rotina',ponto};          // ponto atrasado (ex: dia de marco) fica pro próximo toque
  if(lacuna!==null&&lacuna>RELATO_VOLTA_DIAS)return{tipo:'volta',lacuna};
  return null;
}
function relatoConsumir(hb,motivo){
  if(motivo&&motivo.tipo==='rotina'){
    // consome este ponto e qualquer outro já ultrapassado
    const total=Object.keys(hb.feitos||{}).length;
    RELATO_PONTOS.filter(p=>p<=total).forEach(p=>{if(!hb.relatoRotina.includes(p))hb.relatoRotina.push(p);});
  }
}
/* Chamado pela tela (passo 2) quando ela responde */
function relatoGuardar(hb,motivo,texto,chips,naoPercebi){
  if(!Array.isArray(hb.relatos))hb.relatos=[];
  hb.relatos.push({
    id:'r'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),
    data:hoje(),
    dia:Object.keys(hb.feitos||{}).length,
    texto:(texto||'').trim(),
    chips:Array.isArray(chips)?chips.slice():[],
    naoPercebi:!!naoPercebi,
    motivo:motivo?motivo.tipo:'rotina'
  });
  hb.relatoPulos=0;
  relatoConsumir(hb,motivo);
  S.relatos.log.push(hoje());
  if(S.relatos.log.length>60)S.relatos.log=S.relatos.log.slice(-60);
  salva();
}
/* Chamado pela tela (passo 2) no "Agora não": não consome o ponto; 2 seguidos → descanso */
function relatoPular(hb,motivo){
  hb.relatoPulos=(hb.relatoPulos||0)+1;
  S.relatos.log.push(hoje());
  if(hb.relatoPulos>=2){
    hb.relatoPulos=0;
    relatoConsumir(hb,motivo);
    hb.relatoDescansoAte=fmtD(addDias(new Date(),RELATO_DESCANSO_DIAS));
  }
  salva();
}
let relatoAgendado=null;   // {hbId,motivo} — a tela do passo 2 lê daqui
/* ---------- tela da pergunta ---------- */
let relatoCtx=null;
function relatoPergunta(hb){return 'Vem cá… o hábito de '+acaoDoHabito(hb)+' está fazendo diferença na sua vida?';}
function relatoPerguntaAberta(hb){return 'O lado bom de '+acaoDoHabito(hb)+' é que…';}
function relatoLimpar(t){let s=String(t||'').trim().replace(/[.!…\s]+$/,'');return s?s.charAt(0).toLowerCase()+s.slice(1):'';}
function relatoAoMarcar(hb,lacuna){
  const motivo=relatoMotivo(hb,lacuna);
  if(!motivo)return false;
  relatoAgendado={hbId:hb.id,motivo};
  setTimeout(()=>abrirRelato(hb,motivo),800);
  return true;
}
function abrirRelato(hb,motivo){
  relatoCtx={hb,motivo,respondeu:false};
  $('relatoEmoji').textContent=hb.emoji||'🌱';
  const intro=motivo&&motivo.tipo==='volta'?'<p class="mut" style="font-size:13px;margin:0 0 8px">Que bom que você voltou. 💛</p>':'';
  $('relatoCorpo').innerHTML=intro+`<div class="modal-pergunta">${esc(relatoPergunta(hb))}</div>`;
  const b=$('relatoBotoes');b.innerHTML='';
  const linha=document.createElement('div');linha.className='modal-botoes';
  const bn=document.createElement('button');bn.className='modal-btn sec';bn.textContent='Ainda não';bn.onclick=relatoAindaNao;
  const bs=document.createElement('button');bs.className='modal-btn prim';bs.textContent='Sim';bs.onclick=relatoSim;
  linha.appendChild(bn);linha.appendChild(bs);b.appendChild(linha);
  const bp=document.createElement('button');bp.className='btn fant';bp.style.cssText='display:block;margin:10px auto 0';bp.textContent='agora não';bp.onclick=relatoAgoraNao;
  b.appendChild(bp);
  abrirOverlayTopo($('relatoModal'));
}
function relatoSim(){
  const {hb}=relatoCtx;
  $('relatoCorpo').innerHTML=`<div class="modal-pergunta">${esc(relatoPerguntaAberta(hb))}</div>
    <textarea id="relatoTxt" placeholder="ex: fico mais disposta pra começar o dia" style="min-height:80px;margin-top:6px"></textarea>
    <p class="mut" style="font-size:11.5px;line-height:1.5;margin-top:6px;text-align:left">Do seu jeito, com as suas palavras. Isso vira a sua declaração.</p>`;
  const b=$('relatoBotoes');b.innerHTML='';
  const linha=document.createElement('div');linha.className='modal-botoes';
  const bv=document.createElement('button');bv.className='modal-btn sec';bv.textContent='Voltar';bv.onclick=()=>abrirRelato(hb,relatoCtx.motivo);
  const bg=document.createElement('button');bg.className='modal-btn prim';bg.textContent='Guardar';
  bg.onclick=()=>{
    const t=($('relatoTxt').value||'').trim();
    if(!t){mostrarToast('Escreve uma frasezinha, ou toque em Voltar');return;}
    relatoGuardar(hb,relatoCtx.motivo,t,[],false);relatoCtx.respondeu=true;
    confete(['💬','✨','💛']);som('guardado');
    relatoFechar(()=>mostrarToast('Guardado ✓','Ver suas frases',()=>abrirRelatosHab(hb)));
  };
  linha.appendChild(bv);linha.appendChild(bg);b.appendChild(linha);
  setTimeout(()=>{const i=$('relatoTxt');if(i)i.focus();},250);
}
function relatoAindaNao(){
  const {hb,motivo}=relatoCtx;
  relatoGuardar(hb,motivo,'',[],true);relatoCtx.respondeu=true;
  const nNao=(hb.relatos||[]).filter(r=>r.naoPercebi).length;
  $('relatoCorpo').innerHTML=`<div class="modal-emoji" style="font-size:40px">🌱</div><p style="font-size:14px;line-height:1.6">Tudo bem. Às vezes a diferença demora a aparecer, e continuar mesmo assim já é cuidado.</p>`;
  const b=$('relatoBotoes');b.innerHTML='';
  const bo=document.createElement('button');bo.className='modal-btn prim';bo.style.width='100%';bo.textContent='Ok';
  bo.onclick=()=>relatoFechar(()=>{if(nNao>=2&&!hb.relatoAvisoRever){hb.relatoAvisoRever=true;salva();relatoAvisoRever(hb);}});
  b.appendChild(bo);
}
function relatoAvisoRever(hb){
  dialogo({emoji:'🌿',titulo:'Talvez ele precise de um ajuste',
    texto:'Você já contou duas vezes que '+acaoDoHabito(hb)+' ainda não fez diferença. Não é falha sua, é informação.\n\nQue tal deixar ele menor, mudar o horário ou trocar por outro que combine mais com você agora?',
    botoes:[{rotulo:'Deixar como está'},{rotulo:'Ajustar o hábito',prim:true,fn:()=>abrirHabMenu(hb)}]});
}
function relatoAgoraNao(){
  const {hb,motivo}=relatoCtx;relatoPular(hb,motivo);relatoFechar();
}
function relatoFechar(depois){
  fecharOverlay($('relatoModal'),()=>{relatoCtx=null;relatoAgendado=null;if(depois)depois();setTimeout(checarTresDias,500);});
}

/* ---------- declaração com as palavras dela ---------- */
function relatoFrasesUnicas(hb){
  const vistos=new Set();const out=[];
  relatoUteis(hb).forEach(r=>{const t=relatoLimpar(r.texto);const k=t.toLowerCase();if(t&&!vistos.has(k)){vistos.add(k);out.push(t);}});
  return out;
}
function montarDeclaracaoHabito(hb){
  const fr=relatoFrasesUnicas(hb);if(!fr.length)return null;
  const acao=acaoDoHabito(hb);
  const linhas=[`Estou no processo de fazer de <b>${esc(acao)}</b> uma parte natural da minha vida.`];
  linhas.push(`Adoro a sensação de ${esc(acao)}, porque ${esc(fr[0])}.`);
  fr.slice(1).forEach(t=>linhas.push(`Adoro quando ${esc(t)}.`));
  linhas.push(esc(FECHAMENTO_FIXO));
  return linhas;
}
const GRUPO_PARA_AREA={corpo:'bemestar',mente:'bemestar',rituais:'bemestar',musica:'carreira',arte:'bemestar',palavras:'bemestar',tempo:'bemestar',presentes:'bemestar',servico:'patrimonio',toque:'bemestar',lar:'patrimonio',aurora:'relMeu',essencial:'bemestar',outros:'bemestar'};
function relatoLevarAtracao(hb){
  const fr=relatoFrasesUnicas(hb);if(!fr.length){avisar('Ainda não há frases suas sobre esse hábito.');return;}
  const acao=acaoDoHabito(hb);
  const texto=acao+', porque '+juntar(fr);
  const ids=new Set((S.leiAtracao.areas||[]).map(a=>a.id));
  let d=(S.leiAtracao.desejos||[]).find(x=>x.habitoOrigem===hb.id&&!x.arquivado);
  if(d){
    d.corpo=(d.corpo||[]).filter(c=>!c.doHabito);
  } else {
    let area=GRUPO_PARA_AREA[grupoDe(hb)]||'bemestar';if(!ids.has(area))area=ids.has('vontades')?'vontades':[...ids][0];
    d=novoDesejo(area,acao);d.habitoOrigem=hb.id;d.nucleo='o cuidado ideal comigo';
    S.leiAtracao.desejos.push(d);
  }
  d.corpo.unshift({k:'ad_sensacao',texto,doHabito:true});
  d.sensacao=null;
  salva();
  fecharOverlay($('relatosHabModal'),()=>{trocaAba('atracao');setTimeout(()=>abrirDesejo(d.id,2),400);mostrarToast('Levado pra Atração ✓');});
}
function abrirRelatosHab(hb){
  const rs=(hb.relatos||[]).slice().reverse();
  let html=`<div class="modal-pergunta" style="text-align:center">${hb.emoji||'🌱'} ${esc(hb.nome)}</div>
    <p class="mut" style="font-size:12.5px;text-align:center;margin-bottom:12px">O que você já disse sobre esse hábito</p>`;
  if(!rs.length){
    html+=`<div class="lp-vazio">Ainda nada por aqui. De vez em quando, depois de marcar, o app te pergunta se o hábito está fazendo diferença.</div>`;
  } else {
    rs.forEach(r=>{
      const data=new Date(r.data+'T12:00:00').toLocaleDateString('pt-BR',{day:'numeric',month:'short'});
      html+=`<div class="dz-nota"><span class="data">${esc(data)} · dia ${r.dia}</span>${r.naoPercebi?'<i class="mut">Ainda não percebi diferença</i>':'O lado bom é que '+esc(relatoLimpar(r.texto))+'.'}<button class="x" data-rel-rm="${esc(r.id)}">×</button></div>`;
    });
  }
  const decl=montarDeclaracaoHabito(hb);
  if(decl)html+=`<div class="declaracao-montada"><span class="dm-lb">Sua declaração, com as suas palavras</span>${decl.map(l=>`<div style="margin-bottom:8px">${l}</div>`).join('')}</div>`;
  $('relatosHabCorpo').innerHTML=html;
  $('relatosHabCorpo').querySelectorAll('[data-rel-rm]').forEach(b=>{b.onclick=()=>{
    confirmar('Apagar essa frase?',()=>{hb.relatos=(hb.relatos||[]).filter(r=>r.id!==b.dataset.relRm);salva();abrirRelatosHab(hb);},'Apagar');
  };});
  const bt=$('relatosHabBotoes');bt.innerHTML='';
  if(decl){const bl=document.createElement('button');bl.className='modal-btn prim';bl.textContent='💫 Levar pra Atração';bl.onclick=()=>relatoLevarAtracao(hb);bt.appendChild(bl);}
  const bf=document.createElement('button');bf.className='modal-btn sec';bf.textContent='Fechar';bf.onclick=()=>fecharOverlay($('relatosHabModal'));bt.appendChild(bf);
  const o=$('relatosHabModal');if(o.hidden)abrirOverlayTopo(o);
}

/* ---------- as frases dela voltando pra ela ---------- */
function relatoFraseDoDia(hb){
  const us=relatoUteis(hb);if(!us.length)return null;
  const n=parseInt(hoje().replace(/-/g,''),10)+hb.id.length;
  return us[n%us.length];
}
function renderRelatoLembrete(){
  const box=$('relatoLembreteBox');if(!box)return;
  const h=hoje();
  const fechado=(S.relatos&&S.relatos.lembreteFechado)||'';
  let alvo=null,maior=0;
  (S.habitos||[]).forEach(hb=>{
    if(hb.pausado||hb.feitos[h]||!relatoUteis(hb).length)return;
    if(fechado===h+'|'+hb.id)return;
    const lac=relatoLacuna(hb,h);
    if(lac!==null&&lac>=3&&lac>maior){maior=lac;alvo=hb;}   // 3 = ontem e anteontem sem marcar
  });
  if(!alvo){box.innerHTML='';return;}
  const r=relatoFraseDoDia(alvo);
  box.innerHTML=`<div class="mp-card"><div class="lbl">💬 Lembra o que você disse?</div>
    <div class="sub">Faz ${maior-1} dias sem ${esc(acaoDoHabito(alvo))}. No dia ${r.dia}, você escreveu:</div>
    <div class="txt">O lado bom é que ${esc(relatoLimpar(r.texto))}.</div>
    <div class="cta"><button type="button" class="btn prim" id="rlMarcar">${alvo.emoji||'🌱'} Fiz hoje</button><button type="button" class="btn" id="rlFechar">Hoje não</button></div></div>`;
  $('rlMarcar').onclick=()=>toggleHabito(alvo.id);
  $('rlFechar').onclick=()=>{S.relatos.lembreteFechado=h+'|'+alvo.id;salva();renderRelatoLembrete();};
}
function extraMarco(hb){
  let h='';
  const r=relatoFraseDoDia(hb);
  if(r)h+=`<div class="msg-convite">💬 No dia ${r.dia} você escreveu: <i>“o lado bom é que ${esc(relatoLimpar(r.texto))}”</i>. Guarda isso.</div>`;
  const c=celebraAtual();
  if(c)h+=`<div class="msg-convite" style="margin-top:8px">🎉 E aí, já fez o seu <b>${esc(c.texto)}</b>?</div>`;
  return h;
}

/* ============ COMEMORAÇÃO (uma só pra tudo) ============ */
const CELEBRA_IDEIAS={
  gesto:['punho no ar','dancinha de 3 segundos','mão no peito','piscadinha no espelho','joinha pra mim mesma'],
  som:['Uhul!','estalar os dedos','Isso!','cantarolar um trecho','palminha'],
  frase:['Arrasei','Diva!','Mais uma pra conta','Eu me cuido','Que orgulho de mim']
};
const CELEBRA_TIPOS={gesto:'🙌 Gesto',som:'🎵 Som',frase:'💬 Frase'};
function celebraAtual(){return S.celebracao&&S.celebracao.atual;}
function celebraDeveConvidar(){return !celebraAtual()&&!(S.celebracao&&S.celebracao.conviteVisto);}
let celebraTipo='gesto';
function abrirCelebraConvite(){
  celebraTipo=(celebraAtual()&&celebraAtual().tipo)||'gesto';
  $('celebraCorpo').innerHTML=`<div class="modal-emoji">🎉</div>
    <div class="modal-pergunta">Que tal inventar a sua comemoração?</div>
    <p style="font-size:13.5px;line-height:1.6;text-align:left;margin-bottom:8px">Toda vez que você faz algo bom por você, seu cérebro aprende mais rápido se sentir uma pontinha de alegria logo depois. Por isso, vale criar um jeito só seu de comemorar: um gesto, um som ou uma frase rápida, de um segundo.</p>
    <p class="mut" style="font-size:12.5px;line-height:1.55;text-align:left;margin-bottom:12px">Não precisa ser bonito nem fazer sentido pra mais ninguém. Só precisa te fazer sorrir um pouquinho.</p>
    <div class="hab-sug-cats" id="celebraTabs" style="justify-content:center"></div>
    <div class="chips" id="celebraIdeias" style="justify-content:center;margin-bottom:12px"></div>
    <div class="modal-campo"><label>A minha comemoração é…</label><input id="celebraTxt" placeholder="ex: punho no ar e um Uhul!" value="${esc((celebraAtual()&&celebraAtual().texto)||'')}"></div>`;
  celebraRenderIdeias();
  const b=$('celebraBotoes');b.innerHTML='';
  const linha=document.createElement('div');linha.className='modal-botoes';
  const bn=document.createElement('button');bn.className='modal-btn sec';bn.textContent='Agora não';
  bn.onclick=()=>{S.celebracao.conviteVisto=true;salva();fecharOverlay($('celebraModal'),()=>{mostrarToast('Dá pra criar depois em Configurações 💛');renderCelebracaoCard();setTimeout(checarTresDias,500);});};
  const bt=document.createElement('button');bt.className='modal-btn prim';bt.textContent='Testar agora';bt.onclick=celebraTestar;
  linha.appendChild(bn);linha.appendChild(bt);b.appendChild(linha);
  abrirOverlayTopo($('celebraModal'));
}
function celebraRenderIdeias(){
  $('celebraTabs').innerHTML=Object.entries(CELEBRA_TIPOS).map(([k,r])=>`<button type="button" class="chip ${k===celebraTipo?'on':''}" data-ct="${k}">${r}</button>`).join('');
  $('celebraTabs').querySelectorAll('[data-ct]').forEach(c=>{c.onclick=()=>{celebraTipo=c.dataset.ct;celebraRenderIdeias();};});
  $('celebraIdeias').innerHTML=CELEBRA_IDEIAS[celebraTipo].map(t=>`<button type="button" class="chip" data-ci="${esc(t)}">${esc(t)}</button>`).join('');
  $('celebraIdeias').querySelectorAll('[data-ci]').forEach(c=>{c.onclick=()=>{$('celebraTxt').value=c.dataset.ci;};});
}
function celebraTestar(){
  const t=($('celebraTxt').value||'').trim();
  if(!t){mostrarToast('Escolha uma ideia ou escreva a sua');return;}
  $('celebraCorpo').innerHTML=`<div class="modal-emoji">🎉</div><div class="modal-pergunta">Agora faz aí, uma vez:</div><div class="modal-nome">${esc(t)}</div><p class="mut" style="font-size:12.5px;line-height:1.5">Sério, de verdade. Ninguém está olhando. 😄</p>`;
  const b=$('celebraBotoes');b.innerHTML='';
  const linha=document.createElement('div');linha.className='modal-botoes';
  const bv=document.createElement('button');bv.className='modal-btn sec';bv.textContent='Mudar';bv.onclick=()=>{abrirCelebraConvite();$('celebraTxt').value=t;};
  const bf=document.createElement('button');bf.className='modal-btn prim';bf.textContent='Fiz! 🎉';
  bf.onclick=()=>{
    const ant=celebraAtual();
    if(ant&&ant.texto!==t)S.celebracao.historico.push(ant);
    S.celebracao.atual={texto:t,tipo:celebraTipo,criadaEm:hoje()};S.celebracao.conviteVisto=true;salva();
    confete(['🎉','🙌','✨','💛']);som('caixinha');
    fecharOverlay($('celebraModal'),()=>{mostrarToast('Essa é a sua comemoração agora ✓');renderCelebracaoCard();setTimeout(checarTresDias,500);});
  };
  linha.appendChild(bv);linha.appendChild(bf);b.appendChild(linha);
}
function renderCelebracaoCard(){
  try{if(!$('configModal').hidden)renderConfig();}catch(e){}
  const box=$('celebracaoBox');if(!box)return;
  const c=celebraAtual();
  if(!c){
    box.innerHTML=`<p class="mut" style="font-size:12.5px;line-height:1.55;margin:0 0 10px">Um gesto, um som ou uma frase rápida pra fazer logo depois de cumprir um hábito. Inventada por você.</p><button class="btn prim btn-full" id="btnCelebraCriar">🎉 Inventar a minha</button>`;
  } else {
    const data=new Date(c.criadaEm+'T12:00:00').toLocaleDateString('pt-BR',{day:'numeric',month:'long'});
    const hist=(S.celebracao.historico||[]).slice().reverse();
    box.innerHTML=`<div class="lp-item"><div class="lp-frase">${esc(c.texto)}</div><div class="lp-meta">${esc(CELEBRA_TIPOS[c.tipo]||'')} · criada por você em ${esc(data)}</div></div>
      <button class="btn btn-full" id="btnCelebraCriar">✏️ Inventar outra</button>
      ${hist.length?`<details class="generic" style="margin-top:10px"><summary style="font-size:12px">Comemorações anteriores (${hist.length})</summary><div class="conteudo">${hist.map(x=>`<div class="conq-item">${esc(x.texto)}<span class="quando">· ${esc(new Date(x.criadaEm+'T12:00:00').toLocaleDateString('pt-BR',{day:'numeric',month:'short'}))}</span></div>`).join('')}</div></details>`:''}`;
  }
  $('btnCelebraCriar').onclick=abrirCelebraConvite;
}
function celebraToastTexto(){
  const c=celebraAtual();if(!c)return 'Marcado ✓';
  S.celebracao.contador=(S.celebracao.contador||0)+1;salva();
  return S.celebracao.contador%3===0?'Marcado ✓ · hora do seu '+c.texto+' 🎉':'Marcado ✓';
}

function desmarcarHabito(hb,h){delete hb.feitos[h];salva();renderHoje();renderHabitos();}
function checarTresDias(){
  if(marcoEmAndamento)return;
  const ativos=S.habitos.filter(x=>!x.pausado);
  const candidato=ativos.find(hb=>Object.keys(hb.feitos).length>=3);
  if(!candidato)return;
  // Completar 3 dias em qualquer hábito ativo libera a fila
  if(S.proximoHabitoEm){S.proximoHabitoEm=null;S.habitoTravaId=null;salva();}
  if(S.ultimoConviteEm&&hoje()<fmtD(addDias(new Date(S.ultimoConviteEm),3)))return;
  if(S.tresDiasJaMostradoEm===hoje())return;
  if(S.tresDiasUnicaVez)return; /* o convite aparece uma vez só, sem repetir a cada 3 dias */
  setTimeout(()=>abrirTresDias(candidato),900);
}
let hbTresDias=null;
function abrirTresDias(hb){
  hbTresDias=hb;
  const nome=S.onboarding.nome||'amiga';
  $('tresDiasTitulo').textContent='3 dias, '+nome+'! 🎉';
  $('tresDiasTexto').innerHTML='Você completou 3 dias com <b>'+esc(hb.nome)+'</b>. Isso já conta como começo de verdade.<br><br>Quer trazer um hábito novo para a sua lista agora, ou prefere ficar mais um pouco só com o que já tem?';
  $('tresDiasModal').hidden=false;requestAnimationFrame(()=>$('tresDiasModal').classList.add('ativo'));document.body.style.overflow='hidden';
  S.tresDiasJaMostradoEm=hoje();S.tresDiasUnicaVez=true;salva();
}
$('tresDiasSim').onclick=()=>{
  S.ultimoConviteEm=Date.now();salva();
  $('tresDiasModal').classList.remove('ativo');
  setTimeout(()=>{$('tresDiasModal').hidden=true;document.body.style.overflow='';},320);
  renderHabitos();abrirOverlay($('gerenciarModal'));
};
$('tresDiasNao').onclick=()=>{
  S.ultimoConviteEm=Date.now();salva();
  $('tresDiasModal').classList.remove('ativo');
  setTimeout(()=>{$('tresDiasModal').hidden=true;document.body.style.overflow='';},320);
  const nome=S.onboarding.nome||'amiga';
  setTimeout(()=>avisar('Tudo bem, '+nome+'. Ficar mais tempo num hábito também é avançar. Em 3 dias eu pergunto de novo. 🌱'),350);
};

