# El joc d'Unai (poYoshi Island II)

## Idea

Un joc de plataformes 2D fet per l'Unai. El Poshi, un dinosaure verd
dibuixat a mà, ha de rescatar el nadó Mario travessant móns
inventats per l'Unai.

## Player

El **Poshi** — el dibuix de l'Unai, directament del paper escanejat
(`assets/poshi_clean.png`).

## Abilities

- Correr i saltar
- Planar (mantén ESPAI a l'aire) — estil Yoshi!
- Llengua llarga (Z) — menja't els enemics → es converteixen en ous!
- Tirar ous (mantén X per apuntar, deixa anar per tirar)
- Super cop de cul (↓ a l'aire) — BOOM i tremolor!
- Nedar a les tuberies del nivell 6
- Entrar a tubs i portes secrets premant ↓ a sobre

## Enemies

- Shy Guys de colors (camina; xafa'ls o menja-te'ls!)
- Mosques que volen fent ones
- Eriços que punxen (no es poden xafar!)
- Peixos i caques a les aigües brutes
- Plantes piraña que surten del test
- Mines explosives
- BOSSES: el gegant del desert, el drac dormit, el rei volador,
  el robot de Tòquio, l'alien de l'espai...

## Collectibles

- Pomes (+10), raïms (+25), melons-trésor (+50), monedes (+5)
- Cors que curen una vida
- Estrelles d'INVENCIBILITAT (480 frames de poder!)
- Blocs "?" amb sorpreses
- El nadó Mario a la butxaca del Poshi — si reps un cop, marxa
  volant en bombolla i tens 10 segons d'estrelles per rescatar-lo!

## Worlds / Levels

1. 🏜️ El Desert i el Castell — amb masmorra secreta i piràmide
2. 🏰 El Castell de Lava — compte, que crema!
3. 🌙 L'Espai de Nit — gravetat baixa, salts gegants
4. 🎈 El Castell de Globus — TOT rebota!
5. 🍫 El Riu de Xocolata — cap a les mines
6. 💩 El Laberint de Tuberíes — neda per l'aigua pudent!
7. 🌴 La Selva — salta per les branques
8. ⚡ El Castell Elèctric — el DRAC t'espera
9. 🌸 El Fuji — la porta del cim t'espera
10. 🏰 Escala el Castell — el rei volador t'espera
12. 🏙️ Tòquio de LEGO — la ciutat més llarga (tecla M)
13. 🎉 La Festa de Colors — balla i salta (tecla N)
14. 🌙 El Camp de Nit — nivell VERTICAL, puja fins al niu (tecla B)

## Mechanics

- La bandera final està bloquejada si el boss viu o si has perdut el nadó
- Els ous boten dues vegades (com al Yoshi's Island)
- Boles de foc dels bosses; el drac dispara llampecs!
- La càmera puja amb tu al nivell vertical 14

## Story

El nadó Mario és en perill i el Poshi l'ha de portar a casa
a través de tots els móns que l'Unai ha inventat.

## Things We Want To Try

- Més nivells dibuixats a mà → `tools/esbos_nivell.py` els converteix!
- Més personatges dibuixats → `tools/neteja_sprite.py` els neteja
- Cançons noves per cada nivell → `src/so.js` (4 canals chiptune!)
