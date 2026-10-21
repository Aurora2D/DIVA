/* DIVA · liga a carta (relatorio/carta.js) ao relatório dos 21 dias.
   Usa as funções do app (S, esc, ciBarra, montarCheckinRelatorio...). Se algo falhar, devolve null
   e o app mostra o relatório de antes. */
function montarRelatorioCartaApp(rel,ciclo,extra){
  if(typeof montarCartaRelatorio!=='function'||!ciclo)return null;
  const r=ciclo.resumo||calculaScoreCiclo(ciclo);
  if(!r)return null;
  if(!CICLO_DIMS.some(d=>typeof r[d.key]==='number'))return null;
  /* ciclo anterior */
  const hist=(S.ciclo&&S.ciclo.historico)||[];
  let idx=-1;const chave=JSON.stringify(ciclo.resumo);
  for(let i=hist.length-1;i>=0;i--){if(hist[i].data===ciclo.data&&JSON.stringify(hist[i].resumo)===chave){idx=i;break;}}
  if(idx<0)for(let i=hist.length-1;i>=0;i--){if(hist[i].data===ciclo.data){idx=i;break;}}
  const ant=idx>0?hist[idx-1]:null;
  const rAnt=ant?(ant.resumo||calculaScoreCiclo(ant)):null;
  /* check-in x mapa */
  let ciObj={corr:'',ind:'',pares:[]};
  try{ciObj=montarCheckinRelatorio(ciclo);}catch(e){}
  const D=ciColetar(ciclo);
  const pares=(ciObj.pares||[]).map(x=>({lbl:x.P.lbl,mlbl:x.P.mlbl,dim:x.P.dim,ciPct:x.ciPct,mapaBom:x.mapaBom,dif:x.dif,txt:x.txt}));
  /* hábitos do ciclo */
  const fim=/^\d{4}-\d{2}-\d{2}$/.test(ciclo.data||'')?ciclo.data:hoje();
  const ini=fmtD(addDias(new Date(fim+'T12:00:00'),-20));
  const lista=[];
  (S.habitos||[]).forEach(h=>{const n=habDiasNaJanela(h.feitos,ini,fim);if(n>0)lista.push({nome:h.nome,dias:n});});
  Object.entries(S.historicoRemovidos||{}).forEach(([nome,v])=>{if(!v)return;const n=habDiasNaJanela(v.feitos,ini,fim);if(n>0)lista.push({nome,dias:n});});
  lista.sort((a,b)=>b.dias-a.dias);
  const carta=montarCartaRelatorio({
    nome:primeiroNome(),dims:r,anterior:rAnt,
    ci:{dias:D.diasComDado,pares},
    habitos:{total:lista.reduce((s,h)=>s+h.dias,0),top:lista.slice(0,2).map(h=>h.nome)}
  });
  /* texto primeiro */
  const nome=primeiroNome();
  let html=`<div class="rel-titulo">${nome?'Seu retrato dos 21 dias, '+esc(nome):'Seu retrato dos 21 dias'}</div><div class="rel-data">${esc(extra.dataStr)}</div>`;
  let obsFeito=false;
  const meio=(extra.obsHtml||'')+(extra.blocoNotas||'');
  carta.blocos.forEach(b=>{
    if(!obsFeito&&meio&&(b.t==='pergunta')){html+=meio;obsFeito=true;}
    if(b.t==='h2')html+=`<div class="rel-h2">${esc(b.txt)}</div>`;
    else if(b.t==='p')html+=`<p class="rel-p">${esc(b.txt)}</p>`;
    else if(b.t==='pergunta')html+=`<div class="rel-pergunta"><div class="rel-pergunta-q">${esc(b.txt)}</div></div>`;
    else if(b.t==='cuidado')html+=`<p class="rel-p ci-nota">${esc(b.txt)}</p>`;
    else if(b.t==='despedida')html+=`<div class="rel-despedida">${esc(b.txt)}</div>`;
  });
  if(!obsFeito)html+=meio;
  /* barras só no fim */
  const B=carta.barras;
  html+=`<div class="ci-rel rel-numeros"><div class="rel-h2">${esc(B.titulo)}</div><div class="ci-nota">${esc(B.nota)}</div>`;
  /* guarda-chuva: o desenho dos 9 gomos, e as frases curtas logo abaixo */
  const gruposCor={'O que pesa':'peso','O que sustenta':'sustenta','Como você se relaciona':'relaciona'};
  const itensGC=[];
  B.grupos.forEach(g=>g.itens.forEach(i=>itensGC.push({rot:i.rot,bom:i.bom,ant:i.delta===null||i.delta===undefined?null:i.bom-i.delta,grupo:gruposCor[g.titulo]||'relaciona'})));
  if(typeof svgGuardaChuva==='function'&&itensGC.length){
    html+=`<div class="ci-card-rel"><div class="ci-tt">Seu retrato do ciclo</div><div class="ci-nota" style="margin:0 0 4px">Cada gomo é uma parte de você. Quanto mais preenchido, mais cuidado e mais recurso.</div>${svgGuardaChuva(itensGC)}<div class="gc-leg"><span><i style="background:#c98a5a"></i>O que pesa</span><span><i style="background:#6ea87a"></i>O que sustenta</span><span><i style="background:#8F80D1"></i>Como você se relaciona</span><span>┅ ciclo anterior</span></div></div>`;
  }
  B.grupos.forEach(g=>{
    if(!g.itens.length)return;
    html+=`<div class="ci-card-rel"><div class="ci-tt">${esc(g.titulo)}</div>`;
    g.itens.forEach(i=>{
      html+=`<div class="gc-frase"><b>${esc(i.rot)}</b> ${i.delta?(i.delta>0?'▲':'▼')+' ':''}<span class="gc-n">${i.bom}</span><div class="ci-par-txt">${esc(i.legenda)}${i.delta?` (${i.delta>0?'+':''}${i.delta} desde o ciclo anterior)`:''}</div></div>`;
    });
    html+=`</div>`;
  });
  if(B.eliminacao&&B.eliminacao.length){
    html+=`<div class="ci-card-rel"><div class="ci-tt">De onde o cansaço vem</div><div class="ci-nota" style="margin:0 0 4px">Cada coisa que pesa no mapa, ao lado do seu dia a dia: de onde ela não vem e de onde vem.</div>`;
    B.eliminacao.forEach(e=>{
      html+=`<div class="el-bloco"><div class="el-t">${esc(e.titulo)}</div>`;
      if(e.naoVem.length)html+=`<div class="el-lin"><span class="el-l">não vem de</span>${e.naoVem.map(x=>`<span class="el-cp el-ok">✓ ${esc(x)}</span>`).join('')}</div>`;
      if(e.vem.length)html+=`<div class="el-lin"><span class="el-l">vem junto de</span>${e.vem.map(x=>`<span class="el-cp el-dn">${esc(x)}</span>`).join('')}</div>`;
      else html+=`<div class="el-lin"><span class="el-l">vem de</span><span class="el-cp el-ne">algo que o check-in não mede</span></div>`;
      html+=`</div>`;
    });
    html+=`</div>`;
  }
  html+=`</div>`;
  if(extra.habHtml)html+=extra.habHtml;
  html+=ciObj.ind||'';
  return html;
}
