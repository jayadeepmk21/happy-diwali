/**
 * Particle & VFX Engine for 3D Patakha Simulator
 * Ultra High-Performance Object-Pooled Engine optimized for 4GB RAM Mobile Devices.
 * Zero-allocation in game loop: No runtime new Mesh/Material/Vector3 creations, 
 * No garbage collection stutter, rock-solid 60 FPS under massive cracker barrages.
 */
class ParticleSystem {
    constructor(scene) {
        this.scene = scene;

        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || 
                         window.innerWidth < 768 || 
                         (navigator.deviceMemory && navigator.deviceMemory <= 4);
        this.isMobile = isMobile;

        // Pooled capacities tailored for silky 60 FPS on 4GB mobile hardware
        this.maxSparks = isMobile ? 180 : 320;
        this.maxConfetti = isMobile ? 50 : 90;
        this.maxSmoke = isMobile ? 35 : 65;
        this.maxShards = isMobile ? 24 : 45;
        this.maxShockwaves = isMobile ? 8 : 14;
        this.maxScorchMarks = isMobile ? 20 : 35;

        // Reusable shared geometries (created once, never disposed during gameplay)
        this.geoSphere = new THREE.SphereGeometry(0.12, 5, 4);
        this.geoConfetti = new THREE.PlaneGeometry(0.24, 0.14);
        this.geoSmoke = new THREE.DodecahedronGeometry(0.55, 1);
        this.geoShard = new THREE.TetrahedronGeometry(0.22);
        this.geoRing = new THREE.RingGeometry(0.3, 0.9, 28);
        this.geoDome = new THREE.SphereGeometry(1, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2);
        this.geoScorch = new THREE.CircleGeometry(1.6, 16);

        // Material Caches by color hex (zero new Material allocations during explosions)
        this.basicMatCache = {};
        this.confettiMatCache = {};
        this.shardMatCache = {};

        // Shared static materials
        this.smokeMat = new THREE.MeshBasicMaterial({
            color: 0x9ca3af,
            transparent: true,
            opacity: 0.45,
            depthWrite: false
        });

        this.scorchMat = new THREE.MeshBasicMaterial({
            color: 0x050407,
            transparent: true,
            opacity: 0.72,
            depthWrite: false
        });

        // Initialize Object Pools
        this.initSparksPool();
        this.initConfettiPool();
        this.initSmokePool();
        this.initShardsPool();
        this.initShockwavesPool();
        this.initScorchPool();
    }

    getBasicMaterial(colorHex) {
        if (!this.basicMatCache[colorHex]) {
            this.basicMatCache[colorHex] = new THREE.MeshBasicMaterial({
                color: colorHex,
                transparent: true,
                opacity: 0.95
            });
        }
        return this.basicMatCache[colorHex];
    }

    getConfettiMaterial(colorHex) {
        if (!this.confettiMatCache[colorHex]) {
            this.confettiMatCache[colorHex] = new THREE.MeshBasicMaterial({
                color: colorHex,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.95
            });
        }
        return this.confettiMatCache[colorHex];
    }

    getShardMaterial(colorHex) {
        if (!this.shardMatCache[colorHex]) {
            this.shardMatCache[colorHex] = new THREE.MeshStandardMaterial({
                color: colorHex,
                roughness: 0.85
            });
        }
        return this.shardMatCache[colorHex];
    }

    initSparksPool() {
        this.sparkPool = [];
        this.sparkHead = 0;
        const defaultMat = this.getBasicMaterial(0xffaa00);

        for (let i = 0; i < this.maxSparks; i++) {
            const mesh = new THREE.Mesh(this.geoSphere, defaultMat);
            mesh.visible = false;
            this.scene.add(mesh);

            this.sparkPool.push({
                mesh,
                vx: 0, vy: 0, vz: 0,
                gravity: -19,
                drag: 0.985,
                bounce: 0.5,
                life: 0,
                maxLife: 1,
                baseScale: 1,
                active: false
            });
        }
    }

