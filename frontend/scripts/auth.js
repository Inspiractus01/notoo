document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("auth-modal");
  const authButton = document.getElementById("auth-button");
  const profileAvatar = document.getElementById("profile-avatar");
  const userNameSpan = document.getElementById("user-name");
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
  const loggedUserText = document.getElementById("logged-user-text");

  const profilePath = window.location.pathname.includes("/pages/")
    ? "../../assets/profile"
    : "assets/profile";

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

  // If user is logged in, show profile
  const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (loggedUser) {
    authButton.classList.add("hidden");
    profileAvatar.src = `${profilePath}/${getAvatarFile(loggedUser.avatar)}`;
    profileAvatar.classList.remove("hidden");
    userNameSpan.textContent = loggedUser.name;
    userNameSpan.classList.remove("hidden");
    if (loggedUserText) {
      loggedUserText.textContent = `You are logged in as ${loggedUser.name}`;
    }
  }

  // Modal toggles
  authButton.addEventListener("click", () => modal.classList.remove("hidden"));
  closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
    message.textContent = "";
  });

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

  // Register
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
        body: JSON.stringify({ name, password, avatar: 3 }),
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
      profileAvatar.src = `${profilePath}/${getAvatarFile(data.avatar)}`;
      profileAvatar.classList.remove("hidden");
      userNameSpan.textContent = data.name;
      userNameSpan.classList.remove("hidden");
      if (loggedUserText) {
        loggedUserText.textContent = `You are logged in as ${data.name}`;
      }
      loginForm.reset();
      modal.classList.add("hidden");
    } catch (err) {
      console.error("Login error:", err);
      message.textContent = "Something went wrong.";
    }
  });

  // Profile modal toggle
  profileAvatar.addEventListener("click", () => {
    profileModal.classList.remove("hidden");
  });
  closeProfileModal.addEventListener("click", () => {
    profileModal.classList.add("hidden");
  });
  // Open profile modal when clicking on username
  userNameSpan.addEventListener("click", () => {
    profileModal.classList.remove("hidden");
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
        profileAvatar.src = `${profilePath}/${getAvatarFile(newAvatar)}`;
      }
    });
  });

  // Change password
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
