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

## Login com Google dentro do app

O código do login já está pronto (plugin `@capgo/capacitor-social-login` + Firebase). Falta só o cadastro
no painel do Google, que precisa de quem tem acesso ao projeto **diva-b3ce4**. São três passos:

1. **Cadastrar o app de Android no Firebase.**
   Console do Firebase > diva-b3ce4 > Configurações do projeto > Seus apps > Adicionar app > Android.

   | Campo | Valor |
   |---|---|
   | Nome do pacote | `com.ericahotts.diva` |
   | SHA-1 (versão de teste) | `9D:87:EB:3E:E3:77:73:E8:C3:85:09:EC:75:8E:8B:70:37:98:47:73` |

   Não precisa baixar o `google-services.json`.

2. **Pegar o ID de cliente da Web.**
   Google Cloud Console > APIs e serviços > Credenciais > IDs do cliente OAuth 2.0 > o do tipo
   **Aplicativo da Web** (costuma se chamar "Web client (auto created by Google Service)").
   Copiar o ID, que termina em `.apps.googleusercontent.com`, e colar em `WEB_CLIENT_ID`, no começo de `app/nuvem.js`.
   Esse ID não é segredo.

3. **Liberar quem pode entrar.**
   Na tela de consentimento OAuth, enquanto o app estiver em "Teste", cada conta que for testar precisa estar
   na lista de usuários de teste. Pra abrir pra todo mundo, publicar a tela de consentimento.

Se a chave de API do Firebase tiver restrição por site, liberar também `https://localhost/*`
(é o endereço que o app usa por dentro).

Quando o app for pra loja, voltar no passo 1 e adicionar mais dois SHA-1: o da chave de assinatura acima e o
da chave do Google Play (Play Console > Integridade do app).

Se o login falhar no aparelho, o plugin escreve no Logcat (filtro `GoogleProvider`) o pacote, o SHA-1 e o ID que ele viu.

## O que ainda falta dentro do app de Android

- **Botão de apagar a conta:** a loja exige de todo app que cria conta. Hoje só existe "Sair da conta".
- **Sem internet:** o Firebase é baixado da internet. O app abre e funciona offline, mas sem a parte da nuvem.
- **Destravar por digital/rosto:** precisa de teste no aparelho. Se não funcionar dentro do app, a recuperação pelo Google Drive continua valendo.
- **Baixar o relatório em PDF:** precisa de teste no aparelho.

## Rodar no computador (opcional)

Com Node e Android Studio instalados: `npm ci`, `npm run android:sync` e abrir a pasta `android/` no Android Studio.
