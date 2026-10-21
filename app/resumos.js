/* ============ RESUMO SEMANAL E MENSAL ============ */
function fmtPeriodoBonito(a,b){
  const da=new Date(a+'T12:00:00');const db=new Date(b+'T12:00:00');
  const fmt=d=>d.toLocaleDateString('pt-BR',{day:'numeric',month:'short'}).replace('.','');
  return fmt(da)+' → '+fmt(db);
}
function calcularResumo(inicio,fim){
  const periodo={inicio,fim};
  const habitosMarc=[];let totalMarc=0;const completaram21=[];
  (S.habitos||[]).forEach(h=>{
    const todos=Object.keys(h.feitos||{});
    const noPeriodo=todos.filter(d=>d>=inicio&&d<=fim);
    if(noPeriodo.length){habitosMarc.push({nome:h.nome,emoji:h.emoji||'⭐',dias:noPeriodo.length});totalMarc+=noPeriodo.length;}
    if(todos.length>=21)completaram21.push(h.nome);
  });
  habitosMarc.sort((a,b)=>b.dias-a.dias);
  const cis=Object.entries(S.checkins||{}).filter(([d])=>d>=inicio&&d<=fim);
  const diasCheckin=cis.length;
  let sonoTotal=0,diasSono=0,diasRefeicoes=0;
  const emocoesSemana={};
  cis.forEach(([,ci])=>{
    if(ci.dormiu&&ci.acordou){const horas=horasDormidas(ci.dormiu,ci.acordou);const[h,m]=horas.split('h').map(Number);sonoTotal+=h*60+(m||0);diasSono++;}
    if((ci.refeicoes||[]).length>=2)diasRefeicoes++;
    const e=(ci.emocao||'').trim().toLowerCase();
    if(e)emocoesSemana[e]=(emocoesSemana[e]||0)+1;
  });
  const mediaSonoMin=diasSono?Math.round(sonoTotal/diasSono):0;
  const mediaSonoH=Math.floor(mediaSonoMin/60);const mediaSonoM=mediaSonoMin%60;
  let diasNotados=0,notasGuardadas=0,gravetosSolto=0;
  (S.leiAtracao.desejos||[]).forEach(d=>{
    diasNotados+=Object.keys(d.diasNotados||{}).filter(dia=>dia>=inicio&&dia<=fim).length;
    notasGuardadas+=(d.notas||[]).filter(n=>n.data>=inicio&&n.data<=fim).length;
    gravetosSolto+=(d.gravetos||[]).filter(g=>g.solto&&g.soltoEm&&g.soltoEm>=inicio&&g.soltoEm<=fim).length;
  });
  const conquistasNovas=(S.conquistas.itens||[]).filter(c=>c.criadoEm&&c.criadoEm>=inicio&&c.criadoEm<=fim);
  return{periodo,habitosMarc,totalMarc,completaram21,diasCheckin,mediaSonoH,mediaSonoM,diasRefeicoes,diasNotados,notasGuardadas,gravetosSolto,conquistasNovas,emocoesSemana};
}
function temDadosResumo(r){return r.totalMarc>0||r.diasCheckin>0||r.diasNotados>0||r.notasGuardadas>0||r.gravetosSolto>0||r.conquistasNovas.length>0;}
function fraseResumo(r,tipo){
  const score=r.totalMarc+r.diasCheckin*2+r.diasNotados*2+r.notasGuardadas+r.gravetosSolto*2+r.conquistasNovas.length*3;
  if(tipo==='mensal'){
    if(score>=80)return'Um mês com presença real. Você construiu chão.';
    if(score>=40)return'Um mês de meio-termo. Nem tudo, mas o suficiente pra contar.';
    if(score>=15)return'Um mês mais quieto. O que foi marcado continua valendo.';
    return'O mês passou de outro jeito. O app fica aqui, sem cobrar.';
  }
  if(score>=25)return'Você apareceu de verdade nesta semana. Isso constrói.';
  if(score>=12)return'Uma semana com presença. Nem todo dia, mas o suficiente.';
  if(score>=5)return'Semana mais quieta, e tudo bem. O que foi marcado continua valendo.';
  return'A vida ocupa. Quando sobrar espaço, o app fica aqui.';
}
function comparacaoSemanal(atual,anterior){
  if(!anterior)return null;
  const dif={marc:atual.totalMarc-anterior.totalMarc,checkin:atual.diasCheckin-anterior.diasCheckin,notou:atual.diasNotados-anterior.diasNotados};
  if(dif.marc<0||dif.checkin<0||dif.notou<0)return null;
  if(dif.marc===0&&dif.checkin===0&&dif.notou===0)return null;
  return dif;
}
function verificarResumoSemanal(){
  if(!S.resumo)S.resumo={ultimoEm:null,historico:[]};
  if(!S.resumoMensal)S.resumoMensal={ultimoEm:null,historico:[]};
  if(!S.iniciadoEm)S.iniciadoEm=hoje();
  if(!S.onboarding.feito)return;
  const agora=new Date();
  const ehDia1=agora.getDate()<=3;
  if(ehDia1){
    const baseM=S.resumoMensal.ultimoEm?fmtD(new Date(S.resumoMensal.ultimoEm)):S.iniciadoEm;
    const difDias=Math.round((new Date(hoje())-new Date(baseM))/86400000);
    if(difDias>=28){
      const fim=fmtD(addDias(agora,-1));const inicio=fmtD(addDias(agora,-30));
      const dados=calcularResumo(inicio,fim);
      if(temDadosResumo(dados)){
        dados.frase=fraseResumo(dados,'mensal');dados.mostradoEm=hoje();
        S.resumoMensal.historico.push(dados);
        if(S.resumoMensal.historico.length>6)S.resumoMensal.historico=S.resumoMensal.historico.slice(-6);
        S.resumoMensal.ultimoEm=Date.now();salva();mostrarResumo(dados,'mensal');return;
      } else {S.resumoMensal.ultimoEm=Date.now();salva();}
    }
  }
  const base=S.resumo.ultimoEm?fmtD(new Date(S.resumo.ultimoEm)):S.iniciadoEm;
  const proximo=fmtD(addDias(new Date(base),7));
  if(hoje()<proximo)return;
  const fim=fmtD(addDias(agora,-1));const inicio=fmtD(addDias(agora,-7));
  const dados=calcularResumo(inicio,fim);
  if(!temDadosResumo(dados)){S.resumo.ultimoEm=Date.now();salva();return;}
  dados.frase=fraseResumo(dados,'semanal');dados.mostradoEm=hoje();
  const ant=S.resumo.historico.length?S.resumo.historico[S.resumo.historico.length-1]:null;
  dados.comparacao=comparacaoSemanal(dados,ant);
  S.resumo.historico.push(dados);
  if(S.resumo.historico.length>12)S.resumo.historico=S.resumo.historico.slice(-12);
  S.resumo.ultimoEm=Date.now();salva();mostrarResumo(dados,'semanal');
}
function fraseCruzada(r){
  const frases=[];
  const emo=r.emocoesSemana||{};
  const top=Object.entries(emo).sort((a,b)=>b[1]-a[1])[0];
  if(top && top[1]>=2){
    const e=top[0];
    if(/cansad|exaust|sobrecarreg/.test(e)){
      if(r.totalMarc>0 && r.totalMarc<10)frases.push('Foi uma semana de pouca energia e poucos hábitos marcados. Talvez a lista esteja pesada demais pra agora.');
      else if(r.totalMarc>=15)frases.push('Você se sentiu '+e+' e ainda assim marcou '+r.totalMarc+' vezes. Isso custa. Vale olhar se algo pode sair da lista por ora.');
    } else if(/leve|contente|calma|grata|tranquil/.test(e)){
      if(r.diasNotados>0)frases.push('Semana de '+e+' e você ainda notou desejo. Isso combina: atenção floresce quando o corpo está em paz.');
    } else if(/ansios|agitad|irritad/.test(e)){
      frases.push('A semana teve '+e+'. Se algum hábito está sendo feito no automático, talvez valha escolher um que acalme, não um que cobre mais.');
    } else if(/triste|sozinha/.test(e)){
      frases.push('A semana teve '+e+'. Antes de exigir hábito novo, talvez valha só não se cobrar nada por alguns dias.');
    }
  }
  if(r.diasNotados>=3 && r.diasCheckin>=3)frases.push('Você notou o que quer em vários dias e também se olhou no check-in. Esse par costuma ser onde a mudança começa.');
  if(r.gravetosSolto>=2 && r.totalMarc>=7)frases.push('Você soltou dúvida e marcou hábito na mesma semana. É o ciclo inteiro girando — notar, destravar, agir.');
  if(r.diasNotados===0 && r.diasCheckin>=5)frases.push('Semana de check-in firme e nenhuma nota de atenção. Vale lembrar que desejo também precisa de espaço.');
  return frases;
}
function mostrarResumo(r,tipo){
  const ehMensal=tipo==='mensal';
  $('resumoCaixa').setAttribute('data-tipo',tipo);
  $('rsTitulo').textContent=ehMensal?'Seu mês':'Sua semana';
  const primeira=!ehMensal&&S.resumo.historico.length===1;
  $('rsEmoji').textContent=primeira?'🌱':(ehMensal?'📅':'📊');
  gatinhaRel($('rsEmoji'),'troca',primeira?'tchau':'feliz');
  $('rsTopo').className='rs-topo'+(primeira?' primeira':'');
  $('rsPeriodo').textContent=fmtPeriodoBonito(r.periodo.inicio,r.periodo.fim);
  const nome=primeiroNome();
  const saudacao=nome?('<b>'+esc(nome)+'</b>, '):'';
  let html='';
  if(r.totalMarc>0){
    html+='<div class="rs-sec"><div class="lbl">🌱 Hábitos</div>';
    html+=`<p>${saudacao}você marcou <b>${r.totalMarc} ${r.totalMarc===1?'vez':'vezes'}</b> neste período.</p>`;
    if(r.habitosMarc.length){html+='<ul class="rs-lista">';r.habitosMarc.slice(0,ehMensal?6:4).forEach(h=>{html+=`<li><span>${h.emoji} ${esc(h.nome)}</span><span>${h.dias}d</span></li>`;});html+='</ul>';}
    if(r.completaram21.length)html+=`<p style="margin-top:10px">🎉 <b>${r.completaram21.length} hábito${r.completaram21.length===1?'':'s'}</b> na lista já bateu os 21 dias!</p>`;
    html+='</div>';
  }
  if(r.diasCheckin>0){
    html+='<div class="rs-sec"><div class="lbl">📝 Check-in</div>';
    html+=`<p><b>${r.diasCheckin} dia${r.diasCheckin===1?'':'s'}</b> de check-in registrado${r.diasCheckin===1?'':'s'}.</p>`;
    if(r.mediaSonoH>0)html+=`<p>Média de sono: <b>${r.mediaSonoH}h${pad2(r.mediaSonoM)}</b>.</p>`;
    if(r.diasRefeicoes>0)html+=`<p>Você cuidou do corpo em <b>${r.diasRefeicoes} dia${r.diasRefeicoes===1?'':'s'}</b>.</p>`;
    const emo=r.emocoesSemana||{};
    const top3=Object.entries(emo).sort((a,b)=>b[1]-a[1]).slice(0,3);
    if(top3.length){
      html+='<p>Emoções mais frequentes: '+top3.map(([e,c])=>'<b>'+esc(e)+'</b> ('+c+')').join(' · ')+'.</p>';
    }
    html+='</div>';
  }
  if(r.diasNotados>0||r.notasGuardadas>0||r.gravetosSolto>0){
    html+='<div class="rs-sec"><div class="lbl">💫 Atração</div>';
    if(r.diasNotados>0)html+=`<p><b>${r.diasNotados} dia${r.diasNotados===1?'':'s'}</b> notando seus desejos.</p>`;
    if(r.notasGuardadas>0)html+=`<p><b>${r.notasGuardadas}</b> ${r.notasGuardadas===1?'nota guardada':'notas guardadas'}.</p>`;
    if(r.gravetosSolto>0)html+=`<p>🍃 <b>${r.gravetosSolto}</b> dúvida${r.gravetosSolto===1?'':'s'} trabalhada${r.gravetosSolto===1?'':'s'}.</p>`;
    html+='</div>';
  }
  if(r.conquistasNovas.length>0){
    html+='<div class="rs-sec"><div class="lbl">📖 Livro de Conquistas</div>';
    html+=`<p>Você anotou <b>${r.conquistasNovas.length}</b> prova${r.conquistasNovas.length===1?'':'s'}:</p><ul class="rs-lista">`;
    r.conquistasNovas.slice(0,ehMensal?8:5).forEach(c=>{html+=`<li><span>${esc(c.txt)}</span></li>`;});
    html+='</ul></div>';
  }
  if(!ehMensal&&r.comparacao){
    html+='<div class="rs-comparacao"><div class="lt">↗ Um pouco melhor que a anterior</div>';
    if(r.comparacao.marc>0)html+=`<div class="linha-cmp"><span>Marcou nos hábitos</span><b>+${r.comparacao.marc}</b></div>`;
    if(r.comparacao.checkin>0)html+=`<div class="linha-cmp"><span>Dias de check-in</span><b>+${r.comparacao.checkin}</b></div>`;
    if(r.comparacao.notou>0)html+=`<div class="linha-cmp"><span>Dias notados</span><b>+${r.comparacao.notou}</b></div>`;
    html+='</div>';
  }
  const cruzadas=fraseCruzada(r);
  if(cruzadas.length){
    html+='<div class="rs-sec"><div class="lbl">🧠 Como os módulos conversam</div>';
    cruzadas.slice(0,3).forEach(f=>{html+='<p>'+esc(f)+'</p>';});
    html+='</div>';
  }
  if(r.frase)html+=`<div class="rs-frase">${esc(r.frase)}</div>`;
  $('rsCorpo').innerHTML=html;
  const o=$('resumoSemanal');o.hidden=false;requestAnimationFrame(()=>o.classList.add('ativo'));document.body.style.overflow='hidden';
  confete(['✨','📊','💛']);
  $('rsFechar').onclick=fecharResumo;
  $('rsVerDepois').onclick=()=>{
    if(ehMensal){if(S.resumoMensal)S.resumoMensal.ultimoEm=Date.now()-26*86400000;salva();}
    else {if(S.resumo)S.resumo.ultimoEm=Date.now()-5*86400000;salva();}
    fecharResumo();
  };
  $('rsPdf').onclick=()=>setTimeout(()=>{try{window.print();}catch(e){avisar('Não consegui abrir a impressão. Tente pelo menu do navegador.');}},150);
}
function fecharResumo(){const o=$('resumoSemanal');o.classList.remove('ativo');setTimeout(()=>{o.hidden=true;document.body.style.overflow='';},400);}

