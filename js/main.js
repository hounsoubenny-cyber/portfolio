// ============================================
// 1. CURSOR PERSONNALISÉ
// ============================================
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursor) {
        cursor.style.left = mouseX - 4 + 'px';
        cursor.style.top = mouseY - 4 + 'px';
    }
});

function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    if (ring) {
        ring.style.left = ringX - 16 + 'px';
        ring.style.top = ringY - 16 + 'px';
    }
    requestAnimationFrame(animateRing);
}
animateRing();

// Effet hover sur les éléments cliquables
const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-card');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (cursor) cursor.style.transform = 'scale(2.5)';
        if (ring) {
            ring.style.transform = 'scale(1.5)';
            ring.style.opacity = '0.3';
        }
    });
    el.addEventListener('mouseleave', () => {
        if (cursor) cursor.style.transform = 'scale(1)';
        if (ring) {
            ring.style.transform = 'scale(1)';
            ring.style.opacity = '0.5';
        }
    });
});

// ============================================
// 2. LANGUE (EN/FR)
// ============================================
let currentLang = localStorage.getItem('language') || 'en';

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);

    // Mettre à jour les boutons actifs
    document.getElementById('btnEN').classList.toggle('active', lang === 'en');
    document.getElementById('btnFR').classList.toggle('active', lang === 'fr');

    // Mettre à jour tous les éléments avec data-en / data-fr
    document.querySelectorAll('[data-en], [data-fr]').forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (text) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = text;
            } else {
                el.innerHTML = text;
            }
        }
    });
}

// Écouteurs pour les boutons de langue
document.getElementById('btnEN')?.addEventListener('click', () => setLanguage('en'));
document.getElementById('btnFR')?.addEventListener('click', () => setLanguage('fr'));

// Initialiser la langue
setLanguage(currentLang);

// ============================================
// 3. THEME (DARK/LIGHT)
// ============================================
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const themeBtn = document.getElementById('btnTheme');
    if (themeBtn) themeBtn.innerHTML = theme === 'dark' ? '🌙' : '☀️';
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

// Charger le thème sauvegardé
const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

// Écouteur pour le bouton thème
document.getElementById('btnTheme')?.addEventListener('click', toggleTheme);

// ============================================
// 4. AVATAR FLIP (clic pour montrer la photo)
// ============================================
const avatarCard = document.getElementById('avatarCard');
let flipTimeout;

if (avatarCard) {
    avatarCard.addEventListener('click', () => {
        avatarCard.classList.add('flipped');
        clearTimeout(flipTimeout);
        flipTimeout = setTimeout(() => {
            avatarCard.classList.remove('flipped');
        }, 3000);
    });
}

// ============================================
// 5. NAVIGATION SMOOTH SCROLL
// ============================================
const navLinks = document.querySelectorAll('.nav-link, .btn-primary, .btn-secondary');
const sections = ['hero', 'skills', 'services', 'projects', 'contact'];

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const sectionId = link.getAttribute('data-section');
        if (sectionId && sections.includes(sectionId)) {
            e.preventDefault();
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
                // Mettre à jour la classe active sur la navigation
                document.querySelectorAll('.nav-link').forEach(navLink => {
                    navLink.classList.remove('active');
                    if (navLink.getAttribute('data-section') === sectionId) {
                        navLink.classList.add('active');
                    }
                });
            }
        }
    });
});

// Mettre à jour la navigation active au scroll
function updateActiveNav() {
    const scrollPosition = window.scrollY + 100;

    for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
            const offsetTop = element.offsetTop;
            const offsetBottom = offsetTop + element.offsetHeight;

            if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === section) {
                        link.classList.add('active');
                    }
                });
                break;
            }
        }
    }
}

window.addEventListener('scroll', updateActiveNav);
updateActiveNav();

// ============================================
// 6. REVEAL ANIMATION (apparition au scroll)
// ============================================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ============================================
// 7. ANIMATION DES BARRES DE COMPÉTENCES
// ============================================
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bars = entry.target.querySelectorAll('.lang-fill');
            bars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => { bar.style.width = width; }, 100);
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.skill-card').forEach(card => skillObserver.observe(card));

// ============================================
// 8. PROTECTION DU LIEN DE CONTACT (anti-spam)
// ============================================
const emailLinks = document.querySelectorAll('.contact-link[href*="mailto"]');
emailLinks.forEach(link => {
    const email = link.getAttribute('href').replace('mailto:', '');
    const encodedEmail = email.split('').reverse().join('');
    link.setAttribute('href', `mailto:${encodedEmail.split('').reverse().join('')}`);
});

console.log('🚀 Portfolio chargé !');