/* ============ AS CINCO LINGUAGENS EM TODO O APP ============
   Hábitos, sugestões, práticas do check-in e o teste de estilo usam os mesmos nomes:
   Palavras de afirmação, Tempo de qualidade, Presentes, Atos de serviço e Toque físico.
   Este arquivo converte, uma vez, o que já estava guardado com os nomes antigos
   (grupos de práticas, práticas marcadas nos check-ins e categorias dos hábitos).
   Carregue logo depois de estado.js. */
const PRATICAS_NOMES_ANTIGOS={
  '💌 Palavras':'💌 Palavras de afirmação','💌 Palavras de incentivo':'💌 Palavras de afirmação',
  '⏳ Tempo':'⏳ Tempo de qualidade','🎡 Tempo de qualidade':'⏳ Tempo de qualidade',
  '🛠️ Serviço':'🛠️ Atos de serviço',
  '🤍 Toque':'🤍 Toque físico','🤍 Contato físico':'🤍 Toque físico'
};
const HABITO_GRUPO_POR_ID={batom:'presentes',risada:'tempo',agua:'toque'};
function migrarLinguagens(){
  if(S.linguagensMigradas)return;
  const novo=g=>PRATICAS_NOMES_ANTIGOS[g]||g;
  // grupos de práticas (juntando, se por acaso existirem os dois nomes)
  if(S.praticas&&typeof S.praticas==='object'){
    const p={};
    Object.entries(S.praticas).forEach(([g,l])=>{const n=novo(g);p[n]=(p[n]||[]).concat((l||[]).filter(x=>!(p[n]||[]).includes(x)));});
    S.praticas=p;
  }
  // práticas marcadas nos check-ins: a chave é "grupo|item"
  Object.values(S.checkins||{}).forEach(ci=>{
    if(!ci||!ci.praticas)return;
    const p={};
    Object.entries(ci.praticas).forEach(([k,v])=>{const i=k.indexOf('|');p[i<0?k:novo(k.slice(0,i))+k.slice(i)]=v;});
    ci.praticas=p;
  });
  // categorias dos hábitos (inclusive dos que foram removidos e podem voltar)
  const grupoNovo=(g,id)=>HABITO_GRUPO_POR_ID[id]&&(GRUPO_ALIAS[g]||!g)?HABITO_GRUPO_POR_ID[id]:(GRUPO_ALIAS[g]||g);
  (S.habitos||[]).forEach(h=>{h.grupo=grupoNovo(h.grupo,h.id);});
  Object.values(S.historicoRemovidos||{}).forEach(v=>{if(v&&v.meta)v.meta.grupo=grupoNovo(v.meta.grupo,v.meta.id);});
  if(S.ui&&Array.isArray(S.ui.gruposFechados))S.ui.gruposFechados=S.ui.gruposFechados.map(g=>GRUPO_ALIAS[g]||g);
  S.linguagensMigradas=true;salva();
}
try{migrarLinguagens();}catch(e){console.warn('migração das linguagens',e);}