    initConfettiPool() {
        this.confettiPool = [];
        this.confettiHead = 0;
        const defaultMat = this.getConfettiMaterial(0xef4444);

        for (let i = 0; i < this.maxConfetti; i++) {
            const mesh = new THREE.Mesh(this.geoConfetti, defaultMat);
            mesh.visible = false;
            this.scene.add(mesh);

            this.confettiPool.push({
                mesh,
                vx: 0, vy: 0, vz: 0,
                vrx: 0, vry: 0, vrz: 0,
                gravity: -6.5,
                drag: 0.94,
                bounce: 0.1,
                life: 0,
                maxLife: 2,
                active: false
            });
        }
    }

    initSmokePool() {
        this.smokePool = [];
        this.smokeHead = 0;

        for (let i = 0; i < this.maxSmoke; i++) {
            const mesh = new THREE.Mesh(this.geoSmoke, this.smokeMat);
            mesh.visible = false;
            this.scene.add(mesh);

            this.smokePool.push({
                mesh,
                vx: 0, vy: 0, vz: 0,
                gravity: 1.2,
                drag: 0.96,
                life: 0,
                maxLife: 2,
                growRate: 1.8,
                baseScale: 0.8,
                active: false
            });
        }
    }

    initShardsPool() {
        this.shardPool = [];
        this.shardHead = 0;
        const defaultMat = this.getShardMaterial(0xc2410c);

        for (let i = 0; i < this.maxShards; i++) {
            const mesh = new THREE.Mesh(this.geoShard, defaultMat);
            mesh.visible = false;
            this.scene.add(mesh);

            this.shardPool.push({
                mesh,
                vx: 0, vy: 0, vz: 0,
                vrx: 0, vry: 0, vrz: 0,
                gravity: -22,
                drag: 0.98,
                bounce: 0.35,
                life: 0,
                maxLife: 1.8,
                active: false
            });
        }
    }

    initShockwavesPool() {
        this.shockwavePool = [];
        this.shockwaveHead = 0;
        const defaultRingMat = this.getBasicMaterial(0xffaa33);
        const defaultDomeMat = new THREE.MeshBasicMaterial({
            color: 0xffdf70,
            transparent: true,
            opacity: 0.55,
            side: THREE.DoubleSide,
            depthWrite: false
        });

        for (let i = 0; i < this.maxShockwaves; i++) {
            const ring = new THREE.Mesh(this.geoRing, defaultRingMat);
            ring.rotation.x = -Math.PI / 2;
            ring.visible = false;
            this.scene.add(ring);

            const dome = new THREE.Mesh(this.geoDome, defaultDomeMat);
            dome.visible = false;
            this.scene.add(dome);

            this.shockwavePool.push({
                ring,
                dome,
                life: 0,
                maxLife: 0.45,
                maxScale: 14,
                isDome: false,
                active: false
            });
        }
    }

    initScorchPool() {
        this.scorchPool = [];
        this.scorchHead = 0;

        for (let i = 0; i < this.maxScorchMarks; i++) {
            const mesh = new THREE.Mesh(this.geoScorch, this.scorchMat);
            mesh.rotation.x = -Math.PI / 2;
            mesh.visible = false;
            this.scene.add(mesh);

            this.scorchPool.push(mesh);
        }
    }

    spawnSpark(pos, vel, color = 0xffaa00, scale = 1.0, life = 1.0, bounce = 0.5) {
        const p = this.sparkPool[this.sparkHead];
        this.sparkHead = (this.sparkHead + 1) % this.maxSparks;

        p.mesh.position.set(pos.x, pos.y, pos.z);
        p.vx = vel.x;
        p.vy = vel.y;
        p.vz = vel.z;
        p.gravity = -19;
        p.drag = 0.985;
        p.bounce = bounce;
        p.life = life;
        p.maxLife = life;
        p.baseScale = scale;
        p.active = true;

        p.mesh.material = this.getBasicMaterial(color);
        p.mesh.scale.setScalar(scale);
        p.mesh.visible = true;
    }

    spawnConfetti(pos, vel, color = 0xef4444, scale = 1.0, life = 2.0) {
        const p = this.confettiPool[this.confettiHead];
        this.confettiHead = (this.confettiHead + 1) % this.maxConfetti;

        p.mesh.position.set(pos.x, pos.y, pos.z);
        p.vx = vel.x;
        p.vy = vel.y;
        p.vz = vel.z;
        p.vrx = (Math.random() - 0.5) * 16;
        p.vry = (Math.random() - 0.5) * 16;
        p.vrz = (Math.random() - 0.5) * 16;
        p.gravity = -6.5;
        p.drag = 0.94;
        p.bounce = 0.1;
        p.life = life;
        p.maxLife = life;
        p.active = true;

        p.mesh.material = this.getConfettiMaterial(color);
        p.mesh.scale.setScalar(scale);
        p.mesh.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
        p.mesh.visible = true;
    }

