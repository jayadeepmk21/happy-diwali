/**
 * PatakhaAudioEngine - Desi Procedural Web Audio Engine & Haptic Controller
 * Synthesizes hyper-realistic Diwali sound effects dynamically without external audio assets.
 */
class PatakhaAudioEngine {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.compressor = null;
        this.enabled = true;
        this.currentDb = 35;
        this.noiseBuffer = null;
        this.pinkNoiseBuffer = null;
        this.isInitialized = false;
    }

    init() {
        if (this.isInitialized) {
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
            return;
        }

        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();

            // Dynamics compressor to prevent speaker clipping on massive simultaneous explosions
            this.compressor = this.ctx.createDynamicsCompressor();
            this.compressor.threshold.setValueAtTime(-14, this.ctx.currentTime);
            this.compressor.knee.setValueAtTime(30, this.ctx.currentTime);
            this.compressor.ratio.setValueAtTime(12, this.ctx.currentTime);
            this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
            this.compressor.release.setValueAtTime(0.25, this.ctx.currentTime);

            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(0.9, this.ctx.currentTime);

            this.compressor.connect(this.masterGain);
            this.masterGain.connect(this.ctx.destination);

            // 1. Generate White Noise Buffer (3 seconds)
            const sr = this.ctx.sampleRate;
            this.noiseBuffer = this.ctx.createBuffer(1, sr * 3, sr);
            const whiteData = this.noiseBuffer.getChannelData(0);
            for (let i = 0; i < whiteData.length; i++) {
                whiteData[i] = Math.random() * 2 - 1;
            }

            // 2. Generate Pink Noise Buffer (for warm explosions and fountains)
            this.pinkNoiseBuffer = this.ctx.createBuffer(1, sr * 3, sr);
            const pinkData = this.pinkNoiseBuffer.getChannelData(0);
            let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
            for (let i = 0; i < pinkData.length; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                pinkData[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
                b6 = white * 0.115926;
            }

            this.isInitialized = true;
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        } catch (e) {
            console.warn('Web Audio initialization error:', e);
        }
    }

    triggerHaptic(type = 'medium') {
        if (!navigator.vibrate) return;
        try {
            if (type === 'heavy') {
                navigator.vibrate([120, 60, 180, 80, 220]);
            } else if (type === 'atom') {
                navigator.vibrate([200, 70, 300, 100, 450]);
            } else if (type === 'snap') {
                navigator.vibrate(35);
            } else if (type === 'medium') {
                navigator.vibrate([70, 40, 110]);
            } else if (type === 'whistle') {
                navigator.vibrate([20, 40, 30, 40, 50]);
            }
        } catch (e) {
            // Ignore vibrate permission errors
        }
    }

    spikeDecibels(amount) {
        this.currentDb = Math.min(155, Math.max(this.currentDb, 45 + amount));
    }

    // Fuse burning sizzle with spark crackles
    playFuse(duration = 1.5) {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        const src = this.ctx.createBufferSource();
        src.buffer = this.noiseBuffer;
        src.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(3400, now);
        filter.Q.setValueAtTime(4.0, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.16, now + duration * 0.85);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        src.connect(filter);
        filter.connect(gain);
        gain.connect(this.compressor);

        src.start(now);
        src.stop(now + duration);
        this.spikeDecibels(18);
    }

    // Heavy Desi Blast (Sutli, Lakshmi, Atom, Aerial Shell)
    playBlast(power = 1.0, type = 'sutli') {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        const isAtom = type === 'atom';
        const isLakshmi = type === 'lakshmi';

        // 1. Sub-bass chest thump (deep sine drop)
        const subOsc = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        subOsc.type = isAtom ? 'sawtooth' : 'sine';
        const startFreq = isLakshmi ? 220 : (isAtom ? 120 : 175);
        const endFreq = isAtom ? 18 : 26;
        const blastDuration = isAtom ? 2.8 : (isLakshmi ? 0.95 : 1.6);

        subOsc.frequency.setValueAtTime(startFreq, now);
        subOsc.frequency.exponentialRampToValueAtTime(endFreq, now + blastDuration * 0.6);

        subGain.gain.setValueAtTime(Math.min(1.0, 0.85 * power), now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + blastDuration * 0.7);

        subOsc.connect(subGain);
        subGain.connect(this.compressor);
        subOsc.start(now);
        subOsc.stop(now + blastDuration * 0.7);

        // 2. High-power Noise Body & Echo
        const noise = this.ctx.createBufferSource();
        noise.buffer = isAtom ? this.pinkNoiseBuffer : this.noiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        const startCutoff = isLakshmi ? 5800 : (isAtom ? 3400 : 4200);
        filter.frequency.setValueAtTime(startCutoff, now);
        filter.frequency.exponentialRampToValueAtTime(140, now + blastDuration);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(Math.min(1.3, 0.95 * power), now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + blastDuration);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.compressor);

        noise.start(now);
        noise.stop(now + blastDuration);

        // 3. Sharp initial punch transient
        const snapOsc = this.ctx.createOscillator();
        const snapGain = this.ctx.createGain();
        snapOsc.type = 'triangle';
        snapOsc.frequency.setValueAtTime(isAtom ? 720 : 880, now);
        snapOsc.frequency.exponentialRampToValueAtTime(50, now + 0.08);

        snapGain.gain.setValueAtTime(0.6 * power, now);
        snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        snapOsc.connect(snapGain);
        snapGain.connect(this.compressor);
        snapOsc.start(now);
        snapOsc.stop(now + 0.08);

        // Decibel & Haptic triggers
        if (isAtom) {
            this.spikeDecibels(110);
            this.triggerHaptic('atom');
        } else if (type === 'sutli') {
            this.spikeDecibels(92);
            this.triggerHaptic('heavy');
        } else {
            this.spikeDecibels(78);
            this.triggerHaptic('medium');
        }
    }

    // 1000-Wala Lar (Ladi) rapid firecracker snap
    playCrackerSnap() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1600 + Math.random() * 1600, now);
        filter.Q.setValueAtTime(1.8, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.002, now + 0.13);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.compressor);

        noise.start(now, Math.random() * 1.5, 0.14);
        this.spikeDecibels(68 + Math.random() * 14);
        this.triggerHaptic('snap');
    }

    // Anaar (Flowerpot) spark fountain whoosh
    playAnaarFountain(duration = 5.0) {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        const noise = this.ctx.createBufferSource();
        noise.buffer = this.pinkNoiseBuffer;
        noise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2400, now);
        filter.Q.setValueAtTime(1.8, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.28, now + 0.5);
        gain.gain.setValueAtTime(0.28, now + duration - 0.7);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.compressor);

        noise.start(now);
        noise.stop(now + duration);
        this.spikeDecibels(42);
        this.triggerHaptic('whistle');
    }

    // Zameen Chakri spinning whir
    playChakriSpin(duration = 4.2) {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(940, now + duration * 0.45);
        osc.frequency.exponentialRampToValueAtTime(320, now + duration);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.14, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(gain);
        gain.connect(this.compressor);
        osc.start(now);
        osc.stop(now + duration);
        this.spikeDecibels(36);
    }

    // Sky Rocket ascending shrill whistle
    playRocketWhistle(duration = 1.25) {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(620, now);
        osc.frequency.exponentialRampToValueAtTime(2700, now + duration);

        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + duration);

        osc.connect(gain);
        gain.connect(this.compressor);
        osc.start(now);
        osc.stop(now + duration);
        this.spikeDecibels(46);
        this.triggerHaptic('whistle');
    }

    // Aerial Shot launch thud
    playAerialLaunch() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.16);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

        osc.connect(gain);
        gain.connect(this.compressor);
        osc.start(now);
        osc.stop(now + 0.16);
        this.spikeDecibels(48);
    }

    // Metallic Tin Can / Thali Clatter
    playMetallicClang(intensity = 1.0) {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const freqs = [440, 820, 1260, 1840];

        freqs.forEach((f, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(f + (Math.random() - 0.5) * 70, now);

            const vol = Math.min(0.18, 0.08 * intensity) / (idx + 1);
            gain.gain.setValueAtTime(vol, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18 + idx * 0.05);

            osc.connect(gain);
            gain.connect(this.compressor);
            osc.start(now);
            osc.stop(now + 0.3);
        });
    }

    // Terracotta Clay Matka Shatter Sound
    playMatkaShatter() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        // Dull thud
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.22);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.connect(gain);
        gain.connect(this.compressor);
        osc.start(now);
        osc.stop(now + 0.22);

        // Crushing crunch
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1800, now);
        const nGain = this.ctx.createGain();
        nGain.gain.setValueAtTime(0.4, now);
        nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        noise.connect(filter);
        filter.connect(nGain);
        nGain.connect(this.compressor);
        noise.start(now);
        noise.stop(now + 0.28);

        this.triggerHaptic('medium');
    }

    // Sharma ji's Car Alarm Double Chirp (Beep-Beep)
    playCarAlarm() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        [0, 0.22].forEach(offset => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(2400, now + offset);
            osc.frequency.linearRampToValueAtTime(1750, now + offset + 0.11);

            gain.gain.setValueAtTime(0.12, now + offset);
            gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.13);

            osc.connect(gain);
            gain.connect(this.compressor);
            osc.start(now + offset);
            osc.stop(now + offset + 0.14);
        });
    }

    // Distant Ambient Sky Shot Explosion Boom
    playDistantSkyBurst(pan = 0) {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        // Low muffled distant thump
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(115 + Math.random() * 35, now);
        osc.frequency.exponentialRampToValueAtTime(28, now + 0.42);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        // Distant noise body with lowpass filter
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.pinkNoiseBuffer || this.noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(420, now);

        const nGain = this.ctx.createGain();
        nGain.gain.setValueAtTime(0.15, now);
        nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        // Stereo Panning
        let dest = this.compressor;
        if (this.ctx.createStereoPanner) {
            try {
                const panner = this.ctx.createStereoPanner();
                panner.pan.setValueAtTime(Math.max(-0.9, Math.min(0.9, pan)), now);
                panner.connect(dest);
                dest = panner;
            } catch (e) {}
        }

        osc.connect(gain);
        gain.connect(dest);
        osc.start(now);
        osc.stop(now + 0.45);

        noise.connect(filter);
        filter.connect(nGain);
        nGain.connect(dest);
        noise.start(now);
        noise.stop(now + 0.6);
    }

    // Subtle Tactile UI Click / Pop
    playUIClick() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(750, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.035);

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

        osc.connect(gain);
        gain.connect(this.compressor);
        osc.start(now);
        osc.stop(now + 0.04);
    }

    // Phuljhadi (Sparkler) sizzle
    playPhuljhadiSpark() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(4500, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.compressor);

        noise.start(now, Math.random() * 2, 0.1);
    }

    // Seeti Rocket (Whistling Rocket) FM Siren Screamer
    playSeetiWhistle(duration = 1.7) {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        // Carrier oscillator
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(950, now);
        osc.frequency.exponentialRampToValueAtTime(3200, now + duration * 0.85);
        osc.frequency.exponentialRampToValueAtTime(3800, now + duration);

        // Vibrato LFO for screaming desi whistle character
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(16, now);
        lfoGain.gain.setValueAtTime(140, now);
        lfo.connect(osc.frequency);

        // Lowpass filter to smooth the harshness
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(4200, now);

        oscGain.gain.setValueAtTime(0.02, now);
        oscGain.gain.linearRampToValueAtTime(0.24, now + 0.25);
        oscGain.gain.setValueAtTime(0.24, now + duration - 0.2);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(this.compressor);

        // Air rush noise layer
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;
        const nFilter = this.ctx.createBiquadFilter();
        nFilter.type = 'bandpass';
        nFilter.frequency.setValueAtTime(2200, now);
        nFilter.Q.setValueAtTime(2.5, now);
        const nGain = this.ctx.createGain();
        nGain.gain.setValueAtTime(0.12, now);
        nGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        noise.connect(nFilter);
        nFilter.connect(nGain);
        nGain.connect(this.compressor);

        lfo.start(now);
        osc.start(now);
        noise.start(now);

        lfo.stop(now + duration);
        osc.stop(now + duration);
        noise.stop(now + duration);

        this.spikeDecibels(58);
        this.triggerHaptic('whistle');
    }

    // Disco Helicopter spinning rotor whir & vertical lift
    playHelicopterWhir(duration = 3.2) {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        // Chopper tone oscillator
        const osc = this.ctx.createOscillator();
        const ampGain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(680, now + duration * 0.7);
        osc.frequency.exponentialRampToValueAtTime(820, now + duration);

        // Tremolo / Rotor chopper effect
        const tremolo = this.ctx.createOscillator();
        const tremGain = this.ctx.createGain();
        tremolo.type = 'square';
        tremolo.frequency.setValueAtTime(18, now);
        tremolo.frequency.linearRampToValueAtTime(32, now + duration);
        tremGain.gain.setValueAtTime(0.08, now);
        tremolo.connect(ampGain.gain);

        ampGain.gain.setValueAtTime(0.16, now);
        ampGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(ampGain);
        ampGain.connect(this.compressor);

        // Sizzling sparks underbelly
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.pinkNoiseBuffer || this.noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2800, now);
        const nGain = this.ctx.createGain();
        nGain.gain.setValueAtTime(0.15, now);
        nGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        noise.connect(filter);
        filter.connect(nGain);
        nGain.connect(this.compressor);

        osc.start(now);
        tremolo.start(now);
        noise.start(now);

        osc.stop(now + duration);
        tremolo.stop(now + duration);
        noise.stop(now + duration);

        this.spikeDecibels(44);
    }

    // Rang Birangi Smoke Bomb continuous pressurized gas hiss
    playSmokeHiss(duration = 4.5) {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        const noise = this.ctx.createBufferSource();
        noise.buffer = this.pinkNoiseBuffer || this.noiseBuffer;
        noise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1600, now);
        filter.frequency.linearRampToValueAtTime(2400, now + duration * 0.5);
        filter.frequency.linearRampToValueAtTime(1400, now + duration);
        filter.Q.setValueAtTime(1.4, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.22, now + 0.3);
        gain.gain.setValueAtTime(0.22, now + duration - 0.5);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.compressor);

        noise.start(now);
        noise.stop(now + duration);
        this.spikeDecibels(32);
    }

    // Lassan Pop-Pop / Snapper Instant Impact Snap
    playSnapperPop() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        // Sharp high-pitch transient drop
        const osc = this.ctx.createOscillator();
        const oGain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1800, now);
        osc.frequency.exponentialRampToValueAtTime(240, now + 0.035);

        oGain.gain.setValueAtTime(0.35, now);
        oGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

        osc.connect(oGain);
        oGain.connect(this.compressor);
        osc.start(now);
        osc.stop(now + 0.04);

        // Crisp crackle noise burst
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(2600, now);

        const nGain = this.ctx.createGain();
        nGain.gain.setValueAtTime(0.4, now);
        nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

        noise.connect(filter);
        filter.connect(nGain);
        nGain.connect(this.compressor);

        noise.start(now, Math.random() * 2, 0.05);
        this.spikeDecibels(48);
        this.triggerHaptic('snap');
    }

    // Parachute Rocket Launch Swoosh
    playParachuteLaunch() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(1600, now + 1.1);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 1.1);

        osc.connect(gain);
        gain.connect(this.compressor);
        osc.start(now);
        osc.stop(now + 1.1);
        this.spikeDecibels(42);
    }

    // Parachute Deploy Canopy Pop & Flutter
    playParachuteDeploy() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        // Soft cloth canopy pop
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.18);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        osc.connect(gain);
        gain.connect(this.compressor);
        osc.start(now);
        osc.stop(now + 0.18);

        // Flutter noise
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.pinkNoiseBuffer || this.noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, now);
        const nGain = this.ctx.createGain();
        nGain.gain.setValueAtTime(0.2, now);
        nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        noise.connect(filter);
        filter.connect(nGain);
        nGain.connect(this.compressor);
        noise.start(now, Math.random() * 2, 0.35);
    }

    // Bullet Bomb Heavy Concussion Blast
    playBulletBlast() {
        this.playBlast(1.35, 'sutli');
        this.spikeDecibels(98);
        this.triggerHaptic('heavy');
    }

    // Desi Gobar Mud Splat wet squelch sound
    playGobarSplat() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        // Wet squelch slap oscillator
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.22);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc.connect(gain);
        gain.connect(this.compressor);
        osc.start(now);
        osc.stop(now + 0.23);

        // Wet sludge noise burst
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.pinkNoiseBuffer || this.noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.linearRampToValueAtTime(250, now + 0.35);

        const nGain = this.ctx.createGain();
        nGain.gain.setValueAtTime(0.35, now);
        nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        noise.connect(filter);
        filter.connect(nGain);
        nGain.connect(this.compressor);
        noise.start(now, Math.random() * 2, 0.35);

        this.triggerHaptic('medium');
    }
}

// Global singleton instance
window.soundEngine = new PatakhaAudioEngine();

