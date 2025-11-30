const allWatchlist = JSON.parse(localStorage.getItem("watchlist"))

const buildHtmlFromLocalStorage = () => {
    let html = ""
    Object.keys(allWatchlist).forEach(key => {
        const title    = allWatchlist[key].title
        const year     = allWatchlist[key].year
        const rating   = allWatchlist[key].rating
        const runtime  = allWatchlist[key].runtime
        const genre    = allWatchlist[key].genre
        const plot     = allWatchlist[key].plot
        const director = allWatchlist[key].director
        const poster   = allWatchlist[key].poster

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
            id="watchlist-btn-${key}"
            class="watchlist"
            data-title="${title}"
            data-director="${director}"
            data-year="${year}"
            data-runtime="${runtime}"
            data-genre="${genre}"
            data-rating="${rating}"
            data-plot="${plot}"
            data-poster="${poster}"
            data-id="${key}"
         >
<svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M25 50C38.8071 50 50 38.8071 50 25C50 11.1929 38.8071 0 25 0C11.1929 0 0 11.1929 0 25C0 38.8071 11.1929 50 25 50ZM15.625 21.875C13.8991 21.875 12.5 23.2741 12.5 25C12.5 26.7259 13.8991 28.125 15.625 28.125H34.375C36.1009 28.125 37.5 26.7259 37.5 25C37.5 23.2741 36.1009 21.875 34.375 21.875H15.625Z"/>
</svg>
Remove from watchlist
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

    })

    return html
}

document.getElementById("movies").innerHTML = buildHtmlFromLocalStorage()
const watchlistBtn = document.querySelectorAll(".watchlist")

for (const btn of watchlistBtn) {
    btn.addEventListener("click", (event) => {
        const id = event.target.dataset.id
        delete allWatchlist[id]
        localStorage.setItem("watchlist", JSON.stringify(allWatchlist))
        document.getElementById(`watchlist-btn-${id}`).closest(".movie").nextElementSibling.remove()
        document.getElementById(`watchlist-btn-${id}`).closest(".movie").remove()
    })
}

// Very simple search based of:
// https://github.com/LukeSmithxyz/based.cooking/pull/772
const searchInput = document.getElementById("search-movie")
const titles = document.querySelectorAll(".title h2")
searchInput.addEventListener("input", el => {
    const searchText = el.target.value.toLowerCase()

    titles.forEach(el => {
        const title = el.textContent.toLowerCase()
        const isMatch = title.includes(searchText)

        let isHidden
        if (!isMatch) isHidden = "none"
        if (isMatch) isHidden = "flex"
        el.closest(".movie").style.display = isHidden
        el.closest(".movie").nextElementSibling.style.display = isHidden
    })
})
