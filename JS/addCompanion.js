import { addCompanion } from './firebaseDB.js';

// Handle form submission
const form = document.getElementById("addCompanionForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("companionName").value;
  const type = document.getElementById("animalType").value;
  const age = document.getElementById("age").value;
  const breed = document.getElementById("breed").value;

  try {
    // Call the addCompanion function
    await addCompanion(name, type, age, breed);
    alert("Companion added successfully!");
    form.reset(); // Clear the form after successful submission
    window.location.href = "start.html"; // Redirect back to the main page
  } catch (error) {
    console.error("Error adding companion:", error);
    alert("Failed to add companion.");
  }
});
