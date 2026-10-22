/* ============ ESTILO DE AUTOCUIDADO (teste) ============ */
const ESTILO_CATS={
  A:{id:'palavras',nome:'Palavras de afirmação',emoji:'💬',blurb:'Reconhecimento, incentivo e gentileza consigo.'},
  B:{id:'tempo',nome:'Tempo de qualidade',emoji:'⏳',blurb:'Atenção, presença e tempo dedicado a si.'},
  C:{id:'presentes',nome:'Presentes',emoji:'🎁',blurb:'Pequenos agrados, símbolos e experiências prazerosas.'},
  D:{id:'servico',nome:'Atos de serviço',emoji:'🛠️',blurb:'Ações práticas que facilitam a própria vida.'},
  E:{id:'toque',nome:'Toque físico',emoji:'🤍',blurb:'Conforto corporal, movimento e experiências sensoriais.'}
};
const ESTILO_TEXTOS={
  palavras:'Para você, cuidar de si passa muito por reconhecimento e linguagem gentil. Nomear o esforço, reformular a autocrítica e guardar palavras boas para si mesma tendem a ter mais peso do que gestos só práticos.',
  tempo:'Para você, cuidar de si passa muito por presença e tempo protegido. Pausas de verdade, atenção em uma coisa só e espaço para o que importa costumam restaurar mais do que listas longas.',
  presentes:'Para você, cuidar de si passa muito por pequenos agrados e símbolos. Um detalhe gostoso, um objeto especial ou um prazer simples no dia comum costumam marcar mais do que discursos longos.',
  servico:'Para você, cuidar de si passa muito por facilitar a própria vida. Reduzir atrito, adiantar o mínimo e organizar o que pesa costumam ser formas concretas de se tratar bem.',
  toque:'Para você, cuidar de si passa muito pelo corpo e pelas sensações. Conforto, movimento suave e atenção ao que o corpo pede costumam ser caminhos diretos de cuidado.'
};
const ESTILO_PRATICAS={
  palavras:[
    {emoji:'✍️',nome:'Escrever uma frase gentil sobre si',unidade:'1×/dia',grupo:'mente',dims:['autopercepcao','regulacao'],texto:'Um minuto para falar consigo com carinho.'},
    {emoji:'📝',nome:'Registrar uma pequena conquista do dia',unidade:'1×/dia',grupo:'mente',dims:['autopercepcao','direcao'],texto:'Nomear o que você fez já é cuidado.'},
    {emoji:'🎙️',nome:'Gravar um áudio curto de incentivo para ouvir depois',unidade:'quando precisar',grupo:'mente',dims:['autopercepcao','regulacao'],texto:'Sua própria voz como apoio.'},
    {emoji:'🪞',nome:'Reformular uma autocrítica em uma frase mais justa',unidade:'quando surgir',grupo:'mente',dims:['autopercepcao','ansiedade'],texto:'Trocar a cobrança por uma frase mais justa.'},
    {emoji:'💭',nome:'Completar a frase: hoje eu reconheço que…',unidade:'1×/dia',grupo:'mente',dims:['autopercepcao','prazer'],texto:'Uma frase curta de reconhecimento no fim do dia.'}
  ],
  tempo:[
    {emoji:'📵',nome:'Ficar cinco minutos sem celular',unidade:'5 min/dia',grupo:'mente',dims:['regulacao','ansiedade'],texto:'Cinco minutos só seus, sem tela.'},
    {emoji:'🎵',nome:'Ouvir uma música sem fazer outra coisa',unidade:'1 música/dia',grupo:'rituais',dims:['prazer','regulacao'],texto:'Uma música com atenção plena.'},
    {emoji:'🎨',nome:'Reservar um bloco curto para um hobby',unidade:'15 min, 3×/semana',grupo:'rituais',dims:['prazer','direcao'],texto:'Um pedaço de tempo para o que você gosta.'},
    {emoji:'☕',nome:'Fazer uma pausa com chá ou café',unidade:'1×/dia',grupo:'rituais',dims:['prazer','regulacao'],texto:'Beber com calma, sem multitarefa.'},
    {emoji:'🚶',nome:'Caminhar devagar, só pra estar comigo',unidade:'10 min, quando der',grupo:'corpo',dims:['energia','ansiedade','regulacao'],texto:'Andar devagar, só para respirar e estar consigo.'}
  ],
  presentes:[
    {emoji:'✨',nome:'Usar algo especial que costuma guardar',unidade:'1×/dia',grupo:'rituais',dims:['prazer','autopercepcao'],texto:'Tirar do “depois” e usar hoje.'},
    {emoji:'🍵',nome:'Preparar a bebida favorita com calma',unidade:'1×/dia',grupo:'rituais',dims:['prazer','corpo'],texto:'Um agrado simples no meio do dia.'},
    {emoji:'🎧',nome:'Montar uma playlist só sua',unidade:'1×/semana',grupo:'rituais',dims:['prazer','autopercepcao'],texto:'Uma trilha que é só sua.'},
    {emoji:'🎀',nome:'Criar um mimo com o que já tem em casa',unidade:'quando quiser',grupo:'rituais',dims:['prazer','autopercepcao'],texto:'Presente sem precisar comprar nada.'},
    {emoji:'🌸',nome:'Escolher um detalhe bonito para o dia',unidade:'1×/dia',grupo:'rituais',dims:['prazer','autopercepcao'],texto:'Perfume, caneca, luz: um detalhe seu.'}
  ],
  servico:[
    {emoji:'🌅',nome:'Preparar o mínimo para a manhã seguinte',unidade:'à noite',grupo:'lar',dims:['sobrecarga','direcao'],texto:'Deixar o essencial pronto reduz o atrito de amanhã.'},
    {emoji:'⏱️',nome:'Resolver uma pendência de cinco minutos',unidade:'1×/dia',grupo:'essencial',dims:['sobrecarga','ansiedade'],texto:'Uma coisa minúscula fora da cabeça.'},
    {emoji:'🍱',nome:'Deixar uma refeição simples encaminhada',unidade:'2×/semana',grupo:'lar',dims:['corpo','sobrecarga'],texto:'Comida encaminhada é cuidado prático.'},
    {emoji:'🪴',nome:'Organizar um canto que reduz sobrecarga',unidade:'10 min, 3×/semana',grupo:'lar',dims:['sobrecarga','regulacao'],texto:'Um cantinho mais leve já muda o dia.'},
    {emoji:'📋',nome:'Anotar só três prioridades e largar o resto da lista',unidade:'1×/dia',grupo:'essencial',dims:['sobrecarga','direcao'],texto:'Três itens. O resto espera.'}
  ],
  toque:[
    {emoji:'🧴',nome:'Passar creme nas mãos com atenção',unidade:'1×/dia',grupo:'rituais',dims:['corpo','prazer'],texto:'Cuidado sensorial em poucos segundos.'},
    {emoji:'🧘',nome:'Fazer alongamentos suaves por poucos minutos',unidade:'5 min/dia',grupo:'corpo',dims:['corpo','energia'],texto:'Movimento leve, sem cobrança.'},
    {emoji:'💃',nome:'Dançar uma música de que gosta',unidade:'1 música, quando der',grupo:'corpo',dims:['prazer','energia','corpo'],texto:'Mexer o corpo por prazer.'},
    {emoji:'🛁',nome:'Tomar um banho relaxante ou me aconchegar numa manta',unidade:'quando precisar',grupo:'rituais',dims:['corpo','regulacao'],texto:'Conforto físico de verdade.'},
    {emoji:'🌬️',nome:'Respirar soltando ombros e mandíbula',unidade:'3 min, 3×/semana',grupo:'mente',dims:['regulacao','ansiedade','corpo'],texto:'Soltar a tensão que o corpo segura.'}
  ]
};
function estiloPraticaParaItem(pr,catId){
  return{
    id:'estilo_'+catId+'_'+pr.nome.replace(/\s+/g,'_').slice(0,40),
    emoji:pr.emoji||'🌱',
    emojis:[pr.emoji||'🌱','✨','💛'],
    nome:pr.nome,
    unidade:pr.unidade||'no seu ritmo',
    paraQue:'Do meu estilo de autocuidado',
    texto:pr.texto||pr.nome,
    grupo:catId||pr.grupo||'outros',
    dims:(pr.dims||[]).slice()
  };
}
function estiloAdicionarPratica(catId,nome){
  const lista=ESTILO_PRATICAS[catId]||[];
  const pr=lista.find(p=>p.nome===nome);
  if(!pr){avisar('Não encontrei essa prática.');return;}
  if(S.habitos.some(h=>h.nome===pr.nome)){avisar('Você já tem esse hábito. 💛');return;}
  if(S.habitos.some(h=>!h.pausado)&&!habitoLiberado()){
    const dias=diasAteLiberar();
    avisar('Sem pressa. Próximo hábito libera em '+dias+' dia'+(dias===1?'':'s')+'.');
    return;
  }
  const item=estiloPraticaParaItem(pr,catId);
  fecharOverlay($('estiloResultadoModal'),()=>abrirModalFila(item));
}
/* 30 perguntas: cada alternativa tem cat (A-E). Ordem das alternativas é embaralhada na UI. */
const ESTILO_PERGUNTAS=[
  {q:'Você chega ao fim de um dia cansativo. O que faria você se sentir mais cuidada?',ops:[
    {cat:'A',t:'Escrever para si mesma algo que gostaria de ouvir de alguém querido.'},
    {cat:'B',t:'Separar um tempo só seu, sem pressa e sem celular.'},
    {cat:'C',t:'Preparar um pequeno agrado: uma bebida especial ou algo que você aprecia.'},
    {cat:'D',t:'Tirar da frente uma pendência mínima que está ocupando a cabeça.'},
    {cat:'E',t:'Tomar um banho confortável, passar creme ou se aconchegar.'}
  ]},
  {q:'Você sente que fez muita coisa e ninguém notou, nem você. O que gostaria de fazer?',ops:[
    {cat:'A',t:'Registrar três coisas que você conseguiu, mesmo as pequenas.'},
    {cat:'B',t:'Parar por alguns minutos e ficar presente consigo, sem tarefa.'},
    {cat:'C',t:'Escolher uma pequena recompensa que caiba no seu bolso e no seu dia.'},
    {cat:'D',t:'Facilitar algo do dia seguinte para a carga pesar menos.'},
    {cat:'E',t:'Alongar o corpo ou buscar uma sensação física agradável.'}
  ]},
  {q:'Você passou o dia cuidando de outras pessoas. O que seria mais restaurador para você?',ops:[
    {cat:'A',t:'Lembrar a si mesma, com palavras claras, que também merece cuidado.'},
    {cat:'B',t:'Ter um momento só seu, sem precisar atender ninguém.'},
    {cat:'C',t:'Preparar um mimo que torne o restante do dia mais agradável.'},
    {cat:'D',t:'Fazer uma coisa concreta que deixe sua rotina um pouco mais leve.'},
    {cat:'E',t:'Dar ao corpo um momento de conforto e relaxamento.'}
  ]},
  {q:'Você comete um erro e começa a se criticar. O que mais ajudaria de verdade?',ops:[
    {cat:'A',t:'Falar consigo com a mesma gentileza que teria com uma amiga.'},
    {cat:'B',t:'Fazer uma pausa só para compreender o que aconteceu, sem se apressar.'},
    {cat:'C',t:'Criar um pequeno ritual de conforto para atravessar a frustração.'},
    {cat:'D',t:'Separar o que dá para ajustar agora do que pode esperar.'},
    {cat:'E',t:'Respirar fundo, relaxar os ombros e soltar a tensão do corpo.'}
  ]},
  {q:'Você finalmente tem meia hora livre. Qual opção parece mais atraente?',ops:[
    {cat:'A',t:'Escrever uma mensagem de incentivo para si.'},
    {cat:'B',t:'Ler, ouvir música ou tomar chá com atenção, sem multitarefa.'},
    {cat:'C',t:'Usar algo especial que você costuma guardar para depois.'},
    {cat:'D',t:'Organizar uma coisa que vai facilitar os próximos dias.'},
    {cat:'E',t:'Dançar, alongar-se ou aproveitar uma sensação física boa.'}
  ]},
  {q:'Qual destas pequenas conquistas mais teria significado para você?',ops:[
    {cat:'A',t:'Reconhecer, com palavras, algo em que você melhorou.'},
    {cat:'B',t:'Conseguir proteger tempo para uma atividade importante para você.'},
    {cat:'C',t:'Desfrutar de algo bonito ou prazeroso que você escolheu para si.'},
    {cat:'D',t:'Ver a rotina um pouco mais fácil por causa de um ajuste que você fez.'},
    {cat:'E',t:'Sentir-se mais confortável e à vontade no próprio corpo.'}
  ]},
  {q:'Se você quisesse um ritual para começar o dia, qual escolheria?',ops:[
    {cat:'A',t:'Ler uma frase que ajude a definir uma intenção gentil para o dia.'},
    {cat:'B',t:'Tomar sua bebida favorita sem olhar para o celular.'},
    {cat:'C',t:'Usar uma caneca, roupa ou perfume que lhe dê prazer.'},
    {cat:'D',t:'Deixar o essencial preparado na noite anterior.'},
    {cat:'E',t:'Fazer alguns movimentos suaves só para despertar o corpo.'}
  ]},
  {q:'Você quer marcar o fim de uma semana difícil. Como faria isso de um jeito que importa para você?',ops:[
    {cat:'A',t:'Escrever um pequeno balanço reconhecendo o que você enfrentou.'},
    {cat:'B',t:'Reservar um período para um hobby de que sente falta.'},
    {cat:'C',t:'Preparar um agrado especial só para celebrar que chegou até aqui.'},
    {cat:'D',t:'Resolver uma coisa que deixe o início da próxima semana mais tranquilo.'},
    {cat:'E',t:'Preparar um banho relaxante ou fazer algo prazeroso com o corpo.'}
  ]},
  {q:'Qual tipo de lembrete seria mais útil no meio de um dia corrido?',ops:[
    {cat:'A',t:'“Você não precisa fazer tudo perfeitamente.”'},
    {cat:'B',t:'“Pare por cinco minutos e volte para si.”'},
    {cat:'C',t:'“Você também pode incluir algo prazeroso no seu dia.”'},
    {cat:'D',t:'“Uma coisa de cada vez. Dá para simplificar.”'},
    {cat:'E',t:'“Solte os ombros, respire e perceba como o corpo está.”'}
  ]},
  {q:'Quando você imagina uma rotina que gostaria de manter, o que mais importa?',ops:[
    {cat:'A',t:'Sentir que reconhece seus esforços pelo caminho.'},
    {cat:'B',t:'Ter espaço real para o que lhe dá sentido.'},
    {cat:'C',t:'Incluir pequenos prazeres que tornem os dias mais gostosos.'},
    {cat:'D',t:'Sentir que a vida está mais administrável e com menos atrito.'},
    {cat:'E',t:'Sentir-se fisicamente bem e confortável.'}
  ]},
  {q:'Você está sem disposição para começar. Qual primeiro passo parece mais convidativo?',ops:[
    {cat:'A',t:'Dizer a si mesma que começar pequeno já conta.'},
    {cat:'B',t:'Dedicar só cinco minutos a algo de que você gosta.'},
    {cat:'C',t:'Escolher uma pequena coisa agradável para tornar o começo menos pesado.'},
    {cat:'D',t:'Fazer uma tarefa mínima que reduza uma preocupação imediata.'},
    {cat:'E',t:'Levantar, espreguiçar-se ou buscar conforto físico simples.'}
  ]},
  {q:'Você está triste e não sabe bem o porquê. O que tentaria primeiro?',ops:[
    {cat:'A',t:'Escrever o que está sentindo, sem se julgar.'},
    {cat:'B',t:'Ficar um pouco em silêncio, com música ou só observando o ambiente.'},
    {cat:'C',t:'Criar um pequeno momento de aconchego com algo de que gosta.'},
    {cat:'D',t:'Verificar se alguma necessidade prática ficou de lado.'},
    {cat:'E',t:'Perceber a respiração, tomar um banho ou relaxar o corpo.'}
  ]},
  {q:'Você se sente distante de si mesma. O que poderia ajudar a se reconectar?',ops:[
    {cat:'A',t:'Escrever sobre quem você é além das obrigações.'},
    {cat:'B',t:'Retomar uma atividade que você fazia só por gosto.'},
    {cat:'C',t:'Escolher um objeto, aroma ou detalhe com significado pessoal.'},
    {cat:'D',t:'Ajustar um canto da casa para ele refletir melhor o que você precisa agora.'},
    {cat:'E',t:'Dançar, caminhar devagar ou prestar atenção às sensações do corpo.'}
  ]},
  {q:'Você está adiando o descanso porque ainda há coisas a fazer. Qual jeito de cuidar combina mais com você?',ops:[
    {cat:'A',t:'Lembrar a si mesma que descansar não precisa ser prêmio por produtividade.'},
    {cat:'B',t:'Agendar um intervalo de verdade, como faria com um compromisso.'},
    {cat:'C',t:'Preparar algo agradável para acompanhar o descanso.'},
    {cat:'D',t:'Escolher o que pode esperar para liberar um pouco de tempo agora.'},
    {cat:'E',t:'Deitar com conforto, relaxar os músculos e deixar o corpo descansar.'}
  ]},
  {q:'Como você gostaria de reconhecer um dia difícil, mesmo sem ter concluído tudo?',ops:[
    {cat:'A',t:'Validar, com palavras, o esforço que fez nas circunstâncias que tinha.'},
    {cat:'B',t:'Dar a si mesma um tempo sem cobrança.'},
    {cat:'C',t:'Oferecer-se um pequeno prazer sem precisar “merecer”.'},
    {cat:'D',t:'Preparar o mínimo para o dia seguinte pesar menos.'},
    {cat:'E',t:'Cuidar das necessidades físicas que ficaram para depois.'}
  ]},
  {q:'Você quer beber mais água. O que tornaria isso mais significativo para você?',ops:[
    {cat:'A',t:'Anotar as vezes em que cuidou disso e reconhecer a constância.'},
    {cat:'B',t:'Transformar a pausa da água em um momento só seu, mesmo que curto.'},
    {cat:'C',t:'Usar um copo ou uma garrafa de que você gosta de verdade.'},
    {cat:'D',t:'Deixar a água no caminho em que você já passa.'},
    {cat:'E',t:'Perceber como o corpo responde quando está mais hidratado.'}
  ]},
  {q:'Você quer voltar a ler por prazer. Qual abordagem mais atrai?',ops:[
    {cat:'A',t:'Registrar o que sentiu ou pensou com a leitura.'},
    {cat:'B',t:'Reservar um horário protegido, sem interrupções.'},
    {cat:'C',t:'Escolher um livro que agrada aos olhos ou preparar um cantinho gostoso.'},
    {cat:'D',t:'Deixar o livro à vista e fácil de pegar.'},
    {cat:'E',t:'Associar a leitura a uma posição confortável, uma manta ou uma bebida.'}
  ]},
  {q:'Você quer se movimentar mais. Qual incentivo parece mais seu?',ops:[
    {cat:'A',t:'Reconhecer cada vez que honrou o combinado consigo.'},
    {cat:'B',t:'Escolher uma atividade em que você possa aproveitar o momento.'},
    {cat:'C',t:'Preparar uma roupa ou um detalhe que dê vontade de começar.'},
    {cat:'D',t:'Deixar horário, percurso ou materiais já encaminhados.'},
    {cat:'E',t:'Escolher movimentos que tragam prazer e bem-estar ao corpo.'}
  ]},
  {q:'Você quer cuidar da alimentação sem transformar isso em mais uma lista. O que ajudaria?',ops:[
    {cat:'A',t:'Valorizar as escolhas possíveis que você fez, sem exigir perfeição.'},
    {cat:'B',t:'Fazer pelo menos uma refeição com calma e atenção.'},
    {cat:'C',t:'Preparar ou escolher um alimento que dê prazer de verdade.'},
    {cat:'D',t:'Facilitar as refeições com um preparo simples ou um plano mínimo.'},
    {cat:'E',t:'Prestar atenção aos sinais de fome, saciedade e conforto do corpo.'}
  ]},
  {q:'Você quer cuidar do ambiente de casa. Qual jeito combina mais com você?',ops:[
    {cat:'A',t:'Reconhecer o progresso, mesmo quando o resultado não está perfeito.'},
    {cat:'B',t:'Reservar um período tranquilo para isso, sem pressa.'},
    {cat:'C',t:'Acrescentar um detalhe que deixe o espaço mais agradável para você.'},
    {cat:'D',t:'Criar um sistema simples para as coisas funcionarem no dia a dia.'},
    {cat:'E',t:'Fazer pausas e respeitar o que o corpo aguenta enquanto arruma.'}
  ]},
  {q:'Quando você conclui algo que vinha empurrando, o que mais tem significado?',ops:[
    {cat:'A',t:'Perceber que foi capaz e nomear o próprio esforço.'},
    {cat:'B',t:'Recuperar tempo e atenção para o que importa de verdade.'},
    {cat:'C',t:'Celebrar com algo prazeroso, mesmo que pequeno.'},
    {cat:'D',t:'Ver a rotina mais simples com aquilo resolvido.'},
    {cat:'E',t:'Sentir o corpo mais leve depois de tirar aquilo da frente.'}
  ]},
  {q:'Você quer se presentear sem gastar muito. O que mais agrada?',ops:[
    {cat:'A',t:'Escrever uma carta para si reconhecendo o próprio caminho.'},
    {cat:'B',t:'Fazer algo de que gosta, com atenção só nisso.'},
    {cat:'C',t:'Montar um pequeno presente com o que já tem ou pode preparar.'},
    {cat:'D',t:'Fazer por si uma coisa prática que vinha precisando.'},
    {cat:'E',t:'Preparar um momento de conforto sensorial: banho, massagem nas mãos, manta.'}
  ]},
  {q:'Você está aprendendo algo novo e a evolução parece lenta. O que a manteria no caminho?',ops:[
    {cat:'A',t:'Registrar o progresso e lembrar que aprender leva tempo.'},
    {cat:'B',t:'Continuar porque aprecia o processo, não só o resultado.'},
    {cat:'C',t:'Escolher materiais ou detalhes que tornem a prática mais gostosa.'},
    {cat:'D',t:'Dividir o aprendizado em etapas pequenas e claras.'},
    {cat:'E',t:'Fazer pausas e respeitar o ritmo que o corpo pede.'}
  ]},
  {q:'Você tem dificuldade de perceber o que precisa. Qual pergunta parece mais útil?',ops:[
    {cat:'A',t:'“Hoje, eu gostaria de ouvir que…”'},
    {cat:'B',t:'“Se eu tivesse 15 minutos só meus, como gostaria de usá-los?”'},
    {cat:'C',t:'“Que pequeno prazer faria diferença no meu dia?”'},
    {cat:'D',t:'“Que coisa prática está me sobrecarregando e pode ser simplificada?”'},
    {cat:'E',t:'“O que meu corpo está pedindo neste momento?”'}
  ]},
  {q:'Qual frase mais combina com o jeito que você gostaria de cuidar de si?',ops:[
    {cat:'A',t:'“Quero aprender a falar comigo com mais gentileza.”'},
    {cat:'B',t:'“Quero reservar espaço na minha vida para mim.”'},
    {cat:'C',t:'“Quero permitir que os pequenos prazeres façam parte da rotina.”'},
    {cat:'D',t:'“Quero facilitar minha vida em vez de dificultá-la.”'},
    {cat:'E',t:'“Quero tratar meu corpo com atenção e respeito.”'}
  ]},
  {q:'Você só tem cinco minutos. O que escolheria espontaneamente?',ops:[
    {cat:'A',t:'Anotar algo de que se orgulha ou uma frase de incentivo.'},
    {cat:'B',t:'Ouvir uma música de que gosta, sem fazer outra coisa.'},
    {cat:'C',t:'Preparar uma bebida ou desfrutar de um pequeno agrado.'},
    {cat:'D',t:'Resolver uma pendência minúscula que está ocupando a mente.'},
    {cat:'E',t:'Alongar-se, passar creme nas mãos ou respirar com calma.'}
  ]},
  {q:'Você quer um ritual noturno. O que tornaria esse momento especial?',ops:[
    {cat:'A',t:'Escrever uma coisa pela qual reconhece a si mesma naquele dia.'},
    {cat:'B',t:'Ter alguns minutos de tranquilidade antes de dormir.'},
    {cat:'C',t:'Preparar o quarto com um detalhe agradável: aroma, luz suave, travesseiro certo.'},
    {cat:'D',t:'Deixar algumas coisas prontas para a manhã seguinte.'},
    {cat:'E',t:'Fazer alongamentos leves ou cuidar da pele com calma.'}
  ]},
  {q:'Você percebe que está sendo muito exigente consigo. Como gostaria de responder?',ops:[
    {cat:'A',t:'Questionar a autocrítica e buscar uma perspectiva mais justa.'},
    {cat:'B',t:'Dar um passo atrás e dedicar tempo a algo que lhe faça bem.'},
    {cat:'C',t:'Permitir-se um prazer sem transformar tudo em merecimento.'},
    {cat:'D',t:'Revisar exigências e reduzir o que não é essencial agora.'},
    {cat:'E',t:'Fazer uma pausa para perceber tensão, cansaço ou desconforto no corpo.'}
  ]},
  {q:'Se o app pudesse sugerir uma pequena ação personalizada por dia, o que você gostaria de receber?',ops:[
    {cat:'A',t:'Uma proposta de reflexão ou uma frase para completar.'},
    {cat:'B',t:'Um convite para dedicar alguns minutos só a si.'},
    {cat:'C',t:'Uma ideia de pequeno prazer que caiba na sua realidade.'},
    {cat:'D',t:'Uma tarefa simples que facilite a rotina.'},
    {cat:'E',t:'Uma prática breve de conforto ou consciência corporal.'}
  ]},
  {q:'Você manteve um hábito por um mês. O que faria você sentir que valeu a pena?',ops:[
    {cat:'A',t:'Ter aprendido a reconhecer seu valor e seu esforço.'},
    {cat:'B',t:'Ter protegido tempo para o que lhe faz bem.'},
    {cat:'C',t:'Ter incluído mais prazer e beleza nos dias comuns.'},
    {cat:'D',t:'Ter reduzido atritos e tornado a vida mais fácil.'},
    {cat:'E',t:'Ter desenvolvido mais atenção e cuidado com as sensações do corpo.'}
  ]}
];

