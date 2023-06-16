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
    if (data.length === 0) {
        content.innerHTML = `<h2>No results found</h2>`;
    } else {
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
    });}

}

document.querySelector('#genre').addEventListener('change', filterMedia);
document.querySelector('#year').addEventListener('change', filterMedia);

document.querySelector('#movie').addEventListener('change', filterMedia);
document.querySelector('#book').addEventListener('change', filterMedia);

function filterMedia() {
    const movieSelected = document.querySelector('#movie').checked;
    const bookSelected = document.querySelector('#book').checked;
    const searchText = document.querySelector('#search').value.toLowerCase();

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

    const yearContent = document.querySelector('#year');
    const genreContent = document.querySelector('#genre');

    const genreBtn =  document.querySelector('#genre-btn');
    const yearBtn = document.querySelector('#year-btn');

    data.forEach(item => {
        item.genre.forEach(genre => genres.add(genre));
        years.add(item.year);
    });

    const genreContainer = document.querySelector('#genre');
    const yearContainer = document.querySelector('#year');

    genres.forEach(genre => {
        const container = document.createElement('div');
        container.classList.add('filter-container');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = genre;
        checkbox.name = 'genre';
        checkbox.value = genre;
        const label = document.createElement('label');
        label.htmlFor = genre;
        label.textContent = genre;
        container.appendChild(checkbox);
        container.appendChild(label);
        genreContainer.appendChild(container);

    });

    years = new Set(Array.from(years).sort());

    years.forEach(year => {
        const container = document.createElement('div');
        container.classList.add('filter-container');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = year;
        checkbox.name = 'year';
        checkbox.value = year;
        const label = document.createElement('label');
        label.htmlFor = year;
        label.textContent = year;
        container.appendChild(checkbox);
        container.appendChild(label);
        yearContainer.appendChild(container);
    });

    genreBtn.addEventListener('click', () => {
     genreContent.style.display = genreContent.style.display === 'block' ? 'none' : 'block';
      yearContent.style.display = "none";
    });

    yearBtn.addEventListener('click', () => {
      yearContent.style.display = yearContent.style.display === 'block' ? 'none' : 'block';
      genreContent.style.display = "none";
    });

}

window.addEventListener('mousedown', function (event) {
    const genreContent = document.querySelector('#genre');
    const yearContent = document.querySelector('#year');

    if (!event.target.closest('#genre') && event.target.id !== 'genre-btn') {
        genreContent.style.display = 'none';
    }

    if (!event.target.closest('#year') && event.target.id !== 'year-btn') {
        yearContent.style.display = 'none';
    }
});


document.querySelector('#clear').addEventListener('click', () => {
    // Clear all filters
    document.querySelector('#movie').checked = false;
    document.querySelector('#book').checked = false;
    document.querySelector('#search').value = '';

    // Uncheck all genre checkboxes
    const genreCheckboxes = document.querySelectorAll('input[name="genre"]');
    genreCheckboxes.forEach(checkbox => checkbox.checked = false);

    // Uncheck all year checkboxes
    const yearCheckboxes = document.querySelectorAll('input[name="year"]');
    yearCheckboxes.forEach(checkbox => checkbox.checked = false);

    // Apply filters
    filterMedia();
});


document.querySelector('#search').addEventListener('keyup', filterMedia);


console.log('App Ready');