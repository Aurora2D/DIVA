/* ============ BANCO DE RELATÓRIO ============ */
const BANCO = {
  polaridade:{sobrecarga:'negativa',ansiedade:'negativa',energia:'positiva',prazer:'positiva',autopercepcao:'positiva',regulacao:'positiva',direcao:'positiva',conexao:'positiva',corpo:'positiva'},
  relatorio:{abertura:{leve:["Fechamos mais um ciclo de 21 dias, e o retrato que saiu é de uma fase com recursos e pouco peso.","Este ciclo termina com um quadro generoso: boa parte do que você precisa está funcionando e pouca coisa está pesando."],dando_conta:["Este ciclo mostra uma pessoa com recursos de sobra carregando muita coisa. Você está dando conta, e o resultado diz também o que isso custa.","O retrato dos últimos 21 dias é de quem tem fôlego e está sendo muito exigida. Vamos olhar o que sustenta e o que pesa."],no_limite:["Foram 21 dias puxados, e o retrato é honesto sobre isso: pouco recurso disponível e muito peso em cima.","O ciclo que fechou foi duro. Os números mostram pouco fôlego e muita demanda, e você não precisa embelezar isso."],quieta:["Foram 21 dias de pouca pressão e pouco impulso. Uma fase mais quieta, em que o mais útil é olhar com calma o que está faltando.","Este ciclo mostra baixa demanda e baixa energia. Não é crise, é um tempo de silêncio que pede atenção."],equilibrada:["O retrato destes 21 dias é de meio-termo: nada estourando, nada sobrando. Os detalhes é que contam a história.","Ciclo de médias, sem extremos gritando. As diferenças pequenas é que mostram pra onde você está indo."]},abertura_primeira:{leve:"Este é o primeiro retrato, e ele mostra uma fase com recursos e pouco peso. Ainda não há mudança pra comparar, só um ponto de partida.",dando_conta:"Este é o primeiro retrato: muito fôlego e muita coisa pesando ao mesmo tempo. Ainda não há mudança pra comparar, só um ponto de partida.",no_limite:"Este é o primeiro retrato, e ele mostra uma fase dura, com pouco fôlego e muito peso. Ainda não há mudança pra comparar, só um ponto de partida.",quieta:"Este é o primeiro retrato: uma fase quieta, de pouca pressão e pouco impulso. Ainda não há mudança pra comparar, só um ponto de partida.",equilibrada:"Este é o primeiro retrato: um meio-termo, sem extremos. Ainda não há mudança pra comparar, só um ponto de partida."},despedida:{melhorou:["Olha o caminho que você fez em 21 dias. Nada disso aconteceu sozinho: foi você, escolhendo, mesmo nos dias em que parecia que não estava adiantando. Leva isso com você, e daqui a três semanas a gente olha de novo, com curiosidade.","Tem coisa boa se movendo aí dentro, e eu queria que você sentisse o orgulho que isso merece. Não precisa acelerar nada: o que cresce devagar costuma ficar. Vai com calma e com a cabeça erguida até o próximo ciclo.","O que melhorou é prova de que você muda quando cuida, e isso vale muito mais que qualquer nota. Guarda este retrato como lembrete pros dias mais cinzas. A gente se encontra no próximo ciclo."],estavel:["Manter-se firme também é movimento, mesmo quando não aparece no gráfico. Você segurou o que precisava segurar, e ainda tem espaço pra escolher o que quer mudar. No próximo ciclo a gente olha de novo, com calma.","Nada se moveu muito, e tudo bem: nem todo ciclo precisa ser uma virada. Alguns existem pra firmar o chão antes do próximo passo. Cuida dele, e a gente se encontra daqui a 21 dias.","Um retrato estável diz que você tem uma base, e base é o que permite subir depois. Segue no seu ritmo, que o próximo ciclo mostra pra onde ela te leva."],piorou:["Foi um ciclo mais difícil, e isso não define o próximo nem apaga o que você já construiu. Retratos são fotografias de um período, e não sentenças. Cuida do básico agora, e daqui a 21 dias a gente olha de novo, com a mesma gentileza.","O que caiu pode voltar a subir, e o fato de você ter olhado pra isso com honestidade já é um movimento. Escolhe uma coisa pequena pra cuidar e deixa o resto descansar. Você não precisa dar conta de tudo antes do próximo retrato.","Ciclos duros passam e quase sempre deixam algo aprendido. Você chegou até aqui, e isso diz muito sobre a sua força. Vai com calma, e a gente se encontra no próximo ciclo."],primeira:["Agora você tem um ponto de partida, e isso já é mais do que muita gente tem. Daqui a 21 dias a gente olha de novo, e é aí que a história começa a aparecer. Parabéns por ter olhado com honestidade pra si.","Primeiro retrato feito. Olhar pra si com honestidade é a parte mais difícil de qualquer mudança, e você acabou de fazer isso. O resto é repetir com curiosidade, sem nota e sem julgamento.","Você começou, e começar é o que mais conta. O que aparece daqui pra frente é só você se conhecendo melhor, ciclo a ciclo. A gente se encontra daqui a 21 dias."],no_limite:["Quando a fase é pesada, o menor passo já conta, e olhar pra isso hoje foi um passo. Você não precisa resolver nada agora, e pedir ajuda faz parte da força. Se o peso ficar demais antes do próximo ciclo, conversar com alguém de confiança ou com uma profissional, como a sua terapeuta, é um ótimo caminho. Fases assim mudam com o tempo e com apoio, e você não está sozinha nisso.","Esta fase é difícil, e você teve coragem de olhar pra ela. Uma coisa pequena de cada vez já basta, e não precisa ser sozinha. Se o peso ficar demais antes do próximo ciclo, chame alguém de confiança pra dividir isso com você. Fases assim mudam com o tempo e com apoio, e você merece os dois."]},ponte_pergunta:["Pra fechar, uma pergunta pra levar:","Antes de terminar, fica uma pergunta:"]},
  combinacoes:[{dims:['sobrecarga','ansiedade'],alto_alto:"Tem coisa demais na sua mesa e a cabeça continua fazendo hora extra atrás do próximo problema. Hoje não é dia de exigir decisão brilhante de ninguém, nem de você.",alto_baixo:"Muita coisa em cima de você e o alarme não tocou. Ótimo. Só lembra que calma não é o mesmo que capacidade infinita.",baixo_alto:"A agenda está leve e a cabeça está lotada. Quando o problema não está lá fora, vale olhar o que está sendo produzido aí dentro.",baixo_baixo:"Pouca demanda, pouco alarme. Não precisa inventar uma emergência só porque você rende mais sob pressão."},{dims:['sobrecarga','energia'],alto_alto:"Você tem combustível, e o mundo percebeu e te deu mais coisa pra carregar. Ter fôlego não obriga ninguém a aceitar tudo.",alto_baixo:"Pode ser que você nem esteja sem energia. Pode ser que esteja pagando caro demais pra segurar o excesso.",baixo_alto:"Sobra recurso e falta peso em cima dele. Bom momento pra gastar energia no que você escolheu.",baixo_baixo:"A demanda está baixa e a energia também. Isso costuma ser o corpo pedindo velocidade menor."},{dims:['sobrecarga','prazer'],alto_alto:"Muita coisa pesando e ainda assim tem coisa te dando prazer. Esse prazer é uma das razões de você seguir de pé.",alto_baixo:"O excesso está comendo justamente o que deixaria o dia suportável.",baixo_alto:"Leveza e gosto pela vida ao mesmo tempo. Registra como isso está montado.",baixo_baixo:"Nada te esmagando e, mesmo assim, pouca graça."},{dims:['sobrecarga','autopercepcao'],alto_alto:"Você está vendo com clareza o tamanho do que carrega.",alto_baixo:"Muita coisa acontecendo e pouco tempo pra ouvir como você está.",baixo_alto:"Pouca pressão e boa leitura de si.",baixo_baixo:"Dia calmo e você meio fora do próprio radar."},{dims:['sobrecarga','regulacao'],alto_alto:"Você está lidando bem com muita coisa.",alto_baixo:"Carga alta e pouca margem pra reagir com calma.",baixo_alto:"Pouca pressão e bom controle de si.",baixo_baixo:"A vida não está apertando, mas você está reagindo como se estivesse."},{dims:['sobrecarga','direcao'],alto_alto:"Você sabe pra onde vai e está carregando muito pra chegar lá.",alto_baixo:"Tem muito pra fazer e pouca certeza do porquê.",baixo_alto:"Rumo claro e agenda leve.",baixo_baixo:"Pouca demanda e pouco rumo."},{dims:['sobrecarga','conexao'],alto_alto:"Você está sobrecarregada e tem gente por perto.",alto_baixo:"Muito peso e pouca companhia pra dividir.",baixo_alto:"Pouca carga e boa presença de gente.",baixo_baixo:"Não é falta de tempo que te afasta das pessoas agora."},{dims:['sobrecarga','corpo'],alto_alto:"O corpo ainda está respondendo à carga que você coloca nele.",alto_baixo:"A sobrecarga já chegou no corpo.",baixo_alto:"Corpo bem e rotina leve.",baixo_baixo:"Sem muito peso de fora e o corpo pesado do mesmo jeito."},{dims:['ansiedade','energia'],alto_alto:"Cabeça acelerada e corpo com gasolina é a combinação que faz a gente andar muito sem chegar.",alto_baixo:"Ansiedade gasta energia mesmo com você parada.",baixo_alto:"Mente tranquila e energia boa.",baixo_baixo:"Sem alarme e sem ânimo."},{dims:['ansiedade','prazer'],alto_alto:"Dá pra sentir prazer e preocupação ao mesmo tempo, e você está conseguindo.",alto_baixo:"A ansiedade está ocupando o lugar onde o prazer costumava ficar.",baixo_alto:"Pouco medo e muito gosto.",baixo_baixo:"Sem ansiedade e sem muita vontade também."},{dims:['ansiedade','autopercepcao'],alto_alto:"Você percebe muito bem o que está acontecendo.",alto_baixo:"A ansiedade está alta e a explicação está longe.",baixo_alto:"Você está se observando sem transformar cada observação em problema.",baixo_baixo:"Sem ansiedade e sem muito contato consigo."},{dims:['ansiedade','regulacao'],alto_alto:"Você sente a ansiedade e não deixa ela dirigir.",alto_baixo:"Ansiedade alta e pouco freio.",baixo_alto:"Calma por fora e por dentro.",baixo_baixo:"Pouca ansiedade e reações que escapam assim mesmo."},{dims:['ansiedade','direcao'],alto_alto:"Você sabe o que quer, e parte do sofrimento é a distância entre onde está e onde quer estar.",alto_baixo:"Quando não se sabe pra onde ir, qualquer movimento parece urgente.",baixo_alto:"Rumo claro e cabeça em paz.",baixo_baixo:"Sem pressão e sem destino."},{dims:['ansiedade','conexao'],alto_alto:"Tem gente perto e a cabeça está barulhenta mesmo assim.",alto_baixo:"Ansiedade sozinha cresce.",baixo_alto:"Cabeça tranquila e gente por perto.",baixo_baixo:"Sem ansiedade e sem muita gente."},{dims:['ansiedade','corpo'],alto_alto:"A cabeça acelera e o corpo ainda segura.",alto_baixo:"Ansiedade e corpo cansado costumam se alimentar.",baixo_alto:"Corpo bem e mente calma.",baixo_baixo:"Mente quieta e corpo pesado."},{dims:['energia','prazer'],alto_alto:"Tem combustível e tem vontade.",alto_baixo:"Sobra disposição e falta vontade.",baixo_alto:"A vontade continua aí.",baixo_baixo:"Quando até o que você gostava de fazer custa, cobrar produtividade não ajuda."},{dims:['energia','autopercepcao'],alto_alto:"Você sabe como está e tem gás pra agir.",alto_baixo:"Muita energia e pouca leitura de si.",baixo_alto:"Você percebe com precisão que está sem gás.",baixo_baixo:"Pouca energia e pouca clareza."},{dims:['energia','regulacao'],alto_alto:"Energia e controle ao mesmo tempo.",alto_baixo:"Muita energia e pouco freio.",baixo_alto:"Você tem menos combustível e está lidando bem com o que sobrou.",baixo_baixo:"Sem energia e com reações difíceis de segurar."},{dims:['energia','direcao'],alto_alto:"Você sabe o que quer e tem recurso pra se mover.",alto_baixo:"Tem movimento, mas falta onde apontar.",baixo_alto:"Você sabe pra onde quer ir.",baixo_baixo:"Você não precisa descobrir o sentido da vida hoje."},{dims:['energia','conexao'],alto_alto:"Energia e gente por perto.",alto_baixo:"Gás de sobra e pouca companhia.",baixo_alto:"Está sem energia, mas não está sozinha.",baixo_baixo:"Pouca energia e pouca gente."},{dims:['energia','corpo'],alto_alto:"Energia e corpo alinhados.",alto_baixo:"Você está com gás e o corpo está tenso.",baixo_alto:"O corpo está bem e a energia não acompanha.",baixo_baixo:"Corpo e energia em baixa juntos."},{dims:['prazer','autopercepcao'],alto_alto:"Você sabe do que gosta e está vivendo isso.",alto_baixo:"Está gostando da vida sem ter muita certeza do porquê.",baixo_alto:"Você percebe que a vida perdeu a graça e consegue falar disso.",baixo_baixo:"Pouca graça e pouco contato consigo."},{dims:['prazer','regulacao'],alto_alto:"Prazer e estabilidade juntos.",alto_baixo:"Ainda chega coisa boa até você.",baixo_alto:"Você se controla bem, e talvez controle demais.",baixo_baixo:"Pouca graça e emoções difíceis de segurar."},{dims:['prazer','direcao'],alto_alto:"Você parece estar indo pra um lugar que também vale a pena no caminho.",alto_baixo:"Você pode não estar perdida.",baixo_alto:"Você sabe direitinho o que está construindo.",baixo_baixo:"Quando nem o caminho interessa nem o destino chama."},{dims:['prazer','conexao'],alto_alto:"Pessoas e experiências estão te devolvendo alguma coisa.",alto_baixo:"As coisas ainda te fazem bem, só que sozinha.",baixo_alto:"Você não está sozinha, mas falta algo que companhia não resolve.",baixo_baixo:"Menos graça e mais solidão ao mesmo tempo."},{dims:['prazer','corpo'],alto_alto:"O corpo e o gosto pela vida estão do mesmo lado.",alto_baixo:"O prazer está ali e o corpo não acompanha.",baixo_alto:"O corpo está bem e a vida está sem graça.",baixo_baixo:"Corpo cansado e pouco prazer."},{dims:['autopercepcao','regulacao'],alto_alto:"Você percebe o que sente e faz algo com isso.",alto_baixo:"Você sabe bastante sobre o que está acontecendo.",baixo_alto:"Você segue em frente sem saber muito bem o que acontece por dentro.",baixo_baixo:"Não é hora de interpretar tudo."},{dims:['autopercepcao','direcao'],alto_alto:"Você sabe quem é e pra onde vai.",alto_baixo:"Você se conhece bem e ainda não sabe o rumo.",baixo_alto:"Tem rumo, mas você anda sem olhar muito pra si.",baixo_baixo:"Pouco contato consigo e rumo pouco claro."},{dims:['autopercepcao','conexao'],alto_alto:"Você se conhece e tem gente que te conhece.",alto_baixo:"Você se entende bem e se sente pouco entendida.",baixo_alto:"Tem gente perto, mas você está meio distante de si.",baixo_baixo:"Longe de si e longe dos outros."},{dims:['autopercepcao','corpo'],alto_alto:"Você escuta a mente e o corpo.",alto_baixo:"Você sabe o que sente, mas o corpo continua pagando.",baixo_alto:"O corpo está bem e a cabeça está desatenta.",baixo_baixo:"Pouco contato consigo e corpo em baixa."},{dims:['regulacao','direcao'],alto_alto:"Você se mantém firme e tem rumo.",alto_baixo:"Controle você tem, direção falta.",baixo_alto:"Você sabe o que quer, mas as reações atrapalham.",baixo_baixo:"Sem freio e sem rumo."},{dims:['regulacao','conexao'],alto_alto:"Você se segura e tem gente por perto.",alto_baixo:"Você se controla bem e faz isso sozinha.",baixo_alto:"Tem gente perto pra ajudar a atravessar.",baixo_baixo:"Emoções fortes e pouca companhia."},{dims:['regulacao','corpo'],alto_alto:"Mente e corpo estão cooperando.",alto_baixo:"Você segura bem, mas o corpo está cobrando.",baixo_alto:"O corpo está bem e as emoções estão oscilando.",baixo_baixo:"Corpo pesado e emoções difíceis de segurar."},{dims:['direcao','conexao'],alto_alto:"Você sabe o que quer e tem gente do lado.",alto_baixo:"Tem rumo e pouca companhia.",baixo_alto:"Sem rumo claro, mas com gente por perto.",baixo_baixo:"Sem rumo e sem companhia."},{dims:['direcao','corpo'],alto_alto:"Rumo claro e corpo disposto.",alto_baixo:"Você sabe pra onde ir, mas o corpo não acompanha.",baixo_alto:"O corpo está bem e o rumo está nublado.",baixo_baixo:"Sem rumo e com o corpo em baixa."},{dims:['conexao','corpo'],alto_alto:"Gente e corpo bem.",alto_baixo:"Você tem gente, mas o corpo está esgotado.",baixo_alto:"O corpo está bem e a solidão pesa.",baixo_baixo:"Solidão e cansaço físico juntos."}],
  padroes_complexos:[{quando:{sobrecarga:'alto',ansiedade:'alto',energia:'baixo'},texto:"Você não precisa de mais esforço. Precisa de menos coisa exigindo você ao mesmo tempo."},{quando:{sobrecarga:'alto',energia:'alto',regulacao:'alto'},texto:"Você está dando conta. Cuidado pra sua capacidade de suportar não virar a razão de te darem mais coisa pra suportar."},{quando:{ansiedade:'alto',autopercepcao:'alto',regulacao:'baixo'},texto:"Você percebe tudo com nitidez e isso não está desligando nada. Nessa fase o corpo costuma ajudar mais que a análise: respiração, caminhada, banho demorado."},{quando:{autopercepcao:'alto',direcao:'alto',prazer:'baixo'},texto:"Você sabe o que está fazendo e por quê. Falta só uma pergunta inconveniente: você ainda gosta disso?"},{quando:{autopercepcao:'alto',direcao:'baixo',prazer:'alto'},texto:"Você parece menos interessada em saber qual é o plano e mais em descobrir o que vale continuar querendo. Essa fase tem direito de existir."},{quando:{energia:'alto',regulacao:'alto',direcao:'alto',prazer:'baixo'},texto:"Tudo funcionando e prazer perto do chão. Você pode estar muito competente num lugar que já não te interessa."},{quando:{energia:'alto',prazer:'alto',sobrecarga:'alto'},texto:"Energia, vontade e capacidade ao mesmo tempo. É o cenário em que a gente diz eu aguento até descobrir que não precisava."},{quando:{energia:'baixo',prazer:'alto',direcao:'alto'},texto:"Você sabe o que quer e ainda gosta das coisas. Pode ser que a vida não esteja sem sentido, e que você só esteja cansada."},{quando:{conexao:'baixo',prazer:'baixo',energia:'baixo'},texto:"Pouca companhia, pouca graça e pouco fôlego, tudo junto. Reconstruir começa pela peça menor."},{quando:{corpo:'baixo',sobrecarga:'alto',ansiedade:'alto'},texto:"Corpo, carga e alarme apertando ao mesmo tempo. Isso não é fraqueza, é uma conta chegando."},{quando:{regulacao:'alto',conexao:'alto',prazer:'alto'},texto:"Você se sustenta, tem gente e tem vontade. Fase de abundância, sem pedir desculpa por isso."},{quando:{ansiedade:'alto',direcao:'alto'},texto:"Você sabe o que quer. O sofrimento pode estar menos na falta de rumo e mais na distância até onde você quer chegar."},{quando:{sobrecarga:'baixo',ansiedade:'baixo',energia:'alto',prazer:'alto',corpo:'alto'},texto:"Pouco peso, pouco alarme, bastante vida."},{quando:{energia:'baixo',sobrecarga:'baixo',ansiedade:'baixo',prazer:'baixo'},texto:"Nada pesando e nada puxando. Pode ser descanso, pode ser desânimo."},{quando:{ansiedade:'baixo',autopercepcao:'alto'},texto:"Você se observa sem transformar cada observação em problema. Não estraga isso analisando demais."}],
  mudancas:{especificas:[{quando:{ansiedade:'subiu',sobrecarga:'subiu',energia:'desceu'},texto:"Mais peso, mais alarme e menos fôlego. Foram 21 dias difíceis, e o dado diz isso sem exagero."},{quando:{prazer:'desceu',energia:'desceu',conexao:'desceu'},texto:"Prazer, energia e companhia caíram juntos."},{quando:{ansiedade:'desceu',autopercepcao:'subiu'},texto:"A ansiedade baixou e você está se enxergando mais."},{quando:{sobrecarga:'desceu',energia:'subiu'},texto:"Alguma coisa ficou mais leve nesses 21 dias."},{quando:{prazer:'subiu',direcao:'desceu'},texto:"Você está gostando mais da vida sem ter todas as respostas."},{quando:{direcao:'subiu',prazer:'desceu'},texto:"Você ganhou clareza e perdeu um pouco da graça."},{quando:{energia:'desceu',regulacao:'subiu'},texto:"Você tem menos combustível e está lidando melhor com o que sobrou."},{quando:{sobrecarga:'subiu',autopercepcao:'subiu'},texto:"O excesso pode não ter aumentado."},{quando:{prazer:'subiu',conexao:'subiu'},texto:"Alguma coisa está devolvendo vida pra você."},{quando:{conexao:'subiu',ansiedade:'desceu'},texto:"Mais gente por perto e menos barulho na cabeça."},{quando:{regulacao:'subiu',sobrecarga:'subiu'},texto:"A carga cresceu e você está segurando melhor."},{quando:{corpo:'subiu',energia:'subiu'},texto:"Corpo e energia subiram juntos."},{quando:{corpo:'desceu',sobrecarga:'subiu'},texto:"O corpo desceu junto com a carga."},{quando:{direcao:'subiu',ansiedade:'desceu'},texto:"Ficou mais claro pra onde você vai e o barulho diminuiu."}],globais:{tudo_melhorou:"Quase tudo melhorou nesses 21 dias.",tudo_piorou:"Quase tudo caiu ao mesmo tempo.",quase_nada_mudou:"Vinte e um dias é pouco pra mexer em muita coisa.",mistura:"Algumas coisas melhoraram e outras pioraram."}},
  perguntas:[{quando_mudanca:{energia:'subiu',sobrecarga:'subiu'},texto:"Sua energia subiu e sua sobrecarga também. Você está usando mais energia porque está melhor, ou porque está fazendo mais coisa?"},{quando_mudanca:{autopercepcao:'subiu'},texto:"Sua autopercepção subiu bastante. Você está se entendendo melhor ou só pensando mais sobre si?"},{quando:{prazer:'alto',direcao:'baixo'},texto:"Seu prazer está alto e sua direção baixa. O que você anda gostando de viver sem saber ainda onde vai dar?"},{quando:{sobrecarga:'alto'},texto:"Dessa pilha toda, o que só está aí porque ninguém tirou ainda?"},{quando:{ansiedade:'alto'},texto:"Qual dos problemas na sua cabeça existe hoje, e qual é só ensaio?"},{quando:{prazer:'baixo'},texto:"Qual foi a última coisa que você fez sem pensar se estava sendo útil?"},{quando:{conexao:'baixo'},texto:"Quem, hoje, saberia como você realmente está?"},{quando:{direcao:'baixo'},texto:"Se ninguém fosse cobrar resultado, o que você começaria?"},{quando:{regulacao:'baixo'},texto:"O que costuma vir antes da sua reação, e dá pra perceber a tempo?"},{quando:{energia:'baixo'},texto:"O que gasta mais de você e o que devolve?"},{quando:{corpo:'baixo'},texto:"O que o seu corpo pediu essa semana e ficou sem resposta?"},{quando:{},texto:"O que você quer lembrar desta versão sua, dos últimos 21 dias?"}],
  relatorio_motivacional:{titulos:{mapa:'Pelo que escutei',melhor:'O melhor deste ciclo',carinho:'O que merece carinho',pecas:'Como as respostas conversam',mudou:'O que mudou',proximos:'Para os próximos 21 dias',pergunta:'Uma pergunta pra levar'},clusters:[{id:'peso',titulo:'O peso que você carrega',dims:['sobrecarga','ansiedade'],textos:{baixo_baixo:"Você chegou até aqui leve. Pouca coisa te sobrecarregando e a cabeça sem vigiar o futuro o tempo todo é um estado que muita gente passa anos procurando. Vale perceber que você construiu esse espaço, e que ele é seu pra usar.",baixo_medio:"A vida está com folga, e a cabeça ainda dá algumas voltas. Quase sempre é o resto de um alerta antigo.",baixo_alto:"Tem um contraste que acho importante escutar: pouca coisa te pesando por fora e uma cabeça bem acelerada por dentro.",medio_baixo:"Tem coisa em cima de você, e a cabeça está conseguindo segurar sem entrar em alarme.",medio_medio:"O retrato é de equilíbrio com pontos de tensão. Pequenos ajustes aqui rendem bastante.",medio_alto:"A carga é razoável, mas a cabeça está ampliando ela.",alto_baixo:"Muita coisa em cima de você, e mesmo assim sua cabeça não entrou em pânico. Isso é uma força silenciosa.",alto_medio:"Você está carregando muito, com alguma tensão de fundo. Faz sentido, e não é fraqueza.",alto_alto:"Foram semanas pesadas por fora e barulhentas por dentro, e quero dizer com todas as letras que isso cansa qualquer pessoa."}},{id:'combustivel',titulo:'O combustível',dims:['energia','corpo'],textos:{alto_alto:"Energia e corpo andando juntos é uma das combinações mais valiosas que existe. É um bom momento pra começar aquilo que ficou esperando.",alto_medio:"Você tem fôlego, e o corpo anda um pouco mais cansado do que a cabeça admite.",alto_baixo:"A disposição está de pé, mas o corpo está pedindo atenção.",medio_alto:"O corpo está bem e a energia está na média.",medio_medio:"Energia e corpo em nível médio, o suficiente pra dar conta e pouco pra sobrar.",medio_baixo:"A energia ainda se sustenta, e o corpo está dando sinais de cansaço.",baixo_alto:"Pouca energia, mas um corpo que está bem.",baixo_medio:"O fôlego está baixo e o corpo segurando. Dá pra recarregar.",baixo_baixo:"Energia e corpo pedindo descanso ao mesmo tempo. Isso não é preguiça, é o sistema pedindo pausa."}},{id:'por_dentro',titulo:'Por dentro',dims:['autopercepcao','regulacao'],textos:{alto_alto:"O retrato é bonito: você se lê bem e sabe voltar ao seu eixo. É um recurso seu, construído, e vai com você aonde for.",alto_medio:"Você se entende bem, e o controle das reações ainda oscila em alguns momentos.",alto_baixo:"Você sabe com precisão o que está sentindo, e as emoções têm escapado do controle. O resto é prática de pausa.",medio_alto:"Você se controla bem e ainda está afinando a leitura do que sente.",medio_medio:"Uma fase de meio-termo, com leitura e controle razoáveis e algumas oscilações.",medio_baixo:"Você se percebe em parte, e as reações andam fortes. Uma palavra por dia basta pra começar.",baixo_alto:"Você se segura bem e ainda está longe do que sente.",baixo_medio:"O dia anda correndo rápido demais pra você se ouvir. Cinco minutos de silêncio por dia já abrem a escuta.",baixo_baixo:"Ouvir a si mesma e segurar as reações ficou difícil ao mesmo tempo."}},{id:'caminho',titulo:'O caminho',dims:['direcao','prazer'],textos:{alto_alto:"Você sabe pra onde vai e está gostando da viagem. Essa combinação é rara e merece ser comemorada.",alto_medio:"O rumo está claro e o prazer está discreto. Vale deixar entrar um pouco mais de gosto no meio da meta.",alto_baixo:"Você sabe pra onde vai, e as coisas perderam a cor. Você merece um intervalo bom no meio da jornada.",medio_alto:"O rumo está meio nublado e a vida tem coisas boas. Vale seguir o que te faz bem, que o rumo vai aparecendo.",medio_medio:"Nem perdida nem totalmente encontrada. É uma fase de ajuste.",medio_baixo:"O rumo está parcialmente claro e a graça está em falta.",baixo_alto:"Pouca clareza de rumo e muito gosto pelo que acontece. Você não está perdida, está curiosa.",baixo_medio:"O rumo está nublado e o prazer discreto. É uma fase de pausa.",baixo_baixo:"Sem rumo claro e sem muita graça por enquanto. Quero dizer com carinho que isso não é um fracasso, é um intervalo."}},{id:'pessoas',titulo:'As pessoas',dims:['conexao'],textos:{alto:"Você se sente acompanhada e compreendida, e isso é um dos maiores fatores de proteção que existem.",medio:"Existem laços, e nem todos chegam onde você precisa.",baixo:"A sensação é de pouca companhia de verdade. Isso dói, e também é reversível."}}],forte:{sobrecarga:"a folga que você tem na rotina",ansiedade:"a calma que a sua mente encontrou",energia:"o fôlego que você tem",conexao:"as pessoas que estão com você",autopercepcao:"a clareza com que você se enxerga",regulacao:"a firmeza com que você atravessa o que sente",corpo:"o corpo que está do seu lado",direcao:"o rumo que você enxerga",prazer:"o gosto que você ainda encontra nas coisas"},fecho_forte:["Isso não é pouca coisa, e foi você que construiu.","São recursos de verdade, e vão com você pro próximo ciclo.","Vale parar um instante e deixar isso valer."],semente:{sobrecarga:"a parte da rotina que ainda cabe em você",ansiedade:"os momentos de pausa que a sua mente ainda consegue ter",energia:"o fôlego que ainda aparece",conexao:"as pessoas que ainda estão por perto",autopercepcao:"a sua capacidade de se perceber, que continua aí",regulacao:"a parte de você que ainda segura o leme",corpo:"o corpo que continua te levando",direcao:"o pedaço de rumo que ainda faz sentido",prazer:"as pequenas coisas que ainda te fazem bem"},semente_intro:"Mesmo num ciclo mais duro, o que escuto de bom é {x}.",carinho:{sobrecarga:"A sobrecarga merece ser levada a sério. Carga se reduz, e quase sempre dá pra tirar uma ou duas coisas.",ansiedade:"A ansiedade anda alta, e entendo o quanto cansa.",energia:"A energia está baixa, e isso não é falta de vontade.",conexao:"A conexão está baixa, e é uma das dores mais silenciosas.",autopercepcao:"O contato com o que acontece por dentro anda distante.",regulacao:"As reações têm escapado, e isso diz mais do momento do que de quem você é.",corpo:"O corpo está pedindo atenção, e vale ouvir agora.",direcao:"O rumo está nublado, e tudo bem.",prazer:"O prazer anda escasso, e isso merece cuidado antes de qualquer meta."},sem_carinho:"Nada está em alerta. Se eu escolhesse um lugar pra cuidar com carinho, seria {nome} ({v}).",pecas_intro:"Tem uma coisa que aparece quando eu junto as suas respostas.",pecas_conector:"E tem mais um detalhe: ",trajetoria:{melhorou:["No conjunto, você se moveu pra um lugar melhor, e isso foi trabalho seu."],estavel:["No conjunto, você se manteve, e manter já é uma conquista."],piorou:["No conjunto, foi um ciclo mais duro que o anterior."]},primeira_mudanca:"Como este é o primeiro retrato, ainda não dá pra comparar.",proximos_intro:"Se eu pudesse sugerir um jeito de usar os próximos 21 dias, seria este.",proximos_fecho:"Pequeno, repetido e gentil: é assim que o ciclo seguinte muda de cor."},
  relatorio_detalhado:{nomes:{sobrecarga:"🌊 Sobrecarga",ansiedade:"🌀 Ansiedade",energia:"🔋 Energia",conexao:"💛 Conexão",autopercepcao:"🪞 Autopercepção",regulacao:"🌱 Regulação",corpo:"🫀 Corpo",direcao:"🧭 Direção",prazer:"🎨 Prazer"},nomes_curtos:{sobrecarga:"sobrecarga",ansiedade:"ansiedade",energia:"energia",conexao:"conexão",autopercepcao:"autopercepção",regulacao:"regulação",corpo:"corpo",direcao:"direção",prazer:"prazer"},mudanca_dim:{sobrecarga:{subiu:"A sobrecarga subiu.",desceu:"A sobrecarga desceu."},ansiedade:{subiu:"A ansiedade subiu.",desceu:"A ansiedade desceu."},energia:{subiu:"A energia subiu.",desceu:"A energia desceu."},conexao:{subiu:"A conexão subiu.",desceu:"A conexão desceu."},autopercepcao:{subiu:"A autopercepção subiu.",desceu:"A autopercepção desceu."},regulacao:{subiu:"A regulação subiu.",desceu:"A regulação desceu."},corpo:{subiu:"O corpo melhorou.",desceu:"O corpo piorou."},direcao:{subiu:"A direção subiu.",desceu:"A direção desceu."},prazer:{subiu:"O prazer subiu.",desceu:"O prazer desceu."}},experimento:{sobrecarga:"Escolha uma coisa da pilha que pode ser adiada ou abandonada.",ansiedade:"Quando a cabeça ensaiar um problema, escreva em uma linha se é de hoje ou de depois.",energia:"Anote por três dias o que te cansa e o que te devolve algo.",conexao:"Mande uma mensagem honesta pra uma pessoa.",autopercepcao:"Uma vez por dia, dê nome a uma emoção em uma palavra.",regulacao:"Antes de reagir, respire devagar até dez e só então decida.",corpo:"Escolha um ajuste pequeno de sono, água ou movimento.",direcao:"Escreva em uma linha o que você quer que seja diferente.",prazer:"Reserve 20 minutos por semana pra algo que não serve pra nada."},manter:{sobrecarga:"Proteja a folga: antes de aceitar algo novo, tire algo de lugar.",ansiedade:"Registre o que ajudou a mente a ficar quieta.",energia:"Escolha onde gastar o fôlego.",conexao:"Retribua contando a alguém o que a presença dela fez por você.",autopercepcao:"Escreva em uma linha, por semana, o que você aprendeu sobre si.",regulacao:"Repara no que te ajudou a atravessar uma situação difícil.",corpo:"Mantenha o que funciona no sono e no movimento.",direcao:"Escolha o próximo passo concreto do seu rumo.",prazer:"Anote três coisas que te deram gosto neste ciclo."}}
};

