const url = "https://www.omdbapi.com"
const apiKey = "41e6179a"
const searchInput = document.getElementById("search-movie")
const seatchBtn = document.getElementById("search-btn")
if (!localStorage.getItem("watchlist")) {
    localStorage.setItem("watchlist", "{}")
}

const removeFromWatchlist = `
<svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M25 50C38.8071 50 50 38.8071 50 25C50 11.1929 38.8071 0 25 0C11.1929 0 0 11.1929 0 25C0 38.8071 11.1929 50 25 50ZM15.625 21.875C13.8991 21.875 12.5 23.2741 12.5 25C12.5 26.7259 13.8991 28.125 15.625 28.125H34.375C36.1009 28.125 37.5 26.7259 37.5 25C37.5 23.2741 36.1009 21.875 34.375 21.875H15.625Z"/>
</svg>
Remove from watchlist
`

const addToWatchlist = `
<svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M25 50C38.8071 50 50 38.8071 50 25C50 11.1929 38.8071 0 25 0C11.1929 0 0 11.1929 0 25C0 38.8071 11.1929 50 25 50ZM28.125 15.625C28.125 13.8991 26.7259 12.5 25 12.5C23.2741 12.5 21.875 13.8991 21.875 15.625V21.875H15.625C13.8991 21.875 12.5 23.2741 12.5 25C12.5 26.7259 13.8991 28.125 15.625 28.125H21.875V34.375C21.875 36.1009 23.2741 37.5 25 37.5C26.7259 37.5 28.125 36.1009 28.125 34.375V28.125H34.375C36.1009 28.125 37.5 26.7259 37.5 25C37.5 23.2741 36.1009 21.875 34.375 21.875H28.125V15.625Z"/>
</svg>
Add to watchlist
`

let previousSearch = ""
const getSearchResults = async () => {
    if (searchInput.value === "" || !searchInput.value) return
    if (previousSearch === searchInput.value) return
    previousSearch = searchInput.value

    let url_params = new URLSearchParams({
        apikey: apiKey,
        s: searchInput.value,
        type: "movie"
    })
    const response = await fetch(`${url}/?${url_params}`)
    if (!response.ok) {
        console.error(`Response status ${response.status}`)
        return
    }
    const data = await response.json()
    document.getElementById("movies").innerHTML = await buildHtmlFromSearch(data.Search)
    const watchlistBtn = document.querySelectorAll(".watchlist")

    for (const btn of watchlistBtn) {
        btn.addEventListener("click", (event) => {
            const allWatchlist = JSON.parse(localStorage.getItem("watchlist"))
            const id = event.target.dataset.id
            const watchlistBtn = document.getElementById(`watchlist-btn-${id}`)

            if (!allWatchlist[id]) {
                watchlistBtn.innerHTML = removeFromWatchlist
                const movieData = {
                    title: event.target.dataset.title,
                    year: event.target.dataset.year,
                    rating: event.target.dataset.rating,
                    runtime: event.target.dataset.runtime,
                    genre: event.target.dataset.genre,
                    plot: event.target.dataset.plot,
                    director: event.target.dataset.director,
                    poster: event.target.dataset.poster,
                }
                allWatchlist[id] = movieData
                localStorage.setItem("watchlist", JSON.stringify(allWatchlist))
            } else if (allWatchlist[id]) {
                delete allWatchlist[id]
                localStorage.setItem("watchlist", JSON.stringify(allWatchlist))
                watchlistBtn.innerHTML = addToWatchlist
            }
        })
    }

}

const buildHtmlFromSearch = async (movies) => {
    let html = ""
    for (const movie of movies) {
        let url_params = new URLSearchParams({
            apikey: apiKey,
            i: movie.imdbID
        })
        const response = await fetch(`${url}/?${url_params}`)
        if (!response.ok) {
            console.error(`Response status ${response.status}`)
            return
        }

        const data     = await response.json()
        const title    = data.Title
        const year     = data.Year
        const rating   = data.imdbRating
        const runtime  = data.Runtime
        const genre    = data.Genre
        const plot     = data.Plot
        const director = data.Director
        const poster   = data.Poster
        const id       = data.imdbID

        const allWatchlist = JSON.parse(localStorage.getItem("watchlist"))
        let watchlistBtn = ""
        if (allWatchlist[id]) {
            watchlistBtn = removeFromWatchlist
        } else watchlistBtn = addToWatchlist

        html += `
 <div class="movie">
     <div class="poster">
         <img src=${poster} alt="Poster for movie ${title}">
     </div>
     <div class="info">
         <div class="title">
             <h2>${title}</h2>
         </div>
         <div class="director">
             <p>Directed by ${director}</p>
         </div>
         <div class="rating">
             <p>⭐ ${rating}</p>
             <p>${year}</p>
         </div>
         <div>
             <button
                id="watchlist-btn-${id}"
                class="watchlist"
                data-title="${title}"
                data-director="${director}"
                data-year="${year}"
                data-runtime="${runtime}"
                data-genre="${genre}"
                data-rating="${rating}"
                data-plot="${plot}"
                data-poster="${poster}"
                data-id="${id}"
             >
            ${watchlistBtn}
            </button>
         </div>
         <div class="runtime">
             <p>${runtime}</p>
             <p>${genre}</p>
         </div>
         <div class="plot">
             <p>${plot}</p>
         </div>
     </div>
 </div>
<hr>
         `
    }

    return html
}

seatchBtn.addEventListener("click", getSearchResults)
searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        getSearchResults()
    }
})
