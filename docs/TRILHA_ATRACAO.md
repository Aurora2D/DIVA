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
| 3 | olhar | `sessaoOlhar` | `contraste.camadas = {pedido, origem}` |
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

`irParaDeclaracao()` abre a sessão de declaração. O HTML antigo dos popups (`secClarezaContent` etc.) e o modal antigo do desejo (`abrirDesejo`) continuam no arquivo, sem botão que leve a eles, para você remover quando quiser. Qualquer outro ponto do app que chame `abrirDesejo(id, passo)` ainda abre o modal antigo.

## Estilo geral (serifada)

Os títulos do app todo usam a Cormorant Garamond, a mesma do logo. O arquivo é `estilo/app.css` e a fonte fica em `estilo/fontes/` (funciona sem internet). Para mudar a fonte dos títulos, troque `--serif` nesse arquivo. A saudação do topo ficou numa frase só.

## Gatinha nos relatórios

No resumo da semana/mês e no retrato dos 21 dias a gatinha aparece no topo (`gatinhaRel()` em `estilo/gatinha-relatorio.js`, chamada em `mostrarResumo` e `abrirRelatorioCompleto`). No PDF ela sai junto, porque o canvas imprime como imagem. Fora da trilha e dos relatórios ela não aparece.

## Cache do navegador

Os arquivos ligados no `index.html` levam `?v=20261021l` no endereço. Quando mudar qualquer arquivo de `estilo/`, `atracao/` ou `mascote/`, troque esse valor em todos os links para o navegador buscar a versão nova. A gatinha dos relatórios também tem o tamanho definido no próprio código, para nunca ficar gigante se o CSS ainda estiver em cache.

## Onde está o código

Princípio: função nova entra como arquivo à parte e o `index.html` só a liga por link, em vez de receber centenas de linhas. Assim há menos chance de bug e o arquivo grande fica mais fácil de manter.

- `atracao/atracao.js`: motor, sessões, ferramentas. Carregado no fim do `index.html` (`<script src="atracao/atracao.js">`), depois do script principal, e usa as globais dele (`S`, `salva`, `$`, `esc`...).
- `atracao/atracao.css`: estilos `sv-*`, carregado no `<head>`.
- `mascote/`: cópia da gatinha (Aurora2D/Mascote), atualizada pelo script.
- No `index.html` ficam só: os dois links, o markup de `#sessaoModal`, o cabeçalho da aba (`#btnComoFunciona`, `#atrSessoes`) e `irParaDeclaracao()`.
- As pastas `atracao/`, `mascote/` e `estilo/` precisam ir junto com o `index.html` no app (como `audio/` e `logo/`).

## A gatinha reage ao que a pessoa faz

No `atracao.js` o app só usa a API dela: `svMascote()` cria o `<gatinha-fantoche>` e `svReage('acao')` toca uma ação (`cat.play`). As reações ficam em um lugar só, para trocar fácil:

- `MASCOTE_ENTRADA`: o que ela faz quando a sessão abre (abertura: tchau; sair: suspirar; clareza e permissão: curiosa; menor passo: feliz).
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

1. Todas as sessões ficam liberadas (a pessoa pode abrir qualquer uma). O protótipo bloqueava as seguintes até terminar a anterior. Deixei liberado porque quem já tem desejos, ou volta para um segundo desejo, ficaria travada. O card da próxima sessão aparece destacado.
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
- `relatorio/guarda-chuva.js`: desenha o gráfico "guarda-chuva" (um gomo por dimensão, cor por grupo, ciclo anterior tracejado). Usado em `carta-app.js` no lugar das 9 barras.
- Os cruzamentos do check-in com o mapa aparecem em "De onde o cansaço vem": para cada peso do mapa (sobrecarga, ansiedade, energia, corpo, regulação), de onde ele não vem e de onde vem junto. Os dados saem de `barras.eliminacao` em `relatorio/carta.js`.