/* ============ PORTE PYTHON ============ */
const DIMS=Object.keys(BANCO.polaridade);
const NEG=new Set(Object.entries(BANCO.polaridade).filter(([d,p])=>p==='negativa').map(([d])=>d));
const banda=v=>v<=33?'baixo':v>=67?'alto':'medio';
const melhora=(d,delta)=>NEG.has(d)?-delta:delta;
const goodness=(d,v)=>NEG.has(d)?100-v:v;
function mediaDim(s,dims){const vals=dims.map(d=>s[d]).filter(v=>typeof v==='number');return vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:0;}
function panorama(s){const rec=mediaDim(s,DIMS.filter(d=>!NEG.has(d)));const peso=mediaDim(s,DIMS.filter(d=>NEG.has(d)));if(rec<=40&&peso>=60)return'no_limite';if(rec>=50&&peso>=60)return'dando_conta';if(rec>=60&&peso<=50)return'leve';if(rec<=40&&peso<=50)return'quieta';return'equilibrada';}
function pares(s){const out=[];for(const c of BANCO.combinacoes){const[a,b]=c.dims;const ba=banda(s[a]),bb=banda(s[b]);if(ba==='medio'||bb==='medio')continue;out.push({score:Math.abs(s[a]-50)+Math.abs(s[b]-50),dims:new Set([a,b]),texto:c[`${ba}_${bb}`]});}return out.sort((x,y)=>y.score-x.score);}
function padrao(s){const ok=BANCO.padroes_complexos.filter(p=>Object.entries(p.quando).every(([d,v])=>banda(s[d])===v));return ok.length?ok.reduce((a,b)=>Object.keys(b.quando).length>Object.keys(a.quando).length?b:a):null;}
function movimentos(s,prev){const delta={};DIMS.forEach(d=>delta[d]=s[d]-prev[d]);const mov={};DIMS.forEach(d=>mov[d]=delta[d]>=10?'subiu':delta[d]<=-10?'desceu':null);return{mov,delta};}
function mudancaCalc(s,prev){const{mov,delta}=movimentos(s,prev);const movidos=DIMS.filter(d=>mov[d]);let nm=0,npi=0;movidos.forEach(d=>{if(melhora(d,delta[d])>0)nm++;else npi++;});const traj=(nm-npi)>=3?'melhorou':(nm-npi)<=-3?'piorou':'estavel';for(const m of BANCO.mudancas.especificas){if(Object.entries(m.quando).every(([d,v])=>mov[d]===v))return{txt:m.texto,traj,mov,delta};}const g=BANCO.mudancas.globais;if(nm>=7)return{txt:g.tudo_melhorou,traj,mov,delta};if(npi>=7)return{txt:g.tudo_piorou,traj,mov,delta};if(movidos.length<=1)return{txt:g.quase_nada_mudou,traj,mov,delta};if(nm&&npi)return{txt:g.mistura,traj,mov,delta};return{txt:null,traj,mov,delta};}
function perguntaPor(s,mov){for(const q of BANCO.perguntas){if(q.quando_mudanca){if(mov&&Object.entries(q.quando_mudanca).every(([d,v])=>mov[d]===v))return q.texto;}else if(q.quando){if(Object.entries(q.quando).every(([d,v])=>banda(s[d])===v))return q.texto;}}return null;}
function escolher(rnd,lista,evitar){const opcoes=lista.filter(x=>!(evitar||[]).includes(x));const pool=opcoes.length?opcoes:lista;return pool[Math.floor(rnd()*pool.length)];}
function juntar(itens){return itens.length===1?itens[0]:itens.slice(0,-1).join(', ')+' e '+itens[itens.length-1];}
function lc1(t){return t[0].toLowerCase()+t.slice(1);}
function montarRelatorio(s,prev,evitar,seed){
  let seedState=seed||1;const rnd=()=>{seedState=(seedState*9301+49297)%233280;return seedState/233280;};
  const M=BANCO.relatorio_motivacional;const X=BANCO.relatorio_detalhado;const T=M.titulos;
  const pan=panorama(s);
  const abertura=prev===null?BANCO.relatorio.abertura_primeira[pan]:escolher(rnd,BANCO.relatorio.abertura[pan],(evitar||{}).aberturas||[]);
  let mov=null,delta=null,txt_mud=null,traj='primeira';
  if(prev!==null){const r=mudancaCalc(s,prev);mov=r.mov;delta=r.delta;txt_mud=r.txt;traj=r.traj;}
  const blocos=[];blocos.push({tipo:'abertura',txt:abertura});blocos.push({tipo:'h2',txt:T.mapa});
  for(const c of M.clusters){const chave=c.dims.map(d=>banda(s[d])).join('_');blocos.push({tipo:'cluster',titulo:c.titulo,txt:c.textos[chave]||''});}
  const ordem=[...DIMS];for(let i=ordem.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[ordem[i],ordem[j]]=[ordem[j],ordem[i]];}
  ordem.sort((a,b)=>goodness(b,s[b])-goodness(a,s[a]));
  const fortes=ordem.filter(d=>goodness(d,s[d])>=67).slice(0,3);
  const fracos=[...ordem].reverse().filter(d=>goodness(d,s[d])<=40).slice(0,3);
  blocos.push({tipo:'h2',txt:T.melhor});
  if(fortes.length){blocos.push({tipo:'p',txt:'O melhor deste ciclo, na minha escuta: '+juntar(fortes.map(d=>M.forte[d]))+'. '+escolher(rnd,M.fecho_forte,[])});}
  else{blocos.push({tipo:'p',txt:M.semente_intro.replace('{x}',M.semente[ordem[0]])});}
  blocos.push({tipo:'h2',txt:T.carinho});
  if(fracos.length){blocos.push({tipo:'p',txt:fracos.map(d=>M.carinho[d]).join(' ')});}
  else{const d=ordem[ordem.length-1];blocos.push({tipo:'p',txt:M.sem_carinho.replace('{nome}',X.nomes_curtos[d]).replace('{v}',s[d])});}
  blocos.push({tipo:'h2',txt:T.pecas});
  const blocosPecas=[];const pad=padrao(s);if(pad)blocosPecas.push(pad.texto);
  const usados=new Set();
  for(const p of pares(s)){if(blocosPecas.length>=2)break;let inter=false;p.dims.forEach(d=>{if(usados.has(d))inter=true;});if(!inter&&!blocosPecas.includes(p.texto)){blocosPecas.push(p.texto);p.dims.forEach(d=>usados.add(d));}}
  if(blocosPecas.length){let txt=M.pecas_intro+' '+blocosPecas[0];if(blocosPecas.length>1){txt+=' '+M.pecas_conector+lc1(blocosPecas[1]);}blocos.push({tipo:'p',txt});}
  else{blocos.push({tipo:'p',txt:M.pecas_intro+' Nenhuma combinação saiu em faixa clara.'});}
  blocos.push({tipo:'h2',txt:T.mudou});
  if(prev===null){blocos.push({tipo:'p',txt:M.primeira_mudanca});}
  else{const partes=[];if(txt_mud)partes.push(txt_mud);const grandes=DIMS.filter(d=>mov[d]).sort((a,b)=>Math.abs(delta[b])-Math.abs(delta[a])).slice(0,3);grandes.forEach(d=>partes.push(X.mudanca_dim[d][mov[d]]));partes.push(escolher(rnd,M.trajetoria[traj],[]));blocos.push({tipo:'p',txt:partes.join(' ')});}
  blocos.push({tipo:'h2',txt:T.proximos});
  const medios=[...ordem].reverse().filter(d=>goodness(d,s[d])<67&&!fracos.includes(d));
  const foco=[...fracos,...medios].slice(0,2);const manter=fortes.slice(0,Math.max(1,3-foco.length));
  const pref=['Pra proteger o que já está bom, ','E em '];
  const itens=foco.map(d=>`**${X.nomes[d]}**: ${lc1(X.experimento[d])}`).concat(manter.map((d,i)=>`${pref[Math.min(i,1)]}**${X.nomes[d]}**: ${lc1(X.manter[d])}`));
  const itensFinais=itens.map(i=>i.endsWith('.')?i:i+'.').join(' ');
  blocos.push({tipo:'p',txt:M.proximos_intro+' '+itensFinais+' '+M.proximos_fecho});
  blocos.push({tipo:'h2',txt:T.pergunta});
  const pergunta=perguntaPor(s,mov);if(pergunta)blocos.push({tipo:'pergunta',txt:pergunta});
  const chaveDesp=pan==='no_limite'?'no_limite':traj;
  const despedida=escolher(rnd,BANCO.relatorio.despedida[chaveDesp],(evitar||{}).despedidas||[]);
  blocos.push({tipo:'despedida',txt:despedida});
  return{blocos,panorama:pan,trajetoria:traj,usados:{aberturas:[abertura],despedidas:[despedida]}};
}

