// ==================== NIVELLS ====================
const platforms = [], pipes = [], doors = [], mines = [], enemies = [], plants = [];
const heals = [], starPicks = [], pads = [], fruits = [];
const popups = [];
function pop(text, x, y, color) {
  popups.push({text, x, y, color, life: 50});
}
let shake = 0;
let wonPlayed = false, overPlayed = false;
const flag = {x: 0, y: 0};
let LEVEL_END = 5400;
let LEVEL_TOP = 0;          // fins a quina alçada pot pujar la càmera (nivells verticals!)
let levelNum = 1;
let levelStart = 0;

// ajudants per construir nivells
function addFruitLine(x0, y, n, gap, type) {
  for (let i = 0; i < n; i++)
    fruits.push({x: x0 + i*gap, y, type, taken: false, bob: Math.random()*6});
}
function shy(x, minX, maxX, color, gy) {
  gy = gy || 480;
  enemies.push({x, y: gy - 42, w: 36, h: 42, vx: 1.2, minX, maxX, color, alive: true});
}
function fly(x, minX, maxX, baseY) {
  enemies.push({x, y: baseY, baseY, w: 30, h: 27, vx: 1.6, minX, maxX, color: 'red', fly: true, alive: true, t: Math.random()*6});
}
function mineAt(x, y) { mines.push({x, y, drawY: y, alive: true, bob: Math.random()*6}); }
function plantAt(x, gy) { plants.push({x, gy: gy || 480, t: Math.random()*6, pop: 0, alive: true}); }
function spikyAt(x, minX, maxX, gy) {
  gy = gy || 480;
  enemies.push({x, y: gy - 30, w: 36, h: 30, vx: 1, minX, maxX, color: 'pink', spiky: true, alive: true});
}
function poopAt(x, minX, maxX, gy) {
  gy = gy || 480;
  enemies.push({x, y: gy - 24, w: 30, h: 24, vx: 0.9, minX, maxX, color: 'red', poop: true, alive: true});
}
function fishAt(x, minX, maxX, baseY) {
  enemies.push({x, y: baseY, baseY, w: 44, h: 24, vx: 1.8, minX, maxX, color: 'red', fly: true, fish: true, alive: true, t: Math.random()*6});
}
function qblock(x, y) { platforms.push({x, y, w: 36, h: 24, type: 'qblock'}); }

