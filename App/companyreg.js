// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';
import { getFirestore, doc, getDoc,setDoc } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCib5ywnEJvXXIePdWeKZtrKMIi2-Q_9sM",
  authDomain: "geo-orbit-ed7a7.firebaseapp.com",
  projectId: "geo-orbit-ed7a7",
  storageBucket: "geo-orbit-ed7a7.appspot.com",
  messagingSenderId: "807202826514",
  appId: "1:807202826514:web:5630f581f6f9dff46aebcb",
  measurementId: "G-H15DN69132"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById('signinButton').addEventListener('click', async function (event) {
  event.preventDefault();  // Prevent form submission
  
  const cname = document.getElementById('cname').value;  // Get the company name from input
  const clogo = document.getElementById('clogo').value; // Get additional string input
  const email = sessionStorage.getItem('email');




  // Ensure user is logged in
  const triggerShake = (input) => {
    input.classList.remove('shake');
    void input.offsetWidth; // Trigger a reflow
    input.classList.add('shake');
  };

  if (!cname || !clogo) {
    triggerShake(emailInput);
    triggerShake(passwordInput);
    return;
  }

  try {
    // Store Data in Firestore
    const companyRef = doc(db, "company", cname);
    const crdoc=await getDoc(companyRef);

    if(!crdoc.exists()){
    const companyDetails = {
      Name: cname,
      clogo: clogo,  // Store the string input as description
      ceo: email.replace("@gmail.com", "")
    };

    await setDoc(companyRef, companyDetails);

    sessionStorage.setItem('company', cname);
    window.location.href="/company/chome.html";
  }else{
      document.getElementById('info').innerHTML="Company Already Registered in Orbit..!";
  }
  } catch (error) {
    console.error("Error:", error);
    alert("Registration failed: " + error.message);
  }
});
