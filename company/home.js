// / Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

// Replace with your actual Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCib5ywnEJvXXIePdWeKZtrKMIi2-Q_9sM",
  authDomain: "geo-orbit-ed7a7.firebaseapp.com",
  databaseURL: "https://geo-orbit-ed7a7-default-rtdb.firebaseio.com",
  projectId: "geo-orbit-ed7a7",
  storageBucket: "geo-orbit-ed7a7.firebasestorage.app",
  messagingSenderId: "807202826514",
  appId: "1:807202826514:web:5630f581f6f9dff46aebcb",
  measurementId: "G-H15DN69132"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore



// File where the user details are displayed (e.g., userDetails.js)
const userUID = sessionStorage.getItem('userUID');

if (!userUID) {
  console.log("No user is authenticated!");
  alert("Please sign in to proceed.");
  window.location.href = "/index.html"; // Redirect to login page
} else {
  console.log("User is authenticated with UID:", userUID);

 const company=sessionStorage.getItem('company');
 console.log(company);
    
      const cref=doc(db,`company/${company}`);
    

  try {
    const cdoc=await getDoc(cref);
    const cdata=cdoc.data();
    document.getElementById("clogo").src=cdata.clogo;
    document.getElementById('clogo').style.display='block';
    
  } catch (error) {
    console.error("Error fetching user data from Firestore:", error);
    alert(error);
  }
 
  // Display the user details...
}


