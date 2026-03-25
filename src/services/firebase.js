import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence, initializeFirestore, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// 1. Inserisci qui le vere API keys quando configuri il progetto su Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSy_INSERISCI_CHIAVE_QUI",
  authDomain: "bamboo-toomuch.firebaseapp.com",
  projectId: "bamboo-toomuch",
  storageBucket: "bamboo-toomuch.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

// 2. Inizializzazione App Base
const app = initializeApp(firebaseConfig);

// 3. Inizializzazione Database con Settings Ottimizzati (Cache Illimitata)
const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED
});

// 4. ATTIVAZIONE OFFLINE PERSISTENCE (Cruciale per i locali notturni)
// Questo blocco garantisce che l'app continui a funzionare, leggere e scrivere dati
// anche quando il 4G muore. Sincronizzerà tutto appena torna la rete.
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Persistenza offline: schede multiple aperte non supportate. Chiudi le altre tab.');
    } else if (err.code === 'unimplemented') {
      console.error('Persistenza offline non supportata da questo browser.');
    }
  });

// 5. Esportazione Moduli per utilizzo nell'App
const auth = getAuth(app);

export { db, auth };
