// ===== LOGO SCROLL INTRO =====
(function () {

    document.body.classList.add('intro-active');
    document.body.style.overflow = 'hidden';

    const overlay = document.getElementById('logo-intro-overlay');
    const logoCont = document.getElementById('intro-logo-container');
    const tagline = document.getElementById('intro-tagline');
    const scrollHint = document.getElementById('intro-scroll-hint');
    const introBg = document.getElementById('intro-bg');

    let scrollCount = 0;
    const MAX_SCROLLS = 3;
    let isAnimating = false;
    let introComplete = false;

    window.addEventListener('load', function () {
        logoCont.style.transition = 'transform 1s ease, opacity 1s ease';
        logoCont.style.transform = 'scale(1)';
        logoCont.style.opacity = '1';

        setTimeout(() => {
            tagline.style.opacity = '1';
        }, 800);
        setTimeout(() => {
            if (scrollHint) scrollHint.style.opacity = '1';
        }, 1400);
    });

    function onScroll(e) {
        if (introComplete || isAnimating) return;
        e.preventDefault();

        if (e.deltaY <= 0) return;

        isAnimating = true;
        scrollCount++;

        const scales = [2.5, 6, 18];
        const opacities = [0.7, 0.3, 0];
        const idx = scrollCount - 1;

        logoCont.style.transition = 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.5s ease';
        logoCont.style.transform = `scale(${scales[idx]})`;
        logoCont.style.opacity = opacities[idx];

        if (scrollHint) scrollHint.style.opacity = '0';

        setTimeout(() => {
            isAnimating = false;

            if (scrollCount >= MAX_SCROLLS) {
                introComplete = true;
                endIntro();
            }
        }, 500);
    }

    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (introComplete || isAnimating) return;
        const diff = touchStartY - e.touches[0].clientY;
        if (diff > 40) {
            touchStartY = e.touches[0].clientY;
            onScroll({ preventDefault: () => {}, deltaY: 1 });
        }
    }, { passive: false });

    window.addEventListener('wheel', onScroll, { passive: false });

    function endIntro() {
        window.removeEventListener('wheel', onScroll);

        introBg.style.transition = 'opacity 0.6s ease';
        introBg.style.opacity = '0';

        setTimeout(() => {
            document.body.style.overflow = '';
            document.body.classList.remove('intro-active');
            document.body.classList.add('intro-done');
            overlay.style.display = 'none';
            if (typeof heroLoop === 'function') heroLoop();
        }, 600);
    }

})();
// ===== END LOGO SCROLL INTRO =====

const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('nav-menu');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelectorAll('.nav-link');
const scrollToTop = document.getElementById('scrollToTop');
const heroSection = document.getElementById('home');
const contactSection = document.getElementById('contact');
const heroIntro = document.getElementById('hero-intro');
const heroLines = document.querySelectorAll('.hero-line');
const heroStars = document.getElementById('hero-stars');
const heroCta = document.getElementById('hero-cta');
const heroOrbNodes = document.querySelectorAll('.hero-orb');
let heroLoopTimers = [];

