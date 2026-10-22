/* ============ MAPA EMOCIONAL ============ */
function sugerirHabitosDoMapa(resumo){
  if(!resumo)return [];
  const baixas=[];
  Object.entries(resumo).forEach(([k,v])=>{if(typeof v==='number'&&v<=40)baixas.push([k,v]);});
  baixas.sort((a,b)=>a[1]-b[1]);
  if(!baixas.length)return [];
  const top3=baixas.slice(0,3).map(([k])=>k);
  const itens=[];
  filaBase().forEach(cat=>cat.itens.forEach(it=>{
    const dims=it.dims||[];
    const bate=dims.some(d=>top3.includes(d));
    if(bate){
      const motivo=top3.filter(d=>dims.includes(d))[0];
      itens.push({item:it,motivo});
    }
  }));
  const jaTem=new Set((S.habitos||[]).map(h=>h.nome));
  const unicos=[];
  const vistos=new Set();
  for(const x of itens){
    if(vistos.has(x.item.nome))continue;
    vistos.add(x.item.nome);
    unicos.push(x);
  }
  return unicos.sort((a,b)=>{
    const ax=jaTem.has(a.item.nome)?1:0;const bx=jaTem.has(b.item.nome)?1:0;return ax-bx;
  }).slice(0,4);
}
const NOMES_DIM={
  sobrecarga:'sobrecarga',ansiedade:'ansiedade',energia:'energia',prazer:'prazer',
  autopercepcao:'autopercepção',regulacao:'regulação',direcao:'direção',conexao:'conexão',corpo:'corpo'
};
function renderCicloSaudacao(){
  const el=$('cicloSaudacao');if(!el)return;
  const nome=primeiroNome();
  const saudacoes=nome?['Oi, '+esc(nome)+'.',esc(nome)+', olha o que você construiu.','Vamos ver como você está, '+esc(nome)+'?']:['Oi.','Olha o que você construiu.','Vamos ver como você está?'];
  const idx=new Date().getDate()%saudacoes.length;
  el.innerHTML=`<div class="ciclo-saudacao"><div class="tt">${saudacoes[idx]}</div><div class="sub">Este mapa é sobre como você está, não sobre como você deveria estar.</div></div>`;
}
function renderCiclo(){
  renderCicloSaudacao();
  const c=S.ciclo;const el=$('cicloBox');if(!el)return;
  if(!Array.isArray(c.historico))c.historico=[];
  const hist=c.historico;
  const nMapas=hist.length;
  const temRespostas=c.atual&&c.atual.respostas&&Object.keys(c.atual.respostas).length>0;
  const atualCompleto=c.atual&&c.atual.resumo;
  const parcial=temRespostas&&!atualCompleto;
  let html='';

  // último mapa completo (para comparação e leitura)
  const ultimo=atualCompleto?c.atual:(nMapas?hist[nMapas-1]:null);
  const anteriorParaCmp=(()=>{
    if(atualCompleto&&nMapas>=1){
      // se atual ainda não está no hist, compara com último do hist; se já está, com penúltimo
      const ultHist=hist[nMapas-1];
      if(ultHist&&c.atual&&ultHist.data===c.atual.data&&ultHist.resumo) return nMapas>=2?hist[nMapas-2]:null;
      return ultHist;
    }
    if(nMapas>=2)return hist[nMapas-2];
    return null;
  })();

  if(atualCompleto){
    const pend=c.atual.pendenteLeitura;const temRel=!!c.atual.relatorio;
    if(pend&&temRel){
      html+=`<div class="ciclo-topo" style="background:linear-gradient(135deg, rgba(255,215,107,.25), rgba(189,128,209,.20));border-color:rgba(255,215,107,.5)"><div class="num" style="color:#8a5a00">🎁 Mapa completo</div><div class="sub"><b>Sua leitura está pronta.</b> Sem pressa pra ler.</div><button class="btn prim btn-full" id="btnLerRelatorio" style="margin-top:14px;background:linear-gradient(135deg,#E7C78A,#BD80D1);color:#211326;border:none;padding:14px;font-size:15px;font-weight:900">📖 Ler relatório</button></div>`;
    } else {
      html+=`<div class="ciclo-topo"><div class="num">${nMapas?('🗺️ Mapa · '+(nMapas+(hist.some(h=>h.data===c.atual.data)?0:1))+'º'):'🗺️ Mapa completo'}</div><div class="sub">${mapaLiberado()?'Já passaram 21 dias: o próximo mapa está liberado quando você quiser.':'O próximo mapa libera 21 dias depois deste.'}</div></div>`;
    }
    const mapa=renderMapa(c.atual,anteriorParaCmp);
    if(mapa.trim())html+=mapa;else html+=`<div class="mapa-vazio">Ainda sem dados deste ciclo.</div>`;
    if(temRel&&!pend){html+=`<button class="btn prim btn-full" id="btnVerRel" style="margin-top:12px">💭 Ver leitura profunda</button>`;}
    html+=mapaLiberado()?`<button class="btn prim btn-full" id="btnAbrirMapaWizard" style="margin-top:12px;padding:14px">🗺️ Fazer outro mapa</button>`:mapaIntervaloHTML();
  } else if(parcial){
    html+=`<div class="ciclo-topo"><div class="num">${nMapas?'🔄 Continuando':'🌱 Primeiro mapa'}</div><div class="sub">${nMapas?'Você já tem '+nMapas+' mapa(s) no histórico. Continue este.':'Quando você estiver com tempo, responda. Sem pressa.'}</div></div>`;
    html+=`<button class="btn prim btn-full" id="btnContinuarMapa" style="margin-top:8px;padding:16px;font-size:15px">🗺️ Continuar mapa</button>`;
    html+=`<div class="mut" style="font-size:11px;margin-top:12px;line-height:1.55;text-align:center">3 páginas. Pode pausar e voltar.</div>`;
  } else {
    if(mapaLiberado()){
      html+=`<div class="ciclo-topo"><div class="num">${nMapas?'🔄 Novo mapa':'🌱 Primeiro mapa'}</div><div class="sub">${nMapas?'Você já fez '+nMapas+' mapa(s). Cada um compara com o anterior.':'Quando você estiver com tempo, responda. Sem pressa.'}</div></div>`;
      html+=`<button class="btn prim btn-full" id="btnAbrirMapaWizard" style="margin-top:8px;padding:16px;font-size:15px">🗺️ Responder ao mapa</button>`;
      html+=`<div class="mut" style="font-size:11px;margin-top:12px;line-height:1.55;text-align:center">São 3 páginas curtas. Depois de concluir, o próximo mapa libera em 21 dias.</div>`;
    } else html+=mapaIntervaloHTML();
  }
  html+=renderCheckinNoMapa();
  if(c.historico.length>0){
    html+=`<h3 style="margin-top:20px">Mapas anteriores</h3>`;
    html+=c.historico.slice().reverse().map((h,i)=>{
      const data=new Date(h.data+'T12:00:00').toLocaleDateString('pt-BR');
      const temRel=!!h.relatorio;
      const idxOriginal=c.historico.length-1-i;
      const ant=idxOriginal>0?c.historico[idxOriginal-1]:null;
      return`<details class="generic"><summary>📅 ${data}${idxOriginal>0?' · vs anterior':''}</summary><div class="conteudo">${renderMapa(h,ant)}${temRel?`<button class="btn prim btn-full" data-rel="${i}" style="margin-top:12px">💭 Ver leitura profunda</button>`:(h.bloqueado?`<div class="aviso" style="margin-top:12px">Neste ciclo, o app optou por não gerar relatório — priorizou o cuidado.</div>`:'')}</div></details>`;
    }).join('');
  }
  const ultResumo=(c.historico&&c.historico.length)?(c.historico[c.historico.length-1].resumo||calculaScoreCiclo(c.historico[c.historico.length-1])):null;
  const sugestoes=sugerirHabitosDoMapa(ultResumo);
  if(sugestoes.length){
    let s='<div class="sug-mapa"><div class="tt">🌱 Do seu mapa pra sua lista</div><div class="sub">Olhando pro seu último retrato, esses hábitos conversam com o que está mais baixo agora. Sem obrigação.</div>';
    sugestoes.forEach(x=>{
      const jaTem=S.habitos.some(h=>h.nome===x.item.nome);
      s+=`<div class="item ${jaTem?'ja-tem':''}" data-mapa-habito="${esc(x.item.nome)}">
        <span class="ic">${x.item.emoji}</span>
        <div class="txt"><div class="nm">${esc(x.item.nome)}</div><div class="pq">ajuda com ${esc(NOMES_DIM[x.motivo]||x.motivo)} · ${esc(x.item.unidade)}</div></div>
        <span class="add">${jaTem?'✓':'+'}</span>
      </div>`;
    });
    s+='</div>';
    html+=s;
  }
  el.innerHTML=html;
  const btnMW=$('btnAbrirMapaWizard');if(btnMW)btnMW.onclick=()=>abrirMapaWizard(0);
  ligarBotoesDeclaracao(el);
  const btnCont=$('btnContinuarMapa');if(btnCont)btnCont.onclick=()=>{
    // resume at first incomplete group
    let start=0;
    for(let i=0;i<GRUPOS_MAPA.length;i++){
      const dims=CICLO_DIMS.filter(d=>d.grupo===GRUPOS_MAPA[i].id);
      if(dims.some(d=>Object.keys((S.ciclo.atual&&S.ciclo.atual.respostas[d.key])||{}).length<5)){start=i;break;}
      start=i;
    }
    abrirMapaWizard(start);
  };
  const btnLer=$('btnLerRelatorio');if(btnLer)btnLer.onclick=()=>{S.ciclo.atual.pendenteLeitura=false;salva();abrirRelatorioCompleto(c.atual.relatorio,c.atual);renderCiclo();};
  const btnVR=$('btnVerRel');if(btnVR)btnVR.onclick=()=>{if(c.atual.relatorio)abrirRelatorioCompleto(c.atual.relatorio,c.atual);};
  document.querySelectorAll('#cicloBox [data-rel]').forEach(b=>{b.onclick=()=>{const i=+b.dataset.rel;const h=c.historico[c.historico.length-1-i];if(!h||!h.relatorio)return;abrirRelatorioCompleto(h.relatorio,h);};});
  document.querySelectorAll('#cicloBox [data-mapa-habito]').forEach(el=>{el.onclick=()=>{
    const nome2=el.dataset.mapaHabito;
    if(S.habitos.some(h=>h.nome===nome2)){avisar('Você já tem esse hábito. 💛');return;}
    const item=filaBase().flatMap(c=>c.itens).find(i=>i.nome===nome2);
    if(!item)return;
    if(S.habitos.some(h=>!h.pausado) && !habitoLiberado()){
      const dias=diasAteLiberar();
      avisar('Sem pressa. Próximo hábito libera em '+dias+' dia'+(dias===1?'':'s')+'.');
      return;
    }
    abrirModalFila(item);
  };});
}
function verificaCicloCompleto(){
  if(!S.ciclo.atual)return;
  const total=CICLO_DIMS.length*5;let resp=0;CICLO_DIMS.forEach(d=>{resp+=Object.keys(S.ciclo.atual.respostas[d.key]||{}).length;});
  if(resp!==total)return;
  const resumo=calculaScoreCiclo(S.ciclo.atual);S.ciclo.atual.resumo=resumo;S.ciclo.atual.concluidoEm=hoje();
  const ant=S.ciclo.historico.length>0?S.ciclo.historico[S.ciclo.historico.length-1]:null;
  const antR=ant?(ant.resumo||calculaScoreCiclo(ant)):null;
  const rel=montarRelatorio(resumo,antR,S.ciclo.usados,S.ciclo.historico.length+1);
  S.ciclo.atual.relatorio=rel;S.ciclo.atual.pendenteLeitura=true;S.ciclo.usados=rel.usados;
  // clone para o histórico não compartilhar referência com o atual
  try{S.ciclo.historico.push(JSON.parse(JSON.stringify(S.ciclo.atual)));}catch(e){S.ciclo.historico.push(S.ciclo.atual);}
  S.ciclo.proximoEm=null; // o intervalo de 21 dias é calculado pela data de conclusão (mapaLiberado)
  salva();
  mostrarToast('Mapa completo ✓');setTimeout(()=>renderCiclo(),400);
}
function calculaScoreCiclo(ciclo){const r={};CICLO_DIMS.forEach(d=>{const vals=Object.values(ciclo.respostas[d.key]||{});if(!vals.length){r[d.key]=null;return;}const m=vals.reduce((a,b)=>a+b,0)/vals.length;r[d.key]=Math.round((m/4)*100);});return r;}
function renderPerguntasGrupo(grupoId){
  const dims=CICLO_DIMS.filter(d=>d.grupo===grupoId);
  return dims.map(d=>{const resp=S.ciclo.atual?.respostas?.[d.key]||{};const r=Object.keys(resp).length;
    const ph=d.perguntas.map((p,qi)=>{const a=resp[qi];const nums=[0,1,2,3,4].map(v=>`<button type="button" class="ciclo-num ${a===v?'on':''}" data-dim="${d.key}" data-qi="${qi}" data-val="${v}">${v}</button>`).join('');return`<div class="ciclo-q"><span class="lbl">${esc(p)}</span><div class="ciclo-nums">${nums}</div></div>`;}).join('');
    return`<div class="ciclo-dim" data-dim="${d.key}"><div class="cab"><span style="font-size:20px">${d.emoji}</span><span class="tit">${d.nome}</span><span class="prog">${r}/5</span></div>${ph}</div>`;
  }).join('');
}
/* ============ INTERVALO DE 21 DIAS ENTRE MAPAS ============
   Conta a partir do dia em que o último mapa foi concluído (não de uma data fixa).
   No 21º dia libera e fica liberado até ela fazer o próximo. */
