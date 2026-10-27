# Trilha guiada da aba Atração: documentação para integração

Para: Thiago. De: Érica. Arquivos: `index.html` (só o esqueleto e os links), as pastas novas `atracao/` (`atracao.js`, `atracao.css`) e `mascote/` (a gatinha) e `scripts/atualizar-mascote.sh`, este documento e uma seção no README.

## O que é

A aba Atração agora é uma trilha de 7 sessões em tela cheia, no visual de aquarela com a gatinha, uma ideia por tela. Os textos vêm do documento revisado à mão pela Érica (tom de sessão de terapia, com os mantras completos; a sessão Olhar com outros olhos vem do protótipo) e todas as funções do app continuam: criar desejo, montar a declaração com prefixos, anotar a dúvida, guardar a frase no Livro de Permissões, registrar sinais, escolher o menor passo e virar hábito.

O visual usa as variáveis de cor que o app já tem (`--bg`, `--txt`, `--b`, `--borda`, `--surf-mid`, `--modal-1/2`, `--tabs-bg`, `--aquarela`), então claro e escuro funcionam sem trabalho extra. A aquarela das capas e miniaturas é gerada por código (`svAquarela`), sem imagens. A gatinha é a do repositório Aurora2D/Mascote (componente `<gatinha-fantoche>`, peças em aquarela que se mexem). Uma cópia fica em `mascote/` (`fantoche.js` e `assets/pecas/`; a versão copiada está em `mascote/VERSAO.txt`). Para trazer as novidades dela: `sh scripts/atualizar-mascote.sh` e depois commit da pasta `mascote/`. Ninguém edita `mascote/` à mão, a Érica evolui a gatinha no repositório dela.

## As sessões

| # | id | Função | O que grava |
|---|---|---|---|
| 1 | abertura | `sessaoAbertura` | nada |
| 2 | sair | `sessaoDeixarSair` | `S.leiAtracao.contrastes[]` (o desabafo) |
| 3 | olhar | `sessaoOlhar` (3 telas: reler, escolher um incômodo, frase e origem) | `contraste.camadas = {escolhido, frase, origem}`; o que a pessoa quer no lugar fica para a Clareza |
| 4 | clareza | `sessaoClareza` | cria o desejo (`novoDesejo`), área, `desejo.camadas = {pedido, origem, importa}`, remove o contraste da fila |
| 5 | declaracao | `sessaoDeclaracao(d)` | `desejo.corpo[]` (prefixos e textos editáveis), `desejo.sensacao`; botão que chama `habitoLerDeclaracao` |
| 6 | permissao | `sessaoPermissao(d)` (4 etapas: escutar o receio, olhar com curiosidade, nova perspectiva, dar espaço) | `desejo.gravetos[]` com `duvida`, `origem`, `seFosse`; `graveto.alivio`, `solto`, `soltoEm` (vai para o Livro de Permissões); `desejo.evidencias[]`; atalho que abre o Livro |
| 7 | passo | `sessaoMenorPasso(d)` | `desejo.menorPassos[]`, `desejo.menorPasso`; botão que chama `virarDesejoEmHabito` |

Quem escolhe o menor passo é a pessoa: os exemplos na tela são só texto, nada é sugerido ou preenchido.

"Retomar dúvida" e "Anotar e trabalhar agora" abrem a Permissão direto na etapa 3 (`sessaoPermissaoNaFrase(d, graveto)`).

Ferramentas na mesma tela cheia, abaixo da trilha: `sessaoMeusDesejos` e `sessaoDesejoHub(d)` (abrir cada etapa, editar o texto, soltar, apagar), `sessaoMeusDesabafos` e `sessaoDesabafo(c)`, `sessaoDeclaracaoCompleta` (a declaração com todos os desejos juntos, que usa `montarDeclaracaoTodos`; aparece como card na aba, no topo de Meus desejos e na última tela da Declaração), `sessaoDuvidaRapida` (anotar sem precisar de nada antes, com a opção de trabalhar a dúvida na hora).

## Aba Atração dentro das sessões

Os três botões antigos (Clareza, Declaração, Permissão, `#atracaoMenu`) saíram da aba. O que cada um fazia agora é sessão:

