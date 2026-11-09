/**
 * Props & Physics Engine - Destructible Desi Objects
 * Authentic Desi Props:
 * 1. 15-Liter Mustard Oil / Ghee Tin Canister (Classic Chaukor Peepa / Dabba) with authentic lithograph labels & wire bail handle
 * 2. Desi Cold Drink & Sherbet Tin Cans (Frooti Mango, Thums Up, Rooh Afza)
 * 3. Shatterable Terracotta Matkas (Clay Pots)
 * 4. Wooden Crates (Peti) and Steel Thalis
 */
class PropsEngine {
    constructor(scene, particleSystem, audio) {
        this.scene = scene;
        this.particles = particleSystem;
        this.audio = audio;
        this.props = [];
        this.cansLaunchedCount = 0;
        this.matkasShatteredCount = 0;

        // Shared metal & wood materials
        this.rimMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.92, roughness: 0.18 });
        this.woodMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.85 });
        this.clayMat = new THREE.MeshStandardMaterial({ color: 0xc2410c, roughness: 0.8 });
        this.steelMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.9, roughness: 0.15 });
        this.redCapMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.35, metalness: 0.1 });

        // Initialize high-detail authentic textures
        this.initProceduralTextures();
    }

    initProceduralTextures() {
        // --- 1. FRONT FACE: Authentic 15-Liter Mustard Oil Tin Canister (Sarson Ka Tel) ---
        const fCanvas = document.createElement('canvas');
        fCanvas.width = 512;
        fCanvas.height = 512;
        const fCtx = fCanvas.getContext('2d');

        // Mustard Yellow Tinplate Gradient
        const fGrad = fCtx.createLinearGradient(0, 0, 512, 512);
        fGrad.addColorStop(0, '#f59e0b');
        fGrad.addColorStop(0.5, '#fbbf24');
        fGrad.addColorStop(1, '#d97706');
        fCtx.fillStyle = fGrad;
        fCtx.fillRect(0, 0, 512, 512);

        // Heavy Crimson Red Outer Border
        fCtx.strokeStyle = '#991b1b';
        fCtx.lineWidth = 16;
        fCtx.strokeRect(12, 12, 488, 488);

        // Inner Gold & White Inlines
        fCtx.strokeStyle = '#ffffff';
        fCtx.lineWidth = 2.5;
        fCtx.strokeRect(26, 26, 460, 460);

        fCtx.strokeStyle = '#991b1b';
        fCtx.lineWidth = 2;
        fCtx.strokeRect(32, 32, 448, 448);

        // Top Arc Ribbon: 100% PURE AGMARK
        fCtx.fillStyle = '#991b1b';
        fCtx.beginPath();
        fCtx.roundRect(110, 46, 292, 34, 17);
        fCtx.fill();
        fCtx.fillStyle = '#fef08a';
        fCtx.font = 'bold 15px system-ui, sans-serif';
        fCtx.textAlign = 'center';
        fCtx.fillText('★ 100% SHUDDH • AGMARK ★', 256, 69);

        // Bold Vintage Hindi Title: सरसों का तेल
        fCtx.fillStyle = '#7f1d1d';
        fCtx.font = '900 52px serif, "Times New Roman"';
        fCtx.shadowColor = 'rgba(0,0,0,0.3)';
        fCtx.shadowBlur = 6;
        fCtx.shadowOffsetY = 3;
        fCtx.fillText('सरसों का तेल', 256, 142);
        fCtx.shadowBlur = 0;
        fCtx.shadowOffsetY = 0;

        // English Subtitle
        fCtx.fillStyle = '#1e293b';
        fCtx.font = 'bold 22px system-ui, sans-serif';
        fCtx.fillText('PURE MUSTARD SEED OIL', 256, 176);

        // Center Emblem (Golden Mustard Flower Crest & Diya)
        fCtx.fillStyle = '#b45309';
        fCtx.beginPath();
        fCtx.arc(256, 260, 68, 0, Math.PI * 2);
        fCtx.fill();
        fCtx.strokeStyle = '#fef08a';
        fCtx.lineWidth = 4;
        fCtx.stroke();

        fCtx.fillStyle = '#ffffff';
        fCtx.font = '42px sans-serif';
        fCtx.fillText('🪔', 256, 276);

        // Brand Name: KISAN BRAND
        fCtx.fillStyle = '#991b1b';
        fCtx.font = '900 28px system-ui, sans-serif';
        fCtx.fillText('★ KISAN BRAND ★', 256, 362);

        // Net Volume & Grade Box
        fCtx.fillStyle = '#1e293b';
        fCtx.fillRect(70, 386, 372, 44);
        fCtx.fillStyle = '#facc15';
        fCtx.font = 'bold 18px monospace, sans-serif';
        fCtx.fillText('NET: 15 LITRE / 15 KG NETT', 256, 414);

        // Fun Diwali Dhamaka stamp
        fCtx.fillStyle = '#dc2626';
        fCtx.font = 'bold 13px system-ui, sans-serif';
        fCtx.fillText('💥 DIWALI SPECIAL • HIGH LAUNCH BLAST PROOF 💥', 256, 458);

        this.dabbaFrontTex = new THREE.CanvasTexture(fCanvas);
        this.dabbaFrontTex.anisotropy = 4;
        this.dabbaFrontMat = new THREE.MeshStandardMaterial({
            map: this.dabbaFrontTex,
            metalness: 0.65,
            roughness: 0.28
        });

        // --- 2. BACK FACE: Shuddh Desi Ghee ---
        const bCanvas = document.createElement('canvas');
        bCanvas.width = 512;
        bCanvas.height = 512;
        const bCtx = bCanvas.getContext('2d');

        const bGrad = bCtx.createLinearGradient(0, 0, 512, 512);
        bGrad.addColorStop(0, '#fef08a');
        bGrad.addColorStop(0.5, '#fde047');
        bGrad.addColorStop(1, '#eab308');
        bCtx.fillStyle = bGrad;
        bCtx.fillRect(0, 0, 512, 512);

        bCtx.strokeStyle = '#15803d';
        bCtx.lineWidth = 16;
        bCtx.strokeRect(12, 12, 488, 488);

        bCtx.strokeStyle = '#ffffff';
        bCtx.lineWidth = 3;
        bCtx.strokeRect(26, 26, 460, 460);

        bCtx.fillStyle = '#15803d';
        bCtx.font = '900 48px serif';
        bCtx.textAlign = 'center';
        bCtx.fillText('शुद्ध देशी घी', 256, 140);

        bCtx.fillStyle = '#1f2937';
        bCtx.font = 'bold 22px system-ui, sans-serif';
        bCtx.fillText('TRADITIONAL DESI COW GHEE', 256, 175);

        // Center Diya emblem
        bCtx.fillStyle = '#166534';
        bCtx.beginPath();
        bCtx.arc(256, 260, 65, 0, Math.PI * 2);
        bCtx.fill();
        bCtx.fillStyle = '#ffffff';
        bCtx.font = '40px sans-serif';
        bCtx.fillText('✨', 256, 275);

        bCtx.fillStyle = '#15803d';
        bCtx.font = '900 26px system-ui, sans-serif';
        bCtx.fillText('★ BRIJ MOHAN GHEE ★', 256, 360);

        bCtx.fillStyle = '#1f2937';
        bCtx.fillRect(80, 390, 352, 44);
        bCtx.fillStyle = '#86efac';
        bCtx.font = 'bold 18px monospace, sans-serif';
        bCtx.fillText('15 LITRE / 13.65 KG NETT', 256, 418);

        this.dabbaBackTex = new THREE.CanvasTexture(bCanvas);
        this.dabbaBackTex.anisotropy = 4;
        this.dabbaBackMat = new THREE.MeshStandardMaterial({
            map: this.dabbaBackTex,
            metalness: 0.65,
            roughness: 0.28
        });

        // --- 3. SIDE FACES: Embossed Cross 'X' Stamping, Nutrition & Agmark Seal ---
        const sCanvas = document.createElement('canvas');
        sCanvas.width = 512;
        sCanvas.height = 512;
        const sCtx = sCanvas.getContext('2d');

        // Tinplate metallic silver base
        const sGrad = sCtx.createLinearGradient(0, 0, 512, 512);
        sGrad.addColorStop(0, '#e2e8f0');
        sGrad.addColorStop(0.5, '#cbd5e1');
        sGrad.addColorStop(1, '#94a3b8');
        sCtx.fillStyle = sGrad;
        sCtx.fillRect(0, 0, 512, 512);

        // Stamped structural cross 'X' ribbing (Signature stiffening rib on all 15L Indian tin canisters)
        sCtx.strokeStyle = 'rgba(71, 85, 105, 0.45)';
        sCtx.lineWidth = 14;
        sCtx.beginPath();
        sCtx.moveTo(40, 40); sCtx.lineTo(472, 472);
        sCtx.moveTo(472, 40); sCtx.lineTo(40, 472);
        sCtx.stroke();

        // White bevel ridge highlight on ribs
        sCtx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        sCtx.lineWidth = 4;
        sCtx.beginPath();
        sCtx.moveTo(38, 38); sCtx.lineTo(470, 470);
        sCtx.moveTo(470, 38); sCtx.lineTo(38, 470);
        sCtx.stroke();

        // Center embossed diamond
        sCtx.fillStyle = 'rgba(203, 213, 225, 0.8)';
        sCtx.beginPath();
        sCtx.moveTo(256, 190); sCtx.lineTo(320, 256); sCtx.lineTo(256, 322); sCtx.lineTo(192, 256);
        sCtx.closePath();
        sCtx.fill();
        sCtx.strokeStyle = 'rgba(71, 85, 105, 0.5)';
        sCtx.lineWidth = 4;
        sCtx.stroke();

        // FSSAI badge
        sCtx.fillStyle = '#1e3a8a';
        sCtx.font = 'bold 20px system-ui, sans-serif';
        sCtx.textAlign = 'center';
        sCtx.fillText('fssai Lic. No: 10014022002568', 256, 75);

        // Nutrition Table Box
        sCtx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        sCtx.fillRect(100, 350, 312, 85);
        sCtx.fillStyle = '#0f172a';
        sCtx.font = '12px monospace';
        sCtx.textAlign = 'left';
        sCtx.fillText('ENERGY: 900 kcal / 100g', 115, 372);
        sCtx.fillText('TOTAL FAT: 100g | CHOLEST: 0mg', 115, 394);
        sCtx.fillText('BATCH: #DWL-2026 • JAIPUR AGRO', 115, 416);

        // Barcode lines
        sCtx.fillStyle = '#0f172a';
        for (let bx = 160; bx < 350; bx += 6) {
            const w = (bx % 12 === 0) ? 4 : 2;
            sCtx.fillRect(bx, 450, w, 28);
        }

        this.dabbaSideTex = new THREE.CanvasTexture(sCanvas);
        this.dabbaSideTex.anisotropy = 4;
        this.dabbaSideMat = new THREE.MeshStandardMaterial({
            map: this.dabbaSideTex,
            metalness: 0.82,
            roughness: 0.22
        });

        // --- 4. TOP FACE: Tinplate with Concentric Stamped Ridges ---
        const tCanvas = document.createElement('canvas');
        tCanvas.width = 256;
        tCanvas.height = 256;
        const tCtx = tCanvas.getContext('2d');
        tCtx.fillStyle = '#cbd5e1';
        tCtx.fillRect(0, 0, 256, 256);
        tCtx.strokeStyle = '#94a3b8';
        tCtx.lineWidth = 4;
        tCtx.beginPath();
        tCtx.arc(128, 128, 80, 0, Math.PI * 2);
        tCtx.arc(128, 128, 55, 0, Math.PI * 2);
        tCtx.arc(128, 128, 30, 0, Math.PI * 2);
        tCtx.stroke();

        this.dabbaTopTex = new THREE.CanvasTexture(tCanvas);
        this.dabbaTopMat = new THREE.MeshStandardMaterial({
            map: this.dabbaTopTex,
            metalness: 0.85,
            roughness: 0.2
        });

        // Bottom Mat
        this.dabbaBotMat = new THREE.MeshStandardMaterial({
            color: 0x94a3b8,
            metalness: 0.88,
            roughness: 0.25
        });

        // Combined 6-face materials array for Big Dabba Box
        // [+X, -X, +Y, -Y, +Z, -Z]
        this.dabbaMultiMat = [
            this.dabbaSideMat, // Right
            this.dabbaSideMat, // Left
            this.dabbaTopMat,  // Top
            this.dabbaBotMat,  // Bottom
            this.dabbaFrontMat,// Front (Sarson Ka Tel)
            this.dabbaBackMat  // Back (Desi Ghee)
        ];

        // --- 5. SMALL BEVERAGE CANS (Pyramid Cans) ---
        // Brand 1: Frooti Mango Fizz (Yellow/Green)
        // Brand 2: Thums Up Toofani (Navy Blue/Red)
        // Brand 3: Rooh Afza Rose Tin (Ruby Red/Gold)
        this.canMaterials = [
            this.createCanTextureMaterial('frooti'),
            this.createCanTextureMaterial('thumsup'),
            this.createCanTextureMaterial('roohafza')
        ];

        // --- 6. AUTHENTIC 14.2 KG BHARAT/INDANE LPG GAS CYLINDER ---
        const cylCanvas = document.createElement('canvas');
        cylCanvas.width = 512;
        cylCanvas.height = 512;
        const cCtx = cylCanvas.getContext('2d');

        // High gloss safety red gradient
        const cylGrad = cCtx.createLinearGradient(0, 0, 512, 0);
        cylGrad.addColorStop(0, '#991b1b');
        cylGrad.addColorStop(0.2, '#dc2626');
        cylGrad.addColorStop(0.5, '#ef4444');
        cylGrad.addColorStop(0.8, '#dc2626');
        cylGrad.addColorStop(1, '#7f1d1d');
        cCtx.fillStyle = cylGrad;
        cCtx.fillRect(0, 0, 512, 512);

        // Welded horizontal belly seam
        cCtx.fillStyle = '#7f1d1d';
        cCtx.fillRect(0, 252, 512, 8);
        cCtx.fillStyle = '#f87171';
        cCtx.fillRect(0, 254, 512, 3);

        // Stencil White markings
        cCtx.fillStyle = '#f8fafc';
        cCtx.textAlign = 'center';

        // Top Brand Arc / Text
        cCtx.font = '900 32px system-ui, sans-serif';
        cCtx.fillText('★ BHARAT GAS ★', 256, 85);

        cCtx.font = 'bold 16px system-ui, sans-serif';
        cCtx.fillStyle = '#fef08a';
        cCtx.fillText('FOR DOMESTIC USE ONLY', 256, 118);

        // Giant 14.2 kg Stencil
        cCtx.fillStyle = '#ffffff';
        cCtx.font = '900 84px Impact, system-ui, sans-serif';
        cCtx.fillText('14.2 kg', 256, 215);

        // Weights Tare & Gross
        cCtx.font = 'bold 19px system-ui, monospace';
        cCtx.fillStyle = '#f1f5f9';
        cCtx.fillText('NET 14.2 kg | GROSS 29.8 kg', 256, 305);

        // Danger Warning Box with Flame symbol
        cCtx.strokeStyle = '#fef08a';
        cCtx.lineWidth = 4;
        cCtx.strokeRect(36, 335, 440, 130);

        cCtx.fillStyle = '#fef08a';
        cCtx.font = '900 23px system-ui, sans-serif';
        cCtx.fillText('⚠️ अत्यधिक ज्वलनशील / KHATRA ⚠️', 256, 375);

        cCtx.font = 'bold 19px system-ui, sans-serif';
        cCtx.fillStyle = '#ffffff';
        cCtx.fillText('🔥 HIGHLY FLAMMABLE LPG 🔥', 256, 412);
        cCtx.font = 'bold 16px system-ui, sans-serif';
        cCtx.fillStyle = '#fef08a';
        cCtx.fillText('DIWALI HAI, DIWALA NAHI NIKALNA! 💀', 256, 445);

        this.cylinderTex = new THREE.CanvasTexture(cylCanvas);
        this.cylinderTex.anisotropy = 4;
        this.cylinderMat = new THREE.MeshStandardMaterial({
            map: this.cylinderTex,
            roughness: 0.28,
            metalness: 0.42
        });

        this.cylinderBodyMat = new THREE.MeshStandardMaterial({
            color: 0xdc2626,
            roughness: 0.32,
            metalness: 0.38
        });
        this.cylinderBrassMat = new THREE.MeshStandardMaterial({
            color: 0xeab308,
            metalness: 0.92,
            roughness: 0.18
        });
    }

    createCanTextureMaterial(type) {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        if (type === 'frooti') {
            ctx.fillStyle = '#facc15';
            ctx.fillRect(0, 0, 256, 256);
            ctx.fillStyle = '#15803d';
            ctx.fillRect(0, 40, 256, 35);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 22px system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('FROOTI', 128, 66);
            ctx.fillStyle = '#b45309';
            ctx.font = 'bold 16px system-ui, sans-serif';
            ctx.fillText('MANGO FIZZ', 128, 140);
            ctx.font = '40px sans-serif';
            ctx.fillText('🥭', 128, 195);
        } else if (type === 'thumsup') {
            ctx.fillStyle = '#1e3a8a';
            ctx.fillRect(0, 0, 256, 256);
            ctx.fillStyle = '#dc2626';
            ctx.fillRect(0, 45, 256, 32);
            ctx.fillStyle = '#ffffff';
            ctx.font = '900 20px system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('THUMS UP', 128, 69);
            ctx.fillStyle = '#facc15';
            ctx.font = 'bold 15px system-ui, sans-serif';
            ctx.fillText('⚡ TASTE THE THUNDER ⚡', 128, 140);
            ctx.font = '36px sans-serif';
            ctx.fillText('🥤', 128, 195);
        } else {
            ctx.fillStyle = '#be123c';
            ctx.fillRect(0, 0, 256, 256);
            ctx.fillStyle = '#fbbf24';
            ctx.fillRect(0, 45, 256, 28);
            ctx.fillStyle = '#881337';
            ctx.font = 'bold 20px serif';
            ctx.textAlign = 'center';
            ctx.fillText('ROOH AFZA', 128, 67);
            ctx.fillStyle = '#fef08a';
            ctx.font = 'bold 15px system-ui, sans-serif';
            ctx.fillText('ROYAL ROSE SHARBAT', 128, 140);
            ctx.font = '36px sans-serif';
            ctx.fillText('🌹', 128, 195);
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.anisotropy = 4;
        return new THREE.MeshStandardMaterial({
            map: tex,
            metalness: 0.72,
            roughness: 0.26
        });
    }

    createProp(type, pos) {
        const group = new THREE.Group();
        let radius = 0.5;
        let halfHeight = 0.6;
        let mass = 1.0;

        if (type === 'can') {
            // Realistic Desi Drink Tin Can with Pull Tab
            const chosen = this.canMaterials[Math.floor(Math.random() * this.canMaterials.length)];

            const body = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 1.15, 20), chosen);
            body.castShadow = true;
            body.receiveShadow = true;
            group.add(body);

            // Stamped Top Rim Flange
            const topRim = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.08, 20), this.rimMat);
            topRim.position.y = 0.58;
            group.add(topRim);

            // Realistic Pull Tab Ring on top
            const tabRing = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.02, 6, 12), this.rimMat);
            tabRing.position.set(0.12, 0.62, 0.05);
            tabRing.rotation.x = -Math.PI / 2;
            group.add(tabRing);

            // Stamped Bottom Rim Flange
            const botRim = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.08, 20), this.rimMat);
            botRim.position.y = -0.58;
            group.add(botRim);

            radius = 0.46;
            halfHeight = 0.60;
            mass = 0.65;

        } else if (type === 'big_dabba') {
            // Authentic 15-Liter Mustard Oil / Ghee Tin Canister (The Legendary Desi Peepa!)
            // Realistic proportions: 1.25m wide, 1.80m tall, 1.25m deep
            const box = new THREE.Mesh(new THREE.BoxGeometry(1.25, 1.78, 1.25), this.dabbaMultiMat);
            box.castShadow = true;
            box.receiveShadow = true;
            group.add(box);

            // Stamped Top and Bottom Crimped Rim Flanges
            const topFlange = new THREE.Mesh(new THREE.BoxGeometry(1.30, 0.08, 1.30), this.rimMat);
            topFlange.position.y = 0.89;
            group.add(topFlange);

            const botFlange = new THREE.Mesh(new THREE.BoxGeometry(1.30, 0.08, 1.30), this.rimMat);
            botFlange.position.y = -0.89;
            group.add(botFlange);

            // Stamped Corner Edge Ribs
            const cornerMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.3 });
            [[-0.625, -0.625], [-0.625, 0.625], [0.625, -0.625], [0.625, 0.625]].forEach(([cx, cz]) => {
                const corner = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.76, 0.05), cornerMat);
                corner.position.set(cx, 0, cz);
                group.add(corner);
            });

            // Cylindrical Bung Spout with Threaded Red Cap
            const bungNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.14, 16), this.rimMat);
            bungNeck.position.set(0.35, 0.96, 0.35);
            group.add(bungNeck);

            const bungCap = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.20, 0.08, 16), this.redCapMat);
            bungCap.position.set(0.35, 1.05, 0.35);
            group.add(bungCap);

            // Metal Wire Bail Handle with Red Wooden/Plastic Grip
            const earGeo = new THREE.BoxGeometry(0.08, 0.16, 0.12);
            const leftEar = new THREE.Mesh(earGeo, this.rimMat);
            leftEar.position.set(-0.64, 0.82, 0);
            group.add(leftEar);

            const rightEar = new THREE.Mesh(earGeo, this.rimMat);
            rightEar.position.set(0.64, 0.82, 0);
            group.add(rightEar);

            const wireCurve = new THREE.TorusGeometry(0.50, 0.038, 8, 24, Math.PI);
            const wireArch = new THREE.Mesh(wireCurve, this.rimMat);
            wireArch.position.set(0, 0.94, 0);
            group.add(wireArch);

            const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.38, 12), this.redCapMat);
            grip.position.set(0, 1.44, 0);
            grip.rotation.z = Math.PI / 2;
            group.add(grip);

            // Hollow Bottom Inner Cap so Bomb Fits Inside
            const hollowBase = new THREE.Mesh(
                new THREE.PlaneGeometry(1.18, 1.18),
                new THREE.MeshBasicMaterial({ color: 0x09090b })
            );
            hollowBase.rotation.x = Math.PI / 2;
            hollowBase.position.y = -0.88;
            group.add(hollowBase);

            radius = 0.76;
            halfHeight = 0.92;
            mass = 0.72; // Perfectly tuned to launch 40+ units into the sky!

        } else if (type === 'matka') {
            // Terracotta Ghada / Clay Pot (Can shatter completely!)
            const belly = new THREE.Mesh(new THREE.SphereGeometry(0.62, 14, 12), this.clayMat);
            belly.castShadow = true;
            belly.receiveShadow = true;
            group.add(belly);

            const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.24, 0.35, 12), this.clayMat);
            neck.position.y = 0.58;
            group.add(neck);

            radius = 0.62;
            halfHeight = 0.62;
            mass = 1.1;

        } else if (type === 'crate') {
            // Wooden Peti
            const cube = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), this.woodMat);
            cube.castShadow = true;
            cube.receiveShadow = true;
            group.add(cube);

            const band = new THREE.Mesh(
                new THREE.BoxGeometry(1.24, 0.2, 1.24),
                new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 })
            );
            group.add(band);

            radius = 0.7;
            halfHeight = 0.6;
            mass = 1.6;

        } else if (type === 'thali') {
            // Steel Thali (Large Indian plate that vibrates & clangs)
            const dish = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 0.9, 0.12, 24), this.steelMat);
            dish.castShadow = true;
            dish.receiveShadow = true;
            group.add(dish);

            radius = 1.1;
            halfHeight = 0.1;
            mass = 0.8;

        } else if (type === 'gas_cylinder') {
            // Authentic 14.2 KG Domestic LPG Gas Cylinder (Bharat/Indane Red)
            // Center main cylindrical body with 14.2 KG stencil texture
            const body = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 1.15, 32), this.cylinderMat);
            body.castShadow = true;
            body.receiveShadow = true;
            group.add(body);

            // Upper Hemispherical Dome
            const topDome = new THREE.Mesh(
                new THREE.SphereGeometry(0.52, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
                this.cylinderBodyMat
            );
            topDome.position.y = 0.575;
            topDome.castShadow = true;
            group.add(topDome);

            // Lower Hemispherical Dome
            const botDome = new THREE.Mesh(
                new THREE.SphereGeometry(0.52, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2),
                this.cylinderBodyMat
            );
            botDome.position.y = -0.575;
            botDome.castShadow = true;
            group.add(botDome);

            // Welded Center Belly Seam Ring
            const bellySeam = new THREE.Mesh(
                new THREE.TorusGeometry(0.526, 0.016, 8, 32),
                this.cylinderBodyMat
            );
            bellySeam.rotation.x = Math.PI / 2;
            group.add(bellySeam);

            // Perforated Bottom Foot Ring Stand
            const footRing = new THREE.Mesh(
                new THREE.CylinderGeometry(0.46, 0.46, 0.24, 24, 1, true),
                this.cylinderBodyMat
            );
            footRing.position.y = -0.72;
            footRing.castShadow = true;
            group.add(footRing);

            // Foot Ring Bottom Rim Edge
            const footEdge = new THREE.Mesh(
                new THREE.TorusGeometry(0.46, 0.02, 8, 24),
                this.cylinderBodyMat
            );
            footEdge.rotation.x = Math.PI / 2;
            footEdge.position.y = -0.84;
            group.add(footEdge);

            // Top Collar Handle Guard Ring
            const collarRing = new THREE.Mesh(
                new THREE.CylinderGeometry(0.40, 0.40, 0.36, 24, 1, true),
                this.cylinderBodyMat
            );
            collarRing.position.y = 0.92;
            collarRing.castShadow = true;
            group.add(collarRing);

            const collarTopEdge = new THREE.Mesh(
                new THREE.TorusGeometry(0.40, 0.022, 8, 24),
                this.cylinderBodyMat
            );
            collarTopEdge.rotation.x = Math.PI / 2;
            collarTopEdge.position.y = 1.10;
            group.add(collarTopEdge);

            // 3 Handle Vertical Stays (connecting top dome to collar)
            for (let i = 0; i < 3; i++) {
                const angle = (i * Math.PI * 2) / 3;
                const stay = new THREE.Mesh(
                    new THREE.BoxGeometry(0.06, 0.38, 0.028),
                    this.cylinderBodyMat
                );
                stay.position.set(Math.cos(angle) * 0.40, 0.92, Math.sin(angle) * 0.40);
                stay.rotation.y = -angle;
                group.add(stay);
            }

            // Stamped Inspection Code (D-26) on collar front
            const stampCanvas = document.createElement('canvas');
            stampCanvas.width = 128;
            stampCanvas.height = 64;
            const sCtx = stampCanvas.getContext('2d');
            sCtx.fillStyle = '#b91c1c';
            sCtx.fillRect(0, 0, 128, 64);
            sCtx.fillStyle = '#ffffff';
            sCtx.font = 'bold 36px monospace';
            sCtx.textAlign = 'center';
            sCtx.fillText('D-26', 64, 46);
            const stampTex = new THREE.CanvasTexture(stampCanvas);
            const stampPlate = new THREE.Mesh(
                new THREE.PlaneGeometry(0.22, 0.11),
                new THREE.MeshBasicMaterial({ map: stampTex })
            );
            stampPlate.position.set(0, 0.95, 0.41);
            group.add(stampPlate);

            // Brass Pressure Relief Valve Nozzle in center
            const valve = new THREE.Mesh(
                new THREE.CylinderGeometry(0.07, 0.07, 0.20, 16),
                this.cylinderBrassMat
            );
            valve.position.y = 0.78;
            group.add(valve);

            // Yellow Safety Seal Plastic Cap on Valve
            const safetyCap = new THREE.Mesh(
                new THREE.CylinderGeometry(0.08, 0.08, 0.09, 16),
                new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 })
            );
            safetyCap.position.y = 0.86;
            group.add(safetyCap);

            // Red Emergency Danger Beacon Diode on top
            const beacon = new THREE.Mesh(
                new THREE.SphereGeometry(0.05, 12, 12),
                new THREE.MeshBasicMaterial({ color: 0xff0000 })
            );
            beacon.position.y = 0.96;
            beacon.name = 'cylinder_beacon';
            group.add(beacon);

            radius = 0.58;
            halfHeight = 0.95;
            mass = 4.2;

            group.userData = {
                type: 'gas_cylinder',
                isGasCylinder: true,
                warningTriggered: false
            };
        }

        group.position.copy(pos);
        this.scene.add(group);

        const propObj = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            mesh: group,
            vel: new THREE.Vector3(0, 0, 0),
            angVel: new THREE.Vector3(0, 0, 0),
            radius,
            halfHeight,
            mass,
            airborne: false,
            destroyed: false,
            isStatic: false
        };

        this.props.push(propObj);
        return propObj;
    }

    shatterMatka(prop) {
        if (prop.destroyed) return;
        prop.destroyed = true;
        prop.isStatic = false;

        const pos = prop.mesh.position.clone();

        // 1. Spawn clay shards with physics velocity
        for (let i = 0; i < 22; i++) {
            const vel = new THREE.Vector3(
                (Math.random() - 0.5) * 16,
                5 + Math.random() * 12,
                (Math.random() - 0.5) * 16
            );
            this.particles.spawnShard(pos, vel, 0xc2410c, 0.8 + Math.random() * 0.6, 2.0);
        }

        // 2. Terracotta dust cloud
        for (let i = 0; i < 8; i++) {
            const dVel = new THREE.Vector3(
                (Math.random() - 0.5) * 4,
                1.5 + Math.random() * 3,
                (Math.random() - 0.5) * 4
            );
            this.particles.spawnSmoke(pos, dVel, 0x9a3412, 0.5, 0.7, 1.6, 1.4);
        }

        this.audio.playMatkaShatter();
        this.matkasShatteredCount++;

        // Remove from scene and active list
        this.scene.remove(prop.mesh);
        const idx = this.props.indexOf(prop);
        if (idx !== -1) {
            this.props.splice(idx, 1);
        }
    }

    applyImpulse(prop, impulseVec) {
        prop.isStatic = false; // Wakes up immediately upon any blast impulse
        prop.vel.addScaledVector(impulseVec, 1 / prop.mass);
        prop.angVel.set(
            (Math.random() - 0.5) * 22,
            (Math.random() - 0.5) * 22,
            (Math.random() - 0.5) * 22
        );
        if (!prop.airborne) {
            prop.airborne = true;
            this.cansLaunchedCount++;
        }
    }

    spawnPyramid(centerX = 0, centerZ = -2.5) {
        // Clear some excess props if arena has more than 35 props to maintain smooth 60 FPS
        if (this.props.length > 35) {
            while (this.props.length > 15) {
                const p = this.props.shift();
                this.scene.remove(p.mesh);
            }
        }

        const canHeight = 1.18;
        const spacing = 0.96; // snug fit for authentic drink cans
        // 4-tier pyramid structure exclusively built with vibrant beverage cans
        for (let row = 0; row < 4; row++) {
            const count = 4 - row;
            const y = 0.60 + row * canHeight;
            const startX = centerX - ((count - 1) * spacing) / 2;

            for (let i = 0; i < count; i++) {
                const prop = this.createProp('can', new THREE.Vector3(
                    startX + i * spacing,
                    y,
                    centerZ
                ));
                prop.isStatic = true; // Stays solidly stacked until hit by explosion!
            }
        }

        // Top cap: Terracotta Matka
        const matka = this.createProp('matka', new THREE.Vector3(centerX, 0.60 + 4 * canHeight + 0.1, centerZ));
        matka.isStatic = true;
        this.audio.playMetallicClang(0.8);
    }

    spawnGasCylinder(centerX = -3.2, centerZ = 1.5) {
        // Remove existing gas cylinder if any
        for (let i = this.props.length - 1; i >= 0; i--) {
            if (this.props[i].type === 'gas_cylinder') {
                this.scene.remove(this.props[i].mesh);
                this.props.splice(i, 1);
            }
        }
        return this.createProp('gas_cylinder', new THREE.Vector3(centerX, 0.95, centerZ));
    }

    spawnDabbaOverSpot(spotPos) {
        const dabba = this.createProp('big_dabba', new THREE.Vector3(spotPos.x, 0.94, spotPos.z));
        this.audio.playMetallicClang(1.2);
        return dabba;
    }

    clear() {
        for (const p of this.props) {
            this.scene.remove(p.mesh);
        }
        this.props = [];
    }

    update(dt) {
        const gravity = -24; // snappier physical drop
        const floorY = 0;

        for (let i = this.props.length - 1; i >= 0; i--) {
            const prop = this.props[i];
            if (prop.isStatic) {
                // Standing stably in stacked pyramid formation
                continue;
            }

            // 1. Gravity & Movement
            prop.vel.y += gravity * dt;
            prop.mesh.position.addScaledVector(prop.vel, dt);

            // 2. Angular Rotation
            prop.mesh.rotation.x += prop.angVel.x * dt;
            prop.mesh.rotation.y += prop.angVel.y * dt;
            prop.mesh.rotation.z += prop.angVel.z * dt;

            // 3. Floor Collision
            const bottomY = prop.mesh.position.y - prop.halfHeight;
            if (bottomY < floorY) {
                prop.mesh.position.y = floorY + prop.halfHeight;

                if (prop.vel.y < -2.4) {
                    if (prop.type === 'can' || prop.type === 'big_dabba' || prop.type === 'thali' || prop.type === 'gas_cylinder') {
                        this.audio.playMetallicClang(Math.min(1.5, Math.abs(prop.vel.y) * 0.1));
                    }
                    prop.vel.y = -prop.vel.y * 0.42;
                    prop.vel.x *= 0.78;
                    prop.vel.z *= 0.78;
                } else {
                    prop.vel.y = 0;
                    prop.vel.x *= 0.90;
                    prop.vel.z *= 0.90;
                }

                // Dampen spin on ground
                prop.angVel.multiplyScalar(0.85);

                if (prop.airborne && prop.vel.lengthSq() < 0.2) {
                    prop.airborne = false;
                }
            }

            // Boundary containment
            if (Math.abs(prop.mesh.position.x) > 28 || Math.abs(prop.mesh.position.z) > 28) {
                this.scene.remove(prop.mesh);
                this.props.splice(i, 1);
            }
        }
    }
}

window.PropsEngine = PropsEngine;
