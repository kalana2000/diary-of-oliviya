/**
 * DIARY OF OLIVIYA - Luxury Web Experience Scripts
 * Features: Dual custom cursor, 3D tilt, parallax scroll, counting milestones,
 * glass reviews carousel, and Web Audio API synthesized ambient romantic score.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. CORE INITIALIZATION & UTILITIES
       ========================================== */
    const isMobile = window.innerWidth <= 991;

    // Add Scroll-Reveal class to major sections for transition entry
    const scrollRevealSections = [
        document.querySelector('.concept-section'),
        document.querySelector('.concept-text-card'),
        document.querySelector('.diary-container'),
        document.querySelector('.characters-section'),
        document.querySelector('#semiyo-card'),
        document.querySelector('#oliviya-card'),
        document.querySelector('.milestone-section'),
        document.querySelector('.milestone-stats-box'),
        document.querySelector('.reviews-slider-wrapper'),
        document.querySelector('.purchase-card'),
        document.querySelector('.luxury-footer')
    ];

    scrollRevealSections.forEach(el => {
        if (el) el.classList.add('reveal-on-scroll');
    });

    /* ==========================================
       2. PREMIUM DUAL-CIRCLE CUSTOM CURSOR
       ========================================== */
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Instantly move the small inner dot
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });

        // Smooth outline trailing with lerp / animation frame
        const animateCursor = () => {
            const ease = 0.15; // trailing speed
            outlineX += (mouseX - outlineX) * ease;
            outlineY += (mouseY - outlineY) * ease;

            cursorOutline.style.left = outlineX + 'px';
            cursorOutline.style.top = outlineY + 'px';

            requestAnimationFrame(animateCursor);
        };
        requestAnimationFrame(animateCursor);

        // Hover expansions on clickables
        const hoverTargets = document.querySelectorAll('a, button, .nav-item, .slide-dots span, .char-img, .purchase-card');
        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            target.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    /* ==========================================
       3. FLOATING NAV SCROLL & PROGRESS INDICATOR
       ========================================== */
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.getElementById('scroll-progress');
    const bgImageLayer = document.querySelector('.bg-image-layer');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // 3.1 Progress Bar
        if (scrollProgress && docHeight > 0) {
            const scrolledPercentage = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = scrolledPercentage + '%';
        }

        // 3.2 Header Scroll Shadow & Blur Toggle
        if (navbar) {
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // 3.3 Subtle Parallax Backing Image Scaling/Movement
        if (bgImageLayer && !isMobile) {
            const speed = 0.05;
            const yOffset = scrollTop * speed;
            bgImageLayer.style.transform = `translate3d(0px, ${yOffset}px, 0px) scale(${1 + (scrollTop * 0.00015)})`;
        }

        // 3.4 Sync Menu Items Highlight on Scroll
        highlightActiveNavItem();
    });

    // Navigation Menu highlighting sync logic
    const navItems = document.querySelectorAll('.nav-links .nav-item');
    const sections = document.querySelectorAll('section');

    function highlightActiveNavItem() {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 180;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSectionId}`) {
                item.classList.add('active');
            }
        });
    }

    /* ==========================================
       4. MOBILE MENU OVERLAY NAVIGATION
       ========================================== */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile overlay on tapping any menu link
        navItems.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    /* ==========================================
       5. 3D TILT ANIMATION (BOOK COVER & CHARACTERS)
       ========================================== */
    const bookContainer = document.getElementById('book-container');
    const book3d = bookContainer ? bookContainer.querySelector('.book-3d') : null;

    if (bookContainer && book3d && !isMobile) {
        bookContainer.addEventListener('mousemove', (e) => {
            const rect = bookContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate tilt degrees (Max 25deg)
            const rotateY = ((x - centerX) / centerX) * 25;
            const rotateX = ((centerY - y) / centerY) * 20;

            book3d.style.transform = `rotateY(${rotateY - 22}deg) rotateX(${rotateX + 10}deg) scale(1.05)`;
            book3d.style.transition = 'transform 0.1s ease';
        });

        bookContainer.addEventListener('mouseleave', () => {
            // Restore default luxury resting position
            book3d.style.transform = 'rotateY(-22deg) rotateX(10deg) scale(1)';
            book3d.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        });
    }

    /* ==========================================
       6. SCROLL REVEAL ENTRY HANDLER
       ========================================== */
    const revealOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Trigger once
            }
        });
    }, revealOptions);

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach(el => revealObserver.observe(el));

    /* ==========================================
       7. STATISTICAL NUMBER ROLL COUNTERS
       ========================================== */
    const statsElements = document.querySelectorAll('.stat-num, .m-counter');
    let hasCounted = false;

    const countNumbers = () => {
        statsElements.forEach(stat => {
            const targetVal = parseInt(stat.getAttribute('data-val'), 10);
            const duration = 1800; // Total duration in ms
            const stepTime = Math.max(Math.floor(duration / (targetVal / 100)), 12);
            let currentVal = 0;
            
            const timer = setInterval(() => {
                if (targetVal < 100) {
                    currentVal += 1;
                } else {
                    currentVal += Math.ceil(targetVal / 80);
                }

                if (currentVal >= targetVal) {
                    stat.textContent = targetVal.toLocaleString();
                    clearInterval(timer);
                } else {
                    stat.textContent = currentVal.toLocaleString();
                }
            }, stepTime);
        });
    };

    // Trigger counters only when sections roll into viewport
    const triggerSection = document.getElementById('milestone');
    if (triggerSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasCounted) {
                    countNumbers();
                    hasCounted = true;
                }
            });
        }, { threshold: 0.2 });

        statsObserver.observe(triggerSection);
    } else {
        // Fallback count on load
        setTimeout(countNumbers, 1000);
    }

    /* ==========================================
       8. REVIEWS VERIFIED TESTIMONIAL SLIDER
       ========================================== */
    const slides = document.querySelectorAll('.review-slide');
    const dots = document.querySelectorAll('.slide-dots .dot');
    const prevBtn = document.querySelector('.prev-ctrl');
    const nextBtn = document.querySelector('.next-ctrl');
    let currentSlide = 0;

    function updateSlider(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        currentSlide = (index + slides.length) % slides.length;

        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    if (slides.length > 0) {
        if (nextBtn) nextBtn.addEventListener('click', () => updateSlider(currentSlide + 1));
        if (prevBtn) prevBtn.addEventListener('click', () => updateSlider(currentSlide - 1));

        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => updateSlider(idx));
        });

        // Automatic carousel rotation every 6 seconds
        setInterval(() => {
            updateSlider(currentSlide + 1);
        }, 6000);
    }

    /* ==========================================
       9. ADVANCED ROMANTIC AMBIENT AUDIO SYNTHESIZER
          (Web Audio API - Fully Offline & Self-Contained)
       ========================================== */
    const audioToggle = document.getElementById('audio-toggle');
    let audioCtx = null;
    let isPlaying = false;
    let ambientOscillators = [];
    let gainNodes = [];
    let compressorNode = null;
    let lowpassFilter = null;
    
    // Luxury Romantic Chord progression: 
    // Fmaj9 (F3, A3, C4, E4, G4) -> Cmaj9 (C3, G3, B3, D4, E4) -> Am9 (A2, E3, G3, C4, B4)
    const chords = [
        [174.61, 220.00, 261.63, 329.63, 392.00], // Fmaj9
        [130.81, 196.00, 246.94, 293.66, 329.63], // Cmaj9
        [110.00, 164.81, 196.00, 261.63, 493.88]  // Am9
    ];
    let chordIndex = 0;
    let chordInterval = null;

    function initAudio() {
        // Create browser audio context
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // Setup central compressor to prevent clipping and keep it smooth
        compressorNode = audioCtx.createDynamicsCompressor();
        compressorNode.threshold.setValueAtTime(-24, audioCtx.currentTime);
        compressorNode.knee.setValueAtTime(30, audioCtx.currentTime);
        compressorNode.ratio.setValueAtTime(12, audioCtx.currentTime);
        compressorNode.attack.setValueAtTime(0.003, audioCtx.currentTime);
        compressorNode.release.setValueAtTime(0.25, audioCtx.currentTime);
        compressorNode.connect(audioCtx.destination);

        // Lowpass filter to make the synthesizer sound warm, velvety, and cinematic
        lowpassFilter = audioCtx.createBiquadFilter();
        lowpassFilter.type = 'lowpass';
        lowpassFilter.frequency.setValueAtTime(450, audioCtx.currentTime);
        lowpassFilter.Q.setValueAtTime(1, audioCtx.currentTime);
        lowpassFilter.connect(compressorNode);
    }

    function playChord(frequencies) {
        const now = audioCtx.currentTime;

        // Clean up previous active voices gently (long release)
        gainNodes.forEach((node, i) => {
            try {
                node.gain.cancelScheduledValues(now);
                node.gain.setValueAtTime(node.gain.value, now);
                node.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);
                setTimeout(() => {
                    if (ambientOscillators[i]) {
                        try { ambientOscillators[i].stop(); } catch(e){}
                    }
                }, 3100);
            } catch(e) {}
        });

        ambientOscillators = [];
        gainNodes = [];

        // Synthesize 5 overlapping waves for full chord body
        frequencies.forEach((freq, idx) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            // Mix triangles and sines for vintage aesthetic warm sound
            osc.type = (idx % 2 === 0) ? 'triangle' : 'sine';
            osc.frequency.setValueAtTime(freq, now);
            
            // Subtle detune to make it feel rich and organic
            osc.detune.setValueAtTime((Math.random() - 0.5) * 15, now);
            
            // Soft slow attack (2.5 seconds fade in)
            gain.gain.setValueAtTime(0.0001, now);
            
            // Volume: Keep lower frequencies louder and higher notes soft & delicate
            const maxVolume = (idx === 0) ? 0.09 : 0.05 / (idx + 0.5);
            gain.gain.linearRampToValueAtTime(maxVolume * 0.12, now + 2.5);

            osc.connect(gain);
            gain.connect(lowpassFilter);
            
            osc.start(now);
            
            ambientOscillators.push(osc);
            gainNodes.push(gain);
        });
    }

    function startImmersiveScore() {
        if (!audioCtx) initAudio();
        
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        isPlaying = true;
        audioToggle.classList.add('playing');
        audioToggle.querySelector('.audio-text').textContent = 'IMMERSIVE MUSIC ON';

        // Play the first romantic chord instantly
        playChord(chords[chordIndex]);

        // Loop chords progression every 8 seconds
        chordInterval = setInterval(() => {
            chordIndex = (chordIndex + 1) % chords.length;
            playChord(chords[chordIndex]);
        }, 8000);
    }

    function stopImmersiveScore() {
        isPlaying = false;
        audioToggle.classList.remove('playing');
        audioToggle.querySelector('.audio-text').textContent = 'IMMERSIVE MUSIC OFF';
        
        if (chordInterval) {
            clearInterval(chordInterval);
            chordInterval = null;
        }

        const now = audioCtx ? audioCtx.currentTime : 0;
        gainNodes.forEach(node => {
            try {
                node.gain.cancelScheduledValues(now);
                node.gain.setValueAtTime(node.gain.value, now);
                node.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
            } catch(e) {}
        });

        setTimeout(() => {
            if (!isPlaying) {
                ambientOscillators.forEach(osc => {
                    try { osc.stop(); } catch(e){}
                });
                ambientOscillators = [];
                gainNodes = [];
            }
        }, 1600);
    }

    if (audioToggle) {
        audioToggle.addEventListener('click', () => {
            if (!isPlaying) {
                startImmersiveScore();
            } else {
                stopImmersiveScore();
            }
        });
    }
});
