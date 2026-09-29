// ==================== DIBUIXOS ====================
function drawBackground() {
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
  const g = ctx.createLinearGradient(0, 0, 0, H);
  if (inDesert)     { g.addColorStop(0, '#ffb74d'); g.addColorStop(1, '#fff3c4'); }
  else if (inCastle){ g.addColorStop(0, '#565064'); g.addColorStop(1, '#2a2438'); }
  else if (inSpace) { g.addColorStop(0, '#060a24'); g.addColorStop(1, '#1a1f4d'); }
  else if (inBalloon){ g.addColorStop(0, '#ff9fd4'); g.addColorStop(1, '#ffe9b0'); }
  else if (inMine)  { g.addColorStop(0, '#2e1a0e'); g.addColorStop(1, '#54371f'); }
  else if (inChoco) { g.addColorStop(0, '#f3c98f'); g.addColorStop(1, '#ffe9c4'); }
  else if (inSewer) { g.addColorStop(0, '#0e2f28'); g.addColorStop(1, '#1d5044'); }
  else if (inJungle){ g.addColorStop(0, '#a8e6b0'); g.addColorStop(1, '#e8f7c5'); }
  else if (inMech)  { g.addColorStop(0, '#101528'); g.addColorStop(1, '#232a45'); }
  else if (inJapan) { g.addColorStop(0, '#ffd1e3'); g.addColorStop(1, '#ffedc2'); }
  else if (inTower) { g.addColorStop(0, '#3d3554'); g.addColorStop(1, '#6a5f8a'); }
  else if (inTokyo) {
    // TÒQUIO: capvespre → nit de neons → alba!! 3 ambients segons on siguis!
    const tz = player.x < 4200 ? 0 : player.x < 8300 ? 1 : 2;
    if (tz === 0)      { g.addColorStop(0, '#ff9e80'); g.addColorStop(1, '#ffe0b2'); }
    else if (tz === 1) { g.addColorStop(0, '#10132e'); g.addColorStop(1, '#2c3468'); }
    else               { g.addColorStop(0, '#ff8fa3'); g.addColorStop(1, '#b3e5fc'); }
  }
  else if (inParty) {
    // LA FESTA: el cel canvia de color segons la zona — un arc de sant Martí!! 🌈
    const zones = [
      ['#ff8a80', '#ffe0b2'],   // zona vermella-taronja
      ['#ffd54f', '#fff9c4'],   // zona grogueta
      ['#81c784', '#dcedc8'],   // zona verda
      ['#4fc3f7', '#e1f5fe'],   // zona blava
      ['#ba68c8', '#f3e5f5'],   // zona lila
      ['#f06292', '#fce4ec'],   // zona rosa
      ['#ff8a65', '#fff3e0'],   // zona taronja
      ['#9575cd', '#ede7f6'],   // zona violeta final
    ];
    const z = zones[Math.min(7, (player.x / 1750) | 0)];
    g.addColorStop(0, z[0]); g.addColorStop(1, z[1]);
  }
  else if (inNight) { g.addColorStop(0, '#0a1030'); g.addColorStop(1, '#1d4a38'); }
  else              { g.addColorStop(0, '#7ecbf2'); g.addColorStop(1, '#c8f0d8'); }
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

  if (inDesert) {
    // EL SOL DEL DESERT — gegant i torrat!! ☀️
    const sunX = 750 - camX * 0.03;
    ctx.fillStyle = '#ffd54f';
    ctx.beginPath(); ctx.arc(sunX, 95, 60, 0, 7); ctx.fill();
    ctx.fillStyle = '#fff176';
    ctx.beginPath(); ctx.arc(sunX, 95, 45, 0, 7); ctx.fill();
    // dunes a la llunyania en dues capes (paral·laxi!)
    ctx.fillStyle = '#e8b04a';
    for (let i = 0; i < 6; i++) {
      const hx = ((i*950 - camX*0.12) % (W+600) + W+600) % (W+600) - 300;
      ctx.beginPath(); ctx.arc(hx, 560, 210, Math.PI, 0); ctx.fill();
    }
    ctx.fillStyle = '#d69a35';
    for (let i = 0; i < 7; i++) {
      const hx = ((i*800 - camX*0.3) % (W+500) + W+500) % (W+500) - 250;
      ctx.beginPath(); ctx.arc(hx, 575, 150, Math.PI, 0); ctx.fill();
    }
    return;
  }

  if (inSpace) {
    // estrelles que lluen!
    for (let i = 0; i < 90; i++) {
      const sx = (i * 197 - camX * 0.15) % (W + 20) + 10;
      const sy = (i * 131) % 480 + 10;
      ctx.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(frame * 0.06 + i * 1.7));
      ctx.fillStyle = i % 5 === 0 ? '#ffd700' : '#ffffff';
      ctx.fillRect(sx, sy, i % 7 === 0 ? 5 : 3, i % 7 === 0 ? 5 : 3);
    }
    ctx.globalAlpha = 1;
    // la LLUNA!
    const mx = 780 - camX * 0.03;
    ctx.fillStyle = '#f5f3ce';
    ctx.beginPath(); ctx.arc(mx, 100, 55, 0, 7); ctx.fill();
    ctx.fillStyle = '#ddd9ab';
    ctx.beginPath(); ctx.arc(mx - 15, 85, 12, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(mx + 18, 115, 9, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(mx + 5, 88, 6, 0, 7); ctx.fill();
    return;
  }

  if (inBalloon) {
    // cel de festa: globus de colors flotant a la deriva!
    for (let i = 0; i < 22; i++) {
      const bx = ((i * 353 - camX * 0.2) % (W + 120) + W + 120) % (W + 120) - 60;
      const by = 40 + (i * 83) % 260 + Math.sin(frame * 0.03 + i * 2) * 12;
      const c = ['#ff5d8f', '#ffd166', '#4dd2ff', '#9d6bff', '#5dff8f'][i % 5];
      ctx.globalAlpha = 0.75;
      ctx.fillStyle = c;
      ctx.beginPath(); ctx.ellipse(bx, by, 13, 17, 0, 0, 7); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(bx - 4, by + 15); ctx.lineTo(bx + 4, by + 15); ctx.lineTo(bx, by + 20);
      ctx.fill();
      ctx.strokeStyle = 'rgba(140,60,100,0.6)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(bx, by + 20);
      ctx.quadraticCurveTo(bx + Math.sin(frame * 0.04 + i) * 8, by + 34, bx, by + 46);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    // un castell de globus a la llunyania!
    const fx = 5600 - camX * 0.35;
    if (fx > -400 && fx < W + 400) {
      for (let j = 0; j < 5; j++) {
        ctx.globalAlpha = 0.35;
        ctx.fillStyle = ['#ff5d8f', '#ffd166', '#4dd2ff', '#9d6bff', '#5dff8f'][j];
        ctx.beginPath();
        ctx.ellipse(fx + (j - 2) * 50, 210 - Math.abs(j - 2) * 42, 46, 62, 0, 0, 7);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
    return;
  }

  if (inMech) {
    // ENGRANATGES gegants girant al fons del castell mecànic!
    for (let i = 0; i < 6; i++) {
      const gx = ((i*800 - camX*0.25) % (W+600) + W+600) % (W+600) - 300;
      const gy = 90 + (i*137) % 320;
      const r = 50 + (i % 3) * 30;
      ctx.strokeStyle = 'rgba(120,144,156,0.35)'; ctx.lineWidth = 12;
      ctx.beginPath(); ctx.arc(gx, gy, r, 0, 7); ctx.stroke();
      ctx.fillStyle = 'rgba(120,144,156,0.35)';
      for (let a = 0; a < 8; a++) {
        const an = a * Math.PI/4 + frame * 0.012 * (i % 2 ? 1 : -1);   // giren alternant!
        ctx.fillRect(gx + Math.cos(an) * r - 8, gy + Math.sin(an) * r - 8, 16, 16);
      }
      ctx.beginPath(); ctx.arc(gx, gy, r * 0.3, 0, 7); ctx.stroke();
    }
    // espurnes elèctriques que parpellegen!
    if (frame % 30 < 12) {
      ctx.strokeStyle = '#ffee58'; ctx.lineWidth = 3; ctx.globalAlpha = 0.8;
      for (let i = 0; i < 4; i++) {
        const ex = (i * 337) % W;
        const ey = 50 + (i * 91) % 380;
        ctx.beginPath();
        ctx.moveTo(ex, ey);
        ctx.lineTo(ex + 15, ey + 20); ctx.lineTo(ex - 8, ey + 38); ctx.lineTo(ex + 18, ey + 58);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
    return;
  }

  if (inNight) {
    // LA LLUNA GEGANT que et segueix mentre puges!! 🌙
    const moonX = W - 180 - camX * 0.03, moonY = 110 + camY * 0.15;
    ctx.fillStyle = '#fff9c4';
    ctx.beginPath(); ctx.arc(moonX, moonY, 55, 0, 7); ctx.fill();
    ctx.fillStyle = '#ede49a';
    ctx.beginPath(); ctx.arc(moonX - 15, moonY - 10, 12, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(moonX + 18, moonY + 15, 8, 0, 7); ctx.fill();
    // estrelles que parpellegen — pugen amb tu!
    for (let i = 0; i < 80; i++) {
      const sx = ((i * 167 - camX * 0.1) % (W + 20) + W + 20) % (W + 20);
      const sy = ((i * 211 - camY * 0.35) % (H + 20) + H + 20) % (H + 20);
      ctx.globalAlpha = 0.3 + 0.7 * Math.abs(Math.sin(frame * 0.06 + i * 1.7));
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(sx, sy, 3, 3);
    }
    ctx.globalAlpha = 1;
    // CUQUES DE LLUM que volen per la prada!! 🪲✨
    for (let i = 0; i < 20; i++) {
      const fx = ((i * 353 + frame * (0.4 + (i % 3) * 0.2) - camX * 0.4) % (W + 60) + W + 60) % (W + 60) - 30;
      const fy = ((i * 97 - camY * 0.5) % (H + 80) + H + 80) % (H + 80) - 20;
      ctx.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(frame * 0.12 + i * 3));
      ctx.fillStyle = '#eeff41';
      ctx.beginPath(); ctx.arc(fx, fy, 4, 0, 7); ctx.fill();
    }
    ctx.globalAlpha = 1;
    // estels que cauen de tant en tant! ⭐
    if ((frame % 300) < 60) {
      const ex = 200 + (frame % 300) * 14, ey = 40 + (frame % 300) * 5;
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex - 26, ey - 10); ctx.stroke();
    }
    return;
  }

  if (inParty) {
    // 🎊 PLUJA DE CONFETI!!! cau del cel fent cabrioles, de tots colors!
    const cols = ['#ff5252', '#ff9800', '#ffeb3b', '#66bb6a', '#42a5f5', '#ab47bc'];
    for (let i = 0; i < 60; i++) {
      const cx = ((i * 271 - camX * 0.5) % (W + 40) + W + 40) % (W + 40) - 20;
      const cy = ((i * 173 + frame * (1.2 + (i % 3))) % (H + 40)) - 20;
      ctx.fillStyle = cols[i % 6];
      ctx.save();
      ctx.translate(cx + Math.sin(frame * 0.08 + i) * 6, cy);
      ctx.rotate(Math.sin(frame * 0.1 + i) * 0.6);
      ctx.fillRect(-4, -2, 8, 5);
      ctx.restore();
    }
    // globus gegants flotant a la llunyania 🎈
    ctx.globalAlpha = 0.5;
    for (let i = 0; i < 10; i++) {
      const bx = ((i * 570 - camX * 0.2) % (W + 300) + W + 300) % (W + 300) - 150;
      const by = 60 + (i * 89) % 200 + Math.sin(frame * 0.04 + i) * 10;
      ctx.fillStyle = cols[(i * 2) % 6];
      ctx.beginPath(); ctx.ellipse(bx, by, 24, 30, 0, 0, 7); ctx.fill();
    }
    ctx.globalAlpha = 1;
    // serpentines de festa que pengen de dalt 🎀
    for (let i = 0; i < 14; i++) {
      const sx = ((i * 410 - camX * 0.6) % (W + 200) + W + 200) % (W + 200) - 100;
      ctx.strokeStyle = cols[i % 6]; ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      for (let sy = 0; sy < 90; sy += 12)
        ctx.lineTo(sx + Math.sin(sy * 0.15 + frame * 0.06 + i) * 12, sy);
      ctx.stroke();
    }
    return;
  }

  if (inTokyo) {
    const tz = player.x < 4200 ? 0 : player.x < 8300 ? 1 : 2;
    // skyline de LEGO: grans edificis de colors amb finestres!! 🏙️
    for (let i = 0; i < 10; i++) {
      const bx = ((i*620 - camX*0.25) % (W+700) + W+700) % (W+700) - 350;
      const bh = 120 + (i*97) % 220;
      ctx.fillStyle = ['#5c6bc0','#26a69a','#ef5350','#ab47bc','#ffa726','#42a5f5'][i % 6];
      ctx.globalAlpha = 0.45;
      ctx.fillRect(bx, 480 - bh, 130, bh);
      ctx.globalAlpha = 1;
      // finestres: a la nit BRILLEN grogues!
      ctx.fillStyle = tz === 1 ? '#ffee58' : 'rgba(255,255,255,0.5)';
      for (let wy = 480 - bh + 18; wy < 460; wy += 32)
        for (let wx = bx + 15; wx < bx + 115; wx += 30)
          if ((wx + wy + i) % 3) ctx.fillRect(wx, wy, 14, 16);
    }
    if (tz === 1) {
      // estrelles a la nit de neons!
      for (let i = 0; i < 40; i++) {
        const sx = ((i * 197 - camX * 0.1) % (W + 20) + W + 20) % (W + 20);
        ctx.globalAlpha = 0.3 + 0.6 * Math.abs(Math.sin(frame * 0.07 + i * 2));
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(sx, 20 + (i * 89) % 200, 3, 3);
      }
      ctx.globalAlpha = 1;
    }
    if (tz === 2) {
      // LA TORRE DE TÒQUIO vermella i blanca a la llunyania!! 🗼
      const tx = 9800 - camX * 0.3;
      if (tx > -300 && tx < W + 300) {
        ctx.fillStyle = '#e53935';
        ctx.beginPath();
        ctx.moveTo(tx - 95, 480); ctx.lineTo(tx - 30, 200); ctx.lineTo(tx - 18, 70);
        ctx.lineTo(tx + 18, 70); ctx.lineTo(tx + 30, 200); ctx.lineTo(tx + 95, 480);
        ctx.closePath(); ctx.fill();
        // bandes blanques de la torre!
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 14;
        ctx.beginPath(); ctx.moveTo(tx - 58, 340); ctx.lineTo(tx + 58, 340); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(tx - 33, 215); ctx.lineTo(tx + 33, 215); ctx.stroke();
        // creus en X
        ctx.strokeStyle = '#b71c1c'; ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(tx - 75, 430); ctx.lineTo(tx + 75, 350); ctx.moveTo(tx + 75, 430); ctx.lineTo(tx - 75, 350);
        ctx.moveTo(tx - 38, 300); ctx.lineTo(tx + 38, 230); ctx.moveTo(tx + 38, 300); ctx.lineTo(tx - 38, 230);
        ctx.stroke();
        // antena!
        ctx.fillRect(tx - 4, 30, 8, 44);
      }
    }
    return;
  }

  if (inTower) {
    // finestres gegants del castell que deixen entrar la llum del capvespre!
    for (let i = 0; i < 8; i++) {
      const wx = ((i * 700 - camX * 0.3) % (W + 400) + W + 400) % (W + 400) - 200;
      ctx.fillStyle = 'rgba(255,200,120,0.22)';
      ctx.beginPath();
      ctx.moveTo(wx, 480); ctx.lineTo(wx, 160);
      ctx.arc(wx + 40, 160, 40, Math.PI, 0);
      ctx.lineTo(wx + 80, 480); ctx.fill();
    }
    // rajos de llum que entren per les finestres
    ctx.fillStyle = 'rgba(255,230,160,0.10)';
    for (let i = 0; i < 6; i++) {
      const lx = ((i * 900 - camX * 0.3) % (W + 500) + W + 500) % (W + 500) - 250;
      ctx.beginPath();
      ctx.moveTo(lx, 180); ctx.lineTo(lx + 60, 180);
      ctx.lineTo(lx + 180, 480); ctx.lineTo(lx + 60, 480); ctx.fill();
    }
    return;
  }

  if (inJapan) {
    // el SOL japonès, vermell i rodó!
    const sunX = W - 150 - camX * 0.02;
    ctx.fillStyle = '#ff6f61';
    ctx.beginPath(); ctx.arc(sunX, 110, 48, 0, 7); ctx.fill();
    // EL MONT FUJI a la llunyania, amb el cim de neu!! ⛰️
    const fx = 4600 - camX * 0.3;
    if (fx > -900 && fx < W + 900) {
      ctx.fillStyle = '#7f9bb8';
      ctx.beginPath();
      ctx.moveTo(fx - 420, 480); ctx.lineTo(fx, 130); ctx.lineTo(fx + 420, 480);
      ctx.fill();
      // el cim nevat!
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(fx - 95, 261); ctx.lineTo(fx, 130); ctx.lineTo(fx + 95, 261);
      ctx.lineTo(fx + 60, 268); ctx.lineTo(fx + 40, 252); ctx.lineTo(fx + 15, 268);
      ctx.lineTo(fx - 10, 250); ctx.lineTo(fx - 35, 268); ctx.lineTo(fx - 60, 254);
      ctx.fill();
    }
    // pètals de sakura que cauen pel cel!! 🌸
    for (let i = 0; i < 26; i++) {
      const px = ((i * 397 + frame * 1.2 - camX * 0.5) % (W + 60) + W + 60) % (W + 60) - 30;
      const py = ((i * 211 + frame * (0.8 + (i % 3) * 0.3)) % (H + 40)) - 20;
      const sway = Math.sin(frame * 0.06 + i) * 6;
      ctx.fillStyle = i % 3 ? '#ffb7d5' : '#ffd7e8';
      ctx.globalAlpha = 0.85;
      ctx.beginPath(); ctx.ellipse(px + sway, py, 5, 3.5, sway * 0.1, 0, 7); ctx.fill();
      ctx.globalAlpha = 1;
    }
    return;
  }

  if (inJungle) {
    // l'horitzó de la selva: capes de muntanyes i arbres!
    ctx.fillStyle = '#7cb98a';   // la capa més llunyana
    for (let i = 0; i < 6; i++) {
      const hx = ((i*900 - camX*0.12) % (W+500) + W+500) % (W+500) - 250;
      ctx.beginPath(); ctx.arc(hx, 545, 220, Math.PI, 0); ctx.fill();
    }
    ctx.fillStyle = '#4a8f5d';   // la capa del mig
    for (let i = 0; i < 7; i++) {
      const hx = ((i*750 - camX*0.3) % (W+500) + W+500) % (W+500) - 250;
      ctx.beginPath(); ctx.arc(hx, 555, 160, Math.PI, 0); ctx.fill();
    }
    ctx.fillStyle = '#2e6b40';   // arbres de prop (silueta fosca)
    for (let i = 0; i < 8; i++) {
      const hx = ((i*850 - camX*0.5) % (W+600) + W+600) % (W+600) - 300;
      ctx.fillRect(hx - 12, 430, 24, 120);
      ctx.beginPath(); ctx.arc(hx, 420, 85, Math.PI, 0); ctx.fill();
    }
    // raigs de sol que entren entre els arbres!
    ctx.globalAlpha = 0.12; ctx.fillStyle = '#fffde7';
    for (let i = 0; i < 5; i++) {
      const rx = ((i*500 - camX*0.1) % (W+300) + W+300) % (W+300) - 150;
      ctx.beginPath();
      ctx.moveTo(rx, 0); ctx.lineTo(rx + 90, 0); ctx.lineTo(rx + 180, H); ctx.lineTo(rx + 60, H);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    return;
  }

  if (inSewer) {
    // canonades gegants al fons de la claveguera!
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = '#2f5d50';
    for (let i = 0; i < 8; i++) {
      const px2 = ((i*700 - camX*0.3) % (W+600) + W+600) % (W+600) - 300;
      const py2 = 60 + (i*127) % 300;
      ctx.fillRect(px2, py2, 260, 40);
      ctx.beginPath(); ctx.arc(px2 + 260, py2 + 40, 40, -Math.PI/2, 0); ctx.fill();  // el colze de la canonada
    }
    ctx.globalAlpha = 1;
    // bombolles d'aigua que pugen!
    for (let i = 0; i < 20; i++) {
      const bx = (i * 223) % W;
      const by = H - ((frame * 1.5 + i * 160) % (H + 40));
      ctx.strokeStyle = 'rgba(150,255,220,0.5)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(bx, by, 3 + (i % 3), 0, 7); ctx.stroke();
    }
    return;
  }

  if (inChoco) {
    if (inMine) return;   // dins la mina: tot fosc, la decoració ho omple
    // cel caramel amb núvols de nata!
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    for (let i = 0; i < 10; i++) {
      const cx = ((i*430 - camX*0.3) % (W+300)) - 150;
      cloud(cx, 40 + (i*67) % 140, 0.9);
    }
    // muntanyes de xocolata amb nata a dalt!
    for (let i = 0; i < 8; i++) {
      const hx = ((i*750 - camX*0.4) % (W+500) + W+500) % (W+500) - 250;
      ctx.fillStyle = '#8d5a2b';
      ctx.beginPath(); ctx.arc(hx, 545, 170, Math.PI, 0); ctx.fill();
      ctx.fillStyle = '#fff3e0';
      ctx.beginPath(); ctx.arc(hx, 430, 42, Math.PI, 0); ctx.fill();
    }
    // confeti dolç flotant pel cel!
    for (let i = 0; i < 24; i++) {
      const sx = ((i*313 - camX*0.25) % (W+80) + W+80) % (W+80) - 40;
      const sy = 30 + (i*89) % 240;
      ctx.fillStyle = ['#ff5d8f','#ffd166','#4dd2ff','#9d6bff','#5dff8f'][i % 5];
      ctx.fillRect(sx, sy, 5, 5);
    }
    return;
  }

  if (inCastle) {
    // paret de maons del castell (es mou amb la càmera!)
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 3;
    for (let y = 0; y < H; y += 30) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    for (let y = 0, i = 0; y < H; y += 30, i++)
      for (let x = -(camX % 60) + (i % 2) * 30; x < W; x += 60) {
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 30); ctx.stroke();
      }
    return;
  }

  if (inCave) {
    // cristalls que brillen a la cova secreta
    for (let i = 0; i < 12; i++) {
      const cx = 4600 + ((i * 263 - camX) % (W + 300)) - 100;
      const cy = 70 + (i * 97) % 340;
      ctx.fillStyle = i % 2 ? '#8ef0ff' : '#c49fff';
      ctx.globalAlpha = 0.4 + 0.3 * Math.sin(frame * 0.05 + i);
      ctx.beginPath();
      ctx.moveTo(cx, cy - 12); ctx.lineTo(cx + 8, cy);
      ctx.lineTo(cx, cy + 12); ctx.lineTo(cx - 8, cy);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    return;
  }

  // sol de cera amb rajos que giren
  const sunX = 840 - camX * 0.05;
  ctx.strokeStyle = '#ffd54f'; ctx.lineWidth = 4; ctx.lineCap = 'round';
  for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4 + frame * 0.008;
    ctx.beginPath();
    ctx.moveTo(sunX + Math.cos(a) * 55, 80 + Math.sin(a) * 55);
    ctx.lineTo(sunX + Math.cos(a) * 72, 80 + Math.sin(a) * 72);
    ctx.stroke();
  }
  ctx.fillStyle = '#ffe066';
  ctx.beginPath(); ctx.arc(sunX, 80, 45, 0, 7); ctx.fill();
  ctx.fillStyle = '#ffef9e';
  ctx.beginPath(); ctx.arc(sunX, 80, 35, 0, 7); ctx.fill();
  ctx.strokeStyle = '#f9c846'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(sunX, 80, 45, 0, 7); ctx.stroke();

  // núvols del fons (parallax)
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  for (let i = 0; i < 12; i++) {
    const cx = ((i*430 - camX*0.3) % (W+300)) - 150;
    const cy = 50 + (i*67) % 160;
    cloud(cx, cy, 1);
  }

  // turons verds
  ctx.fillStyle = '#7bc96f';
  for (let i = 0; i < 8; i++) {
    const hx = ((i*700 - camX*0.5) % (W+400)) - 200;
    ctx.beginPath(); ctx.arc(hx, 540, 160, Math.PI, 0); ctx.fill();
  }
}

function cloud(x, y, s) {
  ctx.beginPath();
  ctx.arc(x, y, 18*s, 0, 7);
  ctx.arc(x+22*s, y-8*s, 22*s, 0, 7);
  ctx.arc(x+44*s, y, 18*s, 0, 7);
  ctx.fill();
}

function drawPlatform(p) {
  if (p.type === 'ground') {
    // terra estil cera: taronja amb ratlles dibuixades
    ctx.fillStyle = '#e0a961';
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.strokeStyle = '#c98d45';
    ctx.lineWidth = 3;
    for (let sx = p.x + 14; sx < p.x + p.w; sx += 36) {
      ctx.beginPath();
      ctx.moveTo(sx, p.y + 24);
      ctx.lineTo(sx + 16, p.y + p.h - 8);
      ctx.stroke();
    }
    // herba verda amb vora de cera
    ctx.fillStyle = '#6fdc7f';
    ctx.fillRect(p.x, p.y, p.w, 16);
    ctx.strokeStyle = '#4caf50'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(p.x, p.y + 17); ctx.lineTo(p.x + p.w, p.y + 17); ctx.stroke();
    // florquetes
    for (let fx = p.x + 20; fx < p.x + p.w - 10; fx += 90) {
      ctx.fillStyle = ['#ff8fb3','#ffd166','#b48ef0'][(fx/90|0) % 3];
      ctx.beginPath(); ctx.arc(fx, p.y - 6, 4, 0, 7); ctx.fill();
      ctx.strokeStyle = '#388e3c'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(fx, p.y); ctx.lineTo(fx, p.y - 4); ctx.stroke();
    }
  } else if (p.type === 'rock') {
    // roca fosca de la cova
    ctx.fillStyle = '#4a3a5e';
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.strokeStyle = '#5d4a78';
    ctx.lineWidth = 3;
    for (let sx = p.x + 14; sx < p.x + p.w; sx += 40) {
      ctx.beginPath();
      ctx.moveTo(sx, p.y + 8);
      ctx.lineTo(sx + 14, p.y + p.h - 8);
      ctx.stroke();
    }
  } else if (p.type === 'spikes') {
    // les punxes del dibuix de l'Unai — AI que punxen!! ⚠️
    const n = Math.max(2, Math.round(p.w / 18));
    const sw = p.w / n;
    ctx.fillStyle = '#78909c';
    if (p.down) ctx.fillRect(p.x, p.y, p.w, 6);
    else ctx.fillRect(p.x, p.y + p.h - 6, p.w, 6);
    ctx.fillStyle = '#eceff1';
    ctx.strokeStyle = '#546e7a'; ctx.lineWidth = 2;
    for (let i = 0; i < n; i++) {
      ctx.beginPath();
      if (p.down) {   // punxes penjades del sostre!
        ctx.moveTo(p.x + i*sw, p.y + 5);
        ctx.lineTo(p.x + i*sw + sw/2, p.y + p.h);
        ctx.lineTo(p.x + (i+1)*sw, p.y + 5);
      } else {
        ctx.moveTo(p.x + i*sw, p.y + p.h - 5);
        ctx.lineTo(p.x + i*sw + sw/2, p.y);
        ctx.lineTo(p.x + (i+1)*sw, p.y + p.h - 5);
      }
      ctx.closePath(); ctx.fill(); ctx.stroke();
    }
  } else if (p.type === 'lego') {
    // BLOC DE LEGO!! colors vius amb els cercoletes de dalt 🧱
    const cols = ['#e53935', '#1e88e5', '#fdd835', '#43a047', '#8e24aa', '#fb8c00'];
    const c = cols[Math.abs((p.x / 160) | 0) % cols.length];
    ctx.fillStyle = c;
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 3;
    ctx.strokeRect(p.x, p.y, p.w, p.h);
    // els cercoletes de LEGO a dalt!
    ctx.fillStyle = 'rgba(255,255,255,0.30)';
    ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 2;
    for (let sx = p.x + 14; sx < p.x + p.w - 6; sx += 28) {
      ctx.beginPath(); ctx.arc(sx, p.y + 2, 9, Math.PI, 0); ctx.fill(); ctx.stroke();
    }
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(p.x, p.y + p.h - 6, p.w, 6);
  } else if (p.type === 'party') {
    // TERRA DE FESTA: cada tram un color viu amb confeti enganxat!! 🎉
    const cols = ['#ff5252', '#ff9800', '#ffeb3b', '#66bb6a', '#42a5f5', '#ab47bc'];
    ctx.fillStyle = cols[Math.abs((p.x / 160) | 0) % cols.length];
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.fillStyle = 'rgba(255,255,255,0.30)';
    ctx.fillRect(p.x, p.y, p.w, 8);
    ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 3;
    ctx.strokeRect(p.x, p.y, p.w, p.h);
    // trossets de confeti enganxats al terra!
    for (let sx = p.x + 10; sx < p.x + p.w - 8; sx += 34) {
      ctx.fillStyle = cols[((sx / 34) | 0 + 2) % 6];
      ctx.fillRect(sx, p.y + 12 + (sx % 3) * 9, 6, 6);
    }
  } else if (p.type === 'night') {
    // GESPA DE NIT: verd fosc amb floretes que brillen ✨
    ctx.fillStyle = '#2e7d32'; ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.fillStyle = '#1b5e20'; ctx.fillRect(p.x, p.y + p.h * 0.45, p.w, p.h * 0.55);
    ctx.fillStyle = '#66bb6a'; ctx.fillRect(p.x, p.y, p.w, 7);
    for (let gx = p.x + 6; gx < p.x + p.w - 4; gx += 26) {
      ctx.fillStyle = '#43a047';
      ctx.fillRect(gx, p.y - 5, 3, 5);
      if (((gx / 26) | 0) % 4 === 0) {   // floretes lluminoses!
        ctx.fillStyle = '#fff59d';
        ctx.fillRect(gx + 7, p.y - 9, 4, 4);
      }
    }
  } else if (p.type === 'sand') {
    // SORRA DEL DESERT! groguenca amb granets 🏜️
    ctx.fillStyle = '#e0ac45';
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.fillStyle = '#f0c96a';
    ctx.fillRect(p.x, p.y, p.w, 10);
    ctx.strokeStyle = '#b88a2e'; ctx.lineWidth = 3;
    ctx.strokeRect(p.x, p.y, p.w, p.h);
    ctx.fillStyle = '#c9922e';
    for (let sx = p.x + 15; sx < p.x + p.w - 10; sx += 45)
      ctx.fillRect(sx, p.y + p.h - 14, 5, 5);
  } else if (p.type === 'balloon') {
    // GLOBUS TRAMPOLÍ: gran, brillant i amb nusset! 🎈
    const cols = ['#ff5d8f', '#ffb84d', '#4dd2ff', '#9d6bff', '#5dff8f', '#ffd166'];
    const c = cols[Math.abs((p.x / 40) | 0) % cols.length];
    const pulse = 1 + Math.sin(frame * 0.12 + p.x * 0.1) * 0.06;
    const cx = p.x + p.w / 2, cy = p.y + p.h / 2;
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.ellipse(cx, cy, p.w / 2, p.h / 2 * pulse, 0, 0, 7);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.22)'; ctx.lineWidth = 3;
    ctx.stroke();
    // brillantor de globus
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.beginPath();
    ctx.ellipse(p.x + p.w * 0.28, cy - p.h * 0.16, p.w * 0.09, p.h * 0.15, -0.4, 0, 7);
    ctx.fill();
    // nusset del globus a baix
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.moveTo(cx - 6, p.y + p.h - 2);
    ctx.lineTo(cx + 6, p.y + p.h - 2);
    ctx.lineTo(cx, p.y + p.h + 8);
    ctx.fill();
  } else if (p.type === 'choco') {
    // rajola de XOCOLATA! 🍫 amb quadres i tot
    ctx.fillStyle = '#5d3a1a';
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.fillStyle = '#7b4f24';
    ctx.fillRect(p.x, p.y, p.w, 10);
    ctx.strokeStyle = '#3e2410'; ctx.lineWidth = 3;
    for (let sx = p.x + 30; sx < p.x + p.w - 10; sx += 60) {
      ctx.beginPath(); ctx.moveTo(sx, p.y); ctx.lineTo(sx, p.y + p.h); ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(p.x, p.y + p.h/2); ctx.lineTo(p.x + p.w, p.y + p.h/2); ctx.stroke();
    ctx.strokeRect(p.x, p.y, p.w, p.h);
    // brillantor de xocolata!
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    for (let sx = p.x + 8; sx < p.x + p.w - 30; sx += 60)
      ctx.fillRect(sx, p.y + 4, 18, 5);
  } else if (p.type === 'pipec') {
    // canonada de claveguera: metall verd fosc amb reblons!
    ctx.fillStyle = '#2f5d50';
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.fillStyle = '#3d7a68';
    ctx.fillRect(p.x, p.y, p.w, 8);
    ctx.strokeStyle = '#1d3f35'; ctx.lineWidth = 3;
    ctx.strokeRect(p.x, p.y, p.w, p.h);
    // anelles de la canonada
    for (let sx = p.x + 40; sx < p.x + p.w; sx += 80) {
      ctx.beginPath(); ctx.moveTo(sx, p.y); ctx.lineTo(sx, p.y + p.h); ctx.stroke();
    }
    // reblons brillants
    ctx.fillStyle = '#4d8f7a';
    for (let sx = p.x + 16; sx < p.x + p.w; sx += 80)
      ctx.fillRect(sx, p.y + 3, 5, 5);
  } else if (p.type === 'tower') {
    // pedra del castell de l'escalada: maons grisos blavosos!
    ctx.fillStyle = '#7d8aa0';
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.strokeStyle = '#4a5568'; ctx.lineWidth = 2;
    for (let yy = p.y + 14; yy < p.y + p.h; yy += 14) {
      ctx.beginPath(); ctx.moveTo(p.x, yy); ctx.lineTo(p.x + p.w, yy); ctx.stroke();
    }
    for (let yy = p.y, i = 0; yy < p.y + p.h; yy += 14, i++)
      for (let xx = p.x + (i % 2) * 15; xx < p.x + p.w; xx += 30) {
        ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx, Math.min(yy + 14, p.y + p.h)); ctx.stroke();
      }
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.fillRect(p.x, p.y, p.w, 5);
  } else if (p.type === 'snow') {
    // NEU del cim del Fuji! blanca amb ombra blava gelada ❄️
    ctx.fillStyle = '#e8f4ff';
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(p.x, p.y, p.w, 8);
    ctx.strokeStyle = '#90b8d8'; ctx.lineWidth = 3;
    ctx.strokeRect(p.x, p.y, p.w, p.h);
    // cristallets de neu
    ctx.fillStyle = '#b8d8f0';
    for (let sx = p.x + 18; sx < p.x + p.w - 10; sx += 55)
      ctx.fillRect(sx, p.y + p.h - 10, 4, 4);
  } else if (p.type === 'metal') {
    // metall del castell elèctric: gris brillant amb ratlles de perill!
    ctx.fillStyle = '#546e7a';
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.fillStyle = '#78909c';
    ctx.fillRect(p.x, p.y, p.w, 8);
    ctx.strokeStyle = '#263238'; ctx.lineWidth = 3;
    ctx.strokeRect(p.x, p.y, p.w, p.h);
    // ratlles de perill grogues i negres!
    for (let sx = p.x + 8; sx < p.x + p.w - 20; sx += 40) {
      ctx.fillStyle = '#ffd600';
      ctx.beginPath();
      ctx.moveTo(sx, p.y + 10); ctx.lineTo(sx + 14, p.y + 10);
      ctx.lineTo(sx + 6, p.y + 20); ctx.lineTo(sx - 8, p.y + 20);
      ctx.fill();
    }
    // reblons
    ctx.fillStyle = '#90a4ae';
    for (let sx = p.x + 20; sx < p.x + p.w; sx += 60)
      ctx.fillRect(sx, p.y + p.h - 8, 4, 4);
  } else if (p.type === 'qblock') {
    // bloc "?" sorpresa — gris si ja l'has fet servir
    drawSprite(QBLOCK, p.x, p.y, false, p.used ? {W:'#7a7a8a', K:'#444'} : null);
  } else if (p.type === 'pipe' || p.type === 'castle') {
    // els tubs i el castell es dibuixen amb drawPipe() i drawCastle()
  } else {
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    cloud(p.x + p.w*0.25, p.y + 12, 0.8);
    cloud(p.x + p.w*0.65, p.y + 12, 0.8);
    ctx.fillRect(p.x + 10, p.y + 4, p.w - 20, p.h - 4);
  }
}

function drawDino(p) {
  // EL POSHI de l'Unai!! la versió gran i detallada es dibuixa
  // DESPRÉS, a pantalla completa (a game.js) — aquí només el pla B
  const ph = 56, pw = Math.round(ph * POSHI_W / POSHI_H);
  const sx = p.x + p.w/2 - pw/2;
  const sy = p.y + p.h - ph;
  if (p.inv > 0 && frame % 6 < 3) ctx.globalAlpha = 0.4;
  // amb l'estrella, una aurèola d'arc iris al darrere!
  if (p.invStar > 0) {
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = `hsl(${frame * 30 % 360}, 85%, 60%)`;
    ctx.beginPath();
    ctx.ellipse(p.x + p.w/2, p.y + p.h/2, pw * 0.85, ph * 0.75, 0, 0, 7);
    ctx.fill();
    ctx.restore();
  }
  if (!POSHI_OK) {
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    if (p.facing === 1) {
      ctx.translate(sx + pw, sy);
      ctx.scale(-1, 1);
      ctx.drawImage(POSHI_CANVAS, 0, 0, pw, ph);
    } else {
      ctx.drawImage(POSHI_CANVAS, sx, sy, pw, ph);
    }
    ctx.restore();
  }
  // el nadó Mario a l'esquena!
  if (p.baby) {
    const bx = p.facing === 1 ? sx + S : sx + 9*S;
    drawSprite(BABY, bx, sy - 2*S + Math.sin(frame*0.2), false);
  }
  ctx.globalAlpha = 1;

  // llengua!
  if (p.tongue > 0) {
    const t = 1 - Math.abs(p.tongue - 8) / 8;   // 0→1→0
    const len = t * 64;
    const ty = p.y + 20;
    const tx = p.facing === 1 ? p.x + p.w - 6 : p.x + 6;
    ctx.strokeStyle = '#ff6f91';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(tx + p.facing*len, ty);
    ctx.stroke();
    ctx.fillStyle = '#ff6f91';
    ctx.beginPath(); ctx.arc(tx + p.facing*len, ty, 6, 0, 7); ctx.fill();
  }
}

function drawEnemy(e) {
  if (e.boss) {
    if (e.dragon) {
      // EL DRAC D'ELECTRICITAT!!! 🐉⚡
      const cx = e.x + e.w/2, cy = e.y + e.h/2;
      const col = e.hurt > 0 ? '#ffffff' : '#42a5f5';
      const dark = e.hurt > 0 ? '#ffffff' : '#1565c0';
      // cua serpentina que oneja, acabada en espurna!
      const tx = cx - 95, ty = cy + Math.sin(frame * 0.08) * 24;
      ctx.strokeStyle = dark; ctx.lineWidth = 16; ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx - 20, cy);
      ctx.quadraticCurveTo(cx - 60, cy - 30 + Math.sin(frame * 0.1) * 16, tx, ty);
      ctx.stroke();
      if (frame % 20 < 14) {
        ctx.strokeStyle = '#ffee58'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(tx, ty);
        ctx.lineTo(tx - 14, ty - 10); ctx.lineTo(tx - 6, ty - 20); ctx.lineTo(tx - 20, ty - 28);
        ctx.stroke();
      }
      // ales fetes de llampecs!
      ctx.fillStyle = 'rgba(255,238,88,0.85)';
      ctx.beginPath();
      ctx.moveTo(cx - 10, cy - 10);
      ctx.lineTo(cx - 45, cy - 55 - Math.sin(frame * 0.15) * 10);
      ctx.lineTo(cx - 20, cy - 45);
      ctx.lineTo(cx - 42, cy - 18);
      ctx.fill();
      // cos i ventre
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.ellipse(cx, cy, e.w/2 - 10, e.h/2 - 20, 0, 0, 7); ctx.fill();
      ctx.strokeStyle = dark; ctx.lineWidth = 4; ctx.stroke();
      ctx.fillStyle = e.hurt > 0 ? '#ffffff' : '#bbdefb';
      ctx.beginPath(); ctx.ellipse(cx + 8, cy + 14, e.w/2 - 30, e.h/2 - 38, 0, 0, 7); ctx.fill();
      // cap amb musell
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.ellipse(cx + 28, cy - 22, 26, 20, 0, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx + 52, cy - 16, 16, 10, 0.2, 0, 7); ctx.fill();
      // banyes de llampec!
      ctx.strokeStyle = '#ffee58'; ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx + 20, cy - 40); ctx.lineTo(cx + 14, cy - 58); ctx.lineTo(cx + 22, cy - 52); ctx.lineTo(cx + 18, cy - 66);
      ctx.moveTo(cx + 38, cy - 40); ctx.lineTo(cx + 42, cy - 56); ctx.lineTo(cx + 48, cy - 48); ctx.lineTo(cx + 54, cy - 62);
      ctx.stroke();
      // ull vermell furiós!
      ctx.fillStyle = 'white';
      ctx.beginPath(); ctx.arc(cx + 32, cy - 26, 8, 0, 7); ctx.fill();
      ctx.fillStyle = '#ff1744';
      ctx.beginPath(); ctx.arc(cx + 34, cy - 25, 4, 0, 7); ctx.fill();
      ctx.strokeStyle = dark; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(cx + 20, cy - 38); ctx.lineTo(cx + 42, cy - 33); ctx.stroke();
      // espurnes que li voltant el cos!
      if (frame % 8 < 5) {
        ctx.strokeStyle = '#ffee58'; ctx.lineWidth = 3;
        for (let i = 0; i < 3; i++) {
          const a = frame * 0.2 + i * 2.1;
          const sx2 = cx + Math.cos(a) * (e.w/2 + 14);
          const sy2 = cy + Math.sin(a) * (e.h/2 - 10);
          ctx.beginPath();
          ctx.moveTo(sx2, sy2); ctx.lineTo(sx2 + 8, sy2 - 10); ctx.lineTo(sx2 + 2, sy2 - 16);
          ctx.stroke();
        }
      }
      // si dorm... Zzzzz 💤
      if (e.asleep) {
        ctx.fillStyle = '#90caf9';
        ctx.font = 'bold 18px monospace';
        ctx.fillText('z', cx - 40 + Math.sin(frame*0.05)*4, cy - 60);
        ctx.fillText('Z', cx - 55 + Math.sin(frame*0.05 + 1)*4, cy - 85 - (frame % 80) * 0.2);
      }
    } else if (e.poop) {
      // LA CACA GEGANT!!! 💩😠
      const cx = e.x + e.w / 2, base = e.y + e.h;
      const c = e.hurt > 0 ? '#ffffff' : '#6d4c41';
      ctx.fillStyle = c;
      ctx.beginPath(); ctx.ellipse(cx, base - 22, e.w/2 + 14, 24, 0, 0, 7); ctx.fill();       // cua grossa
      ctx.beginPath(); ctx.ellipse(cx, base - 58, e.w/2 - 6, 24, 0, 0, 7); ctx.fill();        // el mig
      ctx.beginPath(); ctx.ellipse(cx, base - 90, e.w/2 - 24, 20, 0, 0, 7); ctx.fill();       // dalt
      ctx.beginPath(); ctx.ellipse(cx + 5, base - 108, 12, 10, -0.4, 0, 7); ctx.fill();       // la punta
      ctx.strokeStyle = '#4e342e'; ctx.lineWidth = 4; ctx.stroke();
      // ulls enfadats
      ctx.fillStyle = 'white';
      ctx.beginPath(); ctx.arc(cx - 15, base - 62, 9, 0, 7); ctx.arc(cx + 15, base - 62, 9, 0, 7); ctx.fill();
      ctx.fillStyle = '#222';
      ctx.beginPath(); ctx.arc(cx - 13, base - 60, 4, 0, 7); ctx.arc(cx + 17, base - 60, 4, 0, 7); ctx.fill();
      ctx.strokeStyle = '#3e2410'; ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx - 26, base - 78); ctx.lineTo(cx - 8, base - 70);
      ctx.moveTo(cx + 26, base - 78); ctx.lineTo(cx + 8, base - 70);
      ctx.stroke();
      // dentets
      ctx.fillStyle = 'white';
      ctx.fillRect(cx - 10, base - 40, 7, 9); ctx.fillRect(cx + 4, base - 40, 7, 9);
      // núvols de pudor que pugen!!
      for (let i = 0; i < 3; i++) {
        const sx2 = cx - 30 + i * 30;
        ctx.strokeStyle = 'rgba(139,116,70,0.85)'; ctx.lineWidth = 4; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(sx2, e.y - 14 + Math.sin(frame * 0.1 + i) * 4);
        ctx.quadraticCurveTo(sx2 + 10, e.y - 34, sx2, e.y - 52 + Math.sin(frame * 0.13 + i) * 4);
        ctx.stroke();
      }
    } else if (e.balloon) {
      // EL GLOBUS GEGANT!!! 🎈😠
      const cx = e.x + e.w / 2, cy = e.y + e.h / 2 - 6;
      const squish = 1 + Math.sin(frame * 0.1) * 0.06;
      const c = e.hurt > 0 ? '#ffffff' : '#ff5d8f';
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.ellipse(cx, cy, e.w / 2 + 16, e.h / 2 * squish, 0, 0, 7);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 4; ctx.stroke();
      // brillantor
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.beginPath();
      ctx.ellipse(cx - e.w * 0.22, cy - e.h * 0.24, 12, 18, -0.5, 0, 7);
      ctx.fill();
      // ulls enfadats
      ctx.fillStyle = 'white';
      ctx.beginPath(); ctx.arc(cx - 16, cy - 14, 10, 0, 7); ctx.arc(cx + 16, cy - 14, 10, 0, 7); ctx.fill();
      ctx.fillStyle = '#222';
      ctx.beginPath(); ctx.arc(cx - 13, cy - 12, 5, 0, 7); ctx.arc(cx + 19, cy - 12, 5, 0, 7); ctx.fill();
      // celles molt enfadades!
      ctx.strokeStyle = '#222'; ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(cx - 28, cy - 32); ctx.lineTo(cx - 8, cy - 22);
      ctx.moveTo(cx + 28, cy - 32); ctx.lineTo(cx + 8, cy - 22);
      ctx.stroke();
      // boca oberta cridant!
      ctx.fillStyle = '#7a1f3d';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 16, 10 + Math.sin(frame * 0.2) * 3, 12, 0, 0, 7);
      ctx.fill();
      // nusset i corda que oneja
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.moveTo(cx - 8, cy + e.h / 2 - 4); ctx.lineTo(cx + 8, cy + e.h / 2 - 4);
      ctx.lineTo(cx, cy + e.h / 2 + 8); ctx.fill();
      ctx.strokeStyle = '#d4a5b5'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(cx, cy + e.h / 2 + 8);
      ctx.quadraticCurveTo(cx + Math.sin(frame * 0.08) * 16, cy + e.h / 2 + 36,
                           cx - Math.sin(frame * 0.11) * 12, cy + e.h / 2 + 60);
      ctx.stroke();
    } else if (e.stone) {
      // LA CARA DE PEDRA!! 🗿 el boss rodó del dibuix de l'Unai!
      const cx = e.x + e.w/2, cy = e.y + e.h/2;
      const c = e.hurt > 0 ? '#ffffff' : '#9e9e9e';
      ctx.fillStyle = c;
      ctx.beginPath(); ctx.ellipse(cx, cy, e.w/2 + 8, e.h/2, 0, 0, 7); ctx.fill();
      ctx.strokeStyle = '#616161'; ctx.lineWidth = 5; ctx.stroke();
      // esquerdes de pedra
      ctx.strokeStyle = '#757575'; ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx - 25, cy - 35); ctx.lineTo(cx - 15, cy - 20); ctx.lineTo(cx - 28, cy - 5);
      ctx.moveTo(cx + 30, cy - 30); ctx.lineTo(cx + 22, cy - 12); ctx.lineTo(cx + 34, cy + 2);
      ctx.stroke();
      // ulls enfadats amb pupiles vermelles!
      ctx.fillStyle = 'white';
      ctx.beginPath(); ctx.arc(cx - 16, cy - 12, 10, 0, 7); ctx.arc(cx + 16, cy - 12, 10, 0, 7); ctx.fill();
      ctx.fillStyle = '#b71c1c';
      ctx.beginPath(); ctx.arc(cx - 13, cy - 10, 5, 0, 7); ctx.arc(cx + 19, cy - 10, 5, 0, 7); ctx.fill();
      // celles molt enfadades
      ctx.strokeStyle = '#424242'; ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(cx - 30, cy - 28); ctx.lineTo(cx - 6, cy - 18);
      ctx.moveTo(cx + 30, cy - 28); ctx.lineTo(cx + 6, cy - 18);
      ctx.stroke();
      // boca amb dents quadrades com el dibuix!
      ctx.fillStyle = '#37474f';
      ctx.fillRect(cx - 22, cy + 12, 44, 16);
      ctx.fillStyle = 'white';
      for (let i = 0; i < 4; i++) ctx.fillRect(cx - 20 + i*11, cy + 13, 9, 7);
    } else if (e.flyking) {
      // EL FLY GUY GEGANT, REI DEL CASTELL!! 🧢👑
      const over = {R: e.hurt > 0 ? '#ffffff' : '#ff5252'};
      drawSprite(frame % 8 < 4 ? FLY_A : FLY_B, e.x + e.w/2 - 45, e.y + e.h - 81, e.vx < 0, over, 3);
      // corona daurada de rei!
      const kx = e.x + e.w/2, ky = e.y + e.h - 56;
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(kx - 15, ky - 10, 30, 9);
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(kx + i*12 - 5, ky - 10); ctx.lineTo(kx + i*12, ky - 20); ctx.lineTo(kx + i*12 + 5, ky - 10);
        ctx.fill();
      }
      ctx.fillStyle = '#ff1744';
      ctx.fillRect(kx - 3, ky - 8, 6, 5);   // la gemma vermella de la corona!
    } else if (e.alien) {
      // L'ALIEN GEGANT de l'espai!
      const over = {G: e.hurt > 0 ? '#ffffff' : '#4CAF50'};
      drawSprite(ALIEN, e.x + e.w/2 - 36, e.y + e.h - 60, e.vx < 0, over, 2);
    } else {
      // EL BOSS: un Shy Guy GEGEGANT! (parpelleja blanc quan li fas mal)
      const over = {R: e.hurt > 0 ? '#ffffff' : (ROBE[e.color] || '#ff5252')};
      drawSprite(frame % 20 < 10 ? SHYGUY_A : SHYGUY_B,
                 e.x + e.w/2 - 36, e.y + e.h - 84, e.vx < 0, over, 2);
    }
    // cors de vida del boss
    for (let i = 0; i < e.hp; i++)
      drawSprite(HEART, e.x + e.w/2 - 40 + i * 28, e.y - 44);
    return;
  }
  const over = {R: ROBE[e.color] || '#ff5252'};
  if (e.poop) {
    drawSprite(POOP, e.x + e.w/2 - 15, e.y + e.h - 24, e.vx < 0);
  } else if (e.fish) {
    drawSprite(FISH, e.x + e.w/2 - 24, e.y + e.h - 24, e.vx < 0);
  } else if (e.spiky) {
    drawSprite(SPIKY, e.x + e.w/2 - 18, e.y + e.h - 30, e.vx < 0);
  } else if (e.fly) {
    // Fly Guy: l'hèlix gira!
    drawSprite(frame % 8 < 4 ? FLY_A : FLY_B, e.x + e.w/2 - 15, e.y, e.vx < 0, over);
  } else {
    drawSprite(frame % 20 < 10 ? SHYGUY_A : SHYGUY_B, e.x + e.w/2 - 18, e.y + e.h - 42, e.vx < 0, over);
  }
}

