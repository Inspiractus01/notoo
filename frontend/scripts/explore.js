document.addEventListener("DOMContentLoaded", () => {
  const plantListEl = document.getElementById("plant-list");
  const searchInput = document.getElementById("search");

  // Fetch plants
  fetch("http://localhost:3000/plants")
    .then((res) => res.json())
    .then((plants) => {
      displayPlants(plants);

      searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        const filtered = plants.filter((plant) =>
          plant.name.toLowerCase().includes(query)
        );
        displayPlants(filtered);
      });
    })
    .catch((err) => {
      plantListEl.innerHTML = "<p>Failed to load plants 🌱</p>";
      console.error(err);
    });

  function displayPlants(plants) {
    plantListEl.innerHTML = plants
      .map(
        (plant) => `
        <div class="plant-card">
          <h3>${plant.name}</h3>
          <p><strong>Category:</strong> ${plant.category}</p>
          <p>${plant.description}</p>
        </div>`
      )
      .join("");
  }
});
