// ==================== DIBUIX DEL MÓN ====================
// Abans tot es dibuixava a mà amb ctx.fillRect...
// Ara Phaser té dues "eines de dibuix" (Graphics):
//   gBG    → el cel i les coses llunyanes (no es mouen amb la càmera!)
//   gWorld → tot el món del nivell (plataformes, bosses, partícules...)
// Els personatges i fruites són SPRITES fets amb les textures de art.js.
let gBG = null, gWorld = null, bgGrad = null, ESCENA = null;

// és fora de la pantalla? (per no dibuixar coses que no es veuen!)
function offscreen(x, marge) {
  marge = marge || 60;
  return x + marge < camX - 60 || x - marge > camX + W + 60;
}
let inCave = false;   // (cova secreta: de moment no s'usa, però la idea hi és!)
// (les "ceres" per dibuixar — fillRect, fillCirc, corba... — són a config.js)

// ---------- sprites i textos que es reutilitzen ----------
// stamp(id, 'nom_textura', x, y): crea la imatge la primera vegada i
// després només la mou — així no creem sprites nous cada frame!
const stampPool = {};
function stamp(id, tex, x, y, opts) {
  let im = stampPool[id];
  if (!im) {
    im = ESCENA.add.image(x, y, tex);
    im.setScale(S);          // 1 píxel del dibuix = 3 unitats de món
    im.setOrigin(0, 0);
    im.setDepth(5);
    stampPool[id] = im;
  }
  im.setTexture(tex);
  im.setPosition(x, y);
  opts = opts || {};
  im.setFlipX(!!opts.flipX);
  im.setAlpha(opts.alpha === undefined ? 1 : opts.alpha);
  if (opts.scale) im.setScale(opts.scale); else im.setScale(S);
  if (opts.tint) im.setTintFill(opts.tint); else im.clearTint();
  im.setVisible(true);
  return im;
}
// textStamp: igual però per a lletres i números del món (★, U, ↓, zzz...)
const textPool = {};
function textStamp(id, str, x, y, opts) {
  opts = opts || {};
  let t = textPool[id];
  if (!t) {
    t = ESCENA.add.text(x, y, str, {
      fontFamily: opts.font || 'monospace',
      fontSize: (opts.size || 18) + 'px',
      fontStyle: 'bold',
      color: opts.color || '#ffffff',
      align: 'center'
    });
    t.setOrigin(0.5, 0.5);
    t.setDepth(15);
    textPool[id] = t;
  }
  if (t.text !== str) t.setText(str);
  t.setPosition(x, y);
  if (opts.color) t.setColor(opts.color);
  t.setVisible(true);
  t.setAlpha(opts.alpha === undefined ? 1 : opts.alpha);
  return t;
}
// quan canviem de nivell, esborrem tots els sprites/textos antics
function netejaPiscines() {
  for (const k of Object.keys(stampPool)) stampPool[k].destroy();
  for (const k of Object.keys(textPool)) textPool[k].destroy();
  for (const k of Object.keys(stampPool)) delete stampPool[k];
  for (const k of Object.keys(textPool)) delete textPool[k];
}
function amagaPiscines() {
  // quan no dibuixem (pantalla de triar nivell), que no quedi res penjat
  for (const k of Object.keys(stampPool)) stampPool[k].setVisible(false);
  for (const k of Object.keys(textPool)) textPool[k].setVisible(false);
}

function cloud(x, y, s, a) {
  fillCirc(gBG, x, y, 18*s, '#ffffff', a === undefined ? 1 : a);
  fillCirc(gBG, x + 22*s, y - 8*s, 22*s, '#ffffff', a === undefined ? 1 : a);
  fillCirc(gBG, x + 44*s, y, 18*s, '#ffffff', a === undefined ? 1 : a);
}

// ==================== EL CEL I EL FONS ====================
// retorna el nom del degradat que toca segons el nivell i on siguis
function gradientDelNivell() {
  const inDesert = levelNum === 1 && (player.x < 2750 || player.x > 6200);
  const inCastle = levelNum === 2 || (levelNum === 1 && player.x >= 2750 && player.x <= 6200);
  const inMine = levelNum === 5 && player.x > 3400;
  if (inDesert)   return 'grad_desert';
  if (inCastle)   return 'grad_castle';
  if (levelNum === 3) return 'grad_space';
  if (levelNum === 4) return 'grad_balloon';
  if (inMine)     return 'grad_mine';
  if (levelNum === 5) return 'grad_choco';
  if (levelNum === 6) return 'grad_sewer';
  if (levelNum === 7) return 'grad_jungle';
  if (levelNum === 8) return 'grad_mech';
  if (levelNum === 9) return 'grad_japan';
  if (levelNum === 10) return 'grad_tower';
  if (levelNum === 12) {
    // TÒQUIO: capvespre → nit de neons → alba!! 3 ambients segons on siguis!
    return 'grad_tokyo' + (player.x < 4200 ? 0 : player.x < 8300 ? 1 : 2);
  }
  if (levelNum === 13) {
    // LA FESTA: el cel canvia de color segons la zona — un arc de sant Martí!! 🌈
    return 'grad_party' + Math.min(7, (player.x / 1750) | 0);
  }
  if (levelNum === 14) return 'grad_night';
  if (levelNum === 15)
    // el castell volador: cel blau i net... fins que arriba el MAR de tempesta! 🌊
    return player.x > 11500 ? 'grad_sea' : 'grad_fly';
  if (levelNum === 16)
    // el castell de volcans: cel de FOC... fins que surts al mar! 🌋
    return player.x > 12000 ? 'grad_sea' : 'grad_volc';
  if (levelNum === 17) return 'grad_road';   // dia de cursa! 🏎️
  if (levelNum === 18) return 'grad_mine';   // dins la mina! 🎢
  return 'grad_default';
}

