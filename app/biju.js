/* ============ BIJU ANIMADA (app/biju.js) ============
   A comemoração da Biju em animação (de coleira, patinhas pra cima), no lugar da pose "comemoracao" do fantoche.
   bijuCelebra(caixa, largura): coloca a animação na caixa e toca o som dela (se os sons do app estiverem ligados).
   Com "reduzir movimento" no celular, mostra a imagem parada e sem som.
   Os arquivos ficam em atracao/ (biju-celebrando.webp, -parada.webp e .mp3). */
const BIJU_CELEBRA_MS=5300;
function bijuCelebra(caixa,largura){
  if(!caixa)return;
  const parada=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  caixa.innerHTML=`<img class="biju-celebra" src="atracao/biju-celebrando${parada?'-parada':''}.webp?v=1&t=${Date.now()}" alt="" aria-hidden="true" style="width:${largura||140}px;max-width:100%;height:auto;display:block;margin:0 auto">`;
  if(parada)return;
  try{if(typeof somLigado==='function'&&!somLigado())return;
    const a=new Audio('atracao/biju-celebrando.mp3');a.volume=.8;a.play().catch(()=>{});}catch(e){}
}
