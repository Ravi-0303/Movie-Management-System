const MovieService = {
  async getAll() {
    const response = await fetch(`${API_CONFIG.BASE_URL}/movies`);
    if (!response.ok) throw new ApiException("Unable to load movies.");
    return response.json();
  },

  async getById(id) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/movies/${encodeURIComponent(id)}`);
    if (response.status === 404) return null;
    if (!response.ok) throw new ApiException("Unable to load movie details.");
    return response.json();
  },

  async create(movie) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/movies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(movie)
    });
    if (!response.ok) throw new ApiException("Unable to add movie.");
    return response.json();
  },

  async update(id, movie) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/movies/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(movie)
    });
    if (!response.ok) throw new ApiException("Unable to update movie.");
    return response.json();
  },

  async remove(id) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/movies/${encodeURIComponent(id)}`, {
      method: "DELETE"
    });
    if (!response.ok) throw new ApiException("Unable to delete movie.");
    return true;
  }
};
