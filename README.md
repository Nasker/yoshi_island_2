# 🦕 El joc d'Unai — poYoshi Island II

Un joc de plataformes 2D fet per l'Unai amb Phaser 3.
El Poshi (el seu dinosaure dibuixat a mà) rescata el nadó Mario
a través de 14 móns inventats.

## Com es juga

Necessites un servidor local (els jocs no funcionen bé obrint
el fitxer directament):

```bash
cd "poYoshi Island II"
python3 -m http.server 8000
```

I obre http://localhost:8000 al navegador.

**Controls:** ← → mou-te · ESPAI (mantén) salta i plana ·
Z llengua · X apunta i tira ou · ↓ tubs i portes secrets ·
R reinicia

**Trucs:** `?nivell=5` a l'URL salta directament a un nivell.
El joc antic de canvas és a `joc_antic.html` per comparar.

## Fer contingut nou

- **Nivell nou**: copia `levels/exemple.js`, registra'l a
  `levels/manifest.js` — o dibuixa'l a `tools/editor_nivell.html` —
  o escaneja un esbós i passa'l per `tools/esbos_nivell.py`!
- **Personatge nou**: dibuixa'l i `python3 tools/neteja_sprite.py elmeudibuix.png`
- **Música**: edita la cançó del nivell a `src/so.js` (4 canals
  Game Boy: melodia, harmonia, baix i percussió)

Més detalls: `GAME_DEV_GUIDELINES.md` i `GAME_DESIGN.md`.
