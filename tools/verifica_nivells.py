#!/usr/bin/env python3
# ==================== VERIFICADOR DE NIVELLS ====================
# Compara el joc VELL (js/levels.js) amb les dades NOVES (src/nivells.js)
# per assegurar-nos que els nivells són EXACTAMENT iguals!
import re, ast, sys

def js_obj(txt):
    """Converteix un literal JS {x:1, y:'a', b:true} en dict Python."""
    t = txt.strip()
    t = re.sub(r'//[^\n]*', '', t)                    # treu comentaris
    t = re.sub(r'([,{]\s*)([A-Za-z_]\w*)\s*:', r"\1'\2':", t)  # claus amb cometes
    t = t.replace('true', 'True').replace('false', 'False')
    return eval(t)          # és codi nostre: permet expressions tipus 480-84

def blocs_js(src, cap):
    """Retorna els textos dels blocs LEVELS[n] = {...}; o if (n === N) {...}"""
    out = {}
    for m in re.finditer(cap, src):
        n = int(m.group(1))
        start = m.end() - 1                          # a la '{'
        profund = 0
        for i in range(start, len(src)):
            if src[i] == '{': profund += 1
            elif src[i] == '}':
                profund -= 1
                if profund == 0:
                    out[n] = src[start:i+1]
                    break
    return out

def objectes_de(txt):
    """Tots els literals {..} d'un platforms.push(...)/doors.push(...) etc."""
    return [js_obj(m) for m in re.findall(r'\{[^{}]*\}', txt, re.S)]

def crides(txt, nom):
    """Arguments de les crides nom(a, b, 'c') -> llista de tuples."""
    res = []
    for m in re.finditer(re.escape(nom) + r'\(([^;]*?)\);', txt):
        args = m.group(1)
        vals = [v.strip() for v in args.split(',') if v.strip()]
        res.append(tuple(ast.literal_eval(v) if v else v for v in vals))
    return res

def norm_plat(p):
    return (p.get('x'), p.get('y'), p.get('w'), p.get('h'), p.get('type'),
            p.get('hurt'), p.get('down'), p.get('move'), p.get('baseY'),
            p.get('amp'), p.get('speed'), p.get('phase'))

# claus que el joc afegeix soles al boss (no calen a les dades!)
BOSS_DEFECTE = {'hurt': 0, 'alive': True, 't': 0, 'boss': True, 'maxHp': None}

def norm_boss(b):
    b = dict(b)
    b.pop('maxHp', None)          # el joc no el fa servir
    for k, v in BOSS_DEFECTE.items():
        if k in b and b[k] == v: b.pop(k)
    # el color només importa si és diferent de 'red' (el per defecte)
    if b.get('color') == 'red': b.pop('color')
    return tuple(sorted(b.items()))

def norm_enemic(e):
    # e = ['shy', x, minX, maxX, color, gy] o ['boss', {...}]
    tipus = e[0]
    if tipus == 'boss':
        return ('boss',) + norm_boss(e[1])
    return tuple(e)

# ---------- Llegeix el JOC VELL ----------
vell = open('js/levels.js', encoding='utf-8').read()
velles = {}
# els blocs "n === K {" contenen tota la construcció del nivell
for m in re.finditer(r'n === (\d+)\) \{', vell):
    n = int(m.group(1))
    start = m.end()
    profund = 1
    i = start
    while profund > 0:
        if vell[i] == '{': profund += 1
        elif vell[i] == '}': profund -= 1
        i += 1
    velles[n] = vell[start:i-1]