/* ============ UTILITÁRIOS ============ */
const pad2=n=>String(n).padStart(2,'0');
const fmtD=d=>d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate());
const hoje=()=>fmtD(new Date());
const habitoLiberado=()=>{
  if(!S.proximoHabitoEm)return true;
  if(hoje()>=fmtD(new Date(S.proximoHabitoEm)))return true;
  // Libera também quando o hábito que travou a fila já tem 3+ dias marcados
  const id=S.habitoTravaId;
  if(id){
    const h=(S.habitos||[]).find(x=>x.id===id);
    if(h&&Object.keys(h.feitos||{}).length>=3)return true;
    // hábito da trava foi removido → libera
    if(!(S.habitos||[]).some(x=>x.id===id))return true;
  } else {
    // legado: sem habitoTravaId, qualquer ativo com 3+ dias libera
    if((S.habitos||[]).some(h=>!h.pausado&&Object.keys(h.feitos||{}).length>=3))return true;
  }
  return false;
};
const diasAteLiberar=()=>{
  if(habitoLiberado())return 0;
  if(!S.proximoHabitoEm)return 0;
  return Math.max(1,Math.round((new Date(fmtD(new Date(S.proximoHabitoEm)))-new Date(hoje()))/86400000));
};
const addDias=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x;};
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const primeiroNome=()=>{const n=(S&&S.onboarding&&S.onboarding.nome)?S.onboarding.nome.trim():'';return n||'';};


