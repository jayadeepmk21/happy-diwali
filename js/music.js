/**
 * Diwali Songs Jukebox & Background Playlist Player
 * Styled directly after Deluxe Salon Music (deluxesalonmusic.in)
 * 
 * Features 5 festive Bollywood & Punjabi chartbusters:
 * 1. What Jhumka ? (Rocky Aur Rani Kii Prem Kahaani)
 * 2. Kesariya (Brahmāstra)
 * 3. Lover (Diljit Dosanjh)
 * 4. Tum Tak (Raanjhanaa)
 * 5. Kala Chashma (Baar Baar Dekho)
 */

const DIWALI_SONGS = [
    {
        id: 'what-jhumka',
        title: 'What Jhumka ?',
        movie: 'Rocky Aur Rani Kii Prem Kahaani',
        artist: 'Pritam, Arijit Singh, Jonita Gandhi',
        year: '2023',
        src: 'assets/audio/songs/what-jhumka.mp3',
        art: 'assets/audio/songs/what-jhumka.jpg'
    },
    {
        id: 'kesariya',
        title: 'Kesariya',
        movie: 'Brahmāstra',
        artist: 'Pritam, Arijit Singh, Amitabh Bhattacharya',
        year: '2022',
        src: 'assets/audio/songs/kesariya.mp3',
        art: 'assets/audio/songs/kesariya.jpg'
    },
    {
        id: 'ghungroo',
        title: 'Ghungroo',
        movie: 'War',
        artist: 'Arijit Singh, Shilpa Rao, Vishal-Shekhar',
        year: '2019',
        src: 'assets/audio/songs/ghungroo.mp3',
        art: 'assets/audio/songs/ghungroo.jpg'
    },
    {
        id: 'badri-ki-dulhania',
        title: 'Badri Ki Dulhania',
        movie: 'Badrinath Ki Dulhania',
        artist: 'Dev Negi, Neha Kakkar, Monali Thakur, Ikka',
        year: '2017',
        src: 'assets/audio/songs/badri-ki-dulhania.mp3',
        art: 'assets/audio/songs/badri-ki-dulhania.jpg'
    },
    {
        id: 'high-heels',
        title: 'High Heels Te Nachche',
        movie: 'Ki & Ka',
        artist: 'Meet Bros, Yo Yo Honey Singh, Jaz Dhami',
        year: '2016',
        src: 'assets/audio/songs/high-heels.mp3',
        art: 'assets/audio/songs/high-heels.jpg'
    },
    {
        id: 'gallan-goodiyaan',
        title: 'Gallan Goodiyaan',
        movie: 'Dil Dhadakne Do',
        artist: 'Shankar Mahadevan, Sukhwinder Singh',
        year: '2015',
        src: 'assets/audio/songs/gallan-goodiyaan.mp3',
        art: 'assets/audio/songs/gallan-goodiyaan.jpg'
    },
    {
        id: 'chogada',
        title: 'Chogada Tara',
        movie: 'Loveyatri (Diwali Party)',
        artist: 'Darshan Raval, Asees Kaur',
        year: '2018',
        src: 'assets/audio/songs/chogada.mp3',
        art: 'assets/audio/songs/chogada.jpg'
    },
    {
        id: 'london-thumakda',
        title: 'London Thumakda',
        movie: 'Queen',
        artist: 'Labh Janjua, Sonu Kakkar, Neha Kakkar',
        year: '2014',
        src: 'assets/audio/songs/london-thumakda.mp3',
        art: 'assets/audio/songs/london-thumakda.jpg'
    },
    {
        id: 'dilliwaali-girlfriend',
        title: 'Dilliwaali Girlfriend',
        movie: 'Yeh Jawaani Hai Deewani',
        artist: 'Arijit Singh, Sunidhi Chauhan, Pritam',
        year: '2013',
        src: 'assets/audio/songs/dilliwaali-girlfriend.mp3',
        art: 'assets/audio/songs/dilliwaali-girlfriend.jpg'
    },
    {
        id: 'sauda-khara-khara',
        title: 'Sauda Khara Khara',
        movie: 'Good Newwz',
        artist: 'Diljit Dosanjh, Sukhbir, Dhvani Bhanushali',
        year: '2019',
        src: 'assets/audio/songs/sauda-khara-khara.mp3',
        art: 'assets/audio/songs/sauda-khara-khara.jpg'
    },
    {
        id: 'lover',
        title: 'Lover',
        movie: 'MoonChild Era',
        artist: 'Diljit Dosanjh',
        year: '2021',
        src: 'assets/audio/songs/lover.mp3',
        art: 'assets/audio/songs/lover.jpg'
    },
    {
        id: 'tum-tak',
        title: 'Tum Tak',
        movie: 'Raanjhanaa',
        artist: 'A.R. Rahman, Javed Ali, Kirti Sagathia',
        year: '2013',
        src: 'assets/audio/songs/tum-tak.mp3',
        art: 'assets/audio/songs/tum-tak.jpg'
    },
    {
        id: 'kala-chashma',
        title: 'Kala Chashma',
        movie: 'Baar Baar Dekho',
        artist: 'Amar Arshi, Badshah, Neha Kakkar',
        year: '2016',
        src: 'assets/audio/songs/kala-chashma.mp3',
        art: 'assets/audio/songs/kala-chashma.jpg'
    }
];

