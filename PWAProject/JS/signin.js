import { auth, db } from "./firebaseDB.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

console.log("Auth and DB imported successfully:", { auth, db });

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded event fired");

  const signInForm = document.getElementById("sign-in-form");
  const signUpForm = document.getElementById("sign-up-form");
  const showSignUp = document.getElementById("show-signup");
  const showSignIn = document.getElementById("show-signin");
  const signInBtn = document.getElementById("sign-in-btn");
  const signUpBtn = document.getElementById("sign-up-btn");

  // Check if all elements are found
  console.log("DOM Elements:", {
    signInForm,
    signUpForm,
    showSignUp,
    showSignIn,
    signInBtn,
    signUpBtn,
  });

  showSignUp.addEventListener("click", () => {
    console.log("Switching to Sign-Up form");
    signUpForm.style.display = "block";
    signInForm.style.display = "none";
  });

  showSignIn.addEventListener("click", () => {
    console.log("Switching to Sign-In form");
    signUpForm.style.display = "none";
    signInForm.style.display = "block";
  });

  // Handle Sign-Up
  signUpBtn.addEventListener("click", async () => {
    console.log("Sign-Up button clicked");
    const name = document.getElementById("sign-up-name").value;
    const email = document.getElementById("sign-up-email").value;
    const password = document.getElementById("sign-up-password").value;

    // Log input values for debugging (do not log passwords in production)
    console.log("Sign-Up input values:", { name, email });

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("User created successfully:", user);

      await updateProfile(user, { displayName: name });
      console.log("User profile updated with name:", name);

      await setDoc(doc(db, "users", user.uid), { name, email, createdAt: new Date() });
      console.log("User data stored in Firestore with UID:", user.uid);

      alert("Sign-Up Successful! Please Sign In.");
      showSignIn.click(); // Switch to Sign-In Form
    } catch (error) {
      console.error("Error during sign-up:", error);
      alert(error.message);
    }
  });

  // Handle Sign-In
  signInBtn.addEventListener("click", async () => {
    console.log("Sign-In button clicked");
    const email = document.getElementById("sign-in-email").value;
    const password = document.getElementById("sign-in-password").value;

    // Log input values for debugging (do not log passwords in production)
    console.log("Sign-In input values:", { email });

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in successfully:", userCredential.user);

      alert("Sign-In Successful!");
      window.location.href = "/start.html"; // Redirect to main page
    } catch (error) {
      console.error("Error during sign-in:", error);
      alert(error.message);
    }
  });
});
