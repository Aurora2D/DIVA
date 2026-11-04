/* ============ CARTINHAS DA DIVA (31 dias) ============
   Uma cartinha por dia na tela Hoje, nos primeiros 31 dias de app. Um banco só, pra todos os hábitos.
   Cada cartinha é uma leitura curta: título, alguns parágrafos, uma frase final e, só quando existe pesquisa
   de verdade, uma linha de ciência com o link do estudo (DOI).
   Ordem: dias 1 a 20 = cartinhas 1 a 20; dia 21 = cartinha 31 (fechamento de ciclo, junto com o Mapa Emocional);
   dias 22 a 31 = cartinhas 21 a 30. A ordem fica em CARTINHAS_ORDEM.
   Pose da gatinha por tema (CARTINHAS_POSE). As poses 'menor-passo', 'deixar-sair', 'clareza' e 'abertura' ainda
   não existem no repositório Mascote: até lá, a gatinha cai na sentada sozinha. Quando a pose ficar pronta, não
   precisa mexer aqui.
   Regras dos textos: nunca cobrar (sempre convite); falar de energia, nunca de preguiça ou de "deixar pra depois";
   não colocar frase positiva ou declaração contra a ciência; nada místico; sem travessão; nenhuma cartinha
   promete hábito formado em 21 dias.
   Pra mudar os textos, mexa só em CARTINHAS.
   Embaixo da cartinha aparece o que falta pra próxima aba abrir (abaPista, em abas.js). */
