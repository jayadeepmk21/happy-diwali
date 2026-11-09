/**
 * Mohalla Environment & Ambient Sky Fireworks Engine
 * 1. Warm Festive Indian Houses (Illuminated Facades, Balconies, Glowing Windows, Hanging Fairy Lights & Terrace Diyas)
 * 2. Autonomous Ambient Background Sky-Shots (Ascending Rockets, Massive High-Altitude Peonies & Willows, Distant Booms)
 * 3. Sharma ji's Parked Car with Hazard Alarm
 */

class MohallaEnvironment {
    constructor(scene, audio) {
        this.scene = scene;
        this.audio = audio;
        this.group = new THREE.Group();
        this.scene.add(this.group);

        this.loader = (typeof THREE.GLTFLoader !== 'undefined') ? new THREE.GLTFLoader() : null;
        this.stringLightBulbs = [];
        this.terraceDiyaFlames = [];
        this.houseFacadeLights = [];
        this.sharmaCar = null;
        this.carAlarmBlinking = false;
        this.carAlarmTimer = 0;
        this.hazardLights = [];

        // Ambient Background Sky-Shots Engine
        this.skyFireworks = [];
        this.skyRockets = [];
        this.skyLightFlashes = [];
        this.skyShotTimer = 1.0;

        // Shared Geometries & Materials (Pre-allocated for locked 60 FPS)
        this.geoBulb = new THREE.SphereGeometry(0.2, 5, 5);
        this.geoSpark = new THREE.SphereGeometry(0.22, 4, 4);
        this.geoSkyStar = new THREE.SphereGeometry(0.48, 5, 5);
        this.geoRocket = new THREE.SphereGeometry(0.35, 6, 6);
        this.geoDiyaFlame = new THREE.ConeGeometry(0.14, 0.38, 5);
        this.beaconLights = [];
        this.ambientLanterns = [];

        // 6 Festive Fairy Light Colors & Materials (GPU Instanced for all 37 houses)
        this.fairyBaseColors = [0xef4444, 0xfacc15, 0x10b981, 0x06b6d4, 0xf43f5e, 0xa855f7];
        this.fairyMaterials = this.fairyBaseColors.map(c => new THREE.MeshBasicMaterial({ color: c }));
        this.instancedFairyMeshes = [];

        // Pre-allocated Fireworks Star Materials
        this.starMats = {
            gold: new THREE.MeshBasicMaterial({ color: 0xfde047 }),
            amber: new THREE.MeshBasicMaterial({ color: 0xf59e0b }),
            rose: new THREE.MeshBasicMaterial({ color: 0xf43f5e }),
            cyan: new THREE.MeshBasicMaterial({ color: 0x38bdf8 }),
            emerald: new THREE.MeshBasicMaterial({ color: 0x10b981 }),
            orange: new THREE.MeshBasicMaterial({ color: 0xf97316 }),
            purple: new THREE.MeshBasicMaterial({ color: 0xa855f7 }),
            white: new THREE.MeshBasicMaterial({ color: 0xffffff }),
            red: new THREE.MeshBasicMaterial({ color: 0xef4444 })
        };
        this.starMatList = Object.values(this.starMats);

        // Pre-allocated Object Pool for Ambient Fireworks Stars (220 stars, 0 runtime GC)
        this.skyStarPool = [];
        for (let i = 0; i < 220; i++) {
            const mesh = new THREE.Mesh(this.geoSkyStar, this.starMats.gold);
            mesh.visible = false;
            this.scene.add(mesh);
            this.skyStarPool.push({
                mesh,
                active: false,
                vel: new THREE.Vector3(),
                gravity: -8,
                drag: 0.97,
                life: 0,
                maxLife: 2.0,
                isStrobe: false,
                strobePhase: 0
            });
        }

        // Pre-allocated Object Pool for Ascending Rocket Trails (25 particles)
        this.trailMat = new THREE.MeshBasicMaterial({ color: 0xffd255, transparent: true, opacity: 0.85 });
        this.trailPool = [];
        for (let i = 0; i < 25; i++) {
            const mesh = new THREE.Mesh(this.geoSpark, this.trailMat);
            mesh.visible = false;
            this.scene.add(mesh);
            this.trailPool.push({
                mesh,
                active: false,
                vel: new THREE.Vector3(),
                life: 0,
                maxLife: 0.35
            });
        }

        this.initOuterTerrain();
        this.initFestiveHouses();
        this.initDistantSkyline();
        this.initSkyFlashLights();
        this.initAmbientLanterns();
        this.initGLTFAssets();

        // Authentic Rooftop Sponsor Billboards (unlocked.devs.surf & jayfront.devs.surf)
        this.sponsorBillboards = [];
        this.initSponsorBillboards();
    }

