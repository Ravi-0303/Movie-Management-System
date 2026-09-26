const AuthService = {
  async login(username, password) {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/users?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    );

    if (!response.ok) {
      throw new ApiException("Unable to connect to login service.");
    }

    const users = await response.json();

    if (users.length === 0) {
      throw new ValidationException("Invalid username or password.");
    }

    const user = users[0];
    localStorage.setItem("loggedInUser", JSON.stringify({
      id: user.id,
      username: user.username,
      name: user.name
    }));

    return user;
  },


  async register(name, username, password) {
    const existingResponse = await fetch(
      `${API_CONFIG.BASE_URL}/users?username=${encodeURIComponent(username)}`
    );

    if (!existingResponse.ok) {
      throw new ApiException("Unable to connect to registration service.");
    }

    const existingUsers = await existingResponse.json();
    if (existingUsers.length > 0) {
      throw new ValidationException("Username already exists. Please choose another username.");
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, username, password })
    });

    if (!response.ok) {
      throw new ApiException("Unable to create the account.");
    }

    return response.json();
  },

  logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
  },

  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem("loggedInUser"));
    } catch {
      return null;
    }
  },

  isLoggedIn() {
    return !!this.getCurrentUser();
  },

  requireLogin() {
    if (!this.isLoggedIn()) {
      window.location.href = "login.html";
      return false;
    }
    return true;
  }
};
