// API key: 358d3774&

let movies = [];
let movieCards = [];
let pageToShow = 1;
let amountOfPages = 1;
const movieCardDiv = document.querySelector(".movie-card-container")

async function SearchMovies(searchQuery, apiKey, maxPages) {
    const baseUrl = `http://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(searchQuery)}&type=movie`;
    let currentPage = 1;
    const moviesFound = [];

    try {
        while (currentPage <= maxPages) {
            // Fetch movies for the current page
            const response = await fetch(`${baseUrl}&page=${currentPage}`);
            const data = await response.json();

            if (data.Response === "True") {
                // Add movies to the array and include the current page
                const moviesWithPage = data.Search.map(movie => ({
                    ...movie,
                    page: currentPage, // Add the page number to each movie object
                }));
                moviesFound.push(...moviesWithPage);

                // Check if there are more pages; stop if totalResults < current page
                const totalResults = parseInt(data.totalResults, 10);
                if (currentPage * 10 >= totalResults) break;
            } else {
                console.error(`Error: ${data.Error}`);
                break;
            }

            currentPage++; // Move to the next page
        }
    } catch (error) {
        console.error("Network Error:", error);
    }

    console.log(moviesFound);

    movies = moviesFound;
    amountOfPages = currentPage - 1;

    ShowPage();
}

function ShowPage() {
    //Delete movie cards
    for (let i = 0; i < movieCards.length; i++) {
        movieCards[i].remove();
    }
    movieCards = [];

    //Create new movie cards
    for (let i = 0; i < movies.length; i++) {
        if (movies[i].page == pageToShow) {
            movieCard = CreateMovieCard(movies[i]);
            movieCards.push(movieCard);
            movieCardDiv.appendChild(movieCard);
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

    // Return the constructed movie card
    return movieCard;
}

SearchMovies("Batman", "358d3774&", 5);

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
}

function GoToFirstPage() {
    if (pageToShow != 1) {
        pageToShow = 1;
        ShowPage();
    }
}

function GoToLastPage() {
    if (pageToShow != amountOfPages) {
        pageToShow = amountOfPages;
        ShowPage();
    }
}