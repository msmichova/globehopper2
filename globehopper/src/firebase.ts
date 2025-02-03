// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD8zcKSqKa2vH2uSJSF3m5r4YBr-pxHWCQ",
  authDomain: "globehopper-1a70e.firebaseapp.com",
  projectId: "globehopper-1a70e",
  storageBucket: "globehopper-1a70e.firebasestorage.app",
  messagingSenderId: "142529254281",
  appId: "1:142529254281:web:c6960639b9a56da4d10758",
  measurementId: "G-D5JDQQQV2M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
