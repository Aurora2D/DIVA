# DIVA

App de hábitos diários para o bem-estar pessoal (Android e web).

## Estrutura

| Pasta | O que tem |
|---|---|
| `index.html` | App DIVA (versão web). |
| `logo/` | Animação do logo DIVA em aquarela vetorial (SVG + JS, sem PNG). Abra `logo/index.html` no navegador. |

## Animação do logo

- 100% vetorial: formas, gradientes e uma única função `render(t)` (0 a 6 s).
- Textura de aquarela otimizada: ruído gerado uma vez em memória, deslocamento aplicado na geometria das ondas.
- A mesma lógica será portada para Kotlin / Jetpack Compose (Canvas).