const ZONE_THEMES = {
    zone1: {
        accent: '#FDCA2D',
        bgPrimary: '#0D0C1A',
        bgSecondary: '#12112A',
        textPrimary: '#FFF7E5',
        textSecondary: '#DFE8F7',
        gold1: '#FDCA2D',
        gold2: '#F9B801',
        gold3: '#F39413',
        gold4: '#EA5E20',
        cardHighlight: 'rgba(57, 49, 133, 0.28)',
        cardBorderGlow: 'rgba(253, 202, 45, 0.35)',
        formBorderGlow: 'rgba(253, 202, 45, 0.35)',
        founderBorder: '#FDCA2D',
        brandGradient: 'linear-gradient(120deg, #FDCA2D 0%, #F9B801 35%, #F39413 65%, #EA5E20 100%)'
    },
    zone2: {
        accent: '#F9B801',
        bgPrimary: '#12112A',
        bgSecondary: '#393185',
        textPrimary: '#DFE8F7',
        textSecondary: '#DFE8F7',
        gold1: '#F9B801',
        gold2: '#F9B801',
        gold3: '#F39413',
        gold4: '#EA5E20',
        cardHighlight: 'rgba(57, 49, 133, 0.45)',
        cardBorderGlow: 'rgba(249, 184, 1, 0.35)',
        formBorderGlow: 'rgba(249, 184, 1, 0.35)',
        founderBorder: '#F9B801',
        brandGradient: 'linear-gradient(120deg, #F9B801 0%, #F39413 50%, #EA5E20 100%)'
    },
    zone3: {
        accent: '#F39413',
        bgPrimary: '#1A1835',
        bgSecondary: '#12112A',
        textPrimary: '#FFF7E5',
        textSecondary: '#DFE8F7',
        gold1: '#F39413',
        gold2: '#F9B801',
        gold3: '#F39413',
        gold4: '#EA5E20',
        cardHighlight: 'rgba(26, 24, 53, 0.92)',
        cardBorderGlow: 'rgba(243, 148, 19, 0.4)',
        formBorderGlow: 'rgba(243, 148, 19, 0.38)',
        founderBorder: '#F39413',
        brandGradient: 'linear-gradient(120deg, #F39413 0%, #F9B801 40%, #EA5E20 100%)'
    },
    zone4: {
        accent: '#EA5E20',
        bgPrimary: '#2D2C5D',
        bgSecondary: 'rgba(57, 49, 133, 0.3)',
        textPrimary: '#DFE8F7',
        textSecondary: '#DFE8F7',
        gold1: '#EA5E20',
        gold2: '#F39413',
        gold3: '#F9B801',
        gold4: '#EA5E20',
        cardHighlight: 'rgba(57, 49, 133, 0.32)',
        cardBorderGlow: 'rgba(234, 94, 32, 0.38)',
        formBorderGlow: 'rgba(234, 94, 32, 0.32)',
        founderBorder: '#EA5E20',
        brandGradient: 'linear-gradient(120deg, #EA5E20 0%, #F39413 45%, #FDCA2D 100%)'
    },
    zone5: {
        accent: '#FDCA2D',
        bgPrimary: '#393185',
        bgSecondary: '#2D2C5D',
        textPrimary: '#FFF7E5',
        textSecondary: '#DFE8F7',
        gold1: '#FDCA2D',
        gold2: '#F9B801',
        gold3: '#F39413',
        gold4: '#EA5E20',
        cardHighlight: 'rgba(45, 44, 93, 0.55)',
        cardBorderGlow: 'rgba(253, 202, 45, 0.38)',
        formBorderGlow: 'rgba(253, 202, 45, 0.32)',
        founderBorder: '#F9B801',
        brandGradient: 'linear-gradient(120deg, #FDCA2D 0%, #F9B801 40%, #F39413 100%)'
    },
    zone6: {
        accent: '#F39413',
        bgPrimary: '#12112A',
        bgSecondary: '#1A1835',
        textPrimary: '#DFE8F7',
        textSecondary: '#DFE8F7',
        gold1: '#F39413',
        gold2: '#FDCA2D',
        gold3: '#F39413',
        gold4: '#EA5E20',
        cardHighlight: 'rgba(57, 49, 133, 0.28)',
        cardBorderGlow: 'rgba(243, 148, 19, 0.45)',
        formBorderGlow: 'rgba(243, 148, 19, 0.5)',
        founderBorder: '#F39413',
        brandGradient: 'linear-gradient(120deg, #FDCA2D 0%, #F39413 45%, #EA5E20 100%)'
    },
    zone7: {
        accent: '#FDCA2D',
        bgPrimary: '#080716',
        bgSecondary: '#12112A',
        textPrimary: '#DFE8F7',
        textSecondary: '#DFE8F7',
        gold1: '#FDCA2D',
        gold2: '#F9B801',
        gold3: '#F39413',
        gold4: '#EA5E20',
        cardHighlight: 'rgba(57, 49, 133, 0.22)',
        cardBorderGlow: 'rgba(253, 202, 45, 0.28)',
        formBorderGlow: 'rgba(253, 202, 45, 0.25)',
        founderBorder: '#FDCA2D',
        brandGradient: 'linear-gradient(120deg, #FDCA2D 0%, #F9B801 35%, #EA5E20 100%)'
    }
};

const zoneIntersectionState = new Map();
let activeZoneId = '';
let scrollProgressFrame = null;

let lastScrollTop = 0;