const MAPA_INTERVALO_DIAS=21;
function mapaUltimaConclusao(){
  const c=S.ciclo||{};const datas=[];
  (c.historico||[]).forEach(h=>{if(h&&h.resumo)datas.push(h.concluidoEm||h.data);});
  if(c.atual&&c.atual.resumo)datas.push(c.atual.concluidoEm||c.atual.data);
  const ok=datas.filter(d=>/^\d{4}-\d{2}-\d{2}$/.test(d||'')).sort();
  return ok.length?ok[ok.length-1]:null;
}
function mapaLiberaEm(){
  const u=mapaUltimaConclusao();if(!u)return null;
  const d=new Date(u+'T12:00:00');d.setDate(d.getDate()+MAPA_INTERVALO_DIAS);return fmtD(d);
}
function mapaLiberado(){const l=mapaLiberaEm();return !l||hoje()>=l;}
function mapaDiasFaltam(){const l=mapaLiberaEm();if(!l)return 0;return Math.max(0,Math.round((new Date(l+'T12:00:00')-new Date(hoje()+'T12:00:00'))/86400000));}
function mapaIntervaloHTML(){
  const l=mapaLiberaEm();const falta=mapaDiasFaltam();
  const dataTxt=l?new Date(l+'T12:00:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'}):'';
  return `<div class="mapa-intervalo">
    <div class="mi-tit">Seu próximo Mapa Emocional</div>
    <p class="mi-destaque">Que tal dar um tempinho para você perceber as mudanças que seus hábitos estão trazendo?</p>
    <p>O Mapa Emocional foi pensado para acompanhar sua evolução ao longo do tempo. Por isso, ele fica disponível novamente a cada 21 dias. Esse intervalo permite que você tenha tempo para experimentar seus hábitos, observar como se sente e reconhecer as mudanças que acontecem no caminho.</p>
    <p>Você não precisa fazer o mapa exatamente no 21º dia: depois desse prazo, poderá realizá-lo quando quiser. 💗</p>
    <p>Enquanto isso, que tal revisitar sua Declaração de Lei da Atração?</p>
    <p>Você pode aproveitar esse momento para reler seus objetivos, conferir seu planejamento e lembrar a si mesma aonde deseja chegar.</p>
    <button type="button" class="btn prim btn-full" data-ir-declaracao>Revisar minha declaração ✨</button>
    <p class="mut mi-rodape">Seu próximo mapa estará disponível após completar 21 dias desde o último.${dataTxt?` <b>Libera em ${dataTxt}</b> (faltam ${falta} dia${falta===1?'':'s'}).`:''}</p>
  </div>`;
}
function irParaDeclaracao(){
  const fechar=document.querySelectorAll('.modal-overlay.ativo');fechar.forEach(o=>fecharOverlay(o));
  setTimeout(()=>{
    const t=document.querySelector('[data-tab="atracao"]');if(t)t.click();
    setTimeout(()=>{try{sessaoComDesejo(sessaoDeclaracao);}catch(e){}},250);
  },fechar.length?340:0);
}
const HABITO_LER_DECLARACAO={id:'ler_declaracao',emoji:'📜',emojis:['📜','✨','💛'],nome:'Ler minha declaração',unidade:'1×/semana',paraQue:'Me manter conectada ao que eu desejo',texto:'Escolha um momento tranquilo da sua semana, quando estiver relaxada. Reler o que você escreveu traz clareza e ideias novas de próximos passos.',grupo:'mente',dims:['direcao','autopercepcao']};
function habitoLerDeclaracao(){
  if(S.habitos.some(h=>h.nome===HABITO_LER_DECLARACAO.nome)){mostrarToast('Você já tem esse hábito 💛');return;}
  if(S.habitos.some(h=>!h.pausado)&&!habitoLiberado()){const dias=diasAteLiberar();mostrarToast('Sem pressa. Próximo hábito libera em '+dias+' dia'+(dias===1?'':'s')+'.');return;}
  abrirModalFila({...HABITO_LER_DECLARACAO,emojis:HABITO_LER_DECLARACAO.emojis.slice(),dims:HABITO_LER_DECLARACAO.dims.slice()});
}
$('btnHabitoDeclaracao')&&($('btnHabitoDeclaracao').onclick=habitoLerDeclaracao);
function ligarBotoesDeclaracao(raiz){(raiz||document).querySelectorAll('[data-ir-declaracao]').forEach(b=>b.onclick=irParaDeclaracao);}
function avisarMapaIntervalo(){
  let o=$('mapaIntervaloModal');
  if(!o){
    o=document.createElement('div');o.className='modal-overlay';o.id='mapaIntervaloModal';o.hidden=true;
    o.innerHTML=`<div class="modal-caixa alta" style="text-align:left;max-width:460px"><div id="mapaIntervaloCorpo"></div><div class="modal-botoes" style="margin-top:12px"><button class="modal-btn sec" id="mapaIntervaloFechar" style="flex:1">Fechar</button></div></div>`;
    document.body.appendChild(o);
    $('mapaIntervaloFechar').onclick=()=>fecharOverlay(o);
  }
  $('mapaIntervaloCorpo').innerHTML=mapaIntervaloHTML();ligarBotoesDeclaracao(o);
  abrirOverlay(o);
}
let mapaWizardPagina=0;
function abrirMapaWizard(pagina){
  // começar um mapa novo só depois do intervalo; continuar um mapa em andamento sempre pode
  if((!S.ciclo.atual||S.ciclo.atual.resumo)&&!mapaLiberado()){avisarMapaIntervalo();return;}
  mapaWizardPagina=typeof pagina==='number'?pagina:0;
  const c=S.ciclo;
  if(!Array.isArray(c.historico))c.historico=[];
  // sempre pode começar de novo se o atual já tem resumo (mapa concluído)
  if(c.atual && c.atual.resumo){
    c.atual={data:hoje(),respostas:{},seguranca:{}};
    salva();
    mapaWizardPagina=0;
  }
  if(!c.atual || (c.atual.resumo)) c.atual={data:hoje(),respostas:{},seguranca:{}};
  if(!c.atual.respostas)c.atual.respostas={};
  const o=$('mapaWizard');
  abrirOverlay(o);
  renderMapaWizardPagina();
}
function fecharMapaWizard(){
  const o=$('mapaWizard');o.classList.remove('ativo');
  setTimeout(()=>{o.hidden=true;document.body.style.overflow='';renderCiclo();},320);
}
function renderMapaWizardPagina(){
  const g=GRUPOS_MAPA[mapaWizardPagina];
  if(!g)return;
  const totalPag=GRUPOS_MAPA.length;
  $('mapaWizardTit').textContent=g.titulo;
  $('mapaWizardSub').textContent='Página '+(mapaWizardPagina+1)+' de '+totalPag+' · 0 = nada · 4 = muito';
  $('mapaWizardDots').innerHTML=GRUPOS_MAPA.map((_,i)=>`<span class="mw-dot ${i===mapaWizardPagina?'on':''} ${i<mapaWizardPagina?'done':''}"></span>`).join('');
  $('mapaWizardBody').innerHTML=renderPerguntasGrupo(g.id);
  if(mapaWizardPagina===totalPag-1){const bx=document.createElement('div');bx.className='mw-obs';bx.innerHTML='<label for="mapaObs">Mudou algo na sua rotina neste ciclo? (opcional)</label><textarea id="mapaObs" placeholder="ex: mudei de horário no trabalho, comecei a dormir mais cedo, uma semana de viagem…"></textarea>';$('mapaWizardBody').appendChild(bx);const ta=$('mapaObs');ta.value=(S.ciclo.atual&&S.ciclo.atual.observacao)||'';ta.oninput=()=>{if(S.ciclo.atual)S.ciclo.atual.observacao=ta.value;};ta.onblur=()=>salva();}
  const btnV=$('mapaWizardVoltar');const btnS=$('mapaWizardSeguir');
  btnV.style.visibility=mapaWizardPagina===0?'hidden':'visible';
  btnV.onclick=()=>{if(mapaWizardPagina>0){mapaWizardPagina--;renderMapaWizardPagina();$('mapaWizardBody').scrollTop=0;}};
  const ultima=mapaWizardPagina===totalPag-1;
  btnS.textContent=ultima?'Concluir mapa':'Seguir →';
  btnS.onclick=()=>{
    const dims=CICLO_DIMS.filter(d=>d.grupo===g.id);
    const falta=dims.some(d=>Object.keys(S.ciclo.atual.respostas[d.key]||{}).length<5);
    if(falta){mostrarToast('Responda todas desta página pra seguir');return;}
    if(ultima){
      const tObs=$('mapaObs');if(tObs&&S.ciclo.atual)S.ciclo.atual.observacao=tObs.value.trim();
      verificaCicloCompleto();
      fecharMapaWizard();
      return;
    }
    mapaWizardPagina++;
    renderMapaWizardPagina();
    $('mapaWizardBody').scrollTop=0;
  };
  $('mapaWizardBody').querySelectorAll('.ciclo-num').forEach(b=>{
    b.onclick=()=>{
      const dim=b.dataset.dim;const qi=+b.dataset.qi;const val=+b.dataset.val;
      if(!S.ciclo.atual)S.ciclo.atual={data:hoje(),respostas:{},seguranca:{}};
      if(!S.ciclo.atual.respostas[dim])S.ciclo.atual.respostas[dim]={};
      S.ciclo.atual.respostas[dim][qi]=val;salva();
      const wrap=b.closest('.ciclo-nums');
      wrap.querySelectorAll('.ciclo-num').forEach(x=>x.classList.toggle('on',+x.dataset.val===val));
      const db=b.closest('.ciclo-dim');
      const total=db.querySelectorAll('.ciclo-q').length;
      const resp=Array.from(db.querySelectorAll('.ciclo-nums')).filter(w=>w.querySelector('.ciclo-num.on')).length;
      db.querySelector('.prog').textContent=resp+'/'+total;
    };
  });
}
$('mapaWizardFechar')&&($('mapaWizardFechar').onclick=fecharMapaWizard);

