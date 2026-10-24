/* ============ Tema: automático (segue o celular), claro ou escuro ============
   A escolha fica neste aparelho (localStorage 'divaTema': 'auto' | 'claro' | 'escuro').
   O CSS do app continua escrito com @media (prefers-color-scheme: dark); quando a pessoa
   força um modo, este arquivo troca essa condição por "sempre" ou "nunca" em cada regra.
   Carregado no <head>, antes das folhas de estilo, pra quase não piscar. */
(function(){
  const CHAVE='divaTema';
  const SIM='(min-width: 0px)',NAO='(min-width: 99999px)';
  const RE=/\(\s*prefers-color-scheme\s*:\s*(dark|light)\s*\)/gi;
  const originais=new WeakMap();
  function modo(){try{const m=localStorage.getItem(CHAVE);return m==='claro'||m==='escuro'?m:'auto';}catch(e){return 'auto';}}
  function escuroAgora(){const m=modo();if(m!=='auto')return m==='escuro';try{return matchMedia('(prefers-color-scheme: dark)').matches;}catch(e){return false;}}
  function trocaRegras(lista,m){
    for(const r of Array.from(lista||[])){
      if(r.media&&r.cssRules){
        let orig=originais.get(r);
        if(orig===undefined){orig=r.media.mediaText;originais.set(r,orig);}
        RE.lastIndex=0;
        if(RE.test(orig)){
          const novo=m==='auto'?orig:orig.replace(RE,(_,lado)=>((lado.toLowerCase()==='dark')===(m==='escuro'))?SIM:NAO);
          if(r.media.mediaText!==novo)try{r.media.mediaText=novo;}catch(e){}
        }
      }
      if(r.cssRules)trocaRegras(r.cssRules,m);
    }
  }
  function aplicar(){
    const m=modo();
    for(const sh of Array.from(document.styleSheets)){let rs;try{rs=sh.cssRules;}catch(e){continue;}trocaRegras(rs,m);}
    const raiz=document.documentElement;
    raiz.dataset.tema=m;
    const esc=escuroAgora();
    const cs=document.querySelector('meta[name="color-scheme"]');if(cs)cs.content=m==='auto'?'light dark':(esc?'dark':'light');
    document.querySelectorAll('meta[name="theme-color"]').forEach(mt=>{
      if(!mt.dataset.mediaOrig)mt.dataset.mediaOrig=mt.getAttribute('media')||'';
      const ehEscuro=/dark/.test(mt.dataset.mediaOrig);
      if(m==='auto')mt.setAttribute('media',mt.dataset.mediaOrig);
      else mt.setAttribute('media',ehEscuro===esc?'all':'not all');
    });
  }
  function escolher(m){
    try{if(m==='auto')localStorage.removeItem(CHAVE);else localStorage.setItem(CHAVE,m);}catch(e){}
    aplicar();
    try{document.dispatchEvent(new CustomEvent('diva-tema',{detail:m}));}catch(e){}
  }
  window.DIVAtema={modo,escolher,aplicar,escuro:escuroAgora};
  /* cada folha de estilo que termina de carregar recebe a escolha */
  document.addEventListener('load',e=>{const t=e.target;if(t&&(t.tagName==='LINK'||t.tagName==='STYLE'))aplicar();},true);
  document.addEventListener('DOMContentLoaded',aplicar);
  window.addEventListener('load',aplicar);
  /* estilos acrescentados depois (telas montadas por código) */
  try{new MutationObserver(ms=>{if(ms.some(x=>Array.from(x.addedNodes).some(n=>n.tagName==='STYLE'||n.tagName==='LINK')))aplicar();}).observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
})();