class DiwaliMusicPlayer {
    constructor() {
        this.songs = DIWALI_SONGS;
        this.currentIndex = 0;
        this.isPlaying = false;
        this.isDrawerOpen = false;

        this.audio = new Audio();
        this.audio.preload = 'metadata';
        this.audio.volume = 0.70;

        // Wire DOM references
        this.dom = {
            capsule: document.getElementById('deluxe-music-capsule'),
            miniBadge: document.getElementById('deluxe-mini-badge'),
            miniBadgeArt: document.getElementById('mini-badge-art'),
            miniBadgeTitle: document.getElementById('mini-badge-title'),
            miniBadgePlayIcon: document.getElementById('mini-badge-play-icon'),

            vinylWrap: document.getElementById('deluxe-vinyl-wrap'),
            playerArt: document.getElementById('player-art'),
            playerTitle: document.getElementById('player-title'),
            playerMovie: document.getElementById('player-movie'),
            currTime: document.getElementById('player-curr-time'),
            totalTime: document.getElementById('player-total-time'),
            progressBarWrap: document.getElementById('player-progress-bar-wrap'),
            progressBar: document.getElementById('player-progress-bar'),

            btnPrev: document.getElementById('btn-player-prev'),
            btnPlay: document.getElementById('btn-player-play'),
            playIcon: document.getElementById('player-play-icon'),
            btnNext: document.getElementById('btn-player-next'),
            btnTogglePlaylist: document.getElementById('btn-toggle-playlist'),
            btnMinimize: document.getElementById('btn-player-minimize'),

            playlistDrawer: document.getElementById('deluxe-playlist-drawer'),
            playlistList: document.getElementById('playlist-list'),
            eq: document.getElementById('music-pill-eq'),

            mobileBtn: document.getElementById('btn-open-music'),
            mobileArt: document.getElementById('mobile-mini-art'),
            mobileTitle: document.getElementById('mobile-mini-title'),
            mobilePlay: document.getElementById('mobile-mini-play'),

            btnClosePlaylist: document.getElementById('btn-close-playlist'),
            drawerArt: document.getElementById('drawer-player-art'),
            drawerTitle: document.getElementById('drawer-player-title'),
            drawerArtist: document.getElementById('drawer-player-artist'),
            drawerProgressBarWrap: document.getElementById('drawer-progress-bar-wrap'),
            drawerProgressBar: document.getElementById('drawer-progress-bar'),
            btnDrawerPlay: document.getElementById('btn-drawer-play'),
            drawerPlayIcon: document.getElementById('drawer-play-icon')
        };

        this.init();
    }

