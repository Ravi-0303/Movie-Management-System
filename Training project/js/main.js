let movies = [];
let showFavouritesOnly = false;

document.addEventListener("DOMContentLoaded", async () => {
  bindEvents();
  await loadMovies();
});

function bindEvents() {
  document.getElementById("searchInput").addEventListener("input", renderMovies);
  document.getElementById("genreFilter").addEventListener("change", renderMovies);
  document.getElementById("sortSelect").addEventListener("change", renderMovies);
  document.getElementById("addMovieBtn").addEventListener("click", () => openModal());
  document.getElementById("favouritesBtn").addEventListener("click", toggleFavouritesView);
  document.getElementById("closeModal").addEventListener("click", closeModal);
  document.getElementById("cancelBtn").addEventListener("click", closeModal);
  document.getElementById("movieForm").addEventListener("submit", saveMovie);
  document.getElementById("movieModal").addEventListener("click", e => {
    if (e.target.id === "movieModal") closeModal();
  });
}

async function loadMovies() {
  try {
    movies = await MovieService.getAll();
    populateGenres();
    renderMovies();
  } catch (error) {
    document.getElementById("movieGrid").innerHTML =
      `<div class="empty">${escapeHtml(error.message)}<br><small>Start JSON Server using the command in README.md.</small></div>`;
  }
}

function populateGenres() {
  const select = document.getElementById("genreFilter");
  const genres = [...new Set(movies.map(m => m.genre).filter(Boolean))].sort();
  select.innerHTML = '<option value="">All Genres</option>' +
    genres.map(g => `<option value="${escapeHtml(g)}">${escapeHtml(g)}</option>`).join("");
}

function renderMovies() {
  const search = document.getElementById("searchInput").value.toLowerCase().trim();
  const genre = document.getElementById("genreFilter").value;
  const sort = document.getElementById("sortSelect").value;

  let filtered = movies.filter(movie =>
    (!showFavouritesOnly || movie.favorite === true) &&
    (!search || movie.title.toLowerCase().includes(search) || movie.language.toLowerCase().includes(search)) &&
    (!genre || movie.genre === genre)
  );

  if (sort === "rating-desc") filtered.sort((a,b) => b.rating - a.rating);
  if (sort === "rating-asc") filtered.sort((a,b) => a.rating - b.rating);
  if (sort === "year-desc") filtered.sort((a,b) => b.releaseYear - a.releaseYear);
  if (sort === "year-asc") filtered.sort((a,b) => a.releaseYear - b.releaseYear);

  document.getElementById("stats").innerHTML = `
    <div class="stat"><strong>${movies.length}</strong>Total Movies</div>
    <div class="stat"><strong>${movies.filter(m => m.favorite).length}</strong>Favourites</div>
    <div class="stat"><strong>${movies.length ? (movies.reduce((s,m)=>s+Number(m.rating),0)/movies.length).toFixed(1) : "0.0"}</strong>Avg. Rating</div>
  `;

  const grid = document.getElementById("movieGrid");
  const empty = document.getElementById("emptyState");
  empty.classList.toggle("hidden", filtered.length !== 0);
  empty.textContent = showFavouritesOnly
    ? "No favourite movies yet. Click ☆ Mark Favourite on any movie to add it here."
    : "No movies found. Try another search or add a movie.";

  const favouritesBtn = document.getElementById("favouritesBtn");
  favouritesBtn.textContent = showFavouritesOnly ? "🎬 All Movies" : "⭐ Favourites";
  favouritesBtn.classList.toggle("primary", showFavouritesOnly);
  favouritesBtn.classList.toggle("secondary", !showFavouritesOnly);

  grid.innerHTML = filtered.map(movie => `
    <article class="movie-card">
      <img class="poster" src="${escapeHtml(movie.poster)}" alt="${escapeHtml(movie.title)}"
           onerror="this.src='https://placehold.co/500x750?text=No+Poster'">
      <div class="card-body">
        <span class="pill">${escapeHtml(movie.genre)}</span>
        <h3>${escapeHtml(movie.title)}</h3>
        <div class="rating">⭐ ${Number(movie.rating).toFixed(1)}</div>
        <div class="muted">${movie.releaseYear} • ${escapeHtml(movie.language)} • ${movie.duration} min</div>
        <div class="card-actions">
          <button class="primary" onclick="viewDetails('${movie.id}')">Details</button>
          <button class="secondary" onclick="editMovie('${movie.id}')">Edit</button>
          <button class="danger" onclick="deleteMovie('${movie.id}')">Delete</button>
        </div>
        <button class="secondary" style="width:100%;margin-top:8px" onclick="toggleFavourite('${movie.id}')">
          ${movie.favorite ? "★ Favourite" : "☆ Mark Favourite"}
        </button>
      </div>
    </article>
  `).join("");
}

function viewDetails(id) {
  location.href = `details.html?id=${encodeURIComponent(id)}`;
}

function openModal(movie = null) {
  document.getElementById("movieModal").classList.remove("hidden");
  document.getElementById("modalTitle").textContent = movie ? "Update Movie" : "Add Movie";
  document.getElementById("movieId").value = movie?.id || "";
  document.getElementById("title").value = movie?.title || "";
  document.getElementById("genre").value = movie?.genre || "";
  document.getElementById("language").value = movie?.language || "";
  document.getElementById("releaseYear").value = movie?.releaseYear || "";
  document.getElementById("rating").value = movie?.rating ?? "";
  document.getElementById("duration").value = movie?.duration || "";
  document.getElementById("description").value = movie?.description || "";
  document.getElementById("poster").value = movie?.poster || "";
}

function closeModal() {
  document.getElementById("movieModal").classList.add("hidden");
  document.getElementById("movieForm").reset();
}

async function saveMovie(event) {
  event.preventDefault();
  try {
    const movie = {
      title: document.getElementById("title").value.trim(),
      genre: document.getElementById("genre").value.trim(),
      language: document.getElementById("language").value.trim(),
      releaseYear: Number(document.getElementById("releaseYear").value),
      rating: Number(document.getElementById("rating").value),
      duration: Number(document.getElementById("duration").value),
      description: document.getElementById("description").value.trim(),
      poster: document.getElementById("poster").value.trim() ||
        "https://placehold.co/500x750?text=Movie+Poster",
      favorite: false
    };
    validateMovie(movie);

    const id = document.getElementById("movieId").value;
    if (id) {
      const oldMovie = movies.find(m => String(m.id) === String(id));
      movie.favorite = oldMovie?.favorite || false;
      await MovieService.update(id, { ...movie, id });
    } else {
      await MovieService.create(movie);
    }
    closeModal();
    await loadMovies();
  } catch (error) {
    alert(error.message);
  }
}

function editMovie(id) {
  const movie = movies.find(m => String(m.id) === String(id));
  if (movie) openModal(movie);
}

async function deleteMovie(id) {
  const movie = movies.find(m => String(m.id) === String(id));
  if (!movie || !confirm(`Delete "${movie.title}"?`)) return;
  try {
    await MovieService.remove(id);
    await loadMovies();
  } catch (error) {
    alert(error.message);
  }
}

async function toggleFavourite(id) {
  try {
    const movie = movies.find(m => String(m.id) === String(id));
    await MovieService.update(id, { ...movie, favorite: !movie.favorite });
    await loadMovies();
  } catch (error) {
    alert(error.message);
  }
}


function toggleFavouritesView() {
  showFavouritesOnly = !showFavouritesOnly;
  renderMovies();
}
