import { auth, db } from "./firebaseDB.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const signInForm = document.getElementById("sign-in-form");
  const signUpForm = document.getElementById("sign-up-form");
  const showSignUp = document.getElementById("show-signup");
  const showSignIn = document.getElementById("show-signin");
  const signInBtn = document.getElementById("sign-in-btn");
  const signUpBtn = document.getElementById("sign-up-btn");

  console.log("Sign-Up and Sign-In Forms Initialized.");

  showSignIn.addEventListener("click", () => {
    console.log("Switching to Sign-In Form");
    signUpForm.style.display = "none";
    signInForm.style.display = "block";
  });

  showSignUp.addEventListener("click", () => {
    console.log("Switching to Sign-Up Form");
    signInForm.style.display = "none";
    signUpForm.style.display = "block";
  });

  signUpBtn.addEventListener("click", async () => {
    console.log("Sign-Up Button Clicked");
    const name = document.getElementById("sign-up-name").value;
    const email = document.getElementById("sign-up-email").value;
    const password = document.getElementById("sign-up-password").value;

    console.log("Sign-Up Details:", { name, email });

    try {
      // Create a new user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("User Created:", user);

      // Update user profile with the name
      await updateProfile(user, { displayName: name });
      console.log("User Profile Updated with Name:", name);

      // Save user data in Firestore
      await setDoc(doc(db, "users", user.uid), { name, email, createdAt: new Date() });
      console.log("User Data Saved to Firestore");

      alert("Sign-Up Successful! Please Sign In.");
      showSignIn.click(); // Switch to Sign-In Form
    } catch (error) {
      console.error("Error during sign-up:", error);
      alert(`Error during sign-up: ${error.message}`);
    }
  });

  signInBtn.addEventListener("click", async () => {
    console.log("Sign-In Button Clicked");
    const email = document.getElementById("sign-in-email").value;
    const password = document.getElementById("sign-in-password").value;

    console.log("Sign-In Details:", { email });

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Sign-In Successful");
      alert("Sign-In Successful!");
      window.location.href = "/start.html"; // Redirect to home page
    } catch (error) {
      console.error("Error during sign-in:", error);
      alert(`Error during sign-in: ${error.message}`);
    }
  });
});
