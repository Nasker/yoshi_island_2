// ==================== JUGADOR ====================
const player = {};
function resetPlayer() {
  player.x = 60; player.y = 400;
  player.w = 40; player.h = 44;
  player.vx = 0; player.vy = 0;
  player.onGround = false;
  player.facing = 1;
  player.flutter = 60;          // combustible per planar
  player.eggs = 0;
  player.hearts = 3;
  player.inv = 0;               // invincibilitat
  player.tongue = 0;            // temporitzador de la llengua
  player.eggCooldown = 0;
  player.baby = true;           // porta el nadó Mario?
  player.babyTimer = 10;        // estrelles del compte enrere
  player.aiming = false;        // està apuntant amb l'ou?
  player.aimT = 0;
  player.pounding = false;      // super cop de cul!
  player.invStar = 0;           // invencible amb l'estrella?
}
resetPlayer();

let score = 0, camX = 0, camY = 0, won = false, gameOver = false, frame = 0;
let selecting = true;   // pantalla de triar nivell!
const eggs = [];
const shots = [];   // boles de foc dels bosses!
let babyBubble = null;

const particles = [];

// ==================== FÍSIQUES ====================
function rectsTouch(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

// ai! el Yoshi rep un cop: retroacció + el nadó marxa volant en bombolla!
function ouchPlayer(srcX) {
  const p = player;
  p.inv = 90;
  p.vx = (p.x < srcX ? -1 : 1) * 8;
  p.vy = -7;
  burst(p.x + p.w/2, p.y + p.h/2, '#ff5252');
  beep(220, 0.3, 'square', 0.18, -150);
  if (p.baby) {
    p.baby = false;
    p.babyTimer = 10;
    babyBubble = {x: p.x + p.w/2, y: p.y - 30, vx: -p.facing * 1.5, vy: -3, t: 60};
  }
}

function update() {
  frame++;
  if (won || gameOver || selecting) return;

  // BANDA SONORA: toca la melodia del nivell!
  const tune = MUSIC[levelNum];
  if (frame % tune.step === 0) {
    const n = tune.notes[musicI++ % tune.notes.length];
    if (n) beep(n, 0.14, tune.wave, 0.045);
  }
  if (frame % (tune.step * 8) === 0)
    beep(tune.bass[bassI++ % tune.bass.length], 0.3, 'triangle', 0.05);

  const p = player;

  // núvols que es mouen (i et porten si hi ets a sobre!)
  for (const pl of platforms) {
    if (!pl.move) continue;
    const oldY = pl.y;
    pl.y = pl.baseY + Math.sin(frame * pl.speed + pl.phase) * pl.amp;
    const dy = pl.y - oldY;
    if (p.onGround && Math.abs(p.y + p.h - oldY) < 4 &&
        p.x + p.w > pl.x && p.x < pl.x + pl.w) p.y += dy;
  }
  jumpHeld = !!keys['Space'];
  const jumpPressed = jumpHeld && !jumpPrevHeld;
  jumpPrevHeld = jumpHeld;

  // moviment (més ràpit quan ets invencible!)
  const SPEED = p.invStar > 0 ? 6.5 : 4.2;
  if (keys['ArrowLeft'] || keys['KeyA'])  { p.vx = -SPEED; p.facing = -1; }
  else if (keys['ArrowRight'] || keys['KeyD']) { p.vx = SPEED; p.facing = 1; }
  else p.vx *= 0.7;

  // salt + PLANAR estil Yoshi
  if (jumpPressed && p.onGround) { p.vy = JUMP; p.flutter = levelNum === 6 ? 120 : 60; beep(300, 0.15, 'square', 0.12, 400); }

  // SUPER COP DE CUL! (prem ↓ a l'aire)
  if (keys['ArrowDown'] && !p.onGround && !p.pounding) {
    p.pounding = true;
    p.vx = 0;
    beep(200, 0.15, 'square', 0.15, -100);
  }

  // a l'espai la gravetat és més baixa — SALTES MOLT MÉS ALT!
  // a les tuberies hi ha AIGUA — el Yoshi NEDA: flota i cau suaument!
  let g = levelNum === 3 ? GRAV * 0.55 : levelNum === 4 ? GRAV * 0.75 : levelNum === 6 ? GRAV * 0.4 : GRAV;
  if (!p.onGround && !p.pounding && jumpHeld && p.flutter > 0 && p.vy > -3) {
    g = FLUTTER_GRAV;
    p.flutter--;
    if (p.vy > FLUTTER_MAX_FALL) p.vy = FLUTTER_MAX_FALL;
  }
  p.vy += g;
  if (p.pounding) p.vy = 16;
  else if (p.vy > (levelNum === 6 ? 7 : 14)) p.vy = levelNum === 6 ? 7 : 14;   // a l'aigua s'enfonsa a poc a poc

  // moure X i col·lisions
  p.x += p.vx;
  for (const pl of platforms) {
    if (rectsTouch(p, pl)) {
      if (pl.hurt) {   // les PUNXES punxen també de costat!
        if (p.invStar === 0) {
          if (p.inv === 0) ouchPlayer(pl.x + pl.w/2);
          p.x += p.vx >= 0 ? -10 : 10;
        }
        continue;
      }
      if (p.vx > 0) p.x = pl.x - p.w;
      else if (p.vx < 0) p.x = pl.x + pl.w;
    }
  }
  if (p.x < 0) p.x = 0;

  // moure Y i col·lisions
  p.y += p.vy;
  p.onGround = false;
  for (const pl of platforms) {
    if (rectsTouch(p, pl)) {
      if (pl.hurt) {   // CAIUS A SOBRE LES PUNXES: ai, ai, ai!!
        if (p.invStar === 0) {
          if (p.inv === 0) ouchPlayer(pl.x + pl.w/2);
          p.vy = -8;
          p.y += p.vy;
        }
        continue;
      }
      if (p.vy > 0) {
        p.y = pl.y - p.h;
        if (pl.type === 'balloon') {
          // BOING!! els globus et fan rebotar súper alt — TOT ÉS TRAMPOLÍ!
          p.vy = -14;
          p.pounding = false;
          p.flutter = 60;
          beep(560, 0.09, 'square', 0.1, 320);
          continue;
        }
        p.onGround = true;
      }
      else if (p.vy < 0) {
        p.y = pl.y + pl.h;
        // picar un bloc "?" amb el cap → SURT UN REGAL!
        if (pl.type === 'qblock' && !pl.used) {
          pl.used = true;
          const gift = ['apple', 'grape', 'melon'][Math.floor(Math.random() * 3)];
          fruits.push({x: pl.x + pl.w/2, y: pl.y - 22, type: gift, taken: false, bob: 0});
          score += 10;
          pop('Sorpresa! +10', pl.x + pl.w/2, pl.y - 34, '#ffd700');
          beep(700, 0.15, 'square', 0.15, 300);
        }
      }
      p.vy = 0;
    }
  }
  if (p.onGround) p.flutter = levelNum === 6 ? 120 : 60;   // a l'aigua neda el doble de temps!

  // aterratge del super cop de cul: BOOM i tremolor!
  if (p.pounding && p.onGround) {
    p.pounding = false;
    shake = 12;
    beep(70, 0.25, 'sawtooth', 0.22);
    burst(p.x + p.w/2, p.y + p.h, '#c98d45');
    for (const e of enemies)
      if (e.alive && Math.abs(e.x - p.x) < 100 && Math.abs(e.y - p.y) < 80) {
        if (e.boss) {
          e.hp--; e.hurt = 25;
          if (e.hp <= 0) {
            e.alive = false; score += 200;
            pop('BOSS VENÇUT! +200', e.x, e.y - 40, '#ffd700');
            jingle([880, 660, 880, 1100], 100);
          }
        } else {
          e.alive = false;
          score += 30;
          pop('+30', e.x, e.y, '#ffd700');
        }
        burst(e.x + e.w/2, e.y, '#ff7043');
      }
  }

  // bolets trampolí: ET TIREN ENLLOIRE!
  for (const pad of pads) {
    if (p.vy > 0 && rectsTouch(p, pad)) {
      p.y = pad.y - p.h;
      p.vy = -20;
      p.flutter = 60;
      shake = 5;
      beep(180, 0.25, 'square', 0.15, 700);
      burst(p.x + p.w/2, pad.y, '#ff5252');
    }
  }

  // caiguda al forat (o a la LAVA del castell / el RIU DE XOCOLATA!)
  if (p.y > camY + H + 80 || ((levelNum === 2 || levelNum === 5 || levelNum === 6) && p.y > 505)) {
    p.hearts--;
    p.inv = 60;
    beep(300, 0.4, 'sawtooth', 0.18, -250);
    if (levelNum === 2 && p.y > 505) burst(p.x + p.w/2, 505, '#ff5722');   // splash de lava!
    if (levelNum === 5 && p.y > 505) burst(p.x + p.w/2, 505, '#6d4c41');   // xof! a la xocolata!
    if (levelNum === 6 && p.y > 505) burst(p.x + p.w/2, 505, '#29b6f6');   // splash d'aigua pudent!
    p.x = Math.max(60, camX + 60); p.y = 100; p.vy = 0;
    p.pounding = false;
    if (p.hearts <= 0) gameOver = true;
  }

  // llengua (Z)
  if (keys['KeyZ'] && p.tongue === 0) { p.tongue = 16; beep(600, 0.08, 'square', 0.1, -400); }
  if (p.tongue > 0) {
    p.tongue--;
    const t = 1 - Math.abs(p.tongue - 8) / 8;
    const len = t * 64;
    const tx = p.facing === 1 ? p.x + p.w - 6 : p.x + 6;
    const tongueRect = {x: Math.min(tx, tx + p.facing*len), y: p.y + 12, w: Math.abs(len), h: 14};
    for (const e of enemies) {
      if (e.alive && !e.boss && !e.spiky && rectsTouch(tongueRect, e)) {   // ni el boss ni els pinxos!
        e.alive = false;
        p.eggs = Math.min(p.eggs + 1, 6);
        score += 20;
        pop('+20', e.x, e.y, '#fff');
        p.tongue = 8;   // la llengua torna
        burst(e.x + e.w/2, e.y, '#ff7043');
        beep(400, 0.1, 'triangle', 0.15, 300);
      }
    }
  }

  // apuntar i llançar ou (mantén X per apuntar, deixa'l anar per tirar!)
  if (p.eggCooldown > 0) p.eggCooldown--;
  if (keys['KeyX'] && p.eggs > 0) {
    p.aiming = true;
    p.aimT += 0.07;
  } else if (p.aiming) {
    p.aiming = false;
    if (p.eggCooldown === 0) {
      p.eggs--;
      p.eggCooldown = 15;
      beep(500, 0.1, 'square', 0.12, 250);
      const ang = -Math.abs(Math.sin(p.aimT)) * 1.2 + 0.15;
      eggs.push({x: p.x + p.w/2 + p.facing*20, y: p.y + 10,
                 vx: Math.cos(ang) * p.facing * 10, vy: Math.sin(ang) * 10, bounces: 0});
    }
  }
  for (const egg of eggs) {
    egg.vy += 0.4;
    egg.x += egg.vx; egg.y += egg.vy;
    egg.dead = egg.y > H + 60;
    for (const pl of platforms)
      if (rectsTouch({x: egg.x-6, y: egg.y-6, w: 12, h: 12}, pl)) {
        if (egg.bounces < 2 && egg.vy > 0) {   // els ous boten com al Yoshi's Island!
          egg.bounces++;
          egg.y = pl.y - 8;
          egg.vy = -egg.vy * 0.6;
          egg.vx *= 0.8;
        } else {
          egg.dead = true;
          burst(egg.x, egg.y, '#fff');
        }
      }
    for (const e of enemies)
      if (e.alive && rectsTouch({x: egg.x-6, y: egg.y-6, w: 12, h: 12}, e)) {
        egg.dead = true;
        if (e.boss) {
          e.hp--; e.hurt = 25;
          shake = 10;
          beep(150, 0.2, 'sawtooth', 0.2, -80);
          burst(e.x + e.w/2, e.y + e.h/2, '#ffd700');
          if (e.hp <= 0) {
            e.alive = false;
            score += 200;
            shake = 20;
            pop('BOSS VENÇUT! +200', e.x, e.y - 40, '#ffd700');
            jingle([880, 660, 880, 1100], 100);
            burst(e.x + e.w/2, e.y, '#ff7043');
            burst(e.x + e.w/2, e.y + 40, '#ffd700');
          }
        } else {
          e.alive = false;
          score += 30;
          pop('+30', e.x, e.y, '#ffd700');
          burst(e.x + e.w/2, e.y, '#ff7043');
          beep(300, 0.15, 'square', 0.15, -200);
        }
      }
  }
  for (let i = eggs.length - 1; i >= 0; i--) if (eggs[i].dead) eggs.splice(i, 1);

  // plantes piraña: pugen i baixen mossegant!
  for (const pl of plants) {
    if (!pl.alive) continue;
    pl.t += 0.03;
    pl.pop = (Math.sin(pl.t) + 1) / 2;
    if (pl.pop > 0.55) {
      const py = pl.gy - 20 - pl.pop * 38;
      const pr = {x: pl.x - 14, y: py - 27, w: 28, h: 27};
      if (p.inv === 0 && rectsTouch(p, pr)) ouchPlayer(pl.x);
      for (const egg of eggs)
        if (rectsTouch({x: egg.x-6, y: egg.y-6, w: 12, h: 12}, pr)) {
          pl.alive = false; egg.dead = true;
          score += 30;
          burst(pl.x, py - 20, '#66bb6a');
        }
    }
  }

  // enemics
  for (const e of enemies) {
    if (!e.alive) continue;
    if (e.hurt > 0) e.hurt--;
    if (e.dragon) {
      e.t += 0.05;
      if (e.asleep) {
        e.y = e.baseY + Math.sin(e.t) * 8;   // dorm flotant suaument... 💤
      } else {
        // ENFADAT!! et PERSEGUEIX com el Bowser Jr, i més ràpid quan li queda poca vida!
        const dx = (p.x + p.w/2) - (e.x + e.w/2);
        const sp = 1.6 + (6 - e.hp) * 0.5;
        if (Math.abs(dx) > 20) e.x += Math.sign(dx) * sp;
        e.x = Math.max(e.minX, Math.min(e.maxX, e.x));
        e.y = e.baseY + Math.sin(e.t) * 60 + Math.max(-60, Math.min(80, (p.y - e.baseY) * 0.35));
        e.y = Math.max(120, Math.min(420, e.y));
      }
    } else {
      if (e.fly) {
        e.t += 0.05;
        e.y = e.baseY + Math.sin(e.t) * 22;   // vola fent ones!
      }
      e.x += e.vx;
      if (e.x < e.minX || e.x > e.maxX) { e.vx *= -1; e.x += e.vx; }
    }
    if (p.invStar > 0 && rectsTouch(p, e)) {
      // INVENCIBLE! Els enemics exploten al tocar-te!
      if (e.boss) {
        if (e.hurt === 0) { e.hp--; e.hurt = 30; }
        if (e.hp <= 0) { e.alive = false; score += 200; pop('BOSS VENÇUT! +200', e.x, e.y - 40, '#ffd700'); jingle([880, 660, 880, 1100], 100); }
      } else e.alive = false;
      score += 30;
      pop('+30', e.x, e.y, '#ffd700');
      burst(e.x + e.w/2, e.y, '#ffd700');
      beep(600, 0.1, 'square', 0.12, 300);
    } else if (!e.spiky && p.vy > 0 && p.y + p.h - e.y < 24 && rectsTouch(p, e)) {
      // AIXAFAT!! salta-li a sobre i PAM! 👟 (els pinxos NO: punxen!)
      if (e.boss) {
        if (e.hurt === 0) { e.hp--; e.hurt = 30; }
        p.vy = -11;
        burst(e.x + e.w/2, e.y, '#ffffff');
        beep(300, 0.15, 'square', 0.15, 200);
        if (e.hp <= 0) {
          e.alive = false; score += 200;
          pop('BOSS VENÇUT! +200', e.x, e.y - 40, '#ffd700');
          jingle([880, 660, 880, 1100], 100);
        }
      } else {
        e.alive = false;
        p.vy = -9;
        score += 10;
        pop('+10', e.x, e.y - 10, '#8ef0a5');
        burst(e.x + e.w/2, e.y + 10, '#ffffff');
        beep(350, 0.08, 'square', 0.12, 250);
      }
    } else if (p.inv === 0 && rectsTouch(p, e)) {
      ouchPlayer(e.x);
    }
  }
  if (p.inv > 0) p.inv--;

  // els BOSSES DISPARAN boles de foc!!
  for (const e of enemies) {
    if (!e.boss || !e.alive || e.asleep) continue;
    e.shootT = (e.shootT || 0) + 1;
    // el drac enfadat dispara MOLT més ràpid — i són LLAMPECS! ⚡
    if (e.shootT > (e.dragon ? Math.max(45, 95 - (6 - e.hp) * 8) : 110)) {
      e.shootT = 0;
      const dx = (p.x + p.w/2) - (e.x + e.w/2);
      const dy = (p.y + p.h/2) - (e.y + e.h/2);
      const d = Math.sqrt(dx*dx + dy*dy) || 1;
      const sp = e.dragon ? 6 : 4.5;
      shots.push({x: e.x + e.w/2, y: e.y + e.h/2, vx: dx/d * sp, vy: dy/d * sp, elec: !!e.dragon});
      beep(e.dragon ? 900 : 180, 0.15, 'sawtooth', 0.15, e.dragon ? -500 : -60);
    }
  }
  for (const s of shots) {
    s.x += s.vx; s.y += s.vy;
    s.dead = s.x < 0 || s.x > LEVEL_END || s.y < -50 || s.y > H + 50;
    for (const pl of platforms)
      if (rectsTouch({x: s.x-6, y: s.y-6, w: 12, h: 12}, pl)) s.dead = true;
    if (p.inv === 0 && p.invStar === 0 &&
        rectsTouch(p, {x: s.x-6, y: s.y-6, w: 12, h: 12})) {
      s.dead = true;
      ouchPlayer(s.x);
    }
  }
  for (let i = shots.length - 1; i >= 0; i--) if (shots[i].dead) shots.splice(i, 1);

  // entrar als tubs secrets prement ↓ a sobre!
  if (keys['ArrowDown'] && p.onGround) {
    for (const t of pipes) {
      if (p.x + p.w > t.x && p.x < t.x + t.w && Math.abs(p.y + p.h - t.y) < 8) {
        p.x = t.tx; p.y = t.ty; p.vy = 0;
        burst(p.x, p.y, '#37c862');
        jingle([500, 400, 600], 90);
      }
    }
    // 🚪 entrar per la PORTA VERMELLA a la sala del drac!
    for (const d of doors) {
      if (p.x + p.w > d.x && p.x < d.x + d.w && Math.abs(p.y + p.h - (d.y + d.h)) < 10) {
        p.x = d.tx; p.y = d.ty; p.vy = 0;
        burst(p.x, p.y, '#ff5252');
        jingle([300, 500, 300, 700], 90);
        const drac = enemies.find(e => e.dragon && e.alive);
        if (drac && drac.asleep) {
          drac.asleep = false;
          shake = 18;
          pop('EL DRAC S\'HA DESPERTAT!!! 🐉⚡', p.x - 60, p.y - 60, '#ffee58');
          jingle([150, 200, 300, 600], 120);
        }
      }
    }
  }

  // mines explosives!
  for (const m of mines) {
    if (!m.alive) continue;
    m.drawY = m.y + Math.sin(frame * 0.06 + m.bob) * 5;
    const mr = {x: m.x - 15, y: m.drawY - 15, w: 30, h: 30};
    if (rectsTouch(p, mr)) {
      m.alive = false;
      burst(m.x, m.drawY, '#ff9800');
      burst(m.x, m.drawY, '#ff5252');
      shake = 15;
      beep(90, 0.35, 'sawtooth', 0.25, -60);
      if (p.inv === 0 && p.invStar === 0) ouchPlayer(m.x);
    }
    for (const egg of eggs)
      if (rectsTouch({x: egg.x-6, y: egg.y-6, w: 12, h: 12}, mr)) {
        m.alive = false; egg.dead = true;
        score += 30;
        shake = 15;
        beep(90, 0.35, 'sawtooth', 0.25, -60);
        pop('+30', m.x, m.drawY, '#ffd700');
        burst(m.x, m.drawY, '#ff9800');
        burst(m.x, m.drawY, '#ffd700');
        // l'explosió també es carrega els enemics propers!
        for (const e of enemies)
          if (e.alive && Math.abs(e.x - m.x) < 90 && Math.abs(e.y - m.drawY) < 90) {
            if (e.boss) { e.hp--; e.hurt = 25; if (e.hp <= 0) { e.alive = false; score += 200; } }
            else e.alive = false;
            score += 30;
            burst(e.x + e.w/2, e.y, '#ff7043');
          }
      }
  }

  // la bombolla del nadó: rescatar-lo abans que s'acabin les estrelles!
  if (babyBubble) {
    // primer surt volant, i després flota suaument com un globus
    babyBubble.vx *= 0.97;                              // frena a poc a poc
    babyBubble.vy += (Math.sin(frame * 0.08) - babyBubble.vy) * 0.04;  // bobing suaú
    babyBubble.x += babyBubble.vx;
    babyBubble.y += babyBubble.vy;
    if (babyBubble.y < camY + 80) { babyBubble.y = camY + 80; babyBubble.vy = Math.abs(babyBubble.vy) * 0.3; }
    if (babyBubble.y > camY + H - 100) { babyBubble.y = camY + H - 100; babyBubble.vy = -Math.abs(babyBubble.vy) * 0.3; }
    if (babyBubble.x < 30) { babyBubble.x = 30; babyBubble.vx = Math.abs(babyBubble.vx) * 0.3; }
    if (babyBubble.x > LEVEL_END) { babyBubble.x = LEVEL_END; babyBubble.vx = -Math.abs(babyBubble.vx) * 0.3; }
    if (babyBubble.t > 0) babyBubble.t--;   // primer vola, després el pots agafar!
    if (frame % 50 === 0) beep(950, 0.08, 'square', 0.05, -150);   // el nadó plora: nyaaa!
    p.babyTimer -= 1/60;
    const br = {x: babyBubble.x - 18, y: babyBubble.y - 18, w: 36, h: 36};
    if (babyBubble.t <= 0 && rectsTouch(p, br)) {
      p.baby = true;
      babyBubble = null;
      jingle([660, 880, 1100], 90);
      pop('SALVAT!', p.x, p.y - 20, '#8ef0ff');
    } else if (p.babyTimer <= 0) {
      // s'han acabat les estrelles!! perds una vida i el nivell TORNA A COMENÇAR
      p.hearts--;
      babyBubble = null;
      beep(150, 0.4, 'sawtooth', 0.2, -80);
      if (p.hearts <= 0) gameOver = true;
      else buildLevel(levelNum);
    }
  }

  // fruites
  for (const f of fruits) {
    if (f.taken) continue;
    const fr = {x: f.x - 12, y: f.y - 12, w: 24, h: 24};
    if (rectsTouch(p, fr)) {
      f.taken = true;
      const pts = f.type === 'melon' ? 50 : f.type === 'grape' ? 25 : f.type === 'coin' ? 5 : 10;
      score += pts;
      pop('+' + pts, f.x, f.y - 10, '#fff');
      burst(f.x, f.y, f.type === 'melon' ? '#ffeb3b' : f.type === 'grape' ? '#ab47bc' : '#ff5252');
      if (f.type === 'melon') jingle([880, 1320], 80);
      else beep(880, 0.07, 'triangle', 0.12, 300);
    }
  }

  // cors que curesn!
  for (const h of heals) {
    if (h.taken) continue;
    const hr = {x: h.x - 12, y: h.y - 12, w: 24, h: 24};
    if (rectsTouch(p, hr)) {
      h.taken = true;
      p.hearts = Math.min(3, p.hearts + 1);
      pop('+1 VIDA!', h.x, h.y - 10, '#ff6f91');
      burst(h.x, h.y, '#ff6f91');
      jingle([700, 1050], 80);
    }
  }

  // estrella de la INVENCIBILITAT!
  for (const s of starPicks) {
    if (s.taken) continue;
    const sr = {x: s.x - 14, y: s.y - 14, w: 28, h: 28};
    if (rectsTouch(p, sr)) {
      s.taken = true;
      p.invStar = 480;
      jingle([880, 1100, 1320, 1760], 70);
      pop('INVENCIBLE!', p.x, p.y - 20, '#ffd700');
    }
  }
  if (p.invStar > 0) {
    p.invStar--;
    if (frame % 3 === 0)
      particles.push({x: p.x + Math.random()*40, y: p.y + Math.random()*44,
                      vx: (Math.random()-0.5)*2, vy: -1, life: 20,
                      color: `hsl(${Math.random()*360},90%,65%)`});
  }

  // partícules
  for (const pt of particles) {
    pt.x += pt.vx; pt.y += pt.vy; pt.vy += 0.2; pt.life--;
  }
  for (let i = particles.length - 1; i >= 0; i--) if (particles[i].life <= 0) particles.splice(i, 1);

  // números que surten volant
  for (const pt of popups) { pt.y -= 0.8; pt.life--; }
  for (let i = popups.length - 1; i >= 0; i--) if (popups[i].life <= 0) popups.splice(i, 1);
  if (shake > 0) shake--;

  // victòria! → canvi de nivell
  if (p.x + p.w > flag.x && !(levelNum === 1 && p.x > 4500)
      && !(levelNum === 14 && p.y > flag.y + 140)) {   // al 14 has de PUJAR fins a la bandera!
    if (!p.baby) {
      // no pots passar de nivell sense el nadó Mario!!
      if (frame % 60 === 0) pop('Necessites el nadó Mario!! 👶', p.x - 40, p.y - 40, '#ff8a80');
    } else if (enemies.some(e => e.boss && e.alive)) {
      // la bandera està bloquejada mentre el BOSS visqui!!
      if (frame % 60 === 0) pop('Primer venç el BOSS!! 😤', p.x - 40, p.y - 40, '#ff8a80');
    } else if (levelNum < 10) {
      buildLevel(levelNum + 1);
      jingle([523, 659, 784, 1046], 100);
    } else if (levelNum === 10) {
      buildLevel(12);   // després del castell: TÒQUIO DE LEGO!! 🗼
      jingle([523, 659, 784, 1046], 100);
    } else if (levelNum === 12) {
      buildLevel(13);   // i després de Tòquio: LA FESTA DE COLORS!! 🎉
      jingle([523, 659, 784, 1046], 100);
    } else if (levelNum === 13) {
      buildLevel(14);   // i després de la festa: el CAMP DE NIT VERTICAL!! 🌙
      jingle([523, 659, 784, 1046], 100);
    } else {
      won = true;
    }
  }

  // càmera
  camX = Math.max(0, Math.min(p.x - W*0.4, LEVEL_END - W + 100));
  // càmera VERTICAL: al nivell 14 et segueix mentre puges al cel!! ⬆️
  camY = levelNum === 14 ? Math.max(LEVEL_TOP, Math.min(p.y - H*0.55, 0)) : 0;
}

function burst(x, y, color) {
  for (let i = 0; i < 10; i++)
    particles.push({x, y, vx: (Math.random()-0.5)*6, vy: -Math.random()*5, life: 25, color});
}

// ==================== DIBUIX PRINCIPAL ====================
function draw() {
  drawBackground();
  ctx.save();
  // TREMOLOR quan hi ha explosions!
  ctx.translate(-camX + (Math.random()-0.5) * shake, -camY + (Math.random()-0.5) * shake);

  drawDecor();
  // LA LAVA que bulla al castell!!
  if (levelNum === 2) {
    ctx.fillStyle = '#ff5722';
    ctx.fillRect(camX - 50, 505, W + 100, 60);
    ctx.fillStyle = '#ffca28';
    for (let i = 0; i < 14; i++) {
      const bx = camX - 20 + (i * 137 + frame * 1.5) % (W + 40);
      const by = 508 + Math.sin(frame * 0.12 + i * 2) * 4;
      ctx.beginPath(); ctx.arc(bx, by, 4 + (i % 3) * 2, 0, 7); ctx.fill();
    }
    ctx.fillStyle = '#ff8a65';
    ctx.fillRect(camX - 50, 505, W + 100, 6);
  }
  // EL RIU DE XOCOLATA que fa bombolles!! 🍫
  if (levelNum === 5) {
    ctx.fillStyle = '#6d4c41';
    ctx.fillRect(camX - 50, 505, W + 100, 60);
    ctx.fillStyle = '#4e342e';
    for (let i = 0; i < 14; i++) {
      const bx = camX - 20 + (i * 137 + frame * 1.2) % (W + 40);
      const by = 510 + Math.sin(frame * 0.1 + i * 2) * 4;
      ctx.beginPath(); ctx.arc(bx, by, 4 + (i % 3) * 2, 0, 7); ctx.fill();
    }
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(camX - 50, 505, W + 100, 6);
  }
  // AIGUA DE CLAVEGUERA que fa bombolles... pfeee!
  if (levelNum === 6) {
    ctx.fillStyle = '#12736b';
    ctx.fillRect(camX - 50, 505, W + 100, 60);
    ctx.fillStyle = '#0d4f4a';
    for (let i = 0; i < 14; i++) {
      const bx = camX - 20 + (i * 137 + frame * 1.4) % (W + 40);
      const by = 510 + Math.sin(frame * 0.11 + i * 2) * 4;
      ctx.beginPath(); ctx.arc(bx, by, 4 + (i % 3) * 2, 0, 7); ctx.fill();
    }
    ctx.fillStyle = '#1ba29a';
    ctx.fillRect(camX - 50, 505, W + 100, 6);
  }
  for (const pl of platforms) drawPlatform(pl);
  for (const t of pipes) drawPipe(t);
  for (const d of doors) drawDoor(d);
  if (levelNum === 1) drawCastle(7950);   // el castell del pati, al costat de la bandera!
  drawFlag();
  for (const f of fruits) if (!f.taken) drawFruit(f);
  for (const m of mines) if (m.alive) drawMine(m);
  for (const pl of plants) if (pl.alive) drawPlant(pl);
  for (const pad of pads) drawSprite(BOUNCE, pad.x, pad.y);
  for (const s of starPicks) if (!s.taken)
    drawSprite(STAR, s.x - 4.5*S, s.y - 3.5*S + Math.sin(frame * 0.08 + s.x) * 4);
  for (const h of heals) if (!h.taken)
    drawSprite(HEART, h.x - 4*S, h.y - 4*S + Math.sin(frame * 0.1) * 3);
  for (const e of enemies) if (e.alive) drawEnemy(e);
  for (const egg of eggs) drawEgg(egg);
  for (const s of shots) {
    if (s.elec) drawBolt(s);
    else drawSprite(SHOT, s.x - 3*S, s.y - 3*S, false, levelNum === 6 ? {O:'#8d6e63', Y:'#6d4c41'} : null);
  }
  drawDino(player);
  if (babyBubble) drawBubble(babyBubble);

  // fletxa de punteria de l'ou (es mou sola!)
  if (player.aiming) {
    const ang = -Math.abs(Math.sin(player.aimT)) * 1.2 + 0.15;
    const ax = player.x + player.w/2, ay = player.y + 12;
    ctx.strokeStyle = '#ff5252';
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(ax + Math.cos(ang) * player.facing * 90, ay + Math.sin(ang) * 90);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#ff5252';
    ctx.beginPath();
    ctx.arc(ax + Math.cos(ang) * player.facing * 90, ay + Math.sin(ang) * 90, 6, 0, 7);
    ctx.fill();
  }

  for (const pt of particles) {
    ctx.globalAlpha = pt.life / 25;
    ctx.fillStyle = pt.color;
    ctx.beginPath(); ctx.arc(pt.x, pt.y, 4, 0, 7); ctx.fill();
    ctx.globalAlpha = 1;
  }

  // números que surten volant (+50!)
  ctx.font = 'bold 18px monospace';
  ctx.textAlign = 'center';
  for (const pt of popups) {
    ctx.globalAlpha = pt.life / 50;
    ctx.fillStyle = pt.color;
    ctx.fillText(pt.text, pt.x, pt.y);
  }
  ctx.globalAlpha = 1;
  ctx.textAlign = 'left';
  ctx.restore();

  // HUD
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(0, 0, W, 44);
  ctx.fillStyle = 'white';
  ctx.font = 'bold 20px monospace';
  drawSprite(STAR, 14, 10);
  ctx.fillText('' + score, 45, 30);
  drawSprite(EGG, 130, 10);
  ctx.fillText('x' + player.eggs, 155, 30);
  for (let i = 0; i < 3; i++) {
    ctx.globalAlpha = i < player.hearts ? 1 : 0.25;
    drawSprite(HEART, 230 + i * 32, 12);
  }
  ctx.globalAlpha = 1;

  // compte enrere del nadó Mario
  if (babyBubble) {
    ctx.font = 'bold 28px monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = (player.babyTimer < 4 && frame % 20 < 10) ? '#ff5252' : '#ffd700';
    ctx.fillText(Math.ceil(player.babyTimer) + '', W/2 + 20, 36);
    drawSprite(STAR, W/2 - 25, 8);
    ctx.textAlign = 'left';
    ctx.font = 'bold 20px monospace';
  }

  // cartell de nivell al començament (com als jocs antics!)
  if (frame - levelStart < 150) {
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, H/2 - 70, W, 120);
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 60px "Comic Sans MS", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('NIVELL ' + levelNum, W/2, H/2 + 10);
    ctx.font = '22px "Comic Sans MS", sans-serif';
    ctx.fillStyle = 'white';
    ctx.fillText(levelNum === 1 ? 'Salva el nadó Mario!'
               : levelNum === 2 ? '🏰 EL CASTELL! Compte amb la lava!'
               : levelNum === 3 ? '🌙 L\'ESPAI DE NIT! Saltes moltíssim!'
               : levelNum === 4 ? '🎈 EL CASTELL DE GLOBUS! TOT REBOTA!!'
               : levelNum === 5 ? '🍫 EL RIU DE XOCOLATA! Cap a les mines!'
               : levelNum === 6 ? '💩 EL LABERINT DE TUBERIES! Venç la caca!'
               : levelNum === 7 ? '🌴 LA SELVA! Salta per les branques!'
               : levelNum === 8 ? '⚡ EL CASTELL ELÈCTRIC! El drac t\'espera!'
               : levelNum === 9 ? '🌸 EL FUJI! La porta del cim t\'espera!'
               : levelNum === 10 ? '🏰 ESCALA EL CASTELL! El rei volador t\'espera!'
               : levelNum === 12 ? '🏙️ TÒQUIO DE LEGO! La ciutat més llarga!'
               : levelNum === 13 ? '🎉 LA FESTA DE COLORS! Balla i salta!'
               : '🌙 EL CAMP DE NIT! Puja fins al cel estrellat!', W/2, H/2 + 42);
    ctx.textAlign = 'left';
  }

  if (won) {
    if (!wonPlayed) {
      wonPlayed = true;
      jingle([523, 659, 784, 1046, 784, 1046, 1318], 110);   // fanfària!
    }
    ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#ffd700'; ctx.font = 'bold 48px "Comic Sans MS"';
    ctx.textAlign = 'center';
    ctx.fillText('🎉 HAS GUANYAT! 🎉', W/2, H/2 - 30);
    ctx.fillStyle = 'white'; ctx.font = '28px "Comic Sans MS"';
    ctx.fillText('Punts: ' + score, W/2, H/2 + 20);
    ctx.fillText('Prem R per tornar a jugar', W/2, H/2 + 65);
    ctx.textAlign = 'left';
    if (keys['KeyR']) location.reload();
  }
  if (gameOver) {
    if (!overPlayed) {
      overPlayed = true;
      jingle([400, 350, 300, 200], 160);   // musiqueta trista...
    }
    ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#ff8a80'; ctx.font = 'bold 48px "Comic Sans MS"';
    ctx.textAlign = 'center';
    ctx.fillText('😢 FI DE LA PARTIDA', W/2, H/2 - 20);
    ctx.fillStyle = 'white'; ctx.font = '28px "Comic Sans MS"';
    ctx.fillText('Prem R per tornar-ho a intentar', W/2, H/2 + 40);
    ctx.textAlign = 'left';
    if (keys['KeyR']) location.reload();
  }

  // ===== PANTALLA DE TRIAR NIVELL =====
  if (selecting) {
    ctx.fillStyle = 'rgba(30,10,50,0.85)';
    ctx.fillRect(0, 0, W, H);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffd700'; ctx.font = 'bold 42px "Comic Sans MS", sans-serif';
    ctx.fillText("🦕 EL JOC DE L'UNAI 🦕", W/2, H/2 - 140);
    ctx.fillStyle = 'white'; ctx.font = 'bold 24px "Comic Sans MS", sans-serif';
    ctx.fillText('TRIA EL NIVELL! Prem una tecla:', W/2, H/2 - 80);
    ctx.font = '20px "Comic Sans MS", sans-serif';
    const nivells = [
      ['#8ef0a5', '1   🏜️ El Desert i el Castell'],
      ['#c9b8ff', '2   🏰 El Castell de Lava'],
      ['#8ecfff', "3   🌙 L'Espai de Nit"],
      ['#ff9fd4', '4   🎈 El Castell de Globus'],
      ['#d7a06a', '5   🍫 El Riu de Xocolata'],
      ['#7fd8c9', "6   💩 Les Tuberies d'Aigua"],
      ['#8ef0a5', '7   🌴 La Selva'],
      ['#ffe082', '8   ⚡ El Castell Elèctric'],
      ['#ffb7d5', '9   🌸 La Sakura i el Fuji'],
      ['#b3c5ff', "0   🏰 El Castell de l'Escalada"],
      ['#ff8a80', 'M   🏙️ TÒQUIO DE LEGO'],
      ['#ffee58', 'N   🎉 LA FESTA DE COLORS!!'],
    ];
    const dreta = ['#b9f6ca', 'B   🌙 EL CAMP DE NIT (VERTICAL!)'];
    // dues columnes: 7 a l'esquerra, 6 a la dreta — hi cap tot!!
    for (let i = 0; i < 7; i++) {
      ctx.fillStyle = nivells[i][0];
      ctx.fillText(nivells[i][1], W/4, H/2 - 100 + i * 52);
    }
    for (let i = 7; i < nivells.length; i++) {
      ctx.fillStyle = nivells[i][0];
      ctx.fillText(nivells[i][1], W*3/4, H/2 - 100 + (i - 7) * 52);
    }
    ctx.fillStyle = dreta[0];
    ctx.fillText(dreta[1], W*3/4, H/2 - 100 + (nivells.length - 7) * 52);
    ctx.fillStyle = '#aaa'; ctx.font = '16px "Comic Sans MS", sans-serif';
    ctx.fillText('Pista: mentre jugues, prem la tecla d\'un nivell per saltar-hi!', W/2, H - 18);
    ctx.textAlign = 'left';
  }

  // ===== TRUC RETRO: engrandim tot pixelat =====
  screen.imageSmoothingEnabled = false;
  screen.drawImage(pxCanvas, 0, 0, W, H);

  // ===== EL POSHI EN ALTA RESOLUCIÓ!! 🐤 =====
  // el dibuixem DESPRÉS del pixelat: es veu gran i amb TOT el detall!
  if (POSHI_OK && !selecting) {
    const ph = 76;   // alçada en píxels de pantalla — ben gran!
    const pw = ph * POSHI_IMG.width / POSHI_IMG.height;
    // coordenades del món → pantalla (cada unitat del món = 1 píxel de pantalla)
    const sx = player.x + player.w/2 - camX - pw/2;
    const sy = player.y + player.h - ph - camY;   // quan la càmera puja, el Poshi també!
    screen.save();
    screen.imageSmoothingEnabled = true;   // suau, perquè es vegi el dibuix real
    if (player.inv > 0 && frame % 6 < 3) screen.globalAlpha = 0.35;
    // el dibuix original mira cap a l'ESQUERRA — el girem quan va a la dreta!
    if (player.facing === 1) {
      screen.translate(sx + pw, sy);
      screen.scale(-1, 1);
      screen.drawImage(POSHI_IMG, 0, 0, pw, ph);
    } else {
      screen.drawImage(POSHI_IMG, sx, sy, pw, ph);
    }
    screen.restore();
  }
  // gra de paper, com si estigués dibuixat amb ceres!
  screen.fillStyle = 'rgba(255,255,255,0.05)';
  for (let i = 0; i < 120; i++)
    screen.fillRect(Math.random() * W, Math.random() * H, 2, 2);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}
buildLevel(1);
loop();
