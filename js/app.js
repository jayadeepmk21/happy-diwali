/**
 * App Coordinator & Main Game Loop
 * Glues together Audio, 3D Scene, Particle FX, Destructible Props, and UI controls.
 */

const CYLINDER_MEME_DIALOGUES = [
    {
        title: "ABE SAALE! DIWALI HAI DIWALA NAHI! 💀",
        desc: "Abe saale! Diwali hai, poore mohalle ka diwala nahi nikalna hai bc! 💀 14.2 KG ka Bharat Gas cylinder hai, Sutli Bomb nahi! Pura district sidha space mein chala jayega!"
    },
    {
        title: "NASA WALE BOHOT KHATARNAK HAIN... 🚀",
        desc: "NASA wale bohot khatarnak hain... lekin tu unse bhi bada psycho nikla bc! Cylinder ko lighter dikha raha hai?! Chandrayaan par direct entry lene ka plan hai kya?!"
    },
    {
        title: "MUMMY ALERT: KHATRON KE KHILADI 🩴",
        desc: "Cylinder baad mein phootega, pehle mummy ka flying belan aur chappal 120 km/h ki speed se sidha tere sar par aayega! Sudhar ja bhai!"
    },
    {
        title: "ISRO BUDGET CUT MEME 🛰️",
        desc: "ISRO Headquarters se call aaya hai: 'Bhai rocket launch ka budget kam tha, tu cylinder hi phod de, poore mohalle ko Mars bhej denge!'"
    },
    {
        title: "SHARMA JI KA CAR ALARM 🚗",
        desc: "Sharma ji folded hands ke saath: 'Bhai pichhle atom bomb se meri car ka bumper pehle hi toot chuka hai, ab cylinder phod ke ghar ki chhat udaayega kya?!'"
    },
    {
        title: "YAMRAJ ON WHATSAPP VIDEO CALL 💀",
        desc: "Yamraj has joined the chat: 'Beta ek baar cylinder par lighter touch kar, fir tera VIP pass sidha Yamlok ke liye confirm karta hoon!'"
    }
];

class PatakhaApp {
    constructor() {
        window.diwaliApp = this;
        this.container = document.getElementById('canvas-container');
        this.flashOverlay = document.getElementById('flash-overlay');

        // Engines
        this.audio = window.soundEngine;
        this.scene = new CourtyardScene(this.container);
        this.particles = new ParticleSystem(this.scene.scene);
        this.propsEngine = new PropsEngine(this.scene.scene, this.particles, this.audio);
        this.patakhaManager = new PatakhaManager(this.scene.scene, this.particles, this.propsEngine, this.audio);
        this.environment = new MohallaEnvironment(this.scene.scene, this.audio);
        this.music = (typeof DiwaliMusicPlayer !== 'undefined') ? new DiwaliMusicPlayer() : null;

        // Simulation State
        this.timeScale = 1.0; // 1.0 for normal, 0.2 for Slow-Mo
        this.lastTime = performance.now();
        this.toastTimeout = null;
        this.currentModalItem = null;
        this.splatTimeout = null;
        this.pendingShare = false;
        this.shareStartTime = 0;
        this.recurringShareInterval = 90 * 1000; // 1:30 min (90 seconds)
        this.recurringShareTimer = null;
        this.pendingRecurringShare = false;
        this.recurringShareStartTime = 0;

        // UI references
        this.dom = {
            statExploded: document.getElementById('stat-exploded'),
            statCans: document.getElementById('stat-cans'),
            statMatkas: document.getElementById('stat-matkas'),
            dbValue: document.getElementById('db-value'),
            dbBar: document.getElementById('db-bar'),
            dbStatus: document.getElementById('db-status'),
            detonatePanel: document.getElementById('detonate-panel'),
            unlitCount: document.getElementById('unlit-count'),
            toastBanner: document.getElementById('toast-banner'),
            toastIcon: document.getElementById('toast-icon'),
            toastText: document.getElementById('toast-text'),
            arsenalContainer: document.getElementById('arsenal-container'),
            modeInstant: document.getElementById('mode-instant'),
            modeSetup: document.getElementById('mode-setup'),
            modeAgarbatti: document.getElementById('mode-agarbatti'),
            btnZoomIn: document.getElementById('btn-zoom-in'),
            btnZoomOut: document.getElementById('btn-zoom-out'),
            btnAkashDiya: document.getElementById('btn-akash-diya'),
            btnTheme: document.getElementById('btn-theme'),
            btnSound: document.getElementById('btn-sound'),
            soundIcon: document.getElementById('sound-icon'),
            btnFullscreen: document.getElementById('btn-fullscreen')
        };

        this.init();
    }

    init() {
        // Wire floor click from scene
        this.scene.onFloorClick = (pos) => this.handleFloorClick(pos);

        // Click & Hover interaction for 3D Sponsor Billboards & Gas Cylinder
        this.scene.onCanvasClick = (clientX, clientY) => {
            const mouse = new THREE.Vector2(
                (clientX / window.innerWidth) * 2 - 1,
                -(clientY / window.innerHeight) * 2 + 1
            );
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, this.scene.camera);

            // 1. Raycast Sponsor Billboards
            if (this.environment && this.environment.sponsorBillboards && this.environment.sponsorBillboards.length > 0) {
                const hits = raycaster.intersectObjects(this.environment.sponsorBillboards, true);
                if (hits.length > 0) {
                    const target = hits[0].object;
                    if (target.userData && target.userData.url) {
                        this.audio.playUIClick();
                        this.showToast(`🚀 Opening Sponsor: ${target.userData.name}...`);
                        window.open(target.userData.url, '_blank', 'noopener,noreferrer');
                        return true;
                    }
                }
            }

            // 2. Raycast LPG Gas Cylinder Prop
            if (this.propsEngine && this.propsEngine.props) {
                const cylProp = this.propsEngine.props.find(p => p.type === 'gas_cylinder');
                if (cylProp && cylProp.mesh) {
                    const cylHits = raycaster.intersectObject(cylProp.mesh, true);
                    if (cylHits.length > 0) {
                        this.triggerCylinderWarning(cylProp);
                        return true;
                    }
                }
            }

            return false;
        };