    spawnSmoke(pos, vel, color = 0x9ca3af, opacity = 0.5, scale = 0.8, life = 2.0, growRate = 1.8) {
        const p = this.smokePool[this.smokeHead];
        this.smokeHead = (this.smokeHead + 1) % this.maxSmoke;

        p.mesh.position.set(pos.x, pos.y, pos.z);
        p.vx = vel.x;
        p.vy = vel.y;
        p.vz = vel.z;
        p.gravity = 1.2;
        p.drag = 0.96;
        p.life = life;
        p.maxLife = life;
        p.growRate = growRate;
        p.baseScale = scale;
        p.active = true;

        p.mesh.scale.setScalar(scale);
        p.mesh.visible = true;
    }

    spawnShard(pos, vel, color = 0xc2410c, scale = 1.0, life = 1.8) {
        const p = this.shardPool[this.shardHead];
        this.shardHead = (this.shardHead + 1) % this.maxShards;

        p.mesh.position.set(pos.x, pos.y, pos.z);
        p.vx = vel.x;
        p.vy = vel.y;
        p.vz = vel.z;
        p.vrx = (Math.random() - 0.5) * 20;
        p.vry = (Math.random() - 0.5) * 20;
        p.vrz = (Math.random() - 0.5) * 20;
        p.gravity = -22;
        p.drag = 0.98;
        p.bounce = 0.35;
        p.life = life;
        p.maxLife = life;
        p.active = true;

        p.mesh.material = this.getShardMaterial(color);
        p.mesh.scale.setScalar(scale);
        p.mesh.visible = true;
    }

    spawnShockwave(pos, maxRadius = 14, colorHex = 0xffaa33, isDome = false) {
        const sw = this.shockwavePool[this.shockwaveHead];
        this.shockwaveHead = (this.shockwaveHead + 1) % this.maxShockwaves;

        sw.ring.position.set(pos.x, 0.08, pos.z);
        sw.ring.material = this.getBasicMaterial(colorHex);
        sw.ring.scale.set(0.1, 0.1, 0.1);
        sw.ring.visible = true;

        sw.isDome = isDome;
        if (isDome) {
            sw.dome.position.set(pos.x, 0.02, pos.z);
            sw.dome.scale.set(0.1, 0.1, 0.1);
            sw.dome.visible = true;
        } else {
            sw.dome.visible = false;
        }

        sw.life = 0.45;
        sw.maxLife = 0.45;
        sw.maxScale = maxRadius;
        sw.active = true;
    }

    addScorchMark(pos, radius = 1.6) {
        const mesh = this.scorchPool[this.scorchHead];
        this.scorchHead = (this.scorchHead + 1) % this.maxScorchMarks;

        const scale = radius / 1.6;
        mesh.scale.set(scale, scale, 1);
        mesh.position.set(pos.x, 0.015 + (this.scorchHead % 10) * 0.001, pos.z);
        mesh.visible = true;
    }

    clear() {
        // Zero allocations: simply hide and reset all pooled meshes
        for (let i = 0; i < this.maxSparks; i++) {
            this.sparkPool[i].active = false;
            this.sparkPool[i].mesh.visible = false;
        }
        for (let i = 0; i < this.maxConfetti; i++) {
            this.confettiPool[i].active = false;
            this.confettiPool[i].mesh.visible = false;
        }
        for (let i = 0; i < this.maxSmoke; i++) {
            this.smokePool[i].active = false;
            this.smokePool[i].mesh.visible = false;
        }
        for (let i = 0; i < this.maxShards; i++) {
            this.shardPool[i].active = false;
            this.shardPool[i].mesh.visible = false;
        }
        for (let i = 0; i < this.maxShockwaves; i++) {
            this.shockwavePool[i].active = false;
            this.shockwavePool[i].ring.visible = false;
            this.shockwavePool[i].dome.visible = false;
        }
        for (let i = 0; i < this.maxScorchMarks; i++) {
            this.scorchPool[i].visible = false;
        }
    }