function bindLongPress(el, onLong, onTap, ms){
  ms=ms||550;
  let t=null, moved=false, done=false;
  const start=e=>{
    moved=false;done=false;
    t=setTimeout(()=>{done=true;if(navigator.vibrate)try{navigator.vibrate(12);}catch(err){} if(onLong)onLong(e);},ms);
  };
  const cancel=()=>{if(t){clearTimeout(t);t=null;}};
  const end=e=>{
    if(t){clearTimeout(t);t=null;}
    if(!done && !moved && onTap) onTap(e);
  };
  el.addEventListener('touchstart',start,{passive:true});
  el.addEventListener('touchmove',()=>{moved=true;cancel();},{passive:true});
  el.addEventListener('touchend',end);
  el.addEventListener('touchcancel',cancel);
  el.addEventListener('mousedown',start);
  el.addEventListener('mouseup',end);
  el.addEventListener('mouseleave',cancel);
}

function dialogo(o){
  const ov=$('dlgModal');
  $('dlgEmoji').textContent=o.emoji||'';$('dlgEmoji').style.display=o.emoji?'':'none';
  $('dlgTitulo').textContent=o.titulo||'';$('dlgTitulo').style.display=o.titulo?'':'none';
  $('dlgTexto').textContent=o.texto||'';
  const bs=(o.botoes&&o.botoes.length)?o.botoes:[{rotulo:'Ok',prim:true}];
  const cont=$('dlgBotoes');cont.innerHTML='';
  bs.forEach(b=>{const el=document.createElement('button');el.className='modal-btn '+(b.prim?'prim':'sec');el.textContent=b.rotulo;el.onclick=()=>{fechaDialogo();if(b.fn)setTimeout(b.fn,340);};cont.appendChild(el);});
  ov.hidden=false;requestAnimationFrame(()=>ov.classList.add('ativo'));document.body.style.overflow='hidden';
}
function fechaDialogo(){
  const ov=$('dlgModal');ov.classList.remove('ativo');
  setTimeout(()=>{ov.hidden=true;if(!document.querySelector('.modal-overlay.ativo,.festa-overlay.ativo,.onb-overlay.ativo,.premio-modal.ativo,.rel-overlay.ativo,.resumo-overlay.ativo'))document.body.style.overflow='';},320);
}
const avisar=(texto,fn,titulo)=>dialogo({titulo:titulo||'',texto,botoes:[{rotulo:'Ok',prim:true,fn}]});
const confirmar=(texto,fnSim,rotuloSim)=>dialogo({texto,botoes:[{rotulo:'Cancelar'},{rotulo:rotuloSim||'Sim',prim:true,fn:fnSim}]});
/* toque na gatinha: sempre acena com a patinha; tocar de novo durante o aceno guarda UMA reação pra depois (sem empilhar animações) */
function gataToque(g){
  if(!g||typeof g.play!=='function')return;
  if(g._acenando){g._depois=g._depois||['feliz','pular','curiosa'][Math.floor(Math.random()*3)];return;}
  g._acenando=true;
  let feito=false;const fim=()=>{if(feito)return;feito=true;g._acenando=false;const d=g._depois;g._depois=null;if(d){try{g.play(d);}catch(e){}}};
  setTimeout(fim,2600);/* garantia: nunca fica presa sem responder */
  try{Promise.resolve(g.play('tchau')).then(fim,fim);}catch(e){fim();}
}
/* qualquer gatinha do app, em qualquer tela (nome, boas-vindas, desbloqueios, Atração, relatórios, de volta), acena quando tocada */
document.addEventListener('click',e=>{const g=e.target&&e.target.closest&&e.target.closest('gatinha-fantoche');if(g)gataToque(g);});
function gataTocavel(g){/* mantida por compatibilidade: o toque já vale pra todas as gatinhas */}
let toastTimer;
function mostrarToast(txt,rotulo,fn){
  const t=$('toast');$('toastTxt').textContent=txt;
  const b=$('toastBtn');b.textContent=rotulo||'';b.style.display=rotulo?'':'none';
  b.onclick=()=>{t.classList.remove('ativo');clearTimeout(toastTimer);if(fn)fn();};
  t.classList.add('ativo');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('ativo'),6000);
}

