document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("auth-modal");
  const authButton = document.getElementById("auth-button");
  const profileAvatar = document.getElementById("profile-avatar");
  const closeModal = document.getElementById("close-modal");

  const showLoginBtn = document.getElementById("show-login");
  const showRegisterBtn = document.getElementById("show-register");

  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  const message = document.getElementById("auth-message");

  const profileModal = document.getElementById("profile-modal");
  const closeProfileModal = document.getElementById("close-profile-modal");
  const passwordForm = document.getElementById("password-form");
  const logoutButton = document.getElementById("logout-button");

  // Helper: convert avatar number to filename
  function getAvatarFile(avatarNum) {
    switch (avatarNum) {
      case 1:
        return "profile-male.png";
      case 2:
        return "profile-female.png";
      default:
        return "profile-variant1.png";
    }
  }

  // Check if user is logged in
  const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (loggedUser) {
    authButton.classList.add("hidden");
    profileAvatar.src = `assets/profile/${getAvatarFile(loggedUser.avatar)}`;
    profileAvatar.classList.remove("hidden");
  }

  // Open auth modal
  authButton.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  // Close auth modal
  closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
    message.textContent = "";
  });

  // Toggle login/register forms
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

  // Registration
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
        body: JSON.stringify({ name, password, avatar: 3 }), // default avatar
      });

      const data = await res.json();

      if (!res.ok) {
        message.textContent = data.error || "Registration failed.";
        return;
      }

      message.textContent = `Welcome, ${data.name}! Registered successfully.`;
      registerForm.reset();
    } catch (err) {
      console.error("Register error:", err);
      message.textContent = "Something went wrong.";
    }
  });

  // Login
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("login-name").value.trim();
    const password = document.getElementById("login-password").value.trim();

    if (!name || !password) {
      message.textContent = "Please fill in all fields.";
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        message.textContent = data.error || "Login failed.";
        return;
      }

      localStorage.setItem("loggedInUser", JSON.stringify(data));
      message.textContent = `Welcome back, ${data.name}!`;
      authButton.classList.add("hidden");
      profileAvatar.src = `assets/profile/${getAvatarFile(data.avatar)}`;
      profileAvatar.classList.remove("hidden");
      loginForm.reset();
      modal.classList.add("hidden");
    } catch (err) {
      console.error("Login error:", err);
      message.textContent = "Something went wrong.";
    }
  });

  // === Profile Modal ===

  // Open profile modal
  profileAvatar.addEventListener("click", () => {
    profileModal.classList.remove("hidden");
  });

  // Close profile modal
  closeProfileModal.addEventListener("click", () => {
    profileModal.classList.add("hidden");
  });

  // Change avatar
  document.querySelectorAll(".avatar-choice").forEach((img) => {
    img.addEventListener("click", async () => {
      const newAvatar = parseInt(img.dataset.avatar);
      const user = JSON.parse(localStorage.getItem("loggedInUser"));
      const res = await fetch(`http://localhost:3000/users/${user.userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: newAvatar }),
      });

      if (res.ok) {
        user.avatar = newAvatar;
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        profileAvatar.src = `assets/profile/${getAvatarFile(newAvatar)}`;
      }
    });
  });

  // Password change
  passwordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newPassword = document.getElementById("new-password").value.trim();
    if (!newPassword) return;

    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const res = await fetch(`http://localhost:3000/users/${user.userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPassword }),
    });

    if (res.ok) {
      alert("Password updated!");
      passwordForm.reset();
    }
  });

  // Logout
  logoutButton.addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    location.reload();
  });
});
