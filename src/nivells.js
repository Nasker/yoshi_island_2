// ==================== NIVELLS ====================
// Els nivells ara són DADES! Cada nivell és un objecte amb llistes de
// plataformes, enemics, fruites... i el joc les llegeix amb buildLevel().
// Això vol dir que les eines (tools/editor_nivell.html i
// tools/esbos_nivell.py) poden crear nivells nous sense tocar el joc!

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
let LEVEL_TITOL = '';       // el nom que surt al cartell de començament
let LEVEL_NEXT = 0;         // a quin nivell vas quan arribes a la bandera (0 = has guanyat!)

// ==================== LES DADES DELS NIVELLS ====================
const LEVELS = {};
// els fitxers de levels/ criden aquesta funció per registrar-se
function registraNivell(n, dades) { LEVELS[n] = dades; }

// ---------------------------------------------------------------
// NIVELL 1: EL DESERT I EL CASTELL!! 🏜️🏰
// IGUALET que l'esbós dibuixat a mà de l'Unai!
// DESERT amb piràmide → PORTA del castell → corredor de punxes a dalt
// + masmorra del tresor a baix → sala del boss → pati amb muntanya!
LEVELS[1] = {
  titol: 'Salva el nadó Mario!',
  fi: 8600, flag: [8300, 380], seguent: 2,
  plataformes: [
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
  ],
  // la porta vermella del castell — posa't a sobre i prem avall!
  portes: [{x: 2680, y: 390, w: 64, h: 90, tx: 2960, ty: 190}],
  enemics: [
    // EL DESERT: shys, cactus espinosos i voltors!
    ['shy',500, 30, 340, 'red'], ['shy',900, 780, 1130, 'blue'],
    ['shy',1600, 1380, 1780, 'pink', 360], ['shy',2150, 1950, 2280, 'green'],
    ['spiky',1000, 780, 1130], ['spiky',2000, 1910, 2280],
    ['fly',700, 400, 1000, 300], ['fly',1700, 1400, 2100, 240],
    // EL CORREDOR DEL CASTELL: guàrdies entre les espines!
    ['shy',3300, 2910, 3440, 'blue', 250], ['shy',4200, 4150, 4290, 'red', 250],
    ['shy',4700, 4460, 4890, 'green', 250], ['shy',5150, 5050, 5590, 'pink', 250],
    ['spiky',3750, 3600, 3990, 250], ['spiky',5200, 5050, 5340, 250],
    // LA MASMORRA: el tresor ben custodiat!
    ['spiky',3200, 3100, 4200, 480], ['shy',3800, 3100, 4250, 'red', 480],
    ['spiky',4700, 4500, 5400, 480],
    // 🗿 EL BOSS DEL DIBUIX: LA CARA DE PEDRA!! vola i dispara!
    ['boss',{x:5900, y:120, baseY:120, w:96, h:96, vx:2.4, minX:5660, maxX:6480,
             fly:true, stone:true, hp:6}],
    // EL PATI-JARDÍ
    ['shy',6500, 6250, 6790, 'green'], ['shy',7150, 6830, 7580, 'pink', 420],
    ['shy',7800, 7620, 8550, 'blue'],
    ['fly',7000, 6700, 7800, 330],
  ],
  mines: [[2000,430], [3500,430], [5000,430], [8200,430]],
  plantes: [[6450], [7750]],
  cors: [[1630,240], [3600,400], [6450,160]],
  estrelles: [[1620,230], [4380,380]],
  trampolins: [[4385,464],   // trampolí de la masmorra: torna a pujar!
               [8450,464]],  // bolet del pati
  blocs: [[500,330], [3300,190], [5300,190], [6700,380], [7400,220]],
  // fruites i monedes — les cercoletes del dibuix!
  fruites: [
    [150, 430, 4, 60, 'coin'],      // desert
    [370, 390, 3, 55, 'apple'],     // dunes
    [1200, 380, 4, 60, 'coin'],     // la piràmide
    [1400, 320, 3, 60, 'coin'],
    [1560, 250, 3, 55, 'melon'],    // tresor del CIM de la piràmide!
    [2100, 430, 3, 60, 'coin'],
    [3000, 200, 4, 55, 'coin'],     // corredor del castell
    [3850, 200, 4, 55, 'coin'],
    [4800, 200, 4, 55, 'coin'],
    [3000, 430, 5, 70, 'coin'],     // anell de monedes de la masmorra!
    [4000, 420, 3, 60, 'melon'],    // les flors-tresor del dibuix!
    [4800, 430, 4, 65, 'coin'],
    [5700, 170, 3, 55, 'coin'],     // sala del boss
    [6300, 430, 4, 60, 'apple'],    // pati
    [6850, 380, 4, 60, 'coin'],     // muntanya de flors
    [7080, 320, 3, 60, 'coin'],
    [7320, 260, 3, 55, 'melon'],    // flors del cim!
    [7800, 430, 3, 60, 'grape'],
    [8150, 430, 4, 60, 'coin'],
  ],
};