const FRASES=["Estou em processo de ficar bem","Cada toque é uma prova de que eu me cuido","Hoje é mais um dia que eu escolho por mim","O cuidado não precisa ser grande pra ser real"];
const FRASES_HABITO={batom:["Eu passei batom hoje, e a psiquiatra que se foda.","Batom na boca, psiquiatra no caralho.","Lábios vermelhos, prontuário contestado.","Passei batom. Evidências de vida encontradas.","Batom: 1. Psiquiatra: 0.","Hoje eu tenho batom e opinião."],risada:["Rindo para manter minha bela cútis.","Gargalhando em prol da saúde dermatológica.","Rindo para manter a cara de quem tem futuro.","Sorrindo para deixar o humor em dia.","Cada gargalhada é uma vitória silenciosa."],agua:["Hidratando meu corpitcho saudável.","Água para dentro, caos para fora.","Bebendo água em prol da saúde deste monumento.","Gole por gole, cuidando de mim.","Água: começo simples, efeito grande."],pijama:["Neném dormindo bem, mamãe feliz.","Aurora de pijaminha, mamãe contentinha.","Pijaminha vestido, coração aquecido.","Dormiu bem, mamãe ganhou o dia.","Neném confortável, mamãe com o coração quentinho."]};
let fraseTimeout;
function mostrarFraseHabito(id){let arr=FRASES_HABITO[id];if(id==='pijama'){if(!cuida()||!['filha','filho'].includes(S.cuidado.relacao)){frase();return;}arr=arr.map(t=>t.replace(/Aurora/g,nomeCuidado()));}if(!arr||!arr.length){frase();return;}const el=$('frase');el.style.opacity=0;clearTimeout(fraseTimeout);setTimeout(()=>{el.textContent=arr[Math.floor(Math.random()*arr.length)];el.style.opacity=1;fraseTimeout=setTimeout(frase,6000);},250);}
function todosGrupos(){return GRUPOS.map(g=>g.id==='aurora'?{...g,nome:cuida()?'Ritmo de '+nomeCuidado():'Ritmo de quem eu cuido'}:g).concat(Array.isArray(S.gruposCustom)?S.gruposCustom:[]);}
const GRUPOS=[{id:'palavras',emoji:'💌',nome:'Palavras de afirmação'},{id:'tempo',emoji:'⏳',nome:'Tempo de qualidade'},{id:'presentes',emoji:'🎁',nome:'Presentes'},{id:'servico',emoji:'🛠️',nome:'Atos de serviço'},{id:'toque',emoji:'🤍',nome:'Toque físico'},{id:'musica',emoji:'🎵',nome:'Música'},{id:'aurora',emoji:'🌙',nome:'Ritmo da Aurora'},{id:'essencial',emoji:'🎯',nome:'Essenciais'},{id:'outros',emoji:'✨',nome:'Outros'}];
/* categorias antigas dos hábitos -> as cinco linguagens (vale pra hábitos criados antes e pra partes do código que ainda usam os nomes antigos) */
const GRUPO_ALIAS={corpo:'toque',rituais:'toque',mente:'tempo',arte:'tempo',lar:'servico'};
const grupoDe=h=>GRUPO_ALIAS[h.grupo]||h.grupo||'essencial';
let PRATICAS={'🎤 Treino vocal':['Respiração','Aquecimento vocal','Canto'],'🤍 Toque físico':['Auto-cafuné','Auto-massagem','Creme no corpo','Carinho no Pituca','Carinho na Nica','Banho relaxante','Música enquanto se arruma','Bebida especial','Roupa de cama limpa','Perfume favorito','Batom','Hidratação nos cabelos','Peça de roupa favorita','Joia ou acessório especial'],'⏳ Tempo de qualidade':['Vídeos no YouTube','Música','Dança','Meditação','Jardim do prédio','Culinária','Filme com pipoca','Livro divertido','Caminhada no quarteirão','Viagem','Apreciação da beleza de dentro de casa','Canva por hobby','Direção','Videogame','Duolingo / curso de inteligência emocional','Caminhada no parque','Louça / arrumação da casa','Canto'],'💌 Palavras de afirmação':['Questionário','Conversa com amigos','Terapia','Canto das minhas músicas','Escrita no caderno','Leitura do caderno','Curso online','Livro revigorante','Vídeos da Ana Beatriz']};
/* Catálogo por estilo: as 2 primeiras aparecem sem teste; depois do teste o estilo principal abre 8 e o secundário 5 */
const PRATICAS_CATALOGO=[
  {id:'palavras',grupo:'💌 Palavras de afirmação',itens:['Escrever um bilhete gentil pra mim','Mandar mensagem pra uma amiga','Escrever 3 linhas no caderno','Ver um vídeo que me inspira','Gravar um áudio de incentivo pra mim','Anotar uma conquista do dia','Reler um elogio que eu guardei','Escrever 3 coisas pelas quais sou grata']},
  {id:'tempo',grupo:'⏳ Tempo de qualidade',itens:['Ficar 5 minutos sem celular','Ouvir uma música sem fazer outra coisa','Ler 5 páginas de um livro','Meditar por 3 minutos','Caminhar 10 minutos','Tomar um café sem pressa','Ficar 5 minutos ao ar livre','Assistir um episódio sem culpa']},
  {id:'presentes',grupo:'🎁 Presentes',itens:['Preparar minha bebida favorita','Passar batom','Passar meu perfume favorito','Vestir minha peça de roupa favorita','Comer algo que eu adoro','Usar a louça bonita que eu guardo','Colocar uma flor ou planta perto de mim','Montar uma playlist pra mim']},
  {id:'servico',grupo:'🛠️ Atos de serviço',itens:['Lavar a louça','Arrumar a cama','Deixar uma refeição pronta pra depois','Separar a roupa do dia seguinte','Fazer a lista de compras','Organizar uma gaveta','Lavar uma leva de roupa','Tirar o lixo antes de dormir']},
  {id:'toque',grupo:'🤍 Toque físico',itens:['Tomar um banho relaxante','Passar creme no corpo','Alongar por 5 minutos','Dançar uma música','Massagear mãos ou pés','Hidratar o cabelo','Lavar o rosto com calma','Deitar 5 minutos embaixo de uma manta']}
];
const PRATICAS_INICIAIS_POR_ESTILO=2,PRATICAS_PRINCIPAL=8,PRATICAS_SECUNDARIA=5;
const PRATICAS_GENERICAS=Object.fromEntries(PRATICAS_CATALOGO.map(c=>[c.grupo,c.itens.slice(0,PRATICAS_INICIAIS_POR_ESTILO)]));
const HORAS_DORMIR=['21:00','21:30','22:00','22:30','23:00','23:30','00:00','00:30','01:00','01:30','02:00','02:30','03:00'];
const HORAS_ACORDAR=['04:30','05:00','05:30','06:00','06:30','07:00','07:30','08:00','08:30','09:00','09:30','10:00','10:30','11:00'];
const REFEICOES=['Café da manhã','Brunch','Almoço','Lanche da tarde','Jantar','Ceia'];
/* todas as notas que o check-in já teve (as antigas ficam pra mostrar o histórico); as de hoje saem de escalasHoje() */
const ESCALAS=[['fisica','Disposição física'],['mental','Disposição mental'],['humor','Humor'],['calma','Calma'],['casa','Casa em ordem'],['autoconf','Autoconfiança'],['danca','Prática de dança'],['belting','Domínio do Belting'],['lirico','Domínio do Canto Lírico'],['organizacao','Organização do lar'],['limpeza','Limpeza do lar']];
const ESCALAS_BASE=['fisica','mental','humor','calma','casa','autoconf'],ESCALAS_MUSICA=['danca','belting','lirico'];
function escalasHoje(){const rot=Object.fromEntries(ESCALAS);const l=ESCALAS_BASE.map(k=>[k,rot[k]]);if(typeof musicaAtiva==='function'&&musicaAtiva())ESCALAS_MUSICA.forEach(k=>l.push([k,rot[k]]));return l;}
const CICLO_DIMS=[{key:'sobrecarga',emoji:'🌊',nome:'Sobrecarga',sobeBom:false,grupo:'peso',perguntas:['Me senti emocionalmente sobrecarregada','Senti que estava apenas sobrevivendo à semana','Tive a sensação de que nada do que faço é suficiente','Me senti atrasada em relação a tudo','Acordei já cansada de pensar']},{key:'ansiedade',emoji:'🌀',nome:'Ansiedade',sobeBom:false,grupo:'peso',perguntas:['Minha mente ficou presa em preocupações','Tive dificuldade pra desligar os pensamentos','Antecipei problemas que ainda não aconteceram','Revivi situações já passadas na cabeça','Senti o corpo em alerta sem motivo claro']},{key:'energia',emoji:'🔋',nome:'Energia',sobeBom:true,grupo:'sustenta',perguntas:['Tive energia pra fazer o que precisava','Consegui manter minha rotina básica','Tive vontade de fazer coisas que gosto','Consegui terminar o que comecei','Acordei com disposição pra começar o dia']},{key:'corpo',emoji:'🫀',nome:'Corpo',sobeBom:true,grupo:'sustenta',perguntas:['Meu sono foi reparador','Comi com regularidade e sem pressa','Meu corpo teve espaço pra descansar','Percebi e cuidei do meu corpo','Me movimentei de algum jeito que gostei']},{key:'prazer',emoji:'🎨',nome:'Prazer',sobeBom:true,grupo:'sustenta',perguntas:['Senti prazer em coisas pequenas','Ri de verdade','Parei pra apreciar algo bonito','Tive um momento de paz real, sem culpa','Senti que a vida também cabe em coisas boas']},{key:'conexao',emoji:'💛',nome:'Conexão',sobeBom:true,grupo:'relaciona',perguntas:['Me senti compreendida pelas pessoas próximas','Tive espaço pra conversar com alguém de verdade','Senti que tenho pessoas com quem contar','Consegui estabelecer limites quando precisei','Me senti à vontade pra ser eu mesma com os outros']},{key:'autopercepcao',emoji:'🪞',nome:'Autopercepção',sobeBom:true,grupo:'relaciona',perguntas:['Me senti satisfeita com quem eu sou','Me tratei com o mesmo carinho que trato os outros','Senti que estou vivendo de acordo com o que quero','Reconheci coisas boas em mim','Senti orgulho de algo que fiz']},{key:'regulacao',emoji:'🌱',nome:'Regulação',sobeBom:true,grupo:'relaciona',perguntas:['Quando algo ruim aconteceu, voltei ao normal rápido','Percebi o que estava sentindo antes de reagir','Consegui mudar de perspectiva quando fiquei presa','Senti que estava no controle das minhas reações','Consegui deixar um pensamento passar sem precisar resolvê-lo']},{key:'direcao',emoji:'🧭',nome:'Direção',sobeBom:true,grupo:'relaciona',perguntas:['Senti que minha vida caminha pra algum lugar que faz sentido','Consegui fazer coisas que considero importantes','Senti curiosidade ou vontade de experimentar coisas novas','Tive espaço mental pra pensar em coisas que não eram obrigação','Senti que estava escolhendo, e não só reagindo']}];
const GRUPOS_MAPA=[{id:'peso',titulo:'🌊 O que pesa'},{id:'sustenta',titulo:'🔋 O que sustenta'},{id:'relaciona',titulo:'💛 Como você se relaciona'}];
const FILA_CATEGORIAS=[{nome:'🌱 Primeiros passos',itens:[
  {id:'agua',emojis:['💧','🥤','✨'],nome:'Beber um copo de água ao acordar',emoji:'💧',unidade:'todo dia',paraQue:'Cuidar do meu bem-estar',grupo:'toque',texto:'Antes do café e do celular. Seu corpo acorda hidratado e você já começa com uma vitória.',dims:['corpo','energia']},
  {nome:'Passar protetor solar no rosto de manhã',emoji:'🧴',unidade:'todo dia',paraQue:'Cuidar da minha pele',grupo:'toque',texto:'Cuidado que protege o dia inteiro.',dims:['corpo','autopercepcao']},
  {id:'risada',emojis:['😂','🤣','💜','✨'],nome:'Rir de um vídeo ou meme que eu gosto',emoji:'😄',unidade:'1 vez ao dia',paraQue:'Cultivar leveza',grupo:'tempo',texto:'Rir de propósito também vale.',dims:['prazer','regulacao']},
  {nome:'Respirar fundo três vezes antes de abrir o celular',emoji:'🌬️',unidade:'todo dia',paraQue:'Começar o dia devagar',grupo:'tempo',texto:'Três respirações e o dia começa mais calmo.',dims:['regulacao','ansiedade']}
]},{nome:'💌 Palavras de afirmação',itens:[
  {nome:'Escrever uma página no caderno',emoji:'✍️',unidade:'3×/semana',paraQue:'Botar a cabeça no papel',grupo:'palavras',texto:'Sobre o dia, uma lembrança, uma ideia solta.',dims:['autopercepcao','regulacao']},
  {nome:'Anotar três coisas boas do dia antes de dormir',emoji:'📝',unidade:'todo dia',paraQue:'Treinar o olhar pro que é bom',grupo:'palavras',texto:'Pode ser pequeno: um café gostoso já conta.',dims:['prazer','autopercepcao']},
  {nome:'Escrever um bilhete gentil pra mim',emoji:'💌',unidade:'2×/semana',paraQue:'Falar comigo com carinho',grupo:'palavras',texto:'Do jeito que você falaria com uma amiga querida.',dims:['autopercepcao','regulacao']},
  {nome:'Mandar uma mensagem carinhosa pra alguém',emoji:'💬',unidade:'2×/semana',paraQue:'Fazer alguém se sentir lembrado',grupo:'palavras',texto:'Só pra dizer que lembrou.',dims:['conexao']},
  {nome:'Ligar ou mandar áudio pra uma amiga',emoji:'💬',unidade:'1×/semana',paraQue:'Cultivar conexão',grupo:'palavras',texto:'Uma conversa de verdade, sem pressa.',dims:['conexao','prazer']}
]},{nome:'⏳ Tempo de qualidade',itens:[
  {nome:'Meditar 5 minutos com áudio guiado',emoji:'🧘',unidade:'todo dia',paraQue:'Dar espaço à mente',grupo:'tempo',texto:'Senta, aperta o play, pronto.',dims:['regulacao','ansiedade','sobrecarga']},
  {nome:'Ouvir uma música inteira sem fazer outra coisa',emoji:'🎧',unidade:'todo dia',paraQue:'Me dar um tempo só meu',grupo:'tempo',texto:'Prestando atenção só nela.',dims:['prazer','regulacao']},
  {nome:'Ler 10 páginas de um livro',emoji:'📚',unidade:'todo dia',paraQue:'Viajar um pouco',grupo:'tempo',texto:'De algo que você gosta, não do que acha que deveria ler.',dims:['prazer','direcao']},
  {nome:'Desenhar ou pintar por 15 minutos',emoji:'🎨',unidade:'2×/semana',paraQue:'Brincar com cor e forma',grupo:'tempo',texto:'Sem compromisso de ficar bonito.',dims:['prazer','regulacao']},
  {nome:'Receber alguém em casa pra um café',emoji:'☕',unidade:'1×/mês',paraQue:'Abrir minha casa e minha vida',grupo:'tempo',texto:'Um café, uma conversa.',dims:['conexao','prazer']}
]},{nome:'🎁 Presentes',itens:[
  {id:'batom',emojis:['💄','💋','💗','✨'],nome:'Passar batom ou perfume antes de sair, só pra mim',emoji:'💄',unidade:'1 vez ao dia',paraQue:'Reafirmar meu valor',grupo:'presentes',texto:'Não é pra ninguém, é pra você.',dims:['autopercepcao','prazer']},
  {nome:'Preparar minha bebida favorita e tomar com calma',emoji:'☕',unidade:'3×/semana',paraQue:'Me dar um agrado',grupo:'presentes',texto:'Na xícara bonita, sentada, sem pressa.',dims:['prazer','regulacao']},
  {nome:'Colocar uma flor ou planta perto de mim',emoji:'🌸',unidade:'1×/semana',paraQue:'Trazer beleza pro dia comum',grupo:'presentes',texto:'Pode ser do mercado, do jardim ou da calçada.',dims:['prazer','autopercepcao']},
  {nome:'Cozinhar uma receita nova',emoji:'🍳',unidade:'1×/semana',paraQue:'Cozinhar por prazer',grupo:'presentes',texto:'Por curiosidade, cheiro e sabor novo, não por obrigação.',dims:['prazer','corpo']},
  {nome:'Fazer 20 minutos de crochê, bordado ou outro trabalho manual',emoji:'🧶',unidade:'1×/semana',paraQue:'Criar alguma coisa',grupo:'presentes',texto:'A cabeça descansa quando a mão trabalha.',dims:['prazer','regulacao']}
]},{nome:'🛠️ Atos de serviço',itens:[
  {nome:'Arrumar a cama ao levantar',emoji:'🏠',unidade:'todo dia',paraQue:'Começar o dia em ordem',grupo:'servico',texto:'Dois minutos, e o quarto já parece outro.',dims:['direcao','sobrecarga']},
  {nome:'Guardar 10 coisas fora do lugar',emoji:'🧹',unidade:'todo dia',paraQue:'Ter um espaço em paz',grupo:'servico',texto:'Conta até dez e para. A casa melhora e não vira faxina.',dims:['sobrecarga','direcao']},
  {nome:'Lavar a louça antes de dormir',emoji:'🍽️',unidade:'toda noite',paraQue:'Fechar o dia com cuidado',grupo:'servico',texto:'Acordar com a pia limpa é começar o dia mais leve.',dims:['sobrecarga','regulacao']},
  {nome:'Limpar um cômodo',emoji:'🧹',unidade:'1×/semana',paraQue:'Cuidar da casa sem me esgotar',grupo:'servico',texto:'Um de cada vez, sem tentar dar conta da casa toda.',dims:['sobrecarga','direcao']},
  {nome:'Pedir uma ajuda concreta pra alguém',emoji:'🤝',unidade:'1×/semana',paraQue:'Não carregar tudo sozinha',grupo:'servico',texto:'Uma tarefa, um favor, uma carona.',dims:['sobrecarga','conexao']}
]},{nome:'🤍 Toque físico',itens:[
  {nome:'Tomar um banho de 10 minutos sem celular',emoji:'🛁',unidade:'3×/semana',paraQue:'Ter um momento só meu',grupo:'toque',texto:'Só água, silêncio e você.',dims:['corpo','regulacao']},
  {nome:'Fazer hidratação nos cabelos',emoji:'💆',unidade:'1×/semana',paraQue:'Cuidar do meu corpo',grupo:'toque',texto:'Vinte minutos de pausa enquanto o creme age.',dims:['corpo','prazer']},
  {nome:'Alongar pescoço e costas por 5 minutos',emoji:'🧘',unidade:'todo dia',paraQue:'Cuidar do meu corpo',grupo:'toque',texto:'Ao acordar ou antes de dormir.',dims:['corpo','energia']},
  {nome:'Caminhar 15 minutos',emoji:'🚶',unidade:'3×/semana',paraQue:'Mover o corpo e arejar a cabeça',grupo:'toque',texto:'Na rua, no parque ou até o mercado.',dims:['corpo','energia','ansiedade','sobrecarga']},
  {nome:'Dançar uma música inteira',emoji:'💃',unidade:'3×/semana',paraQue:'Soltar o corpo',grupo:'toque',texto:'Na sala, do jeito que sair. Ninguém está olhando.',dims:['corpo','prazer','energia']},
  {nome:'Fazer 10 minutos de exercício com vídeo',emoji:'💪',unidade:'3×/semana',paraQue:'Fortalecer meu corpo',grupo:'toque',texto:'Escolhe um vídeo curto e só segue. Não é sobre performance.',dims:['corpo','energia']}
]},{nome:'🎵 Música',musica:true,itens:[
  {nome:'Cantar 20 minutos',emoji:'🎤',unidade:'todo dia',paraQue:'Deixar a voz viva',grupo:'musica',texto:'Uma música, um exercício, o que der vontade.',dims:['prazer','autopercepcao','regulacao']},
  {nome:'Aquecer a voz com 15 minutos de vocalize',emoji:'🎵',unidade:'4×/semana',paraQue:'Cuidar do instrumento',grupo:'musica',texto:'Antes de cantar, ou só pra manter a voz em dia.',dims:['corpo','regulacao']},
  {nome:'Estudar uma música do repertório por 30 minutos',emoji:'📖',unidade:'3×/semana',paraQue:'Construir meu canto',grupo:'musica',texto:'Escolher uma música e quebrar em pedaços.',dims:['direcao','autopercepcao']}
]},{nome:'🌙 Ritmo de {nome}',cuidado:true,itens:[
  {nome:'Vestir {nome} de pijama pra dormir',rel:'crianca',emoji:'🌙',unidade:'toda noite',paraQue:'Cuidar da rotina {dela}',grupo:'aurora',texto:'Um gesto pequeno que muda a noite {dela} e a sua.',dims:['regulacao','corpo']},
  {nome:'Fazer {nome} dormir no horário combinado',rel:'crianca',emoji:'🌙',unidade:'só depois de 21 dias do pijama',paraQue:'Cuidar do sono {dela}',grupo:'aurora',texto:'Rotina boa se constrói degrau por degrau.',dims:['regulacao','corpo']},
  {nome:'Ler uma história pra {nome} antes de dormir',rel:'crianca',emoji:'📖',unidade:'3×/semana',paraQue:'Criar um momento nosso',grupo:'aurora',texto:'Poucos minutos de história e a noite fica mais mansa pra vocês.',dims:['conexao','regulacao']},
  {nome:'Brincar com {nome} sem celular',rel:'crianca',emoji:'🧸',unidade:'15 min, 1 vez ao dia',paraQue:'Estar presente de verdade',grupo:'aurora',texto:'Quinze minutos inteiros valem mais que uma tarde distraída.',dims:['conexao','prazer']},
  {nome:'Separar os remédios da semana de {nome}',rel:'idoso',emoji:'💊',unidade:'1×/semana',paraQue:'Cuidar da saúde {dela}',grupo:'aurora',texto:'Uma caixinha organizada tira um peso da cabeça de vocês.',dims:['sobrecarga','direcao']},
  {nome:'Tomar um café com {nome}, sem pressa',rel:'idoso',emoji:'☕',unidade:'2×/semana',paraQue:'Estar junto de verdade',grupo:'aurora',texto:'Sentar, conversar e não resolver nada. Só companhia.',dims:['conexao','prazer']},
  {nome:'Caminhar 10 minutos com {nome}',rel:'idoso',emoji:'🚶',unidade:'2×/semana',paraQue:'Mover o corpo junto',grupo:'aurora',texto:'Um passeio curto faz bem pro corpo de vocês.',dims:['corpo','conexao']},
  {nome:'Perguntar como {nome} dormiu',rel:'idoso',emoji:'🌤️',unidade:'1 vez ao dia',paraQue:'Acompanhar como {ela} está',grupo:'aurora',texto:'Uma pergunta simples que diz: eu estou vendo você.',dims:['conexao']},
  {nome:'Jantar com {nome} sem celular',rel:'par',emoji:'🍷',unidade:'2×/semana',paraQue:'Cuidar da nossa relação',grupo:'aurora',texto:'Uma refeição inteira olhando pra quem está na sua frente.',dims:['conexao','prazer']},
  {nome:'Perguntar como foi o dia de {nome} e ouvir até o fim',rel:'par',emoji:'💬',unidade:'1 vez ao dia',paraQue:'Escutar de verdade',grupo:'aurora',texto:'Ouvir sem já ir preparando a resposta.',dims:['conexao']},
  {nome:'Passar 30 minutos com {nome} sem tarefa nenhuma',rel:'outro',emoji:'🤍',unidade:'1×/semana',paraQue:'Estar junto de verdade',grupo:'aurora',texto:'Sem pressa, só companhia.',dims:['conexao','prazer']},
  {nome:'Organizar a semana de {nome}',rel:'outro',emoji:'🗓️',unidade:'1×/semana',paraQue:'Dar conta com menos aperto',grupo:'aurora',texto:'Ver a semana inteira de uma vez evita a correria do dia.',dims:['sobrecarga','direcao']},
  {nome:'Combinar com alguém de cuidar de {nome} por um período',rel:'todos',emoji:'🤝',unidade:'1×/semana',paraQue:'Não cuidar sozinha',grupo:'aurora',texto:'Dividir o cuidado também é cuidar.',dims:['sobrecarga','conexao']},
  {nome:'Tirar 15 minutos só pra mim enquanto {nome} descansa',rel:'todos',emoji:'🫖',unidade:'3×/semana',paraQue:'Cuidar de quem cuida',grupo:'aurora',texto:'Você também precisa de um intervalo.',dims:['sobrecarga','prazer']}
]}];
/* a categoria de cuidado muda conforme a relação com quem a pessoa cuida */
const REL_TIPO={filha:'crianca',filho:'crianca','mãe':'idoso',pai:'idoso','avó':'idoso','avô':'idoso','irmã':'outro','irmão':'outro',companheira:'par',companheiro:'par','outra pessoa':'outro'};
const REL_FEM=['filha','mãe','avó','irmã','companheira'],REL_MASC=['filho','pai','avô','irmão','companheiro'];
function musicaAtiva(){if(typeof S.musica==='boolean')return S.musica;return !!(S.perfilOriginal||(S.habitos||[]).some(h=>h.grupo==='musica'));}
function trocaCuidado(t){
  const n=nomeCuidado(),r=(S.cuidado&&S.cuidado.relacao)||'';
  const f=REL_FEM.includes(r),m=REL_MASC.includes(r);
  return String(t||'').replace(/\{nome\}/g,n).replace(/\{dela\}/g,f?'dela':m?'dele':'de '+n).replace(/\{ela\}/g,f?'ela':m?'ele':n);
}
/* fila sem os "que já foram seus": só o que faz sentido pra esta pessoa, com nomes já trocados */
function filaBase(){
  const tipo=cuida()?(REL_TIPO[S.cuidado.relacao]||'outro'):null;
  return FILA_CATEGORIAS
    .filter(c=>(!c.cuidado||tipo)&&(!c.musica||musicaAtiva()))
    .map(c=>c.cuidado?{...c,nome:trocaCuidado(c.nome),itens:c.itens.filter(i=>i.rel==='todos'||i.rel===tipo).map(i=>({...i,nome:trocaCuidado(i.nome),paraQue:trocaCuidado(i.paraQue),texto:trocaCuidado(i.texto)}))}:c);
}
function AREAS_INICIAIS(){
  return[
    {id:'patrimonio',nome:'🏠 Patrimônio',contraste:[],clareza:[]},
    {id:'carreira',nome:'💼 Carreira',contraste:[],clareza:[]},
    {id:'relMeu',nome:'💛 Relacionamento (meu)',contraste:[],clareza:[]},
    {id:'amizades',nome:'👥 Amizades',contraste:[],clareza:[]},
    {id:'bemestar',nome:'✨ Bem-estar',contraste:[],clareza:[]}
  ];
}
const AREAS_CONQUISTAS=[
  {id:'casa',emoji:'🏠',nome:'Casa'},
  {id:'trabalho',emoji:'💼',nome:'Trabalho'},
  {id:'corpo',emoji:'🫀',nome:'Corpo'},
  {id:'voz',emoji:'🎤',nome:'Voz e arte'}
];



