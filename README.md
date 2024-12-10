# Pet Care Companion

**Pet Care Companion** Pet Care Companion is a feature-rich web app designed to help users manage their pet's activities, appointments, and reminders efficiently. It supports both online and offline functionality for a seamless user experience.

## Features
- Signin and Signup function
- Add, Edit, and Delete Appointments: Full CRUD functionality to manage pet appointments.
- Set Reminders: Add reminders for feeding times, vet visits, grooming, and more.
- Offline Support: Data is cached and synced using IndexedDB and Service Workers, allowing the app to work offline.
- Progressive Web App (PWA): Install the app on your device using a custom install prompt or the browser's default PWA feature.
- Firebase Integration: Real-time synchronization of data with Firebase Firestore.
- Manifest Support: Ensures the app is installable on devices as a PWA.
## Technologies Used
- HTML
- CSS
- Materialize CSS Framework
- PWA Features: Manifest.json, Service Worker
- Offline Support: IndexedDB, Service Worker
- Backend: Firebase Firestore

## How to Use
1. Clone this repository.
2. Open `signin.html` in a web browser to view the app and signup.
3. Manage your pet's activities using the provided interface.
4. Add or edit companions and appointments.
5. View upcoming reminders on the homepage.
6. Install the app as a PWA for offline use.
7. Offline Functionality: Data is cached using IndexedDB and a Service Worker. You can add, edit, or delete data offline, and it will sync automatically when you reconnect to the internet.

## Project Setup
Ensure you have a working internet connection for Materialize CSS to load, or download the Materialize CSS files locally.