// ---------------------------------------------------------------
// NIVELL 2: DINS EL CASTELL! lava, torxes i el Shy Guy GEGEGANT
LEVELS[2] = {
  titol: '🏰 EL CASTELL! Compte amb la lava!',
  fi: 4300, flag: [4150, 380], seguent: 3,
  plataformes: [
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
  ],
  enemics: [
    ['shy',500, 60, 660, 'blue'],   ['shy',900, 780, 1140, 'red'],
    ['shy',1400, 1240, 1700, 'green'], ['shy',2000, 1800, 2180, 'pink'],
    ['shy',2500, 2280, 2840, 'blue'],  ['shy',3100, 2940, 3400, 'red'],
    ['fly',400, 100, 800, 260],    ['fly',1600, 1300, 1900, 240],
    ['fly',2400, 2200, 2800, 280], ['fly',3100, 2900, 3500, 250],
    ['spiky',1500, 1240, 1700], ['spiky',2700, 2280, 2840],
    // ===== EL BOSS: SHY GUY GEGEGANT! 3 cops amb ou! DISPARA FOC! =====
    ['boss',{x: 3750, y: 480 - 84, w: 72, h: 84, vx: 1.5, minX: 3520, maxX: 4040,
             color: 'red', hp: 3}],
  ],
  mines: [[730,400], [1750,400], [2220,400], [2880,390]],
  plantes: [[1100], [2650], [3350]],
  cors: [[2400, 300]],
  estrelles: [[1550, 220]],
  trampolins: [[650, 464]],
  blocs: [[1450, 300], [3100, 300]],
  fruites: [
    [200, 420, 4, 55, 'apple'],
    [820, 420, 3, 55, 'apple'],
    [1250, 420, 3, 55, 'grape'],
    [1900, 420, 3, 55, 'apple'],
    [2320, 320, 2, 60, 'apple'],
    [2520, 240, 1, 0, 'melon'],
    [3000, 300, 2, 60, 'apple'],
    [3300, 230, 1, 0, 'melon'],
    [3550, 420, 4, 60, 'apple'],
    [400, 420, 3, 45, 'coin'],
    [1350, 300, 3, 45, 'coin'],
    [2950, 420, 3, 45, 'coin'],
  ],
};

// ---------------------------------------------------------------
// NIVELL 3: L'ESPAI DE NIT! illes de meteorits i l'alien gegant
LEVELS[3] = {
  titol: '🌙 L\'ESPAI DE NIT! Saltes moltíssim!',
  fi: 6700, flag: [6560, 320], seguent: 4,
  plataformes: [
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
  ],
  enemics: [
    ['shy',700, 660, 830, 'blue', 440],  ['shy',1250, 1220, 1430, 'green', 430],
    ['shy',1900, 1800, 2000, 'red', 420], ['shy',2500, 2370, 2610, 'pink', 440],
    ['shy',3050, 2970, 3130, 'blue', 430], ['shy',3600, 3470, 3690, 'green', 430],
    ['shy',4150, 4070, 4270, 'red', 430], ['shy',4750, 4620, 4800, 'pink', 420],
    ['shy',5250, 5170, 5410, 'blue', 430], ['shy',5850, 5770, 5930, 'green', 430],
    ['fly',400, 320, 600, 250],   ['fly',1000, 900, 1180, 260],
    ['fly',1650, 1500, 1900, 270], ['fly',2200, 2050, 2400, 260],
    ['fly',2800, 2650, 3050, 280], ['fly',3350, 3200, 3550, 270],
    ['fly',3900, 3750, 4100, 280], ['fly',4450, 4300, 4650, 260],
    ['fly',5050, 4900, 5200, 270], ['fly',5600, 5450, 5800, 260],
    ['spiky',4200, 4070, 4270, 430],
    // ===== BOSS ESPACIAL: L'ALIEN GEGANT! 4 cops! DISPARA FOC! =====
    ['boss',{x: 6150, y: 300, baseY: 300, w: 66, h: 60, vx: 2, minX: 6060, maxX: 6480,
             fly: true, alien: true, hp: 4}],
  ],
  mines: [[600,340], [1480,380], [2050,390], [2650,350],
          [3200,400], [3750,390], [4320,380], [4870,360],
          [5450,390], [6000,330]],
  plantes: [[1250, 430], [5200, 430]],
  cors: [[2300, 260], [4500, 270]],
  estrelles: [[1600, 300], [4950, 290]],
  trampolins: [[700, 424], [3100, 414], [5530, 344]],
  blocs: [[1250, 320], [4600, 330], [5800, 340]],
  fruites: [
    [60, 370, 3, 55, 'apple'],
    [400, 330, 2, 55, 'apple'],
    [980, 310, 2, 55, 'grape'],
    [1240, 370, 3, 55, 'apple'],
    [1570, 300, 1, 0, 'melon'],
    [1800, 360, 3, 55, 'apple'],
    [2130, 280, 2, 55, 'grape'],
    [2400, 380, 3, 55, 'apple'],
    [2730, 320, 1, 0, 'melon'],
    [2980, 370, 2, 55, 'apple'],
    [3250, 300, 2, 55, 'apple'],
    [3500, 370, 3, 55, 'grape'],
    [3800, 310, 1, 0, 'melon'],
    [4080, 370, 3, 55, 'apple'],
    [4410, 290, 2, 55, 'apple'],
    [4630, 360, 2, 55, 'grape'],
    [4930, 300, 1, 0, 'melon'],
    [5200, 370, 3, 55, 'apple'],
    [5530, 310, 2, 55, 'apple'],
    [5780, 370, 3, 55, 'grape'],
    [6100, 320, 4, 60, 'apple'],
    [6480, 360, 3, 55, 'apple'],
    [700, 390, 3, 45, 'coin'],
    [2000, 380, 3, 45, 'coin'],
    [3700, 380, 3, 45, 'coin'],
    [5300, 380, 3, 45, 'coin'],
  ],
};

