import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  doc, 
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../firebase";

// --- USER PROFILES ---
export const createUserProfile = async (uid, profileData) => {
  const userRef = doc(db, "users", uid);
  return await setDoc(userRef, {
    ...profileData,
    createdAt: serverTimestamp(),
    isFirstTime: profileData.frequenza === 'Prima volta'
  });
};

export const getUserProfile = async (uid) => {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

// --- ORDINI BOTTIGLIE ---
export const streamOrders = (callback) => {
  const q = query(collection(db, "orders"), orderBy("timestamp", "desc"));
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(orders);
  }, (err) => console.error("Stream Orders Error:", err));
};

export const placeOrder = async (orderData) => {
  return await addDoc(collection(db, "orders"), {
    ...orderData,
    timestamp: serverTimestamp(),
    status: 'pending'
  });
};

// --- SILENT CHAT ---
export const streamChat = (callback) => {
  const q = query(collection(db, "silentMessages"), orderBy("timestamp", "desc"));
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(messages);
  }, (err) => console.error("Stream Chat Error:", err));
};

export const sendSilentMessage = async (msgData) => {
  return await addDoc(collection(db, "silentMessages"), {
    ...msgData,
    timestamp: serverTimestamp()
  });
};

// --- STAFF MESSAGING (Regia) ---
export const streamStaffMessages = (callback) => {
  const q = query(collection(db, "staffMessages"), orderBy("timestamp", "desc"));
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(messages);
  }, (err) => console.error("Stream Staff Error:", err));
};

export const sendStaffMessage = async (msgData) => {
  return await addDoc(collection(db, "staffMessages"), {
    ...msgData,
    timestamp: serverTimestamp()
  });
};

// --- PR REAL-TIME STATS ---
export const streamPrStats = (prId, callback) => {
  const q = query(collection(db, "prStats"), where("prId", "==", prId));
  return onSnapshot(q, (snapshot) => {
    if (!snapshot.empty) {
      callback({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
    } else {
      callback(null);
    }
  }, (err) => console.error("Stream PR Stats Error:", err));
};

export const updatePrStats = async (prId, data) => {
  const prRef = doc(db, "prStats", prId);
  return await updateDoc(prRef, data);
};
// --- QR VALIDATION & ACTIONS ---
export const validateEntryQR = async (userId) => {
  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);
  if (!snap.exists()) throw new Error("Utente non trovato");
  const data = snap.data();
  if (data.hasEntered) throw new Error("QR Già Utilizzato");
  
  await updateDoc(userRef, { 
    hasEntered: true, 
    entryTime: serverTimestamp() 
  });
  return data;
};

export const validateBottleQR = async (orderId) => {
  const orderRef = doc(db, "orders", orderId);
  const snap = await getDoc(orderRef);
  if (!snap.exists()) throw new Error("Ordine non trovato");
  const data = snap.data();
  if (data.status === 'delivered') throw new Error("Bottiglia già consegnata");
  
  await updateDoc(orderRef, { 
    status: 'delivered', 
    deliveredAt: serverTimestamp() 
  });
  return data;
};

export const redeemDrinkQR = async (userId) => {
  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);
  if (!snap.exists()) throw new Error("Utente non trovato");
  const data = snap.data();
  if (!data.isFirstTime) throw new Error("Nessun drink omaggio");
  if (data.drinkRedeemed) throw new Error("Drink già riscattato");
  
  await updateDoc(userRef, { 
    drinkRedeemed: true 
  });
  return data;
};

export const streamServiceCalls = (callback) => {
  const q = query(collection(db, "serviceCalls"), where("status", "==", "pending"));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (err) => console.error("Stream Service Error:", err));
};

export const completeServiceCall = async (id) => {
  return await updateDoc(doc(db, "serviceCalls", id), { status: 'completed' });
};

export const streamCashOrders = (callback) => {
  const q = query(collection(db, "orders"), where("paymentMethod", "==", "cash"), where("status", "==", "pending"));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (err) => console.error("Stream Cash Error:", err));
};

export const confirmCashPayment = async (id) => {
  return await updateDoc(doc(db, "orders", id), { status: 'paid' });
};

// --- RESERVATIONS ---
export const saveReservation = async (resData) => {
  return await addDoc(collection(db, "reservations"), {
    ...resData,
    timestamp: serverTimestamp(),
    status: 'pending'
  });
};

// --- REVIEWS & FEEDBACK ---
export const saveReview = async (reviewData) => {
  return await addDoc(collection(db, "reviews"), {
    ...reviewData,
    timestamp: serverTimestamp()
  });
};

export const streamReviews = (callback) => {
  const q = query(collection(db, "reviews"), orderBy("timestamp", "desc"));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (err) => console.error("Stream Reviews Error:", err));
};

export const streamUsers = (callback) => {
  const q = query(collection(db, "users"), orderBy("name", "asc"));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (err) => console.error("Stream Users Error:", err));
};

export const updateUser = async (userId, data) => {
  return await updateDoc(doc(db, "users", userId), data);
};

export const streamSystemState = (callback) => {
  return onSnapshot(doc(db, "system", "state"), (doc) => {
    callback(doc.data() || { hackerMode: false });
  }, (err) => {
    console.error("Stream System State Error:", err);
    callback({ hackerMode: false });
  });
};

export const updateSystemState = async (data) => {
  return await setDoc(doc(db, "system", "state"), data, { merge: true });
};