function drawBackground() {
  const g = gBG;
  g.clear();   // IMPORTANT: si no s'esborra, el fons s'ACUMULA cada frame i el joc s'alenteix!
  bgGrad.setTexture(gradientDelNivell());   // el cel del nivell!
  const inDesert = levelNum === 1 && (player.x < 2750 || player.x > 6200);
  const inCastle = levelNum === 2 || (levelNum === 1 && player.x >= 2750 && player.x <= 6200);
  const inSpace = levelNum === 3;
  const inBalloon = levelNum === 4;
  const inMine = levelNum === 5 && player.x > 3400;
  const inChoco = levelNum === 5;
  const inSewer = levelNum === 6;
  const inJungle = levelNum === 7;
  const inMech = levelNum === 8;
  const inJapan = levelNum === 9;
  const inTower = levelNum === 10;
  const inTokyo = levelNum === 12;
  const inParty = levelNum === 13;
  const inNight = levelNum === 14;
  const inFly = levelNum === 15;
  const inVolc = levelNum === 16 && player.x <= 12000;
  const inSea16 = levelNum === 16 && player.x > 12000;
  const inRace = levelNum === 17;
  const inVago = levelNum === 18;

  if (inVago) {
    // DINS LA MINA: parets fosques, roques i pols d'or que vola! ⛏️✨
    // siluetes de roca a la llunyania (paral·laxi lent)
    for (let i = 0; i < 6; i++) {
      const rx = ((i * 700 - camX * 0.15) % (W + 400) + W + 400) % (W + 400) - 200;
      fillElli(g, rx, 540, 150, 140 + (i % 3) * 60, 'rgba(30,20,10,0.6)');
    }
    // estalactites del sostre que passen de pressa!
    for (let i = 0; i < 10; i++) {
      const sx = ((i * 380 - camX * 0.5) % (W + 200) + W + 200) % (W + 200) - 100;
      const len = 40 + (i * 53) % 90;
      triangle(g, sx - 16, 0, sx + 16, 0, sx, len, 'rgba(35,20,10,0.85)');
    }
    // POLS D'OR que flota a l'aire de la mina!! ✨
    for (let i = 0; i < 20; i++) {
      const px = ((i * 263 - camX * 0.35) % (W + 40) + W + 40) % (W + 40) - 20;
      const py = ((i * 149 + frame * 0.4) % (H + 40) + H + 40) % (H + 40) - 20;
      fillCirc(g, px, py, 2.5, '#ffd700', 0.3 + 0.5 * Math.abs(Math.sin(frame * 0.08 + i)));
    }
    return;
  }

  if (inRace) {
    // DIA DE CURSA!! ☀️ sol, núvols i la ciutat que et veu passar!
    const sunX = 700 - camX * 0.03;
    fillCirc(g, sunX, 90, 50, '#ffd54f');
    fillCirc(g, sunX, 90, 38, '#fff176');
    // edificis de la ciutat a la llunyania (paral·laxi!)
    for (let i = 0; i < 8; i++) {
      const bx = ((i * 480 - camX * 0.15) % (W + 400) + W + 400) % (W + 400) - 200;
      const bh = 90 + (i * 67) % 120;
      fillRect(g, bx, 540 - bh, 70, bh, 'rgba(120,144,156,0.45)');
      for (let wy = 540 - bh + 12; wy < 530; wy += 24)
        for (let wx = bx + 8; wx < bx + 60; wx += 18)
          fillRect(g, wx, wy, 9, 12, 'rgba(255,241,118,0.5)');
    }
    // arbres i llambordes que PASSEN DE PRESSA — sensació de velocitat!!
    for (let i = 0; i < 12; i++) {
      const tx = ((i * 260 - camX * 0.7) % (W + 120) + W + 120) % (W + 120) - 60;
      fillRect(g, tx, 500, 8, 40, '#6d4c41');
      fillCirc(g, tx + 4, 490, 22, '#66bb6a');
    }
    // ratlles de VELOCITAT — el cotxe va a tota l'hòstia!! 💨
    for (let i = 0; i < 8; i++) {
      const vx = ((i * 331 - frame * (4 + i % 3)) % (W + 60) + W + 60) % (W + 60) - 30;
      const vy = 100 + (i * 61) % 380;
      linea(g, vx, vy, vx + 40, vy, 'rgba(255,255,255,0.4)', 2);
    }
    return;
  }

  if (inSea16) {
    // EL MAR DE LA FI — igual que al 15: tempesta, núvols i gavines! 🌊
    for (let i = 0; i < 5; i++) {
      const cx = ((i * 640 - camX * 0.2) % (W + 300) + W + 300) % (W + 300) - 150;
      fillElli(g, cx, 60 + (i % 2) * 30, 120, 26, 'rgba(69,90,100,0.75)');
    }
    if (frame % 120 < 8) {
      const lx = 200 + (frame * 13) % 500;
      g.lineStyle(4, col('#fff59d').color, 0.9);
      g.beginPath();
      g.moveTo(lx, 60); g.lineTo(lx - 14, 110); g.lineTo(lx + 6, 105); g.lineTo(lx - 10, 160);
      g.strokePath();
    }
    for (let i = 0; i < 8; i++) {
      const cx = ((i * 530 - camX * 0.4) % (W + 300) + W + 300) % (W + 300) - 150;
      const cy = 140 + (i * 67) % 300;
      fillElli(g, cx, cy, 80, 22, 'rgba(200,220,230,0.5)');
    }
    return;
  }

  if (inVolc) {
    // EL CEL DELS VOLCANS: fum, boira taronja i brases que volen! 🌋
    // volcans en dues capes a la llunyania (paral·laxi!)
    for (let i = 0; i < 5; i++) {
      const vx = ((i * 900 - camX * 0.12) % (W + 700) + W + 700) % (W + 700) - 350;
      triangle(g, vx - 160, 540, vx + 160, 540, vx, 240 + (i % 2) * 40, 'rgba(74,20,20,0.6)');
      // cràter que brilla!
      triangle(g, vx - 28, 268 + (i % 2) * 40, vx + 28, 268 + (i % 2) * 40, vx, 236 + (i % 2) * 40, 'rgba(255,87,34,0.75)');
    }
    for (let i = 0; i < 4; i++) {
      const vx = ((i * 1100 - camX * 0.3) % (W + 800) + W + 800) % (W + 800) - 400;
      triangle(g, vx - 200, 540, vx + 200, 540, vx, 310 + (i % 2) * 30, 'rgba(45,15,15,0.8)');
      fillElli(g, vx, 316 + (i % 2) * 30, 30, 10, 'rgba(255,110,40,0.85)');
    }
    // fum que puja dels cràters
    for (let i = 0; i < 12; i++) {
      const fx = ((i * 353 - camX * 0.2) % (W + 100) + W + 100) % (W + 100) - 50;
      const fy = 230 - ((frame * 0.7 + i * 60) % 260);
      fillCirc(g, fx, fy, 16 + (i % 3) * 8, 'rgba(60,45,45,0.5)');
    }
    // BRASES que volen per l'aire!! 🔥
    for (let i = 0; i < 25; i++) {
      const ex = ((i * 211 + frame * (0.5 + (i % 3) * 0.4) - camX * 0.3) % (W + 40) + W + 40) % (W + 40) - 20;
      const ey = ((i * 149 - frame * (1.2 + (i % 4) * 0.5)) % (H + 40) + H + 40) % (H + 40) - 20;
      const a = 0.4 + 0.6 * Math.abs(Math.sin(frame * 0.1 + i));
      fillRect(g, ex, ey, i % 5 === 0 ? 5 : 3, i % 5 === 0 ? 5 : 3,
               i % 4 === 0 ? '#ff5722' : '#ffca28', a);
    }
    return;
  }

  if (inFly) {
    // EL CEL DEL CASTELL VOLADOR — núvols per tot arreu i vent! ☁️💨
    // capa de núvols petits a la llunyania (paral·laxi lent)
    for (let i = 0; i < 8; i++) {
      const cx = ((i * 530 - camX * 0.15) % (W + 300) + W + 300) % (W + 300) - 150;
      const cy = 40 + (i * 67) % 300;
      fillElli(g, cx, cy, 60, 18, 'rgba(255,255,255,0.55)');
      fillElli(g, cx + 20, cy - 10, 34, 16, 'rgba(255,255,255,0.55)');
    }
    // capa de núvols grossos més a prop (paral·laxi ràpid)
    for (let i = 0; i < 6; i++) {
      const cx = ((i * 720 - camX * 0.4) % (W + 400) + W + 400) % (W + 400) - 200;
      const cy = 60 + (i * 113) % 380;
      fillElli(g, cx, cy, 100, 28, 'rgba(255,255,255,0.8)');
      fillElli(g, cx + 34, cy - 16, 56, 26, 'rgba(255,255,255,0.8)');
    }
    // sobre el MAR: núvols de tempesta grisos i llampecs!! ⛈️
    if (player.x > 11500) {
      for (let i = 0; i < 5; i++) {
        const cx = ((i * 640 - camX * 0.2) % (W + 300) + W + 300) % (W + 300) - 150;
        fillElli(g, cx, 60 + (i % 2) * 30, 120, 26, 'rgba(69,90,100,0.75)');
      }
      if (frame % 120 < 8) {   // un llampec de tant en tant! ⚡
        const lx = 200 + (frame * 13) % 500;
        g.lineStyle(4, col('#fff59d').color, 0.9);
        g.beginPath();
        g.moveTo(lx, 60); g.lineTo(lx - 14, 110); g.lineTo(lx + 6, 105); g.lineTo(lx - 10, 160);
        g.strokePath();
      }
    }
    // ratlles de VENT que corren — el castell vola de pressa!! 💨
    for (let i = 0; i < 10; i++) {
      const wx = ((i * 317 - frame * 6) % (W + 80) + W + 80) % (W + 80) - 40;
      const wy = 50 + (i * 97) % 400;
      linea(g, wx, wy, wx + 50 + (i % 3) * 20, wy, 'rgba(255,255,255,0.5)', 3);
    }
    return;
  }

  if (inDesert) {
    // EL SOL DEL DESERT — gegant i torrat!! ☀️
    const sunX = 750 - camX * 0.03;
    fillCirc(g, sunX, 95, 60, '#ffd54f');
    fillCirc(g, sunX, 95, 45, '#fff176');
    // dunes a la llunyania en dues capes (paral·laxi!)
    for (let i = 0; i < 6; i++) {
      const hx = ((i*950 - camX*0.12) % (W+600) + W+600) % (W+600) - 300;
      g.fillStyle(col('#e8b04a').color, 1);
      g.beginPath(); g.arc(hx, 560, 210, Math.PI, 0, false); g.fillPath();
    }
    for (let i = 0; i < 7; i++) {
      const hx = ((i*800 - camX*0.3) % (W+500) + W+500) % (W+500) - 250;
      g.fillStyle(col('#d69a35').color, 1);
      g.beginPath(); g.arc(hx, 575, 150, Math.PI, 0, false); g.fillPath();
    }
    return;
  }

  if (inSpace) {
    // estrelles que lluen!
    for (let i = 0; i < 90; i++) {
      const sx = (i * 197 - camX * 0.15) % (W + 20) + 10;
      const sy = (i * 131) % 480 + 10;
      const a = 0.4 + 0.6 * Math.abs(Math.sin(frame * 0.06 + i * 1.7));
      fillRect(g, sx, sy, i % 7 === 0 ? 5 : 3, i % 7 === 0 ? 5 : 3,
               i % 5 === 0 ? '#ffd700' : '#ffffff', a);
    }
    // la LLUNA!
    const mx = 780 - camX * 0.03;
    fillCirc(g, mx, 100, 55, '#f5f3ce');
    fillCirc(g, mx - 15, 85, 12, '#ddd9ab');
    fillCirc(g, mx + 18, 115, 9, '#ddd9ab');
    fillCirc(g, mx + 5, 88, 6, '#ddd9ab');
    return;
  }

  if (inBalloon) {
    // cel de festa: globus de colors flotant a la deriva!
    const cols = ['#ff5d8f', '#ffd166', '#4dd2ff', '#9d6bff', '#5dff8f'];
    for (let i = 0; i < 22; i++) {
      const bx = ((i * 353 - camX * 0.2) % (W + 120) + W + 120) % (W + 120) - 60;
      const by = 40 + (i * 83) % 260 + Math.sin(frame * 0.03 + i * 2) * 12;
      const c = cols[i % 5];
      fillElli(g, bx, by, 13, 17, c, 0.75);
      g.fillStyle(col(c).color, 0.75);
      g.fillTriangle(bx - 4, by + 15, bx + 4, by + 15, bx, by + 20);
      g.lineStyle(2, col('rgba(140,60,100,0.6)').color, 0.6);
      g.beginPath();
      g.moveTo(bx, by + 20);
      g.quadraticBezierTo(bx + Math.sin(frame * 0.04 + i) * 8, by + 34, bx, by + 46);
      g.strokePath();
    }
    // un castell de globus a la llunyania!
    const fx = 5600 - camX * 0.35;
    if (fx > -400 && fx < W + 400) {
      for (let j = 0; j < 5; j++)
        fillElli(g, fx + (j - 2) * 50, 210 - Math.abs(j - 2) * 42, 46, 62, cols[j], 0.35);
    }
    return;
  }

  if (inMech) {
    // ENGRANATGES gegants girant al fons del castell mecànic!
    for (let i = 0; i < 6; i++) {
      const gx = ((i*800 - camX*0.25) % (W+600) + W+600) % (W+600) - 300;
      const gy = 90 + (i*137) % 320;
      const r = 50 + (i % 3) * 30;
      g.lineStyle(12, col('rgba(120,144,156,0.35)').color, 0.35);
      g.strokeCircle(gx, gy, r);
      g.fillStyle(col('rgba(120,144,156,0.35)').color, 0.35);
      for (let a = 0; a < 8; a++) {
        const an = a * Math.PI/4 + frame * 0.012 * (i % 2 ? 1 : -1);   // giren alternant!
        g.fillRect(gx + Math.cos(an) * r - 8, gy + Math.sin(an) * r - 8, 16, 16);
      }
      g.lineStyle(12, col('rgba(120,144,156,0.35)').color, 0.35);
      g.strokeCircle(gx, gy, r * 0.3);
    }
    // espurnes elèctriques que parpellegen!
    if (frame % 30 < 12) {
      g.lineStyle(3, col('#ffee58').color, 0.8);
      for (let i = 0; i < 4; i++) {
        const ex = (i * 337) % W;
        const ey = 50 + (i * 91) % 380;
        g.beginPath();
        g.moveTo(ex, ey);
        g.lineTo(ex + 15, ey + 20); g.lineTo(ex - 8, ey + 38); g.lineTo(ex + 18, ey + 58);
        g.strokePath();
      }
    }
    return;
  }

  if (inNight) {
    // LA LLUNA GEGANT que et segueix mentre puges!! 🌙
    const moonX = W - 180 - camX * 0.03, moonY = 110 + camY * 0.15;
    fillCirc(g, moonX, moonY, 55, '#fff9c4');
    fillCirc(g, moonX - 15, moonY - 10, 12, '#ede49a');
    fillCirc(g, moonX + 18, moonY + 15, 8, '#ede49a');
    // estrelles que parpellegen — pugen amb tu!
    for (let i = 0; i < 80; i++) {
      const sx = ((i * 167 - camX * 0.1) % (W + 20) + W + 20) % (W + 20);
      const sy = ((i * 211 - camY * 0.35) % (H + 20) + H + 20) % (H + 20);
      const a = 0.3 + 0.7 * Math.abs(Math.sin(frame * 0.06 + i * 1.7));
      fillRect(g, sx, sy, 3, 3, '#ffffff', a);
    }
    // CUQUES DE LLUM que volen per la prada!! 🪲✨
    for (let i = 0; i < 20; i++) {
      const fx = ((i * 353 + frame * (0.4 + (i % 3) * 0.2) - camX * 0.4) % (W + 60) + W + 60) % (W + 60) - 30;
      const fy = ((i * 97 - camY * 0.5) % (H + 80) + H + 80) % (H + 80) - 20;
      const a = 0.4 + 0.6 * Math.abs(Math.sin(frame * 0.12 + i * 3));
      fillCirc(g, fx, fy, 4, '#eeff41', a);
    }
    // estels que cauen de tant en tant! ⭐
    if ((frame % 300) < 60) {
      const ex = 200 + (frame % 300) * 14, ey = 40 + (frame % 300) * 5;
      linea(g, ex, ey, ex - 26, ey - 10, '#ffffff', 3);
    }
    return;
  }

  if (inParty) {
    // 🎊 PLUJA DE CONFETI!!! cau del cel fent cabrioles, de tots colors!
    const cols = ['#ff5252', '#ff9800', '#ffeb3b', '#66bb6a', '#42a5f5', '#ab47bc'];
    for (let i = 0; i < 60; i++) {
      const cx = ((i * 271 - camX * 0.5) % (W + 40) + W + 40) % (W + 40) - 20;
      const cy = ((i * 173 + frame * (1.2 + (i % 3))) % (H + 40)) - 20;
      const ox = Math.sin(frame * 0.1 + i) * 0.6;
      // confeti girat: un rectangle petit inclinat
      g.save();
      g.translateCanvas(cx + Math.sin(frame * 0.08 + i) * 6, cy);
      g.rotateCanvas(ox);
      g.fillStyle(col(cols[i % 6]).color, 1);
      g.fillRect(-4, -2, 8, 5);
      g.restore();
    }
    // globus gegants flotant a la llunyania 🎈
    for (let i = 0; i < 10; i++) {
      const bx = ((i * 570 - camX * 0.2) % (W + 300) + W + 300) % (W + 300) - 150;
      const by = 60 + (i * 89) % 200 + Math.sin(frame * 0.04 + i) * 10;
      fillElli(g, bx, by, 24, 30, cols[(i * 2) % 6], 0.5);
    }
    // serpentines de festa que pengen de dalt 🎀
    for (let i = 0; i < 14; i++) {
      const sx = ((i * 410 - camX * 0.6) % (W + 200) + W + 200) % (W + 200) - 100;
      const k = col(cols[i % 6]);
      g.lineStyle(4, k.color, 1);
      g.beginPath();
      g.moveTo(sx, 0);
      for (let sy = 0; sy < 90; sy += 12)
        g.lineTo(sx + Math.sin(sy * 0.15 + frame * 0.06 + i) * 12, sy);
      g.strokePath();
    }
    return;
  }

  if (inTokyo) {
    const tz = player.x < 4200 ? 0 : player.x < 8300 ? 1 : 2;
    // skyline de LEGO: grans edificis de colors amb finestres!! 🏙️
    const cols = ['#5c6bc0','#26a69a','#ef5350','#ab47bc','#ffa726','#42a5f5'];
    for (let i = 0; i < 10; i++) {
      const bx = ((i*620 - camX*0.25) % (W+700) + W+700) % (W+700) - 350;
      const bh = 120 + (i*97) % 220;
      fillRect(g, bx, 480 - bh, 130, bh, cols[i % 6], 0.45);
      // finestres: a la nit BRILLEN grogues!
      const fc = tz === 1 ? '#ffee58' : 'rgba(255,255,255,0.5)';
      for (let wy = 480 - bh + 18; wy < 460; wy += 32)
        for (let wx = bx + 15; wx < bx + 115; wx += 30)
          if ((wx + wy + i) % 3) fillRect(g, wx, wy, 14, 16, fc, tz === 1 ? 1 : 0.5);
    }
    if (tz === 1) {
      // estrelles a la nit de neons!
      for (let i = 0; i < 40; i++) {
        const sx = ((i * 197 - camX * 0.1) % (W + 20) + W + 20) % (W + 20);
        const a = 0.3 + 0.6 * Math.abs(Math.sin(frame * 0.07 + i * 2));
        fillRect(g, sx, 20 + (i * 89) % 200, 3, 3, '#ffffff', a);
      }
    }
    if (tz === 2) {
      // LA TORRE DE TÒQUIO vermella i blanca a la llunyania!! 🗼
      const tx = 9800 - camX * 0.3;
      if (tx > -300 && tx < W + 300) {
        g.fillStyle(col('#e53935').color, 1);
        g.beginPath();
        g.moveTo(tx - 95, 480); g.lineTo(tx - 30, 200); g.lineTo(tx - 18, 70);
        g.lineTo(tx + 18, 70); g.lineTo(tx + 30, 200); g.lineTo(tx + 95, 480);
        g.closePath(); g.fillPath();
        // bandes blanques de la torre!
        g.lineStyle(14, col('#ffffff').color, 1);
        g.lineBetween(tx - 58, 340, tx + 58, 340);
        g.lineBetween(tx - 33, 215, tx + 33, 215);
        // creus en X
        g.lineStyle(6, col('#b71c1c').color, 1);
        g.lineBetween(tx - 75, 430, tx + 75, 350); g.lineBetween(tx + 75, 430, tx - 75, 350);
        g.lineBetween(tx - 38, 300, tx + 38, 230); g.lineBetween(tx + 38, 300, tx - 38, 230);
        // antena!
        fillRect(g, tx - 4, 30, 8, 44, '#e53935');
      }
    }
    return;
  }

  if (inTower) {
    // finestres gegants del castell que deixen entrar la llum del capvespre!
    for (let i = 0; i < 8; i++) {
      const wx = ((i * 700 - camX * 0.3) % (W + 400) + W + 400) % (W + 400) - 200;
      g.fillStyle(col('rgba(255,200,120,0.22)').color, 0.22);
      g.beginPath();
      g.moveTo(wx, 480); g.lineTo(wx, 160);
      g.arc(wx + 40, 160, 40, Math.PI, 0, false);
      g.lineTo(wx + 80, 480); g.closePath(); g.fillPath();
    }
    // rajos de llum que entren per les finestres
    for (let i = 0; i < 6; i++) {
      const lx = ((i * 900 - camX * 0.3) % (W + 500) + W + 500) % (W + 500) - 250;
      g.fillStyle(col('rgba(255,230,160,0.10)').color, 0.10);
      g.beginPath();
      g.moveTo(lx, 180); g.lineTo(lx + 60, 180);
      g.lineTo(lx + 180, 480); g.lineTo(lx + 60, 480);
      g.closePath(); g.fillPath();
    }
    return;
  }

  if (inJapan) {
    // el SOL japonès, vermell i rodó!
    const sunX = W - 150 - camX * 0.02;
    fillCirc(g, sunX, 110, 48, '#ff6f61');
    // EL MONT FUJI a la llunyania, amb el cim de neu!! ⛰️
    const fx = 4600 - camX * 0.3;
    if (fx > -900 && fx < W + 900) {
      g.fillStyle(col('#7f9bb8').color, 1);
      g.fillTriangle(fx - 420, 480, fx, 130, fx + 420, 480);
      // el cim nevat!
      g.fillStyle(col('#ffffff').color, 1);
      g.beginPath();
      g.moveTo(fx - 95, 261); g.lineTo(fx, 130); g.lineTo(fx + 95, 261);
      g.lineTo(fx + 60, 268); g.lineTo(fx + 40, 252); g.lineTo(fx + 15, 268);
      g.lineTo(fx - 10, 250); g.lineTo(fx - 35, 268); g.lineTo(fx - 60, 254);
      g.closePath(); g.fillPath();
    }
    // pètals de sakura que cauen pel cel!! 🌸
    for (let i = 0; i < 26; i++) {
      const px = ((i * 397 + frame * 1.2 - camX * 0.5) % (W + 60) + W + 60) % (W + 60) - 30;
      const py = ((i * 211 + frame * (0.8 + (i % 3) * 0.3)) % (H + 40)) - 20;
      const sway = Math.sin(frame * 0.06 + i) * 6;
      fillElli(g, px + sway, py, 5, 3.5, i % 3 ? '#ffb7d5' : '#ffd7e8', 0.85);
    }
    return;
  }

  if (inJungle) {
    // l'horitzó de la selva: capes de muntanyes i arbres!
    for (let i = 0; i < 6; i++) {   // la capa més llunyana
      const hx = ((i*900 - camX*0.12) % (W+500) + W+500) % (W+500) - 250;
      g.fillStyle(col('#7cb98a').color, 1);
      g.beginPath(); g.arc(hx, 545, 220, Math.PI, 0, false); g.fillPath();
    }
    for (let i = 0; i < 7; i++) {   // la capa del mig
      const hx = ((i*750 - camX*0.3) % (W+500) + W+500) % (W+500) - 250;
      g.fillStyle(col('#4a8f5d').color, 1);
      g.beginPath(); g.arc(hx, 555, 160, Math.PI, 0, false); g.fillPath();
    }
    for (let i = 0; i < 8; i++) {   // arbres de prop (silueta fosca)
      const hx = ((i*850 - camX*0.5) % (W+600) + W+600) % (W+600) - 300;
      fillRect(g, hx - 12, 430, 24, 120, '#2e6b40');
      g.fillStyle(col('#2e6b40').color, 1);
      g.beginPath(); g.arc(hx, 420, 85, Math.PI, 0, false); g.fillPath();
    }
    // raigs de sol que entren entre els arbres!
    for (let i = 0; i < 5; i++) {
      const rx = ((i*500 - camX*0.1) % (W+300) + W+300) % (W+300) - 150;
      g.fillStyle(col('#fffde7').color, 0.12);
      g.beginPath();
      g.moveTo(rx, 0); g.lineTo(rx + 90, 0);
      g.lineTo(rx + 180, H); g.lineTo(rx + 60, H);
      g.closePath(); g.fillPath();
    }
    return;
  }

  if (inSewer) {
    // canonades gegants al fons de la claveguera!
    for (let i = 0; i < 8; i++) {
      const px2 = ((i*700 - camX*0.3) % (W+600) + W+600) % (W+600) - 300;
      const py2 = 60 + (i*127) % 300;
      fillRect(g, px2, py2, 260, 40, '#2f5d50', 0.35);
      g.fillStyle(col('#2f5d50').color, 0.35);
      g.beginPath(); g.arc(px2 + 260, py2 + 40, 40, -Math.PI/2, 0, false); g.fillPath();  // el colze
    }
    // bombolles d'aigua que pugen!
    for (let i = 0; i < 20; i++) {
      const bx = (i * 223) % W;
      const by = H - ((frame * 1.5 + i * 160) % (H + 40));
      g.lineStyle(2, col('rgba(150,255,220,0.5)').color, 0.5);
      g.strokeCircle(bx, by, 3 + (i % 3));
    }
    return;
  }

  if (inChoco) {
    if (inMine) return;   // dins la mina: tot fosc, la decoració ho omple
    // cel caramel amb núvols de nata!
    for (let i = 0; i < 10; i++) {
      const cx = ((i*430 - camX*0.3) % (W+300)) - 150;
      cloud(cx, 40 + (i*67) % 140, 0.9, 0.7);
    }
    // muntanyes de xocolata amb nata a dalt!
    for (let i = 0; i < 8; i++) {
      const hx = ((i*750 - camX*0.4) % (W+500) + W+500) % (W+500) - 250;
      g.fillStyle(col('#8d5a2b').color, 1);
      g.beginPath(); g.arc(hx, 545, 170, Math.PI, 0, false); g.fillPath();
      g.fillStyle(col('#fff3e0').color, 1);
      g.beginPath(); g.arc(hx, 430, 42, Math.PI, 0, false); g.fillPath();
    }
    // confeti dolç flotant pel cel!
    const cols = ['#ff5d8f','#ffd166','#4dd2ff','#9d6bff','#5dff8f'];
    for (let i = 0; i < 24; i++) {
      const sx = ((i*313 - camX*0.25) % (W+80) + W+80) % (W+80) - 40;
      const sy = 30 + (i*89) % 240;
      fillRect(g, sx, sy, 5, 5, cols[i % 5]);
    }
    return;
  }

  if (inCastle) {
    // paret de maons del castell (es mou amb la càmera!)
    const k = col('rgba(0,0,0,0.3)');
    g.lineStyle(3, k.color, 0.3);
    for (let y = 0; y < H; y += 30) g.lineBetween(0, y, W, y);
    for (let y = 0, i = 0; y < H; y += 30, i++)
      for (let x = -(camX % 60) + (i % 2) * 30; x < W; x += 60)
        g.lineBetween(x, y, x, y + 30);
    return;
  }

  // sol de cera amb rajos que giren
  const sunX = 840 - camX * 0.05;
  for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4 + frame * 0.008;
    linea(g, sunX + Math.cos(a) * 55, 80 + Math.sin(a) * 55,
             sunX + Math.cos(a) * 72, 80 + Math.sin(a) * 72, '#ffd54f', 4);
  }
  fillCirc(g, sunX, 80, 45, '#ffe066');
  fillCirc(g, sunX, 80, 35, '#ffef9e');
  g.lineStyle(3, col('#f9c846').color, 1);
  g.strokeCircle(sunX, 80, 45);

  // núvols del fons (parallax)
  for (let i = 0; i < 12; i++) {
    const cx = ((i*430 - camX*0.3) % (W+300)) - 150;
    const cy = 50 + (i*67) % 160;
    cloud(cx, cy, 1, 0.85);
  }

  // turons verds
  for (let i = 0; i < 8; i++) {
    const hx = ((i*700 - camX*0.5) % (W+400)) - 200;
    g.fillStyle(col('#7bc96f').color, 1);
    g.beginPath(); g.arc(hx, 540, 160, Math.PI, 0, false); g.fillPath();
  }
}