// ---------------------------------------------------------------
// NIVELL 4: EL CASTELL DE GLOBUS!! TOT REBOTA!
LEVELS[4] = {
  titol: '🎈 EL CASTELL DE GLOBUS! TOT REBOTA!!',
  fi: 6200, flag: [6010, 320], seguent: 5,
  plataformes: [
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
  ],
  enemics: [
    ['shy',700, 590, 930, 'pink', 470],   ['shy',1500, 1370, 1770, 'blue', 470],
    ['shy',2350, 2230, 2590, 'green', 470], ['shy',3150, 3030, 3410, 'red', 470],
    ['shy',3980, 3870, 4210, 'pink', 470],  ['shy',4750, 4670, 4950, 'blue', 470],
    ['spiky',2000, 1850, 2150, 470],
    ['fly',500, 420, 900, 240],   ['fly',1400, 1200, 1750, 250],
    ['fly',2550, 2350, 2950, 250], ['fly',3650, 3450, 4150, 240],
    ['fly',4500, 4300, 4900, 250], ['fly',5100, 4950, 5350, 240],
    // ===== EL BOSS FINAL: EL GLOBUS GEGANT!!! 5 cops d'ou! =====
    ['boss',{x: 5650, y: 250, baseY: 250, w: 90, h: 110, vx: 2.2, minX: 5430, maxX: 5880,
             fly: true, balloon: true, hp: 5}],
  ],
  plantes: [[1050, 470], [4300, 470]],
  mines: [[560,400], [1800,400], [2600,400], [3800,380], [4980,400]],
  cors: [[1600, 220], [4800, 220]],
  estrelles: [[800, 230], [4000, 230]],
  blocs: [[1150, 300], [2850, 310], [4800, 230]],
  fruites: [
    [620, 410, 3, 55, 'apple'],  [1100, 280, 2, 55, 'grape'],
    [1550, 220, 2, 55, 'apple'], [2000, 300, 3, 55, 'apple'],
    [2400, 230, 1, 0, 'melon'],  [2800, 300, 3, 55, 'apple'],
    [3200, 220, 2, 55, 'grape'], [3600, 300, 3, 55, 'apple'],
    [4050, 230, 1, 0, 'melon'],  [4450, 300, 3, 55, 'apple'],
    [4800, 220, 2, 55, 'grape'], [5150, 300, 3, 55, 'apple'],
    [5680, 360, 4, 55, 'coin'],  [6000, 350, 3, 55, 'coin'],
    [1450, 400, 3, 45, 'coin'],  [3050, 400, 3, 45, 'coin'],
    [4500, 400, 3, 45, 'coin'],
  ],
};

// ---------------------------------------------------------------
// NIVELL 5: EL RIU DE XOCOLATA!! 🍫 riu dolç → mines de xocolata
LEVELS[5] = {
  titol: '🍫 EL RIU DE XOCOLATA! Cap a les mines!',
  fi: 6900, flag: [6620, 310], seguent: 6,
  plataformes: [
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
  ],
  enemics: [
    ['shy',1150, 1125, 1310, 'red', 420],    ['shy',1700, 1660, 1860, 'blue', 420],
    ['shy',2280, 2250, 2430, 'green', 430],  ['shy',2820, 2800, 2980, 'pink', 410],
    ['shy',3600, 3570, 3770, 'blue', 420],   ['shy',4150, 4090, 4270, 'red', 430],
    ['shy',4650, 4610, 4810, 'green', 420],  ['shy',5200, 5160, 5380, 'pink', 430],
    ['shy',5760, 5730, 5910, 'blue', 420],   ['shy',6300, 6270, 6490, 'red', 430],
    ['spiky',1250, 1130, 1310, 420],  ['spiky',5200, 5160, 5380, 430],
    ['fly',500, 380, 780, 240],   ['fly',1100, 900, 1350, 250],
    ['fly',2000, 1800, 2200, 240], ['fly',2500, 2350, 2750, 250],
    ['fly',3900, 3600, 4050, 240], ['fly',4800, 4600, 5150, 250],
    ['fly',5600, 5450, 5950, 240], ['fly',6200, 6000, 6500, 250],
    // SENSE BOSS: només arribar a la bandera!!
  ],
  plantes: [[1650, 420], [4600, 420], [6260, 430]],
  mines: [[860,320], [1900,360], [2450,380], [3000,310],
          [4300,330], [5550,310], [6400,330]],
  cors: [[2550, 290], [5750, 370]],
  estrelles: [[1430, 300], [4920, 310]],
  blocs: [[900, 300], [2800, 350], [4300, 300], [5900, 320]],
  fruites: [
    [400, 330, 3, 55, 'apple'],  [900, 310, 2, 55, 'grape'],
    [1150, 370, 3, 55, 'apple'], [1450, 300, 2, 55, 'apple'],
    [1680, 370, 3, 55, 'apple'], [2000, 310, 1, 0, 'melon'],
    [2270, 380, 3, 55, 'grape'], [2560, 300, 2, 55, 'apple'],
    [2820, 360, 3, 55, 'apple'], [3120, 300, 2, 55, 'grape'],
    [3600, 370, 3, 55, 'apple'], [3900, 310, 2, 55, 'apple'],
    [4110, 380, 3, 55, 'grape'], [4370, 300, 1, 0, 'melon'],
    [4630, 370, 3, 55, 'apple'], [4930, 310, 2, 55, 'apple'],
    [5180, 380, 3, 55, 'apple'], [5500, 300, 2, 55, 'grape'],
    [5750, 370, 3, 55, 'apple'], [6030, 310, 1, 0, 'melon'],
    [6300, 380, 3, 55, 'apple'], [6600, 350, 4, 55, 'coin'],
    [700, 380, 3, 45, 'coin'],   [2100, 380, 3, 45, 'coin'],
    [3400, 380, 3, 45, 'coin'],  [4700, 380, 3, 45, 'coin'],
    [6100, 380, 3, 45, 'coin'],
  ],
};

