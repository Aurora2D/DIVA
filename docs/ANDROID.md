# DIVA no Android

O app de Android é o mesmo DIVA da web, empacotado com o Capacitor. Nada foi reescrito:
a pasta `android/` é só a casca, e o conteúdo vem dos arquivos de sempre (`index.html`, `app/`, `atracao/` etc.).

## Como o app é montado

O GitHub monta sozinho (Actions > **App Android**) toda vez que a `main` muda.
Também dá pra rodar na mão: Actions > App Android > **Run workflow**.

No fim de cada rodada, em **Artifacts**:

- `DIVA-teste-apk`: o app pra instalar direto num celular Android e testar. O mesmo arquivo fica num link direto, sem login: https://github.com/Aurora2D/DIVA/releases/download/teste/DIVA-teste.apk
- `DIVA-loja-aab`: o arquivo que sobe no Google Play. Só aparece depois que a chave de assinatura estiver cadastrada (abaixo).

## Chave de assinatura (uma vez só)

O Google Play só aceita arquivo assinado. A chave é criada uma vez e precisa ser guardada pra sempre:
sem ela não dá pra mandar atualização do app.

1. Num computador com Java, criar a chave:

   ```
   keytool -genkeypair -v -keystore diva.jks -alias diva -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Guardar o arquivo `diva.jks` e as senhas num lugar seguro (gerenciador de senhas). Nunca no repositório.
3. No GitHub, em Settings > Secrets and variables > Actions, criar quatro segredos:

   | Segredo | Valor |
   |---|---|
   | `DIVA_KEYSTORE_BASE64` | o arquivo em texto: `base64 -w0 diva.jks` |
   | `DIVA_KEYSTORE_SENHA` | a senha do arquivo |
   | `DIVA_CHAVE_ALIAS` | `diva` |
   | `DIVA_CHAVE_SENHA` | a senha da chave |

4. Rodar o workflow de novo. O `DIVA-loja-aab` passa a aparecer.

## Antes de cada envio pra loja

Em `android/app/build.gradle`, aumentar o `versionCode` em 1 (a loja recusa número repetido) e ajustar o `versionName`.

## Identificador do app

`com.ericahotts.diva` (em `capacitor.config.json` e `android/app/build.gradle`).
Depois do primeiro envio pra loja ele não pode mais mudar. Se for trocar, é antes.

## O que ainda falta dentro do app de Android

- **Login com Google:** a janelinha do Google não abre dentro de app. Por enquanto o botão avisa que essa parte chega depois.
  Pra funcionar precisa do login nativo e de cadastrar o app no painel do Firebase.
- **Sem internet:** o Firebase é baixado da internet. O app abre e funciona offline, mas sem a parte da nuvem.
- **Testar no aparelho:** destravar por digital/rosto e baixar o relatório em PDF.

## Rodar no computador (opcional)

Com Node e Android Studio instalados: `npm ci`, `npm run android:sync` e abrir a pasta `android/` no Android Studio.
