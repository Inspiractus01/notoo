document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("auth-modal");
  const authButton = document.getElementById("auth-button");
  const closeModal = document.getElementById("close-modal");

  const showLoginBtn = document.getElementById("show-login");
  const showRegisterBtn = document.getElementById("show-register");

  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  const message = document.getElementById("auth-message");

  // Open modal
  authButton.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  // Close modal
  closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
    message.textContent = "";
  });

  // Toggle login/register
  showLoginBtn.addEventListener("click", () => {
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
    message.textContent = "";
  });

  showRegisterBtn.addEventListener("click", () => {
    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");
    message.textContent = "";
  });

  // Handle registration
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("register-name").value.trim();
    const password = document.getElementById("register-password").value.trim();

    if (!name || !password) {
      message.textContent = "Please fill in all fields.";
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      if (!res.ok) {
        const error = await res.json();
        message.textContent = error.error || "Registration failed.";
        return;
      }

      const data = await res.json();
      message.textContent = `Welcome, ${data.name}! Registered successfully.`;
      registerForm.reset();
    } catch (err) {
      console.error("Register error:", err);
      message.textContent = "Something went wrong.";
    }
  });
});