// ---------------------------------------------------------------
// NIVELL 6: EL LABERINT DE TUBERIES!! 💩
// SÚPER LLARG i MOLT DIFÍCIL: un laberint de canonades!
LEVELS[6] = {
  titol: '💩 EL LABERINT DE TUBERIES! Venç la caca!',
  fi: 9500, flag: [9360, 370], seguent: 7,
  plataformes: [
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
  ],
  enemics: [
    // NOMÉS PEIXOS I CAQUETES — i en VAN MOLTS perquè és molt difícil!
    ['peix',650, 580, 990, 300],    ['peix',1150, 1080, 1400, 380],
    ['peix',1350, 1290, 1690, 300], ['peix',1850, 1790, 2190, 380],
    ['peix',2150, 2050, 2260, 300], ['peix',2500, 2420, 2890, 170],
    ['peix',2600, 2790, 3290, 380], ['peix',3100, 3000, 3470, 170],
    ['peix',3400, 3310, 3890, 380], ['peix',3700, 3570, 4130, 170],
    ['peix',4000, 3910, 4490, 380], ['peix',4300, 4150, 4570, 170],
    ['peix',4650, 4590, 5170, 380], ['peix',4900, 4590, 5170, 170],
    ['peix',5300, 5190, 5670, 300], ['peix',5750, 5690, 6170, 330],
    ['peix',6200, 6190, 6670, 300], ['peix',6650, 6690, 7170, 330],
    ['peix',7250, 7190, 7690, 300], ['peix',7800, 7790, 8290, 330],
    ['peix',8300, 8310, 8590, 350], ['peix',9000, 8850, 9210, 330],
    ['caca',700, 580, 990, 470],    ['caca',1150, 1080, 1490, 470],
    ['caca',1350, 1290, 1690, 470], ['caca',1850, 1790, 2190, 470],
    ['caca',2150, 2050, 2260, 470], ['caca',2900, 2790, 3290, 470],
    ['caca',3500, 3390, 3890, 470], ['caca',4100, 3990, 4490, 470],
    ['caca',4700, 4590, 5090, 470], ['caca',5300, 5190, 5590, 470],
    ['caca',5800, 5690, 6090, 470], ['caca',6300, 6190, 6590, 470],
    ['caca',6800, 6690, 7090, 470], ['caca',7300, 7190, 7690, 470],
    ['caca',7900, 7790, 8290, 470], ['caca',8450, 8390, 8590, 470],
    // ===== EL BOSS: LA CACA GEGANT!!! 💩 OBLIGATORI abans de la bandera! =====
    ['boss',{x: 8850, y: 470 - 100, w: 80, h: 100, vx: 1.5, minX: 8680, maxX: 9160,
             poop: true, hp: 5}],
  ],
  cors: [[2430, 190], [4170, 190], [7600, 380]],
  estrelles: [[3330, 190], [5700, 380], [8750, 380]],
  blocs: [[640, 300], [3050, 320], [4650, 320], [6400, 300], [9350, 290]],
  fruites: [
    [620, 420, 3, 55, 'apple'],  [1200, 420, 3, 55, 'apple'],
    [1700, 420, 3, 55, 'grape'], [2500, 200, 4, 55, 'apple'],
    [2900, 420, 3, 55, 'apple'], [3400, 200, 4, 55, 'grape'],
    [3900, 420, 3, 55, 'apple'], [4300, 200, 4, 55, 'apple'],
    [4700, 420, 3, 55, 'apple'], [4750, 200, 3, 55, 'apple'],
    [5300, 420, 3, 55, 'coin'],  [5800, 420, 3, 55, 'grape'],
    [6300, 420, 3, 55, 'apple'], [6800, 420, 3, 55, 'apple'],
    [7300, 420, 3, 55, 'coin'],  [7900, 420, 3, 55, 'apple'],
    [8700, 420, 4, 55, 'coin'],  [9300, 420, 3, 55, 'apple'],
    [2650, 420, 1, 0, 'melon'],  [5500, 200, 1, 0, 'melon'],
  ],
};

// ---------------------------------------------------------------
// NIVELL 7: LA SELVA!! 🌴 palmeres, lianes i plantes piraña
LEVELS[7] = {
  titol: '🌴 LA SELVA! Salta per les branques!',
  fi: 5600, flag: [5420, 380], seguent: 8,
  plataformes: [
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
  ],
  enemics: [
    // Shy Guys i Fly Guys de la selva
    ['shy',800, 690, 970, 'green', 480],   ['shy',1300, 1060, 1540, 'red', 480],
    ['shy',1800, 1660, 1940, 'pink', 480], ['shy',2300, 2060, 2390, 'green', 480],
    ['shy',2650, 2510, 2790, 'blue', 480], ['shy',3100, 2910, 3290, 'red', 480],
    ['shy',3600, 3410, 3690, 'pink', 480], ['shy',4000, 3810, 4140, 'green', 480],
    ['shy',4450, 4260, 4590, 'blue', 480], ['shy',5300, 5110, 5540, 'red', 480],
    ['fly',500, 350, 950, 260],   ['fly',1400, 1200, 1600, 250],
    ['fly',2100, 1960, 2450, 270], ['fly',2850, 2650, 3350, 260],
    ['fly',3700, 3500, 4150, 270], ['fly',4500, 4300, 4950, 250],
    ['fly',5100, 5000, 5450, 270],
    ['spiky',1100, 1060, 1540, 480], ['spiky',3900, 3810, 4140, 480],
    // SENSE BOSS: la selva és el premi final!
  ],
  // LA SELVA ESTA PLENA DE PLANTES PIRAÑA!!
  plantes: [[700, 480],  [1200, 480], [1700, 480],
            [2150, 480], [2600, 480], [3050, 480],
            [3550, 480], [4000, 480], [4500, 480],
            [4900, 480], [5250, 480]],
  mines: [[600, 340], [2400, 330], [4200, 340]],
  cors: [[1900, 260], [4200, 300]],
  estrelles: [[1300, 250], [3600, 310]],
  trampolins: [[560, 464], [2450, 464], [4350, 464]],
  blocs: [[950, 320], [2300, 320], [3700, 320], [4800, 320]],
  fruites: [
    [420, 330, 3, 55, 'apple'],  [700, 250, 3, 55, 'grape'],
    [920, 310, 3, 55, 'apple'],  [1280, 250, 2, 55, 'apple'],
    [1530, 320, 3, 55, 'apple'], [1880, 260, 1, 0, 'melon'],
    [2230, 310, 3, 55, 'grape'], [2580, 240, 2, 55, 'apple'],
    [2930, 310, 3, 55, 'apple'], [3280, 240, 2, 55, 'apple'],
    [3630, 310, 3, 55, 'grape'], [3980, 250, 2, 55, 'apple'],
    [4330, 320, 1, 0, 'melon'],  [4680, 250, 3, 55, 'apple'],
    [5000, 310, 3, 55, 'apple'], [5300, 400, 4, 55, 'coin'],
    [1000, 400, 3, 45, 'coin'],  [2000, 400, 3, 45, 'coin'],
    [3300, 400, 3, 45, 'coin'],  [4600, 400, 3, 45, 'coin'],
  ],
};

