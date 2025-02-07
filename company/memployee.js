import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCib5ywnEJvXXIePdWeKZtrKMIi2-Q_9sM",
  authDomain: "geo-orbit-ed7a7.firebaseapp.com",
  projectId: "geo-orbit-ed7a7",
  storageBucket: "geo-orbit-ed7a7.appspot.com",
  messagingSenderId: "807202826514",
  appId: "1:807202826514:web:5630f581f6f9dff46aebcb",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Ensure DOM Elements Are Loaded Before Attaching Events
window.onload = () => {
    const userUID = sessionStorage.getItem('userUID');

if (!userUID) {
  console.log("No user is authenticated!");
  alert("Please sign in to proceed.");
  window.location.href = "/index.html"; // Redirect to login page
} else {
    
    document.getElementById('addemp').addEventListener('click', () => {
        let empd = document.getElementById('empd');
        empd.style.display = "flex"; // Ensure it's visible
        empd.style.opacity = "0"; 
        empd.style.transform = "scale(0.95)"; // Slight shrink for smooth effect
    
        setTimeout(() => {
            empd.style.opacity = "1"; 
            empd.style.transform = "scale(1)"; // Normal size
        }, 10); // Small delay to trigger transition
    });
    
    document.getElementById('delete').addEventListener('click', () => {
        let empd = document.getElementById('empd');
        empd.style.opacity = "0"; 
        empd.style.transform = "scale(0.95)"; // Shrink effect before hiding
    
        setTimeout(() => {
            empd.style.display = "none"; // Hide after animation
        }, 400); // Match transition duration
    });
    

  document.getElementById('submit').addEventListener('click', async (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page

    const company = sessionStorage.getItem('company');
    const email = document.getElementById('email').value.trim();
    const role = document.getElementById('role').value.trim();
    const dob = document.getElementById('dob').value.trim();
    const mobile = document.getElementById('mobile').value.trim();

    if (!email || !role || !dob || !mobile) {
      alert("All fields are required!");
      return;
    }

    const userId = email.split('@')[0]; // More flexible approach than replacing "@gmail.com"
    const cref = doc(db, 'allowedUsers', userId);
    
    try {
      const cdoc = await getDoc(cref);

      if (!cdoc.exists()) {
        await setDoc(cref, {
          uid: userId,
          email: email,
          company: company || "Unknown",
          Role: role,
          Dob: dob,
          mobile: mobile,
        });
        document.getElementById('info').style.color="#04AA6D";

        document.getElementById('info').textContent = "Registered";

        setTimeout(() => {
          document.getElementById("empd").style.display = "none";
          document.querySelector('form').reset(); // Clear form after submission
        }, 2000);
      } else {
        document.getElementById('info').textContent = "Employee Already Registered in Orbit"; // Reset button text
        setTimeout(() => {
            document.getElementById("empd").style.display = "none";
            document.querySelector('form').reset(); // Clear form after submission
          }, 2000);
      }
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  });
}
};
