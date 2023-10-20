document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const searchResultsText = document.getElementById('searchResults');
    const movieList = document.getElementById('movieList');
    const loader = document.getElementById('loader');
    const favoritesList = document.getElementById('favoritesList');
    const noFavoritesMessage = document.getElementById('noFavoritesMessage');
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    updateFavoritesTab();
    searchResultsText.style.display = 'none';

    //Function to fetch and display movie data
    function searchMovies(searchTerm) {
        //Show the loading spinner
        loader.style.display = 'block';
        searchResultsText.style.display = 'block';

        if (searchTerm) {
            const apiKey = '9a1d1802';
            const apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}&s=${searchTerm}`;

            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.Response === "True") {
                        // Hide the loading spinner after a delay (at least 0.5 seconds)
                        setTimeout(function () {
                            loader.style.display = 'none';
                        }, 500);

                        movieList.innerHTML = ''; //Clear previous search results

                        const sortedMovies = data.Search.sort((a, b) => {
                            return parseInt(b.Year) - parseInt(a.Year);
                        });

                        sortedMovies.forEach(movie => {
                            const movieCard = document.createElement('div');
                            movieCard.className = 'movie-card';
                            movieCard.setAttribute('data-imdb-id', movie.imdbID);
                        
                            if (isFavorite(movie)) {
                                movieCard.classList.add('favorite');
                            }
                        
                            movieCard.innerHTML = `
                                <img src="${movie.Poster}" alt="${movie.Title} Poster">
                                <div class="movie-info">
                                    <h2>${movie.Title}</h2>
                                    <p>Year: ${movie.Year}</p>
                                    <p>Type: ${movie.Type}</p>
                                </div>
                                <div class="favorite-icon">
                                    ${isFavorite(movie) ? '❤' : '♡'} <!-- Heart icons -->
                                </div>
                            `;
                        
                            movieCard.addEventListener('click', function () {
                                openMovieDetails(movie);
                            });
                        
                            const favoriteIcon = movieCard.querySelector('.favorite-icon');
                            favoriteIcon.addEventListener('click', function (event) {
                                event.stopPropagation(); //Prevent the click event from propagating to the movie card
                                toggleFavorite(movie);
                            });
                        
                            movieList.appendChild(movieCard);
                        });                        
                    } else {
                        //Hide the loading spinner after a delay (at least 0.5 seconds)
                        setTimeout(function () {
                            loader.style.display = 'none';
                        }, 500);

                        movieList.innerHTML = '<p>No results found.</p>';
                    }
                })
                .catch(error => {
                    //Hide the loading spinner after a delay (at least 0.5 seconds)
                    setTimeout(function () {
                        loader.style.display = 'none';
                    }, 500);

                    console.error('Error:', error);
                });
        }

        updateFavoritesTab();
    }

    function toggleFavorite(movie) {
        const index = favorites.findIndex(favorite => favorite.imdbID === movie.imdbID);
    
        if (index === -1) {
            //Movie is not in favorites, so add it
            favorites.push(movie);
        } else {
            //Movie is already in favorites, so remove it
            favorites.splice(index, 1);
        }
    
        //Update the heart icon in the movie card
        const movieCard = document.querySelector(`.movie-card[data-imdb-id="${movie.imdbID}"]`);
        const favoriteIcon = movieCard.querySelector('.favorite-icon');
        favoriteIcon.innerHTML = isFavorite(movie) ? '❤' : '♡';
    
        localStorage.setItem('favorites', JSON.stringify(favorites));
        console.log(favorites);
        //Update the favorites tab with the current favorites
        updateFavoritesTab();
    }
    
    //Function to check if a movie is in favorites
    function isFavorite(movie) {
        return favorites.some(favorite => favorite.imdbID === movie.imdbID);
    }

    function updateFavoritesTab() {
        favoritesList.innerHTML = ''; //Clear the favorites tab

        const favoritesTitle = document.createElement('h2');
        favoritesTitle.textContent = 'Favorites';

        if (favorites.length === 0) {
            //If there are no favorites, display the message
            noFavoritesMessage.style.display = 'block';
        } else {
            noFavoritesMessage.style.display = 'none';
            //If there are favorite movies, display them in a grid
            favorites.forEach(movie => {
                const movieCard = document.createElement('div');
                movieCard.className = 'movie-card';
    
                movieCard.innerHTML = `
                    <img src="${movie.Poster}" alt="${movie.Title} Poster">
                    <div class="movie-info">
                        <h2>${movie.Title}</h2>
                        <p>Year: ${movie.Year}</p>
                        <p>Type: ${movie.Type}</p>
                    </div>
                    <div class="favorite-icon" onclick="toggleFavorite(${JSON.stringify(movie)})">
                    ❤
                    </div>
                `;

                movieCard.addEventListener('click', function () {
                    openMovieDetails(movie);
                });
            
                const favoriteIcon = movieCard.querySelector('.favorite-icon');
                favoriteIcon.addEventListener('click', function (event) {
                    event.stopPropagation(); //Prevent the click event from propagating to the movie card
                    toggleFavorite(movie);
                });
    
                movieCard.classList.add('favorite');
    
                movieCard.setAttribute('data-imdb-id', movie.imdbID);
    
                favoritesList.appendChild(movieCard);
            });
        }

        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    const searchParams = new URLSearchParams(window.location.search);
    const searchQuery = searchParams.get('search');

    //Set the search input value to the retrieved search query
    searchInput.value = searchQuery;

    //If there's a search query, call the searchMovies function
    if (searchQuery) {
        searchMovies(searchQuery);
        updateFavoritesTab();
    }

    //Function to open the "Movie Details" page
    function openMovieDetails(movie) {
        localStorage.setItem('selectedMovie', JSON.stringify(movie));
        window.location.href = 'Details.html';
    }

    searchButton.addEventListener('click', function () {
        const searchTerm = searchInput.value;
        searchMovies(searchTerm);
    });
});