// ---------------------------------------------------------------
// NIVELL 8: EL CASTELL ELÈCTRIC I MECÀNIC!! ⚡🐉
// MOLT LLARG! engranatges, cables i espurnes per tot arreu!
LEVELS[8] = {
  titol: '⚡ EL CASTELL ELÈCTRIC! El drac t\'espera!',
  fi: 8800, flag: [8650, 380], seguent: 9,
  plataformes: [
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
  ],
  // 🚪 LA PORTA VERMELLA DEL BOSS! prem ↓ i entres a la sala del drac!
  portes: [{x: 7690, y: 390, w: 64, h: 90, tx: 7990, ty: 410}],
  enemics: [
    // dolents mecànics del castell!
    ['shy',700, 590, 890, 'blue', 480],   ['shy',1200, 1010, 1340, 'red', 480],
    ['shy',1600, 1460, 1790, 'green', 480], ['shy',2000, 1910, 2240, 'blue', 480],
    ['shy',2500, 2360, 2690, 'red', 480], ['shy',3300, 3210, 3490, 'pink', 480],
    ['shy',3700, 3610, 3940, 'blue', 480], ['shy',4200, 4060, 4390, 'red', 480],
    ['shy',4600, 4510, 4790, 'green', 480], ['shy',5000, 4910, 5240, 'pink', 480],
    ['shy',5500, 5360, 5690, 'blue', 480], ['shy',6000, 5810, 6140, 'red', 480],
    ['shy',6400, 6260, 6540, 'green', 480], ['shy',6800, 6660, 6990, 'pink', 480],
    ['shy',7200, 7110, 7440, 'blue', 480],
    ['fly',550, 300, 950, 280],   ['fly',1500, 1100, 1900, 260],
    ['fly',2400, 2000, 2800, 290], ['fly',3300, 2900, 3700, 270],
    ['fly',4200, 3800, 4600, 280], ['fly',5100, 4700, 5500, 260],
    ['fly',6000, 5600, 6400, 290], ['fly',6900, 6500, 7300, 270],
    ['fly',7800, 7300, 8300, 260], ['fly',8400, 8000, 8600, 290],
    ['spiky',1100, 1010, 1340, 480], ['spiky',3000, 2810, 3190, 480],
    ['spiky',4800, 4510, 4790, 480], ['spiky',6400, 6260, 6540, 480],
    // ===== EL BOSS FINAL FINAL: EL DRAC D'ELECTRICITAT!!! 🐉⚡ 6 cops! =====
    ['boss',{x: 8200, y: 260, baseY: 260, w: 130, h: 120, vx: 0, minX: 7910, maxX: 8530,
             color: 'blue', fly: true, dragon: true, asleep: true, hp: 6}],
  ],
  // mines elèctriques damunt dels forats!
  mines: [[940,350], [1820,340], [2720,350], [3520,340],
          [4420,350], [5720,340], [6570,350], [7470,340], [8400,350]],
  cors: [[1650, 280], [4400, 270], [7300, 290]],
  estrelles: [[1200, 290], [4000, 290], [6800, 290]],
  blocs: [[1200, 310], [3100, 300], [5100, 310], [7100, 290], [8600, 300]],
  fruites: [
    [400, 400, 3, 55, 'apple'],  [1100, 400, 3, 55, 'apple'],
    [1700, 400, 3, 55, 'grape'], [2300, 400, 3, 55, 'apple'],
    [2900, 400, 1, 0, 'melon'],  [3400, 400, 3, 55, 'apple'],
    [3900, 400, 3, 55, 'grape'], [4500, 400, 3, 55, 'apple'],
    [5000, 400, 1, 0, 'melon'],  [5500, 400, 3, 55, 'apple'],
    [6000, 400, 3, 55, 'grape'], [6500, 400, 3, 55, 'apple'],
    [7000, 400, 1, 0, 'melon'],  [7600, 400, 3, 55, 'apple'],
    [8200, 400, 4, 55, 'coin'],  [8650, 400, 3, 55, 'coin'],
    [1500, 280, 3, 45, 'coin'],  [3500, 280, 3, 45, 'coin'],
    [5500, 280, 3, 45, 'coin'],  [7500, 280, 3, 45, 'coin'],
  ],
};

// ---------------------------------------------------------------
// NIVELL 9: LA SAKURA I EL FUJI!! 🌸⛰️
// Bosc de sakura → escala el Mont Fuji → porta als NÚVOLS!
LEVELS[9] = {
  titol: '🌸 EL FUJI! La porta del cim t\'espera!',
  fi: 9100, flag: [8850, 200], seguent: 10,   // la bandera està ALS NÚVOLS!
  plataformes: [
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
  ],
  // 🚪 LA PORTA al cim del Fuji → et porta ALS NÚVOLS!
  portes: [{x: 6500, y: 110, w: 64, h: 90, tx: 7100, ty: 240}],
  enemics: [
    // dolents: tanukis... vull dir, Shy Guys i Fly Guys del bosc i la muntanya!
    ['shy',500, 60, 660, 'pink'],     ['shy',950, 690, 1070, 'red'],
    ['shy',1400, 1170, 1600, 'blue'], ['shy',1950, 1700, 2060, 'green'],
    ['shy',2400, 2160, 2590, 'pink'], ['shy',2900, 2690, 3210, 'red'],
    ['fly',850, 500, 1200, 300],      ['fly',1700, 1300, 2100, 280],
    ['fly',2500, 2100, 2900, 300],    ['fly',3600, 3300, 4000, 220],
    ['fly',4600, 4200, 5100, 180],    ['fly',5600, 5200, 6100, 160],
    ['fly',7200, 6900, 7600, 200],    ['fly',8100, 7800, 8500, 190],
    ['spiky',1250, 1170, 1600, 480], ['spiky',2850, 2690, 3210, 480],
    // SENSE BOSS: el Fuji i els núvols ja són premi prou gran! 🌸
  ],
  mines: [[640, 380], [1620, 390], [2610, 390], [3230, 400]],
  cors: [[1400, 300], [4800, 250], [7600, 280]],
  estrelles: [[2350, 300], [5250, 150]],
  blocs: [[1100, 330], [2800, 320], [4700, 250], [7500, 290], [8450, 220]],
  fruites: [
    // fruites: sakura → cireres i pomes; núvols → monedes!
    [300, 400, 3, 55, 'apple'],  [900, 400, 3, 55, 'grape'],
    [1500, 400, 3, 55, 'apple'], [2000, 400, 1, 0, 'melon'],
    [2500, 400, 3, 55, 'grape'], [3000, 400, 3, 55, 'apple'],
    [3400, 340, 2, 50, 'apple'], [4200, 290, 2, 50, 'grape'],
    [5000, 210, 2, 50, 'apple'], [5700, 170, 2, 50, 'grape'],
    [6200, 150, 4, 55, 'coin'],  [6500, 60, 3, 55, 'coin'],
    [7100, 250, 4, 55, 'coin'],  [7500, 280, 4, 55, 'coin'],
    [7900, 220, 4, 55, 'coin'],  [8300, 280, 4, 55, 'coin'],
    [8700, 250, 4, 55, 'coin'],  [8950, 250, 3, 55, 'coin'],
  ],
};