function drawPlant(pl) {
  const py = pl.gy - 20 - pl.pop * 38;
  // la planta es dibuixa primer, el test la tapa → sembla que surt!
  drawSprite(pl.pop > 0.5 ? PLANT_B : PLANT_A, pl.x - 15, py - 21);
  ctx.fillStyle = '#1f9e4b';
  ctx.fillRect(pl.x - 18, pl.gy - 20, 36, 20);
  ctx.fillStyle = '#37c862';
  ctx.fillRect(pl.x - 21, pl.gy - 24, 42, 8);
  ctx.strokeStyle = '#146332'; ctx.lineWidth = 2;
  ctx.strokeRect(pl.x - 21, pl.gy - 24, 42, 8);
}

// arbres i bolets per decorar el món! (i torxes al castell!)
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
function drawDecor() {
  if (levelNum === 3) {
    // estrelles grans que decoren el cel espacial
    for (const sx of [200, 800, 1400, 2100, 2700, 3300, 3900, 4550, 5200, 5900, 6400]) {
      ctx.globalAlpha = 0.5 + 0.5 * Math.sin(frame * 0.07 + sx);
      drawSprite(STAR, sx, 120 + (sx % 3) * 40);
    }
    ctx.globalAlpha = 1;
    return;
  }
  if (levelNum === 2) {
    // torxes penjades a les parets del castell
    for (const tx of [150, 700, 1300, 1900, 2450, 3000, 3600, 4100]) {
      ctx.globalAlpha = 0.7 + 0.3 * Math.sin(frame * 0.2 + tx);   // la flama tremola!
      drawSprite(TORCH, tx, 385);
      ctx.globalAlpha = 1;
    }
    return;
  }
  if (levelNum === 5) {
    // la boca de la mina: un munt de xocolata enorme!
    ctx.fillStyle = '#5d3a1a';
    ctx.beginPath(); ctx.arc(3400, 540, 240, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#1e1009';
    ctx.beginPath(); ctx.arc(3400, 540, 150, Math.PI, 0); ctx.fill();
    // estalactites de xocolata penjant del sostre de la mina!
    for (let x = 3450; x < 6900; x += 150) {
      const len = 25 + (x % 3) * 16;
      ctx.fillStyle = '#4e342e';
      ctx.beginPath();
      ctx.moveTo(x, 110); ctx.lineTo(x + 26, 110); ctx.lineTo(x + 13, 110 + len);
      ctx.fill();
    }
    // degotets de xocolata que cauen del sostre!
    for (let i = 0; i < 8; i++) {
      const dx = 3520 + i * 410;
      const dy = 120 + ((frame * 1.6 + i * 220) % 340);
      ctx.fillStyle = '#8d6e63';
      ctx.fillRect(dx, dy, 5, 9);
    }
    // bastons de caramel al costat del riu!
    for (const cx of [180, 1250, 2300, 3150]) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(cx, 370, 14, 70);
      ctx.fillStyle = '#ff5252';
      for (let y = 375; y < 435; y += 14) ctx.fillRect(cx, y, 14, 7);
      ctx.beginPath(); ctx.arc(cx + 7, 370, 9, Math.PI, 0); ctx.fill();
    }
    return;
  }
  if (levelNum === 7) {
    // PALMERES de la selva amb cocos!
    for (const px of [150, 750, 1150, 1800, 2350, 2900, 3450, 4000, 4600, 5250]) {
      ctx.strokeStyle = '#8d6e63'; ctx.lineWidth = 14; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(px, 480);
      ctx.quadraticCurveTo(px + 12, 400, px + 25, 330); ctx.stroke();
      ctx.strokeStyle = '#2e7d32'; ctx.lineWidth = 8;
      for (let a = -2; a <= 2; a++) {
        ctx.beginPath(); ctx.moveTo(px + 25, 330);
        ctx.quadraticCurveTo(px + 25 + a*35, 295, px + 25 + a*55, 330 + Math.abs(a)*12);
        ctx.stroke();
      }
      ctx.fillStyle = '#5d4037';
      ctx.beginPath(); ctx.arc(px + 17, 336, 7, 0, 7); ctx.arc(px + 33, 336, 7, 0, 7); ctx.fill();
    }
    // lianes que pengen i es mouen amb el vent!
    for (const vx of [450, 1350, 2250, 3150, 4050, 4950]) {
      const swing = Math.sin(frame * 0.05 + vx) * 25;
      ctx.strokeStyle = '#388e3c'; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(vx, 0);
      ctx.quadraticCurveTo(vx + swing * 0.7, 120, vx + swing, 215);
      ctx.stroke();
      ctx.fillStyle = '#66bb6a';
      ctx.beginPath(); ctx.ellipse(vx + swing, 222, 8, 12, 0, 0, 7); ctx.fill();
    }
    return;
  }
  if (levelNum === 10) {
    // ESTENDARDS vermells amb la U d'Unai penjant del sostre! 🚩
    for (const bx of [300, 900, 1900, 2800, 3400, 4300, 5100, 5800]) {
      ctx.fillStyle = '#c62828';
      ctx.beginPath();
      ctx.moveTo(bx, 0); ctx.lineTo(bx + 56, 0); ctx.lineTo(bx + 56, 130);
      ctx.lineTo(bx + 28, 158); ctx.lineTo(bx, 130); ctx.fill();
      ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 3;
      ctx.strokeRect(bx + 6, 8, 44, 60);
      ctx.fillStyle = '#ffd700';
      ctx.font = 'bold 36px monospace'; ctx.textAlign = 'center';
      ctx.fillText('U', bx + 28, 52);
      ctx.textAlign = 'left';
    }
    // torxes a les parets de les torres!
    for (const tx2 of [500, 1700, 2800, 3900, 5000, 5900]) {
      ctx.fillStyle = '#5d4037';
      ctx.fillRect(tx2, 300, 10, 24);
      ctx.fillStyle = '#ff9800';
      ctx.beginPath(); ctx.ellipse(tx2 + 5, 292 + Math.sin(frame*0.15 + tx2)*4, 9, 14, 0, 0, 7); ctx.fill();
      ctx.fillStyle = '#ffeb3b';
      ctx.beginPath(); ctx.ellipse(tx2 + 5, 294 + Math.sin(frame*0.15 + tx2)*4, 5, 8, 0, 0, 7); ctx.fill();
    }
    return;
  }
  if (levelNum === 9) {
    // TORII: la porta japonesa vermella de l'entrada! ⛩️
    ctx.fillStyle = '#d32f2f';
    ctx.fillRect(60, 300, 16, 180);   ctx.fillRect(190, 300, 16, 180);
    ctx.fillRect(30, 280, 210, 18);   // biga de dalt
    ctx.fillRect(45, 330, 175, 12);   // biga del mig
    ctx.fillStyle = '#8e0000';
    ctx.fillRect(30, 298, 210, 8);
    // ARBRES DE SAKURA! 🌸 tronc corbat + bombolles rosa de flors
    for (const tx of [350, 800, 1400, 1950, 2500, 3050]) {
      ctx.strokeStyle = '#6d4c41'; ctx.lineWidth = 12; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(tx, 480);
      ctx.quadraticCurveTo(tx + 10, 400, tx + 25, 345); ctx.stroke();
      ctx.strokeStyle = '#795548'; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.moveTo(tx + 14, 415);
      ctx.quadraticCurveTo(tx + 45, 390, tx + 60, 365); ctx.stroke();
      // el pom de flors rosa!!
      ctx.fillStyle = '#ffb7d5';
      ctx.beginPath(); ctx.arc(tx + 25, 320, 52, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.arc(tx - 15, 345, 38, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.arc(tx + 65, 345, 40, 0, 7); ctx.fill();
      ctx.fillStyle = '#ffd7e8';
      ctx.beginPath(); ctx.arc(tx + 15, 310, 22, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.arc(tx + 55, 335, 16, 0, 7); ctx.fill();
    }
    // llisos de pedra japonesos al camí
    for (const lx of [500, 1200, 1800, 2400, 2900]) {
      ctx.fillStyle = '#9e9e9e';
      ctx.beginPath(); ctx.ellipse(lx, 470, 22, 8, 0, 0, 7); ctx.fill();
    }
    // núvols de fons al tram dels núvols!
    if (player.x > 6800) {
      for (const cx of [7100, 7600, 8100, 8600, 9000]) {
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.beginPath(); ctx.arc(cx, 120 + (cx % 3) * 40, 55, 0, 7); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + 45, 130 + (cx % 3) * 40, 40, 0, 7); ctx.fill();
      }
    }
    return;
  }
  if (levelNum === 8) {
    // cables que pengen amb bombetes vermelles que parpellegen!
    for (const cx of [300, 900, 1700, 2500, 3300, 4200, 5000, 5800, 6600, 7400, 8300]) {
      const len = 60 + (cx % 3) * 30;
      const sway = Math.sin(frame * 0.04 + cx) * 15;
      ctx.strokeStyle = '#37474f'; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx + sway, len); ctx.stroke();
      if ((frame + cx) % 90 < 45) {
        ctx.fillStyle = '#ff5252';
        ctx.beginPath(); ctx.arc(cx + sway, len + 8, 8, 0, 7); ctx.fill();
      }
    }
    return;
  }
  if (levelNum === 6) {
    // degots d'aigua que cauen del sostre de la canonada!
    for (let i = 0; i < 10; i++) {
      const dx = 300 + i * 760;
      const dy = 82 + ((frame * 2.2 + i * 200) % 370);
      ctx.fillStyle = '#7fd8c9';
      ctx.fillRect(dx, dy, 4, 8);
    }
    // vàlvules vermelles a les canonades!
    for (const vx2 of [500, 1500, 2600, 3700, 4800, 5900, 7000, 7700]) {
      ctx.strokeStyle = '#c62828'; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(vx2, 140, 16, 0, 7); ctx.stroke();
      ctx.beginPath();
      for (let a = 0; a < 4; a++) {
        const an = a * Math.PI / 2 + 0.4;
        ctx.moveTo(vx2, 140); ctx.lineTo(vx2 + Math.cos(an) * 16, 140 + Math.sin(an) * 16);
      }
      ctx.stroke();
    }
    return;
  }
  if (levelNum === 12) {
    // SENYALS DE NEÓ de Tòquio que parpellegen!! 🌃
    const neonCols = ['#ff2d78', '#00e5ff', '#ffea00', '#76ff03'];
    for (const nx of [600, 1350, 2200, 3100, 4500, 5600, 7200, 8000, 9200, 10200, 11000]) {
      const on = (frame + nx) % 80 < 55;
      const ny = 170 + (nx % 4) * 40;
      ctx.fillStyle = on ? neonCols[(nx / 450 | 0) % 4] : '#37474f';
      ctx.fillRect(nx, ny, 26, 76);
      ctx.strokeStyle = '#212121'; ctx.lineWidth = 3;
      ctx.strokeRect(nx, ny, 26, 76);
      if (on) {
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        for (let d = 0; d < 3; d++) ctx.fillRect(nx + 8, ny + 12 + d * 22, 10, 10);
      }
    }
    // TORIIS vermells a la zona del temple! ⛩️
    for (const tx of [3650, 4150, 4650]) {
      ctx.fillStyle = '#d32f2f';
      ctx.fillRect(tx, 300, 16, 180);      ctx.fillRect(tx + 130, 300, 16, 180);
      ctx.fillRect(tx - 20, 280, 186, 18); ctx.fillRect(tx - 5, 330, 156, 12);
      ctx.fillStyle = '#8e0000';
      ctx.fillRect(tx - 20, 298, 186, 8);
    }
    // arbres de sakura rosa escampats pels carrers 🌸
    for (const tx of [400, 1600, 6600, 7900, 11400]) {
      ctx.fillStyle = '#6d4c41';
      ctx.fillRect(tx, 440, 12, 40);
      ctx.fillStyle = '#ffb7d5';
      ctx.beginPath(); ctx.arc(tx + 6, 425, 26, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.arc(tx - 12, 438, 16, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.arc(tx + 24, 438, 16, 0, 7); ctx.fill();
    }
    return;
  }
  if (levelNum === 1) {
    // CACTUS del desert! 🌵
    for (const cx of [250, 850, 1050, 2000, 2550]) {
      ctx.fillStyle = '#2e7d32';
      ctx.fillRect(cx, 408, 18, 72);
      ctx.fillRect(cx - 14, 426, 14, 10); ctx.fillRect(cx - 14, 412, 8, 16);
      ctx.fillRect(cx + 18, 436, 14, 10); ctx.fillRect(cx + 24, 420, 8, 18);
      ctx.fillStyle = '#66bb6a';
      ctx.fillRect(cx + 4, 412, 4, 60);
    }
    // torxes que tremolen a la MASMORRA del castell!
    for (const tx of [3100, 3700, 4300, 4900, 5500]) {
      ctx.globalAlpha = 0.7 + 0.3 * Math.sin(frame * 0.2 + tx);
      drawSprite(TORCH, tx, 385);
      ctx.globalAlpha = 1;
    }
    // floretes del pati-jardí!
    for (const fx of [6300, 6520, 6700, 7650, 7820, 8000, 8500])
      drawSprite(FLOWER, fx, 435);
    for (const mx of [6600, 7850])
      drawSprite(MUSH, mx, 462);
    return;
  }
  for (const tx of [80, 550, 720, 1100, 1700, 2200, 2750, 3100, 3500])
    drawSprite(TREE, tx, 480 - 24);
  for (const mx of [950, 1900, 2600, 3850])
    drawSprite(MUSH, mx, 480 - 18);
}

function drawFruit(f) {
  const y = f.y + Math.sin(frame*0.08 + f.bob)*3;
  if (f.type === 'apple') drawSprite(APPLE, f.x - 4*S, y - 4*S);
  else if (f.type === 'coin') drawSprite(COIN, f.x - 4*S, y - 3.5*S);
  else if (f.type === 'grape') drawSprite(GRAPE, f.x - 4*S, y - 4*S);
  else drawSprite(FLOWER, f.x - 5*S, y - 4.5*S);
}

function drawEgg(e) {
  drawSprite(EGG, e.x - 3.5*S, e.y - 3.5*S);
}

function drawBubble(b) {
  ctx.save();
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = '#cfefff';
  ctx.beginPath(); ctx.arc(b.x, b.y, 20, 0, 7); ctx.fill();
  ctx.globalAlpha = 1;
  ctx.strokeStyle = 'white'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(b.x, b.y, 20, 0, 7); ctx.stroke();
  // nadó dins la bombolla (en pixel art!)
  drawSprite(BABY, b.x - 3*S, b.y - 2*S + Math.sin(frame*0.3), false);
  ctx.restore();
}

function drawPipe(t) {
  ctx.fillStyle = '#1f9e4b';
  ctx.fillRect(t.x, t.y + 12, t.w, t.h - 12);
  ctx.fillStyle = '#37c862';
  ctx.fillRect(t.x - 5, t.y, t.w + 10, 16);
  ctx.fillStyle = '#1f9e4b';
  ctx.fillRect(t.x - 5, t.y + 10, t.w + 10, 6);
  ctx.strokeStyle = '#146332'; ctx.lineWidth = 3;
  ctx.strokeRect(t.x - 5, t.y, t.w + 10, 16);
  ctx.strokeRect(t.x, t.y + 12, t.w, t.h - 12);
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillRect(t.x + 7, t.y + 18, 6, t.h - 18);
  // avis: ↓ secret!
  if (player.x + player.w > t.x - 10 && player.x < t.x + t.w + 10 && frame % 40 < 20) {
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('↓', t.x + t.w/2, t.y - 10);
    ctx.textAlign = 'left';
  }
}

// ===== LA PORTA VERMELLA DEL BOSS! 🚪 =====
function drawDoor(d) {
  // marc d'or amb arc
  ctx.fillStyle = '#ffb300';
  ctx.beginPath(); ctx.arc(d.x + d.w/2, d.y + 16, d.w/2 + 8, Math.PI, 0); ctx.fill();
  ctx.fillRect(d.x - 8, d.y + 16, d.w + 16, d.h - 16);
  // la porta vermella!
  ctx.fillStyle = '#b71c1c';
  ctx.beginPath(); ctx.arc(d.x + d.w/2, d.y + 16, d.w/2, Math.PI, 0); ctx.fill();
  ctx.fillRect(d.x, d.y + 16, d.w, d.h - 16);
  // taulons de fusta
  ctx.strokeStyle = '#7f0000'; ctx.lineWidth = 3;
  for (const lx of [d.x + d.w*0.33, d.x + d.w*0.66]) {
    ctx.beginPath(); ctx.moveTo(lx, d.y + 20); ctx.lineTo(lx, d.y + d.h); ctx.stroke();
  }
  // llamp decoratiu dalt de tot ⚡
  ctx.strokeStyle = '#ffee58'; ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(d.x + d.w/2 + 4, d.y - 24); ctx.lineTo(d.x + d.w/2 - 6, d.y - 8);
  ctx.lineTo(d.x + d.w/2 + 2, d.y - 6); ctx.lineTo(d.x + d.w/2 - 8, d.y + 10);
  ctx.stroke();
  // panxa daurada
  ctx.fillStyle = '#ffd700';
  ctx.beginPath(); ctx.arc(d.x + d.w - 14, d.y + d.h/2 + 6, 5, 0, 7); ctx.fill();
  // ↓ quan hi ets a sobre
  if (player.x + player.w > d.x - 10 && player.x < d.x + d.w + 10 && frame % 40 < 20) {
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('↓', d.x + d.w/2, d.y - 30);
    ctx.textAlign = 'left';
  }
}

// ===== EL LLAMP del drac! ⚡ =====
function drawBolt(s) {
  const d = Math.hypot(s.vx, s.vy) || 1;
  const nx = s.vx/d, ny = s.vy/d;   // direcció del tret
  const px = -ny, py = nx;          // perpendicular per fer el zig-zag
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#ffee58'; ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(s.x - nx*18, s.y - ny*18);
  ctx.lineTo(s.x - nx*6 + px*8, s.y - ny*6 + py*8);
  ctx.lineTo(s.x + nx*3 - px*8, s.y + ny*3 - py*8);
  ctx.lineTo(s.x + nx*18, s.y + ny*18);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(s.x - nx*14, s.y - ny*14);
  ctx.lineTo(s.x + nx*14, s.y + ny*14);
  ctx.stroke();
}

function drawMine(m) {
  drawSprite(MINE, m.x - 6*S, m.drawY - 3.5*S);
}

// ===== EL CASTELL D'UNAI! =====
function drawCastle(X) {
  const TOP = 320, CW = 230, LT = 230, TW = 44;
  // pedra grisa
  ctx.fillStyle = '#9aa0b5';
  ctx.fillRect(X, TOP, CW, 160);                    // cos
  ctx.fillRect(X, LT, TW, 90);                      // torre esquerra
  ctx.fillRect(X + CW - TW, LT, TW, 90);            // torre dreta
  // línies dels maons
  ctx.strokeStyle = '#6b7085'; ctx.lineWidth = 2;
  for (let y = 236; y < 480; y += 16) {
    ctx.beginPath(); ctx.moveTo(X, y); ctx.lineTo(X + CW, y); ctx.stroke();
  }
  for (let y = 236, i = 0; y < 480; y += 16, i++)
    for (let x = X + (i % 2) * 12; x < X + CW; x += 24) {
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, Math.min(y + 16, 480)); ctx.stroke();
    }
  // merlets (les dents de dalt del castell!)
  ctx.fillStyle = '#9aa0b5';
  for (let x = X + 4; x < X + CW; x += 26) ctx.fillRect(x, TOP - 18, 16, 18);
  for (let x = X; x < X + TW; x += 18) ctx.fillRect(x, LT - 16, 12, 16);
  for (let x = X + CW - TW; x < X + CW; x += 18) ctx.fillRect(x, LT - 16, 12, 16);
  // sostres punxeguts vermells de les torres
  ctx.fillStyle = '#ff5252';
  ctx.beginPath();
  ctx.moveTo(X - 6, LT - 14); ctx.lineTo(X + TW/2, LT - 58); ctx.lineTo(X + TW + 6, LT - 14);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(X + CW - TW - 6, LT - 14); ctx.lineTo(X + CW - TW/2, LT - 58); ctx.lineTo(X + CW + 6, LT - 14);
  ctx.fill();
  // finestres fosques de les torres
  ctx.fillStyle = '#2a2440';
  ctx.fillRect(X + 16, 268, 12, 20);
  ctx.fillRect(X + CW - 28, 268, 12, 20);
  // la gran porta del castell
  ctx.fillRect(X + CW/2 - 24, 420, 48, 60);
  ctx.beginPath(); ctx.arc(X + CW/2, 420, 24, Math.PI, 0); ctx.fill();
  ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(X + CW/2, 420, 24, Math.PI, 0); ctx.stroke();
  // banderola amb la U d'Unai!!
  ctx.fillStyle = '#ff5252';
  ctx.fillRect(X + CW/2 - 40, 350, 80, 26);
  ctx.strokeStyle = '#8e1f1f'; ctx.lineWidth = 2;
  ctx.strokeRect(X + CW/2 - 40, 350, 80, 26);
  ctx.fillStyle = '#ffd700';
  ctx.font = 'bold 20px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('U', X + CW/2, 371);
  ctx.textAlign = 'left';
}

function drawFlag() {
  // pal
  ctx.fillStyle = '#8b5a2b';
  ctx.fillRect(flag.x, flag.y, 8, 100);
  // bandera que oneja
  const wave = Math.sin(frame*0.1)*4;
  ctx.fillStyle = '#ff5252';
  ctx.beginPath();
  ctx.moveTo(flag.x + 8, flag.y + 5);
  ctx.lineTo(flag.x + 70, flag.y + 20 + wave);
  ctx.lineTo(flag.x + 8, flag.y + 40);
  ctx.fill();
  // estrella
  ctx.fillStyle = '#ffd700';
  ctx.font = '20px serif';
  ctx.fillText('★', flag.x + 18, flag.y + 28);
  // base daurada de la bandera
  ctx.fillStyle = '#ffd700';
  ctx.beginPath(); ctx.arc(flag.x + 4, flag.y + 100, 14, Math.PI, 0); ctx.fill();
}

