// 1. Initial State & Data Fallbacks (Prevents errors if JSON fails)
let themes = { 
    "peace": { "gradient": "linear-gradient(135deg, #0f2027, #203a43, #2c5364)" } 
};
let verses = [{ "text": "Tap the card to load light.", "ref": "THE PATH", "themeKey": "peace" }];
let currentIndex = -1;

// 2. Settings Persistence
const getSetting = (key, defaultValue) => {
    const val = localStorage.getItem(key);
    return val === null ? defaultValue : val === 'true';
};

const appSettings = {
    particles: getSetting('pf_particles', true),
    autoCopy: getSetting('pf_copy', true)
};

// 3. Elements
const bg = document.getElementById('bg-canvas');
const verseEl = document.getElementById('verseDisplay');
const refEl = document.getElementById('refDisplay');
const card = document.getElementById('bibleCard');
const content = document.getElementById('contentWrapper');

// 4. Data Loading Logic
async function loadData() {
    try {
        // We use relative paths for GitHub Pages
        const [tRes, vRes] = await Promise.all([
            fetch('./themes.json').then(r => r.json()),
            fetch('./verses.json').then(r => r.json())
        ]);
        themes = tRes;
        verses = vRes;
        console.log("Data loaded successfully from GitHub.");
    } catch (e) {
        console.warn("GitHub Fetch failed. Check if files are in the main folder.");
    }
}

// 5. Verse Card Interaction
if (card) {
    card.addEventListener('click', () => {
        content.classList.remove('active');
        
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % verses.length;
            const v = verses[currentIndex];
            const t = themes[v.themeKey] || themes["peace"];

            if (verseEl) verseEl.innerHTML = v.text;
            if (refEl) refEl.innerText = v.ref;
            if (bg) bg.style.background = t.gradient;
            
            content.classList.add('active');

            // Auto-Copy Feature
            if (appSettings.autoCopy) {
                const txt = verseEl.innerText + " - " + refEl.innerText;
                navigator.clipboard.writeText(txt).then(() => {
                    const toast = document.getElementById('toast');
                    if(toast) {
                        toast.style.display = 'block';
                        setTimeout(() => toast.style.display = 'none', 1500);
                    }
                });
            }
        }, 300);
    } );
}

// 6. Settings Page Controls
const pTog = document.getElementById('particleToggle');
const cTog = document.getElementById('copyToggle');

if (pTog) {
    pTog.checked = appSettings.particles;
    cTog.checked = appSettings.autoCopy;

    pTog.addEventListener('change', (e) => {
        localStorage.setItem('pf_particles', e.target.checked);
        location.reload(); // Refresh to start/stop particles
    });
    cTog.addEventListener('change', (e) => {
        localStorage.setItem('pf_copy', e.target.checked);
    });
}

// 7. Particle Engine
const canvas = document.getElementById('particle-overlay');
if (canvas && appSettings.particles) {
    const ctx = canvas.getContext('2d');
    let pts = [];
    
    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    for(let i=0; i<60; i++) {
        pts.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            s: Math.random() * 2,
            v: Math.random() * 0.4 + 0.1
        });
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        pts.forEach(p => {
            p.y -= p.v;
            if (p.y < 0) p.y = canvas.height;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
            ctx.fill();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
}

loadData();