// ---------------------------------------------------------------
// NIVELL 10: EL CASTELL DE L'ESCALADA!! 🏰🧗
// Murs gegants! Has de PUJAR pels esglaons fins a dalt de cada torre!
LEVELS[10] = {
  titol: '🏰 ESCALA EL CASTELL! El rei volador t\'espera!',
  fi: 6150, flag: [5980, 20], seguent: 12,   // la bandera és DALT DE TOT, al terrat!
  plataformes: [
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
  ],
  enemics: [
    // dolents: Shy Guys i Fly Guys de guardia a CADA pis!
    ['shy',700, 60, 1440, 'blue', 480],     ['shy',1100, 700, 1440, 'red', 480],
    ['shy',1800, 1570, 2540, 'green', 390], ['shy',2300, 1900, 2540, 'pink', 390],
    ['shy',2900, 2670, 3640, 'blue', 300],  ['shy',3400, 3000, 3640, 'red', 300],
    ['shy',4000, 3770, 4740, 'green', 210], ['shy',4500, 4100, 4740, 'pink', 210],
    ['spiky',1000, 700, 1440, 480],  ['spiky',3200, 3000, 3640, 300],
    ['spiky',4300, 4100, 4740, 210],
    ['fly',600, 60, 1400, 300],    ['fly',1900, 1570, 2500, 220],
    ['fly',2900, 2670, 3600, 180], ['fly',4000, 3770, 4700, 120],
    ['fly',5200, 4870, 6000, 40],  ['fly',800, 500, 1400, 180],
    // ===== EL BOSS: EL FLY GUY GEGANT, REI DEL CASTELL!! 🧢👑 7 cops! =====
    ['boss',{x: 5400, y: 20, baseY: 20, w: 110, h: 90, vx: 2.4, minX: 4890, maxX: 5990,
             fly: true, flyking: true, hp: 7}],
  ],
  // mines flotant als tancaments de pis — si falles l'escala, boom!
  mines: [[1510, 300], [2610, 210], [3710, 120], [4810, 30]],
  cors: [[1900, 330], [4000, 150], [5600, 60]],
  estrelles: [[1560, 330],    // dalt del mur del pis 2!
              [3700, 150],    // dalt del mur del pis 4!
              [4860, 60]],    // dalt del mur del pis 5!!
  blocs: [[600, 320], [2000, 230], [3100, 140], [4200, 50], [5300, 60]],
  fruites: [
    [300, 400, 3, 55, 'apple'],   [700, 400, 3, 55, 'grape'],
    [1100, 400, 1, 0, 'melon'],   [1700, 310, 3, 55, 'apple'],
    [2100, 310, 3, 55, 'grape'],  [2750, 220, 3, 55, 'apple'],
    [3200, 220, 1, 0, 'melon'],   [3850, 130, 3, 55, 'apple'],
    [4300, 130, 3, 55, 'grape'],  [5000, 40, 3, 55, 'apple'],
    [5400, 40, 1, 0, 'melon'],    [5800, 40, 4, 55, 'coin'],
    [1300, 370, 3, 50, 'coin'],   [2400, 280, 3, 50, 'coin'],
    [3500, 190, 3, 50, 'coin'],   [4600, 100, 3, 50, 'coin'],
  ],
};

// ---------------------------------------------------------------
// NIVELL 12: TÒQUIO DE LEGO!!! 🏙️🧱
// MOOOOOLt llarg i cada part diferent: carrer → gratacels → temple
// → tren del cel → barri de neons → la Torre de Tòquio → el cel!
LEVELS[12] = {
  titol: '🏙️ TÒQUIO DE LEGO! La ciutat més llarga!',
  fi: 12000, flag: [11800, 380], seguent: 13,
  plataformes: [
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
  ],
  enemics: [
    // dolents per cada part de la ciutat!
    ['shy',500, 30, 760, 'red'],     ['shy',1100, 920, 1660, 'blue'],   // el carrer
    ['spiky',2200, 2110, 2250, 430], ['spiky',2400, 2360, 2500, 360], // gratacels
    ['shy',2950, 2910, 3050, 'pink', 210],
    ['fly',600, 300, 1300, 250],   ['fly',2400, 2100, 3100, 200],
    ['shy',3700, 3560, 4930, 'green'],  ['shy',4300, 3560, 4930, 'pink'], // temple
    ['fly',5300, 5000, 6100, 280], ['fly',5800, 5000, 6400, 350],   // el tren
    ['shy',7000, 6860, 7340, 'blue'], ['shy',8100, 8010, 8690, 'red'], // neons
    ['spiky',7700, 7460, 7890],
    ['fly',9000, 8800, 9400, 300], ['fly',9300, 8900, 9600, 200],   // la torre
    ['shy',11600, 11310, 11990, 'green'],                          // el final
    // SENSE BOSS! només arribar al final d'aquesta ciutat enorme! 🗼
  ],
  plantes: [[3900], [4600]],
  mines: [[7200, 420], [8550, 400]],
  cors: [[2960, 160], [5750, 260], [10600, 170]],
  estrelles: [[2200, 380], [5500, 200], [9200, 120]],
  trampolins: [[6760, 464], [11500, 464]],
  blocs: [[1050, 310], [2650, 230], [4100, 270], [6550, 400], [8100, 400], [11350, 380]],
  fruites: [
    // fruites i monedes per tota la ciutat!
    [200, 420, 4, 60, 'coin'],    [620, 260, 3, 55, 'apple'],
    [1000, 330, 3, 55, 'coin'],   [1750, 430, 3, 55, 'apple'],
    [2380, 320, 3, 55, 'coin'],   [2920, 170, 3, 55, 'melon'],
    [3600, 430, 4, 60, 'apple'],  [4050, 290, 2, 55, 'grape'],
    [4500, 430, 3, 55, 'coin'],   [5250, 260, 3, 55, 'coin'],
    [5750, 300, 3, 55, 'coin'],   [6500, 420, 4, 55, 'apple'],
    [7100, 330, 3, 55, 'coin'],   [7700, 250, 3, 55, 'coin'],
    [8350, 420, 3, 55, 'grape'],  [8900, 370, 3, 55, 'coin'],
    [9250, 120, 3, 55, 'melon'],  [10100, 340, 3, 55, 'coin'],
    [10400, 260, 3, 55, 'coin'],  [11400, 430, 4, 60, 'apple'],
    [11650, 430, 3, 55, 'coin'],
  ],
};