// ==================== DECORACIÓ DEL MÓN ====================
// arbres, torxes, palmeres, cactus... cada nivell té el seu ambient!
function drawDecor() {
  const g = gWorld;
  if (levelNum === 15) {
    // ===== EL CASTELL VOLADOR!! 🏰☁️ =====
    // HÈLIXS gegants que sostenen el castell — girennn!! 
    for (const hx of [1800, 2500, 3300, 5900, 6300, 6700]) {
      if (offscreen(hx, 220)) continue;
      const a = frame * 0.5;
      fillRect(g, hx - 4, 540, 8, 40, '#78909c');          // pal de l'hèlix
      linea(g, hx - Math.cos(a) * 55, 540 - Math.sin(a) * 10,
            hx + Math.cos(a) * 55, 540 + Math.sin(a) * 10, '#b0bec5', 10);
      linea(g, hx - Math.cos(a + 1.57) * 55, 540 - Math.sin(a + 1.57) * 10,
            hx + Math.cos(a + 1.57) * 55, 540 + Math.sin(a + 1.57) * 10, '#90a4ae', 10);
      fillCirc(g, hx, 540, 8, '#546e7a');
    }
    // GLOBUS que ajuden a sostenir la part dels motors! 🎈
    for (const bx of [5750, 6100, 6500, 6800]) {
      if (offscreen(bx, 220)) continue;
      const by = 160 + Math.sin(frame * 0.05 + bx) * 8;
      linea(g, bx, 480, bx, by + 40, 'rgba(120,80,60,0.7)', 3);   // la corda
      fillElli(g, bx, by, 45, 55, ['#ff5d8f', '#4dd2ff', '#ffd166', '#9d6bff'][(bx / 50 | 0) % 4]);
      fillElli(g, bx - 12, by - 15, 10, 15, 'rgba(255,255,255,0.5)');
    }
    // ESTENDARDS vermells al pont i al pati
    for (const bx of [1500, 2650, 9500, 11150]) {
      if (offscreen(bx, 220)) continue;
      fillRect(g, bx, 300, 8, 180, '#5d4037');
      g.fillStyle(col('#e53935').color, 1);
      g.beginPath();
      g.moveTo(bx + 8, 305); g.lineTo(bx + 70, 318 + Math.sin(frame * 0.1 + bx) * 6);
      g.lineTo(bx + 8, 335); g.fillPath();
    }
    // al MAR: gavines que volen!! 🕊️
    if (player.x > 10800) {
      for (let i = 0; i < 6; i++) {
        const gx = ((i * 470 + frame * 1.5) % (W + 100) + W + 100) % (W + 100) - 50 + camX;
        const gy = 100 + (i * 53) % 140 + Math.sin(frame * 0.06 + i) * 14;
        const flap = Math.sin(frame * 0.25 + i * 2) * 8;
        corba(g, gx - 12, gy - flap, gx, gy + 4, gx, gy, '#eceff1', 3);
        corba(g, gx, gy, gx, gy + 4, gx + 12, gy - flap, '#eceff1', 3);
      }
    }
    return;
  }
  if (levelNum === 16) {
    // ===== EL CASTELL DE VOLCANS D'EN KAMEK!! 🌋🧙 =====
    if (player.x <= 12000) {
      // GEISERS DE LAVA que esclaten de tant en tant!! ⛲🔥
      for (const gx of [3350, 4350, 5600, 9750, 10750]) {
        if (offscreen(gx, 220)) continue;
        const fase = (frame + gx) % 240;   // esclata un tros de cada cicle!
        if (fase < 90) {
          const alt = Math.sin(fase / 90 * Math.PI) * (180 + (gx % 3) * 40);
          fillRect(g, gx - 12, 505 - alt, 24, alt, '#ff7043');
          fillRect(g, gx - 5, 505 - alt, 10, alt, '#ffca28');
          fillCirc(g, gx, 505 - alt, 16 + Math.sin(frame * 0.3) * 4, '#ffca28');
          for (let i = 0; i < 4; i++)
            fillCirc(g, gx + Math.sin(fase * 0.2 + i * 2) * 30, 505 - alt - i * 16, 4, '#ff8a65');
        } else {
          fillCirc(g, gx, 502, 12, '#ff8a65', 0.5);   // bombolletja esperant!
        }
      }
      // estendards MORATS d'en Kamek penjats per tot el castell!! 🧙
      for (const bx of [1700, 2950, 6300, 7700, 11050, 12400]) {
        if (offscreen(bx, 220)) continue;
        fillRect(g, bx, 300, 8, 180, '#37474f');
        g.fillStyle(col('#7e57c2').color, 1);
        g.beginPath();
        g.moveTo(bx + 8, 305); g.lineTo(bx + 66, 318 + Math.sin(frame * 0.1 + bx) * 6);
        g.lineTo(bx + 8, 335); g.fillPath();
        textStamp('est16_' + bx, '✦', bx + 34, 320, {size: 16, color: '#ffd700'});
      }
      // boques de volcà que fumejen a les parets
      for (const vx of [900, 2600, 5000, 7400, 10200]) {
        if (offscreen(vx, 220)) continue;
        fillCirc(g, vx, 120, 10, 'rgba(40,25,25,0.8)');
        const fy = 120 - ((frame * 0.8 + vx) % 90);
        fillCirc(g, vx + Math.sin(frame * 0.1) * 6, fy, 8, 'rgba(70,55,55,0.5)');
      }
    } else {
      // al MAR: gavines i el castell que queda enrere! 🕊️🏰
      for (let i = 0; i < 6; i++) {
        const gx = ((i * 470 + frame * 1.5) % (W + 100) + W + 100) % (W + 100) - 50 + camX;
        const gy = 100 + (i * 53) % 140 + Math.sin(frame * 0.06 + i) * 14;
        const flap = Math.sin(frame * 0.25 + i * 2) * 8;
        corba(g, gx - 12, gy - flap, gx, gy + 4, gx, gy, '#eceff1', 3);
        corba(g, gx, gy, gx, gy + 4, gx + 12, gy - flap, '#eceff1', 3);
      }
      // la boca del volcà per on has sortit — fum i foc a la llunyania!
      const mx = 12550;
      if (!offscreen(mx, 400)) {
        triangle(g, mx - 250, 505, mx + 250, 505, mx, 150, 'rgba(50,20,20,0.9)');
        fillElli(g, mx, 160, 40, 14, 'rgba(255,110,40,0.9)');
        if (frame % 40 < 25)
          fillCirc(g, mx + Math.sin(frame * 0.1) * 10, 130 - (frame % 40) * 2, 12, 'rgba(60,45,45,0.5)');
      }
    }
    return;
  }
  if (levelNum === 17) {
    // ===== LA GRAN CURSA!! 🏎️ =====
    // EL TÚNEL: sostre fosc que tapa el cel + llums que passen!
    if (player.x > 6600 && player.x < 9000) {
      fillRect(g, Math.max(camX - 60, 6800), 0, Math.min(2000, camX + W + 60) - Math.max(camX - 60, 6800), 140, '#1a1a2e');
      for (let lx = 6900; lx < 8800; lx += 220) {
        if (offscreen(lx, 220)) continue;
        fillRect(g, lx, 140, 12, 20, '#455a64');
        fillCirc(g, lx + 6, 158, 10, '#fff59d');      // llum del túnel!
        fillElli(g, lx + 6, 190, 40, 20, 'rgba(255,245,157,0.15)');
      }
      // parets de maons als costats
      fillRect(g, 6800, 140, 16, 340, '#263238');
      fillRect(g, 8784, 140, 16, 340, '#263238');
    }
    // PILARS del pont que baixen al mar!
    for (const px of [4750, 5300, 5750, 6200, 6600]) {
      if (offscreen(px, 220)) continue;
      fillRect(g, px - 10, 490, 20, 60, '#546e7a');
      strokeRect(g, px - 10, 490, 20, 60, '#37474f', 2);
    }
    // PALMERES de la costa! 🌴
    for (const px of [8950, 9700, 10400, 10950]) {
      if (offscreen(px, 220)) continue;
      corba(g, px, 480, px + 10, 400, px + 20, 350, '#8d6e63', 10);
      for (let a = -2; a <= 2; a++)
        corba(g, px + 20, 350, px + 20 + a*28, 322, px + 20 + a*45, 348 + Math.abs(a)*10, '#2e7d32', 6);
    }
    // SENYALS de trànsit: corbes i perill! ⚠️
    for (const sx of [2400, 4500, 6700, 11000]) {
      if (offscreen(sx, 120)) continue;
      fillRect(g, sx, 400, 6, 60, '#78909c');
      g.fillStyle(col('#ffd54f').color, 1);
      g.beginPath();
      g.moveTo(sx - 14, 400); g.lineTo(sx + 26, 400); g.lineTo(sx + 6, 370); g.fillPath();
      textStamp('senyal_' + sx, '!', sx + 6, 390, {size: 18, color: '#37474f'});
    }
    // LA META!! pancarta quadriculada damunt la carretera 🏁
    const mx = 14200;
    if (!offscreen(mx, 300)) {
      for (const mx2 of [mx - 160, mx + 160]) {
        fillRect(g, mx2 - 6, 300, 12, 180, '#455a64');
      }
      // quadres blanc i negre!
      for (let i = 0; i < 8; i++) for (let j = 0; j < 2; j++)
        fillRect(g, mx - 160 + i * 40, 300 + j * 20, 40, 20, (i + j) % 2 ? '#212121' : '#ffffff');
      textStamp('meta_txt', 'META!!', mx, 350, {size: 26, color: '#e53935'});
    }
    return;
  }
  if (levelNum === 18) {
    // ===== LA MINA DELS LUPINGS!! 🎢⛏️ =====
    // els cercles dels LUPINGS dibuixats com a rails amb travesses!
    for (const lp of loopins) {
      if (offscreen(lp.x, lp.r + 150)) continue;
      const cy = lp.y - lp.r;
      // anell exterior de ferro
      g.lineStyle(14, col('#546e7a').color, 1);
      g.strokeCircle(lp.x, cy, lp.r);
      g.lineStyle(4, col('#b0bec5').color, 1);
      g.strokeCircle(lp.x, cy, lp.r - 7);
      g.strokeCircle(lp.x, cy, lp.r + 7);
      // travesses de fusta al voltant del cercle!
      for (let i = 0; i < 24; i++) {
        const a = i / 24 * Math.PI * 2;
        const x1 = lp.x + Math.cos(a) * (lp.r - 12), y1 = cy + Math.sin(a) * (lp.r - 12);
        const x2 = lp.x + Math.cos(a) * (lp.r + 12), y2 = cy + Math.sin(a) * (lp.r + 12);
        linea(g, x1, y1, x2, y2, '#6d4c41', 5);
      }
      // suports de fusta que aguanten el luping!
      linea(g, lp.x - lp.r, lp.y, lp.x - lp.r + 20, cy - lp.r, '#5d4037', 8);
      linea(g, lp.x + lp.r, lp.y, lp.x + lp.r - 20, cy - lp.r, '#5d4037', 8);
      // fletxa groga: PER AQUÍ ES FA EL LUPING!
      if (frame % 40 < 20)
        textStamp('fletxa_lp_' + lp.x, '➜', lp.x - lp.r - 50, lp.y - 40, {size: 26, color: '#ffd700'});
    }
    // CRISTALLS que brillen a les parets de la mina! 💎
    for (const cx2 of [600, 1900, 4700, 5500, 7100, 8900, 10500, 12300, 13800]) {
      if (offscreen(cx2, 120)) continue;
      const cols = ['#4dd0e1', '#b388ff', '#ff8a80'];
      const c = cols[(cx2 / 100 | 0) % 3];
      for (let i = 0; i < 3; i++) {
        const h = 20 + i * 14;
        triangle(g, cx2 + i * 18 - 8, 480, cx2 + i * 18 + 8, 480, cx2 + i * 18, 480 - h, c);
      }
      if (frame % 60 < 30)   // brillantor!
        fillCirc(g, cx2 + 18, 460, 3, '#ffffff', 0.8);
    }
    // llanternes penjades del sostre!
    for (const lx of [1100, 3000, 5100, 7300, 9700, 11300, 12900, 14200]) {
      if (offscreen(lx, 120)) continue;
      linea(g, lx, 0, lx, 90, '#4e342e', 3);
      fillRect(g, lx - 9, 90, 18, 24, '#6d4c41');
      fillCirc(g, lx, 102, 6, '#ffca28');
      fillElli(g, lx, 130, 50, 25, 'rgba(255,202,40,0.12)');   // halo de llum
    }
    // bigues de fusta que sostenen el sostre de la mina
    for (const bx of [400, 2400, 4400, 6800, 9200, 11600, 13600]) {
      if (offscreen(bx, 160)) continue;
      fillRect(g, bx, 0, 24, 130, '#5d4037');
      fillRect(g, bx - 20, 120, 64, 16, '#4e342e');
    }
    return;
  }
  if (levelNum === 3) {
    // estrelles grans que decoren el cel espacial
    for (const sx of [200, 800, 1400, 2100, 2700, 3300, 3900, 4550, 5200, 5900, 6400])
        if (!offscreen(sx, 220))
        stamp('decor_star_' + sx, 'star', sx, 120 + (sx % 3) * 40,
            {alpha: 0.5 + 0.5 * Math.sin(frame * 0.07 + sx)});
    return;
  }
  if (levelNum === 2) {
    // torxes penjades a les parets del castell
    for (const tx of [150, 700, 1300, 1900, 2450, 3000, 3600, 4100])
        if (!offscreen(tx, 220))
        stamp('decor_torch_' + tx, 'torch', tx, 385,
            {alpha: 0.7 + 0.3 * Math.sin(frame * 0.2 + tx)});   // la flama tremola!
    return;
  }
  if (levelNum === 5) {
    // la boca de la mina: un munt de xocolata enorme!
    fillSemi(g, 3400, 540, 240, '#5d3a1a');
    fillSemi(g, 3400, 540, 150, '#1e1009');
    // estalactites de xocolata penjant del sostre de la mina!
    for (let x = 3450; x < 6900; x += 150) {
      const len = 25 + (x % 3) * 16;
      triangle(g, x, 110, x + 26, 110, x + 13, 110 + len, '#4e342e');
    }
    // degotets de xocolata que cauen del sostre!
    for (let i = 0; i < 8; i++) {
      const dx = 3520 + i * 410;
      const dy = 120 + ((frame * 1.6 + i * 220) % 340);
      fillRect(g, dx, dy, 5, 9, '#8d6e63');
    }
    // bastons de caramel al costat del riu!
    for (const cx of [180, 1250, 2300, 3150]) {
      if (offscreen(cx, 220)) continue;
      fillRect(g, cx, 370, 14, 70, '#ffffff');
      for (let y = 375; y < 435; y += 14) fillRect(g, cx, y, 14, 7, '#ff5252');
      fillSemi(g, cx + 7, 370, 9, '#ff5252');
    }
    return;
  }
  if (levelNum === 7) {
    // PALMERES de la selva amb cocos!
    for (const px of [150, 750, 1150, 1800, 2350, 2900, 3450, 4000, 4600, 5250]) {
      if (offscreen(px, 220)) continue;
      corba(g, px, 480, px + 12, 400, px + 25, 330, '#8d6e63', 14);
      for (let a = -2; a <= 2; a++)
        corba(g, px + 25, 330, px + 25 + a*35, 295,
              px + 25 + a*55, 330 + Math.abs(a)*12, '#2e7d32', 8);
      fillCirc(g, px + 17, 336, 7, '#5d4037');
      fillCirc(g, px + 33, 336, 7, '#5d4037');
    }
    // lianes que pengen i es mouen amb el vent!
    for (const vx of [450, 1350, 2250, 3150, 4050, 4950]) {
      if (offscreen(vx, 220)) continue;
      const swing = Math.sin(frame * 0.05 + vx) * 25;
      corba(g, vx, 0, vx + swing * 0.7, 120, vx + swing, 215, '#388e3c', 5);
      fillElli(g, vx + swing, 222, 8, 12, '#66bb6a');
    }
    return;
  }
  if (levelNum === 10) {
    // ESTENDARDS vermells amb la U d'Unai penjant del sostre! 🚩
    for (const bx of [300, 900, 1900, 2800, 3400, 4300, 5100, 5800]) {
      if (offscreen(bx, 220)) continue;
      g.fillStyle(col('#c62828').color, 1);
      g.beginPath();
      g.moveTo(bx, 0); g.lineTo(bx + 56, 0); g.lineTo(bx + 56, 130);
      g.lineTo(bx + 28, 158); g.lineTo(bx, 130); g.fillPath();
      strokeRect(g, bx + 6, 8, 44, 60, '#ffd700', 3);
      textStamp('banderola_u_' + bx, 'U', bx + 28, 38, {size: 36, color: '#ffd700'});
    }
    // torxes a les parets de les torres!
    for (const tx2 of [500, 1700, 2800, 3900, 5000, 5900]) {
      if (offscreen(tx2, 220)) continue;
      fillRect(g, tx2, 300, 10, 24, '#5d4037');
      fillElli(g, tx2 + 5, 292 + Math.sin(frame*0.15 + tx2)*4, 9, 14, '#ff9800');
      fillElli(g, tx2 + 5, 294 + Math.sin(frame*0.15 + tx2)*4, 5, 8, '#ffeb3b');
    }
    return;
  }
  if (levelNum === 9) {
    // TORII: la porta japonesa vermella de l'entrada! ⛩️
    fillRect(g, 60, 300, 16, 180, '#d32f2f');  fillRect(g, 190, 300, 16, 180, '#d32f2f');
    fillRect(g, 30, 280, 210, 18, '#d32f2f');  // biga de dalt
    fillRect(g, 45, 330, 175, 12, '#d32f2f');  // biga del mig
    fillRect(g, 30, 298, 210, 8, '#8e0000');
    // ARBRES DE SAKURA! 🌸 tronc corbat + bombolles rosa de flors
    for (const tx of [350, 800, 1400, 1950, 2500, 3050]) {
      if (offscreen(tx, 220)) continue;
      corba(g, tx, 480, tx + 10, 400, tx + 25, 345, '#6d4c41', 12);
      corba(g, tx + 14, 415, tx + 45, 390, tx + 60, 365, '#795548', 6);
      fillCirc(g, tx + 25, 320, 52, '#ffb7d5');
      fillCirc(g, tx - 15, 345, 38, '#ffb7d5');
      fillCirc(g, tx + 65, 345, 40, '#ffb7d5');
      fillCirc(g, tx + 15, 310, 22, '#ffd7e8');
      fillCirc(g, tx + 55, 335, 16, '#ffd7e8');
    }
    // llisos de pedra japonesos al camí
    for (const lx of [500, 1200, 1800, 2400, 2900])
        if (!offscreen(lx, 220))
        fillElli(g, lx, 470, 22, 8, '#9e9e9e');
    // núvols de fons al tram dels núvols!
    if (player.x > 6800) {
      for (const cx of [7100, 7600, 8100, 8600, 9000]) {
      if (offscreen(cx, 220)) continue;
        fillCirc(g, cx, 120 + (cx % 3) * 40, 55, 'rgba(255,255,255,0.5)');
        fillCirc(g, cx + 45, 130 + (cx % 3) * 40, 40, 'rgba(255,255,255,0.5)');
      }
    }
    return;
  }
  if (levelNum === 8) {
    // cables que pengen amb bombetes vermelles que parpellegen!
    for (const cx of [300, 900, 1700, 2500, 3300, 4200, 5000, 5800, 6600, 7400, 8300]) {
      if (offscreen(cx, 220)) continue;
      const len = 60 + (cx % 3) * 30;
      const sway = Math.sin(frame * 0.04 + cx) * 15;
      linea(g, cx, 0, cx + sway, len, '#37474f', 6);
      if ((frame + cx) % 90 < 45) fillCirc(g, cx + sway, len + 8, 8, '#ff5252');
    }
    return;
  }
  if (levelNum === 6) {
    // degots d'aigua que cauen del sostre de la canonada!
    for (let i = 0; i < 10; i++) {
      const dx = 300 + i * 760;
      const dy = 82 + ((frame * 2.2 + i * 200) % 370);
      fillRect(g, dx, dy, 4, 8, '#7fd8c9');
    }
    // vàlvules vermelles a les canonades!
    for (const vx2 of [500, 1500, 2600, 3700, 4800, 5900, 7000, 7700]) {
      if (offscreen(vx2, 220)) continue;
      strokeCirc(g, vx2, 140, 16, '#c62828', 5);
      for (let a = 0; a < 4; a++) {
        const an = a * Math.PI / 2 + 0.4;
        linea(g, vx2, 140, vx2 + Math.cos(an) * 16, 140 + Math.sin(an) * 16, '#c62828', 5);
      }
    }
    return;
  }
  if (levelNum === 12) {
    // SENYALS DE NEÓ de Tòquio que parpellegen!! 🌃
    const neonCols = ['#ff2d78', '#00e5ff', '#ffea00', '#76ff03'];
    for (const nx of [600, 1350, 2200, 3100, 4500, 5600, 7200, 8000, 9200, 10200, 11000]) {
      if (offscreen(nx, 220)) continue;
      const on = (frame + nx) % 80 < 55;
      const ny = 170 + (nx % 4) * 40;
      fillRect(g, nx, ny, 26, 76, on ? neonCols[(nx / 450 | 0) % 4] : '#37474f');
      strokeRect(g, nx, ny, 26, 76, '#212121', 3);
      if (on)
        for (let d = 0; d < 3; d++) fillRect(g, nx + 8, ny + 12 + d * 22, 10, 10, 'rgba(0,0,0,0.45)');
    }
    // TORIIS vermells a la zona del temple! ⛩️
    for (const tx of [3650, 4150, 4650]) {
      if (offscreen(tx, 220)) continue;
      fillRect(g, tx, 300, 16, 180, '#d32f2f');      fillRect(g, tx + 130, 300, 16, 180, '#d32f2f');
      fillRect(g, tx - 20, 280, 186, 18, '#d32f2f'); fillRect(g, tx - 5, 330, 156, 12, '#d32f2f');
      fillRect(g, tx - 20, 298, 186, 8, '#8e0000');
    }
    // arbres de sakura rosa escampats pels carrers 🌸
    for (const tx of [400, 1600, 6600, 7900, 11400]) {
      if (offscreen(tx, 220)) continue;
      fillRect(g, tx, 440, 12, 40, '#6d4c41');
      fillCirc(g, tx + 6, 425, 26, '#ffb7d5');
      fillCirc(g, tx - 12, 438, 16, '#ffb7d5');
      fillCirc(g, tx + 24, 438, 16, '#ffb7d5');
    }
    return;
  }
  if (levelNum === 1) {
    // CACTUS del desert! 🌵
    for (const cx of [250, 850, 1050, 2000, 2550]) {
      if (offscreen(cx, 220)) continue;
      fillRect(g, cx, 408, 18, 72, '#2e7d32');
      fillRect(g, cx - 14, 426, 14, 10, '#2e7d32'); fillRect(g, cx - 14, 412, 8, 16, '#2e7d32');
      fillRect(g, cx + 18, 436, 14, 10, '#2e7d32'); fillRect(g, cx + 24, 420, 8, 18, '#2e7d32');
      fillRect(g, cx + 4, 412, 4, 60, '#66bb6a');
    }
    // torxes que tremolen a la MASMORRA del castell!
    for (const tx of [3100, 3700, 4300, 4900, 5500])
        if (!offscreen(tx, 220))
        stamp('decor_torch_' + tx, 'torch', tx, 385,
            {alpha: 0.7 + 0.3 * Math.sin(frame * 0.2 + tx)});
    // floretes del pati-jardí!
    for (const fx of [6300, 6520, 6700, 7650, 7820, 8000, 8500])
        if (!offscreen(fx, 220))
        stamp('decor_flower_' + fx, 'flower', fx, 435);
    for (const mx of [6600, 7850])
        if (!offscreen(mx, 220))
        stamp('decor_mush_' + mx, 'mush', mx, 462);
    return;
  }
  for (const tx of [80, 550, 720, 1100, 1700, 2200, 2750, 3100, 3500])
      if (!offscreen(tx, 220))
      stamp('decor_tree_' + tx, 'tree', tx, 480 - 24);
  for (const mx of [950, 1900, 2600, 3850])
      if (!offscreen(mx, 220))
      stamp('decor_mush_' + mx, 'mush', mx, 480 - 18);
}

