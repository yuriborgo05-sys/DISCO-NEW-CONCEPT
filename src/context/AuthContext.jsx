import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getUserProfile, createUserProfile } from '../services/db';

const AuthContext = createContext(null);

const mockUsers = [
  { id: '1', name: 'Mario Rossi', email: 'mario@bamboo.it', role: 'user' },
  { id: '2', name: 'Sara PR', email: 'sara@bamboo.it', role: 'pr' },
  { id: '3', name: 'Admin Bamboo', email: 'admin@bamboo.it', role: 'admin' },
  { id: '4', name: 'Luca Drink', email: 'luca@bamboo.it', role: 'cashier' },
  { id: '5', name: 'Giulia Boss', email: 'giulia@bamboo.it', role: 'head_pr' },
  { id: '6', name: 'Paolo Staff', email: 'paolo@bamboo.it', role: 'waiter' },
  { id: '7', name: 'Elena Image', email: 'elena@bamboo.it', role: 'image_girl' },
  { id: '8', name: 'Marco Lens', email: 'marco@bamboo.it', role: 'photographer' },
  { id: '9', name: 'Bruno Security', email: 'bruno@bamboo.it', role: 'bodyguard' }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasEntered, setHasEntered] = useState(false);
  const [entryTime, setEntryTime] = useState(null);

  useEffect(() => {
    // Listen for Firebase Auth changes
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const profile = await getUserProfile(fbUser.uid);
        setUser(profile || { id: fbUser.uid, email: fbUser.email, role: 'user', name: fbUser.displayName || fbUser.email.split('@')[0] });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (roleOrEmail, password) => {
    // Demo Mode: if it's a role, use mock
    if (!password) {
      const foundUser = mockUsers.find(u => u.role === roleOrEmail);
      setUser(foundUser || { id: 'usr_default', name: 'Guest User', role: roleOrEmail || 'guest' });
      return;
    }

    // Real Mode: Firebase Auth
    try {
      const res = await signInWithEmailAndPassword(auth, roleOrEmail, password);
      const profile = await getUserProfile(res.user.uid);
      setUser(profile);
      return profile;
    } catch (error) {
      throw error;
    }
  };

  const registerUser = async (email, password, profileData) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await createUserProfile(res.user.uid, { ...profileData, email });
      const profile = await getUserProfile(res.user.uid);
      setUser(profile);
      return profile;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setHasEntered(false);
      setEntryTime(null);
    } catch (error) {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, registerUser, loading, hasEntered, setHasEntered, entryTime, setEntryTime }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