const VERBO_PARA_SUBST={
  criar:{art:'a',s:'criação'},cuidar:{art:'o',s:'cuidado'},zelar:{art:'o',s:'zelo'},querer:{art:'o',s:'desejo'},
  crescer:{art:'o',s:'crescimento'},atrair:{art:'a',s:'atração'},amar:{art:'o',s:'amor'},
  organizar:{art:'a',s:'organização'},limpar:{art:'a',s:'limpeza'},estudar:{art:'o',s:'estudo'},
  meditar:{art:'a',s:'meditação'},proteger:{art:'a',s:'proteção'},educar:{art:'a',s:'educação'},
  construir:{art:'a',s:'construção'},melhorar:{art:'a',s:'melhoria'},ganhar:{art:'o',s:'ganho'},
  dormir:{art:'o',s:'sono'},acordar:{art:'o',s:'despertar'},trabalhar:{art:'o',s:'trabalho'},
  descansar:{art:'o',s:'descanso'},mover:{art:'o',s:'movimento'},caminhar:{art:'a',s:'caminhada'},
  dançar:{art:'a',s:'dança'},cantar:{art:'o',s:'canto'},escrever:{art:'a',s:'escrita'},
  ler:{art:'a',s:'leitura'},falar:{art:'a',s:'fala'},ouvir:{art:'a',s:'escuta'},
  aceitar:{art:'a',s:'aceitação'},permitir:{art:'a',s:'permissão'},decidir:{art:'a',s:'decisão'},
  escolher:{art:'a',s:'escolha'},mudar:{art:'a',s:'mudança'},viver:{art:'a',s:'vida'},
  sentir:{art:'o',s:'sentimento'},pensar:{art:'o',s:'pensamento'},confiar:{art:'a',s:'confiança'},
  valorizar:{art:'a',s:'valorização'},respeitar:{art:'o',s:'respeito'},amar:{art:'o',s:'amor'},
  nutrir:{art:'a',s:'nutrição'},alimentar:{art:'a',s:'alimentação'},fortalecer:{art:'o',s:'fortalecimento'},
  desenvolver:{art:'o',s:'desenvolvimento'},expandir:{art:'a',s:'expansão'},abrir:{art:'a',s:'abertura'},
  fechar:{art:'o',s:'fechamento'},guardar:{art:'a',s:'guarda'},manter:{art:'a',s:'manutenção'},
  arrumar:{art:'a',s:'arrumação'},varrer:{art:'a',s:'varrição'},lavar:{art:'a',s:'lavagem'},
  pagar:{art:'o',s:'pagamento'},economizar:{art:'a',s:'economia'},investir:{art:'o',s:'investimento'},
  atrair:{art:'a',s:'atração'},gostar:{art:'o',s:'gosto'},celebrar:{art:'a',s:'celebração'},
  perdoar:{art:'o',s:'perdão'},agradecer:{art:'o',s:'agradecimento'},honrar:{art:'a',s:'honra'}
};

