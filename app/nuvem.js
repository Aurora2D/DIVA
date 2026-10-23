/* ============ NUVEM: login com Google + cofre com digital e Google Drive ============
   Ligado ao index.html por uma tag script do tipo module (fica perto do fim).

   Como o cofre funciona (versão 2, sem frase-senha):
   - Os dados vão para o Firebase embaralhados (AES-GCM) com uma CHAVE INTERNA
     aleatória, criada no aparelho. O Firebase nunca vê essa chave.
   - A chave interna fica guardada no aparelho (IndexedDB), então no dia a dia o
     app abre direto.
   - Quando o aparelho "esquece" (celular novo, navegador limpo), a chave interna
     é destrancada por uma de duas portas:
       1. DIGITAL / ROSTO (passkey com a extensão PRF). A passkey sincroniza pelo
          gerenciador de senhas do Google ou do iCloud.
       2. GOOGLE DRIVE: um segredo de recuperação fica numa pasta oculta do Drive
          da pessoa (appDataFolder), que só o DIVA enxerga.
     No Firebase fica só a chave interna trancada por cada porta. Sozinho, o
     Firebase não abre nada; sozinho, o Drive também não.
   - Cofres antigos (versão 1, com frase-senha) são atualizados uma única vez.

   O que este arquivo espera do resto do app (app/estado.js e app/celebrar.js):
   - window.DIVA = { getEstado, setEstado }
   - salva() chamando window.salvarNoFirebase()
   E o que ele oferece:
   - window.DIVAnuvem.abrir()   abre a janela de login / sincronização
   - window.DIVAnuvem.status()  texto curto do estado da sincronização
   - window.DIVAcripto          usado pelo backup (exporta cifrado quando há login)
   - evento 'diva-nuvem' no window sempre que o estado muda

   Configuração necessária no Google Cloud do projeto diva-b3ce4:
   - Ativar a "Google Drive API".
   - Na tela de consentimento OAuth, incluir o escopo .../auth/drive.appdata e,
     com o app em modo de teste, cadastrar o e-mail da usuária como testadora. */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, reauthenticateWithPopup, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase, ref, get, set, update } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAQcFNLHkrNuMN7fJ0E2pbnou4cZy99Tlk",
  authDomain: "diva-b3ce4.firebaseapp.com",
  databaseURL: "https://diva-b3ce4-default-rtdb.firebaseio.com",
  projectId: "diva-b3ce4",
  storageBucket: "diva-b3ce4.firebasestorage.app",
  messagingSenderId: "1068566024808",
  appId: "1:1068566024808:web:08d4d7f304370157f9a1dd"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const $ = id => document.getElementById(id);
const enc = new TextEncoder(), dec = new TextDecoder();
const b64 = buf => { const a = new Uint8Array(buf); let s = ''; for (let i = 0; i < a.length; i++) s += String.fromCharCode(a[i]); return btoa(s); };
const unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
const b64url = buf => b64(buf).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64url = s => unb64(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4));
const aleatorio = n => crypto.getRandomValues(new Uint8Array(n));

/* ---- criptografia ---- */
async function cifraBytes(chave, bytes) {
  const iv = aleatorio(12);
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, chave, bytes);
  return { iv: b64(iv), ct: b64(ct) };
}
const decifraBytes = (chave, o) => crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(o.iv) }, chave, unb64(o.ct));
const cifra = (chave, texto) => cifraBytes(chave, enc.encode(texto));
const decifra = async (chave, o) => dec.decode(await decifraBytes(chave, o));
const importaAES = (raw, exportavel) => crypto.subtle.importKey('raw', raw, 'AES-GCM', exportavel, ['encrypt', 'decrypt']);