dades_velles = {}
for n, b in velles.items():
    d = {}
    d['fi'] = int(re.search(r'LEVEL_END = (\d+)', b).group(1))
    mt = re.search(r'LEVEL_TOP = (-?\d+)', b)
    d['dalt'] = int(mt.group(1)) if mt else 0
    mf = re.search(r'flag\.x = (-?\d+);\s*flag\.y = (-?\d+)', b)
    d['flag'] = [int(mf.group(1)), int(mf.group(2))]
    # plataformes: tot dins platforms.push( ... );
    plats = []
    mp = re.search(r'platforms\.push\((.*?)\);', b, re.S)
    for m in re.finditer(r'\{[^{}]*\}', mp.group(1)):
        plats.append(js_obj(m.group(0)))
    d['plataformes'] = sorted(norm_plat(p) for p in plats)
    # enemics: crides als ajudants + pushes de boss
    ens = []
    for c in crides(b, 'shy'):   ens.append(('shy',) + c)
    for c in crides(b, 'fly'):   ens.append(('fly',) + c)
    for c in crides(b, 'spikyAt'): ens.append(('spiky',) + c)
    for c in crides(b, 'poopAt'):  ens.append(('caca',) + c)
    for c in crides(b, 'fishAt'):  ens.append(('peix',) + c)
    for c in crides(b, 'plantAt'): ens.append(('planta',) + c)
    for c in crides(b, 'mineAt'):  ens.append(('mina',) + c)
    for c in crides(b, 'qblock'):  ens.append(('qblock',) + c)
    # els bosses es posen amb enemies.push({...})
    for m in re.finditer(r'enemies\.push\((\{.*?\})\);', b, re.S):
        ens.append(('boss',) + norm_boss(js_obj(m.group(1))))
    d['enemics'] = sorted(ens, key=str)
    # els qblock() del format vell TAMBÉ són plataformes
    for c in crides(b, 'qblock'):
        d['plataformes'].append((c[0], c[1], 36, 24, 'qblock', None, None, None, None, None, None, None))
    d['plataformes'].sort()
    d['mines']   = sorted(c for c in crides(b, 'mineAt'))
    d['plantes'] = sorted(c for c in crides(b, 'plantAt'))
    d['blocs']   = sorted(c for c in crides(b, 'qblock'))
    d['fruites'] = sorted(c for c in crides(b, 'addFruitLine'))
    d['portes']  = sorted(tuple(sorted(js_obj(m.group(1)).items()))
                          for m in re.finditer(r'doors\.push\((\{.*?\})\)', b))
    d['cors']      = sorted((o['x'], o['y']) for m in re.finditer(r'heals\.push\((.*?)\);', b, re.S)
                            for o in objectes_de(m.group(1)))
    d['estrelles'] = sorted((o['x'], o['y']) for m in re.finditer(r'starPicks\.push\((.*?)\);', b, re.S)
                            for o in objectes_de(m.group(1)))
    d['trampolins']= sorted((o['x'], o['y']) for m in re.finditer(r'pads\.push\((.*?)\);', b, re.S)
                            for o in objectes_de(m.group(1)))
    dades_velles[n] = d

# ---------- Llegeix les DADES NOVES ----------
nou = open('src/nivells.js', encoding='utf-8').read()
noves = blocs_js(nou, r'LEVELS\[(\d+)\] = ')
dades_noves = {}
for n, bloc in noves.items():
    d = js_obj(bloc)
    dn = {}
    dn['fi'] = d.get('fi', 5400)
    dn['dalt'] = d.get('dalt', 0)
    dn['flag'] = d['flag']
    dn['plataformes'] = sorted(norm_plat(p) for p in d.get('plataformes', []))
    # els blocs "?" del nou format van a 'blocs', però al vell són plataformes qblock
    ens = [norm_enemic(e) for e in d.get('enemics', [])]
    for m in d.get('mines', []):      ens.append(('mina',) + tuple(m))
    for p in d.get('plantes', []):    ens.append(('planta',) + tuple(p))
    for q in d.get('blocs', []):      ens.append(('qblock',) + tuple(q))
    dn['enemics'] = sorted(ens, key=str)
    dn['mines']   = sorted(tuple(m) for m in d.get('mines', []))
    dn['plantes'] = sorted(tuple(p) for p in d.get('plantes', []))
    dn['blocs']   = sorted(tuple(b2) for b2 in d.get('blocs', []))
    dn['fruites'] = sorted(tuple(f) for f in d.get('fruites', []))
    dn['portes']  = sorted(tuple(sorted(pt.items())) for pt in d.get('portes', []))
    dn['cors']      = sorted(tuple(c) for c in d.get('cors', []))
    dn['estrelles'] = sorted(tuple(s) for s in d.get('estrelles', []))
    dn['trampolins']= sorted(tuple(t) for t in d.get('trampolins', []))
    # els qblocks del format nou també són plataformes al format vell:
    # els passem a 'plataformes' per comparar
    for q in d.get('blocs', []):
        dn['plataformes'].append((q[0], q[1], 36, 24, 'qblock', None, None, None, None, None, None, None))
    dn['plataformes'].sort()
    dades_noves[n] = dn

# ---------- COMPARA ----------
errors = 0
for n in sorted(set(dades_velles) | set(dades_noves)):
    if n not in dades_velles:
        print(f'NIVELL {n}: no existeix al joc vell!'); errors += 1; continue
    if n not in dades_noves:
        print(f'NIVELL {n}: FALTA a src/nivells.js!!'); errors += 1; continue
    v, nv = dades_velles[n], dades_noves[n]
    for camp in ['fi', 'dalt', 'flag', 'plataformes', 'enemics', 'mines',
                 'plantes', 'blocs', 'fruites', 'portes', 'cors', 'estrelles', 'trampolins']:
        if v[camp] != nv[camp]:
            errors += 1
            vv = set(map(str, v[camp])); nn = set(map(str, nv[camp]))
            print(f'NIVELL {n} · {camp}:')
            for x in sorted(vv - nn): print(f'   - vell: {x}')
            for x in sorted(nn - vv): print(f'   + nou:  {x}')

print(f'\n{"✅ TOTS ELS NIVELLS SÓN IDÈNTICS!" if errors == 0 else f"❌ {errors} diferències trobades"}')
sys.exit(1 if errors else 0)
