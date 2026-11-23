# DIVA: guia pra quem continua o trabalho

Este arquivo é a passagem de bastão. Leia inteiro antes de mexer em qualquer coisa.
Última atualização: 16/nov/2026.

## O que é

DIVA é um app de hábitos e autocuidado criado pela Érica Hotts. Roda no navegador
(GitHub Pages, `aurora2d.github.io/DIVA`) e agora também como app de Android (Capacitor).
Está sendo preparado pra entrar no Google Play.

A dona do projeto é a Érica. Ela decide tudo o que aparece na tela. Outra pessoa cuida do
painel do Firebase e das coisas técnicas que ela não acessa.

## Como falar com a Érica

- **Simples e curto.** Sem termo técnico. Se ela pedir "mais simples", corte pela metade e use frases curtas.
- Sem travessão no meio das frases.
- Diga o que foi feito e o que falta. Uma pergunta por vez.
- Entregue aos poucos. Em tarefa grande, faça uma parte, mostre e espere.
- Mostre tela nova por imagem (antes e depois) quando a mudança for visual.
- Nunca diga que testou no celular: não dá pra testar em aparelho daqui. Diga o que foi testado de verdade.

## Regras do projeto (não quebrar)

1. **Nunca apagar o que a Érica escreveu ou marcou no app.** Toda mudança de texto ou de formato precisa levar junto os dados antigos (veja `quizMigrarFrases` em `app/quiz-praticas.js` como exemplo).
2. **Não mudar o app sem ela aprovar.** Aprovado, vai direto pra `main`. Em dúvida, deixe num ramo de rascunho e mostre.
3. **Nada pessoal dela no código.** O repositório é público. Nomes da família e dos bichos, frases pessoais e cuidados de saúde ficam só nos dados dela e num documento privado dela ("DIVA: minhas coisas pessoais").
4. **O perfil dela (`S.perfilOriginal === true`) nunca é travado nem zerado.**
5. **Segredos nunca no repositório** (chave de assinatura, senhas). A chave `android/app/diva-teste.keystore` é só de teste e pode ficar.

## O jeito do DIVA (tom e conceito)

- **Convite gentil, nunca pressão.** Nada de cobrança, bronca, sequência perdida ou "você deveria". A vida da pessoa pode estar um caos.
- **A DIVA é a usuária.** A gatinha se chama **Biju**. "Diva" na tela é sempre a pessoa.
- Poucos hábitos, de bem-estar. Não é lista de obrigação. A ideia é **celebrar tudo**.
- Não usar a palavra "preguiça". Falar em energia.
- Tipos de cuidado com os nomes do app: Palavras que cuidam, Tempo pra mim, Mimos, Facilitar a vida, Cuidar do corpo. **Não mostrar "linguagens do amor" na tela** (por dentro as chaves continuam com esses nomes).
- **Prêmios e práticas são uma ação só, concreta, sem "ou".** Ex.: "Tomar um banho demorado". Não: "relaxar ou passar creme".
- Não deixar místico. Não citar autores da lei da atração no texto das sessões.
- Tudo no feminino. Títulos na serifada do logo (Cormorant Garamond).
- Já decidido, não reabrir: sem rotinas com horário; sem dividir em hábito/prática/ritual (são dois tipos, hábito e prática, mais a marca "já faço"); não precisa de pose nova da Biju.

## Como o código é organizado

- `index.html`: a página, o CSS principal e a lista de scripts (perto do fim). **A ordem dos scripts importa.**
- `app/*.js`: o app, em camadas. Muitos arquivos **embrulham** funções de outros
  (`window.fn = (function(orig){ return function(){ ... orig() ... } })(window.fn)`).
  Pra mudar um comportamento, prefira um arquivo novo que embrulha, carregado depois, em vez de reescrever o original.
- `estilo/app.css`: estilos novos vão aqui, no fim, com um comentário de bloco.
- `atracao/`: trilha da Atração e as animações da Biju. `mascote/`: cópia do repositório da gatinha (não editar aqui).
- `relatorio/`: carta do mapa emocional. `niquinha/`: página de brincar da filha, à parte.
- Estado do app: objeto global `S`, salvo com `salva()` (localStorage `batomRisadaV23`, e Firebase quando há login).
- **Cache:** todo script e CSS tem `?v=AAAAMMDDx` no `index.html`. Mudou o arquivo, mude o `?v=`.

Arquivos criados em 16/nov/2026:

