// API key: 358d3774&

async function SearchMovies(searchQuery, apiKey, maxPages) {
    const baseUrl = `http://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(searchQuery)}&type=movie`;
    let currentPage = 1;
    const allMovies = []; // Array to store movie objects

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
                allMovies.push(...moviesWithPage);

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

    return allMovies; // Return the array of movie objects
}

console.log(SearchMovies("batman", "358d3774&", 2));