// ---------------------------------------------------------------
// NIVELL 13: LA FESTA DE COLORS!!! 🎉🌈
// MOOOOOOOOOOOLt llarg — 8 trams de terra amb forats, globus
// trampolí, 32 plataformes de colors i 24+ DE TOT: enemics,
// fruites, mines, plantes... LA FESTA MÉS GRAN DE TOTES!!
LEVELS[13] = {
  titol: '🎉 LA FESTA DE COLORS! Balla i salta!',
  fi: 14000, flag: [13800, 380], seguent: 14,
  plataformes: [
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
  ],
  enemics: [
    // ===== DOLENTS DE FESTA: més de 24!! =====
    ['shy',500, 60, 1550, 'red'],    ['shy',1200, 60, 1550, 'blue'],
    ['shy',2200, 1800, 3300, 'green'], ['shy',2800, 1800, 3300, 'pink'],
    ['shy',3800, 3550, 5050, 'blue'],  ['shy',4500, 3550, 5050, 'red'],
    ['shy',5600, 5300, 6800, 'green'], ['shy',6300, 5300, 6800, 'pink'],
    ['shy',7400, 7050, 8650, 'blue'],  ['shy',8000, 7050, 8650, 'red'],
    ['shy',9200, 8800, 10400, 'green'], ['shy',9900, 8800, 10400, 'pink'],
    ['shy',10800, 10550, 12100, 'blue'], ['shy',11500, 10550, 12100, 'red'],
    ['shy',12600, 12250, 13950, 'green'], ['shy',13300, 12250, 13950, 'pink'],
    ['fly',800, 100, 1600, 300],    ['fly',2000, 1800, 3300, 240],
    ['fly',4000, 3550, 5000, 260],  ['fly',5800, 5300, 6800, 240],
    ['fly',7500, 7050, 8600, 260],  ['fly',9300, 8800, 10400, 240],
    ['fly',10900, 10550, 12100, 260], ['fly',12600, 12300, 13900, 240],
    ['spiky',1500, 100, 1600],  ['spiky',3000, 1800, 3300],
    ['spiky',4800, 3550, 5050], ['spiky',6600, 5300, 6800],
    ['spiky',8400, 7050, 8650], ['spiky',10200, 8800, 10400],
    ['spiky',11900, 10550, 12100], ['spiky',13600, 12250, 13950],
    // SENSE BOSS! la festa no necessita monstres — només arribar-hi ballant!! 🎉
  ],
  plantes: [[900],  [2500], [4200], [6000],
            [7800], [9600], [11300], [13000]],
  mines: [[1800, 420], [3300, 420], [5100, 420], [6800, 420],
          [8600, 420], [10300, 420], [12000, 420], [13700, 420]],
  // regals de festa!
  cors: [[2400, 400], [6000, 400], [9600, 400], [13200, 400]],
  estrelles: [[1050, 200], [4450, 160], [8000, 160], [11500, 160]],
  blocs: [[800, 310], [2900, 260], [4700, 230], [6500, 250],
          [8300, 240], [10000, 230], [11800, 250], [13100, 340]],
  // ===== 32 LÍNIES DE FRUITES I MONEDES — pluja de dolços!! =====
  fruites: [
    [150, 420, 4, 55, 'apple'],   [500, 340, 3, 55, 'coin'],
    [900, 230, 3, 55, 'melon'],   [1400, 280, 3, 55, 'grape'],
    [1900, 420, 4, 55, 'coin'],   [2300, 320, 3, 55, 'apple'],
    [2750, 180, 3, 55, 'melon'],  [3100, 260, 3, 55, 'coin'],
    [3600, 420, 4, 55, 'grape'],  [4100, 230, 3, 55, 'coin'],
    [4500, 170, 3, 55, 'melon'],  [4900, 250, 3, 55, 'apple'],
    [5350, 420, 4, 55, 'coin'],   [5800, 250, 3, 55, 'grape'],
    [6200, 190, 3, 55, 'melon'],  [6600, 270, 3, 55, 'coin'],
    [7100, 420, 4, 55, 'apple'],  [7600, 240, 3, 55, 'coin'],
    [8000, 180, 3, 55, 'melon'],  [8400, 260, 3, 55, 'grape'],
    [8900, 420, 4, 55, 'coin'],   [9350, 230, 3, 55, 'apple'],
    [9700, 170, 3, 55, 'melon'],  [10100, 250, 3, 55, 'coin'],
    [10600, 420, 4, 55, 'grape'], [11100, 240, 3, 55, 'coin'],
    [11500, 180, 3, 55, 'melon'], [11900, 260, 3, 55, 'apple'],
    [12400, 420, 4, 55, 'coin'],  [12900, 250, 3, 55, 'melon'],
    [13300, 170, 3, 55, 'coin'],  [13700, 420, 4, 55, 'apple'],
  ],
};