    init() {
        if (!this.dom.capsule) {
            console.warn('[DiwaliMusicPlayer] Deluxe capsule container not found.');
            return;
        }

        // Load initial track metadata
        this.loadTrack(0, false);
        this.renderPlaylist();

        // Audio events
        this.audio.addEventListener('timeupdate', () => this.onTimeUpdate());
        this.audio.addEventListener('ended', () => this.nextTrack(true));
        this.audio.addEventListener('loadedmetadata', () => {
            if (this.dom.totalTime) {
                this.dom.totalTime.textContent = this.formatTime(this.audio.duration);
            }
        });
        this.audio.addEventListener('play', () => {
            this.isPlaying = true;
            this.updatePlayStateUI();
        });
        this.audio.addEventListener('pause', () => {
            this.isPlaying = false;
            this.updatePlayStateUI();
        });

        // Mobile Music Pill click in header -> opens playlist drawer
        if (this.dom.mobileBtn) {
            this.dom.mobileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.togglePlaylistDrawer();
            });
        }

        // Drawer Close Button
        if (this.dom.btnClosePlaylist) {
            this.dom.btnClosePlaylist.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closePlaylistDrawer();
            });
        }

        // Drawer Play/Pause button
        if (this.dom.btnDrawerPlay) {
            this.dom.btnDrawerPlay.addEventListener('click', (e) => {
                e.stopPropagation();
                this.togglePlay();
            });
        }

        // Drawer Progress bar scrub
        if (this.dom.drawerProgressBarWrap) {
            this.dom.drawerProgressBarWrap.addEventListener('click', (e) => {
                e.stopPropagation();
                const rect = this.dom.drawerProgressBarWrap.getBoundingClientRect();
                const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                if (this.audio.duration) {
                    this.audio.currentTime = pos * this.audio.duration;
                }
            });
        }

        // Play/Pause button in capsule
        if (this.dom.btnPlay) {
            this.dom.btnPlay.addEventListener('click', (e) => {
                e.stopPropagation();
                this.togglePlay();
            });
        }

        // Mini badge click in navbar -> expand capsule
        if (this.dom.miniBadge) {
            this.dom.miniBadge.addEventListener('click', () => {
                this.expandCapsule();
            });
        }

        // Minimize button in capsule -> collapse to mini badge
        if (this.dom.btnMinimize) {
            this.dom.btnMinimize.addEventListener('click', (e) => {
                e.stopPropagation();
                this.minimizeCapsule();
            });
        }

        // Next / Prev buttons
        if (this.dom.btnNext) {
            this.dom.btnNext.addEventListener('click', (e) => {
                e.stopPropagation();
                this.nextTrack(true);
            });
        }
        if (this.dom.btnPrev) {
            this.dom.btnPrev.addEventListener('click', (e) => {
                e.stopPropagation();
                this.prevTrack();
            });
        }

        // Playlist drawer toggle
        if (this.dom.btnTogglePlaylist) {
            this.dom.btnTogglePlaylist.addEventListener('click', (e) => {
                e.stopPropagation();
                this.togglePlaylistDrawer();
            });
        }
        if (this.dom.vinylWrap) {
            this.dom.vinylWrap.addEventListener('click', (e) => {
                e.stopPropagation();
                this.togglePlaylistDrawer();
            });
        }

        // Close drawer when clicking outside capsule
        document.addEventListener('click', (e) => {
            if (this.dom.playlistDrawer && !this.dom.playlistDrawer.classList.contains('hidden')) {
                if (this.dom.capsule && !this.dom.capsule.contains(e.target)) {
                    this.closePlaylistDrawer();
                }
            }
        });

        // Progress scrubbing
        if (this.dom.progressBarWrap) {
            this.dom.progressBarWrap.addEventListener('click', (e) => {
                e.stopPropagation();
                const rect = this.dom.progressBarWrap.getBoundingClientRect();
                const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                if (this.audio.duration) {
                    this.audio.currentTime = pos * this.audio.duration;
                }
            });
        }

        // Keyboard shortcut 'M' toggles music playback
        window.addEventListener('keydown', (e) => {
            if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
            if (e.key === 'm' || e.key === 'M') {
                this.togglePlay();
            }
        });
    }

    loadTrack(index, autoPlay = false) {
        if (index < 0) index = this.songs.length - 1;
        if (index >= this.songs.length) index = 0;

        this.currentIndex = index;
        const song = this.songs[index];

        this.audio.src = song.src;

        // Update Capsule UI
        if (this.dom.playerArt) this.dom.playerArt.src = song.art;
        if (this.dom.playerTitle) this.dom.playerTitle.textContent = song.title;
        if (this.dom.playerMovie) this.dom.playerMovie.textContent = `${song.movie} • ${song.artist}`;

        // Update Mini Badge UI
        if (this.dom.miniBadgeArt) this.dom.miniBadgeArt.src = song.art;
        if (this.dom.miniBadgeTitle) this.dom.miniBadgeTitle.textContent = song.title;

        // Update Mobile Pill UI in Header
        if (this.dom.mobileArt) this.dom.mobileArt.src = song.art;
        if (this.dom.mobileTitle) this.dom.mobileTitle.textContent = song.title;

        // Update Drawer Player Card
        if (this.dom.drawerArt) this.dom.drawerArt.src = song.art;
        if (this.dom.drawerTitle) this.dom.drawerTitle.textContent = song.title;
        if (this.dom.drawerArtist) this.dom.drawerArtist.textContent = `${song.movie} • ${song.artist}`;
        if (this.dom.drawerProgressBar) this.dom.drawerProgressBar.style.width = '0%';

        // Reset progress bar
        if (this.dom.progressBar) this.dom.progressBar.style.width = '0%';
        if (this.dom.currTime) this.dom.currTime.textContent = '0:00';

        this.renderPlaylist();

        if (autoPlay) {
            this.play();
        }
    }

    play() {
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.updatePlayStateUI();
        }).catch(err => {
            console.warn('Playback waiting for user interaction:', err.message);
        });
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.updatePlayStateUI();
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    nextTrack(autoPlay = true) {
        this.loadTrack(this.currentIndex + 1, autoPlay);
    }

    prevTrack() {
        if (this.audio.currentTime > 3) {
            this.audio.currentTime = 0;
            return;
        }
        this.loadTrack(this.currentIndex - 1, true);
    }

    updatePlayStateUI() {
        // Capsule Play icon
        if (this.dom.playIcon) {
            this.dom.playIcon.textContent = this.isPlaying ? '⏸' : '▶';
        }
        // Mobile Pill Play icon
        if (this.dom.mobilePlay) {
            this.dom.mobilePlay.textContent = this.isPlaying ? '⏸' : '▶';
        }
        // Drawer Play icon
        if (this.dom.drawerPlayIcon) {
            this.dom.drawerPlayIcon.textContent = this.isPlaying ? '⏸' : '▶';
        }
        // Mini badge play icon
        if (this.dom.miniBadgePlayIcon) {
            this.dom.miniBadgePlayIcon.textContent = this.isPlaying ? '⏸' : '▶';
        }

        // Vinyl Disc spinning animation
        if (this.dom.playerArt) {
            if (this.isPlaying) {
                this.dom.playerArt.classList.add('spinning-art');
            } else {
                this.dom.playerArt.classList.remove('spinning-art');
            }
        }
        if (this.dom.mobileArt) {
            if (this.isPlaying) {
                this.dom.mobileArt.classList.add('spinning-art');
            } else {
                this.dom.mobileArt.classList.remove('spinning-art');
            }
        }
        if (this.dom.drawerArt) {
            if (this.isPlaying) {
                this.dom.drawerArt.classList.add('spinning-art');
            } else {
                this.dom.drawerArt.classList.remove('spinning-art');
            }
        }
        if (this.dom.miniBadgeArt) {
            if (this.isPlaying) {
                this.dom.miniBadgeArt.classList.add('spinning-art');
            } else {
                this.dom.miniBadgeArt.classList.remove('spinning-art');
            }
        }

        // Equalizer wave in vinyl hole
        if (this.dom.eq) {
            this.dom.eq.style.opacity = this.isPlaying ? '1' : '0';
        }

        this.renderPlaylist();
    }

    onTimeUpdate() {
        if (!this.audio.duration) return;
        const pct = (this.audio.currentTime / this.audio.duration) * 100;
        if (this.dom.progressBar) {
            this.dom.progressBar.style.width = `${pct}%`;
        }
        if (this.dom.drawerProgressBar) {
            this.dom.drawerProgressBar.style.width = `${pct}%`;
        }
        if (this.dom.currTime) {
            this.dom.currTime.textContent = this.formatTime(this.audio.currentTime);
        }
    }

    formatTime(sec) {
        if (isNaN(sec)) return '0:00';
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    }

    minimizeCapsule() {
        if (this.dom.capsule) {
            this.dom.capsule.classList.add('hidden');
        }
        if (this.dom.miniBadge) {
            this.dom.miniBadge.classList.remove('hidden');
        }
        this.closePlaylistDrawer();
    }

    expandCapsule() {
        if (this.dom.capsule) {
            this.dom.capsule.classList.remove('hidden');
        }
        if (this.dom.miniBadge) {
            this.dom.miniBadge.classList.add('hidden');
        }
    }

    togglePlaylistDrawer() {
        if (!this.dom.playlistDrawer) return;
        const isHidden = this.dom.playlistDrawer.classList.contains('hidden');
        if (isHidden) {
            this.openPlaylistDrawer();
        } else {
            this.closePlaylistDrawer();
        }
    }

    openPlaylistDrawer() {
        if (!this.dom.playlistDrawer) return;
        this.dom.playlistDrawer.classList.remove('hidden');
        this.renderPlaylist();
    }

    closePlaylistDrawer() {
        if (!this.dom.playlistDrawer) return;
        this.dom.playlistDrawer.classList.add('hidden');
    }

    renderPlaylist() {
        if (!this.dom.playlistList) return;
        this.dom.playlistList.innerHTML = '';

        this.songs.forEach((s, idx) => {
            const isCurrent = idx === this.currentIndex;
            const item = document.createElement('button');
            item.className = `w-full flex items-center justify-between p-2 rounded-xl text-left transition active:scale-98 ${
                isCurrent
                    ? 'bg-amber-500/25 border border-amber-400/50 shadow-md'
                    : 'bg-white/5 hover:bg-white/10 border border-transparent'
            }`;

            item.innerHTML = `
                <div class="flex items-center gap-2.5 min-w-0">
                    <img src="${s.art}" alt="" class="w-8 h-8 rounded-lg object-cover shrink-0 border border-white/10 ${isCurrent && this.isPlaying ? 'spinning-art' : ''}">
                    <div class="min-w-0">
                        <div class="text-xs font-bold ${isCurrent ? 'text-amber-200' : 'text-amber-100'} truncate">
                            ${s.title}
                        </div>
                        <div class="text-[9px] text-amber-200/60 truncate">
                            ${s.movie} • ${s.artist}
                        </div>
                    </div>
                </div>
                <div class="text-xs font-bold shrink-0 ml-2 ${isCurrent ? 'text-emerald-400' : 'text-amber-200/40'}">
                    ${isCurrent ? (this.isPlaying ? '▶ 🎵' : '⏸') : '▶'}
                </div>
            `;

            item.onclick = (e) => {
                e.stopPropagation();
                if (idx === this.currentIndex) {
                    this.togglePlay();
                } else {
                    this.loadTrack(idx, true);
                }
            };

            this.dom.playlistList.appendChild(item);
        });
    }
}

window.DiwaliMusicPlayer = DiwaliMusicPlayer;
