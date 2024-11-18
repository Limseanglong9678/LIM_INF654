// Import the functions you need from the Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  get,
  remove,
  update,
  child,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDztDzM2PVtz837A6Ti1WpUDo_DfcBewNE",
  authDomain: "ts-manager-ef3ee.firebaseapp.com",
  databaseURL: "https://task-manager-70db8-default-rtdb.firebaseio.com/", 
  projectId: "ts-manager-ef3ee",
  storageBucket: "ts-manager-ef3ee.appspot.com",
  messagingSenderId: "60015661850",
  appId: "1:60015661850:web:3f9888b00053aa3aec12a3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Add a task
export async function addTaskToFirebase(task) {
  try {
    const newTaskKey = ref(db, 'tasks').push().key; // Get a new unique key
    await set(ref(db, `tasks/${newTaskKey}`), task); // Add the task to the database
    return { id: newTaskKey, ...task };
  } catch (e) {
    console.error("Error adding task: ", e);
  }
}

// Get tasks
export async function getTasksFromFirebase() {
  const tasks = [];
  try {
    const snapshot = await get(ref(db, "tasks")); // Get all tasks
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        tasks.push({ id: childSnapshot.key, ...childSnapshot.val() }); // Push each task into the tasks array
      });
    }
  } catch (e) {
    console.error("Error retrieving tasks: ", e);
  }
  return tasks;
}

// Delete a task
export async function deleteTaskFromFirebase(id) {
  try {
    await remove(ref(db, `tasks/${id}`)); // Delete task by id
  } catch (e) {
    console.error("Error deleting task: ", e);
  }
}

// Update a task
export async function updateTaskInFirebase(id, updatedData) {
  try {
    await update(ref(db, `tasks/${id}`), updatedData); // Update task with new data
  } catch (e) {
    console.error("Error updating task: ", e);
  }
}
