import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';
import { getFirestore, collection,doc,setDoc, query, where, orderBy,getDocs,getDoc } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

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
        
        let body = document.body;

         body.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Dimming effect

         body.style.transition = "background-color 0.3s ease-in-out";
    });
    
    document.getElementById('delete').addEventListener('click', () => {
        let empd = document.getElementById('empd');
        empd.style.opacity = "0"; 
        empd.style.transform = "scale(0.95)"; // Shrink effect before hiding
    
        setTimeout(() => {
            empd.style.display = "none"; // Hide after animation
        }, 400); // Match transition duration
        let body = document.body;
        body.style.backgroundColor = ""; // Reset background

    });
    

  document.getElementById('submit').addEventListener('click', async (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page

    const company = sessionStorage.getItem('company');
    const email = document.getElementById('email').value.trim();
    const role = document.getElementById('role').value.trim();
    const dob = document.getElementById('dob').value.trim();
    const dep=document.getElementById('department').value.trim();
    const mobile = document.getElementById('mobile').value.trim();

    if (!email || !role || !dob || !mobile ||!dep) {
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
          department:dep,
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



// Check if the user is authenticated
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("Access Denied. Please log in.");
    window.location.href = "/index.html"; // Redirect to login page
    return;
  }

  const userUID = user.uid;
  const company = sessionStorage.getItem('company');

  const userRef = doc(db, `company/${company}`); // Fetch user data from Firestore
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();



  try {
    // Check if the user role exists in the users collection
    const userRef = doc(db, `company/${company}`); // Fetch user data from Firestore
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const useremail = userData.ceo; // Assuming the role is stored under 'role' in the user document
    
      if (useremail==user.email.replace("@gmail.com","")) {
        console.log("User is a manager. Access granted.");
        sessionStorage.setItem('userRole', 'manager');
      } else {
        // alert("Access Denied. Only managers can view this page.");
        // await signOut(auth);
        window.location.href = "/index.html"; // Redirect to login page
      }
    } else {
      alert("User not found in the database.");
      await signOut(auth);
      window.location.href = "/index.html";
    }
  } catch (error) {
    console.error("Error fetching user role from Firestore:", error);
    alert("Error verifying access. Please try again.");
    window.location.href = "/index.html";
  }
});
// Fetch and display all employees with their roles
async function displayAllEmployees() {
    const company = sessionStorage.getItem('company');
    
    try {
      const usersCollection = collection(db, `/company/${company}/users`);
      const querySnapshot = await getDocs(usersCollection);
  
      if (!querySnapshot.empty) {
        const employeeList = document.getElementById('employeeList'); // Add this element in your HTML to display employees
        employeeList.innerHTML = ''; // Clear the list first
  
        querySnapshot.forEach(doc => {
          const employeeData = doc.data();
          const employeeName = employeeData.name || "Not provided";
          const employeeRole = employeeData.Role || "Not provided";
  
          // Create a new list item for each employee
          const li = document.createElement('li');
          li.textContent = `${employeeName} - ${employeeRole}`;
          employeeList.appendChild(li);
  
          // You can also add a click handler here to load the employee's profile when clicked
          li.addEventListener('click', () => {
            displayEmployeeProfile(employeeData);
          });
        });
      } else {
        console.log("No employees found.");
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  }
  
  // Search functionality for employee (same as before)
  const search = document.getElementById("search");
  search.addEventListener('click', async () => {
    const EmployeeI = document.getElementById('empid');
    const EmployeeID = EmployeeI.value;
  
    const triggerShake = (input) => {
      input.classList.remove('shake');
      void input.offsetWidth; // Trigger a reflow
      input.classList.add('shake');
    };
  
    if (!EmployeeID) {
      triggerShake(EmployeeI);
      return;
    }
  
    try {
      const company = sessionStorage.getItem('company');
      // Fetch employee details from 'users' collection by EmployeeID
      const usersCollection = collection(db, `/company/${company}/users`);
      const q = query(usersCollection, where("EmployeeID", "==", EmployeeID));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0].data(); // Assume the first result is the correct one
        // Display the selected employee's details in the profile form
        displayEmployeeProfile(doc);
      } else {
        // alert("Employee not found.");
        const warningBox = document.getElementById("warning-msg");
        warningBox.style.display = "block"; // Show message
    
        setTimeout(() => {
            warningBox.style.display = "none"; // Hide after 3 seconds
        }, 3000);        
      }
    } catch (error) {
      console.error("Error fetching user data from Firestore:", error);
    }
  });
  
  // Function to display employee profile details (same as before)
  function displayEmployeeProfile(data) {
    const imgElement = document.getElementById('userPhoto');
    
    // Set the image source to the fetched URL
    imgElement.src = data.photoURL;
  
    // Make the image visible after it's loaded
    imgElement.onload = function() {
      imgElement.style.display = 'block';   // Ensure it's visible
      imgElement.style.opacity = 1;   
    };
    
    const pro = document.getElementById('profile');
    pro.style.display = 'block';
    pro.style.opacity = 1;
  
    // Update the UI with employee data
    
  document.getElementById("userName").innerText = data.name || "Not provided";
  document.getElementById("userEmail").innerText = data.email || "Not provided";
  document.getElementById("userPhoto").src = data.photoURL || "default-profile-pic.png"; // Fallback to default image
  document.getElementById('Dob').innerText = "Date of birth: "+data.Dob;
  document.getElementById("userMobile").innerText = "Mobile: "+data.mobileNumber || "Not provided";
  document.getElementById("Role").innerText=data.Role|| "Not Provided";
  document.getElementById('company').innerText=data.Company|| "";
    
  }
  
  // Call displayAllEmployees when the page loads to show all employees
  document.addEventListener("DOMContentLoaded", function() {
    displayAllEmployees();
  });
  