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
    const anim=typeof bijuCelebra==='function';
    if(anim)bijuCelebra(g,150);
    else g.innerHTML='<div class="cm-emoji">🎉</div>';
    el.hidden=false;void el.offsetWidth;el.classList.add('on');
    clearTimeout(timer);timer=setTimeout(fecha,anim?BIJU_CELEBRA_MS+300:3600);
  };
})();
