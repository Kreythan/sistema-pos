import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // <-- REVISA QUE ESTA LÍNEA ESTÉ
import { getAuth } from "firebase/auth"; // Añadir esto



const firebaseConfig = {
  apiKey: "AIzaSyDgEFHY2pHHkUChtxS73yYUJ3dOvki4rzE",
  authDomain: "eco360-pos.firebaseapp.com",
  projectId: "eco360-pos",
  storageBucket: "eco360-pos.firebasestorage.app",
  messagingSenderId: "785619660907",
  appId: "1:785619660907:web:618ac5425e7365795bc12e",
  measurementId: "G-LHTF9CD09W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app); // ESTO ES CLAVE



// ... abajo de donde inicializas 'db'
export const auth = getAuth(app);