/* ================================================================
   NEO DASH — THEME PLUGIN : ABYSSES 🌊
   Fichier indépendant, chargé après neo-dash.html
   S'enregistre via : registerTheme('underwater', { ... })
   ================================================================ */

(function () {

    /* ── État interne du thème ── */
    let _ctx, _W, _H, _GY, _G;   // référence au moteur
    let seaScrollX = 0;
    let creatures = [];   // pieuvres + méduses + poissons
    let bubbles = [];   // bulles montantes
    let seaweeds = [];   // algues
    let jellyfishes = [];
    let fishSchools = [];

    /* ================================================================
       INIT
       ================================================================ */
    function init(ctx, W, H, GY, G) {
        _ctx = ctx; _W = W; _H = H; _GY = GY; _G = G;
        seaScrollX = 0;
        creatures = [];
        bubbles = [];
        seaweeds = [];
        jellyfishes = [];
        fishSchools = [];

        // ── Algues de fond ──
        for (let i = 0; i < 18; i++) {
            seaweeds.push({
                x: Math.random() * W * 3,
                h: 20 + Math.random() * 55,
                sway: Math.random() * Math.PI * 2,
                spd: 0.02 + Math.random() * 0.02,
                w: 3 + Math.floor(Math.random() * 3),
                col: Math.random() > 0.5 ? '#005533' : '#003322',
            });
        }

        // ── Pieuvres (3) ──
        for (let i = 0; i < 3; i++) {
            creatures.push({
                type: 'octopus',
                x: W + 200 + i * 380 + Math.random() * 150,
                y: GY - 60 - Math.random() * 100,
                vx: -(0.4 + Math.random() * 0.3),
                vy: 0,
                phase: Math.random() * Math.PI * 2,
                col: ['#8800aa', '#660088', '#aa0066'][i],
                sc: 2,
            });
        }

        // ── Méduses (5) ──
        for (let i = 0; i < 5; i++) {
            jellyfishes.push({
                x: Math.random() * W * 2 + W,
                y: 30 + Math.random() * (GY - 80),
                phase: Math.random() * Math.PI * 2,
                spdX: -(0.2 + Math.random() * 0.25),
                spdY: 0,
                r: 10 + Math.random() * 10,
                col: `rgba(${100 + Math.floor(Math.random() * 80)},${Math.floor(Math.random() * 60)},${180 + Math.floor(Math.random() * 60)},`,
            });
        }

        // ── Bancs de poissons (4 bancs de 6 poissons) ──
        for (let b = 0; b < 4; b++) {
            const bx = W + b * 320 + Math.random() * 100;
            const by = 40 + Math.random() * (GY - 100);
            const school = [];
            for (let f = 0; f < 7; f++) {
                school.push({
                    ox: (Math.random() - 0.5) * 50,
                    oy: (Math.random() - 0.5) * 30,
                    phase: Math.random() * Math.PI * 2,
                });
            }
            fishSchools.push({
                x: bx, y: by,
                spd: 0.8 + Math.random() * 0.5,
                col: ['#00ccff', '#ffaa00', '#ff6644', '#88ffcc'][b % 4],
                fish: school,
            });
        }

        // ── Bulles initiales ──
        for (let i = 0; i < 25; i++) {
            spawnBubble(true);
        }
    }

    function spawnBubble(random) {
        bubbles.push({
            x: Math.random() * _W,
            y: random ? Math.random() * _GY : _GY + 5,
            r: 1 + Math.random() * 4,
            spd: 0.3 + Math.random() * 0.6,
            wobble: Math.random() * Math.PI * 2,
        });
    }

    /* ================================================================
       UPDATE
       ================================================================ */
    function update() {
        seaScrollX += _G.speed * 0.3;

        // Bulles
        bubbles.forEach(b => {
            b.y -= b.spd;
            b.x += Math.sin(b.wobble + _G.frame * 0.04) * 0.4;
            b.wobble += 0.05;
        });
        bubbles = bubbles.filter(b => b.y > -10);
        if (_G.frame % 4 === 0) spawnBubble(false);

        // Pieuvres
        creatures.forEach(c => {
            c.x += c.vx;
            c.phase += 0.06;
            c.y += Math.sin(c.phase * 0.5) * 0.4;
            if (c.x < -80) {
                c.x = _W + 60 + Math.random() * 200;
                c.y = _GY - 50 - Math.random() * 120;
            }
        });

        // Méduses
        jellyfishes.forEach(j => {
            j.phase += 0.04;
            j.x += j.spdX;
            j.y += Math.sin(j.phase) * 0.3;
            if (j.x < -60) {
                j.x = _W + 40 + Math.random() * 300;
                j.y = 30 + Math.random() * (_GY - 80);
            }
        });

        // Bancs de poissons
        fishSchools.forEach(s => {
            s.x -= s.spd;
            if (s.x < -120) {
                s.x = _W + 80 + Math.random() * 200;
                s.y = 40 + Math.random() * (_GY - 100);
            }
        });
    }

    /* ================================================================
       DRAW BEHIND (avant le sol, après le ciel)
       ================================================================ */
    function drawBehind() {
        drawSeaDepthRays();
        drawSeaweed();
        drawCoralReefs();
        drawShipwreck();
    }

    /* ================================================================
       DRAW FRONT (après le sol)
       ================================================================ */
    function drawFront() {
        drawBubbles();
        drawFishSchools();
        drawJellyfishes();
        drawOctopuses();
        drawWaterOverlay();
    }

    /* ── Rayons lumineux sous-marins ── */
    function drawSeaDepthRays() {
        for (let i = 0; i < 5; i++) {
            const rx = ((i * 220 - seaScrollX * 0.1) % (_W + 200) + _W + 200) % (_W + 200) - 100;
            _ctx.save();
            _ctx.globalAlpha = 0.04 + 0.02 * Math.sin(_G.frame * 0.02 + i);
            const grad = _ctx.createLinearGradient(rx, 0, rx + 40, _GY);
            grad.addColorStop(0, 'rgba(0,180,255,1)');
            grad.addColorStop(1, 'rgba(0,180,255,0)');
            _ctx.fillStyle = grad;
            _ctx.beginPath();
            _ctx.moveTo(rx, 0);
            _ctx.lineTo(rx + 60, _GY);
            _ctx.lineTo(rx - 10, _GY);
            _ctx.closePath();
            _ctx.fill();
            _ctx.restore();
        }
    }

    /* ── Algues ondulantes ── */
    function drawSeaweed() {
        seaweeds.forEach(sw => {
            const sx = ((sw.x - seaScrollX * 0.7) % (_W * 3) + _W * 3) % (_W * 3);
            if (sx > _W + 20 || sx < -20) return;
            _ctx.strokeStyle = sw.col;
            _ctx.lineWidth = sw.w;
            _ctx.beginPath();
            _ctx.moveTo(Math.floor(sx), _GY);
            // Courbe bezier ondulante
            const sway = Math.sin(_G.frame * sw.spd + sw.sway) * 10;
            const sway2 = Math.sin(_G.frame * sw.spd + sw.sway + 1) * 8;
            _ctx.bezierCurveTo(
                sx + sway, _GY - sw.h * 0.33,
                sx + sway2, _GY - sw.h * 0.66,
                sx + sway * 1.5, _GY - sw.h
            );
            _ctx.stroke();
            // Feuilles
            _ctx.fillStyle = sw.col;
            for (let l = 0; l < 3; l++) {
                const ly = _GY - sw.h * (0.3 + l * 0.3);
                const lx = sx + Math.sin(_G.frame * sw.spd + sw.sway + l) * 8;
                const ls = Math.sin(_G.frame * sw.spd * 1.5 + l) > 0 ? 1 : -1;
                _ctx.beginPath();
                _ctx.ellipse(lx + ls * 5, ly, 5, 2, ls * 0.5, 0, Math.PI * 2);
                _ctx.fill();
            }
        });
    }

    /* ── Récifs coralliens pixel ── */
    function drawCoralReefs() {
        const reefPos = [80, 310, 560, 820, 1080];
        reefPos.forEach((rp, ri) => {
            const rx = ((rp - seaScrollX * 0.5) % (_W * 2.5) + _W * 2.5) % (_W * 2.5);
            if (rx > _W + 80 || rx < -80) return;

            // Coraux branchus
            const colors = ['#ff4466', '#ff8800', '#ffcc00', '#00ffaa', '#ff44cc'];
            [[0, 0, 14, 50], [18, 0, 12, 38], [32, 0, 16, 55], [50, 0, 10, 32], [62, 0, 14, 44]].forEach(([dx, dy, w, h], ci) => {
                _ctx.fillStyle = colors[(ri + ci) % colors.length];
                _ctx.fillRect(Math.floor(rx + dx), _GY - h, w, h);
                // Branches
                _ctx.fillRect(Math.floor(rx + dx - 4), _GY - h * 0.6, 5, h * 0.3);
                _ctx.fillRect(Math.floor(rx + dx + w), _GY - h * 0.7, 5, h * 0.25);
                // Boules au bout
                _ctx.beginPath();
                _ctx.arc(Math.floor(rx + dx + w / 2), _GY - h, 4, 0, Math.PI * 2);
                _ctx.fill();
                _ctx.beginPath();
                _ctx.arc(Math.floor(rx + dx - 4), _GY - h * 0.6, 3, 0, Math.PI * 2);
                _ctx.fill();
            });

            // Rochers de fond
            _ctx.fillStyle = '#001828';
            for (let r = 0; r < 3; r++) {
                _ctx.beginPath();
                _ctx.arc(Math.floor(rx + r * 28 + 10), _GY + 5, 18 + r * 5, Math.PI, 0);
                _ctx.fill();
            }
        });
    }

    /* ── Épave de navire coulé ── */
    function drawShipwreck() {
        const wpos = [400, 1200];
        wpos.forEach((wp, wi) => {
            const wx = ((wp - seaScrollX * 0.35) % (_W * 2.8) + _W * 2.8) % (_W * 2.8);
            if (wx > _W + 150 || wx < -150) return;

            _ctx.save();
            _ctx.globalAlpha = 0.85;

            // Coque (penchée ~20°)
            _ctx.save();
            _ctx.translate(Math.floor(wx + 60), _GY - 10);
            _ctx.rotate(0.22 * (wi === 0 ? 1 : -1));

            // Coque principale
            _ctx.fillStyle = '#1a1410';
            _ctx.fillRect(-60, -22, 120, 28);
            // Pont
            _ctx.fillStyle = '#141008';
            _ctx.fillRect(-55, -30, 110, 10);
            // Cheminée cassée
            _ctx.fillStyle = '#0e0c08';
            _ctx.fillRect(10, -52, 14, 24);
            _ctx.fillStyle = '#1a1610';
            _ctx.fillRect(8, -54, 18, 6);
            // Mât brisé
            _ctx.strokeStyle = '#1a1410'; _ctx.lineWidth = 3;
            _ctx.beginPath();
            _ctx.moveTo(-30, -30);
            _ctx.lineTo(-10, -70);
            _ctx.stroke();
            _ctx.beginPath();
            _ctx.moveTo(-10, -70);
            _ctx.lineTo(15, -55);
            _ctx.stroke();
            // Hublots
            _ctx.fillStyle = '#002233';
            for (let h = 0; h < 4; h++) {
                _ctx.beginPath();
                _ctx.arc(-40 + h * 26, -10, 4, 0, Math.PI * 2);
                _ctx.fill();
                _ctx.strokeStyle = '#1a2a3a'; _ctx.lineWidth = 1;
                _ctx.stroke();
            }

            _ctx.restore();
            _ctx.restore();

            // Bulles qui s'échappent de l'épave
            if (_G.frame % 12 === wi * 6) {
                bubbles.push({
                    x: wx + 60 + (Math.random() - 0.5) * 40,
                    y: _GY - 30,
                    r: 2 + Math.random() * 3,
                    spd: 0.4 + Math.random() * 0.4,
                    wobble: Math.random() * Math.PI * 2,
                });
            }
        });
    }

    /* ── Bulles ── */
    function drawBubbles() {
        bubbles.forEach(b => {
            _ctx.save();
            _ctx.globalAlpha = 0.35;
            _ctx.strokeStyle = 'rgba(150,220,255,0.8)';
            _ctx.lineWidth = 1;
            _ctx.beginPath();
            _ctx.arc(Math.floor(b.x), Math.floor(b.y), b.r, 0, Math.PI * 2);
            _ctx.stroke();
            // Reflet
            _ctx.fillStyle = 'rgba(200,240,255,0.3)';
            _ctx.beginPath();
            _ctx.arc(Math.floor(b.x - b.r * 0.3), Math.floor(b.y - b.r * 0.3), b.r * 0.4, 0, Math.PI * 2);
            _ctx.fill();
            _ctx.restore();
        });
    }

    /* ── Bancs de poissons pixel ── */
    function drawFishSchools() {
        fishSchools.forEach(s => {
            s.fish.forEach((f, fi) => {
                const fx = Math.floor(s.x + f.ox + Math.sin(_G.frame * 0.05 + f.phase) * 5);
                const fy = Math.floor(s.y + f.oy + Math.cos(_G.frame * 0.04 + f.phase) * 4);

                _ctx.fillStyle = s.col;
                // Corps poisson (5×3 px)
                _ctx.fillRect(fx, fy, 5, 3);
                // Queue (triangle)
                _ctx.fillRect(fx - 2, fy, 2, 1);
                _ctx.fillRect(fx - 2, fy + 2, 2, 1);
                // Oeil
                _ctx.fillStyle = '#000022';
                _ctx.fillRect(fx + 3, fy + 1, 1, 1);
                // Reflet nacré
                _ctx.fillStyle = 'rgba(255,255,255,0.4)';
                _ctx.fillRect(fx + 1, fy, 2, 1);
            });
        });
    }

    /* ── Méduses ── */
    function drawJellyfishes() {
        jellyfishes.forEach(j => {
            const pulse = 0.85 + 0.15 * Math.sin(j.phase);
            const rx = Math.floor(j.x);
            const ry = Math.floor(j.y);

            _ctx.save();
            _ctx.shadowColor = j.col + '0.8)';
            _ctx.shadowBlur = 12;

            // Cloche (demi-ellipse pulsante)
            _ctx.fillStyle = j.col + '0.55)';
            _ctx.beginPath();
            _ctx.ellipse(rx, ry, j.r * pulse, j.r * 0.6 * pulse, 0, Math.PI, 0);
            _ctx.fill();

            // Bord lumineux
            _ctx.strokeStyle = j.col + '0.8)';
            _ctx.lineWidth = 1.5;
            _ctx.beginPath();
            _ctx.ellipse(rx, ry, j.r * pulse, j.r * 0.6 * pulse, 0, Math.PI, 0);
            _ctx.stroke();

            // Tentacules ondulants
            _ctx.strokeStyle = j.col + '0.4)';
            _ctx.lineWidth = 1;
            for (let t = 0; t < 6; t++) {
                const tx = rx - j.r * 0.8 + t * (j.r * 1.6 / 5);
                const len = 15 + Math.sin(j.phase + t) * 6;
                _ctx.beginPath();
                _ctx.moveTo(tx, ry);
                for (let seg = 0; seg < 5; seg++) {
                    const sx = tx + Math.sin(j.phase * 1.5 + t + seg * 0.8) * 3;
                    _ctx.lineTo(sx, ry + seg * (len / 5));
                }
                _ctx.stroke();
            }
            _ctx.restore();
        });
    }

    /* ── Pieuvres pixel art ── */
    function drawOctopuses() {
        creatures.forEach(c => {
            if (c.type !== 'octopus') return;
            const ox = Math.floor(c.x);
            const oy = Math.floor(c.y);
            const sc = c.sc;
            const p = c.phase;

            _ctx.save();
            _ctx.shadowColor = c.col;
            _ctx.shadowBlur = 14;

            // ── Tentacules (8) ondulants ──
            for (let t = 0; t < 8; t++) {
                const angle = (t / 8) * Math.PI; // demi-cercle bas
                const baseX = ox + Math.cos(angle) * 8 * sc;
                const baseY = oy + 8 * sc;
                const wavePh = p + t * 0.7;
                const len = 18 * sc;

                _ctx.strokeStyle = c.col;
                _ctx.lineWidth = sc * 1.5;
                _ctx.beginPath();
                _ctx.moveTo(baseX, baseY);
                // Courbe sinusoïdale
                for (let seg = 0; seg <= 8; seg++) {
                    const sx = baseX + Math.cos(angle) * seg * (len / 8)
                        + Math.sin(wavePh + seg * 0.6) * 5 * sc;
                    const sy = baseY + Math.sin(angle + Math.PI * 0.5) * seg * (len / 8)
                        + Math.cos(wavePh + seg * 0.5) * 3 * sc;
                    _ctx.lineTo(sx, sy);
                }
                _ctx.stroke();
            }

            // ── Corps (manteau) ──
            _ctx.fillStyle = c.col;
            _ctx.beginPath();
            _ctx.ellipse(ox, oy - 2 * sc, 9 * sc, 7 * sc, 0, 0, Math.PI * 2);
            _ctx.fill();

            // ── Tête arrondie ──
            _ctx.beginPath();
            _ctx.ellipse(ox, oy - 9 * sc, 7 * sc, 9 * sc, 0, 0, Math.PI * 2);
            _ctx.fill();

            // ── Yeux (2) ──
            _ctx.fillStyle = '#ffffff';
            [-3, 3].forEach(ex => {
                _ctx.beginPath();
                _ctx.arc(ox + ex * sc, oy - 10 * sc, 2 * sc, 0, Math.PI * 2);
                _ctx.fill();
                _ctx.fillStyle = '#1a0022';
                _ctx.beginPath();
                _ctx.arc(ox + ex * sc, oy - 10 * sc, sc, 0, Math.PI * 2);
                _ctx.fill();
                _ctx.fillStyle = 'rgba(255,255,255,0.7)';
                _ctx.beginPath();
                _ctx.arc(ox + ex * sc + sc * 0.4, oy - 10 * sc - sc * 0.4, sc * 0.4, 0, Math.PI * 2);
                _ctx.fill();
                _ctx.fillStyle = '#ffffff';
            });

            // ── Taches bioluminescentes ──
            const spots = [[-4, -6], [-1, -12], [3, -8], [5, -4]];
            spots.forEach(([sx, sy]) => {
                const glow = 0.3 + 0.3 * Math.sin(p * 2 + sx);
                _ctx.fillStyle = `rgba(180,100,255,${glow})`;
                _ctx.beginPath();
                _ctx.arc(ox + sx * sc, oy + sy * sc, sc, 0, Math.PI * 2);
                _ctx.fill();
            });

            _ctx.restore();
        });
    }

    /* ── Voile d'eau (distorsion visuelle immersion) ── */
    function drawWaterOverlay() {
        // Vague de surface en haut
        _ctx.save();
        _ctx.globalAlpha = 0.07;
        _ctx.fillStyle = '#0066aa';
        for (let x = 0; x < _W; x += 2) {
            const wy = 3 * Math.sin(x * 0.03 + _G.frame * 0.04)
                + 2 * Math.sin(x * 0.07 + _G.frame * 0.06);
            _ctx.fillRect(x, wy, 2, 4);
        }
        _ctx.restore();

        // Lignes de caustiques (reflets de lumière sous l'eau)
        _ctx.save();
        _ctx.globalAlpha = 0.04;
        _ctx.strokeStyle = '#88ddff';
        _ctx.lineWidth = 1;
        for (let ci = 0; ci < 8; ci++) {
            const cx = ((ci * 130 - _G.frame * _G.speed * 0.2) % (_W + 100) + _W + 100) % (_W + 100);
            _ctx.beginPath();
            for (let x = 0; x < 80; x++) {
                const y = 20 + 15 * Math.sin(x * 0.15 + _G.frame * 0.03 + ci);
                if (x === 0) _ctx.moveTo(cx + x, y);
                else _ctx.lineTo(cx + x, y);
            }
            _ctx.stroke();
        }
        _ctx.restore();
    }

    /* ================================================================
       OBSTACLES AQUATIQUES
       ================================================================ */
    const OBSTYPES_UNDERWATER = [

        /* ── 1. Corail épineux dressé ── */
        {
            w: 24, h: 50,
            draw(x, y, t) {
                const colors = ['#ff4466', '#ff8800', '#ff44cc'];
                // Branche centrale
                _ctx.fillStyle = colors[0];
                _ctx.fillRect(x + 9, y, 6, 50);
                // Branches latérales
                [[x + 3, y + 12, 7, 4], [x + 14, y + 8, 7, 4],
                [x + 1, y + 26, 9, 4], [x + 14, y + 22, 9, 4],
                [x + 4, y + 38, 6, 4], [x + 14, y + 35, 6, 4]].forEach(([bx, by, bw, bh], i) => {
                    _ctx.fillStyle = colors[i % colors.length];
                    _ctx.fillRect(bx, by, bw, bh);
                    // Boule au bout
                    _ctx.beginPath();
                    _ctx.arc(bx + (i % 2 === 0 ? 0 : bw), by + 2, 3, 0, Math.PI * 2);
                    _ctx.fill();
                });
                // Lueur pulsante
                _ctx.shadowColor = colors[0]; _ctx.shadowBlur = 8 + 4 * Math.sin(t * 0.1);
                _ctx.fillStyle = `rgba(255,68,102,${0.3 + 0.2 * Math.sin(t * 0.1)})`;
                _ctx.fillRect(x + 9, y, 6, 50);
                _ctx.shadowBlur = 0;
            }
        },

        /* ── 2. Anémone de mer (large, basse) ── */
        {
            w: 44, h: 35,
            draw(x, y, t) {
                // Base
                _ctx.fillStyle = '#441122';
                _ctx.fillRect(x + 14, y + 25, 16, 10);
                // Tentacules ondulants
                for (let i = 0; i < 9; i++) {
                    const tx = x + 3 + i * 4.5;
                    const sway = Math.sin(t * 0.08 + i * 0.8) * 5;
                    _ctx.strokeStyle = `hsl(${320 + i * 8}, 80%, 65%)`;
                    _ctx.lineWidth = 3;
                    _ctx.beginPath();
                    _ctx.moveTo(tx, y + 35);
                    _ctx.bezierCurveTo(tx + sway, y + 20, tx - sway, y + 10, tx + sway * 0.5, y);
                    _ctx.stroke();
                    // Boule au bout
                    _ctx.fillStyle = `hsl(${320 + i * 8}, 90%, 75%)`;
                    _ctx.beginPath();
                    _ctx.arc(tx + sway * 0.5, y, 3, 0, Math.PI * 2);
                    _ctx.fill();
                }
            }
        },

        /* ── 3. FLOTTANT — Méduse géante à éviter ── */
        {
            w: 40, h: 45, floaty: true,
            draw(x, y, t) {
                const pulse = 0.85 + 0.15 * Math.sin(t * 0.1);
                const cx = x + 20, cy = y + 18;
                _ctx.save();
                _ctx.shadowColor = 'rgba(100,0,200,0.9)'; _ctx.shadowBlur = 20;
                // Cloche
                _ctx.fillStyle = 'rgba(120,0,220,0.6)';
                _ctx.beginPath();
                _ctx.ellipse(cx, cy, 18 * pulse, 14 * pulse, 0, Math.PI, 0);
                _ctx.fill();
                // Bord lumineux
                _ctx.strokeStyle = 'rgba(180,80,255,0.9)'; _ctx.lineWidth = 2;
                _ctx.beginPath();
                _ctx.ellipse(cx, cy, 18 * pulse, 14 * pulse, 0, Math.PI, 0);
                _ctx.stroke();
                // Tentacules longs
                for (let i = 0; i < 7; i++) {
                    const tx = cx - 16 + i * 5.5;
                    const len = 25 + Math.sin(t * 0.07 + i) * 8;
                    _ctx.strokeStyle = `rgba(150,50,255,${0.5 + 0.3 * Math.sin(t * 0.1 + i)})`;
                    _ctx.lineWidth = 1.5;
                    _ctx.beginPath();
                    _ctx.moveTo(tx, cy);
                    for (let s = 0; s < 6; s++) {
                        _ctx.lineTo(
                            tx + Math.sin(t * 0.1 + i + s) * 4,
                            cy + s * (len / 6)
                        );
                    }
                    _ctx.stroke();
                }
                _ctx.restore();
            }
        },

        /* ── 4. FLOTTANT — Pieuvre en chasse ── */
        {
            w: 36, h: 40, floaty: true,
            draw(x, y, t) {
                const ox = x + 18, oy = y + 14;
                _ctx.save();
                _ctx.shadowColor = '#880044'; _ctx.shadowBlur = 12;
                // Tentacules
                for (let i = 0; i < 6; i++) {
                    const angle = (i / 6) * Math.PI;
                    const bx = ox + Math.cos(angle) * 12;
                    const by = oy + 10;
                    _ctx.strokeStyle = '#aa0055';
                    _ctx.lineWidth = 2;
                    _ctx.beginPath();
                    _ctx.moveTo(bx, by);
                    for (let s = 0; s < 5; s++) {
                        _ctx.lineTo(
                            bx + Math.cos(angle) * s * 5 + Math.sin(t * 0.12 + i + s) * 3,
                            by + Math.sin(angle + Math.PI * 0.5) * s * 5 + Math.cos(t * 0.1 + i) * 2
                        );
                    }
                    _ctx.stroke();
                }
                // Corps
                _ctx.fillStyle = '#cc0066';
                _ctx.beginPath();
                _ctx.ellipse(ox, oy, 10, 8, 0, 0, Math.PI * 2);
                _ctx.fill();
                _ctx.beginPath();
                _ctx.ellipse(ox, oy - 8, 8, 10, 0, 0, Math.PI * 2);
                _ctx.fill();
                // Yeux
                [-3, 3].forEach(ex => {
                    _ctx.fillStyle = '#fff';
                    _ctx.beginPath(); _ctx.arc(ox + ex, oy - 9, 2.5, 0, Math.PI * 2); _ctx.fill();
                    _ctx.fillStyle = '#110';
                    _ctx.beginPath(); _ctx.arc(ox + ex, oy - 9, 1.2, 0, Math.PI * 2); _ctx.fill();
                });
                _ctx.restore();
            }
        },

        /* ── 5. Rocher sous-marin avec algues ── */
        {
            w: 50, h: 32,
            draw(x, y, t) {
                // Rocher
                _ctx.fillStyle = '#0a1520';
                _ctx.beginPath();
                _ctx.arc(x + 18, y + 32, 20, Math.PI, 0);
                _ctx.fill();
                _ctx.beginPath();
                _ctx.arc(x + 34, y + 32, 16, Math.PI, 0);
                _ctx.fill();
                // Mousse/algues sur le rocher
                _ctx.strokeStyle = '#004422';
                _ctx.lineWidth = 2;
                for (let i = 0; i < 5; i++) {
                    const ax = x + 8 + i * 8;
                    const ah = 10 + Math.random() * 8;
                    const sway = Math.sin(t * 0.07 + i) * 4;
                    _ctx.beginPath();
                    _ctx.moveTo(ax, y + 12);
                    _ctx.bezierCurveTo(ax + sway, y + 6, ax - sway, y + 3, ax + sway * 0.5, y);
                    _ctx.stroke();
                }
                // Bioluminescence
                _ctx.fillStyle = `rgba(0,200,150,${0.2 + 0.15 * Math.sin(t * 0.06)})`;
                _ctx.beginPath();
                _ctx.arc(x + 22, y + 20, 8, 0, Math.PI * 2);
                _ctx.fill();
            }
        },
    ];

    /* ================================================================
       ENREGISTREMENT dans le moteur NEO DASH
       ================================================================ */
    if (typeof registerTheme === 'function') {
        registerTheme('underwater', {
            name: '🌊 ABYSSES',
            skyTop: '#000810',
            skyBot: '#001830',
            groundColor: '#000d1a',
            neonLine: '#0088ff',
            gridColor: 'rgba(0,136,255,0.06)',
            starColor: '100,200,255',
            fogColor: 'rgba(0,30,60,0.25)',
            buildings: [],

            hooks: {
                init: init,
                update: update,
                drawBehind: drawBehind,
                drawFront: drawFront,
            },
            obstTypes: OBSTYPES_UNDERWATER,
        });
    }

})();