| Arquivo | O que faz |
|---|---|
| `app/ja-faco.js` | Hábitos que a pessoa já faz: comemora ao marcar, sem marcos de 3, 7 e 21 dias |
| `app/premio-tela.js` | Tela do prêmio clara, com a Biju e pétalas |
| `app/minhas-frases.js` | Frases próprias por hábito (e a cópia temporária das frases antigas, veja pendência 1) |
| `app/pessoas.js` | Trocar de pessoa no mesmo aparelho (23/nov). Cada pessoa fica em `divaPessoa_<id>`, lista em `divaPessoas`. Ao trocar, sai da nuvem |
| `app/completo.js` | Convite de compra e trava das partes pagas. **Desligado** |
| `android/`, `capacitor.config.json`, `package.json` | App de Android |
| `.github/workflows/android.yml` | O GitHub monta o app |
| `docs/ANDROID.md` | Passo a passo do Android: baixar, assinar, cadastro do login |

## Como testar

No navegador, sem aparelho:

```
python3 -m http.server 8765        # na raiz do repositório
```

Abrir com Chrome sem tela (puppeteer-core + `/usr/bin/google-chrome`), viewport 390x844.
A abertura animada leva uns 8 segundos. Depois: digitar o nome, "Continuar", "Não, só de mim", "Vamos começar".
Pra simular dias de hábito, preencher `S.habitos[0].feitos['AAAA-MM-DD']=true` e chamar `toggleHabito(id)`.
Sempre conferir `pageerror` e tirar captura de tela pra olhar o resultado.
Testar também no modo escuro (`prefers-color-scheme: dark`).

App de Android:

- Todo push na `main` (fora `.md`) monta o app. Acompanhar em
  `https://api.github.com/repos/Aurora2D/DIVA/actions/runs` (é público, não precisa de login).
- O APK de teste fica sempre em
  `https://github.com/Aurora2D/DIVA/releases/download/teste/DIVA-teste.apk`.
- O ambiente de trabalho do Claude **não** consegue baixar o Android SDK. A montagem é sempre pelo GitHub.
- Depois de mexer em `package.json` ou em plugin: `npm install` e `npm run android:sync`, e commitar o que mudar em `android/`.

## O que já está decidido pra loja

| Assunto | Decisão |
|---|---|
| Tipo de conta | Pessoal, no nome dela |
| Nome de desenvolvedora | Érica Hotts |
| E-mail público | contato@ericahotts.com |
| Nome do app | DIVA: hábitos e autocuidado |
| Nome interno (não muda mais depois do 1º envio) | `com.ericahotts.diva` |
| Idade | 18 anos ou mais |
| Preço | Baixar é de graça. Compra única dentro do app, por volta de R$ 29,90 |
| De graça pra sempre | Hábitos e check-in |
| Libera com a compra | Mapa emocional, Celebrar, Atração, cartinhas da Biju depois do 7º dia |
| Categoria | Saúde e fitness |

Regras da loja que pesaram: conta pessoal nova precisa de 12 testadoras por 14 dias seguidos antes de publicar;
app que já foi de graça não pode virar pago pra baixar (por isso a compra é dentro do app);
o MEI dela não cobre venda de software, então a venda entra no nome dela e ela precisa falar com um contador.
Essas regras mudam: confira na ajuda do Google Play antes de afirmar.

Os textos da loja, a política de privacidade e as respostas do formulário de dados estão no documento
privado dela "DIVA no Google Play: textos e privacidade".

## Pendências, em ordem

### 1. Apagar as frases antigas do código (espera a Érica)
`app/minhas-frases.js` tem um bloco de transição que copia as frases antigas do batom pros dados do perfil original.
**Quando a Érica confirmar que abriu o app em cada aparelho que usa**, apagar esse bloco inteiro (a função
autoexecutável e a lista de frases dentro dela). O resto do recurso "minhas frases" fica em `app/base.js`
(`frasesDoHabito`, `temFraseHabito`) e em `app/habitos.js` (campo `heFrases`).
Não apagar antes da confirmação: ela perderia as frases.

