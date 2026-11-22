#!/bin/sh
# Copia a página da Niquinha (pasta niquinha/ na raiz) pra dentro do app de Android.
# O sw.js fica de fora: dentro do app os arquivos já estão no aparelho.
set -e
cd "$(dirname "$0")"
rm -rf www
cp -R ../niquinha www
rm -f www/sw.js
echo "www/ pronto: $(du -sh www | cut -f1)"
