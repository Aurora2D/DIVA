#!/usr/bin/env python3
"""Gera DIVA-index-com-trilha.html: o app inteiro num arquivo só (CSS, JS, fontes e gatinha embutidos).
Uso: python3 scripts/gerar-arquivo-unico.py [saida.html]"""
import re, base64, glob, os, sys
raiz = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
saida = sys.argv[1] if len(sys.argv) > 1 else os.path.join(raiz, 'DIVA-index-com-trilha.html')
ler = lambda p: open(os.path.join(raiz, p), encoding='utf-8').read()
b64 = lambda p: base64.b64encode(open(os.path.join(raiz, p), 'rb').read()).decode()
html = ler('index.html')

def css(m):
    caminho = m.group(1)
    txt = ler(caminho)
    base = os.path.dirname(caminho)
    def fonte(f):
        arq = os.path.join(base, f.group(1))
        tipo = 'font/woff2' if arq.endswith('woff2') else 'application/octet-stream'
        return 'url(data:%s;base64,%s)' % (tipo, b64(arq))
    txt = re.sub(r'url\((fontes/[^)]+)\)', fonte, txt)
    return '<style>\n' + txt + '\n</style>'
html = re.sub(r'<link rel="stylesheet" href="((?:estilo|atracao)/[^"?]+)(?:\?[^"]*)?">', css, html)

assets = {os.path.basename(f)[:-5]: 'data:image/webp;base64,' + base64.b64encode(open(f, 'rb').read()).decode()
          for f in sorted(glob.glob(os.path.join(raiz, 'mascote/assets/pecas/*.webp')))}
js_assets = 'window.FANTOCHE_ASSETS=' + '{' + ','.join('"%s":"%s"' % (k, v) for k, v in assets.items()) + '};'

def script(m):
    caminho = m.group(1)
    txt = ler(caminho).replace('</script', '<\\/script')
    pre = ('<script>' + js_assets + '</script>\n') if caminho == 'mascote/fantoche.js' else ''
    return pre + '<script>\n' + txt + '\n</script>'
html = re.sub(r'<script src="((?:mascote|estilo|atracao|relatorio)/[^"?]+)(?:\?[^"]*)?"></script>', script, html)

assert not re.search(r'(?:href|src)="(?:estilo|atracao|mascote|relatorio)/', html), 'sobrou arquivo externo'
open(saida, 'w', encoding='utf-8').write(html)
print(saida, round(len(html) / 1024), 'KB')
