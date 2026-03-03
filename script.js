// OMDb API Configuration
const API_KEY = '9b5d7e52';
let currentMovies = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadGames();
    searchMovies('2025');
    setupScrollAnimation();
});

// Games Data
const gamesData = {
    ps5: [
        { name: 'God of War Ragnarök', rating: '⭐⭐⭐⭐⭐', image: 'https://via.placeholder.com/300x300?text=GOW' },
        { name: 'Spider-Man 2', rating: '⭐⭐⭐⭐⭐', image: 'https://via.placeholder.com/300x300?text=Spider+Man' },
        { name: 'FIFA 24', rating: '⭐⭐⭐⭐', image: 'https://via.placeholder.com/300x300?text=FIFA' },
        { name: 'Call of Duty: MW3', rating: '⭐⭐⭐⭐', image: 'https://via.placeholder.com/300x300?text=COD' }
    ],
    ps4: [
        { name: 'God of War', rating: '⭐⭐⭐⭐⭐', image: 'https://via.placeholder.com/300x300?text=GOW' },
        { name: 'The Last of Us 2', rating: '⭐⭐⭐⭐⭐', image: 'https://via.placeholder.com/300x300?text=TLOU' },
        { name: 'GTA V', rating: '⭐⭐⭐⭐⭐', image: 'https://via.placeholder.com/300x300?text=GTA' },
        { name: 'Red Dead Redemption 2', rating: '⭐⭐⭐⭐⭐', image: 'https://via.placeholder.com/300x300?text=RDR2' }
    ],
    ps3: [
        { name: 'God of War III', rating: '⭐⭐⭐⭐', image: 'https://via.placeholder.com/300x300?text=GOW3' },
        { name: 'NFS Most Wanted', rating: '⭐⭐⭐⭐', image: 'https://via.placeholder.com/300x300?text=NFS' },
        { name: 'GTA IV', rating: '⭐⭐⭐⭐', image: 'https://via.placeholder.com/300x300?text=GTA4' }
    ],
    pc: [
        { name: 'Cyberpunk 2077', rating: '⭐⭐⭐⭐', image: 'https://via.placeholder.com/300x300?text=Cyberpunk' },
        { name: 'Valorant', rating: '⭐⭐⭐⭐⭐', image: 'https://via.placeholder.com/300x300?text=Valorant' },
        { name: 'Fortnite', rating: '⭐⭐⭐⭐', image: 'https://via.placeholder.com/300x300?text=Fortnite' }
    ]
};

// Load Games
function loadGames() {
    displayGames('all');
}

function displayGames(console) {
    const gamesGrid = document.getElementById('gamesGrid');
    let gamesToShow = [];
    
    if (console === 'all') {
        gamesToShow = [...gamesData.ps5, ...gamesData.ps4, ...gamesData.ps3, ...gamesData.pc];
    } else {
        gamesToShow = gamesData[console] || [];
    }
    
    gamesGrid.innerHTML = gamesToShow.map(game => `
        <div class="game-card grid-item" onclick="showReserveDemo('${game.name}')">
            <img src="${game.image}" alt="${game.name}" style="width: 100%; border-radius: 10px;">
            <h4>${game.name}</h4>
            <div class="game-rating">${game.rating}</div>
            <button class="btn-reserve" onclick="event.stopPropagation(); showReserveDemo('${game.name}')">
                <i class="fas fa-calendar-check"></i> Reserve
            </button>
        </div>
    `).join('');
}

// Filter Games
function filterGames(console) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(console) || 
            (console === 'all' && btn.textContent === 'All')) {
            btn.classList.add('active');
        }
    });
    displayGames(console);
}

// Search Movies
async function searchMovies(year = '') {
    const searchInput = document.getElementById('movieSearch');
    const searchTerm = searchInput ? searchInput.value : 'movie';
    const moviesGrid = document.getElementById('moviesGrid');
    
    moviesGrid.innerHTML = '<div class="loading">Loading latest movies...</div>';
    
    try {
        let url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(searchTerm || 'movie')}&type=movie`;
        if (year) {
            url += `&y=${year}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.Search) {
            // Get full details for each movie
            const movieDetails = await Promise.all(
                data.Search.slice(0, 8).map(movie => 
                    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`)
                        .then(res => res.json())
                )
            );
            
            displayMovies(movieDetails);
        } else {
            displayFallbackMovies();
        }
    } catch (error) {
        console.error('Error:', error);
        displayFallbackMovies();
    }
}

function displayMovies(movies) {
    const moviesGrid = document.getElementById('moviesGrid');
    moviesGrid.innerHTML = movies.map(movie => `
        <div class="movie-card" onclick="showBookDemo('${movie.Title}')">
            <div class="movie-poster">
                <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'}" 
                     alt="${movie.Title}">
                <div class="movie-overlay">
                    <span class="movie-year">${movie.Year}</span>
                    <button class="btn-book-demo" onclick="event.stopPropagation(); showBookDemo('${movie.Title}')">
                        <i class="fas fa-ticket-alt"></i> Book
                    </button>
                </div>
            </div>
            <h3>${movie.Title.length > 20 ? movie.Title.substring(0, 20) + '...' : movie.Title}</h3>
            <div class="movie-meta">
                <span>⭐ ${movie.imdbRating || 'N/A'}</span>
                <span>${movie.Genre ? movie.Genre.split(',')[0] : 'Movie'}</span>
            </div>
        </div>
    `).join('');
}

function displayFallbackMovies() {
    const fallbackMovies = [
        { Title: 'Dune: Part Two', Year: '2024', Poster: 'https://via.placeholder.com/300x450?text=Dune+2', imdbRating: '8.5', Genre: 'Sci-Fi' },
        { Title: 'Godzilla x Kong', Year: '2024', Poster: 'https://via.placeholder.com/300x450?text=Godzilla', imdbRating: '7.8', Genre: 'Action' },
        { Title: 'Kung Fu Panda 4', Year: '2024', Poster: 'https://via.placeholder.com/300x450?text=Kung+Fu', imdbRating: '7.2', Genre: 'Animation' },
        { Title: 'Furiosa', Year: '2024', Poster: 'https://via.placeholder.com/300x450?text=Furiosa', imdbRating: '8.0', Genre: 'Action' }
    ];
    displayMovies(fallbackMovies);
}

// Demo Functions
function showReserveDemo(gameName) {
    showToast(`🎮 Demo: "${gameName}" reservation sent! EAZY TECH will confirm on WhatsApp.`);
}

function showBookDemo(movieName) {
    showToast(`🎬 Demo: "${movieName}" booking received! Check your email for confirmation.`);
}

function showLoginDemo() {
    showToast('🔐 Demo: Login page preview. In real version, you\'ll access your dashboard.');
}

function showSignupDemo() {
    showToast('✅ Demo: Sign up successful! (This is a demo preview)');
}

// Toast System
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Mobile Menu
function toggleMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
}

// Smooth Scroll Animation
function setupScrollAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// Active Nav Link on Scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});
