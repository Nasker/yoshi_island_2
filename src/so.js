// ==================== SO (píps i efectes!) ====================
let AC = null;
function audio() {
  if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
  if (AC.state === 'suspended') AC.resume();
  return AC;
}
function beep(f, t = 0.12, type = 'square', vol = 0.12, slide = 0) {
  const ac = audio();
  const o = ac.createOscillator(), g = ac.createGain();
  o.type = type;
  o.frequency.value = f;
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, f + slide), ac.currentTime + t);
  g.gain.value = vol;
  g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + t);
  o.connect(g); g.connect(ac.destination);
  o.start(); o.stop(ac.currentTime + t);
}
function jingle(notes, gap = 110) {
  notes.forEach((n, i) => setTimeout(() => beep(n, 0.15, 'square', 0.13), i * gap));
}

// ==================== BANDA SONORA CHIPTUNE ====================
// Estil GAME BOY: 4 canals limitats però versàtils!
//   CANAL 1 (pols quadrat): la MELODIA
//   CANAL 2 (pols quadrat): l'HARMONIA — una segona veu que sona a la vegada!
//   CANAL 3 (triangle):   el BAIX, nota a nota de compàs en compàs
//   CANAL 4 (soroll):     la PERCUSSIÓ — bombo, caixa i xarèmbols
//
// Cada cançó és una petita partitura:
//   step:  quants frames dura cada nota (més petit = més ràpid!)
//   wave:  so de la melodia: 'square' | 'triangle' | 'sawtooth' | 'sine'
//   lead:  les notes de la melodia en Hz (0 = silenci)
//   harm:  de quantes escales va la 2a veu (-5 = quarta avall, -12 = octava avall)
//          o una llista de notes pròpia per fer POLIFONIA de veritat
//   bass:  les notes greus del baix (triangle)
//   drums: cadena de ritme — 'k' bombo, 's' caixa, 'h' xarèmbol, 'x' bombo+xarèmbol, '.' res

const SONGS = {
  1: { // prat verd... vull dir, EL DESERT: alegre i ràpida!
    lead: [523,659,784,659, 880,784,659,523, 587,698,880,698,
           784,659,784,880, 1047,880,784,659, 587,659,523,0],
    bass: [131, 175, 196, 131], step: 12, wave: 'square',
    harm: -5, drums: 'k..hs..hk..hs..h'
  },
  2: { // castell: fosca i misteriosa
    lead: [220,0,262,220, 196,0,220,262, 330,0,262,294, 262,220,196,0],
    bass: [110, 87, 98, 110], step: 15, wave: 'triangle',
    harm: -12, drums: 'k.....s.k...s...'
  },
  3: { // espai: flotant i brillant
    lead: [880,988,1047,988, 880,784,659,0, 587,698,880,698, 659,587,523,0],
    bass: [110, 131, 98, 131], step: 14, wave: 'sine',
    harm: -7, drums: 'k...h.s...h...hs'
  },
  4: { // castell de globus: música de festa i circ!!
    lead: [659,784,1047,784, 659,523,587,698, 784,880,988,880, 784,659,587,523, 659,698,784,0],
    bass: [131, 165, 175, 196], step: 11, wave: 'square',
    harm: -4, drums: 'k.sk.ssk.sk.ss'
  },
  5: { // riu de xocolata: melodia dolça i moguda!
    lead: [523,587,659,587, 523,440,523,587, 659,784,880,784, 659,587,698,659, 587,523,440,0],
    bass: [131, 147, 165, 147], step: 12, wave: 'triangle',
    harm: -5, drums: 'k..s.hk.hk..s.hk.h'
  },
  6: { // claveguera: música pudent i misteriosa, com un degoteig!
    lead: [262,0,311,262, 233,0,262,311, 392,349,311,262, 233,196,0,0],
    bass: [98, 87, 82, 87], step: 16, wave: 'triangle',
    harm: -12, drums: 'k.......h.s.....'
  },
  7: { // selva: ritme alegre i salvatge!
    lead: [392,440,523,440, 392,330,392,440, 523,587,659,587, 523,440,392,330, 440,523,659,0],
    bass: [98, 110, 131, 110], step: 11, wave: 'square',
    harm: -5, drums: 'kkhskkhskhskk.hs'
  },
  8: { // castell elèctric: música intensa i mecànica de BOSS FINAL!
    lead: [659,0,659,523, 659,0,784,698, 659,523,587,523, 659,698,784,880, 988,880,784,698],
    bass: [82, 82, 98, 110], step: 9, wave: 'sawtooth',
    harm: -3, drums: 'kskskskshskshsks'
  },
  9: { // sakura i el Fuji: melodia japonesa dolça com una flauta!
    lead: [659,0,784,880, 987,880,784,0, 659,784,659,587,
           659,0,784,880, 1175,987,880,0, 784,659,587,0],
    bass: [165, 196, 220, 165], step: 14, wave: 'triangle',
    harm: -12, drums: 'k...h...s...h..h'
  },
  10: { // castell de l'escalada: arpegis que pugen com tu!!
    lead: [392,523,659,784, 440,587,698,880, 494,659,784,988,
           523,659,880,1047, 988,880,784,659, 587,523,440,0],
    bass: [98, 110, 123, 131], step: 10, wave: 'square',
    harm: -5, drums: 'k.s.k.s.k.s.k.ss'
  },
  12: { // Tòquio de Lego: J-POP chiptune urbana, ràpida i brillant!!
    lead: [784,880,988,880, 1047,988,880,784, 659,784,880,988,
           1047,1175,988,880, 784,880,659,0],
    bass: [131, 147, 165, 196], step: 9, wave: 'square',
    harm: -5, drums: 'k.hskshxk.hskshh'
  },
  13: { // FESTA DE COLORS: disco party chiptune, pura alegria!!
    lead: [523,659,784,1047, 880,1047,880,784, 659,784,659,523,
           587,698,880,1047, 784,880,988,0],
    bass: [131, 165, 196, 175], step: 8, wave: 'square',
    harm: -3, drums: 'x.hsx.hsx.hsx.hs'
  },
  14: { // CAMP DE NIT: nana dolça i tranquil·la, com un arròs de lluna
    lead: [659,0,784,0, 880,784,659,0, 587,0,659,587, 523,0,0,0,
           659,0,784,0, 880,1047,880,784, 659,587,523,0, 0,0,0,0],
    bass: [131, 165, 98, 131], step: 12, wave: 'sine',
    harm: -12, drums: 'k.....h.......h.'
  },
  15: { // CASTELL VOLADOR: èpica i voladora, com un cel ple de vent!! 🏰☁️
    lead: [659,784,880,1047, 988,880,784,659, 587,659,784,880,
           1047,1175,1047,880, 784,659,587,523, 659,784,880,0],
    bass: [110, 131, 98, 110], step: 10, wave: 'square',
    harm: -4, drums: 'k.hskshxk.hskshh'
  },
  16: { // CASTELL DE VOLCANS: fosca i perillosa, com el cau d'en Kamek!! 🌋
    lead: [294,0,311,294, 262,0,294,311, 392,0,370,349, 311,294,262,0,
           294,0,311,349, 392,440,392,349, 311,294,262,0, 0,0,0,0],
    bass: [73, 82, 73, 98], step: 13, wave: 'sawtooth',
    harm: -12, drums: 'k..s..ksh..s..ksh.'
  },
  17: { // LA GRAN CURSA: ràpida i moguda, com un cotxe a tota velocitat!! 🏎️
    lead: [659,659,0,784, 880,784,659,0, 587,659,784,880,
           1047,0,988,880, 784,659,587,523, 659,784,659,0],
    bass: [131, 131, 165, 196], step: 8, wave: 'square',
    harm: -5, drums: 'xhsxhhsxxhsxhhsx'
  },
  18: { // VAGONETA AMB LUPINGS: vertigen divertit, com una muntanya russa!! 🎢
    lead: [523,659,784,659, 880,1047,880,784, 659,784,880,1047,
           1175,1047,880,784, 659,523,587,659, 784,880,784,0],
    bass: [131, 147, 165, 131], step: 9, wave: 'square',
    harm: -7, drums: 'k.hxk.hxkh.hxk.hhs'
  }
};
let musicI = 0, bassI = 0;

