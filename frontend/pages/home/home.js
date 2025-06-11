// Select elements
const plantCountEl = document.getElementById("plant-count");
const randomImageEl = document.getElementById("random-image");

// Set random image
const randomImage = images[Math.floor(Math.random() * images.length)];
randomImageEl.src = randomImage;

// Fetch plant count from backend
fetch("http://localhost:3000/plants")
  .then((res) => res.json())
  .then((data) => {
    plantCountEl.textContent = data.length;
  })
  .catch((err) => {
    console.error("Error fetching plant count:", err);
    plantCountEl.textContent = "?";
  });
