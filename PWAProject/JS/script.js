import { db } from './firebaseDB.js';
import { collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Install Prompt for PWA
let deferredPrompt;
window.addEventListener("beforeinstallprompt", (event) => {
event.preventDefault();
deferredPrompt = event;
  
const installButton = document.createElement("button");
installButton.textContent = "Install App";
installButton.classList.add("btn", "blue");
document.body.appendChild(installButton);
  
installButton.addEventListener("click", () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === "accepted") {
        console.log("User accepted the A2HS prompt");
    } else {
    console.log("User dismissed the A2HS prompt");
    }
    deferredPrompt = null;
    });
    installButton.remove();
    });
});

// DOM Element
const remindersList = document.querySelector(".collection");


if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("serviceworker.js")
        .then((req) => console.log("Service Worker Registered!", req))
        .catch((err) => console.log("Service Worker registration failed", err));
}


document.addEventListener('DOMContentLoaded', () => {
  const sidenavs = document.querySelectorAll('.sidenav');
  const sidenavTriggers = document.querySelectorAll('.sidenav-trigger');

  // Initialize Materialize sidenav
  M.Sidenav.init(sidenavs);

  // Prevent default behavior for sidenav triggers
  sidenavTriggers.forEach(trigger => {
      trigger.addEventListener('click', (event) => {
          event.preventDefault();
          console.log('Sidenav trigger clicked'); // Debugging log
      });
  });
});


// Initialize IndexedDB
const dbPromise = indexedDB.open('petCareDB', 1);

dbPromise.onupgradeneeded = (event) => {
    const db = event.target.result;

    if (!db.objectStoreNames.contains('companions')) {
        db.createObjectStore('companions', { keyPath: 'id' });
    }

    if (!db.objectStoreNames.contains('appointments')) {
        db.createObjectStore('appointments', { keyPath: 'id' });
    }
};

dbPromise.onerror = (event) => {
    console.error('IndexedDB initialization error:', event.target.errorCode);
};

// Save to IndexedDB
function saveToIndexedDB(storeName, data) {
    const dbPromise = indexedDB.open('petCareDB', 1);

    dbPromise.onsuccess = (event) => {
        const db = event.target.result;
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);

        data.forEach((item) => store.put(item)); // Use `put` to add or update
        tx.oncomplete = () => console.log(`${storeName} data saved to IndexedDB.`);
    };

    dbPromise.onerror = (event) => console.error('Error saving to IndexedDB:', event.target.errorCode);
}

// Fetch from IndexedDB
function fetchFromIndexedDB(storeName) {
    return new Promise((resolve, reject) => {
        const dbPromise = indexedDB.open('petCareDB', 1);

        dbPromise.onsuccess = (event) => {
            const db = event.target.result;
            const tx = db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            const allData = store.getAll();

            allData.onsuccess = () => resolve(allData.result);
            allData.onerror = () => reject(allData.error);
        };

        dbPromise.onerror = (event) => reject(event.target.errorCode);
    });
}

// Fetch Companions
async function fetchCompanions() {
    const companionsContainer = document.querySelector("#companions-container");

    try {
        const querySnapshot = await getDocs(collection(db, 'companions'));
        const companions = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        // Save to IndexedDB
        saveToIndexedDB('companions', companions);

        // Display companions
        displayCompanions(companions);
    } catch (error) {
        console.error('Error fetching companions from Firebase:', error);

        // Fallback to IndexedDB
        const offlineCompanions = await fetchFromIndexedDB('companions');
        displayCompanions(offlineCompanions);
    }
}

// Display Companions
function displayCompanions(companions) {
    const container = document.getElementById('companions-container');
    if (!container) return;

    if (companions.length === 0) {
        container.innerHTML = '<p>No companions found.</p>';
        return;
    }

    container.innerHTML = companions.map((companion) => `
        <div class="col s12 m6">
            <div class="card">
                <div class="card-content">
                    <h5>${companion.name}</h5>
                    <p><strong>Breed:</strong> ${companion.breed || 'Unknown'}</p>
                    <p><strong>Age:</strong> ${companion.age || 'N/A'} years</p>
                    <p><strong>Type:</strong> ${companion.type || 'N/A'}</p>
                </div>
            </div>
        </div>
    `).join('');
}

// Fetch Appointments
async function fetchReminders() {
    const remindersList = document.querySelector(".collection");

    try {
        const querySnapshot = await getDocs(collection(db, "appointments"));
        const appointments = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().date.toDate(), // Convert Firestore Timestamp to JS Date
        }));

        // Save to IndexedDB
        saveToIndexedDB('appointments', appointments);

        // Display reminders
        displayReminders(appointments);
    } catch (error) {
        console.error("Error fetching reminders:", error);

        // Fallback to IndexedDB
        const offlineAppointments = await fetchFromIndexedDB('appointments');
        displayReminders(offlineAppointments);
    }
}

// Display Reminders
function displayReminders(appointments) {
    const remindersList = document.querySelector(".collection");
    remindersList.innerHTML = "";

    if (appointments.length === 0) {
        remindersList.innerHTML = "<li class='collection-item'>No upcoming reminders.</li>";
        return;
    }

    appointments.forEach((appointment) => {
        const dateStr = appointment.date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        const reminderItem = document.createElement("li");
        reminderItem.classList.add("collection-item");
        reminderItem.textContent = `${appointment.activity} for ${appointment.petName} - ${dateStr}`;
        remindersList.appendChild(reminderItem);
    });
}

// Sync Offline Changes
window.addEventListener('online', async () => {
    console.log('User is back online. Syncing offline data...');

    const offlineCompanions = await fetchFromIndexedDB('companions');
    offlineCompanions.forEach(async (companion) => {
        try {
            await addDoc(collection(db, 'companions'), companion);
            console.log('Synced companion:', companion);

            // Clear IndexedDB store after syncing
            clearIndexedDBStore('companions');
        } catch (error) {
            console.error('Error syncing companion:', error);
        }
    });

    const offlineAppointments = await fetchFromIndexedDB('appointments');
    offlineAppointments.forEach(async (appointment) => {
        try {
            await addDoc(collection(db, 'appointments'), appointment);
            console.log('Synced appointment:', appointment);

            // Clear IndexedDB store after syncing
            clearIndexedDBStore('appointments');
        } catch (error) {
            console.error('Error syncing appointment:', error);
        }
    });
});

function clearIndexedDBStore(storeName) {
    const dbPromise = indexedDB.open('petCareDB', 1);

    dbPromise.onsuccess = (event) => {
        const db = event.target.result;
        const tx = db.transaction(storeName, 'readwrite');
        tx.objectStore(storeName).clear();
        tx.oncomplete = () => console.log(`${storeName} cleared in IndexedDB.`);
    };

    dbPromise.onerror = (event) => console.error('Error clearing IndexedDB store:', event.target.errorCode);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchReminders();
    fetchCompanions();
});