// ---------- CANAL 4: la percussió (soroll blanc, com el Game Boy!) ----------
let NOISE_BUF = null;
function noiseBuf() {
  const ac = audio();
  if (!NOISE_BUF) {
    NOISE_BUF = ac.createBuffer(1, ac.sampleRate * 0.5, ac.sampleRate);
    const d = NOISE_BUF.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  return NOISE_BUF;
}
// bombo: un "pum" greu que baixa de to — com una patada!
function drumKick(vol = 0.14) {
  const ac = audio();
  const o = ac.createOscillator(), g = ac.createGain();
  o.type = 'sine';
  o.frequency.value = 140;
  o.frequency.exponentialRampToValueAtTime(45, ac.currentTime + 0.1);
  g.gain.value = vol;
  g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.12);
  o.connect(g); g.connect(ac.destination);
  o.start(); o.stop(ac.currentTime + 0.12);
}
// caixa o xarèmbol: soroll filtrat — la caixa és greu i llarga, el xarèmbol agut i curt
function drumNoise(vol, dur, filt, freq) {
  const ac = audio();
  const src = ac.createBufferSource(), g = ac.createGain(), f = ac.createBiquadFilter();
  src.buffer = noiseBuf();
  f.type = filt; f.frequency.value = freq;
  g.gain.value = vol;
  g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur);
  src.connect(f); f.connect(g); g.connect(ac.destination);
  src.start(); src.stop(ac.currentTime + dur);
}
const drumSnare = () => drumNoise(0.09, 0.11, 'bandpass', 1800);
const drumHat   = () => drumNoise(0.045, 0.03, 'highpass', 7500);

// cridat cada frame des del joc: fa sonar els 4 canals alhora!
function playMusic(nivell, frame) {
  const s = SONGS[nivell];
  if (!s) return;
  if (frame % s.step === 0) {
    const i = musicI++;
    const n = s.lead[i % s.lead.length];
    if (n) {
      beep(n, 0.14, s.wave || 'square', 0.045);            // CANAL 1: melodia
      const hn = Array.isArray(s.harm) ? s.harm[i % s.harm.length] : n;
      const shift = Array.isArray(s.harm) ? 0 : (s.harm === undefined ? -5 : s.harm);
      if (hn && shift !== 0)
        beep(hn * Math.pow(2, shift / 12), 0.14, 'square', 0.022);  // CANAL 2: harmonia!
    }
    const d = s.drums ? s.drums[i % s.drums.length] : '.';  // CANAL 4: percussió
    if (d === 'k' || d === 'x') drumKick();
    if (d === 's') drumSnare();
    if (d === 'h' || d === 'x') drumHat();
  }
  if (frame % (s.step * 8) === 0)                           // CANAL 3: baix
    beep(s.bass[bassI++ % s.bass.length], 0.3, 'triangle', 0.06);
}