function queueHeroTimer(callback, delay) {
    const timer = setTimeout(callback, delay);
    heroLoopTimers.push(timer);
}

function clearHeroTimers() {
    heroLoopTimers.forEach((timer) => clearTimeout(timer));
    heroLoopTimers = [];
}

function setHeroPhaseIndicators(phase) {
    const dots = document.querySelectorAll('.hero-phase-dot');
    if (!dots.length) return;

    dots.forEach((dot, index) => {
        const shouldBeActive = (phase === 'phase1' && index === 0) || (phase === 'phase2' && index === 1);
        dot.classList.toggle('active', shouldBeActive);
    });
}

function showPhase1() {
    if (!heroSection) return;

    heroSection.classList.remove('hero-phase-1-fade');
    heroSection.classList.add('hero-phase-1');
    heroSection.classList.remove('hero-phase-2');
    setHeroPhaseIndicators('phase1');

    if (!heroIntro || !heroLines.length) return;

    heroIntro.classList.remove('hidden', 'fade-out');
    void heroIntro.offsetWidth;
    heroLines.forEach((line) => line.classList.remove('show'));

    heroLines.forEach((line, index) => {
        queueHeroTimer(() => {
            line.classList.add('show');
        }, index * 500);
    });
}

function hidePhase1() {
    if (heroSection) {
        heroSection.classList.add('hero-phase-1-fade');
    }

    if (!heroIntro) return;
    heroIntro.classList.add('fade-out');
    queueHeroTimer(() => {
        heroIntro.classList.add('hidden');
    }, 800);
}

function showPhase2() {
    if (!heroSection) return;
    heroSection.classList.remove('hero-phase-1-fade');
    heroSection.classList.remove('hero-phase-1');
    heroSection.classList.add('hero-phase-2');
    setHeroPhaseIndicators('phase2');
}

function hidePhase2() {
    if (!heroSection) return;
    heroSection.classList.remove('hero-phase-2');
    heroSection.classList.add('hero-phase-1');
    setHeroPhaseIndicators('phase1');
}

function heroLoop() {
    clearHeroTimers();
    showPhase1();

    queueHeroTimer(() => {
        hidePhase1();

        queueHeroTimer(() => {
            showPhase2();

            queueHeroTimer(() => {
                hidePhase2();

                queueHeroTimer(() => {
                    heroLoop();
                }, 1000);
            }, 6000);
        }, 1000);
    }, 5000);
}

function initHeroPhaseIndicators() {
    if (!heroSection) return;
    const indicator = document.createElement('div');
    indicator.className = 'hero-phase-indicators';
    indicator.setAttribute('aria-hidden', 'true');
    indicator.innerHTML = '<span class="hero-phase-dot active"></span><span class="hero-phase-dot"></span>';
    heroSection.appendChild(indicator);
}

