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

// --- Fetching Logic ---
async function initializeApp() {
    try {
        // Fetching your existing JSON files
        const [themesRes, versesRes] = await Promise.all([
            fetch('themes.json'),
            fetch('verses.json')
        ]);
        
        themes = await themesRes.json();
        verses = await versesRes.json();

        // Check if we are on the home page (where the card exists)
        if (verseDisplay) {
            verseDisplay.innerHTML = "Tap to begin your journey";
            refDisplay.innerText = "The Path of Faith";
        }
    } catch (err) {
        console.error("JSON Fetch Error: Ensure you are using a local server.", err);
        if (verseDisplay) verseDisplay.innerText = "Run from a local server to load verses.";
    }
}

// --- Interaction (Only for index.html) ---
if (card) {
    card.addEventListener('click', () => {
        if (verses.length === 0) return;
        
        content.classList.remove('active');
        
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % verses.length;
            const verse = verses[currentIndex];
            const theme = themes[verse.themeKey];
            
            // Set text
            verseDisplay.innerHTML = verse.text;
            refDisplay.innerText = verse.ref;
            
            // Update Background Gradient
            if (bgContainer && theme) {
                bgContainer.style.background = theme.gradient;
            }
            
            content.classList.add('active');
            
            // Auto-Copy
            copyToClipboard(`${verseDisplay.innerText} - ${refDisplay.innerText}`);
            
            // Toast
            if (toast) {
                toast.style.display = 'block';
                setTimeout(() => { toast.style.display = 'none'; }, 2000);
            }
        }, 400);
    });
}

function copyToClipboard(text) {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}

// --- Particle Engine (Visible on all pages) ---
const canvas = document.getElementById('particle-overlay');
const ctx = canvas ? canvas.getContext('2d') : null;
let particles = [];

function initParticles() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height + canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speed = Math.random() * 0.4 + 0.2;
        this.alpha = Math.random() * 0.5;
    }
    update() {
        this.y -= this.speed;
        if (this.y < -10) this.reset();
    }
    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function animate() {
    if (!ctx) return;
    ctx.clearRect(0,0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
}

if (canvas) {
    window.addEventListener('resize', initParticles);
    initParticles();
    for(let i=0; i<60; i++) particles.push(new Particle());
    animate();
}

initializeApp();
