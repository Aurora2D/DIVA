# DIVA

App de hábitos diários para o bem-estar pessoal (Android e web).

## Estrutura

| Pasta | O que tem |
|---|---|
| `index.html` | App DIVA (versão web). |
| `estilo/` | Estilo geral: títulos na serifada do logo (`app.css`) e a fonte (`fontes/`). |
| `atracao/` | Trilha da aba Atração: `atracao.js` e `atracao.css`. |
| `mascote/` | Cópia da gatinha (repositório Aurora2D/Mascote). Atualize com `sh scripts/atualizar-mascote.sh`. |
| `logo/index.html` | Animação do logo com controles (repetir, linha do tempo) — para estudar/ajustar. |
| `logo/splash.html` | Versão tela cheia usada como abertura do app. Uma cópia dela fica embutida no `index.html` (bloco "ABERTURA DIVA"). |

## Animação do logo

- 100% vetorial: formas, gradientes e uma única função `render(t)` (0 a 6 s).
- Textura de aquarela otimizada: ruído gerado uma vez em memória, deslocamento aplicado na geometria das ondas.
- A mesma lógica será portada para Kotlin / Jetpack Compose (Canvas).

## Ajustar o ritmo da abertura

O ritmo foi copiado de um vídeo de referência. Ele fica na constante `RITMO` (em `logo/index.html` e `logo/splash.html`):

```js
const RITMO=[[0,.6],[.40,2.04],[1.07,3.28],[1.25,3.80],[1.40,4.20],[1.47,4.50],[1.60,5.15],[1.72,6]];
```

Cada par é `[segundo real, momento da coreografia]`. Para deixar um trecho mais lento, aumente o segundo real daquele ponto (e dos seguintes). Depois de mudar o `splash.html`, copie o conteúdo para o bloco "ABERTURA DIVA" do `index.html`.

## Som da abertura

`audio/abertura.mp3` (4,5 s) toca junto com a animação de abertura. Os navegadores (principalmente no celular) costumam bloquear som automático quando a página abre sem a pessoa ter tocado na tela; nesse caso a abertura segue em silêncio. No app Android nativo o som toca normalmente.

## Sons do app (versão 4)

Os sons de marcar hábito (`plim`), guardar (`guardado`), prêmio (`caixinha`) e 21 dias (`brilho`) ficam em `audio/sons/`. Para trocar um som, é só substituir o MP3 com o mesmo nome. Se algum arquivo não carregar, o app toca a versão antiga, gerada no código.

## Trilha guiada da aba Atração

A aba Atração é uma trilha de 7 sessões em tela cheia (Abertura, Deixar sair, Olhar com outros olhos, Clareza, Declaração, Permissão e Menor passo), com aquarela e a gatinha. O código fica em `atracao/atracao.js` e `atracao/atracao.css`, ligados ao `index.html` por link, e a gatinha (que reage ao que a pessoa faz) em `mascote/`. As duas pastas precisam ir junto com o `index.html`. Detalhes em `docs/TRILHA_ATRACAO.md`.

## Nuvem e cofre (`app/nuvem.js`)

Login com Google e dados no Firebase, sempre embaralhados no aparelho com uma chave interna aleatória. O Firebase nunca vê essa chave. Quando o aparelho esquece a chave (celular novo, navegador limpo), ela é destravada por:

1. **Digital ou rosto** (passkey com a extensão PRF), que sincroniza pelo gerenciador de senhas do Google ou do iCloud.
2. **Google Drive**: um segredo de recuperação fica na pasta oculta do app no Drive (`appDataFolder`).

Não existe frase-senha. Cofres antigos (com frase) são atualizados uma vez, na primeira abertura.

Configuração no Google Cloud do projeto `diva-b3ce4`: ativar a **Google Drive API** e, na tela de consentimento OAuth, incluir o escopo `drive.appdata` e cadastrar o e-mail da usuária como testadora (modo de teste).
