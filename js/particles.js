/**
 * Particle & VFX Engine for 3D Patakha Simulator
 * High performance visual effects: Sparks, Confetti, Smoke, Shockwaves, Scorch Decals & Shards.
 */
class ParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
        this.shockwaves = [];
        this.scorchMarks = [];
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768;
        this.maxParticles = isMobile ? 250 : 380; // Optimized for smooth 60 FPS under heavy barrage
        this.maxScorchMarks = 30;

        // Shared geometries for performance
        this.geoSphere = new THREE.SphereGeometry(0.12, 5, 5);
        this.geoSpike = new THREE.ConeGeometry(0.08, 0.4, 4);
        this.geoConfetti = new THREE.PlaneGeometry(0.24, 0.14);
        this.geoSmoke = new THREE.DodecahedronGeometry(0.55, 1);
        this.geoShard = new THREE.TetrahedronGeometry(0.22);
    }

    spawnSpark(pos, vel, color = 0xffaa00, scale = 1.0, life = 1.0, bounce = 0.5) {
        if (this.particles.length >= this.maxParticles) {
            this.recycleOldest();
        }

        const mat = new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 1.0
        });

        const mesh = new THREE.Mesh(this.geoSphere, mat);
        mesh.position.copy(pos);
        mesh.scale.setScalar(scale);
        this.scene.add(mesh);

        this.particles.push({
            mesh,
            vel: vel.clone(),
            gravity: -19,
            drag: 0.985,
            bounce,
            life,
            maxLife: life,
            type: 'spark',
            colorHex: color
        });
    }

    spawnConfetti(pos, vel, color = 0xef4444, scale = 1.0, life = 2.0) {
        if (this.particles.length >= this.maxParticles) {
            this.recycleOldest();
        }

        const mat = new THREE.MeshBasicMaterial({
            color,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 1.0
        });

        const mesh = new THREE.Mesh(this.geoConfetti, mat);
        mesh.position.copy(pos);
        mesh.scale.setScalar(scale);
        mesh.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
        this.scene.add(mesh);

        this.particles.push({
            mesh,
            vel: vel.clone(),
            gravity: -6.5,
            drag: 0.94,
            bounce: 0.1,
            life,
            maxLife: life,
            type: 'confetti',
            rotSpeed: new THREE.Vector3(
                (Math.random() - 0.5) * 16,
                (Math.random() - 0.5) * 16,
                (Math.random() - 0.5) * 16
            )
        });
    }

    spawnSmoke(pos, vel, color = 0x9ca3af, opacity = 0.5, scale = 0.8, life = 2.0, growRate = 1.8) {
        if (this.particles.length >= this.maxParticles) {
            this.recycleOldest();
        }

        const mat = new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity,
            wireframe: false
        });

        const mesh = new THREE.Mesh(this.geoSmoke, mat);
        mesh.position.copy(pos);
        mesh.scale.setScalar(scale);
        this.scene.add(mesh);

        this.particles.push({
            mesh,
            vel: vel.clone(),
            gravity: 1.2, // Rises upwards
            drag: 0.96,
            bounce: 0,
            life,
            maxLife: life,
            type: 'smoke',
            growRate,
            targetOpacity: opacity
        });
    }

    spawnShard(pos, vel, color = 0xc2410c, scale = 1.0, life = 1.8) {
        const mat = new THREE.MeshStandardMaterial({
            color,
            roughness: 0.85
        });

        const mesh = new THREE.Mesh(this.geoShard, mat);
        mesh.position.copy(pos);
        mesh.scale.setScalar(scale);
        mesh.castShadow = true;
        this.scene.add(mesh);

        this.particles.push({
            mesh,
            vel: vel.clone(),
            gravity: -22,
            drag: 0.98,
            bounce: 0.35,
            life,
            maxLife: life,
            type: 'shard',
            rotSpeed: new THREE.Vector3(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20
            )
        });
    }

    spawnShockwave(pos, maxRadius = 14, colorHex = 0xffaa33, isDome = false) {
        // Ground expansion ring
        const ringGeo = new THREE.RingGeometry(0.3, 0.9, 36);
        const ringMat = new THREE.MeshBasicMaterial({
            color: colorHex,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.92
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = -Math.PI / 2;
        ring.position.set(pos.x, 0.08, pos.z);
        this.scene.add(ring);

        this.shockwaves.push({
            mesh: ring,
            life: 0.45,
            maxLife: 0.45,
            maxScale: maxRadius
        });

        if (isDome) {
            const domeGeo = new THREE.SphereGeometry(1, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2);
            const domeMat = new THREE.MeshBasicMaterial({
                color: 0xffdf70,
                transparent: true,
                opacity: 0.65,
                side: THREE.DoubleSide
            });
            const dome = new THREE.Mesh(domeGeo, domeMat);
            dome.position.set(pos.x, 0.02, pos.z);
            this.scene.add(dome);

            this.shockwaves.push({
                mesh: dome,
                life: 0.55,
                maxLife: 0.55,
                maxScale: maxRadius * 0.85
            });
        }
    }

    addScorchMark(pos, radius = 1.6) {
        const markGeo = new THREE.CircleGeometry(radius, 20);
        const markMat = new THREE.MeshBasicMaterial({
            color: 0x050407,
            transparent: true,
            opacity: 0.76
        });
        const mark = new THREE.Mesh(markGeo, markMat);
        mark.rotation.x = -Math.PI / 2;
        // Stagger slightly above floor to avoid z-fighting
        mark.position.set(pos.x, 0.015 + (this.scorchMarks.length % 12) * 0.001, pos.z);
        this.scene.add(mark);
        this.scorchMarks.push(mark);

        if (this.scorchMarks.length > this.maxScorchMarks) {
            const old = this.scorchMarks.shift();
            this.scene.remove(old);
            old.geometry.dispose();
            old.material.dispose();
        }
    }

    recycleOldest() {
        if (this.particles.length > 0) {
            const p = this.particles.shift();
            this.scene.remove(p.mesh);
            p.mesh.material.dispose();
        }
    }

    clear() {
        for (const p of this.particles) {
            this.scene.remove(p.mesh);
            p.mesh.material.dispose();
        }
        this.particles = [];

        for (const s of this.shockwaves) {
            this.scene.remove(s.mesh);
            s.mesh.geometry.dispose();
            s.mesh.material.dispose();
        }
        this.shockwaves = [];

        for (const m of this.scorchMarks) {
            this.scene.remove(m);
            m.geometry.dispose();
            m.material.dispose();
        }
        this.scorchMarks = [];
    }

    update(dt) {
        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.life -= dt;

            if (p.life <= 0) {
                this.scene.remove(p.mesh);
                p.mesh.material.dispose();
                this.particles.splice(i, 1);
                continue;
            }

            p.vel.y += p.gravity * dt;
            p.vel.multiplyScalar(p.drag);
            p.mesh.position.addScaledVector(p.vel, dt);

            // Floor collision & bounce
            if (p.mesh.position.y < 0.06 && p.vel.y < 0) {
                p.mesh.position.y = 0.06;
                p.vel.y = -p.vel.y * p.bounce;
                p.vel.x *= 0.8;
                p.vel.z *= 0.8;
            }

            if (p.rotSpeed) {
                p.mesh.rotation.x += p.rotSpeed.x * dt;
                p.mesh.rotation.y += p.rotSpeed.y * dt;
                p.mesh.rotation.z += p.rotSpeed.z * dt;
            }

            if (p.growRate) {
                p.mesh.scale.addScalar(p.growRate * dt);
            }

            // Alpha fading based on remaining lifetime
            const ratio = p.life / p.maxLife;
            if (p.type === 'smoke') {
                p.mesh.material.opacity = p.targetOpacity * ratio;
            } else {
                p.mesh.material.opacity = Math.min(1.0, ratio * 1.4);
            }
        }

        // Update shockwaves
        for (let i = this.shockwaves.length - 1; i >= 0; i--) {
            const sw = this.shockwaves[i];
            sw.life -= dt;

            if (sw.life <= 0) {
                this.scene.remove(sw.mesh);
                sw.mesh.geometry.dispose();
                sw.mesh.material.dispose();
                this.shockwaves.splice(i, 1);
                continue;
            }

            const progress = 1 - sw.life / sw.maxLife;
            const sc = 1 + progress * sw.maxScale;
            sw.mesh.scale.set(sc, sc, sc);
            sw.mesh.material.opacity = (1 - progress) * 0.88;
        }
    }
}

window.ParticleSystem = ParticleSystem;

