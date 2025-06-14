document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("auth-modal");
  const openBtn = document.getElementById("auth-button");
  const closeBtn = document.getElementById("close-modal");

  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const authMsg = document.getElementById("auth-message");

  document.getElementById("show-login").onclick = () => {
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
    authMsg.textContent = "";
  };

  document.getElementById("show-register").onclick = () => {
    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
    authMsg.textContent = "";
  };

  openBtn.onclick = () => modal.classList.remove("hidden");
  closeBtn.onclick = () => modal.classList.add("hidden");

  // LOGIN
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("login-name").value.trim();
    const password = document.getElementById("login-password").value;

    try {
      const res = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });
      const data = await res.json();

      if (res.ok) {
        authMsg.textContent = `Welcome, ${data.user.name}!`;
        localStorage.setItem("activeUser", JSON.stringify(data.user));
        modal.classList.add("hidden");
      } else {
        authMsg.textContent = data.error;
      }
    } catch {
      authMsg.textContent = "Login failed.";
    }
  });

  // REGISTER
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("register-name").value.trim();
    const password = document.getElementById("register-password").value;

    try {
      const res = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });
      const data = await res.json();

      if (res.ok) {
        authMsg.textContent = `User ${data.name} created. You can now log in.`;
        document.getElementById("show-login").click();
      } else {
        authMsg.textContent = data.error;
      }
    } catch {
      authMsg.textContent = "Registration failed.";
    }
  });
});
