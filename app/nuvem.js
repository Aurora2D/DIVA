/* ============ NUVEM: login com Google + criptografia no aparelho ============
   Ligado ao index.html por uma tag script do tipo module (fica perto do fim).
   O Firebase só recebe texto embaralhado (AES-GCM). A chave nasce da
   frase-senha da pessoa (PBKDF2) e nunca sai do aparelho.

   O que este arquivo espera do resto do app (app/estado.js e app/celebrar.js):
   - window.DIVA = { getEstado, setEstado }
   - salva() chamando window.salvarNoFirebase()
   E o que ele oferece:
   - window.DIVAnuvem.abrir()   abre a janela de login / sincronização
   - window.DIVAnuvem.status()  texto curto do estado da sincronização
   - window.DIVAcripto          usado pelo backup (exporta cifrado quando há login)
   - evento 'diva-nuvem' no window sempre que o estado muda */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

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

/* ---- criptografia ---- */
async function derivaChave(frase, salt) {
  const base = await crypto.subtle.importKey('raw', enc.encode(frase.normalize('NFKC')), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 250000, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}
async function cifra(chave, texto) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, chave, enc.encode(texto));
  return { iv: b64(iv), ct: b64(ct) };
}
async function decifra(chave, o) {
  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(o.iv) }, chave, unb64(o.ct));
  return dec.decode(pt);
}

