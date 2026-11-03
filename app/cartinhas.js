/* ============ CARTINHAS DA DIVA (21 dias) ============
   Uma cartinha por dia na tela Hoje, nos primeiros 21 dias de app. Um banco só, pra todos os hábitos.
   Cada dia tem várias versões; a do dia é sorteada uma vez e fica a mesma até o dia virar.
   {acao} vira a ação do hábito principal da pessoa (ex.: "dar risada"). Use só depois de "de", "a" ou sozinho
   como infinitivo. Se a pessoa não tiver hábito, as versões com {acao} são puladas.
   Pra mudar os textos, mexa só em CARTINHAS. Nunca cobrar: sempre convite.
   Embaixo da cartinha aparece o que falta pra próxima aba abrir (abaPista, em abas.js). */
const CARTINHAS=[
  /* dia 1 · começar */
  ['Oi! Eu sou a Diva, e vou te mandar uma cartinha por dia nas próximas três semanas. Hoje é só o começo, e começo não precisa ser bonito. Precisa só acontecer.',
   'Que bom que você está aqui. Você escolheu um hábito pequeno de propósito: pequeno cabe na vida real. Amanhã eu volto com outra cartinha.',
   'Hoje você deu o primeiro passo para {acao}. Não precisa sentir nada de especial ainda. Hábito é semente: primeiro fica embaixo da terra, quietinho.'],
  /* dia 2 · o pequeno */
  ['Um segredo: o tamanho do hábito importa menos do que voltar a ele. Dois minutos hoje valem mais do que uma hora que nunca acontece.',
   'Se hoje parecer pouco, está ótimo. O pouco é o que dá pra repetir, e é repetindo que a coisa vira sua.',
   'Pensa em {acao} como um oi que você dá pra você mesma, todo dia. Não precisa ser uma visita longa.'],
  /* dia 3 · primeiro marco */
  ['Três dias! Parece pouco, mas é aqui que muita gente desiste sem perceber. Se você chegou, você já está fazendo diferente.',
   'Terceiro dia. Repara uma coisa: você lembrou. Lembrar já é metade do hábito.',
   'Três dias de {acao}. Não é sobre a sequência perfeita, é sobre você ir criando um caminho conhecido dentro do seu dia.'],
  /* dia 4 · dias imperfeitos */
  ['Alguns dias vão ser bagunçados. Faz parte. Num dia ruim, a versão mínima do hábito já conta inteira.',
   'Se a vida apertar hoje, tudo bem fazer metade. Ou um pouquinho. Ou só pensar nele com carinho e tentar amanhã.',
   'Hábito não mora na disciplina, mora na gentileza. Dá pra {acao} do jeito que der hoje.'],
  /* dia 5 · enxergar o que já faz */
  ['Hoje eu te convido a reparar no que você já fez esta semana. Não só no hábito: em tudo. Às vezes a gente faz muito e não vê nada.',
   'Uma pergunta pra hoje: o que você fez nos últimos dias que ninguém viu? Conta como feito. Conta como seu.',
   'Cada vez que você escolhe {acao}, você está fazendo uma coisa por você. Isso merece ser visto, nem que seja só por você.'],
  /* dia 6 · sentir */
  ['Depois do hábito de hoje, para um segundinho e repara como o seu corpo está. Mais leve? Igual? Tudo é informação, nada é nota.',
   'Hoje a cartinha é só um convite: faça o hábito e sinta. Sem pressa de acabar.',
   'Como fica você depois de {acao}? Não precisa responder pra ninguém. Só perceber já muda alguma coisa.'],
  /* dia 7 · uma semana */
  ['Uma semana! Sete dias atrás isso era só uma ideia. Agora já tem um pouquinho de história.',
   'Faz uma semana que a gente se conhece. Obrigada por voltar. Cada volta é uma escolha sua.',
   'Uma semana de {acao}. Se teve dia que não deu, a semana continua valendo. Você está aqui, e isso é o que importa.'],
  /* dia 8 · recomeçar */
  ['Se você faltou algum dia, não precisa recomeçar do zero. Você recomeça de onde está, com tudo o que já fez até aqui.',
   'Falhar um dia não apaga os outros. A conta do hábito só soma, nunca subtrai.',
   'Voltar depois de uma pausa é uma habilidade. Talvez a mais importante de todas.'],
  /* dia 9 · curiosidade */
  ['Experimenta hoje fazer o hábito com curiosidade, como se fosse a primeira vez. O que tem nele que você ainda não reparou?',
   'Dá pra mudar um detalhe hoje: o horário, o lugar, a música de fundo. Hábito também pode ter graça.',
   'E se hoje {acao} fosse uma pequena brincadeira, e não uma tarefa?'],
  /* dia 10 · comparar só consigo */
  ['A única comparação justa é com você mesma de dez dias atrás. E essa pessoa ficaria orgulhosa de ver onde você está.',
   'Cada pessoa tem o seu tempo. O seu ritmo não está atrasado: ele é seu.',
   'Tem gente que leva mais tempo, tem gente que leva menos. Você está aprendendo a {acao} do seu jeito, e isso basta.'],
  /* dia 11 · cansaço */
  ['Se hoje bater cansaço, lembra: descansar também é cuidar. O hábito espera por você.',
   'Dia pesado? Faz a versão mais leve possível, ou deixa pra amanhã sem culpa. Você não está em prova.',
   'Cuidar de você inclui saber a hora de ir devagar.'],
  /* dia 12 · ambiente */
  ['Uma dica: deixa o hábito fácil de achar. Uma garrafinha à vista, um lembrete na tela, o caderno em cima da mesa. O ambiente ajuda mais do que a força de vontade.',
   'O que deixaria o seu hábito mais fácil amanhã? Às vezes é só mudar uma coisa de lugar.',
   'Quanto menos passos entre você e {acao}, mais fácil fica. Dá pra tirar um passo hoje?'],
  /* dia 13 · celebrar pequeno */
  ['Hoje, depois do hábito, comemora. Um sorriso, uma dancinha, um "isso!". Comemorar ensina o cérebro que aquilo foi bom.',
   'Pequenas vitórias também merecem festa. Qual foi a sua de hoje?',
   'Você fez {acao}? Então já tem motivo pra comemorar. Pode ser bem pequenininho.'],
  /* dia 14 · meio do caminho */
  ['Duas semanas! Você passou da metade dos 21 dias. Olha pra trás um pouquinho: dá pra ver o caminho.',
   'Metade do caminho. O que parecia esforço no começo talvez já esteja um pouco mais natural.',
   'Duas semanas de {acao}. Isso não é pouca coisa. É um pedaço da sua vida que você escolheu.'],
  /* dia 15 · o porquê */
  ['Lembra por que você começou? Hoje vale a pena pensar nisso de novo. O porquê é o que segura o hábito nos dias difíceis.',
   'Por que esse hábito importa pra você? Não precisa ser um motivo grande. Pode ser só "porque me faz bem".',
   'O que muda na sua vida quando você consegue {acao}? Guarda essa resposta pra quando precisar.'],
  /* dia 16 · versão mínima */
  ['Todo hábito tem uma versão mínima, aquela que cabe até no pior dia. Qual é a do seu? Ter ela na manga deixa tudo mais leve.',
   'Nem todo dia precisa ser o dia completo. Ter um plano B pequenininho também é cuidado.',
   'Num dia corrido, qual seria o menor jeito de {acao}? Esse jeito também vale.'],
  /* dia 17 · voz crítica */
  ['Se aparecer aquela voz dizendo "não é suficiente", você pode responder: "estou em processo". E segue.',
   'A voz que cobra perfeição não precisa mandar no seu dia. Você pode ouvir e escolher outra coisa.',
   'Você não precisa ser perfeita pra {acao}. Precisa só continuar voltando.'],
  /* dia 18 · identidade */
  ['Aos poucos, o hábito vai deixando de ser algo que você faz e vira um pouco de quem você é.',
   'Repara: você já é alguém que cuida de si, mesmo nos dias em que não parece.',
   'Talvez você já esteja virando uma pessoa que gosta de {acao}. Como é pensar nisso?'],
  /* dia 19 · companhia */
  ['Hábitos ficam mais leves acompanhados. Tem alguém com quem você gostaria de dividir essa conquista?',
   'Contar pra alguém o que você está construindo pode ser bonito. Não pra prestar contas: pra ser vista.',
   'Pensa em alguém que ficaria feliz em saber que você está aprendendo a {acao}.'],
  /* dia 20 · olhar pra trás */
  ['Amanhã fecha 21 dias. Hoje é dia de olhar pra trás com carinho: quanta coisa aconteceu desde a primeira cartinha?',
   'Penúltima cartinha. Obrigada por ter deixado eu te acompanhar até aqui.',
   'Vinte dias convivendo com {acao}. O que você descobriu sobre você nesse tempo?'],
  /* dia 21 · fechamento */
  ['21 dias! Esta é a última cartinha da série, mas o caminho continua. O hábito agora é seu, e eu continuo por aqui.',
   'Três semanas. Você fez algo que muita gente só planeja. Seja qual for o seu número de dias marcados, você chegou até aqui.',
   'Fechamos 21 dias juntas. Que {acao} siga sendo um carinho seu com você. Eu fico torcendo daqui. 🐾']
];

