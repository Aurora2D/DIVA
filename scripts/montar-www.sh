#!/bin/sh
# Junta em www/ só o que o app precisa pra rodar dentro do Android.
# (A Niquinha, os documentos e os scripts ficam de fora.)
set -e
cd "$(dirname "$0")/.."
rm -rf www
mkdir www
cp index.html manifest.webmanifest www/
for pasta in app atracao audio estilo icones logo mascote relatorio; do
  cp -R "$pasta" www/
done
echo "www/ pronto: $(du -sh www | cut -f1)"
