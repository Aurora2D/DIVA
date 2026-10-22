/* ============ BOAS-VINDAS DA DIVA ============
   A gatinha se apresenta para quem chega novo, conta o que o app tem e como ele vai abrindo aos poucos.
   Aparece antes do cadastro (nome, quem cuida...). Quem já usa o app pode rever em Configurações > "Conhecer a Diva".
   Para mudar os textos, mexa só em BV_TELAS. A gatinha vem de mascote/ (ver mascote/LEIA-ME.md). */
const BV_TELAS=[
  {acao:'tchau',
   titulo:'Oi! Eu sou a Diva. E você também é',
   html:`<p class="onb-texto">Você fez uma ótima escolha: abrir este app é escolher cuidar de si. E cuidar de si é coisa de diva, um cuidado de cada vez.</p>
         <p class="onb-texto">Eu vou ser sua companheira nesse caminho, sem cobrança e sem pressa.</p>`},
  {acao:'curiosa',
   titulo:'O que tem por aqui',
   html:`<div class="bv-lista">
     <div class="bv-item"><svg class="ic"><use href="#i-hoje"/></svg><div><b>Hoje</b><span>Seus hábitos pequenos, uma bolinha pra tocar quando fizer.</span></div></div>
     <div class="bv-item"><svg class="ic"><use href="#i-checkin"/></svg><div><b>Check-in</b><span>Um espaço rápido pra registrar como foi o seu dia.</span></div></div>
     <div class="bv-item"><svg class="ic"><use href="#i-mapa"/></svg><div><b>Mapa</b><span>A cada 21 dias, um retrato de como você está, em forma de carta.</span></div></div>
     <div class="bv-item"><svg class="ic"><use href="#i-celebrar"/></svg><div><b>Celebrar</b><span>Seus prêmios e conquistas, pra lembrar do que você já fez.</span></div></div>
     <div class="bv-item"><svg class="ic"><use href="#i-atracao"/></svg><div><b>Atração</b><span>Sete sessões pra olhar pro que você quer e dar o primeiro passo.</span></div></div>
   </div>`},
  {acao:'feliz',
   titulo:'Pequeno e constante',
   html:`<p class="onb-texto">Tudo começa pelos seus hábitos. Eles são a base que organiza o seu dia e o seu autocuidado. Porque quando a gente não se cuida, não consegue cuidar de ninguém, nem de nada.</p>
         <p class="onb-texto">Por isso, no começo você vê só a tela Hoje, com um hábito. Pequeno e constante: é assim que a gente chega lá. O resto vai abrindo conforme você caminha:</p>
         <div class="bv-trilha">
           <div><span>3 dias</span>com um hábito, chega o check-in</div>
           <div><span>7 dias</span>chega o mapa</div>
           <div><span>1º retrato</span>chegam o Celebrar e a Atração</div>
         </div>
         <p class="onb-texto">Cada vez que uma parte nova abrir, eu venho te contar. E se um dia você quiser ver tudo de uma vez, é só mudar nas configurações.</p>`,
   botao:'Vamos começar'}
];
function boasVindasDiva(depois){
  let o=$('bvOverlay');
  if(!o){
    o=document.createElement('div');o.className='onb-overlay bv-overlay';o.id='bvOverlay';o.hidden=true;
    o.innerHTML=`<div class="onb-caixa bv-caixa">
      <div class="bv-gata">${window.customElements&&customElements.get('gatinha-fantoche')?'<gatinha-fantoche pose="sentada" src-base="mascote/assets/pecas/" aria-hidden="true"></gatinha-fantoche>':''}</div>
      <div class="onb-titulo" id="bvTitulo"></div>
      <div id="bvCorpo"></div>
      <div class="bv-pontos" id="bvPontos"></div>
      <button class="onb-btn" id="bvSeguir">Continuar</button>
      <button class="onb-btn sec" id="bvVoltar">Voltar</button>
    </div>`;
    document.body.appendChild(o);
    const g=o.querySelector('gatinha-fantoche');
    if(g){g.addEventListener('ready',()=>g.classList.add('pronta'),{once:true});g.onclick=()=>bvGata(['feliz','tchau','curiosa','pular'][Math.floor(Math.random()*4)]);}
  }
  let i=0;
  const mostra=()=>{
    const t=BV_TELAS[i];
    $('bvTitulo').textContent=t.titulo;
    $('bvCorpo').innerHTML=t.html;
    $('bvPontos').innerHTML=BV_TELAS.map((_,k)=>`<span class="${k===i?'on':''}"></span>`).join('');
    $('bvSeguir').textContent=t.botao||'Continuar';
    $('bvVoltar').style.visibility=i?'visible':'hidden';
    const c=o.querySelector('.bv-caixa');c.style.animation='none';void c.offsetWidth;c.style.animation='';
    bvGata(t.acao,i?150:700);
  };
  $('bvSeguir').onclick=()=>{
    if(i<BV_TELAS.length-1){i++;mostra();return;}
    S.boasVindasVistas=true;salva();
    o.classList.remove('ativo');
    setTimeout(()=>{o.hidden=true;document.body.style.overflow='';if(typeof depois==='function')depois();},450);
  };
  $('bvVoltar').onclick=()=>{if(i){i--;mostra();}};
  o.hidden=false;document.body.style.overflow='hidden';
  requestAnimationFrame(()=>o.classList.add('ativo'));
  mostra();
}
function bvGata(acao,atraso){
  setTimeout(()=>{const g=document.querySelector('#bvOverlay gatinha-fantoche');if(!g)return;
    const f=()=>{try{if(typeof g.play==='function')g.play(acao);}catch(e){}};
    if(g.classList.contains('pronta'))f();else g.addEventListener('ready',f,{once:true});},atraso||150);
}
