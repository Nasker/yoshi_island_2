// ==================== PIXEL ART ====================
// Cada lletra és un color; els punts són transparents
const PAL = {
  G:'#4CAF50', W:'#ffffff', w:'#fff8dc', K:'#222222',
  R:'#ff5252', O:'#ff9800', P:'#ffcf9e', Y:'#ffeb3b',
  F:'#ffb74d', B:'#6d4c41', p:'#ff6f91', U:'#ab47bc'
};
const ROBE = {red:'#ff5252', blue:'#42a5f5', green:'#66bb6a', pink:'#f06292'};
const S = 3;   // cada píxel del dibuix fa 3 unitats de món (1 píxel de pantalla retro)

function drawSprite(art, x, y, flip, over, sc) {
  const pal = over ? Object.assign({}, PAL, over) : PAL;
  const sz = S * (sc || 1);   // escala: 2 = gegant (pel BOSS!)
  for (let r = 0; r < art.length; r++) {
    const row = art[r];
    for (let c = 0; c < row.length; c++) {
      const ch = row[flip ? row.length - 1 - c : c];
      if (ch === '.' || ch === ' ') continue;
      ctx.fillStyle = pal[ch] || '#ff00ff';
      ctx.fillRect(x + c * sz, y + r * sz, sz, sz);
    }
  }
}

const DINO_A = [
"..RR............",
".RRGGGGGGG......",
".RGGGGGGGGGG....",
"..GGGWWWGGGGG...",
"..GGGWWKGGGGGG..",
"..GGGWWWGGGGGGG.",
"...GGGGGGGGGGGG.",
"...GGGGGGGGGGGGG",
"....GGGGGGGGGGGG",
"G...GGGGGGGGGGG.",
"GG..GGGWWWWWGG..",
"GGG.GGGWWWWWWG..",
"GGGG.GGWWWWWGG..",
".GG...GGWWWWGG..",
"......OOOO.OOO..",
".....OOOOO.OOOO."
];
const DINO_B = DINO_A.slice(0, 14).concat([
"....OOO....OOOO.",
"...OOO.....OOOOO"
]);
const DINO_JUMP = DINO_A.slice(0, 14).concat([
"......OOOOOOO...",
".....OOO..OOO..."
]);

// ===== EL POSHI! 🐤 el personatge dibuixat per l'Unai =====
// La imatge gran i detallada: assets/poshi_clean.png (retallada i transparent)
const POSHI_IMG = new Image();
let POSHI_OK = false;
POSHI_IMG.onload = () => { POSHI_OK = true; };
POSHI_IMG.src = 'assets/poshi_clean.png';
// Pla B: la versió pixel petita de js/poshi.js per si el PNG no carrega
const POSHI_CANVAS = document.createElement('canvas');
POSHI_CANVAS.width = POSHI_W; POSHI_CANVAS.height = POSHI_H;
{
  const pctx = POSHI_CANVAS.getContext('2d');
  const img = pctx.createImageData(POSHI_W, POSHI_H);
  const bin = atob(POSHI_B64);
  for (let i = 0; i < bin.length; i++) img.data[i] = bin.charCodeAt(i);
  pctx.putImageData(img, 0, 0);
}

const BABY = [
".RRRR.",
"RRRRRR",
"RPPPPR",
"PPKKPP",
".PPPP.",
".RRRR."
];

const SHYGUY_A = [
"...RRRRRR...",
"..RRRRRRRR..",
"..RRRRRRRR..",
"..RWWWWWWR..",
"..RWKWWKWR..",
"..RWWWWWWR..",
"..RWWKKWWR..",
"..RRRRRRRR..",
"...RRRRRR...",
"..BBBBBBBB..",
"..RRRRRRRR..",
"...RRRRRR...",
"...BB..BB...",
"..BBB..BBB.."
];
const SHYGUY_B = SHYGUY_A.slice(0, 12).concat([
"..BB..BB....",
".BBB..BBB..."
]);

const APPLE = [
"...K....",
".GGK....",
"RRRRRRR.",
"RRRRRRRR",
"RRRRRRRR",
"RRRRRRRR",
".RRRRRR.",
"..RRRR.."
];

const FLOWER = [
"..YY..YY..",
".YYYYYYYY.",
".YYFFFFYY.",
"YYFFKFKFYY",
"YYFFFFFFYY",
".YYFKKFYY.",
".YYFFFFYY.",
".YYYYYYYY.",
"..YY..YY.."
];

const EGG = [
"..WWW..",
".WGGGW.",
"WGWWGW.",
"WWWWWW.",
"WGWWGW.",
".WGGW..",
"..WWW.."
];