        this.scene.renderer.domElement.addEventListener('pointermove', (e) => {
            const mouse = new THREE.Vector2(
                (e.clientX / window.innerWidth) * 2 - 1,
                -(e.clientY / window.innerHeight) * 2 + 1
            );
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, this.scene.camera);

            let hasHover = false;
            if (this.environment && this.environment.sponsorBillboards && this.environment.sponsorBillboards.length > 0) {
                const hits = raycaster.intersectObjects(this.environment.sponsorBillboards, true);
                if (hits.length > 0) hasHover = true;
            }

            if (!hasHover && this.propsEngine && this.propsEngine.props) {
                const cylProp = this.propsEngine.props.find(p => p.type === 'gas_cylinder');
                if (cylProp && cylProp.mesh) {
                    const cylHits = raycaster.intersectObject(cylProp.mesh, true);
                    if (cylHits.length > 0) hasHover = true;
                }
            }

            this.scene.renderer.domElement.style.cursor = hasHover ? 'pointer' : 'default';
        });

        // Clean up previous test unlocks so all 4 locked items (Gobar, Atom, Aerial Cake, Mega Lar) are locked for testing
        if (sessionStorage.getItem('cleaned_bogus_unlocks_v3') !== 'true') {
            ['gobar', 'atom', 'aerial_cake', 'mega_lar'].forEach(id => {
                localStorage.removeItem(`patakha_${id}_unlocked`);
                localStorage.removeItem(`patakha_${id}_shares`);
            });
            sessionStorage.setItem('cleaned_bogus_unlocks_v3', 'true');
        }

        // WhatsApp Share Verification Return Listeners
        const checkReturn = () => {
            if (this.pendingShare) {
                const timeAway = (Date.now() - this.shareStartTime) / 1000;
                this.handleShareReturn(timeAway);
            }
            if (this.pendingRecurringShare) {
                const timeAway = (Date.now() - this.recurringShareStartTime) / 1000;
                this.handleRecurringShareReturn(timeAway);
            }
        };
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') checkReturn();
        });
        window.addEventListener('focus', checkReturn);

        // Start 1:30 min recurring viral share popup
        this.startRecurringShareTimer();

        // Render bottom Arsenal cards
        this.renderArsenalCards();

        // Screen mud splatter callback
        window.triggerScreenMudSplat = () => this.triggerScreenMudSplat();

        // Mobile & Desktop First-Touch Audio Unlocker
        const unlockAudio = () => {
            this.audio.init();
            window.removeEventListener('pointerdown', unlockAudio);
            window.removeEventListener('touchstart', unlockAudio);
            window.removeEventListener('keydown', unlockAudio);
        };
        window.addEventListener('pointerdown', unlockAudio, { once: true });
        window.addEventListener('touchstart', unlockAudio, { once: true });
        window.addEventListener('keydown', unlockAudio, { once: true });

        // Setup DOM event listeners
        this.bindUIEvents();

        // Spawn starter objects nicely framed around courtyard (No cylinder pre-placed; user places it Minecraft style!)
        this.propsEngine.spawnPyramid(-3.5, -2.0);
        this.propsEngine.createProp('big_dabba', new THREE.Vector3(3.5, 0.94, -2.0));
        this.updateHUDCounters();

        // Start animation loop
        requestAnimationFrame((now) => this.loop(now));
    }

    handleFloorClick(worldPos) {
        this.audio.init();

        const type = this.patakhaManager.selectedType;

        // Minecraft Mode: Place 14.2 KG Gas Cylinder wherever user clicks!
        if (type && type.id === 'gas_cylinder') {
            this.patakhaManager.spawn(type, worldPos, false);
            this.showToast('🛢️ 14.2 KG Bharat Gas Cylinder Rakh Diya! Ab iske bagal me Bomb lagao ya Agarbatti dikhao! 💀');
            this.updateHUDCounters();
            return;
        }

        // Check if user clicked near an already placed 14.2 KG LPG Gas Cylinder
        const cylinderProp = this.propsEngine.props.find(p => p.type === 'gas_cylinder');
        if (cylinderProp && cylinderProp.mesh && cylinderProp.mesh.position.distanceTo(worldPos) < 1.45) {
            this.triggerCylinderWarning(cylinderProp);
            return;
        }

        // Agarbatti Manual Fuse Lighting Mode
        if (this.patakhaManager.placementMode === 'agarbatti') {
            let closest = null;
            let minDist = 2.4;
            this.patakhaManager.activeBombs.forEach(b => {
                if (b.state === 'unlit') {
                    const d = b.mesh.position.distanceTo(worldPos);
                    if (d < minDist) {
                        minDist = d;
                        closest = b;
                    }
                }
            });

            if (closest) {
                this.patakhaManager.ignite(closest);
                const tip = closest.mesh.userData.fuseTip
                    ? closest.mesh.userData.fuseTip.clone().applyMatrix4(closest.mesh.matrixWorld)
                    : closest.mesh.position.clone().add(new THREE.Vector3(0, 0.5, 0));

                for (let i = 0; i < 16; i++) {
                    this.particles.spawnSpark(
                        tip,
                        new THREE.Vector3((Math.random() - 0.5) * 5, 2.5 + Math.random() * 4, (Math.random() - 0.5) * 5),
                        0xfef08a,
                        0.85,
                        0.35
                    );
                }
                this.audio.playPhuljhadiSpark();
                this.showToast(`🔥 Agarbatti se ${closest.type.name} Sulga Diya! Bhaago!`);
                this.updateHUDCounters();
                return;
            } else {
                // If not tapping near a bomb, spawn a sparkling Phuljhadi right there!
                const phuljhadiDef = PATAKHA_DEFINITIONS[7];
                this.patakhaManager.spawn(phuljhadiDef, worldPos, true);
                this.showToast('✨ Agarbatti / Phuljhadi Jal Gayi!');
                this.updateHUDCounters();
                return;
            }
        }

        const isInstant = this.patakhaManager.placementMode === 'instant';

        const bomb = this.patakhaManager.spawn(type, worldPos, isInstant);

        if (!isInstant) {
            this.showToast(`💣 ${type.name} Bicha Diya! Aur Rakho Ya "SAB EK SAATH PHODO" Dabao!`);
        } else {
            this.showToast(`🔥 ${type.name} Sulag Gaya! Peeche Hato!`);
        }

        this.updateHUDCounters();
    }

    isItemUnlocked(item) {
        if (!item.locked) return true;
        const key = `patakha_${item.id}_unlocked`;
        if (localStorage.getItem(key) === 'true') return true;

        const reqShares = item.requiredShares || 1;
        const shares = parseInt(localStorage.getItem(`patakha_${item.id}_shares`) || '0', 10);
        if (shares >= reqShares) return true;

        if (item.viralType === 'mega_lar') {
            const blasts = parseInt(localStorage.getItem('patakha_total_blasts') || '0', 10);
            if (blasts >= 20) return true;
        }

        return false;
    }

    renderArsenalCards() {
        this.dom.arsenalContainer.innerHTML = '';

        PATAKHA_DEFINITIONS.forEach(item => {
            const isUnlocked = this.isItemUnlocked(item);
            const isSelected = item.id === this.patakhaManager.selectedType.id;
            const btn = document.createElement('button');
            btn.className = `arsenal-card ${isSelected ? 'active' : ''} ${!isUnlocked ? 'locked' : ''}`;

            btn.innerHTML = `
                ${!isUnlocked ? '<div class="card-lock-badge" title="Locked! WhatsApp par share karke unlock karo">🔒</div>' : ''}
                <span class="card-key hidden md:block">[${item.key}]</span>
                <div class="card-icon-wrap bg-gradient-to-br ${item.badgeColor}">
                    <span>${item.icon}</span>
                </div>
                <div class="card-title">${item.name}</div>
                <div class="card-sub">${!isUnlocked ? '🔒 LOCKED' : item.hindiName}</div>
            `;

            btn.onclick = () => {
                this.audio.init();
                this.audio.playUIClick();
                if (!this.isItemUnlocked(item)) {
                    this.openViralUnlockModal(item);
                    return;
                }
                this.patakhaManager.selectedType = item;
                this.renderArsenalCards();
                try {
                    btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                } catch (e) {}
                this.showToast(`${item.icon} ${item.name} Selected!`);
            };

            this.dom.arsenalContainer.appendChild(btn);
        });
    }

    openViralUnlockModal(item) {
        this.currentModalItem = item;
        const modal = document.getElementById('viral-unlock-modal');
        const icon = document.getElementById('unlock-modal-icon');
        const title = document.getElementById('unlock-modal-title');
        const desc = document.getElementById('unlock-modal-desc');
        const shareSteps = document.getElementById('unlock-share-steps');
        const progressText = document.getElementById('unlock-progress-text');
        const whatsappBtnText = document.getElementById('whatsapp-btn-text');

        if (!modal) return;

        const reqShares = item.requiredShares || 1;

        if (item.viralType === 'gobar') {
            if (icon) icon.textContent = '💩';
            if (title) title.textContent = 'GOBAR DHAMAKA UNLOCK KARO!';
            if (desc) desc.textContent = 'Bachpan ka sabse funny desi prank! 3 dosto ko WhatsApp par bhejo aur instantly unlock karo!';
        } else if (item.viralType === 'atom') {
            if (icon) icon.textContent = '☢️';
            if (title) title.textContent = 'VIP ATOM BOMB UNLOCK KARO!';
            if (desc) desc.textContent = 'Mohalla hilane wala sabse bada shockwave dhamaka! 2 dosto ko WhatsApp par bhejo aur unlock karo!';
        } else if (item.viralType === 'aerial_cake') {
            if (icon) icon.textContent = '🎆';
            if (title) title.textContent = '16-SHOT SKY CAKE UNLOCK KARO!';
            if (desc) desc.textContent = 'Aasmaan ko roshan karne wali 16-shot grand aatishbaazi! 2 dosto ko WhatsApp par bhejo aur unlock karo!';
        } else if (item.viralType === 'mega_lar') {
            if (icon) icon.textContent = '🏮';
            if (title) title.textContent = '१०,००० महाबली लड़ी UNLOCK KARO!';
            const blasts = parseInt(localStorage.getItem('patakha_total_blasts') || '0', 10);
            if (desc) desc.textContent = '60-patakho ki non-stop jhankar aur Mahabali master blast! WhatsApp par bhejo ya arena mein 20 patakhe phod kar unlock karo!';
        }

        if (shareSteps) shareSteps.classList.remove('hidden');
        this.updateModalProgress();
        modal.classList.remove('hidden');
    }

    closeViralUnlockModal() {
        const modal = document.getElementById('viral-unlock-modal');
        if (modal) modal.classList.add('hidden');
    }

    updateModalProgress() {
        if (!this.currentModalItem) return;
        const item = this.currentModalItem;
        const reqShares = item.requiredShares || 1;
        const shares = parseInt(localStorage.getItem(`patakha_${item.id}_shares`) || '0', 10);
        const progressText = document.getElementById('unlock-progress-text');
        const whatsappBtnText = document.getElementById('whatsapp-btn-text');
        const shareSteps = document.getElementById('unlock-share-steps');

        if (shareSteps) {
            shareSteps.innerHTML = '';
            for (let i = 1; i <= reqShares; i++) {
                const isComplete = shares >= i;
                const dot = document.createElement('div');
                dot.className = `w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${isComplete ? 'step-complete' : 'border-amber-400/40 bg-white/5 text-amber-300'}`;
                dot.textContent = isComplete ? '✓' : i.toString();
                shareSteps.appendChild(dot);

                if (i < reqShares) {
                    const line = document.createElement('div');
                    line.className = 'h-0.5 w-4 bg-white/20';
                    shareSteps.appendChild(line);
                }
            }
        }

        if (progressText) {
            if (item.viralType === 'mega_lar') {
                const blasts = parseInt(localStorage.getItem('patakha_total_blasts') || '0', 10);
                progressText.textContent = `${Math.min(reqShares, shares)} / ${reqShares} Share (Ya Arena Blasts: ${Math.min(20, blasts)}/20)`;
            } else {
                progressText.textContent = `${Math.min(reqShares, shares)} / ${reqShares} Shares Completed!`;
            }
            progressText.className = shares >= reqShares ? 'text-xs font-bold text-emerald-400' : 'text-xs font-bold text-amber-300';
        }

        if (whatsappBtnText) {
            whatsappBtnText.textContent = shares >= reqShares ? '🎉 UNLOCKED! Phodo!' : `WhatsApp Par Bhejo (${shares}/${reqShares})`;
        }
    }

    triggerShareAction() {
        if (!this.currentModalItem) return;
        this.audio.playUIClick();

        const shareUrl = window.location.href;
        let shareText = '';

        if (this.currentModalItem.viralType === 'gobar') {
            shareText = `💩💥 OYE! Dekh maine Happy Diwali 3D game mein GOBAR KE UPAR BOMB laga ke phoda! 😂 Poori screen par gobar lag gaya! Tu bhi try kar: ${shareUrl}`;
        } else if (this.currentModalItem.viralType === 'atom') {
            shareText = `☢️💥 BHAI SUN! Happy Diwali 3D game mein VIP ATOM BOMB phod ke dekh! Mohalla hil jaata hai aur padosiyo ki car ke alarm baj jaate hain: ${shareUrl}`;
        } else if (this.currentModalItem.viralType === 'aerial_cake') {
            shareText = `🎆✨ OYE! Happy Diwali 3D mein 16-SHOT SKY CAKE chala ke dekh! Poora aasmaan rangon se chamak uthta hai 3D mein: ${shareUrl}`;
        } else if (this.currentModalItem.viralType === 'mega_lar') {
            shareText = `🏮💥 Diwali ki sabse badi 10,000-Wala Mahabali Lar phodo! 60-patakho ki non-stop jhankar aur full 3D sound: ${shareUrl}`;
        }

        // Set pending verification state & start timer
        this.pendingShare = true;
        this.shareStartTime = Date.now();

        const whatsappBtnText = document.getElementById('whatsapp-btn-text');
        if (whatsappBtnText) {
            whatsappBtnText.textContent = '⏳ WhatsApp khul raha hai... Send karke wapas aao!';
        }

        // Open WhatsApp
        const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
        window.open(waUrl, '_blank');
    }

    handleShareReturn(timeAway) {
        if (!this.pendingShare || !this.currentModalItem) return;
        this.pendingShare = false;

        if (timeAway < 3.0) {
            // User backed out instantly without actually sending!
            this.showToast('⚠️ WhatsApp par kisi dost ko send karke wapas aao tabhi count hoga!');
            this.updateModalProgress();
            return;
        }

        const item = this.currentModalItem;
        const reqShares = item.requiredShares || 1;
        let shares = parseInt(localStorage.getItem(`patakha_${item.id}_shares`) || '0', 10);
        shares = Math.min(reqShares, shares + 1);
        localStorage.setItem(`patakha_${item.id}_shares`, shares.toString());

        if (shares >= reqShares) {
            localStorage.setItem(`patakha_${item.id}_unlocked`, 'true');
            this.audio.playPhuljhadiSpark();
            this.showToast(`🎉 CONGRATS! ${item.name} UNLOCKED! Ab maze lo! 💥`);
            this.patakhaManager.selectedType = item;
            this.renderArsenalCards();
            setTimeout(() => this.closeViralUnlockModal(), 800);
        } else {
            this.updateModalProgress();
            this.showToast(`✅ 1 Share Verified! (${shares}/${reqShares}) Bas ${reqShares - shares} aur bacha hai!`);
        }
    }

    copyShareLink() {
        this.audio.playUIClick();
        const shareUrl = window.location.href;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(shareUrl).then(() => {
                this.showToast('🔗 Link Copied! Par unlock ke liye WhatsApp par send karna zaroori hai!');
            }).catch(() => {
                this.showToast('🔗 Game Link: ' + shareUrl);
            });
        } else {
            this.showToast('🔗 Game Link: ' + shareUrl);
        }
        // NEVER increment shares on copy link!
    }

    startRecurringShareTimer() {
        clearTimeout(this.recurringShareTimer);
        if (localStorage.getItem('patakha_game_shared') === 'true') return;

        this.recurringShareTimer = setTimeout(() => {
            this.openRecurringShareModal();
        }, this.recurringShareInterval);
    }

    openRecurringShareModal() {
        if (localStorage.getItem('patakha_game_shared') === 'true') return;
        const viralModal = document.getElementById('viral-unlock-modal');
        if (viralModal && !viralModal.classList.contains('hidden')) {
            this.startRecurringShareTimer();
            return;
        }

        const modal = document.getElementById('recurring-share-modal');
        if (modal) {
            modal.classList.remove('hidden');
            this.audio.playUIClick();
        }
    }

    closeRecurringShareModal() {
        const modal = document.getElementById('recurring-share-modal');
        if (modal) modal.classList.add('hidden');
        this.startRecurringShareTimer();
    }

    triggerRecurringShare() {
        this.audio.playUIClick();
        const shareUrl = window.location.href;
        const shareText = `🪔✨ Happy Diwali Bhai! 3D mein online patakhe phod raha hoon, tu bhi phod ke dekh! Gobar bomb, 10,000 Lar, Anaar sab hai: ${shareUrl}`;

        this.pendingRecurringShare = true;
        this.recurringShareStartTime = Date.now();

        const btnText = document.getElementById('recurring-whatsapp-btn-text');
        if (btnText) {
            btnText.textContent = '⏳ WhatsApp khul raha hai... Send karke wapas aao!';
        }

        const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
        window.open(waUrl, '_blank');
    }

    handleRecurringShareReturn(timeAway) {
        if (!this.pendingRecurringShare) return;
        this.pendingRecurringShare = false;

        const btnText = document.getElementById('recurring-whatsapp-btn-text');
        if (btnText) btnText.textContent = 'WhatsApp Par Share Karo';

        if (timeAway < 3.0) {
            this.showToast('⚠️ WhatsApp par kisi dost ko send karke wapas aao tabhi approve hoga!');
            return;
        }

        // Verified genuine WhatsApp share!
        localStorage.setItem('patakha_game_shared', 'true');
        // Also unlock 10,000-Wala Lar as a free viral reward!
        localStorage.setItem('patakha_mega_lar_unlocked', 'true');

        this.audio.playPhuljhadiSpark();
        this.showToast('🎉 Shabaash! WhatsApp par share karne ke liye shukriya! Happy Diwali! 🪔💥');
        this.renderArsenalCards();

        const modal = document.getElementById('recurring-share-modal');
        if (modal) modal.classList.add('hidden');
        clearTimeout(this.recurringShareTimer);
    }

    triggerScreenMudSplat() {
        const splat = document.getElementById('gobar-splat-overlay');
        if (!splat) return;

        if (this.audio && this.audio.playGobarSplat) {
            this.audio.playGobarSplat();
        }

        splat.classList.remove('hidden');
        void splat.offsetWidth;
        splat.classList.remove('opacity-0');
        splat.classList.add('opacity-100');

        clearTimeout(this.splatTimeout);
        this.splatTimeout = setTimeout(() => {
            splat.classList.remove('opacity-100');
            splat.classList.add('opacity-0');
            setTimeout(() => {
                splat.classList.add('hidden');
            }, 700);
        }, 3200);
    }

    onCrackerExploded() {
        let blasts = parseInt(localStorage.getItem('patakha_total_blasts') || '0', 10);
        blasts++;
        localStorage.setItem('patakha_total_blasts', blasts.toString());

        // Check if mega_lar should be unlocked by 15 blasts
        if (blasts >= 15 && localStorage.getItem('patakha_mega_lar_unlocked') !== 'true') {
            localStorage.setItem('patakha_mega_lar_unlocked', 'true');
            this.showToast('🎉 15 Patakhe Phodne Par 10,000-Wala Lar UNLOCKED! 🏮💥');
            this.renderArsenalCards();
        }
    }

    setPlacementMode(mode) {
        this.audio.playUIClick();
        this.patakhaManager.placementMode = mode;
        const resetBtn = (btn) => {
            if (btn) btn.className = 'mode-pill';
        };

        resetBtn(this.dom.modeInstant);
        resetBtn(this.dom.modeSetup);
        resetBtn(this.dom.modeAgarbatti);

        if (mode === 'instant') {
            if (this.dom.modeInstant) this.dom.modeInstant.className = 'mode-pill active';
            this.scene.setCursorColor(0xfbbf24);
            this.showToast('⚡ Instant Phodo: Click to light immediately!');
        } else if (mode === 'setup') {
            if (this.dom.modeSetup) this.dom.modeSetup.className = 'mode-pill active';
            this.scene.setCursorColor(0xef4444);
            this.showToast('💣 Setup Chain: Drop bombs, then hit SAB EK SAATH PHODO!');
        } else if (mode === 'agarbatti') {
            if (this.dom.modeAgarbatti) this.dom.modeAgarbatti.className = 'mode-pill active';
            this.scene.setCursorColor(0xf97316);
            this.showToast('🔥 Agarbatti Mode: Unlit bomb ke fuse par click karke sulgaao!');
        }
        this.updateHUDCounters();
    }

    toggleSlowMotion() {
        this.timeScale = this.timeScale === 1.0 ? 0.22 : 1.0;
        const isSloMo = this.timeScale < 1.0;

        if (isSloMo) {
            this.dom.btnSlomo.classList.add('active');
            this.showToast('⏱️ Slow Motion (0.2x) Enabled!');
        } else {
            this.dom.btnSlomo.classList.remove('active');
            this.showToast('⚡ Normal Speed Restored!');
        }
    }

    triggerScreenFlash(opacity = 0.65) {
        this.flashOverlay.style.opacity = opacity;
        setTimeout(() => {
            this.flashOverlay.style.opacity = 0;
        }, 80);
    }

    triggerCameraShake(intensity) {
        this.scene.camState.shakeIntensity = Math.max(this.scene.camState.shakeIntensity, intensity);
    }

    showToast(msg) {
        this.dom.toastText.textContent = msg;
        this.dom.toastBanner.classList.remove('opacity-0', '-translate-y-2');
        this.dom.toastBanner.classList.add('opacity-100', 'translate-y-0');

        clearTimeout(this.toastTimeout);
        this.toastTimeout = setTimeout(() => {
            this.dom.toastBanner.classList.remove('opacity-100', 'translate-y-0');
            this.dom.toastBanner.classList.add('opacity-0', '-translate-y-2');
        }, 2200);
    }

    updateHUDCounters() {
        if (this.dom.statExploded) this.dom.statExploded.textContent = this.patakhaManager.totalExploded;
        if (this.dom.statCans) this.dom.statCans.textContent = this.propsEngine.cansLaunchedCount;
        if (this.dom.statMatkas) this.dom.statMatkas.textContent = this.propsEngine.matkasShatteredCount;

        const unlit = this.patakhaManager.activeBombs.filter(b => b.state === 'unlit').length;
        if (this.dom.unlitCount) this.dom.unlitCount.textContent = unlit;

        if (unlit > 0) {
            this.dom.detonatePanel.classList.remove('scale-0', 'opacity-0');
            this.dom.detonatePanel.classList.add('scale-100', 'opacity-100');
        } else {
            this.dom.detonatePanel.classList.remove('scale-100', 'opacity-100');
            this.dom.detonatePanel.classList.add('scale-0', 'opacity-0');
        }
    }

    updateDecibelUI(db) {
        if (!this.dom.dbValue) return;
        this.dom.dbValue.textContent = `${db} dB`;
        if (this.dom.dbBar) {
            const pct = Math.min(100, Math.max(8, ((db - 30) / 115) * 100));
            this.dom.dbBar.style.width = `${pct}%`;
        }
        if (this.dom.dbStatus) {
            if (db > 125) {
                this.dom.dbStatus.textContent = '🚨 KAN-PHODU DHAMAKA! Mohalla Hil Gaya!';
                this.dom.dbStatus.className = 'text-[10px] text-red-400 font-extrabold mt-1 truncate';
            } else if (db > 95) {
                this.dom.dbStatus.textContent = '😡 Uncleji terrace se gusse mein dekh rahe!';
                this.dom.dbStatus.className = 'text-[10px] text-orange-400 font-bold mt-1 truncate';
            } else if (db > 70) {
                this.dom.dbStatus.textContent = '🚨 Sharma ji ki car ka alarm baj gaya!';
                this.dom.dbStatus.className = 'text-[10px] text-amber-300 font-semibold mt-1 truncate';
            } else if (db > 48) {
                this.dom.dbStatus.textContent = '🐕 Gali ke kutte alert ho gaye!';
                this.dom.dbStatus.className = 'text-[10px] text-amber-200/90 font-medium mt-1 truncate';
            } else {
                this.dom.dbStatus.textContent = '😴 Shanti Hai... Padosi so rahe hain!';
                this.dom.dbStatus.className = 'text-[10px] text-amber-200/60 font-medium mt-1 truncate';
            }
        }
    }

    bindUIEvents() {
        // Mode Switches
        this.dom.modeInstant.onclick = () => this.setPlacementMode('instant');
        this.dom.modeSetup.onclick = () => this.setPlacementMode('setup');
        if (this.dom.modeAgarbatti) {
            this.dom.modeAgarbatti.onclick = () => this.setPlacementMode('agarbatti');
        }

        // Camera Preset Controller
        window.setCameraMode = (preset) => {
            this.scene.setCameraPreset(preset);
            ['cam-action', 'cam-ground', 'cam-sky', 'cam-orbit'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.classList.remove('active');
            });
            const activeId = `cam-${preset === 'cinematic' ? 'orbit' : preset}`;
            const activeEl = document.getElementById(activeId);
            if (activeEl) activeEl.classList.add('active');
            this.showToast(`🎥 Camera: ${preset.toUpperCase()} View`);
        };

        // Detonate All Unlit
        document.getElementById('btn-detonate-all').onclick = () => {
            this.audio.init();
            const count = this.patakhaManager.igniteAllUnlit();
            if (count > 0) {
                this.showToast(`🔥 ${count} Patakhe Ek Saath Jal Gaye!! Dhoom Dhadaka Shuru!`);
                this.updateHUDCounters();
            }
        };

        // Desi Trick: Dabba Udao
        document.getElementById('btn-sutli-dabba').onclick = () => {
            this.audio.init();
            const spot = new THREE.Vector3((Math.random() - 0.5) * 3, 0, (Math.random() - 0.5) * 3);
            const sutliDef = PATAKHA_DEFINITIONS[0];
            this.patakhaManager.spawn(sutliDef, spot, true);
            this.propsEngine.spawnDabbaOverSpot(spot);
            this.showToast('🪣 Sutli Bomb Par 15L Tin Dabba Rakh Diya! Dekho Rocket Banega!');
            this.updateHUDCounters();
        };

        // Spawn Can Pyramid
        document.getElementById('btn-spawn-pyramid').onclick = () => {
            this.audio.init();
            const posX = (Math.random() - 0.5) * 5;
            const posZ = -1.5 + (Math.random() - 0.5) * 2;
            this.propsEngine.spawnPyramid(posX, posZ);
            this.showToast('🥫 Desi Can Pyramid Taiyaar! Bomb Lagao Aur Uda Do!');
            this.updateHUDCounters();
        };

        // Grand Diwali Show
        document.getElementById('btn-quick-fest').onclick = () => {
            this.audio.init();
            // Spawn an unforgettable mega barrage across courtyard
            this.patakhaManager.spawn(PATAKHA_DEFINITIONS[3], new THREE.Vector3(-6, 0, 4), true); // Anaar
            this.patakhaManager.spawn(PATAKHA_DEFINITIONS[3], new THREE.Vector3(6, 0, 4), true);  // Anaar
            this.patakhaManager.spawn(PATAKHA_DEFINITIONS[4], new THREE.Vector3(-4, 0, -4), true); // Chakri
            this.patakhaManager.spawn(PATAKHA_DEFINITIONS[4], new THREE.Vector3(4, 0, -4), true);  // Chakri
            this.patakhaManager.spawn(PATAKHA_DEFINITIONS[2], new THREE.Vector3(0, 0, 5), true);   // Lar
            this.patakhaManager.spawn(PATAKHA_DEFINITIONS[11], new THREE.Vector3(-7, 0, 2), true); // Seeti Rocket!
            this.patakhaManager.spawn(PATAKHA_DEFINITIONS[11], new THREE.Vector3(7, 0, 2), true);  // Seeti Rocket!
            this.patakhaManager.spawn(PATAKHA_DEFINITIONS[12], new THREE.Vector3(-2, 0, 2), true); // Disco Helicopter!
            this.patakhaManager.spawn(PATAKHA_DEFINITIONS[12], new THREE.Vector3(2, 0, 2), true);  // Disco Helicopter!
            this.patakhaManager.spawn(PATAKHA_DEFINITIONS[13], new THREE.Vector3(-5, 0, -2), true); // Smoke Bomb!
            this.patakhaManager.spawn(PATAKHA_DEFINITIONS[13], new THREE.Vector3(5, 0, -2), true);  // Smoke Bomb!
            this.patakhaManager.spawn(PATAKHA_DEFINITIONS[15], new THREE.Vector3(0, 0, -3), true);  // Parachute Rocket!
            this.patakhaManager.spawn(PATAKHA_DEFINITIONS[8], new THREE.Vector3(0, 0, -6), true);  // 16-Shot Sky Cake
            this.patakhaManager.spawn(PATAKHA_DEFINITIONS[16], new THREE.Vector3(-3, 0, 0), true); // Bullet Bomb!
            this.patakhaManager.spawn(PATAKHA_DEFINITIONS[6], new THREE.Vector3(0, 0, 0), true);   // VIP Atom

            this.showToast('✨ GRAND DIWALI CELEBRATION SHOW SHURU! 🎆');
            this.updateHUDCounters();
        };

        // Camera Zoom In / Zoom Out Controls
        if (this.dom.btnZoomIn) {
            this.dom.btnZoomIn.onclick = () => {
                this.audio.init();
                this.audio.playUIClick();
                this.scene.zoomIn();
                this.showToast('🔍 Camera Zoom In (+)');
            };
        }
        if (this.dom.btnZoomOut) {
            this.dom.btnZoomOut.onclick = () => {
                this.audio.init();
                this.audio.playUIClick();
                this.scene.zoomOut();
                this.showToast('🔍 Camera Zoom Out (−)');
            };
        }

        // Akash Diya (Sky Lantern) Release
        if (this.dom.btnAkashDiya) {
            this.dom.btnAkashDiya.onclick = () => {
                this.audio.init();
                const pos = new THREE.Vector3((Math.random() - 0.5) * 8, 0.4, (Math.random() - 0.5) * 8);
                this.scene.spawnSkyLantern(pos);
                this.showToast('🏮 Glowing Akash Diya (Sky Lantern) Aasmaan Mein Chhoda!');
            };
        }

        // Environment Theme Switcher (Sunset vs Midnight)
        if (this.dom.btnTheme) {
            this.dom.btnTheme.onclick = () => {
                const nextTheme = this.scene.currentTheme === 'night' ? 'sunset' : 'night';
                this.scene.setEnvironmentTheme(nextTheme);
                this.showToast(nextTheme === 'sunset' ? '🌅 Godhuli Vela (Sunset) Sky Activated!' : '🌌 Midnight Diwali Sky Activated!');
            };
        }

        // Sound Toggle
        this.dom.btnSound.onclick = () => {
            this.audio.enabled = !this.audio.enabled;
            if (this.dom.soundIcon) {
                this.dom.soundIcon.textContent = this.audio.enabled ? '🔊' : '🔇';
            }
            this.dom.btnSound.classList.toggle('active', this.audio.enabled);
            this.showToast(this.audio.enabled ? '🔊 Sound ON' : '🔇 Muted');
        };

        // Fullscreen Toggle
        this.dom.btnFullscreen.onclick = () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
            } else {
                document.exitFullscreen().catch(() => {});
            }
        };

        // Clear Arena
        document.getElementById('btn-clear').onclick = () => {
            this.patakhaManager.clear();
            this.propsEngine.clear();
            this.particles.clear();
            this.updateHUDCounters();
            this.showToast('🧹 Courtyard Saaf Ho Gaya! Dobara Khel Shuru Karo!');
        };

        // Header WhatsApp Share Trigger
        const btnHeaderShare = document.getElementById('btn-header-share');
        if (btnHeaderShare) {
            btnHeaderShare.onclick = () => {
                this.audio.playUIClick();
                const modal = document.getElementById('recurring-share-modal');
                if (modal) modal.classList.remove('hidden');
            };
        }

        // Recurring 1:30 Min Modal Wiring
        const btnCloseRecurring = document.getElementById('btn-close-recurring-modal');
        if (btnCloseRecurring) {
            btnCloseRecurring.onclick = () => this.closeRecurringShareModal();
        }
        const btnRecurringLater = document.getElementById('btn-recurring-later');
        if (btnRecurringLater) {
            btnRecurringLater.onclick = () => this.closeRecurringShareModal();
        }
        const recurringModal = document.getElementById('recurring-share-modal');
        if (recurringModal) {
            recurringModal.onclick = (e) => {
                if (e.target.id === 'recurring-share-modal') this.closeRecurringShareModal();
            };
        }
        const btnRecurringWhatsapp = document.getElementById('btn-recurring-whatsapp-share');
        if (btnRecurringWhatsapp) {
            btnRecurringWhatsapp.onclick = () => this.triggerRecurringShare();
        }

        // Viral Unlock Modal Wiring
        const btnCloseModal = document.getElementById('btn-close-unlock-modal');
        if (btnCloseModal) {
            btnCloseModal.onclick = () => this.closeViralUnlockModal();
        }
        const viralModal = document.getElementById('viral-unlock-modal');
        if (viralModal) {
            viralModal.onclick = (e) => {
                if (e.target.id === 'viral-unlock-modal') this.closeViralUnlockModal();
            };
        }
        const btnWhatsapp = document.getElementById('btn-whatsapp-share');
        if (btnWhatsapp) {
            btnWhatsapp.onclick = () => this.triggerShareAction();
        }
        const btnCopyLink = document.getElementById('btn-copy-share-link');
        if (btnCopyLink) {
            btnCopyLink.onclick = () => this.copyShareLink();
        }
        const btnResetShares = document.getElementById('btn-reset-shares');
        if (btnResetShares) {
            btnResetShares.onclick = () => {
                ['gobar', 'atom', 'aerial_cake', 'mega_lar'].forEach(id => {
                    localStorage.removeItem(`patakha_${id}_unlocked`);
                    localStorage.removeItem(`patakha_${id}_shares`);
                });
                localStorage.removeItem('patakha_game_shared');
                this.startRecurringShareTimer();
                this.audio.playUIClick();
                this.showToast('🔄 Progress Reset! Sabhi 4 locked patakhe aur 1:30m popup active!');
                this.updateModalProgress();
                this.renderArsenalCards();
            };
        }

        // SEO Festival Guide & FAQ Modal Wiring
        const btnOpenGuide = document.getElementById('btn-open-guide');
        const btnCloseGuide = document.getElementById('btn-close-guide');
        const guideModal = document.getElementById('seo-guide-modal');
        if (btnOpenGuide && guideModal) {
            btnOpenGuide.onclick = () => {
                this.audio.playUIClick();
                guideModal.classList.remove('hidden');
            };
        }
        if (btnCloseGuide && guideModal) {
            btnCloseGuide.onclick = () => guideModal.classList.add('hidden');
        }
        if (guideModal) {
            guideModal.onclick = (e) => {
                if (e.target.id === 'seo-guide-modal') guideModal.classList.add('hidden');
            };
        }

        // Desktop Mouse Wheel Horizontal Scrolling for Cracker Arsenal Bar
        if (this.dom.arsenalContainer) {
            this.dom.arsenalContainer.addEventListener('wheel', (evt) => {
                if (evt.deltaY !== 0) {
                    evt.preventDefault();
                    this.dom.arsenalContainer.scrollLeft += evt.deltaY * 0.9;
                }
            }, { passive: false });
        }

        // 14.2 KG Gas Cylinder Minecraft Mode Selection Button
        const btnGasCylinder = document.getElementById('btn-gas-cylinder');
        if (btnGasCylinder) {
            btnGasCylinder.onclick = () => {
                this.audio.init();
                this.audio.playUIClick();
                const cylDef = PATAKHA_DEFINITIONS.find(p => p.id === 'gas_cylinder');
                if (cylDef) {
                    this.patakhaManager.selectedType = cylDef;
                    this.renderArsenalCards();
                    this.showToast('🛢️ Minecraft Mode: Courtyard mein jahan marzi click karke Gas Cylinder rakho! 🔨');
                }
            };
        }

        // Cylinder Warning Modal Wiring
        const btnCloseCyl = document.getElementById('btn-close-cylinder-modal');
        if (btnCloseCyl) {
            btnCloseCyl.onclick = () => this.closeCylinderWarningModal();
        }

        const cylModal = document.getElementById('cylinder-warning-modal');
        if (cylModal) {
            cylModal.onclick = (e) => {
                if (e.target.id === 'cylinder-warning-modal') this.closeCylinderWarningModal();
            };
        }

        const btnCylCancel = document.getElementById('btn-cylinder-cancel');
        if (btnCylCancel) {
            btnCylCancel.onclick = () => {
                this.closeCylinderWarningModal();
                this.showToast('😇 Shabaash! Samajhdaari isi mein hai, Diwali manao diwala nahi!');
            };
        }

        const btnCylDetonate = document.getElementById('btn-cylinder-detonate');
        if (btnCylDetonate) {
            btnCylDetonate.onclick = () => {
                this.detonateGasCylinder();
            };
        }

        const btnRespawnMohalla = document.getElementById('btn-respawn-mohalla');
        if (btnRespawnMohalla) {
            btnRespawnMohalla.onclick = () => {
                this.respawnMohalla();
            };
        }

        // Keyboard Shortcuts
        window.addEventListener('keydown', (e) => {
            if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;

            const pressed = e.key.toUpperCase();
            const matched = PATAKHA_DEFINITIONS.find(p => p.key.toUpperCase() === pressed);
            if (matched) {
                this.audio.init();
                this.audio.playUIClick();
                if (!this.isItemUnlocked(matched)) {
                    this.openViralUnlockModal(matched);
                    return;
                }
                this.patakhaManager.selectedType = matched;
                this.renderArsenalCards();
                this.showToast(`${matched.icon} ${matched.name} Selected!`);
                return;
            }

            if (e.code === 'Space') {
                e.preventDefault();
                document.getElementById('btn-detonate-all').click();
            } else if (e.key.toLowerCase() === 'p' || e.key.toLowerCase() === 'c') {
                document.getElementById('btn-spawn-pyramid').click();
            } else if (e.key.toLowerCase() === 'd' || e.key.toLowerCase() === 't') {
                document.getElementById('btn-sutli-dabba').click();
            } else if (e.key.toLowerCase() === 'y' || e.key.toLowerCase() === 'b') {
                if (btnGasCylinder) btnGasCylinder.click();
            } else if (e.key.toLowerCase() === 'l') {
                if (this.dom.btnAkashDiya) this.dom.btnAkashDiya.click();
            } else if (e.key.toLowerCase() === 'g') {
                document.getElementById('btn-quick-fest').click();
            } else if (e.key.toLowerCase() === 'x' || e.key.toLowerCase() === 'r') {
                document.getElementById('btn-clear').click();
            } else if (e.key === '+' || e.key === '=') {
                if (this.dom.btnZoomIn) this.dom.btnZoomIn.click();
            } else if (e.key === '-' || e.key === '_') {
                if (this.dom.btnZoomOut) this.dom.btnZoomOut.click();
            } else if (e.key.toLowerCase() === 'f') {
                if (this.dom.btnFullscreen) this.dom.btnFullscreen.click();
            }
        });
    }

    triggerCylinderWarning(prop = null) {
        this.audio.init();
        this.audio.playPoliceSiren(2.4);

        // Pick random dialogue
        const randomItem = CYLINDER_MEME_DIALOGUES[Math.floor(Math.random() * CYLINDER_MEME_DIALOGUES.length)];
        const titleEl = document.getElementById('cylinder-dialogue-title');
        const descEl = document.getElementById('cylinder-dialogue-desc');
        if (titleEl) titleEl.textContent = randomItem.title;
        if (descEl) descEl.textContent = `"${randomItem.desc}"`;

        // Pulse red beacon on cylinder mesh if available
        if (prop && prop.mesh) {
            const beacon = prop.mesh.getObjectByName('cylinder_beacon');
            if (beacon) {
                beacon.material.color.setHex(0xffffff);
                setTimeout(() => beacon.material.color.setHex(0xff0000), 200);
                setTimeout(() => beacon.material.color.setHex(0xffffff), 400);
                setTimeout(() => beacon.material.color.setHex(0xff0000), 600);
            }
        }

        const modal = document.getElementById('cylinder-warning-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    closeCylinderWarningModal() {
        const modal = document.getElementById('cylinder-warning-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    detonateGasCylinder(targetProp = null) {
        this.closeCylinderWarningModal();
        const prop = targetProp || this.propsEngine.props.find(p => p.type === 'gas_cylinder');

        // 1. Extreme Camera Shake
        this.scene.camState.shakeIntensity = 3.2;

        // 2. Play Nuclear Blast Audio
        this.audio.playNuclearBlast();

        const blastPos = prop ? prop.mesh.position.clone() : new THREE.Vector3(-3.2, 1.0, 1.8);

        // 3. Mega Particle Burst
        for (let i = 0; i < 95; i++) {
            const vel = new THREE.Vector3(
                (Math.random() - 0.5) * 28,
                8 + Math.random() * 25,
                (Math.random() - 0.5) * 28
            );
            this.particles.spawnSpark(blastPos, vel, 0xff3b30, 2.4, 0.7);
        }

        // 4. Heavy Smoke Cloud
        for (let i = 0; i < 22; i++) {
            const sVel = new THREE.Vector3(
                (Math.random() - 0.5) * 14,
                4 + Math.random() * 12,
                (Math.random() - 0.5) * 14
            );
            this.particles.spawnSmoke(blastPos, sVel, 0x1f2937, 0.8, 0.95, 3.2, 3.5);
        }

        // 5. Rocket Physics Launch on Cylinder Mesh (ISRO launch!)
        if (prop) {
            prop.isStatic = false;
            prop.vel.set((Math.random() - 0.5) * 12, 90, (Math.random() - 0.5) * 12);
            prop.angVel.set(18, 28, 14);
            prop.airborne = true;
        }

        // 6. White-Out Nuclear Screen Flash & Mohalla Disconnected Modal
        setTimeout(() => {
            const overlay = document.getElementById('cylinder-nuclear-overlay');
            const content = document.getElementById('nuclear-content');
            if (overlay && content) {
                overlay.classList.remove('hidden');
                overlay.style.backgroundColor = '#ffffff';
                setTimeout(() => {
                    overlay.style.backgroundColor = 'rgba(15, 23, 42, 0.96)';
                    content.classList.remove('opacity-0', 'scale-90');
                    content.classList.add('opacity-100', 'scale-100');
                }, 400);
            }
        }, 550);
    }

    respawnMohalla() {
        const overlay = document.getElementById('cylinder-nuclear-overlay');
        const content = document.getElementById('nuclear-content');
        if (overlay && content) {
            content.classList.add('opacity-0', 'scale-90');
            content.classList.remove('opacity-100', 'scale-100');
            setTimeout(() => {
                overlay.classList.add('hidden');
            }, 300);
        }

        // Respawn Props (Courtyard remains clean for user to place cylinder whenever they want!)
        this.propsEngine.spawnPyramid(-3.5, -2.0);
        this.showToast('🪔 Mohalla Wapas Aa Gaya! Agli baar cylinder se door rehna bhai! 😂');
        this.updateHUDCounters();
    }

    loop(now) {
        requestAnimationFrame((n) => this.loop(n));

        const rawDt = Math.min(0.05, (now - this.lastTime) / 1000);
        this.lastTime = now;
        const dt = rawDt * this.timeScale;

        // 1. Update Props Physics
        this.propsEngine.update(dt);

        // 2. Update Patakhas & Fuses
        this.patakhaManager.update(
            dt,
            (intensity) => this.triggerCameraShake(intensity),
            (opacity) => this.triggerScreenFlash(opacity)
        );

        // 3. Update Particles
        this.particles.update(dt);

        // 4. Update 3D Courtyard Scene & Camera
        this.scene.update(dt);

        // 5. Update Mohalla Environment (Fairy lights & Sharma ji's car alarm)
        if (this.environment) {
            this.environment.update(dt, this.audio.currentDb);
        }

        // 6. Decay Sound Decibel Meter & update HUD
        this.audio.currentDb = Math.max(35, this.audio.currentDb - rawDt * 38);
        this.updateDecibelUI(Math.round(this.audio.currentDb));
        this.updateHUDCounters();
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.app = new PatakhaApp();
});
