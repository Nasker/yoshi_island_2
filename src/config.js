// ==================== CONFIG ====================
// El joc es veu a través d'una pantalla de 960x540 "unitats de món"
// dibuixada a una canvas petita de 320x180 (píxels grossos = estil retro!).
// Phaser fa aquest truc automàticament: camera zoom 1/3 + canvas ampliada x3.
const W = 960, H = 540;
const PIXEL = 3;                          // cada píxel retro = 3 píxels reals
const GRAV = 0.55, JUMP = -13, FLUTTER_GRAV = 0.16, FLUTTER_MAX_FALL = 1.2;

// paleta de colors del pixel art: cada lletra és un color, '.' és transparent
const PAL = {
  G:'#4CAF50', W:'#ffffff', w:'#fff8dc', K:'#222222',
  R:'#ff5252', O:'#ff9800', P:'#ffcf9e', Y:'#ffeb3b',
  F:'#ffb74d', B:'#6d4c41', p:'#ff6f91', U:'#ab47bc'
};
const ROBE = {red:'#ff5252', blue:'#42a5f5', green:'#66bb6a', pink:'#f06292'};
const S = 3;   // cada píxel del dibuix fa 3 unitats de món

// ---------- ajudants de color ----------
// converteix '#ff5252', 'rgba(0,0,0,0.3)' o 'hsl(120,90%,65%)' a {color, alpha}
function col(c, alpha) {
  if (alpha === undefined) alpha = 1;
  if (typeof c === 'number') return {color: c, alpha};
  if (c[0] === '#') return {color: parseInt(c.slice(1), 16), alpha};
  const m = c.match(/rgba?\(([^)]+)\)/);
  if (m) {
    const v = m[1].split(',').map(Number);
    return {color: (v[0] << 16) | (v[1] << 8) | v[2], alpha: alpha * (v[3] === undefined ? 1 : v[3])};
  }
  const h = c.match(/hsl\(([^)]+)\)/);
  if (h) {
    const v = h[1].split(',').map(s => parseFloat(s));
    const [r, g, b] = hslToRgb(v[0] / 360, v[1] / 100, v[2] / 100);
    return {color: (r << 16) | (g << 8) | b, alpha};
  }
  return {color: 0xff00ff, alpha};
}

function hslToRgb(h, s, l) {
  if (s === 0) { const v = Math.round(l * 255); return [v, v, v]; }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
  const f = t => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  return [Math.round(f(h + 1/3) * 255), Math.round(f(h) * 255), Math.round(f(h - 1/3) * 255)];
}

// ---------- ajudants de dibuix (Phaser Graphics) ----------
// omple un rect/cercle/el·lipse amb color CSS
function fillRect(g, x, y, w, h, c, a)  { const k = col(c, a); g.fillStyle(k.color, k.alpha); g.fillRect(x, y, w, h); }
function fillCirc(g, x, y, r, c, a)     { const k = col(c, a); g.fillStyle(k.color, k.alpha); g.fillCircle(x, y, r); }
function fillElli(g, x, y, rx, ry, c, a){ const k = col(c, a); g.fillStyle(k.color, k.alpha); g.fillEllipse(x, y, rx, ry); }
function strokeRect(g, x, y, w, h, c, lw, a) { const k = col(c, a); g.lineStyle(lw || 2, k.color, k.alpha); g.strokeRect(x, y, w, h); }
function linea(g, x0, y0, x1, y1, c, lw, a) { const k = col(c, a); g.lineStyle(lw || 2, k.color, k.alpha); g.lineBetween(x0, y0, x1, y1); }

// corba quadràtica (com ctx.quadraticCurveTo) feta de trossets de línia
function quadTo(g, x0, y0, cx, cy, x1, y1) {
  const n = 12;
  for (let i = 1; i <= n; i++) {
    const t = i / n, u = 1 - t;
    g.lineTo(u*u*x0 + 2*u*t*cx + t*t*x1, u*u*y0 + 2*u*t*cy + t*t*y1);
  }
}
// camí amb corba quadràtica: com moveTo+quadraticCurveTo del canvas
function pathQuad(g, x0, y0, cx, cy, x1, y1) {
  g.moveTo(x0, y0);
  quadTo(g, x0, y0, cx, cy, x1, y1);
}

// ==================== FÍSIQUES ====================
function rectsTouch(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