function contrairDe(resto){
  const r=String(resto||'').trim();
  if(!r)return '';
  // já tem preposição (pelo, para, com, em…) — não adicionar "de"
  if(/^(pelo|pela|pelos|pelas|por|para|com|sem|em|no|na|nos|nas|ao|à|aos|às)\b/i.test(r)) return ' '+r;
  if(/^(o|os)\b/i.test(r)) return ' d'+r; // do, dos
  if(/^(a|as)\b/i.test(r)) return ' d'+r; // da, das
  if(/^(um|uns|uma|umas)\b/i.test(r)) return ' de '+r;
  if(/^(meu|meus|teu|teus|seu|seus)\b/i.test(r)) return ' do '+r;
  if(/^(minha|minhas|tua|tuas|sua|suas)\b/i.test(r)) return ' da '+r;
  return ' de '+r;
}
/** Clareza em verbo → {art, subst, resto} */
function decomporNucleo(t){
  let s=limparTextoDesejo(t)||String(t||'').trim();
  if(!s)return{art:'o',subst:'desejo',resto:''};
  // já veio como "o zelo pelo X" / "a decisão de Y"
  const ja=s.match(/^(o|a|os|as)\s+([a-záàâãéêíóôõúç]+)\b([\s\S]*)$/i);
  if(ja){
    return{art:ja[1].toLowerCase(),subst:ja[2].toLowerCase(),resto:(ja[3]||'').trim()};
  }
  // infinitivo no começo
  const m=s.match(/^([a-záàâãéêíóôõúç]+(?:ar|er|ir|or))\b([\s\S]*)$/i);
  if(m){
    const verbo=m[1].toLowerCase();
    const resto=m[2].trim();
    let art,subst;
    if(typeof VERBO_PARA_SUBST!=='undefined' && VERBO_PARA_SUBST[verbo]){
      art=VERBO_PARA_SUBST[verbo].art;subst=VERBO_PARA_SUBST[verbo].s;
    } else if(/ar$/i.test(verbo)){
      const stem=verbo.slice(0,-2);
      art='a';subst=stem.endsWith('c')?stem.slice(0,-1)+'ção':stem+'ação';
    } else if(/er$/i.test(verbo)){
      art='o';subst=verbo.slice(0,-2)+'imento';
    } else if(/ir$/i.test(verbo)){
      art='a';subst=verbo.slice(0,-2)+'ição';
    } else {
      return{art:'o',subst:s.toLowerCase(),resto:''};
    }
    return{art,subst,resto};
  }
  // substantivo solto / frase livre
  return{art:'',subst:s.charAt(0).toLowerCase()+s.slice(1),resto:''};
}
/** "zelar pelo patrimônio" → "o zelo ideal pelo patrimônio" */

