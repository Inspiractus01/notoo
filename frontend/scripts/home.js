document.addEventListener("DOMContentLoaded", async () => {
  const counter = document.getElementById("plant-count");

  try {
    const res = await fetch("http://localhost:3000/plants");
    const plants = await res.json();
    const count = plants.length;

    animateCount(counter, count, 2000); // ⏱️ animácia trvá 2000 ms (2 sekundy)
  } catch (err) {
    console.error("🌱 Error fetching plant count:", err);
  }
});

/**
 * Animates a number count-up effect
 * @param {HTMLElement} element - The DOM element to update
 * @param {number} target - The final number
 * @param {number} duration - Total time in milliseconds
 */
function animateCount(element, target, duration) {
  let start = 0;
  const frameRate = 30; // ms per frame
  const steps = duration / frameRate;
  const increment = target / steps;

  const interval = setInterval(() => {
    start += increment;
    if (start >= target) {
      element.textContent = target;
      clearInterval(interval);
    } else {
      element.textContent = Math.floor(start);
    }
  }, frameRate);
}
