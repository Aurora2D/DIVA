/* ============ Momento de comemorar ============
   Ao marcar um hábito, se a pessoa tem uma comemoração escolhida (e nenhuma outra tela vai abrir),
   a gatinha aparece comemorando com a comemoração dela em destaque.
   Não pede nada: fecha sozinho em poucos segundos ou com um toque. */
(function(){
  let el=null,timer=null,depois=null;
  function monta(){
    if(el)return el;
    el=document.createElement('div');
    el.className='cm-overlay';el.hidden=true;el.setAttribute('role','status');el.setAttribute('aria-live','polite');
    el.innerHTML='<div class="cm-caixa"><div class="cm-gata" id="cmGata"></div><p class="cm-kick">Hora de comemorar</p><p class="cm-txt" id="cmTxt"></p><p class="cm-dica">toque pra fechar</p></div>';
    el.addEventListener('click',fecha);
    document.body.appendChild(el);
    return el;
  }
  function fecha(){
    if(!el||el.hidden)return;
    clearTimeout(timer);el.classList.remove('on');
    setTimeout(()=>{el.hidden=true;const g=document.getElementById('cmGata');if(g)g.innerHTML='';const f=depois;depois=null;if(f)f();},260);
  }
  window.celebraMomento=function(aoFechar){
    const c=celebraAtual();if(!c){if(aoFechar)aoFechar();return;}
    monta();depois=aoFechar||null;
    document.getElementById('cmTxt').textContent=c.texto;
    const g=document.getElementById('cmGata');
    if(window.customElements&&customElements.get('gatinha-fantoche')){
      g.innerHTML='<gatinha-fantoche class="cm-fantoche" pose="comemoracao" src-base="mascote/assets/pecas/" aria-hidden="true"></gatinha-fantoche>';
      const f=g.firstChild,vai=()=>{try{f.play('comemorar');}catch(e){}};
      if(f.classList.contains('pronta'))vai();else f.addEventListener('ready',vai,{once:true});
    } else g.innerHTML='<div class="cm-emoji">🎉</div>';
    el.hidden=false;void el.offsetWidth;el.classList.add('on');
    clearTimeout(timer);timer=setTimeout(fecha,3600);
  };
})();
