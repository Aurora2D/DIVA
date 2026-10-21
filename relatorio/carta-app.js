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
  B.grupos.forEach(g=>{
    if(!g.itens.length)return;
    html+=`<div class="ci-card-rel"><div class="ci-tt">${esc(g.titulo)}</div>`;
    g.itens.forEach(i=>{
      const tend=i.delta?`<span class="tend">${i.delta>0?'▲':'▼'}</span>`:undefined;
      html+=ciBarra(i.rot,i.bom,String(i.bom),i.delta?(i.delta>0?'▲':'▼'):undefined,ciCorBarra(i.bom));
      html+=`<div class="ci-par-txt" style="margin:0 0 8px">${esc(i.legenda)}${i.delta?` (${i.delta>0?'+':''}${i.delta} desde o ciclo anterior)`:''}</div>`;
    });
    html+=`</div>`;
  });
  if(B.cruzamentos.itens.length){
    html+=`<div class="ci-card-rel"><div class="ci-tt">${esc(B.cruzamentos.titulo)}</div>`;
    B.cruzamentos.itens.forEach(i=>{
      html+=`<div class="ci-par"><div class="ci-par-t"><span>${esc(i.rot)}</span></div>${ciBarra('Dia a dia',i.ci,String(i.ci),undefined,ciCorBarra(i.ci))}${ciBarra('Mapa',i.mapa,String(i.mapa),undefined,ciCorBarra(i.mapa))}<div class="ci-par-txt">${esc(i.legenda)}</div></div>`;
    });
    html+=`<div class="ci-nota">As barras estão na mesma direção: quanto mais cheia, melhor.</div></div>`;
  }
  html+=`</div>`;
  if(extra.habHtml)html+=extra.habHtml;
  html+=ciObj.ind||'';
  return html;
}
