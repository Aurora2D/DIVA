/* ============ CHECK-IN ============ */
function atualizaStatusCheckin(){
  const ci=S.checkins[hoje()]||{};
  const nSono=(ci.dormiu?1:0)+(ci.acordou?1:0);
  const elS=$('stSono');if(elS){elS.textContent=nSono===2?'✓':nSono+'/2';elS.className='ci-status '+(nSono===2?'completo':nSono>0?'parcial':'');}
    const nRef=(ci.refeicoes||[]).length;const elR=$('stRef');if(elR){elR.textContent=nRef>0?'✓ '+nRef:'0';elR.className='ci-status '+(nRef>0?'completo':'');}
  const nEsc=ci.escalas?Object.values(ci.escalas).filter(v=>v!==undefined&&v!==null).length:0;const elSc=$('stEsc');if(elSc){elSc.textContent=nEsc===8?'✓':nEsc+'/8';elSc.className='ci-status '+(nEsc===8?'completo':nEsc>0?'parcial':'');}
  const nPrat=ci.praticas?Object.keys(ci.praticas).length:0;const elP=$('stPrat');if(elP){elP.textContent=nPrat>0?'✓ '+nPrat:'0';elP.className='ci-status '+(nPrat>0?'completo':'');}
  const temObs=(ci.observacoes||'').trim().length>0;const elO=$('stObs');if(elO){elO.textContent=temObs?'✓':'0';elO.className='ci-status '+(temObs?'completo':'');}
}
function renderCheckinResumos(){
  const ci=S.checkins[hoje()]||{};
  const preenchidos=[(ci.dormiu||ci.acordou)?'sono':null,(ci.refeicoes||[]).length?'refeições':null,ci.escalas&&Object.values(ci.escalas).some(v=>typeof v==='number'&&v>=1)?'estado':null,ci.praticas&&Object.keys(ci.praticas).length?'práticas':null,(ci.observacoes||'').trim()?'observações':null].filter(Boolean);
  const resumoLinha=[];
  if(ci.dormiu&&ci.acordou)resumoLinha.push('🌙 '+horasDormidas(ci.dormiu,ci.acordou));
  else if(ci.dormiu)resumoLinha.push('🌙 dormi às '+ci.dormiu);
  else if(ci.acordou)resumoLinha.push('🌙 acordei às '+ci.acordou);
  if((ci.emocao||'').trim())resumoLinha.push('💗 '+ci.emocao.trim());
  if(ci.refeicoes?.length)resumoLinha.push('🍽️ '+ci.refeicoes.length+' refeições');
  if(ci.escalas?.autoconf)resumoLinha.push('💛 autoconfiança '+ci.escalas.autoconf+'/10');
  /* check-in só na aba Check-in (ex-Diário) */
  const elCi=$('checkinResumoTop');
  if(elCi){
    if(preenchidos.length===0)elCi.innerHTML=`<div class="aviso">Ainda sem check-in hoje. Sem pressa.</div>`;
    else elCi.innerHTML=`<div class="okmsg">${resumoLinha.join(' · ')||('Já preencheu: '+preenchidos.join(', '))}</div>`;
  }
}
function renderDiario(){
  const el=$('diarioBox');if(!el)return;
  const datas=Object.keys(S.checkins).filter(d=>{const ci=S.checkins[d];return ci&&((ci.dormiu||ci.acordou)||(ci.emocao||'').trim()||(ci.refeicoes||[]).length||(ci.escalas&&Object.keys(ci.escalas).length)||(ci.praticas&&Object.keys(ci.praticas).length)||(ci.observacoes||'').trim());}).sort((a,b)=>b.localeCompare(a));
  if(!datas.length){el.innerHTML=`<div class="aviso">Ainda sem registros.</div>`;renderNuvemEmocoes();return;}
  el.innerHTML=datas.map(d=>{
    const ci=S.checkins[d];
    const dataFmt=new Date(d+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'short',day:'numeric',month:'short'});
    const resumo=[];
    if(ci.dormiu&&ci.acordou)resumo.push(`🌙 ${horasDormidas(ci.dormiu,ci.acordou)}`);
    if((ci.emocao||'').trim())resumo.push(`💗 ${esc(ci.emocao.trim())}`);
    if((ci.refeicoes||[]).length)resumo.push(`🍽️ ${ci.refeicoes.length}`);
    if(ci.escalas){const n=Object.values(ci.escalas).filter(v=>typeof v==='number').length;if(n)resumo.push(`🎚️ ${n}/8`);}
    if(ci.praticas){const n=Object.keys(ci.praticas).length;if(n)resumo.push(`🎤 ${n}`);}
    let detalhes='';
    if(ci.dormiu||ci.acordou){const dt=(ci.dormiu&&ci.acordou)?`${ci.dormiu} → ${ci.acordou} · ${horasDormidas(ci.dormiu,ci.acordou)}`:(ci.dormiu?`dormiu às ${ci.dormiu}`:`acordou às ${ci.acordou}`);detalhes+=`<div class="diario-sec"><div class="lbl">🌙 Sono</div><div class="diario-escala">${esc(dt)}</div></div>`;}
    if((ci.emocao||'').trim()){detalhes+=`<div class="diario-sec"><div class="lbl">💗 Emoção do dia</div><div class="diario-emocao">${esc(ci.emocao.trim())}</div></div>`;}
    if((ci.refeicoes||[]).length){detalhes+=`<div class="diario-sec"><div class="lbl">🍽️ Refeições</div><div style="font-size:12.5px">${ci.refeicoes.map(r=>esc(r)).join(' · ')}</div></div>`;}
    if(ci.escalas&&Object.keys(ci.escalas).length){const html=ESCALAS.filter(([k])=>typeof ci.escalas[k]==='number').map(([k,rot])=>`<div class="diario-escala"><span>${esc(rot)}</span><span class="v">${ci.escalas[k]}</span></div>`).join('');detalhes+=`<div class="diario-sec"><div class="lbl">🎚️ Como eu estava</div>${html}</div>`;}
    if(ci.praticas&&Object.keys(ci.praticas).length){const prats=Object.keys(ci.praticas).map(k=>{const[g,item]=k.split('|');return item||g;}).map(esc).join(' · ');detalhes+=`<div class="diario-sec"><div class="lbl">🎤 Práticas</div><div style="font-size:12.5px">${prats}</div></div>`;}
    if((ci.observacoes||'').trim()){detalhes+=`<div class="diario-sec"><div class="lbl">📝 Observações</div><div class="diario-obs">${esc(ci.observacoes)}</div></div>`;}
    return`<details class="diario-card"><summary><span style="flex:1"><div>📅 ${esc(dataFmt)}</div><div class="diario-resumo">${resumo.map(r=>`<span>${r}</span>`).join('')}</div></span></summary><div class="conteudo">${detalhes||'<div class="mut" style="font-size:12px">Sem detalhes.</div>'}</div></details>`;
  }).join('');
  renderNuvemEmocoes();
}
function renderNuvemEmocoes(){
  const el=$('nuvemEmocoesBox');if(!el)return;
  const cont={};
  Object.values(S.checkins||{}).forEach(ci=>{
    const e=(ci.emocao||'').trim().toLowerCase();
    if(!e)return;
    cont[e]=(cont[e]||0)+1;
  });
  const lista=Object.entries(cont).sort((a,b)=>b[1]-a[1]);
  if(!lista.length){el.innerHTML='<div class="mut" style="font-size:12.5px">Suas emoções dos últimos dias aparecem aqui conforme você registra.</div>';return;}
  el.innerHTML='<div class="mut" style="font-size:12px;margin-bottom:4px">Como você tem se sentido:</div><div class="nuvem-emocoes">'+lista.slice(0,20).map(([e,c])=>`<span class="pal">${esc(e)}<span class="cont">${c}</span></span>`).join('')+'</div>';
}
let ciMontado=false;
function montaCheckin(){
  if(ciMontado)return;ciMontado=true;
  const ci=S.checkins[hoje()]||(S.checkins[hoje()]={});
  const selD=$('ciDormiu'),selA=$('ciAcordou');
  selD.innerHTML='<option value="">—</option>'+HORAS_DORMIR.map(h=>`<option value="${h}">${h}</option>`).join('');
  selA.innerHTML='<option value="">—</option>'+HORAS_ACORDAR.map(h=>`<option value="${h}">${h}</option>`).join('');
  selD.value=ci.dormiu||'';selA.value=ci.acordou||'';
  const upHoras=()=>{$('ciHoras').textContent=(ci.dormiu&&ci.acordou)?('Você dormiu '+horasDormidas(ci.dormiu,ci.acordou)):'';};
  selD.onchange=()=>{ci.dormiu=selD.value||undefined;salva();upHoras();atualizaRelatorio();atualizaStatusCheckin();renderCheckinResumos();renderDiario();};
  selA.onchange=()=>{ci.acordou=selA.value||undefined;salva();upHoras();atualizaRelatorio();atualizaStatusCheckin();renderCheckinResumos();renderDiario();};
  upHoras();
  $('ciRefeicoes').innerHTML=REFEICOES.map(r=>{const on=(ci.refeicoes||[]).includes(r);return`<button type="button" class="chip ${on?'on':''}" data-ref="${esc(r)}">${esc(r)}</button>`;}).join('');
  $('ciRefeicoes').onclick=e=>{const b=e.target.closest('[data-ref]');if(!b)return;const r=b.dataset.ref;ci.refeicoes=ci.refeicoes||[];const i=ci.refeicoes.indexOf(r);if(i>=0)ci.refeicoes.splice(i,1);else ci.refeicoes.push(r);b.classList.toggle('on');salva();atualizaStatusCheckin();atualizaRelatorio();renderCheckinResumos();renderDiario();};
  $('ciEscalas').innerHTML=ESCALAS.map(([k,rot])=>{const v=ci.escalas?.[k]||0;return`<div class="escala" data-esc="${k}"><div class="rot">${esc(rot)}</div><div class="nums">${[1,2,3,4,5,6,7,8,9,10].map(n=>`<button type="button" class="num ${v===n?'on':''}" data-n="${n}">${n}</button>`).join('')}</div></div>`;}).join('');
  $('ciEscalas').onclick=e=>{const b=e.target.closest('[data-n]');if(!b)return;const escEl=b.closest('[data-esc]');if(!escEl)return;const k=escEl.dataset.esc,n=+b.dataset.n;ci.escalas=ci.escalas||{};ci.escalas[k]=(ci.escalas[k]===n)?undefined:n;salva();escEl.querySelectorAll('.num').forEach(x=>x.classList.toggle('on',+x.dataset.n===ci.escalas[k]));b.classList.add('salvo-flash');setTimeout(()=>b.classList.remove('salvo-flash'),500);atualizaStatusCheckin();atualizaRelatorio();renderCheckinResumos();renderDiario();};
  renderPraticasCheckin();
  const obs=$('ciObs');obs.value=ci.observacoes||'';obs.oninput=()=>{$('obsFeedback').textContent='Toque em ✓ Salvar pra guardar.';};
  $('btnOkObs').onclick=()=>{ci.observacoes=obs.value;salva();$('obsFeedback').textContent='✓ Salvo';setTimeout(()=>{$('obsFeedback').textContent='';},1500);atualizaStatusCheckin();renderCheckinResumos();renderDiario();};
  atualizaRelatorio();
}
function renderPraticasCheckin(){
  const ci=S.checkins[hoje()]||(S.checkins[hoje()]={});
  $('ciPraticas').innerHTML=`<p class="mut explica-secao" style="font-size:12px;line-height:1.45;margin:0 0 12px">Marque o que você fez de bom pra você hoje. Sem meta, sem cobrança: é só um registro.</p>`+Object.entries(PRATICAS).map(([grupo,itens])=>`<div style="margin-bottom:12px"><div class="mut" style="font-size:11.5px;margin-bottom:5px;font-weight:700;letter-spacing:.3px;text-transform:uppercase">${esc(grupo)}</div><div class="chips">${itens.map(it=>{const on=(ci.praticas||{})[grupo+'|'+it];return`<button type="button" class="chip ${on?'on alt':''}" data-prat="${esc(grupo)}|${esc(it)}">${esc(it)}</button>`;}).join('')}</div></div>`).join('')+`<button type="button" class="btn btn-full" id="btnEditarPraticas" style="margin-top:4px">✏️ Editar minhas práticas</button>`;
  $('btnEditarPraticas').onclick=abrirEditorPraticas;
  $('ciPraticas').onclick=e=>{const b=e.target.closest('[data-prat]');if(!b)return;const k=b.dataset.prat;ci.praticas=ci.praticas||{};if(ci.praticas[k])delete ci.praticas[k];else ci.praticas[k]=true;b.classList.toggle('on');b.classList.toggle('alt');salva();atualizaStatusCheckin();atualizaRelatorio();renderCheckinResumos();renderDiario();};
}
function sugerirPraticas(notas,praticas){
  const s=[];const jm=k=>!!(praticas&&praticas[k]);const fg=p=>Object.keys(praticas||{}).some(k=>k.startsWith(p+'|'));
  const add=(g,i)=>{const k=g+'|'+i;if(!PRATICAS[g]||!PRATICAS[g].includes(i))return;if(!jm(k)&&!s.some(x=>x.key===k))s.push({key:k,label:i,grupo:g});};
  const vals=Object.values(notas).filter(v=>typeof v==='number');const alt=vals.filter(v=>v>=7).length,baix=vals.filter(v=>v<=3).length;
  if(notas.fisica&&notas.fisica<=4){add('⏳ Tempo de qualidade','Caminhada no quarteirão');add('🎤 Treino vocal','Canto');}
  if((notas.fisica&&notas.fisica<=4)||(notas.danca&&notas.danca<=4)){add('⏳ Tempo de qualidade','Dança');}
  if(!fg('🤍 Toque físico')){add('🤍 Toque físico','Auto-cafuné');}
  if((notas.belting&&notas.belting<=4)||(notas.lirico&&notas.lirico<=4)){add('🎤 Treino vocal','Aquecimento vocal');}
  if(notas.mental&&notas.mental<=4){add('⏳ Tempo de qualidade','Meditação');add('💌 Palavras de afirmação','Conversa com amigos');}
  if((notas.organizacao&&notas.organizacao<=4)||(notas.limpeza&&notas.limpeza<=4)){add('⏳ Tempo de qualidade','Louça / arrumação da casa');}
  if(notas.autoconf&&notas.autoconf<=5){add('💌 Palavras de afirmação','Escrita no caderno');add('🤍 Toque físico','Peça de roupa favorita');}
  if(baix>=4){add('💌 Palavras de afirmação','Terapia');}
  if(alt>=5){add('💌 Palavras de afirmação','Conversa com amigos');add('🤍 Toque físico','Batom');}
  // lista genérica (quem começou do zero)
  if(notas.fisica&&notas.fisica<=4){add('⏳ Tempo de qualidade','Caminhar 10 minutos');add('🤍 Toque físico','Alongar por 5 minutos');}
  if(notas.danca&&notas.danca<=4){add('🤍 Toque físico','Dançar uma música');}
  if(!fg('🤍 Toque físico')){add('🤍 Toque físico','Passar creme no corpo');}
  if(notas.mental&&notas.mental<=4){add('⏳ Tempo de qualidade','Meditar por 3 minutos');add('💌 Palavras de afirmação','Mandar mensagem pra uma amiga');}
  if((notas.organizacao&&notas.organizacao<=4)||(notas.limpeza&&notas.limpeza<=4)){add('🛠️ Atos de serviço','Arrumar a cama');}
  if(notas.autoconf&&notas.autoconf<=5){add('💌 Palavras de afirmação','Escrever um bilhete gentil pra mim');add('🎁 Presentes','Vestir minha peça de roupa favorita');}
  if(alt>=5){add('🎁 Presentes','Passar batom');}
  return s;
}
function paragrafoCorpo(ci,notas){
  const p=[];let temSono=false;
  if(ci.dormiu&&ci.acordou){
    const horas=horasDormidas(ci.dormiu,ci.acordou);const[h,m]=horas.split('h').map(Number);const numH=h+(m||0)/60;const[dh]=ci.dormiu.split(':').map(Number);
    let f='';
    if(numH<5)f='Você dormiu '+horas+' — menos do que o corpo pedia. Sem culpa.';
    else if(numH<6.5)f='Você dormiu '+horas+'. Noite curta, mas foi o que coube.';
    else if(numH<7.5)f='Você dormiu '+horas+' — uma noite razoável.';
    else if(numH<9)f='Você dormiu '+horas+'. Uma boa noite.';
    else f='Você dormiu '+horas+' — seu corpo pediu e você deu.';
    if((dh>=21&&dh<=23)&&numH>=7)f+=' E dormiu cedo, o que soma.';
    p.push(f);temSono=true;
  }
  const n=(ci.refeicoes||[]).length;
  if(n===1)p.push('Uma refeição só hoje.');
  else if(n===2)p.push('Duas refeições registradas.');
  else if(n===3)p.push('Três refeições — o corpo foi cuidado.');
  else if(n>=4)p.push(n+' refeições no dia.');
  if(!temSono&&!n)return'';
  return'<p><span class="base">🌱 A base do dia</span>'+p.join(' ')+'</p>';
}
function gerarRelatorio(ci){
  if(!ci)return'';
  const notas=ci.escalas;const praticas=ci.praticas||{};
  const temEscalas=notas&&Object.keys(notas).filter(k=>typeof notas[k]==='number'&&notas[k]>=1).length>0;
  const temCorpo=(ci.dormiu||ci.acordou||(ci.refeicoes&&ci.refeicoes.length>0)||(ci.emocao||'').trim());
  if(!temEscalas&&!temCorpo)return'';
  const entradas=temEscalas?Object.entries(notas).filter(([k,n])=>typeof n==='number'&&n>=1):[];
  const banda_=n=>n>=7?'alta':n>=4?'media':'baixa';
  const NOMES={danca:'dança',fisica:'disposição física',mental:'disposição mental',organizacao:'organização do lar',limpeza:'limpeza do lar',belting:'Belting',lirico:'canto lírico',autoconf:'autoconfiança'};
  const nTotal=entradas.length;const altas=entradas.filter(([,n])=>banda_(n)==='alta');
  const p1=[];
  if(nTotal===8)p1.push('Hoje você parou e se olhou por inteiro. Isso, por si só, é um ato de coragem.');
  else if(nTotal>=6)p1.push('Hoje você se olhou com cuidado.');
  else if(nTotal>=3)p1.push('Você começou a se olhar hoje. Sem pressa.');
  else if(nTotal>=1)p1.push('Cada nota que você marcou é um jeito de se enxergar.');
  else if(temCorpo)p1.push('Você parou pra olhar seu dia.');
  if((ci.emocao||'').trim())p1.push('Hoje você se sentiu <b>'+esc(ci.emocao.trim())+'</b>.');
  if(altas.length>=1&&altas.length<=2)p1.push('E hoje brilhou em <b>'+altas.map(([k])=>NOMES[k]).join(' e ')+'</b>.');
  else if(altas.length>=3)p1.push('Vários cantos vieram altos — <b>'+altas.slice(0,4).map(([k])=>NOMES[k]).join(', ')+'</b>.');
  const FF={fisica:{alta:'seu corpo veio com energia',media:'seu corpo está respondendo',baixa:'seu corpo pediu pausa'},danca:{alta:'a dança está viva em você',media:'a dança vem aparecendo',baixa:'a dança te espera'},mental:{alta:'sua mente veio clara',media:'sua mente está processando',baixa:'sua mente está pesada'},autoconf:{alta:'sua autoconfiança está alta',media:'sua autoconfiança está se firmando',baixa:'a autoconfiança baixa de hoje não apaga nada'},organizacao:{alta:'a casa respira organizada',media:'a organização está encontrando ritmo',baixa:'a casa pode esperar'},limpeza:{alta:'a limpeza reflete carinho',media:'a limpeza vai chegando',baixa:'a limpeza não mede o seu valor'},belting:{alta:'seu belting está firme',media:'seu belting está encontrando espaço',baixa:'seu belting está sendo reconstruído'},lirico:{alta:'o canto lírico floresce',media:'o canto lírico está aparecendo',baixa:'o canto lírico está guardado pra você'}};
  const fam=[{nome:'Pelo corpo em movimento',itens:['fisica','danca']},{nome:'Pela mente',itens:['mental','autoconf']},{nome:'No lar',itens:['organizacao','limpeza']},{nome:'Na voz',itens:['belting','lirico']}];
  const p2=[];
  fam.forEach(f=>{const pres=f.itens.filter(k=>notas&&typeof notas[k]==='number'&&notas[k]>=1);const partes=pres.map(k=>FF[k][banda_(notas[k])]);if(partes.length===1)p2.push(f.nome+': '+partes[0]+'.');else if(partes.length===2)p2.push(f.nome+': '+partes[0]+', e '+partes[1]+'.');});
  const p3=[];
  const media=nTotal>0?entradas.reduce((a,[,n])=>a+n,0)/nTotal:null;
  if(nTotal===0)p3.push('Hoje você olhou pra fora — corpo, comida, rotina.');
  else if(media>=7.5)p3.push('Hoje foi um dia forte.');
  else if(media>=5.5)p3.push('Um dia médio, do jeito que a vida é.');
  else if(media>=3.5)p3.push('Hoje veio mais devagar.');
  else p3.push('Hoje foi pesado. Tudo bem.');
  const sug=temEscalas?sugerirPraticas(notas,praticas):[];
  let p4='';
  if(sug.length){const bt=sug.slice(0,4).map(s=>'<button class="sug" data-prat="'+esc(s.key)+'"><span class="g">'+esc(s.grupo)+'</span><span class="n">'+esc(s.label)+'</span></button>').join('');p4='<p><b>Pra somar ao dia:</b><br>'+bt+'</p>';}
  let html='<div class="relatorio"><div class="titulo">💭 Leitura do dia</div>';
  if(p1.length)html+='<p>'+p1.join(' ')+'</p>';
  const ch=paragrafoCorpo(ci,notas||{});if(ch)html+=ch;
  if(p2.length)html+='<p>'+p2.join(' ')+'</p>';
  if(p3.length)html+='<p>'+p3.join(' ')+'</p>';
  html+=p4+'</div>';
  return html;
}
function atualizaRelatorio(){const ci=S.checkins[hoje()]||{};const el=$('relatorioEscalas');if(!el)return;el.innerHTML=gerarRelatorio(ci);document.querySelectorAll('#relatorioEscalas .sug').forEach(b=>{b.onclick=()=>marcarPraticaSugerida(b.dataset.prat);});}
function marcarPraticaSugerida(key){const ci=S.checkins[hoje()]||(S.checkins[hoje()]={});ci.praticas=ci.praticas||{};ci.praticas[key]=true;salva();const box=$('ciPratBox');if(box)box.open=true;const chip=document.querySelector('#ciPraticas [data-prat="'+key.replace(/"/g,'\\"')+'"]');if(chip){chip.classList.add('on');chip.classList.add('alt');setTimeout(()=>{chip.scrollIntoView({behavior:'smooth',block:'center'});chip.classList.add('pulse');setTimeout(()=>chip.classList.remove('pulse'),1400);},120);}confete(['✨','🌸','💫']);atualizaStatusCheckin();atualizaRelatorio();renderDiario();}

