document.addEventListener("DOMContentLoaded", () => {
  if (AuthService.isLoggedIn()) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const errorBox = document.getElementById("loginError");

    errorBox.classList.add("hidden");
    errorBox.textContent = "";

    try {
      await AuthService.login(username, password);
      window.location.href = "index.html";
    } catch (error) {
      errorBox.textContent = error.message;
      errorBox.classList.remove("hidden");
    }
  });
});
