// --- GLOBAL STATE ---
let themes = {};
let verses = [];
let currentIndex = -1;
let currentGlobalTheme = 'peace';

// --- DOM ELEMENTS ---
const card = document.getElementById('bibleCard');
const verseDisplay = document.getElementById('verseDisplay');
const refDisplay = document.getElementById('refDisplay');
const bgContainer = document.getElementById('bg-canvas');
const mainNav = document.getElementById('mainNav');

// --- DATA FETCHING ---
async function loadAppData() {
    try {
        const [themesResponse, versesResponse] = await Promise.all([
            fetch('themes.json'),
            fetch('verses.json')
        ]);

        themes = await themesResponse.json();
        verses = await versesResponse.json();

        // Initialize the look once data is ready
        applyThemeStyles();
    } catch (error) {
        console.error("Error loading JSON data:", error);
    }
}

// --- THEME ENGINE ---
function applyThemeStyles() {
    if (!themes[currentGlobalTheme] || !bgContainer) return;
    
    const theme = themes[currentGlobalTheme];
    bgContainer.style.background = theme.gradient;
    
    if (mainNav) {
        mainNav.style.background = theme.nav;
        mainNav.style.backdropFilter = "blur(15px)";
    }
}

function setGlobalTheme(themeKey, el) {
    currentGlobalTheme = themeKey;
    applyThemeStyles();
    document.querySelectorAll('.theme-swatch').forEach(s => s.classList.remove('active-theme'));
    if(el) el.classList.add('active-theme');
}

// --- INTERACTION ---
if (card) {
    card.addEventListener('click', () => {
        if (verses.length === 0) return;

        const content = document.getElementById('contentWrapper');
        content.classList.remove('active');

        setTimeout(() => {
            currentIndex = (currentIndex + 1) % verses.length;
            const verse = verses[currentIndex];
            
            verseDisplay.innerHTML = verse.text;
            refDisplay.innerText = verse.ref;
            
            // Sync background to verse theme
            currentGlobalTheme = verse.themeKey;
            applyThemeStyles();
            
            content.classList.add('active');
        }, 400);
    });
}

// Start the app
loadAppData();
