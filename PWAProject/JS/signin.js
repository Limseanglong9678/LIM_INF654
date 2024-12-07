import { auth, db } from "./firebaseDB.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
document.addEventListener("DOMContentLoaded", () => {
  const signInForm = document.getElementById("sign-in-form");
  const signUpForm = document.getElementById("sign-up-form");
  const showSignUp = document.getElementById("show-signup");
  const showSignIn = document.getElementById("show-signin");
  const signInBtn = document.getElementById("sign-in-btn");
  const signUpBtn = document.getElementById("sign-up-btn");

  showSignUp.addEventListener("click", () => {
    signUpForm.style.display = "block";
    signInForm.style.display = "none";
  });

  showSignIn.addEventListener("click", () => {
    signUpForm.style.display = "none";
    signInForm.style.display = "block";
  });

  // Handle Sign-Up
  signUpBtn.addEventListener("click", async () => {
    const name = document.getElementById("sign-up-name").value;
    const email = document.getElementById("sign-up-email").value;
    const password = document.getElementById("sign-up-password").value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });
      await setDoc(doc(db, "users", user.uid), { name, email, createdAt: new Date() });

      alert("Sign-Up Successful! Please Sign In.");
      showSignIn.click(); // Switch to Sign-In Form
    } catch (error) {
      console.error("Error during sign-up:", error);
      alert(error.message);
    }
  });

  // Handle Sign-In
  signInBtn.addEventListener("click", async () => {
    const email = document.getElementById("sign-in-email").value;
    const password = document.getElementById("sign-in-password").value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Sign-In Successful!");
      window.location.href = "/start.html"; // Redirect to main page
    } catch (error) {
      console.error("Error during sign-in:", error);
      alert(error.message);
    }
  });
});
