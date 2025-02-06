// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import { getAuth, signOut,GoogleAuthProvider, signInWithPopup } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';
import { getFirestore, doc, getDoc, collection, getDocs, query, where, setDoc, addDoc } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

// Replace with your actual Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCib5ywnEJvXXIePdWeKZtrKMIi2-Q_9sM",
  authDomain: "geo-orbit-ed7a7.firebaseapp.com",
  databaseURL: "https://geo-orbit-ed7a7-default-rtdb.firebaseio.com",
  projectId: "geo-orbit-ed7a7",
  storageBucket: "geo-orbit-ed7a7.appspot.com",
  messagingSenderId: "807202826514",
  appId: "1:807202826514:web:5630f581f6f9dff46aebcb",
  measurementId: "G-H15DN69132"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function handleSignIn(){
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider); // Sign-in
    const user = result.user;

    const company=collection(db,'company');
    const q=query(company,where("ceo","==",user.email.replace("@gmail.com", "")));
    const queryshot=await getDocs(q);

    if(queryshot.empty){


      sessionStorage.setItem('email',user.email);
      sessionStorage.setItem('userUID',user.uid);
      window.location.href="companyreg.html";
      

    }else{
      
      const cdocs=queryshot.docs[0];
      const cdata=cdocs.data();
      sessionStorage.setItem('company',cdata.Name);
      sessionStorage.setItem('email',user.email);
      sessionStorage.setItem('userUID',user.uid);

     window.location.href="/company/chome.html";
     
    }   

  } catch (error) {
    console.error("Error during sign-in:", error);
    alert(error);
    window.location.href = "/index.html"; // Redirect to login page in case of error
  }
}

// Trigger the function on page load
window.onload = () => {
  setTimeout(() => {
    handleSignIn();
  }, 500); // Delay for 1 second
};