// ==================== LIQUIDS QUE BULLEN ====================
// la lava del castell, el riu de xocolata i l'aigua pudent!
function drawLiquids() {
  const g = gWorld;
  let cfg = null;
  if (levelNum === 2) cfg = ['#ff5722', '#ffca28', '#ff8a65', 1.5, 508, 0.12];   // LAVA!! 🔥
  if (levelNum === 5) cfg = ['#6d4c41', '#4e342e', '#8d6e63', 1.2, 510, 0.1];    // XOCOLATA 🍫
  if (levelNum === 6) cfg = ['#12736b', '#0d4f4a', '#1ba29a', 1.4, 510, 0.11];   // AIGUA PUDENT 💩
  if (levelNum === 16 && player.x > 12000) {
    // el mar de la lluita final contra en Kamek! 🌊
    fillRect(g, camX - 50, 505, W + 100, 60, '#0277bd');
    for (let i = 0; i < 16; i++) {
      const bx = camX - 20 + (i * 137 + frame * 1.3) % (W + 40);
      const by = 508 + Math.sin(frame * 0.1 + i * 2) * 6;
      fillCirc(g, bx, by, 5 + (i % 3) * 3, '#01579b');
    }
    for (let i = 0; i < 12; i++) {
      const bx = camX - 30 + (i * 173 + frame * 0.9) % (W + 60);
      const by = 505 + Math.sin(frame * 0.12 + i * 1.9) * 5;
      fillElli(g, bx, by, 14, 4, 'rgba(255,255,255,0.85)');
    }
    fillRect(g, camX - 50, 505, W + 100, 5, '#4fc3f7');
    return;
  }
  if (levelNum === 16) cfg = ['#ff5722', '#ffca28', '#ff8a65', 1.6, 508, 0.13];  // LAVA VOLCÀNICA!! 🌋
  if (levelNum === 17 && player.x > 4400 && player.x < 7000) {
    // el mar de sota el pont de la cursa 🌊 (no et fots, eh!)
    fillRect(g, camX - 50, 510, W + 100, 50, '#29b6f6');
    for (let i = 0; i < 12; i++) {
      const bx = camX - 30 + (i * 173 + frame * 0.9) % (W + 60);
      const by = 510 + Math.sin(frame * 0.12 + i * 1.9) * 5;
      fillElli(g, bx, by, 14, 4, 'rgba(255,255,255,0.85)');
    }
    fillRect(g, camX - 50, 510, W + 100, 4, '#81d4fa');
    return;
  }
  if (levelNum === 15 && player.x > 10800) {
    // EL MAR DE LA COBRA!! 🌊 onades que pugen i baixen!
    fillRect(g, camX - 50, 505, W + 100, 60, '#0277bd');
    for (let i = 0; i < 16; i++) {
      const bx = camX - 20 + (i * 137 + frame * 1.3) % (W + 40);
      const by = 508 + Math.sin(frame * 0.1 + i * 2) * 6;
      fillCirc(g, bx, by, 5 + (i % 3) * 3, '#01579b');
    }
    // escuma blanca a la cresta de les onades!
    for (let i = 0; i < 12; i++) {
      const bx = camX - 30 + (i * 173 + frame * 0.9) % (W + 60);
      const by = 505 + Math.sin(frame * 0.12 + i * 1.9) * 5;
      fillElli(g, bx, by, 14, 4, 'rgba(255,255,255,0.85)');
    }
    fillRect(g, camX - 50, 505, W + 100, 5, '#4fc3f7');
    return;
  }
  if (!cfg) return;
  fillRect(g, camX - 50, 505, W + 100, 60, cfg[0]);
  for (let i = 0; i < 14; i++) {
    const bx = camX - 20 + (i * 137 + frame * cfg[3]) % (W + 40);
    const by = cfg[4] + Math.sin(frame * cfg[5] + i * 2) * 4;
    fillCirc(g, bx, by, 4 + (i % 3) * 2, cfg[1]);
  }
  fillRect(g, camX - 50, 505, W + 100, 6, cfg[2]);
}

