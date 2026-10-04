// ==================== NIVELL D'EXEMPLE ====================
// Copia aquest fitxer, canvia el número i fes el teu nivell!
// Totes les mesures són píxels del món (la pantalla fa 960 x 540).

registraNivell(16, {
  titol: 'El meu nivell!',       // el cartell del començament
  fi: 3000,                       // fins on arriba el món
  flag: [2850, 380],              // on és la bandera final
  seguent: 0,                     // 0 = HAS GUANYAT! (o el número d'un altre nivell)

  // ------ PLATAFORMES ------
  // tipus: ground rock sand snow ice cloud balloon spikes choco lego
  //        metal night party pipec tower qblock
  // extres:  move:true baseY:N amp:N speed:N phase:N   → plataforma que es mou!
  //          hurt:true                                 → punxa!
  //          down:true                                  → punxes penjades del sostre
  plataformes: [
    {x:0,    y:480, w:3000, h:60,  type:'ground'},     // el terra
    {x:400,  y:380, w:200,  h:40,  type:'rock'},
    {x:700,  y:300, w:150,  h:40,  type:'cloud', move:true, baseY:300, amp:30, speed:0.03, phase:0},
    {x:1400, y:460, w:200,  h:20,  type:'spikes', hurt:true},  // punxes, ai!
  ],

  // ------ ENEMICS ------
  // cada enemic és una fila: [tipus, x, minX, maxX, ...]
  //   'shy'   [ 'shy',   x, minX, maxX, color, alturaTerra ]
  //   'fly'   [ 'fly',   x, minX, maxX, alturaDeVol ]
  //   'peix'  [ 'peix',  x, minX, maxX, alturaDeNedar ]
  //   'caca'  [ 'caca',  x, minX, maxX, alturaTerra ]
  //   'spiky' [ 'spiky', x, minX, maxX, alturaTerra ]   ← punxa, no es pot xafar!
  //   'boss'  [ 'boss', {x, y, baseY, w, h, vx, minX, maxX, hp, ...} ]
  enemics: [
    ['shy',   600,  520, 750,  'red'],
    ['fly',   900,  820, 1000, 280],
    ['spiky', 1200, 1150, 1300],
  ],

  // ------ REGALS I PERILLS ------
  blocs:      [[1000, 420]],            // blocs "?" amb fruites sorpresa
  plantes:    [[1600, 480]],            // plantes piraña (x, terra)
  mines:      [[2000, 300]],            // mines que exploten!
  cors:       [[2200, 400]],            // cors que curen
  estrelles:  [[2400, 300]],            // estrelles d'invencibilitat!
  trampolins: [[1800, 464]],            // bolets trampolí
  tubs:       [],                       // tubs: {x,y,w, tx,ty} → prem ↓ a sobre i viatges!
  portes:     [],                       // portes: {x,y,w,h, tx,ty} → prem ↓ davant

  // ------ FRUITES ------
  // fruitaSola: una fruita sola → [x, y, 'apple'|'grape'|'melon'|'coin']
  fruitaSola: [
    [500, 340, 'apple'], [540, 340, 'apple'],
    [1100, 360, 'melon'],      // el meló-trésor, val 50 punts!
  ],
  // fruites: files senceres → [x, y, quantes, separació, tipus]
  fruites: [
    [700, 250, 4, 40, 'coin'],
  ],
});
