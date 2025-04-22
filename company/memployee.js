import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';
import { getFirestore, collection,doc,setDoc, query, where, orderBy,getDocs,getDoc,deleteDoc } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

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
      document.getElementById('info').textContent = "";

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
    const cref1 = doc(db, 'allowedManagers', userId);

    
    try {
      const cdoc = await getDoc(cref);
      const cdoc1=await getDoc(cref1);

      if (!cdoc.exists() && !cdoc1.exists()) {
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
async function DisplayDepartments() {
    const company = sessionStorage.getItem('company');
    
    try {
      const usersCollection = collection(db, `/company/${company}/Departments`);
      const querySnapshot = await getDocs(usersCollection);
  
      if (!querySnapshot.empty) {
        const employeeList = document.getElementById('employeeList'); // Add this element in your HTML to display employees
        employeeList.innerHTML = ''; // Clear the list first
  
        querySnapshot.forEach(doc => {
          const employeeData = doc.data();
          const dname = employeeData.department || "Not provided";
  
          // Create a new list item for each employee
          const li = document.createElement('li');
          li.textContent = `${dname}`;
          employeeList.appendChild(li);
  
          // You can also add a click handler here to load the employee's profile when clicked
          li.addEventListener('click', () => {
            displayEmployeesInDepartment(company, dname);
        });
        });
      } else {
        console.log("No employees found.");
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  }
  async function displayEmployeesInDepartment(company, department) {
    try {
        const employeesCollection = collection(db, `/company/${company}/${department}/${department}/Employees`);
        const querySnapshot = await getDocs(employeesCollection);

        const employeeContainer = document.getElementById('emps'); 
        employeeContainer.innerHTML = ''; // Clear previous data
        employeeContainer.style.display = 'flex';
        employeeContainer.style.flexWrap = 'wrap'; // Allow multiple elements in a row
        employeeContainer.style.gap = '15px'; // Add spacing between elements
        
        if (!querySnapshot.empty) {
            querySnapshot.forEach(doc => {
                const employeeData = doc.data();
                employeeData.uid=doc.id;
                const employeeName = employeeData.name || "Unknown Employee";
                const photoURL = employeeData.photoURL || "/Images/default-profile-pic.png"; // Default image
                // Create the userPhoto container
                const userPhotoDiv = document.createElement('div');
                userPhotoDiv.classList.add('userPhoto1');

                // Create an image element inside userPhoto
                const img = document.createElement('img');
                img.src = photoURL;
                img.alt = `${employeeName}'s Photo`;
                img.classList.add('profile-img');

                // Create a name label
                const nameLabel = document.createElement('p');
                nameLabel.classList.add('user-name');
                nameLabel.textContent = employeeName;

                // Append elements to userPhoto div
                userPhotoDiv.appendChild(img);
                userPhotoDiv.appendChild(nameLabel);
                userPhotoDiv.addEventListener('click', () => {
                  displayEmployeesProfile(employeeData,company, department);
                });




                // Append userPhoto div to the main profile container
                employeeContainer.appendChild(userPhotoDiv);
            });
        } else {
            employeeContainer.innerHTML = "<p>No employees found in this department or employees not yet loged in.</p>";
        }
    } catch (error) {
        console.error("Error fetching employees:", error);
    }
}

  // Search functionality for employee (same as before)
 
  // Function to display employee profile details (same as before)
  function displayEmployeesProfile(data,company, department) {
    console.log(data.uid);
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



  


  const deleteBtn=document.getElementById("deleteemp");
  // Add click event to delete employee
  deleteBtn.addEventListener('click', async () => {
    console.log("Delete button clicked for", data.email);
    console.log(data.uid);

    alert("Are you sure..?");
    
    try {

      const deletedref=doc(db,`/company/${company}/${department}/${department}/Employees/`,data.uid);
      const allowedUserRef = doc(db, 'allowedUsers', data.email.replace("@gmail.com","")); // Use email as the document ID
      await deleteDoc(allowedUserRef); 
      await deleteDoc(deletedref);
      displayEmployeesInDepartment(company,department);

      // await deleteDoc(data);  // Delete the employee document from Firestore

      alert("Employee deleted successfully.");
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Error deleting employee.");
    }
  });
  const resetbtn=document.getElementById("reset");
  // Add click event to delete employee
  resetbtn.addEventListener('click', async () => {
    console.log("reset button clicked for", data.email);

    alert("Are you sure..? all biometric and face details well be removed.");
    
    try {

      const deletedref=doc(db,`/company/${company}/${department}/${department}/Employees/`,data.uid);
      await deleteDoc(deletedref);
      displayEmployeesInDepartment(company,department);

      // await deleteDoc(data);  // Delete the employee document from Firestore

      alert("Employee reset successful");
    } catch (error) {
      console.error("Error resetting employee:", error);
      alert("Error resetting employee.");
    }
  });
    
  }
  
  // Call Display Departments when the page loads to show all employees
  document.addEventListener("DOMContentLoaded", function() {
    DisplayDepartments();
  });
  