// ==================== PLATAFORMES ====================
// cada tipus de terra té el seu dibuix — com si estiguessin fets amb ceres!
function drawPlatform(p) {
  const g = gWorld;
  if (p.type === 'ground') {
    // terra estil cera: taronja amb ratlles dibuixades
    fillRect(g, p.x, p.y, p.w, p.h, '#e0a961');
    for (let sx = p.x + 14; sx < p.x + p.w; sx += 36)
      linea(g, sx, p.y + 24, sx + 16, p.y + p.h - 8, '#c98d45', 3);
    // herba verda amb vora de cera
    fillRect(g, p.x, p.y, p.w, 16, '#6fdc7f');
    linea(g, p.x, p.y + 17, p.x + p.w, p.y + 17, '#4caf50', 3);
    // florquetes
    for (let fx = p.x + 20; fx < p.x + p.w - 10; fx += 90) {
      fillCirc(g, fx, p.y - 6, 4, ['#ff8fb3','#ffd166','#b48ef0'][(fx/90|0) % 3]);
      linea(g, fx, p.y, fx, p.y - 4, '#388e3c', 2);
    }
  } else if (p.type === 'rock') {
    // roca fosca de la cova
    fillRect(g, p.x, p.y, p.w, p.h, '#4a3a5e');
    for (let sx = p.x + 14; sx < p.x + p.w; sx += 40)
      linea(g, sx, p.y + 8, sx + 14, p.y + p.h - 8, '#5d4a78', 3);
  } else if (p.type === 'spikes') {
    // les punxes del dibuix de l'Unai — AI que punxen!! ⚠️
    const n = Math.max(2, Math.round(p.w / 18));
    const sw = p.w / n;
    if (p.down) fillRect(g, p.x, p.y, p.w, 6, '#78909c');
    else fillRect(g, p.x, p.y + p.h - 6, p.w, 6, '#78909c');
    g.lineStyle(2, col('#546e7a').color, 1);
    g.fillStyle(col('#eceff1').color, 1);
    for (let i = 0; i < n; i++) {
      g.beginPath();
      if (p.down) {   // punxes penjades del sostre!
        g.moveTo(p.x + i*sw, p.y + 5);
        g.lineTo(p.x + i*sw + sw/2, p.y + p.h);
        g.lineTo(p.x + (i+1)*sw, p.y + 5);
      } else {
        g.moveTo(p.x + i*sw, p.y + p.h - 5);
        g.lineTo(p.x + i*sw + sw/2, p.y);
        g.lineTo(p.x + (i+1)*sw, p.y + p.h - 5);
      }
      g.closePath(); g.fillPath(); g.strokePath();
    }
  } else if (p.type === 'lego') {
    // BLOC DE LEGO!! colors vius amb els cercoletes de dalt 🧱
    const cols = ['#e53935', '#1e88e5', '#fdd835', '#43a047', '#8e24aa', '#fb8c00'];
    const c = cols[Math.abs((p.x / 160) | 0) % cols.length];
    fillRect(g, p.x, p.y, p.w, p.h, c);
    strokeRect(g, p.x, p.y, p.w, p.h, 'rgba(0,0,0,0.35)', 3);
    // els cercoletes de LEGO a dalt!
    for (let sx = p.x + 14; sx < p.x + p.w - 6; sx += 28) {
      fillSemi(g, sx, p.y + 2, 9, 'rgba(255,255,255,0.30)');
      strokeSemi(g, sx, p.y + 2, 9, 'rgba(0,0,0,0.25)', 2);
    }
    fillRect(g, p.x, p.y + p.h - 6, p.w, 6, 'rgba(0,0,0,0.15)');
  } else if (p.type === 'party') {
    // TERRA DE FESTA: cada tram un color viu amb confeti enganxat!! 🎉
    const cols = ['#ff5252', '#ff9800', '#ffeb3b', '#66bb6a', '#42a5f5', '#ab47bc'];
    fillRect(g, p.x, p.y, p.w, p.h, cols[Math.abs((p.x / 160) | 0) % cols.length]);
    fillRect(g, p.x, p.y, p.w, 8, 'rgba(255,255,255,0.30)');
    strokeRect(g, p.x, p.y, p.w, p.h, 'rgba(0,0,0,0.3)', 3);
    // trossets de confeti enganxats al terra!
    for (let sx = p.x + 10; sx < p.x + p.w - 8; sx += 34)
      fillRect(g, sx, p.y + 12 + (sx % 3) * 9, 6, 6, cols[((sx / 34) | 0 + 2) % 6]);
  } else if (p.type === 'night') {
    // GESPA DE NIT: verd fosc amb floretes que brillen ✨
    fillRect(g, p.x, p.y, p.w, p.h, '#2e7d32');
    fillRect(g, p.x, p.y + p.h * 0.45, p.w, p.h * 0.55, '#1b5e20');
    fillRect(g, p.x, p.y, p.w, 7, '#66bb6a');
    for (let gx = p.x + 6; gx < p.x + p.w - 4; gx += 26) {
      fillRect(g, gx, p.y - 5, 3, 5, '#43a047');
      if (((gx / 26) | 0) % 4 === 0)   // floretes lluminoses!
        fillRect(g, gx + 7, p.y - 9, 4, 4, '#fff59d');
    }
  } else if (p.type === 'sand') {
    // SORRA DEL DESERT! groguenca amb granets 🏜️
    fillRect(g, p.x, p.y, p.w, p.h, '#e0ac45');
    fillRect(g, p.x, p.y, p.w, 10, '#f0c96a');
    strokeRect(g, p.x, p.y, p.w, p.h, '#b88a2e', 3);
    for (let sx = p.x + 15; sx < p.x + p.w - 10; sx += 45)
      fillRect(g, sx, p.y + p.h - 14, 5, 5, '#c9922e');
  } else if (p.type === 'balloon') {
    // GLOBUS TRAMPOLÍ: gran, brillant i amb nusset! 🎈
    const cols = ['#ff5d8f', '#ffb84d', '#4dd2ff', '#9d6bff', '#5dff8f', '#ffd166'];
    const c = cols[Math.abs((p.x / 40) | 0) % cols.length];
    const pulse = 1 + Math.sin(frame * 0.12 + p.x * 0.1) * 0.06;
    const cx = p.x + p.w / 2, cy = p.y + p.h / 2;
    g.fillStyle(col(c).color, 1);
    g.fillEllipse(cx, cy, p.w, p.h * pulse);
    strokeElli(g, cx, cy, p.w / 2, p.h / 2 * pulse, 'rgba(0,0,0,0.22)', 3);
    // brillantor de globus
    fillElli(g, p.x + p.w * 0.28, cy - p.h * 0.16, p.w * 0.09, p.h * 0.15, 'rgba(255,255,255,0.55)');
    // nusset del globus a baix
    triangle(g, cx - 6, p.y + p.h - 2, cx + 6, p.y + p.h - 2, cx, p.y + p.h + 8, c);
  } else if (p.type === 'choco') {
    // rajola de XOCOLATA! 🍫 amb quadres i tot
    fillRect(g, p.x, p.y, p.w, p.h, '#5d3a1a');
    fillRect(g, p.x, p.y, p.w, 10, '#7b4f24');
    for (let sx = p.x + 30; sx < p.x + p.w - 10; sx += 60)
      linea(g, sx, p.y, sx, p.y + p.h, '#3e2410', 3);
    linea(g, p.x, p.y + p.h/2, p.x + p.w, p.y + p.h/2, '#3e2410', 3);
    strokeRect(g, p.x, p.y, p.w, p.h, '#3e2410', 3);
    // brillantor de xocolata!
    for (let sx = p.x + 8; sx < p.x + p.w - 30; sx += 60)
      fillRect(g, sx, p.y + 4, 18, 5, 'rgba(255,255,255,0.18)');
  } else if (p.type === 'pipec') {
    // canonada de claveguera: metall verd fosc amb reblons!
    fillRect(g, p.x, p.y, p.w, p.h, '#2f5d50');
    fillRect(g, p.x, p.y, p.w, 8, '#3d7a68');
    strokeRect(g, p.x, p.y, p.w, p.h, '#1d3f35', 3);
    // anelles de la canonada
    for (let sx = p.x + 40; sx < p.x + p.w; sx += 80)
      linea(g, sx, p.y, sx, p.y + p.h, '#1d3f35', 3);
    // reblons brillants
    for (let sx = p.x + 16; sx < p.x + p.w; sx += 80)
      fillRect(g, sx, p.y + 3, 5, 5, '#4d8f7a');
  } else if (p.type === 'tower') {
    // pedra del castell de l'escalada: maons grisos blavosos!
    fillRect(g, p.x, p.y, p.w, p.h, '#7d8aa0');
    for (let yy = p.y + 14; yy < p.y + p.h; yy += 14)
      linea(g, p.x, yy, p.x + p.w, yy, '#4a5568', 2);
    for (let yy = p.y, i = 0; yy < p.y + p.h; yy += 14, i++)
      for (let xx = p.x + (i % 2) * 15; xx < p.x + p.w; xx += 30)
        linea(g, xx, yy, xx, Math.min(yy + 14, p.y + p.h), '#4a5568', 2);
    fillRect(g, p.x, p.y, p.w, 5, 'rgba(255,255,255,0.22)');
  } else if (p.type === 'snow') {
    // NEU del cim del Fuji! blanca amb ombra blava gelada ❄️
    fillRect(g, p.x, p.y, p.w, p.h, '#e8f4ff');
    fillRect(g, p.x, p.y, p.w, 8, '#ffffff');
    strokeRect(g, p.x, p.y, p.w, p.h, '#90b8d8', 3);
    // cristallets de neu
    for (let sx = p.x + 18; sx < p.x + p.w - 10; sx += 55)
      fillRect(g, sx, p.y + p.h - 10, 4, 4, '#b8d8f0');
  } else if (p.type === 'metal') {
    // metall del castell elèctric: gris brillant amb ratlles de perill!
    fillRect(g, p.x, p.y, p.w, p.h, '#546e7a');
    fillRect(g, p.x, p.y, p.w, 8, '#78909c');
    strokeRect(g, p.x, p.y, p.w, p.h, '#263238', 3);
    // ratlles de perill grogues i negres!
    for (let sx = p.x + 8; sx < p.x + p.w - 20; sx += 40)
      triangle(g, sx, p.y + 10, sx + 14, p.y + 10, sx + 6, p.y + 20, '#ffd600');
    // reblons
    for (let sx = p.x + 20; sx < p.x + p.w; sx += 60)
      fillRect(g, sx, p.y + p.h - 8, 4, 4, '#90a4ae');
  } else if (p.type === 'road') {
    // ASFALT!! carretera fosca amb ratlles grogues de pintura! 🛣️
    fillRect(g, p.x, p.y, p.w, p.h, '#37474f');
    fillRect(g, p.x, p.y, p.w, 8, '#546e7a');
    strokeRect(g, p.x, p.y, p.w, p.h, '#263238', 3);
    // ratlla discontinua del mig de la carretera
    for (let sx = p.x + 10; sx < p.x + p.w - 20; sx += 46)
      fillRect(g, sx, p.y + 14, 24, 6, '#ffd54f');
  } else if (p.type === 'bridge') {
    // PONT de ferro sobre el mar: bigues i reblons! 🌉
    fillRect(g, p.x, p.y, p.w, p.h, '#78909c');
    fillRect(g, p.x, p.y, p.w, 7, '#b0bec5');
    strokeRect(g, p.x, p.y, p.w, p.h, '#455a64', 3);
    // enreixat de sota el pont
    for (let sx = p.x; sx < p.x + p.w; sx += 40)
      linea(g, sx, p.y + p.h, sx + 20, p.y + p.h + 16, '#546e7a', 3);
    for (let sx = p.x + 16; sx < p.x + p.w; sx += 40)
      fillRect(g, sx, p.y + 3, 4, 4, '#eceff1');
  } else if (p.type === 'rail') {
    // RAILS de vagoneta: llistons de fusta amb dues barres de ferro! 🛤️
    fillRect(g, p.x, p.y, p.w, p.h, '#3e2c20');            // terra fosca
    // llistons de fusta travessats
    for (let sx = p.x + 4; sx < p.x + p.w - 6; sx += 28)
      fillRect(g, sx, p.y + 4, 16, 14, '#6d4c41');
    // les dues barres de ferro que brillen!
    fillRect(g, p.x, p.y + 1, p.w, 5, '#90a4ae');
    fillRect(g, p.x, p.y + 16, p.w, 5, '#90a4ae');
    fillRect(g, p.x, p.y, p.w, 2, '#cfd8dc');
  } else if (p.type === 'qblock') {
    // bloc "?" sorpresa — gris si ja l'has fet servir
    stamp('qb_' + platforms.indexOf(p), p.used ? 'qblock_used' : 'qblock', p.x, p.y);
  } else if (p.type === 'pipe' || p.type === 'castle') {
    // els tubs i el castell es dibuixen amb drawPipe() i drawCastle()
  } else {
    // núvol: dues boletes blanques enganxades ☁️
    cloudWorld(p.x + p.w*0.25, p.y + 12, 0.8);
    cloudWorld(p.x + p.w*0.65, p.y + 12, 0.8);
    fillRect(g, p.x + 10, p.y + 4, p.w - 20, p.h - 4, 'rgba(255,255,255,0.9)');
  }
}

