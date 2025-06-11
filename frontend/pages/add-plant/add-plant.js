document
  .getElementById("add-plant-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = document.getElementById("add-plant-form");
    const formData = new FormData(form);

    try {
      const response = await fetch("http://localhost:3000/plants", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("✅ Plant added successfully!");
        form.reset();
      } else {
        const data = await response.json();
        alert(" Error: " + data.error);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Something went wrong.");
    }
  });