/* ---- chave guardada neste aparelho (não exportável) ---- */
function abreIDB() {
  return new Promise((res, rej) => {
    const r = indexedDB.open('diva-cofre', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('k');
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
async function guardaChave(uid, chave, salt) {
  const d = await abreIDB();
  return new Promise((res, rej) => { const tx = d.transaction('k', 'readwrite'); tx.objectStore('k').put({ chave, salt }, uid); tx.oncomplete = res; tx.onerror = () => rej(tx.error); });
}
async function lerChave(uid) {
  const d = await abreIDB();
  return new Promise((res, rej) => { const q = d.transaction('k').objectStore('k').get(uid); q.onsuccess = () => res(q.result || null); q.onerror = () => rej(q.error); });
}
async function apagaChave(uid) {
  const d = await abreIDB();
  return new Promise((res, rej) => { const tx = d.transaction('k', 'readwrite'); tx.objectStore('k').delete(uid); tx.oncomplete = res; tx.onerror = () => rej(tx.error); });
}

/* ---- estado ---- */
let user = null, chave = null, salt = null, timer = null, statusTxt = 'Desconectada';
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
    await set(ref(db, caminho('estado')), { v: 1, iv: c.iv, ct: c.ct, t });
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

    const remoto = JSON.parse(await decifra(chave, r)); // também confere a frase-senha
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

async function criaCofre(frase) {
  salt = crypto.getRandomValues(new Uint8Array(16));
  chave = await derivaChave(frase, salt);
  const check = await cifra(chave, 'diva-ok');
  await set(ref(db, caminho('meta')), { v: 1, salt: b64(salt), check });
  await guardaChave(user.uid, chave, salt);
  await sincronizaInicial();
}
async function abreCofre(frase, meta) {
  const s = unb64(meta.salt);
  const k = await derivaChave(frase, s);
  let ok = false;
  try { ok = (await decifra(k, meta.check)) === 'diva-ok'; } catch (e) {}
  if (!ok) throw new Error('frase-errada');
  salt = s; chave = k;
  await guardaChave(user.uid, chave, salt);
  await sincronizaInicial();
}

/* ---- backup cifrado (usa o mesmo salt da conta) ---- */
window.DIVAcripto = {
  ativo: () => !!chave,
  cifrarBackup: async (texto) => {
    const c = await cifra(chave, texto);
    return JSON.stringify({ diva: 1, cifrado: true, salt: b64(salt), iv: c.iv, ct: c.ct });
  },
  abrirBackup: async (obj, frase) => {
    const k = await derivaChave(frase, unb64(obj.salt));
    return decifra(k, obj);
  }
};

/* ---- janela de login ---- */
const erros = {
  'auth/network-request-failed': 'Sem conexão agora. Tente de novo.',
  'auth/too-many-requests': 'Muitas tentativas. Espere um pouco.',
  'auth/popup-closed-by-user': 'A janela do Google foi fechada antes de terminar. Tente de novo.',
  'auth/cancelled-popup-request': 'A janela do Google foi fechada antes de terminar. Tente de novo.',
  'auth/popup-blocked': 'O navegador bloqueou a janela do Google. Libere pop-ups para este site e tente de novo.',
  'auth/unauthorized-domain': 'Este site ainda não está autorizado no Firebase (Authentication → Configurações → Domínios autorizados).',
  'auth/configuration-not-found': 'O Authentication ainda não foi iniciado no Firebase (console → Authentication → Vamos começar).',
  'auth/operation-not-allowed': 'O login com Google ainda não foi ativado no Firebase.',
  'auth/operation-not-supported-in-this-environment': 'Este jeito de abrir o app não permite a janela do Google. Abra o DIVA pelo navegador.',
  'auth/api-key-not-valid.-please-pass-a-valid-api-key.': 'A chave do Firebase no app está inválida.',
  'auth/invalid-api-key': 'A chave do Firebase no app está inválida.',
  'auth/admin-restricted-operation': 'Criar contas está desativado no Firebase.',
  'auth/app-not-authorized': 'Este app não está autorizado a usar esse projeto do Firebase.'
};
const msgErro = e => erros[e && e.code] || ('Algo deu errado (' + ((e && e.code) || (e && e.message) || 'sem código') + ').');

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

async function mostraNuvem() {
  garanteModal();
  const campos = $('nvCampos'), botoes = $('nvBotoes');
  campos.innerHTML = ''; botoes.innerHTML = ''; erro('');

  if (!user) {
    $('nvTitulo').textContent = 'Guardar seus dados com segurança';
    $('nvTexto').textContent = 'Entre com sua conta Google para guardar seus dados na nuvem e usar o DIVA em mais de um aparelho. Tudo é embaralhado antes de sair daqui: só você consegue ler.';
    botoes.append(
      botao('Entrar com o Google', 'prim', async () => {
        erro('');
        try { await signInWithPopup(auth, new GoogleAuthProvider()); }
        catch (err) { console.error('Erro de login:', err); erro(msgErro(err)); }
      }),
      botao('Agora não', 'sec', () => { try { localStorage.setItem('divaAdiar', '1'); } catch (e) {} fecha(); })
    );
    abre(); return;
  }

  if (!chave) {
    let meta = null;
    try { const s = await get(ref(db, caminho('meta'))); meta = s.exists() ? s.val() : null; }
    catch (e) {
      $('nvTitulo').textContent = 'Sem conexão';
      $('nvTexto').textContent = 'Não foi possível verificar seu cofre. Seus dados neste aparelho continuam salvos.';
      erro('Não consegui falar com a nuvem. Tente de novo.');
      botoes.append(botao('Tentar de novo', 'prim', mostraNuvem), botao('Fechar', 'sec', fecha));
      abre(); return;
    }
    const sair = botao('Sair da conta', 'sec', async () => { await sair_(); });
    if (meta) {
      $('nvTitulo').textContent = 'Sua frase-senha';
      $('nvTexto').textContent = 'Digite a frase-senha que você criou para proteger seus dados. Ela não é a senha do Google.';
      campos.append(campo('nvFrase', 'password', 'Frase-senha', 'off'));
      botoes.append(botao('Desbloquear', 'prim', async () => {
        erro(''); const f = $('nvFrase').value; if (!f) { erro('Digite a frase-senha.'); return; }
        try { await abreCofre(f, meta); if (!pausado) fecha(); } catch (err) { erro(err.message === 'frase-errada' ? 'Frase-senha incorreta.' : 'Não consegui desbloquear. Tente de novo.'); }
      }), sair);
    } else {
      $('nvTitulo').textContent = 'Crie sua frase-senha';
      $('nvTexto').textContent = 'Ela embaralha seus dados antes de irem para a nuvem. Escolha algo que você lembre, com 8 ou mais caracteres. Atenção: se esquecer, ninguém consegue recuperar os dados da nuvem (nem quem fez o app).';
      campos.append(campo('nvFrase', 'password', 'Frase-senha (mín. 8)', 'new-password'), campo('nvFrase2', 'password', 'Repita a frase-senha', 'new-password'));
      botoes.append(botao('Criar e sincronizar', 'prim', async () => {
        erro(''); const f = $('nvFrase').value, f2 = $('nvFrase2').value;
        if (f.length < 8) { erro('Use pelo menos 8 caracteres.'); return; }
        if (f !== f2) { erro('As duas frases não são iguais.'); return; }
        try { await criaCofre(f); if (!pausado) fecha(); } catch (err) { console.error(err); erro('Não consegui criar agora. Tente de novo.'); }
      }), sair);
    }
    abre(); return;
  }

  if (pausado) {
    $('nvTitulo').textContent = 'Sincronização pausada';
    $('nvTexto').textContent = 'Nada foi enviado para a nuvem ainda. Escolha qual versão dos dados vale, ou tente de novo.';
    botoes.append(botao('Escolher agora', 'prim', async () => { await sincronizaInicial(); if (!pausado) fecha(); }), botao('Fechar', 'sec', fecha));
    abre(); return;
  }
  $('nvTitulo').textContent = 'Tudo certo';
  $('nvTexto').textContent = 'Seus dados estão sendo guardados na nuvem, embaralhados' + (user.email ? ', na conta ' + user.email : '') + '. Em outro aparelho, entre com a mesma conta Google e a mesma frase-senha.';
  botoes.append(botao('Fechar', 'prim', fecha), botao('Sair desta conta', 'sec', async () => { await sair_(); }));
  abre();
}

async function sair_() {
  const uid = user && user.uid;
  try { if (uid) await apagaChave(uid); } catch (e) {}
  chave = null; salt = null;
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
    chave = null; salt = null; setStatus('Desconectada');
    let adiou = false; try { adiou = !!localStorage.getItem('divaAdiar'); } catch (e) {}
    if (onboardingFeito() && !adiou) setTimeout(() => conviteQuandoLivre(10), 4500);
    else if (modal && !modal.hidden) mostraNuvem();
    return;
  }
  let guardada = null;
  try { guardada = await lerChave(u.uid); } catch (e) {}
  if (guardada) { chave = guardada.chave; salt = guardada.salt; await sincronizaInicial(); }
  else { setStatus('Conectada, falta a frase-senha'); mostraNuvem(); }
});

// permite abrir o login de outras telas (Configurações e primeira tela do onboarding)
window.DIVAnuvem = {
  abrir: () => { try { localStorage.removeItem('divaAdiar'); } catch (e) {} mostraNuvem(); },
  status: () => statusTxt
};
setStatus(statusTxt);
