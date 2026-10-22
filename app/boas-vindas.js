/* ============ BOAS-VINDAS DA DIVA ============
   A gatinha se apresenta para quem chega novo, conta o que o app tem e como ele vai abrindo aos poucos.
   Aparece antes do cadastro (nome, quem cuida...). Quem já usa o app pode rever em Configurações > "Conhecer a Diva".
   Para mudar os textos, mexa só em BV_TELAS. A gatinha vem de mascote/ (ver mascote/LEIA-ME.md). */
const BV_TELAS=[
  {acao:'tchau',
   titulo:'Bem-vinda, diva!',
   html:`<p class="onb-texto">Você fez uma boa escolha: cuidar de si. Aqui você tem um espaço de autocuidado diário, pra lembrar todo dia que você é a pessoa mais importante da sua vida.</p>
         <p class="onb-texto">E cada vez que você volta aqui, está fazendo essa escolha de novo.</p>`},
  {acao:'feliz',
   titulo:'Com pequenos passos a gente chega longe',
   html:`<p class="onb-texto">E o primeiro passo é olhar pros seus hábitos. Um gesto pequeno, repetido todo dia, vai somando até te levar longe. Você começa com um só, e quando ele assentar, chega o próximo.</p>
         <p class="onb-texto">De vez em quando eu vou te perguntar como aquele hábito está deixando o seu dia melhor. Você vai se surpreender com as respostas.</p>`},
  {acao:'pular',
   titulo:'Cada conquista merece um mimo',
   html:`<p class="onb-texto">Aqui ninguém espera a meta final pra comemorar. Com 3, 7 e 21 dias de hábito, você ganha um prêmio, do tamanho do tempo que você tem naquele dia. Pode criar os seus também, e cada vitória fica guardada no seu Livro de Conquistas.</p>
         <p class="onb-texto">Se cuidar também é saber se recompensar, e eu vou te ajudar a lembrar disso.</p>`},
  {acao:'curiosa',
   titulo:'Um espelho pra você',
   html:`<p class="onb-texto">No check-in você conta como dormiu, comeu e se sentiu, e marca as práticas do dia: aqueles gestinhos de carinho consigo. Tem até um teste pra descobrir o seu jeito de se cuidar, e aí as sugestões ficam com a sua cara.</p>
         <p class="onb-texto">Toda semana e todo mês eu te mostro um resumo, e a cada 21 dias o mapa emocional vira uma carta com o retrato de como você está e do quanto mudou. Dá pra ver, e dá pra medir!</p>`},
  {acao:'brilho',
   titulo:'Do que você quer ao primeiro passo',
   html:`<p class="onb-texto">A Lei da Atração ensina que a gente atrai aquilo em que coloca atenção. Na Atração, você transforma o que te incomoda em clareza sobre o que quer, escreve a sua declaração e vai soltando as dúvidas no Livro de Permissões.</p>
         <p class="onb-texto">No fim, o desejo vira um pequeno passo, que volta pra cá como hábito novo. É assim que tudo se conecta: você se olha, escolhe e caminha.</p>`},
  {acao:'feliz',
   titulo:'Tudo vai se abrindo aos poucos',
   html:`<p class="onb-texto">No começo você vê só a tela Hoje. O resto chega conforme você caminha, e eu venho te apresentar cada parte:</p>
         <div class="bv-trilha">
           <div><span>3 dias</span>com um hábito, chega o check-in</div>
           <div><span>7 dias</span>chega o mapa emocional</div>
           <div><span>1º retrato</span>chegam o Celebrar e a Atração</div>
         </div>
         <p class="onb-texto">Quanto mais você aparece, mais o app se abre pra você.</p>`,
   botao:'Vamos, diva!'}
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
