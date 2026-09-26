document.addEventListener("DOMContentLoaded", () => {
  if (AuthService.isLoggedIn()) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("registerForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const errorBox = document.getElementById("registerError");

    errorBox.classList.add("hidden");
    errorBox.textContent = "";

    if (password !== confirmPassword) {
      errorBox.textContent = "Passwords do not match.";
      errorBox.classList.remove("hidden");
      return;
    }

    try {
      await AuthService.register(name, username, password);
      window.location.href = "login.html?registered=true";
    } catch (error) {
      errorBox.textContent = error.message;
      errorBox.classList.remove("hidden");
    }
  });
});
