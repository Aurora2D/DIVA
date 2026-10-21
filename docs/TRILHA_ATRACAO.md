# Trilha guiada da aba Atração: documentação para integração

Para: Thiago. De: Érica. Arquivo alterado: `index.html` (mais este documento e uma seção no README).

## O que é

A aba Atração agora é uma trilha de 8 sessões em tela cheia, no visual de aquarela com a gatinha, uma ideia por tela. Os textos vêm do protótipo "Trilha da Atração" (em tom de sessão de terapia) e todas as funções do app continuam: criar desejo, montar a declaração com prefixos, anotar a dúvida, guardar a frase no Livro de Permissões, registrar sinais, escolher o menor passo e virar hábito.

O visual usa as variáveis de cor que o app já tem (`--bg`, `--txt`, `--b`, `--borda`, `--surf-mid`, `--modal-1/2`, `--tabs-bg`, `--aquarela`), então claro e escuro funcionam sem trabalho extra. A aquarela das capas e miniaturas é gerada por código (`svAquarela`), sem imagens. A gatinha é uma imagem WebP embutida (`SESSAO_GATA`, cerca de 100 KB).

## As sessões

| # | id | Função | O que grava |
|---|---|---|---|
| 1 | abertura | `sessaoAbertura` | nada |
| 2 | sair | `sessaoDeixarSair` | `S.leiAtracao.contrastes[]` (o desabafo) |
| 3 | olhar | `sessaoOlhar` | `contraste.camadas = {pedido, origem}` |
| 4 | clareza | `sessaoClareza` | cria o desejo (`novoDesejo`), área, `desejo.camadas = {pedido, origem, importa}`, remove o contraste da fila |
| 5 | declaracao | `sessaoDeclaracao(d)` | `desejo.corpo[]` (prefixos e textos editáveis), `desejo.sensacao`; botão que chama `habitoLerDeclaracao` |
| 6 | permissao1 | `sessaoPermissao1(d)` | `desejo.gravetos[]` com `duvida`, `origem`, `seFosse` |
| 7 | permissao2 | `sessaoPermissao2(d)` | `graveto.alivio`, `solto`, `soltoEm` (vai para o Livro de Permissões), `desejo.evidencias[]`; atalho que abre o Livro |
| 8 | passo | `sessaoMenorPasso(d)` | `desejo.menorPassos[]`, `desejo.menorPasso`; botão que chama `virarDesejoEmHabito` |

Quem escolhe o menor passo é a pessoa: os exemplos na tela são só texto, nada é sugerido ou preenchido.

Ferramentas na mesma tela cheia, abaixo da trilha: `sessaoMeusDesejos` e `sessaoDesejoHub(d)` (abrir cada etapa, editar o texto, soltar, apagar), `sessaoMeusDesabafos` e `sessaoDesabafo(c)`, `sessaoDuvidaRapida` (anotar sem precisar de nada antes, com a opção de trabalhar a dúvida na hora).

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
- Para editar um texto, mexa nas listas de blocos dentro de cada função `sessaoXxx`.

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

Testado (Chromium headless, claro e escuro, 390x800): as 8 sessões de ponta a ponta com gravação no modelo, prefixos e edição inline da declaração, "Tenho dúvida", sugestões de permissão, Livro, evidência, menor passo virando hábito, Meus desejos (editar, soltar, apagar), Meus desabafos, dúvida rápida, escolha entre vários desejos, retomar uma sessão do ponto onde parou. Sem erros de página.

Não testado: WebView real do Android, teclado do celular sobre os campos, sons.

## Decisões em aberto da Érica

1. Todas as sessões ficam liberadas (a pessoa pode abrir qualquer uma). O protótipo bloqueava as seguintes até terminar a anterior. Deixei liberado porque quem já tem desejos, ou volta para um segundo desejo, ficaria travada. O card da próxima sessão aparece destacado.
2. A tela "Em que parte da sua vida mora esse desejo?" (escolha da área) não está no protótipo, foi acrescentada porque o app precisa da área.
3. As afirmações curtas de cada sessão são as do protótipo, que são mais curtas que as do documento original.
4. A retirada do "quero" no começo do desejo (`trSemQuero`) hoje está só na trilha. Pode fazer sentido mover para `limparTextoDesejo`.

## Mensagem curta para a Érica enviar

> Thiago, atualizei a trilha da Atração na main do DIVA com o novo visual (aquarela, gatinha, telas cheias). Mexi só no index.html. A explicação está em docs/TRILHA_ATRACAO.md, vale ler a parte "Mudanças no modelo de dados".
