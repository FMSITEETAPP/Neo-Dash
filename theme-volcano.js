/* ================================================================
   NEO DASH — THEME PLUGIN : VOLCAN 🌋
   Fichier indépendant, chargé après neo-dash.html
   S'enregistre via : registerTheme('volcano', { ... })
   ================================================================ */

(function () {

    /* ── État interne ── */
    let _ctx, _W, _H, _GY, _G;
    let volScrollX = 0;

    let lavaRivers = [];   // rivières de lave qui coulent
    let emberParts = [];   // braises volantes
    let ashClouds = [];   // nuages de cendres
    let eruptions = [];   // éruptions actives
    let lavaDrops = [];   // projections de lave en l'air
    let volcanoes = [];   // volcans en fond
    let lavaPools = [];   // mares de lave au sol
    let rocks = [];   // rochers volcaniques
    let smokeColumns = [];   // colonnes de fumée noire

    /* ================================================================
       INIT
       ================================================================ */
    function init(ctx, W, H, GY, G) {
        _ctx = ctx; _W = W; _H = H; _GY = GY; _G = G;
        volScrollX = 0;
        lavaRivers = [];
        emberParts = [];
        ashClouds = [];
        eruptions = [];
        lavaDrops = [];
        lavaPools = [];
        rocks = [];
        smokeColumns = [];

        // ── Volcans en fond (3 tailles) ──
        volcanoes = [
            { x: 120, h: 180, w: 160, tier: 0, eruptCD: 0, eruptMax: 200 },
            { x: 480, h: 130, w: 110, tier: 1, eruptCD: 80, eruptMax: 280 },
            { x: 750, h: 200, w: 180, tier: 0, eruptCD: 140, eruptMax: 220 },
            { x: 1100, h: 150, w: 130, tier: 1, eruptCD: 40, eruptMax: 300 },
            { x: 1400, h: 170, w: 155, tier: 0, eruptCD: 100, eruptMax: 180 },
        ];

        // ── Rivières de lave au sol ──
        for (let i = 0; i < 8; i++) {
            lavaRivers.push({
                x: Math.random() * W * 3,
                w: 20 + Math.random() * 40,
                spd: 0.3 + Math.random() * 0.2,
                phase: Math.random() * Math.PI * 2,
            });
        }

        // ── Mares de lave ──
        for (let i = 0; i < 6; i++) {
            lavaPools.push({
                x: Math.random() * W * 3,
                r: 18 + Math.random() * 25,
                phase: Math.random() * Math.PI * 2,
            });
        }

        // ── Rochers volcaniques ──
        for (let i = 0; i < 14; i++) {
            rocks.push({
                x: Math.random() * W * 3,
                h: 15 + Math.random() * 40,
                w: 10 + Math.random() * 30,
                col: Math.random() > 0.5 ? '#1a0e06' : '#2a1a0a',
                lava: Math.random() > 0.6, // fissure de lave
            });
        }

        // ── Nuages de cendres ──
        for (let i = 0; i < 10; i++) {
            spawnAshCloud(true);
        }

        // ── Braises initiales ──
        for (let i = 0; i < 40; i++) {
            spawnEmber(true);
        }
    }

    function spawnEmber(random) {
        emberParts.push({
            x: random ? Math.random() * _W : _W * 0.3 + Math.random() * _W * 0.7,
            y: random ? Math.random() * _GY : _GY - 10,
            vx: (Math.random() - 0.5) * 2.5,
            vy: -(1.5 + Math.random() * 3),
            life: 40 + Math.random() * 80,
            max: 120,
            r: 1 + Math.random() * 2.5,
            col: Math.random() > 0.5 ? '#ff6600' : '#ffcc00',
        });
    }

    function spawnAshCloud(random) {
        ashClouds.push({
            x: random ? Math.random() * _W : _W + 30,
            y: 10 + Math.random() * (_GY * 0.5),
            r: 20 + Math.random() * 35,
            vx: -(0.15 + Math.random() * 0.2),
            vy: -(0.05 + Math.random() * 0.1),
            life: 200 + Math.random() * 300,
            max: 500,
            col: `rgba(${30 + Math.floor(Math.random() * 20)},${20 + Math.floor(Math.random() * 15)},${10 + Math.floor(Math.random() * 10)},`,
        });
    }

    /* ================================================================
       UPDATE
       ================================================================ */
    function update() {
        volScrollX += _G.speed * 0.28;

        // ── Braises ──
        emberParts.forEach(e => {
            e.x += e.vx;
            e.y += e.vy;
            e.vy += 0.04; // gravité légère
            e.vx += (Math.random() - 0.5) * 0.1;
            e.life--;
        });
        emberParts = emberParts.filter(e => e.life > 0 && e.y < _GY);
        if (_G.frame % 2 === 0) spawnEmber(false);

        // ── Nuages de cendres ──
        ashClouds.forEach(a => {
            a.x += a.vx;
            a.y += a.vy;
            a.r += 0.03;
            a.life--;
        });
        ashClouds = ashClouds.filter(a => a.life > 0 && a.x > -100);
        if (_G.frame % 18 === 0) spawnAshCloud(false);

        // ── Éruptions ──
        volcanoes.forEach(v => {
            const vx = ((v.x - volScrollX * 0.25) % (_W * 2.8) + _W * 2.8) % (_W * 2.8);
            if (++v.eruptCD >= v.eruptMax) {
                v.eruptCD = 0;
                // Lancer des projections
                for (let i = 0; i < 12; i++) {
                    lavaDrops.push({
                        x: vx + v.w / 2 + (Math.random() - 0.5) * 20,
                        y: _GY - v.h,
                        vx: (Math.random() - 0.5) * 5,
                        vy: -(6 + Math.random() * 8),
                        r: 3 + Math.random() * 5,
                        life: 80,
                        max: 80,
                    });
                }
                // Colonne de fumée noire
                smokeColumns.push({
                    x: vx + v.w / 2, y: _GY - v.h,
                    life: 120, max: 120,
                    r: 8,
                });
            }
        });

        // ── Gouttes de lave ──
        lavaDrops.forEach(d => {
            d.x += d.vx;
            d.y += d.vy;
            d.vy += 0.22;
            d.life--;
        });
        lavaDrops = lavaDrops.filter(d => d.life > 0 && d.y < _GY + 20);

        // ── Colonnes de fumée ──
        smokeColumns.forEach(s => {
            s.y -= 0.8;
            s.r += 0.4;
            s.life--;
        });
        smokeColumns = smokeColumns.filter(s => s.life > 0);
    }

    /* ================================================================
       DRAW BEHIND
       ================================================================ */
    function drawBehind() {
        drawSkyGlow();
        drawAshClouds();
        drawVolcanoes();
        drawLavaPools();
        drawRocks();
        drawLavaRivers();
    }

    /* ================================================================
       DRAW FRONT
       ================================================================ */
    function drawFront() {
        drawLavaDrops();
        drawSmokeColumns();
        drawEmbers();
        drawHeatDistortion();
    }

    /* ── Lueur rouge du ciel (reflet de la lave) ── */
    function drawSkyGlow() {
        // Lueur pulsante à l'horizon
        const pulse = 0.12 + 0.06 * Math.sin(_G.frame * 0.03);
        const grad = _ctx.createLinearGradient(0, _GY * 0.4, 0, _GY);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(1, `rgba(200,40,0,${pulse})`);
        _ctx.fillStyle = grad;
        _ctx.fillRect(0, _GY * 0.4, _W, _GY * 0.6);

        // Éclairs lumineux sporadiques (éruptions lointaines)
        if (Math.sin(_G.frame * 0.07) > 0.95) {
            _ctx.save();
            _ctx.globalAlpha = 0.08;
            _ctx.fillStyle = '#ff4400';
            _ctx.fillRect(0, 0, _W, _GY);
            _ctx.restore();
        }
    }

    /* ── Nuages de cendres ── */
    function drawAshClouds() {
        ashClouds.forEach(a => {
            const alpha = (a.life / a.max) * 0.45;
            _ctx.save();
            _ctx.shadowColor = 'rgba(50,30,10,0.4)'; _ctx.shadowBlur = 10;
            _ctx.fillStyle = a.col + alpha + ')';
            _ctx.beginPath();
            _ctx.arc(Math.floor(a.x), Math.floor(a.y), a.r, 0, Math.PI * 2);
            _ctx.fill();
            // Sous-nuages
            _ctx.fillStyle = a.col + (alpha * 0.7) + ')';
            _ctx.beginPath();
            _ctx.arc(Math.floor(a.x - a.r * 0.5), Math.floor(a.y + a.r * 0.3), a.r * 0.65, 0, Math.PI * 2);
            _ctx.fill();
            _ctx.beginPath();
            _ctx.arc(Math.floor(a.x + a.r * 0.55), Math.floor(a.y + a.r * 0.2), a.r * 0.55, 0, Math.PI * 2);
            _ctx.fill();
            _ctx.restore();
        });
    }

    /* ── Volcans pixel art ── */
    function drawVolcanoes() {
        volcanoes.forEach((v, vi) => {
            const vx = ((v.x - volScrollX * 0.25) % (_W * 2.8) + _W * 2.8) % (_W * 2.8);
            if (vx > _W + 200 || vx < -200) return;

            const bx = Math.floor(vx);
            const h = v.h;
            const w = v.w;

            // ── Corps du volcan (triangle trapézoïdal) ──
            _ctx.fillStyle = '#1a0e06';
            _ctx.beginPath();
            _ctx.moveTo(bx, _GY);
            _ctx.lineTo(bx + w * 0.3, _GY - h);
            _ctx.lineTo(bx + w * 0.7, _GY - h);
            _ctx.lineTo(bx + w, _GY);
            _ctx.fill();

            // Couche de roche volcanique
            _ctx.fillStyle = '#251508';
            _ctx.beginPath();
            _ctx.moveTo(bx + 5, _GY);
            _ctx.lineTo(bx + w * 0.32, _GY - h + 5);
            _ctx.lineTo(bx + w * 0.68, _GY - h + 5);
            _ctx.lineTo(bx + w - 5, _GY);
            _ctx.fill();

            // Strates rocheuses (couches géologiques)
            ['#1e1006', '#2a1508', '#1a0e05'].forEach((col, li) => {
                const ly = _GY - h * (0.25 + li * 0.18);
                const lw = w * (0.85 - li * 0.1);
                const lx = bx + (w - lw) / 2;
                _ctx.strokeStyle = col;
                _ctx.lineWidth = 2;
                _ctx.beginPath();
                _ctx.moveTo(lx, ly);
                _ctx.lineTo(lx + lw, ly + 3);
                _ctx.stroke();
            });

            // ── Cratère (bouche) ──
            const craterW = w * 0.4;
            const craterX = bx + w * 0.3;
            const craterY = _GY - h;
            _ctx.fillStyle = '#0a0502';
            _ctx.fillRect(Math.floor(craterX), craterY - 4, Math.floor(craterW), 10);
            _ctx.fillStyle = '#1a0a03';
            _ctx.fillRect(Math.floor(craterX + 4), craterY - 2, Math.floor(craterW - 8), 6);

            // ── Lave dans le cratère (pulsante) ──
            const lp = 0.6 + 0.4 * Math.sin(_G.frame * 0.08 + vi * 1.4);
            _ctx.fillStyle = `rgba(255,${Math.floor(80 + lp * 80)},0,${lp})`;
            _ctx.fillRect(Math.floor(craterX + 2), craterY, Math.floor(craterW - 4), 4);
            _ctx.fillStyle = `rgba(255,200,0,${lp * 0.6})`;
            _ctx.fillRect(Math.floor(craterX + 6), craterY + 1, Math.floor(craterW - 12), 2);

            // ── Coulée de lave sur les flancs ──
            const nbCoulees = 2 + vi % 2;
            for (let ci = 0; ci < nbCoulees; ci++) {
                const startX = craterX + 4 + ci * (craterW / nbCoulees);
                const endX = startX + (ci % 2 === 0 ? -20 : 20) + Math.sin(vi + ci) * 15;
                const lavaAlpha = 0.7 + 0.3 * Math.sin(_G.frame * 0.05 + vi + ci);

                // Corps de la coulée
                _ctx.strokeStyle = `rgba(255,60,0,${lavaAlpha})`;
                _ctx.lineWidth = 4;
                _ctx.beginPath();
                _ctx.moveTo(startX, craterY + 2);
                _ctx.bezierCurveTo(
                    startX + (endX - startX) * 0.3, craterY + h * 0.2,
                    startX + (endX - startX) * 0.6, craterY + h * 0.5,
                    endX, _GY - 5
                );
                _ctx.stroke();

                // Centre brillant
                _ctx.strokeStyle = `rgba(255,200,0,${lavaAlpha * 0.5})`;
                _ctx.lineWidth = 1.5;
                _ctx.beginPath();
                _ctx.moveTo(startX, craterY + 2);
                _ctx.bezierCurveTo(
                    startX + (endX - startX) * 0.3, craterY + h * 0.2,
                    startX + (endX - startX) * 0.6, craterY + h * 0.5,
                    endX, _GY - 5
                );
                _ctx.stroke();
            }

            // ── Panache de fumée permanent ──
            for (let pi = 0; pi < 4; pi++) {
                const pPhase = _G.frame * 0.015 + pi * 1.2 + vi;
                const px2 = craterX + craterW / 2 + Math.sin(pPhase) * 12;
                const py2 = craterY - 8 - pi * 14;
                const pa = (0.3 - pi * 0.06) * (0.5 + 0.5 * Math.sin(_G.frame * 0.04 + vi));
                _ctx.save();
                _ctx.globalAlpha = pa;
                _ctx.fillStyle = '#1a1208';
                _ctx.beginPath();
                _ctx.arc(Math.floor(px2), Math.floor(py2), 8 + pi * 5, 0, Math.PI * 2);
                _ctx.fill();
                _ctx.restore();
            }

            // ── Projection de braises depuis le cratère ──
            if (_G.frame % 8 === vi % 8) {
                emberParts.push({
                    x: craterX + craterW / 2 + (Math.random() - 0.5) * 10,
                    y: craterY,
                    vx: (Math.random() - 0.5) * 3,
                    vy: -(2 + Math.random() * 4),
                    life: 50 + Math.random() * 50,
                    max: 100,
                    r: 2 + Math.random() * 3,
                    col: Math.random() > 0.4 ? '#ff4400' : '#ffaa00',
                });
            }
        });
    }

    /* ── Mares de lave ── */
    function drawLavaPools() {
        lavaPools.forEach(pool => {
            const px = ((pool.x - volScrollX * 0.6) % (_W * 3) + _W * 3) % (_W * 3);
            if (px > _W + 60 || px < -60) return;

            pool.phase += 0.04;
            const pulse = 0.7 + 0.3 * Math.sin(pool.phase);

            // Mare principale
            _ctx.shadowColor = '#ff4400'; _ctx.shadowBlur = 15;
            _ctx.fillStyle = `rgba(200,40,0,${pulse * 0.9})`;
            _ctx.beginPath();
            _ctx.ellipse(Math.floor(px), _GY + 3, pool.r, pool.r * 0.35, 0, 0, Math.PI * 2);
            _ctx.fill();

            // Surface brillante
            _ctx.fillStyle = `rgba(255,130,0,${pulse * 0.7})`;
            _ctx.beginPath();
            _ctx.ellipse(Math.floor(px), _GY + 3, pool.r * 0.7, pool.r * 0.22, 0, 0, Math.PI * 2);
            _ctx.fill();

            // Centre incandescent
            _ctx.fillStyle = `rgba(255,220,0,${pulse * 0.5})`;
            _ctx.beginPath();
            _ctx.ellipse(Math.floor(px), _GY + 3, pool.r * 0.35, pool.r * 0.1, 0, 0, Math.PI * 2);
            _ctx.fill();

            _ctx.shadowBlur = 0;

            // Bulles de lave
            if (Math.sin(_G.frame * 0.2 + pool.phase * 3) > 0.88) {
                _ctx.fillStyle = '#ffcc00';
                _ctx.beginPath();
                _ctx.arc(
                    Math.floor(px + (Math.random() - 0.5) * pool.r),
                    _GY,
                    2 + Math.random() * 3, 0, Math.PI * 2
                );
                _ctx.fill();
                // Éclabousssure
                emberParts.push({
                    x: px + (Math.random() - 0.5) * pool.r, y: _GY,
                    vx: (Math.random() - 0.5) * 2, vy: -(1.5 + Math.random() * 2),
                    life: 20, max: 20, r: 1.5, col: '#ff8800',
                });
            }
        });
    }

    /* ── Rochers volcaniques ── */
    function drawRocks() {
        rocks.forEach(rock => {
            const rx = ((rock.x - volScrollX * 0.75) % (_W * 3) + _W * 3) % (_W * 3);
            if (rx > _W + 50 || rx < -50) return;

            // Corps du rocher
            _ctx.fillStyle = rock.col;
            _ctx.beginPath();
            _ctx.moveTo(Math.floor(rx), _GY);
            _ctx.lineTo(Math.floor(rx + rock.w * 0.2), _GY - rock.h);
            _ctx.lineTo(Math.floor(rx + rock.w * 0.55), _GY - rock.h * 1.1);
            _ctx.lineTo(Math.floor(rx + rock.w * 0.85), _GY - rock.h * 0.7);
            _ctx.lineTo(Math.floor(rx + rock.w), _GY);
            _ctx.fill();

            // Texture rugueuse
            _ctx.fillStyle = 'rgba(255,255,255,0.04)';
            _ctx.fillRect(Math.floor(rx + rock.w * 0.1), _GY - rock.h * 0.5, rock.w * 0.15, rock.h * 0.3);

            // Fissure de lave (si applicable)
            if (rock.lava) {
                const lp = 0.5 + 0.5 * Math.sin(_G.frame * 0.1 + rock.x * 0.01);
                _ctx.strokeStyle = `rgba(255,${Math.floor(60 + lp * 100)},0,${lp * 0.9})`;
                _ctx.lineWidth = 1.5;
                _ctx.beginPath();
                _ctx.moveTo(Math.floor(rx + rock.w * 0.4), _GY - rock.h * 0.9);
                _ctx.lineTo(Math.floor(rx + rock.w * 0.55), _GY - rock.h * 0.4);
                _ctx.lineTo(Math.floor(rx + rock.w * 0.45), _GY - 5);
                _ctx.stroke();
                // Lueur
                _ctx.shadowColor = '#ff4400'; _ctx.shadowBlur = 6;
                _ctx.strokeStyle = `rgba(255,180,0,${lp * 0.4})`;
                _ctx.lineWidth = 0.5;
                _ctx.stroke();
                _ctx.shadowBlur = 0;
            }
        });
    }

    /* ── Rivières de lave ── */
    function drawLavaRivers() {
        lavaRivers.forEach(r => {
            const rx = ((r.x - volScrollX * 0.9) % (_W * 3) + _W * 3) % (_W * 3);
            if (rx > _W + 60 || rx < -60) return;

            r.phase += r.spd;
            const pulse = 0.7 + 0.3 * Math.sin(r.phase);

            // Sol brûlé autour
            _ctx.fillStyle = '#120700';
            _ctx.fillRect(Math.floor(rx - r.w * 0.1), _GY - 3, Math.floor(r.w * 1.2), 6);

            // Coulée principale
            _ctx.fillStyle = `rgba(220,50,0,${pulse})`;
            _ctx.fillRect(Math.floor(rx), _GY - 2, Math.floor(r.w), 5);

            // Vague animée
            _ctx.fillStyle = `rgba(255,120,0,${pulse * 0.8})`;
            for (let wx = rx; wx < rx + r.w; wx += 4) {
                const wy = Math.sin(wx * 0.3 + r.phase * 2) * 1.5;
                _ctx.fillRect(Math.floor(wx), Math.floor(_GY - 1 + wy), 3, 3);
            }

            // Centre incandescent
            _ctx.fillStyle = `rgba(255,220,0,${pulse * 0.5})`;
            _ctx.fillRect(Math.floor(rx + r.w * 0.2), _GY, Math.floor(r.w * 0.6), 2);
        });
    }

    /* ── Projections de lave ── */
    function drawLavaDrops() {
        lavaDrops.forEach(d => {
            const alpha = d.life / d.max;
            _ctx.shadowColor = '#ff4400'; _ctx.shadowBlur = 8;
            // Traînée
            _ctx.fillStyle = `rgba(255,80,0,${alpha * 0.4})`;
            _ctx.beginPath();
            _ctx.arc(Math.floor(d.x - d.vx), Math.floor(d.y - d.vy), d.r * 0.6, 0, Math.PI * 2);
            _ctx.fill();
            // Goutte principale
            _ctx.fillStyle = `rgba(255,${Math.floor(60 + alpha * 140)},0,${alpha})`;
            _ctx.beginPath();
            _ctx.arc(Math.floor(d.x), Math.floor(d.y), d.r, 0, Math.PI * 2);
            _ctx.fill();
            // Centre brillant
            _ctx.fillStyle = `rgba(255,240,0,${alpha * 0.7})`;
            _ctx.beginPath();
            _ctx.arc(Math.floor(d.x), Math.floor(d.y), d.r * 0.4, 0, Math.PI * 2);
            _ctx.fill();
            _ctx.shadowBlur = 0;
        });
    }

    /* ── Colonnes de fumée d'éruption ── */
    function drawSmokeColumns() {
        smokeColumns.forEach(s => {
            const alpha = (s.life / s.max) * 0.55;
            _ctx.save();
            _ctx.globalAlpha = alpha;
            _ctx.fillStyle = '#1a1006';
            _ctx.beginPath();
            _ctx.arc(Math.floor(s.x), Math.floor(s.y), s.r, 0, Math.PI * 2);
            _ctx.fill();
            _ctx.beginPath();
            _ctx.arc(Math.floor(s.x - s.r * 0.4), Math.floor(s.y + s.r * 0.3), s.r * 0.7, 0, Math.PI * 2);
            _ctx.fill();
            _ctx.restore();
        });
    }

    /* ── Braises volantes ── */
    function drawEmbers() {
        emberParts.forEach(e => {
            const alpha = e.life / e.max;
            _ctx.shadowColor = e.col; _ctx.shadowBlur = 5;
            _ctx.fillStyle = e.col.replace(')', `,${alpha})`).replace('rgb', 'rgba');
            _ctx.fillStyle = e.col;
            _ctx.globalAlpha = alpha;
            _ctx.beginPath();
            _ctx.arc(Math.floor(e.x), Math.floor(e.y), e.r, 0, Math.PI * 2);
            _ctx.fill();
            // Traînée
            _ctx.fillStyle = '#ffcc00';
            _ctx.globalAlpha = alpha * 0.4;
            _ctx.beginPath();
            _ctx.arc(Math.floor(e.x - e.vx), Math.floor(e.y - e.vy), e.r * 0.5, 0, Math.PI * 2);
            _ctx.fill();
            _ctx.globalAlpha = 1;
            _ctx.shadowBlur = 0;
        });
    }

    /* ── Distorsion thermique (air chaud) ── */
    function drawHeatDistortion() {
        // Lignes de shimmer au-dessus du sol
        _ctx.save();
        _ctx.globalAlpha = 0.03 + 0.02 * Math.sin(_G.frame * 0.06);
        _ctx.strokeStyle = '#ff6600';
        _ctx.lineWidth = 1;
        for (let hi = 0; hi < 6; hi++) {
            const hy = _GY - 10 - hi * 8;
            _ctx.beginPath();
            for (let x = 0; x < _W; x += 3) {
                const dy = Math.sin(x * 0.05 + _G.frame * 0.08 + hi * 0.7) * 3;
                if (x === 0) _ctx.moveTo(x, hy + dy);
                else _ctx.lineTo(x, hy + dy);
            }
            _ctx.stroke();
        }
        _ctx.restore();
    }

    /* ================================================================
       OBSTACLES VOLCANIQUES
       ================================================================ */
    const OBSTYPES_VOLCANO = [

        /* ── 1. Geyser de lave ── */
        {
            w: 20, h: 60,
            draw(x, y, t) {
                const pulse = 0.6 + 0.4 * Math.sin(t * 0.15);
                // Base rocheuse
                _ctx.fillStyle = '#1a0e06';
                _ctx.fillRect(x + 6, y + 50, 8, 10);
                _ctx.fillRect(x + 4, y + 55, 12, 5);
                // Jet de lave (s'étrécit vers le haut)
                for (let ji = 0; ji < 5; ji++) {
                    const jw = 8 - ji * 1.2;
                    const jy = y + 50 - ji * 10;
                    const jx = x + 10 - jw / 2 + Math.sin(t * 0.12 + ji) * 2;
                    const col = ji < 2 ? `rgba(255,${60 + ji * 40},0,${pulse})`
                        : `rgba(255,${160 + ji * 20},0,${pulse * 0.8})`;
                    _ctx.fillStyle = col;
                    _ctx.fillRect(Math.floor(jx), Math.floor(jy), Math.ceil(jw), 12);
                }
                // Éclaboussure au sommet
                if (Math.sin(t * 0.15) > 0.4) {
                    _ctx.shadowColor = '#ff4400'; _ctx.shadowBlur = 10;
                    for (let si = 0; si < 4; si++) {
                        const sa = (si / 4) * Math.PI - Math.PI * 0.1;
                        _ctx.fillStyle = '#ff8800';
                        _ctx.fillRect(
                            Math.floor(x + 10 + Math.cos(sa) * (5 + si * 2)),
                            Math.floor(y + Math.sin(sa) * -(3 + si * 2)),
                            3, 3
                        );
                    }
                    _ctx.shadowBlur = 0;
                }
                // Lueur
                _ctx.shadowColor = '#ff4400'; _ctx.shadowBlur = 14;
                _ctx.fillStyle = `rgba(255,100,0,${pulse * 0.3})`;
                _ctx.fillRect(x + 5, y, 10, 60);
                _ctx.shadowBlur = 0;
            }
        },

        /* ── 2. Bloc de roche incandescente ── */
        {
            w: 42, h: 38,
            draw(x, y, t) {
                // Corps du rocher
                _ctx.fillStyle = '#1e1006';
                _ctx.beginPath();
                _ctx.moveTo(x, y + 38);
                _ctx.lineTo(x + 6, y + 10);
                _ctx.lineTo(x + 14, y);
                _ctx.lineTo(x + 30, y + 4);
                _ctx.lineTo(x + 42, y + 18);
                _ctx.lineTo(x + 38, y + 38);
                _ctx.fill();
                // Texture
                _ctx.fillStyle = '#2a1808';
                _ctx.fillRect(x + 8, y + 8, 14, 8);
                _ctx.fillRect(x + 24, y + 14, 10, 6);
                // Fissures incandescentes
                const lp = 0.6 + 0.4 * Math.sin(t * 0.1);
                _ctx.shadowColor = '#ff4400'; _ctx.shadowBlur = 8;
                _ctx.strokeStyle = `rgba(255,${Math.floor(80 + lp * 100)},0,${lp})`;
                _ctx.lineWidth = 2;
                // Fissure 1
                _ctx.beginPath();
                _ctx.moveTo(x + 10, y + 5);
                _ctx.lineTo(x + 18, y + 20);
                _ctx.lineTo(x + 12, y + 36);
                _ctx.stroke();
                // Fissure 2
                _ctx.beginPath();
                _ctx.moveTo(x + 28, y + 10);
                _ctx.lineTo(x + 22, y + 24);
                _ctx.lineTo(x + 30, y + 36);
                _ctx.stroke();
                _ctx.shadowBlur = 0;
                // Braises qui s'échappent
                [[10, 5], [18, 20], [28, 10], [22, 24]].forEach(([bx, by]) => {
                    if (Math.sin(t * 0.2 + bx) > 0.7) {
                        _ctx.fillStyle = '#ffcc00';
                        _ctx.beginPath();
                        _ctx.arc(x + bx, y + by, 2, 0, Math.PI * 2);
                        _ctx.fill();
                    }
                });
            }
        },

        /* ── 3. FLOTTANT — Nuage de cendres toxique ── */
        {
            w: 52, h: 36, floaty: true,
            draw(x, y, t) {
                const cx = x + 26, cy = y + 18;
                _ctx.save();
                _ctx.shadowColor = 'rgba(80,40,0,0.6)'; _ctx.shadowBlur = 15;
                // Nuage principal
                [[0, 0, 22], [14, 8, 16], [14, 6, 16], [22, 14, 12], [22, 12, 12], [0, 20, 18]].forEach(([dx, dy, r]) => {
                    _ctx.fillStyle = `rgba(${30 + Math.floor(Math.sin(t * 0.06 + dx) * 8)},20,8,0.88)`;
                    _ctx.beginPath();
                    _ctx.arc(cx + dx, cy + dy, r, 0, Math.PI * 2);
                    _ctx.fill();
                });
                // Particules de cendres
                for (let pi = 0; pi < 6; pi++) {
                    const px2 = cx + Math.sin(t * 0.08 + pi * 1.1) * 20;
                    const py2 = cy + Math.cos(t * 0.07 + pi * 0.9) * 12;
                    const pa = 0.4 + 0.3 * Math.sin(t * 0.1 + pi);
                    _ctx.fillStyle = `rgba(60,40,15,${pa})`;
                    _ctx.fillRect(Math.floor(px2), Math.floor(py2), 3, 3);
                }
                // Lueur interne orangée
                _ctx.fillStyle = `rgba(200,80,0,${0.08 + 0.05 * Math.sin(t * 0.09)})`;
                _ctx.beginPath();
                _ctx.arc(cx, cy + 8, 14, 0, Math.PI * 2);
                _ctx.fill();
                _ctx.restore();
            }
        },

        /* ── 4. FLOTTANT — Projection de lave en l'air ── */
        {
            w: 18, h: 22, floaty: true,
            draw(x, y, t) {
                const bob = Math.sin(t * 0.14) * 3;
                _ctx.shadowColor = '#ff4400'; _ctx.shadowBlur = 16;
                // Traînée
                _ctx.fillStyle = 'rgba(255,80,0,0.3)';
                _ctx.fillRect(x + 7, Math.floor(y + 10 + bob), 4, 14);
                // Goutte principale
                _ctx.fillStyle = '#ff4400';
                _ctx.beginPath();
                _ctx.arc(x + 9, Math.floor(y + 8 + bob), 7, 0, Math.PI * 2);
                _ctx.fill();
                // Halo
                _ctx.fillStyle = 'rgba(255,150,0,0.5)';
                _ctx.beginPath();
                _ctx.arc(x + 9, Math.floor(y + 8 + bob), 10, 0, Math.PI * 2);
                _ctx.fill();
                // Centre
                _ctx.fillStyle = '#ffee00';
                _ctx.beginPath();
                _ctx.arc(x + 9, Math.floor(y + 7 + bob), 3, 0, Math.PI * 2);
                _ctx.fill();
                // Étincelles
                for (let si = 0; si < 4; si++) {
                    const sa = t * 0.1 + si * Math.PI / 2;
                    _ctx.fillStyle = '#ffcc00';
                    _ctx.fillRect(
                        Math.floor(x + 9 + Math.cos(sa) * (9 + Math.sin(t * 0.2) * 3)),
                        Math.floor(y + 8 + bob + Math.sin(sa) * (9 + Math.cos(t * 0.2) * 3)),
                        2, 2
                    );
                }
                _ctx.shadowBlur = 0;
            }
        },

        /* ── 5. Pilier de roche fondue ── */
        {
            w: 16, h: 55,
            draw(x, y, t) {
                // Corps du pilier
                _ctx.fillStyle = '#1a0e05';
                _ctx.fillRect(x + 4, y, 8, 55);
                _ctx.fillRect(x + 2, y + 48, 12, 7);
                // Lave qui coule sur les côtés
                const lp = 0.6 + 0.4 * Math.sin(t * 0.1);
                _ctx.shadowColor = '#ff4400'; _ctx.shadowBlur = 8;
                // Gauche
                _ctx.strokeStyle = `rgba(255,60,0,${lp})`;
                _ctx.lineWidth = 2;
                _ctx.beginPath();
                _ctx.moveTo(x + 4, y);
                for (let ly = 0; ly < 55; ly += 5) {
                    _ctx.lineTo(x + 4 + Math.sin(t * 0.08 + ly * 0.2) * 2, y + ly);
                }
                _ctx.stroke();
                // Droite
                _ctx.beginPath();
                _ctx.moveTo(x + 12, y);
                for (let ly = 0; ly < 55; ly += 5) {
                    _ctx.lineTo(x + 12 + Math.sin(t * 0.08 + ly * 0.2 + 1) * 2, y + ly);
                }
                _ctx.stroke();
                // Sommet en fusion
                _ctx.fillStyle = `rgba(255,${Math.floor(100 + lp * 120)},0,${lp})`;
                _ctx.fillRect(x + 3, y, 10, 6);
                _ctx.fillStyle = `rgba(255,220,0,${lp * 0.6})`;
                _ctx.fillRect(x + 5, y, 6, 3);
                _ctx.shadowBlur = 0;
            }
        },
    ];

    /* ================================================================
       ENREGISTREMENT dans le moteur NEO DASH
       ================================================================ */
    if (typeof registerTheme === 'function') {
        registerTheme('volcano', {
            name: '🌋 VOLCAN',
            skyTop: '#050200',
            skyBot: '#200800',
            groundColor: '#100600',
            neonLine: '#ff4400',
            gridColor: 'rgba(255,60,0,0.08)',
            starColor: '255,100,20',
            fogColor: 'rgba(40,10,0,0.35)',
            buildings: [],

            hooks: {
                init: init,
                update: update,
                drawBehind: drawBehind,
                drawFront: drawFront,
            },
            obstTypes: OBSTYPES_VOLCANO,
        });
    }

})();