#!/bin/sh
# Traz a versão mais recente da gatinha (repositório Aurora2D/Mascote) para a pasta mascote/.
# Uso: sh scripts/atualizar-mascote.sh   (depois: git add mascote && git commit)
set -e
cd "$(dirname "$0")/.."
tmp=$(mktemp -d)
git clone --depth 1 https://github.com/Aurora2D/Mascote "$tmp/m"
rm -rf mascote/assets
cp "$tmp/m/fantoche.js" mascote/
cp -r "$tmp/m/assets" mascote/
cp "$tmp/m/LEIA-ME.md" mascote/
git -C "$tmp/m" rev-parse HEAD > mascote/VERSAO.txt
rm -rf "$tmp"
echo "Mascote atualizada para $(cat mascote/VERSAO.txt)"
