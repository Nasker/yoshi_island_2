// ==================== EL JOC (escena Phaser) ====================
// Aquesta és la part que mou tot: la lògica del joc és LA MATEIXA que abans,
// només que ara Phaser s'encarrega del bucle, la càmera i els sprites.

// ---------- estat del jugador ----------
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
  player.maxHearts = 3;         // el nivell de la cursa en dona 8!
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
const keys = {};
let jumpHeld = false, jumpPrevHeld = false;

// ai! el Poshi rep un cop: retroacció + el nadó marxa volant en bombolla!
function ouchPlayer(srcX) {
  const p = player;
  p.inv = 90;
  p.vx = (p.x < srcX ? -1 : 1) * 8;
  p.vy = -7;
  burst(p.x + p.w/2, p.y + p.h/2, '#ff5252');
  beep(220, 0.3, 'square', 0.18, -150);
  if (p.baby && !COTXE) {
    p.baby = false;
    p.babyTimer = 10;
    babyBubble = {x: p.x + p.w/2, y: p.y - 30, vx: -p.facing * 1.5, vy: -3, t: 60};
  }
  // amb cotxe el nadó va ben cordat amb el cinturó! 🚗👶
  // però el cop costa un cor — els accidents fan mal!
  if (COTXE) { p.hearts--; if (p.hearts <= 0) gameOver = true; }
}

function burst(x, y, color) {
  for (let i = 0; i < 10; i++)
    particles.push({x, y, vx: (Math.random()-0.5)*6, vy: -Math.random()*5, life: 25, color});
}

// la CUA de la cobra: el tros de darrere del cos, l'únic punt dèbil!
function cuaCobra(e) {
  return {x: e.vx > 0 ? e.x : e.x + e.w - 50, y: e.y + e.h * 0.4, w: 50, h: e.h * 0.6};
}