/* ============ AVISOS INICIAIS ============ */
function avisosIniciais(){
  const agora=new Date();
  const hojeStr=hoje();
  const ultimo=S.ultimoAcesso;
  S.ultimoAcesso=Date.now();salva();
  if(ultimo){
    const diasAusente=Math.round((new Date(hojeStr)-new Date(fmtD(new Date(ultimo))))/86400000);
    if(diasAusente>=14){
      setTimeout(()=>{
        dialogo({
          emoji:'🌿',
          titulo:'Que bom você de volta',
          texto:'Faz tempo que você não aparece. Não precisa recuperar nada do que passou, nem revisar nada. É só começar de onde você está agora.\n\nSe algum hábito ficou pelo caminho, o app não cobra. A gente vai no seu ritmo.',
          botoes:[{rotulo:'Vamos lá',prim:true,fn:()=>setTimeout(verificarResumoSemanal,200)},{rotulo:'Só olhar hoje',fn:()=>{}}]
        });
      },600);
      return;
    }
  }
  setTimeout(verificarResumoSemanal,300);
  setTimeout(checarLembreteSaude,1800);
}
function cuidadosPendentes(){return (S.cuidados||[]).filter(c=>!c.feitoEm);}
function checarLembreteSaude(){
  if(!S.onboarding.feito||S.lembreteSaudeDesligado)return;
  const pend=cuidadosPendentes();if(!pend.length)return;
  const agora=new Date();
  const mesAtual=agora.getFullYear()+'-'+pad2(agora.getMonth()+1);
  if(S.ultimoLembreteSaude===mesAtual)return;
  if(agora.getDate()>5)return;
  S.ultimoLembreteSaude=mesAtual;salva();
  dialogo({
    emoji:'🌿',
    titulo:'Um lembrete uma vez por mês',
    texto:'Cuidar de fora também:\n\n'+pend.map(c=>'• '+c.texto).join('\n')+'\n\nNão é meta, é cuidado. Quando fizer, marque como feito e ele sai da lista.',
    botoes:[{rotulo:'Depois'},{rotulo:'Ver a lista',prim:true,fn:abrirCuidados}]
  });
}
function renderCuidados(){
  const box=$('cuidLista');if(!box)return;
  const pend=cuidadosPendentes();
  const feitos=(S.cuidados||[]).filter(c=>c.feitoEm).sort((a,b)=>b.feitoEm.localeCompare(a.feitoEm));
  let h='';
  if(!pend.length)h+='<div class="lp-vazio">Nada pendente. Quando quiser, adicione um cuidado abaixo.</div>';
  pend.forEach(c=>{h+=`<div class="cuid-item"><button type="button" class="cuid-check" data-cfeito="${esc(c.id)}" aria-label="Marcar como feito"></button><span class="cuid-txt">${esc(c.texto)}</span><button type="button" class="cuid-x" data-crm="${esc(c.id)}" aria-label="Remover">×</button></div>`;});
  if(feitos.length){
    h+=`<div class="mut" style="font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;margin:14px 2px 6px">Feitos</div>`;
    feitos.forEach(c=>{h+=`<div class="cuid-item feito"><button type="button" class="cuid-check on" data-cdesf="${esc(c.id)}" aria-label="Desmarcar">✓</button><span class="cuid-txt">${esc(c.texto)}<small>feito em ${esc(cfgDataBr(c.feitoEm))}</small></span><button type="button" class="cuid-x" data-crm="${esc(c.id)}" aria-label="Remover">×</button></div>`;});
  }
  box.innerHTML=h;
  box.querySelectorAll('[data-cfeito]').forEach(b=>{b.onclick=()=>{const c=S.cuidados.find(x=>x.id===b.dataset.cfeito);if(!c)return;c.feitoEm=hoje();salva();som('guardado');confete(['🌿','✨']);renderCuidados();mostrarToast('Feito ✓','Desfazer',()=>{c.feitoEm=null;salva();renderCuidados();});};});
  box.querySelectorAll('[data-cdesf]').forEach(b=>{b.onclick=()=>{const c=S.cuidados.find(x=>x.id===b.dataset.cdesf);if(!c)return;c.feitoEm=null;salva();renderCuidados();};});
  box.querySelectorAll('[data-crm]').forEach(b=>{b.onclick=()=>{const idx=S.cuidados.findIndex(x=>x.id===b.dataset.crm);if(idx<0)return;const [tirado]=S.cuidados.splice(idx,1);salva();renderCuidados();mostrarToast('Removido','Desfazer',()=>{S.cuidados.splice(idx,0,tirado);salva();renderCuidados();});};});
  $('cuidSaude').checked=!S.lembreteSaudeDesligado;
}
function abrirCuidados(){renderCuidados();abrirOverlayTopo($('cuidadosModal'));}

