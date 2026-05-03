let themes = {};
let verses = [];
let currentIndex = -1;

// Elements
const card = document.getElementById('bibleCard');
const content = document.getElementById('contentWrapper');
const verseDisplay = document.getElementById('verseDisplay');
const refDisplay = document.getElementById('refDisplay');
const bgContainer = document.getElementById('bg-canvas');
const toast = document.getElementById('toast');

// --- Settings Persistence ---
const settings = {
    particles: localStorage.getItem('particles') !== 'false',
    autoCopy: localStorage.getItem('autoCopy') !== 'false',
    largeText: localStorage.getItem('largeText') === 'true'
};

// --- Initialize Settings UI (Only if on settings page) ---
if (document.getElementById('particleToggle')) {
    const pToggle = document.getElementById('particleToggle');
    const cToggle = document.getElementById('copyToggle');
    const tToggle = document.getElementById('textToggle');

    pToggle.checked = settings.particles;
    cToggle.checked = settings.autoCopy;
    tToggle.checked = settings.largeText;

    pToggle.addEventListener('change', (e) => {
        localStorage.setItem('particles', e.target.checked);
        location.reload(); // Refresh to apply
    });
    cToggle.addEventListener('change', (e) => localStorage.setItem('autoCopy', e.target.checked));
    tToggle.addEventListener('change', (e) => {
        localStorage.setItem('largeText', e.target.checked);
        location.reload();
    });
}

// --- Fetch Data ---
async function initializeApp() {
    try {
        const [themesRes, versesRes] = await Promise.all([
            fetch('themes.json'),
            fetch('verses.json')
        ]);
        themes = await themesRes.json();
        verses = await versesRes.json();

        if (verseDisplay) {
            verseDisplay.innerHTML = "Tap to begin your journey";
            if(settings.largeText) verseDisplay.style.fontSize = "2.8rem";
        }
    } catch (err) {
        console.error("Make sure to use a Local Server to see the theme colors!");
    }
}

// --- Card Interaction ---
if (card) {
    card.addEventListener('click', () => {
        if (verses.length === 0) return;
        content.classList.remove('active');
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % verses.length;
            const verse = verses[currentIndex];
            const theme = themes[verse.themeKey];
            
            verseDisplay.innerHTML = verse.text;
            refDisplay.innerText = verse.ref;
            if (bgContainer && theme) bgContainer.style.background = theme.gradient;
            content.classList.add('active');

            if (settings.autoCopy) {
                navigator.clipboard.writeText(`${verseDisplay.innerText} - ${refDisplay.innerText}`);
                if (toast) {
                    toast.style.display = 'block';
                    setTimeout(() => { toast.style.display = 'none'; }, 1500);
                }
            }
        }, 400);
    });
}

// --- Particle Engine ---
const canvas = document.getElementById('particle-overlay');
if (canvas && settings.particles) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height + canvas.height;
            this.size = Math.random() * 2;
            this.speed = Math.random() * 0.5 + 0.2;
            this.alpha = Math.random() * 0.5;
        }
        update() { this.y -= this.speed; if (this.y < -10) this.reset(); }
        draw() { ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); }
    }

    for(let i=0; i<60; i++) particles.push(new Particle());
    function animate() { ctx.clearRect(0,0, canvas.width, canvas.height); particles.forEach(p => { p.update(); p.draw(); }); requestAnimationFrame(animate); }
    animate();
}

initializeApp();
