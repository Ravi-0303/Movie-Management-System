function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function validateMovie(movie) {
  if (!movie.title || !movie.genre || !movie.language) {
    throw new ValidationException("Title, genre and language are required.");
  }
  if (movie.rating < 0 || movie.rating > 10) {
    throw new ValidationException("Rating must be between 0 and 10.");
  }
  if (movie.duration <= 0) {
    throw new ValidationException("Duration must be greater than 0.");
  }
}
