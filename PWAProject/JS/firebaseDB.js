import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getAuth } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js';
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8gFy3mdxe_dO5u3l6D2KqKxz4L3Qo5ic",
  authDomain: "pwaproject-2024.firebaseapp.com",
  projectId: "pwaproject-2024",
  storageBucket: "pwaproject-2024.firebasestorage.app",
  messagingSenderId: "231093448497",
  appId: "1:231093448497:web:7f7d5177e198371f974a10",
  measurementId: "G-XBF302KLYW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(auth);


// CRUD Operations with Timestamp

// 1. Add Appointment
export async function addAppointment(petName, activity, date) {
  try {
    console.log("Adding appointment:", petName, activity, date);
    const docRef = await addDoc(collection(db, "appointments"), {
      petName,
      activity,
      date: Timestamp.fromDate(new Date(date)), // Convert to Firestore Timestamp
    });
    console.log("Appointment added with ID:", docRef.id);
  } catch (error) {
    console.error("Error adding appointment:", error);
  }
}

// 2. Get All Appointments
export async function getAppointments() {
  try {
    console.log("Fetching appointments...");
    const querySnapshot = await getDocs(collection(db, "appointments"));
    const appointments = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      appointments.push({
        id: doc.id,
        petName: data.petName,
        activity: data.activity,
        date: data.date.toDate(), // Convert Firestore Timestamp to JS Date
      });
    });
    console.log("Fetched appointments:", appointments);
    return appointments;
  } catch (error) {
    console.error("Error getting appointments:", error);
  }
}

// 3. Update Appointment
export async function updateAppointment(appointmentId, updatedData) {
  try {
    console.log("Updating appointment:", appointmentId, updatedData);
    const appointmentRef = doc(db, "appointments", appointmentId);
    if (updatedData.date) {
      updatedData.date = Timestamp.fromDate(new Date(updatedData.date)); // Convert to Firestore Timestamp
    }
    await updateDoc(appointmentRef, updatedData);
    console.log("Appointment updated:", appointmentId);
  } catch (error) {
    console.error("Error updating appointment:", error);
  }
}

// 4. Delete Appointment
export async function deleteAppointment(appointmentId) {
  try {
    console.log("Deleting appointment:", appointmentId);
    await deleteDoc(doc(db, "appointments", appointmentId));
    console.log("Appointment deleted:", appointmentId);
  } catch (error) {
    console.error("Error deleting appointment:", error);
  }
}

export async function addCompanion(name, type, age, breed) {
  try {
    const docRef = await addDoc(collection(db, "companions"), {
      name,
      type,
      age: parseInt(age),
      breed,
    });
    console.log("Companion added with ID:", docRef.id);
  } catch (error) {
    console.error("Error adding companion:", error);
    throw error;
  }
}

// Get Companions Function
export async function getCompanions() {
  try {
    const querySnapshot = await getDocs(collection(db, "companions"));
    const companions = [];
    querySnapshot.forEach((doc) => {
      companions.push({ id: doc.id, ...doc.data() });
    });
    return companions;
  } catch (error) {
    console.error("Error fetching companions:", error);
    throw error;
  }
}
// Display companions dynamically in the DOM
export async function displayCompanions() {
  const container = document.getElementById("companions-container");
  if (!container) {
      console.warn("Container for companions not found in the DOM.");
      return;
  }

  container.innerHTML = '<p>Loading companions...</p>';
  try {
      const companions = await getCompanions();
      if (companions.length === 0) {
          container.innerHTML = '<p>No companions added yet.</p>';
          return;
      }

      container.innerHTML = companions.map(companion => `
          <div class="col s12 m6">
              <div class="card">
                  <div class="card-content">
                      <h5>${companion.name}</h5>
                      <p>Type: ${companion.type}</p>
                      <p>Age: ${companion.age}</p>
                      <p>Breed: ${companion.breed}</p>
                  </div>
              </div>
          </div>
      `).join('');
  } catch (error) {
      console.error("Error displaying companions:", error);
      container.innerHTML = '<p>Error loading companions.</p>';
  }
}