/* ============ HISTÓRICO DE RESUMOS ============ */
function abrirHistoricoResumos(){
  const todos=[];
  (S.resumo.historico||[]).forEach(r=>todos.push({...r,tipo:'semanal'}));
  (S.resumoMensal.historico||[]).forEach(r=>todos.push({...r,tipo:'mensal'}));
  if(!todos.length){
    $('listaHistorico').innerHTML='<div class="rs-historico-vazio">Ainda sem resumos guardados.<br>O primeiro aparece depois de uma semana de uso.</div>';
  } else {
    todos.sort((a,b)=>(b.mostradoEm||'').localeCompare(a.mostradoEm||''));
    $('listaHistorico').innerHTML=todos.map((r,i)=>{
      const data=new Date((r.mostradoEm||r.periodo.inicio)+'T12:00:00').toLocaleDateString('pt-BR',{day:'numeric',month:'long',year:'numeric'});
      const tipo=r.tipo==='mensal'?'Mensal':'Semanal';
      return`<div class="rs-historico-item" data-idx="${i}"><div class="lh"><span class="tipo ${r.tipo}">${tipo}</span><span class="dta">${esc(data)}</span></div><div class="per">${esc(fmtPeriodoBonito(r.periodo.inicio,r.periodo.fim))}</div></div>`;
    }).join('');
    document.querySelectorAll('#listaHistorico [data-idx]').forEach(el=>{
      el.onclick=()=>{
        const i=+el.dataset.idx;const r=todos[i];
        const o=$('historicoModal');o.classList.remove('ativo');
        setTimeout(()=>{o.hidden=true;mostrarResumo(r,r.tipo);},340);
      };
    });
  }
  $('historicoFechar').onclick=()=>{const o=$('historicoModal');o.classList.remove('ativo');setTimeout(()=>{o.hidden=true;document.body.style.overflow='';},320);};
  const o=$('historicoModal');o.hidden=false;requestAnimationFrame(()=>o.classList.add('ativo'));document.body.style.overflow='hidden';
}