function nucleoParaUsar(d){
  const manual=(d&&d.nucleo||'').trim();
  if(manual){
    let s=manual;
    if(!/\bideal\b/i.test(s)){
      const m=s.match(/^(o|a|os|as)\s+([a-záàâãéêíóôõúç]+)([\s\S]*)$/i);
      if(m) s=(m[1].toLowerCase()+' '+m[2].toLowerCase()+' ideal'+(m[3]||'')).replace(/\s+/g,' ').trim();
    }
    return s.charAt(0).toLowerCase()+s.slice(1);
  }
  return formatarNucleoIdeal((d&&d.texto)||'');
}

function formatarNucleoIdeal(t){
  // desejo que começa com verbo fica do jeito que foi escrito ("ter tempo pra mim")
  const limpo=(limparTextoDesejo(t)||String(t||'').trim());
  // e frase sem artigo também ("tempo pra mim"); só "o/a ..." ganha o "ideal"
  if(limpo&&!/^(o|a|os|as)\s/i.test(limpo))
    return limpo.charAt(0).toLowerCase()+limpo.slice(1);
  const {art,subst,resto}=decomporNucleo(t);
  const comp=resto?(resto.match(/^(pelo|pela|pelos|pelas|por|para|com|sem|em|no|na|do|da|dos|das|de)\b/i)?(' '+resto):(contrairDe(resto))):'';
  if(art) return (art+' '+subst+' ideal'+comp).replace(/\s+/g,' ').trim();
  return (subst+' ideal'+comp).replace(/\s+/g,' ').trim();
}
function limparTextoDesejo(t){
  let s=String(t||'').trim();
  s=s.replace(/^(estou em processo de|estou no processo de|adoro a ideia de|adoro saber que|adoro a sensação de quando|adoro me ver|estou animado\(a\) com a ideia de|eu decidi|cada vez mais|me anima|muitas coisas podem acontecer para|amo a ideia de|me faz bem pensar em|eu escolho|fico feliz em|tenho vontade de|estou aprendendo a|hoje eu me permito|eu mereço|amo saber que posso|amo a ideia de|me sinto feliz ao imaginar que posso|é tão bom saber que posso|me empolga pensar em|amo sentir que posso|sinto alegria em|eu estou em processo de|a cada dia, de todas as formas, eu me abro mais para)\s*/i,'');
  s=s.replace(/\s+/g,' ').trim();
  if(s) s=s.charAt(0).toUpperCase()+s.slice(1);
  return s;
}

