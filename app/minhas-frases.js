/* ============ MINHAS FRASES ============
   Cada hábito pode ter frases próprias, escritas pela pessoa (em Editar hábito). Elas aparecem ao marcar,
   no lugar das frases prontas do app. Ficam guardadas no próprio hábito (hb.frases), nos dados de cada uma.

   ETAPA DE TRANSIÇÃO (temporária): as frases antigas do batom do perfil original são copiadas uma vez
   pros dados dela. Depois que ela abrir o app, este bloco e a lista abaixo saem do código. */
(function(){
  try{
    if(!S.perfilOriginal||S.frasesCopiadas)return;
    const hb=(S.habitos||[]).find(h=>h.id==='batom');
    if(hb&&!(Array.isArray(hb.frases)&&hb.frases.length))hb.frases=["Eu passei batom hoje, e a psiquiatra que se foda.","Batom na boca, psiquiatra no caralho.","Lábios vermelhos, prontuário contestado.","Passei batom. Evidências de vida encontradas.","Batom: 1. Psiquiatra: 0.","Hoje eu tenho batom e opinião."];
    S.frasesCopiadas=true;salva();
  }catch(e){console.warn('minhas frases',e);}
})();