    initOuterTerrain() {
        // Extended outer ground plane covering the entire metropolitan mohalla
        const outerGeo = new THREE.PlaneGeometry(550, 550);
        const outerMat = new THREE.MeshStandardMaterial({
            color: 0x090812,
            roughness: 0.95,
            metalness: 0.05
        });
        const outerMesh = new THREE.Mesh(outerGeo, outerMat);
        outerMesh.rotation.x = -Math.PI / 2;
        outerMesh.position.y = -0.02;
        outerMesh.receiveShadow = true;
        this.group.add(outerMesh);

        // Surrounding asphalt roads / gali paths outside courtyard walls
        const roadMat = new THREE.MeshStandardMaterial({ color: 0x161424, roughness: 0.88 });
        const lineWhiteMat = new THREE.MeshBasicMaterial({ color: 0xe2e8f0 });
        const lineYellowMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
        
        // South front road (z = 28 to 40)
        const frontRoad = new THREE.Mesh(new THREE.PlaneGeometry(180, 14), roadMat);
        frontRoad.rotation.x = -Math.PI / 2;
        frontRoad.position.set(0, -0.01, 33);
        frontRoad.receiveShadow = true;
        this.group.add(frontRoad);

        // Dashed white center line for front road
        for (let x = -85; x <= 85; x += 6.5) {
            const stripe = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 0.35), lineWhiteMat);
            stripe.rotation.x = -Math.PI / 2;
            stripe.position.set(x, 0.005, 33);
            this.group.add(stripe);
        }

        // Zebra Crossing right in front of Courtyard entrance (x = -4 to 4, z = 26 to 40)
        for (let z = 27.5; z <= 38.5; z += 1.8) {
            const zStripe = new THREE.Mesh(new THREE.PlaneGeometry(6.5, 0.9), lineWhiteMat);
            zStripe.rotation.x = -Math.PI / 2;
            zStripe.position.set(0, 0.006, z);
            this.group.add(zStripe);
        }

        // East road (x = 34)
        const eastRoad = new THREE.Mesh(new THREE.PlaneGeometry(14, 180), roadMat);
        eastRoad.rotation.x = -Math.PI / 2;
        eastRoad.position.set(34, -0.01, 0);
        eastRoad.receiveShadow = true;
        this.group.add(eastRoad);

        for (let z = -85; z <= 85; z += 6.5) {
            const stripe = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 3.5), lineWhiteMat);
            stripe.rotation.x = -Math.PI / 2;
            stripe.position.set(34, 0.005, z);
            this.group.add(stripe);
        }

        // West road (x = -34)
        const westRoad = new THREE.Mesh(new THREE.PlaneGeometry(14, 180), roadMat);
        westRoad.rotation.x = -Math.PI / 2;
        westRoad.position.set(-34, -0.01, 0);
        westRoad.receiveShadow = true;
        this.group.add(westRoad);

        for (let z = -85; z <= 85; z += 6.5) {
            const stripe = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 3.5), lineWhiteMat);
            stripe.rotation.x = -Math.PI / 2;
            stripe.position.set(-34, 0.005, z);
            this.group.add(stripe);
        }

        // Footpath Sidewalks bordering the roads
        const sidewalkMat = new THREE.MeshStandardMaterial({ color: 0x221e33, roughness: 0.9 });
        const sw1 = new THREE.Mesh(new THREE.PlaneGeometry(180, 3.5), sidewalkMat);
        sw1.rotation.x = -Math.PI / 2;
        sw1.position.set(0, 0.01, 41.5);
        this.group.add(sw1);
    }

    initSkyFlashLights() {
        // High-performance single pooled sky flash light (covers entire mohalla skyline)
        const sl = new THREE.PointLight(0xffcc44, 0, 110);
        sl.position.set(0, 50, -50);
        this.scene.add(sl);
        this.skyLightFlashes = [{ light: sl, life: 0, maxLife: 0.35, peak: 0 }];
    }

    triggerSkyFlash(pos, colorHex, intensity = 14) {
        const slot = this.skyLightFlashes[0];
        slot.light.color.setHex(colorHex);
        slot.light.position.copy(pos);
        slot.light.intensity = intensity;
        slot.peak = intensity;
        slot.life = 0.32;
        slot.maxLife = 0.32;
    }

    initFestiveHouses() {
        // Warm, vibrant Indian Haveli & Townhouse Materials
        const housePalettes = [
            { wall: 0x6e322b, trim: 0x4a1f1b, roof: 0x7c2d12 }, // Terracotta Ochre
            { wall: 0x7a4d34, trim: 0x543220, roof: 0x9a3412 }, // Sandstone Peach
            { wall: 0x3d304f, trim: 0x271e33, roof: 0x581c87 }, // Deep Royal Indigo
            { wall: 0x3b4a3a, trim: 0x243023, roof: 0x166534 }, // Warm Pistachio Green
            { wall: 0x66334d, trim: 0x471f33, roof: 0x831843 }  // Festive Magenta Brick
        ];

        // Luminous glowing window material (Pure warm unlit emission for vibrant night haveli glow)
        const windowGlowMat = new THREE.MeshBasicMaterial({ color: 0xffe875 });
        const windowFrameMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.8 });

        // Surrounding houses layout (Tier 1: Courtyard Perimeter, Tier 2: Mid-distance Neighborhood)
        const houses = [
            // --- TIER 1: Courtyard Front Row ---
            // North Row (Behind back courtyard wall z = -26)
            { x: -18, z: -38, w: 10, h: 14, d: 9, pIdx: 0, rotY: 0, hasLight: true },
            { x: 0,   z: -42, w: 13, h: 17, d: 10, pIdx: 1, rotY: 0, hasLight: true },
            { x: 18,  z: -38, w: 10, h: 13, d: 9, pIdx: 2, rotY: 0, hasLight: true },
            { x: -36, z: -48, w: 12, h: 18, d: 11, pIdx: 3, rotY: 0.2, hasLight: true },
            { x: 36,  z: -48, w: 12, h: 18, d: 11, pIdx: 4, rotY: -0.2, hasLight: true },

            // West Row (Left side x = -26)
            { x: -44, z: -14, w: 10, h: 15, d: 11, pIdx: 1, rotY: Math.PI / 2, hasLight: true },
            { x: -45, z: 6,   w: 11, h: 13, d: 10, pIdx: 2, rotY: Math.PI / 2, hasLight: true },
            { x: -43, z: 24,  w: 10, h: 12, d: 10, pIdx: 0, rotY: Math.PI / 2, hasLight: true },

            // East Row (Right side x = +26)
            { x: 44, z: -14, w: 10, h: 14, d: 11, pIdx: 4, rotY: -Math.PI / 2, hasLight: true },
            { x: 45, z: 6,   w: 11, h: 15, d: 10, pIdx: 0, rotY: -Math.PI / 2, hasLight: true },
            { x: 43, z: 24,  w: 10, h: 12, d: 10, pIdx: 3, rotY: -Math.PI / 2, hasLight: true },

            // South Front Corners
            { x: -25, z: 46, w: 10, h: 12, d: 9, pIdx: 2, rotY: Math.PI, hasLight: true },
            { x: 25,  z: 46, w: 10, h: 12, d: 9, pIdx: 1, rotY: Math.PI, hasLight: true },

            // --- TIER 2: Mid-Distance Indian Mohalla Neighborhood (Directly behind & around) ---
            // North Mid-Depth (Peeking directly behind the front houses!)
            { x: -28, z: -58, w: 12, h: 20, d: 11, pIdx: 1, rotY: 0, hasLight: false },
            { x: -10, z: -62, w: 14, h: 23, d: 12, pIdx: 3, rotY: 0, hasLight: false },
            { x: 10,  z: -62, w: 13, h: 22, d: 12, pIdx: 0, rotY: 0, hasLight: false },
            { x: 28,  z: -58, w: 12, h: 19, d: 11, pIdx: 2, rotY: 0, hasLight: false },
            { x: -46, z: -68, w: 14, h: 24, d: 13, pIdx: 4, rotY: 0.15, hasLight: false },
            { x: 46,  z: -68, w: 14, h: 24, d: 13, pIdx: 1, rotY: -0.15, hasLight: false },
            { x: 0,   z: -74, w: 16, h: 26, d: 14, pIdx: 2, rotY: 0, hasLight: false },
            { x: -20, z: -80, w: 13, h: 21, d: 11, pIdx: 0, rotY: 0, hasLight: false },
            { x: 20,  z: -80, w: 13, h: 21, d: 11, pIdx: 3, rotY: 0, hasLight: false },
            { x: -60, z: -54, w: 12, h: 18, d: 11, pIdx: 2, rotY: 0.25, hasLight: false },
            { x: 60,  z: -54, w: 12, h: 18, d: 11, pIdx: 4, rotY: -0.25, hasLight: false },
            { x: -38, z: -84, w: 15, h: 25, d: 13, pIdx: 1, rotY: 0, hasLight: false },
            { x: 38,  z: -84, w: 15, h: 25, d: 13, pIdx: 3, rotY: 0, hasLight: false },
            { x: -2,  z: -90, w: 16, h: 27, d: 14, pIdx: 4, rotY: 0, hasLight: false },

            // West Deep Residential Flank
            { x: -64, z: -32, w: 12, h: 18, d: 12, pIdx: 0, rotY: Math.PI / 2, hasLight: false },
            { x: -66, z: -10, w: 13, h: 20, d: 12, pIdx: 3, rotY: Math.PI / 2, hasLight: false },
            { x: -64, z: 12,  w: 12, h: 17, d: 12, pIdx: 1, rotY: Math.PI / 2, hasLight: false },
            { x: -62, z: 32,  w: 11, h: 16, d: 11, pIdx: 4, rotY: Math.PI / 2, hasLight: false },
            { x: -80, z: -20, w: 14, h: 22, d: 13, pIdx: 2, rotY: Math.PI / 2, hasLight: false },
            { x: -80, z: 8,   w: 14, h: 22, d: 13, pIdx: 0, rotY: Math.PI / 2, hasLight: false },

            // East Deep Residential Flank
            { x: 64, z: -32, w: 12, h: 18, d: 12, pIdx: 2, rotY: -Math.PI / 2, hasLight: false },
            { x: 66, z: -10, w: 13, h: 20, d: 12, pIdx: 1, rotY: -Math.PI / 2, hasLight: false },
            { x: 64, z: 12,  w: 12, h: 17, d: 12, pIdx: 4, rotY: -Math.PI / 2, hasLight: false },
            { x: 62, z: 32,  w: 11, h: 16, d: 11, pIdx: 0, rotY: -Math.PI / 2, hasLight: false },
            { x: 80, z: -20, w: 14, h: 22, d: 13, pIdx: 3, rotY: -Math.PI / 2, hasLight: false },
            { x: 80, z: 8,   w: 14, h: 22, d: 13, pIdx: 2, rotY: -Math.PI / 2, hasLight: false },

            // South Road Flank (Behind camera in Orbit view)
            { x: -40, z: 64, w: 13, h: 17, d: 11, pIdx: 1, rotY: Math.PI, hasLight: false },
            { x: -18, z: 68, w: 14, h: 19, d: 12, pIdx: 4, rotY: Math.PI, hasLight: false },
            { x: 6,   z: 68, w: 14, h: 18, d: 12, pIdx: 0, rotY: Math.PI, hasLight: false },
            { x: 30,  z: 64, w: 13, h: 16, d: 11, pIdx: 3, rotY: Math.PI, hasLight: false }
        ];

        const diyaClayMat = new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.7 });
        const flameMat = new THREE.MeshBasicMaterial({ color: 0xffe047 });

        // Collect 3D Fairy Light coordinates across ALL 37 houses for GPU Instancing (Only 6 Draw Calls!)
        const fairyBatches = [[], [], [], [], [], []];

        houses.forEach((h, hIdx) => {
            const pal = housePalettes[h.pIdx % housePalettes.length];
            const houseGroup = new THREE.Group();

            const wallMat = new THREE.MeshStandardMaterial({
                color: pal.wall,
                roughness: 0.78,
                metalness: 0.1
            });
            const trimMat = new THREE.MeshStandardMaterial({
                color: pal.trim,
                roughness: 0.8
            });

            // 1. Main Building Body
            const mainBody = new THREE.Mesh(new THREE.BoxGeometry(h.w, h.h, h.d), wallMat);
            mainBody.position.y = h.h / 2;
            mainBody.castShadow = true;
            mainBody.receiveShadow = true;
            houseGroup.add(mainBody);

            // 2. Architectural Horizontal Mouldings & Ledgers
            const band1 = new THREE.Mesh(new THREE.BoxGeometry(h.w + 0.35, 0.35, h.d + 0.35), trimMat);
            band1.position.y = h.h * 0.52;
            houseGroup.add(band1);

            const band2 = new THREE.Mesh(new THREE.BoxGeometry(h.w + 0.5, 0.45, h.d + 0.5), trimMat);
            band2.position.y = h.h;
            houseGroup.add(band2);

            // 3. Terrace Parapet Wall on Roof
            const parapetMat = new THREE.MeshStandardMaterial({ color: pal.wall, roughness: 0.8 });
            const parapet = new THREE.Mesh(new THREE.BoxGeometry(h.w + 0.3, 0.9, h.d + 0.3), parapetMat);
            parapet.position.y = h.h + 0.45;
            houseGroup.add(parapet);

            // 4. Balcony (Chhajja) on Front Facade
            const balcony = new THREE.Mesh(new THREE.BoxGeometry(h.w * 0.65, 0.3, 1.4), trimMat);
            balcony.position.set(0, h.h * 0.52, h.d / 2 + 0.7);
            houseGroup.add(balcony);

            const railing = new THREE.Mesh(new THREE.BoxGeometry(h.w * 0.65, 0.75, 0.1), trimMat);
            railing.position.set(0, h.h * 0.52 + 0.45, h.d / 2 + 1.35);
            houseGroup.add(railing);

            // 5. Warm Glowing Multi-Pane Windows
            const numFloors = Math.floor(h.h / 3.8);
            for (let f = 0; f < numFloors; f++) {
                const wy = 2.8 + f * 3.8;
                [-h.w * 0.26, h.w * 0.26].forEach(wx => {
                    // Window Frame
                    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.1, 0.15), windowFrameMat);
                    frame.position.set(wx, wy, h.d / 2 + 0.05);
                    houseGroup.add(frame);

                    // Glowing Glass Pane
                    const pane = new THREE.Mesh(new THREE.PlaneGeometry(1.25, 1.8), windowGlowMat);
                    pane.position.set(wx, wy, h.d / 2 + 0.14);
                    houseGroup.add(pane);

                    // Cross mullion lines
                    const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.8, 0.06), windowFrameMat);
                    crossV.position.set(wx, wy, h.d / 2 + 0.16);
                    houseGroup.add(crossV);

                    const crossH = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.08, 0.06), windowFrameMat);
                    crossH.position.set(wx, wy, h.d / 2 + 0.16);
                    houseGroup.add(crossH);
                });
            }

            // 6. Rooftop & Balcony Diyas with Flickering Flames
            const diyaPoints = [
                new THREE.Vector3(-h.w * 0.35, h.h + 0.9, h.d / 2 + 0.15),
                new THREE.Vector3(0, h.h + 0.9, h.d / 2 + 0.15),
                new THREE.Vector3(h.w * 0.35, h.h + 0.9, h.d / 2 + 0.15),
                new THREE.Vector3(-h.w * 0.22, h.h * 0.52 + 0.85, h.d / 2 + 1.35),
                new THREE.Vector3(h.w * 0.22, h.h * 0.52 + 0.85, h.d / 2 + 1.35)
            ];

            diyaPoints.forEach(dp => {
                const diya = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.14, 0.16, 8), diyaClayMat);
                diya.position.copy(dp);
                houseGroup.add(diya);

                const flame = new THREE.Mesh(this.geoDiyaFlame, flameMat);
                flame.position.copy(dp).add(new THREE.Vector3(0, 0.22, 0));
                houseGroup.add(flame);

                this.terraceDiyaFlames.push({
                    mesh: flame,
                    baseY: flame.position.y,
                    phase: Math.random() * Math.PI * 2
                });
            });

            // 7. Authentic Indian Rooftop Architecture: Sintex Water Tank, Mumty Staircase Cabin, & Dish Antenna
            this.addRooftopDetails(houseGroup, h.w, h.h, h.d, pal.trim);

            // Position & Rotate
            houseGroup.position.set(h.x, 0, h.z);
            houseGroup.rotation.y = h.rotY;
            houseGroup.updateMatrix();
            this.group.add(houseGroup);

            // 8. Generate Festive Fairy Light Points for ALL 37 Houses!
            // Catenary roof swags
            const numSwag = hIdx < 13 ? 12 : 8;
            for (let i = 0; i <= numSwag; i++) {
                const t = i / numSwag;
                const lx = -h.w / 2 + t * h.w;
                const droop = Math.sin(t * Math.PI) * (hIdx < 13 ? 0.72 : 0.42);
                const ly = h.h + 0.85 - droop;
                const lz = h.d / 2 + 0.22;

                const worldPos = new THREE.Vector3(lx, ly, lz).applyMatrix4(houseGroup.matrix);
                const cIdx = (i + hIdx) % 6;
                fairyBatches[cIdx].push(worldPos);
            }

            // Balcony railing lights
            if (hIdx < 18) {
                const bCount = 6;
                for (let i = 0; i <= bCount; i++) {
                    const t = i / bCount;
                    const lx = -h.w * 0.3 + t * (h.w * 0.6);
                    const ly = h.h * 0.52 + 0.85;
                    const lz = h.d / 2 + 1.35;

                    const worldPos = new THREE.Vector3(lx, ly, lz).applyMatrix4(houseGroup.matrix);
                    const cIdx = (i + hIdx * 2) % 6;
                    fairyBatches[cIdx].push(worldPos);
                }
            }

            // Vertical cascading lights for front courtyard row
            if (hIdx < 13) {
                [-h.w / 2 + 0.3, h.w / 2 - 0.3].forEach((xSide, sIdx) => {
                    const numVert = 6;
                    for (let v = 0; v < numVert; v++) {
                        const vy = h.h - 0.6 - v * 1.4;
                        if (vy < 1.5) break;

                        const worldPos = new THREE.Vector3(xSide, vy, h.d / 2 + 0.25).applyMatrix4(houseGroup.matrix);
                        const cIdx = (v + sIdx * 3 + hIdx) % 6;
                        fairyBatches[cIdx].push(worldPos);
                    }
                });
            }
        });

        // 9. Bake all 37 houses' fairy lights into 6 InstancedMesh objects (Zero Draw Call Overhead!)
        const dummy = new THREE.Object3D();
        this.instancedFairyMeshes = [];
        for (let c = 0; c < 6; c++) {
            const batch = fairyBatches[c];
            if (batch.length === 0) continue;

            const instMesh = new THREE.InstancedMesh(this.geoBulb, this.fairyMaterials[c], batch.length);
            for (let i = 0; i < batch.length; i++) {
                dummy.position.copy(batch[i]);
                dummy.scale.set(1, 1, 1);
                dummy.updateMatrix();
                instMesh.setMatrixAt(i, dummy.matrix);
            }
            instMesh.instanceMatrix.needsUpdate = true;
            this.group.add(instMesh);
            this.instancedFairyMeshes.push(instMesh);
        }

        // Lush Greenery & Roadside Trees Between Houses & Along Mohalla Streets
        const foliageMat = new THREE.MeshStandardMaterial({ color: 0x16532d, roughness: 0.8 });
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a2810, roughness: 0.9 });

        const pTrees = [
            // Courtyard border trees
            { x: -28, z: -32 }, { x: 28, z: -32 },
            { x: -32, z: -2 },  { x: 32, z: -2 },
            { x: -28, z: 30 },  { x: 28, z: 30 },
            { x: -10, z: -34 }, { x: 10, z: -34 },
            // Outer mohalla roadside trees
            { x: -22, z: -52 }, { x: 0, z: -54 }, { x: 22, z: -52 },
            { x: -50, z: -34 }, { x: 50, z: -34 },
            { x: -52, z: 12 },  { x: 52, z: 12 },
            { x: -16, z: 50 },  { x: 16, z: 50 }
        ];

        pTrees.forEach(pt => {
            const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.6, 6, 8), trunkMat);
            trunk.position.set(pt.x, 3.0, pt.z);
            trunk.castShadow = true;
            this.group.add(trunk);

            for (let b = 0; b < 3; b++) {
                const crown = new THREE.Mesh(
                    new THREE.DodecahedronGeometry(2.6 - b * 0.35, 1),
                    foliageMat
                );
                crown.position.set(pt.x + (b - 1) * 0.65, 5.8 + b * 1.6, pt.z + (b % 2 - 0.5) * 0.65);
                crown.castShadow = true;
                this.group.add(crown);
            }
        });
    }

    addRooftopDetails(houseGroup, w, h, d, trimColor) {
        if (!this.mumtyMat) {
            this.mumtyMat = new THREE.MeshStandardMaterial({ color: 0x4a1f1b, roughness: 0.85 });
            this.mumtyDoorMat = new THREE.MeshStandardMaterial({ color: 0x271406, roughness: 0.9 });
            this.sintexMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.6, metalness: 0.2 });
            this.sintexLidMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.5 });
            this.sintexRingMat = new THREE.MeshBasicMaterial({ color: 0xe4e4e7 });
            this.dishPoleMat = new THREE.MeshStandardMaterial({ color: 0x71717a, roughness: 0.5, metalness: 0.5 });
            this.dishMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, roughness: 0.4 });
        }

        // 1. Terrace Mumty (Staircase Cabin)
        const mumtyW = Math.min(3.0, w * 0.35);
        const mumtyH = 2.6;
        const mumtyD = Math.min(3.2, d * 0.4);
        const mumty = new THREE.Mesh(new THREE.BoxGeometry(mumtyW, mumtyH, mumtyD), this.mumtyMat);
        const mx = w * 0.22;
        const my = h + mumtyH / 2;
        const mz = -d * 0.15;
        mumty.position.set(mx, my, mz);
        mumty.castShadow = true;
        mumty.receiveShadow = true;
        houseGroup.add(mumty);

        // Mumty Door
        const door = new THREE.Mesh(new THREE.BoxGeometry(mumtyW * 0.45, 1.8, 0.08), this.mumtyDoorMat);
        door.position.set(mx, h + 0.95, mz + mumtyD / 2 + 0.04);
        houseGroup.add(door);

        // Mumty Roof Slab
        const mSlab = new THREE.Mesh(new THREE.BoxGeometry(mumtyW + 0.35, 0.2, mumtyD + 0.35), this.mumtyMat);
        mSlab.position.set(mx, h + mumtyH + 0.1, mz);
        houseGroup.add(mSlab);

        // 2. Sintex Water Tank (Iconic Indian Black Tank)
        const tankR = 0.72;
        const tankH = 1.35;
        const tx = -w * 0.28;
        const ty = h + tankH / 2 + 0.2;
        const tz = -d * 0.18;

        // Base Plinth
        const plinth = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.25, 1.8), this.mumtyMat);
        plinth.position.set(tx, h + 0.125, tz);
        houseGroup.add(plinth);

        // Main Tank
        const tank = new THREE.Mesh(new THREE.CylinderGeometry(tankR, tankR, tankH, 12), this.sintexMat);
        tank.position.set(tx, ty, tz);
        tank.castShadow = true;
        houseGroup.add(tank);

        // Tank Lid
        const lid = new THREE.Mesh(new THREE.CylinderGeometry(tankR * 1.08, tankR * 1.08, 0.14, 12), this.sintexLidMat);
        lid.position.set(tx, ty + tankH / 2 + 0.07, tz);
        houseGroup.add(lid);

        // 3 Rib Rings around Sintex Tank
        [-0.32, 0, 0.32].forEach(ry => {
            const ring = new THREE.Mesh(new THREE.CylinderGeometry(tankR + 0.02, tankR + 0.02, 0.05, 12), this.sintexRingMat);
            ring.position.set(tx, ty + ry, tz);
            houseGroup.add(ring);
        });

        // 3. Tata Sky / Airtel DTH TV Dish Antenna
        if (Math.random() < 0.65) {
            const dx = (Math.random() > 0.5 ? 1 : -1) * (w * 0.38);
            const dz = d * 0.35;
            const poleH = 1.1;

            const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, poleH, 6), this.dishPoleMat);
            pole.position.set(dx, h + 0.9 + poleH / 2, dz);
            houseGroup.add(pole);

            const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.06, 12), this.dishMat);
            dish.position.set(dx, h + 0.9 + poleH, dz);
            dish.rotation.x = 0.65;
            dish.rotation.y = (Math.random() - 0.5) * 0.5;
            houseGroup.add(dish);

            const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.45, 6), this.dishPoleMat);
            arm.position.set(dx, h + 0.9 + poleH + 0.15, dz + 0.22);
            arm.rotation.x = -0.4;
            houseGroup.add(arm);
        }
    }

    createSkylineWindowTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        // Dark skyscraper facade background
        ctx.fillStyle = '#0a0814';
        ctx.fillRect(0, 0, 256, 256);

        // Floor division lines
        ctx.strokeStyle = '#120e24';
        ctx.lineWidth = 2;
        for (let y = 0; y < 256; y += 32) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(256, y);
            ctx.stroke();
        }

        // Window grid: 8 cols x 8 rows
        const cols = 8;
        const rows = 8;
        const cellW = 256 / cols;
        const cellH = 256 / rows;
        const winW = cellW * 0.54;
        const winH = cellH * 0.54;

        let seed = 12345;
        const rng = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };

        const warmLitColors = [
            '#fef08a', // Bright warm yellow
            '#facc15', // Amber gold
            '#fb923c', // Warm orange
            '#fed7aa', // Soft peach
            '#fef3c7', // Cream
            '#e0f2fe'  // Soft sky white
        ];

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const wx = c * cellW + (cellW - winW) / 2;
                const wy = r * cellH + (cellH - winH) / 2;

                if (rng() > 0.35) {
                    ctx.fillStyle = warmLitColors[Math.floor(rng() * warmLitColors.length)];
                    ctx.fillRect(wx, wy, winW, winH);

                    // Inner border for realism
                    ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(wx, wy, winW, winH);
                } else {
                    ctx.fillStyle = '#141122';
                    ctx.fillRect(wx, wy, winW, winH);
                }
            }
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        return tex;
    }

    initDistantSkyline() {
        const skylineTex = this.createSkylineWindowTexture();
        const towersGroup = new THREE.Group();

        // City skyline towers layout (Surrounding the entire horizon)
        const towers = [
            // --- North Skyline (Directly behind the courtyard houses) ---
            { x: -130, z: -120, w: 20, h: 42, d: 18, beacon: false },
            { x: -105, z: -138, w: 22, h: 50, d: 20, beacon: true },
            { x: -80,  z: -118, w: 18, h: 36, d: 16, beacon: false },
            { x: -56,  z: -132, w: 22, h: 48, d: 18, beacon: false },
            { x: -35,  z: -115, w: 18, h: 38, d: 16, beacon: false },
            { x: -12,  z: -142, w: 25, h: 58, d: 22, beacon: true }, // Main North High-Rise Tower with Beacon!
            { x: 12,   z: -122, w: 19, h: 40, d: 17, beacon: false },
            { x: 36,   z: -140, w: 24, h: 52, d: 20, beacon: true },
            { x: 60,   z: -118, w: 18, h: 36, d: 16, beacon: false },
            { x: 84,   z: -134, w: 22, h: 46, d: 18, beacon: false },
            { x: 108,  z: -120, w: 19, h: 40, d: 17, beacon: false },
            { x: 130,  z: -138, w: 22, h: 48, d: 20, beacon: true },

            // North Deep Horizon Row (Taller background silhouettes)
            { x: -95, z: -158, w: 26, h: 54, d: 22, beacon: false },
            { x: -45, z: -164, w: 28, h: 62, d: 24, beacon: false },
            { x: 0,   z: -168, w: 32, h: 68, d: 26, beacon: true },
            { x: 50,  z: -162, w: 28, h: 58, d: 24, beacon: false },
            { x: 95,  z: -156, w: 26, h: 52, d: 22, beacon: false },

            // --- West Skyline (Left horizon) ---
            { x: -125, z: -80, w: 20, h: 44, d: 18, beacon: false },
            { x: -138, z: -40, w: 22, h: 52, d: 20, beacon: true },
            { x: -122, z: 0,   w: 19, h: 38, d: 17, beacon: false },
            { x: -135, z: 40,  w: 22, h: 46, d: 19, beacon: false },
            { x: -124, z: 75,  w: 19, h: 38, d: 17, beacon: false },

            // --- East Skyline (Right horizon) ---
            { x: 125, z: -80, w: 20, h: 44, d: 18, beacon: false },
            { x: 138, z: -40, w: 22, h: 52, d: 20, beacon: true },
            { x: 122, z: 0,   w: 19, h: 38, d: 17, beacon: false },
            { x: 135, z: 40,  w: 22, h: 46, d: 19, beacon: false },
            { x: 124, z: 75,  w: 19, h: 38, d: 17, beacon: false },

            // --- South Skyline (Behind camera in Orbit view) ---
            { x: -65, z: 115, w: 22, h: 42, d: 18, beacon: false },
            { x: -22, z: 128, w: 24, h: 48, d: 20, beacon: true },
            { x: 22,  z: 128, w: 24, h: 48, d: 20, beacon: false },
            { x: 65,  z: 115, w: 22, h: 42, d: 18, beacon: false }
        ];

        const mastMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.7, roughness: 0.4 });
        const beaconMat = new THREE.MeshBasicMaterial({ color: 0xff2222, transparent: true, opacity: 1.0 });

        const towerMat = new THREE.MeshStandardMaterial({
            map: skylineTex,
            roughness: 0.75,
            metalness: 0.15,
            emissive: 0xffaa33,
            emissiveMap: skylineTex,
            emissiveIntensity: 0.55
        });

        towers.forEach(t => {
            const mesh = new THREE.Mesh(new THREE.BoxGeometry(t.w, t.h, t.d), towerMat);
            mesh.position.set(t.x, t.h / 2, t.z);
            mesh.receiveShadow = false;
            towersGroup.add(mesh);

            // Roof Parapet / Mech room on top
            const roofCabin = new THREE.Mesh(
                new THREE.BoxGeometry(t.w * 0.4, 3.5, t.d * 0.4),
                new THREE.MeshStandardMaterial({ color: 0x1e1b2e, roughness: 0.8 })
            );
            roofCabin.position.set(t.x, t.h + 1.75, t.z);
            towersGroup.add(roofCabin);

            // Blinking Red Aviation Beacon Tower
            if (t.beacon) {
                const mastH = 11;
                const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.5, mastH, 4), mastMat);
                mast.position.set(t.x, t.h + 3.5 + mastH / 2, t.z);
                towersGroup.add(mast);

                const beacon = new THREE.Mesh(
                    new THREE.SphereGeometry(0.65, 8, 8),
                    beaconMat.clone()
                );
                beacon.position.set(t.x, t.h + 3.5 + mastH + 0.3, t.z);
                towersGroup.add(beacon);

                this.beaconLights.push(beacon);
            }
        });

        this.group.add(towersGroup);
    }

    initAmbientLanterns() {
        // Continuous, serene ambient Akash Diyas (Sky Lanterns) drifting across the evening skyline
        const lanternMat = new THREE.MeshStandardMaterial({
            color: 0xf59e0b,
            emissive: 0xf59e0b,
            emissiveIntensity: 0.85,
            roughness: 0.35,
            transparent: true,
            opacity: 0.92
        });

        for (let i = 0; i < 8; i++) {
            const group = new THREE.Group();
            const body = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.48, 1.4, 10), lanternMat);
            body.position.y = 0.7;
            group.add(body);

            const dome = new THREE.Mesh(new THREE.SphereGeometry(0.7, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), lanternMat);
            dome.position.y = 1.4;
            group.add(dome);

            const flame = new THREE.Mesh(
                new THREE.SphereGeometry(0.18, 6, 6),
                new THREE.MeshBasicMaterial({ color: 0xffffff })
            );
            flame.position.y = 0.35;
            group.add(flame);

            // Stagger initial positions across wide background
            const ang = (i / 8) * Math.PI * 1.6 - Math.PI * 0.3;
            const dist = 65 + Math.random() * 45;
            const lx = Math.sin(ang) * dist;
            const lz = -Math.abs(Math.cos(ang) * dist) - 15;
            const ly = 18 + Math.random() * 26;

            group.position.set(lx, ly, lz);
            this.group.add(group);

            this.ambientLanterns.push({
                group,
                baseX: lx,
                baseZ: lz,
                velY: 0.5 + Math.random() * 0.4,
                driftX: (Math.random() - 0.5) * 0.6,
                phase: Math.random() * Math.PI * 2
            });
        }
    }

    initGLTFAssets() {
        if (!this.loader) return;

        // Load Sharma ji's parked vehicle (convoy-scout.glb)
        this.loader.load(
            'assets/models/vehicles/convoy-scout.glb',
            (gltf) => {
                const car = gltf.scene;
                car.scale.setScalar(1.6);
                car.position.set(12, 0, 31);
                car.rotation.y = -Math.PI / 2 + 0.15;

                // 1. Remove military turret & gun on roof -> convert into civilian luxury Indian SUV!
                const gunMount = car.getObjectByName('GunMount');
                if (gunMount) gunMount.visible = false;
                const muzzle = car.getObjectByName('Muzzle');
                if (muzzle) muzzle.visible = false;

                // 2. High-Gloss Metallic Cherry Crimson Red & Luxury Materials
                const luxuryPaintMat = new THREE.MeshStandardMaterial({
                    color: 0xc41230, // Stunning Metallic Cherry Crimson Red
                    roughness: 0.16, // Wet high-gloss car paint reflection
                    metalness: 0.78  // Deep metallic car paint shimmer
                });

                const tintedGlassMat = new THREE.MeshStandardMaterial({
                    color: 0x090d16, // Deep tinted privacy glass
                    roughness: 0.05,
                    metalness: 0.92,
                    transparent: true,
                    opacity: 0.88
                });

                const tyreMat = new THREE.MeshStandardMaterial({
                    color: 0x141416, // Clean matte black rubber
                    roughness: 0.88,
                    metalness: 0.08
                });

                const chromeRimMat = new THREE.MeshStandardMaterial({
                    color: 0xe2e8f0, // Polished Chrome / Silver Alloy Wheel Rims
                    roughness: 0.12,
                    metalness: 0.96
                });

                car.traverse(child => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;

                        // Apply luxury paint and trims
                        if (Array.isArray(child.material)) {
                            child.material = child.material.map((m, idx) => {
                                if (child.name.includes('Wheel')) {
                                    return idx === 0 ? tyreMat : chromeRimMat;
                                }
                                if (idx === 0) return luxuryPaintMat;
                                if (idx === 1) return tintedGlassMat;
                                return tyreMat;
                            });
                        } else if (child.material) {
                            const mName = child.material.name || '';
                            if (mName.includes('paint') || mName.includes('hardware')) {
                                child.material = child.name.includes('Wheel') ? chromeRimMat : luxuryPaintMat;
                            } else if (mName.includes('glass') || mName.includes('lens')) {
                                child.material = tintedGlassMat;
                            } else if (mName.includes('Rubber')) {
                                child.material = tyreMat;
                            }
                        }
                    }
                });

                // 3. Bright Xenon LED Headlights (Front of car facing road)
                const headlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
                const hlFrontL = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.08, 12), headlightMat);
                hlFrontL.rotation.x = Math.PI / 2;
                hlFrontL.position.set(-0.85, 0.82, 1.98);
                car.add(hlFrontL);

                const hlFrontR = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.08, 12), headlightMat);
                hlFrontR.rotation.x = Math.PI / 2;
                hlFrontR.position.set(0.85, 0.82, 1.98);
                car.add(hlFrontR);

                // 4. Ruby Red LED Tail Lights (Back of car)
                const tailMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
                const tlBackL = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.08, 12), tailMat);
                tlBackL.rotation.x = Math.PI / 2;
                tlBackL.position.set(-0.9, 0.85, -1.98);
                car.add(tlBackL);

                const tlBackR = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.08, 12), tailMat);
                tlBackR.rotation.x = Math.PI / 2;
                tlBackR.position.set(0.9, 0.85, -1.98);
                car.add(tlBackR);

                // 5. Amber Hazard Lights for Car Alarm
                const hazardMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
                const hz1 = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), hazardMat);
                hz1.position.set(-1.08, 0.82, 1.9);
                car.add(hz1);

                const hz2 = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), hazardMat);
                hz2.position.set(1.08, 0.82, 1.9);
                car.add(hz2);

                const hz3 = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), hazardMat);
                hz3.position.set(-1.08, 0.85, -1.9);
                car.add(hz3);

                const hz4 = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), hazardMat);
                hz4.position.set(1.08, 0.85, -1.9);
                car.add(hz4);

                this.hazardLights = [hz1, hz2, hz3, hz4];
                this.sharmaCar = car;
                this.group.add(car);
            },
            undefined,
            () => {}
        );
    }

    triggerCarAlarm() {
        this.carAlarmBlinking = true;
        this.carAlarmTimer = 4.2;
        if (this.audio && typeof this.audio.playCarAlarm === 'function') {
            this.audio.playCarAlarm();
        }
    }

    /***************************************************************************
     * VIBRANT AMBIENT MOHALLA PUBLIC FIREWORKS ENGINE (High-Performance Pooled)
     * Continuous, Multi-Point Sky Explosions Across The Neighborhood (Zero GC!)
     ***************************************************************************/
    launchAmbientSkyShot(forcedX = null) {
        // Wide horizon launch origin behind houses
        const startX = forcedX !== null ? forcedX : (Math.random() - 0.5) * 140;
        const startZ = -45 - Math.random() * 55;
        // Explode directly in player's field of view right above the rooftops: 22m - 38m!
        const apexY = 22 + Math.random() * 16;

        const colorPalettes = [
            { type: 'willow',  m1: 'gold',   m2: 'amber',   name: 'Golden Brocade Willow' },
            { type: 'peony',   m1: 'rose',   m2: 'cyan',    name: 'Royal Magenta & Cyan Peony' },
            { type: 'desi',    m1: 'emerald',m2: 'orange',  name: 'Emerald & Saffron Diwali' },
            { type: 'purple',  m1: 'purple', m2: 'gold',    name: 'Royal Violet & 24K Gold' },
            { type: 'strobe',  m1: 'white',  m2: 'cyan',    name: 'Silver Strobe Glitter' },
            { type: 'rainbow', m1: 'red',    m2: 'gold',    name: 'Multicolor Festival Cake' }
        ];
        const chosen = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];

        // Reusable ascending rocket head
        if (!this.rocketHeadMat) {
            this.rocketHeadMat = new THREE.MeshBasicMaterial({ color: 0xfff3a0 });
        }
        const rMesh = new THREE.Mesh(this.geoRocket, this.rocketHeadMat);
        rMesh.position.set(startX, 4, startZ);
        this.scene.add(rMesh);

        this.skyRockets.push({
            mesh: rMesh,
            pos: new THREE.Vector3(startX, 4, startZ),
            targetY: apexY,
            speedY: 28 + Math.random() * 8,
            palette: chosen,
            driftX: (Math.random() - 0.5) * 3
        });
    }

    explodeSkyRocket(rocket) {
        const pos = rocket.pos.clone();
        const pal = rocket.palette;

        // 1. Distant stereo audio boom
        const stereoPan = Math.max(-0.9, Math.min(0.9, pos.x / 75));
        if (this.audio && typeof this.audio.playDistantSkyBurst === 'function') {
            this.audio.playDistantSkyBurst(stereoPan);
        }

        // 2. Sky flash illumination
        const flashCol = pal.m1 === 'rose' ? 0xf43f5e : (pal.m1 === 'emerald' ? 0x10b981 : 0xfde047);
        this.triggerSkyFlash(pos, flashCol, 15);

        // 3. Dense, colorful 3D star explosion using pre-allocated pool (Zero memory garbage collection)
        const numStars = pal.type === 'willow' ? 65 : 50;
        let spawned = 0;

        for (let i = 0; i < this.skyStarPool.length && spawned < numStars; i++) {
            const star = this.skyStarPool[i];
            if (star.active) continue;

            const phi = Math.random() * Math.PI * 2;
            const costheta = Math.random() * 2 - 1;
            const theta = Math.acos(costheta);
            const speed = (pal.type === 'willow' ? 10 : 14) + Math.random() * 11;

            star.vel.set(
                speed * Math.sin(theta) * Math.cos(phi),
                speed * Math.cos(theta),
                speed * Math.sin(theta) * Math.sin(phi)
            );

            let chosenMat;
            if (pal.type === 'rainbow') {
                chosenMat = this.starMatList[spawned % this.starMatList.length];
            } else {
                chosenMat = (spawned % 2 === 0) ?
                    (this.starMats[pal.m1] || this.starMats.gold) :
                    (this.starMats[pal.m2] || this.starMats.amber);
            }

            star.mesh.material = chosenMat;
            star.mesh.position.copy(pos);
            star.mesh.scale.setScalar(1.0);
            star.mesh.visible = true;
            star.gravity = pal.type === 'willow' ? -6.5 : -10.5;
            star.drag = pal.type === 'willow' ? 0.975 : 0.965;
            star.life = pal.type === 'willow' ? 2.5 : 1.8;
            star.maxLife = star.life;
            star.isStrobe = pal.type === 'strobe';
            star.strobePhase = Math.random() * 10;
            star.active = true;
            spawned++;
        }
    }

    update(dt, currentDb) {
        // 1. Animate Festive Fairy Lights across ALL 37 houses (Instant 0.001ms material modulation)
        const nowSec = performance.now() * 0.005;
        for (let c = 0; c < 6; c++) {
            const wave = Math.sin(nowSec * 3.5 + c * 1.05);
            if (this.fairyMaterials && this.fairyMaterials[c]) {
                const baseCol = this.fairyBaseColors[c];
                this.fairyMaterials[c].color.setHex(wave > -0.3 ? baseCol : 0x221a10);
            }
        }

        // 2. Flicker Terrace Diya Flames
        for (let i = 0; i < this.terraceDiyaFlames.length; i++) {
            const d = this.terraceDiyaFlames[i];
            d.phase += dt * 10;
            d.mesh.scale.y = 0.85 + Math.sin(d.phase) * 0.22;
            d.mesh.position.y = d.baseY + Math.sin(d.phase) * 0.04;
        }

        // 3. Update Ambient Floating Sky Lanterns (Akash Diyas)
        for (let i = 0; i < this.ambientLanterns.length; i++) {
            const al = this.ambientLanterns[i];
            al.group.position.y += al.velY * dt;
            al.group.position.x += al.driftX * dt;
            al.phase += dt * 1.5;
            al.group.position.x += Math.sin(al.phase) * 0.02;

            if (al.group.position.y > 54) {
                al.group.position.y = 16;
                al.group.position.x = al.baseX + (Math.random() - 0.5) * 15;
            }
        }

        // 4. Autonomous Ambient Public Fireworks Spawner (Steady celebration cadence for 60 FPS)
        this.skyShotTimer -= dt;
        if (this.skyShotTimer <= 0) {
            this.launchAmbientSkyShot();

            // 25% chance of simultaneous celebration burst from other side
            if (Math.random() < 0.25) {
                const sideX = (Math.random() > 0.5 ? 1 : -1) * (35 + Math.random() * 40);
                setTimeout(() => this.launchAmbientSkyShot(sideX), 240);
            }

            this.skyShotTimer = 1.3 + Math.random() * 0.7;
        }

        // 5. Update Ascending Sky Rockets & Fiery Trails (Using trail pool)
        for (let i = this.skyRockets.length - 1; i >= 0; i--) {
            const r = this.skyRockets[i];
            r.pos.y += r.speedY * dt;
            r.pos.x += r.driftX * dt;
            r.mesh.position.copy(r.pos);

            // Fiery golden ascending trail using pooled particles
            if (Math.random() < 0.75) {
                const tr = this.trailPool.find(t => !t.active);
                if (tr) {
                    tr.active = true;
                    tr.mesh.position.copy(r.pos).add(new THREE.Vector3(0, -0.6, 0));
                    tr.mesh.visible = true;
                    tr.vel.set((Math.random() - 0.5) * 1.5, -6, (Math.random() - 0.5) * 1.5);
                    tr.life = 0.35;
                    tr.maxLife = 0.35;
                }
            }

            if (r.pos.y >= r.targetY) {
                this.explodeSkyRocket(r);
                this.scene.remove(r.mesh);
                r.mesh.geometry.dispose();
                this.skyRockets.splice(i, 1);
            }
        }

        // Update Rocket Trails
        for (let i = 0; i < this.trailPool.length; i++) {
            const tr = this.trailPool[i];
            if (!tr.active) continue;
            tr.life -= dt;
            if (tr.life <= 0) {
                tr.active = false;
                tr.mesh.visible = false;
                continue;
            }
            tr.vel.y -= 5 * dt;
            tr.mesh.position.addScaledVector(tr.vel, dt);
        }

        // 6. Update Blooming Sky Firework Particles (Pool based, zero GC)
        for (let i = 0; i < this.skyStarPool.length; i++) {
            const p = this.skyStarPool[i];
            if (!p.active) continue;

            p.life -= dt;
            if (p.life <= 0) {
                p.active = false;
                p.mesh.visible = false;
                continue;
            }

            p.vel.y += p.gravity * dt;
            p.vel.multiplyScalar(p.drag);
            p.mesh.position.addScaledVector(p.vel, dt);

            const ratio = p.life / p.maxLife;

            if (p.isStrobe) {
                p.strobePhase += dt * 30;
                p.mesh.visible = Math.sin(p.strobePhase) > -0.2;
            }

            p.mesh.scale.setScalar(Math.max(0.3, ratio * 1.15));
        }

        // 7. Update Sky Light Flash
        const f = this.skyLightFlashes[0];
        if (f && f.life > 0) {
            f.life -= dt;
            f.light.intensity = Math.max(0, (f.life / f.maxLife) * f.peak);
        } else if (f) {
            f.light.intensity = 0;
        }

        // 8. Sharma ji's Car Alarm
        if (currentDb > 70 && !this.carAlarmBlinking) {
            this.triggerCarAlarm();
        }

        if (this.carAlarmBlinking) {
            this.carAlarmTimer -= dt;
            const blink = Math.sin(performance.now() * 0.02) > 0;
            for (let i = 0; i < this.hazardLights.length; i++) {
                this.hazardLights[i].visible = blink;
            }

            if (this.carAlarmTimer <= 0) {
                this.carAlarmBlinking = false;
                for (let i = 0; i < this.hazardLights.length; i++) {
                    this.hazardLights[i].visible = false;
                }
            }
        }

        // 9. Synchronized Pulsing Red Aviation Beacons on Skyline Towers
        const beaconOn = Math.sin(performance.now() * 0.0035) > 0.05;
        for (let i = 0; i < this.beaconLights.length; i++) {
            this.beaconLights[i].material.opacity = beaconOn ? 1.0 : 0.12;
        }
    }

    createBillboardTexture(type) {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        if (type === 'unlocked') {
            // UNLOCKED SPONSOR (https://unlocked.devs.surf/)
            const bgGrad = ctx.createLinearGradient(0, 0, 1024, 512);
            bgGrad.addColorStop(0, '#040814');
            bgGrad.addColorStop(0.5, '#0b162c');
            bgGrad.addColorStop(1, '#060a17');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, 1024, 512);

            // Subtle Cyber Grid Pattern
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.12)';
            ctx.lineWidth = 1;
            for (let x = 0; x < 1024; x += 40) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 512); ctx.stroke();
            }
            for (let y = 0; y < 512; y += 40) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1024, y); ctx.stroke();
            }

            // Glowing Outer Neon Frame
            ctx.strokeStyle = '#06b6d4';
            ctx.lineWidth = 10;
            ctx.shadowColor = '#06b6d4';
            ctx.shadowBlur = 24;
            ctx.strokeRect(18, 18, 988, 476);

            // Inner Gold Accent Frame
            ctx.shadowBlur = 0;
            ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
            ctx.lineWidth = 2.5;
            ctx.strokeRect(30, 30, 964, 452);

            // Top Badge
            ctx.fillStyle = '#f59e0b';
            ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('⚡ OFFICIAL DIWALI SPONSOR', 512, 74);

            // Brand Title: UNLOCKED
            ctx.fillStyle = '#ffffff';
            ctx.font = '900 86px system-ui, -apple-system, sans-serif';
            ctx.shadowColor = '#06b6d4';
            ctx.shadowBlur = 35;
            ctx.fillText('UNLOCKED', 512, 178);
            ctx.shadowBlur = 0;

            // Brand Tagline
            ctx.fillStyle = '#93c5fd';
            ctx.font = '600 24px system-ui, -apple-system, sans-serif';
            ctx.fillText('MODERN WEB • CLOUD & TECH INNOVATIONS', 512, 226);

            // Prominent URL Button / Pill
            const pillX = 200, pillY = 268, pillW = 624, pillH = 92, pillR = 46;
            ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
            ctx.beginPath();
            ctx.roundRect(pillX, pillY, pillW, pillH, pillR);
            ctx.fill();

            ctx.strokeStyle = '#22d3ee';
            ctx.lineWidth = 4;
            ctx.shadowColor = '#22d3ee';
            ctx.shadowBlur = 20;
            ctx.stroke();
            ctx.shadowBlur = 0;

            // URL Text inside Pill
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 36px monospace, sans-serif';
            ctx.fillText('🔗 https://unlocked.devs.surf/', 512, 327);

            // Bottom Festive Sub-bar
            ctx.fillStyle = '#fbbf24';
            ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
            ctx.fillText('🪔 CLICK TO VISIT • SHUBH DEEPAWALI 🪔', 512, 436);

        } else {
            // JAYFRONT SPONSOR (jayfront.devs.surf)
            const bgGrad = ctx.createLinearGradient(0, 0, 1024, 512);
            bgGrad.addColorStop(0, '#100518');
            bgGrad.addColorStop(0.5, '#220b33');
            bgGrad.addColorStop(1, '#0e0416');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, 1024, 512);

            // Subtle Design Grid Pattern
            ctx.strokeStyle = 'rgba(236, 72, 153, 0.12)';
            ctx.lineWidth = 1;
            for (let x = 0; x < 1024; x += 40) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 512); ctx.stroke();
            }
            for (let y = 0; y < 512; y += 40) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1024, y); ctx.stroke();
            }

            // Glowing Outer Neon Frame
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 10;
            ctx.shadowColor = '#f59e0b';
            ctx.shadowBlur = 24;
            ctx.strokeRect(18, 18, 988, 476);

            // Inner Rose Accent Frame
            ctx.shadowBlur = 0;
            ctx.strokeStyle = 'rgba(244, 63, 94, 0.6)';
            ctx.lineWidth = 2.5;
            ctx.strokeRect(30, 30, 964, 452);

            // Top Badge
            ctx.fillStyle = '#10b981';
            ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('✨ PRESENTING SPONSOR', 512, 74);

            // Brand Title: JAYFRONT
            ctx.fillStyle = '#ffffff';
            ctx.font = '900 86px system-ui, -apple-system, sans-serif';
            ctx.shadowColor = '#f59e0b';
            ctx.shadowBlur = 35;
            ctx.fillText('JAYFRONT', 512, 178);
            ctx.shadowBlur = 0;

            // Brand Tagline
            ctx.fillStyle = '#fbcfe8';
            ctx.font = '600 24px system-ui, -apple-system, sans-serif';
            ctx.fillText('CREATIVE FRONTEND & INTERACTIVE 3D LAB', 512, 226);

            // Prominent URL Button / Pill
            const pillX = 200, pillY = 268, pillW = 624, pillH = 92, pillR = 46;
            ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
            ctx.beginPath();
            ctx.roundRect(pillX, pillY, pillW, pillH, pillR);
            ctx.fill();

            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 4;
            ctx.shadowColor = '#fbbf24';
            ctx.shadowBlur = 20;
            ctx.stroke();
            ctx.shadowBlur = 0;

            // URL Text inside Pill
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 38px monospace, sans-serif';
            ctx.fillText('🚀 jayfront.devs.surf 🔗', 512, 327);

            // Bottom Festive Sub-bar
            ctx.fillStyle = '#34d399';
            ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
            ctx.fillText('🪔 CLICK TO EXPLORE • HAPPY DIWALI 🪔', 512, 436);
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.anisotropy = 4;
        return texture;
    }

    initSponsorBillboards() {
        const billboardConfigs = [
            {
                type: 'unlocked',
                url: 'https://unlocked.devs.surf/',
                name: 'Unlocked (unlocked.devs.surf)',
                x: -18,
                roofY: 14,
                z: -38,
                rotY: 0.14,
                width: 11,
                height: 5.5
            },
            {
                type: 'jayfront',
                url: 'https://jayfront.devs.surf/',
                name: 'Jayfront (jayfront.devs.surf)',
                x: 18,
                roofY: 14,
                z: -38,
                rotY: -0.14,
                width: 11,
                height: 5.5
            }
        ];

        const trussMat = new THREE.MeshStandardMaterial({
            color: 0x334155,
            metalness: 0.85,
            roughness: 0.35
        });
        const backplateMat = new THREE.MeshStandardMaterial({
            color: 0x09090e,
            roughness: 0.5,
            metalness: 0.8
        });
        const lampMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

        billboardConfigs.forEach(cfg => {
            const group = new THREE.Group();
            group.position.set(cfg.x, cfg.roofY, cfg.z);
            group.rotation.y = cfg.rotY;

            const legH = 2.8;
            const bY = legH + cfg.height / 2;

            // 1. Steel Truss Legs (4 posts)
            const postGeo = new THREE.CylinderGeometry(0.12, 0.12, legH, 6);
            const xOffsets = [-cfg.width * 0.42, -cfg.width * 0.15, cfg.width * 0.15, cfg.width * 0.42];
            xOffsets.forEach(xo => {
                const leg = new THREE.Mesh(postGeo, trussMat);
                leg.position.set(xo, legH / 2, 0);
                group.add(leg);

                // Diagonal cross-brace
                const brace = new THREE.Mesh(new THREE.BoxGeometry(0.08, legH * 1.05, 0.08), trussMat);
                brace.position.set(xo * 0.85, legH / 2, 0);
                brace.rotation.z = (xo < 0 ? 0.35 : -0.35);
                group.add(brace);
            });

            // 2. Heavy Backplate Frame
            const backMesh = new THREE.Mesh(
                new THREE.BoxGeometry(cfg.width + 0.5, cfg.height + 0.5, 0.45),
                backplateMat
            );
            backMesh.position.set(0, bY, -0.05);
            group.add(backMesh);

            // 3. Glowing Neon Border Edge
            const borderMat = new THREE.MeshBasicMaterial({
                color: cfg.type === 'unlocked' ? 0x06b6d4 : 0xf59e0b
            });
            const borderMesh = new THREE.Mesh(
                new THREE.BoxGeometry(cfg.width + 0.16, cfg.height + 0.16, 0.52),
                borderMat
            );
            borderMesh.position.set(0, bY, -0.06);
            group.add(borderMesh);

            // 4. Front High-Res Canvas Texture Face (MeshBasicMaterial = Self-Illuminated Glowing Display!)
            const texture = this.createBillboardTexture(cfg.type);
            const faceMat = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: false
            });
            const faceMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(cfg.width, cfg.height),
                faceMat
            );
            faceMesh.position.set(0, bY, 0.22);
            faceMesh.userData = {
                isSponsorBillboard: true,
                url: cfg.url,
                name: cfg.name
            };
            group.add(faceMesh);
            this.sponsorBillboards.push(faceMesh);

            // 5. Overhead Floodlight Fixtures (3 spot lamps per billboard)
            const lampArmGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.9, 5);
            [-cfg.width * 0.35, 0, cfg.width * 0.35].forEach(lx => {
                const arm = new THREE.Mesh(lampArmGeo, trussMat);
                arm.position.set(lx, bY + cfg.height / 2 + 0.45, 0.4);
                arm.rotation.x = Math.PI / 4;
                group.add(arm);

                const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.18, 6, 6), lampMat);
                bulb.position.set(lx, bY + cfg.height / 2 + 0.75, 0.7);
                group.add(bulb);
            });

            this.group.add(group);
        });
    }
}

window.MohallaEnvironment = MohallaEnvironment;