| Antes (popup) | Agora |
|---|---|
| Novo contraste | `sessaoDeixarSair` |
| Lista de contrastes, processar, apagar | `sessaoMeusDesabafos`, `sessaoDesabafo(c)` |
| Desejo sem contraste | `sessaoClareza({livre:true})` |
| Lista de desejos, abrir, editar, soltar, apagar | `sessaoMeusDesejos`, `sessaoDesejoHub(d)` |
| Lista de declarações | `sessaoDeclaracao(d)` |
| Dúvida rápida e lista de dúvidas | `sessaoDuvidaRapida`, "Retomar dúvida" no hub do desejo |

`irParaDeclaracao()` abre a sessão de declaração. Os popups antigos das seções (Clareza, Declaração, Permissão, contrastes, desejo direto) saíram do código na faxina de 27/out/2026. O modal antigo do desejo (`abrirDesejo`) continua, porque ainda é aberto pelo Livro de Permissões, pela tela Hoje e pelo virar desejo em hábito.

## Estilo geral (serifada)

Os títulos do app todo usam a Cormorant Garamond, a mesma do logo. O arquivo é `estilo/app.css` e a fonte fica em `estilo/fontes/` (funciona sem internet). Para mudar a fonte dos títulos, troque `--serif` nesse arquivo. A saudação do topo ficou numa frase só.

## Gatinha nos relatórios

No resumo da semana/mês e no retrato dos 21 dias a gatinha aparece no topo (`gatinhaRel()` em `estilo/gatinha-relatorio.js`, chamada em `mostrarResumo` e `abrirRelatorioCompleto`). No PDF ela sai junto, porque o canvas imprime como imagem. Fora da trilha e dos relatórios ela não aparece.

## Cache do navegador

Os arquivos ligados no `index.html` levam `?v=20261021s` no endereço. Quando mudar qualquer arquivo de `estilo/`, `atracao/` ou `mascote/`, troque esse valor em todos os links para o navegador buscar a versão nova. A gatinha dos relatórios também tem o tamanho definido no próprio código, para nunca ficar gigante se o CSS ainda estiver em cache.

## Onde está o código

Princípio: função nova entra como arquivo à parte e o `index.html` só a liga por link, em vez de receber centenas de linhas. Assim há menos chance de bug e o arquivo grande fica mais fácil de manter.

- `atracao/atracao.js`: motor, sessões, ferramentas. Carregado no fim do `index.html` (`<script src="atracao/atracao.js">`), depois do script principal, e usa as globais dele (`S`, `salva`, `$`, `esc`...).
- `atracao/atracao.css`: estilos `sv-*`, carregado no `<head>`.
- `mascote/`: cópia da gatinha (Aurora2D/Mascote), atualizada pelo script.
- No `index.html` ficam só: os dois links, o markup de `#sessaoModal`, o cabeçalho da aba (`#btnComoFunciona`, `#atrSessoes`) e `irParaDeclaracao()`.
- As pastas `atracao/`, `mascote/` e `estilo/` precisam ir junto com o `index.html` no app (como `audio/` e `logo/`).

## A gatinha reage ao que a pessoa faz

No `atracao.js` o app só usa a API dela: `svMascote()` cria o `<gatinha-fantoche>` e `svReage('acao')` toca uma ação (`cat.play`). As reações ficam em um lugar só, para trocar fácil:

- `MASCOTE_ENTRADA`: o que ela faz quando a sessão abre (abertura: tchau; sair: suspirar; clareza: curiosa; permissão e menor passo: feliz).
- Pose: o campo `mascote` de cada sessão vira a pose da gatinha. A Permissão já tem pose própria (patinhas no peito); as outras ainda não existem e por isso aparecem com a pose sentada, sem quebrar.
- `reage:'acao'` em uma tela: o que ela faz ao chegar nela (Deixar sair guardado: suspirar; desejo criado e frase de permissão: brilho; menor passo guardado: feliz). Sem `reage`, ela balança a cabeça dizendo sim ao avançar.
- "Sim, faz bem" na declaração: feliz. "Transformar em hábito": brilho. Enquanto a pessoa escreve, as orelhas mexem de tempos em tempos. Tocar na gatinha da capa faz ela reagir.
- Nas telas de dentro ela espia no canto da faixa de cima; na primeira tela da sessão aparece inteira.