function renderMapa(ciclo,anterior){
  const resumo=ciclo.resumo||calculaScoreCiclo(ciclo);const algum=DIMS.some(d=>typeof resumo[d]==='number');if(!algum)return'';
  const rA=anterior?(anterior.resumo||calculaScoreCiclo(anterior)):null;
  return GRUPOS_MAPA.map(g=>{
    const dims=CICLO_DIMS.filter(d=>d.grupo===g.id);
    const linhas=dims.map(d=>{const val=resumo[d.key];if(val===null||val===undefined)return'';const antes=rA?rA[d.key]:null;let seta='<span class="seta igual"></span>';if(antes!==null&&antes!==undefined){const dif=val-antes;if(Math.abs(dif)<3)seta='<span class="seta igual">→</span>';else{const sobe=dif>0;const bom=(sobe&&d.sobeBom)||(!sobe&&!d.sobeBom);const cls=sobe?(bom?'sobe-bom':'sobe-ruim'):(bom?'cai-bom':'cai-ruim');seta=`<span class="seta ${cls}">${sobe?'↑':'↓'} ${Math.abs(dif)}</span>`;}}const cor=d.sobeBom?(val>=60?'var(--ok)':val>=35?'var(--b)':'var(--aviso)'):(val<=40?'var(--ok)':val<=65?'var(--b)':'var(--aviso)');return`<div class="mapa-dim"><span style="font-size:16px">${d.emoji}</span><span class="nome">${d.nome}</span><span class="barra-mini"><span class="fill" style="width:${val}%;background:${cor}"></span></span><span class="val" style="color:${cor}">${val}</span>${seta}</div>`;}).join('');
    return`<div class="mapa-grupo"><div class="tt">${g.titulo}</div>${linhas}</div>`;
  }).join('');
}
function calcularCheckin21(){
  const inicio=fmtD(addDias(new Date(),-20));
  const hojeStr=hoje();
  const somas={},contagens={};
  Object.entries(S.checkins||{}).forEach(([d,ci])=>{
    if(d<inicio||d>hojeStr)return;
    if(!ci.escalas)return;
    Object.entries(ci.escalas).forEach(([k,v])=>{
      if(typeof v!=='number'||v<1)return;
      somas[k]=(somas[k]||0)+v;
      contagens[k]=(contagens[k]||0)+1;
    });
  });
  const medias={};
  Object.keys(somas).forEach(k=>{medias[k]=somas[k]/contagens[k];});
  return medias;
}
function renderCheckinNoMapa(){
  const medias=calcularCheckin21();
  const keys=Object.keys(medias);
  if(!keys.length)return '';
  const nomes={};ESCALAS.forEach(([k,r])=>{nomes[k]=r;});
  const familias=[
    {nome:'🌱 Pelo corpo em movimento',itens:['fisica','danca']},
    {nome:'🧠 Pela mente',itens:['mental','autoconf']},
    {nome:'🏡 No lar',itens:['organizacao','limpeza']},
    {nome:'🎤 Na voz',itens:['belting','lirico']}
  ];
  let linhas='';
  familias.forEach(f=>{
    const dentro=f.itens.filter(k=>medias[k]!==undefined);
    if(!dentro.length)return;
    linhas+=`<div style="font-size:10.5px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;color:var(--ceu);margin:10px 0 6px">${f.nome}</div>`;
    dentro.forEach(k=>{
      const v10=medias[k];
      const val=Math.round((v10/10)*100);
      const cor=val>=60?'var(--ok)':val>=35?'var(--b)':'var(--aviso)';
      linhas+=`<div class="mapa-dim"><span class="nome">${esc(nomes[k])}</span><span class="barra-mini"><span class="fill" style="width:${val}%;background:${cor}"></span></span><span class="val" style="color:${cor}">${v10.toFixed(1)}</span></div>`;
    });
  });
  return`<details class="generic" id="ciMapaDetails" style="background:linear-gradient(135deg, rgba(128,187,209,.14), rgba(143,128,209,.10));border-color:rgba(128,187,209,.30)"><summary style="color:var(--ceu);font-size:12px;letter-spacing:1.2px;text-transform:uppercase;font-weight:800">📊 Do seu check-in diário · últimos 21 dias</summary><div class="conteudo">${linhas}<div class="mut" style="font-size:11px;margin-top:10px;line-height:1.5">Média das suas escalas do check-in. É paralela ao mapa de 21 dias — cada um conta a sua história. Aqui, quanto mais alto, melhor.</div></div></details>`;
}
/* ============ CHECK-IN DENTRO DO RELATÓRIO DO MAPA ============ */
const CI_LEVES=['feliz','grat','calm','anim','tranquil','content','alegr','esperanc','orgulh','motivad','paz','leve','confiant','amad','realizad','seren','bem','entusiasm','inspirad','satisfeit','energizad','disposta','otimis','aliviad','acolhid','segur','empolgad'];
const CI_PESADAS=['ansios','cansad','exaust','trist','sobrecarreg','estress','irrit','angusti','sozinh','desanim','frustr','culpa','medo','preocup','nervos','esgotad','insegur','desmotiv','chatead','raiva','melanc','vazi','perdid','apreensiv','tens','pesad','sufoc','desesper','ressentid','magoad','decepcion','impacient'];
function ciNorm(t){return String(t||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
function ciClasseEmocao(txt){
  const toks=ciNorm(txt).split(/[^a-z]+/).filter(Boolean);
  if(toks.some(t=>t==='nao'||t==='sem'))return null;
  let l=0,p=0;
  toks.forEach(t=>{if(CI_PESADAS.some(x=>t.startsWith(x)))p++;else if(CI_LEVES.some(x=>t.startsWith(x)))l++;});
  return l>p?'leve':p>l?'pesada':null;
}
const CI_PARES=[
  {ci:'fisica',lbl:'Disposição física',dim:'energia',mlbl:'Energia',
   t:{bom:'O corpo respondeu bem nos dias e o mapa confirma: existe fôlego de verdade. Vale gastar essa energia no que você escolheu, e não só no que cobraram.',baixo:'O cansaço aparece nos dois lugares. Não é impressão sua: o corpo está pedindo recarga, e descansar agora é estratégia, não preguiça.',melhor:'No dia a dia o seu corpo respondeu melhor do que o mapa sugere. Talvez a sensação de pouco fôlego seja mais da cabeça do que do corpo.',pior:'O mapa soa mais animado do que os seus dias. Vale conferir se você não está se cobrando além do que o corpo entrega.'}},
  {ci:'fisica',lbl:'Disposição física',dim:'corpo',mlbl:'Corpo',
   t:{bom:'A disposição física e o cuidado com o corpo andam juntos: o que você faz por ele aparece em como ele responde.',baixo:'Disposição baixa e corpo pedindo atenção ao mesmo tempo. Um ajuste pequeno (água, sono, um alongamento) costuma render mais que um plano grande.',melhor:'O corpo rendeu nos dias mais do que o mapa do corpo indica. Talvez você cuide dele melhor do que reconhece.',pior:'O mapa mostra um corpo cuidado, mas a disposição dos dias ficou baixa. Pode haver um cansaço que sono e comida sozinhos não explicam.'}},
  {ci:'mental',lbl:'Disposição mental',dim:'ansiedade',mlbl:'Ansiedade',
   t:{bom:'A cabeça funcionou bem nos dias e o mapa mostra uma mente mais calma. Os dois se sustentam.',baixo:'A cabeça pesou nos dias e o mapa mostra uma mente acelerada. Os dois falam da mesma coisa: ela precisa de pausas.',melhor:'Nos dias a cabeça funcionou melhor do que o mapa de ansiedade sugere. A preocupação parece maior no papel do que na rotina.',pior:'O mapa mostra uma mente tranquila, mas nos dias a disposição mental caiu. Pode ser cansaço, e não ansiedade.'}},
  {ci:'mental',lbl:'Disposição mental',dim:'sobrecarga',mlbl:'Sobrecarga',
   t:{bom:'A cabeça funcionou nos dias e a carga está sob controle no mapa. Você está conseguindo pensar sem estar afogada.',baixo:'Cabeça pesada e carga alta aparecem juntas. Antes de tentar pensar melhor, tente tirar uma coisa da pilha: a clareza costuma voltar quando o excesso diminui.',melhor:'Nos dias a cabeça funcionou melhor do que a carga do mapa faria supor. Você está dando conta com mais lucidez do que sente.',pior:'O mapa mostra pouca sobrecarga, mas a cabeça dos dias ficou pesada. O peso pode estar no que você carrega por dentro, e não na agenda.'}},
  {ci:'mental',lbl:'Disposição mental',dim:'regulacao',mlbl:'Regulação',
   t:{bom:'Mente disposta e boa capacidade de voltar ao eixo andam juntas: quando a cabeça está clara, as reações ficam mais suas.',baixo:'Disposição mental baixa e reações difíceis de segurar. Nessa fase a pausa antes de reagir vale mais do que a análise.',melhor:'Na rotina a cabeça esteve melhor do que o mapa de regulação sugere. Você se segura mais do que acredita.',pior:'O mapa mostra firmeza nas reações, mas a mente dos dias ficou cansada. Segurar tudo por dentro tem um custo, e vale observar.'}},
  {ci:'autoconf',lbl:'Autoconfiança',dim:'autopercepcao',mlbl:'Autopercepção',
   t:{bom:'Confiança e olhar sobre si andam juntos: você se vê com carinho e age como alguém que se vê assim.',baixo:'Autoconfiança e autopercepção estão baixas ao mesmo tempo. Merece um cuidado gentil com a forma como você se trata.',melhor:'Na prática você se mostra mais confiante do que se julga no mapa. A sua cabeça ainda é mais dura com você do que os seus atos.',pior:'O mapa fala de um olhar generoso sobre si, mas nos dias a confiança oscilou. Ela talvez precise de apoio em situações concretas.'}},
  {ci:'autoconf',lbl:'Autoconfiança',dim:'conexao',mlbl:'Conexão',
   t:{bom:'Confiança em si e sensação de ser compreendida caminham juntas: você se mostra como é e é recebida.',baixo:'Pouca confiança e pouca conexão ao mesmo tempo. Uma conversa honesta com uma pessoa segura costuma mexer nas duas.',melhor:'Na prática você se mostrou mais confiante do que o mapa de conexão sugere. A confiança pode estar chegando antes das pessoas.',pior:'O mapa fala de gente por perto, mas a confiança dos dias oscilou. Ter companhia não basta quando a voz interna é dura.'}},
  {ci:'casa',lbl:'Organização e limpeza do lar',dim:'sobrecarga',mlbl:'Sobrecarga',
   t:{bom:'Casa em ordem e rotina leve andam juntas. Uma ajuda a outra.',baixo:'A casa e a sensação de carga pesaram juntas. Tirar uma pequena tarefa do caminho pode aliviar as duas.',melhor:'A casa está mais em ordem do que a sobrecarga do mapa faria supor. O peso parece vir de outro lugar, não da rotina doméstica.',pior:'O mapa mostra pouca sobrecarga, mas a casa ficou pra trás nos check-ins. Talvez você esteja poupando energia, e isso é legítimo.'}},
  {ci:'casa',lbl:'Organização e limpeza do lar',dim:'ansiedade',mlbl:'Ansiedade',
   t:{bom:'Casa em ordem e mente mais calma andam juntas. O espaço organizado devolve um pouco de silêncio.',baixo:'A casa pesou e a mente também. Escolher um único cantinho para resolver costuma aliviar mais do que parece.',melhor:'A casa está mais em ordem do que o mapa de ansiedade faria supor. O barulho da cabeça não vem do seu espaço.',pior:'O mapa mostra uma mente calma, mas a casa ficou pra trás. Pode ser economia de energia, e isso é legítimo.'}},
  {ci:'danca',lbl:'Prática de dança',dim:'prazer',mlbl:'Prazer',
   t:{bom:'A dança está viva nos seus dias e o prazer aparece no mapa. É aí que você se reabastece.',baixo:'Dança e prazer em baixa juntos. Uma música de três minutos, só pra mexer o corpo, pode reacender os dois.',melhor:'Você dançou mais do que o prazer do mapa indica. Vale reparar se está fazendo por gosto ou por obrigação.',pior:'O mapa mostra prazer, mas a dança ficou em segundo plano. O gosto está lá, só falta abrir espaço pra ele.'}},
  {ci:'voz',lbl:'Voz (belting e canto lírico)',dim:'direcao',mlbl:'Direção',
   t:{bom:'Voz firme e rumo claro andam juntos: cantar parece ser uma das formas de você sentir que está indo a algum lugar.',baixo:'Voz e direção estão baixas ao mesmo tempo. Retomar o canto em escala pequena pode devolver sensação de caminho.',melhor:'Na voz você está mais firme do que o mapa de direção sugere. O canto pode ser a parte do rumo que já está clara.',pior:'O mapa mostra rumo, mas a voz dos dias ficou frágil. Cuidar do instrumento pode ser o próximo passo concreto desse rumo.'}},
  {ci:'sono',lbl:'Sono',dim:'corpo',mlbl:'Corpo',
   t:{bom:'Você dormiu bem e o corpo diz o mesmo no mapa.',baixo:'Sono curto e corpo pedindo atenção aparecem juntos. Dormir um pouco mais cedo é o ajuste mais barato que existe.',melhor:'Você dormiu melhor do que o mapa do corpo sugere. O cansaço pode ter outra origem além das horas de sono.',pior:'O mapa mostra um corpo bem, mas as noites foram curtas. Vale proteger o sono antes que ele cobre a conta.'}},
  {ci:'sono',lbl:'Sono',dim:'energia',mlbl:'Energia',
   t:{bom:'Você dormiu bem e o mapa mostra energia: o sono está pagando a conta do seu fôlego.',baixo:'Sono curto e pouca energia aparecem juntos. Dormir um pouco mais cedo costuma devolver fôlego mais rápido do que qualquer outra coisa.',melhor:'Você dormiu melhor do que a energia do mapa sugere. O cansaço pode ter outra origem além das horas de sono.',pior:'O mapa mostra energia, mas as noites foram curtas. Você pode estar rodando na reserva.'}},
  {ci:'sono',lbl:'Sono',dim:'regulacao',mlbl:'Regulação',
   t:{bom:'Noites boas e reações mais firmes: dormir bem é parte de como você volta ao seu eixo.',baixo:'Sono curto e reações difíceis de segurar. Antes de se cobrar mais calma, proteja a noite.',melhor:'Você dormiu bem e ainda assim o mapa mostra reações mais difíceis. Vale olhar o que está pesando além do descanso.',pior:'O mapa mostra boa regulação, mas as noites foram curtas. Você pode estar sustentando a calma com esforço extra.'}},
  {ci:'ref',lbl:'Refeições',dim:'corpo',mlbl:'Corpo',
   t:{bom:'Você tem se alimentado com regularidade e o corpo no mapa acompanha. É um cuidado silencioso que sustenta o resto.',baixo:'Poucas refeições registradas e corpo pedindo atenção. Comer com horário é uma das bases mais simples de cuidado.',melhor:'Você comeu com mais regularidade do que o mapa do corpo sugere. A comida está do seu lado, o cansaço vem de outro lugar.',pior:'O mapa mostra um corpo bem, mas as refeições registradas foram poucas. Vale ver se você não está pulando comida por correria.'}},
  {ci:'leves',lbl:'Emoções que você nomeou',dim:'__clima',mlbl:'Clima emocional',
   t:{bom:'As emoções que você nomeou nos dias foram na maioria leves, e o mapa tem o mesmo tom.',baixo:'As emoções do dia e o mapa carregam o mesmo peso. Dar nome ao que sente já é parte do cuidado.',melhor:'Nos dias suas emoções foram mais leves do que o mapa deixa transparecer. Você vive mais leveza do que acredita.',pior:'O mapa soa mais leve do que as emoções que você registrou. Vale escutar o que fica de fora quando se responde tudo de uma vez.'}},
  {ci:'leves',lbl:'Emoções que você nomeou',dim:'regulacao',mlbl:'Regulação',
   t:{bom:'Emoções leves e boa regulação: você está nomeando o que sente e voltando ao seu eixo.',baixo:'As emoções dos dias foram pesadas e as reações escapam. Dar nome ao que sente já é parte do cuidado.',melhor:'Suas emoções dos dias foram mais leves do que o mapa de regulação sugere. Você se sai melhor do que acredita.',pior:'O mapa mostra firmeza, mas as emoções nomeadas foram pesadas. Segurar firme não é o mesmo que se sentir bem: vale dar espaço ao que pesa.'}},
  {ci:'cont',lbl:'Gestos de carinho consigo',dim:'autopercepcao',mlbl:'Autopercepção',
   t:{bom:'Gestos de carinho consigo (cafuné, creme, batom) e uma autopercepção generosa andam juntos. O cuidado vira o jeito de você se ver.',baixo:'Poucos gestos de carinho consigo e um olhar duro sobre si. Um gesto pequeno por dia é uma forma concreta de começar a mudar essa voz.',melhor:'Você se cuidou mais do que o mapa de autopercepção indica. Seus atos já são mais gentis do que a sua voz interna.',pior:'O mapa mostra um olhar carinhoso, mas os gestos de cuidado foram poucos. Deixar o carinho sair do pensamento e virar ato pode ajudar.'}},
  {ci:'pal',lbl:'Palavras e apoio (conversa, escrita, terapia)',dim:'conexao',mlbl:'Conexão',
   t:{bom:'Conversas, escrita e terapia estão presentes e a conexão no mapa também. Você tem onde colocar o que sente.',baixo:'Poucas práticas de palavra e pouca conexão. Uma mensagem honesta para uma pessoa só já muda o quadro.',melhor:'Você buscou palavras e apoio mais do que o mapa de conexão indica. Pode estar construindo laços que ainda não chegaram no sentimento.',pior:'O mapa mostra gente por perto, mas poucas práticas de palavra. A companhia pode estar sem espaço para conversa de verdade.'}}
];
function ciFmt(n,d){return (Math.round(n*Math.pow(10,d))/Math.pow(10,d)).toFixed(d).replace('.',',');}
function ciMedia(arr){return arr.length?arr.reduce((a,b)=>a+b,0)/arr.length:null;}
function ciColetar(ciclo){
  const fim=(ciclo&&ciclo.data)||hoje();
  const ini=fmtD(addDias(new Date(fim+'T12:00:00'),-20));
  const meio=fmtD(addDias(new Date(fim+'T12:00:00'),-10));
  const dias=Object.entries(S.checkins||{}).filter(([d])=>d>=ini&&d<=fim).sort((a,b)=>a[0].localeCompare(b[0]));
  const esc={};const escMeio={a:{},b:{}};
  const sono=[];const emo={};const classes=[];
  const ref=[];const pratDias=[];
  const diaInfo=[];
  dias.forEach(([d,ci])=>{
    const info={d,sono:null,mental:null,fisica:null,cls:null,prat:0};
    if(ci.escalas)Object.entries(ci.escalas).forEach(([k,v])=>{
      if(typeof v!=='number'||v<1)return;
      (esc[k]=esc[k]||[]).push(v);
      const lado=d<meio?'a':'b';(escMeio[lado][k]=escMeio[lado][k]||[]).push(v);
      if(k==='mental')info.mental=v;if(k==='fisica')info.fisica=v;
    });
    if(ci.dormiu&&ci.acordou){const [h,m]=horasDormidas(ci.dormiu,ci.acordou).split('h').map(Number);const min=h*60+(m||0);sono.push(min);info.sono=min;}
    const e=(ci.emocao||'').trim().toLowerCase();
    if(e){emo[e]=(emo[e]||0)+1;const c=ciClasseEmocao(e);if(c){classes.push(c);info.cls=c;}}
    const nRef=(ci.refeicoes||[]).length;
    if(nRef)ref.push(nRef);
    info.ref=nRef;
    if(ci.praticas){
      const ks=Object.keys(ci.praticas).filter(k=>ci.praticas[k]);
      if(ks.length){
        info.prat=ks.length;
        pratDias.push({cont:ks.filter(k=>k.indexOf('🤍')===0).length,pal:ks.filter(k=>k.indexOf('💌')===0).length});
      }
    }
    diaInfo.push(info);
  });
  const diasComDado=dias.filter(([,ci])=>(ci.escalas&&Object.keys(ci.escalas).length)||(ci.emocao||'').trim()||(ci.dormiu&&ci.acordou)||(ci.refeicoes||[]).length||(ci.praticas&&Object.keys(ci.praticas).length)).length;
  return{ini,fim,esc,escMeio,sono,emo,classes,ref,pratDias,diaInfo,diasComDado};
}
function ciClimaMapa(r){
  const v=[typeof r.prazer==='number'?r.prazer:null,typeof r.ansiedade==='number'?100-r.ansiedade:null,typeof r.sobrecarga==='number'?100-r.sobrecarga:null].filter(x=>x!==null);
  return v.length?Math.round(ciMedia(v)):null;
}
function ciCorBarra(v){return v>=60?'#6ea87a':v>=35?'#8F80D1':'#c98a5a';}
function ciBarra(rot,pct,txt,tend,cor){
  return`<div class="ci-bar-row"><span class="k">${esc(rot)}</span><span class="trk"><i style="width:${Math.max(2,Math.min(100,pct))}%;background:${cor}"></i></span>${tend!==undefined?`<span class="tend">${tend}</span>`:''}<span class="v">${esc(txt)}</span></div>`;
}
/* valor do check-in (0-100, quanto mais alto melhor) para cada chave de par */
function ciValor(D,key){
  const m=ks=>{const l=ks.filter(k=>D.esc[k]&&D.esc[k].length);return l.length?ciMedia(l.map(k=>ciMedia(D.esc[k]))):null;};
  const e10=v=>v===null?null:{pct:v*10,txt:ciFmt(v,1)+' /10'};
  switch(key){
    case 'fisica':return e10(m(['fisica']));
    case 'mental':return e10(m(['mental']));
    case 'autoconf':return e10(m(['autoconf']));
    case 'casa':return e10(m(['organizacao','limpeza']));
    case 'voz':return e10(m(['belting','lirico']));
    case 'danca':return e10(m(['danca']));
    case 'sono':{if(D.sono.length<3)return null;const mm=Math.round(ciMedia(D.sono));return{pct:Math.max(0,Math.min(100,(mm/60-5)/3*100)),txt:Math.floor(mm/60)+'h'+String(mm%60).padStart(2,'0')};}
    case 'ref':{if(D.ref.length<3)return null;const n=ciMedia(D.ref);return{pct:Math.min(100,n/4*100),txt:ciFmt(n,1)+' refeições/dia'};}
    case 'leves':{if(D.classes.length<3)return null;const l=D.classes.filter(c=>c==='leve').length;const p=l/D.classes.length*100;return{pct:p,txt:Math.round(p)+'% leves'};}
    case 'cont':{if(D.pratDias.length<3)return null;const n=ciMedia(D.pratDias.map(x=>x.cont));return{pct:Math.min(100,n/3*100),txt:ciFmt(n,1)+' gestos/dia'};}
    case 'pal':{if(D.pratDias.length<3)return null;const n=ciMedia(D.pratDias.map(x=>x.pal));return{pct:Math.min(100,n/2*100),txt:ciFmt(n,1)+' práticas/dia'};}
  }
  return null;
}
function ciListaNomes(arr){const n=arr.map(x=>x.P.lbl.toLowerCase());return n.length===1?n[0]:n.slice(0,-1).join(', ')+' e '+n[n.length-1];}
/* ===== Pistas concretas: sono / refeições × dimensões do mapa =====
   4 tons em ordem: acolhedor, acolhedor, TCC, TCC, desafiador, desafiador, leve, leve.
   Cada texto coloca dois fatos lado a lado, sem afirmar causa.
   Placeholders: {dispLonga} {dispCurta} {mapaVal} {mapaNome} {refMais} {refMenos} */
const BANCO_PISTAS={
  sono_disp_diferente:[
    "Nas noites de 7h ou mais, sua disposição média ficou em <b>{dispLonga}</b>; nas noites mais curtas, em <b>{dispCurta}</b>. No mapa deste ciclo, {mapaNome} está em <b>{mapaVal}</b>.",
    "Quando o sono passou de 7h, a disposição do dia ficou em torno de <b>{dispLonga}</b>; quando ficou abaixo disso, em <b>{dispCurta}</b>. O retrato de {mapaNome} neste mapa marca <b>{mapaVal}</b>.",
    "Comparando os dias com sono de 7h ou mais e os dias com noites mais curtas, a disposição média foi <b>{dispLonga}</b> e <b>{dispCurta}</b>, respectivamente. No mapa, {mapaNome} aparece em <b>{mapaVal}</b>.",
    "Nos registros deste ciclo, noites mais longas acompanharam disposição média de <b>{dispLonga}</b>; noites mais curtas, de <b>{dispCurta}</b>. O mapa mostra {mapaNome} em <b>{mapaVal}</b>.",
    "Disposição média nas noites de 7h ou mais: <b>{dispLonga}</b>. Nas noites mais curtas: <b>{dispCurta}</b>. {mapaNome} no mapa deste ciclo: <b>{mapaVal}</b>.",
    "Os dias com sono mais longo registraram disposição <b>{dispLonga}</b>; os com sono mais curto, <b>{dispCurta}</b>. Ao lado disso, o mapa marca {mapaNome} em <b>{mapaVal}</b>.",
    "Noites longas → disposição média <b>{dispLonga}</b>. Noites curtas → <b>{dispCurta}</b>. Mapa de {mapaNome}: <b>{mapaVal}</b>.",
    "Sono de 7h+: disposição <b>{dispLonga}</b>. Sono mais curto: <b>{dispCurta}</b>. E o mapa aponta {mapaNome} em <b>{mapaVal}</b>."
  ],
  sono_disp_parecida:[
    "Nas noites longas e nas curtas a disposição ficou parecida: <b>{dispLonga}</b> e <b>{dispCurta}</b>. No mapa deste ciclo, {mapaNome} está em <b>{mapaVal}</b>.",
    "Sono de 7h ou mais e sono mais curto renderam disposições próximas (<b>{dispLonga}</b> e <b>{dispCurta}</b>). O retrato de {mapaNome} marca <b>{mapaVal}</b>.",
    "A disposição média quase não mudou entre noites longas (<b>{dispLonga}</b>) e curtas (<b>{dispCurta}</b>). No mapa, {mapaNome} aparece em <b>{mapaVal}</b>.",
    "Comparando sono longo e curto, a disposição ficou em <b>{dispLonga}</b> e <b>{dispCurta}</b>. O mapa deste ciclo mostra {mapaNome} em <b>{mapaVal}</b>.",
    "Disposição com sono longo: <b>{dispLonga}</b>. Com sono curto: <b>{dispCurta}</b>. {mapaNome} no mapa: <b>{mapaVal}</b>.",
    "Noites longas e curtas com disposição quase igual (<b>{dispLonga}</b> e <b>{dispCurta}</b>). Mapa de {mapaNome}: <b>{mapaVal}</b>.",
    "Sono longo ou curto, a disposição ficou em torno de <b>{dispLonga}</b> e <b>{dispCurta}</b>. O mapa marca {mapaNome} em <b>{mapaVal}</b>.",
    "Disposição estável entre noites longas e curtas (<b>{dispLonga}</b> / <b>{dispCurta}</b>). {mapaNome} no mapa: <b>{mapaVal}</b>."
  ],
  ref_disp_diferente:[
    "Nos dias com 3 ou mais refeições registradas, a disposição média foi <b>{refMais}</b>; nos dias com 0 ou 1 refeição, <b>{refMenos}</b>. No mapa deste ciclo, {mapaNome} está em <b>{mapaVal}</b>.",
    "Quando você registrou 3 ou mais refeições, a disposição ficou em torno de <b>{refMais}</b>; com 0 ou 1 refeição, em <b>{refMenos}</b>. O retrato de {mapaNome} marca <b>{mapaVal}</b>.",
    "Comparando dias com mais refeições e dias com poucas, a disposição média foi <b>{refMais}</b> e <b>{refMenos}</b>. No mapa, {mapaNome} aparece em <b>{mapaVal}</b>.",
    "Dias com 3+ refeições: disposição <b>{refMais}</b>. Dias com 0 ou 1: <b>{refMenos}</b>. O mapa mostra {mapaNome} em <b>{mapaVal}</b>.",
    "Disposição média com 3 ou mais refeições: <b>{refMais}</b>. Com 0 ou 1: <b>{refMenos}</b>. {mapaNome} no mapa deste ciclo: <b>{mapaVal}</b>.",
    "Mais refeições no dia acompanharam disposição <b>{refMais}</b>; poucas refeições, <b>{refMenos}</b>. Ao lado disso, o mapa marca {mapaNome} em <b>{mapaVal}</b>.",
    "3+ refeições → disposição <b>{refMais}</b>. 0 ou 1 → <b>{refMenos}</b>. Mapa de {mapaNome}: <b>{mapaVal}</b>.",
    "Dias com mais comida registrada: disposição <b>{refMais}</b>. Com poucas refeições: <b>{refMenos}</b>. E o mapa aponta {mapaNome} em <b>{mapaVal}</b>."
  ],
  ref_disp_parecida:[
    "Dias com 3 ou mais refeições e dias com 0 ou 1 tiveram disposição parecida: <b>{refMais}</b> e <b>{refMenos}</b>. No mapa deste ciclo, {mapaNome} está em <b>{mapaVal}</b>.",
    "A disposição quase não mudou entre dias com mais refeições (<b>{refMais}</b>) e com poucas (<b>{refMenos}</b>). O retrato de {mapaNome} marca <b>{mapaVal}</b>.",
    "Comparando volume de refeições, a disposição ficou em <b>{refMais}</b> e <b>{refMenos}</b>. No mapa, {mapaNome} aparece em <b>{mapaVal}</b>.",
    "3+ refeições e 0 ou 1 refeição renderam disposições próximas (<b>{refMais}</b> e <b>{refMenos}</b>). O mapa mostra {mapaNome} em <b>{mapaVal}</b>.",
    "Disposição com mais refeições: <b>{refMais}</b>. Com poucas: <b>{refMenos}</b>. {mapaNome} no mapa: <b>{mapaVal}</b>.",
    "Volume de refeições diferente, disposição quase igual (<b>{refMais}</b> e <b>{refMenos}</b>). Mapa de {mapaNome}: <b>{mapaVal}</b>.",
    "Mais ou menos refeições, a disposição ficou em torno de <b>{refMais}</b> e <b>{refMenos}</b>. O mapa marca {mapaNome} em <b>{mapaVal}</b>.",
    "Disposição estável entre dias com mais e com menos refeições (<b>{refMais}</b> / <b>{refMenos}</b>). {mapaNome} no mapa: <b>{mapaVal}</b>."
  ]
};
function pistaEscolher(lista,chave,desloc){let h=0;for(let i=0;i<chave.length;i++)h=(h*31+chave.charCodeAt(i))%100003;return lista[(h+(desloc||0))%lista.length];}
function pistaPreencher(t,vars){return t.replace(/\{(\w+)\}/g,(_,k)=>vars[k]!==undefined?vars[k]:'');}


function montarCheckinRelatorio(ciclo){
  const vazio={corr:'',ind:''};
  const r=(ciclo&&(ciclo.resumo||calculaScoreCiclo(ciclo)))||null;
  const D=ciColetar(ciclo);
  if(!D.diasComDado)return vazio;
  const nome=primeiroNome();

  /* ===== 1. CORRELAÇÕES (vêm primeiro) ===== */
  const prontos=[];
  if(r){
    CI_PARES.forEach(P=>{
      const cv=ciValor(D,P.ci);if(!cv)return;
      let mapaBom,mapaTxt;
      if(P.dim==='__clima'){mapaBom=ciClimaMapa(r);if(mapaBom===null)return;mapaTxt=mapaBom+' /100';}
      else{const dd=CICLO_DIMS.find(x=>x.key===P.dim);const v=r[P.dim];if(typeof v!=='number')return;mapaBom=dd.sobeBom?v:100-v;mapaTxt=dd.nome+' '+v;}
      const dif=cv.pct-mapaBom;const media=(cv.pct+mapaBom)/2;
      let grupo,st,cls,txt;
      if(dif>15){grupo='div';st='Dia a dia melhor';cls='up';txt=P.t.melhor;}
      else if(dif<-15){grupo='div';st='Dia a dia mais pesado';cls='dn';txt=P.t.pior;}
      else if(media>=55){grupo='sust';st='Se sustentam';cls='ok';txt=P.t.bom;}
      else{grupo='cuid';st='Pedem cuidado';cls='dn';txt=P.t.baixo;}
      prontos.push({P,ciPct:cv.pct,ciTxt:cv.txt,mapaBom,mapaTxt,st,cls,txt,grupo,media,dif});
    });
  }
  let corr=`<div class="ci-rel"><div class="rel-h2">O que o seu check-in conta sobre o mapa</div>`;
  corr+=`<p class="rel-p">Nesses 21 dias você fez check-in em <b>${D.diasComDado}</b> ${D.diasComDado===1?'dia':'dias'}. Cruzei o que você viveu no dia a dia com o que o mapa mostrou${nome?', '+esc(nome):''}, para ver onde as duas leituras se confirmam, onde pedem cuidado e onde discordam. Os índices completos estão no final do relatório.</p>`;
  if(prontos.length){
    const sust=prontos.filter(x=>x.grupo==='sust').sort((a,b)=>b.media-a.media);
    const cuid=prontos.filter(x=>x.grupo==='cuid').sort((a,b)=>a.media-b.media);
    const div=prontos.filter(x=>x.grupo==='div').sort((a,b)=>Math.abs(b.dif)-Math.abs(a.dif));
    let fio=`Consegui fazer <b>${prontos.length}</b> cruzamentos.`;
    if(sust.length)fio+=` O que mais te sustenta, nos dois lados: <b>${esc(ciListaNomes(sust.slice(0,2)))}</b>.`;
    if(cuid.length)fio+=` O que mais pede cuidado, nos dois lados: <b>${esc(ciListaNomes(cuid.slice(0,2)))}</b>.`;
    if(div.length)fio+=` ${div.length===1?'Um ponto em que':div.length+' pontos em que'} o mapa e o dia a dia discordam, e vale olhar com curiosidade.`;
    corr+=`<p class="rel-p">${fio}</p>`;
    const cartao=(titulo,lista,nota)=>{
      if(!lista.length)return '';
      let h=`<div class="ci-card-rel"><div class="ci-tt">${titulo}</div>`;
      if(nota)h+=`<div class="ci-nota" style="margin:0 0 6px">${nota}</div>`;
      lista.forEach(x=>{
        h+=`<div class="ci-par"><div class="ci-par-t"><span>${esc(x.P.lbl)} × ${esc(x.P.mlbl)}</span><span class="st ${x.cls}">${x.st}</span></div>${ciBarra('Check-in',x.ciPct,x.ciTxt,undefined,ciCorBarra(x.ciPct))}${ciBarra('Mapa',x.mapaBom,x.mapaTxt,undefined,ciCorBarra(x.mapaBom))}<div class="ci-par-txt">${esc(x.txt)}</div></div>`;
      });
      return h+`</div>`;
    };
    corr+=cartao('🌿 Onde o dia a dia e o mapa se sustentam',sust,'Os dois lados contam a mesma coisa boa. São seus pontos de apoio.');
    corr+=cartao('🫶 Onde os dois pedem cuidado',cuid,'Os dois lados contam a mesma coisa difícil. Não é impressão: vale um gesto pequeno aqui.');
    corr+=cartao('🔀 Onde o mapa e o dia a dia contam coisas diferentes',div,'Nenhum dos dois está errado. Cada um mostra um lado seu.');
    corr+=`<div class="ci-nota">As barras estão na mesma direção: quanto mais cheia, melhor. Ansiedade e sobrecarga do mapa aparecem invertidas para comparar de igual pra igual.</div>`;
  } else {
    corr+=`<p class="rel-p">Ainda não há registros suficientes para cruzar o check-in com o mapa. Com pelo menos 3 dias de sono, escalas, refeições ou emoções, as conexões começam a aparecer.</p>`;
  }

  /* --- padrões dentro dos próprios dias + pistas sono/refeições × mapa --- */
  const ins=[];
  const disp=i=>{const v=[i.mental,i.fisica].filter(x=>typeof x==='number');return v.length?ciMedia(v):null;};
  const dLeve=D.diaInfo.filter(i=>i.cls==='leve'&&disp(i)!==null).map(disp);
  const dPes=D.diaInfo.filter(i=>i.cls==='pesada'&&disp(i)!==null).map(disp);
  if(dLeve.length>=2&&dPes.length>=2){
    const a=ciMedia(dLeve),b=ciMedia(dPes);
    ins.push(`Nos dias em que você nomeou emoções leves, sua disposição média foi <b>${ciFmt(a,1)}</b>; nos dias de emoções pesadas, <b>${ciFmt(b,1)}</b>. ${a-b>=1?'O que você sente e como o seu corpo e a sua mente respondem andam bem coladinhos.':'A emoção do dia e a disposição nem sempre andam juntas, e isso também é um dado a seu favor: você segue funcionando mesmo nos dias pesados.'}`);
  }
  const comPrat=D.diaInfo.filter(i=>i.prat>0&&disp(i)!==null).map(disp);
  const semPrat=D.diaInfo.filter(i=>i.prat===0&&disp(i)!==null).map(disp);
  if(comPrat.length>=3&&semPrat.length>=3){
    const a=ciMedia(comPrat),b=ciMedia(semPrat);
    ins.push(Math.abs(a-b)>=0.7?`Nos dias em que você marcou alguma prática, a sua disposição média foi <b>${ciFmt(a,1)}</b>; nos dias sem prática, <b>${ciFmt(b,1)}</b>. ${a>b?'Os pequenos cuidados parecem fazer diferença real no seu dia, e vale protegê-los mesmo nos dias corridos.':'Nos dias de prática a disposição não foi maior, o que pode indicar que você se cuida justamente quando está pior. É um bom reflexo.'}`:`Com ou sem práticas marcadas, a sua disposição média ficou parecida (<b>${ciFmt(a,1)}</b> e <b>${ciFmt(b,1)}</b>).`);
  }
  if(ins.length){corr+=`<div class="ci-card-rel"><div class="ci-tt">🔍 O que se repete nos seus dias</div>${ins.map(x=>`<div class="ci-insight">${x}</div>`).join('')}</div>`;}

  /* Pistas concretas: sono e refeições × dimensões do mapa (fatos lado a lado) */
  const pistas=[];
  const chaveCiclo=(ciclo&&ciclo.data)||D.fim||hoje();
  const dimsPista=[
    {key:'energia',nome:'energia'},
    {key:'corpo',nome:'corpo'},
    {key:'regulacao',nome:'regulação'}
  ];
  if(r){
    const longas=D.diaInfo.filter(i=>i.sono!==null&&i.sono>=420&&disp(i)!==null).map(disp);
    const curtas=D.diaInfo.filter(i=>i.sono!==null&&i.sono<420&&disp(i)!==null).map(disp);
    if(longas.length>=3&&curtas.length>=3){
      const a=ciMedia(longas),b=ciMedia(curtas);
      const difAbs=Math.abs(a-b);
      const lista=difAbs>=0.7?BANCO_PISTAS.sono_disp_diferente:BANCO_PISTAS.sono_disp_parecida;
      const dimsComScore=dimsPista.filter(d=>typeof r[d.key]==='number');
      dimsComScore.slice(0,2).forEach((d,pos)=>{
        const tpl=pistaEscolher(lista,chaveCiclo+'sono'+d.key,pos);
        pistas.push(pistaPreencher(tpl,{
          dispLonga:ciFmt(a,1),
          dispCurta:ciFmt(b,1),
          mapaVal:String(r[d.key]),
          mapaNome:d.nome
        }));
      });
    }
    const refMais=D.diaInfo.filter(i=>typeof i.ref==='number'&&i.ref>=3&&disp(i)!==null).map(disp);
    const refMenos=D.diaInfo.filter(i=>typeof i.ref==='number'&&i.ref<=1&&disp(i)!==null).map(disp);
    if(refMais.length>=3&&refMenos.length>=3){
      const a=ciMedia(refMais),b=ciMedia(refMenos);
      const difAbs=Math.abs(a-b);
      const lista=difAbs>=0.7?BANCO_PISTAS.ref_disp_diferente:BANCO_PISTAS.ref_disp_parecida;
      const dimsRef=[{key:'corpo',nome:'corpo'},{key:'energia',nome:'energia'}].filter(d=>typeof r[d.key]==='number');
      dimsRef.slice(0,2).forEach((d,pos)=>{
        const tpl=pistaEscolher(lista,chaveCiclo+'ref'+d.key,pos);
        pistas.push(pistaPreencher(tpl,{
          refMais:ciFmt(a,1),
          refMenos:ciFmt(b,1),
          mapaVal:String(r[d.key]),
          mapaNome:d.nome
        }));
      });
    }
  }
  if(pistas.length){
    corr+=`<div class="ci-card-rel"><div class="ci-tt">🌙 Pistas de sono e refeições</div><div class="ci-nota" style="margin:0 0 6px">Dois fatos lado a lado: o que o check-in mostrou nos dias e o que o mapa marcou neste ciclo.</div>${pistas.map(x=>`<div class="ci-insight">${x}</div>`).join('')}</div>`;
  }
  if(D.diasComDado<3){corr+=`<div class="ci-nota">Ainda há poucos dias de check-in neste período, então a leitura é parcial. Quanto mais você registra, mais fiel fica a conversa com o mapa.</div>`;}
  corr+='</div>';

  /* ===== 2. ÍNDICES (vão para o final do relatório) ===== */
  let ind=`<div class="ci-rel"><div class="rel-h2">Seus índices do check-in</div>`;
  const linhas=ESCALAS.filter(([k])=>D.esc[k]&&D.esc[k].length).map(([k,rot])=>{
    const m=ciMedia(D.esc[k]);const a=D.escMeio.a[k],b=D.escMeio.b[k];
    let tend='';if(a&&b&&a.length>=2&&b.length>=2){const dif=ciMedia(b)-ciMedia(a);tend=dif>=0.8?'↑':dif<=-0.8?'↓':'→';}
    return ciBarra(rot,m*10,ciFmt(m,1)+' /10',tend,ciCorBarra(m*10));
  }).join('');
  const indLinhas=linhas?`${linhas}<div class="ci-nota">As setas comparam a primeira e a segunda metade do período. Aqui, quanto mais alto, melhor.</div>`:'';
  if(linhas){ind+=`<div class="ci-card-rel"><div class="ci-tt">📊 Índices do check-in · média de 21 dias</div>${linhas}<div class="ci-nota">As setas comparam a primeira e a segunda metade do período. Aqui, quanto mais alto, melhor.</div></div>`;}
  let extra='';
  if(D.sono.length){const m=Math.round(ciMedia(D.sono));extra+=`<div class="ci-bar-row"><span class="k">Sono médio</span><span class="trk"><i style="width:${Math.max(2,Math.min(100,(m/60-5)/3*100))}%;background:${ciCorBarra((m/60-5)/3*100)}"></i></span><span class="v">${Math.floor(m/60)}h${String(m%60).padStart(2,'0')}</span></div>`;}
  const topEmo=Object.entries(D.emo).sort((a,b)=>b[1]-a[1]).slice(0,8);
  if(topEmo.length){extra+=`<div class="ci-chips">${topEmo.map(([e,c])=>`<span>💗 ${esc(e)} · ${c}</span>`).join('')}</div>`;}
  const indExtra=extra?`<div class="ci-rel"><div class="ci-card-rel"><div class="ci-tt">🌙 Sono e emoções do período</div>${extra}</div></div>`:'';
  if(extra)ind+=`<div class="ci-card-rel"><div class="ci-tt">🌙 Sono e emoções do período</div>${extra}</div>`;
  ind+='</div>';
  if(!linhas&&!extra)ind='';
  return{corr,ind,pares:prontos,indLinhas,indExtra};
}

/* ===== Hábitos no relatório do mapa =====
   Banco de mensagens por cenário. Variáveis: {dim} = dimensão (ex: energia), {habs} = hábitos em negrito.
   A variação é escolhida por uma conta fixa (data do mapa + dimensão), então o relatório
   não muda de texto cada vez que é aberto. */
const BANCO_HAB_MAPA={
  /* melhorou, estavel e piorou: 8 textos cada, na ordem acolhedor, acolhedor, TCC, TCC, desafiador, desafiador, leve, leve */
  melhorou:[
    "Em {dim}, o mapa deste ciclo está melhor que o do anterior. E foi nesse mesmo tempo que você cuidou de {habs}. Respira nisso: o que você faz por você e o que você sente estão andando juntos, e dá para sentir orgulho disso.",
    "Algo se acomodou em {dim} neste mapa, e nesses dias você seguiu com {habs}. Cuidar de si em silêncio, dia após dia, é bonito de ver ao lado desse resultado.",
    "Em {dim}, o mapa mostra melhora em relação ao anterior, e nesses mesmos dias você manteve {habs}. Na TCC, isso se chama evidência: ação e sentir caminhando na mesma direção.",
    "Em {dim}, o mapa melhorou, e o seu registro mostra você com {habs} nesse período. Dados assim ajudam a revisar a crença de que nada do que você faz muda alguma coisa.",
    "Em {dim}, o mapa melhorou, e você esteve presente com {habs} nesse caminho. Agora o desafio é segurar o ritmo no próximo ciclo.",
    "{dim} deu um salto bom no mapa, e você manteve {habs} sem largar. Faz sentido continuar com a mesma receita no próximo ciclo.",
    "Olha só: {dim} melhorou no mapa, e você manteve {habs} na rotina o tempo todo. Seus hábitos e seu sentir estão no mesmo time!",
    "Notícia boa: o mapa de {dim} está melhor, e você andou com {habs} nesse período. Hora de comemorar um pouquinho!"
  ],
  estavel:[
    "Em {dim}, o mapa ficou parecido com o anterior, enquanto você seguia com {habs}. Estável também é chão, e dá para descansar em cima dele.",
    "Em {dim}, nada mudou muito de um mapa para o outro, e nesse tempo você manteve {habs}. Manter já é cuidar, mesmo quando o retrato fica igual.",
    "Em {dim}, o mapa ficou estável, e você manteve {habs} no período. Na TCC, estabilidade em fase de mudança é um bom sinal: a base não balançou enquanto você construía rotina.",
    "Em {dim}, o retrato ficou igual ao anterior, com {habs} no seu registro. Mudanças de comportamento costumam aparecer devagar no humor, e esse é um bom ponto de partida para o próximo mapa.",
    "Em {dim}, o mapa não se moveu, e você manteve {habs} do mesmo jeito. Se quiser ver essa dimensão mexer, o próximo ciclo pode pedir um pouco mais de intenção.",
    "Em {dim}, tudo igual no mapa, e você continuou com {habs}. Constância sem pressa também é força. Segue.",
    "Em {dim}, o mapa ficou no mesmo lugar, e você manteve {habs}. Estabilidade também é conquista, e quem segura o básico merece um café.",
    "Em {dim}, o mapa deu uma pausa dramática: ficou igualzinho, e você seguiu com {habs}. Vamos ver o que o próximo capítulo traz."
  ],
  piorou:[
    "Em {dim}, o mapa mostra um ciclo mais difícil que o anterior, e você seguiu com {habs} mesmo assim. Em fases mais duras, manter o básico já é sustentação. Se algum hábito estiver pedindo demais, vale diminuir o tamanho dele em vez de largar.",
    "O retrato de {dim} ficou mais pesado neste ciclo, e ainda assim você manteve {habs} nos seus dias. Ciclos difíceis não apagam o que você construiu. Se der, escolha só um hábito para proteger agora e deixe os outros em versão pequena.",
    "Em {dim}, o mapa mostra um ciclo mais duro que o anterior, e o seu registro mostra você com {habs}. Na TCC, quando a fase aperta, o primeiro passo é reduzir o tamanho da tarefa, e não o tamanho da sua autoestima.",
    "Em {dim}, o mapa pesou mais neste ciclo, e você manteve {habs} no período. Um mapa é uma fotografia de um momento, e não uma sentença sobre o hábito nem sobre você.",
    "Em {dim}, este ciclo foi mais duro, e você continuou com {habs}. Agora o desafio é proteger o essencial: escolha um hábito e mantenha esse, nem que seja na versão minúscula.",
    "Em {dim}, o mapa apertou mais, e você não largou {habs}. Voltar para o básico não é recuar, é se reorganizar.",
    "Em {dim}, o mapa deu uma pesadinha neste ciclo, e você seguiu com {habs}. Respira, toma uma água e segue no seu ritmo.",
    "Em {dim}, este ciclo veio de capa de chuva, e você manteve {habs} debaixo dela. Ciclo difícil também passa, e dá para ajustar o tamanho dos hábitos se precisar."
  ],
  ponto:[
    "Em {dim}, este é o primeiro retrato, então ainda não dá para comparar. Os dias de {habs} ficam registrados como ponto de partida, e no próximo mapa a comparação começa.",
    "Este é o primeiro mapa, e {dim} já tem um ponto de partida. Os dias que você marcou com {habs} ficam guardados, e no próximo ciclo a conversa entre hábitos e mapa começa de verdade.",
    "Em {dim}, ainda não há com o que comparar, e tudo bem: um primeiro retrato é só o começo da história. Seus dias com {habs} entram nela desde já."
  ],
  sem_dias:[
    "Ainda há poucos dias marcados para cruzar com o mapa. Com pelo menos 3 dias em um hábito, a conversa com as dimensões começa a aparecer.",
    "Os hábitos deste ciclo ainda estão no começo, com poucos dias marcados. Quando um deles chegar a 3 dias, o mapa passa a conversar com ele.",
    "Ainda é cedo para cruzar hábitos e mapa, e isso é só uma questão de tempo. A partir de 3 dias marcados em um hábito, os comentários começam a aparecer aqui."
  ],
  sem_habito:[
    "Neste ciclo ainda não há hábitos marcados para cruzar com o mapa. Quando você começar o primeiro, o próximo mapa já vai mostrar a conversa entre os dois.",
    "Nenhum hábito marcado nesses 21 dias, e o mapa segue valendo como retrato. Quando um hábito entrar na sua rotina, ele passa a aparecer aqui, ao lado do que você sente.",
    "Ainda não há hábitos neste período para olhar junto com o mapa. Sem pressa: quando você quiser começar, o app guarda os dias e cruza com o próximo retrato."
  ],
  removido:[
    "Você também marcou {habs} antes de tirar da lista, e esses dias contam.",
    "Sobre {habs}: você tirou da lista neste período, e os dias marcados continuam sendo seus. Quando fizer sentido, ele volta.",
    "Mudar de ideia sobre {habs} faz parte. Você marcou esses dias antes de tirar da lista, e eles seguem na sua história."
  ],
  no_limite:[
    "Em fases pesadas, manter um gesto pequeno já é muito, e não precisa ser mais do que isso agora.",
    "Neste momento, o que importa é que esses gestos estão aí. Não precisa ser mais do que isso agora.",
    "Nesta fase, cada gesto pequeno que você manteve já é cuidado de verdade, e ele basta por enquanto."
  ],
  observacao:[
    "Você deixou este recado sobre a rotina deste ciclo. Ele fica junto do mapa, para a leitura ter o contexto da sua vida:",
    "Isto foi o que você contou sobre este ciclo. Vale ler o mapa com essas palavras ao lado:",
    "Você anotou o que mudou na sua rotina. Guardei aqui, junto do retrato:"
  ]
};
function habEscolher(lista,chave,desloc){let h=0;for(let i=0;i<chave.length;i++)h=(h*31+chave.charCodeAt(i))%100003;return lista[(h+(desloc||0))%lista.length];}
function habDimsDe(nome,id,dimsProprias,definidas){
  if(definidas)return Array.isArray(dimsProprias)?dimsProprias:[];
  if(Array.isArray(dimsProprias)&&dimsProprias.length)return dimsProprias;
  let achado=null;
  FILA_CATEGORIAS.forEach(c=>c.itens.forEach(i=>{if(!achado&&((i.id&&id&&i.id===id)||i.nome===nome))achado=i;}));
  return achado&&Array.isArray(achado.dims)?achado.dims:[];
}
function habDiasNaJanela(feitos,ini,fim){return Object.keys(feitos||{}).filter(d=>d>=ini&&d<=fim).length;}
function montarHabitosRelatorio(ciclo,rel){
  const X=BANCO.relatorio_detalhado;
  const fim=(ciclo&&/^\d{4}-\d{2}-\d{2}$/.test(ciclo.data||''))?ciclo.data:hoje();
  const ini=fmtD(addDias(new Date(fim+'T12:00:00'),-20));
  const dia=n=>n===1?'dia':'dias';
  const noLimite=!!(rel&&rel.panorama==='no_limite');
  const nomesEm=arr=>juntar(arr.map(h=>'<b>“'+esc(h.nome)+'”</b>'));
  const preencher=(t,dim,habs)=>t.replace(/\{dim\}/g,esc(dim||'')).replace(/\{habs\}/g,habs||'');

  /* 1. hábitos marcados na janela de 21 dias (ativos, pausados e removidos) */
  const lista=[];
  (S.habitos||[]).forEach(h=>{const n=habDiasNaJanela(h.feitos,ini,fim);if(n>0)lista.push({nome:h.nome,emoji:h.emoji||'🌱',dias:n,dims:habDimsDe(h.nome,h.id,h.dims,h.dimsDefinidas),removido:false});});
  Object.entries(S.historicoRemovidos||{}).forEach(([nome,v])=>{if(!v)return;const n=habDiasNaJanela(v.feitos,ini,fim);if(n>0){const m=v.meta||{};lista.push({nome,emoji:m.emoji||'🌱',dias:n,dims:habDimsDe(nome,m.id,m.dims,m.dimsDefinidas),removido:true});}});

  const titulo=`<div class="rel-h2">O que os seus hábitos contam sobre o mapa</div>`;
  if(!lista.length){
    if(noLimite)return '';
    return `<div class="ci-rel hab-rel">${titulo}<p class="rel-p">${habEscolher(BANCO_HAB_MAPA.sem_habito,fim)}</p></div>`;
  }

  /* 2. mapa anterior, para saber se cada dimensão melhorou, ficou igual ou ficou mais difícil */
  const hist=(S.ciclo&&S.ciclo.historico)||[];
  let idx=-1;
  const chaveRes=JSON.stringify(ciclo&&ciclo.resumo);
  for(let i=hist.length-1;i>=0;i--){if(hist[i].data===(ciclo&&ciclo.data)&&JSON.stringify(hist[i].resumo)===chaveRes){idx=i;break;}}
  if(idx<0){for(let i=hist.length-1;i>=0;i--){if(hist[i].data===(ciclo&&ciclo.data)){idx=i;break;}}}
  const ant=idx>0?hist[idx-1]:null;
  const r=(ciclo&&(ciclo.resumo||calculaScoreCiclo(ciclo)))||{};
  const rAnt=ant?(ant.resumo||calculaScoreCiclo(ant)):null;

  /* 3. cabeçalho e hábitos do ciclo */
  const chips=lista.map(h=>`<span>${esc(h.emoji)} ${esc(h.nome)} · ${h.dias} ${dia(h.dias)}</span>`).join('');
  let html=`<div class="ci-rel hab-rel">${titulo}`;
  html+=`<p class="rel-p">Nesses 21 dias você marcou <b>${lista.length}</b> ${lista.length===1?'hábito':'hábitos'}. Olhei para ${lista.length===1?'ele':'eles'} ao lado do que o mapa mostrou, sem transformar isso em cobrança.</p>`;
  html+=`<div class="ci-chips" style="margin:0 0 10px">${chips}</div>`;

  /* 4. fase muito pesada: só reconhece o gesto, sem cruzar números */
  if(noLimite){
    html+=`<p class="rel-p">${habEscolher(BANCO_HAB_MAPA.no_limite,fim)}</p></div>`;
    return html;
  }

  /* 5. cruzamento por dimensão (só hábitos com 3 dias ou mais) */
  const por={};
  lista.forEach(h=>{if(h.dias<3)return;h.dims.forEach(d=>{if(!DIMS.includes(d)||typeof r[d]!=='number')return;(por[d]=por[d]||{total:0,habs:[]});por[d].total+=h.dias;por[d].habs.push(h);});});
  const dimsOrd=Object.keys(por).sort((a,b)=>por[b].total-por[a].total).slice(0,3);

  if(!dimsOrd.length){
    html+=`<p class="rel-p">${habEscolher(BANCO_HAB_MAPA.sem_dias,fim)}</p>`;
  } else {
    let cartao=`<div class="ci-card-rel"><div class="ci-tt">🌱 Hábitos × mapa</div><div class="ci-nota" style="margin:0 0 6px">Cada bloco junta os hábitos ligados a uma dimensão e o que o mapa mostrou nela.</div>`;
    dimsOrd.forEach((d,pos)=>{
      const habs=por[d].habs.sort((a,b)=>b.dias-a.dias).slice(0,3);
      let estado='ponto',st='Ponto de partida',cls='up';
      if(rAnt&&typeof rAnt[d]==='number'){
        const m=melhora(d,r[d]-rAnt[d]);
        estado=m>=10?'melhorou':m<=-10?'piorou':'estavel';
      }
      if(estado==='melhorou'){st='Melhorou';cls='ok';}
      else if(estado==='estavel'){st='Estável';cls='up';}
      else if(estado==='piorou'){st='Ciclo mais duro';cls='dn';}
      const txt=preencher(habEscolher(BANCO_HAB_MAPA[estado],fim+dimsOrd[0],pos),X.nomes_curtos[d],nomesEm(habs));
      cartao+=`<div class="ci-par"><div class="ci-par-t"><span>${esc(X.nomes[d])}</span><span class="st ${cls}">${st}</span></div><div class="ci-par-txt">${txt}</div></div>`;
    });
    cartao+=`</div>`;
    html+=cartao;
  }

  /* 6. hábitos que foram tirados da lista dentro do período */
  const tirados=lista.filter(h=>h.removido);
  if(tirados.length){
    html+=`<div class="ci-nota">${preencher(habEscolher(BANCO_HAB_MAPA.removido,fim),'',nomesEm(tirados))}</div>`;
  }
  html+=`</div>`;
  return html;
}

/* ===== Observação escrita no mapa (o que mudou na rotina do ciclo) ===== */
function montarObservacaoMapa(ciclo){
  const t=((ciclo&&ciclo.observacao)||'').trim();
  if(!t)return '';
  const fim=(ciclo&&ciclo.data)||hoje();
  return `<div class="ci-rel hab-rel"><div class="rel-h2">O que você contou sobre este ciclo</div><p class="rel-p">${habEscolher(BANCO_HAB_MAPA.observacao,fim)}</p><div class="ci-card-rel"><div class="ci-par-txt" style="white-space:pre-wrap">${esc(t)}</div></div></div>`;
}

function abrirRelatorioCompleto(rel,ciclo){
  if(!rel)return;const o=$('relatorioOverlay');const corpo=$('relatorioCorpo');
  const dataStr=new Date().toLocaleDateString('pt-BR',{day:'numeric',month:'long',year:'numeric'});
  const nome=primeiroNome();
  let blocoNotas='';
  const cicloInicio=fmtD(addDias(new Date(),-21));
  const notasCiclo=[];
  (S.leiAtracao.desejos||[]).forEach(d=>{(d.notas||[]).forEach(n=>{if(n.data>=cicloInicio)notasCiclo.push({...n,desejo:d});});});
  if(notasCiclo.length){
    notasCiclo.sort((a,b)=>(b.data||'').localeCompare(a.data||''));
    const amostra=notasCiclo.slice(0,4);
    blocoNotas=`<div class="rel-notas"><div class="titulo-notas">💫 O que você notou nesses 21 dias</div>`+
      amostra.map(n=>{const data=new Date(n.data+'T12:00:00').toLocaleDateString('pt-BR',{day:'numeric',month:'short'});return`<div class="n"><span class="data">${esc(data)} · ${esc(n.desejo.texto)}</span>${esc(n.texto)}</div>`;}).join('')+
      `</div>`;
  }
  const titulo=nome?('Seu retrato dos 21 dias, '+esc(nome)):'Seu retrato dos 21 dias';
  let html=`<div class="rel-titulo">${titulo}</div><div class="rel-data">${esc(dataStr)}</div>`;
  let ciHtml='',ciInd='';try{const ciObj=montarCheckinRelatorio(ciclo);ciHtml=ciObj.corr;ciInd=ciObj.ind;}catch(e){console.warn('checkin no relatório',e);}
  let habHtml='';try{habHtml=montarHabitosRelatorio(ciclo,rel);}catch(e){console.warn('hábitos no relatório',e);}
  let obsHtml='';try{obsHtml=montarObservacaoMapa(ciclo);}catch(e){console.warn('observação no relatório',e);}
  let cartaHtml=null;
  try{cartaHtml=montarRelatorioCartaApp(rel,ciclo,{dataStr,obsHtml,blocoNotas,habHtml});}catch(e){console.warn('carta do relatório',e);}
  if(cartaHtml){corpo.innerHTML=cartaHtml;gatinhaRel(corpo,'topo',window.__cartaAcao||'feliz');try{ligarBotoesCarta(corpo);}catch(e){}o.hidden=false;requestAnimationFrame(()=>o.classList.add('ativo'));document.body.style.overflow='hidden';return;}
  const meioHtml=obsHtml+habHtml+ciHtml;
  const tituloPergunta=BANCO.relatorio_motivacional.titulos.pergunta;
  let ciFeito=false;
  rel.blocos.forEach(b=>{
    if(!ciFeito&&meioHtml&&((b.tipo==='h2'&&b.txt===tituloPergunta)||b.tipo==='pergunta'||b.tipo==='despedida')){html+=meioHtml;ciFeito=true;}
    if(b.tipo==='h2')html+=`<div class="rel-h2">${esc(b.txt)}</div>`;
    else if(b.tipo==='cluster')html+=`<p class="rel-p"><b>${esc(b.titulo)}.</b> ${esc(b.txt)}</p>`;
    else if(b.tipo==='p')html+=`<p class="rel-p">${b.txt.replace(/\*\*(.+?)\*\*/g,'<b>$1</b>')}</p>`;
    else if(b.tipo==='pergunta')html+=`<div class="rel-pergunta"><div class="rel-pergunta-q">${esc(b.txt)}</div></div>`;
    else if(b.tipo==='despedida')html+=`<div class="rel-despedida">${esc(b.txt)}</div>`;
    else if(b.tipo==='abertura')html+=`<p class="rel-p">${esc(b.txt)}</p>`;
  });
  if(!ciFeito&&meioHtml)html+=meioHtml;
  html+=blocoNotas;
  html+=ciInd;
  corpo.innerHTML=html;gatinhaRel(corpo,'topo','feliz');o.hidden=false;requestAnimationFrame(()=>o.classList.add('ativo'));document.body.style.overflow='hidden';
}
$('relatorioFechar').onclick=()=>{const o=$('relatorioOverlay');o.classList.remove('ativo');setTimeout(()=>{o.hidden=true;document.body.style.overflow='';},320);};
$('relatorioPDF').onclick=()=>setTimeout(()=>{try{window.print();}catch(e){avisar('Não consegui abrir a impressão. Tente pelo menu do navegador.');}},150);

