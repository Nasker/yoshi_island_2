// ==================== PIXEL ART ====================
// Cada lletra és un color de PAL; els punts són transparents.
// Abans dibuixàvem píxel a píxel cada frame; ara Phaser converteix cada
// dibuix en una TEXTURA una sola vegada (bakeArt) i després fem servir
// sprites de veritat — més ràpid i poden girar, parpellejar i moure's sols!
function bakeArt(scene, key, art, over) {
  const pal = over ? Object.assign({}, PAL, over) : PAL;
  const w = art[0].length, h = art.length;
  const t = scene.textures.createCanvas(key, w, h);
  const c = t.getContext();
  for (let r = 0; r < h; r++)
    for (let q = 0; q < w; q++) {
      const ch = art[r][q];
      if (ch === '.' || ch === ' ') continue;
      c.fillStyle = pal[ch] || '#ff00ff';
      c.fillRect(q, r, 1, 1);
    }
  t.refresh();
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

// torxa del castell — la flama tremola!
const TORCH = [
"...YY...",
"..YOYY..",
"..YOYY..",
"..YOOY..",
"...OO...",
"...BB...",
"...BB...",
"..BBBB.."
];

// ==================== CUITA DE TEXTURES ====================
// Ho diem una vegada a l'arrencar: tots els dibuixos es converteixen
// en textures perquè Phaser els pugui fer servir com a sprites.
function bakeTextures(scene) {
  // Shy Guys i Fly Guys de tots els colors de la túnica!
  for (const c of Object.keys(ROBE)) {
    const over = {R: ROBE[c]};
    bakeArt(scene, 'shy_' + c + '_a', SHYGUY_A, over);
    bakeArt(scene, 'shy_' + c + '_b', SHYGUY_B, over);
    bakeArt(scene, 'fly_' + c + '_a', FLY_A, over);
    bakeArt(scene, 'fly_' + c + '_b', FLY_B, over);
  }
  bakeArt(scene, 'dino_a', DINO_A);
  bakeArt(scene, 'dino_b', DINO_B);
  bakeArt(scene, 'dino_jump', DINO_JUMP);
  bakeArt(scene, 'baby', BABY);
  bakeArt(scene, 'apple', APPLE);
  bakeArt(scene, 'flower', FLOWER);   // el meló-trésor!
  bakeArt(scene, 'egg', EGG);
  bakeArt(scene, 'heart', HEART);
  bakeArt(scene, 'star', STAR);
  bakeArt(scene, 'mine', MINE);
  bakeArt(scene, 'plant_a', PLANT_A);
  bakeArt(scene, 'plant_b', PLANT_B);
  bakeArt(scene, 'grape', GRAPE);
  bakeArt(scene, 'tree', TREE);
  bakeArt(scene, 'mush', MUSH);
  bakeArt(scene, 'qblock', QBLOCK);
  bakeArt(scene, 'qblock_used', QBLOCK, {W:'#7a7a8a', K:'#444'});   // bloc gastat
  bakeArt(scene, 'spiky', SPIKY);
  bakeArt(scene, 'coin', COIN);
  bakeArt(scene, 'shot', SHOT);
  bakeArt(scene, 'shot_choco', SHOT, {O:'#8d6e63', Y:'#6d4c41'});   // tir de la claveguera
  // versions BLANQUES: els bosses parpellejen quan els fas mal!
  bakeArt(scene, 'shy_white_a', SHYGUY_A, {R: '#ffffff'});
  bakeArt(scene, 'shy_white_b', SHYGUY_B, {R: '#ffffff'});
  bakeArt(scene, 'fly_white_a', FLY_A, {R: '#ffffff'});
  bakeArt(scene, 'fly_white_b', FLY_B, {R: '#ffffff'});
  bakeArt(scene, 'alien_white', ALIEN, {G: '#ffffff'});
  bakeArt(scene, 'alien', ALIEN);
  bakeArt(scene, 'bounce', BOUNCE);
  bakeArt(scene, 'fish', FISH);
  bakeArt(scene, 'poop', POOP);
  bakeArt(scene, 'torch', TORCH);

  // Pla B del Poshi: la versió pixel petita per si el PNG no carrega
  const t = scene.textures.createCanvas('poshi_px', POSHI_W, POSHI_H);
  const c = t.getContext();
  const img = c.createImageData(POSHI_W, POSHI_H);
  const bin = atob(POSHI_B64);
  for (let i = 0; i < bin.length; i++) img.data[i] = bin.charCodeAt(i);
  c.putImageData(img, 0, 0);
  t.refresh();

  // gradients de fons per a cada ambient (el cel canvia segons el nivell!)
  const grads = {
    grad_default: ['#7ecbf2', '#c8f0d8'],
    grad_desert:  ['#ffb74d', '#fff3c4'],
    grad_castle:  ['#565064', '#2a2438'],
    grad_space:   ['#060a24', '#1a1f4d'],
    grad_balloon: ['#ff9fd4', '#ffe9b0'],
    grad_mine:    ['#2e1a0e', '#54371f'],
    grad_choco:   ['#f3c98f', '#ffe9c4'],
    grad_sewer:   ['#0e2f28', '#1d5044'],
    grad_jungle:  ['#a8e6b0', '#e8f7c5'],
    grad_mech:    ['#101528', '#232a45'],
    grad_japan:   ['#ffd1e3', '#ffedc2'],
    grad_tower:   ['#3d3554', '#6a5f8a'],
    grad_night:   ['#0a1030', '#1d4a38'],
    grad_fly:     ['#4fc3f7', '#e1f5fe'],   // el cel alt del castell volador! ☁️
    grad_sea:     ['#37474f', '#4fc3f7'],   // cel de tempesta sobre el mar! 🌊
    grad_volc:    ['#3d1a1a', '#c1440e'],   // cel de foc dels volcans! 🌋
    grad_road:    ['#64b5f6', '#fff9c4'],   // dia de cursa: cel blau i sol! 🏎️
    grad_tokyo0:  ['#ff9e80', '#ffe0b2'],
    grad_tokyo1:  ['#10132e', '#2c3468'],
    grad_tokyo2:  ['#ff8fa3', '#b3e5fc'],
    // la FESTA: un arc de sant Martí de 8 zones! 🌈
    grad_party0:  ['#ff8a80', '#ffe0b2'],
    grad_party1:  ['#ffd54f', '#fff9c4'],
    grad_party2:  ['#81c784', '#dcedc8'],
    grad_party3:  ['#4fc3f7', '#e1f5fe'],
    grad_party4:  ['#ba68c8', '#f3e5f5'],
    grad_party5:  ['#f06292', '#fce4ec'],
    grad_party6:  ['#ff8a65', '#fff3e0'],
    grad_party7:  ['#9575cd', '#ede7f6']
  };
  for (const key of Object.keys(grads)) {
    const t2 = scene.textures.createCanvas(key, 4, 180);
    const c2 = t2.getContext();
    const g = c2.createLinearGradient(0, 0, 0, 180);
    g.addColorStop(0, grads[key][0]);
    g.addColorStop(1, grads[key][1]);
    c2.fillStyle = g;
    c2.fillRect(0, 0, 4, 180);
    t2.refresh();
  }
}