Quando a Érica criar ações ou poses novas, basta usar o nome novo nesses pontos. Se o motor da gatinha não carregar, as sessões funcionam sem ela.

## Como o motor funciona

`#sessaoModal` virou uma tela cheia (`.sessao-view`): barra de cima com X e pontinhos, conteúdo, barra de baixo fixa com Voltar e Continuar (ou Concluir na última tela).

Uma sessão é um objeto: `{id, kicker, titulo, afirma, mascote, limpar:[...], pular:{rot,ate}, telas:[...]}`. Cada tela é uma lista de blocos ou um objeto `{b:[blocos], seguir:fn, botoes:[...], semVoltar}`:

```
['p',txt] ['pergunta',txt] ['sub',txt] ['fecho',txt] ['chips',[...]] ['cuidado',txt]
['atalho',{rot,acao}]  ['lembrete',{titulo,texto:fn}]  ['campo',{key,rot,dica,opcional,grande,ph}]
['html', string|fn, bind?]
```

- `seguir` roda ao tocar em Continuar. Se devolver `false`, não avança (usado para exigir texto e gravar no modelo).
- `botoes` troca o botão Continuar (usado na tela "Tenho dúvida / Sim, faz bem").
- Para editar um texto, mexa nas listas de blocos dentro de cada função `sessaoXxx`, em `atracao/atracao.js`.

## Mudanças no modelo de dados (atenção)

- Novo: `S.leiAtracao.trilha = { feitas:{id:'done'|'skipped'}, tela:{id:n}, rasc:{rascunhos}, foco:{contrasteId, desejoId, gravetoId} }`, criado sob demanda por `trEst()`. Guarda o progresso, onde a pessoa parou, o que ela estava escrevendo e em que desejo está trabalhando.
- `desejo.camadas` passa a ser `{pedido, origem, importa}`. Antes era `{medo, pedido}`. Nada no app lia `medo`, mas confira se algum outro lugar seu usa.
- `contraste.camadas = {pedido, origem}` é novo.
- `graveto.origem` e `graveto.seFosse` são novos (opcionais). Gravetos antigos continuam válidos.
- Nenhuma chave nova no localStorage (`batomRisadaV23`).

## Dependências de funções do app

`novoDesejo`, `desejosAtivos`, `limparTextoDesejo`, `montarDeclaracao`, `MODELOS_CORPO`, `sugerirPermissoes`, `paraInfinitivoSugestao`, `virarDesejoEmHabito`, `habitoLerDeclaracao`, `renderLivroPermissoes`, `renderAtracaoTudo`, `mostrarToast`, `confete`, `trocaAba`, `abrirOverlay`, `fecharOverlay`, `salva`, `$`, `esc`, `hoje`.

`renderDeclaracaoMontada` não existe mais no repo, então criei `trDeclHTML` (usa `montarDeclaracao`).

## Testado e não testado

Testado (Chromium headless, claro e escuro, 390x800): as 7 sessões de ponta a ponta com gravação no modelo, prefixos e edição inline da declaração, "Tenho dúvida", sugestões de permissão, Livro, evidência, menor passo virando hábito, Meus desejos (editar, soltar, apagar), Meus desabafos, dúvida rápida, escolha entre vários desejos, retomar uma sessão do ponto onde parou. Sem erros de página.

Não testado: WebView real do Android, teclado do celular sobre os campos, sons.

## Decisões em aberto da Érica

1. **Decidido (23/out/2026):** as sessões abrem uma de cada vez. As seguintes ficam à vista, bem apagadas e com cadeado; tocar balança o card e diz qual vem antes. Sessão já concluída fica aberta para sempre, então quem volta para um segundo desejo não fica travada. (Antes: todas as sessões ficavam liberadas.) O protótipo bloqueava as seguintes até terminar a anterior. Deixei liberado porque quem já tem desejos, ou volta para um segundo desejo, ficaria travada. O card da próxima sessão aparece destacado.
2. A tela "Em que parte da sua vida mora esse desejo?" (escolha da área) não está no protótipo, foi acrescentada porque o app precisa da área.
3. Os mantras são os completos do documento. Nos cards da trilha aparecem cortados em 2 linhas (CSS); na sessão aparecem inteiros.
4. A retirada do "quero" no começo do desejo (`trSemQuero`) hoje está só na trilha. Pode fazer sentido mover para `limparTextoDesejo`.

