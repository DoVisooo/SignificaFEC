document.addEventListener('DOMContentLoaded', function () {
    const movieImage = document.getElementById('movieImage');
    const movieTitle = document.getElementById('movieTitle');
    const movieYear = document.getElementById('movieYear');
    const movieType = document.getElementById('movieType');
    const moviePlot = document.getElementById('moviePlot');
    const searchMovieInput = document.getElementById('searchInput');
    const searchMovieButton = document.getElementById('searchButton');
    const favoriteButton = document.getElementById('favoriteButton');

    //Retrieve movie data from local storage
    const selectedMovie = JSON.parse(localStorage.getItem('selectedMovie'));
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (selectedMovie) {
        const { Title, Year, Type, Poster, imdbID } = selectedMovie; //Extract the movie ID

        let checkFav = false;

        if (checkFav == false) {
            favoriteButton.innerHTML = isFavorite(selectedMovie) ? '❤' : '♡';
            checkFav = true;
        }

        //Set movie details
        movieImage.src = Poster;
        movieTitle.textContent = Title;
        movieYear.textContent = `Year: ${Year}`;
        movieType.textContent = `Type: ${Type}`;

        //Check if the movie ID is available
        if (imdbID) {
            //Make a new API request to get detailed movie information, including the plot
            const apiKey = '9a1d1802';
            const apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}&plot=full`;

            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.Response === "True" && data.Plot) {
                        moviePlot.textContent = `Plot: ${data.Plot}`;
                    } else {
                        moviePlot.textContent = "Plot information not available.";
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    moviePlot.textContent = "Failed to retrieve plot information.";
                });
        } else {
            moviePlot.textContent = "Plot information not available.";
        }

        favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    } else {
        //No movie data is found in local storage
    }

    function searchMoviesFromDetails() {
        const searchTerm = searchMovieInput.value;
        if (searchTerm) {
            //Redirect to the homepage with the search query as a parameter
            window.location.href = `Homepage.html?search=${searchTerm}`;
        }
    }
    
    searchMovieButton.addEventListener('click', searchMoviesFromDetails);

    function isFavorite(movie) {
        return favorites.some(favorite => favorite.imdbID === movie.imdbID);
    }

    //Function to toggle favorite status of a movie
    function toggleFavorite(movie) {
        const index = favorites.findIndex(favorite => favorite.imdbID === movie.imdbID);
    
        if (index === -1) {
            //Movie is not in favorites, so add it
            favorites.push(movie);
        } else {
            //Movie is already in favorites, so remove it
            favorites.splice(index, 1);
        }
        
        favoriteButton.innerHTML = isFavorite(selectedMovie) ? '❤' : '♡';
        localStorage.setItem('favorites', JSON.stringify(favorites));
        console.log(favorites);
    }

    favoriteButton.addEventListener('click', function () {
        toggleFavorite(selectedMovie);
    });
});
