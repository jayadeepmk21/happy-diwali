/**
 * Patakha Definitions & Simulation Engine
 * 10 Iconic Indian Crackers with accurate 3D procedural meshes, fuses, and custom detonation effects.
 */

const PATAKHA_DEFINITIONS = [
    {
        id: 'sutli',
        name: 'Sutli Bomb',
        hindiName: 'सुतली बम',
        subtitle: 'Rassi Bomb • Heavy Bass Blast',
        icon: '🧶',
        badgeColor: 'from-emerald-500 to-green-700',
        fuseTime: 1.8,
        blastRadius: 12,
        blastForce: 36,
        key: '1'
    },
    {
        id: 'lakshmi',
        name: 'Lakshmi Bomb',
        hindiName: 'लक्ष्मी बम',
        subtitle: 'Classic Red Cracker • Sharp Crack',
        icon: '🧨',
        badgeColor: 'from-red-500 to-rose-700',
        fuseTime: 1.3,
        blastRadius: 8.5,
        blastForce: 20,
        key: '2'
    },
    {
        id: 'lar',
        name: '1000-Wala Lar',
        hindiName: 'हज़ार वाली लड़ी',
        subtitle: '24-Cracker Chain • Non-Stop Masti',
        icon: '⛓️',
        badgeColor: 'from-orange-500 to-red-600',
        fuseTime: 1.0,
        blastRadius: 6,
        blastForce: 10,
        key: '3'
    },
    {
        id: 'anaar',
        name: 'Royal Anaar',
        hindiName: 'रॉयल अनार',
        subtitle: 'Towering 5s Spark Fountain',
        icon: '🌋',
        badgeColor: 'from-amber-400 to-yellow-600',
        fuseTime: 0.9,
        blastRadius: 4,
        blastForce: 4,
        key: '4'
    },
    {
        id: 'chakri',
        name: 'Zameen Chakri',
        hindiName: 'ज़मीन चकरी',
        subtitle: 'Neon Ground Spinner • Fast Whir',
        icon: '🌀',
        badgeColor: 'from-pink-500 to-purple-600',
        fuseTime: 0.7,
        blastRadius: 4,
        blastForce: 4,
        key: '5'
    },
    {
        id: 'rocket',
        name: 'Sky Shot Rocket',
        hindiName: 'रॉकेट',
        subtitle: 'Bottle Launch + Sky Burst',
        icon: '🚀',
        badgeColor: 'from-cyan-400 to-blue-600',
        fuseTime: 1.1,
        blastRadius: 6,
        blastForce: 8,
        key: '6'
    },
    {
        id: 'atom',
        name: 'VIP Atom Bomb',
        hindiName: 'वीआईपी एटम बम',
        subtitle: 'Mega Shockwave • Mohalla Shaker',
        icon: '☢️',
        badgeColor: 'from-yellow-400 via-red-500 to-purple-700',
        fuseTime: 2.3,
        blastRadius: 22,
        blastForce: 58,
        key: '7',
        locked: true,
        viralType: 'atom',
        requiredShares: 2
    },
    {
        id: 'phuljhadi',
        name: 'Phuljhadi',
        hindiName: 'फुलझड़ी',
        subtitle: 'Sparkler Wand • Golden Glitter',
        icon: '✨',
        badgeColor: 'from-yellow-300 to-amber-500',
        fuseTime: 0.5,
        blastRadius: 2,
        blastForce: 1,
        key: '8'
    },
    {
        id: 'aerial_cake',
        name: '16-Shot Sky Cake',
        hindiName: '16-शॉट आतिशबाज़ी',
        subtitle: 'Multi-Shell Aerial Repeater',
        icon: '🎆',
        badgeColor: 'from-indigo-500 to-fuchsia-600',
        fuseTime: 1.2,
        blastRadius: 5,
        blastForce: 6,
        key: '9',
        locked: true,
        viralType: 'aerial_cake',
        requiredShares: 2
    },
    {
        id: 'snake',
        name: 'Kaala Saanp',
        hindiName: 'काला साँप',
        subtitle: 'Childhood Nostalgia Ash Serpent',
        icon: '🐍',
        badgeColor: 'from-neutral-600 to-neutral-900',
        fuseTime: 0.6,
        blastRadius: 2,
        blastForce: 1,
        key: '0'
    },
    {
        id: 'mirchi',
        name: 'Mirchi Bomb',
        hindiName: 'मिर्ची बम',
        subtitle: 'Fiery Red Cracker • Sharp High Crack',
        icon: '🌶️',
        badgeColor: 'from-red-600 to-rose-900',
        fuseTime: 0.8,
        blastRadius: 7.5,
        blastForce: 16,
        key: 'Q'
    },
    {
        id: 'seeti_rocket',
        name: 'Seeti Rocket',
        hindiName: 'सीटी रॉकेट',
        subtitle: 'Screaming Siren • Sky Peony Willow',
        icon: '📢',
        badgeColor: 'from-amber-400 via-orange-500 to-red-600',
        fuseTime: 1.1,
        blastRadius: 7.0,
        blastForce: 9,
        key: 'W'
    },
    {
        id: 'helicopter',
        name: 'Disco Helicopter',
        hindiName: 'डिस्को हेलीकॉप्टर',
        subtitle: 'Ground Spin to Sky Lift • Air Pop',
        icon: '🚁',
        badgeColor: 'from-emerald-400 via-teal-500 to-cyan-600',
        fuseTime: 0.9,
        blastRadius: 5.5,
        blastForce: 6,
        key: 'E'
    },
    {
        id: 'smoke_bomb',
        name: 'Rang Birangi Smoke',
        hindiName: 'रंग-बिरंगा स्मोक',
        subtitle: 'Tri-Color Dense Festive Fog Plume',
        icon: '💨',
        badgeColor: 'from-orange-500 via-emerald-500 to-indigo-600',
        fuseTime: 0.8,
        blastRadius: 3.5,
        blastForce: 2,
        key: 'R'
    },
    {
        id: 'lassan_pop',
        name: 'Lassan Pop-Pop',
        hindiName: 'लहसुन पॉप-पॉप',
        subtitle: 'Instant Snapper • Rapid Floor Barrage',
        icon: '🧄',
        badgeColor: 'from-stone-300 via-amber-200 to-stone-500',
        fuseTime: 0.05,
        blastRadius: 3.0,
        blastForce: 4,
        key: 'T'
    },
    {
        id: 'parachute',
        name: 'Parachute Rocket',
        hindiName: 'पैराशूट रॉकेट',
        subtitle: 'Night Sky Launch • Floating Flare',
        icon: '🪂',
        badgeColor: 'from-sky-400 via-indigo-500 to-amber-400',
        fuseTime: 1.0,
        blastRadius: 6.0,
        blastForce: 5,
        key: 'Y'
    },
    {
        id: 'bullet',
        name: 'Bullet Bomb',
        hindiName: 'बुलेट बम',
        subtitle: 'Metal Casing Shell • Concussive Thud',
        icon: '💥',
        badgeColor: 'from-amber-600 via-neutral-700 to-red-600',
        fuseTime: 1.6,
        blastRadius: 15.0,
        blastForce: 42,
        key: 'U'
    },
    {
        id: 'gobar',
        name: 'Gobar Blast',
        hindiName: 'गोबर पर बम',
        subtitle: '💩 Desi Viral Prank • Mud Splat & Bang!',
        icon: '💩',
        badgeColor: 'from-amber-800 via-yellow-900 to-amber-950',
        fuseTime: 2.0,
        blastRadius: 18.0,
        blastForce: 48,
        key: 'O',
        locked: true,
        viralType: 'gobar',
        requiredShares: 3
    },
    {
        id: 'mega_lar',
        name: '10,000-Wala Lar',
        hindiName: '१०,००० महाबली लड़ी',
        subtitle: '🏮 60-Cracker Cascade • Non-Stop Thunder',
        icon: '🏮',
        badgeColor: 'from-red-600 via-rose-700 to-amber-500',
        fuseTime: 1.0,
        blastRadius: 14.0,
        blastForce: 30,
        key: 'M',
        locked: true,
        viralType: 'mega_lar',
        requiredShares: 1
    }
];

class PatakhaManager {
    constructor(scene, particles, propsEngine, audio) {
        this.scene = scene;
        this.particles = particles;
        this.propsEngine = propsEngine;
        this.audio = audio;

        this.activeBombs = [];
        this.totalExploded = 0;
        this.selectedType = PATAKHA_DEFINITIONS[0];
        this.placementMode = 'instant'; // 'instant' or 'setup'

        // Dynamic light pool for explosion flashes (Capped to 2 pooled lights for 60 FPS forward rendering)
        this.flashLights = [];
        for (let i = 0; i < 2; i++) {
            const fl = new THREE.PointLight(0xffaa33, 0, 42);
            fl.position.set(0, 2, 0);
            this.scene.add(fl);
            this.flashLights.push({ light: fl, life: 0, maxLife: 0.2, peak: 0 });
        }
    }

    triggerDynamicLight(pos, colorHex, intensity = 10, duration = 0.35) {
        let slot = this.flashLights.find(f => f.life <= 0) || this.flashLights[0];
        slot.light.color.setHex(colorHex);
        slot.light.position.copy(pos).add(new THREE.Vector3(0, 1.2, 0));
        slot.light.intensity = intensity;
        slot.peak = intensity;
        slot.life = duration;
        slot.maxLife = duration;
    }