## Mensagem curta para a Érica enviar

> Thiago, atualizei a trilha da Atração na main do DIVA com o novo visual (aquarela, gatinha, telas cheias). Mexi no index.html (só links e esqueleto) e criei a pasta atracao/. A explicação está em docs/TRILHA_ATRACAO.md, vale ler a parte "Mudanças no modelo de dados".

## Carta do mapa emocional (relatório dos 21 dias)

O relatório dos 21 dias agora é uma carta em texto corrido, com as barras só no final ("Seus números, para olhar com calma").
- `relatorio/carta.js`: função pura `montarCartaRelatorio(dados)`. Recebe mapa, ciclo anterior, cruzamentos do check-in e hábitos, e devolve os blocos de texto e as barras. O tom muda conforme o ciclo (leve, misto, pesado). Para mudar a voz, é só editar os textos desse arquivo.
- `relatorio/carta-app.js`: liga a carta ao app (junta os dados e desenha o HTML). Se algo falhar, o app mostra o relatório antigo.
- Quando sobrecarga e ansiedade estão muito altas, a carta sugere conversar com alguém de confiança (amiga, família ou quem ela preferir).
- O arquivo único (`DIVA-index-com-trilha.html`) é gerado por `python3 scripts/gerar-arquivo-unico.py`, que embute CSS, JS, fontes e a gatinha.
- `relatorio/guarda-chuva.js`: desenha o gráfico "guarda-chuva" (um gomo por dimensão, cor por grupo, ciclo anterior tracejado). Usado em `carta-app.js` no lugar das 9 barras.
- Os cruzamentos do check-in com o mapa aparecem em "De onde o cansaço vem": para cada peso do mapa (sobrecarga, ansiedade, energia, corpo, regulação), de onde ele não vem e de onde vem junto. Os dados saem de `barras.eliminacao` em `relatorio/carta.js`.
- A carta também traz: uma frase de destaque no começo, uma tendência quando há 3 ou mais ciclos seguidos na mesma direção, a gatinha com ação conforme o tom do ciclo (pesado: sim, misto: curiosa, leve: pular) e o botão "Quero tentar esse gesto", que cria o hábito pelo `adicionarHabitoFila` respeitando a regra de um hábito novo por vez (`ligarBotoesCarta` em `relatorio/carta-app.js`).

## Como o código está dividido
O `index.html` ficou só com a estrutura da tela e o CSS. O JavaScript do app está na pasta `app/`, em arquivos carregados nesta ordem (a ordem importa):
`base` (utilitários e bancos de texto), `atracao-dados`, `cuidado-premios`, `estado` (estado inicial e onboarding), `hoje`, `checkin`, `habitos`, `atracao-app`, `resumos`, `mapa` (mapa emocional e relatório), `celebrar`, `abas` (abas que abrem aos poucos), `atracao-extras`, `estilo-autocuidado`, `final` (troca de emojis por ícones) e `iniciar` (liga tudo ao abrir o app, roda por último).
Regra: o que roda na hora em que o app abre fica em `iniciar.js`. Se uma parte nova usar uma função de outra no carregamento, a outra precisa vir antes na lista dos `<script>` do `index.html`.

## Abas que abrem aos poucos
`app/abas.js`. Quem chega novo vê só Hoje. Check-in abre depois de 3 dias com um hábito, Mapa depois de 7, Celebrar depois do primeiro mapa, e a Atração na abertura seguinte do app (para não chegarem duas telinhas juntas; o horário de cada desbloqueio fica em `S.abasLiberadasEm`). Cada uma chega com uma telinha "Você desbloqueou..." com a gatinha dando um pulinho (`#abaBoasVindasModal`). Quem já usava o app antes continua vendo tudo, e em Configurações existe "Mostrar todas as abas". Para mudar as regras ou os textos, é só editar `ABAS_REGRAS` no começo do arquivo.

## Boas-vindas da Diva

