import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Configurazione "Billionaire Ecosystem" (Placeholder - Yuri dovrà inserire le sue API Key)
const firebaseConfig = {
  apiKey: "AIzaSyDfr2vO-UTAlroKOFt0fewvsWCE3NdwobY",
  authDomain: "disco-new-concept.firebaseapp.com",
  projectId: "disco-new-concept",
  storageBucket: "disco-new-concept.firebasestorage.app",
  messagingSenderId: "860767953525",
  appId: "1:860767953525:web:f1b560f7ff5cac28e6ce3c",
  measurementId: "G-XXXXXXXXXX"
};

// Inizializzazione
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Persistence Offline (PWA Optimized)
import { enableIndexedDbPersistence } from "firebase/firestore";
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn("Multiple tabs open, persistence can only be enabled in one tab at a time.");
    } else if (err.code === 'unimplemented') {
      console.warn("The current browser doesn't support all of the features necessary to enable persistence");
    }
  });
}

export default app;