// ---------------------------------------------------------------
// NIVELL 14: EL CAMP VERD DE NIT!! 🌙🌿
// VERTICAL DE VERITAT! La prada fosca a baix → espiral de fulles,
// branques i núvols que PUJA I PUJA fins al cel estrellat,
// on hi ha el NIU GEIANT amb la bandera!
LEVELS[14] = {
  titol: '🌙 EL CAMP DE NIT! Puja fins al cel estrellat!',
  fi: 1400, flag: [620, -1495], seguent: 0,   // estret! no vas endavant: vas AMUNT!
  dalt: -1520,                                 // la càmera pot pujar 2000 píxels!!
  plataformes: [
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
  ],
  enemics: [
    // dolents de nit: somnímbuls a la prada i mosques entre les fulles!
    ['shy',500, 100, 1350, 'blue'],  ['shy',1100, 800, 1350, 'red'],
    ['fly',500, 100, 1300, 330],   ['fly',900, 300, 1300, -300],
    ['fly',400, 60, 1100, -800],   ['fly',800, 400, 1300, -1100],
    ['fly',600, 300, 1200, -1340],
    ['spiky',1180, 1140, 1250, -870],   ['spiky',880, 830, 940, -950],
    // SENSE BOSS! només tu, la nit i la escalada fins al niu!! 🌙
  ],
  plantes: [[880, -440], [1200, -870]],
  mines: [[310, -660], [1200, -410]],   // mines amagades, alerta!
  // trampolins per tornar a pujar si caues!
  trampolins: [[60, 464], [1180, 464]],
  // regals del cel estrellat!
  cors: [[900, -330], [290, -1170]],
  estrelles: [[880, 10], [550, -750], [1190, -920]],
  blocs: [[600, -570], [300, -160], [1160, -920]],
  // fruites seguint l'espiral — una ruta dolça cap al cel!
  fruites: [
    [300, 350, 3, 50, 'coin'],    [600, 270, 3, 50, 'apple'],
    [900, 190, 3, 50, 'coin'],    [1170, 110, 3, 50, 'grape'],
    [850, 20, 3, 50, 'coin'],     [550, -60, 3, 50, 'melon'],
    [250, -140, 3, 50, 'coin'],   [550, -230, 3, 50, 'apple'],
    [870, -310, 3, 50, 'coin'],   [1170, -400, 3, 50, 'melon'],
    [850, -480, 3, 50, 'coin'],   [550, -560, 3, 50, 'grape'],
    [220, -660, 3, 50, 'coin'],   [520, -740, 3, 50, 'apple'],
    [850, -820, 3, 50, 'melon'],  [1160, -910, 3, 50, 'coin'],
    [850, -990, 3, 50, 'coin'],   [560, -1070, 3, 50, 'grape'],
    [260, -1160, 3, 50, 'coin'],  [560, -1240, 3, 50, 'melon'],
    [560, -1440, 4, 50, 'coin'],
  ],
};

// ==================== CONSTRUCTOR DE NIVELLS ====================
// Llegeix les DADES del nivell i omple les llistes del joc.
// Això és el que converteix una fitxa de paper en un món jugable!

// ajudants per construir nivells — els nivells nous també els poden fer servir!
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

// els tipus d'enemic que entenen les dades del nivell
const CREADORS_ENEMICS = {
  shy:   t => shy(t[1], t[2], t[3], t[4], t[5]),
  fly:   t => fly(t[1], t[2], t[3], t[4]),
  peix:  t => fishAt(t[1], t[2], t[3], t[4]),
  spiky: t => spikyAt(t[1], t[2], t[3], t[4]),
  caca:  t => poopAt(t[1], t[2], t[3], t[4]),
  boss:  t => enemies.push(Object.assign(
              {hurt: 0, alive: true, t: 0, boss: true}, t[1])),
};

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
  player.onGround = false; player.tongue = 0;   // els cors i els ous es conserven entre nivells!

  const d = LEVELS[n];
  if (!d) return;
  LEVEL_END = d.fi || 5400;
  LEVEL_TOP = d.dalt || 0;
  flag.x = d.flag[0]; flag.y = d.flag[1];
  LEVEL_TITOL = d.titol || '';
  LEVEL_NEXT = d.seguent === undefined ? n + 1 : d.seguent;

  if (d.plataformes) for (const p of d.plataformes) platforms.push(Object.assign({}, p));
  if (d.portes)      for (const p of d.portes)      doors.push(Object.assign({}, p));
  if (d.tubs)        for (const t of d.tubs)        pipes.push(Object.assign({}, t));
  if (d.enemics)     for (const e of d.enemics)     CREADORS_ENEMICS[e[0]](e);
  if (d.mines)       for (const m of d.mines)       mineAt(m[0], m[1]);
  if (d.plantes)     for (const p of d.plantes)     plantAt(p[0], p[1]);
  if (d.cors)        for (const c of d.cors)        heals.push({x: c[0], y: c[1], taken: false});
  if (d.estrelles)   for (const s of d.estrelles)   starPicks.push({x: s[0], y: s[1], taken: false});
  if (d.trampolins)  for (const t of d.trampolins)  pads.push({x: t[0], y: t[1], w: 36, h: 21});
  if (d.blocs)       for (const b of d.blocs)       qblock(b[0], b[1]);
  if (d.fruites)     for (const f of d.fruites)     addFruitLine(f[0], f[1], f[2], f[3], f[4]);
  if (d.fruitaSola)  for (const f of d.fruitaSola)  fruits.push({x: f[0], y: f[1], type: f[2], taken: false, bob: Math.random()*6});
  // un nivell també pot portar una funció "build" per fer coses especials
  if (d.build) d.build();
  // esborra els sprites del nivell anterior (només si el joc ja ha arrencat)
  if (typeof netejaSprites === 'function' && ESCENA) netejaSprites();
}
