import { db } from './firebaseDB.js'; // Remove unused `deleteAppointment` import
import { collection, deleteDoc, doc, getDocs } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const companionsList = document.getElementById("companionsList");
let deleteId = null; // To track the ID of the companion being deleted

async function fetchCompanions() {
    companionsList.innerHTML = ''; // Clear the list before appending new items
    try {
        const companionsSnapshot = await getDocs(collection(db, "companions"));
        companionsSnapshot.forEach((doc) => {
            const companion = doc.data();
            const listItem = document.createElement("li");
            listItem.className = "collection-item";
            listItem.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span><strong>${companion.name}</strong> - ${companion.breed} - ${companion.type} - ${companion.age} years old</span>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn-small green edit-btn" data-id="${doc.id}">Edit</button>
                        <button class="btn-small red delete-btn" data-id="${doc.id}">Delete</button>
                    </div>
                </div>
            `;
            companionsList.appendChild(listItem);
        });
        document.querySelectorAll(".edit-btn").forEach((button) =>
            button.addEventListener("click", editCompanion)
        );
        document.querySelectorAll(".delete-btn").forEach((button) =>
            button.addEventListener("click", confirmDelete)
        );
    } catch (error) {
        console.error("Error fetching companions:", error);
    }
}

function editCompanion(event) {
    const companionId = event.target.dataset.id;
    console.log("Editing companion with ID:", companionId);
    window.location.href = `editCompanion.html?id=${companionId}`; // Navigate to edit form
}

function confirmDelete(event) {
    deleteId = event.target.dataset.id; // Set the ID of the companion to delete
    console.log("Delete button clicked. ID to delete:", deleteId); // Debug log

    const modal = M.Modal.getInstance(document.getElementById("confirmModal")); // Get modal instance
    if (modal) {
        modal.open(); // Open the confirmation modal
    } else {
        console.error("Modal instance not available."); // Debug log if modal fails
    }
}

// Confirm Deletion
document.getElementById("confirmBtn").addEventListener("click", async () => {
    if (deleteId) {
        console.log("Deleting companion with ID:", deleteId); // Debug log
        try {
            await deleteDoc(doc(db, "companions", deleteId)); // Delete the companion from Firestore
            console.log("Companion deleted successfully."); // Debug log
            alert("Companion deleted successfully!");
            const modal = M.Modal.getInstance(document.getElementById("confirmModal"));
            modal.close(); // Close the modal after successful deletion
            fetchCompanions(); // Refresh the list
            deleteId = null; // Reset deleteId
        } catch (error) {
            console.error("Error deleting companion:", error); // Debug log
            alert("Failed to delete companion.");
        }
    }
});


// Cancel Deletion
document.getElementById("cancelBtn").addEventListener("click", () => {
    deleteId = null; // Reset deleteId
});

// Initialize Materialize modal and load companions
document.addEventListener("DOMContentLoaded", () => {
    const modals = document.querySelectorAll('.modal');
    M.Modal.init(modals); // Initialize all modals
    fetchCompanions(); // Fetch and display the companions
});
