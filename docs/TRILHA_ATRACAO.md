# Trilha guiada da aba Atração: documentação para integração

Para: Thiago. De: Érica. Base: `main` no commit `4feb35b`.
Arquivo alterado: só `index.html` (mais este documento e uma seção no README).

## O que é

A trilha do texto polido da Érica (Abertura, Deixar sair/Contraste, Passo 1 Clareza, Passo 2 Declaração, Passo 3 Permissão, Menor passo) agora roda dentro do motor de sessões que já existia no app. Nada de HTML separado. Usa o mesmo modal (`#sessaoModal`), o mesmo estado `S.leiAtracao`, as mesmas cores (tokens `--b`, `--r`, `--modal-*`, claro e escuro) e as funções que o app já tem.

## Como aplicar

```
git checkout -b trilha-atracao
git apply atracao-sessoes.patch
```

Ou abrir `DIVA-index-com-trilha.html` (cópia completa do `index.html` já alterado) para ver funcionando.

## Aba Atração totalmente dentro das sessões

Os três botões antigos (Clareza, Declaração, Permissão, `#atracaoMenu`) saíram da aba. Tudo que eles faziam agora é sessão:

| Antes (popup) | Agora (sessão) |
|---|---|
| Novo contraste | `sessaoDeixarSair` |
| Ver lista de contrastes, processar, apagar | `sessaoMeusDesabafos` e `sessaoDesabafo(c)` |
| Desejo sem contraste | `sessaoClareza()` sem argumento |
| Lista de desejos, abrir, editar, soltar, apagar | `sessaoMeusDesejos` e `sessaoDesejoHub(d)` (`sessaoEditarDesejo`, `sessaoSoltarDesejo`, confirmação de apagar dentro da sessão) |
| Lista de declarações | `sessaoDeclaracao(d)` |
| Dúvida rápida e lista de dúvidas | `sessaoDuvidaRapida` e "Retomar dúvida" no hub do desejo |

`irParaDeclaracao()` (atalho que vinha de outras abas) agora abre `sessaoComDesejo(sessaoDeclaracao)`. O HTML antigo dos popups (`secClarezaContent` etc.) e o modal antigo do desejo (`abrirDesejo`) continuam no arquivo, sem botão que leve a eles, para o Thiago remover quando quiser. Se algum outro ponto do app ainda chamar `abrirDesejo(id, passo)`, ele abre o modal antigo.

## Textos

Os textos da Érica estão inteiros e na ordem do documento, divididos em telas curtas, com pausas (respiro), um check-in de como ela está chegando, uma tela para sentir a frase de permissão e frases de acolhimento entre os passos. Os textos que não vieram do documento dela estão marcados na seção de decisões.

## Fluxo da trilha

| Sessão | Função | O que grava |
|---|---|---|
| Abertura | `sessaoAbertura` | nada |
| Deixar sair · Contraste | `sessaoDeixarSair` | `S.leiAtracao.contrastes[]` (lista de incômodos) |
| Olhar a lista | `sessaoOlhar` | `contraste.camadas = {pedido, origem}` |
| Passo 1 · Clareza | `sessaoClareza(c)` | cria desejo via `novoDesejo`; `desejo.camadas = {pedido, origem, importa}` |
| Passo 2 · Declaração | `sessaoDeclaracao(d)` | `desejo.corpo[]` (prefixos e textos), `desejo.sensacao` |
| Passo 3 · Permissão | `sessaoPermissao(d, g0)` | `desejo.gravetos[]` com `duvida`, `alivio`, `origem`, `seFosse`, `solto`; evidências |
| Menor passo | `sessaoMenorPasso(d)` | `desejo.menorPassos[]`. Tela única com o texto da Érica e campo livre (sem sugestões prontas; quem decide o passo é ela). Depois, botão opcional "Transformar em hábito" chama `virarDesejoEmHabito` |

Os cards ficam em `#atrSessoes` (`renderSessoesAtracao`, `cardSessao`, `abrirSessaoPorId`). Quando há mais de um desejo ativo, as sessões de Declaração, Permissão e Menor passo mostram a tela "Qual desejo?" (`sessaoComDesejo`).

## Mudanças no motor de sessões

`sessaoMostrar` agora entende estes campos extras em cada tela: `kicker`, `titulo`, `afirma` (mantra), `corpo` (lista de parágrafos), `html` (função ou string) + `bind(raiz)`, `campos`, `fecho`, `voltar` (mostra botão Voltar). `sessaoColher` guarda o que foi digitado, `sessaoAtualizar` redesenha a tela sem mudar de passo. As telas antigas continuam funcionando como antes.

CSS novo: classes `.sessao-*` logo depois de `.sessao-dots`. Os botões da sessão ficam fixos no rodapé do modal (`position:sticky`), porque telas longas escondiam o botão.

Ilustrações novas em `SESSAO_IMG`: `luz`, `porta`, `passo` (mesmo estilo de `chuva`, `calma`, `flor`).

## Mudanças no modelo de dados (atenção)

- `desejo.camadas` passa a ser `{pedido, origem, importa}`. Antes era `{medo, pedido}`. Nada no app lia `medo`, mas confira se algum outro lugar seu usa.
- `contraste.camadas = {pedido, origem}` é novo.
- `graveto.origem` e `graveto.seFosse` são novos (campos opcionais da Permissão). Gravetos antigos continuam válidos.
- Nenhuma chave nova no localStorage (`batomRisadaV23`).

## Dependências de funções do app

`novoDesejo`, `desejosAtivos`, `limparTextoDesejo`, `montarDeclaracao`, `MODELOS_CORPO`, `sugerirPermissoes`, `paraInfinitivoSugestao`, `virarDesejoEmHabito`, `habitoLerDeclaracao`, `renderLivroPermissoes`, `renderAtracaoTudo`, `mostrarToast`, `confete`, `trocaAba`, `salva`, `$`, `esc`, `hoje`.

`renderDeclaracaoMontada` não existe mais no repo, então criei `trDeclHTML` (usa `montarDeclaracao`). Se vocês trouxerem a função de volta, dá para trocar.

## Testado e não testado

Testado (Chromium headless, claro e escuro, 420x880): trilha completa de ponta a ponta, voltar, vários desejos, dúvida e reabrir graveto, prefixos (liga/desliga, trava na última frase), edição inline da frase, guardar no Livro de Permissões, evidência, menor passo virando hábito (modal com o texto preenchido), modal antigo do desejo, aba Hoje. Sem erros de página.

Não testado: WebView real do Android, teclado do celular sobre os campos, sons.

## Decisões em aberto da Érica

1. O menu antigo de sessões continua como modo livre. Quer que a trilha substitua o menu ou conviva com ele?
2. O gato mascote não foi usado nas telas novas.
3. Textos que não vieram do documento da Érica e precisam de revisão: textos da tela "Olhar a lista", "5. Permita-se dar um passo", "Qual desejo?", "Notou algo?".
4. A retirada do "quero" no começo do desejo (`trSemQuero`) hoje está só na trilha. Pode fazer sentido mover para `limparTextoDesejo`, para valer em todo o app.

## Mensagem curta para a Érica enviar

> Thiago, fiz a trilha da Atração em cima do index.html do GitHub, usando o motor de sessões que já existe. Está em `atracao-sessoes.patch` (git apply) e a explicação em `docs/TRILHA_ATRACAO.md`. Só mexe no index.html. Pode olhar a seção "Mudanças no modelo de dados" primeiro, é onde pode bater com algo seu.