function cartinhaHabitoPrincipal(){
  const ativos=(S.habitos||[]).filter(h=>!h.pausado);
  if(!ativos.length)return null;
  return ativos.slice().sort((a,b)=>Object.keys(b.feitos||{}).length-Object.keys(a.feitos||{}).length)[0];
}
/* dia da cartinha: conta a partir do primeiro dia em que ela apareceu (1 a 21); depois do 21 não aparece mais */
function cartinhaDia(){
  const c=S.cartinhas;if(!c||!c.inicio)return 1;
  return Math.floor((new Date(hoje()+'T12:00:00')-new Date(c.inicio+'T12:00:00'))/86400000)+1;
}
function cartinhaTexto(dia){
  const hb=cartinhaHabitoPrincipal();
  const acao=hb&&typeof acaoDoHabito==='function'?acaoDoHabito(hb):'';
  let versoes=CARTINHAS[dia-1]||[];
  if(!acao)versoes=versoes.filter(t=>t.indexOf('{acao}')<0);
  if(!versoes.length)return '';
  /* sorteio fixo por dia: muda de um dia pro outro, mas não muda ao reabrir o app */
  let h=0;const sem=(S.cartinhas&&S.cartinhas.semente||'')+dia;for(let i=0;i<sem.length;i++)h=(h*31+sem.charCodeAt(i))>>>0;
  return versoes[h%versoes.length].split('{acao}').join(acao);
}
/* próxima aba ainda fechada, pra mostrar quanto falta (só no modo "abre aos poucos") */
function cartinhaProximaAba(){
  if(typeof abasProgressivo!=='function'||!abasProgressivo()||typeof ABAS_REGRAS==='undefined')return '';
  const r=ABAS_REGRAS.find(x=>!abaLiberada(x.tab));
  return r?abaPista(r.tab):'';
}
function renderCartinha(){
  const box=$('cartinhaHojeBox');if(!box)return;
  if(!(S.habitos||[]).length){box.innerHTML='';return;}
  if(!S.cartinhas){S.cartinhas={inicio:hoje(),semente:Math.random().toString(36).slice(2,8),lidas:{}};salva();}
  const dia=cartinhaDia(),pista=cartinhaProximaAba();
  const txt=dia<=21?cartinhaTexto(dia):'';
  if(!txt&&!pista){box.innerHTML='';return;}
  const lida=!!(S.cartinhas.lidas&&S.cartinhas.lidas[dia]);
  const gata=window.customElements&&customElements.get('gatinha-fantoche');
  box.innerHTML=(txt?`<div class="carta-diva${lida?' aberta':''}" id="cartaDiva">
      <button type="button" class="cd-cab" id="cartaDivaAbrir" aria-expanded="${lida}">
        <span class="cd-env" aria-hidden="true">💌</span>
        <span class="cd-tit"><b>Cartinha da Diva</b><span>dia ${dia} de 21${lida?'':' · toque pra abrir'}</span></span>
      </button>
      <div class="cd-corpo">
        ${gata?'<div class="cd-gata"><gatinha-fantoche pose="sentada" src-base="mascote/assets/pecas/" aria-hidden="true"></gatinha-fantoche></div>':''}
        <p class="cd-txt">${esc(txt)}</p>
        <p class="cd-ass">Diva 🐾</p>
      </div>
    </div>`:'')+(pista?`<p class="cd-pista">🔒 ${esc(pista)}</p>`:'');
  const bt=$('cartaDivaAbrir');
  if(bt)bt.onclick=()=>{
    const card=$('cartaDiva');const abre=!card.classList.contains('aberta');
    card.classList.toggle('aberta',abre);bt.setAttribute('aria-expanded',abre);
    if(abre){
      if(!S.cartinhas.lidas)S.cartinhas.lidas={};
      if(!S.cartinhas.lidas[dia]){S.cartinhas.lidas[dia]=true;salva();const s=bt.querySelector('.cd-tit span');if(s)s.textContent='dia '+dia+' de 21';}
      const g=card.querySelector('gatinha-fantoche');
      if(g){const f=()=>{try{g.play(dia===21||dia===7||dia===14?'comemorar':'tchau');}catch(e){}};
        if(g.classList.contains('pronta'))setTimeout(f,250);else g.addEventListener('ready',()=>setTimeout(f,250),{once:true});}
    }
  };
}
document.addEventListener('ready',e=>{if(e.target&&e.target.tagName==='GATINHA-FANTOCHE')e.target.classList.add('pronta');},true);
/* a cartinha entra junto com a tela Hoje */
if(typeof renderHoje==='function'){const _renderHojeCartinha=renderHoje;renderHoje=function(){const r=_renderHojeCartinha.apply(this,arguments);try{renderCartinha();}catch(e){console.warn('cartinha',e);}return r;};}