const CARTINHAS_TOTAL=31;
const CARTINHAS_ORDEM=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,31,21,22,23,24,25,26,27,28,29,30];
const CARTINHAS_POSE={'Começos':'menor-passo','Autocompaixão':'deixar-sair','Autoconhecimento':'clareza','Desejos':'abertura','Hábitos':'sentada','Relações':'sentada','Fechamento de ciclo':'comemoracao'};
const CARTINHAS=[
  /* ---------- Começos ---------- */
  {n:1,tema:'Começos',titulo:'Você não precisa esperar estar pronta',p:[
    'Existe uma ideia muito comum de que precisamos ter certeza antes de começar alguma coisa. Sentir a motivação chegar, encontrar o momento ideal, ter energia de sobra. Só que esse momento perfeito raramente aparece, e a espera pode acabar ocupando o lugar daquilo que a gente queria viver.',
    'Na psicologia, motivação e ação andam juntas e uma alimenta a outra. Às vezes a vontade vem antes. Outras vezes ela aparece no meio do caminho, depois de um passo pequeno que coube no dia. Uma ajuda conhecida é combinar consigo mesma quando e onde aquele passo vai acontecer, como num "quando eu terminar o café, eu faço".',
    'Isso não significa transformar cada vontade em meta, nem aproveitar todos os dias para melhorar alguma coisa. Significa só que você não precisa esperar uma versão ideal de si mesma para experimentar o que faz sentido para você.'],
   frase:'Talvez hoje você não precise estar pronta. Talvez só precise se permitir começar.',
   ciencia:{t:'Planos do tipo "quando acontecer X, eu faço Y" ajudam a transformar intenção em ação. Sheeran, Listrom e Gollwitzer (2025), meta-análise de 642 testes.',url:'https://doi.org/10.1080/10463283.2024.2334563'}},
  {n:2,tema:'Começos',titulo:'Pequeno não significa insignificante',p:[
    'Às vezes olhamos para uma mudança pequena e pensamos que ela não vai fazer diferença. Uma caminhada curta, alguns minutos de leitura, um copo de água, uma noite dormindo um pouco mais cedo. Parece pouco perto da transformação enorme que imaginamos.',
    'Mas mudanças que duram nem sempre começam com grandes acontecimentos. Elas também nascem da repetição de coisas simples, principalmente quando cabem na vida que você realmente tem, e não naquela rotina idealizada que aparece nas redes.',
    'Fazer pouco porque é o que a sua energia permite hoje é uma escolha inteligente. É respeitar os recursos que você tem agora.'],
   frase:'Não despreze o tamanho de um passo só porque ele ainda não parece uma caminhada.'},
  {n:3,tema:'Começos',titulo:'Você pode recomeçar quantas vezes precisar',p:[
    'Existe uma tendência de tratar interrupções como fracassos. Começamos uma atividade, mantemos por alguns dias, a rotina muda, alguma coisa acontece e paramos. Quando percebemos, já estamos pensando que perdemos tudo.',
    'Só que um hábito não é uma sequência perfeita de dias cumpridos. É uma relação que vai sendo construída entre uma ação, um contexto e a repetição. A vida muda, os horários mudam, a energia muda. Por isso, saber retomar pode ser tão importante quanto saber começar.',
    'Você não precisa voltar exatamente de onde parou, nem compensar os dias em que não conseguiu. Pode adaptar, diminuir, trocar ou simplesmente tentar de novo.'],
   frase:'Uma pausa não apaga o caminho que você já fez.',
   ciencia:{t:'O tempo para um hábito se firmar varia muito de pessoa para pessoa. Singh et al. (2024), revisão sistemática e meta-análise.',url:'https://doi.org/10.3390/healthcare12232488'}},
  {n:4,tema:'Começos',titulo:'Não transforme sua vida numa prova',p:[
    'É curioso como até as coisas que fazemos para viver melhor podem virar motivo de cobrança. Dormir bem vira obrigação. Exercício vira dívida. Comer melhor vira uma avaliação diária de desempenho.',
    'Quando tudo precisa ser cumprido à perfeição, o cuidado perde parte do sentido. Em vez de ajudar você a perceber o que precisa, vira mais uma lista de exigências.',
    'Cuidar de si não pede uma performance impecável. Em alguns dias você vai conseguir manter os planos; em outros, vai precisar adaptar. Isso não quer dizer que deixou de se importar consigo.'],
   frase:'Você não precisa tirar nota dez em autocuidado.'},
  {n:5,tema:'Começos',titulo:'A sua rotina precisa caber na sua vida',p:[
    'Existem rotinas maravilhosas na internet. Pessoas que acordam cedo, meditam, treinam, cozinham, leem e ainda têm tempo de ver o nascer do sol. O problema começa quando usamos a rotina de outra pessoa como régua para medir a nossa.',
    'Uma rotina que funciona não precisa ser bonita. Ela considera seus horários, suas responsabilidades, sua energia e os imprevistos que fazem parte da vida. Precisa funcionar no mundo real, não só no papel.',
    'Talvez você precise de dez minutos em vez de uma hora. Talvez seu melhor momento seja à noite. Talvez o que funciona nesta semana precise mudar na próxima.'],
   frase:'Sua rotina existe para servir à sua vida. Não o contrário.'},
  /* ---------- Autocompaixão ---------- */
  {n:6,tema:'Autocompaixão',titulo:'Você merece a mesma gentileza',p:[
    'Quando alguém de quem gostamos erra, quase sempre encontramos palavras para acolher. Lembramos que a pessoa está aprendendo, que teve um dia difícil, que ninguém acerta sempre. Mas, quando o erro é nosso, a conversa interna pode mudar completamente.',
    'Autocompaixão é a capacidade de reconhecer uma dificuldade sem acrescentar sofrimento a ela. Não é ignorar responsabilidades nem fingir que está tudo bem. É conseguir olhar para uma situação difícil sem transformar um acontecimento numa sentença sobre quem você é.',
    'Pesquisas mostram que treinar a autocompaixão diminui a autocrítica. Ser gentil consigo não é desistir de crescer. Pode ser justamente o que torna o crescimento possível.'],
   frase:'Você também merece ser tratada com compreensão por você mesma.',
   ciencia:{t:'Intervenções de autocompaixão reduziram a autocrítica de forma moderada em 19 estudos. Wakelin, Perman e Simonds (2022), meta-análise.',url:'https://doi.org/10.1002/cpp.2586'}},
  {n:7,tema:'Autocompaixão',titulo:'Descansar não é desistir',p:[
    'Numa cultura que valoriza tanto a produtividade, descansar pode trazer uma sensação estranha. Mesmo cansadas, sentimos que deveríamos estar fazendo algo mais útil. Como se o tempo só valesse quando apresenta resultado.',
    'Mas descanso faz parte das condições para pensar, sentir, aprender e fazer o que importa. A energia tem limite e precisa ser recarregada, como uma bateria que ninguém espera que funcione para sempre sem tomada.',
    'Você não precisa justificar cada pausa com uma lista de tarefas concluídas. Nem esperar chegar ao limite para perceber que precisa diminuir o ritmo.'],
   frase:'Descansar também é cuidar da vida que você quer continuar vivendo.'},
  {n:8,tema:'Autocompaixão',titulo:'Você não precisa resolver tudo hoje',p:[
    'Algumas preocupações parecem urgentes só porque estão ocupando espaço na cabeça. Queremos uma resposta, uma decisão, tudo organizado agora. Essa sensação de pendência cansa muito.',
    'Nem toda questão precisa ser resolvida no momento em que aparece. Algumas dependem de informações que ainda não chegaram. Outras pedem tempo, conversa ou um dia com mais energia para serem pensadas.',
    'Escolher conscientemente a hora de olhar para algo é diferente de fugir dele. Dá para reconhecer que importa e, mesmo assim, não colocar toda a sua energia nisso agora.'],
   frase:'Uma coisa pode ser importante sem precisar ser urgente.'},
  {n:9,tema:'Autocompaixão',titulo:'Errar não define quem você é',p:[
    'Quando fazemos algo de que não gostamos, é fácil transformar o comportamento em identidade. Em vez de pensar que cometemos um erro, passamos a pensar que somos um erro. A mudança parece pequena, mas altera profundamente o jeito como nos enxergamos.',
    'Reconhecer uma atitude que precisa ser revista é diferente de concluir que existe algo errado em você. O primeiro abre espaço para aprender e assumir responsabilidade. O segundo prende a atenção num julgamento sobre você inteira.',
    'Dá para assumir consequências, pedir desculpas, reparar e mudar sem se reduzir ao pior momento da sua história.'],
   frase:'Você pode reconhecer o que fez sem esquecer quem ainda pode escolher ser.'},
  {n:10,tema:'Autocompaixão',titulo:'Você não precisa merecer o próprio cuidado',p:[
    'Às vezes tratamos o cuidado como recompensa. Primeiro cumprir as tarefas, resolver os problemas, atender às expectativas. Só depois, se sobrar tempo, olhar para as próprias necessidades.',
    'Mas necessidades básicas não dependem de desempenho. Comer, dormir, descansar, ter momentos de prazer e receber afeto não são prêmios por bom comportamento. Fazem parte de ser gente.',
    'Quando o cuidado fica sempre condicionado a alguma conquista, ele nunca chega. Sempre vai existir mais uma pendência, mais uma expectativa para atender.'],
   frase:'Você não precisa provar seu valor para merecer cuidado.'},
  /* ---------- Autoconhecimento e emoções ---------- */
  {n:11,tema:'Autoconhecimento',titulo:'Sentir não é o mesmo que entender',p:[
    'Às vezes percebemos que algo está acontecendo dentro da gente, mas não conseguimos dizer o quê. Irritação, desconforto, tristeza, inquietação, sem uma razão clara. E tudo bem começar por essa percepção incompleta.',
    'Dar nome ao que você sente ajuda a organizar a experiência. Em vez de um grande bloco de mal-estar, você começa a distinguir as emoções e a perceber que cada uma pode pedir uma resposta diferente.',
    'Nomear não resolve automaticamente o que você está vivendo, e não é o mesmo que saber lidar com a emoção. Mas pode abrir um pequeno espaço entre o que você sente e o jeito como reage.'],
   frase:'Você não precisa entender tudo o que sente para começar a se escutar.',
   ciencia:{t:'Num estudo de neuroimagem, dar nome à emoção diminuiu a resposta da amígdala diante de imagens negativas. É um mecanismo, não uma cura. Lieberman et al. (2007).',url:'https://doi.org/10.1111/j.1467-9280.2007.01916.x'}},
  {n:12,tema:'Autoconhecimento',titulo:'Nem todo pensamento é uma verdade',p:[
    'Nossa mente produz interpretações o tempo todo. Diante de uma situação, ela procura explicações, antecipa consequências e preenche as lacunas com o que já conhece. Tudo tão rápido que nem percebemos que estamos interpretando.',
    'Pense na diferença entre "ninguém gosta de mim" e "hoje tive a sensação de que não fui bem recebida". A primeira frase transforma uma experiência numa conclusão absoluta. A segunda deixa você observar o que aconteceu sem generalizar a sua história inteira.',
    'Olhar para um pensamento com curiosidade é perguntar de onde ele veio, o que sustenta essa ideia e se existem outros jeitos de entender a situação. Na terapia cognitivo-comportamental, isso tem nome: reestruturação cognitiva.'],
   frase:'Você pode escutar seus pensamentos sem precisar acreditar em todos eles.',
   ciencia:{t:'Na psicoterapia, a reestruturação cognitiva está associada a melhores resultados, embora ainda existam poucos estudos medindo isso diretamente. Ezawa e Hollon (2023), meta-análise.',url:'https://doi.org/10.1037/pst0000474'}},
  {n:13,tema:'Autoconhecimento',titulo:'Suas necessidades também merecem atenção',p:[
    'Dá para passar muito tempo tentando entender o comportamento dos outros e pouco tempo perguntando do que você mesma precisa. Por que aquela pessoa agiu assim, o que deveria ter sido dito, como evitar o próximo conflito.',
    'Enquanto isso, algumas perguntas ficam esquecidas. Estou cansada? Preciso de espaço? Queria companhia? Estou sentindo falta de alguma coisa? Tenho me colocado em situações que não me fazem bem?',
    'Reconhecer uma necessidade não significa que ela vai ser atendida agora, nem que alguém é obrigado a atendê-la. Significa que ela passa a entrar na conta quando você decide.'],
   frase:'Você também faz parte das situações que precisa levar em consideração.'},
  {n:14,tema:'Autoconhecimento',titulo:'Mudar de ideia também é amadurecer',p:[
    'Algumas decisões fazem sentido numa fase da vida e deixam de fazer em outra. Surgem novos interesses, novas possibilidades, e aquilo que você queria já não combina tanto com você.',
    'Às vezes insistimos numa escolha só porque já investimos muito tempo, dinheiro ou energia nela. Admitir que mudamos de ideia parece diminuir o caminho percorrido.',
    'Mas amadurecer também é atualizar escolhas diante de informações novas. Você não precisa continuar querendo algo só para provar que foi coerente no passado.'],
   frase:'Você pode honrar sua história sem ficar presa a todas as suas antigas decisões.'},
  {n:15,tema:'Autoconhecimento',titulo:'Nem tudo precisa ter uma resposta agora',p:[
    'Gostamos de organizar a vida em explicações. Por que sinto isso, por que aquela relação mudou, como vai terminar essa escolha. A incerteza incomoda, principalmente quando envolve algo importante.',
    'Algumas respostas só aparecem com o tempo e com novas experiências. Outras talvez nunca sejam tão definitivas quanto gostaríamos. Procurar compreender é diferente de exigir uma conclusão imediata para cada pergunta.',
    'Dá para seguir vivendo com algumas questões em aberto. Experimentar, observar, aprender e mudar de direção conforme você descobre mais sobre si e sobre o mundo.'],
   frase:'Você não precisa ter todas as respostas para continuar vivendo sua história.'},
  /* ---------- Desejos ---------- */
  {n:16,tema:'Desejos',titulo:'Permita-se querer alguma coisa',porque:true,p:[
    'No meio das responsabilidades, é fácil perder o contato com o que você deseja. Os dias passam a girar em torno do que precisa ser feito, do que os outros precisam, do que parece mais urgente. Aos poucos, a pergunta "o que eu quero?" pode até soar estranha.',
    'Ter desejos não é ser egoísta, irresponsável ou ingrata com o que já existe. É reconhecer que você também tem interesses, curiosidades e vontades que merecem espaço na sua vida.',
    'Talvez você queira aprender algo, conhecer um lugar, experimentar uma atividade ou só ter mais tempo para si. Nem todo desejo precisa virar um grande projeto.'],
   frase:'Você pode começar reconhecendo que gostaria de alguma coisa.'},
  {n:17,tema:'Desejos',titulo:'Imagine possibilidades, não obrigações',p:[
    'Pensar no futuro pode ser gostoso, mas também pode virar cobrança. A gente cria uma imagem de como deveria estar daqui a alguns meses e passa a comparar a vida real com esse cenário.',
    'Uma alternativa é usar a imaginação como lugar de exploração. Em vez de perguntar o que você precisa conquistar, experimente imaginar como gostaria de se sentir, que experiências gostaria de viver, o que gostaria de ver mudando na sua rotina.',
    'Existem estudos sobre um exercício parecido, em que a pessoa escreve sobre o melhor futuro possível para si. Ele costuma aumentar o bem-estar e o otimismo, mesmo que os efeitos variem de pessoa para pessoa.'],
   frase:'O futuro também pode ser um lugar para sonhar, não só para cobrar resultados.',
   ciencia:{t:'Escrever sobre o "melhor eu possível" aumentou bem-estar, otimismo e emoções positivas em 29 estudos. Carrillo et al. (2019), meta-análise.',url:'https://doi.org/10.1371/journal.pone.0222386'}},
  {n:18,tema:'Desejos',titulo:'Você pode querer mais de uma coisa',p:[
    'Às vezes parece que precisamos escolher uma única versão de nós mesmas. Profissional ou criativa. Cuidar da família ou ter projetos próprios. Estabilidade ou novidade. Como se desejos diferentes não pudessem conviver.',
    'Mas a vida tem várias dimensões, e nem todas precisam ocupar o mesmo espaço ao mesmo tempo. Algumas vontades se completam, outras entram em conflito, e as prioridades mudam conforme a fase.',
    'Talvez não dê para viver tudo agora. Isso não significa abandonar uma parte de você para sempre. Algumas possibilidades podem esperar, outras podem ser adaptadas, e algumas encontram caminhos inesperados.'],
   frase:'Você não precisa caber numa única definição de quem é.'},
  {n:19,tema:'Desejos',titulo:'O que você deseja merece ser investigado',p:[
    'Nem sempre é fácil separar o que a gente realmente quer daquilo que aprendeu a achar desejável. Às vezes perseguimos objetivos porque a família, o trabalho ou o grupo valorizam, sem perceber se eles combinam com o que precisamos agora.',
    'Isso não quer dizer que todo desejo influenciado pelos outros seja falso. Somos seres sociais, e as nossas referências ajudam a formar o que queremos. A pergunta é se aquele objetivo ainda faz sentido para você.',
    'Vale olhar para uma vontade com curiosidade. O que exatamente me atrai nisso? Como imagino que minha vida mudaria? Estou buscando uma experiência ou tentando corresponder a uma expectativa?'],
   frase:'Você pode investigar seus desejos antes de decidir o que fazer com eles.'},
  {n:20,tema:'Desejos',titulo:'Nem todo sonho precisa virar um plano',p:[
    'Existe uma pressão para transformar qualquer interesse em produtividade. Gosta de desenhar? Devia vender. Gosta de cozinhar? Podia empreender. Até os momentos de prazer parecem precisar justificar a própria existência.',
    'Mas algumas experiências valem justamente porque não precisam produzir nada além delas mesmas. Um hobby pode ser só um hobby. Uma curiosidade pode continuar sendo curiosidade. Uma vontade pode existir sem virar meta.',
    'Uma vida com sentido também se constrói com coisas que não geram resultado, reconhecimento ou dinheiro.'],
   frase:'Você tem permissão para gostar de alguma coisa sem precisar fazer disso um projeto.'},
  /* ---------- Hábitos ---------- */
  {n:21,tema:'Hábitos',titulo:'Facilite o caminho para aquilo que importa',p:[
    'Muita gente acha que mudar um comportamento depende só de vontade. Mas o que está ao seu redor também influencia as escolhas. O que fica visível, à mão e ligado a algo que você já faz pede menos energia para acontecer.',
    'Se você quer beber mais água, deixar uma garrafa por perto ajuda. Se quer ler antes de dormir, o livro ao lado da cama facilita o primeiro passo. Outra ajuda é amarrar a ação a um momento que já existe: "quando eu escovar os dentes à noite, leio uma página".',
    'Em vez de perguntar por que você não consegue manter um hábito, experimente perguntar o que está deixando aquilo difícil. Às vezes não falta vontade. Falta energia, ou falta um contexto que ajude.'],
   frase:'Não dependa só da sua vontade. Deixe o caminho mais fácil para você.',
   ciencia:{t:'Planos que ligam uma ação a um momento específico ("quando X, eu faço Y") ajudam a agir, principalmente quando são ensaiados. Sheeran, Listrom e Gollwitzer (2025).',url:'https://doi.org/10.1080/10463283.2024.2334563'}},
  {n:22,tema:'Hábitos',titulo:'A repetição não precisa ser perfeita',p:[
    'Quando pensamos em criar um hábito, imaginamos que ele precisa acontecer sempre no mesmo horário, do mesmo jeito, sem falhar. Essa imagem de regularidade absoluta deixa o processo mais pesado do que precisa ser.',
    'A pesquisa mostra que o tempo para uma ação ficar automática varia muito. Num grande levantamento, foi de poucos dias a quase um ano, dependendo da pessoa e do comportamento. Não existe um prazo mágico que sirva para todo mundo.',
    'Por isso, talvez ajude mais observar como aquilo está se encaixando na sua vida do que contar os dias até uma suposta transformação.'],
   frase:'Você não precisa de uma sequência perfeita para construir algo consistente.',
   ciencia:{t:'O tempo de formação de hábitos variou de 4 a 335 dias, com mediana em torno de dois meses. Singh et al. (2024), revisão sistemática e meta-análise.',url:'https://doi.org/10.3390/healthcare12232488'}},
  {n:23,tema:'Hábitos',titulo:'Seu ambiente também participa das suas escolhas',p:[
    'Sua rotina não acontece isolada do mundo. Os objetos que você encontra, os lugares por onde passa, o tempo que sobra e as pessoas com quem convive podem facilitar ou dificultar o que você quer fazer.',
    'Por isso, mudar um hábito pode envolver mais do que tentar se convencer. Às vezes vale reorganizar um espaço, deixar algo preparado com antecedência ou aproximar uma atividade de um momento que já faz parte do seu dia.',
    'Esse olhar tira um peso: nem toda dificuldade é uma falha sua. O comportamento também depende das condições em que acontece.'],
   frase:'Às vezes, mudar o caminho ajuda mais do que exigir mais de si mesma.'},
  {n:24,tema:'Hábitos',titulo:'Perceba o que você já está fazendo',p:[
    'Quando queremos mudar alguma coisa, a atenção vai direto para o que falta. O hábito que não firmou, a tarefa pendente, a distância entre onde você está e onde queria estar. É como se só existissem duas opções: pronto ou não pronto.',
    'Nesse olhar de tudo ou nada, as ações do caminho somem. A louça lavada, o telefonema feito, a gaveta arrumada, o dia em que você tentou mesmo cansada. Quem é mais exigente consigo costuma ser justamente quem mais faz e quem menos enxerga o que fez.',
    'Prestar atenção ao que já aconteceu não é se iludir. É ver o retrato inteiro. E ver o que você fez costuma dar vontade de continuar fazendo.'],
   frase:'Olhar para o que você fez não significa ignorar o que ainda quer mudar.',
   ciencia:{t:'Exercícios de escrever sobre coisas boas e sobre gratidão trouxeram benefícios mais consistentes para o bem-estar, embora a qualidade dos estudos ainda seja limitada. Hoult et al. (2025), revisão sistemática.',url:'https://doi.org/10.1371/journal.pone.0308928'}},
  {n:25,tema:'Hábitos',titulo:'O cuidado pode ser mais simples do que parece',p:[
    'Às vezes imaginamos que cuidar de si exige grandes mudanças. Uma rotina nova, uma alimentação impecável, uma agenda organizada, horas livres para atividades especiais.',
    'Mas o cuidado também aparece em escolhas pequenas. Preparar algo de que você gosta, fazer uma pausa, beber água, arrumar um cantinho, procurar alguém querido, respeitar um limite. São gestos diferentes, e todos aproximam você das suas necessidades.',
    'Não existe uma fórmula única. O que ajuda uma pessoa pode não fazer sentido para outra, e o que você precisa também muda com o tempo.'],
   frase:'Talvez o cuidado que você procura comece em algo bem simples.'},
  /* ---------- Relações ---------- */
  {n:26,tema:'Relações',titulo:'Dizer não também é uma forma de cuidado',p:[
    'Nem sempre é fácil recusar um pedido. Dá medo de decepcionar, de criar conflito, de parecer egoísta. Então aceitamos compromissos mesmo sem tempo, energia ou vontade, esperando que tudo se resolva sozinho.',
    'Os limites ajudam a organizar a convivência. Eles mostram o que você consegue oferecer, o que não está ao seu alcance e do que você precisa para manter uma relação equilibrada.',
    'Colocar um limite não garante que todo mundo vai aceitar bem. Mas deixa claro para você mesma o que importa. Dá para ser respeitosa sem concordar com tudo e afetuosa sem estar sempre disponível.'],
   frase:'Você pode gostar de alguém e, ainda assim, dizer não.'},
  {n:27,tema:'Relações',titulo:'Você também merece reciprocidade',p:[
    'Relações são feitas de jeitos diferentes de estar presente. Uma pessoa escuta, outra ajuda na prática, outra demonstra carinho em pequenos gestos. Ninguém precisa fazer tudo do mesmo jeito.',
    'Mas vale perceber se existe espaço para os dois lados. Uma relação em que só uma pessoa escuta, procura, entende e se adapta cansa muito. Reciprocidade não é contabilidade de favores; é disposição dos dois para participar.',
    'Observar como você se sente depois dos encontros também diz muito. Você consegue ser você mesma? Consegue falar do que precisa? Existe interesse pelo que acontece com você?'],
   frase:'Você não precisa ser a única pessoa responsável por manter uma relação viva.'},
  {n:28,tema:'Relações',titulo:'Pedir ajuda não diminui sua capacidade',p:[
    'Aprendemos de muitos jeitos a valorizar a independência. Resolver problemas, dar conta das responsabilidades, encontrar soluções. Tudo isso é importante, mas pode virar a expectativa de dar conta de tudo sozinha.',
    'A vida humana também é feita de cooperação. Pedir ajuda é reconhecer limites, dividir o peso e deixar outras pessoas participarem da sua história.',
    'Nem todo mundo vai estar disponível, e nem toda ajuda vai servir. Você pode escolher a quem recorrer, explicar do que precisa e perceber quando alguém não consegue oferecer o que você busca.'],
   frase:'Ser capaz não significa precisar fazer tudo sozinha.'},
  {n:29,tema:'Relações',titulo:'Você não precisa se explicar o tempo inteiro',p:[
    'É natural querer ser compreendida. Explicamos decisões, justificamos preferências e procuramos as palavras certas para que os outros vejam as coisas do nosso jeito.',
    'Conversar é importante, principalmente quando nossas escolhas afetam outras pessoas. Mas oferecer uma explicação necessária é diferente de sentir que precisa convencer todo mundo de que você tem direito de escolher.',
    'Nem todos vão concordar. Cada pessoa tem outras prioridades e outros jeitos de ver a vida. Isso não significa que você precisa abrir mão das suas escolhas sempre que alguém não entender.'],
   frase:'Ser compreendida é bom. Ter permissão para existir não depende disso.'},
  {n:30,tema:'Relações',titulo:'Sua vida está acontecendo agora',p:[
    'Às vezes ficamos tão concentradas no que precisa ser resolvido que esquecemos de perceber o que existe ao redor. Os compromissos se acumulam, os planos vão esperando na fila e os dias parecem passar só entre uma responsabilidade e outra.',
    'Não é preciso esperar todos os problemas desaparecerem para voltar a sentir prazer, curiosidade e presença. A vida também está nos intervalos, nas pequenas descobertas, nas conversas inesperadas e nas coisas que fazem você sorrir.',
    'Isso não é ignorar as dificuldades. É reconhecer que, mesmo num período imperfeito, ainda existem experiências que valem a pena ser vividas.'],
   frase:'Você não precisa esperar a vida ficar perfeita para participar dela.'},
  /* ---------- Fechamento de ciclo (sempre no dia 21) ---------- */
  {n:31,tema:'Fechamento de ciclo',titulo:'Olhe o caminho que você fez',mapa:true,p:[
    'Vinte e um dias atrás você abriu este espaço pela primeira vez. Alguns dias devem ter vindo cheios de energia, outros mal couberam no relógio. Talvez você tenha marcado quase tudo, talvez quase nada. Todos esses dias contam.',
    'Hoje não é dia de conferir se você "conseguiu". Cada hábito leva um tempo diferente para cada pessoa, e muitos ainda estão se formando agora, em silêncio. Hoje é dia de olhar para trás com curiosidade: o que você descobriu sobre os seus horários, sobre a sua energia, sobre o que faz bem a você e o que pesa?',
    'Um ciclo que termina não é linha de chegada. É um mirante, um lugar mais alto de onde dá para ver o caminho percorrido e escolher com mais clareza para onde ir agora. Pode ser seguir igual, ajustar, trocar ou descansar um pouco.'],
   frase:'Você não chegou ao fim de nada. Chegou a um lugar de onde dá para ver o quanto já andou.'}
];