// núvol dibuixat en coordenades del MÓN (no del cel!)
function cloudWorld(x, y, s) {
  fillCirc(gWorld, x, y, 18*s, '#ffffff', 0.9);
  fillCirc(gWorld, x + 22*s, y - 8*s, 22*s, '#ffffff', 0.9);
  fillCirc(gWorld, x + 44*s, y, 18*s, '#ffffff', 0.9);
}
// ==================== TUBS, PORTES, CASTELL I BANDERA ====================
function drawPipe(t) {
  const g = gWorld;
  fillRect(g, t.x, t.y + 12, t.w, t.h - 12, '#1f9e4b');
  fillRect(g, t.x - 5, t.y, t.w + 10, 16, '#37c862');
  fillRect(g, t.x - 5, t.y + 10, t.w + 10, 6, '#1f9e4b');
  strokeRect(g, t.x - 5, t.y, t.w + 10, 16, '#146332', 3);
  strokeRect(g, t.x, t.y + 12, t.w, t.h - 12, '#146332', 3);
  fillRect(g, t.x + 7, t.y + 18, 6, t.h - 18, 'rgba(255,255,255,0.25)');
  // avis: ↓ secret!
  if (player.x + player.w > t.x - 10 && player.x < t.x + t.w + 10 && frame % 40 < 20)
    textStamp('pipe_hint_' + t.x, '↓', t.x + t.w/2, t.y - 10, {size: 16, color: '#ffd700'});
}

// ===== LA PORTA VERMELLA DEL BOSS! 🚪 =====
function drawDoor(d) {
  const g = gWorld;
  // marc d'or amb arc
  fillSemi(g, d.x + d.w/2, d.y + 16, d.w/2 + 8, '#ffb300');
  fillRect(g, d.x - 8, d.y + 16, d.w + 16, d.h - 16, '#ffb300');
  // la porta vermella!
  fillSemi(g, d.x + d.w/2, d.y + 16, d.w/2, '#b71c1c');
  fillRect(g, d.x, d.y + 16, d.w, d.h - 16, '#b71c1c');
  // taulons de fusta
  for (const lx of [d.x + d.w*0.33, d.x + d.w*0.66])
      if (!offscreen(lx, 220))
      linea(g, lx, d.y + 20, lx, d.y + d.h, '#7f0000', 3);
  // llamp decoratiu dalt de tot ⚡
  const mx = d.x + d.w/2;
  g.lineStyle(4, col('#ffee58').color, 1);
  g.beginPath();
  g.moveTo(mx + 4, d.y - 24); g.lineTo(mx - 6, d.y - 8);
  g.lineTo(mx + 2, d.y - 6);  g.lineTo(mx - 8, d.y + 10);
  g.strokePath();
  // panxa daurada
  fillCirc(g, d.x + d.w - 14, d.y + d.h/2 + 6, 5, '#ffd700');
  // ↓ quan hi ets a sobre
  if (player.x + player.w > d.x - 10 && player.x < d.x + d.w + 10 && frame % 40 < 20)
    textStamp('door_hint_' + d.x, '↓', d.x + d.w/2, d.y - 30, {size: 16, color: '#ffd700'});
}

// ===== EL LLAMP del drac! ⚡ =====
function drawBolt(s) {
  const g = gWorld;
  const d = Math.hypot(s.vx, s.vy) || 1;
  const nx = s.vx/d, ny = s.vy/d;   // direcció del tret
  const px = -ny, py = nx;          // perpendicular per fer el zig-zag
  g.lineStyle(5, col('#ffee58').color, 1);
  g.beginPath();
  g.moveTo(s.x - nx*18, s.y - ny*18);
  g.lineTo(s.x - nx*6 + px*8, s.y - ny*6 + py*8);
  g.lineTo(s.x + nx*3 - px*8, s.y + ny*3 - py*8);
  g.lineTo(s.x + nx*18, s.y + ny*18);
  g.strokePath();
  g.lineStyle(2, col('#ffffff').color, 0.9);
  g.lineBetween(s.x - nx*14, s.y - ny*14, s.x + nx*14, s.y + ny*14);
}

// ===== EL CASTELL D'UNAI! =====
function drawCastle(X) {
  const g = gWorld;
  const TOP = 320, CW = 230, LT = 230, TW = 44;
  // pedra grisa
  fillRect(g, X, TOP, CW, 160, '#9aa0b5');            // cos
  fillRect(g, X, LT, TW, 90, '#9aa0b5');              // torre esquerra
  fillRect(g, X + CW - TW, LT, TW, 90, '#9aa0b5');    // torre dreta
  // línies dels maons
  for (let y = 236; y < 480; y += 16)
    linea(g, X, y, X + CW, y, '#6b7085', 2);
  for (let y = 236, i = 0; y < 480; y += 16, i++)
    for (let x = X + (i % 2) * 12; x < X + CW; x += 24)
      linea(g, x, y, x, Math.min(y + 16, 480), '#6b7085', 2);
  // merlets (les dents de dalt del castell!)
  for (let x = X + 4; x < X + CW; x += 26) fillRect(g, x, TOP - 18, 16, 18, '#9aa0b5');
  for (let x = X; x < X + TW; x += 18) fillRect(g, x, LT - 16, 12, 16, '#9aa0b5');
  for (let x = X + CW - TW; x < X + CW; x += 18) fillRect(g, x, LT - 16, 12, 16, '#9aa0b5');
  // sostres punxeguts vermells de les torres
  triangle(g, X - 6, LT - 14, X + TW/2, LT - 58, X + TW + 6, LT - 14, '#ff5252');
  triangle(g, X + CW - TW - 6, LT - 14, X + CW - TW/2, LT - 58, X + CW + 6, LT - 14, '#ff5252');
  // finestres fosques de les torres
  fillRect(g, X + 16, 268, 12, 20, '#2a2440');
  fillRect(g, X + CW - 28, 268, 12, 20, '#2a2440');
  // la gran porta del castell
  fillRect(g, X + CW/2 - 24, 420, 48, 60, '#2a2440');
  fillSemi(g, X + CW/2, 420, 24, '#2a2440');
  strokeSemi(g, X + CW/2, 420, 24, '#ffd700', 3);
  // banderola amb la U d'Unai!!
  fillRect(g, X + CW/2 - 40, 350, 80, 26, '#ff5252');
  strokeRect(g, X + CW/2 - 40, 350, 80, 26, '#8e1f1f', 2);
  textStamp('castell_u', 'U', X + CW/2, 363, {size: 20, color: '#ffd700'});
}

function drawFlag() {
  const g = gWorld;
  // pal
  fillRect(g, flag.x, flag.y, 8, 100, '#8b5a2b');
  // bandera que oneja (al 17 és QUADRICULADA de cursa!! 🏁)
  const wave = Math.sin(frame*0.1)*4;
  if (levelNum === 17) {
    for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++)
      fillRect(g, flag.x + 8 + i * 16, flag.y + 5 + j * 12 + Math.sin(frame*0.1 + i)*3, 16, 12,
               (i + j) % 2 ? '#212121' : '#ffffff');
  } else
  triangle(g, flag.x + 8, flag.y + 5, flag.x + 70, flag.y + 20 + wave, flag.x + 8, flag.y + 40, '#ff5252');
  // estrella
  textStamp('bandera_estrella', '★', flag.x + 26, flag.y + 24, {size: 20, color: '#ffd700', font: 'serif'});
  // base daurada de la bandera
  fillSemi(g, flag.x + 4, flag.y + 100, 14, '#ffd700');
}

function drawBubble(b) {
  const g = gWorld;
  fillCirc(g, b.x, b.y, 20, '#cfefff', 0.55);
  strokeCirc(g, b.x, b.y, 20, '#ffffff', 3);
  // nadó dins la bombolla (en pixel art!)
  stamp('bubble_baby', 'baby', b.x - 3*S, b.y - 2*S + Math.sin(frame*0.3));
}

