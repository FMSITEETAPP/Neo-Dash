/* ================================================================
   NEO DASH — THEME PLUGIN : CYBER 🌆
   Fichier indépendant — s'enregistre via registerTheme('cyber', ...)
   ================================================================ */

(function () {

    let _ctx, _W, _H, _GY, _G;
    let cyberScrollX = 0;

    let holoAds = [];   // panneaux holographiques
    let flyingCars = [];   // voitures volantes
    let drones = [];   // drones de surveillance
    let digitalRain = [];   // pluie de code (matrix)
    let neonSigns = [];   // enseignes néon sur les immeubles
    let lightTrails = [];   // traînées lumineuses
    let buildings = [];   // immeubles détaillés

    /* ================================================================
       CONSTANTES VISUELLES
       ================================================================ */
    const NEON_COLS = ['#00fff5', '#ff006e', '#ffe600', '#9d4edd', '#00ff88', '#ff4400'];
    const KANJI = ['ネオン', '電気', '未来', '危険', '東京', '速度', 'データ', '光'];
    const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789アイウエオカキク';

    /* ================================================================
       INIT
       ================================================================ */
    function init(ctx, W, H, GY, G) {
        _ctx = ctx; _W = W; _H = H; _GY = GY; _G = G;
        cyberScrollX = 0;
        holoAds = [];
        flyingCars = [];
        drones = [];
        digitalRain = [];
        neonSigns = [];
        lightTrails = [];
        buildings = [];

        // ── Immeubles (2 couches) ──
        const layers = [
            { spd: 0.3, minH: 80, maxH: 200, minW: 40, maxW: 90, col: '#030214' },
            { spd: 0.6, minH: 40, maxH: 140, minW: 30, maxW: 70, col: '#050318' },
        ];
        layers.forEach((layer, li) => {
            let bx = 0;
            while (bx < W * 3.5) {
                const bw = layer.minW + Math.random() * (layer.maxW - layer.minW);
                const bh = layer.minH + Math.random() * (layer.maxH - layer.minH);
                const wins = [];
                for (let wy = GY - bh + 10; wy < GY - 10; wy += 12) {
                    for (let wx = bx + 5; wx < bx + bw - 10; wx += 10) {
                        if (Math.random() > 0.35) {
                            wins.push({
                                x: wx, y: wy,
                                col: NEON_COLS[Math.floor(Math.random() * NEON_COLS.length)],
                                on: Math.random() > 0.3,
                                blink: Math.random() > 0.7,
                                blinkRate: 20 + Math.floor(Math.random() * 80),
                            });
                        }
                    }
                }
                buildings.push({ x: bx, w: bw, h: bh, col: layer.col, wins, layer: li, spd: layer.spd });
                bx += bw + 2 + Math.random() * 8;
            }
        });

        // ── Panneaux holographiques ──
        const holoTexts = ['CYBER CORP', 'NEON CITY', 'DATA STREAM', 'ACCESS DENIED', 'UPLOAD 99%', '// EXECUTE', 'SECTOR 7', 'WANTED'];
        for (let i = 0; i < 6; i++) {
            holoAds.push({
                x: i * 280 + 60 + Math.random() * 100,
                y: GY - 80 - Math.random() * 120,
                w: 70 + Math.random() * 50,
                h: 28 + Math.random() * 16,
                text: holoTexts[i % holoTexts.length],
                col: NEON_COLS[i % NEON_COLS.length],
                phase: Math.random() * Math.PI * 2,
                kanji: KANJI[Math.floor(Math.random() * KANJI.length)],
            });
        }

        // ── Voitures volantes ──
        for (let i = 0; i < 5; i++) {
            flyingCars.push({
                x: W + i * 220 + Math.random() * 100,
                y: GY - 100 - Math.random() * 160,
                spd: 1.2 + Math.random() * 1.5,
                col: NEON_COLS[i % NEON_COLS.length],
                trail: [],
            });
        }

        // ── Drones ──
        for (let i = 0; i < 4; i++) {
            drones.push({
                x: Math.random() * W,
                y: 30 + Math.random() * (GY * 0.4),
                vx: (Math.random() > 0.5 ? 1 : -1) * (0.4 + Math.random() * 0.6),
                phase: Math.random() * Math.PI * 2,
                col: NEON_COLS[i % NEON_COLS.length],
                beamOn: true,
            });
        }

        // ── Pluie de code (matrix) ──
        for (let i = 0; i < 30; i++) {
            digitalRain.push({
                x: Math.floor(Math.random() * W),
                y: Math.random() * GY,
                spd: 1.5 + Math.random() * 2.5,
                len: 6 + Math.floor(Math.random() * 10),
                chars: Array.from({ length: 14 }, () => LETTERS[Math.floor(Math.random() * LETTERS.length)]),
                phase: Math.random() * Math.PI * 2,
            });
        }
    }

    /* ================================================================
       UPDATE
       ================================================================ */
    function update() {
        cyberScrollX += _G.speed * 0.3;

        // Voitures volantes
        flyingCars.forEach(car => {
            car.trail.push({ x: car.x, y: car.y });
            if (car.trail.length > 18) car.trail.shift();
            car.x -= car.spd;
            car.y += Math.sin(_G.frame * 0.03 + car.x * 0.01) * 0.3;
            if (car.x < -80) {
                car.x = _W + 40 + Math.random() * 200;
                car.y = _GY - 90 - Math.random() * 150;
                car.trail = [];
            }
        });

        // Drones
        drones.forEach(d => {
            d.phase += 0.04;
            d.x += d.vx;
            d.y += Math.sin(d.phase) * 0.5;
            if (d.x > _W + 60) { d.x = -40; }
            if (d.x < -60) { d.x = _W + 40; }
        });

        // Pluie de code
        digitalRain.forEach(r => {
            r.y += r.spd;
            if (r.y > _GY + 20) {
                r.y = -r.len * 10;
                r.x = Math.floor(Math.random() * _W);
            }
            // Changer un caractère aléatoirement
            if (_G.frame % 6 === 0) {
                const idx = Math.floor(Math.random() * r.chars.length);
                r.chars[idx] = LETTERS[Math.floor(Math.random() * LETTERS.length)];
            }
        });

        // Traînées lumineuses (spawn aléatoire)
        if (_G.frame % 15 === 0) {
            lightTrails.push({
                x: _W + 10,
                y: Math.random() * _GY * 0.8,
                spd: 4 + Math.random() * 6,
                len: 40 + Math.random() * 60,
                col: NEON_COLS[Math.floor(Math.random() * NEON_COLS.length)],
                life: 60, max: 60,
            });
        }
        lightTrails.forEach(t => { t.x -= t.spd; t.life--; });
        lightTrails = lightTrails.filter(t => t.life > 0 && t.x > -200);
    }

    /* ================================================================
       DRAW BEHIND
       ================================================================ */
    function drawBehind() {
        drawCyberStars();
        drawDigitalRain();
        drawBuildings();
        drawNeonSigns();
        drawHoloAds();
    }

    /* ================================================================
       DRAW FRONT
       ================================================================ */
    function drawFront() {
        drawLightTrails();
        drawFlyingCars();
        drawDrones();
        drawScanLine();
    }

    /* ── Étoiles / pixels lumineux ── */
    function drawCyberStars() {
        for (let i = 0; i < 60; i++) {
            const sx = ((i * 137 - cyberScrollX * 0.05) % _W + _W) % _W;
            const sy = ((i * 93 + 17) % (_GY * 0.7));
            const a = 0.1 + 0.15 * Math.sin(_G.frame * 0.04 + i * 0.8);
            _ctx.fillStyle = `rgba(180,180,255,${a})`;
            _ctx.fillRect(sx, sy, i % 3 === 0 ? 2 : 1, i % 3 === 0 ? 2 : 1);
        }
    }

    /* ── Pluie de code matrix ── */
    function drawDigitalRain() {
        digitalRain.forEach(r => {
            r.chars.forEach((ch, ci) => {
                if (ci >= r.len) return;
                const cy = r.y - ci * 10;
                if (cy < 0 || cy > _GY) return;
                const alpha = ci === 0 ? 1 : (1 - ci / r.len) * 0.6;
                _ctx.fillStyle = ci === 0
                    ? `rgba(100,200,100,${alpha * 0.5})`
                    : `rgba(0,130,50,${alpha * 0.35})`;
                _ctx.font = '8px monospace';
                _ctx.fillText(ch, r.x, cy);
            });
        });
    }

    /* ── Immeubles détaillés ── */
    function drawBuildings() {
        buildings.forEach(b => {
            const bx = Math.floor(b.x - (cyberScrollX * b.spd) % (_W * 3.5));
            if (bx > _W + 100 || bx < -b.w - 10) return;

            // Corps de l'immeuble
            _ctx.fillStyle = b.col;
            _ctx.fillRect(bx, _GY - b.h, b.w, b.h);

            // Antennes / tours sur le toit
            if (b.h > 100) {
                _ctx.fillStyle = '#0e0b22';
                _ctx.fillRect(bx + b.w * 0.4, _GY - b.h - 18, 4, 18);
                const antGlow = 0.5 + 0.5 * Math.sin(_G.frame * 0.1 + b.x);
                _ctx.fillStyle = `rgba(255,0,80,${antGlow})`;
                _ctx.fillRect(bx + b.w * 0.4, _GY - b.h - 20, 4, 4);
            }

            // Fenêtres illuminées
            b.wins.forEach(w => {
                const wx = Math.floor(bx + (w.x - b.x));
                if (!w.on) return;
                const blink = !w.blink || (_G.frame % w.blinkRate < w.blinkRate * 0.6);
                if (!blink) return;
                _ctx.shadowColor = w.col; _ctx.shadowBlur = 4;
                _ctx.fillStyle = w.col.replace(')', ',0.45)').replace('rgb', 'rgba') || w.col;
                _ctx.globalAlpha = 0.25;
                _ctx.fillRect(wx, w.y, 7, 9);
                _ctx.globalAlpha = 1;
                _ctx.shadowBlur = 0;
            });

            // Ligne néon au sommet de l'immeuble
            const lineCol = NEON_COLS[Math.floor(b.x / 80) % NEON_COLS.length];
            _ctx.shadowColor = lineCol; _ctx.shadowBlur = 6;
            _ctx.fillStyle = lineCol;
            _ctx.globalAlpha = 0.25;
            _ctx.fillRect(bx, _GY - b.h, b.w, 2);
            _ctx.globalAlpha = 1;
            _ctx.shadowBlur = 0;
        });
    }

    /* ── Enseignes néon verticales ── */
    function drawNeonSigns() {
        const signData = [
            { offset: 60, text: '電気', col: '#ff006e' },
            { offset: 230, text: 'NEO', col: '#00fff5' },
            { offset: 420, text: '危険', col: '#ffe600' },
            { offset: 600, text: 'DATA', col: '#9d4edd' },
            { offset: 800, text: '速度', col: '#00ff88' },
        ];
        signData.forEach((s, si) => {
            const sx = ((s.offset - cyberScrollX * 0.65) % (_W * 2) + _W * 2) % (_W * 2);
            if (sx > _W + 30 || sx < -30) return;
            const pulse = 0.7 + 0.3 * Math.sin(_G.frame * 0.07 + si * 1.5);
            _ctx.save();
            _ctx.shadowColor = s.col;
            _ctx.shadowBlur = 12 * pulse;
            _ctx.fillStyle = s.col;
            _ctx.globalAlpha = pulse;
            _ctx.font = '11px monospace';
            // Lettres verticales
            [...s.text].forEach((ch, ci) => {
                _ctx.fillText(ch, Math.floor(sx), _GY - 90 - ci * 14);
            });
            // Barre verticale (support néon)
            _ctx.fillStyle = s.col;
            _ctx.globalAlpha = pulse * 0.4;
            _ctx.fillRect(Math.floor(sx) + 4, _GY - 88 - s.text.length * 14, 2, s.text.length * 14 + 5);
            _ctx.restore();
        });
    }

    /* ── Panneaux holographiques ── */
    function drawHoloAds() {
        holoAds.forEach(ad => {
            const ax = ((ad.x - cyberScrollX * 0.55) % (_W * 2.5) + _W * 2.5) % (_W * 2.5);
            if (ax > _W + 100 || ax < -100) return;

            ad.phase += 0.04;
            const flicker = Math.sin(ad.phase * 3.7) > 0.92 ? 0.2 : 0.7;
            const alpha = (0.30 + 0.12 * Math.sin(ad.phase)) * flicker;

            _ctx.save();
            _ctx.shadowColor = ad.col;
            _ctx.shadowBlur = 10;
            _ctx.globalAlpha = alpha;

            // Fond semi-transparent
            _ctx.fillStyle = ad.col.replace(')', ',0.08)').replace('rgb', 'rgba') || 'rgba(0,255,245,0.08)';
            _ctx.fillRect(Math.floor(ax), Math.floor(ad.y), ad.w, ad.h);

            // Bordure néon
            _ctx.strokeStyle = ad.col;
            _ctx.lineWidth = 1.5;
            _ctx.strokeRect(Math.floor(ax), Math.floor(ad.y), ad.w, ad.h);

            // Lignes de scan internes
            for (let sl = 0; sl < ad.h; sl += 4) {
                _ctx.fillStyle = ad.col;
                _ctx.globalAlpha = alpha * 0.08;
                _ctx.fillRect(Math.floor(ax), Math.floor(ad.y + sl), ad.w, 1);
            }
            _ctx.globalAlpha = alpha;

            // Texte principal
            _ctx.fillStyle = ad.col;
            _ctx.font = '7px monospace';
            _ctx.fillText(ad.text, Math.floor(ax + 4), Math.floor(ad.y + 12));

            // Kanji en dessous
            _ctx.font = '9px monospace';
            _ctx.globalAlpha = alpha * 0.7;
            _ctx.fillText(ad.kanji, Math.floor(ax + 4), Math.floor(ad.y + 24));

            // Barre de progression animée
            const prog = ((ad.phase * 12) % ad.w);
            _ctx.globalAlpha = alpha * 0.5;
            _ctx.fillStyle = ad.col;
            _ctx.fillRect(Math.floor(ax), Math.floor(ad.y + ad.h - 3), prog, 2);

            _ctx.restore();
        });
    }

    /* ── Traînées lumineuses (speedlines) ── */
    function drawLightTrails() {
        lightTrails.forEach(t => {
            const alpha = t.life / t.max;
            _ctx.save();
            _ctx.shadowColor = t.col;
            _ctx.shadowBlur = 6;
            const grad = _ctx.createLinearGradient(t.x, t.y, t.x + t.len, t.y);
            grad.addColorStop(0, 'rgba(0,0,0,0)');
            grad.addColorStop(1, t.col);
            _ctx.strokeStyle = grad;
            _ctx.globalAlpha = alpha;
            _ctx.lineWidth = 1.5;
            _ctx.beginPath();
            _ctx.moveTo(t.x, t.y);
            _ctx.lineTo(t.x + t.len, t.y);
            _ctx.stroke();
            // Ligne fine supplémentaire
            _ctx.lineWidth = 0.5;
            _ctx.beginPath();
            _ctx.moveTo(t.x, t.y + 2);
            _ctx.lineTo(t.x + t.len * 0.6, t.y + 2);
            _ctx.stroke();
            _ctx.restore();
        });
    }

    /* ── Voitures volantes pixel art ── */
    function drawFlyingCars() {
        flyingCars.forEach(car => {
            // Traînée
            car.trail.forEach((pt, ti) => {
                const a = (ti / car.trail.length) * 0.4;
                _ctx.fillStyle = car.col;
                _ctx.globalAlpha = a;
                _ctx.fillRect(Math.floor(pt.x), Math.floor(pt.y + 2), 4, 2);
            });
            _ctx.globalAlpha = 1;

            const cx = Math.floor(car.x);
            const cy = Math.floor(car.y);

            _ctx.save();
            _ctx.shadowColor = car.col;
            _ctx.shadowBlur = 10;

            // Carrosserie
            _ctx.fillStyle = '#0a0a1e';
            _ctx.fillRect(cx, cy + 3, 28, 8);
            _ctx.fillRect(cx + 4, cy, 20, 5);
            // Vitres
            _ctx.fillStyle = car.col;
            _ctx.globalAlpha = 0.5;
            _ctx.fillRect(cx + 6, cy + 1, 7, 4);
            _ctx.fillRect(cx + 15, cy + 1, 7, 4);
            _ctx.globalAlpha = 1;
            // Phares avant
            _ctx.fillStyle = car.col;
            _ctx.fillRect(cx + 24, cy + 4, 4, 3);
            // Feux arrière
            _ctx.fillStyle = '#ff0033';
            _ctx.fillRect(cx, cy + 4, 3, 3);
            // Propulseurs (bas)
            const thruster = 0.6 + 0.4 * Math.sin(_G.frame * 0.25);
            _ctx.fillStyle = `rgba(0,200,255,${thruster})`;
            _ctx.fillRect(cx + 4, cy + 11, 5, 2);
            _ctx.fillRect(cx + 18, cy + 11, 5, 2);

            _ctx.restore();
        });
    }

    /* ── Drones de surveillance ── */
    function drawDrones() {
        drones.forEach(d => {
            const dx = Math.floor(d.x);
            const dy = Math.floor(d.y + Math.sin(d.phase) * 4);

            _ctx.save();
            _ctx.shadowColor = d.col;
            _ctx.shadowBlur = 8;

            // Corps central
            _ctx.fillStyle = '#0e0c22';
            _ctx.fillRect(dx - 5, dy - 3, 10, 6);

            // Rotors (4 bras + hélices)
            [[-8, -4], [5, -4], [-8, 1], [5, 1]].forEach(([rx, ry]) => {
                _ctx.fillStyle = '#1a1835';
                _ctx.fillRect(dx + rx, dy + ry, 6, 2);
                // Hélice animée
                const rPhase = _G.frame * 0.3 + d.phase;
                _ctx.strokeStyle = d.col;
                _ctx.lineWidth = 1;
                _ctx.globalAlpha = 0.7;
                _ctx.beginPath();
                _ctx.moveTo(dx + rx + Math.cos(rPhase) * 4, dy + ry + Math.sin(rPhase) * 2);
                _ctx.lineTo(dx + rx + Math.cos(rPhase + Math.PI) * 4, dy + ry + Math.sin(rPhase + Math.PI) * 2);
                _ctx.stroke();
                _ctx.globalAlpha = 1;
            });

            // Oeil / caméra
            _ctx.fillStyle = d.col;
            _ctx.beginPath();
            _ctx.arc(dx, dy, 2, 0, Math.PI * 2);
            _ctx.fill();

            // Faisceau de surveillance (vers le bas)
            if (d.beamOn) {
                const beamAlpha = 0.06 + 0.04 * Math.sin(_G.frame * 0.08 + d.phase);
                const beamGrad = _ctx.createLinearGradient(dx, dy, dx, _GY);
                beamGrad.addColorStop(0, d.col);
                beamGrad.addColorStop(1, 'rgba(0,0,0,0)');
                _ctx.fillStyle = beamGrad;
                _ctx.globalAlpha = beamAlpha;
                _ctx.beginPath();
                _ctx.moveTo(dx - 3, dy);
                _ctx.lineTo(dx + 3, dy);
                _ctx.lineTo(dx + 20, _GY);
                _ctx.lineTo(dx - 20, _GY);
                _ctx.closePath();
                _ctx.fill();
                _ctx.globalAlpha = 1;
            }

            _ctx.restore();
        });
    }

    /* ── Ligne de scan CRT ── */
    function drawScanLine() {
        const sy = (_G.frame * 2) % (_GY + 10);
        _ctx.save();
        _ctx.globalAlpha = 0.06;
        _ctx.fillStyle = '#00fff5';
        _ctx.fillRect(0, sy, _W, 2);
        _ctx.restore();
    }

    /* ================================================================
       OBSTACLES CYBER
       ================================================================ */
    const OBSTYPES_CYBER = [

        /* ── 1. Barrière électrique (taser fence) ── */
        {
            w: 20, h: 58,
            draw(x, y, t) {
                const p = 0.4 + 0.6 * Math.sin(t * 0.22);
                // Poteaux
                _ctx.fillStyle = '#0a0820';
                _ctx.fillRect(x + 1, y + 4, 4, 54);
                _ctx.fillRect(x + 15, y + 4, 4, 54);
                // Isolateurs
                [[x + 1, y + 8], [x + 15, y + 8], [x + 1, y + 30], [x + 15, y + 30], [x + 1, y + 50], [x + 15, y + 50]].forEach(([ix, iy]) => {
                    _ctx.fillStyle = '#181430';
                    _ctx.fillRect(ix - 1, iy, 6, 4);
                });
                // Fils électriques (3 niveaux)
                [y + 10, y + 32, y + 52].forEach(wy => {
                    _ctx.strokeStyle = `rgba(0,255,245,${p * 0.9})`;
                    _ctx.lineWidth = 1.5;
                    _ctx.shadowColor = '#00fff5'; _ctx.shadowBlur = p > 0.8 ? 10 : 3;
                    _ctx.beginPath(); _ctx.moveTo(x + 5, wy); _ctx.lineTo(x + 15, wy); _ctx.stroke();
                    // Arc électrique aléatoire
                    if (Math.sin(t * 0.3 + wy) > 0.7) {
                        _ctx.strokeStyle = 'rgba(255,255,200,0.9)';
                        _ctx.lineWidth = 1;
                        _ctx.beginPath();
                        _ctx.moveTo(x + 5, wy);
                        _ctx.lineTo(x + 8, wy - 3);
                        _ctx.lineTo(x + 11, wy + 2);
                        _ctx.lineTo(x + 15, wy);
                        _ctx.stroke();
                    }
                });
                // Boîtier d'alimentation
                _ctx.shadowBlur = 0;
                _ctx.fillStyle = '#0d0a22';
                _ctx.fillRect(x + 5, y, 10, 6);
                _ctx.fillStyle = `rgba(0,255,245,${p})`;
                _ctx.fillRect(x + 8, y + 1, 4, 4);
            }
        },

        /* ── 2. Mur de données (firewall) ── */
        {
            w: 18, h: 52,
            draw(x, y, t) {
                const rows = 10;
                const p = 0.5 + 0.5 * Math.sin(t * 0.08);
                // Fond du mur
                _ctx.fillStyle = '#06041a';
                _ctx.fillRect(x, y, 18, 52);
                _ctx.strokeStyle = 'rgba(255,0,110,0.4)';
                _ctx.lineWidth = 1;
                _ctx.strokeRect(x, y, 18, 52);
                // Blocs de données animés
                for (let ri = 0; ri < rows; ri++) {
                    const ry = y + ri * 5 + 1;
                    const fill = Math.sin(t * 0.15 + ri * 0.7) > 0;
                    _ctx.fillStyle = fill
                        ? `rgba(255,0,110,${0.6 + 0.4 * p})`
                        : `rgba(0,255,245,${0.3 + 0.2 * p})`;
                    _ctx.fillRect(x + 2, ry, 14, 3);
                    // Binaire sur le côté
                    if (ri % 2 === 0) {
                        _ctx.fillStyle = 'rgba(255,255,255,0.15)';
                        _ctx.font = '4px monospace';
                        _ctx.fillText(fill ? '1' : '0', x + 6, ry + 3);
                    }
                }
                // Header ERROR
                _ctx.shadowColor = '#ff006e'; _ctx.shadowBlur = 6;
                _ctx.fillStyle = '#ff006e';
                _ctx.font = '5px monospace';
                _ctx.fillText('ERR', x + 3, y + 5);
                _ctx.shadowBlur = 0;
            }
        },

        /* ── 3. Tour de surveillance ── */
        {
            w: 28, h: 60,
            draw(x, y, t) {
                // Base + pied
                _ctx.fillStyle = '#08061a';
                _ctx.fillRect(x + 11, y + 46, 6, 14);
                _ctx.fillRect(x + 7, y + 54, 14, 6);
                // Corps de la tour
                _ctx.fillStyle = '#0e0c28';
                _ctx.fillRect(x + 8, y + 20, 12, 28);
                // Plateforme
                _ctx.fillStyle = '#12102e';
                _ctx.fillRect(x + 4, y + 16, 20, 6);
                // Cabine
                _ctx.fillStyle = '#0a0820';
                _ctx.fillRect(x + 6, y + 2, 16, 16);
                // Toit
                _ctx.fillStyle = '#06041a';
                _ctx.fillRect(x + 4, y, 20, 4);
                // Fenêtres lumineuses
                const glow = 0.4 + 0.3 * Math.sin(t * 0.07);
                _ctx.shadowColor = '#00fff5'; _ctx.shadowBlur = 6;
                _ctx.fillStyle = `rgba(0,255,245,${glow})`;
                _ctx.fillRect(x + 8, y + 5, 5, 7);
                _ctx.fillRect(x + 15, y + 5, 5, 7);
                // Antenne rotative
                _ctx.save();
                _ctx.translate(x + 14, y);
                _ctx.rotate(t * 0.04);
                _ctx.strokeStyle = `rgba(255,0,110,${0.6 + 0.4 * Math.sin(t * 0.1)})`;
                _ctx.lineWidth = 1.5;
                _ctx.beginPath(); _ctx.moveTo(-8, 0); _ctx.lineTo(8, 0); _ctx.stroke();
                _ctx.beginPath(); _ctx.moveTo(0, -8); _ctx.lineTo(0, 8); _ctx.stroke();
                _ctx.restore();
                _ctx.shadowBlur = 0;
            }
        },

        /* ── 4. FLOTTANT — Satellite de surveillance ── */
        {
            w: 50, h: 22, floaty: true,
            draw(x, y, t) {
                const cx = x + 25, cy = y + 11;
                _ctx.save();
                _ctx.shadowColor = '#9d4edd'; _ctx.shadowBlur = 8;
                // Panneau solaire gauche
                _ctx.fillStyle = '#0d0428';
                _ctx.fillRect(x, cy - 4, 16, 8);
                _ctx.fillStyle = 'rgba(157,78,221,0.4)';
                for (let gi = 0; gi < 3; gi++) _ctx.fillRect(x + gi * 5 + 1, cy - 3, 3, 6);
                // Corps central
                _ctx.fillStyle = '#1a1030';
                _ctx.fillRect(cx - 6, cy - 6, 12, 12);
                _ctx.strokeStyle = '#9d4edd'; _ctx.lineWidth = 1;
                _ctx.strokeRect(cx - 6, cy - 6, 12, 12);
                // Panneau solaire droit
                _ctx.fillStyle = '#0d0428';
                _ctx.fillRect(cx + 6, cy - 4, 16, 8);
                _ctx.fillStyle = 'rgba(157,78,221,0.4)';
                for (let gi = 0; gi < 3; gi++) _ctx.fillRect(cx + 7 + gi * 5, cy - 3, 3, 6);
                // Oeil caméra
                const ep = 0.5 + 0.5 * Math.sin(t * 0.1);
                _ctx.fillStyle = `rgba(255,0,110,${ep})`;
                _ctx.beginPath(); _ctx.arc(cx, cy, 3, 0, Math.PI * 2); _ctx.fill();
                // Faisceau vers le bas
                _ctx.globalAlpha = 0.08 + 0.04 * Math.sin(t * 0.08);
                const bg = _ctx.createLinearGradient(cx, cy, cx, cy + 80);
                bg.addColorStop(0, '#ff006e'); bg.addColorStop(1, 'transparent');
                _ctx.fillStyle = bg;
                _ctx.beginPath(); _ctx.moveTo(cx - 4, cy + 4); _ctx.lineTo(cx + 4, cy + 4); _ctx.lineTo(cx + 25, cy + 80); _ctx.lineTo(cx - 25, cy + 80); _ctx.fill();
                _ctx.restore();
            }
        },

        /* ── 5. FLOTTANT — Glitch/hologramme corrompu ── */
        {
            w: 30, h: 35, floaty: true,
            draw(x, y, t) {
                const glitch = Math.sin(t * 0.4) > 0.6;
                _ctx.save();
                _ctx.shadowColor = '#ffe600'; _ctx.shadowBlur = 10;
                // Corps hologramme (personnage pixelisé)
                const offX = glitch ? Math.floor(Math.sin(t * 0.8) * 4) : 0;
                // Tête
                _ctx.fillStyle = `rgba(255,230,0,${glitch ? 0.3 : 0.7})`;
                _ctx.fillRect(x + 10 + offX, y, 10, 8);
                // Torse
                _ctx.fillStyle = `rgba(0,255,245,${glitch ? 0.2 : 0.6})`;
                _ctx.fillRect(x + 8, y + 8, 14, 10);
                // Jambes
                _ctx.fillStyle = `rgba(255,0,110,${glitch ? 0.2 : 0.6})`;
                _ctx.fillRect(x + 8, y + 18, 5, 10);
                _ctx.fillRect(x + 17, y + 18, 5, 10);
                // Lignes de scan
                for (let sl = 0; sl < 35; sl += 3) {
                    _ctx.fillStyle = `rgba(0,0,0,${glitch ? 0.6 : 0.2})`;
                    _ctx.fillRect(x, y + sl, 30, 1);
                }
                // Artefacts glitch
                if (glitch) {
                    _ctx.fillStyle = 'rgba(255,0,110,0.8)';
                    _ctx.fillRect(x + Math.floor(Math.sin(t) * 8), y + 5, 12, 2);
                    _ctx.fillRect(x + Math.floor(Math.cos(t) * 6), y + 14, 8, 2);
                    _ctx.fillStyle = 'rgba(0,255,245,0.7)';
                    _ctx.fillRect(x + 15, y + 8 + Math.floor(Math.sin(t * 1.3) * 3), 6, 2);
                }
                _ctx.restore();
            }
        },

    ];

    /* ================================================================
       ENREGISTREMENT
       ================================================================ */
    if (typeof registerTheme === 'function') {
        registerTheme('cyber', {
            name: '🌆 CYBER',
            skyTop: '#000008',
            skyBot: '#03030f',
            groundColor: '#020210',
            neonLine: '#00fff5',
            gridColor: 'rgba(0,255,245,0.06)',
            starColor: '180,180,255',
            fogColor: null,
            buildings: [],   // géré en interne

            hooks: {
                init: init,
                update: update,
                drawBehind: drawBehind,
                drawFront: drawFront,
            },
            obstTypes: OBSTYPES_CYBER,
        });
    }

})();