// ==================== UPDATE: tota la lògica del joc ====================
function update() {
  frame++;
  if (won || gameOver || selecting) return;

  // BANDA SONORA: 4 canals estil Game Boy (melodia + harmonia + baix + drums!)
  playMusic(levelNum, frame);

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

  // VROOOM!! 🏎️ en mode COTXE el cotxe accelera SOL i cada cop més ràpid!
  if (COTXE) {
    p.vx = 4.2 + Math.min(4.5, (frame - levelStart) * 0.0015);
    p.facing = 1;
  }

  // ===== LUUUUPING!!! 🎢 la vagoneta agafa el cercle i dona la volta sencera!! =====
  if (VAGO && !p.loop) {
    for (const lp of loopins)
      if (p.onGround && Math.abs(p.x + p.w/2 - lp.x) < 26) {
        p.loop = {cx: lp.x, cy: lp.y - lp.r, r: lp.r, th: Math.PI/2};
        shake = 6;
        pop('LUPING!!! 🎢', lp.x - 70, lp.y - lp.r * 2 - 20, '#ffee58');
        jingle([400, 550, 700, 900, 1100], 60);
      }
  }
  if (p.loop) {
    // enganxada al cercle: gira tanta volta com velocitat porti!
    const L = p.loop;
    L.th -= p.vx / L.r;
    p.x = L.cx + Math.cos(L.th) * L.r - p.w/2;
    p.y = L.cy + Math.sin(L.th) * L.r - p.h;
    p.vy = 0; p.onGround = false;
    if (frame % 12 === 0) beep(300 + (Math.PI/2 - L.th) * 60, 0.05, 'square', 0.05);  // fiu fiuuu!
    if (L.th <= Math.PI/2 - Math.PI * 2) {   // volta sencera completada!!
      p.loop = null;
      p.y = L.cy + L.r - p.h;
      p.onGround = true;
      shake = 5;
      burst(p.x + p.w/2, p.y + p.h, '#ffee58');
      jingle([1100, 900, 1100, 1400], 70);
    }
    // durant el luping no hi ha gravetat ni enemics — NOMÉS LA VOLTA!
    camX = Math.max(0, Math.min(p.x - W*0.4, LEVEL_END - W + 100));
    camY = 0;
    for (const pt of particles) { pt.x += pt.vx; pt.y += pt.vy; pt.vy += 0.2; pt.life--; }
    for (let i = particles.length - 1; i >= 0; i--) if (particles[i].life <= 0) particles.splice(i, 1);
    for (const pt of popups) { pt.y -= 0.8; pt.life--; }
    for (let i = popups.length - 1; i >= 0; i--) if (popups[i].life <= 0) popups.splice(i, 1);
    if (shake > 0) shake--;
    return;
  }

  // salt + PLANAR estil Yoshi
  if (jumpPressed && p.onGround) { p.vy = JUMP; p.flutter = levelNum === 6 ? 120 : 60; beep(300, 0.15, 'square', 0.12, 400); }

  // SUPER COP DE CUL! (prem ↓ a l'aire) — el cotxe NO en sap fer!
  if (keys['ArrowDown'] && !p.onGround && !p.pounding && !COTXE) {
    p.pounding = true;
    p.vx = 0;
    beep(200, 0.15, 'square', 0.15, -100);
  }

  // a l'espai la gravetat és més baixa — SALTES MOLT MÉS ALT!
  // a les tuberies hi ha AIGUA — el Poshi NEDA: flota i cau suaument!
  let g = levelNum === 3 ? GRAV * 0.55 : levelNum === 4 ? GRAV * 0.75 : levelNum === 6 ? GRAV * 0.4 : GRAV;
  if (!p.onGround && !p.pounding && !COTXE && jumpHeld && p.flutter > 0 && p.vy > -3) {
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
      if (e.alive && !e.serp && Math.abs(e.x - p.x) < 100 && Math.abs(e.y - p.y) < 80) {
        if (e.cobra) {
          // el cop de cul també funciona — però NOMÉS a la cua!
          const cua = cuaCobra(e);
          if (rectsTouch(p, cua)) {
            e.hp--; e.hurt = 25;
            burst(cua.x + cua.w/2, cua.y + cua.h/2, '#ffd700');
            if (e.hp <= 0) {
              e.alive = false; score += 300; shake = 25;
              pop('COBRA VENÇUDA!! +300', e.x + e.w/2, e.y - 40, '#ffd700');
              jingle([880, 660, 880, 1100, 1320], 100);
            }
          }
        } else if (e.boss) {
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

  // caiguda al forat (o a la LAVA del castell / el RIU DE XOCOLATA / EL MAR!)
  if (p.y > camY + H + 80 || ((levelNum === 2 || levelNum === 5 || levelNum === 6 || levelNum === 15 || levelNum === 16) && p.y > 505)) {
    p.hearts--;
    p.inv = 60;
    beep(300, 0.4, 'sawtooth', 0.18, -250);
    if (levelNum === 2 && p.y > 505) burst(p.x + p.w/2, 505, '#ff5722');   // splash de lava!
    if (levelNum === 5 && p.y > 505) burst(p.x + p.w/2, 505, '#6d4c41');   // xof! a la xocolata!
    if (levelNum === 6 && p.y > 505) burst(p.x + p.w/2, 505, '#29b6f6');   // splash d'aigua pudent!
    if (levelNum === 15 && p.y > 505) burst(p.x + p.w/2, 505, '#0288d1');  // splash al MAR! 🌊
    if (levelNum === 16 && p.y > 505)  // al 16: lava al castell, mar al final!
      burst(p.x + p.w/2, 505, p.x > 12000 ? '#0288d1' : '#ff5722');
    // torna a aparèixer a la plataforma segura més propera (molt útil sobre el mar!)
    let ref = null;
    for (const pl of platforms)
      if (!pl.hurt && p.x + p.w > pl.x && p.x < pl.x + pl.w && (!ref || pl.y > ref.y)) ref = pl;
    if (!ref)
      for (const pl of platforms)
        if (!pl.hurt && pl.x + pl.w <= p.x && (!ref || pl.x > ref.x)) ref = pl;
    if (ref) {
      p.x = Math.min(Math.max(p.x, ref.x + 10), ref.x + ref.w - p.w - 10);
      p.y = ref.y - p.h - 5;
    } else {
      p.x = Math.max(60, camX + 60); p.y = 100;
    }
    p.vy = 0;
    p.pounding = false;
    if (p.hearts <= 0) gameOver = true;
  }

  // llengua (Z)
  if (keys['KeyZ'] && p.tongue === 0 && !COTXE) { p.tongue = 16; beep(600, 0.08, 'square', 0.1, -400); }
  if (p.tongue > 0) {
    p.tongue--;
    const t = 1 - Math.abs(p.tongue - 8) / 8;
    const len = t * 64;
    const tx = p.facing === 1 ? p.x + p.w - 6 : p.x + 6;
    const tongueRect = {x: Math.min(tx, tx + p.facing*len), y: p.y + 12, w: Math.abs(len), h: 14};
    for (const e of enemies) {
      if (e.alive && !e.boss && !e.spiky && !e.serp && rectsTouch(tongueRect, e)) {   // ni el boss, ni els pinxos, ni la serp de Kamek!
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
  if (keys['KeyX'] && p.eggs > 0 && !COTXE) {
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
    egg.dead = egg.y > camY + H + 60;
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
        if (e.cobra) {
          // la COBRA només és vulnerable a la CUA!! 🐍
          const cua = cuaCobra(e);
          if (rectsTouch({x: egg.x-6, y: egg.y-6, w: 12, h: 12}, cua)) {
            e.hp--; e.hurt = 25;
            shake = 10;
            beep(150, 0.2, 'sawtooth', 0.2, -80);
            burst(cua.x + cua.w/2, cua.y + cua.h/2, '#ffd700');
            if (e.hp <= 0) {
              e.alive = false; score += 300;
              shake = 25;
              pop('COBRA VENÇUDA!! +300', e.x + e.w/2, e.y - 40, '#ffd700');
              jingle([880, 660, 880, 1100, 1320], 100);
              burst(e.x + e.w/2, e.y, '#ff7043');
              burst(e.x + e.w/2, e.y + 40, '#ffd700');
            }
          } else {
            // CLONK! l'ou rebota — el cos és dur com una roca!
            beep(900, 0.08, 'square', 0.1, -300);
            pop('Apunta a la CUA! 🐍', egg.x - 40, egg.y - 30, '#ffee58');
          }
        } else if (e.serp) {
          // la serp de Kamek és MÀGICA: els ous hi reboten! 🐍✨
          beep(900, 0.08, 'square', 0.1, -300);
        } else if (e.boss) {
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
    } else if (e.kamekBoss) {
      // EN KAMEK GEGANT: et persegueix per tot el mar, com el Bowser Jr!! 🧙
      e.t += 0.05;
      const dx = (p.x + p.w/2) - (e.x + e.w/2);
      const sp = 1.8 + (8 - e.hp) * 0.4;      // més ràpid quan li queda poca vida!
      if (Math.abs(dx) > 30) { e.x += Math.sign(dx) * sp; e.vx = Math.sign(dx) * 2.2; }
      e.x = Math.max(e.minX, Math.min(e.maxX, e.x));
      e.y = e.baseY + Math.sin(e.t) * 50 + Math.max(-50, Math.min(70, (p.y - e.baseY) * 0.3));
      e.y = Math.max(140, Math.min(410, e.y));
    } else {
      if (e.fly) {
        e.t += 0.05;
        e.y = e.baseY + Math.sin(e.t) * 22;   // vola fent ones!
      }
      e.x += e.vx;
      if (e.x < e.minX || e.x > e.maxX) { e.vx *= -1; e.x += e.vx; }
    }
    if (p.invStar > 0 && !e.serp && rectsTouch(p, e)) {
      // INVENCIBLE! Els enemics exploten al tocar-te!
      if (e.boss) {
        if (e.hurt === 0) { e.hp--; e.hurt = 30; }
        if (e.hp <= 0) { e.alive = false; score += 200; pop('BOSS VENÇUT! +200', e.x, e.y - 40, '#ffd700'); jingle([880, 660, 880, 1100], 100); }
      } else e.alive = false;
      score += 30;
      pop('+30', e.x, e.y, '#ffd700');
      burst(e.x + e.w/2, e.y, '#ffd700');
      beep(600, 0.1, 'square', 0.12, 300);
    } else if (!e.spiky && !e.serp && p.vy > 0 && p.y + p.h - e.y < 24 && rectsTouch(p, e)) {
      // AIXAFAT!! salta-li a sobre i PAM! 👟 (els pinxos NO: punxen!)
      if (e.cobra) {
        // la cobra és massa dura: hi rebotes i ja està — NOMÉS la cua amb ous!
        p.vy = -11;
        beep(700, 0.08, 'square', 0.1, -200);
        if (frame % 90 === 0) pop('Amb OUS a la CUA! 🥚🐍', e.x + e.w/2 - 60, e.y - 30, '#ffee58');
      } else if (e.boss) {
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
    } else if (p.inv === 0 && !e.serp && rectsTouch(p, e)) {
      ouchPlayer(e.x);
    }
  }
  if (p.inv > 0) p.inv--;

  // els BOSSES DISPARAN boles de foc!!
  for (const e of enemies) {
    if (!e.boss || !e.alive || e.asleep) continue;
    e.shootT = (e.shootT || 0) + 1;
    // el drac enfadat dispara MOLT més ràpid — i són LLAMPECS! ⚡
    // en Kamek gegant escup MÀGIA de pressa, i encara més quan li fas mal! 🪄
    if (e.shootT > (e.dragon ? Math.max(45, 95 - (6 - e.hp) * 8)
                   : e.kamekBoss ? Math.max(55, 105 - (8 - e.hp) * 7) : 110)) {
      e.shootT = 0;
      const dx = (p.x + p.w/2) - (e.x + e.w/2);
      const dy = (p.y + p.h/2) - (e.y + e.h/2);
      const d = Math.sqrt(dx*dx + dy*dy) || 1;
      const sp = e.dragon ? 6 : e.kamekBoss ? 5 : 4.5;
      shots.push({x: e.x + e.w/2, y: e.y + e.h/2, vx: dx/d * sp, vy: dy/d * sp,
                  elec: !!e.dragon, magic: !!e.kamekBoss});
      beep(e.dragon ? 900 : 180, 0.15, 'sawtooth', 0.15, e.dragon ? -500 : -60);
    }
  }
  for (const s of shots) {
    s.x += s.vx; s.y += s.vy;
    s.dead = s.x < 0 || s.x > LEVEL_END || s.y < camY - 50 || s.y > camY + H + 50;
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

  // les MÀQUINES D'OUS: toca-les i t'omplen la cistella d'ous!! 🥚
  for (const m of maquines) {
    if (m.t > 0) m.t--;
    if (m.t <= 0 && p.eggs < 6 && rectsTouch(p, {x: m.x - 26, y: m.y - 50, w: 52, h: 50})) {
      m.t = 80;
      p.eggs = 6;
      pop('OUS A TOP!! 🥚', m.x - 30, m.y - 70, '#fff59d');
      burst(m.x, m.y - 40, '#ffd700');
      jingle([500, 700, 900, 1100], 60);
    }
  }

  // ===== KAMEK!! 🧙 el mag vola cap a la serp i la transforma!! =====
  if (KAMEK_X >= 0 && !kamek && p.x > KAMEK_X) {
    kamek = {t: 0, x: p.x + 1050, y: 140};
    pop('KAMEK!!! 🧙‍♂️', p.x + 150, p.y - 80, '#ce93d8');
    jingle([880, 660, 880, 440], 100);
  }
  if (kamek) {
    kamek.t++;
    if (KAMEK_GRAN) {
      // EN KAMEK LLUITA ELL MATEIX!! se't posa DAVANT com el Bowser Jr! 🧙
      const destX = p.x + 430;
      kamek.x += (destX - kamek.x) * 0.05;
      kamek.y = 200 + Math.sin(kamek.t * 0.08) * 22;
      if (kamek.t > 90 && Math.abs(kamek.x - destX) < 80) {
        // PUUM!! ES FAAA GEEEANT!!!
        shake = 30;
        burst(kamek.x, kamek.y, '#ce93d8');
        burst(kamek.x, kamek.y, '#ffd700');
        burst(kamek.x, kamek.y, '#ff5252');
        enemies.push({x: kamek.x - 55, y: 280, baseY: 330, w: 110, h: 130,
                      vx: 2.2, minX: 12400, maxX: LEVEL_END - 150, hp: 8,
                      boss: true, kamekBoss: true,
                      alive: true, hurt: 0, t: 0});
        pop('KAMEK GEEEANT!!! 🧙✨', kamek.x - 120, kamek.y - 90, '#ce93d8');
        jingle([200, 400, 300, 600, 500, 900], 110);
        kamek = null;   // ja no vola: ara és el BOSS!
      }
    } else {
      const serp = enemies.find(e => e.serp && e.alive);
      if (serp && kamek.t < 900) {
        // Kamek s'acosta a la serp volant i fent cercles màgics
        kamek.x += (serp.x - kamek.x) * 0.07;
        kamek.y = 130 + Math.sin(kamek.t * 0.09) * 25;
        if (kamek.t > 60 && Math.abs(kamek.x - serp.x) < 120) {
          // ZAS!!! la serp es converteix en COBRA GEGANT!!
          serp.alive = false;
          shake = 25;
          burst(serp.x + 20, serp.y, '#ce93d8');
          burst(serp.x + 20, serp.y, '#ffd700');
          burst(serp.x + 20, serp.y, '#7e57c2');
          enemies.push({x: serp.x - 120, y: 430 - 70, baseY: 430, w: 260, h: 90,
                        vx: 2.4, minX: 11300, maxX: 13450, hp: 8,
                        boss: true, cobra: true, fly: true,
                        alive: true, hurt: 0, t: 0});
          pop('LA SERP ÉS UNA COBRA GEGANT!!! 🐍', serp.x - 160, serp.y - 100, '#ffee58');
          jingle([150, 300, 600, 900, 1200], 110);
          kamek.marxa = true;   // Kamek marxa rient de la broma!
        }
      }
      if (kamek.marxa) {
        kamek.x += 4; kamek.y -= 1.5;   // se'n va volant!
        if (kamek.x > camX + W + 200) kamek = null;
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

  // cors que curen!
  for (const h of heals) {
    if (h.taken) continue;
    const hr = {x: h.x - 12, y: h.y - 12, w: 24, h: 24};
    if (rectsTouch(p, hr)) {
      h.taken = true;
      p.hearts = Math.min(p.maxHearts, p.hearts + 1);
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
    } else if (LEVEL_NEXT) {
      buildLevel(LEVEL_NEXT);
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

// ==================== SINCRONITZAR SPRITES ====================
// cada entitat del món té una imatge Phaser que la segueix
const spritesEntitats = [];
function spriteDe(obj, id) {
  if (!obj._img) {
    obj._img = ESCENA.add.image(0, 0, id);
    obj._img.setOrigin(0, 0);
    obj._img.setDepth(5);
    spritesEntitats.push(obj._img);
  }
  return obj._img;
}
function netejaSprites() {
  for (const s of spritesEntitats) s.destroy();
  spritesEntitats.length = 0;
  poshiObj._img = null;   // el sprite del Poshi també es refà
  netejaPiscines();
}
function posa(obj, tex, x, y, opts) {
  const im = spriteDe(obj, tex);
  if (x + 200 < camX - 40 || x - 200 > camX + W + 40) {   // fora de vista → amagat!
    im.setVisible(false);
    return im;
  }
  im.setTexture(tex);
  im.setPosition(x, y);
  opts = opts || {};
  im.setFlipX(!!opts.flipX);
  if (opts.scale) im.setScale(opts.scale); else im.setScale(S);
  if (opts.alpha !== undefined) im.setAlpha(opts.alpha); else im.setAlpha(1);
  im.setVisible(true);
  return im;
}
// amaga el sprite si l'entitat ja no existeix
function amaga(obj) { if (obj._img) obj._img.setVisible(false); }

function syncMon() {
  // fons (el cel no es mou amb la càmera — scrollFactor 0!)
  drawBackground();
  gWorld.clear(); gTop.clear();
  // TREMOLOR quan hi ha explosions!
  // (+240,+135 perquè el zoom de la càmera gira al voltant del CENTRE de la pantalla)
  CAM.setScroll(camX + 240 + (Math.random()-0.5) * shake,
                camY + 135 + (Math.random()-0.5) * shake);

  drawDecor();
  drawLiquids();
  for (const pl of platforms)
    if (pl.x + pl.w > camX - 80 && pl.x < camX + W + 80) drawPlatform(pl);
  for (const t of pipes) drawPipe(t);
  for (const d of doors) drawDoor(d);
  if (levelNum === 1) drawCastle(7950);   // el castell del pati, al costat de la bandera!
  drawFlag();

  for (const f of fruits) {
    if (f.taken) { amaga(f); continue; }
    const y = f.y + Math.sin(frame*0.08 + f.bob)*3;
    if (f.type === 'apple') posa(f, 'apple', f.x - 4*S, y - 4*S);
    else if (f.type === 'coin') posa(f, 'coin', f.x - 4*S, y - 3.5*S);
    else if (f.type === 'grape') posa(f, 'grape', f.x - 4*S, y - 4*S);
    else posa(f, 'flower', f.x - 5*S, y - 4.5*S);   // el meló-trésor!
  }
  for (const m of mines) {
    if (!m.alive) { amaga(m); continue; }
    posa(m, 'mine', m.x - 6*S, m.drawY - 3.5*S);
  }
  for (const pl of plants) {
    if (!pl.alive) { amaga(pl); continue; }
    const py = pl.gy - 20 - pl.pop * 38;
    posa(pl, pl.pop > 0.5 ? 'plant_b' : 'plant_a', pl.x - 15, py - 21);
    // el test que tapa la planta per sota → sembla que surt!
    fillRect(gTop, pl.x - 18, pl.gy - 20, 36, 20, '#1f9e4b');
    fillRect(gTop, pl.x - 21, pl.gy - 24, 42, 8, '#37c862');
    strokeRect(gTop, pl.x - 21, pl.gy - 24, 42, 8, '#146332', 2);
  }
  for (const pad of pads) posa(pad, 'bounce', pad.x, pad.y);
  for (const m of maquines) drawMaquina(m);   // les màquines d'ous! 🥚
  drawKamek();                               // el mag, si ha aparegut! 🧙
  for (const s of starPicks) {
    if (s.taken) { amaga(s); continue; }
    posa(s, 'star', s.x - 4.5*S, s.y - 3.5*S + Math.sin(frame * 0.08 + s.x) * 4);
  }
  for (const h of heals) {
    if (h.taken) { amaga(h); continue; }
    posa(h, 'heart', h.x - 4*S, h.y - 4*S + Math.sin(frame * 0.1) * 3);
  }
  for (const e of enemies) {
    if (!e.alive) { amaga(e); continue; }
    if (e.boss) { drawBossCos(e); continue; }
    const colNom = e.color in ROBE ? e.color : 'red';
    if (e.serp)      drawSerp(e);
    else if (e.poop) posa(e, 'poop', e.x + e.w/2 - 15, e.y + e.h - 24, {flipX: e.vx < 0});
    else if (e.fish) posa(e, 'fish', e.x + e.w/2 - 24, e.y + e.h - 24, {flipX: e.vx < 0});
    else if (e.spiky) posa(e, 'spiky', e.x + e.w/2 - 18, e.y + e.h - 30, {flipX: e.vx < 0});
    else if (e.fly)
      posa(e, 'fly_' + colNom + (frame % 8 < 4 ? '_a' : '_b'),
           e.x + e.w/2 - 15, e.y, {flipX: e.vx < 0});
    else
      posa(e, 'shy_' + colNom + (frame % 20 < 10 ? '_a' : '_b'),
           e.x + e.w/2 - 18, e.y + e.h - 42, {flipX: e.vx < 0});
  }
  for (const egg of eggs) posa(egg, 'egg', egg.x - 3.5*S, egg.y - 3.5*S);
  for (const s of shots) {
    if (s.elec) { drawBolt(s); amaga(s); }
    else if (s.magic) {   // les boles de MÀGIA d'en Kamek — liles i brillants! 🪄
      amaga(s);
      fillCirc(gWorld, s.x, s.y, 9, '#ce93d8');
      fillCirc(gWorld, s.x, s.y, 5, '#f3e5f5');
      fillCirc(gWorld, s.x + Math.sin(frame * 0.3) * 10, s.y + Math.cos(frame * 0.3) * 10, 2.5, '#e1bee7');
    }
    else posa(s, levelNum === 6 ? 'shot_choco' : 'shot', s.x - 3*S, s.y - 3*S);
  }

  // ===== EL POSHI EN ALTA RESOLUCIÓ!! 🐤 =====
  // el dibuix gran i detallat de l'Unai, directament del PNG escanejat!
  if (VAGO) drawVago(player);   // al 18 el Poshi va amb la VAGONETA! 🎢
  else if (COTXE) drawCotxe(player);   // al 17 el Poshi porta el seu COTXE de curses! 🏎️
  else {
  const ph = 76;   // alçada en unitats de món — ben gran!
  const texP = ESCENA.textures.get(POSHI_TEX);
  const pw = ph * texP.getSourceImage().width / texP.getSourceImage().height;
  posa(poshiObj, POSHI_TEX, player.x + player.w/2 - pw/2, player.y + player.h - ph,
       {flipX: player.facing === 1,  // el dibuix original mira a l'ESQUERRA!
        scale: 1,                    // displaySize s'ajusta a sota
        alpha: (player.inv > 0 && frame % 6 < 3) ? 0.35 : 1});
  poshiObj._img.setDisplaySize(pw, ph);
  poshiObj._img.setDepth(8);
  }

  drawDinoExtras(player);
  if (babyBubble) drawBubble(babyBubble);
  if (player.aiming) drawAim();
  drawParticles();

  // números que surten volant (+50!)
  for (let i = 0; i < popups.length; i++) {
    const pt = popups[i];
    textStamp('popup_' + i, pt.text, pt.x, pt.y, {size: 18, color: pt.color,
                                                  alpha: pt.life / 50});
  }
  if (textPool['popup_' + popups.length])  // neta els que ja han mort
    for (const k of Object.keys(textPool))
      if (k.startsWith('popup_') && +k.slice(6) >= popups.length)
        textPool[k].setVisible(false);

  drawHUD();
}

const poshiObj = {};   // objecte fals que porta la imatge del Poshi

// ==================== HUD (punts, ous, cors, cartells) ====================
let gUI = null;
const hudTextos = {};
function hudText(id, str, x, y, opts) {
  opts = opts || {};
  let t = hudTextos[id];
  if (!t) {
    // nota: la càmera redueix el text 1/3 i després el canvas l'estira ×3,
    // així que la mida de la font queda igual que la que li demanem (retro!)
    t = ESCENA.add.text(x, y, str, {
      fontFamily: opts.font || 'monospace',
      fontSize: (opts.size || 18) + 'px',
      fontStyle: 'bold',
      color: opts.color || '#ffffff'
    });
    t.setScrollFactor(0);
    t.setOrigin(0.5, 0.5);
    t.setDepth(25);
    hudTextos[id] = t;
  }
  if (t.text !== str) t.setText(str);
  t.setPosition(x - 240, y - 135);   // (el zoom gira al voltant del centre: això ho desfà)
  if (opts.color) t.setColor(opts.color);
  if (opts.font) t.setFontFamily(opts.font);
  if (opts.size) t.setFontSize(opts.size);
  t.setAlpha(opts.alpha === undefined ? 1 : opts.alpha);
  t.setVisible(true);
  return t;
}
function hudImg(id, tex, x, y, opts) {
  let im = stampPool['hud_' + id];
  if (!im) {
    im = ESCENA.add.image(x, y, tex);
    im.setScale(S); im.setOrigin(0, 0); im.setScrollFactor(0); im.setDepth(24);
    stampPool['hud_' + id] = im;
  }
  im.setTexture(tex); im.setPosition(x - 240, y - 135);   // (com els textos)
  im.setAlpha(opts && opts.alpha !== undefined ? opts.alpha : 1);
  im.setVisible(true);
  return im;
}

function drawHUD() {
  gUI.clear();
  fillRect(gUI, 0, 0, W, 44, 'rgba(0,0,0,0.35)');
  hudImg('star', 'star', 14, 10);
  hudText('punts', '' + score, 45, 22, {size: 20});
  hudTextos['punts'].setOrigin(0, 0.5);
  hudImg('egg', 'egg', 130, 10);
  hudText('ous', 'x' + player.eggs, 160, 22, {size: 20});
  hudTextos['ous'].setOrigin(0, 0.5);
  for (let i = 0; i < player.maxHearts; i++)
    hudImg('cor' + i, 'heart', 230 + i * 30, 12, {alpha: i < player.hearts ? 1 : 0.25});

  // compte enrere del nadó Mario
  if (babyBubble) {
    hudImg('babyStar', 'star', W/2 - 25, 8);
    hudText('babyTimer', '' + Math.ceil(player.babyTimer), W/2 + 20, 28,
            {size: 28, color: (player.babyTimer < 4 && frame % 20 < 10) ? '#ff5252' : '#ffd700'});
  } else if (hudTextos['babyTimer']) hudTextos['babyTimer'].setVisible(false),
                                     stampPool['hud_babyStar'].setVisible(false);

  // cartell de nivell al començament (com als jocs antics!)
  if (frame - levelStart < 150) {
    fillRect(gUI, 0, H/2 - 70, W, 120, 'rgba(0,0,0,0.6)');
    hudText('cartell', 'NIVELL ' + levelNum, W/2, H/2 - 10,
            {size: 60, color: '#ffd700', font: '"Comic Sans MS", sans-serif'});
    hudText('subtitol', LEVEL_TITOL, W/2, H/2 + 42,
            {size: 22, color: '#ffffff', font: '"Comic Sans MS", sans-serif'});
  } else {
    if (hudTextos['cartell']) hudTextos['cartell'].setVisible(false);
    if (hudTextos['subtitol']) hudTextos['subtitol'].setVisible(false);
  }

  if (won) {
    if (!wonPlayed) {
      wonPlayed = true;
      jingle([523, 659, 784, 1046, 784, 1046, 1318], 110);   // fanfària!
    }
    fillRect(gUI, 0, 0, W, H, 'rgba(0,0,0,0.5)');
    hudText('won1', '🎉 HAS GUANYAT! 🎉', W/2, H/2 - 30, {size: 48, color: '#ffd700', font: '"Comic Sans MS"'});
    hudText('won2', 'Punts: ' + score, W/2, H/2 + 20, {size: 28, font: '"Comic Sans MS"'});
    hudText('won3', 'Prem R per tornar a jugar', W/2, H/2 + 65, {size: 28, font: '"Comic Sans MS"'});
    if (keys['KeyR']) location.reload();
  }
  if (gameOver) {
    if (!overPlayed) {
      overPlayed = true;
      jingle([400, 350, 300, 200], 160);   // musiqueta trista...
    }
    fillRect(gUI, 0, 0, W, H, 'rgba(0,0,0,0.6)');
    hudText('over1', '😢 FI DE LA PARTIDA', W/2, H/2 - 20, {size: 48, color: '#ff8a80', font: '"Comic Sans MS"'});
    hudText('over2', 'Prem R per tornar-ho a intentar', W/2, H/2 + 40, {size: 28, font: '"Comic Sans MS"'});
    if (keys['KeyR']) location.reload();
  }
}

// ===== PANTALLA DE TRIAR NIVELL =====
function drawSelect() {
  drawBackground();
  CAM.setScroll(240, 135);
  gWorld.clear(); gTop.clear();
  gUI.clear();
  amagaPiscines();
  fillRect(gUI, 0, 0, W, H, 'rgba(30,10,50,0.85)');
  hudText('sel_titol', "🦕 EL JOC DE L'UNAI 🦕", W/2, H/2 - 140,
          {size: 42, color: '#ffd700', font: '"Comic Sans MS", sans-serif'});
  hudText('sel_sub', 'TRIA EL NIVELL! Prem una tecla:', W/2, H/2 - 80,
          {size: 24, color: '#ffffff', font: '"Comic Sans MS", sans-serif'});
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
    ['#b9f6ca', 'B   🌙 EL CAMP DE NIT (VERTICAL!)'],
    ['#b3e5fc', 'P   🏰 EL CASTELL VOLADOR + COBRA!'],
    ['#ff8a65', 'V   🌋 EL CASTELL DE VOLCANS + KAMEK!'],
    ['#ef5350', 'C   🏎️ LA GRAN CURSA DE COTXES!'],
    ['#bcaaa4', 'L   🎢 LA VAGONETA AMB LUPINGS!'],
  ];
  // dues columnes: 8 a l'esquerra, la resta a la dreta — hi cap tot!!
  for (let i = 0; i < nivells.length; i++) {
    const esq = i < 8;
    hudText('sel_n' + i, nivells[i][1], esq ? W/4 : W*3/4, H/2 - 115 + (esq ? i : i - 8) * 42,
            {size: 19, color: nivells[i][0], font: '"Comic Sans MS", sans-serif'});
  }
  hudText('sel_pista', "Pista: mentre jugues, prem la tecla d'un nivell per saltar-hi!",
          W/2, H - 18, {size: 16, color: '#aaaaaa', font: '"Comic Sans MS", sans-serif'});
}

// ==================== L'ESCENA PHASER ====================
let CAM = null, gTop = null, POSHI_TEX = 'poshi_px';

class EscenaJoc extends Phaser.Scene {
  preload() {
    // la imatge GRAN del Poshi: el dibuix escanejat de l'Unai!
    this.load.image('poshi', 'assets/poshi_clean.png');
  }
  create() {
    ESCENA = this;
    CAM = this.cameras.main;
    CAM.setZoom(0.5);   // 960 unitats de món → 480 píxels de pantalla
    bakeTextures(this);
    if (this.textures.exists('poshi')) POSHI_TEX = 'poshi';

    // les tres "eines de dibuix": fons / món / a sobre del jugador
    // TRUC: el zoom gira al voltant del centre de la pantalla, així que totes
    // les coses "fixes" (scrollFactor 0) es desplacen (-240, -135) i quadren!
    bgGrad = this.add.image(-240, -135, 'grad_default')
      .setOrigin(0, 0).setDisplaySize(W, H).setScrollFactor(0).setDepth(-20);
    gBG = this.add.graphics().setScrollFactor(0).setDepth(-10);
    gBG.setPosition(-240, -135);
    gWorld = this.add.graphics().setDepth(0);
    gTop = this.add.graphics().setDepth(10);
    gUI = this.add.graphics().setScrollFactor(0).setDepth(20);
    gUI.setPosition(-240, -135);

    // entrades: el teclat del joc
    this.input.keyboard.on('keydown', e => {
      keys[e.code] = true;
      if (e.repeat) return;
      audio();   // els navegadors volen una tecla per engegar el so!
      // tria el nivell amb les tecles — quan vulguis!
      const lvl = {'Digit1':1,'Digit2':2,'Digit3':3,'Digit4':4,'Digit5':5,
                   'Digit6':6,'Digit7':7,'Digit8':8,'Digit9':9,'Digit0':10,
                   'KeyM':12,'KeyN':13,'KeyB':14,'KeyP':15,'KeyV':16,'KeyC':17,'KeyL':18}[e.code];
      if (lvl && LEVELS[lvl]) {
        selecting = false;
        for (const k of Object.keys(hudTextos))
          if (k.startsWith('sel_')) hudTextos[k].setVisible(false);
        buildLevel(lvl);          // (ja neteja els sprites antics ell sol!)
        jingle([660, 880, 1100], 80);
      }
    });
    this.input.keyboard.on('keyup', e => keys[e.code] = false);
    // també acceptem clics/tocs per engegar l'àudio
    this.input.on('pointerdown', () => audio());

    buildLevel(1);   // carrega el primer nivell (la pantalla de selecció tapa el món)

    // TRUC: ?nivell=3 a l'URL → comença directament aquell nivell!
    const n = +(new URLSearchParams(location.search).get('nivell') || 0);
    if (n && LEVELS[n]) { selecting = false; buildLevel(n); }
  }
  update() {
    update();          // la lògica del joc
    if (selecting) drawSelect();
    else syncMon();    // dibuixar el món amb sprites i formes
    // gra de paper, com si estigués dibuixat amb ceres!
    graPaper();
  }
}

// petits punts blancs a sobre de tot → textura de paper de cera!
let gPaper = null;
function graPaper() {
  if (!gPaper) {
    gPaper = ESCENA.add.graphics().setScrollFactor(0).setDepth(30);
    gPaper.setPosition(-240, -135);
  }
  gPaper.clear();
  gPaper.fillStyle(0xffffff, 0.05);
  for (let i = 0; i < 120; i++)
    gPaper.fillRect(Math.random() * W, Math.random() * H, 2, 2);   // 2 unitats = 1 píxel
}

// ==================== ARRENCAR! ====================
// Phaser crea la pantalla de píxels (320×180, com la Game Boy però més gran!)
// i la càmera l'estira ×3: així el món sencer de 960×540 hi cap igual que abans.
const joc = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'joc',
  width: 480,
  height: 270,
  zoom: 2,
  pixelArt: true,
  roundPixels: true,
  scene: [EscenaJoc]
});
