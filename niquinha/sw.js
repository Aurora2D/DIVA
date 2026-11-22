/* Guarda a Niquinha no aparelho pra abrir mesmo sem internet.
   Mudou algum arquivo da pasta? Suba o número de VERSAO pra todo mundo receber a novidade. */
const VERSAO = 'niquinha-1';
const ARQUIVOS = [
  './', 'index.html', 'manifest.webmanifest', 'fantoche.js', 'fantoche-assets.js',
  'andando.webp', 'deitando.webp', 'acordando.webp', 'celebrando.webp?v=2', 'celebrando.mp3',
  'icones/icone-192.png', 'icones/icone-512.png', 'icones/icone-512-maskable.png', 'icones/apple-touch-icon.png',
  'miados/v1-1.mp3', 'miados/v1-2.mp3', 'miados/v2-1.mp3', 'miados/v2-2.mp3', 'miados/v2-3.mp3', 'miados/v2-4.mp3', 'miados/v3-1.mp3', 'miados/v3-2.mp3', 'miados/v3-3.mp3', 'miados/v3-4.mp3', 'miados/v4-1.mp3', 'miados/v4-2.mp3', 'miados/v4-3.mp3', 'miados/v4-4.mp3', 'miados/v4-5.mp3'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSAO).then((c) => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((nomes) => Promise.all(nomes.filter((n) => n.startsWith('niquinha-') && n !== VERSAO).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

/* Abre na hora com o que está guardado e, se tiver internet, atualiza a cópia por trás. */
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;   // fonte do Google e afins seguem o caminho normal
  e.respondWith(
    caches.open(VERSAO).then((c) =>
      c.match(e.request, { ignoreVary: true }).then((guardado) => {
        const daRede = fetch(e.request).then((r) => {
          if (r && r.status === 200) c.put(e.request, r.clone());
          return r;
        }).catch(() => guardado);
        return guardado || daRede;
      })
    )
  );
});