O começo do app é curto (markup em `index.html`, lógica em `mostrarOnbPasso`, `app/estado.js`): nome com a gatinha acenando, se cuida de alguém, uma frase só para quem cuida, "Como funciona" (com a opção de música) e "Vamos começar", que já adiciona o primeiro hábito (beber água). As seis telas de apresentação da gatinha ficam em `app/boas-vindas.js` e `estilo/boas-vindas.css` e hoje só aparecem em Configurações > Conhecer a Diva. Os textos ficam em `BV_TELAS`, no começo do arquivo.

## Sugestões de hábitos para o público geral

Em `app/base.js`: a categoria de cuidado (`FILA_CATEGORIAS`, `cuidado:true`) tem hábitos por tipo de relação (`rel`: criança, idoso, par, outro, todos) e concorda no gênero (`trocaCuidado`, tokens `{nome}`, `{dela}`, `{ela}`). A categoria Arte e prazer é para todo mundo; Música (`musica:true`) só aparece para quem respondeu "Você canta ou toca?" no começo ou ligou em Configurações (`musicaAtiva()`). `filaBase()` monta a fila já filtrada.

## Que bom você de volta

`app/de-volta.js` (estilos no fim de `estilo/boas-vindas.css`). Substitui o diálogo antigo de quem fica 14 dias ou mais sem abrir o app (chamado em `avisosIniciais`, `app/resumos.js`). Nunca cobra hábito: a gatinha acena, reconhece que a vida ocupou a pessoa e convida pra algo leve conforme o que já está aberto (check-in, mapa, ou só os hábitos, com a frase de que uma parte nova espera por ela). No rodapé, discreto: "Pausar meus hábitos por enquanto" (pausa todos, marca `h.pausaGeral` e `S.pausaGeralEm`) e "Revisar hábitos". Textos em `DV_TEXTOS`.

## O prêmio virou prática, e o Celebrar virou o caminho

`app/premio-pratica.js` (carregado depois de `habitos.js`, `celebrar.js` e `hoje.js`; só substitui funções deles). Base: a celebração funciona colada na ação (BJ Fogg, Tiny Habits), e prêmio acumulado vira peso.

- Comemoração: aparece a cada hábito marcado (`celebraToastTexto`). Escolhe-se em Configurações > Minha comemoração.
- Marcos de 3, 7 e 21 dias: sem pergunta de contexto e sem cardápio. O app diz "Hoje você merece uma das suas práticas" e sorteia uma das práticas do check-in (`S.praticas`, peso pelo estilo de autocuidado). "Vou fazer agora" marca a prática no check-in do dia; "Hoje não" fecha sem guardar nada. A festa dos 21 dias segue a mesma regra.
- Aba Celebrar: "Meu caminho" (marcos de cada hábito e mapas feitos, montado automaticamente) e o Livro de Conquistas. Prêmios guardados só aparecem se ainda houver algum antigo. Cardápio, "quando der" e o card antigo da comemoração saíram do código na faxina de 27/out/2026 (a comemoração fica em Configurações).

## Teste de estilo de autocuidado (as 5 linguagens)

`app/estilo-autocuidado.js`. 30 perguntas, cada uma com uma alternativa de cada estilo (A palavras, B tempo, C presentes, D serviço, E toque); os ids batem com `PRATICAS_CATALOGO`, `ESTILO_PRATICAS` e `ESTILO_PALAVRAS_CHAVE`. Ao terminar, o check-in ganha práticas do estilo principal (até 8) e do secundário (até 5), que sobem para o topo, e o sorteio da prática nos marcos pesa 3 (principal), 2 (secundário) e 1 (demais). Em listas de práticas antigas, o estilo de cada grupo sai do nome (`estiloDoGrupo` em `app/premio-pratica.js`); grupos que não são de autocuidado, como Treino vocal, ficam fora do sorteio.

A pergunta "Você canta ou toca?" saiu do começo: virou um cartão nas sugestões, logo depois de Tempo de qualidade (`btnMostrarMusica` em `app/habitos.js`).

## As cinco linguagens em todo o app