### 2. Login com Google no app de Android (espera o teste no celular)
O código está em `app/nuvem.js` (`googleNativo`, plugin `@capgo/capacitor-social-login`) e o `WEB_CLIENT_ID`
foi preenchido em 16/nov/2026. Falta confirmar que o app de Android foi cadastrado no Firebase `diva-b3ce4`
com o pacote e o SHA-1 de `docs/ANDROID.md` (passo 1), e a Érica testar o login no celular.
Nunca foi testado em aparelho. Se falhar, conferir nesta ordem: o cadastro do SHA-1; a conta dela na lista de
teste da tela de consentimento; restrição da chave de API por site (liberar `https://localhost/*`).
O destravar por digital pode não funcionar dentro do app (a recuperação pelo Google Drive é o plano B).

### 3. Botão "apagar minha conta" (antes de o login ir pra loja)
**Feito e na `main` (aprovado pela Érica em 17/nov/2026), mas não testado em conta real. Falta testar com uma conta de teste.** Falta também a regra do banco permitir apagar `usuarios/<uid>` (conferir no Firebase) e o texto da política de privacidade.
O texto abaixo é o plano original:
A loja exige de todo app que cria conta. Hoje só existe "Sair da conta" (`sair_` em `app/nuvem.js`).
Precisa apagar `usuarios/<uid>` no banco, o arquivo na pasta oculta do Drive e a conta do Firebase,
e a política de privacidade ganha o trecho da nuvem (o rascunho está no documento dos textos).

### 4. Ligar a compra (espera a conta na loja)
`app/completo.js` está pronto e testado no navegador, com `COBRANCA_LIGADA=false`. Falta:
- A Érica criar a conta no Google Play e o produto de compra única (sugestão de ID: `diva_completo`).
- Escolher e instalar um plugin de Google Play Billing pro Capacitor 8 (conferir no npm qual está mantido).
- Criar `window.DIVAloja = { comprar(), restaurar() }`, cada um devolvendo `true` quando a compra existe.
  `completo.js` já chama esses dois.
- Preencher `completoPreco` com o preço que a loja devolve (cada país tem o seu).
- Só então `COBRANCA_LIGADA=true`.
- **Lembrar a Érica** (ela pediu): a versão do navegador é aberta e completa. Com a cobrança ligada, precisa
  sair do ar ou ficar só pra ela. Hoje a trava vale pra quem não é perfil original, em qualquer lugar.
- Atualizar a descrição da loja e o formulário de dados pra falar da compra.

### 5. Chave de assinatura e arquivo da loja
Passo a passo em `docs/ANDROID.md`. Com os quatro segredos cadastrados no GitHub, a montagem passa a gerar o `DIVA-loja-aab`.
Antes de cada envio, subir o `versionCode` em `android/app/build.gradle`.

### 6. Página da loja
Faltam: publicar a política de privacidade num endereço público (o site dela, `ericahotts.com`, ou o GitHub Pages),
tirar as capturas de tela do app, fazer a imagem de capa (1024 x 500) e responder os formulários
(segurança dos dados, classificação etária, declaração de saúde).

### 7. Coisas pequenas que ficaram em aberto
- A festa dos 21 dias (`.festa-overlay`) ainda é escura com fogos. Foi oferecido deixar no estilo novo da tela do prêmio. Ela não respondeu.
- Na Biju comemorando sobram pontinhos claros perto da pata em uns três quadros. Só mexer se ela notar.
- A Érica ainda não disse se o app de teste abriu no celular dela. Perguntar.
- Sem internet, a parte da nuvem não carrega (o Firebase vem da internet). O resto funciona.
- O código cresceu em camadas. Uma faxina, sem mudar nada na tela, fica pra um dia calmo.
- O histórico antigo do repositório ainda guarda as coisas pessoais que saíram do código. Só some recriando o repositório ou limpando o histórico.

## O que foi feito em 16/nov/2026 (pra não refazer)

- Prêmios do teste longo reescritos: as 100 frases são uma ação só, sem "ou", com migração dos check-ins antigos.
- Listinha do fim do dia e menor passo com a lista toda entraram na `main`.
- Categorias na ordem do perfil do teste (Hoje e Gerenciar hábitos).
- Hábitos "já faço".
- Tela do prêmio nova; nomes de cuidado no lugar das linguagens do amor; "Faltam 0 dias" corrigido; saudação do mapa corrigida.
- Biju comemorando sem o branco entre as pernas (DIVA e Niquinha).
- Coisas pessoais fora do código; campo "Minhas frases ao marcar".
- App de Android montando no GitHub, com link direto pro APK de teste.
- Login nativo com Google pronto, com o ID de cliente preenchido. Falta o teste no celular.
- Convite de compra e trava das partes pagas, prontos e desligados.
