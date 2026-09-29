#!/usr/bin/env python3
# ============================================================
#  NETEJA SPRITE 🧹🎨  — eina de l'Unai per preparar dibuixos!
#
#  Fa 3 coses al teu dibuix PNG:
#   1. LLEVA el fons clar/blanquinós (el fa transparent)
#   2. RETALLA la imatge just al voltant del dibuix
#   3. FA una versió més petita perquè el joc vagi ràpid
#
#  Com es fa servir (des de la carpeta del joc):
#     python3 tools/neteja_sprite.py assets/elmeudibuix.png
#
#  I ja està! Crea  assets/elmeudibuix_clean.png
#
#  Opcions:
#     -o SORTIDA.png   tria el nom del fitxer de sortida
#     -m 400           alçada màxima en píxels (per defecte 400)
#     -t 195           llindar de fons clar (per defecte 195;
#                     puja'l si el fons és més fosc)
# ============================================================
import sys
from PIL import Image

def neteja(entrada, sortida, max_h=400, llindar=195):
    im = Image.open(entrada).convert('RGBA')
    px = im.load()
    W, H = im.size

    # 1) treure el fons clar
    for y in range(H):
        for x in range(W):
            r, g, b, a = px[x, y]
            if r > llindar and g > llindar + 10 and b > llindar + 20:
                px[x, y] = (r, g, b, 0)

    # 2) retallar just al voltant del dibuix
    bbox = im.getbbox()
    if bbox is None:
        print('⚠️  No he trobat cap dibuix! Prova amb un llindar més baix (-t 150)')
        return
    im = im.crop(bbox)

    # 3) fer-lo petit per al joc
    im.thumbnail((max_h, max_h), Image.LANCZOS)
    im.save(sortida)
    print(f'✅ {sortida}  —  {im.size[0]}x{im.size[1]} píxels')
    print('   Ara pots fer-lo servir al joc amb:')
    print(f'   const IMG = new Image(); IMG.src = "{sortida}";')

def main():
    args = sys.argv[1:]
    if not args or '-h' in args or '--help' in args:
        print(__doc__)
        return

    entrada = args[0]
    sortida = entrada.rsplit('.', 1)[0] + '_clean.png'
    max_h = 400
    llindar = 195

    i = 1
    while i < len(args):
        if args[i] == '-o':
            sortida = args[i + 1]; i += 2
        elif args[i] == '-m':
            max_h = int(args[i + 1]); i += 2
        elif args[i] == '-t':
            llindar = int(args[i + 1]); i += 2
        else:
            i += 1

    neteja(entrada, sortida, max_h, llindar)

if __name__ == '__main__':
    main()
