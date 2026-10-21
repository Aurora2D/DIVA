/* Gatinha nos relatórios (resumo da semana/mês e retrato dos 21 dias). Usa só a API do mascote/ (Aurora2D/Mascote).
   gatinhaRel(alvo, 'topo')  coloca a gatinha no começo do elemento;  gatinhaRel(alvo, 'troca')  usa o lugar do emoji.
   Devolve false se o motor da gatinha não carregou (aí fica como era). Na impressão/PDF o desenho dela sai junto (o canvas imprime como imagem). */
function gatinhaRel(alvo,modo,acao){
  try{
    if(!alvo||!window.customElements||!customElements.get('gatinha-fantoche'))return false;
    const caixa=document.createElement('div');caixa.className='gata-rel';caixa.setAttribute('aria-hidden','true');
    caixa.innerHTML='<gatinha-fantoche pose="sentada" src-base="mascote/assets/pecas/"></gatinha-fantoche>';
    if(modo==='troca'){alvo.textContent='';alvo.classList.add('com-gata');alvo.appendChild(caixa);}else alvo.insertBefore(caixa,alvo.firstChild);
    const g=caixa.firstChild;
    g.addEventListener('ready',()=>{caixa.classList.add('pronta');try{setTimeout(()=>g.play(acao||'feliz'),500);}catch(e){}},{once:true});
    return true;
  }catch(e){return false;}
}