/* dia da cartinha: conta a partir do primeiro dia em que ela apareceu (1 a 31); depois do 31 não aparece mais */
function cartinhaDia(){
  const c=S.cartinhas;if(!c||!c.inicio)return 1;
  return Math.floor((new Date(hoje()+'T12:00:00')-new Date(c.inicio+'T12:00:00'))/86400000)+1;
}
function cartinhaDoDia(dia){
  const n=CARTINHAS_ORDEM[dia-1];
  return n?CARTINHAS.find(c=>c.n===n)||null:null;
}
/* monta a leitura em HTML (tudo passa por esc) */
function cartinhaHTML(c){
  let h=`<h3 class="cp-titulo">${esc(c.titulo)}</h3>`;
  h+=c.p.map(t=>`<p>${esc(t)}</p>`).join('');
  /* cartinha 16 (desejos): se a pessoa contou o que quer da vida, a Biju lembra com as palavras dela */
  if(c.porque&&(S.porqueVida||'').trim())h+=`<p>Lá no começo, você me contou o que te trouxe até aqui: "${esc(S.porqueVida.trim())}"</p>`;
  h+=`<p class="cp-frase">${esc(c.frase)}</p>`;
  /* cartinha 31 (dia 21): convite pro Mapa Emocional, só quando o mapa já está liberado */
  if(c.mapa&&typeof mapaLiberado==='function'&&mapaLiberado())h+=`<p class="cp-convite">O seu Mapa Emocional está esperando. Que tal ver como você está hoje?</p>`;
  if(c.ciencia)h+=`<p class="cp-ciencia"><b>Ciência:</b> ${esc(c.ciencia.t)} <a href="${esc(c.ciencia.url)}" target="_blank" rel="noopener noreferrer">Conhecer o estudo</a></p>`;
  return h;
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
  const c=dia<=CARTINHAS_TOTAL?cartinhaDoDia(dia):null;
  if(!c&&!pista){box.innerHTML='';return;}
  const lida=!!(S.cartinhas.lidas&&S.cartinhas.lidas[dia]);
  box.innerHTML=(c?`<div class="carta-diva${lida?' lida':''}" id="cartaDiva">
      <button type="button" class="cd-cab" id="cartaDivaAbrir">
        <span class="cd-env" aria-hidden="true">💌</span>
        <span class="cd-tit"><b>Cartinha da Biju</b><span>dia ${dia} de ${CARTINHAS_TOTAL} · ${lida?'ler de novo':'toque pra abrir'}</span></span>
      </button>
    </div>`:'')+(pista?`<p class="cd-pista">🔒 ${esc(pista)}</p>`:'');
  const bt=$('cartaDivaAbrir');if(bt)bt.onclick=()=>abrirCartinha(dia,c);
}
/* a cartinha abre num popup com a gatinha: ela recebe a pessoa e dá pra brincar com ela (cada toque, um gesto e um coraçãozinho) */
function abrirCartinha(dia,c){
  let o=$('cartaModal');
  if(!o){
    o=document.createElement('div');o.className='modal-overlay';o.id='cartaModal';o.hidden=true;
    o.innerHTML='<div class="modal-caixa carta-pop"><button type="button" class="cp-x" id="cpX" aria-label="Fechar"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg></button><div class="cp-gata" id="cpGata"></div><p class="cp-dica mut" id="cpDica">toque na Biju 🐾</p><div class="cp-k" id="cpK"></div><div class="cp-txt" id="cpTxt"></div><p class="cd-ass">Biju 🐾</p><button type="button" class="modal-btn prim" id="cpFechar" style="width:100%;margin-top:14px">Obrigada, Biju</button></div>';
    document.body.appendChild(o);
  }
  const gata=window.customElements&&customElements.get('gatinha-fantoche');
  const festa=c.n===31;
  const pose=CARTINHAS_POSE[c.tema]||'sentada';
  $('cpGata').innerHTML=gata?`<gatinha-fantoche pose="${pose}" src-base="mascote/assets/pecas/" aria-hidden="true"></gatinha-fantoche>`:'<div class="modal-emoji">💌</div>';
  $('cpDica').hidden=!gata;
  $('cpK').textContent='Cartinha do dia '+dia+' · '+c.tema;
  $('cpTxt').innerHTML=cartinhaHTML(c);
  const g=$('cpGata').querySelector('gatinha-fantoche');
  if(g){
    const entra=()=>setTimeout(()=>{try{
      if(festa)Promise.resolve(g.play('comemorar')).then(()=>g.setPose('sentada'));else g.play('tchau');
    }catch(e){}},350);
    if(g.classList.contains('pronta'))entra();else g.addEventListener('ready',entra,{once:true});
    /* coraçãozinho subindo a cada toque (o gesto vem do toque geral das gatinhas, em base.js) */
    $('cpGata').onclick=e=>{
      const box=$('cpGata'),r=box.getBoundingClientRect(),h=document.createElement('span');
      h.className='cp-coracao';h.textContent=['💜','💗','✨','🩷'][Math.floor(Math.random()*4)];
      h.style.left=((e.clientX||r.left+r.width/2)-r.left)+'px';h.style.top=((e.clientY||r.top+r.height/2)-r.top)+'px';
      box.appendChild(h);setTimeout(()=>h.remove(),1100);
      $('cpDica').hidden=true;
    };
  }
  $('cpFechar').onclick=()=>fecharOverlay(o);
  $('cpX').onclick=()=>fecharOverlay(o);
  o.onclick=e=>{if(e.target===o)fecharOverlay(o);};
  if(!S.cartinhas.lidas)S.cartinhas.lidas={};
  if(!S.cartinhas.lidas[dia]){S.cartinhas.lidas[dia]=true;salva();renderCartinha();}
  abrirOverlayTopo(o);
}
document.addEventListener('ready',e=>{if(e.target&&e.target.tagName==='GATINHA-FANTOCHE')e.target.classList.add('pronta');},true);
/* a cartinha entra junto com a tela Hoje */
if(typeof renderHoje==='function'){const _renderHojeCartinha=renderHoje;renderHoje=function(){const r=_renderHojeCartinha.apply(this,arguments);try{renderCartinha();}catch(e){console.warn('cartinha',e);}return r;};}