let estiloPagina=0;
let estiloRespostas=[]; // letter cat A-E per question
let estiloOrdem=[]; // shuffled indices of ops per question

function estiloShuffle(arr,seed){
  const a=arr.slice();
  let h=seed||1;
  for(let i=a.length-1;i>0;i--){
    h=(h*31+i*17)%100003;
    const j=h%(i+1);
    const t=a[i];a[i]=a[j];a[j]=t;
  }
  return a;
}
function estiloIniciar(refazer){
  estiloPagina=0;
  estiloRespostas=new Array(ESTILO_PERGUNTAS.length).fill(null);
  estiloOrdem=ESTILO_PERGUNTAS.map((p,i)=>estiloShuffle([0,1,2,3,4],(i+1)*97+13));
  const o=$('estiloTesteOverlay');
  abrirOverlay(o);
  estiloRenderPagina();
}
function estiloFecharTeste(){
  const o=$('estiloTesteOverlay');
  o.classList.remove('ativo');
  setTimeout(()=>{o.hidden=true;document.body.style.overflow='';},320);
}
function estiloRenderPagina(){
  const total=ESTILO_PERGUNTAS.length;
  const p=ESTILO_PERGUNTAS[estiloPagina];
  $('estiloTesteSub').textContent='Pergunta '+(estiloPagina+1)+' de '+total;
  // dots: groups of 6
  const bloco=Math.floor(estiloPagina/6);
  $('estiloTesteDots').innerHTML=Array.from({length:Math.ceil(total/6)},(_,i)=>`<span class="mw-dot ${i===bloco?'on':''} ${i<bloco?'done':''}"></span>`).join('');
  const ordem=estiloOrdem[estiloPagina];
  const escolhido=estiloRespostas[estiloPagina];
  let html=`<p style="font-size:15px;font-weight:700;line-height:1.45;margin-bottom:14px;color:var(--txt)">${esc(p.q)}</p>`;
  html+='<div style="display:flex;flex-direction:column;gap:8px">';
  ordem.forEach(oi=>{
    const op=p.ops[oi];
    const on=escolhido===op.cat?'on':'';
    html+=`<button type="button" class="btn btn-full ${on?'prim':''}" data-estilo-cat="${op.cat}" style="text-align:left;line-height:1.4;padding:12px 14px;font-weight:600">${esc(op.t)}</button>`;
  });
  html+='</div>';
  $('estiloTesteBody').innerHTML=html;
  $('estiloTesteBody').querySelectorAll('[data-estilo-cat]').forEach(b=>{
    b.onclick=()=>{
      estiloRespostas[estiloPagina]=b.dataset.estiloCat;
      estiloRenderPagina();
    };
  });
  const btnV=$('estiloTesteVoltar');const btnS=$('estiloTesteSeguir');
  btnV.style.visibility=estiloPagina===0?'hidden':'visible';
  btnV.onclick=()=>{if(estiloPagina>0){estiloPagina--;estiloRenderPagina();$('estiloTesteBody').scrollTop=0;}};
  const ultima=estiloPagina===total-1;
  btnS.textContent=ultima?'Ver meu mapa':'Seguir →';
  btnS.onclick=()=>{
    if(!estiloRespostas[estiloPagina]){mostrarToast('Escolha uma opção para seguir');return;}
    if(ultima){estiloFinalizar();return;}
    estiloPagina++;estiloRenderPagina();$('estiloTesteBody').scrollTop=0;
  };
}
let _estiloPratGanhou=0;
function estiloFinalizar(){
  const scores={A:0,B:0,C:0,D:0,E:0};
  estiloRespostas.forEach(c=>{if(c&&scores[c]!==undefined)scores[c]++;});
  const ranked=Object.keys(scores).sort((a,b)=>scores[b]-scores[a]||a.localeCompare(b));
  const principal=ESTILO_CATS[ranked[0]].id;
  const secundaria=ESTILO_CATS[ranked[1]].id;
  const diversificado=(scores[ranked[0]]-scores[ranked[2]])<=2;
  S.estiloAutocuidado={
    feito:true,
    data:hoje(),
    scores:{
      palavras:scores.A,tempo:scores.B,presentes:scores.C,servico:scores.D,toque:scores.E
    },
    principal,secundaria,diversificado
  };
  salva();
  _estiloPratGanhou=praticasExpandirPorEstilo(principal,secundaria);
  estiloFecharTeste();
  setTimeout(()=>estiloMostrarResultado(),400);
}
function estiloMostrarResultado(){
  try{if(!$('configModal').hidden)renderConfig();}catch(e){}
  const e=S.estiloAutocuidado;if(!e||!e.feito){estiloIniciar();return;}
  const ordem=Object.entries(e.scores).sort((a,b)=>b[1]-a[1]);
  let html=`<div style="text-align:center;margin-bottom:12px"><div style="font-size:40px;margin-bottom:6px">🪞</div>
    <div style="font-size:18px;font-weight:900;color:var(--txt)">Seu mapa de autocuidado</div>
    <p class="mut" style="font-size:12.5px;line-height:1.5;margin-top:6px">Isto mostra quais formas de cuidado pareceram mais significativas nas situações do teste. Não é diagnóstico nem medida de quanto você se cuida.</p></div>`;
  html+=`<div style="margin-bottom:14px">`;
  ordem.forEach(([id,n],i)=>{
    const meta=Object.values(ESTILO_CATS).find(c=>c.id===id);
    const pct=Math.round((n/30)*100);
    const destaque=i===0?'font-weight:900;color:var(--b)':i===1?'font-weight:800;color:var(--r)':'';
    html+=`<div style="margin-bottom:8px"><div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:3px"><span style="${destaque}">${meta.emoji} ${esc(meta.nome)}</span><span style="font-weight:800">${n}/30</span></div>
      <div style="height:8px;background:var(--surf-soft);border-radius:4px;overflow:hidden"><div style="height:100%;width:${pct}%;background:linear-gradient(90deg,var(--b),var(--r));border-radius:4px"></div></div></div>`;
  });
  html+=`</div>`;
  if(e.diversificado){
    html+=`<div class="aviso" style="margin-bottom:12px">Seu mapa não aponta uma única forma dominante. O app pode variar as sugestões em vez de insistir em um só estilo.</div>`;
  }
  const pMeta=Object.values(ESTILO_CATS).find(c=>c.id===e.principal);
  const sMeta=Object.values(ESTILO_CATS).find(c=>c.id===e.secundaria);
  html+=`<div class="card2" style="margin-bottom:10px"><div class="mut" style="font-size:10.5px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;color:var(--b);margin-bottom:6px">Preferência principal</div>
    <div style="font-weight:800;font-size:15px;margin-bottom:6px">${pMeta.emoji} ${esc(pMeta.nome)}</div>
    <p style="font-size:13.5px;line-height:1.55;margin:0">${esc(ESTILO_TEXTOS[e.principal])}</p></div>`;
  html+=`<div class="card2" style="margin-bottom:12px"><div class="mut" style="font-size:10.5px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;color:var(--r);margin-bottom:6px">Preferência secundária</div>
    <div style="font-weight:800;font-size:14px;margin-bottom:4px">${sMeta.emoji} ${esc(sMeta.nome)}</div>
    <p class="mut" style="font-size:12.5px;line-height:1.5;margin:0">Também entra com força nas sugestões, para o cuidado não ficar em uma faixa só.</p></div>`;
  if(_estiloPratGanhou>0){
    html+=`<div class="aviso" style="margin-bottom:12px">✨ Seu check-in ganhou <b>${_estiloPratGanhou} prática${_estiloPratGanhou===1?'':'s'}</b> de ${esc(pMeta.nome)} e ${esc(sMeta.nome)}. Elas já aparecem primeiro na lista.</div>`;
    _estiloPratGanhou=0;
  }
  // práticas prioritárias — clicáveis para virar hábito
  html+=`<div class="mut" style="font-size:11px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;margin-bottom:6px">Práticas que combinam com você</div>`;
  html+=`<p class="mut" style="font-size:12px;line-height:1.45;margin:0 0 10px">Toque em uma pra virar <b>hábito</b>: algo pra construir com uma meta.${S.praticasModo==='generica'?' As práticas do seu check-in já foram atualizadas.':''}</p>`;
  const ids=[e.principal,e.secundaria];
  ordem.forEach(([id])=>{if(!ids.includes(id))ids.push(id);});
  ids.slice(0,3).forEach(id=>{
    const meta=Object.values(ESTILO_CATS).find(c=>c.id===id);
    const lista=ESTILO_PRATICAS[id]||[];
    html+=`<div style="margin-bottom:12px"><div style="font-weight:800;font-size:13px;margin-bottom:6px">${meta.emoji} ${esc(meta.nome)}</div>`;
    lista.forEach(pr=>{
      const jaTem=S.habitos.some(h=>h.nome===pr.nome);
      html+=`<div class="cat-sugestao ${jaTem?'ja-tem':''}" data-estilo-cat="${esc(id)}" data-estilo-prat="${esc(pr.nome)}" style="margin-bottom:6px;cursor:pointer">
        <div class="txt"><b>${pr.emoji} ${esc(pr.nome)}</b>${pr.unidade?`<br><span class="mut">${esc(pr.unidade)}</span>`:''}</div>
        <div class="add">${jaTem?'✓':'+'}</div>
      </div>`;
    });
    html+=`</div>`;
  });
  html+=praticaPropriaHTML('er');
  $('estiloResultadoCorpo').innerHTML=html;
  ligarPraticaPropria('er',adicionarPraticaPropria);
  $('estiloResultadoCorpo').querySelectorAll('[data-estilo-prat]').forEach(el=>{
    el.onclick=()=>{
      if(el.classList.contains('ja-tem')){mostrarToast('Você já tem esse hábito 💛');return;}
      estiloAdicionarPratica(el.dataset.estiloCat, el.dataset.estiloPrat);
    };
  });
  const o=$('estiloResultadoModal');
  abrirOverlay(o);
}
function estiloConvidarSePreciso(){
  if(S.estiloAutocuidado&&S.estiloAutocuidado.feito)return;
  if(S.estiloConviteVisto)return;
  S.estiloConviteVisto=true;salva();
  setTimeout(()=>{
    const o=$('estiloConviteModal');
    if(!o)return;
    abrirOverlay(o);
  },1400);
}
$('estiloConviteSim')&&($('estiloConviteSim').onclick=()=>{
  fecharOverlay($('estiloConviteModal'),()=>estiloIniciar());
});
$('estiloConviteNao')&&($('estiloConviteNao').onclick=()=>{
  fecharOverlay($('estiloConviteModal'));
});
$('estiloTesteFechar')&&($('estiloTesteFechar').onclick=()=>{
  confirmar('Sair do teste? Suas respostas desta vez não serão salvas.',()=>estiloFecharTeste(),'Sair');
});
$('estiloResultadoCardapio').onclick=()=>fecharOverlay($('estiloResultadoModal'),abrirCardapio);
$('estiloResultadoFechar')&&($('estiloResultadoFechar').onclick=()=>fecharOverlay($('estiloResultadoModal')));
$('estiloResultadoHabitos')&&($('estiloResultadoHabitos').onclick=()=>{
  fecharOverlay($('estiloResultadoModal'),()=>{
    renderHabitos();
    abrirOverlay($('gerenciarModal'));
  });
});


