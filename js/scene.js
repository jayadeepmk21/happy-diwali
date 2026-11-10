/**
 * Courtyard Scene, Festive Environment & Multi-Touch Camera Controller
 * Fully responsive for Mobile Touch (Pinch Zoom, Orbit, Pan) and Laptop (Mouse, Keyboard, Wheel).
 */

class CourtyardScene {
    constructor(container) {
        this.container = container;
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x06050e);
        this.scene.fog = new THREE.FogExp2(0x06050e, 0.0042);

        this.camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 350);

        // Optimal mobile & desktop renderer (Cap DPR to 1.0 on mobile, 1.5 on desktop for rock-solid 60 FPS)
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || 
                         window.innerWidth < 768 || 
                         (navigator.deviceMemory && navigator.deviceMemory <= 4);
        this.isMobile = isMobile;
        const maxDpr = isMobile ? 1.0 : 1.5;

        this.renderer = new THREE.WebGLRenderer({
            antialias: !isMobile,
            powerPreference: 'high-performance',
            precision: isMobile ? 'mediump' : 'highp',
            stencil: false,
            depth: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = isMobile ? THREE.BasicShadowMap : THREE.PCFSoftShadowMap;

        // Cinematic Filmic Color & Tone Pipeline (Crisp, vibrant, rich night highlights)
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.18;

        // Context loss protection for low-memory mobile hardware
        this.contextLost = false;
        this.renderer.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            this.contextLost = true;
            console.warn('WebGL context lost - Pausing rendering to conserve mobile memory.');
        }, false);
        this.renderer.domElement.addEventListener('webglcontextrestored', () => {
            this.contextLost = false;
            console.log('WebGL context restored - Resuming rendering.');
        }, false);

        this.container.appendChild(this.renderer.domElement);

        // Orbit & Camera state
        this.camState = {
            theta: 0.58,
            phi: 1.1,
            radius: isMobile ? 30 : 25,
            target: new THREE.Vector3(0, 1.4, 0),
            shakeIntensity: 0,
            autoRotate: false,
            // Touch & Mouse tracking
            isDragging: false,
            dragDistance: 0,
            prevX: 0,
            prevY: 0,
            pinchStartDist: 0,
            touchCount: 0
        };

        this.diyaFlames = [];
        this.kandils = [];
        this.distantFireworks = [];
        this.skyLanterns = [];
        this.streetLamps = [];
        this.currentTheme = 'night';

        this.initLighting();
        this.initCourtyard();
        this.initStreetLamps();
        this.initTargetZone();
        this.initDistantFireworks();
        this.initPlacementCursor();
        this.bindInputEvents();
        this.updateCameraPosition();
    }

    initLighting() {
        // Warm Festive Ambient Night Light (vivid baseline illumination)
        this.ambientLight = new THREE.AmbientLight(0x38304c, 1.45);
        this.scene.add(this.ambientLight);

        // Soft Moon Light with soft shadows
        this.moonLight = new THREE.DirectionalLight(0xa5c4f5, 0.85);
        this.moonLight.position.set(30, 48, -22);
        this.moonLight.castShadow = true;
        this.moonLight.shadow.mapSize.width = this.isMobile ? 512 : 1024;
        this.moonLight.shadow.mapSize.height = this.isMobile ? 512 : 1024;
        this.moonLight.shadow.camera.near = 5;
        this.moonLight.shadow.camera.far = 110;
        const d = 32;
        this.moonLight.shadow.camera.left = -d;
        this.moonLight.shadow.camera.right = d;
        this.moonLight.shadow.camera.top = d;
        this.moonLight.shadow.camera.bottom = -d;
        this.scene.add(this.moonLight);

        // Warm Festive Courtyard Center Glow
        this.centerWarm = new THREE.PointLight(0xf59e0b, 1.35, 52);
        this.centerWarm.position.set(0, 4.8, 0);
        this.scene.add(this.centerWarm);

        // Warm Festive Perimeter Haveli Washes (3 soft golden accent lights for North, East, West facades)
        this.northWarm = new THREE.PointLight(0xffa233, 1.45, 46);
        this.northWarm.position.set(0, 8.5, -28);
        this.scene.add(this.northWarm);

        this.westWarm = new THREE.PointLight(0xffa233, 1.2, 40);
        this.westWarm.position.set(-28, 7.5, 2);
        this.scene.add(this.westWarm);

        this.eastWarm = new THREE.PointLight(0xffa233, 1.2, 40);
        this.eastWarm.position.set(28, 7.5, 2);
        this.scene.add(this.eastWarm);
    }

    setEnvironmentTheme(theme) {
        this.currentTheme = theme;
        if (theme === 'sunset') {
            this.scene.background.setHex(0x2a111a);
            this.scene.fog.color.setHex(0x2a111a);
            this.ambientLight.color.setHex(0x602636);
            this.moonLight.color.setHex(0xfb923c);
            this.centerWarm.color.setHex(0xf59e0b);
            if (this.northWarm) this.northWarm.color.setHex(0xfb923c);
            if (this.westWarm) this.westWarm.color.setHex(0xfb923c);
            if (this.eastWarm) this.eastWarm.color.setHex(0xfb923c);
            if (this.streetLamps) {
                this.streetLamps.forEach(l => {
                    l.spotLight.intensity = 2.4;
                });
            }
        } else {
            this.scene.background.setHex(0x06050e);
            this.scene.fog.color.setHex(0x06050e);
            this.ambientLight.color.setHex(0x38304c);
            this.moonLight.color.setHex(0xa5c4f5);
            this.centerWarm.color.setHex(0xf59e0b);
            if (this.northWarm) this.northWarm.color.setHex(0xffa233);
            if (this.westWarm) this.westWarm.color.setHex(0xffa233);
            if (this.eastWarm) this.eastWarm.color.setHex(0xffa233);
            if (this.streetLamps) {
                this.streetLamps.forEach(l => {
                    l.spotLight.intensity = 3.4;
                });
            }
        }
    }

    initTargetZone() {
        const ringGeo = new THREE.RingGeometry(4.8, 5.2, 48);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0xef4444,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.75
        });
        this.targetZoneMesh = new THREE.Mesh(ringGeo, ringMat);
        this.targetZoneMesh.rotation.x = -Math.PI / 2;
        this.targetZoneMesh.position.set(0, 0.025, -2.5);
        this.targetZoneMesh.visible = false;
        this.scene.add(this.targetZoneMesh);
    }

    showTargetZone(visible) {
        if (this.targetZoneMesh) {
            this.targetZoneMesh.visible = visible;
        }
    }

    spawnSkyLantern(pos) {
        if (this.skyLanterns.length >= (this.isMobile ? 8 : 16)) {
            const old = this.skyLanterns.shift();
            this.scene.remove(old.group);
            old.group.traverse(c => {
                if (c.geometry) c.geometry.dispose();
                if (c.material) c.material.dispose();
            });
        }

        const group = new THREE.Group();
        const paperMat = new THREE.MeshStandardMaterial({
            color: 0xf59e0b,
            emissive: 0xf59e0b,
            emissiveIntensity: 0.6,
            roughness: 0.4,
            transparent: true,
            opacity: 0.88
        });

        // Cylinder body tapering towards base
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.38, 1.2, 14), paperMat);
        body.position.y = 0.6;
        group.add(body);

        // Top dome
        const dome = new THREE.Mesh(new THREE.SphereGeometry(0.55, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), paperMat);
        dome.position.y = 1.2;
        group.add(dome);

        // Inner glowing flame (emissive & bright unlit mesh)
        const flame = new THREE.Mesh(
            new THREE.SphereGeometry(0.14, 8, 8),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        flame.position.y = 0.25;
        group.add(flame);

        group.position.copy(pos);
        this.scene.add(group);

        this.skyLanterns.push({
            group,
            velY: 2.2 + Math.random() * 1.2,
            driftX: (Math.random() - 0.5) * 0.8,
            driftZ: (Math.random() - 0.5) * 0.8,
            phase: Math.random() * Math.PI * 2
        });
    }

    createRealisticMohallaFloorTextures() {
        const size = 2048;
        const bumpSize = 1024;
        const renderScale = this.isMobile ? 0.5 : 1.0;

        const canvas = document.createElement('canvas');
        canvas.width = Math.round(size * renderScale);
        canvas.height = Math.round(size * renderScale);
        const ctx = canvas.getContext('2d');
        if (renderScale !== 1.0) {
            ctx.scale(renderScale, renderScale);
        }

        // High-precision Bump Canvas
        const bumpCanvas = document.createElement('canvas');
        bumpCanvas.width = Math.round(bumpSize * renderScale);
        bumpCanvas.height = Math.round(bumpSize * renderScale);
        const bCtx = bumpCanvas.getContext('2d');
        if (renderScale !== 1.0) {
            bCtx.scale(renderScale, renderScale);
        }

        // 1. Dark Mortar Grout Base
        ctx.fillStyle = '#0c0a15';
        ctx.fillRect(0, 0, size, size);

        bCtx.fillStyle = '#050505';
        bCtx.fillRect(0, 0, bumpSize, bumpSize);

        // 2. Realistic Staggered Flagstone Pavers (Kota Slate / Indian Paving)
        const rowHeight = 44;
        const rows = Math.ceil(size / rowHeight);
        const stonePalettes = [
            '#1b1828', '#221e33', '#28243c', '#1d192c',
            '#252136', '#2b273f', '#1f1b2f', '#242038'
        ];

        let seed = 98765;
        const rng = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
        const bScale = bumpSize / size;

        for (let r = 0; r < rows; r++) {
            const y = r * rowHeight;
            const rowOffset = (r % 2 === 0) ? 0 : 45;
            let x = -rowOffset - 40;

            while (x < size + 60) {
                const stoneWidth = Math.floor(70 + rng() * 60);
                const gap = 4;
                const stoneX = x + gap;
                const stoneY = y + gap;
                const stoneW = stoneWidth - gap * 2;
                const stoneH = rowHeight - gap * 2;

                if (stoneW > 8 && stoneH > 8) {
                    const color = stonePalettes[Math.floor(rng() * stonePalettes.length)];

                    // Draw diffuse paver
                    ctx.fillStyle = color;
                    ctx.fillRect(stoneX, stoneY, stoneW, stoneH);

                    // Subtle top-left stone bevel highlight
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
                    ctx.lineWidth = 1.5;
                    ctx.strokeRect(stoneX, stoneY, stoneW, stoneH);

                    // Draw bump paver (light grey with dark edge)
                    bCtx.fillStyle = '#7a7a7a';
                    bCtx.fillRect(stoneX * bScale, stoneY * bScale, stoneW * bScale, stoneH * bScale);
                }

                x += stoneWidth;
            }
        }

        // Stone texture speckles / surface noise
        ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
        for (let i = 0; i < 6000; i++) {
            ctx.fillRect(rng() * size, rng() * size, 2, 2);
        }

        // 3. Courtyard Perimeter Kolam / Decorative White Chalk Border
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 5;
        const bPad = 260;
        ctx.strokeRect(bPad, bPad, size - bPad * 2, size - bPad * 2);

        // Scalloped floral corners inside the courtyard
        const corners = [
            [bPad + 20, bPad + 20],
            [size - bPad - 20, bPad + 20],
            [bPad + 20, size - bPad - 20],
            [size - bPad - 20, size - bPad - 20]
        ];
        corners.forEach(([cx, cy]) => {
            ctx.beginPath();
            ctx.arc(cx, cy, 38, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(251, 191, 36, 0.15)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Inner Diya motif
            ctx.fillStyle = '#ea580c';
            ctx.beginPath();
            ctx.arc(cx, cy, 14, 0, Math.PI);
            ctx.fill();
            ctx.fillStyle = '#fde047';
            ctx.beginPath();
            ctx.arc(cx, cy - 6, 6, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.restore();

        // 4. Grand Central Hand-Crafted Diwali Rangoli (Centered at 1024, 1024)
        ctx.save();
        ctx.translate(size / 2, size / 2);

        // Circular dark powder bed with soft border
        ctx.beginPath();
        ctx.arc(0, 0, 480, 0, Math.PI * 2);
        ctx.fillStyle = '#0f0c1a';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 6;
        ctx.stroke();

        // Layer 1: Outermost Marigold Garland (Genda Phool Ring)
        // 48 realistic, vibrant flower puffs alternating Saffron Orange & Marigold Gold!
        const flowerCount = 46;
        const garlandRadius = 450;
        for (let i = 0; i < flowerCount; i++) {
            const ang = (i * Math.PI * 2) / flowerCount;
            const fx = Math.cos(ang) * garlandRadius;
            const fy = Math.sin(ang) * garlandRadius;
            const isOrange = i % 2 === 0;

            // Flower base puff
            ctx.beginPath();
            ctx.arc(fx, fy, 20, 0, Math.PI * 2);
            ctx.fillStyle = isOrange ? '#ea580c' : '#facc15';
            ctx.fill();

            // Textured petal dots inside flower
            for (let p = 0; p < 8; p++) {
                const pAng = (p * Math.PI * 2) / 8;
                const px = fx + Math.cos(pAng) * 11;
                const py = fy + Math.sin(pAng) * 11;
                ctx.beginPath();
                ctx.arc(px, py, 6, 0, Math.PI * 2);
                ctx.fillStyle = isOrange ? '#f97316' : '#fde047';
                ctx.fill();
            }

            // Dark flower center bud
            ctx.beginPath();
            ctx.arc(fx, fy, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#7c2d12';
            ctx.fill();
        }

        // Layer 2: White Rice-Powder Ring
        ctx.beginPath();
        ctx.arc(0, 0, 412, 0, Math.PI * 2);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 5;
        ctx.stroke();

        // Layer 3: Vermilion (Sindoor Red) Broad Ring
        ctx.beginPath();
        ctx.arc(0, 0, 385, 0, Math.PI * 2);
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 26;
        ctx.stroke();

        // White chalk dots on red ring
        const dotCount = 48;
        for (let d = 0; d < dotCount; d++) {
            const ang = (d * Math.PI * 2) / dotCount;
            ctx.beginPath();
            ctx.arc(Math.cos(ang) * 385, Math.sin(ang) * 385, 3.5, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
        }

        // Layer 4: Turmeric Yellow Ring
        ctx.beginPath();
        ctx.arc(0, 0, 350, 0, Math.PI * 2);
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 20;
        ctx.stroke();

        // Layer 5: Royal Emerald Green Band
        ctx.beginPath();
        ctx.arc(0, 0, 320, 0, Math.PI * 2);
        ctx.strokeStyle = '#15803d';
        ctx.lineWidth = 18;
        ctx.stroke();

        // Layer 6: 16-Petal Kamal (Lotus Flower) Mandala
        for (let a = 0; a < 16; a++) {
            const ang = (a * Math.PI * 2) / 16;
            ctx.save();
            ctx.rotate(ang);

            // Lotus Petal shape
            ctx.beginPath();
            ctx.moveTo(180, 0);
            ctx.quadraticCurveTo(245, 42, 305, 0);
            ctx.quadraticCurveTo(245, -42, 180, 0);
            ctx.fillStyle = a % 2 === 0 ? '#ef4444' : '#f59e0b';
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 4;
            ctx.stroke();

            // Inner petal vein
            ctx.beginPath();
            ctx.moveTo(195, 0);
            ctx.lineTo(290, 0);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.lineWidth = 2.5;
            ctx.stroke();

            ctx.restore();
        }

        // Layer 7: Peacock Turquoise Ring
        ctx.beginPath();
        ctx.arc(0, 0, 172, 0, Math.PI * 2);
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 16;
        ctx.stroke();

        // Layer 8: 8-Pointed Star with Hand-Drawn Terracotta Diyas & Flames
        for (let s = 0; s < 8; s++) {
            const ang = (s * Math.PI * 2) / 8;
            ctx.save();
            ctx.rotate(ang);

            // Star diamond point
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(35, 110);
            ctx.lineTo(0, 160);
            ctx.lineTo(-35, 110);
            ctx.closePath();
            ctx.fillStyle = '#8b5cf6';
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3.5;
            ctx.stroke();

            // Illustrated Diya at star point
            ctx.beginPath();
            ctx.arc(0, 155, 16, 0, Math.PI);
            ctx.fillStyle = '#b45309';
            ctx.fill();
            ctx.strokeStyle = '#fef08a';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Glowing Golden Diya Flame
            ctx.beginPath();
            ctx.moveTo(-7, 155);
            ctx.quadraticCurveTo(0, 130, 0, 126);
            ctx.quadraticCurveTo(0, 130, 7, 155);
            ctx.fillStyle = '#f59e0b';
            ctx.fill();

            // Flame white core
            ctx.beginPath();
            ctx.arc(0, 148, 3.5, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();

            ctx.restore();
        }

        // Layer 9: Sacred Central Medallion
        ctx.beginPath();
        ctx.arc(0, 0, 65, 0, Math.PI * 2);
        ctx.fillStyle = '#dc2626';
        ctx.fill();
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 6;
        ctx.stroke();

        // Center golden star
        ctx.beginPath();
        for (let p = 0; p < 8; p++) {
            const rOuter = 45;
            const rInner = 20;
            const a1 = (p * Math.PI * 2) / 8;
            const a2 = a1 + Math.PI / 8;
            if (p === 0) ctx.moveTo(Math.cos(a1) * rOuter, Math.sin(a1) * rOuter);
            else ctx.lineTo(Math.cos(a1) * rOuter, Math.sin(a1) * rOuter);
            ctx.lineTo(Math.cos(a2) * rInner, Math.sin(a2) * rInner);
        }
        ctx.closePath();
        ctx.fillStyle = '#fbbf24';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Sacred Center Pearl
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        ctx.restore();

        // 5. Draw Rangoli raised elevation onto Bump Canvas
        bCtx.save();
        bCtx.translate(bumpSize / 2, bumpSize / 2);
        bCtx.beginPath();
        bCtx.arc(0, 0, 480 * bScale, 0, Math.PI * 2);
        bCtx.fillStyle = '#a0a0a0';
        bCtx.fill();
        bCtx.restore();

        const diffTex = new THREE.CanvasTexture(canvas);
        diffTex.wrapS = THREE.RepeatWrapping;
        diffTex.wrapT = THREE.RepeatWrapping;
        diffTex.generateMipmaps = !this.isMobile;
        diffTex.minFilter = this.isMobile ? THREE.LinearFilter : THREE.LinearMipmapLinearFilter;

        const bumpTex = new THREE.CanvasTexture(bumpCanvas);
        bumpTex.wrapS = THREE.RepeatWrapping;
        bumpTex.wrapT = THREE.RepeatWrapping;
        bumpTex.generateMipmaps = !this.isMobile;
        bumpTex.minFilter = this.isMobile ? THREE.LinearFilter : THREE.LinearMipmapLinearFilter;

        return { diffuse: diffTex, bump: bumpTex };
    }

    initCourtyardCurbs() {
        // High-performance Instanced 3D Indian Street Curbs (Patri) - Only 2 draw calls for all 110+ curb blocks!
        const yellowMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.75 });
        const darkMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.85 });

        const curbHalf = 24.5;
        const blockLen = 1.75;
        const curbHeight = 0.32;
        const curbWidth = 0.55;
        const curbGeo = new THREE.BoxGeometry(blockLen - 0.05, curbHeight, curbWidth);

        const yellowTransforms = [];
        const darkTransforms = [];
        const dummy = new THREE.Object3D();

        // North edge (z = -curbHalf)
        for (let x = -curbHalf; x <= curbHalf; x += blockLen) {
            dummy.position.set(x + blockLen / 2, curbHeight / 2, -curbHalf);
            dummy.rotation.set(0, 0, 0);
            dummy.updateMatrix();
            if (Math.round((x + curbHalf) / blockLen) % 2 === 0) {
                yellowTransforms.push(dummy.matrix.clone());
            } else {
                darkTransforms.push(dummy.matrix.clone());
            }
        }

        // South edge (z = curbHalf) - 8m entrance gateway
        for (let x = -curbHalf; x <= curbHalf; x += blockLen) {
            if (x >= -4.5 && x <= 4.5) continue;
            dummy.position.set(x + blockLen / 2, curbHeight / 2, curbHalf);
            dummy.rotation.set(0, 0, 0);
            dummy.updateMatrix();
            if (Math.round((x + curbHalf) / blockLen) % 2 === 0) {
                yellowTransforms.push(dummy.matrix.clone());
            } else {
                darkTransforms.push(dummy.matrix.clone());
            }
        }

        // West edge (x = -curbHalf) - rotated 90 deg along Z axis
        for (let z = -curbHalf; z <= curbHalf; z += blockLen) {
            dummy.position.set(-curbHalf, curbHeight / 2, z + blockLen / 2);
            dummy.rotation.set(0, Math.PI / 2, 0);
            dummy.updateMatrix();
            if (Math.round((z + curbHalf) / blockLen) % 2 === 0) {
                yellowTransforms.push(dummy.matrix.clone());
            } else {
                darkTransforms.push(dummy.matrix.clone());
            }
        }

        // East edge (x = curbHalf) - rotated 90 deg along Z axis
        for (let z = -curbHalf; z <= curbHalf; z += blockLen) {
            dummy.position.set(curbHalf, curbHeight / 2, z + blockLen / 2);
            dummy.rotation.set(0, Math.PI / 2, 0);
            dummy.updateMatrix();
            if (Math.round((z + curbHalf) / blockLen) % 2 === 0) {
                yellowTransforms.push(dummy.matrix.clone());
            } else {
                darkTransforms.push(dummy.matrix.clone());
            }
        }

        const yellowMesh = new THREE.InstancedMesh(curbGeo, yellowMat, yellowTransforms.length);
        yellowMesh.receiveShadow = true;
        yellowTransforms.forEach((m, i) => yellowMesh.setMatrixAt(i, m));
        yellowMesh.instanceMatrix.needsUpdate = true;
        this.scene.add(yellowMesh);

        const darkMesh = new THREE.InstancedMesh(curbGeo, darkMat, darkTransforms.length);
        darkMesh.receiveShadow = true;
        darkTransforms.forEach((m, i) => darkMesh.setMatrixAt(i, m));
        darkMesh.instanceMatrix.needsUpdate = true;
        this.scene.add(darkMesh);
    }

    initFlowerPetalScatter() {
        // High-performance Instanced 3D Marigold Flower Petals (Only 2 draw calls total!)
        const petalGeo = new THREE.PlaneGeometry(0.18, 0.28);
        const oMat = new THREE.MeshBasicMaterial({ color: 0xf97316, side: THREE.DoubleSide });
        const yMat = new THREE.MeshBasicMaterial({ color: 0xfacc15, side: THREE.DoubleSide });

        const totalCount = 102;
        const halfCount = 51;
        const oMesh = new THREE.InstancedMesh(petalGeo, oMat, halfCount);
        const yMesh = new THREE.InstancedMesh(petalGeo, yMat, halfCount);

        const dummy = new THREE.Object3D();
        let oIdx = 0;
        let yIdx = 0;

        // Ring around Rangoli (72 petals)
        for (let i = 0; i < 72; i++) {
            const ang = (i * Math.PI * 2) / 72 + (Math.random() - 0.5) * 0.08;
            const r = 9.4 + Math.random() * 0.9;
            dummy.position.set(Math.cos(ang) * r, 0.02, Math.sin(ang) * r);
            dummy.rotation.set(-Math.PI / 2, 0, Math.random() * Math.PI * 2);
            dummy.scale.set(1, 1, 1);
            dummy.updateMatrix();

            if (i % 2 === 0 && oIdx < halfCount) {
                oMesh.setMatrixAt(oIdx++, dummy.matrix);
            } else if (yIdx < halfCount) {
                yMesh.setMatrixAt(yIdx++, dummy.matrix);
            }
        }

        // Clusters near entrance (30 petals)
        for (let i = 0; i < 30; i++) {
            dummy.position.set((Math.random() - 0.5) * 7, 0.02, 23.5 + (Math.random() - 0.5) * 1.5);
            dummy.rotation.set(-Math.PI / 2, 0, Math.random() * Math.PI * 2);
            dummy.scale.set(1, 1, 1);
            dummy.updateMatrix();

            if (i % 2 === 0 && oIdx < halfCount) {
                oMesh.setMatrixAt(oIdx++, dummy.matrix);
            } else if (yIdx < halfCount) {
                yMesh.setMatrixAt(yIdx++, dummy.matrix);
            }
        }

        oMesh.instanceMatrix.needsUpdate = true;
        yMesh.instanceMatrix.needsUpdate = true;
        this.scene.add(oMesh);
        this.scene.add(yMesh);
    }

    buildStreetLampMesh() {
        const group = new THREE.Group();

        // Dark cast iron material
        const ironMat = new THREE.MeshStandardMaterial({
            color: 0x1e2028,
            metalness: 0.85,
            roughness: 0.35
        });

        // Ornate brass trim material
        const brassMat = new THREE.MeshStandardMaterial({
            color: 0xd97706,
            metalness: 0.88,
            roughness: 0.25
        });

        // 1. Base pedestal (stepped octagon / plinth)
        const basePlinth = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 0.45, 8), ironMat);
        basePlinth.position.y = 0.225;
        basePlinth.castShadow = true;
        group.add(basePlinth);

        const baseMoulding = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.52, 0.4, 8), ironMat);
        baseMoulding.position.y = 0.65;
        group.add(baseMoulding);

        const brassRing1 = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.05, 8, 16), brassMat);
        brassRing1.rotation.x = Math.PI / 2;
        brassRing1.position.y = 0.85;
        group.add(brassRing1);

        // 2. Main fluted cast-iron column
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.22, 5.2, 12), ironMat);
        pole.position.y = 3.45;
        pole.castShadow = true;
        group.add(pole);

        // Mid-pole decorative collar & brass ring
        const midCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.22, 12), ironMat);
        midCollar.position.y = 3.8;
        group.add(midCollar);

        const brassRing2 = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.04, 8, 16), brassMat);
        brassRing2.rotation.x = Math.PI / 2;
        brassRing2.position.y = 3.9;
        group.add(brassRing2);

        // Vintage horizontal ladder-rest crossbar
        const crossbar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8), ironMat);
        crossbar.rotation.z = Math.PI / 2;
        crossbar.position.y = 4.8;
        group.add(crossbar);

        // Brass end knobs on crossbar
        [-0.6, 0.6].forEach(x => {
            const knob = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), brassMat);
            knob.position.set(x, 4.8, 0);
            group.add(knob);
        });

        // 3. Ornate curved gooseneck arm holding lantern
        const armCurve = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.06, 8, 16, Math.PI * 0.75), ironMat);
        armCurve.rotation.z = -Math.PI * 0.25;
        armCurve.position.set(0.42, 5.75, 0);
        group.add(armCurve);

        // 4. Hexagonal Victorian / Desi Lantern Head
        const lanternGroup = new THREE.Group();
        lanternGroup.position.set(0.85, 5.65, 0);

        // Top canopy / roof of lantern
        const roof = new THREE.Mesh(new THREE.ConeGeometry(0.52, 0.42, 6), ironMat);
        roof.position.y = 0.55;
        lanternGroup.add(roof);

        const finial = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.35, 6), brassMat);
        finial.position.y = 0.9;
        lanternGroup.add(finial);

        // Lantern glass housing (frosted translucent warm glass)
        const glassMat = new THREE.MeshStandardMaterial({
            color: 0xffedd5,
            emissive: 0xfbbf24,
            emissiveIntensity: 0.85,
            transparent: true,
            opacity: 0.88,
            roughness: 0.2
        });
        const glassBody = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.28, 0.65, 6), glassMat);
        glassBody.position.y = 0.12;
        lanternGroup.add(glassBody);

        // Metal ribs / frame around glass
        const ribMat = new THREE.MeshStandardMaterial({ color: 0x0f1117, metalness: 0.9 });
        for (let r = 0; r < 6; r++) {
            const ang = (r * Math.PI) / 3;
            const rib = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.65, 4), ribMat);
            rib.position.set(Math.cos(ang) * 0.35, 0.12, Math.sin(ang) * 0.35);
            lanternGroup.add(rib);
        }

        // Base plate of lantern
        const basePlate = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.12, 6), ironMat);
        basePlate.position.y = -0.25;
        lanternGroup.add(basePlate);

        // 5. Glowing Sodium / Halogen Bulb inside
        const bulbMat = new THREE.MeshBasicMaterial({ color: 0xfffbeb });
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.15, 10, 10), bulbMat);
        bulb.position.y = 0.12;
        lanternGroup.add(bulb);

        // 6. Volumetric Atmospheric Light Cone Beam (cutting down to pavement)
        const coneMat = new THREE.MeshBasicMaterial({
            color: 0xffd580,
            transparent: true,
            opacity: 0.085,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
            depthWrite: false
        });
        const lightBeam = new THREE.Mesh(new THREE.ConeGeometry(4.8, 5.8, 16, 1, true), coneMat);
        lightBeam.position.y = -2.9;
        lanternGroup.add(lightBeam);

        group.add(lanternGroup);
        group.userData.lanternPos = new THREE.Vector3(0.85, 5.75, 0);

        // 7. Soft Golden Light Puddle on Pavement (Baked Radial Decal for realistic pavement illumination)
        if (!this.lampPuddleMat) {
            const pCanvas = document.createElement('canvas');
            pCanvas.width = 128;
            pCanvas.height = 128;
            const pCtx = pCanvas.getContext('2d');
            const grad = pCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
            grad.addColorStop(0, 'rgba(255, 222, 130, 0.42)');
            grad.addColorStop(0.45, 'rgba(251, 191, 36, 0.18)');
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            pCtx.fillStyle = grad;
            pCtx.fillRect(0, 0, 128, 128);

            const pTex = new THREE.CanvasTexture(pCanvas);
            this.lampPuddleMat = new THREE.MeshBasicMaterial({
                map: pTex,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            this.lampPuddleGeo = new THREE.PlaneGeometry(8.8, 8.8);
        }
        const puddle = new THREE.Mesh(this.lampPuddleGeo, this.lampPuddleMat);
        puddle.rotation.x = -Math.PI / 2;
        puddle.position.set(0.85, 0.025, 0);
        group.add(puddle);

        return group;
    }

    initStreetLamps() {
        this.streetLamps = [];

        // 6 Strategic Lamp Positions across Courtyard & Streets
        const lampConfigs = [
            { pos: new THREE.Vector3(-17, 0, 17), rotY: -Math.PI * 0.25, target: new THREE.Vector3(-8, 0, 8) },
            { pos: new THREE.Vector3(17, 0, 17),  rotY: Math.PI * 0.75,  target: new THREE.Vector3(8, 0, 8) },
            { pos: new THREE.Vector3(-17, 0, -17), rotY: Math.PI * 0.25,  target: new THREE.Vector3(-8, 0, -8) },
            { pos: new THREE.Vector3(17, 0, -17),  rotY: -Math.PI * 0.75, target: new THREE.Vector3(8, 0, -8) },
            { pos: new THREE.Vector3(-28, 0, 2),   rotY: 0,                target: new THREE.Vector3(-20, 0, 2) },
            { pos: new THREE.Vector3(28, 0, 2),    rotY: Math.PI,          target: new THREE.Vector3(20, 0, 2) }
        ];

        lampConfigs.forEach(cfg => {
            const lampMesh = this.buildStreetLampMesh();
            lampMesh.position.copy(cfg.pos);
            lampMesh.rotation.y = cfg.rotY;
            this.scene.add(lampMesh);

            // Compute world position of the lantern head
            const headOffset = new THREE.Vector3(0.85, 5.75, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), cfg.rotY);
            const headWorld = cfg.pos.clone().add(headOffset);

            // 1. Downward SpotLight casting warm golden illumination onto pavement (shadow pass disabled for locked 60 FPS)
            const spotLight = new THREE.SpotLight(0xffdf88, 3.2, 30, Math.PI / 3.2, 0.75, 1.2);
            spotLight.position.copy(headWorld);
            spotLight.target.position.copy(cfg.target);
            spotLight.castShadow = false;
            this.scene.add(spotLight);
            this.scene.add(spotLight.target);

            this.streetLamps.push({
                mesh: lampMesh,
                spotLight,
                headWorld
            });
        });
    }

    initCourtyard() {
        // Floor Plane with Realistic Staggered Stone Pavers + High-Definition Rangoli + Bump Relief
        const textures = this.createRealisticMohallaFloorTextures();
        const floorGeo = new THREE.PlaneGeometry(80, 80);
        const floorMat = new THREE.MeshStandardMaterial({
            map: textures.diffuse,
            bumpMap: textures.bump,
            bumpScale: 0.05,
            roughness: 0.78,
            metalness: 0.12
        });
        this.floorMesh = new THREE.Mesh(floorGeo, floorMat);
        this.floorMesh.rotation.x = -Math.PI / 2;
        this.floorMesh.receiveShadow = true;
        this.scene.add(this.floorMesh);

        // Raised 3D Indian Street Curbs (Patri)
        this.initCourtyardCurbs();

        // 3D Marigold Flower Petal Scatter (Genda Phool)
        this.initFlowerPetalScatter();

        // Perimeter Walls & Stone Pillars
        const wallMat = new THREE.MeshStandardMaterial({ color: 0x181524, roughness: 0.92 });
        const pillarMat = new THREE.MeshStandardMaterial({ color: 0x252037, roughness: 0.85 });
        const diyaClayMat = new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.7 });
        const flameMat = new THREE.MeshBasicMaterial({ color: 0xffbe2e });

        const half = 26;
        const wallCoords = [
            { x: 0, z: -half, w: half * 2, d: 1.2 },
            { x: 0, z: half,  w: half * 2, d: 1.2 },
            { x: -half, z: 0, w: 1.2, d: half * 2 },
            { x: half, z: 0,  w: 1.2, d: half * 2 }
        ];

        wallCoords.forEach(wc => {
            const wMesh = new THREE.Mesh(new THREE.BoxGeometry(wc.w, 1.8, wc.d), wallMat);
            wMesh.position.set(wc.x, 0.9, wc.z);
            wMesh.receiveShadow = true;
            wMesh.castShadow = true;
            this.scene.add(wMesh);
        });

        // Perimeter Glowing Diyas along the wall
        for (let i = -24; i <= 24; i += 6) {
            const positions = [
                new THREE.Vector3(i, 1.8, -half),
                new THREE.Vector3(i, 1.8, half),
                new THREE.Vector3(-half, 1.8, i),
                new THREE.Vector3(half, 1.8, i)
            ];
            positions.forEach(p => {
                const diya = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.16, 0.2, 12), diyaClayMat);
                diya.position.copy(p).add(new THREE.Vector3(0, 0.1, 0));
                this.scene.add(diya);

                const flame = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.35, 8), flameMat);
                flame.position.copy(p).add(new THREE.Vector3(0, 0.32, 0));
                this.scene.add(flame);

                this.diyaFlames.push({
                    mesh: flame,
                    baseY: p.y + 0.32,
                    phase: Math.random() * Math.PI * 2
                });
            });
        }

        // Corner Grand Pillars with Hanging Diwali Kandil Lanterns
        const corners = [
            new THREE.Vector3(-half, 0, -half),
            new THREE.Vector3(half, 0, -half),
            new THREE.Vector3(-half, 0, half),
            new THREE.Vector3(half, 0, half)
        ];

        corners.forEach((c, idx) => {
            const pillar = new THREE.Mesh(new THREE.BoxGeometry(2.2, 8.5, 2.2), pillarMat);
            pillar.position.set(c.x, 4.25, c.z);
            pillar.castShadow = true;
            this.scene.add(pillar);

            // Hanging Akash Kandil Lantern
            const kandilGroup = new THREE.Group();
            const colors = [0xf43f5e, 0xfacc15, 0x8b5cf6, 0x06b6d4];
            const kColor = colors[idx % colors.length];

            const lanternMat = new THREE.MeshStandardMaterial({
                color: kColor,
                roughness: 0.3,
                emissive: kColor,
                emissiveIntensity: 0.35
            });

            // Diamond/octahedron lantern body
            const lanternBody = new THREE.Mesh(new THREE.OctahedronGeometry(0.9, 0), lanternMat);
            lanternBody.scale.set(1.0, 1.4, 1.0);
            kandilGroup.add(lanternBody);

            // Tassels hanging below
            const tassel = new THREE.Mesh(
                new THREE.ConeGeometry(0.5, 1.2, 8),
                new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.5 })
            );
            tassel.position.y = -1.4;
            kandilGroup.add(tassel);

            // Position hanging slightly in front of pillar
            const signX = c.x > 0 ? -1 : 1;
            const signZ = c.z > 0 ? -1 : 1;
            kandilGroup.position.set(c.x + signX * 2.2, 6.2, c.z + signZ * 2.2);
            this.scene.add(kandilGroup);

            this.kandils.push({
                group: kandilGroup,
                baseY: kandilGroup.position.y,
                phase: Math.random() * Math.PI * 2
            });
        });

        // Night Starfield
        const starGeo = new THREE.BufferGeometry();
        const starVerts = [];
        for (let i = 0; i < 750; i++) {
            const r = 95 + Math.random() * 65;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * (Math.PI * 0.46);
            starVerts.push(
                r * Math.sin(phi) * Math.cos(theta),
                Math.max(14, r * Math.cos(phi)),
                r * Math.sin(phi) * Math.sin(theta)
            );
        }
        starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starVerts, 3));
        const starMat = new THREE.PointsMaterial({ color: 0xfff3d6, size: 0.5, transparent: true, opacity: 0.85 });
        this.scene.add(new THREE.Points(starGeo, starMat));
    }

    initDistantFireworks() {
        // Atmospheric distant celebrations in the background sky
        this.distantFwTimer = 0;
    }

    spawnDistantSkyPop() {
        const ang = Math.random() * Math.PI * 2;
        const dist = 75 + Math.random() * 45;
        const x = Math.cos(ang) * dist;
        const y = 35 + Math.random() * 25;
        const z = Math.sin(ang) * dist;

        const colors = [0xf43f5e, 0x38bdf8, 0xfacc15, 0xa855f7, 0x34d399];
        const col = colors[Math.floor(Math.random() * colors.length)];

        const geo = new THREE.BufferGeometry();
        const verts = [];
        const count = 35;
        for (let i = 0; i < count; i++) {
            const phi = Math.random() * Math.PI * 2;
            const theta = Math.acos(Math.random() * 2 - 1);
            const spd = 3 + Math.random() * 5;
            verts.push(
                x + spd * Math.sin(theta) * Math.cos(phi),
                y + spd * Math.cos(theta),
                z + spd * Math.sin(theta) * Math.sin(phi)
            );
        }
        geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
        const mat = new THREE.PointsMaterial({ color: col, size: 0.9, transparent: true, opacity: 0.9 });
        const pSystem = new THREE.Points(geo, mat);
        this.scene.add(pSystem);

        this.distantFireworks.push({ mesh: pSystem, life: 0.8, maxLife: 0.8 });
    }

    initPlacementCursor() {
        this.cursorGroup = new THREE.Group();
        this.cursorRing = new THREE.Mesh(
            new THREE.RingGeometry(0.65, 0.85, 32),
            new THREE.MeshBasicMaterial({ color: 0xfbbf24, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
        );
        this.cursorRing.rotation.x = -Math.PI / 2;
        this.cursorRing.position.y = 0.03;
        this.cursorGroup.add(this.cursorRing);

        // Center dot
        const dot = new THREE.Mesh(
            new THREE.CircleGeometry(0.12, 16),
            new THREE.MeshBasicMaterial({ color: 0xfbbf24, side: THREE.DoubleSide })
        );
        dot.rotation.x = -Math.PI / 2;
        dot.position.y = 0.035;
        this.cursorGroup.add(dot);

        this.scene.add(this.cursorGroup);
    }

    setCursorColor(hex) {
        this.cursorRing.material.color.setHex(hex);
    }

    updateCameraPosition() {
        const s = this.camState;
        s.phi = Math.max(0.18, Math.min(Math.PI / 2 - 0.04, s.phi));
        s.radius = Math.max(8, Math.min(72, s.radius));

        const x = s.target.x + s.radius * Math.sin(s.phi) * Math.sin(s.theta);
        const y = s.target.y + s.radius * Math.cos(s.phi);
        const z = s.target.z + s.radius * Math.sin(s.phi) * Math.cos(s.theta);

        let sx = 0, sy = 0, sz = 0;
        if (s.shakeIntensity > 0.01) {
            sx = (Math.random() - 0.5) * s.shakeIntensity;
            sy = (Math.random() - 0.5) * s.shakeIntensity;
            sz = (Math.random() - 0.5) * s.shakeIntensity;
        }

        this.camera.position.set(x + sx, Math.max(0.6, y + sy), z + sz);
        this.camera.lookAt(s.target.x + sx * 0.4, s.target.y + sy * 0.4, s.target.z + sz * 0.4);
    }

    setCameraPreset(preset) {
        if (preset === 'action') {
            this.camState.autoRotate = false;
            this.camState.theta = 0.58;
            this.camState.phi = 1.15;
            this.camState.radius = 25;
            this.camState.target.set(0, 1.2, 0);
        } else if (preset === 'ground') {
            this.camState.autoRotate = false;
            this.camState.theta = 0.22;
            this.camState.phi = 1.48;
            this.camState.radius = 18;
            this.camState.target.set(0, 0.8, 0);
        } else if (preset === 'sky') {
            this.camState.autoRotate = false;
            this.camState.theta = 0.0;
            this.camState.phi = 0.42;
            this.camState.radius = 38;
            this.camState.target.set(0, 0, 0);
        } else if (preset === 'cinematic') {
            this.camState.autoRotate = !this.camState.autoRotate;
        }
        this.updateCameraPosition();
    }

    zoomIn(step = 4.5) {
        this.camState.radius = Math.max(8, this.camState.radius - step);
        this.updateCameraPosition();
    }

    zoomOut(step = 4.5) {
        this.camState.radius = Math.min(65, this.camState.radius + step);
        this.updateCameraPosition();
    }

    bindInputEvents() {
        const dom = this.container;
        const raycaster = new THREE.Raycaster();
        const mouseNDC = new THREE.Vector2();

        this.getFloorIntersection = (clientX, clientY) => {
            mouseNDC.x = (clientX / window.innerWidth) * 2 - 1;
            mouseNDC.y = -(clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouseNDC, this.camera);
            const hits = raycaster.intersectObject(this.floorMesh);
            if (hits.length > 0) {
                const pt = hits[0].point;
                pt.x = Math.max(-23, Math.min(23, pt.x));
                pt.z = Math.max(-23, Math.min(23, pt.z));
                pt.y = 0;
                return pt;
            }
            return null;
        };

        // Pointer Events (Mouse & Single Touch Drag)
        dom.addEventListener('pointerdown', (e) => {
            this.camState.isDragging = true;
            this.camState.dragDistance = 0;
            this.camState.prevX = e.clientX;
            this.camState.prevY = e.clientY;
        });

        window.addEventListener('pointermove', (e) => {
            const pt = this.getFloorIntersection(e.clientX, e.clientY);
            if (pt) {
                this.cursorGroup.position.copy(pt);
                if (this.onPointerMove) {
                    this.onPointerMove(pt, e);
                }
            }

            if (!this.camState.isDragging || this.camState.touchCount >= 2) return;
            const dx = e.clientX - this.camState.prevX;
            const dy = e.clientY - this.camState.prevY;
            this.camState.dragDistance += Math.abs(dx) + Math.abs(dy);

            // Orbit rotation
            this.camState.theta -= dx * 0.007;
            this.camState.phi -= dy * 0.006;

            this.camState.prevX = e.clientX;
            this.camState.prevY = e.clientY;
        });

        window.addEventListener('pointerup', (e) => {
            if (!this.camState.isDragging) return;
            this.camState.isDragging = false;

            // Clean click / tap without camera movement
            if (this.camState.dragDistance < 10 && this.camState.touchCount <= 1 && e.target === this.renderer.domElement) {
                if (this.onCanvasClick && this.onCanvasClick(e.clientX, e.clientY)) {
                    return;
                }
                const pt = this.getFloorIntersection(e.clientX, e.clientY);
                if (pt && this.onFloorClick) {
                    this.onFloorClick(pt);
                }
            }
        });

        // Touch Pinch to Zoom & Two-Finger Pan on Mobile
        dom.addEventListener('touchstart', (e) => {
            this.camState.touchCount = e.touches.length;
            if (e.touches.length === 2) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                this.camState.pinchStartDist = Math.hypot(dx, dy);
            }
        }, { passive: true });

        dom.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2 && this.camState.pinchStartDist > 0) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                const currentDist = Math.hypot(dx, dy);
                const diff = this.camState.pinchStartDist - currentDist;

                this.camState.radius += diff * 0.05;
                this.camState.pinchStartDist = currentDist;
            }
        }, { passive: true });

        dom.addEventListener('touchend', (e) => {
            this.camState.touchCount = e.touches.length;
            if (e.touches.length < 2) {
                this.camState.pinchStartDist = 0;
            }
        }, { passive: true });

        // Wheel Zoom on Laptop
        dom.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.camState.radius += e.deltaY * 0.025;
        }, { passive: false });

        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    update(dt) {
        if (this.contextLost) return;
        // Subtle realistic street lamp glow
        if (this.streetLamps) {
            const time = performance.now() * 0.003;
            this.streetLamps.forEach((l, idx) => {
                const flicker = 1.0 + Math.sin(time + idx * 1.7) * 0.04;
                l.spotLight.intensity = (this.currentTheme === 'sunset' ? 2.4 : 3.4) * flicker;
            });
        }

        // Courtyard Diya flicker
        this.diyaFlames.forEach(d => {
            d.phase += dt * 11;
            d.mesh.scale.y = 0.85 + Math.sin(d.phase) * 0.2;
            d.mesh.position.y = d.baseY + Math.sin(d.phase) * 0.03;
        });

        // Sway hanging Kandil lanterns
        this.kandils.forEach(k => {
            k.phase += dt * 1.5;
            k.group.rotation.z = Math.sin(k.phase) * 0.08;
            k.group.rotation.x = Math.cos(k.phase * 0.8) * 0.05;
            k.group.position.y = k.baseY + Math.sin(k.phase * 2) * 0.04;
        });

        // Cursor pulsing
        const pulse = 1 + Math.sin(performance.now() * 0.007) * 0.08;
        this.cursorRing.scale.set(pulse, pulse, 1);

        // Update floating sky lanterns
        for (let i = this.skyLanterns.length - 1; i >= 0; i--) {
            const sl = this.skyLanterns[i];
            sl.group.position.y += dt * sl.velY;
            sl.group.position.x += dt * sl.driftX;
            sl.group.position.z += dt * sl.driftZ;
            sl.phase += dt * 1.5;
            sl.group.rotation.z = Math.sin(sl.phase) * 0.08;
            sl.group.rotation.x = Math.cos(sl.phase * 0.8) * 0.05;

            if (sl.group.position.y > 110) {
                this.scene.remove(sl.group);
                sl.group.traverse(c => {
                    if (c.geometry) c.geometry.dispose();
                    if (c.material) c.material.dispose();
                });
                this.skyLanterns.splice(i, 1);
            }
        }

        // Camera auto-orbit in cinematic mode
        if (this.camState.autoRotate) {
            this.camState.theta += dt * 0.15;
        }

        // Decay camera shake
        if (this.camState.shakeIntensity > 0) {
            this.camState.shakeIntensity = Math.max(0, this.camState.shakeIntensity - dt * 3.5);
        }

        this.updateCameraPosition();
        this.renderer.render(this.scene, this.camera);
    }
}

window.CourtyardScene = CourtyardScene;