// ==================== ELS BOSSES!! ====================
// els enemics normals són sprites; els bosses grans es dibuixen a mà
// (o amb un sprite gegant + corona/cors de vida)
function drawBossCos(e) {
  const g = gWorld;
  const cx = e.x + e.w/2, cy = e.y + e.h/2;
  if (e.dragon) {
    // EL DRAC D'ELECTRICITAT!!! 🐉⚡
    const cc = e.hurt > 0 ? '#ffffff' : '#42a5f5';
    const dark = e.hurt > 0 ? '#ffffff' : '#1565c0';
    // cua serpentina que oneja, acabada en espurna!
    const tx = cx - 95, ty = cy + Math.sin(frame * 0.08) * 24;
    corba(g, cx - 20, cy, cx - 60, cy - 30 + Math.sin(frame * 0.1) * 16, tx, ty, dark, 16);
    if (frame % 20 < 14) {
      g.lineStyle(4, col('#ffee58').color, 1);
      g.beginPath(); g.moveTo(tx, ty);
      g.lineTo(tx - 14, ty - 10); g.lineTo(tx - 6, ty - 20); g.lineTo(tx - 20, ty - 28);
      g.strokePath();
    }
    // ales fetes de llampecs!
    g.fillStyle(col('#ffee58').color, 0.85);
    g.beginPath();
    g.moveTo(cx - 10, cy - 10);
    g.lineTo(cx - 45, cy - 55 - Math.sin(frame * 0.15) * 10);
    g.lineTo(cx - 20, cy - 45);
    g.lineTo(cx - 42, cy - 18);
    g.fillPath();
    // cos i ventre
    fillElli(g, cx, cy, e.w/2 - 10, e.h/2 - 20, cc);
    strokeElli(g, cx, cy, e.w/2 - 10, e.h/2 - 20, dark, 4);
    fillElli(g, cx + 8, cy + 14, e.w/2 - 30, e.h/2 - 38, e.hurt > 0 ? '#ffffff' : '#bbdefb');
    // cap amb musell
    fillElli(g, cx + 28, cy - 22, 26, 20, cc);
    fillElli(g, cx + 52, cy - 16, 16, 10, cc);
    // banyes de llampec!
    g.lineStyle(4, col('#ffee58').color, 1);
    g.beginPath();
    g.moveTo(cx + 20, cy - 40); g.lineTo(cx + 14, cy - 58); g.lineTo(cx + 22, cy - 52); g.lineTo(cx + 18, cy - 66);
    g.moveTo(cx + 38, cy - 40); g.lineTo(cx + 42, cy - 56); g.lineTo(cx + 48, cy - 48); g.lineTo(cx + 54, cy - 62);
    g.strokePath();
    // ull vermell furiós!
    fillCirc(g, cx + 32, cy - 26, 8, '#ffffff');
    fillCirc(g, cx + 34, cy - 25, 4, '#ff1744');
    linea(g, cx + 20, cy - 38, cx + 42, cy - 33, dark, 4);
    // espurnes que li voltant el cos!
    if (frame % 8 < 5) {
      g.lineStyle(3, col('#ffee58').color, 1);
      for (let i = 0; i < 3; i++) {
        const a = frame * 0.2 + i * 2.1;
        const sx2 = cx + Math.cos(a) * (e.w/2 + 14);
        const sy2 = cy + Math.sin(a) * (e.h/2 - 10);
        g.beginPath();
        g.moveTo(sx2, sy2); g.lineTo(sx2 + 8, sy2 - 10); g.lineTo(sx2 + 2, sy2 - 16);
        g.strokePath();
      }
    }
    // si dorm... Zzzzz 💤
    if (e.asleep) {
      textStamp('drac_z1', 'z', cx - 40 + Math.sin(frame*0.05)*4, cy - 60, {size: 18, color: '#90caf9'});
      textStamp('drac_z2', 'Z', cx - 55 + Math.sin(frame*0.05 + 1)*4, cy - 85 - (frame % 80) * 0.2, {size: 18, color: '#90caf9'});
    }
  } else if (e.poop) {
    // LA CACA GEGANT!!! 💩😠
    const base = e.y + e.h;
    const c = e.hurt > 0 ? '#ffffff' : '#6d4c41';
    fillElli(g, cx, base - 22, e.w/2 + 14, 24, c);   // cua grossa
    fillElli(g, cx, base - 58, e.w/2 - 6, 24, c);    // el mig
    fillElli(g, cx, base - 90, e.w/2 - 24, 20, c);   // dalt
    fillElli(g, cx + 5, base - 108, 12, 10, c);      // la punta
    // ulls enfadats
    fillCirc(g, cx - 15, base - 62, 9, '#ffffff'); fillCirc(g, cx + 15, base - 62, 9, '#ffffff');
    fillCirc(g, cx - 13, base - 60, 4, '#222222'); fillCirc(g, cx + 17, base - 60, 4, '#222222');
    linea(g, cx - 26, base - 78, cx - 8, base - 70, '#3e2410', 4);
    linea(g, cx + 26, base - 78, cx + 8, base - 70, '#3e2410', 4);
    // dentets
    fillRect(g, cx - 10, base - 40, 7, 9, '#ffffff');
    fillRect(g, cx + 4, base - 40, 7, 9, '#ffffff');
    // núvols de pudor que pugen!!
    for (let i = 0; i < 3; i++) {
      const sx2 = cx - 30 + i * 30;
      corba(g, sx2, e.y - 14 + Math.sin(frame * 0.1 + i) * 4,
            sx2 + 10, e.y - 34, sx2, e.y - 52 + Math.sin(frame * 0.13 + i) * 4,
            'rgba(139,116,70,0.85)', 4);
    }
  } else if (e.balloon) {
    // EL GLOBUS GEGANT!!! 🎈😠
    const cy2 = cy - 6;
    const squish = 1 + Math.sin(frame * 0.1) * 0.06;
    const c = e.hurt > 0 ? '#ffffff' : '#ff5d8f';
    g.fillStyle(col(c).color, 1);
    g.fillEllipse(cx, cy2, e.w + 32, e.h * squish);
    strokeElli(g, cx, cy2, e.w / 2 + 16, e.h / 2 * squish, 'rgba(0,0,0,0.3)', 4);
    // brillantor
    fillElli(g, cx - e.w * 0.22, cy2 - e.h * 0.24, 12, 18, 'rgba(255,255,255,0.55)');
    // ulls enfadats
    fillCirc(g, cx - 16, cy2 - 14, 10, '#ffffff'); fillCirc(g, cx + 16, cy2 - 14, 10, '#ffffff');
    fillCirc(g, cx - 13, cy2 - 12, 5, '#222222');  fillCirc(g, cx + 19, cy2 - 12, 5, '#222222');
    // celles molt enfadades!
    linea(g, cx - 28, cy2 - 32, cx - 8, cy2 - 22, '#222222', 5);
    linea(g, cx + 28, cy2 - 32, cx + 8, cy2 - 22, '#222222', 5);
    // boca oberta cridant!
    fillElli(g, cx, cy2 + 16, 10 + Math.sin(frame * 0.2) * 3, 12, '#7a1f3d');
    // nusset i corda que oneja
    triangle(g, cx - 8, cy2 + e.h / 2 - 4, cx + 8, cy2 + e.h / 2 - 4, cx, cy2 + e.h / 2 + 8, c);
    corba(g, cx, cy2 + e.h / 2 + 8, cx + Math.sin(frame * 0.08) * 16, cy2 + e.h / 2 + 36,
          cx - Math.sin(frame * 0.11) * 12, cy2 + e.h / 2 + 60, '#d4a5b5', 3);
  } else if (e.stone) {
    // LA CARA DE PEDRA!! 🗿 el boss rodó del dibuix de l'Unai!
    const c = e.hurt > 0 ? '#ffffff' : '#9e9e9e';
    fillElli(g, cx, cy, e.w/2 + 8, e.h/2, c);
    strokeElli(g, cx, cy, e.w/2 + 8, e.h/2, '#616161', 5);
    // esquerdes de pedra
    g.lineStyle(3, col('#757575').color, 1);
    g.beginPath();
    g.moveTo(cx - 25, cy - 35); g.lineTo(cx - 15, cy - 20); g.lineTo(cx - 28, cy - 5);
    g.moveTo(cx + 30, cy - 30); g.lineTo(cx + 22, cy - 12); g.lineTo(cx + 34, cy + 2);
    g.strokePath();
    // ulls enfadats amb pupiles vermelles!
    fillCirc(g, cx - 16, cy - 12, 10, '#ffffff'); fillCirc(g, cx + 16, cy - 12, 10, '#ffffff');
    fillCirc(g, cx - 13, cy - 10, 5, '#b71c1c');  fillCirc(g, cx + 19, cy - 10, 5, '#b71c1c');
    // celles molt enfadades
    linea(g, cx - 30, cy - 28, cx - 6, cy - 18, '#424242', 5);
    linea(g, cx + 30, cy - 28, cx + 6, cy - 18, '#424242', 5);
    // boca amb dents quadrades com el dibuix!
    fillRect(g, cx - 22, cy + 12, 44, 16, '#37474f');
    for (let i = 0; i < 4; i++) fillRect(g, cx - 20 + i*11, cy + 13, 9, 7, '#ffffff');
  } else if (e.cobra) {
    // LA COBRA GEGANT!!! 🐍 surt del mar, enorme i amb caputxa!
    const c = e.hurt > 0 ? '#ffffff' : '#43a047';
    const dark = e.hurt > 0 ? '#ffffff' : '#1b5e20';
    const capX = e.vx > 0 ? e.x + e.w - 30 : e.x + 30;   // el cap va al davant!
    // el cos fa ones dins de l'aigua — cercles que s'enfonsen
    for (let i = 0; i < 5; i++) {
      const sx = e.x + 30 + i * (e.w - 60) / 4;
      const sy = e.y + 50 + Math.sin(frame * 0.07 + i * 1.3) * 16;
      fillCirc(g, sx, sy, 24 - i * 2, c);
      fillCirc(g, sx - 5, sy - 8, 8, 'rgba(255,255,255,0.25)');   // brillantor d'escates
    }
    // LA CUA — el punt dèbil! brilla i parpelleja amb ets daurats ✨
    const cua = cuaCobra(e);
    fillElli(g, cua.x + cua.w / 2, cua.y + cua.h / 2, cua.w / 2 + 8, cua.h / 2, '#ffd700');
    fillElli(g, cua.x + cua.w / 2, cua.y + cua.h / 2, cua.w / 2 - 4, cua.h / 2 - 10, c);
    if (frame % 30 < 15)
      for (let i = 0; i < 3; i++)
        fillCirc(g, cua.x + 10 + i * 16, cua.y - 8 + Math.sin(frame * 0.15 + i) * 5, 4, '#fff59d');
    // el coll amb CAPUTXa de cobra que s'aixeca del mar!
    const ny = e.y + Math.sin(frame * 0.05) * 8;   // el cap oneja
    corba(g, capX + (e.vx > 0 ? -60 : 60), e.y + 70, capX + (e.vx > 0 ? -30 : 30), ny + 10, capX, ny, c, 26);
    fillElli(g, capX, ny + 14, 34, 40, c);                      // la caputxa oberta!
    strokeElli(g, capX, ny + 14, 34, 40, dark, 3);
    fillElli(g, capX, ny + 14, 22, 28, e.hurt > 0 ? '#ffffff' : '#c5e1a5');  // interior clar
    // el CAP amb ulls hipnòtics i ullals!
    fillElli(g, capX, ny - 14, 20, 16, c);
    fillCirc(g, capX - 8, ny - 18, 7, '#ffffff');  fillCirc(g, capX + 8, ny - 18, 7, '#ffffff');
    fillCirc(g, capX - 7, ny - 18, 3, '#e53935');  fillCirc(g, capX + 9, ny - 18, 3, '#e53935');
    // celles de serp dolenta!
    linea(g, capX - 15, ny - 28, capX - 4, ny - 23, dark, 3);
    linea(g, capX + 15, ny - 28, capX + 4, ny - 23, dark, 3);
    // ullals i la llengua bifurcada que entra i surt!!
    triangle(g, capX - 6, ny - 2, capX - 2, ny - 2, capX - 4, ny + 8, '#ffffff');
    triangle(g, capX + 2, ny - 2, capX + 6, ny - 2, capX + 4, ny + 8, '#ffffff');
    if (frame % 30 < 12) {
      linea(g, capX + (e.vx > 0 ? 18 : -18), ny - 12, capX + (e.vx > 0 ? 34 : -34), ny - 12, '#ff5252', 3);
      linea(g, capX + (e.vx > 0 ? 34 : -34), ny - 12, capX + (e.vx > 0 ? 40 : -40), ny - 16, '#ff5252', 2);
      linea(g, capX + (e.vx > 0 ? 34 : -34), ny - 12, capX + (e.vx > 0 ? 40 : -40), ny - 8, '#ff5252', 2);
    }
    // esquitxades d'aigua on el cos toca el mar!! 💦
    for (let i = 0; i < 4; i++) {
      const wx = e.x + 40 + i * (e.w - 80) / 3;
      fillCirc(g, wx, 505 - ((frame + i * 20) % 40) * 0.6, 3, '#b3e5fc', 0.7);
    }
  } else if (e.kamekBoss) {
    // EN KAMEK GEEEANT!!! 🧙✨ el mag més gran que has vist mai!
    const cc = e.hurt > 0 ? '#ffffff' : '#7e57c2';
    const blau = e.hurt > 0 ? '#ffffff' : '#81d4fa';
    // l'escombreta gegant que el porta volant
    const bs = Math.sin(frame * 0.05) * 4;
    linea(g, e.x + e.w * 0.1, e.y + e.h - 10 + bs, e.x + e.w * 0.95, e.y + e.h + 6 + bs, '#8d6e63', 9);
    for (let i = 0; i < 5; i++)
      linea(g, e.x + e.w - 14, e.y + e.h + 2 + bs, e.x + e.w + 22, e.y + e.h - 10 + i * 7 + bs, '#d7a06a', 5);
    // la túnica morada — gran i amb puntes de bruixot!
    fillElli(g, cx, cy + 22, e.w * 0.38, e.h * 0.4, cc);
    g.fillStyle(col(cc).color, 1);
    g.beginPath();
    g.moveTo(cx - e.w * 0.36, cy + e.h * 0.32);
    g.lineTo(cx - e.w * 0.28, cy + e.h * 0.5);
    g.lineTo(cx, cy + e.h * 0.38);
    g.lineTo(cx + e.w * 0.28, cy + e.h * 0.5);
    g.lineTo(cx + e.w * 0.36, cy + e.h * 0.32);
    g.fillPath();
    // els braços: un sosté la VARITA MÀGICA! 🪄
    const wx = cx + (e.vx > 0 ? 40 : -40);
    fillElli(g, wx, cy + 8, 10, 18, cc);
    linea(g, wx, cy - 4, wx + (e.vx > 0 ? 26 : -26), cy - 34, '#8d6e63', 5);
    fillCirc(g, wx + (e.vx > 0 ? 28 : -28), cy - 38, 7, '#ffd700');   // la punta daurada!
    if (frame % 20 < 14)   // la varita llueix quan carrega l'atac!
      for (let i = 0; i < 4; i++) {
        const a = frame * 0.2 + i * 1.6;
        fillCirc(g, wx + (e.vx > 0 ? 28 : -28) + Math.cos(a) * 14, cy - 38 + Math.sin(a) * 14, 3, '#e1bee7');
      }
    // el CAP blau amb les ulleres grogues de mag!
    fillCirc(g, cx, cy - 28, 30, blau);
    strokeCirc(g, cx, cy - 28, 30, e.hurt > 0 ? '#ffffff' : '#4a76a8', 3);
    // ulleres rodones grogues — els seus ulls brillen dins!
    fillCirc(g, cx - 12, cy - 30, 10, '#ffd700');
    fillCirc(g, cx + 12, cy - 30, 10, '#ffd700');
    fillCirc(g, cx - 11, cy - 30, 5, '#ffffff');
    fillCirc(g, cx + 13, cy - 30, 5, '#ffffff');
    fillCirc(g, cx - 10, cy - 30, 2.5, '#222222');
    fillCirc(g, cx + 14, cy - 30, 2.5, '#222222');
    // el BARRET punxegut gegant de bruixot!
    g.fillStyle(col(e.hurt > 0 ? '#ffffff' : '#5e35b1').color, 1);
    g.beginPath();
    g.moveTo(cx - 38, cy - 46);
    g.lineTo(cx + 38, cy - 46);
    g.lineTo(cx + 14, cy - 92 - Math.sin(frame * 0.07) * 4);
    g.lineTo(cx - 6, cy - 60);
    g.fillPath();
    fillRect(g, cx - 42, cy - 50, 84, 10, e.hurt > 0 ? '#ffffff' : '#4527a0');
    // boca que riu quan està sa, oberta quan li fas mal!
    if (e.hurt > 0) fillElli(g, cx, cy - 8, 8, 6, '#37474f');
    else corba(g, cx - 10, cy - 10, cx, cy - 4, cx + 10, cy - 12, '#37474f', 3);
    // espurnes màgiques que l'envolten!! ✨
    for (let i = 0; i < 5; i++) {
      const a = frame * 0.1 + i * 1.26;
      fillCirc(g, cx + Math.cos(a) * (e.w * 0.48), cy + Math.sin(a) * (e.h * 0.45),
               4, i % 2 ? '#e1bee7' : '#ffd700', 0.9);
    }
  } else if (e.flyking) {
    // EL FLY GUY GEGANT, REI DEL CASTELL!! 🧢👑
    stamp('boss_flyking', e.hurt > 0 ? 'fly_white_a' : (frame % 8 < 4 ? 'fly_red_a' : 'fly_red_b'),
          e.x + e.w/2 - 45, e.y + e.h - 81, {flipX: e.vx < 0, scale: 9});
    // corona daurada de rei!
    const kx = cx, ky = e.y + e.h - 56;
    fillRect(g, kx - 15, ky - 10, 30, 9, '#ffd700');
    for (let i = -1; i <= 1; i++)
      triangle(g, kx + i*12 - 5, ky - 10, kx + i*12, ky - 20, kx + i*12 + 5, ky - 10, '#ffd700');
    fillRect(g, kx - 3, ky - 8, 6, 5, '#ff1744');   // la gemma vermella de la corona!
  } else if (e.alien) {
    // L'ALIEN GEGANT de l'espai!
    stamp('boss_alien', e.hurt > 0 ? 'alien_white' : 'alien',
          e.x + e.w/2 - 36, e.y + e.h - 60, {flipX: e.vx < 0, scale: 6});
  } else {
    // EL BOSS: un Shy Guy GEGEGANT! (parpelleja blanc quan li fas mal)
    stamp('boss_shy', e.hurt > 0 ? 'shy_white_a' :
          (frame % 20 < 10 ? 'shy_' + (e.color in ROBE ? e.color : 'red') + '_a'
                           : 'shy_' + (e.color in ROBE ? e.color : 'red') + '_b'),
          e.x + e.w/2 - 36, e.y + e.h - 84, {flipX: e.vx < 0, scale: 6});
  }
  // cors de vida del boss
  for (let i = 0; i < e.hp; i++)
    stamp('boss_heart_' + i, 'heart', e.x + e.w/2 - 40 + i * 28, e.y - 44);
}

