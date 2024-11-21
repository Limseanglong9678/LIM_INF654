import { db } from './firebaseDB.js';
import { doc, getDoc, updateDoc, Timestamp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Get the appointment ID from the URL
const params = new URLSearchParams(window.location.search);
const appointmentId = params.get("id");

if (appointmentId) {
    const appointmentRef = doc(db, "appointments", appointmentId);

    // Fetch appointment data
    getDoc(appointmentRef)
        .then((docSnap) => {
            if (docSnap.exists()) {
                const appointment = docSnap.data();
                // Pre-fill the form
                document.getElementById("petName").value = appointment.petName;
                document.getElementById("activity").value = appointment.activity;
                document.getElementById("date").value = appointment.date
                    .toDate()
                    .toISOString()
                    .slice(0, 16); // Format for datetime-local
            } else {
                console.error("No such document!");
            }
        })
        .catch((error) => {
            console.error("Error fetching appointment:", error);
        });
}

// Handle form submission for updating
document.getElementById("appointmentForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const petName = document.getElementById("petName").value;
    const activity = document.getElementById("activity").value;
    const date = document.getElementById("date").value;

    if (appointmentId) {
        try {
            await updateDoc(doc(db, "appointments", appointmentId), {
                petName,
                activity,
                date: Timestamp.fromDate(new Date(date)), // Convert to Firestore Timestamp
            });
            alert("Appointment updated successfully!");
            window.location.href = "start.html"; // Redirect back to the appointments list
        } catch (error) {
            console.error("Error updating appointment:", error);
        }
    }
});
