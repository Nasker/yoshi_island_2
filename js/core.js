// ==================== CONFIG ====================
const canvas = document.getElementById('game');
const screen = canvas.getContext('2d');
const W = canvas.width, H = canvas.height;

// ESTIL ANTIC: dibuixem tot petit i l'engrandim amb píxels grossos!
const PIXEL = 3;
const pxCanvas = document.createElement('canvas');
pxCanvas.width = W / PIXEL;
pxCanvas.height = H / PIXEL;
const px = pxCanvas.getContext('2d');
px.scale(1 / PIXEL, 1 / PIXEL);
let ctx = px;
const GRAV = 0.55, JUMP = -13, FLUTTER_GRAV = 0.16, FLUTTER_MAX_FALL = 1.2;

const keys = {};
let jumpHeld = false, jumpPrevHeld = false;
addEventListener('keydown', e => {
  keys[e.code] = true;
  if (e.code === 'Space') e.preventDefault();
  if (e.repeat) return;
  // tria el nivell amb les tecles 1, 2, 3, 4 — quan vulguis!
  const lvl = {'Digit1':1,'Digit2':2,'Digit3':3,'Digit4':4,'Digit5':5,'Digit6':6,'Digit7':7,'Digit8':8,'Digit9':9,'Digit0':10,'KeyM':12,'KeyN':13,'KeyB':14}[e.code];
  if (lvl) {
    selecting = false;
    buildLevel(lvl);
    jingle([660, 880, 1100], 80);
  }
});
addEventListener('keyup', e => keys[e.code] = false);

// ==================== SO (musiqueta retro!) ====================
let AC = null;
function beep(f, t = 0.12, type = 'square', vol = 0.12, slide = 0) {
  if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
  if (AC.state === 'suspended') AC.resume();
  const o = AC.createOscillator(), g = AC.createGain();
  o.type = type;
  o.frequency.value = f;
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, f + slide), AC.currentTime + t);
  g.gain.value = vol;
  g.gain.exponentialRampToValueAtTime(0.001, AC.currentTime + t);
  o.connect(g); g.connect(AC.destination);
  o.start(); o.stop(AC.currentTime + t);
}
function jingle(notes, gap = 110) {
  notes.forEach((n, i) => setTimeout(() => beep(n, 0.15, 'square', 0.13), i * gap));
}

// ==================== BANDA SONORA CHIPTUNE! ====================
// Cada nivell té la seva melodia amb el seu ambient!
const MUSIC = {
  1: { // prat verd: alegre i ràpida!
    notes: [523,659,784,659, 880,784,659,523, 587,698,880,698,
            784,659,784,880, 1047,880,784,659, 587,659,523,0],
    bass: [131, 175, 196, 131], step: 12, wave: 'square'
  },
  2: { // castell: fosca i misteriosa
    notes: [220,0,262,220, 196,0,220,262, 330,0,262,294, 262,220,196,0],
    bass: [110, 87, 98, 110], step: 15, wave: 'triangle'
  },
  3: { // espai: flotant i brillant
    notes: [880,988,1047,988, 880,784,659,0, 587,698,880,698, 659,587,523,0],
    bass: [110, 131, 98, 131], step: 14, wave: 'sine'
  },
  4: { // castell de globus: música de festa i circ!!
    notes: [659,784,1047,784, 659,523,587,698, 784,880,988,880, 784,659,587,523, 659,698,784,0],
    bass: [131, 165, 175, 196], step: 11, wave: 'square'
  },
  5: { // riu de xocolata: melodia dolça i moguda!
    notes: [523,587,659,587, 523,440,523,587, 659,784,880,784, 659,587,698,659, 587,523,440,0],
    bass: [131, 147, 165, 147], step: 12, wave: 'triangle'
  },
  6: { // claveguera: música pudent i misteriosa, com un degoteig!
    notes: [262,0,311,262, 233,0,262,311, 392,349,311,262, 233,196,0,0],
    bass: [98, 87, 82, 87], step: 16, wave: 'triangle'
  },
  7: { // selva: ritme alegre i salvatge!
    notes: [392,440,523,440, 392,330,392,440, 523,587,659,587, 523,440,392,330, 440,523,659,0],
    bass: [98, 110, 131, 110], step: 11, wave: 'square'
  },
  8: { // castell elèctric: música intensa i mecànica de BOSS FINAL!
    notes: [659,0,659,523, 659,0,784,698, 659,523,587,523, 659,698,784,880, 988,880,784,698],
    bass: [82, 82, 98, 110], step: 9, wave: 'sawtooth'
  },
  9: { // sakura i el Fuji: melodia japonesa dolça com una flauta!
    notes: [659,0,784,880, 987,880,784,0, 659,784,659,587,
            659,0,784,880, 1175,987,880,0, 784,659,587,0],
    bass: [165, 196, 220, 165], step: 14, wave: 'triangle'
  },
  10: { // castell de l'escalada: arpegis que pugen com tu!!
    notes: [392,523,659,784, 440,587,698,880, 494,659,784,988,
            523,659,880,1047, 988,880,784,659, 587,523,440,0],
    bass: [98, 110, 123, 131], step: 10, wave: 'square'
  },
  12: { // Tòquio de Lego: J-POP chiptune urbana, ràpida i brillant!!
    notes: [784,880,988,880, 1047,988,880,784, 659,784,880,988,
            1047,1175,988,880, 784,880,659,0],
    bass: [131, 147, 165, 196], step: 9, wave: 'square'
  },
  13: { // FESTA DE COLORS: disco party chiptune, pura alegria!! 🎉
    notes: [523,659,784,1047, 880,1047,880,784, 659,784,659,523,
            587,698,880,1047, 784,880,988,0],
    bass: [131, 165, 196, 175], step: 8, wave: 'square'
  },
  14: { // CAMP DE NIT: nana dolça i tranquil·la, com un arròs de lluna 🌙
    notes: [659,0,784,0, 880,784,659,0, 587,0,659,587, 523,0,0,0,
            659,0,784,0, 880,1047,880,784, 659,587,523,0, 0,0,0,0],
    bass: [131, 165, 98, 131], step: 12, wave: 'sine'
  }
};
let musicI = 0, bassI = 0;
