import { db } from './firebaseDB.js';
import { collection, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const appointmentsList = document.getElementById("appointmentsList");
let deleteId = null;

// Initialize Materialize Modal
document.addEventListener("DOMContentLoaded", function () {
    const modals = document.querySelectorAll(".modal");
    M.Modal.init(modals);
    console.log("Modals initialized:", modals); // Debug log
});

// Fetch Appointments
async function fetchAppointments() {
    appointmentsList.innerHTML = "<li class='collection-item'>Loading...</li>";
    try {
        const querySnapshot = await getDocs(collection(db, "appointments"));
        appointmentsList.innerHTML = "";

        querySnapshot.forEach((doc) => {
            const appointment = doc.data();
            console.log("Appointment data:", appointment); // Debug each record

            const appointmentItem = document.createElement("li");
            appointmentItem.classList.add("collection-item");
            appointmentItem.innerHTML = `
                <span><strong>Pet Name:</strong> ${appointment.petName} | <strong>Activity:</strong> ${appointment.activity} | <strong>Date:</strong> ${appointment.date.toDate().toLocaleString()}</span>
                <button class="btn-small green edit-btn" data-id="${doc.id}">Edit</button>
                <button class="btn-small red delete-btn" data-id="${doc.id}">Delete</button>
            `;
            appointmentsList.appendChild(appointmentItem);
        });

        document.querySelectorAll(".edit-btn").forEach((button) =>
            button.addEventListener("click", editAppointment)
        );
        document.querySelectorAll(".delete-btn").forEach((button) =>
            button.addEventListener("click", deleteAppointment)
        );
    } catch (error) {
        console.error("Error fetching appointments:", error);
        appointmentsList.innerHTML = "<li class='collection-item'>Failed to load appointments.</li>";
    }
}

// Edit Appointment
function editAppointment(event) {
    const appointmentId = event.target.dataset.id;
    console.log("Editing appointment with ID:", appointmentId); // Debug log
    window.location.href = `editAppointment.html?id=${appointmentId}`; // Navigate to edit form
}


// Delete Appointment
function deleteAppointment(event) {
    deleteId = event.target.dataset.id;
    console.log("Delete ID set to:", deleteId); // Debug log

    const modal = M.Modal.getInstance(document.getElementById("confirmModal"));
    if (modal) {
        modal.open();
    } else {
        console.error("Modal instance not available.");
    }
}

// Confirm Delete
document.getElementById("confirmBtn").addEventListener("click", async () => {
    if (deleteId) {
        try {
            await deleteDoc(doc(db, "appointments", deleteId));
            alert("Appointment deleted successfully!");
            const modal = M.Modal.getInstance(document.getElementById("confirmModal"));
            modal.close(); // Close the modal after successful deletion
            fetchAppointments(); // Refresh the list
            deleteId = null;
        } catch (error) {
            console.error("Error deleting appointment:", error);
            alert("Failed to delete appointment.");
        }
    }
});


// Cancel Delete
document.getElementById("cancelBtn").addEventListener("click", () => {
    deleteId = null; // Reset ID
});

// Initialize
fetchAppointments();
