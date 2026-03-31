import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNoxStore } from '../store';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Zustand Store Sync Functions
  const clearSystem = useNoxStore(state => state.clearSystem);

  useEffect(() => {
    // Sincronizzazione Real-Time tra Server Google e Client
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Estrai il Ruolo aziendale dal Database Firestore (Miglior sicurezza vs localStorage)
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: userData.name || firebaseUser.email.split('@')[0],
            role: userData.role || 'cliente',
            prAssigned: userData.prAssigned || null
          });
        } else {
          // Fallback se l'utente esiste su Auth ma non ha la riga su DB
          setUser({ id: firebaseUser.uid, email: firebaseUser.email, role: 'cliente', name: firebaseUser.email });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    // Sanitizza la mail per sicurezza
    const cleanEmail = email.toLowerCase().trim();
    try {
      await signInWithEmailAndPassword(auth, cleanEmail, password);
    } catch (err) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found') {
        // BOOTSTRAP AUTO-SEEDING: 
        // Se il nuovo progetto Firebase è vuoto, tenta automaticamente la registrazione per agevolare i test del Management.
        try {
          const res = await createUserWithEmailAndPassword(auth, cleanEmail, password);
          // Determina il ruolo se è uno staff dalle nomenclature prestabilite
          let forcedRole = 'cliente';
          if(cleanEmail.includes('noxpr@')) forcedRole = 'pr';
          if(cleanEmail.includes('noxcpr@')) forcedRole = 'capo_pr';
          if(cleanEmail.includes('noxri@')) forcedRole = 'immagine';
          if(cleanEmail.includes('noxscr@')) forcedRole = 'bodyguard';
          if(cleanEmail.includes('cassanox@')) forcedRole = 'cassa';
          if(cleanEmail.includes('direzionenox@')) forcedRole = 'admin';

          await setDoc(doc(db, 'users', res.user.uid), {
            email: cleanEmail,
            role: forcedRole,
            name: cleanEmail.split('@')[0],
            createdAt: Date.now()
          });
          return; // Login con Auto-Seed andato a buon fine
        } catch(creationErr) {
           throw err; // Lancia errore originale di login se creazione fallisce
        }
      }
      throw err;
    }
  };

  const registerUser = async (name, email, phone, password) => {
    const cleanEmail = email.toLowerCase().trim();
    const res = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    await setDoc(doc(db, 'users', res.user.uid), {
      name,
      email: cleanEmail,
      phone,
      role: 'cliente', // Forzato per bloccare hacker
      createdAt: Date.now()
    });
  };

  const logout = async () => {
    await signOut(auth);
    clearSystem(); // Svuota lo Zustand e gli ordini persistiti del cliente
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      registerUser,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
