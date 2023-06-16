import '../styles/index.scss';

// script.js


// DOM Selectors
const content = document.querySelector('#content');
const genreSelector = document.querySelector('#genre');
const yearSelector = document.querySelector('#year');
const movieSelector = document.querySelector('#movie');
const bookSelector = document.querySelector('#book');
const searchSelector = document.querySelector('#search');

let mediaData = [];

// Utility function to create filter container
function createFilterContainer(container, id, name) {
    const filterContainer = document.createElement('div');
    filterContainer.classList.add('filter-container');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = id;
    checkbox.name = name;
    checkbox.value = id;
    const label = document.createElement('label');
    label.htmlFor = id;
    label.textContent = id;
    filterContainer.appendChild(checkbox);
    filterContainer.appendChild(label);
    container.appendChild(filterContainer);
}

// Utility function to clear checkboxes
function clearCheckBoxes(name) {
    const checkboxes = document.querySelectorAll(`input[name="${name}"]`);
    checkboxes.forEach(checkbox => checkbox.checked = false);
}

// Fetch data and populate filters
fetch('https://raw.githubusercontent.com/HubSpotWebTeam/CodeExercise/main/src/js/data/data.json')
    .then(response => response.json())
    .then(data => {
        mediaData = data.media.sort((a, b) => a.title.localeCompare(b.title));
        displayMedia(mediaData);
        populateFilters(mediaData);
    });

function displayMedia(data) {
    content.innerHTML = '';
    if (data.length === 0) {
        content.innerHTML = `<h2>No results found</h2>`;
        return;
    }

    data.forEach(media => {
        const div = document.createElement('div');
        div.classList.add('media_item_content');
        div.innerHTML = `
        <div class="image-container">
           <img src=${media.poster} alt=${media.title}>
        </div>
        <div class="info-container">
         <h2>${media.title} (${media.year})</h2>
         <p>Genres: ${media.genre.join(', ')}</p>
       </div>`;
        content.appendChild(div);
    });
}

// Add event listeners for filter change
[genreSelector, yearSelector, movieSelector, bookSelector].forEach(selector => {
    selector.addEventListener('change', filterMedia);
});

function filterMedia() {
    const movieSelected = movieSelector.checked;
    const bookSelected = bookSelector.checked;
    const searchText = searchSelector.value.toLowerCase();

    const selectedGenres = Array.from(document.querySelectorAll('input[name="genre"]:checked')).map(input => input.value);
    const selectedYears = Array.from(document.querySelectorAll('input[name="year"]:checked')).map(input => input.value);

    const filteredData = mediaData.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchText);
        const matchesType = movieSelected ? item.type === 'movie' : bookSelected ? item.type === 'book' : true;
        const matchesGenre = selectedGenres.length > 0 ? item.genre.some(genre => selectedGenres.includes(genre)) : true;
        const matchesYear = selectedYears.length > 0 ? selectedYears.includes(item.year) : true;

        return matchesSearch && matchesGenre && matchesYear && matchesType;
    });

    displayMedia(filteredData);
}

function populateFilters(data) {
    const genres = new Set();
    let years = new Set();

    const genreBtn =  document.querySelector('#genre-btn');
    const yearBtn = document.querySelector('#year-btn');

    data.forEach(item => {
        item.genre.forEach(genre => genres.add(genre));
        years.add(item.year);
    });

    const genreContainer = document.querySelector('#genre');
    const yearContainer = document.querySelector('#year');

    genres.forEach(genre => createFilterContainer(genreContainer, genre, 'genre'));
    years = new Set(Array.from(years).sort());
    years.forEach(year => createFilterContainer(yearContainer, year, 'year'));

    genreBtn.addEventListener('click', () => {
     genreSelector.style.display = genreSelector.style.display === 'block' ? 'none' : 'block';
      yearSelector.style.display = "none";
    });

    yearBtn.addEventListener('click', () => {
      yearSelector.style.display = yearSelector.style.display === 'block' ? 'none' : 'block';
      genreSelector.style.display = "none";
    });
}

window.addEventListener('mousedown', function (event) {
    if (!event.target.closest('#genre') && event.target.id !== 'genre-btn') {
        genreSelector.style.display = 'none';
    }

    if (!event.target.closest('#year') && event.target.id !== 'year-btn') {
        yearSelector.style.display = 'none';
    }
});

document.querySelector('#clear').addEventListener('click', () => {
    // Clear all filters
    [movieSelector, bookSelector].forEach(selector => selector.checked = false);
    searchSelector.value = '';

    // Uncheck all checkboxes
    ['genre', 'year'].forEach(clearCheckBoxes);

    // Apply filters
    filterMedia();
});

searchSelector.addEventListener('keyup', filterMedia);

console.log('App Ready');