    buildMesh(typeId) {
        const group = new THREE.Group();

        if (typeId === 'sutli') {
            // Green Jute Twine Cylinder with Red Bands
            const sutliMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.92 });
            const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.88, 16), sutliMat);
            cyl.position.y = 0.44;
            cyl.castShadow = true;
            group.add(cyl);

            const redBandMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.75 });
            const b1 = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.05, 8, 20), redBandMat);
            b1.rotation.x = Math.PI / 2;
            b1.position.y = 0.3;
            group.add(b1);

            const b2 = b1.clone();
            b2.position.y = 0.6;
            group.add(b2);

            const fuse = new THREE.Mesh(
                new THREE.CylinderGeometry(0.03, 0.03, 0.45, 6),
                new THREE.MeshBasicMaterial({ color: 0xfef08a })
            );
            fuse.position.set(0, 1.0, 0);
            fuse.rotation.z = 0.25;
            group.add(fuse);

            group.userData.fuseTip = new THREE.Vector3(0.06, 1.2, 0);

        } else if (typeId === 'lakshmi') {
            // Red Cracker with Golden Foil Label
            const redMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.45 });
            const goldMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.85, roughness: 0.2 });

            const body = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 1.15, 14), redMat);
            body.position.y = 0.575;
            body.castShadow = true;
            group.add(body);

            const foil = new THREE.Mesh(new THREE.CylinderGeometry(0.265, 0.275, 0.32, 14), goldMat);
            foil.position.y = 0.575;
            group.add(foil);

            const fuse = new THREE.Mesh(
                new THREE.CylinderGeometry(0.025, 0.025, 0.4, 6),
                new THREE.MeshBasicMaterial({ color: 0xfde047 })
            );
            fuse.position.set(0, 1.3, 0);
            group.add(fuse);

            group.userData.fuseTip = new THREE.Vector3(0, 1.48, 0);

        } else if (typeId === 'lar') {
            // 1000-Wala Garland (24 crackers connected on a central braid)
            const redMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.55 });
            const goldMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });

            const spine = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 4.6), goldMat);
            spine.position.y = 0.09;
            group.add(spine);

            const crackers = [];
            for (let i = 0; i < 24; i++) {
                const zOffset = -2.1 + i * 0.185;
                const side = i % 2 === 0 ? 1 : -1;
                const cMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.62, 8), redMat);
                cMesh.rotation.z = Math.PI / 2;
                cMesh.rotation.y = side * 0.35;
                cMesh.position.set(side * 0.32, 0.13, zOffset);
                cMesh.castShadow = true;
                group.add(cMesh);
                crackers.push(cMesh);
            }
            group.userData.crackers = crackers;
            group.userData.fuseTip = new THREE.Vector3(0, 0.25, -2.35);

        } else if (typeId === 'anaar') {
            // Golden Brass Cone with Magenta Accent Band
            const coneMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.65, roughness: 0.3 });
            const cone = new THREE.Mesh(new THREE.ConeGeometry(0.55, 1.15, 16), coneMat);
            cone.position.y = 0.575;
            cone.castShadow = true;
            group.add(cone);

            const band = new THREE.Mesh(
                new THREE.CylinderGeometry(0.32, 0.44, 0.32, 16),
                new THREE.MeshStandardMaterial({ color: 0xdb2777, roughness: 0.4 })
            );
            band.position.y = 0.46;
            group.add(band);

            group.userData.fuseTip = new THREE.Vector3(0, 1.18, 0);

        } else if (typeId === 'chakri') {
            // High Speed Spinner Disc with Concentric Colors
            const wheelGroup = new THREE.Group();
            const outer = new THREE.Mesh(
                new THREE.CylinderGeometry(0.62, 0.62, 0.14, 20),
                new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.3 })
            );
            const inner = new THREE.Mesh(
                new THREE.CylinderGeometry(0.38, 0.38, 0.16, 16),
                new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3 })
            );
            const center = new THREE.Mesh(
                new THREE.CylinderGeometry(0.15, 0.15, 0.18, 12),
                new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.3 })
            );
            wheelGroup.add(outer, inner, center);
            wheelGroup.position.y = 0.09;
            group.add(wheelGroup);
            group.userData.wheel = wheelGroup;
            group.userData.fuseTip = new THREE.Vector3(0.55, 0.18, 0);

        } else if (typeId === 'rocket') {
            // Green Bottle Base + Flying Rocket
            const bottleMat = new THREE.MeshStandardMaterial({
                color: 0x10b981,
                transparent: true,
                opacity: 0.75,
                roughness: 0.15,
                metalness: 0.2
            });
            const bottleBody = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.3, 0.85, 14), bottleMat);
            bottleBody.position.y = 0.425;
            group.add(bottleBody);

            const bottleNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.24, 0.42, 12), bottleMat);
            bottleNeck.position.y = 1.02;
            group.add(bottleNeck);

            // Flying Rocket component
            const rocketFlyer = new THREE.Group();
            const stick = new THREE.Mesh(
                new THREE.CylinderGeometry(0.025, 0.025, 1.9, 6),
                new THREE.MeshStandardMaterial({ color: 0xfde68a })
            );
            stick.position.y = 1.1;
            rocketFlyer.add(stick);

            const rBody = new THREE.Mesh(
                new THREE.CylinderGeometry(0.18, 0.18, 0.72, 12),
                new THREE.MeshStandardMaterial({ color: 0x06b6d4, metalness: 0.4, roughness: 0.3 })
            );
            rBody.position.y = 1.86;
            rocketFlyer.add(rBody);

            const nose = new THREE.Mesh(
                new THREE.ConeGeometry(0.22, 0.42, 12),
                new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 })
            );
            nose.position.y = 2.42;
            rocketFlyer.add(nose);

            group.add(rocketFlyer);
            group.userData.rocketFlyer = rocketFlyer;
            group.userData.fuseTip = new THREE.Vector3(0, 1.45, 0);

        } else if (typeId === 'atom') {
            // Giant VIP Atom Bomb Barrel
            const barrelMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.5, metalness: 0.3 });
            const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 1.7, 20), barrelMat);
            barrel.position.y = 0.85;
            barrel.castShadow = true;
            group.add(barrel);

            const goldMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.85, roughness: 0.2 });
            [-0.48, 0, 0.48].forEach(yOff => {
                const ring = new THREE.Mesh(new THREE.TorusGeometry(0.86, 0.07, 10, 24), goldMat);
                ring.rotation.x = Math.PI / 2;
                ring.position.y = 0.85 + yOff;
                group.add(ring);
            });

            const fuse = new THREE.Mesh(
                new THREE.CylinderGeometry(0.05, 0.05, 0.65, 8),
                new THREE.MeshBasicMaterial({ color: 0xfef08a })
            );
            fuse.position.set(0, 1.95, 0);
            group.add(fuse);

            group.userData.fuseTip = new THREE.Vector3(0, 2.25, 0);

        } else if (typeId === 'phuljhadi') {
            // Handheld Sparkler Wand
            const wandWire = new THREE.Mesh(
                new THREE.CylinderGeometry(0.02, 0.02, 1.8, 6),
                new THREE.MeshStandardMaterial({ color: 0x9ca3af, metalness: 0.8 })
            );
            wandWire.position.y = 0.9;
            group.add(wandWire);

            const sparklerCoating = new THREE.Mesh(
                new THREE.CylinderGeometry(0.06, 0.06, 1.1, 8),
                new THREE.MeshStandardMaterial({ color: 0x71717a, roughness: 0.9 })
            );
            sparklerCoating.position.y = 1.25;
            group.add(sparklerCoating);

            group.userData.sparklerCoating = sparklerCoating;
            group.userData.fuseTip = new THREE.Vector3(0, 1.8, 0);

        } else if (typeId === 'aerial_cake') {
            // 16-Shot Box / Cake
            const boxMat = new THREE.MeshStandardMaterial({ color: 0x4338ca, roughness: 0.6 });
            const box = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.1, 1.4), boxMat);
            box.position.y = 0.55;
            box.castShadow = true;
            group.add(box);

            // 16 Launch tubes on top
            const tubeMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.8 });
            const tubes = [];
            for (let ix = -0.45; ix <= 0.45; ix += 0.3) {
                for (let iz = -0.45; iz <= 0.45; iz += 0.3) {
                    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.15, 8), tubeMat);
                    tube.position.set(ix, 1.15, iz);
                    group.add(tube);
                    tubes.push(tube.position.clone());
                }
            }
            group.userData.tubes = tubes;
            group.userData.fuseTip = new THREE.Vector3(0.5, 1.15, 0.5);

        } else if (typeId === 'snake') {
            // Small Black Pill / Tablet on ground
            const pill = new THREE.Mesh(
                new THREE.CylinderGeometry(0.35, 0.35, 0.18, 14),
                new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.95 })
            );
            pill.position.y = 0.09;
            pill.castShadow = true;
            group.add(pill);

            group.userData.pill = pill;
            group.userData.snakeSegments = [];
            group.userData.fuseTip = new THREE.Vector3(0, 0.2, 0);

        } else if (typeId === 'mirchi') {
            // Fiery Red Mirchi Cracker
            const redMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.35 });
            const body = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.78, 12), redMat);
            body.position.y = 0.39;
            body.castShadow = true;
            group.add(body);

            const band = new THREE.Mesh(
                new THREE.CylinderGeometry(0.14, 0.14, 0.18, 12),
                new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.8, roughness: 0.2 })
            );
            band.position.y = 0.42;
            group.add(band);

            // Green Stem Cap at bottom
            const stem = new THREE.Mesh(
                new THREE.ConeGeometry(0.09, 0.2, 8),
                new THREE.MeshStandardMaterial({ color: 0x16a34a })
            );
            stem.rotation.x = Math.PI;
            stem.position.y = 0.05;
            group.add(stem);

            const fuse = new THREE.Mesh(
                new THREE.CylinderGeometry(0.02, 0.02, 0.32, 6),
                new THREE.MeshBasicMaterial({ color: 0xfef08a })
            );
            fuse.position.set(0, 0.9, 0);
            group.add(fuse);

            group.userData.fuseTip = new THREE.Vector3(0, 1.05, 0);

        } else if (typeId === 'seeti_rocket') {
            // Glass Launch Bottle
            const bottleMat = new THREE.MeshStandardMaterial({
                color: 0x065f46,
                transparent: true,
                opacity: 0.8,
                roughness: 0.15
            });
            const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.75, 12), bottleMat);
            bottle.position.y = 0.375;
            group.add(bottle);

            const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.2, 0.35, 12), bottleMat);
            neck.position.y = 0.9;
            group.add(neck);

            // Rocket Flyer
            const rocketFlyer = new THREE.Group();
            const stick = new THREE.Mesh(
                new THREE.CylinderGeometry(0.02, 0.02, 2.0, 6),
                new THREE.MeshStandardMaterial({ color: 0xfde68a })
            );
            stick.position.y = 1.15;
            rocketFlyer.add(stick);

            const rBody = new THREE.Mesh(
                new THREE.CylinderGeometry(0.16, 0.16, 0.65, 12),
                new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.3, roughness: 0.3 })
            );
            rBody.position.y = 1.95;
            rocketFlyer.add(rBody);

            // Whistle Chamber (Red band)
            const sirenRing = new THREE.Mesh(
                new THREE.CylinderGeometry(0.175, 0.175, 0.22, 12),
                new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.4 })
            );
            sirenRing.position.y = 1.95;
            rocketFlyer.add(sirenRing);

            const nose = new THREE.Mesh(
                new THREE.ConeGeometry(0.2, 0.38, 12),
                new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 })
            );
            nose.position.y = 2.45;
            rocketFlyer.add(nose);

            group.add(rocketFlyer);
            group.userData.rocketFlyer = rocketFlyer;
            group.userData.fuseTip = new THREE.Vector3(0, 1.5, 0);

        } else if (typeId === 'helicopter') {
            // Disco Helicopter Hub & 3 Curved Aerodynamic Rotor Wings
            const hub = new THREE.Mesh(
                new THREE.CylinderGeometry(0.3, 0.34, 0.14, 16),
                new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 })
            );
            hub.position.y = 0.07;
            hub.castShadow = true;
            group.add(hub);

            const centerCap = new THREE.Mesh(
                new THREE.CylinderGeometry(0.14, 0.14, 0.18, 12),
                new THREE.MeshStandardMaterial({ color: 0xdc2626 })
            );
            centerCap.position.y = 0.1;
            group.add(centerCap);

            // 3 Blades
            for (let i = 0; i < 3; i++) {
                const blade = new THREE.Mesh(
                    new THREE.BoxGeometry(0.65, 0.035, 0.18),
                    new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.5 })
                );
                blade.rotation.y = (i * Math.PI * 2) / 3;
                blade.position.set(Math.cos(blade.rotation.y) * 0.45, 0.08, Math.sin(blade.rotation.y) * 0.45);
                group.add(blade);

                const tip = new THREE.Mesh(
                    new THREE.BoxGeometry(0.2, 0.04, 0.19),
                    new THREE.MeshStandardMaterial({ color: 0xec4899 })
                );
                tip.rotation.y = blade.rotation.y;
                tip.position.set(Math.cos(blade.rotation.y) * 0.72, 0.08, Math.sin(blade.rotation.y) * 0.72);
                group.add(tip);
            }

            const fuse = new THREE.Mesh(
                new THREE.CylinderGeometry(0.02, 0.02, 0.22, 6),
                new THREE.MeshBasicMaterial({ color: 0xfde047 })
            );
            fuse.position.set(0, 0.26, 0);
            group.add(fuse);

            group.userData.fuseTip = new THREE.Vector3(0, 0.35, 0);

        } else if (typeId === 'smoke_bomb') {
            // Tri-Color Festive Smoke Canister
            const can = new THREE.Mesh(
                new THREE.CylinderGeometry(0.42, 0.42, 0.95, 16),
                new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.65, roughness: 0.35 })
            );
            can.position.y = 0.475;
            can.castShadow = true;
            group.add(can);

            // 3 Festive Bands (Saffron, White, Green)
            const bSaffron = new THREE.Mesh(
                new THREE.CylinderGeometry(0.43, 0.43, 0.28, 16),
                new THREE.MeshStandardMaterial({ color: 0xf97316 })
            );
            bSaffron.position.y = 0.76;
            group.add(bSaffron);

            const bGreen = new THREE.Mesh(
                new THREE.CylinderGeometry(0.43, 0.43, 0.28, 16),
                new THREE.MeshStandardMaterial({ color: 0x16a34a })
            );
            bGreen.position.y = 0.22;
            group.add(bGreen);

            // Smoke Nozzle Aperture
            const nozzle = new THREE.Mesh(
                new THREE.CylinderGeometry(0.14, 0.16, 0.12, 12),
                new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.8 })
            );
            nozzle.position.y = 0.99;
            group.add(nozzle);

            const fuse = new THREE.Mesh(
                new THREE.CylinderGeometry(0.03, 0.03, 0.32, 6),
                new THREE.MeshBasicMaterial({ color: 0x86efac })
            );
            fuse.position.set(0, 1.15, 0);
            group.add(fuse);

            group.userData.fuseTip = new THREE.Vector3(0, 1.3, 0);

        } else if (typeId === 'lassan_pop') {
            // Authentic Onion/Garlic Paper Bulb
            const bulb = new THREE.Mesh(
                new THREE.SphereGeometry(0.24, 8, 8),
                new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.9 })
            );
            bulb.position.y = 0.22;
            bulb.scale.set(1.0, 0.85, 1.0);
            bulb.castShadow = true;
            group.add(bulb);

            const tail = new THREE.Mesh(
                new THREE.ConeGeometry(0.08, 0.28, 6),
                new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.95 })
            );
            tail.position.set(0.02, 0.44, 0);
            tail.rotation.z = 0.2;
            group.add(tail);

            group.userData.fuseTip = new THREE.Vector3(0.04, 0.52, 0);

        } else if (typeId === 'parachute') {
            // Launch Pipe & Parachute Payload Rocket
            const launchTube = new THREE.Mesh(
                new THREE.CylinderGeometry(0.2, 0.22, 0.9, 14),
                new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7, roughness: 0.4 })
            );
            launchTube.position.y = 0.45;
            group.add(launchTube);

            // Flying Parachute Rocket
            const rocketFlyer = new THREE.Group();
            const rBody = new THREE.Mesh(
                new THREE.CylinderGeometry(0.14, 0.14, 0.85, 12),
                new THREE.MeshStandardMaterial({ color: 0x2563eb, metalness: 0.4, roughness: 0.3 })
            );
            rBody.position.y = 0.75;
            rocketFlyer.add(rBody);

            const capsule = new THREE.Mesh(
                new THREE.SphereGeometry(0.17, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
                new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.3 })
            );
            capsule.position.y = 1.18;
            rocketFlyer.add(capsule);

            group.add(rocketFlyer);
            group.userData.rocketFlyer = rocketFlyer;
            group.userData.fuseTip = new THREE.Vector3(0, 0.95, 0);

        } else if (typeId === 'bullet') {
            // Heavy Projectile Bullet Bomb
            const rim = new THREE.Mesh(
                new THREE.CylinderGeometry(0.46, 0.5, 0.22, 16),
                new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.25 })
            );
            rim.position.y = 0.11;
            rim.castShadow = true;
            group.add(rim);

            const body = new THREE.Mesh(
                new THREE.CylinderGeometry(0.42, 0.46, 0.9, 16),
                new THREE.MeshStandardMaterial({ color: 0x374151, metalness: 0.7, roughness: 0.3 })
            );
            body.position.y = 0.65;
            body.castShadow = true;
            group.add(body);

            const head = new THREE.Mesh(
                new THREE.ConeGeometry(0.42, 0.65, 16),
                new THREE.MeshStandardMaterial({ color: 0xb45309, metalness: 0.75, roughness: 0.28 })
            );
            head.position.y = 1.42;
            group.add(head);

            const fuse = new THREE.Mesh(
                new THREE.CylinderGeometry(0.04, 0.04, 0.5, 6),
                new THREE.MeshBasicMaterial({ color: 0xfef08a })
            );
            fuse.position.set(0.24, 0.6, 0);
            fuse.rotation.z = -0.55;
            group.add(fuse);

            group.userData.fuseTip = new THREE.Vector3(0.42, 0.8, 0);

        } else if (typeId === 'gobar') {
            // Authentic 3D Desi Cow Dung Cake (Gobar ka Upla / Kanda) with authentic Sutli Bomb embedded!
            
            // 1. High-Detail 512x512 Organic Manure Canvas Texture with Hay & Straw Flecks
            const gobarCanvas = document.createElement('canvas');
            gobarCanvas.width = 512;
            gobarCanvas.height = 512;
            const gCtx = gobarCanvas.getContext('2d');

            // Rich earthy gradient: deep moist manure brown to sun-dried crust
            const gGrad = gCtx.createRadialGradient(256, 256, 30, 256, 256, 256);
            gGrad.addColorStop(0, '#42220f');
            gGrad.addColorStop(0.4, '#31180a');
            gGrad.addColorStop(0.75, '#241206');
            gGrad.addColorStop(1, '#180a03');
            gCtx.fillStyle = gGrad;
            gCtx.fillRect(0, 0, 512, 512);

            // Organic manure mottling & fiber patches
            for (let i = 0; i < 180; i++) {
                const px = Math.random() * 512;
                const py = Math.random() * 512;
                const pr = 4 + Math.random() * 18;
                gCtx.fillStyle = Math.random() > 0.5 ? 'rgba(74, 44, 19, 0.45)' : 'rgba(24, 12, 4, 0.5)';
                gCtx.beginPath();
                gCtx.arc(px, py, pr, 0, Math.PI * 2);
                gCtx.fill();
            }

            // Authentic yellow & golden wheat straw fibers / bhoosa strands
            const strawColors = ['#eab308', '#ca8a04', '#a16207', '#d97706', '#854d0e'];
            for (let i = 0; i < 220; i++) {
                gCtx.strokeStyle = strawColors[Math.floor(Math.random() * strawColors.length)];
                gCtx.lineWidth = 1.2 + Math.random() * 1.8;
                gCtx.beginPath();
                const sx = Math.random() * 512;
                const sy = Math.random() * 512;
                const len = 14 + Math.random() * 32;
                const angle = Math.random() * Math.PI * 2;
                gCtx.moveTo(sx, sy);
                gCtx.quadraticCurveTo(
                    sx + Math.cos(angle) * (len * 0.5) + (Math.random() - 0.5) * 8,
                    sy + Math.sin(angle) * (len * 0.5) + (Math.random() - 0.5) * 8,
                    sx + Math.cos(angle) * len,
                    sy + Math.sin(angle) * len
                );
                gCtx.stroke();
            }

            const gobarTex = new THREE.CanvasTexture(gobarCanvas);
            gobarTex.wrapS = THREE.RepeatWrapping;
            gobarTex.wrapT = THREE.RepeatWrapping;
            const gobarMat = new THREE.MeshStandardMaterial({
                map: gobarTex,
                roughness: 0.96,
                metalness: 0.04
            });

            // 2. Realistic Hand-Molded Organic Dung Cake (Vertex-deformed lumpy mound)
            const cakeGeo = new THREE.CylinderGeometry(0.85, 1.18, 0.36, 32, 4);
            const posAttr = cakeGeo.attributes.position;
            for (let i = 0; i < posAttr.count; i++) {
                const x = posAttr.getX(i);
                const y = posAttr.getY(i);
                const z = posAttr.getZ(i);

                const angle = Math.atan2(z, x);
                const dist = Math.sqrt(x * x + z * z);
                
                // Natural wavy lumpy perimeter (hand-pressed upla shape)
                const perimeterLump = Math.sin(angle * 5) * 0.07 + Math.cos(angle * 3) * 0.05;
                const surfaceRipple = Math.sin(x * 6) * Math.cos(z * 6) * 0.035;

                // Center thumb-depression where bomb is lodged
                let yCavity = 0;
                if (y > 0.1 && dist < 0.5) {
                    yCavity = -0.14 * (1 - dist / 0.5);
                }

                posAttr.setXYZ(
                    i,
                    x * (1 + perimeterLump),
                    y + surfaceRipple + yCavity,
                    z * (1 + perimeterLump)
                );
            }
            cakeGeo.computeVertexNormals();

            const cake = new THREE.Mesh(cakeGeo, gobarMat);
            cake.position.y = 0.16;
            cake.castShadow = true;
            cake.receiveShadow = true;
            group.add(cake);

            // Ground moisture/dung stain ring beneath
            const stainMat = new THREE.MeshBasicMaterial({
                color: 0x120803,
                transparent: true,
                opacity: 0.55
            });
            const stain = new THREE.Mesh(new THREE.CircleGeometry(1.35, 24), stainMat);
            stain.rotation.x = -Math.PI / 2;
            stain.position.y = 0.015;
            group.add(stain);

            // 3. Dry straw / grass blades sticking out from the edges of the dung
            const strawMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.85 });
            const strawGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.42, 4);
            for (let i = 0; i < 7; i++) {
                const sAngle = (i / 7) * Math.PI * 2 + Math.random() * 0.4;
                const sDist = 0.95 + Math.random() * 0.2;
                const strawMesh = new THREE.Mesh(strawGeo, strawMat);
                strawMesh.position.set(Math.cos(sAngle) * sDist, 0.12, Math.sin(sAngle) * sDist);
                strawMesh.rotation.z = Math.PI / 2 + (Math.random() - 0.5) * 0.4;
                strawMesh.rotation.y = sAngle + (Math.random() - 0.5) * 0.8;
                strawMesh.castShadow = true;
                group.add(strawMesh);
            }

            // 4. Authentic Green Sivakasi Sutli Bomb (Rassi Bomb) Embedded in Center
            const bombGroup = new THREE.Group();
            bombGroup.position.set(0, 0.32, 0);
            bombGroup.rotation.z = 0.14; // Natural 12-degree hand-pressed tilt
            bombGroup.rotation.x = -0.08;

            // Green paper core block
            const bombCoreMat = new THREE.MeshStandardMaterial({
                color: 0x166534, // Dark kraft green
                roughness: 0.85
            });
            const core = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.46, 16), bombCoreMat);
            core.castShadow = true;
            bombGroup.add(core);

            // Red label band in center
            const redBand = new THREE.Mesh(
                new THREE.CylinderGeometry(0.255, 0.255, 0.14, 16),
                new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.6 })
            );
            bombGroup.add(redBand);

            // Jute Twine (सुतली) Criss-Cross Ropes Wrapping
            const ropeMat = new THREE.MeshStandardMaterial({
                color: 0xb45309, // Authentic yellowish-brown jute rope
                roughness: 0.92
            });

            // 4 Horizontal tightly bound twine loops
            for (let h = 0; h < 4; h++) {
                const yPos = -0.16 + h * 0.11;
                const hRope = new THREE.Mesh(new THREE.TorusGeometry(0.255, 0.022, 6, 20), ropeMat);
                hRope.rotation.x = Math.PI / 2;
                hRope.position.y = yPos;
                bombGroup.add(hRope);
            }

            // 2 Vertical longitudinal loops (wrapping over top & bottom)
            const vRope1 = new THREE.Mesh(new THREE.TorusGeometry(0.255, 0.022, 6, 20), ropeMat);
            vRope1.position.y = 0;
            bombGroup.add(vRope1);

            const vRope2 = vRope1.clone();
            vRope2.rotation.y = Math.PI / 2;
            bombGroup.add(vRope2);

            // Diagonal "X" criss-cross twine wrapping
            const dRope1 = vRope1.clone();
            dRope1.rotation.y = Math.PI / 4;
            dRope1.rotation.z = 0.2;
            bombGroup.add(dRope1);

            const dRope2 = vRope1.clone();
            dRope2.rotation.y = -Math.PI / 4;
            dRope2.rotation.z = -0.2;
            bombGroup.add(dRope2);

            // Frayed white/tan jute fibers tuft where fuse emerges
            const tuft = new THREE.Mesh(
                new THREE.SphereGeometry(0.065, 8, 8),
                new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 1.0 })
            );
            tuft.position.set(0, 0.24, 0);
            tuft.scale.set(1.1, 0.6, 1.1);
            bombGroup.add(tuft);

            // Twisted thick rope fuse sticking up
            const fuse = new THREE.Mesh(
                new THREE.CylinderGeometry(0.024, 0.024, 0.38, 6),
                new THREE.MeshBasicMaterial({ color: 0xfef08a })
            );
            fuse.position.set(0.03, 0.42, 0);
            fuse.rotation.z = -0.3;
            bombGroup.add(fuse);

            group.add(bombGroup);

            // Calculate fuse tip in world space
            group.userData.fuseTip = new THREE.Vector3(0.12, 0.85, -0.04);

        } else if (typeId === 'mega_lar') {
            // 🏮 Authentic 10,000-Wala Mahabali Lar (Coiled Spool + Serpentine Double Ribbon + Mahabali Triangle Head Bomb)
            
            group.userData.crackers = [];

            const redMat = new THREE.MeshStandardMaterial({
                color: 0xdc2626, // Crimson firecracker red
                roughness: 0.45
            });
            const goldBandMat = new THREE.MeshStandardMaterial({
                color: 0xfbbf24, // Gold foil band
                metalness: 0.85,
                roughness: 0.25
            });
            const fuseSpineMat = new THREE.MeshStandardMaterial({
                color: 0x15803d, // Green fuse cord
                roughness: 0.8
            });

            // 1. BACK TAIL: The Iconic Coiled Spool of 10,000 Crackers!
            const spoolGroup = new THREE.Group();
            spoolGroup.position.set(-2.2, 0, -1.2);

            // Coiled cracker bundle body
            const spoolBody = new THREE.Mesh(
                new THREE.CylinderGeometry(0.75, 0.78, 0.42, 28),
                new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.5 })
            );
            spoolBody.position.y = 0.21;
            spoolBody.castShadow = true;
            spoolGroup.add(spoolBody);

            // Yellow/Gold binding tape around spool
            const spoolBand = new THREE.Mesh(
                new THREE.CylinderGeometry(0.785, 0.785, 0.12, 28),
                goldBandMat
            );
            spoolBand.position.y = 0.21;
            spoolGroup.add(spoolBand);

            // Circular Diwali Label on top of the spool (Cock / Standard brand style)
            const labelCanvas = document.createElement('canvas');
            labelCanvas.width = 256;
            labelCanvas.height = 256;
            const lCtx = labelCanvas.getContext('2d');
            lCtx.fillStyle = '#dc2626';
            lCtx.fillRect(0, 0, 256, 256);
            lCtx.fillStyle = '#fbbf24';
            lCtx.beginPath();
            lCtx.arc(128, 128, 120, 0, Math.PI * 2);
            lCtx.fill();
            lCtx.fillStyle = '#7f1d1d';
            lCtx.beginPath();
            lCtx.arc(128, 128, 96, 0, Math.PI * 2);
            lCtx.fill();
            lCtx.fillStyle = '#fef08a';
            lCtx.font = 'bold 28px sans-serif';
            lCtx.textAlign = 'center';
            lCtx.fillText('10,000', 128, 115);
            lCtx.font = 'bold 22px sans-serif';
            lCtx.fillText('MAHABALI', 128, 148);
            lCtx.font = 'bold 16px sans-serif';
            lCtx.fillText('★ SIVAKASI ★', 128, 175);

            const labelTex = new THREE.CanvasTexture(labelCanvas);
            const labelMesh = new THREE.Mesh(
                new THREE.CircleGeometry(0.72, 28),
                new THREE.MeshStandardMaterial({ map: labelTex, roughness: 0.3 })
            );
            labelMesh.rotation.x = -Math.PI / 2;
            labelMesh.position.y = 0.425;
            spoolGroup.add(labelMesh);

            group.add(spoolGroup);

            // 2. UNROLLED SERPENTINE DOUBLE-ROW RIBBON (60 tightly packed crackers along S-curve)
            const numCrackers = 60;
            const curvePoints = [];
            for (let i = 0; i <= 20; i++) {
                const t = i / 20;
                // S-curve trajectory winding from spool to front
                const cx = -2.2 + t * 4.8;
                const cz = -1.2 + Math.sin(t * Math.PI * 2.2) * 1.35;
                curvePoints.push(new THREE.Vector3(cx, 0.08, cz));
            }
            const curve = new THREE.CatmullRomCurve3(curvePoints);

            // Green fuse spine running along the curve
            const spineGeo = new THREE.TubeGeometry(curve, 48, 0.016, 6, false);
            const spineMesh = new THREE.Mesh(spineGeo, fuseSpineMat);
            group.add(spineMesh);

            // Cracker geometry (reused)
            const crackerGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.34, 8);
            const bandGeo = new THREE.CylinderGeometry(0.068, 0.068, 0.08, 8);

            for (let i = 0; i < numCrackers; i++) {
                const u = i / numCrackers;
                const pt = curve.getPoint(u);
                const tangent = curve.getTangent(u);
                const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

                // Double row: alternating left and right of the spine
                const side = (i % 2 === 0) ? 1 : -1;
                const cPos = pt.clone().add(normal.clone().multiplyScalar(side * 0.16));
                cPos.y = 0.12;

                const cMesh = new THREE.Mesh(crackerGeo, redMat);
                cMesh.position.copy(cPos);
                // Rotate cracker perpendicular to spine direction
                cMesh.rotation.z = Math.PI / 2;
                cMesh.rotation.y = Math.atan2(normal.z, normal.x);
                cMesh.castShadow = true;
                group.add(cMesh);

                const bMesh = new THREE.Mesh(bandGeo, goldBandMat);
                bMesh.position.copy(cPos);
                bMesh.rotation.copy(cMesh.rotation);
                group.add(bMesh);

                // Group cracker + band for clean detonation hiding
                cMesh.userData.band = bMesh;
                group.userData.crackers.push(cMesh);
            }

            // 3. FRONT: The Iconic Giant Red "Mahabali Triangle Head Bomb" (The Master Cracker)
            const frontPt = curve.getPoint(1.0);
            const frontTangent = curve.getTangent(1.0);

            const headGroup = new THREE.Group();
            headGroup.position.copy(frontPt);
            headGroup.position.y = 0.14;
            headGroup.rotation.y = Math.atan2(frontTangent.x, frontTangent.z);

            // Large triangular cracker (Prism)
            const triangleGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.18, 3);
            const triangleMesh = new THREE.Mesh(
                triangleGeo,
                new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 })
            );
            triangleMesh.rotation.y = Math.PI / 6;
            triangleMesh.castShadow = true;
            headGroup.add(triangleMesh);

            // Gold trim on head bomb
            const trimMesh = new THREE.Mesh(
                new THREE.CylinderGeometry(0.37, 0.37, 0.05, 3),
                goldBandMat
            );
            trimMesh.rotation.y = Math.PI / 6;
            headGroup.add(trimMesh);

            // Head bomb fuse
            const headFuse = new THREE.Mesh(
                new THREE.CylinderGeometry(0.025, 0.025, 0.45, 6),
                new THREE.MeshBasicMaterial({ color: 0xfef08a })
            );
            headFuse.position.set(0, 0.28, 0.16);
            headFuse.rotation.x = 0.35;
            headGroup.add(headFuse);

            group.add(headGroup);
            group.userData.headBomb = headGroup;

            // Fuse tip location at the head bomb
            const fuseTipWorld = new THREE.Vector3(0, 0.48, 0.32);
            fuseTipWorld.applyEuler(headGroup.rotation);
            fuseTipWorld.add(headGroup.position);
            group.userData.fuseTip = fuseTipWorld;
        }

        return group;
    }

    spawn(typeObj, worldPos, igniteImmediately = true) {
        const mesh = this.buildMesh(typeObj.id);
        mesh.position.copy(worldPos);
        mesh.rotation.y = Math.random() * Math.PI * 2;
        this.scene.add(mesh);

        const bomb = {
            id: Math.random().toString(36).substr(2, 9),
            type: typeObj,
            mesh,
            state: igniteImmediately ? 'lit' : 'unlit',
            timer: typeObj.fuseTime,
            effectTimer: 0,
            larIndex: 0,
            aerialShotIndex: 0,
            chakriAngle: Math.random() * Math.PI * 2,
            snakeHeadPos: new THREE.Vector3(0, 0.1, 0),
            snakeDir: new THREE.Vector3(0, 1, 0)
        };

        if (igniteImmediately) {
            this.audio.playFuse(typeObj.fuseTime);
        }

        this.activeBombs.push(bomb);
        return bomb;
    }

    ignite(bomb, delay = 0) {
        if (bomb.state !== 'unlit') return;
        bomb.state = 'lit';
        bomb.timer = bomb.type.fuseTime + delay;
        this.audio.playFuse(bomb.timer);
    }

    igniteAllUnlit() {
        let count = 0;
        this.activeBombs.forEach((b, idx) => {
            if (b.state === 'unlit') {
                this.ignite(b, idx * 0.08);
                count++;
            }
        });
        return count;
    }

    applyBlastPhysics(origin, radius, force) {
        // 1. Impulse props & shatter matkas
        this.propsEngine.props.forEach(prop => {
            const diff = new THREE.Vector3().subVectors(prop.mesh.position, origin);
            const horizDist = Math.sqrt(diff.x * diff.x + diff.z * diff.z);
            const totalDist = diff.length();

            // Wake up stacked props if blast shockwave reaches near them
            if (prop.isStatic && totalDist < radius * 1.5) {
                prop.isStatic = false;
            }

            if (totalDist < radius) {
                // Check if Matka shatters on close impact
                if (prop.type === 'matka' && totalDist < radius * 0.55 && force >= 16) {
                    this.propsEngine.shatterMatka(prop);
                    return;
                }

                // Check if 14.2 KG LPG Gas Cylinder takes a direct high-explosive hit!
                if (prop.type === 'gas_cylinder' && totalDist < 2.4 && force >= 16) {
                    if (window.diwaliApp && !prop.detonated) {
                        prop.detonated = true;
                        window.diwaliApp.detonateGasCylinder(prop);
                        return;
                    }
                }

                const factor = Math.pow(1 - totalDist / radius, 1.25);
                const dir = diff.clone().normalize();

                // Classic "Dabba Udao" trick: If bomb is directly beneath the tin dabba, shoot sky-high!
                if (horizDist < 1.3) {
                    dir.set((Math.random() - 0.5) * 0.16, 1.85, (Math.random() - 0.5) * 0.16);
                    dir.normalize();

                    // Gunpowder ejection burst beneath the flying Dabba
                    for (let s = 0; s < 10; s++) {
                        const sVel = new THREE.Vector3(
                            (Math.random() - 0.5) * 8,
                            Math.random() * 4,
                            (Math.random() - 0.5) * 8
                        );
                        this.particles.spawnSmoke(origin, sVel, 0x475569, 0.6, 0.8, 1.5, 1.4);
                    }
                } else {
                    dir.y = Math.max(0.55, dir.y + 0.65);
                    dir.normalize();
                }

                const multiplier = (prop.type === 'big_dabba' && horizDist < 1.3) ? 1.75 : 1.3;
                const impulse = (force * factor * multiplier) / prop.mass;
                this.propsEngine.applyImpulse(prop, dir.multiplyScalar(impulse));
            }
        });

        // 2. Chain-ignite nearby unlit bombs!
        this.activeBombs.forEach(other => {
            if (other.state === 'unlit') {
                const dist = other.mesh.position.distanceTo(origin);
                if (dist < radius * 0.85) {
                    other.state = 'lit';
                    other.timer = 0.15 + Math.random() * 0.3;
                    this.audio.playFuse(other.timer);
                }
            }
        });
    }

    triggerDetonation(bomb, camShakeCallback, screenFlashCallback) {
        const pos = bomb.mesh.position.clone();
        const typeId = bomb.type.id;

        if (typeId === 'sutli') {
            this.audio.playBlast(1.2, 'sutli');
            this.triggerDynamicLight(pos, 0x86efac, 16, 0.45);
            screenFlashCallback(0.65);
            camShakeCallback(1.4);

            this.particles.spawnShockwave(pos, 14, 0x86efac, false);
            this.particles.addScorchMark(pos, 2.2);
            this.applyBlastPhysics(pos, bomb.type.blastRadius, bomb.type.blastForce);

            // Jute paper confetti + bright sparks + smoke
            for (let i = 0; i < 70; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 7 + Math.random() * 22;
                this.particles.spawnSpark(
                    pos.clone().add(new THREE.Vector3(0, 0.4, 0)),
                    new THREE.Vector3(Math.cos(angle) * speed, 5 + Math.random() * 16, Math.sin(angle) * speed),
                    Math.random() > 0.35 ? 0xfef08a : 0x4ade80,
                    1.2,
                    0.7 + Math.random() * 0.6
                );
            }
            for (let i = 0; i < 45; i++) {
                this.particles.spawnConfetti(
                    pos.clone().add(new THREE.Vector3(0, 0.5, 0)),
                    new THREE.Vector3((Math.random() - 0.5) * 16, 5 + Math.random() * 12, (Math.random() - 0.5) * 16),
                    Math.random() > 0.3 ? 0x16a34a : 0xb45309,
                    1.2,
                    2.2 + Math.random()
                );
            }
            for (let i = 0; i < 18; i++) {
                this.particles.spawnSmoke(
                    pos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 1.5, 0.6, (Math.random() - 0.5) * 1.5)),
                    new THREE.Vector3((Math.random() - 0.5) * 3.5, 2.5 + Math.random() * 3.5, (Math.random() - 0.5) * 3.5),
                    0x9ca3af,
                    0.55,
                    0.9,
                    1.8,
                    1.6
                );
            }

            this.scene.remove(bomb.mesh);
            bomb.state = 'done';
            this.totalExploded++;

        } else if (typeId === 'lakshmi') {
            this.audio.playBlast(0.9, 'lakshmi');
            this.triggerDynamicLight(pos, 0xf87171, 12, 0.32);
            screenFlashCallback(0.35);
            camShakeCallback(0.85);

            this.particles.spawnShockwave(pos, 9, 0xf87171, false);
            this.particles.addScorchMark(pos, 1.4);
            this.applyBlastPhysics(pos, bomb.type.blastRadius, bomb.type.blastForce);

            for (let i = 0; i < 50; i++) {
                this.particles.spawnSpark(
                    pos.clone().add(new THREE.Vector3(0, 0.4, 0)),
                    new THREE.Vector3((Math.random() - 0.5) * 22, 3 + Math.random() * 14, (Math.random() - 0.5) * 22),
                    Math.random() > 0.4 ? 0xfbbf24 : 0xef4444,
                    1.0,
                    0.6
                );
            }
            for (let i = 0; i < 40; i++) {
                this.particles.spawnConfetti(
                    pos.clone().add(new THREE.Vector3(0, 0.4, 0)),
                    new THREE.Vector3((Math.random() - 0.5) * 14, 4 + Math.random() * 10, (Math.random() - 0.5) * 14),
                    0xdc2626,
                    1.0,
                    2.0
                );
            }

            this.scene.remove(bomb.mesh);
            bomb.state = 'done';
            this.totalExploded++;

        } else if (typeId === 'lar') {
            bomb.state = 'active_effect';
            bomb.effectTimer = 0;
            bomb.larIndex = 0;

        } else if (typeId === 'anaar') {
            bomb.state = 'active_effect';
            bomb.effectTimer = 5.0;
            this.audio.playAnaarFountain(5.0);
            this.totalExploded++;

        } else if (typeId === 'chakri') {
            bomb.state = 'active_effect';
            bomb.effectTimer = 4.2;
            this.audio.playChakriSpin(4.2);
            this.totalExploded++;

        } else if (typeId === 'rocket') {
            bomb.state = 'active_effect';
            bomb.effectTimer = 1.2;
            this.audio.playRocketWhistle(1.2);

        } else if (typeId === 'atom') {
            // Colossal Boss Detonation
            this.audio.playBlast(1.6, 'atom');
            this.triggerDynamicLight(pos, 0xfde047, 30, 0.95);
            screenFlashCallback(0.95);
            camShakeCallback(2.8);

            this.particles.spawnShockwave(pos, 25, 0xfef08a, true);
            this.particles.addScorchMark(pos, 4.4);
            this.applyBlastPhysics(pos, bomb.type.blastRadius, bomb.type.blastForce);

            // Explosive Fireball Sphere
            for (let i = 0; i < 150; i++) {
                const phi = Math.random() * Math.PI * 2;
                const costheta = Math.random() * 2 - 1;
                const theta = Math.acos(costheta);
                const speed = 12 + Math.random() * 32;
                this.particles.spawnSpark(
                    pos.clone().add(new THREE.Vector3(0, 1.0, 0)),
                    new THREE.Vector3(
                        speed * Math.sin(theta) * Math.cos(phi),
                        Math.abs(speed * Math.cos(theta)) + 8,
                        speed * Math.sin(theta) * Math.sin(phi)
                    ),
                    [0xffffff, 0xfde047, 0xf97316, 0xef4444][Math.floor(Math.random() * 4)],
                    1.7,
                    1.2 + Math.random() * 0.8
                );
            }

            // Mushroom Cloud Stem + Cap
            for (let i = 0; i < 40; i++) {
                const isCap = i > 15;
                const ang = (i / 25) * Math.PI * 2;
                const rad = isCap ? 3.8 + Math.random() * 2.2 : Math.random() * 1.4;
                this.particles.spawnSmoke(
                    pos.clone().add(new THREE.Vector3(Math.cos(ang) * rad * 0.3, 1.0, Math.sin(ang) * rad * 0.3)),
                    new THREE.Vector3(
                        Math.cos(ang) * (isCap ? 6.0 : 1.4),
                        isCap ? 10 + Math.random() * 4 : 5 + Math.random() * 5,
                        Math.sin(ang) * (isCap ? 6.0 : 1.4)
                    ),
                    isCap ? 0xf97316 : 0x4b5563,
                    0.8,
                    1.5,
                    2.8,
                    2.2
                );
            }

            this.scene.remove(bomb.mesh);
            bomb.state = 'done';
            this.totalExploded++;

        } else if (typeId === 'phuljhadi') {
            bomb.state = 'active_effect';
            bomb.effectTimer = 6.0;
            this.totalExploded++;

        } else if (typeId === 'aerial_cake') {
            bomb.state = 'active_effect';
            bomb.effectTimer = 0;
            bomb.aerialShotIndex = 0;

        } else if (typeId === 'snake') {
            bomb.state = 'active_effect';
            bomb.effectTimer = 5.5;
            this.totalExploded++;

        } else if (typeId === 'mirchi') {
            this.audio.playBlast(0.65, 'lakshmi');
            this.triggerDynamicLight(pos, 0xff2233, 11, 0.26);
            screenFlashCallback(0.28);
            camShakeCallback(0.55);

            this.particles.spawnShockwave(pos, 7.5, 0xff2233, false);
            this.particles.addScorchMark(pos, 0.95);
            this.applyBlastPhysics(pos, bomb.type.blastRadius, bomb.type.blastForce);

            // Fiery red & golden sparks
            for (let i = 0; i < 45; i++) {
                this.particles.spawnSpark(
                    pos.clone().add(new THREE.Vector3(0, 0.35, 0)),
                    new THREE.Vector3((Math.random() - 0.5) * 19, 2 + Math.random() * 12, (Math.random() - 0.5) * 19),
                    Math.random() > 0.4 ? 0xfbbf24 : 0xef4444,
                    0.9,
                    0.55
                );
            }
            // Dense flutter of red paper confetti
            for (let i = 0; i < 60; i++) {
                this.particles.spawnConfetti(
                    pos.clone().add(new THREE.Vector3(0, 0.35, 0)),
                    new THREE.Vector3((Math.random() - 0.5) * 14, 3 + Math.random() * 9, (Math.random() - 0.5) * 14),
                    0xdc2626,
                    0.75,
                    2.0
                );
            }

            this.scene.remove(bomb.mesh);
            bomb.state = 'done';
            this.totalExploded++;

        } else if (typeId === 'seeti_rocket') {
            bomb.state = 'active_effect';
            bomb.effectTimer = 1.7;
            this.audio.playSeetiWhistle(1.7);

        } else if (typeId === 'helicopter') {
            bomb.state = 'active_effect';
            bomb.effectTimer = 3.2;
            this.audio.playHelicopterWhir(3.2);

        } else if (typeId === 'smoke_bomb') {
            bomb.state = 'active_effect';
            bomb.effectTimer = 5.5;
            bomb.smokeTimer = 0;
            this.audio.playSmokeHiss(5.5);
            this.totalExploded++;

        } else if (typeId === 'lassan_pop') {
            this.audio.playSnapperPop();
            this.triggerDynamicLight(pos, 0xffffff, 5.0, 0.1);
            camShakeCallback(0.2);
            this.particles.addScorchMark(pos, 0.4);
            this.applyBlastPhysics(pos, bomb.type.blastRadius, bomb.type.blastForce);

            for (let s = 0; s < 15; s++) {
                this.particles.spawnSpark(
                    pos.clone().add(new THREE.Vector3(0, 0.15, 0)),
                    new THREE.Vector3((Math.random() - 0.5) * 9, 1 + Math.random() * 6, (Math.random() - 0.5) * 9),
                    [0xffffff, 0xfde047, 0xf97316][s % 3],
                    0.6,
                    0.3
                );
            }
            this.particles.spawnSmoke(pos.clone().add(new THREE.Vector3(0, 0.2, 0)), new THREE.Vector3(0, 0.9, 0), 0x9ca3af, 0.4, 0.45, 0.9, 1.2);

            this.scene.remove(bomb.mesh);
            bomb.state = 'done';
            this.totalExploded++;

        } else if (typeId === 'parachute') {
            bomb.state = 'active_effect';
            bomb.effectTimer = 1.25;
            bomb.parachuteDeployed = false;
            this.audio.playParachuteLaunch();

        } else if (typeId === 'bullet') {
            this.audio.playBulletBlast();
            this.triggerDynamicLight(pos, 0xf59e0b, 24, 0.7);
            screenFlashCallback(0.75);
            camShakeCallback(1.9);

            this.particles.spawnShockwave(pos, 18, 0xf59e0b, true);
            this.particles.addScorchMark(pos, 3.2);
            this.applyBlastPhysics(pos, bomb.type.blastRadius, bomb.type.blastForce);

            for (let i = 0; i < 90; i++) {
                const speed = 9 + Math.random() * 26;
                const angle = Math.random() * Math.PI * 2;
                this.particles.spawnSpark(
                    pos.clone().add(new THREE.Vector3(0, 0.5, 0)),
                    new THREE.Vector3(Math.cos(angle) * speed, 4 + Math.random() * 16, Math.sin(angle) * speed),
                    Math.random() > 0.35 ? 0xfbbf24 : 0xf97316,
                    1.4,
                    0.9
                );
            }
            for (let i = 0; i < 24; i++) {
                this.particles.spawnSmoke(
                    pos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 1.5, 0.6, (Math.random() - 0.5) * 1.5)),
                    new THREE.Vector3((Math.random() - 0.5) * 4, 3 + Math.random() * 4, (Math.random() - 0.5) * 4),
                    0x374151,
                    0.7,
                    1.2,
                    2.2,
                    1.8
                );
            }

            this.scene.remove(bomb.mesh);
            bomb.state = 'done';
            this.totalExploded++;
            if (window.app && window.app.onCrackerExploded) window.app.onCrackerExploded();

        } else if (typeId === 'gobar') {
            // 💩 DESI GOBAR DHAMAKA EXPLOSION!
            this.audio.playBlast(1.4, 'sutli');
            this.audio.playMetallicClang(1.2);
            this.triggerDynamicLight(pos, 0xf59e0b, 22, 0.5);
            screenFlashCallback(0.7);
            camShakeCallback(2.0);

            this.particles.spawnShockwave(pos, 16, 0x78350f, false);
            this.particles.addScorchMark(pos, 3.2);
            this.applyBlastPhysics(pos, bomb.type.blastRadius, bomb.type.blastForce);

            // 55+ Flying Gobar Chunks (Physical brown debris)
            for (let i = 0; i < 55; i++) {
                const vel = new THREE.Vector3(
                    (Math.random() - 0.5) * 22,
                    4 + Math.random() * 16,
                    (Math.random() - 0.5) * 22
                );
                const color = Math.random() > 0.4 ? 0x45220c : 0x2e1607;
                this.particles.spawnShard(pos, vel, color, 1.2 + Math.random() * 0.8, 2.5);
            }

            // Mud dust and smoke cloud
            for (let i = 0; i < 16; i++) {
                const sVel = new THREE.Vector3(
                    (Math.random() - 0.5) * 8,
                    2 + Math.random() * 6,
                    (Math.random() - 0.5) * 8
                );
                this.particles.spawnSmoke(pos, sVel, 0x5a3818, 0.7, 0.9, 1.8, 1.6);
            }

            // Fiery sparks from embedded bomb
            for (let i = 0; i < 40; i++) {
                const speed = 8 + Math.random() * 18;
                const angle = Math.random() * Math.PI * 2;
                this.particles.spawnSpark(
                    pos.clone().add(new THREE.Vector3(0, 0.3, 0)),
                    new THREE.Vector3(Math.cos(angle) * speed, 4 + Math.random() * 12, Math.sin(angle) * speed),
                    0xfacc15,
                    1.2,
                    0.8
                );
            }

            // Screen mud splatter effect
            if (window.triggerScreenMudSplat) {
                window.triggerScreenMudSplat();
            }

            this.scene.remove(bomb.mesh);
            bomb.state = 'done';
            this.totalExploded++;
            if (window.app && window.app.onCrackerExploded) window.app.onCrackerExploded();

        } else if (typeId === 'mega_lar') {
            // 🏮 10,000-WALA MAHABALI LAR CASCADE DETONATION
            bomb.state = 'active_effect';
            bomb.effectTimer = 0;
            bomb.larIndex = 0;
            return;
        }
    }

    clear() {
        for (const b of this.activeBombs) {
            if (b.parachuteGroup) {
                this.scene.remove(b.parachuteGroup);
            }
            if (b.mesh) {
                this.scene.remove(b.mesh);
            }
        }
        this.activeBombs = [];
    }

    update(dt, camShakeCallback, screenFlashCallback) {
        // Update flash lights
        this.flashLights.forEach(f => {
            if (f.life > 0) {
                f.life -= dt;
                f.light.intensity = Math.max(0, (f.life / f.maxLife) * f.peak);
            } else {
                f.light.intensity = 0;
            }
        });

        // Update active patakhas
        for (let i = this.activeBombs.length - 1; i >= 0; i--) {
            const b = this.activeBombs[i];

            if (b.state === 'lit') {
                b.timer -= dt;

                // Fuse spark emission
                if (Math.random() < 0.75) {
                    const tipLocal = b.mesh.userData.fuseTip ? b.mesh.userData.fuseTip.clone() : new THREE.Vector3(0, 1, 0);
                    const tipWorld = tipLocal.applyMatrix4(b.mesh.matrixWorld);
                    this.particles.spawnSpark(
                        tipWorld,
                        new THREE.Vector3((Math.random() - 0.5) * 4, 2.5 + Math.random() * 3.5, (Math.random() - 0.5) * 4),
                        Math.random() > 0.4 ? 0xfef08a : 0xff7700,
                        0.65,
                        0.25
                    );
                }

                if (b.timer <= 0) {
                    this.triggerDetonation(b, camShakeCallback, screenFlashCallback);
                }

            } else if (b.state === 'active_effect') {
                const typeId = b.type.id;

                if (typeId === 'lar') {
                    // Detonate 1 cracker every 0.09s
                    b.effectTimer += dt;
                    const crackers = b.mesh.userData.crackers;

                    while (b.effectTimer >= 0.088 && b.larIndex < crackers.length) {
                        b.effectTimer -= 0.088;
                        const cMesh = crackers[b.larIndex];
                        const cWorld = new THREE.Vector3();
                        cMesh.getWorldPosition(cWorld);
                        cMesh.visible = false;

                        this.audio.playCrackerSnap();
                        this.triggerDynamicLight(cWorld, 0xff6622, 7.0, 0.12);
                        camShakeCallback(0.28);
                        this.applyBlastPhysics(cWorld, 4.5, 7.5);

                        for (let s = 0; s < 12; s++) {
                            this.particles.spawnSpark(
                                cWorld,
                                new THREE.Vector3((Math.random() - 0.5) * 12, 2 + Math.random() * 8, (Math.random() - 0.5) * 12),
                                Math.random() > 0.4 ? 0xfef08a : 0xef4444,
                                0.85,
                                0.35
                            );
                        }
                        for (let c = 0; c < 4; c++) {
                            this.particles.spawnConfetti(
                                cWorld,
                                new THREE.Vector3((Math.random() - 0.5) * 7, 2 + Math.random() * 5, (Math.random() - 0.5) * 7),
                                0xdc2626,
                                0.8,
                                1.4
                            );
                        }

                        b.larIndex++;
                        this.totalExploded++;
                    }

                    if (b.larIndex >= crackers.length) {
                        this.particles.addScorchMark(b.mesh.position, 1.8);
                        this.scene.remove(b.mesh);
                        b.state = 'done';
                    }

                } else if (typeId === 'mega_lar') {
                    // 🏮 10,000-Wala Mahabali Lar: Rapid-fire cascade across 60 crackers + Giant Mahabali Finale!
                    b.effectTimer += dt;
                    const crackers = b.mesh.userData.crackers || [];
                    const headBomb = b.mesh.userData.headBomb;

                    while (b.effectTimer >= 0.042 && b.larIndex < crackers.length) {
                        b.effectTimer -= 0.042;
                        const cMesh = crackers[b.larIndex];
                        const cWorld = new THREE.Vector3();
                        cMesh.getWorldPosition(cWorld);
                        cMesh.visible = false;
                        if (cMesh.userData.band) cMesh.userData.band.visible = false;

                        this.audio.playCrackerSnap();
                        this.triggerDynamicLight(cWorld, 0xff4422, 9.0, 0.10);
                        camShakeCallback(0.35);
                        this.applyBlastPhysics(cWorld, 5.0, 8.5);

                        for (let s = 0; s < 14; s++) {
                            this.particles.spawnSpark(
                                cWorld,
                                new THREE.Vector3((Math.random() - 0.5) * 14, 2 + Math.random() * 8, (Math.random() - 0.5) * 14),
                                Math.random() > 0.35 ? 0xfef08a : 0xf97316,
                                0.9,
                                0.4
                            );
                        }
                        for (let c = 0; c < 8; c++) {
                            this.particles.spawnConfetti(
                                cWorld,
                                new THREE.Vector3((Math.random() - 0.5) * 10, 2 + Math.random() * 7, (Math.random() - 0.5) * 10),
                                Math.random() > 0.25 ? 0xdc2626 : 0xfbbf24,
                                0.9,
                                1.8
                            );
                        }
                        if (Math.random() < 0.35) {
                            this.particles.spawnSmoke(cWorld, new THREE.Vector3((Math.random() - 0.5) * 3, 1.5, (Math.random() - 0.5) * 3), 0x94a3b8, 0.5, 0.6, 1.2, 1.2);
                        }

                        b.larIndex++;
                        this.totalExploded++;
                    }

                    if (b.larIndex >= crackers.length) {
                        if (headBomb && headBomb.visible) {
                            headBomb.visible = false;
                            const hWorld = new THREE.Vector3();
                            headBomb.getWorldPosition(hWorld);

                            // Grand Finale Mahabali explosion!
                            this.audio.playBlast(1.8, 'sutli');
                            this.triggerDynamicLight(hWorld, 0xffea00, 26.0, 0.6);
                            screenFlashCallback(0.85);
                            camShakeCallback(2.8);
                            this.particles.spawnShockwave(hWorld, 18, 0xef4444, false);
                            this.particles.addScorchMark(hWorld, 3.5);
                            this.applyBlastPhysics(hWorld, 16.0, 45.0);

                            for (let i = 0; i < 75; i++) {
                                const sSpeed = 10 + Math.random() * 22;
                                const sAngle = Math.random() * Math.PI * 2;
                                this.particles.spawnSpark(
                                    hWorld,
                                    new THREE.Vector3(Math.cos(sAngle) * sSpeed, 4 + Math.random() * 16, Math.sin(sAngle) * sSpeed),
                                    Math.random() > 0.3 ? 0xfde047 : 0xff4422,
                                    1.4,
                                    0.75
                                );
                            }
                            for (let i = 0; i < 60; i++) {
                                this.particles.spawnConfetti(
                                    hWorld,
                                    new THREE.Vector3((Math.random() - 0.5) * 20, 4 + Math.random() * 14, (Math.random() - 0.5) * 20),
                                    0xdc2626,
                                    1.2,
                                    2.5
                                );
                            }
                        }

                        this.scene.remove(b.mesh);
                        b.state = 'done';
                        if (window.app && window.app.onCrackerExploded) window.app.onCrackerExploded();
                    }

                } else if (typeId === 'anaar') {
                    // Towering multi-color spark fountain
                    b.effectTimer -= dt;
                    const topPos = b.mesh.position.clone().add(new THREE.Vector3(0, 1.15, 0));
                    this.triggerDynamicLight(topPos, 0xffb733, 7 + Math.random() * 3, 0.1);
                    this.audio.spikeDecibels(38);

                    for (let s = 0; s < 6; s++) {
                        this.particles.spawnSpark(
                            topPos.clone(),
                            new THREE.Vector3(
                                (Math.random() - 0.5) * 5.5,
                                12 + Math.random() * 8.0,
                                (Math.random() - 0.5) * 5.5
                            ),
                            [0xfffbeb, 0xfde047, 0xf97316, 0x38bdf8][Math.floor(Math.random() * 4)],
                            0.95,
                            1.0 + Math.random() * 0.4,
                            0.55
                        );
                    }

                    if (b.effectTimer <= 0) {
                        this.particles.addScorchMark(b.mesh.position, 1.0);
                        this.scene.remove(b.mesh);
                        b.state = 'done';
                    }

                } else if (typeId === 'chakri') {
                    // High-speed ground spinner
                    b.effectTimer -= dt;
                    const wheel = b.mesh.userData.wheel;
                    wheel.rotation.y += dt * 34;
                    b.chakriAngle += dt * 2.5;

                    b.mesh.position.x = Math.max(-23, Math.min(23, b.mesh.position.x + Math.cos(b.chakriAngle) * dt * 5.5));
                    b.mesh.position.z = Math.max(-23, Math.min(23, b.mesh.position.z + Math.sin(b.chakriAngle) * dt * 5.5));

                    const cPos = b.mesh.position.clone().add(new THREE.Vector3(0, 0.16, 0));
                    this.triggerDynamicLight(cPos, 0xec4899, 5, 0.08);
                    this.audio.spikeDecibels(32);

                    for (let arm = 0; arm < 3; arm++) {
                        const ang = wheel.rotation.y + (arm * Math.PI * 2) / 3;
                        this.particles.spawnSpark(
                            cPos.clone().add(new THREE.Vector3(Math.cos(ang) * 0.5, 0, Math.sin(ang) * 0.5)),
                            new THREE.Vector3(Math.cos(ang + 1.2) * 9, 1.2 + Math.random() * 2, Math.sin(ang + 1.2) * 9),
                            [0xec4899, 0x06b6d4, 0xfacc15, 0xa855f7][arm % 4],
                            0.85,
                            0.45
                        );
                    }

                    if (b.effectTimer <= 0) {
                        this.scene.remove(b.mesh);
                        b.state = 'done';
                    }

                } else if (typeId === 'rocket') {
                    // Ascending bottle rocket
                    b.effectTimer -= dt;
                    const flyer = b.mesh.userData.rocketFlyer;
                    flyer.position.y += dt * 28;

                    const rWorld = new THREE.Vector3();
                    flyer.getWorldPosition(rWorld);

                    // Rocket exhaust sparks
                    for (let t = 0; t < 3; t++) {
                        this.particles.spawnSpark(
                            rWorld.clone().add(new THREE.Vector3(0, 0.8, 0)),
                            new THREE.Vector3((Math.random() - 0.5) * 2, -4, (Math.random() - 0.5) * 2),
                            0xfde047,
                            0.8,
                            0.35
                        );
                    }

                    if (b.effectTimer <= 0) {
                        // Sky burst!
                        const skyPos = rWorld.clone().add(new THREE.Vector3(0, 2, 0));
                        this.audio.playBlast(1.0, 'sutli');
                        this.triggerDynamicLight(skyPos, 0x38bdf8, 20, 0.65);
                        screenFlashCallback(0.45);
                        camShakeCallback(0.7);

                        const palette = [0x38bdf8, 0xf43f5e, 0xfacc15, 0xa855f7, 0x4ade80];
                        const c1 = palette[Math.floor(Math.random() * palette.length)];
                        const c2 = palette[Math.floor(Math.random() * palette.length)];

                        for (let p = 0; p < 120; p++) {
                            const phi = Math.random() * Math.PI * 2;
                            const costheta = Math.random() * 2 - 1;
                            const theta = Math.acos(costheta);
                            const speed = 12 + Math.random() * 15;
                            this.particles.spawnSpark(
                                skyPos.clone(),
                                new THREE.Vector3(
                                    speed * Math.sin(theta) * Math.cos(phi),
                                    speed * Math.cos(theta),
                                    speed * Math.sin(theta) * Math.sin(phi)
                                ),
                                p % 2 === 0 ? c1 : c2,
                                1.5,
                                1.4 + Math.random() * 0.5
                            );
                        }

                        this.scene.remove(b.mesh);
                        b.state = 'done';
                        this.totalExploded++;
                    }

                } else if (typeId === 'phuljhadi') {
                    // Sparkling wand sparks
                    b.effectTimer -= dt;
                    const tipLocal = b.mesh.userData.fuseTip;
                    const tipWorld = tipLocal.clone().applyMatrix4(b.mesh.matrixWorld);

                    if (Math.random() < 0.65) {
                        this.audio.playPhuljhadiSpark();
                    }
                    this.triggerDynamicLight(tipWorld, 0xfef08a, 4, 0.08);

                    for (let s = 0; s < 4; s++) {
                        const ang = Math.random() * Math.PI * 2;
                        const spd = 2 + Math.random() * 5;
                        this.particles.spawnSpark(
                            tipWorld,
                            new THREE.Vector3(Math.cos(ang) * spd, (Math.random() - 0.2) * 5, Math.sin(ang) * spd),
                            [0xffffff, 0xfef08a, 0xfbbf24][Math.floor(Math.random() * 3)],
                            0.7,
                            0.4
                        );
                    }

                    if (b.effectTimer <= 0) {
                        this.scene.remove(b.mesh);
                        b.state = 'done';
                    }

                } else if (typeId === 'aerial_cake') {
                    // Launches 16 colorful shells in sequence!
                    b.effectTimer += dt;
                    const tubes = b.mesh.userData.tubes;

                    if (b.effectTimer >= 0.28 && b.aerialShotIndex < tubes.length) {
                        b.effectTimer = 0;
                        const tubePosLocal = tubes[b.aerialShotIndex];
                        const launchWorld = tubePosLocal.clone().applyMatrix4(b.mesh.matrixWorld);

                        this.audio.playAerialLaunch();
                        this.triggerDynamicLight(launchWorld, 0x818cf8, 8, 0.15);

                        // Spawn flying aerial shell
                        const skyBurstHeight = 18 + Math.random() * 12;
                        const skyX = launchWorld.x + (Math.random() - 0.5) * 6;
                        const skyZ = launchWorld.z + (Math.random() - 0.5) * 6;

                        setTimeout(() => {
                            const skyPos = new THREE.Vector3(skyX, skyBurstHeight, skyZ);
                            this.audio.playBlast(0.9, 'lakshmi');
                            this.triggerDynamicLight(skyPos, 0xf43f5e, 18, 0.5);
                            camShakeCallback(0.4);

                            const pal = [0xf43f5e, 0x38bdf8, 0xfacc15, 0xa855f7, 0x34d399];
                            const col = pal[Math.floor(Math.random() * pal.length)];

                            for (let p = 0; p < 75; p++) {
                                const phi = Math.random() * Math.PI * 2;
                                const theta = Math.acos(Math.random() * 2 - 1);
                                const speed = 8 + Math.random() * 12;
                                this.particles.spawnSpark(
                                    skyPos,
                                    new THREE.Vector3(
                                        speed * Math.sin(theta) * Math.cos(phi),
                                        speed * Math.cos(theta),
                                        speed * Math.sin(theta) * Math.sin(phi)
                                    ),
                                    col,
                                    1.3,
                                    1.2
                                );
                            }
                            this.totalExploded++;
                        }, 550);

                        b.aerialShotIndex++;
                    }

                    if (b.aerialShotIndex >= tubes.length) {
                        setTimeout(() => {
                            this.scene.remove(b.mesh);
                            b.state = 'done';
                        }, 1200);
                    }

                } else if (typeId === 'snake') {
                    // Extrudes black curly carbon ash column
                    b.effectTimer -= dt;
                    if (Math.random() < 0.4) {
                        const seg = new THREE.Mesh(
                            new THREE.CylinderGeometry(0.18, 0.22, 0.25, 8),
                            new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.95 })
                        );
                        // Add squiggly random walk
                        b.snakeDir.x += (Math.random() - 0.5) * 0.4;
                        b.snakeDir.z += (Math.random() - 0.5) * 0.4;
                        b.snakeDir.normalize();

                        b.snakeHeadPos.addScaledVector(b.snakeDir, 0.2);
                        b.snakeHeadPos.y += 0.12;

                        seg.position.copy(b.mesh.position).add(b.snakeHeadPos);
                        seg.rotation.set((Math.random() - 0.5) * 0.6, Math.random() * 3, (Math.random() - 0.5) * 0.6);
                        this.scene.add(seg);
                        b.mesh.userData.snakeSegments.push(seg);

                        // Smoke puff from snake tip
                        this.particles.spawnSmoke(seg.position, new THREE.Vector3(0, 0.8, 0), 0x374151, 0.4, 0.5, 1.2, 1.2);
                    }

                    if (b.effectTimer <= 0) {
                        b.state = 'done';
                    }

                } else if (typeId === 'seeti_rocket') {
                    // Ascending whistling rocket
                    b.effectTimer -= dt;
                    const flyer = b.mesh.userData.rocketFlyer;
                    flyer.position.y += dt * 32;

                    const rWorld = new THREE.Vector3();
                    flyer.getWorldPosition(rWorld);

                    // Screaming corkscrew sparks & smoke
                    const spinAng = performance.now() * 0.02;
                    this.particles.spawnSpark(
                        rWorld.clone().add(new THREE.Vector3(Math.cos(spinAng) * 0.3, -0.4, Math.sin(spinAng) * 0.3)),
                        new THREE.Vector3(Math.cos(spinAng) * 3, -6, Math.sin(spinAng) * 3),
                        0xfde047,
                        0.9,
                        0.35
                    );
                    if (Math.random() < 0.6) {
                        this.particles.spawnSmoke(
                            rWorld.clone().add(new THREE.Vector3(0, -0.5, 0)),
                            new THREE.Vector3(0, -1, 0),
                            0xd1d5db,
                            0.45,
                            0.6,
                            1.2,
                            1.3
                        );
                    }

                    if (b.effectTimer <= 0) {
                        // Magnificent Willow Sky Burst
                        const skyPos = rWorld.clone().add(new THREE.Vector3(0, 1.5, 0));
                        this.audio.playBlast(1.15, 'sutli');
                        this.triggerDynamicLight(skyPos, 0xfacc15, 25, 0.8);
                        screenFlashCallback(0.55);
                        camShakeCallback(0.85);

                        const pal = [0xfacc15, 0xfde047, 0xffedd5, 0x38bdf8, 0xec4899];
                        for (let p = 0; p < 150; p++) {
                            const phi = Math.random() * Math.PI * 2;
                            const theta = Math.acos(Math.random() * 2 - 1);
                            const speed = 10 + Math.random() * 22;
                            this.particles.spawnSpark(
                                skyPos,
                                new THREE.Vector3(
                                    speed * Math.sin(theta) * Math.cos(phi),
                                    speed * Math.cos(theta),
                                    speed * Math.sin(theta) * Math.sin(phi)
                                ),
                                pal[Math.floor(Math.random() * pal.length)],
                                1.6,
                                1.6 + Math.random() * 0.6,
                                0.4
                            );
                        }
                        this.scene.remove(b.mesh);
                        b.state = 'done';
                        this.totalExploded++;
                    }

                } else if (typeId === 'helicopter') {
                    // Disco Helicopter: Ground spin -> Aerial takeoff -> Mid-air pop
                    b.effectTimer -= dt;
                    const elapsed = 3.2 - b.effectTimer;
                    b.mesh.rotation.y += dt * 38;

                    if (elapsed < 1.1) {
                        // Ground spin phase
                        const cPos = b.mesh.position.clone().add(new THREE.Vector3(0, 0.15, 0));
                        this.triggerDynamicLight(cPos, 0x22c55e, 5, 0.08);
                        for (let arm = 0; arm < 3; arm++) {
                            const ang = b.mesh.rotation.y + (arm * Math.PI * 2) / 3;
                            this.particles.spawnSpark(
                                cPos.clone().add(new THREE.Vector3(Math.cos(ang) * 0.5, 0, Math.sin(ang) * 0.5)),
                                new THREE.Vector3(Math.cos(ang + 1.2) * 8, 1 + Math.random() * 2, Math.sin(ang + 1.2) * 8),
                                [0x22c55e, 0xfacc15, 0x06b6d4][arm % 3],
                                0.8,
                                0.35
                            );
                        }
                    } else {
                        // Vertical lift phase
                        b.mesh.position.y += dt * 7.5;
                        const cPos = b.mesh.position.clone();
                        this.triggerDynamicLight(cPos, 0x06b6d4, 6, 0.08);

                        for (let s = 0; s < 3; s++) {
                            const ang = b.mesh.rotation.y + (s * Math.PI * 2) / 3;
                            this.particles.spawnSpark(
                                cPos.clone().add(new THREE.Vector3(0, -0.1, 0)),
                                new THREE.Vector3(Math.cos(ang) * 4, -4, Math.sin(ang) * 4),
                                [0x22c55e, 0xec4899, 0xfacc15][s % 3],
                                0.85,
                                0.4
                            );
                        }
                    }

                    if (b.effectTimer <= 0) {
                        // Mid-air celebratory burst!
                        const airPos = b.mesh.position.clone();
                        this.audio.playBlast(0.85, 'lakshmi');
                        this.triggerDynamicLight(airPos, 0x22c55e, 16, 0.45);
                        camShakeCallback(0.4);

                        for (let p = 0; p < 70; p++) {
                            const phi = Math.random() * Math.PI * 2;
                            const theta = Math.acos(Math.random() * 2 - 1);
                            const spd = 6 + Math.random() * 12;
                            this.particles.spawnSpark(
                                airPos,
                                new THREE.Vector3(spd * Math.sin(theta) * Math.cos(phi), spd * Math.cos(theta), spd * Math.sin(theta) * Math.sin(phi)),
                                [0x22c55e, 0x06b6d4, 0xfacc15, 0xec4899][p % 4],
                                1.2,
                                1.0
                            );
                        }
                        for (let c = 0; c < 25; c++) {
                            this.particles.spawnConfetti(
                                airPos,
                                new THREE.Vector3((Math.random() - 0.5) * 8, 2 + Math.random() * 4, (Math.random() - 0.5) * 8),
                                [0x22c55e, 0xfacc15, 0xec4899][c % 3],
                                0.8,
                                2.0
                            );
                        }

                        this.scene.remove(b.mesh);
                        b.state = 'done';
                        this.totalExploded++;
                    }

                } else if (typeId === 'smoke_bomb') {
                    // Billowing Tri-Color Festive Smoke
                    b.effectTimer -= dt;
                    b.smokeTimer = (b.smokeTimer || 0) + dt;

                    const topPos = b.mesh.position.clone().add(new THREE.Vector3(0, 0.95, 0));

                    // Color shifts through Saffron -> Green -> Magenta -> Cyan
                    const elapsed = 5.5 - b.effectTimer;
                    let currentColor = 0xf97316; // Saffron
                    if (elapsed > 4.0) currentColor = 0x06b6d4; // Cyan
                    else if (elapsed > 2.6) currentColor = 0xd946ef; // Magenta
                    else if (elapsed > 1.3) currentColor = 0x10b981; // Green

                    this.triggerDynamicLight(topPos, currentColor, 3.5, 0.1);

                    if (b.smokeTimer >= 0.08) {
                        b.smokeTimer = 0;
                        const angle = Math.random() * Math.PI * 2;
                        const driftSpeed = 0.5 + Math.random() * 1.2;
                        this.particles.spawnSmoke(
                            topPos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 0.3, 0, (Math.random() - 0.5) * 0.3)),
                            new THREE.Vector3(Math.cos(angle) * driftSpeed, 1.8 + Math.random() * 2.2, Math.sin(angle) * driftSpeed),
                            currentColor,
                            0.72,
                            1.1,
                            3.2,
                            2.6
                        );
                    }

                    if (Math.random() < 0.35) {
                        this.particles.spawnSpark(
                            topPos,
                            new THREE.Vector3((Math.random() - 0.5) * 2, 1.5 + Math.random() * 2, (Math.random() - 0.5) * 2),
                            0xfef08a,
                            0.6,
                            0.25
                        );
                    }

                    if (b.effectTimer <= 0) {
                        this.particles.addScorchMark(b.mesh.position, 1.2);
                        this.scene.remove(b.mesh);
                        b.state = 'done';
                    }

                } else if (typeId === 'parachute') {
                    // Parachute Sky Shot: Ascent -> Canopy Deployment -> Drifting Flare
                    if (!b.parachuteDeployed) {
                        b.effectTimer -= dt;
                        const flyer = b.mesh.userData.rocketFlyer;
                        flyer.position.y += dt * 26;

                        const rWorld = new THREE.Vector3();
                        flyer.getWorldPosition(rWorld);

                        this.particles.spawnSpark(
                            rWorld.clone().add(new THREE.Vector3(0, -0.2, 0)),
                            new THREE.Vector3((Math.random() - 0.5) * 2, -5, (Math.random() - 0.5) * 2),
                            0xfbbf24,
                            0.8,
                            0.3
                        );

                        if (b.effectTimer <= 0) {
                            // Apex reached: deploy parachute!
                            b.parachuteDeployed = true;
                            this.audio.playParachuteDeploy();
                            const apexPos = rWorld.clone().add(new THREE.Vector3(0, 0.5, 0));

                            this.scene.remove(b.mesh);

                            // Build 3D Parachute object
                            const pGroup = new THREE.Group();
                            pGroup.position.copy(apexPos);

                            // 1. Striped Canopy Dome
                            const canopyGeo = new THREE.SphereGeometry(1.6, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2);
                            const canopyMat = new THREE.MeshStandardMaterial({
                                color: 0xf59e0b,
                                roughness: 0.7,
                                side: THREE.DoubleSide
                            });
                            const canopy = new THREE.Mesh(canopyGeo, canopyMat);
                            canopy.position.y = 1.2;
                            pGroup.add(canopy);

                            // 2. Suspension lines
                            for (let l = 0; l < 4; l++) {
                                const ang = (l * Math.PI) / 2;
                                const line = new THREE.Mesh(
                                    new THREE.CylinderGeometry(0.015, 0.015, 1.4, 4),
                                    new THREE.MeshBasicMaterial({ color: 0xe2e8f0 })
                                );
                                line.position.set(Math.cos(ang) * 0.7, 0.6, Math.sin(ang) * 0.7);
                                line.rotation.z = Math.cos(ang) * 0.45;
                                line.rotation.x = Math.sin(ang) * 0.45;
                                pGroup.add(line);
                            }

                            // 3. Glowing hanging flare (Bright emissive unlit mesh)
                            const flare = new THREE.Mesh(
                                new THREE.CylinderGeometry(0.12, 0.12, 0.45, 8),
                                new THREE.MeshBasicMaterial({ color: 0xfffbeb })
                            );
                            flare.position.y = 0;
                            pGroup.add(flare);

                            this.scene.add(pGroup);
                            b.parachuteGroup = pGroup;
                            b.floatTimer = 0;
                            this.totalExploded++;
                        }
                    } else {
                        // Parachute floating descent phase
                        b.floatTimer += dt;
                        const pGroup = b.parachuteGroup;
                        pGroup.position.y -= dt * 2.2;
                        pGroup.position.x += Math.sin(b.floatTimer * 1.4) * dt * 1.6;
                        pGroup.position.z += Math.cos(b.floatTimer * 1.1) * dt * 1.2;
                        pGroup.rotation.z = Math.sin(b.floatTimer * 1.4) * 0.12;

                        const flareWorld = new THREE.Vector3();
                        pGroup.getWorldPosition(flareWorld);

                        if (Math.random() < 0.65) {
                            this.particles.spawnSpark(
                                flareWorld,
                                new THREE.Vector3((Math.random() - 0.5) * 2, -2.5, (Math.random() - 0.5) * 2),
                                0xfde047,
                                0.8,
                                0.4
                            );
                        }
                        this.triggerDynamicLight(flareWorld, 0xf59e0b, 5, 0.1);

                        // Touchdown ground
                        if (pGroup.position.y <= 0.3) {
                            this.particles.spawnSmoke(pGroup.position, new THREE.Vector3(0, 0.8, 0), 0x9ca3af, 0.5, 0.7, 1.5, 1.4);
                            this.scene.remove(pGroup);
                            b.state = 'done';
                        }
                    }
                }
            }

            if (b.state === 'done') {
                this.activeBombs.splice(i, 1);
            }
        }
    }
}

window.PatakhaManager = PatakhaManager;
window.PATAKHA_DEFINITIONS = PATAKHA_DEFINITIONS;

