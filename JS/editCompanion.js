import { db } from './firebaseDB.js';
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Get companion ID from the URL
const params = new URLSearchParams(window.location.search);
const companionId = params.get("id");

if (companionId) {
    const companionRef = doc(db, "companions", companionId);

    // Fetch companion data
    getDoc(companionRef)
        .then((docSnap) => {
            if (docSnap.exists()) {
                const companion = docSnap.data();
                document.getElementById("companionName").value = companion.name;
                document.getElementById("animalType").value = companion.type;
                document.getElementById("age").value = companion.age;
                document.getElementById("breed").value = companion.breed;
            } else {
                console.error("No such companion!");
            }
        })
        .catch((error) => {
            console.error("Error fetching companion:", error);
        });
}

// Handle form submission
document.getElementById("editCompanionForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("companionName").value;
    const type = document.getElementById("animalType").value;
    const age = document.getElementById("age").value;
    const breed = document.getElementById("breed").value;

    if (companionId) {
        try {
            await updateDoc(doc(db, "companions", companionId), {
                name,
                type,
                age,
                breed,
            });
            alert("Companion updated successfully!");
            window.location.href = "listCompanions.html"; // Redirect back to the companion list
        } catch (error) {
            console.error("Error updating companion:", error);
        }
    }
});
