# DIVA

App de hábitos diários para o bem-estar pessoal (Android e web).

## Estrutura

| Pasta | O que tem |
|---|---|
| `index.html` | App DIVA (versão web). |
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
