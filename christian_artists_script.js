// --- DOM CORE OBJECT RECRUITMENT ---
const themeToggleBtn = document.getElementById('theme-toggle');
const searchBar = document.getElementById('search-bar');
const gridItems = document.querySelectorAll('.grid-item');
const noResultsMessage = document.getElementById('no-results');

// =======================================================
//   PORTAL 1: SYSTEM VISUAL PREFERENCE ROUTER (LOCAL STORAGE)
// =======================================================
const savedTheme = localStorage.getItem('theme');
const systemDarkPref = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Run initial system structural logic check
if (savedTheme === 'dark' || (!savedTheme && systemDarkPref)) {
  document.body.classList.add('dark-mode');
  themeToggleBtn.textContent = '☀️ Light Mode';
} else {
  document.body.classList.remove('dark-mode');
  themeToggleBtn.textContent = '🌙 Dark Mode';
}

// User-driven switch interface binding
themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isCurrentlyDark = document.body.classList.contains('dark-mode');
  
  themeToggleBtn.textContent = isCurrentlyDark ? '☀️ Light Mode' : '🌙 Dark Mode';
  localStorage.setItem('theme', isCurrentlyDark ? 'dark' : 'light');
});

// =======================================================
//   PORTAL 2: INTERACTIVE LIVE SEARCH BAR CORE ALGORITHM
// =======================================================
searchBar.addEventListener('input', (event) => {
  const searchString = event.target.value.toLowerCase().trim();
  let visibleItemsCount = 0;

  gridItems.forEach(item => {
    // Look inside the specific text element of each single grid card
    const artistName = item.querySelector('figcaption').textContent.toLowerCase();

    if (artistName.includes(searchString)) {
      // Show card if matched, and override display rule manually
      item.style.display = 'flex';
      visibleItemsCount++;
    } else {
      // Completely hide card from structure tree if mismatch
      item.style.display = 'none';
    }
  });

  // Render alternate text feedback if search filters absolutely everything
  if (visibleItemsCount === 0) {
    noResultsMessage.style.display = 'block';
  } else {
    noResultsMessage.style.display = 'none';
  }
});