// cofre antigo (versão 1): chave derivada da frase-senha
async function derivaChaveAntiga(frase, salt) {
  const base = await crypto.subtle.importKey('raw', enc.encode(frase.normalize('NFKC')), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 250000, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}
// tranca a chave interna com outra chave (porta da digital ou do Drive)
async function tranca(porta, chaveInterna) {
  const raw = await crypto.subtle.exportKey('raw', chaveInterna);
  return cifraBytes(porta, raw);
}
async function destranca(porta, trancada) {
  return importaAES(await decifraBytes(porta, trancada), true);
}

/* ---- chave guardada neste aparelho ---- */
function abreIDB() {
  return new Promise((res, rej) => {
    const r = indexedDB.open('diva-cofre', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('k');
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
async function guardaChave(uid, valor) {
  const d = await abreIDB();
  return new Promise((res, rej) => { const tx = d.transaction('k', 'readwrite'); tx.objectStore('k').put(valor, uid); tx.oncomplete = res; tx.onerror = () => rej(tx.error); });
}
async function lerChave(uid) {
  const d = await abreIDB();
  return new Promise((res, rej) => { const q = d.transaction('k').objectStore('k').get(uid); q.onsuccess = () => res(q.result || null); q.onerror = () => rej(q.error); });
}
async function apagaChave(uid) {
  const d = await abreIDB();
  return new Promise((res, rej) => { const tx = d.transaction('k', 'readwrite'); tx.objectStore('k').delete(uid); tx.oncomplete = res; tx.onerror = () => rej(tx.error); });
}

/* ---- Google Drive (pasta oculta do app) ---- */
const ESCOPO_DRIVE = 'https://www.googleapis.com/auth/drive.appdata';
const ARQ_DRIVE = 'diva-chave.json';

// abre a janela do Google pedindo a permissão do Drive; precisa vir de um toque
async function tokenDrive() {
  const p = new GoogleAuthProvider();
  p.addScope(ESCOPO_DRIVE);
  if (user.email) p.setCustomParameters({ login_hint: user.email });
  const r = await reauthenticateWithPopup(user, p);
  const c = GoogleAuthProvider.credentialFromResult(r);
  if (!c || !c.accessToken) throw Object.assign(new Error('sem-token'), { code: 'diva/sem-token' });
  return c.accessToken;
}
function erroDrive(status) {
  return Object.assign(new Error('drive-' + status), { code: status === 403 || status === 401 ? 'diva/drive-permissao' : 'diva/drive' });
}
async function driveAcha(tok) {
  const q = encodeURIComponent(`name='${ARQ_DRIVE}'`);
  const r = await fetch(`https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=${q}&fields=files(id)`, { headers: { Authorization: 'Bearer ' + tok } });
  if (!r.ok) throw erroDrive(r.status);
  const j = await r.json();
  return j.files && j.files[0] ? j.files[0].id : null;
}
async function driveLe(tok) {
  const id = await driveAcha(tok);
  if (!id) return null;
  const r = await fetch(`https://www.googleapis.com/drive/v3/files/${id}?alt=media`, { headers: { Authorization: 'Bearer ' + tok } });
  if (!r.ok) throw erroDrive(r.status);
  return r.json();
}
async function driveGrava(tok, obj) {
  const id = await driveAcha(tok);
  const meta = id ? {} : { name: ARQ_DRIVE, parents: ['appDataFolder'] };
  const lim = 'diva' + b64url(aleatorio(9));
  const corpo = `--${lim}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(meta)}\r\n--${lim}\r\nContent-Type: application/json\r\n\r\n${JSON.stringify(obj)}\r\n--${lim}--`;
  const url = id ? `https://www.googleapis.com/upload/drive/v3/files/${id}?uploadType=multipart` : 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
  const r = await fetch(url, { method: id ? 'PATCH' : 'POST', headers: { Authorization: 'Bearer ' + tok, 'Content-Type': 'multipart/related; boundary=' + lim }, body: corpo });
  if (!r.ok) throw erroDrive(r.status);
}

/* ---- digital / rosto (passkey com PRF) ---- */
async function digitalDisponivel() {
  try {
    if (!window.PublicKeyCredential || !window.isSecureContext) return false;
    if (PublicKeyCredential.getClientCapabilities) {
      const cap = await PublicKeyCredential.getClientCapabilities();
      if (cap && cap['extension:prf'] === false) return false;
    }
    return !!(PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable && await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable());
  } catch (e) { return false; }
}
async function portaDaDigital(saidaPrf) {
  const base = await crypto.subtle.importKey('raw', saidaPrf, 'HKDF', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'HKDF', hash: 'SHA-256', salt: enc.encode('diva-digital'), info: enc.encode('chave-interna') }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}
async function pedeDigital(ids, saltPrf) {
  const cred = await navigator.credentials.get({ publicKey: {
    challenge: aleatorio(32),
    allowCredentials: ids.map(id => ({ type: 'public-key', id: unb64url(id) })),
    userVerification: 'required',
    extensions: { prf: { eval: { first: saltPrf } } }
  } });
  const ext = cred.getClientExtensionResults();
  const saida = ext && ext.prf && ext.prf.results && ext.prf.results.first;
  if (!saida) throw Object.assign(new Error('sem-prf'), { code: 'diva/sem-prf' });
  return { id: b64url(cred.rawId), saida };
}
const digitalDesteAparelho = () => { try { return localStorage.getItem('divaDigital') || ''; } catch (e) { return ''; } };

// meta já lida antes do toque: alguns navegadores só abrem a digital logo após o toque
async function cadastraDigital(meta) {
  meta = meta || {};
  const saltPrf = meta.prfSalt ? unb64(meta.prfSalt) : aleatorio(32);
  let cred;
  try { cred = await navigator.credentials.create({ publicKey: {
    rp: { name: 'DIVA' },
    user: { id: enc.encode(user.uid), name: user.email || 'DIVA', displayName: user.displayName || user.email || 'DIVA' },
    challenge: aleatorio(32),
    pubKeyCredParams: [{ type: 'public-key', alg: -7 }, { type: 'public-key', alg: -257 }],
    excludeCredentials: Object.keys(meta.digitais || {}).map(id => ({ type: 'public-key', id: unb64url(id) })),
    authenticatorSelection: { residentKey: 'preferred', userVerification: 'required' },
    extensions: { prf: { eval: { first: saltPrf } } }
  } }); }
  catch (e) {
    // a digital do DIVA já veio sincronizada para este aparelho: é só usar "Abrir com a digital"
    if (e && e.name === 'InvalidStateError') { try { localStorage.setItem('divaDigital', 'sincronizada'); } catch (e2) {} }
    throw e;
  }
  const ext = cred.getClientExtensionResults();
  if (!ext || !ext.prf || ext.prf.enabled === false) throw Object.assign(new Error('sem-prf'), { code: 'diva/sem-prf' });
  const id = b64url(cred.rawId);
  let saida = ext.prf.results && ext.prf.results.first;
  if (!saida) saida = (await pedeDigital([id], saltPrf)).saida; // alguns aparelhos pedem a digital de novo aqui
  const trancada = await tranca(await portaDaDigital(saida), chave);
  const mudancas = {};
  if (!meta.prfSalt) mudancas['meta/prfSalt'] = b64(saltPrf);
  mudancas['meta/digitais/' + id] = { ...trancada, criada: new Date().toISOString() };
  await update(ref(db, `usuarios/${user.uid}`), mudancas);
  try { localStorage.setItem('divaDigital', id); } catch (e) {}
}

async function abreComDigital(meta) {
  const ids = Object.keys(meta.digitais || {});
  const r = await pedeDigital(ids, unb64(meta.prfSalt));
  const trancada = meta.digitais[r.id];
  if (!trancada) throw Object.assign(new Error('digital-desconhecida'), { code: 'diva/digital-desconhecida' });
  await usaChave(await destranca(await portaDaDigital(r.saida), trancada));
  try { localStorage.setItem('divaDigital', r.id); } catch (e) {}
}

async function abreComDrive(meta) {
  const tok = await tokenDrive();
  const arq = await driveLe(tok);
  if (!arq || !arq.r) throw Object.assign(new Error('sem-drive'), { code: 'diva/sem-arquivo-drive' });
  const porta = await importaAES(unb64(arq.r), false);
  let k;
  try { k = await destranca(porta, meta.drive); }
  catch (e) { throw Object.assign(new Error('drive-nao-bate'), { code: 'diva/drive-nao-bate' }); }
  await usaChave(k);
}

/* ---- estado ---- */
let user = null, chave = null, chaveAntiga = null, timer = null, statusTxt = 'Desconectada';
let pausado = false; // true enquanto falta decidir qual lado vale: nada sobe para a nuvem
const caminho = (parte) => `usuarios/${user.uid}/${parte}`;
// este aparelho já sincronizou com ESTA conta antes?
const vinculoOk = () => { try { return !!user && localStorage.getItem('divaVinculo') === user.uid; } catch (e) { return false; } };
const marcaVinculo = () => { try { if (user) localStorage.setItem('divaVinculo', user.uid); } catch (e) {} };
const onboardingFeito = () => { try { const e = window.DIVA.getEstado(); return !!(e.onboarding && e.onboarding.feito); } catch (e) { return false; } };

function setStatus(t) {
  statusTxt = t;
  try { window.dispatchEvent(new CustomEvent('diva-nuvem', { detail: t })); } catch (e) {}
}

async function enviaAgora() {
  if (!chave || !user || pausado) return;
  try {
    let t = localStorage.getItem('divaT');
    if (!t) { t = new Date().toISOString(); localStorage.setItem('divaT', t); }
    const c = await cifra(chave, JSON.stringify(window.DIVA.getEstado()));
    await set(ref(db, caminho('estado')), { v: 2, iv: c.iv, ct: c.ct, t });
    marcaVinculo();
    setStatus('Sincronizada');
  } catch (e) {
    console.error('Erro ao sincronizar:', e);
    setStatus('Sem sincronizar agora (seus dados continuam salvos neste aparelho)');
  }
}

// chamada pelo app a cada salvamento (app/estado.js → salva)
window.salvarNoFirebase = function () {
  try { localStorage.setItem('divaT', new Date().toISOString()); } catch (e) {}
  if (!chave || !user || pausado) return;
  setStatus('Sincronizando…');
  clearTimeout(timer);
  timer = setTimeout(enviaAgora, 1500);
};

// Pergunta qual lado vale quando há dados nos dois lugares. Nada sobe sem essa decisão.
function perguntaLado(motivo, usarNuvem, usarAparelho) {
  garanteModal();
  const campos = $('nvCampos'), botoes = $('nvBotoes');
  campos.innerHTML = ''; botoes.innerHTML = ''; erro('');
  $('nvTitulo').textContent = 'Dados em dois lugares';
  $('nvTexto').textContent = motivo === 'nuvem-mais-nova'
    ? 'Encontrei dados mais novos na nuvem do que os deste aparelho. Qual versão você quer manter? A outra será substituída.'
    : 'Esta conta já tem dados na nuvem, e este aparelho também tem os seus. Qual versão você quer manter? A outra será substituída.';
  botoes.append(
    botao('Usar os dados da nuvem', 'prim', usarNuvem),
    botao('Manter os deste aparelho', 'sec', usarAparelho),
    botao('Decidir depois', 'sec', () => { setStatus('Pausada: escolha em Configurações'); fecha(); })
  );
  abre();
}

async function sincronizaInicial() {
  setStatus('Sincronizando…');
  pausado = true; // nada sobe até sabermos o que há na nuvem e o que a pessoa prefere
  try {
    const snap = await get(ref(db, caminho('estado')));
    if (!snap.exists()) { pausado = false; await enviaAgora(); return; }
    const r = snap.val();
    const localT = localStorage.getItem('divaT') || '';
    if (r.t === localT) { marcaVinculo(); pausado = false; setStatus('Sincronizada'); return; }

    const remoto = JSON.parse(await decifra(chave, r));
    const temLocal = onboardingFeito();

    const usarNuvem = () => {
      window.DIVA.setEstado(remoto);
      try { localStorage.setItem('divaT', r.t); } catch (e) {}
      marcaVinculo(); pausado = false;
      location.reload();
    };
    const usarAparelho = async () => {
      try { localStorage.setItem('divaT', new Date().toISOString()); } catch (e) {}
      pausado = false;
      fecha();
      await enviaAgora();
    };

    if (!temLocal) { usarNuvem(); return; }                             // aparelho novo: só traz o que já existe
    if (vinculoOk() && r.t <= localT) { await usarAparelho(); return; } // este aparelho é o mais recente: sobe normalmente
    perguntaLado(vinculoOk() ? 'nuvem-mais-nova' : 'primeira-vez', usarNuvem, usarAparelho);
  } catch (e) {
    // continua pausado de propósito: se não deu para ler a nuvem, nada pode sobrescrevê-la
    console.error(e);
    setStatus('Pausada: não consegui ler a nuvem');
    try { garanteModal(); erro('Não consegui ler os dados da nuvem. Nada foi alterado.'); } catch (e2) {}
  }
}

async function usaChave(k) {
  chave = k; chaveAntiga = null;
  await guardaChave(user.uid, { v: 2, chave: k });
  await sincronizaInicial();
}

/* Cria o cofre novo. Se houver um cofre antigo (frase-senha), traz os dados dele.
   Tudo vai para o Firebase numa gravação só, para nunca ficar pela metade. */
async function criaCofre(obterChaveVelha) {
  const tok = await tokenDrive(); // primeiro, enquanto o toque ainda vale para abrir a janela do Google
  const chaveVelha = obterChaveVelha ? await obterChaveVelha() : null;
  let estadoNovo = null;
  if (chaveVelha) {
    const snap = await get(ref(db, caminho('estado')));
    if (snap.exists()) {
      const r = snap.val();
      const texto = await decifra(chaveVelha, r);
      estadoNovo = { texto, t: r.t };
    }
  }
  const k = await importaAES(aleatorio(32), true);
  const segredo = aleatorio(32);
  await driveGrava(tok, { diva: 2, uid: user.uid, r: b64(segredo), criado: new Date().toISOString() });
  const trancadaDrive = await tranca(await importaAES(segredo, false), k);
  const mudancas = { meta: { v: 2, drive: trancadaDrive } };
  if (estadoNovo) {
    const c = await cifra(k, estadoNovo.texto);
    mudancas.estado = { v: 2, iv: c.iv, ct: c.ct, t: estadoNovo.t };
  }
  await update(ref(db, `usuarios/${user.uid}`), mudancas);
  try { localStorage.removeItem('divaDigital'); } catch (e) {}
  await usaChave(k);
}
async function chaveDaFraseAntiga(frase, meta) {
  const k = await derivaChaveAntiga(frase, unb64(meta.salt));
  let ok = false;
  try { ok = (await decifra(k, meta.check)) === 'diva-ok'; } catch (e) {}
  if (!ok) throw Object.assign(new Error('frase-errada'), { code: 'diva/frase-errada' });
  return k;
}

/* ---- backup cifrado com a chave interna ---- */
window.DIVAcripto = {
  ativo: () => !!chave,
  cifrarBackup: async (texto) => {
    const c = await cifra(chave, texto);
    return JSON.stringify({ diva: 2, cifrado: true, iv: c.iv, ct: c.ct });
  },
  // backup novo (diva: 2) abre com a chave interna; backup antigo pede a frase-senha
  precisaFrase: (obj) => !(obj && obj.diva === 2),
  abrirBackup: async (obj, frase) => {
    if (obj.diva === 2) {
      if (!chave) throw new Error('cofre-fechado');
      return decifra(chave, obj);
    }
    return decifra(await derivaChaveAntiga(frase, unb64(obj.salt)), obj);
  }
};

/* ---- janela de login ---- */
const erros = {
  'auth/network-request-failed': 'Sem conexão agora. Tente de novo.',
  'auth/too-many-requests': 'Muitas tentativas. Espere um pouco.',
  'auth/popup-closed-by-user': 'A janela do Google foi fechada antes de terminar. Tente de novo.',
  'auth/cancelled-popup-request': 'A janela do Google foi fechada antes de terminar. Tente de novo.',
  'auth/popup-blocked': 'O navegador bloqueou a janela do Google. Libere pop-ups para este site e tente de novo.',
  'auth/user-mismatch': 'Escolha a mesma conta Google com que você entrou no DIVA.',
  'auth/unauthorized-domain': 'Este site ainda não está autorizado no Firebase (Authentication → Configurações → Domínios autorizados).',
  'auth/configuration-not-found': 'O Authentication ainda não foi iniciado no Firebase (console → Authentication → Vamos começar).',
  'auth/operation-not-allowed': 'O login com Google ainda não foi ativado no Firebase.',
  'auth/operation-not-supported-in-this-environment': 'Este jeito de abrir o app não permite a janela do Google. Abra o DIVA pelo navegador.',
  'auth/api-key-not-valid.-please-pass-a-valid-api-key.': 'A chave do Firebase no app está inválida.',
  'auth/invalid-api-key': 'A chave do Firebase no app está inválida.',
  'auth/admin-restricted-operation': 'Criar contas está desativado no Firebase.',
  'auth/app-not-authorized': 'Este app não está autorizado a usar esse projeto do Firebase.',
  'diva/sem-token': 'O Google não liberou o acesso ao Drive. Tente de novo e marque a permissão do DIVA.',
  'diva/drive-permissao': 'O DIVA não recebeu permissão para a pasta dele no seu Drive. Tente de novo e marque essa permissão.',
  'diva/drive': 'Não consegui falar com o Google Drive agora. Tente de novo.',
  'diva/sem-arquivo-drive': 'Não achei a chave do DIVA no seu Google Drive. Confira se escolheu a conta certa.',
  'diva/drive-nao-bate': 'A chave do Drive não abre este cofre. Confira se escolheu a conta certa.',
  'diva/sem-prf': 'Este aparelho ou navegador não consegue trancar os dados com a digital. Use o Google Drive.',
  'diva/digital-desconhecida': 'Essa digital não está cadastrada neste cofre. Use o Google Drive.',
  'diva/frase-errada': 'Frase-senha incorreta.',
  'NotAllowedError': 'A digital foi cancelada ou o tempo acabou. Tente de novo.',
  'InvalidStateError': 'Este aparelho já tem a digital do DIVA. Da próxima vez, é só tocar em "Abrir com a digital".'
};
const msgErro = e => erros[e && e.code] || erros[e && e.name] || ('Algo deu errado (' + ((e && e.code) || (e && e.name) || (e && e.message) || 'sem código') + ').');

let modal = null;
function garanteModal() {
  if (modal) return modal;
  modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.id = 'nuvemModal';
  modal.style.zIndex = '420'; // acima do onboarding e das Configurações, para aparecer em qualquer tela
  modal.hidden = true;
  modal.innerHTML = '<div class="modal-caixa" style="text-align:left;max-width:420px"><div class="modal-pergunta" id="nvTitulo" style="text-align:center"></div><p class="mut" id="nvTexto" style="font-size:13px;line-height:1.6;margin-bottom:14px"></p><div id="nvCampos" style="display:flex;flex-direction:column;gap:8px;margin-bottom:10px"></div><p id="nvErro" style="font-size:12.5px;color:#c0392b;min-height:16px;margin-bottom:8px"></p><div id="nvBotoes" style="display:flex;flex-direction:column;gap:8px"></div></div>';
  document.body.appendChild(modal);
  return modal;
}
function abre() { const m = garanteModal(); m.hidden = false; document.body.style.overflow = 'hidden'; setTimeout(() => m.classList.add('ativo'), 10); }
function fecha() {
  if (!modal) return;
  modal.classList.remove('ativo');
  setTimeout(() => {
    modal.hidden = true;
    if (!document.querySelector('.modal-overlay.ativo,.rel-overlay.ativo,.festa-overlay.ativo,.premio-modal.ativo,.onb-overlay.ativo')) document.body.style.overflow = '';
  }, 320);
}

function campo(id, tipo, ph, ac) {
  const i = document.createElement('input');
  i.id = id; i.type = tipo; i.placeholder = ph; i.autocomplete = ac || 'off';
  return i;
}
function botao(txt, cls, fn) {
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'modal-btn ' + cls; b.textContent = txt; b.onclick = fn;
  return b;
}
function erro(t) { const el = $('nvErro'); if (el) el.textContent = t || ''; }
function prepara(titulo, texto) {
  garanteModal();
  $('nvCampos').innerHTML = ''; $('nvBotoes').innerHTML = ''; erro('');
  $('nvTitulo').textContent = titulo;
  $('nvTexto').textContent = texto;
}
// roda uma ação de botão mostrando "aguarde" e o erro em português, sem travar a janela
function acao(fn) {
  let ocupado = false;
  return async (ev) => {
    if (ocupado) return;
    ocupado = true; erro('');
    const b = ev && ev.currentTarget, txt = b && b.textContent;
    if (b) b.textContent = 'Aguarde…';
    try { await fn(); }
    catch (err) { console.error(err); erro(msgErro(err)); }
    finally { ocupado = false; if (b && b.isConnected) b.textContent = txt; }
  };
}
const depoisDeAbrir = async () => {
  if (pausado) return; // a pergunta "dados em dois lugares" já está na tela
  if (await digitalDisponivel() && !digitalDesteAparelho()) { ofereceDigital(); return; }
  fecha();
};

async function leMeta() { try { return (await get(ref(db, caminho('meta')))).val() || {}; } catch (e) { return {}; } }
async function ofereceDigital() {
  const meta = await leMeta();
  prepara('Abrir com a digital?', 'Se um dia este aparelho esquecer seus dados, você destrava com a digital ou o rosto, sem janela do Google. Ela também passa para o celular novo junto com suas senhas do Google.');
  $('nvBotoes').append(
    botao('Usar a digital', 'prim', acao(async () => { await cadastraDigital(meta); mostraNuvem(); })),
    botao('Agora não', 'sec', fecha)
  );
  abre();
}

async function mostraNuvem() {
  garanteModal();
  const botoes = $('nvBotoes');

  if (!user) {
    prepara('Guardar seus dados com segurança', 'Entre com sua conta Google para guardar seus dados na nuvem e usar o DIVA em mais de um aparelho. Tudo é embaralhado antes de sair daqui: só você consegue ler.');
    botoes.append(
      botao('Entrar com o Google', 'prim', acao(async () => { await signInWithPopup(auth, new GoogleAuthProvider()); })),
      botao('Agora não', 'sec', () => { try { localStorage.setItem('divaAdiar', '1'); } catch (e) {} fecha(); })
    );
    abre(); return;
  }

  if (!chave) {
    let meta = null;
    try { const s = await get(ref(db, caminho('meta'))); meta = s.exists() ? s.val() : null; }
    catch (e) {
      prepara('Sem conexão', 'Não foi possível verificar seu cofre. Seus dados neste aparelho continuam salvos.');
      erro('Não consegui falar com a nuvem. Tente de novo.');
      botoes.append(botao('Tentar de novo', 'prim', mostraNuvem), botao('Fechar', 'sec', fecha));
      abre(); return;
    }
    const sair = botao('Sair da conta', 'sec', async () => { await sair_(); });

    if (meta && meta.v === 2) {
      const temDigital = !!(meta.digitais && Object.keys(meta.digitais).length) && await digitalDisponivel();
      prepara('Abrir seus dados', temDigital
        ? 'Use a digital ou o rosto para destravar seus dados neste aparelho. Se não der, o Google Drive resolve.'
        : 'Toque abaixo e escolha sua conta Google: o DIVA busca a chave na pasta dele do seu Drive e destrava seus dados.');
      if (temDigital) botoes.append(botao('Abrir com a digital', 'prim', acao(async () => { await abreComDigital(meta); await depoisDeAbrir(); })));
      botoes.append(botao('Recuperar pelo Google Drive', temDigital ? 'sec' : 'prim', acao(async () => { await abreComDrive(meta); await depoisDeAbrir(); })), sair);
    } else if (meta && chaveAntiga) {
      prepara('Proteção nova, sem frase-senha', 'Agora o DIVA destrava com a sua digital e se recupera pelo seu Google Drive. Você não vai mais precisar lembrar de frase nenhuma. O Google vai pedir uma permissão a mais, para o DIVA guardar a chave numa pasta escondida do seu Drive.');
      const velha = chaveAntiga;
      botoes.append(botao('Atualizar agora', 'prim', acao(async () => { await criaCofre(async () => velha); await depoisDeAbrir(); })), sair);
    } else if (meta) {
      prepara('Última vez com a frase-senha', 'O DIVA agora destrava com a digital e o Google Drive, sem frase-senha. Digite a sua frase uma última vez para trazer seus dados para a proteção nova.');
      $('nvCampos').append(campo('nvFrase', 'password', 'Frase-senha', 'off'));
      botoes.append(botao('Atualizar', 'prim', acao(async () => {
        const f = $('nvFrase').value; if (!f) { erro('Digite a frase-senha.'); return; }
        // a janela do Google abre antes da conta da frase, para o navegador não bloquear
        await criaCofre(() => chaveDaFraseAntiga(f, meta));
        await depoisDeAbrir();
      })), sair);
    } else {
      prepara('Proteger seus dados', 'O DIVA embaralha seus dados antes de irem para a nuvem. A chave fica numa pasta escondida do seu Google Drive, que só o DIVA enxerga: se trocar de celular, é só entrar com o Google. O Google vai pedir uma permissão a mais para isso.');
      botoes.append(botao('Criar meu cofre', 'prim', acao(async () => { await criaCofre(null); await depoisDeAbrir(); })), sair);
    }
    abre(); return;
  }

  if (pausado) {
    prepara('Sincronização pausada', 'Nada foi enviado para a nuvem ainda. Escolha qual versão dos dados vale, ou tente de novo.');
    botoes.append(botao('Escolher agora', 'prim', async () => { await sincronizaInicial(); if (!pausado) fecha(); }), botao('Fechar', 'sec', fecha));
    abre(); return;
  }
  const comDigital = !!digitalDesteAparelho();
  prepara('Tudo certo', 'Seus dados estão sendo guardados na nuvem, embaralhados' + (user.email ? ', na conta ' + user.email : '') + '. Em outro aparelho, entre com a mesma conta Google' + (comDigital ? ' e use a digital ou o Google Drive.' : ' e recupere pelo Google Drive.'));
  botoes.append(botao('Fechar', 'prim', fecha));
  if (!comDigital && await digitalDisponivel()) { const meta = await leMeta(); botoes.append(botao('Usar a digital neste aparelho', 'sec', acao(async () => { await cadastraDigital(meta); mostraNuvem(); }))); }
  botoes.append(botao('Sair desta conta', 'sec', async () => { await sair_(); }));
  abre();
}

async function sair_() {
  const uid = user && user.uid;
  try { if (uid) await apagaChave(uid); } catch (e) {}
  chave = null; chaveAntiga = null;
  await signOut(auth);
  fecha();
}

/* o convite automático espera a abertura animada e qualquer outra janela terminar */
function conviteQuandoLivre(tentativas) {
  if (user) return;
  const ocupado = document.querySelector('.modal-overlay.ativo,.rel-overlay.ativo,.festa-overlay.ativo,.premio-modal.ativo,.onb-overlay.ativo');
  if (ocupado && tentativas > 0) { setTimeout(() => conviteQuandoLivre(tentativas - 1), 3000); return; }
  if (!ocupado) mostraNuvem();
}

/* ---- liga tudo ---- */
onAuthStateChanged(auth, async (u) => {
  user = u;
  if (!u) {
    chave = null; chaveAntiga = null; setStatus('Desconectada');
    let adiou = false; try { adiou = !!localStorage.getItem('divaAdiar'); } catch (e) {}
    if (onboardingFeito() && !adiou) setTimeout(() => conviteQuandoLivre(10), 4500);
    else if (modal && !modal.hidden) mostraNuvem();
    return;
  }
  let guardada = null;
  try { guardada = await lerChave(u.uid); } catch (e) {}
  if (guardada && guardada.v === 2) { chave = guardada.chave; await sincronizaInicial(); return; }
  if (guardada && guardada.chave) {
    // chave do cofre antigo: serve só para atualizar, se a nuvem ainda estiver no formato antigo
    let meta = null; try { meta = (await get(ref(db, caminho('meta')))).val(); } catch (e) {}
    if (meta && meta.v === 2) { try { await apagaChave(u.uid); } catch (e) {} }
    else chaveAntiga = guardada.chave;
  }
  setStatus(chaveAntiga ? 'Conectada, falta atualizar a proteção' : 'Conectada, falta destravar');
  mostraNuvem();
});

// permite abrir o login de outras telas (Configurações e primeira tela do onboarding)
window.DIVAnuvem = {
  abrir: () => { try { localStorage.removeItem('divaAdiar'); } catch (e) {} mostraNuvem(); },
  status: () => statusTxt
};
setStatus(statusTxt);
