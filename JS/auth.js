import { auth } from "./firebaseDB.js";
import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

export let currentUser = null;

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout-btn");

  // Track authentication state
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser = user;
      console.log(`Logged in as: ${user.uid}`);
      if (logoutBtn) logoutBtn.style.display = "block";
    } else {
      console.log("No user is currently signed in.");
      window.location.href = "signin.html";
    }
  });

  // Handle logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        await signOut(auth);
        alert("Logged out successfully!");
        window.location.href = "signin.html";
      } catch (error) {
        console.error("Logout error:", error.message);
      }
    });
  }
});