const HEART = [
".RR..RR.",
"RRRRRRRR",
"RRRRRRRR",
"RRRRRRRR",
".RRRRRR.",
"..RRRR..",
"...RR...",
"....R..."
];

const STAR = [
"....Y....",
"...YYY...",
".YYYYYYY.",
"..YYYYY..",
"..YYYYY..",
".YYY.YYY.",
"YYY...YYY"
];

const MINE = [
"..K..KK..K..",
"...KKKKKK...",
".KKKRRKKKK..",
"KKKKKKKKKKK.",
".KKKKKKKKK..",
"...KKKKKK...",
"..K..KK..K.."
];

// Fly Guy: Shy Guy amb hèlix que vola!
const FLY_A = [
"..KKKKKK..",
"....KK....",
"..RRRRRR..",
"..RRRRRR..",
"..RWWKWR..",
"..RWKKWR..",
"..RWWWWR..",
"..RRRRRR..",
"...RRRR..."
];
const FLY_B = FLY_A.slice();
FLY_B[0] = "....KK....";

// Planta piraña que mossega!
const PLANT_A = [
"..RRRRRR..",
".RWRRRRWR.",
".RRRRRRRR.",
".WWWWWWWW.",
"...GGGG...",
"...GGGG...",
"..GGGGGG.."
];
const PLANT_B = [
"..RRRRRR..",
".RWRRRRWR.",
".RRRRRRRR.",
".WKKKKKKW.",
"..WWWWWW..",
"...GGGG...",
"..GGGGGG.."
];

const GRAPE = [
"..GK....",
"..UKK...",
".UUUUU..",
"UUUUUUU.",
"UUUUUUU.",
".UUUUU..",
"..UUU...",
"...U...."
];

const TREE = [
"...GGGG...",
".GGGGGGGG.",
"GGGGGGGGGG",
".GGGGGGGG.",
"..GGGGGG..",
"....BB....",
"....BB....",
"...BBBB..."
];

const MUSH = [
"..RRRR..",
".RWRWWR.",
"RRRRRRRR",
".WWWWWW.",
"..WWWW..",
"...WW..."
];

// bloc "?" sorpresa: pica'l amb el cap!
const QBLOCK = [
"..WWWWWWWW..",
".WWWKKKWWWW.",
"WWWKWWWKWWWW",
"WWWWWWKWWWWW",
"WWWWWKWWWWWW",
"WWWWWWWWWWWW",
"WWWWWKWWWWWW",
".WWWWWWWWWW."
];

// Pinxo: enemic punxegut que NO es pot menjar!
const SPIKY = [
"..K......K..",
".PKKPPPPKKP.",
"PPPPPPPPPPPP",
"PPWKKPPKKWPP",
"PPPPPPPPPPPP",
"PPPPPPPPPPPP",
".PPPPPPPPP..",
".PKPPPPPKP..",
"..K.PP.K....",
"...PP.PP...."
];

const COIN = [
"..YYYY..",
".YYYYYY.",
"YYOYYYYY",
"YYOYYYYY",
"YYOYYYYY",
".YYYYYY.",
"..YYYY.."
];

// bola de foc que disparen els bosses!
const SHOT = [
"..OO..",
".OYOO.",
"OYYYYO",
"OYYYYO",
".OYOO.",
"..OO.."
];

// EL BOSS DEL NIVELL 3: L'ALIEN GEGANT! 👽
const ALIEN = [
"...GG..GG...",
"....GGGG....",
"..GGGGGGGG..",
".GGGGGGGGGG.",
"GGWWKGGKWWGG",
"GGGGGGGGGGGG",
".GGGGGGGGGG.",
"..GGGGGGGG..",
"...G....G...",
"..GG....GG.."
];

// bolet trampolí: t'envola cap al cel!
const BOUNCE = [
"....RRRR....",
"..RRRRRRRR..",
".RWRRRRRRWR.",
"RRRRRRRRRRRR",
"...WWWWWW...",
"...WWWWWW...",
"....WWWW...."
];

// peix de la claveguera! 🐟
const FISH = [
"...OOOO......YYY",
"..OOOOO.....YYY.",
".OKOOOOO...YYYYY",
"OOOOOOOOOYYYYYY.",
"OOOOOOOOOYYYYYY.",
".OKOOOOO...YYYYY",
"..OOOOO.....YYY.",
"...OOOO......YYY"
];

// caqueta enemiga! 💩 petita i caminant
const POOP = [
".....BB.....",
"....BBBB....",
"...BBBBBB...",
"..BBBBBBBB..",
".BWWKBBKWWB.",
".BBBBBBBBBB.",
"BBBBBBBBBBBB",
"BBBBBBBBBBBB"
];
