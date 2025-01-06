// API key: 358d3774&

let movies = [];
let movieCards = [];
let pageToShow = 1;
let amountOfPages = 1;
const movieCardDiv = document.querySelector(".movie-card-container")
const paginatorNumber = document.querySelector(".paginator-number")
const desktopSearchBar = document.querySelector(".desktop-search-bar")
const loadingMessage = document.querySelector(".loading-message")
const errorMessage = document.querySelector(".error-message")
const mobileHeader = document.querySelector(".mobile-header")
const mobileSearchBar = document.querySelector(".mobile-search-bar")
const mobileSearchBarHodler = document.querySelector(".mobile-search-bar-holder")
let currentExtraInfo = null;

//Hide error message
errorMessage.setAttribute("class", "hidden");
mobileSearchBarHodler.setAttribute("class", "hidden");

async function SearchMovies(searchQuery, apiKey, maxPages) {
    const baseUrl = `http://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(searchQuery)}&type=movie`;
    let currentPage = 1;
    const moviesFound = [];
    console.log("Searching for " + searchQuery);

    loadingMessage.setAttribute("class", "loading-message");

    try {
        while (currentPage <= maxPages) {
            // Fetch movies for the current page
            const response = await fetch(`${baseUrl}&page=${currentPage}`);
            
            // Check if the response is valid
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status}`);
            }
    
            const data = await response.json();
    
            // Ensure the response is structured as expected
            if (data.Response === "True" && data.Search && data.totalResults) {
                // Add movies to the array and include the current page
                const moviesWithPage = data.Search.map(movie => ({
                    ...movie,
                    page: currentPage, // Add the page number to each movie object
                }));
                moviesFound.push(...moviesWithPage);
    
                const totalResults = parseInt(data.totalResults, 10);
    
                // Display loading message with the number of movies and the current page
                loadingMessage.textContent = `Loading ${totalResults} movies... (Page ${currentPage})`;
    
                // Stop fetching if we've reached the end
                if (currentPage * 10 >= totalResults) break;
            } else {
                const errorMessage = data.Error || 'Unknown error occurred';
                console.error(`Error: ${errorMessage}`);
                loadingMessage.textContent = `Error: ${errorMessage}`;
                break;
            }
    
            currentPage++; // Move to the next page
        }
    
        // After fetching all pages, display the total number of movies found
        const totalMoviesFound = moviesFound.length;
        if (totalMoviesFound > 0) {
            loadingMessage.textContent = `Found ${totalMoviesFound} movies`;
        } else {
            loadingMessage.textContent = "No movies found.";
        }
    
    } catch (error) {
        // Handle any other errors, such as network errors or invalid JSON
        loadingMessage.textContent = `Network Error: ${error.message}`;
    }
    

    console.log(moviesFound);

    movies = moviesFound;
    amountOfPages = currentPage - 1;
    pageToShow = 1;
    ShowPage();
    ChangePaginatorNumber();
}


function ShowPage() {
    // Delete existing movie cards
    for (let i = 0; i < movieCards.length; i++) {
        movieCards[i][0].remove(); // Remove the DOM element (first element in the array)
    }
    movieCards = []; // Clear the movieCards array

    // Create new movie cards
    for (let i = 0; i < movies.length; i++) {
        if (movies[i].page === pageToShow) {
            const movieCardElement = CreateMovieCard(movies[i]);
            const movieCard = [movieCardElement, movies[i]];
            movieCardElement.addEventListener("click", () => ExpandForMoreInfo(movies[i], movieCardElement));


            // Add the pair to movieCards array
            movieCards.push(movieCard);

            // Append the DOM element to the container
            movieCardDiv.appendChild(movieCard[0]);
        }
    }
}


function CreateMovieCard(movieToDisplay) {
    // Create the main movie card container
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');

    // Add the movie image
    const movieImage = document.createElement('img');
    movieImage.src = movieToDisplay.Poster;
    movieImage.classList.add('movie-image');
    movieImage.alt = movieToDisplay.Title + " movie poster";
    movieCard.appendChild(movieImage);

    // Create the movie card content container
    const movieCardContent = document.createElement('div');
    movieCardContent.classList.add('movie-card-content');

    // Add the movie title
    const movieTitle = document.createElement('h2');
    movieTitle.textContent = movieToDisplay.Title;
    movieCardContent.appendChild(movieTitle);

    // Add year and type
    const movieYearAndType = document.createElement('p');
    movieYearAndType.classList.add('movie-info');
    movieYearAndType.textContent = movieToDisplay.Year + " - " + movieToDisplay.Type;
    movieCardContent.appendChild(movieYearAndType);

    // Append the content to the card
    movieCard.appendChild(movieCardContent);

    // Add the mobile bookmark image
    /*
    const mobileBookmarkButton = document.createElement('img');
    mobileBookmarkButton.src = './images/icons/bookmark.png';
    mobileBookmarkButton.classList.add('mobile-bookmark-button');
    mobileBookmarkButton.alt = 'Bookmark';
    movieCard.appendChild(mobileBookmarkButton);

    // Add the bookmark button
    const bookmarkButton = document.createElement('button');
    bookmarkButton.classList.add('bookmark-button');
    const buttonImage = document.createElement('img');
    buttonImage.src = './images/icons/bookmark.png';
    buttonImage.classList.add('button-image');
    buttonImage.alt = 'Bookmark Button';
    bookmarkButton.appendChild(buttonImage);
    movieCard.appendChild(bookmarkButton);
    */

    // Return the constructed movie card
    return movieCard;
}

async function ExpandForMoreInfo(movie, movieCardElement) {
    console.log("You clicked " + movie.Title)
    if (currentExtraInfo != null) {
        currentExtraInfo.remove();
    }

    //Add loading text
    const loadingText = document.createElement('p');
    const movieCardContent = movieCardElement.querySelector(".movie-card-content");

    loadingText.classList.add('movie-info');
    loadingText.textContent = " Loading...";
    movieCardContent.appendChild(loadingText);

    //Get info
    const url = 'http://www.omdbapi.com/?apikey=358d3774&&i=' + movie.imdbID;
    console.log(url);
    let movieInfo = null;



    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            movieInfo = data;
            loadingText.remove();

            //Create extra info on card
            const extraInfo = document.createElement('div');
            extraInfo.classList.add('extra-info');
            movieCardContent.appendChild(extraInfo);

            //Genre
            const genreText = document.createElement('p');
            genreText.textContent = "Genre: " + movieInfo.Genre;
            genreText.classList.add('movie-info');
            extraInfo.appendChild(genreText);

            extraInfo.appendChild(document.createElement('br'));

            //Director
            const directorText = document.createElement('p');
            directorText.textContent = "Director: " + movieInfo.Director;
            directorText.classList.add('movie-info');
            extraInfo.appendChild(directorText);

            //Writers
            const writersText = document.createElement('p');
            writersText.textContent = "Writer(s): " + movieInfo.Writer;
            writersText.classList.add('movie-info');
            extraInfo.appendChild(writersText);

            //Actors
            const actorText = document.createElement('p');
            actorText.textContent = "Actors: " + movieInfo.Actors;
            actorText.classList.add('movie-info');
            extraInfo.appendChild(actorText);

            extraInfo.appendChild(document.createElement('br'));

            //Country
            const countryText = document.createElement('p');
            countryText.textContent = "Country: " + movieInfo.Country;
            countryText.classList.add('movie-info');
            extraInfo.appendChild(countryText);

            //Language
            const languageText = document.createElement('p');
            languageText.textContent = "Language: " + movieInfo.Language;
            languageText.classList.add('movie-info');
            extraInfo.appendChild(languageText);

            extraInfo.appendChild(document.createElement('br'));

            //Plot
            const plotText = document.createElement('p');
            plotText.textContent = "Plot summary: " + movieInfo.Plot;
            plotText.classList.add('movie-info');
            plotText.classList.add('extra-info-overflow');
            extraInfo.appendChild(plotText);

            currentExtraInfo = extraInfo;


        } else {
            const errorText = document.createElement('p');
            errorText.classList.add('movie-info');
            errorText.textContent = `Failed to fetch data. Status code: ${response.status}`;
            movieCardContent.appendChild(errorText);

        }
    } catch (error) {
        console.error(error);
        const errorText = document.createElement('p');
        errorText.classList.add('movie-info');
        errorText.textContent = error.message;
        movieCardContent.appendChild(errorText);
    }


}

SearchMovies("Batman", "358d3774&", 50);

//!Paginator

function ChangePage(numToAdd) {
    pageToShow += numToAdd;

    if (pageToShow < 1) {
        pageToShow = 1;
    }
    else if (pageToShow > amountOfPages) {
        pageToShow = amountOfPages;
    }
    else {
        ShowPage();
    }
    ChangePaginatorNumber();
}

function GoToFirstPage() {
    if (pageToShow != 1) {
        pageToShow = 1;
        ShowPage();
    }
    ChangePaginatorNumber();
}

function GoToLastPage() {
    if (pageToShow != amountOfPages) {
        pageToShow = amountOfPages;
        ShowPage();
    }
    ChangePaginatorNumber();
}

function ChangePaginatorNumber() {
    paginatorNumber.textContent = pageToShow + " / " + amountOfPages;
}

function DesktopSearchButtonPressed() {

    SearchMovies(desktopSearchBar.value, "358d3774&", 50);
}

function OpenSearchField() {
    mobileHeader.setAttribute("class", "hidden");
    mobileSearchBarHodler.setAttribute("class", "mobile-search-bar-holder");
}

function MobileSearch() {
    SearchMovies(mobileSearchBar.value, "358d3774&", 50);
    mobileHeader.setAttribute("class", "mobile-header");
    mobileSearchBarHodler.setAttribute("class", "hidden");
}