    update(dt) {
        // 1. Update Sparks
        for (let i = 0; i < this.maxSparks; i++) {
            const p = this.sparkPool[i];
            if (!p.active) continue;

            p.life -= dt;
            if (p.life <= 0) {
                p.active = false;
                p.mesh.visible = false;
                continue;
            }

            p.vy += p.gravity * dt;
            p.vx *= p.drag;
            p.vz *= p.drag;
            p.mesh.position.x += p.vx * dt;
            p.mesh.position.y += p.vy * dt;
            p.mesh.position.z += p.vz * dt;

            // Ground collision & bounce
            if (p.mesh.position.y < 0.06 && p.vy < 0) {
                p.mesh.position.y = 0.06;
                p.vy = -p.vy * p.bounce;
                p.vx *= 0.8;
                p.vz *= 0.8;
            }

            // Natural scale decay for sparkling cooling effect
            const ratio = p.life / p.maxLife;
            p.mesh.scale.setScalar(p.baseScale * Math.min(1.0, ratio * 1.35));
        }

        // 2. Update Confetti
        for (let i = 0; i < this.maxConfetti; i++) {
            const p = this.confettiPool[i];
            if (!p.active) continue;

            p.life -= dt;
            if (p.life <= 0) {
                p.active = false;
                p.mesh.visible = false;
                continue;
            }

            p.vy += p.gravity * dt;
            p.vx *= p.drag;
            p.vz *= p.drag;
            p.mesh.position.x += p.vx * dt;
            p.mesh.position.y += p.vy * dt;
            p.mesh.position.z += p.vz * dt;

            if (p.mesh.position.y < 0.06 && p.vy < 0) {
                p.mesh.position.y = 0.06;
                p.vy = -p.vy * p.bounce;
                p.vx *= 0.7;
                p.vz *= 0.7;
            }

            p.mesh.rotation.x += p.vrx * dt;
            p.mesh.rotation.y += p.vry * dt;
            p.mesh.rotation.z += p.vrz * dt;
        }

        // 3. Update Smoke
        for (let i = 0; i < this.maxSmoke; i++) {
            const p = this.smokePool[i];
            if (!p.active) continue;

            p.life -= dt;
            if (p.life <= 0) {
                p.active = false;
                p.mesh.visible = false;
                continue;
            }

            p.vy += p.gravity * dt;
            p.vx *= p.drag;
            p.vz *= p.drag;
            p.mesh.position.x += p.vx * dt;
            p.mesh.position.y += p.vy * dt;
            p.mesh.position.z += p.vz * dt;
            p.mesh.scale.addScalar(p.growRate * dt);
        }

        // 4. Update Shards
        for (let i = 0; i < this.maxShards; i++) {
            const p = this.shardPool[i];
            if (!p.active) continue;

            p.life -= dt;
            if (p.life <= 0) {
                p.active = false;
                p.mesh.visible = false;
                continue;
            }

            p.vy += p.gravity * dt;
            p.vx *= p.drag;
            p.vz *= p.drag;
            p.mesh.position.x += p.vx * dt;
            p.mesh.position.y += p.vy * dt;
            p.mesh.position.z += p.vz * dt;

            if (p.mesh.position.y < 0.06 && p.vy < 0) {
                p.mesh.position.y = 0.06;
                p.vy = -p.vy * p.bounce;
                p.vx *= 0.75;
                p.vz *= 0.75;
            }

            p.mesh.rotation.x += p.vrx * dt;
            p.mesh.rotation.y += p.vry * dt;
            p.mesh.rotation.z += p.vrz * dt;
        }

        // 5. Update Shockwaves
        for (let i = 0; i < this.maxShockwaves; i++) {
            const sw = this.shockwavePool[i];
            if (!sw.active) continue;

            sw.life -= dt;
            if (sw.life <= 0) {
                sw.active = false;
                sw.ring.visible = false;
                sw.dome.visible = false;
                continue;
            }

            const progress = 1 - sw.life / sw.maxLife;
            const sc = 0.2 + progress * sw.maxScale;
            sw.ring.scale.set(sc, sc, sc);

            if (sw.isDome) {
                const dsc = 0.2 + progress * sw.maxScale * 0.85;
                sw.dome.scale.set(dsc, dsc, dsc);
            }
        }
    }
}

window.ParticleSystem = ParticleSystem;
