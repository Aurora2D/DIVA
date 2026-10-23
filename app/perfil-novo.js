/* ============ PERFIL NOVO ============
   Ajustes só pra quem começa o app do zero (S.perfilOriginal === false).
   O perfil original (o da Érica) não passa por nada daqui: tudo checa perfilNovo() antes.
   O que muda pra quem chega:
   - saudação do topo neutra (sem "Estou em processo de ficar bem");
   - "Voz e arte" no Livro de Conquistas vira "Arte e criatividade" (volta a "Voz e arte" se ligar Sugestões de música);
   - check-in: uma frase separando prática de hábito e, depois do quiz, as práticas gerais ficam num "ver mais".
   Carregue antes de iniciar.js. */

function perfilNovo(){return !S.perfilOriginal;}

/* topo da tela Hoje */
function perfilNovoSaudacao(){
  const n=(S.onboarding&&S.onboarding.nome)||'';
  return n?'Que bom ter você aqui, '+n+'.':'Que bom ter você aqui.';
}

/* Livro de Conquistas: a área de arte só fala de voz pra quem canta */
function perfilNovoAreaArte(){
  if(!perfilNovo())return;
  const voz=musicaAtiva();
  const nome=voz?'Voz e arte':'Arte e criatividade';
  const emoji=voz?'🎤':'🎨';
  const a=AREAS_CONQUISTAS.find(x=>x.id==='voz');if(a){a.nome=nome;a.emoji=emoji;}
  ['cqArea','cqAreaModal'].forEach(id=>{const sel=$(id);if(!sel)return;const op=sel.querySelector('option[value="voz"]');if(op)op.textContent=emoji+' '+nome;});
}

/* Check-in: práticas */
const PERFIL_NOVO_EXPLICA='<b>Prática</b> é o registro do que você fez de bom pra você hoje: sem meta, sem cobrança. <b>Hábito</b> é diferente: é o que você está construindo aos poucos, com meta, e fica na tela Hoje.';
function perfilNovoPraticasHTML(ci,grupoHTML){
  const grupos=Object.entries(PRATICAS);
  const temQuiz=grupos.some(([g,l])=>g===QUIZ_GRUPO&&l.length);
  const intro=`<p class="mut explica-secao" style="font-size:12px;line-height:1.5;margin:0 0 12px">${PERFIL_NOVO_EXPLICA}</p>`;
  if(!temQuiz)return intro+grupos.map(([g,l])=>grupoHTML(g,l)).join('');
  /* depois do quiz: as escolhidas por ela ficam à vista; as gerais, num "ver mais".
     Grupo com algo marcado hoje continua à vista, pra nada sumir. */
  const marcado=g=>Object.keys(ci.praticas||{}).some(k=>k.startsWith(g+'|'));
  const vista=grupos.filter(([g])=>g===QUIZ_GRUPO||marcado(g));
  const resto=grupos.filter(([g])=>g!==QUIZ_GRUPO&&!marcado(g));
  const nResto=resto.reduce((s,[,l])=>s+l.length,0);
  let h=intro+vista.map(([g,l])=>grupoHTML(g,l)).join('');
  if(resto.length)h+=`<details class="ci-mais-praticas" style="margin-bottom:12px"><summary class="mut" style="cursor:pointer;font-size:12.5px;font-weight:700;padding:6px 0">Ver mais práticas (${nResto})</summary><div style="margin-top:8px">${resto.map(([g,l])=>grupoHTML(g,l)).join('')}</div></details>`;
  return h;
}