Hábitos (tela Hoje e sugestões), práticas do check-in e o teste usam os mesmos nomes: 💌 Palavras de afirmação, ⏳ Tempo de qualidade, 🎁 Presentes, 🛠️ Atos de serviço e 🤍 Toque físico. Ids dos grupos de hábito: `palavras`, `tempo`, `presentes`, `servico`, `toque` (`GRUPOS` em `app/base.js`). Ficam à parte só Primeiros passos (porta de entrada, nas sugestões), Música (opcional) e Ritmo de quem você cuida.

`app/linguagens.js` converte uma vez o que estava guardado com nomes antigos (grupos de práticas, chaves `grupo|item` dos check-ins, categorias dos hábitos; marca `S.linguagensMigradas`). Os ids antigos (`corpo`, `rituais`, `mente`, `arte`, `lar`) continuam aceitos via `GRUPO_ALIAS`, para partes do código que ainda criem hábitos com eles.

## O quiz vira práticas

`app/quiz-praticas.js` (depois de `premio-pratica.js`). O quiz agora guarda cada resposta (`S.estiloAutocuidado.respostas`, letras A-E na ordem das perguntas). Ao terminar, antes do resultado, ela vê as respostas que são gestos possíveis (`quizAbrirRevisao`) e desmarca o que não combina; as marcadas viram práticas no grupo "🪞 Escolhidas por você no quiz" (textos em `QUIZ_PRATICAS`, por pergunta e alternativa), que fica no topo do check-in. Também são usadas:
- nota baixa no "Como estou hoje" → sugere a resposta do momento certo (`QUIZ_NOTA`: disposição física → pergunta 11, mental → 1, autoconfiança → 4, casa → 20; humor → 12 e calma → 14 já estão prontos para quando essas notas existirem);
- marcos de 3, 7 e 21 dias → o mimo sai dessa lista, com peso 4 para as respostas sobre comemorar (perguntas 2, 6, 8, 15 e 21);
- dicas dos hábitos de água, leitura e movimento (perguntas 16 a 18, `QUIZ_DICAS`);
- pergunta do campo Observações (24) e frase-guia no resultado (25).
No resultado, "Rever quais entram" reabre essa escolha. Quem fez o quiz antes disso (sem respostas guardadas) vê no check-in o convite "Refazer o quiz". O tom do quiz também entra nas mensagens: 9 (o lembrete escolhido aparece às vezes na frase do topo da tela Hoje), 29 (num dia sem nota baixa, o check-in faz um convite do tipo que ela pediu), 10 e 30 (mensagens dos marcos de 7 e 21 dias) e 23 (tela de volta depois de um tempo longe).

## Como estou hoje

Notas do check-in: seis pra todo mundo (Disposição física, Disposição mental, Humor, Calma, Casa em ordem, Autoconfiança) e, pra quem canta ou toca, dança, belting e canto lírico (`escalasHoje()` em `app/base.js`). `ESCALAS` guarda também as antigas (organização e limpeza do lar) pra mostrar o histórico. Ligar ou desligar a música refaz o check-in (`ciRemontar` em `app/checkin.js`).

## Faxina (27/out/2026)

Saiu do código o que nenhuma tela usava mais, sem mudar nada do que aparece no app:
- popups antigos da Atração (seções Clareza, Declaração e Permissão, contraste, lista de contrastes, processar contraste, desejo direto, menu do desejo) e as listas escondidas que eles desenhavam;
- a parte escondida do Celebrar (`#celebrarAntigo`: cardápio de prêmios, lista de prêmios, "quando der", card da comemoração) e os popups de prêmio novo e de editar prêmio;
- as versões antigas das funções que `app/premio-pratica.js`, `app/quiz-praticas.js` e outras partes já substituíam (`premiosDoContexto`, `sortearPremioCtx`, `procurarPremio`, `abrirContextoPremio`, `celebraToastTexto`, `quizCardAtualizar`);
- funções e listas soltas que ninguém chamava.

Os dados guardados não mudaram (`S.premios`, `S.quandoDer` etc. continuam no estado, só não têm mais tela). Prêmios guardados antigos continuam aparecendo no Celebrar enquanto existirem.

Conserto junto: a linha "Conhecer a Diva" em Configurações não fazia nada ao tocar; agora abre as telas de apresentação da gatinha (`boasVindasDiva`).