function createStars(count = 42) {
    if (!heroStars) return;

    for (let i = 0; i < count; i += 1) {
        const star = document.createElement('span');
        star.className = 'star';
        const size = Math.random() * 2.8 + 1;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = 2 + Math.random() * 3;
        const opacity = 0.18 + Math.random() * 0.68;

        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${left}%`;
        star.style.top = `${top}%`;
        star.style.opacity = `${opacity}`;
        star.style.animationDelay = `${delay}s`;
        star.style.animationDuration = `${duration}s`;

        heroStars.appendChild(star);
    }
}

function createContactParticles(count = 20) {
    if (!contactSection) return;

    const existingLayer = contactSection.querySelector('.contact-particles');
    if (existingLayer) {
        existingLayer.remove();
    }

    const layer = document.createElement('div');
    layer.className = 'contact-particles';
    layer.setAttribute('aria-hidden', 'true');

    for (let i = 0; i < count; i += 1) {
        const particle = document.createElement('span');
        particle.className = 'contact-particle';

        const size = 2 + Math.random() * 3;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const opacity = 0.3 + Math.random() * 0.3;
        const duration = 8 + Math.random() * 6;
        const delay = Math.random() * 6;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.top = `${top}%`;
        particle.style.opacity = `${opacity}`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.background = `rgba(253, 202, 45, ${opacity})`;

        layer.appendChild(particle);
    }

    contactSection.appendChild(layer);
}

function initContactCinematicEffects() {
    if (!contactSection) return;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    const gridOverlay = document.createElement('div');
    gridOverlay.className = 'contact-grid-overlay';
    gridOverlay.setAttribute('aria-hidden', 'true');
    contactSection.appendChild(gridOverlay);

    const clapDeco = document.createElement('div');
    clapDeco.className = 'clap-deco';
    clapDeco.setAttribute('aria-hidden', 'true');
    clapDeco.innerHTML = '<div class="clap-top">🎬</div><div class="clap-text">SCENE 01 · TAKE 01</div>';
    contactSection.appendChild(clapDeco);

    const clapText = clapDeco.querySelector('.clap-text');
    let take = 1;
    setInterval(() => {
        take += 1;
        if (clapText) {
            clapText.textContent = `SCENE 01 · TAKE ${String(take).padStart(2, '0')}`;
        }
    }, 4000);

    if (!isMobile) {
        const spotlight = document.createElement('div');
        spotlight.id = 'contact-spotlight';
        spotlight.setAttribute('aria-hidden', 'true');
        contactSection.appendChild(spotlight);

        contactSection.addEventListener('mousemove', (event) => {
            const rect = contactSection.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            spotlight.style.left = `${x}px`;
            spotlight.style.top = `${y}px`;
        });

        const frameLayer = document.createElement('div');
        frameLayer.className = 'film-frame-layer';
        frameLayer.setAttribute('aria-hidden', 'true');
        contactSection.appendChild(frameLayer);

        for (let i = 0; i < 6; i += 1) {
            const frame = document.createElement('div');
            frame.className = 'film-frame-deco';
            frame.style.left = `${8 + Math.random() * 84}%`;
            frame.style.top = `${8 + Math.random() * 80}%`;
            frame.style.animationDuration = `${8 + Math.random() * 6}s`;
            frame.style.animationDelay = `${Math.random() * 4}s`;

            for (let j = 0; j < 8; j += 1) {
                const hole = document.createElement('span');
                hole.className = `frame-hole ${j < 4 ? 'top' : 'bottom'}`;
                hole.style.left = `${10 + (j % 4) * 12}px`;
                frame.appendChild(hole);
            }

            frameLayer.appendChild(frame);
        }
    }

    document.querySelectorAll('#contact input, #contact textarea').forEach((field) => {
        field.addEventListener('focus', () => {
            const wrapper = field.parentElement;
            if (!wrapper) return;
            wrapper.classList.remove('scanning');
            void wrapper.offsetWidth;
            wrapper.classList.add('scanning');
        });
    });

    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        const countdown = document.createElement('span');
        countdown.className = 'btn-cine-countdown';
        submitBtn.appendChild(countdown);

        let countdownTimer = null;
        const sequence = ['3...', '2...', '1...', 'ACTION!'];
        let sequenceIndex = 0;

        submitBtn.addEventListener('mouseenter', () => {
            submitBtn.classList.add('countdown-active');
            countdown.textContent = sequence[0];
            sequenceIndex = 1;
            countdownTimer = setInterval(() => {
                countdown.textContent = sequence[sequenceIndex % sequence.length];
                sequenceIndex += 1;
            }, 450);
        });

        submitBtn.addEventListener('mouseleave', () => {
            submitBtn.classList.remove('countdown-active');
            countdown.textContent = '';
            if (countdownTimer) {
                clearInterval(countdownTimer);
                countdownTimer = null;
            }
        });
    }
}

function handleNavVisibility() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    if (scrollTop > 80) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    if (scrollTop > lastScrollTop && scrollTop > 150) {
        navbar.classList.add('nav-hidden');
    } else {
        navbar.classList.remove('nav-hidden');
    }

    if (scrollTop > 500) {
        scrollToTop.classList.add('visible');
    } else {
        scrollToTop.classList.remove('visible');
    }

    lastScrollTop = Math.max(scrollTop, 0);
}

function setActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const checkpoint = window.scrollY + 140;

    sections.forEach((section) => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-link[href="#${id}"]`);

        if (!link) return;

        if (checkpoint >= top && checkpoint < top + height) {
            navLinks.forEach((item) => item.classList.remove('active'));
            link.classList.add('active');
        }
    });
}

function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.14,
            rootMargin: '0px 0px -60px 0px'
        }
    );

    reveals.forEach((node) => observer.observe(node));
}

