import '../styles/index.scss';

// script.js

let mediaData = [];

fetch('https://raw.githubusercontent.com/HubSpotWebTeam/CodeExercise/main/src/js/data/data.json')
    .then(response => response.json())
    .then(data => {
        mediaData = data.media.sort((a, b) => a.title.localeCompare(b.title));
        displayMedia(mediaData);
        populateFilters(mediaData);
    });

function displayMedia(data) {
    const content = document.querySelector('#content');
    content.innerHTML = '';
    data.forEach(media => {
        const div = document.createElement('div');
        div.classList.add('item');
        div.innerHTML = `<h2>${media.title}</h2>
                        <img src=${media.poster} alt=${media.title}>
                        <p>${media.year}</p>
                        <p>${media.genre.join(', ')}</p>
                        <p>${media.type}</p>`;
        content.appendChild(div);
    });
}

document.querySelector('#genre').addEventListener('change', filterMedia);
document.querySelector('#year').addEventListener('change', filterMedia);

document.querySelector('#movie').addEventListener('change', filterMedia);
document.querySelector('#book').addEventListener('change', filterMedia);

function filterMedia() {
    const movieSelected = document.querySelector('#movie').checked;
    const bookSelected = document.querySelector('#book').checked;
    const searchText = document.querySelector('#search').value.toLowerCase();
    const genreValue = document.querySelector('#genre').value;
    const yearValue = document.querySelector('#year').value;

    const filteredData = mediaData.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchText);
        const matchesGenre = genreValue ? item.genre.includes(genreValue) : true;
        const matchesType = movieSelected ? item.type === 'movie' : bookSelected ? item.type === 'book' : true;
        const matchesYear = yearValue ? item.year === yearValue : true;
        return matchesSearch && matchesGenre && matchesYear && matchesType;
    });

    displayMedia(filteredData);
}



function populateFilters(data) {

    const genres = new Set();
    let years = new Set();

    data.forEach(item => {
        item.genre.forEach(genre => genres.add(genre));
        years.add(item.year);
    });

    const genreContainer = document.querySelector('#genre');
    const yearContainer = document.querySelector('#year');

    genres.forEach(genre => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = genre;
        checkbox.name = 'genre';
        checkbox.value = genre;
        const label = document.createElement('label');
        label.htmlFor = genre;
        label.textContent = genre;
        genreContainer.appendChild(checkbox);
        genreContainer.appendChild(label);
    });

    years = new Set(Array.from(years).sort());

    years.forEach(year => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = year;
        checkbox.name = 'year';
        checkbox.value = year;
        const label = document.createElement('label');
        label.htmlFor = year;
        label.textContent = year;
        yearContainer.appendChild(checkbox);
        yearContainer.appendChild(label);
    });
}

document.querySelector('#clear').addEventListener('click', () => {
    // Clear all filters
    document.querySelector('#movie').checked = false;
    document.querySelector('#book').checked = false;
    document.querySelector('#genre').selectedIndex = 0;
    document.querySelector('#year').selectedIndex = 0;
    document.querySelector('#search').value = '';

    filterMedia();
});

document.querySelector('#search').addEventListener('keyup', filterMedia);


console.log('App Ready');