function buildLevel(n) {
  levelNum = n;
  levelStart = frame;
  LEVEL_TOP = 0;
  for (const a of [platforms, pipes, doors, mines, enemies, plants, heals, starPicks, pads, fruits])
    a.length = 0;
  eggs.length = 0; popups.length = 0; shots.length = 0;
  musicI = 0; bassI = 0;   // la música del nou nivell comença de zero!
  babyBubble = null; shake = 0;
  player.x = 60; player.y = 400; player.vx = 0; player.vy = 0;
  player.baby = true; player.pounding = false; player.aiming = false; player.inv = 60;

  if (n === 1) {
    // ============ NIVELL 1: EL DESERT I EL CASTELL!! 🏜️🏰 ============
    // IGUALET que l'esbós dibuixat a mà de l'Unai!
    // DESERT amb piràmide → PORTA del castell → corredor de punxes a dalt
    // + masmorra del tresor a baix → sala del boss → pati amb muntanya!
    LEVEL_END = 8600;
    flag.x = 8300; flag.y = 380;
    platforms.push(
      // ======== EL DESERT ========
      {x:0,    y:480, w:2750, h:60,  type:'sand'},
      {x:350,  y:430, w:170,  h:50,  type:'sand'},   // dunes
      {x:620,  y:390, w:150,  h:50,  type:'sand'},
      // LA PIRÀMIDE: puja-la pis a pis!
      {x:1150, y:420, w:750,  h:60,  type:'sand'},
      {x:1350, y:360, w:450,  h:60,  type:'sand'},
      {x:1550, y:300, w:200,  h:60,  type:'sand'},
      // sorra amb punxes — salta-la!!
      {x:2300, y:460, w:160,  h:20,  type:'spikes', hurt:true},
      // ======== EL MUR DEL CASTELL ========
      {x:2750, y:0,   w:60,   h:480, type:'tower'},

      // ======== EL CORREDOR DE PUNXES (a dalt, com el dibuix!) ========
      {x:2900, y:140, w:2700, h:30,  type:'tower'},  // sostre
      {x:2900, y:250, w:1400, h:24,  type:'tower'},  // terra part 1
      {x:4450, y:250, w:1150, h:24,  type:'tower'},  // terra part 2
      // (forat de 4300-4450: el POU en zigzag cap a la masmorra!)
      // punxes DEL TERRA del corredor
      {x:3450, y:230, w:140,  h:20,  type:'spikes', hurt:true},
      {x:4000, y:230, w:140,  h:20,  type:'spikes', hurt:true},
      {x:4900, y:230, w:140,  h:20,  type:'spikes', hurt:true},
      // punxes PENJADES del sostre
      {x:3150, y:170, w:150,  h:20,  type:'spikes', hurt:true, down:true},
      {x:4650, y:170, w:150,  h:20,  type:'spikes', hurt:true, down:true},
      {x:5350, y:170, w:150,  h:20,  type:'spikes', hurt:true, down:true},
      // graons en zigzag dins el pou
      {x:4310, y:350, w:80,   h:16,  type:'tower'},
      {x:4370, y:430, w:80,   h:16,  type:'tower'},
      // ======== LA MASMORRA DEL TRESOR (a baix del corredor!) ========
      {x:2810, y:480, w:2890, h:60,  type:'tower'},
      {x:2950, y:460, w:130,  h:20,  type:'spikes', hurt:true},
      {x:5450, y:460, w:130,  h:20,  type:'spikes', hurt:true},

      // ======== LA SALA DEL BOSS: LA CARA RODONA! 🗿 (dalt a la dreta) ========
      {x:5600, y:50,  w:1000, h:30,  type:'tower'},  // sostre
      {x:5600, y:50,  w:40,   h:120, type:'tower'},  // entrada: passa per sota!
      {x:5600, y:250, w:640,  h:24,  type:'tower'},  // terra
      {x:6600, y:50,  w:40,   h:430, type:'tower'},  // paret del fons
      // (forat de 6240-6600: després del boss CAUS al pati!)

      // ======== EL PATI-JARDÍ I LA MUNTANYA DE FLORS ========
      {x:6200, y:480, w:2400, h:60,  type:'ground'},
      {x:6800, y:420, w:800,  h:60,  type:'ground'},
      {x:7050, y:360, w:500,  h:60,  type:'ground'},
      {x:7300, y:300, w:250,  h:60,  type:'ground'},   // el cim!
      {x:7900, y:400, w:110,  h:20,  type:'cloud'},
      {x:8150, y:320, w:100,  h:20,  type:'cloud'},
    );
    // la porta vermella del castell — posa't a sobre i prem avall!
    doors.push({x: 2680, y: 390, w: 64, h: 90, tx: 2960, ty: 190});
    // EL DESERT: shys, cactus espinosos i voltors!
    shy(500, 30, 340, 'red'); shy(900, 780, 1130, 'blue');
    shy(1600, 1380, 1780, 'pink', 360); shy(2150, 1950, 2280, 'green');
    spikyAt(1000, 780, 1130); spikyAt(2000, 1910, 2280);
    fly(700, 400, 1000, 300); fly(1700, 1400, 2100, 240);
    mineAt(2000, 430);
    // EL CORREDOR DEL CASTELL: guàrdies entre les espines!
    shy(3300, 2910, 3440, 'blue', 250); shy(4200, 4150, 4290, 'red', 250);
    shy(4700, 4460, 4890, 'green', 250); shy(5150, 5050, 5590, 'pink', 250);
    spikyAt(3750, 3600, 3990, 250); spikyAt(5200, 5050, 5340, 250);
    // LA MASMORRA: el tresor ben custodiat!
    spikyAt(3200, 3100, 4200, 480); shy(3800, 3100, 4250, 'red', 480);
    spikyAt(4700, 4500, 5400, 480);
    mineAt(3500, 430); mineAt(5000, 430);
    // 🗿 EL BOSS DEL DIBUIX: LA CARA DE PEDRA!! vola i dispara!
    enemies.push({x:5900, y:120, baseY:120, w:96, h:96, vx:2.4, minX:5660, maxX:6480,
                  fly:true, boss:true, stone:true, hp:6, maxHp:6, hurt:0, alive:true, t:0});
    // EL PATI-JARDÍ
    shy(6500, 6250, 6790, 'green'); shy(7150, 6830, 7580, 'pink', 420); shy(7800, 7620, 8550, 'blue');
    fly(7000, 6700, 7800, 330);
    plantAt(6450); plantAt(7750);
    mineAt(8200, 430);
    heals.push({x:1630, y:240, taken:false}, {x:3600, y:400, taken:false}, {x:6450, y:160, taken:false});
    starPicks.push({x:1620, y:230, taken:false}, {x:4380, y:380, taken:false});
    pads.push({x:4385, y:464, w:36, h:21});   // trampolí de la masmorra: torna a pujar!
    pads.push({x:8450, y:464, w:36, h:21});   // bolet del pati
    // fruites i monedes — les cercoletes del dibuix!
    addFruitLine(150, 430, 4, 60, 'coin');      // desert
    addFruitLine(370, 390, 3, 55, 'apple');     // dunes
    addFruitLine(1200, 380, 4, 60, 'coin');     // la piràmide
    addFruitLine(1400, 320, 3, 60, 'coin');
    addFruitLine(1560, 250, 3, 55, 'melon');    // tresor del CIM de la piràmide!
    addFruitLine(2100, 430, 3, 60, 'coin');
    addFruitLine(3000, 200, 4, 55, 'coin');     // corredor del castell
    addFruitLine(3850, 200, 4, 55, 'coin');
    addFruitLine(4800, 200, 4, 55, 'coin');
    addFruitLine(3000, 430, 5, 70, 'coin');     // anell de monedes de la masmorra!
    addFruitLine(4000, 420, 3, 60, 'melon');    // les flors-tresor del dibuix!
    addFruitLine(4800, 430, 4, 65, 'coin');
    addFruitLine(5700, 170, 3, 55, 'coin');     // sala del boss
    addFruitLine(6300, 430, 4, 60, 'apple');    // pati
    addFruitLine(6850, 380, 4, 60, 'coin');     // muntanya de flors
    addFruitLine(7080, 320, 3, 60, 'coin');
    addFruitLine(7320, 260, 3, 55, 'melon');    // flors del cim!
    addFruitLine(7800, 430, 3, 60, 'grape');
    addFruitLine(8150, 430, 4, 60, 'coin');
    qblock(500, 330); qblock(3300, 190); qblock(5300, 190); qblock(6700, 380); qblock(7400, 220);
  } else if (n === 2) {
    // ============ NIVELL 2: DINS EL CASTELL! ============
    LEVEL_END = 4300;
    flag.x = 4150; flag.y = 380;
    platforms.push(
      // terra de pedra amb FORATS DE LAVA!
      {x:0,    y:480, w:700,  h:60,  type:'rock'},
      {x:760,  y:480, w:400,  h:60,  type:'rock'},
      {x:1220, y:480, w:500,  h:60,  type:'rock'},
      {x:1780, y:480, w:420,  h:60,  type:'rock'},
      {x:2260, y:480, w:600,  h:60,  type:'rock'},
      {x:2920, y:480, w:500,  h:60,  type:'rock'},
      {x:3480, y:480, w:700,  h:60,  type:'rock'},
      // plataformes de pedra flotants
      {x:300,  y:370, w:100, h:20,  type:'rock'},
      {x:520,  y:290, w:100, h:20,  type:'rock'},
      {x:850,  y:360, w:110, h:20,  type:'rock'},
      {x:1300, y:350, w:110, h:20,  type:'rock'},
      {x:1500, y:270, w:100, h:20,  type:'rock'},
      {x:1850, y:340, w:110, h:20,  type:'rock'},
      {x:2300, y:360, w:120, h:20,  type:'rock'},
      {x:2500, y:280, w:110, h:20,  type:'rock'},
      {x:2700, y:220, w:100, h:20,  type:'rock'},
      {x:3000, y:340, w:110, h:20,  type:'rock'},
      {x:3250, y:270, w:110, h:20,  type:'rock'},
      {x:3600, y:350, w:120, h:20,  type:'rock'},
      // plataformes mòbils sobre la lava!!
      {x:1030, y:350, w:90, h:20, type:'cloud', move:true, baseY:350, amp:60, speed:0.03, phase:0},
      {x:2050, y:340, w:90, h:20, type:'cloud', move:true, baseY:340, amp:70, speed:0.028, phase:1},
    );
    shy(500, 60, 660, 'blue');   shy(900, 780, 1140, 'red');
    shy(1400, 1240, 1700, 'green'); shy(2000, 1800, 2180, 'pink');
    shy(2500, 2280, 2840, 'blue');  shy(3100, 2940, 3400, 'red');
    fly(400, 100, 800, 260);    fly(1600, 1300, 1900, 240);
    fly(2400, 2200, 2800, 280); fly(3100, 2900, 3500, 250);
    mineAt(730, 400); mineAt(1750, 400); mineAt(2220, 400); mineAt(2880, 390);
    plantAt(1100); plantAt(2650); plantAt(3350);
    heals.push({x: 2400, y: 300, taken: false});
    starPicks.push({x: 1550, y: 220, taken: false});
    pads.push({x: 650, y: 464, w: 36, h: 21});
    addFruitLine(200, 420, 4, 55, 'apple');
    addFruitLine(820, 420, 3, 55, 'apple');
    addFruitLine(1250, 420, 3, 55, 'grape');
    addFruitLine(1900, 420, 3, 55, 'apple');
    addFruitLine(2320, 320, 2, 60, 'apple');
    addFruitLine(2520, 240, 1, 0, 'melon');
    addFruitLine(3000, 300, 2, 60, 'apple');
    addFruitLine(3300, 230, 1, 0, 'melon');
    addFruitLine(3550, 420, 4, 60, 'apple');
    addFruitLine(400, 420, 3, 45, 'coin');
    addFruitLine(1350, 300, 3, 45, 'coin');
    addFruitLine(2950, 420, 3, 45, 'coin');
    // blocs "?" i pinxos al castell!
    qblock(1450, 300); qblock(3100, 300);
    spikyAt(1500, 1240, 1700); spikyAt(2700, 2280, 2840);
    // ===== EL BOSS: SHY GUY GEGEGANT! 3 cops amb ou! DISPARA FOC! =====
    enemies.push({x: 3750, y: 480 - 84, w: 72, h: 84, vx: 1.5, minX: 3520, maxX: 4040,
                  color: 'red', boss: true, hp: 3, hurt: 0, alive: true});
  } else if (n === 3) {
    // ============ NIVELL 3: L'ESPAI DE NIT! ============
    LEVEL_END = 6700;
    flag.x = 6560; flag.y = 320;
    platforms.push(
      // illes de meteorits flotant al cel!
      {x:0,    y:430, w:300, h:60, type:'rock'},
      {x:380,  y:380, w:180, h:40, type:'rock'},
      {x:640,  y:440, w:220, h:60, type:'rock'},
      {x:950,  y:360, w:160, h:40, type:'rock'},
      {x:1200, y:430, w:260, h:60, type:'rock'},
      {x:1550, y:350, w:140, h:40, type:'rock'},
      {x:1780, y:420, w:240, h:50, type:'rock'},
      {x:2100, y:330, w:160, h:40, type:'rock'},
      {x:2350, y:440, w:280, h:60, type:'rock'},
      {x:2700, y:370, w:160, h:40, type:'rock'},
      {x:2950, y:430, w:200, h:50, type:'rock'},
      {x:3220, y:350, w:150, h:40, type:'rock'},
      {x:3450, y:430, w:260, h:60, type:'rock'},
      {x:3780, y:360, w:160, h:40, type:'rock'},
      {x:4050, y:430, w:240, h:60, type:'rock'},
      {x:4380, y:340, w:150, h:40, type:'rock'},
      {x:4600, y:420, w:220, h:50, type:'rock'},
      {x:4900, y:350, w:150, h:40, type:'rock'},
      {x:5150, y:430, w:280, h:60, type:'rock'},
      {x:5500, y:360, w:160, h:40, type:'rock'},
      {x:5750, y:430, w:200, h:50, type:'rock'},
      {x:6050, y:380, w:320, h:60, type:'rock'},   // zona del BOSS
      {x:6450, y:420, w:230, h:50, type:'rock'},   // illa de la bandera
      // núvols mòbils espacials
      {x:900,  y:300, w:80, h:20, type:'cloud', move:true, baseY:300, amp:50, speed:0.03, phase:0},
      {x:2400, y:280, w:80, h:20, type:'cloud', move:true, baseY:280, amp:60, speed:0.026, phase:1},
      {x:4350, y:300, w:80, h:20, type:'cloud', move:true, baseY:300, amp:55, speed:0.032, phase:2},
      {x:5650, y:300, w:80, h:20, type:'cloud', move:true, baseY:300, amp:60, speed:0.028, phase:0.5},
    );
    shy(700, 660, 830, 'blue', 440);  shy(1250, 1220, 1430, 'green', 430);
    shy(1900, 1800, 2000, 'red', 420); shy(2500, 2370, 2610, 'pink', 440);
    shy(3050, 2970, 3130, 'blue', 430); shy(3600, 3470, 3690, 'green', 430);
    shy(4150, 4070, 4270, 'red', 430); shy(4750, 4620, 4800, 'pink', 420);
    shy(5250, 5170, 5410, 'blue', 430); shy(5850, 5770, 5930, 'green', 430);
    fly(400, 320, 600, 250);   fly(1000, 900, 1180, 260);
    fly(1650, 1500, 1900, 270); fly(2200, 2050, 2400, 260);
    fly(2800, 2650, 3050, 280); fly(3350, 3200, 3550, 270);
    fly(3900, 3750, 4100, 280); fly(4450, 4300, 4650, 260);
    fly(5050, 4900, 5200, 270); fly(5600, 5450, 5800, 260);
    mineAt(600, 340); mineAt(1480, 380); mineAt(2050, 390); mineAt(2650, 350);
    mineAt(3200, 400); mineAt(3750, 390); mineAt(4320, 380); mineAt(4870, 360);
    mineAt(5450, 390); mineAt(6000, 330);
    plantAt(1250, 430); plantAt(5200, 430);
    heals.push({x: 2300, y: 260, taken: false}, {x: 4500, y: 270, taken: false});
    starPicks.push({x: 1600, y: 300, taken: false}, {x: 4950, y: 290, taken: false});
    pads.push({x: 700, y: 424, w: 36, h: 21}, {x: 3100, y: 414, w: 36, h: 21}, {x: 5530, y: 344, w: 36, h: 21});
    addFruitLine(60, 370, 3, 55, 'apple');
    addFruitLine(400, 330, 2, 55, 'apple');
    addFruitLine(980, 310, 2, 55, 'grape');
    addFruitLine(1240, 370, 3, 55, 'apple');
    addFruitLine(1570, 300, 1, 0, 'melon');
    addFruitLine(1800, 360, 3, 55, 'apple');
    addFruitLine(2130, 280, 2, 55, 'grape');
    addFruitLine(2400, 380, 3, 55, 'apple');
    addFruitLine(2730, 320, 1, 0, 'melon');
    addFruitLine(2980, 370, 2, 55, 'apple');
    addFruitLine(3250, 300, 2, 55, 'apple');
    addFruitLine(3500, 370, 3, 55, 'grape');
    addFruitLine(3800, 310, 1, 0, 'melon');
    addFruitLine(4080, 370, 3, 55, 'apple');
    addFruitLine(4410, 290, 2, 55, 'apple');
    addFruitLine(4630, 360, 2, 55, 'grape');
    addFruitLine(4930, 300, 1, 0, 'melon');
    addFruitLine(5200, 370, 3, 55, 'apple');
    addFruitLine(5530, 310, 2, 55, 'apple');
    addFruitLine(5780, 370, 3, 55, 'grape');
    addFruitLine(6100, 320, 4, 60, 'apple');
    addFruitLine(6480, 360, 3, 55, 'apple');
    addFruitLine(700, 390, 3, 45, 'coin');
    addFruitLine(2000, 380, 3, 45, 'coin');
    addFruitLine(3700, 380, 3, 45, 'coin');
    addFruitLine(5300, 380, 3, 45, 'coin');
    // blocs "?" espacials i pinxos!
    qblock(1250, 320); qblock(4600, 330); qblock(5800, 340);
    spikyAt(4200, 4070, 4270, 430);
    // ===== BOSS ESPACIAL: L'ALIEN GEGANT! 4 cops! DISPARA FOC! =====
    enemies.push({x: 6150, y: 300, baseY: 300, w: 66, h: 60, vx: 2, minX: 6060, maxX: 6480,
                  color: 'red', fly: true, boss: true, alien: true, hp: 4, hurt: 0, alive: true, t: 0});
  } else if (n === 4) {
    // ============ NIVELL 4: EL CASTELL DE GLOBUS!! TOT REBOTA! ============
    LEVEL_END = 6200;
    flag.x = 6010; flag.y = 320;
    platforms.push(
      // el terra sencer són GLOBUS — TOT ÉS UN TRAMPOLÍ!!
      {x:0,    y:470, w:520, h:60, type:'balloon'},
      {x:580,  y:470, w:360, h:60, type:'balloon'},
      {x:1000, y:470, w:300, h:60, type:'balloon'},
      {x:1360, y:470, w:420, h:60, type:'balloon'},
      {x:1840, y:470, w:320, h:60, type:'balloon'},
      {x:2220, y:470, w:380, h:60, type:'balloon'},
      {x:2660, y:470, w:300, h:60, type:'balloon'},
      {x:3020, y:470, w:400, h:60, type:'balloon'},
      {x:3480, y:470, w:320, h:60, type:'balloon'},
      {x:3860, y:470, w:360, h:60, type:'balloon'},
      {x:4280, y:470, w:320, h:60, type:'balloon'},
      {x:4660, y:470, w:300, h:60, type:'balloon'},
      {x:5020, y:470, w:340, h:60, type:'balloon'},
      // globus petits flotant amunt i avall!
      {x:400,  y:350, w:110, h:45, type:'balloon'},
      {x:720,  y:280, w:100, h:45, type:'balloon'},
      {x:1100, y:340, w:120, h:45, type:'balloon'},
      {x:1500, y:270, w:100, h:45, type:'balloon'},
      {x:1950, y:350, w:110, h:45, type:'balloon'},
      {x:2350, y:280, w:110, h:45, type:'balloon'},
      {x:2780, y:350, w:120, h:45, type:'balloon'},
      {x:3150, y:270, w:100, h:45, type:'balloon'},
      {x:3550, y:350, w:110, h:45, type:'balloon'},
      {x:3980, y:280, w:110, h:45, type:'balloon'},
      {x:4380, y:350, w:120, h:45, type:'balloon'},
      {x:4780, y:270, w:100, h:45, type:'balloon'},
      {x:5100, y:340, w:110, h:45, type:'balloon'},
      // el castell de globus: torres de globus apilats!!
      {x:5420, y:400, w:150, h:50, type:'balloon'},
      {x:5440, y:300, w:110, h:40, type:'balloon'},
      {x:5620, y:420, w:280, h:60, type:'balloon'},   // zona del BOSS
      {x:5940, y:420, w:240, h:60, type:'balloon'},   // illa de la bandera
      // globus que es mouen sols!
      {x:1650, y:330, w:90, h:40, type:'balloon', move:true, baseY:330, amp:60, speed:0.03, phase:0},
      {x:3350, y:300, w:90, h:40, type:'balloon', move:true, baseY:300, amp:70, speed:0.026, phase:1},
      {x:4600, y:300, w:90, h:40, type:'balloon', move:true, baseY:300, amp:55, speed:0.032, phase:2},
    );
    shy(700, 590, 930, 'pink', 470);   shy(1500, 1370, 1770, 'blue', 470);
    shy(2350, 2230, 2590, 'green', 470); shy(3150, 3030, 3410, 'red', 470);
    shy(3980, 3870, 4210, 'pink', 470);  shy(4750, 4670, 4950, 'blue', 470);
    spikyAt(2000, 1850, 2150, 470);
    fly(500, 420, 900, 240);   fly(1400, 1200, 1750, 250);
    fly(2550, 2350, 2950, 250); fly(3650, 3450, 4150, 240);
    fly(4500, 4300, 4900, 250); fly(5100, 4950, 5350, 240);
    plantAt(1050, 470); plantAt(4300, 470);
    mineAt(560, 400); mineAt(1800, 400); mineAt(2600, 400);
    mineAt(3800, 380); mineAt(4980, 400);
    heals.push({x: 1600, y: 220, taken: false}, {x: 4800, y: 220, taken: false});
    starPicks.push({x: 800, y: 230, taken: false}, {x: 4000, y: 230, taken: false});
    addFruitLine(620, 410, 3, 55, 'apple');  addFruitLine(1100, 280, 2, 55, 'grape');
    addFruitLine(1550, 220, 2, 55, 'apple'); addFruitLine(2000, 300, 3, 55, 'apple');
    addFruitLine(2400, 230, 1, 0, 'melon');  addFruitLine(2800, 300, 3, 55, 'apple');
    addFruitLine(3200, 220, 2, 55, 'grape'); addFruitLine(3600, 300, 3, 55, 'apple');
    addFruitLine(4050, 230, 1, 0, 'melon');  addFruitLine(4450, 300, 3, 55, 'apple');
    addFruitLine(4800, 220, 2, 55, 'grape'); addFruitLine(5150, 300, 3, 55, 'apple');
    addFruitLine(5680, 360, 4, 55, 'coin');  addFruitLine(6000, 350, 3, 55, 'coin');
    addFruitLine(1450, 400, 3, 45, 'coin');  addFruitLine(3050, 400, 3, 45, 'coin');
    addFruitLine(4500, 400, 3, 45, 'coin');
    qblock(1150, 300); qblock(2850, 310); qblock(4800, 230);
    // ===== EL BOSS FINAL: EL GLOBUS GEGANT!!! 5 cops d'ou! =====
    enemies.push({x: 5650, y: 250, baseY: 250, w: 90, h: 110, vx: 2.2, minX: 5430, maxX: 5880,
                  color: 'red', fly: true, boss: true, balloon: true, hp: 5, hurt: 0, alive: true, t: 0});
  } else if (n === 5) {
    // ============ NIVELL 5: EL RIU DE XOCOLATA!! 🍫 ============
    LEVEL_END = 6900;
    flag.x = 6620; flag.y = 310;
    platforms.push(
      // ---- EL RIU: rajoles de xocolata sobre la llenega dolça ----
      {x:0,    y:440, w:300, h:60, type:'choco'},
      {x:380,  y:380, w:160, h:45, type:'choco'},
      {x:620,  y:430, w:180, h:45, type:'choco'},
      {x:880,  y:360, w:150, h:45, type:'choco'},
      {x:1120, y:420, w:200, h:45, type:'choco'},
      {x:1420, y:350, w:140, h:45, type:'choco'},
      {x:1650, y:420, w:220, h:45, type:'choco'},
      {x:1980, y:360, w:160, h:45, type:'choco'},
      {x:2240, y:430, w:200, h:45, type:'choco'},
      {x:2540, y:350, w:150, h:45, type:'choco'},
      {x:2790, y:410, w:200, h:45, type:'choco'},
      {x:3090, y:350, w:160, h:45, type:'choco'},
      {x:3310, y:420, w:170, h:45, type:'choco'},
      // ---- LES MINES DE XOCOLATA ----
      {x:3400, y:0,   w:3500, h:110, type:'rock'},   // el sostre de la mina!
      {x:3560, y:420, w:220, h:50, type:'choco'},
      {x:3850, y:360, w:160, h:45, type:'choco'},
      {x:4080, y:430, w:200, h:50, type:'choco'},
      {x:4350, y:350, w:150, h:45, type:'choco'},
      {x:4600, y:420, w:220, h:50, type:'choco'},
      {x:4900, y:360, w:160, h:45, type:'choco'},
      {x:5150, y:430, w:240, h:50, type:'choco'},
      {x:5470, y:350, w:150, h:45, type:'choco'},
      {x:5720, y:420, w:200, h:50, type:'choco'},
      {x:6000, y:360, w:180, h:45, type:'choco'},
      {x:6260, y:430, w:240, h:50, type:'choco'},
      {x:6560, y:410, w:240, h:55, type:'choco'},   // l'illa de la bandera!
      // rajoles de xocolata que es mouen soles!
      {x:1000, y:300, w:90, h:35, type:'choco', move:true, baseY:300, amp:50, speed:0.03, phase:0},
      {x:2900, y:280, w:90, h:35, type:'choco', move:true, baseY:280, amp:60, speed:0.026, phase:1},
      {x:4500, y:290, w:90, h:35, type:'choco', move:true, baseY:290, amp:50, speed:0.03, phase:2},
      {x:5900, y:280, w:90, h:35, type:'choco', move:true, baseY:280, amp:55, speed:0.027, phase:0.5},
    );
    shy(1150, 1125, 1310, 'red', 420);    shy(1700, 1660, 1860, 'blue', 420);
    shy(2280, 2250, 2430, 'green', 430);  shy(2820, 2800, 2980, 'pink', 410);
    shy(3600, 3570, 3770, 'blue', 420);   shy(4150, 4090, 4270, 'red', 430);
    shy(4650, 4610, 4810, 'green', 420);  shy(5200, 5160, 5380, 'pink', 430);
    shy(5760, 5730, 5910, 'blue', 420);   shy(6300, 6270, 6490, 'red', 430);
    spikyAt(1250, 1130, 1310, 420);  spikyAt(5200, 5160, 5380, 430);
    fly(500, 380, 780, 240);   fly(1100, 900, 1350, 250);
    fly(2000, 1800, 2200, 240); fly(2500, 2350, 2750, 250);
    fly(3900, 3600, 4050, 240); fly(4800, 4600, 5150, 250);
    fly(5600, 5450, 5950, 240); fly(6200, 6000, 6500, 250);
    plantAt(1650, 420); plantAt(4600, 420); plantAt(6260, 430);
    mineAt(860, 320); mineAt(1900, 360); mineAt(2450, 380); mineAt(3000, 310);
    mineAt(4300, 330); mineAt(5550, 310); mineAt(6400, 330);
    heals.push({x: 2550, y: 290, taken: false}, {x: 5750, y: 370, taken: false});
    starPicks.push({x: 1430, y: 300, taken: false}, {x: 4920, y: 310, taken: false});
    addFruitLine(400, 330, 3, 55, 'apple');  addFruitLine(900, 310, 2, 55, 'grape');
    addFruitLine(1150, 370, 3, 55, 'apple'); addFruitLine(1450, 300, 2, 55, 'apple');
    addFruitLine(1680, 370, 3, 55, 'apple'); addFruitLine(2000, 310, 1, 0, 'melon');
    addFruitLine(2270, 380, 3, 55, 'grape'); addFruitLine(2560, 300, 2, 55, 'apple');
    addFruitLine(2820, 360, 3, 55, 'apple'); addFruitLine(3120, 300, 2, 55, 'grape');
    addFruitLine(3600, 370, 3, 55, 'apple'); addFruitLine(3900, 310, 2, 55, 'apple');
    addFruitLine(4110, 380, 3, 55, 'grape'); addFruitLine(4370, 300, 1, 0, 'melon');
    addFruitLine(4630, 370, 3, 55, 'apple'); addFruitLine(4930, 310, 2, 55, 'apple');
    addFruitLine(5180, 380, 3, 55, 'apple'); addFruitLine(5500, 300, 2, 55, 'grape');
    addFruitLine(5750, 370, 3, 55, 'apple'); addFruitLine(6030, 310, 1, 0, 'melon');
    addFruitLine(6300, 380, 3, 55, 'apple'); addFruitLine(6600, 350, 4, 55, 'coin');
    addFruitLine(700, 380, 3, 45, 'coin');   addFruitLine(2100, 380, 3, 45, 'coin');
    addFruitLine(3400, 380, 3, 45, 'coin');  addFruitLine(4700, 380, 3, 45, 'coin');
    addFruitLine(6100, 380, 3, 45, 'coin');
    qblock(900, 300); qblock(2800, 350); qblock(4300, 300); qblock(5900, 320);
    // SENSE BOSS: només arribar a la bandera!!
  } else if (n === 6) {
    // ============ NIVELL 6: EL LABERINT DE TUBERIES!! 💩 ============
    // SÚPER LLARG i MOLT DIFÍCIL: un laberint de canonades!
    LEVEL_END = 9500;
    flag.x = 9360; flag.y = 370;
    platforms.push(
      // el sostre de la canonada (va de cap a cap!)
      {x:0,    y:0,   w:9600, h:80,  type:'pipec'},
      // el terra amb forats d'aigua pudent
      {x:0,    y:470, w:700,  h:70, type:'pipec'},
      {x:780,  y:470, w:420,  h:70, type:'pipec'},
      {x:1280, y:470, w:420,  h:70, type:'pipec'},
      {x:1780, y:470, w:420,  h:70, type:'pipec'},
      {x:2280, y:470, w:420,  h:70, type:'pipec'},
      {x:2780, y:470, w:520,  h:70, type:'pipec'},
      {x:3380, y:470, w:520,  h:70, type:'pipec'},
      {x:3980, y:470, w:520,  h:70, type:'pipec'},
      {x:4580, y:470, w:520,  h:70, type:'pipec'},
      {x:5180, y:470, w:420,  h:70, type:'pipec'},
      {x:5680, y:470, w:420,  h:70, type:'pipec'},
      {x:6180, y:470, w:420,  h:70, type:'pipec'},
      {x:6680, y:470, w:420,  h:70, type:'pipec'},
      {x:7180, y:470, w:520,  h:70, type:'pipec'},
      {x:7780, y:470, w:520,  h:70, type:'pipec'},
      {x:8380, y:470, w:220,  h:70, type:'pipec'},
      {x:8660, y:470, w:560,  h:70, type:'pipec'},   // L'ARENA DEL BOSS!
      {x:9280, y:470, w:220,  h:70, type:'pipec'},   // la bandera
      // === LABERINT PART 1: l'slalom! parets alternes de dalt i de baix ===
      {x:900,  y:80,  w:60, h:290, type:'pipec'},
      {x:1150, y:80,  w:60, h:290, type:'pipec'},
      {x:1500, y:80,  w:60, h:290, type:'pipec'},
      {x:1900, y:80,  w:60, h:290, type:'pipec'},
      {x:2200, y:80,  w:60, h:290, type:'pipec'},
      {x:1020, y:300, w:60, h:170, type:'pipec'},
      {x:1600, y:200, w:60, h:270, type:'pipec'},
      {x:2050, y:200, w:60, h:270, type:'pipec'},
      // === LABERINT PART 2: DOS PISOS! el passadis de dalt i el de baix ===
      {x:2400, y:250, w:500, h:30, type:'pipec'},
      {x:2980, y:250, w:500, h:30, type:'pipec'},
      {x:3560, y:250, w:500, h:30, type:'pipec'},
      {x:4140, y:250, w:360, h:30, type:'pipec'},
      {x:4580, y:250, w:520, h:30, type:'pipec'},
      // cambretes del pis de dalt (sostre propi, entrada pel forat!)
      {x:2400, y:170, w:60,  h:80, type:'pipec'},
      {x:3300, y:170, w:60,  h:80, type:'pipec'},
      {x:4700, y:170, w:60,  h:80, type:'pipec'},
      // === LABERINT PART 3: les xemeneies! forats estrets de vol difícil ===
      {x:5300, y:140, w:60, h:330, type:'pipec'},
      {x:5600, y:80,  w:60, h:310, type:'pipec'},
      {x:5900, y:140, w:60, h:330, type:'pipec'},
      {x:6200, y:80,  w:60, h:310, type:'pipec'},
      {x:6500, y:140, w:60, h:330, type:'pipec'},
      {x:6800, y:80,  w:60, h:310, type:'pipec'},
      // === LABERINT PART 4: el passadis estret! ===
      {x:7300, y:80,  w:60, h:330, type:'pipec'},
      {x:7550, y:170, w:60, h:300, type:'pipec'},
      {x:7900, y:80,  w:60, h:330, type:'pipec'},
      {x:8150, y:170, w:60, h:300, type:'pipec'},
      // l'entrada a l'arena del boss
      {x:8600, y:80,  w:60, h:300, type:'pipec'},
      // canonades que es mouen (et porten!)
      {x:2850, y:350, w:100, h:35, type:'pipec', move:true, baseY:350, amp:60, speed:0.03, phase:0},
      {x:3900, y:350, w:100, h:35, type:'pipec', move:true, baseY:350, amp:60, speed:0.026, phase:1},
      {x:6100, y:320, w:100, h:35, type:'pipec', move:true, baseY:320, amp:55, speed:0.032, phase:2},
      {x:7700, y:300, w:100, h:35, type:'pipec', move:true, baseY:300, amp:60, speed:0.028, phase:0.5},
      // canonadetes per saltar
      {x:440,  y:330, w:120, h:40, type:'pipec'},
      {x:8800, y:350, w:120, h:40, type:'pipec'},
      {x:9300, y:330, w:110, h:40, type:'pipec'},
    );
    // NOMÉS PEIXOS I CAQUETES — i en VAN MOLTS perquè és molt difícil!
    fishAt(650, 580, 990, 300);    fishAt(1150, 1080, 1400, 380);
    fishAt(1350, 1290, 1690, 300); fishAt(1850, 1790, 2190, 380);
    fishAt(2150, 2050, 2260, 300); fishAt(2500, 2420, 2890, 170);
    fishAt(2600, 2790, 3290, 380); fishAt(3100, 3000, 3470, 170);
    fishAt(3400, 3310, 3890, 380); fishAt(3700, 3570, 4130, 170);
    fishAt(4000, 3910, 4490, 380); fishAt(4300, 4150, 4570, 170);
    fishAt(4650, 4590, 5170, 380); fishAt(4900, 4590, 5170, 170);
    fishAt(5300, 5190, 5670, 300); fishAt(5750, 5690, 6170, 330);
    fishAt(6200, 6190, 6670, 300); fishAt(6650, 6690, 7170, 330);
    fishAt(7250, 7190, 7690, 300); fishAt(7800, 7790, 8290, 330);
    fishAt(8300, 8310, 8590, 350); fishAt(9000, 8850, 9210, 330);
    poopAt(700, 580, 990, 470);    poopAt(1150, 1080, 1490, 470);
    poopAt(1350, 1290, 1690, 470); poopAt(1850, 1790, 2190, 470);
    poopAt(2150, 2050, 2260, 470); poopAt(2900, 2790, 3290, 470);
    poopAt(3500, 3390, 3890, 470); poopAt(4100, 3990, 4490, 470);
    poopAt(4700, 4590, 5090, 470); poopAt(5300, 5190, 5590, 470);
    poopAt(5800, 5690, 6090, 470); poopAt(6300, 6190, 6590, 470);
    poopAt(6800, 6690, 7090, 470); poopAt(7300, 7190, 7690, 470);
    poopAt(7900, 7790, 8290, 470); poopAt(8450, 8390, 8590, 470);
    // regals amagats pel laberint!
    heals.push({x: 2430, y: 190, taken: false}, {x: 4170, y: 190, taken: false},
               {x: 7600, y: 380, taken: false});
    starPicks.push({x: 3330, y: 190, taken: false}, {x: 5700, y: 380, taken: false},
                    {x: 8750, y: 380, taken: false});
    addFruitLine(620, 420, 3, 55, 'apple');  addFruitLine(1200, 420, 3, 55, 'apple');
    addFruitLine(1700, 420, 3, 55, 'grape'); addFruitLine(2500, 200, 4, 55, 'apple');
    addFruitLine(2900, 420, 3, 55, 'apple'); addFruitLine(3400, 200, 4, 55, 'grape');
    addFruitLine(3900, 420, 3, 55, 'apple'); addFruitLine(4300, 200, 4, 55, 'apple');
    addFruitLine(4700, 420, 3, 55, 'apple'); addFruitLine(4750, 200, 3, 55, 'apple');
    addFruitLine(5300, 420, 3, 55, 'coin');  addFruitLine(5800, 420, 3, 55, 'grape');
    addFruitLine(6300, 420, 3, 55, 'apple'); addFruitLine(6800, 420, 3, 55, 'apple');
    addFruitLine(7300, 420, 3, 55, 'coin');  addFruitLine(7900, 420, 3, 55, 'apple');
    addFruitLine(8700, 420, 4, 55, 'coin');  addFruitLine(9300, 420, 3, 55, 'apple');
    addFruitLine(2650, 420, 1, 0, 'melon');  addFruitLine(5500, 200, 1, 0, 'melon');
    qblock(640, 300); qblock(3050, 320); qblock(4650, 320); qblock(6400, 300); qblock(9350, 290);
    // ===== EL BOSS: LA CACA GEGANT!!! 💩 OBLIGATORI abans de la bandera! =====
    enemies.push({x: 8850, y: 470 - 100, w: 80, h: 100, vx: 1.5, minX: 8680, maxX: 9160,
                  color: 'red', boss: true, poop: true, hp: 5, hurt: 0, alive: true});
  } else if (n === 7) {
    // ============ NIVELL 7: LA SELVA!! 🌴 vista a l'horitzó ============
    LEVEL_END = 5600;
    flag.x = 5420; flag.y = 380;
    platforms.push(
      {x:0,    y:480, w:600,  h:60,  type:'ground'},
      {x:680,  y:480, w:300,  h:60,  type:'ground'},
      {x:1050, y:480, w:500,  h:60,  type:'ground'},
      {x:1650, y:480, w:300,  h:60,  type:'ground'},
      {x:2050, y:480, w:350,  h:60,  type:'ground'},
      {x:2500, y:480, w:300,  h:60,  type:'ground'},
      {x:2900, y:480, w:400,  h:60,  type:'ground'},
      {x:3400, y:480, w:300,  h:60,  type:'ground'},
      {x:3800, y:480, w:350,  h:60,  type:'ground'},
      {x:4250, y:480, w:350,  h:60,  type:'ground'},
      {x:4700, y:480, w:300,  h:60,  type:'ground'},
      {x:5100, y:480, w:450,  h:60,  type:'ground'},
      // branques per pujar als arbres!
      {x:400,  y:380, w:110, h:20, type:'cloud'},
      {x:620,  y:300, w:100, h:20, type:'cloud'},
      {x:900,  y:360, w:120, h:20, type:'cloud'},
      {x:1250, y:300, w:110, h:20, type:'cloud'},
      {x:1500, y:370, w:120, h:20, type:'cloud'},
      {x:1850, y:310, w:100, h:20, type:'cloud'},
      {x:2200, y:360, w:110, h:20, type:'cloud'},
      {x:2550, y:290, w:110, h:20, type:'cloud'},
      {x:2900, y:360, w:120, h:20, type:'cloud'},
      {x:3250, y:290, w:110, h:20, type:'cloud'},
      {x:3600, y:360, w:110, h:20, type:'cloud'},
      {x:3950, y:300, w:120, h:20, type:'cloud'},
      {x:4300, y:370, w:110, h:20, type:'cloud'},
      {x:4650, y:300, w:110, h:20, type:'cloud'},
      {x:4950, y:360, w:120, h:20, type:'cloud'},
      // núvols mòbils entre els arbres
      {x:1100, y:320, w:90, h:20, type:'cloud', move:true, baseY:320, amp:70, speed:0.03, phase:0},
      {x:2700, y:300, w:90, h:20, type:'cloud', move:true, baseY:300, amp:80, speed:0.026, phase:1},
      {x:4400, y:310, w:90, h:20, type:'cloud', move:true, baseY:310, amp:65, speed:0.032, phase:2},
    );
    // LA SELVA ESTA PLENA DE PLANTES PIRAÑA!!
    plantAt(700, 480);  plantAt(1200, 480); plantAt(1700, 480);
    plantAt(2150, 480); plantAt(2600, 480); plantAt(3050, 480);
    plantAt(3550, 480); plantAt(4000, 480); plantAt(4500, 480);
    plantAt(4900, 480); plantAt(5250, 480);
    // Shy Guys i Fly Guys de la selva
    shy(800, 690, 970, 'green', 480);   shy(1300, 1060, 1540, 'red', 480);
    shy(1800, 1660, 1940, 'pink', 480); shy(2300, 2060, 2390, 'green', 480);
    shy(2650, 2510, 2790, 'blue', 480); shy(3100, 2910, 3290, 'red', 480);
    shy(3600, 3410, 3690, 'pink', 480); shy(4000, 3810, 4140, 'green', 480);
    shy(4450, 4260, 4590, 'blue', 480); shy(5300, 5110, 5540, 'red', 480);
    fly(500, 350, 950, 260);   fly(1400, 1200, 1600, 250);
    fly(2100, 1960, 2450, 270); fly(2850, 2650, 3350, 260);
    fly(3700, 3500, 4150, 270); fly(4500, 4300, 4950, 250);
    fly(5100, 5000, 5450, 270);
    spikyAt(1100, 1060, 1540, 480); spikyAt(3900, 3810, 4140, 480);
    mineAt(600, 340); mineAt(2400, 330); mineAt(4200, 340);
    heals.push({x: 1900, y: 260, taken: false}, {x: 4200, y: 300, taken: false});
    starPicks.push({x: 1300, y: 250, taken: false}, {x: 3600, y: 310, taken: false});
    pads.push({x: 560, y: 464, w: 36, h: 21}, {x: 2450, y: 464, w: 36, h: 21}, {x: 4350, y: 464, w: 36, h: 21});
    addFruitLine(420, 330, 3, 55, 'apple');  addFruitLine(700, 250, 3, 55, 'grape');
    addFruitLine(920, 310, 3, 55, 'apple');  addFruitLine(1280, 250, 2, 55, 'apple');
    addFruitLine(1530, 320, 3, 55, 'apple'); addFruitLine(1880, 260, 1, 0, 'melon');
    addFruitLine(2230, 310, 3, 55, 'grape'); addFruitLine(2580, 240, 2, 55, 'apple');
    addFruitLine(2930, 310, 3, 55, 'apple'); addFruitLine(3280, 240, 2, 55, 'apple');
    addFruitLine(3630, 310, 3, 55, 'grape'); addFruitLine(3980, 250, 2, 55, 'apple');
    addFruitLine(4330, 320, 1, 0, 'melon');  addFruitLine(4680, 250, 3, 55, 'apple');
    addFruitLine(5000, 310, 3, 55, 'apple'); addFruitLine(5300, 400, 4, 55, 'coin');
    addFruitLine(1000, 400, 3, 45, 'coin');  addFruitLine(2000, 400, 3, 45, 'coin');
    addFruitLine(3300, 400, 3, 45, 'coin');  addFruitLine(4600, 400, 3, 45, 'coin');
    qblock(950, 320); qblock(2300, 320); qblock(3700, 320); qblock(4800, 320);
    // SENSE BOSS: la selva és el premi final!
  } else if (n === 8) {
    // ============ NIVELL 8: EL CASTELL ELÈCTRIC I MECÀNIC!! ⚡🐉 ============
    // MOLT LLARG! engranatges, cables i espurnes per tot arreu!
    LEVEL_END = 8800;
    flag.x = 8650; flag.y = 380;
    platforms.push(
      // passadissos metàl·lics amb forats!
      {x:0,    y:480, w:500,  h:60, type:'metal'},
      {x:580,  y:480, w:320,  h:60, type:'metal'},
      {x:1000, y:480, w:350,  h:60, type:'metal'},
      {x:1450, y:480, w:350,  h:60, type:'metal'},
      {x:1900, y:480, w:350,  h:60, type:'metal'},
      {x:2350, y:480, w:350,  h:60, type:'metal'},
      {x:2800, y:480, w:300,  h:60, type:'metal'},
      {x:3200, y:480, w:300,  h:60, type:'metal'},
      {x:3600, y:480, w:350,  h:60, type:'metal'},
      {x:4050, y:480, w:350,  h:60, type:'metal'},
      {x:4500, y:480, w:300,  h:60, type:'metal'},
      {x:4900, y:480, w:350,  h:60, type:'metal'},
      {x:5350, y:480, w:350,  h:60, type:'metal'},
      {x:5800, y:480, w:350,  h:60, type:'metal'},
      {x:6250, y:480, w:300,  h:60, type:'metal'},
      {x:6650, y:480, w:350,  h:60, type:'metal'},
      {x:7100, y:480, w:350,  h:60, type:'metal'},
      {x:7550, y:480, w:250,  h:60, type:'metal'},
      {x:7900, y:480, w:650,  h:60, type:'metal'},   // L'ARENA DEL DRAC!!
      {x:8620, y:480, w:250,  h:60, type:'metal'},   // la bandera
      // plataformes mecàniques pels forats
      {x:640,  y:360, w:120, h:40, type:'metal'},
      {x:1150, y:350, w:130, h:40, type:'metal'},
      {x:1600, y:330, w:120, h:40, type:'metal'},
      {x:2100, y:350, w:110, h:40, type:'metal'},
      {x:2550, y:320, w:120, h:40, type:'metal'},
      {x:3000, y:350, w:110, h:40, type:'metal'},
      {x:3450, y:320, w:120, h:40, type:'metal'},
      {x:3900, y:350, w:110, h:40, type:'metal'},
      {x:4350, y:320, w:120, h:40, type:'metal'},
      {x:4800, y:350, w:110, h:40, type:'metal'},
      {x:5250, y:320, w:120, h:40, type:'metal'},
      {x:5700, y:350, w:110, h:40, type:'metal'},
      {x:6150, y:320, w:120, h:40, type:'metal'},
      {x:6600, y:350, w:110, h:40, type:'metal'},
      {x:7050, y:320, w:120, h:40, type:'metal'},
      {x:7500, y:350, w:110, h:40, type:'metal'},
      // ASCENSORS mecànics que pugen i baixen!!
      {x:1350, y:330, w:90, h:30, type:'metal', move:true, baseY:330, amp:90, speed:0.028, phase:0},
      {x:2700, y:330, w:90, h:30, type:'metal', move:true, baseY:330, amp:80, speed:0.03, phase:1},
      {x:4200, y:330, w:90, h:30, type:'metal', move:true, baseY:330, amp:90, speed:0.026, phase:2},
      {x:5600, y:330, w:90, h:30, type:'metal', move:true, baseY:330, amp:80, speed:0.032, phase:0.5},
      {x:7000, y:330, w:90, h:30, type:'metal', move:true, baseY:330, amp:85, speed:0.028, phase:1.5},
      {x:8000, y:350, w:90, h:30, type:'metal', move:true, baseY:350, amp:60, speed:0.03, phase:0},
      // el MUR gegant que bloqueja l'arena — només s'hi entra per la porta!
      {x:7820, y:0, w:60, h:480, type:'metal'},
    );
    // 🚪 LA PORTA VERMELLA DEL BOSS! prem ↓ i entres a la sala del drac!
    doors.push({x: 7690, y: 390, w: 64, h: 90, tx: 7990, ty: 410});
    // dolents mecànics del castell!
    shy(700, 590, 890, 'blue', 480);   shy(1200, 1010, 1340, 'red', 480);
    shy(1600, 1460, 1790, 'green', 480); shy(2000, 1910, 2240, 'blue', 480);
    shy(2500, 2360, 2690, 'red', 480); shy(3300, 3210, 3490, 'pink', 480);
    shy(3700, 3610, 3940, 'blue', 480); shy(4200, 4060, 4390, 'red', 480);
    shy(4600, 4510, 4790, 'green', 480); shy(5000, 4910, 5240, 'pink', 480);
    shy(5500, 5360, 5690, 'blue', 480); shy(6000, 5810, 6140, 'red', 480);
    shy(6400, 6260, 6540, 'green', 480); shy(6800, 6660, 6990, 'pink', 480);
    shy(7200, 7110, 7440, 'blue', 480);
    fly(550, 300, 950, 280);   fly(1500, 1100, 1900, 260);
    fly(2400, 2000, 2800, 290); fly(3300, 2900, 3700, 270);
    fly(4200, 3800, 4600, 280); fly(5100, 4700, 5500, 260);
    fly(6000, 5600, 6400, 290); fly(6900, 6500, 7300, 270);
    fly(7800, 7300, 8300, 260); fly(8400, 8000, 8600, 290);
    spikyAt(1100, 1010, 1340, 480); spikyAt(3000, 2810, 3190, 480);
    spikyAt(4800, 4510, 4790, 480); spikyAt(6400, 6260, 6540, 480);
    // mines elèctriques damunt dels forats!
    mineAt(940, 350); mineAt(1820, 340); mineAt(2720, 350); mineAt(3520, 340);
    mineAt(4420, 350); mineAt(5720, 340); mineAt(6570, 350); mineAt(7470, 340);
    mineAt(8400, 350);
    heals.push({x: 1650, y: 280, taken: false}, {x: 4400, y: 270, taken: false},
               {x: 7300, y: 290, taken: false});
    starPicks.push({x: 1200, y: 290, taken: false}, {x: 4000, y: 290, taken: false},
                    {x: 6800, y: 290, taken: false});
    addFruitLine(400, 400, 3, 55, 'apple');  addFruitLine(1100, 400, 3, 55, 'apple');
    addFruitLine(1700, 400, 3, 55, 'grape'); addFruitLine(2300, 400, 3, 55, 'apple');
    addFruitLine(2900, 400, 1, 0, 'melon');  addFruitLine(3400, 400, 3, 55, 'apple');
    addFruitLine(3900, 400, 3, 55, 'grape'); addFruitLine(4500, 400, 3, 55, 'apple');
    addFruitLine(5000, 400, 1, 0, 'melon');  addFruitLine(5500, 400, 3, 55, 'apple');
    addFruitLine(6000, 400, 3, 55, 'grape'); addFruitLine(6500, 400, 3, 55, 'apple');
    addFruitLine(7000, 400, 1, 0, 'melon');  addFruitLine(7600, 400, 3, 55, 'apple');
    addFruitLine(8200, 400, 4, 55, 'coin');  addFruitLine(8650, 400, 3, 55, 'coin');
    addFruitLine(1500, 280, 3, 45, 'coin');  addFruitLine(3500, 280, 3, 45, 'coin');
    addFruitLine(5500, 280, 3, 45, 'coin');  addFruitLine(7500, 280, 3, 45, 'coin');
    qblock(1200, 310); qblock(3100, 300); qblock(5100, 310); qblock(7100, 290); qblock(8600, 300);
    // ===== EL BOSS FINAL FINAL: EL DRAC D'ELECTRICITAT!!! 🐉⚡ 6 cops! =====
    enemies.push({x: 8200, y: 260, baseY: 260, w: 130, h: 120, vx: 0, minX: 7910, maxX: 8530,
                  color: 'blue', fly: true, boss: true, dragon: true, asleep: true,
                  hp: 6, hurt: 0, alive: true, t: 0});
  } else if (n === 9) {
    // ============ NIVELL 9: LA SAKURA I EL FUJI!! 🌸⛰️ ============
    // Bosc de sakura → escala el Mont Fuji → porta als NÚVOLS!
    LEVEL_END = 9100;
    flag.x = 8850; flag.y = 200;   // la bandera està ALS NÚVOLS!
    platforms.push(
      // === EL BOSC DE SAKURA (0-3200): terra amb forats ===
      {x:0,    y:480, w:600,  h:60,  type:'ground'},
      {x:680,  y:480, w:400,  h:60,  type:'ground'},
      {x:1160, y:480, w:450,  h:60,  type:'ground'},
      {x:1690, y:480, w:380,  h:60,  type:'ground'},
      {x:2150, y:480, w:450,  h:60,  type:'ground'},
      {x:2680, y:480, w:540,  h:60,  type:'ground'},
      // branques de sakura per saltar!
      {x:400,  y:370, w:110, h:18, type:'cloud'},
      {x:750,  y:360, w:120, h:18, type:'cloud'},
      {x:1300, y:350, w:110, h:18, type:'cloud'},
      {x:1800, y:360, w:120, h:18, type:'cloud'},
      {x:2300, y:350, w:110, h:18, type:'cloud'},
      {x:2850, y:350, w:120, h:18, type:'cloud'},
      // === EL MONT FUJI!! (3200-6700): escala cap al cel! ===
      {x:3250, y:430, w:140, h:20, type:'rock'},
      {x:3480, y:380, w:130, h:20, type:'rock'},
      {x:3700, y:330, w:130, h:20, type:'rock'},
      {x:3920, y:280, w:130, h:20, type:'rock'},
      {x:4140, y:330, w:140, h:20, type:'rock'},
      {x:4360, y:280, w:130, h:20, type:'rock'},
      {x:4580, y:230, w:130, h:20, type:'rock'},
      {x:4800, y:300, w:130, h:20, type:'rock'},
      {x:5020, y:250, w:130, h:20, type:'snow'},
      {x:5240, y:200, w:140, h:20, type:'snow'},
      {x:5460, y:260, w:130, h:20, type:'snow'},
      {x:5680, y:210, w:130, h:20, type:'snow'},
      {x:5900, y:170, w:140, h:20, type:'snow'},
      // EL CIM DEL FUJI — tot de neu!
      {x:6120, y:200, w:560, h:280, type:'snow'},
      // núvols que et pugen pel Fuji!
      {x:4000, y:380, w:90, h:20, type:'cloud', move:true, baseY:380, amp:60, speed:0.03, phase:0},
      {x:4900, y:180, w:90, h:20, type:'cloud', move:true, baseY:180, amp:50, speed:0.028, phase:1},
      {x:5800, y:300, w:90, h:20, type:'cloud', move:true, baseY:300, amp:60, speed:0.032, phase:2},
      // el MUR del cim — només la porta et porta als núvols!
      {x:6700, y:0, w:60, h:480, type:'snow'},
      // === ELS NÚVOLS (6900-9100): camina pel cel! ===
      {x:7050, y:300, w:180, h:20, type:'cloud'},
      {x:7330, y:250, w:160, h:20, type:'cloud'},
      {x:7590, y:330, w:170, h:20, type:'cloud'},
      {x:7860, y:270, w:160, h:20, type:'cloud'},
      {x:8120, y:330, w:170, h:20, type:'cloud'},
      {x:8390, y:260, w:150, h:20, type:'cloud'},
      {x:8640, y:300, w:200, h:20, type:'cloud'},
      {x:8850, y:300, w:250, h:20, type:'cloud'},
      // núvols mòbils al cel!
      {x:7200, y:200, w:90, h:20, type:'cloud', move:true, baseY:200, amp:50, speed:0.03, phase:0.5},
      {x:8000, y:200, w:90, h:20, type:'cloud', move:true, baseY:200, amp:55, speed:0.028, phase:1.5},
    );
    // 🚪 LA PORTA al cim del Fuji → et porta ALS NÚVOLS!
    doors.push({x: 6500, y: 110, w: 64, h: 90, tx: 7100, ty: 240});
    // dolents: tanukis... vull dir, Shy Guys i Fly Guys del bosc i la muntanya!
    shy(500, 60, 660, 'pink');     shy(950, 690, 1070, 'red');
    shy(1400, 1170, 1600, 'blue'); shy(1950, 1700, 2060, 'green');
    shy(2400, 2160, 2590, 'pink'); shy(2900, 2690, 3210, 'red');
    fly(850, 500, 1200, 300);      fly(1700, 1300, 2100, 280);
    fly(2500, 2100, 2900, 300);    fly(3600, 3300, 4000, 220);
    fly(4600, 4200, 5100, 180);    fly(5600, 5200, 6100, 160);
    fly(7200, 6900, 7600, 200);    fly(8100, 7800, 8500, 190);
    spikyAt(1250, 1170, 1600, 480); spikyAt(2850, 2690, 3210, 480);
    mineAt(640, 380); mineAt(1620, 390); mineAt(2610, 390); mineAt(3230, 400);
    heals.push({x: 1400, y: 300, taken: false}, {x: 4800, y: 250, taken: false},
               {x: 7600, y: 280, taken: false});
    starPicks.push({x: 2350, y: 300, taken: false}, {x: 5250, y: 150, taken: false});
    // fruites: sakura → cireres i pomes; núvols → monedes!
    addFruitLine(300, 400, 3, 55, 'apple');  addFruitLine(900, 400, 3, 55, 'grape');
    addFruitLine(1500, 400, 3, 55, 'apple'); addFruitLine(2000, 400, 1, 0, 'melon');
    addFruitLine(2500, 400, 3, 55, 'grape'); addFruitLine(3000, 400, 3, 55, 'apple');
    addFruitLine(3400, 340, 2, 50, 'apple'); addFruitLine(4200, 290, 2, 50, 'grape');
    addFruitLine(5000, 210, 2, 50, 'apple'); addFruitLine(5700, 170, 2, 50, 'grape');
    addFruitLine(6200, 150, 4, 55, 'coin');  addFruitLine(6500, 60, 3, 55, 'coin');
    addFruitLine(7100, 250, 4, 55, 'coin');  addFruitLine(7500, 280, 4, 55, 'coin');
    addFruitLine(7900, 220, 4, 55, 'coin');  addFruitLine(8300, 280, 4, 55, 'coin');
    addFruitLine(8700, 250, 4, 55, 'coin');  addFruitLine(8950, 250, 3, 55, 'coin');
    qblock(1100, 330); qblock(2800, 320); qblock(4700, 250); qblock(7500, 290); qblock(8450, 220);
    // SENSE BOSS: el Fuji i els núvols ja són premi prou gran! 🌸
  } else if (n === 10) {
    // ============ NIVELL 10: EL CASTELL DE L'ESCALADA!! 🏰🧗 ============
    // Murs gegants! Has de PUJAR pels esglaons fins a dalt de cada torre!
    LEVEL_END = 6150;
    flag.x = 5980; flag.y = 20;    // la bandera és DALT DE TOT, al terrat!
    platforms.push(
      // CINC PISOS, cada un MÉS AMUNT — el passadís és una escala gegant!
      {x:0,    y:480, w:1500, h:60,  type:'tower'},   // pis 1: l'entrada
      {x:1560, y:390, w:1100, h:150, type:'tower'},   // pis 2
      {x:2660, y:300, w:1100, h:240, type:'tower'},   // pis 3
      {x:3760, y:210, w:1100, h:330, type:'tower'},   // pis 4
      {x:4860, y:120, w:1250, h:420, type:'tower'},   // pis 5: el TERRAT, arena del rei!
      // ===== MUR + ESCALES pis 1→2 (x=1500) =====
      {x:1500, y:390, w:60, h:90, type:'tower'},
      {x:1240, y:435, w:110, h:18, type:'tower'},
      {x:1380, y:405, w:110, h:18, type:'tower'},
      // ===== MUR + ESCALES pis 2→3 (x=2600) =====
      {x:2600, y:300, w:60, h:90, type:'tower'},
      {x:2340, y:345, w:110, h:18, type:'tower'},
      {x:2480, y:315, w:110, h:18, type:'tower'},
      // ===== MUR + ESCALES pis 3→4 (x=3700) =====
      {x:3700, y:210, w:60, h:90, type:'tower'},
      {x:3440, y:255, w:110, h:18, type:'tower'},
      {x:3580, y:225, w:110, h:18, type:'tower'},
      // ===== MUR + ESCALES pis 4→5 (x=4800) =====
      {x:4800, y:120, w:60, h:90, type:'tower'},
      {x:4540, y:165, w:110, h:18, type:'tower'},
      {x:4680, y:135, w:110, h:18, type:'tower'},
      // plataformes flotants pels passadissos de cada pis
      {x:400,  y:360, w:110, h:18, type:'tower'},
      {x:800,  y:290, w:100, h:18, type:'tower'},
      {x:1850, y:290, w:110, h:18, type:'tower'},
      {x:2900, y:210, w:110, h:18, type:'tower'},
      {x:3300, y:200, w:100, h:18, type:'tower'},
      {x:4100, y:120, w:110, h:18, type:'tower'},
      {x:5400, y:60,  w:110, h:18, type:'tower'},
    );
    // dolents: Shy Guys i Fly Guys de guardia a CADA pis!
    shy(700, 60, 1440, 'blue', 480);     shy(1100, 700, 1440, 'red', 480);
    shy(1800, 1570, 2540, 'green', 390); shy(2300, 1900, 2540, 'pink', 390);
    shy(2900, 2670, 3640, 'blue', 300);  shy(3400, 3000, 3640, 'red', 300);
    shy(4000, 3770, 4740, 'green', 210); shy(4500, 4100, 4740, 'pink', 210);
    spikyAt(1000, 700, 1440, 480);  spikyAt(3200, 3000, 3640, 300);
    spikyAt(4300, 4100, 4740, 210);
    fly(600, 60, 1400, 300);    fly(1900, 1570, 2500, 220);
    fly(2900, 2670, 3600, 180); fly(4000, 3770, 4700, 120);
    fly(5200, 4870, 6000, 40);  fly(800, 500, 1400, 180);
    // mines flotant als tancaments de pis — si falles l'escala, boom!
    mineAt(1510, 300); mineAt(2610, 210); mineAt(3710, 120); mineAt(4810, 30);
    heals.push({x: 1900, y: 330, taken: false}, {x: 4000, y: 150, taken: false},
               {x: 5600, y: 60, taken: false});
    starPicks.push({x: 1560, y: 330, taken: false},   // dalt del mur del pis 2!
                    {x: 3700, y: 150, taken: false},  // dalt del mur del pis 4!
                    {x: 4860, y: 60, taken: false});  // dalt del mur del pis 5!!
    addFruitLine(300, 400, 3, 55, 'apple');   addFruitLine(700, 400, 3, 55, 'grape');
    addFruitLine(1100, 400, 1, 0, 'melon');   addFruitLine(1700, 310, 3, 55, 'apple');
    addFruitLine(2100, 310, 3, 55, 'grape');  addFruitLine(2750, 220, 3, 55, 'apple');
    addFruitLine(3200, 220, 1, 0, 'melon');   addFruitLine(3850, 130, 3, 55, 'apple');
    addFruitLine(4300, 130, 3, 55, 'grape');  addFruitLine(5000, 40, 3, 55, 'apple');
    addFruitLine(5400, 40, 1, 0, 'melon');    addFruitLine(5800, 40, 4, 55, 'coin');
    addFruitLine(1300, 370, 3, 50, 'coin');   addFruitLine(2400, 280, 3, 50, 'coin');
    addFruitLine(3500, 190, 3, 50, 'coin');   addFruitLine(4600, 100, 3, 50, 'coin');
    qblock(600, 320); qblock(2000, 230); qblock(3100, 140); qblock(4200, 50); qblock(5300, 60);
    // ===== EL BOSS: EL FLY GUY GEGANT, REI DEL CASTELL!! 🧢👑 7 cops! =====
    enemies.push({x: 5400, y: 20, baseY: 20, w: 110, h: 90, vx: 2.4, minX: 4890, maxX: 5990,
                  color: 'red', fly: true, boss: true, flyking: true, hp: 7, hurt: 0, alive: true, t: 0});
  } else if (n === 12) {
    // ============ NIVELL 12: TÒQUIO DE LEGO!!! 🏙️🧱 ============
    // MOOOOOLt llarg i cada part diferent: carrer → gratacels → temple
    // → tren del cel → barri de neons → la Torre de Tòquio → el cel!
    LEVEL_END = 12000;
    flag.x = 11800; flag.y = 380;
    platforms.push(
      // ===== 1. EL CARRER DE LEGO =====
      {x:0,    y:480, w:800,  h:60,  type:'lego'},
      {x:900,  y:480, w:800,  h:60,  type:'lego'},
      {x:300,  y:380, w:140,  h:24,  type:'lego'},
      {x:600,  y:300, w:120,  h:24,  type:'lego'},
      {x:1000, y:370, w:140,  h:24,  type:'lego'},
      {x:1350, y:290, w:120,  h:24,  type:'lego'},
      // ===== 2. ELS GRATACELS: torres apilades cap amunt!! =====
      {x:1700, y:480, w:300,  h:60,  type:'lego'},
      {x:2100, y:430, w:160,  h:110, type:'lego'},
      {x:2350, y:360, w:160,  h:180, type:'lego'},
      {x:2600, y:290, w:160,  h:250, type:'lego'},
      {x:2900, y:210, w:160,  h:330, type:'lego'},   // el més alt!!
      {x:3150, y:290, w:150,  h:250, type:'lego'},
      {x:3350, y:360, w:140,  h:180, type:'lego'},
      // ===== 3. EL TEMPLE =====
      {x:3550, y:480, w:1400, h:60,  type:'lego'},
      {x:3700, y:390, w:130,  h:24,  type:'lego'},
      {x:4000, y:330, w:120,  h:24,  type:'lego'},
      {x:4300, y:390, w:130,  h:24,  type:'lego'},
      // ===== 4. EL TREN DEL CEL: plataformes que es mouen sobre el BUIT!! =====
      {x:4950, y:350, w:120,  h:24,  type:'lego'},
      {x:5200, y:350, w:100,  h:20,  type:'lego', move:true, baseY:350, amp:80, speed:0.03,  phase:0},
      {x:5450, y:300, w:100,  h:20,  type:'lego', move:true, baseY:300, amp:90, speed:0.028, phase:2},
      {x:5700, y:380, w:100,  h:20,  type:'lego', move:true, baseY:380, amp:70, speed:0.033, phase:4},
      {x:5950, y:320, w:100,  h:20,  type:'lego', move:true, baseY:320, amp:85, speed:0.026, phase:1},
      {x:6200, y:360, w:110,  h:24,  type:'lego'},
      {x:6450, y:480, w:400,  h:60,  type:'lego'},
      // ===== 5. EL BARRI DE NEONS (terra amb forats i punxes!) =====
      {x:6850, y:480, w:500,  h:60,  type:'lego'},
      {x:7450, y:480, w:450,  h:60,  type:'lego'},
      {x:8000, y:480, w:700,  h:60,  type:'lego'},
      {x:7000, y:380, w:120,  h:24,  type:'lego'},
      {x:7300, y:300, w:120,  h:24,  type:'lego'},
      {x:7650, y:380, w:120,  h:24,  type:'lego'},
      {x:7950, y:300, w:120,  h:24,  type:'lego'},
      {x:8300, y:370, w:130,  h:24,  type:'lego'},
      // punxes als carrers de neons!
      {x:6950, y:460, w:120,  h:20,  type:'spikes', hurt:true},
      {x:7600, y:460, w:120,  h:20,  type:'spikes', hurt:true},
      {x:8400, y:460, w:120,  h:20,  type:'spikes', hurt:true},
      // ===== 6. LA TORRE DE TÒQUIO: escala en zigzag cap al cel!! 🗼 =====
      {x:8750, y:480, w:250,  h:60,  type:'lego'},
      {x:9000, y:410, w:120,  h:20,  type:'lego'},
      {x:8850, y:330, w:120,  h:20,  type:'lego'},
      {x:9050, y:250, w:120,  h:20,  type:'lego'},
      {x:8900, y:170, w:120,  h:20,  type:'lego'},
      {x:9150, y:410, w:120,  h:20,  type:'lego'},
      {x:9300, y:330, w:120,  h:20,  type:'lego'},
      {x:9200, y:250, w:120,  h:20,  type:'lego'},
      {x:9350, y:170, w:120,  h:20,  type:'lego'},
      {x:9550, y:300, w:140,  h:24,  type:'lego'},
      {x:9750, y:220, w:120,  h:20,  type:'lego'},
      // ===== 7. EL CIM I EL FINAL =====
      {x:10000,y:380, w:150,  h:24,  type:'lego'},
      {x:10300,y:300, w:130,  h:24,  type:'lego'},
      {x:10550,y:220, w:130,  h:24,  type:'lego'},
      {x:10800,y:300, w:140,  h:24,  type:'lego'},
      {x:11050,y:390, w:160,  h:24,  type:'lego'},
      {x:11300,y:480, w:700,  h:60,  type:'lego'},
    );
    // dolents per cada part de la ciutat!
    shy(500, 30, 760, 'red');     shy(1100, 920, 1660, 'blue');   // el carrer
    spikyAt(2200, 2110, 2250, 430); spikyAt(2400, 2360, 2500, 360); // gratacels
    shy(2950, 2910, 3050, 'pink', 210);
    fly(600, 300, 1300, 250);   fly(2400, 2100, 3100, 200);
    shy(3700, 3560, 4930, 'green');  shy(4300, 3560, 4930, 'pink'); // temple
    plantAt(3900); plantAt(4600);
    fly(5300, 5000, 6100, 280); fly(5800, 5000, 6400, 350);   // el tren
    shy(7000, 6860, 7340, 'blue'); shy(8100, 8010, 8690, 'red'); // neons
    spikyAt(7700, 7460, 7890); mineAt(7200, 420); mineAt(8550, 400);
    fly(9000, 8800, 9400, 300); fly(9300, 8900, 9600, 200);   // la torre
    shy(11600, 11310, 11990, 'green');                          // el final
    heals.push({x:2960, y:160, taken:false}, {x:5750, y:260, taken:false}, {x:10600, y:170, taken:false});
    starPicks.push({x:2200, y:380, taken:false}, {x:5500, y:200, taken:false}, {x:9200, y:120, taken:false});
    pads.push({x:6760, y:464, w:36, h:21}, {x:11500, y:464, w:36, h:21});
    // fruites i monedes per tota la ciutat!
    addFruitLine(200, 420, 4, 60, 'coin');    addFruitLine(620, 260, 3, 55, 'apple');
    addFruitLine(1000, 330, 3, 55, 'coin');   addFruitLine(1750, 430, 3, 55, 'apple');
    addFruitLine(2380, 320, 3, 55, 'coin');   addFruitLine(2920, 170, 3, 55, 'melon');
    addFruitLine(3600, 430, 4, 60, 'apple');  addFruitLine(4050, 290, 2, 55, 'grape');
    addFruitLine(4500, 430, 3, 55, 'coin');   addFruitLine(5250, 260, 3, 55, 'coin');
    addFruitLine(5750, 300, 3, 55, 'coin');   addFruitLine(6500, 420, 4, 55, 'apple');
    addFruitLine(7100, 330, 3, 55, 'coin');   addFruitLine(7700, 250, 3, 55, 'coin');
    addFruitLine(8350, 420, 3, 55, 'grape');  addFruitLine(8900, 370, 3, 55, 'coin');
    addFruitLine(9250, 120, 3, 55, 'melon');  addFruitLine(10100, 340, 3, 55, 'coin');
    addFruitLine(10400, 260, 3, 55, 'coin');  addFruitLine(11400, 430, 4, 60, 'apple');
    addFruitLine(11650, 430, 3, 55, 'coin');
    qblock(1050, 310); qblock(2650, 230); qblock(4100, 270); qblock(6550, 400); qblock(8100, 400); qblock(11350, 380);
    // SENSE BOSS! només arribar al final d'aquesta ciutat enorme! 🗼
  } else if (n === 13) {
    // ============ NIVELL 13: LA FESTA DE COLORS!!! 🎉🌈 ============
    // MOOOOOOOOOOOLt llarg — 8 trams de terra amb forats, globus
    // trampolí, 32 plataformes de colors i 24+ DE TOT: enemics,
    // fruites, mines, plantes... LA FESTA MÉS GRAN DE TOTES!!
    LEVEL_END = 14000;
    flag.x = 13800; flag.y = 380;
    platforms.push(
      // ===== terra de festa en 8 trams amb forats! =====
      {x:0,     y:480, w:1600, h:60,  type:'party'},
      {x:1750,  y:480, w:1600, h:60,  type:'party'},
      {x:3500,  y:480, w:1600, h:60,  type:'party'},
      {x:5250,  y:480, w:1600, h:60,  type:'party'},
      {x:7000,  y:480, w:1600, h:60,  type:'party'},
      {x:8750,  y:480, w:1600, h:60,  type:'party'},
      {x:10500, y:480, w:1600, h:60,  type:'party'},
      {x:12200, y:480, w:1800, h:60,  type:'party'},
      // ===== GLOBUS TRAMPOLÍ a cada forat — BOING!! =====
      {x:1650,  y:430, w:90,  h:30,  type:'balloon'},
      {x:3400,  y:430, w:90,  h:30,  type:'balloon'},
      {x:5150,  y:430, w:90,  h:30,  type:'balloon'},
      {x:6900,  y:430, w:90,  h:30,  type:'balloon'},
      {x:8650,  y:430, w:90,  h:30,  type:'balloon'},
      {x:10400, y:430, w:90,  h:30,  type:'balloon'},
      {x:12100, y:430, w:90,  h:30,  type:'balloon'},
      // ===== 32 plataformes de colors en arcs!! =====
      {x:400,   y:380, w:110, h:22,  type:'party'},
      {x:700,   y:300, w:110, h:22,  type:'party'},
      {x:1000,  y:240, w:110, h:22,  type:'party'},
      {x:1300,  y:320, w:110, h:22,  type:'party'},
      {x:2000,  y:360, w:110, h:22,  type:'party'},
      {x:2350,  y:280, w:110, h:22,  type:'party'},
      {x:2700,  y:220, w:110, h:22,  type:'party'},
      {x:3050,  y:300, w:110, h:22,  type:'party'},
      {x:3700,  y:350, w:110, h:22,  type:'party'},
      {x:4050,  y:270, w:110, h:22,  type:'party'},
      {x:4400,  y:210, w:110, h:22,  type:'party'},
      {x:4750,  y:290, w:110, h:22,  type:'party'},
      {x:5400,  y:370, w:110, h:22,  type:'party'},
      {x:5750,  y:290, w:110, h:22,  type:'party'},
      {x:6100,  y:230, w:110, h:22,  type:'party'},
      {x:6450,  y:310, w:110, h:22,  type:'party'},
      {x:7200,  y:360, w:110, h:22,  type:'party'},
      {x:7550,  y:280, w:110, h:22,  type:'party'},
      {x:7900,  y:220, w:110, h:22,  type:'party'},
      {x:8250,  y:300, w:110, h:22,  type:'party'},
      {x:8900,  y:350, w:110, h:22,  type:'party'},
      {x:9250,  y:270, w:110, h:22,  type:'party'},
      {x:9600,  y:210, w:110, h:22,  type:'party'},
      {x:9950,  y:290, w:110, h:22,  type:'party'},
      {x:10700, y:360, w:110, h:22,  type:'party'},
      {x:11050, y:280, w:110, h:22,  type:'party'},
      {x:11400, y:220, w:110, h:22,  type:'party'},
      {x:11750, y:300, w:110, h:22,  type:'party'},
      {x:12400, y:370, w:120, h:22,  type:'party'},
      {x:12800, y:290, w:120, h:22,  type:'party'},
      {x:13200, y:210, w:120, h:22,  type:'party'},
      {x:13550, y:300, w:120, h:22,  type:'party'},
    );
    // ===== DOLENTS DE FESTA: més de 24!! =====
    shy(500, 60, 1550, 'red');    shy(1200, 60, 1550, 'blue');
    shy(2200, 1800, 3300, 'green'); shy(2800, 1800, 3300, 'pink');
    shy(3800, 3550, 5050, 'blue');  shy(4500, 3550, 5050, 'red');
    shy(5600, 5300, 6800, 'green'); shy(6300, 5300, 6800, 'pink');
    shy(7400, 7050, 8650, 'blue');  shy(8000, 7050, 8650, 'red');
    shy(9200, 8800, 10400, 'green'); shy(9900, 8800, 10400, 'pink');
    shy(10800, 10550, 12100, 'blue'); shy(11500, 10550, 12100, 'red');
    shy(12600, 12250, 13950, 'green'); shy(13300, 12250, 13950, 'pink');
    fly(800, 100, 1600, 300);    fly(2000, 1800, 3300, 240);
    fly(4000, 3550, 5000, 260);  fly(5800, 5300, 6800, 240);
    fly(7500, 7050, 8600, 260);  fly(9300, 8800, 10400, 240);
    fly(10900, 10550, 12100, 260); fly(12600, 12300, 13900, 240);
    spikyAt(1500, 100, 1600);  spikyAt(3000, 1800, 3300);
    spikyAt(4800, 3550, 5050); spikyAt(6600, 5300, 6800);
    spikyAt(8400, 7050, 8650); spikyAt(10200, 8800, 10400);
    spikyAt(11900, 10550, 12100); spikyAt(13600, 12250, 13950);
    plantAt(900);  plantAt(2500); plantAt(4200); plantAt(6000);
    plantAt(7800); plantAt(9600); plantAt(11300); plantAt(13000);
    mineAt(1800, 420); mineAt(3300, 420); mineAt(5100, 420); mineAt(6800, 420);
    mineAt(8600, 420); mineAt(10300, 420); mineAt(12000, 420); mineAt(13700, 420);
    // regals de festa!
    heals.push({x:2400, y:400, taken:false}, {x:6000, y:400, taken:false},
               {x:9600, y:400, taken:false}, {x:13200, y:400, taken:false});
    starPicks.push({x:1050, y:200, taken:false}, {x:4450, y:160, taken:false},
                   {x:8000, y:160, taken:false}, {x:11500, y:160, taken:false});
    // ===== 32 LÍNIES DE FRUITES I MONEDES — pluja de dolços!! =====
    addFruitLine(150, 420, 4, 55, 'apple');   addFruitLine(500, 340, 3, 55, 'coin');
    addFruitLine(900, 230, 3, 55, 'melon');   addFruitLine(1400, 280, 3, 55, 'grape');
    addFruitLine(1900, 420, 4, 55, 'coin');   addFruitLine(2300, 320, 3, 55, 'apple');
    addFruitLine(2750, 180, 3, 55, 'melon');  addFruitLine(3100, 260, 3, 55, 'coin');
    addFruitLine(3600, 420, 4, 55, 'grape');  addFruitLine(4100, 230, 3, 55, 'coin');
    addFruitLine(4500, 170, 3, 55, 'melon');  addFruitLine(4900, 250, 3, 55, 'apple');
    addFruitLine(5350, 420, 4, 55, 'coin');   addFruitLine(5800, 250, 3, 55, 'grape');
    addFruitLine(6200, 190, 3, 55, 'melon');  addFruitLine(6600, 270, 3, 55, 'coin');
    addFruitLine(7100, 420, 4, 55, 'apple');  addFruitLine(7600, 240, 3, 55, 'coin');
    addFruitLine(8000, 180, 3, 55, 'melon');  addFruitLine(8400, 260, 3, 55, 'grape');
    addFruitLine(8900, 420, 4, 55, 'coin');   addFruitLine(9350, 230, 3, 55, 'apple');
    addFruitLine(9700, 170, 3, 55, 'melon');  addFruitLine(10100, 250, 3, 55, 'coin');
    addFruitLine(10600, 420, 4, 55, 'grape'); addFruitLine(11100, 240, 3, 55, 'coin');
    addFruitLine(11500, 180, 3, 55, 'melon'); addFruitLine(11900, 260, 3, 55, 'apple');
    addFruitLine(12400, 420, 4, 55, 'coin');  addFruitLine(12900, 250, 3, 55, 'melon');
    addFruitLine(13300, 170, 3, 55, 'coin');  addFruitLine(13700, 420, 4, 55, 'apple');
    qblock(800, 310); qblock(2900, 260); qblock(4700, 230); qblock(6500, 250);
    qblock(8300, 240); qblock(10000, 230); qblock(11800, 250); qblock(13100, 340);
    // SENSE BOSS! la festa no necessita monstres — només arribar-hi ballant!! 🎉
  } else if (n === 14) {
    // ============ NIVELL 14: EL CAMP VERD DE NIT!! 🌙🌿 ============
    // VERTICAL DE VERITAT! La prada fosca a baix → espiral de fulles,
    // branques i núvols que PUJA I PUJA fins al cel estrellat,
    // on hi ha el NIU GEIANT amb la bandera!
    LEVEL_END = 1400;        // estret! no vas endavant: vas AMUNT!
    LEVEL_TOP = -1520;       // la càmera pot pujar 2000 píxels!!
    flag.x = 620; flag.y = -1495;
    platforms.push(
      {x:0,    y:480,   w:1400, h:60,  type:'night'},    // la prada fosca de baix
      // ===== L'ESPIRAL QUE PUJA: esquerra → dreta → esquerra!! =====
      // lloses AMPLAS i a prop, que es pugui pujar amb salts normals!
      {x:280,  y:390,   w:150,  h:20,  type:'night'},
      {x:580,  y:310,   w:150,  h:20,  type:'night'},
      {x:880,  y:230,   w:150,  h:20,  type:'night'},
      {x:1150, y:150,   w:150,  h:20,  type:'night'},
      {x:830,  y:60,    w:150,  h:20,  type:'cloud', move:true, baseY:60, amp:40, speed:0.03, phase:0},
      {x:530,  y:-20,   w:150,  h:20,  type:'night'},
      {x:230,  y:-100,  w:150,  h:20,  type:'night'},
      {x:530,  y:-190,  w:150,  h:20,  type:'night'},
      {x:850,  y:-270,  w:150,  h:20,  type:'cloud', move:true, baseY:-270, amp:45, speed:0.026, phase:1},
      {x:1150, y:-360,  w:150,  h:20,  type:'night'},
      {x:830,  y:-440,  w:150,  h:20,  type:'night'},
      {x:530,  y:-520,  w:150,  h:20,  type:'night'},
      // replà amb PINXOS a una punta — puges per l'altre costat! 🌸
      {x:180,  y:-610,  w:240,  h:20,  type:'night'},
      {x:200,  y:-635,  w:80,   h:25,  type:'spikes', hurt:true},
      {x:500,  y:-700,  w:150,  h:20,  type:'night'},
      {x:830,  y:-780,  w:150,  h:20,  type:'cloud', move:true, baseY:-780, amp:50, speed:0.028, phase:2},
      {x:1140, y:-870,  w:150,  h:20,  type:'night'},
      {x:830,  y:-950,  w:150,  h:20,  type:'night'},
      {x:530,  y:-1030, w:150,  h:20,  type:'night'},
      {x:230,  y:-1120, w:150,  h:20,  type:'cloud', move:true, baseY:-1120, amp:45, speed:0.03, phase:0.5},
      {x:530,  y:-1200, w:150,  h:20,  type:'night'},
      {x:830,  y:-1280, w:150,  h:20,  type:'night'},
      // ===== EL NIU GEIANT a dalt de tot — la meta!! =====
      {x:480,  y:-1400, w:340,  h:24,  type:'night'},
    );
    // dolents de nit: somnímbuls a la prada i mosques entre les fulles!
    shy(500, 100, 1350, 'blue');  shy(1100, 800, 1350, 'red');
    fly(500, 100, 1300, 330);   fly(900, 300, 1300, -300);
    fly(400, 60, 1100, -800);   fly(800, 400, 1300, -1100);
    fly(600, 300, 1200, -1340);
    spikyAt(1180, 1140, 1250, -870);   spikyAt(880, 830, 940, -950);
    plantAt(880, -440);  plantAt(1200, -870);
    mineAt(310, -660);  mineAt(1200, -410);   // mines amagades, alerta!
    // trampolins per tornar a pujar si caues!
    pads.push({x:60, y:464, w:36, h:21}, {x:1180, y:464, w:36, h:21});
    // regals del cel estrellat!
    heals.push({x:900, y:-330, taken:false}, {x:290, y:-1170, taken:false});
    starPicks.push({x:880, y:10, taken:false}, {x:550, y:-750, taken:false},
                   {x:1190, y:-920, taken:false});
    // fruites seguint l'espiral — una ruta dolça cap al cel!
    addFruitLine(300, 350, 3, 50, 'coin');    addFruitLine(600, 270, 3, 50, 'apple');
    addFruitLine(900, 190, 3, 50, 'coin');    addFruitLine(1170, 110, 3, 50, 'grape');
    addFruitLine(850, 20, 3, 50, 'coin');     addFruitLine(550, -60, 3, 50, 'melon');
    addFruitLine(250, -140, 3, 50, 'coin');   addFruitLine(550, -230, 3, 50, 'apple');
    addFruitLine(870, -310, 3, 50, 'coin');   addFruitLine(1170, -400, 3, 50, 'melon');
    addFruitLine(850, -480, 3, 50, 'coin');   addFruitLine(550, -560, 3, 50, 'grape');
    addFruitLine(220, -660, 3, 50, 'coin');   addFruitLine(520, -740, 3, 50, 'apple');
    addFruitLine(850, -820, 3, 50, 'melon');  addFruitLine(1160, -910, 3, 50, 'coin');
    addFruitLine(850, -990, 3, 50, 'coin');   addFruitLine(560, -1070, 3, 50, 'grape');
    addFruitLine(260, -1160, 3, 50, 'coin');  addFruitLine(560, -1240, 3, 50, 'melon');
    addFruitLine(560, -1440, 4, 50, 'coin');
    qblock(600, -570); qblock(300, -160); qblock(1160, -920);
    // SENSE BOSS! només tu, la nit i la escalada fins al niu!! 🌙
  }
}
