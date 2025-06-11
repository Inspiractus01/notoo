const searchInput = document.getElementById("search-input");
const plantList = document.getElementById("plant-list");
let allPlants = [];

fetch("http://localhost:3000/plants")
  .then((res) => res.json())
  .then((data) => {
    allPlants = data;
    renderPlants(allPlants);
  })
  .catch((err) => {
    console.error("Error fetching plants:", err);
    plantList.innerHTML = "<p>Failed to load plants.</p>";
  });

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const filtered = allPlants.filter((plant) =>
    plant.name.toLowerCase().includes(query)
  );
  renderPlants(filtered);
});

function renderPlants(plants) {
  if (plants.length === 0) {
    plantList.innerHTML = "<p>No plants found.</p>";
    return;
  }

  plantList.innerHTML = plants
    .map(
      (plant) => `
    <div class="plant-card">
      <h3>${plant.name}</h3>
      <p>${plant.description}</p>
      ${
        plant.image
          ? `<img src="${plant.image}" alt="${plant.name}" />`
          : `<div class="no-image">No image</div>`
      }
    </div>
  `
    )
    .join("");
}