// ==================== LA MÀQUINA D'OUS!! 🥚 ====================
// una màquina de ferro amb una cistella: toca-la i t'omple els ous!
function drawMaquina(m) {
  const g = gWorld;
  const x = m.x, y = m.y;         // y = a dalt de la plataforma
  if (offscreen(x, 120)) return;
  // cos de la màquina: caixa de ferro blavosa amb reblons
  fillRect(g, x - 26, y - 44, 52, 44, '#78909c');
  strokeRect(g, x - 26, y - 44, 52, 44, '#37474f', 3);
  fillRect(g, x - 26, y - 44, 52, 8, '#90a4ae');
  for (const rx of [-18, 0, 18]) fillCirc(g, x + rx, y - 8, 3, '#546e7a');
  // la cistella d'ous a dalt — plena d'ous blancs!
  fillRect(g, x - 20, y - 56, 40, 14, '#8d6e63');
  strokeRect(g, x - 20, y - 56, 40, 14, '#4e342e', 2);
  for (let i = 0; i < 3; i++)
    fillElli(g, x - 12 + i * 12, y - 58, 6, 7, '#fffde7');
  // llumeta que parpelleja: VERD = a punt, VERMELL = recarregant!
  fillCirc(g, x, y - 34, 6, m.t > 0 ? '#ff5252' : '#69f0ae');
  strokeCirc(g, x, y - 34, 6, '#37474f', 2);
  // cartell amb un ou perquè es vegi què és! 🥚
  stamp('maq_ou_' + (x | 0), 'egg', x - 10, y - 86 + Math.sin(frame * 0.1) * 3);
  textStamp('maq_txt_' + (x | 0), 'OUS!', x - 22, y - 70, {size: 13, color: '#ffd700'});
}

// ==================== KAMEK, EL MAG!! 🧙 ====================
// vola amb l'escombreta, llança l'encanteri i marxa rient!
function drawKamek() {
  if (!kamek || offscreen(kamek.x, 200)) return;
  const g = gWorld;
  const x = kamek.x, y = kamek.y;
  const c = kamek.marxa ? '#9575cd' : '#7e57c2';   // túnica morada
  // l'escombreta!
  linea(g, x - 30, y + 22, x + 30, y + 30, '#8d6e63', 5);
  for (let i = 0; i < 4; i++)
    linea(g, x + 24, y + 28, x + 42, y + 20 + i * 4, '#d7a06a', 3);
  // cos amb la túnica morada
  fillElli(g, x, y + 8, 16, 20, c);
  // cap amb els ulls grocs de mag!
  fillCirc(g, x, y - 16, 13, '#81d4fa');
  fillCirc(g, x - 5, y - 16, 4, '#ffd700');
  fillCirc(g, x + 5, y - 16, 4, '#ffd700');
  // el barret punxegut de mag!
  g.fillStyle(col('#5e35b1').color, 1);
  g.beginPath();
  g.moveTo(x - 16, y - 24); g.lineTo(x + 16, y - 24); g.lineTo(x + 4, y - 52); g.fillPath();
  fillRect(g, x - 18, y - 26, 36, 5, '#4527a0');
  // espurnes màgiques mentre fa l'encanteri!! ✨
  if (!kamek.marxa)
    for (let i = 0; i < 4; i++) {
      const a = frame * 0.15 + i * 1.6;
      fillCirc(g, x + Math.cos(a) * 34, y + Math.sin(a) * 24, 4, '#e1bee7');
    }
}

// ==================== LA SERP i LA COBRA GEGANT!! 🐍 ====================
// la serpeteta innocenta que Kamek transforma...
function drawSerp(e) {
  const g = gWorld;
  if (offscreen(e.x, 120)) return;
  const cy = e.y + e.h / 2;
  // cos verd que fa ones
  corba(g, e.x, cy + Math.sin(frame * 0.15) * 4, e.x + e.w / 2, cy - 10, e.x + e.w - 12, cy, '#66bb6a', 8);
  // cap amb ull i llengua!
  fillCirc(g, e.x + e.w - 8, cy - 4, 9, '#66bb6a');
  fillCirc(g, e.x + e.w - 5, cy - 7, 3, '#ffffff');
  fillCirc(g, e.x + e.w - 4, cy - 7, 1.6, '#222222');
  if (frame % 40 < 10)
    linea(g, e.x + e.w + 1, cy - 4, e.x + e.w + 10, cy - 7, '#ff5252', 2);   // la llengua!
}

// ==================== EL COTXE DE CURSES!! 🏎️ ====================
// el kart del Poshi: vermell, ràpid i amb el conductor a dalt!
function drawCotxe(p) {
  const g = gWorld;
  const baseY = p.y + p.h;                    // terra = sota el jugador
  const cx = p.x + p.w / 2;
  const parp = p.inv > 0 && frame % 6 < 3;    // pampallugueja quan t'has fet mal!
  // fumeta del tub d'escapament — puuuf puuuf!
  if (frame % 8 < 4)
    fillCirc(g, cx - 46 - (frame % 8) * 6, baseY - 14 - (frame % 8) * 2,
             4 + (frame % 8), 'rgba(150,150,150,0.45)');
  // el cos del cotxe: vermell de cursa amb franja blanca!
  if (!parp) {
    fillRect(g, cx - 44, baseY - 26, 88, 18, '#e53935');
    fillElli(g, cx - 8, baseY - 28, 34, 14, '#e53935');      // cabina
    fillElli(g, cx + 34, baseY - 24, 16, 10, '#e53935');     // morro
    fillRect(g, cx - 44, baseY - 26, 88, 6, '#ffffff');      // franja blanca!
    fillRect(g, cx + 24, baseY - 30, 22, 4, '#ffd54f');      // el nombre!
    textStamp('cotxe_num', '7', cx + 35, baseY - 28, {size: 10, color: '#e53935'});
    // aleta del darrere — va molt ràpid!
    fillRect(g, cx - 48, baseY - 40, 6, 16, '#b71c1c');
    fillRect(g, cx - 50, baseY - 44, 22, 6, '#e53935');
  }
  // les RODES que giren!! ⚙️
  for (const rx of [cx - 28, cx + 28]) {
    fillCirc(g, rx, baseY - 8, 12, '#212121');
    fillCirc(g, rx, baseY - 8, 6, '#78909c');
    // radis que giren amb la velocitat!
    const a = frame * p.vx * 0.06;
    linea(g, rx - Math.cos(a) * 10, baseY - 8 - Math.sin(a) * 10,
          rx + Math.cos(a) * 10, baseY - 8 + Math.sin(a) * 10, '#b0bec5', 3);
    linea(g, rx - Math.cos(a + 1.57) * 10, baseY - 8 - Math.sin(a + 1.57) * 10,
          rx + Math.cos(a + 1.57) * 10, baseY - 8 + Math.sin(a + 1.57) * 10, '#b0bec5', 3);
  }
  // EL POSHI CONDUINT — el cap surt de la cabina! 🐤
  const ph = 46;
  const texP = ESCENA.textures.get(POSHI_TEX);
  const pw = ph * texP.getSourceImage().width / texP.getSourceImage().height;
  posa(poshiObj, POSHI_TEX, cx - pw / 2 - 6, baseY - 26 - ph + 6,
       {flipX: false, scale: 1, alpha: parp ? 0.35 : 1});
  poshiObj._img.setDisplaySize(pw, ph);
  poshiObj._img.setDepth(8);
  // el volant!
  if (!parp) {
    strokeCirc(g, cx + 8, baseY - 30, 6, '#37474f', 3);
    linea(g, cx + 2, baseY - 26, cx + 8, baseY - 30, '#37474f', 3);
  }
}

// ==================== LA VAGONETA DE MINA!! 🎢 ====================
// corre pels rails i quan fa un LUPING gira sencera amb el cercle!!
function drawVago(p) {
  const g = gWorld;
  const parp = p.inv > 0 && frame % 6 < 3;
  const cx = p.x + p.w / 2, baseY = p.y + p.h;
  const ang = p.loop ? p.loop.th - Math.PI/2 : 0;   // gira amb el luping!!

  // el vagó gira al voltant del punt de contacte amb el rail!
  g.save();
  g.translateCanvas(cx, baseY);
  g.rotateCanvas(ang);
  if (!parp) {
    // caixa del vagó: fusta fosca amb reblons
    g.fillStyle(col('#795548').color, 1);
    g.fillRect(-34, -34, 68, 22);
    g.lineStyle(3, col('#4e342e').color, 1);
    g.strokeRect(-34, -34, 68, 22);
    // ribet metàl·lic de dalt
    g.fillStyle(col('#90a4ae').color, 1);
    g.fillRect(-36, -38, 72, 6);
    // bigues de fusta del costat
    g.lineStyle(3, col('#5d4037').color, 1);
    g.beginPath();
    g.moveTo(-24, -34); g.lineTo(-24, -12);
    g.moveTo(0, -34);   g.lineTo(0, -12);
    g.moveTo(24, -34);  g.lineTo(24, -12);
    g.strokePath();
    // peces d'or que porta dins! 💰 brillen!
    g.fillStyle(col('#ffd700').color, 0.9);
    g.fillRect(-18, -40, 10, 6); g.fillRect(-4, -42, 10, 8); g.fillRect(10, -40, 10, 6);
    // les rodes del vagó (giren amb la velocitat!)
    const a = frame * p.vx * 0.1;
    for (const rx of [-20, 20]) {
      g.fillStyle(col('#37474f').color, 1);
      g.fillCircle(rx, -6, 9);
      g.fillStyle(col('#78909c').color, 1);
      g.fillCircle(rx, -6, 4);
      g.lineStyle(2, col('#b0bec5').color, 1);
      g.lineBetween(rx - Math.cos(a) * 8, -6 - Math.sin(a) * 8, rx + Math.cos(a) * 8, -6 + Math.sin(a) * 8);
    }
    // espurnes que salten dels rails quan corre! ⚡
    if (!p.loop && frame % 6 < 3) {
      g.fillStyle(col('#ffee58').color, 0.9);
      g.fillRect(-26 - (frame % 6) * 3, -4, 4, 3);
      g.fillRect(14 - (frame % 6) * 4, -3, 4, 3);
    }
  }
  g.restore();

  // EL POSHI DINS EL VAGÓ — també gira amb el luping!! 🐤
  const ph = 44;
  const texP = ESCENA.textures.get(POSHI_TEX);
  const pw = ph * texP.getSourceImage().width / texP.getSourceImage().height;
  // el Poshi seu a dins del vagó: posició rotada com el vagó!
  const dxx = 10, dyy = -20;
  const px2 = cx + Math.cos(ang) * dxx - Math.sin(ang) * dyy;
  const py2 = baseY + Math.sin(ang) * dxx + Math.cos(ang) * dyy;
  const im = posa(poshiObj, POSHI_TEX, px2, py2, {scale: 1, alpha: parp ? 0.35 : 1});
  im.setDisplaySize(pw, ph);
  im.setDepth(8);
  im.setOrigin(0.5, 1);                          // gira des dels peus!
  im.setRotation(ang);
  im.setFlipX(false);
}

// ==================== EL POSHI I ELS SEUS TRUCS ====================
// el dibuix gran de l'Unai és un sprite; aquí dibuixem la resta:
// l'aurèola de l'estrella, la llengua, la fletxa de punteria...
function drawDinoExtras(p) {
  const g = gWorld;
  const ph = 56, pw = Math.round(ph * POSHI_W / POSHI_H);
  const sx = p.x + p.w/2 - pw/2;
  const sy = p.y + p.h - ph;
  // amb l'estrella, una aurèola d'arc iris al darrere!
  if (p.invStar > 0)
    fillElli(g, p.x + p.w/2, p.y + p.h/2, pw * 0.85, ph * 0.75,
             `hsl(${frame * 30 % 360}, 85%, 60%)`, 0.5);
  // el nadó Mario a l'esquena!
  if (p.baby) {
    const bx = p.facing === 1 ? sx + S : sx + 9*S;
    stamp('baby_rider', 'baby', bx, sy - 2*S + Math.sin(frame*0.2));
  }
  // llengua!
  if (p.tongue > 0) {
    const t = 1 - Math.abs(p.tongue - 8) / 8;   // 0→1→0
    const len = t * 64;
    const ty = p.y + 20;
    const tx = p.facing === 1 ? p.x + p.w - 6 : p.x + 6;
    g.lineStyle(7, col('#ff6f91').color, 1);
    g.lineBetween(tx, ty, tx + p.facing*len, ty);
    fillCirc(g, tx + p.facing*len, ty, 6, '#ff6f91');
  }
}

// fletxa de punteria de l'ou (es mou sola!)
function drawAim() {
  const p = player;
  const ang = -Math.abs(Math.sin(p.aimT)) * 1.2 + 0.15;
  const ax = p.x + p.w/2, ay = p.y + 12;
  const ex = ax + Math.cos(ang) * p.facing * 90, ey = ay + Math.sin(ang) * 90;
  // línia de punts: trossets amb espais
  const d = Math.hypot(ex - ax, ey - ay);
  const nx = (ex - ax) / d, ny = (ey - ay) / d;
  for (let s = 0; s + 8 <= d; s += 14)
    linea(gWorld, ax + nx * s, ay + ny * s, ax + nx * (s + 8), ay + ny * (s + 8), '#ff5252', 4);
  fillCirc(gWorld, ex, ey, 6, '#ff5252');
}

// espurnes i confeti de les explosions!
function drawParticles() {
  for (const pt of particles)
    fillCirc(gWorld, pt.x, pt.y, 4, pt.color, pt.life / 25);
}
