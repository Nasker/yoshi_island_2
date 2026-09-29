// ==================== NIVELLS EXTRA ====================
// Aquí van els nivells que feu vosaltres!
// 1. Crea un fitxer com "nivell15.js" dins d'aquesta carpeta (copia exemple.js)
// 2. Escriu el seu nom a la llista de sota
// 3. Obre el joc amb index.html?nivell=15 per jugar-hi!
const FITXERS_NIVELLS = [
  'exemple.js',   // el nivell d'exemple (es juga amb ?nivell=15)
];
// això carrega els fitxers automàticament (no cal tocar res més!)
for (const f of FITXERS_NIVELLS)
  document.write('<script src="levels/' + f + '"><\/script>');
