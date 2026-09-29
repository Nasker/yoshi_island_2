#!/usr/bin/env python3
# ============================================================
#  ESBÓS → NIVELL ✏️➡️🎮  — converteix un dibuix en un nivell!
#
#  Com funciona? Dibuixa el teu nivell amb retoladors:
#  cada COLOR es converteix en un tipus de plataforma!
#
#     🟢 VERD      → terra ('ground')
#     🟡 GROC      → sorra ('sand')
#     🟤 MARRÓ     → roca ('rock')
#     ⬜ GRIS      → metall ('metal')
#     🔵 BLAU CLAR → núvol ('cloud')
#     🟣 ROSA      → globus ('balloon')
#     🔴 VERMELL   → punxes!! ('spikes', hurt)
#     ⚫ BLAU FOSC → nit ('night')
#
#  Com es fa servir (des de la carpeta del joc):
#     python3 tools/esbos_nivell.py dibuix.png 15
#
#  I això crea  levels/nivell15.js  amb totes les plataformes!
#  Després afegeix 'nivell15.js' a levels/manifest.js i juga amb
#  index.html?nivell=15
#
#  Opcions:
#     -o FITXER.js    nom de sortida (per defecte levels/nivellN.js)
#     -a 540          alçada del món en píxels (per defecte 540)
#     --vista-previa  guarda també un PNG amb els rectangles detectats
#
#  Consells per dibuixar:
#   * Fons blanc (o clar) — això es considera "buit"
#   * Colors ben plens, sense molt ombrejat
#   * Cada plataforma = un rectangle farcit d'un sol color
# ============================================================
import sys, os
from PIL import Image

# color → (tipus, hurt)
TARJA = [
    # (R, G, B) aproximat → tipus de plataforma
    ('verd',      (60, 180, 80),   'ground'),
    ('groc',      (230, 190, 60),  'sand'),
    ('marro',     (150, 90, 40),   'rock'),
    ('gris',      (150, 150, 160), 'metal'),
    ('blauclar',  (150, 210, 255), 'cloud'),
    ('rosa',      (255, 140, 200), 'balloon'),
    ('vermell',   (220, 50, 50),   'spikes'),
    ('blaufosc',  (40, 60, 120),   'night'),
]
BLANC = 215   # per sobre d'això (a tots els canals) → fons buit

def colorMesProper(r, g, b):
    """Troba el color de la TARJA més semblant.
       - fons clar/paper → None
       - traç de bolígraf/làpis (tinta fosca sense color marcat) → 'rock'
       - color farcit → el seu tipus!"""
    brillant = max(r, g, b)
    saturat = brillant - min(r, g, b)
    if r > BLANC and g > BLANC and b > BLANC:
        return None                       # paper blanc → res
    millor, dist = None, 1e9
    for nom, (tr, tg, tb), tipus in TARJA:
        d = (r-tr)**2 + (g-tg)**2 + (b-tb)**2
        if d < dist:
            dist, millor = d, (tipus, tipus == 'spikes')
    # només colors de RETOLADOR ben vius compten com a tipus;
    # la tinta fosca/del bolígraf sempre és 'rock'
    if saturat > 90 and brillant > 130 and dist < 6000:
        return millor
    if brillant < 215:                    # tinta fosca → paret de roca
        return ('rock', False)
    return None

def detecta(im, altura_mon):
    """Retorna una llista de plataformes {x,y,w,h,type,hurt}."""
    W, H = im.size
    esc = altura_mon / H
    im = im.resize((max(1, round(W*esc)), altura_mon))
    W, H = im.size
    px = im.convert('RGB').load()

    # classifica cada píxel
    graella = [[None]*W for _ in range(H)]
    for y in range(H):
        for x in range(W):
            graella[y][x] = colorMesProper(*px[x, y])

    # fusiona files en rectangles (gredol simple però robust):
    # per cada fila, troba línies contínues del mateix tipus
    rects = []
    for y in range(H):
        x = 0
        while x < W:
            t = graella[y][x]
            if t is None:
                x += 1
                continue
            x2 = x
            while x2 < W and graella[y][x2] == t:
                x2 += 1
            rects.append([x, y, x2-x, 1, t])
            x = x2
    # apila rectangles iguals i alineats
    fusionats = []
    for r in rects:
        if fusionats and fusionats[-1][0] == r[0] and fusionats[-1][2] == r[2] \
           and fusionats[-1][4] == r[4] and fusionats[-1][1] + fusionats[-1][3] == r[1]:
            fusionats[-1][3] += 1
        else:
            fusionats.append(list(r))
    # filtra trossets massa petits (soroll del dibuix) i dóna un mínim
    # de gruix a les parets fines (la tinta fa línies d'1-4 píxels!)
    resultat = []
    for x, y, w, h, t in fusionats:
        if w < 6 and h < 6:
            continue
        if h < 12: y -= (12 - h) // 2; h = 12
        if w < 12: w = 12
        resultat.append([x, max(0, y), w, h, t])
    return resultat

def escriuNivell(rects, num, amplada, sortida):
    línies = [f"// Nivell {num} fet amb l'esbós dibuixat a mà! ✏️",
              "// Generat per tools/esbos_nivell.py — retoca'l a gust!",
              f"registraNivell({num}, {{",
              f"  titol: 'Nivell dibuixat!',",
              f"  fi: {amplada}, flag: [{amplada - 150}, 380], seguent: 0,",
              "  plataformes: ["]
    for x, y, w, h, t in rects:
        extra = ", hurt:true" if t[1] else ""
        línies.append(f"    {{x:{x}, y:{y}, w:{w}, h:{h}, type:'{t[0]}'{extra}}},")
    línies += ["  ],",
               "  enemics: [",
               "    // afegeix els teus enemics aquí! ex: ['shy', 400, 300, 700, 'red'],",
               "  ],",
               "  fruitaSola: [",
               "    // [300, 300, 'apple'],",
               "  ],",
               "});",
               ""]
    with open(sortida, 'w') as f:
        f.write('\n'.join(línies))

def vistaPrevia(rects, im, esc):
    pre = im.copy()
    from PIL import ImageDraw
    d = ImageDraw.Draw(pre)
    for x, y, w, h, t in rects:
        d.rectangle([x/esc, y/esc, (x+w)/esc, (y+h)/esc],
                    outline=(255, 0, 255), width=2)
    return pre

def main():
    args = [a for a in sys.argv[1:] if not a.startswith('-')]
    if len(args) < 2:
        print(__doc__)
        sys.exit(1)
    entrada, num = args[0], int(args[1])
    sortida = f"levels/nivell{num}.js"
    altura = 540
    previa = '--vista-previa' in sys.argv
    for i, a in enumerate(sys.argv):
        if a == '-o': sortida = sys.argv[i+1]
        if a == '-a': altura = int(sys.argv[i+1])

    im = Image.open(entrada).convert('RGB')
    W, H = im.size
    esc = altura / H
    rects = detecta(im, altura)
    amplada = round(W * esc)
    escriuNivell(rects, num, amplada, sortida)
    print(f"✅ {len(rects)} plataformes detectades → {sortida}")
    print(f"   Món: {amplada} x {altura} píxels")
    print(f"   Afegeix 'nivell{num}.js' a levels/manifest.js i juga!")
    if previa:
        nom = sortida.replace('.js', '_vista.png')
        vistaPrevia(rects, im, esc).save(nom)
        print(f"   Vista prèvia: {nom}")

if __name__ == '__main__':
    main()