function initGsapMicroInteractions() {
    if (!window.gsap || !window.ScrollTrigger) return;

    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.section-divider').forEach((divider) => {
        gsap.from(divider, {
            scaleX: 0.55,
            opacity: 0,
            transformOrigin: 'center center',
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: divider,
                start: 'top 95%',
                toggleActions: 'play none none none'
            }
        });
    });
}

function forceRevealVisible(selector) {
    document.querySelectorAll(selector).forEach((node) => {
        node.classList.add('visible');
    });
}

function initSmoothAnchor() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            const href = anchor.getAttribute('href');
            if (!href || href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });

            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
}

function initMenu() {
    hamburger.addEventListener('click', () => {
        const expanded = hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
}

function initScrollTop() {
    scrollToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function initPortfolioTabs() {
    const tabs = document.querySelectorAll('.portfolio-tab');
    const filmCards = document.querySelector('.films-grid');
    const commercialCards = document.querySelector('.commercials-grid');

    if (!tabs.length || !filmCards || !commercialCards) return;

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            tabs.forEach((item) => {
                item.classList.remove('active');
                item.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            if (tab.dataset.tab === 'films') {
                filmCards.style.opacity = '0';
                setTimeout(() => {
                    filmCards.classList.remove('portfolio-grid-hidden');
                    commercialCards.classList.add('portfolio-grid-hidden');
                    filmCards.style.opacity = '1';
                    forceRevealVisible('.films-grid .reveal');
                }, 300);
            } else {
                commercialCards.style.opacity = '0';
                setTimeout(() => {
                    commercialCards.classList.remove('portfolio-grid-hidden');
                    filmCards.classList.add('portfolio-grid-hidden');
                    commercialCards.style.opacity = '1';
                    forceRevealVisible('.commercials-grid .reveal');
                }, 300);
            }
        });
    });
}

function initPortfolioTouch() {
    if (!('ontouchstart' in window)) return;

    const cards = document.querySelectorAll('.portfolio-item');
    if (!cards.length) return;

    cards.forEach((card) => {
        card.addEventListener('click', function (e) {
            if (e.target.closest('a, button')) return;

            const isActive = this.classList.contains('touch-active');

            cards.forEach((c) => c.classList.remove('touch-active'));

            if (!isActive) {
                this.classList.add('touch-active');
            }
        });
    });
}

// ===== CUSTOM CURSOR =====
(function () {

    const cursor = document.createElement('div');
    cursor.id = 'custom-cursor';

    cursor.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none"
             xmlns="http://www.w3.org/2000/svg">
            <path
                d="M0 0L16 10L8 11.5L4.5 19L0 0Z"
                fill="#FDCA2D"
                stroke="#EA5E20"
                stroke-width="1"
                stroke-linejoin="round"
            />
        </svg>
    `;

    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    const hoverTargets = 'a, button, .portfolio-card, .portfolio-item, .tab-btn, .portfolio-tab, input, textarea, select, [onclick]';

    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(hoverTargets)) {
            cursor.classList.add('is-hovering');
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(hoverTargets)) {
            cursor.classList.remove('is-hovering');
        }
    });

    document.addEventListener('mousedown', () => {
        cursor.classList.add('is-clicking');
    });
    document.addEventListener('mouseup', () => {
        cursor.classList.remove('is-clicking');
    });

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
    });

})();
// ===== END CUSTOM CURSOR =====

function initHeroOrbParallax() {
    if (!heroSection || !heroOrbNodes.length) return;
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

    const speeds = [0.02, 0.05, 0.03, 0.07, 0.04, 0.06];

    heroSection.addEventListener('mousemove', (event) => {
        if (heroSection.classList.contains('hero-phase-2')) return;

        const x = event.clientX - (window.innerWidth / 2);
        const y = event.clientY - (window.innerHeight / 2);

        heroOrbNodes.forEach((orb, index) => {
            const speed = speeds[index] ?? 0.03;
            orb.style.setProperty('--parallax-x', `${x * speed}px`);
            orb.style.setProperty('--parallax-y', `${y * speed}px`);
        });
    });

    heroSection.addEventListener('mouseleave', () => {
        heroOrbNodes.forEach((orb) => {
            orb.style.setProperty('--parallax-x', '0px');
            orb.style.setProperty('--parallax-y', '0px');
        });
    });
}

function applyZoneTheme(zoneId) {
    const theme = ZONE_THEMES[zoneId];
    if (!theme || zoneId === activeZoneId) return;

    activeZoneId = zoneId;
    document.body.setAttribute('data-zone', zoneId);

    const root = document.documentElement;
    root.style.setProperty('--accent-color', theme.accent);
    root.style.setProperty('--bg-primary', theme.bgPrimary);
    root.style.setProperty('--bg-secondary', theme.bgSecondary);
    root.style.setProperty('--text-primary', theme.textPrimary);
    root.style.setProperty('--text-secondary', theme.textSecondary);
    root.style.setProperty('--gold-1', theme.gold1);
    root.style.setProperty('--gold-2', theme.gold2);
    root.style.setProperty('--gold-3', theme.gold3);
    root.style.setProperty('--gold-4', theme.gold4);
    root.style.setProperty('--card-highlight', theme.cardHighlight);
    root.style.setProperty('--card-border-glow', theme.cardBorderGlow);
    root.style.setProperty('--form-border-glow', theme.formBorderGlow);
    root.style.setProperty('--founder-border', theme.founderBorder);
    root.style.setProperty('--brand-gradient', theme.brandGradient);
}

function pickActiveZoneFromObserver() {
    let bestEl = null;
    let bestRatio = 0;

    zoneIntersectionState.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const ratio = entry.intersectionRatio;
        if (ratio >= 0.3 && ratio > bestRatio) {
            bestRatio = ratio;
            bestEl = entry.target;
        }
    });

    if (!bestEl) {
        let fallbackRatio = 0;
        zoneIntersectionState.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const ratio = entry.intersectionRatio;
            if (ratio > fallbackRatio) {
                fallbackRatio = ratio;
                bestEl = entry.target;
            }
        });
    }

    if (bestEl) {
        const id = bestEl.getAttribute('data-zone');
        if (id) applyZoneTheme(id);
    } else {
        applyZoneTheme('zone1');
    }
}

function initZoneColorSystem() {
    const zoneNodes = document.querySelectorAll('[data-zone]');
    if (!zoneNodes.length) return;

    const zoneObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                zoneIntersectionState.set(entry.target, entry);
            });
            pickActiveZoneFromObserver();
        },
        {
            threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
            rootMargin: '0px'
        }
    );

    zoneNodes.forEach((node) => zoneObserver.observe(node));

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            pickActiveZoneFromObserver();
        });
    });
}

function updateScrollProgress() {
    if (scrollProgressFrame !== null) return;
    scrollProgressFrame = requestAnimationFrame(() => {
        scrollProgressFrame = null;
        const doc = document.documentElement;
        const scrollTop = window.scrollY || doc.scrollTop;
        const scrollable = doc.scrollHeight - doc.clientHeight;
        const ratio = scrollable > 0 ? Math.min(1, Math.max(0, scrollTop / scrollable)) : 0;
        doc.style.setProperty('--scroll-progress', String(ratio));
    });
}

window.addEventListener('scroll', () => {
    handleNavVisibility();
    setActiveLink();
    updateScrollProgress();
});

window.addEventListener('resize', () => {
    updateScrollProgress();
});

document.addEventListener('DOMContentLoaded', () => {
    const portfolioBgVideo = document.getElementById('portfolio-bg-video');
    const portfolioSection = document.getElementById('portfolio');
    const servicesBgVideo = document.getElementById('services-bg-video');
    const servicesSection = document.getElementById('services');
    if (portfolioBgVideo) {
        portfolioBgVideo.muted = true;
        portfolioBgVideo.loop = true;
        portfolioBgVideo.playbackRate = 0.75;

        portfolioBgVideo.addEventListener('loadeddata', () => {
            portfolioBgVideo.play().catch((error) => console.log(error));
        });

        portfolioBgVideo.addEventListener('canplay', () => {
            portfolioBgVideo.play().catch((error) => console.log(error));
        });

        portfolioBgVideo.play().catch((error) => console.log(error));

        if (portfolioSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        portfolioBgVideo.play().catch((error) => console.log(error));
                    } else {
                        portfolioBgVideo.pause();
                    }
                });
            }, { threshold: 0.1 });

            observer.observe(portfolioSection);
        }
    }

    if (servicesBgVideo) {
        servicesBgVideo.muted = true;
        servicesBgVideo.loop = true;
        servicesBgVideo.playbackRate = 0.7;

        servicesBgVideo.addEventListener('loadeddata', () => {
            servicesBgVideo.play().catch((error) => console.log(error));
        });
        servicesBgVideo.addEventListener('canplay', () => {
            servicesBgVideo.play().catch((error) => console.log(error));
        });
        servicesBgVideo.play().catch((error) => console.log(error));

        const servicesObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    servicesBgVideo.play().catch((error) => console.log(error));
                } else {
                    servicesBgVideo.pause();
                }
            });
        }, { threshold: 0.1 });

        if (servicesSection) servicesObserver.observe(servicesSection);
    }

    initHeroPhaseIndicators();
    initMenu();
    initSmoothAnchor();
    initScrollTop();
    initPortfolioTabs();
    initPortfolioTouch();
    initRevealAnimations();
    initGsapMicroInteractions();
    initHeroOrbParallax();
    initZoneColorSystem();
    createStars(46);
    const isMobile = window.innerWidth <= 768;
    createContactParticles(isMobile ? 5 : 20);
    initContactCinematicEffects();
    forceRevealVisible('.section-header.reveal');
    forceRevealVisible('#portfolio .films-grid .reveal');
    forceRevealVisible('#services .services-grid .reveal');
    forceRevealVisible('#contact .contact-info .reveal');
    handleNavVisibility();
    setActiveLink();
    updateScrollProgress();
    heroLoop();
});

// ===== JUGNU / FIREFLIES =====
(function() {

  const overlay = document.getElementById('logo-intro-overlay');
  const introBg = document.getElementById('intro-bg');
  if (!overlay || !introBg) return;

  const JUGNU_COUNT = window.innerWidth <= 768 ? 15 : 35;

  const colors = [
    'rgba(253,202,45,',   // gold
    'rgba(249,184,1,',    // deep gold
    'rgba(255,240,150,',  // warm white
    'rgba(234,94,32,',    // amber orange
  ];

  function flyJugnu(el) {
    if (typeof gsap === 'undefined') return;
    gsap.to(el, {
      x: (Math.random() - 0.5) * 150,
      y: (Math.random() - 0.5) * 150,
      opacity: Math.random() * 0.8 + 0.2,
      duration: 3 + Math.random() * 5,
      ease: 'sine.inOut',
      onComplete: function() { flyJugnu(el); }
    });
  }

  for (let i = 0; i < JUGNU_COUNT; i++) {
    const jugnu = document.createElement('div');
    jugnu.className = 'jugnu';

    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = 2 + Math.random() * 3;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const duration = 4 + Math.random() * 8;
    const delay = Math.random() * 6;
    const glowSize = 4 + Math.random() * 8;

    jugnu.style.cssText = `
      position: absolute;
      left: ${x}%;
      top: ${y}%;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${color}0.9);
      box-shadow: 
        0 0 ${glowSize}px ${glowSize/2}px ${color}0.6),
        0 0 ${glowSize*2}px ${glowSize}px ${color}0.3);
      z-index: 2;
      pointer-events: none;
    `;

    introBg.appendChild(jugnu);

    if (typeof gsap !== 'undefined') {
      // Entrance fade-in, then recursive random flight
      gsap.fromTo(jugnu,
        { opacity: 0, scale: 0 },
        {
          opacity: 0.8,
          scale: 1,
          duration: 1,
          delay: delay,
          ease: 'power2.out',
          onComplete: function() { flyJugnu(jugnu); }
        }
      );

      // Separate glow pulse
      gsap.to(jugnu, {
        boxShadow: `0 0 15px 8px ${color}0.9), 0 0 30px 15px ${color}0.4)`,
        duration: 1.5 + Math.random(),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: delay
      });
    } else {
      // Fallback — CSS keyframe animations
      jugnu.style.animation =
        `jugnuFloat ${duration}s ease-in-out ${delay}s infinite, ` +
        `jugnuGlow ${2 + Math.random() * 2}s ease-in-out ${delay}s infinite`;
    }
  }

})();
// ===== END JUGNU =====