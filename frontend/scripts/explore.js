document.addEventListener("DOMContentLoaded", () => {
  const plantListEl = document.getElementById("plant-list");
  const searchInput = document.getElementById("search");
  let allPlants = [];

  fetch("http://localhost:3000/plants")
    .then((res) => res.json())
    .then((plants) => {
      allPlants = plants;
      renderPlants(plants);

      searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase().trim();
        const filtered = allPlants.filter((plant) =>
          plant.name.toLowerCase().includes(query)
        );
        fadeOutAndRender(filtered);
      });
    });

  function fadeOutAndRender(plants) {
    plantListEl.classList.add("hidden");

    setTimeout(() => {
      renderPlants(plants);
      plantListEl.classList.remove("hidden");
    }, 300); // match transition duration
  }

  function renderPlants(plants) {
    plantListEl.innerHTML = "";

    if (plants.length === 0) {
      plantListEl.innerHTML = "<p>No plants found 🌱</p>";
      return;
    }

    plants.forEach((plant, index) => {
      const card = document.createElement("div");
      card.className = "plant-card fade-in";
      card.innerHTML = `
        <h3>${plant.name}</h3>
        <p><strong>Category:</strong> ${plant.category}</p>
        <p>${plant.description}</p>
      `;
      card.style.animationDelay = `${index * 50}ms`; // pekný nábeh
      plantListEl.appendChild(card);
    });
  }
});
