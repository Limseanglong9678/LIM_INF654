import { db } from './firebaseDB.js';
import { collection, addDoc, Timestamp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Handle form submission for adding a new appointment
document.getElementById("addAppointmentForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const petName = document.getElementById("petName").value;
    const activity = document.getElementById("activity").value;
    const date = document.getElementById("date").value;

    try {
        // Add a new document to the appointments collection
        await addDoc(collection(db, "appointments"), {
            petName,
            activity,
            date: Timestamp.fromDate(new Date(date)), // Convert to Firestore Timestamp
        });
        alert("Appointment added successfully!");
        window.location.href = "start.html"; // Redirect to the main page or appointments list
    } catch (error) {
        console.error("Error adding appointment:", error);
        alert("Failed to add appointment. Please try again.");
    }
});
