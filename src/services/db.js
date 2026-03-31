import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, updateDoc, setDoc, getDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';

// ==========================================
// 🛒 GESTIONE ORDINI (REAL TIME FIRESTORE)
// ==========================================

export const streamOrders = (cb) => {
  const q = query(collection(db, 'orders'), orderBy('timestamp', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Mapper for UI
    const uiOrders = orders.map(o => ({
      ...o,
      timestamp: o.timestamp?.toMillis ? o.timestamp.toMillis() : Date.now()
    }));
    cb(uiOrders);
  }, (err) => {
    console.error("Firestore Orders Stream Error:", err);
    cb([]); // Fallback vuoto se manca autorizzazione
  });
};

export const placeOrder = async (orderData) => {
  // Nota: Nella fase successiva si chiamerà la Cloud Function per sicurezza.
  // Qui inseriamo direttamente nel DB (Client-side) per continuità delle operazioni.
  await addDoc(collection(db, 'orders'), {
    table: orderData.table || 'Tavolo',
    status: 'pending',
    timestamp: serverTimestamp(),
    items: orderData.items || [],
    total: orderData.total || 0,
    prAssigned: orderData.prAssigned || 'Nessuno'
  });
};

export const updateOrderStatus = async (id, status) => { 
  const orderRef = doc(db, 'orders', id);
  await updateDoc(orderRef, { status });
};

export const completeWaiterDelivery = (id) => updateOrderStatus(id, 'delivered');

export const streamWaiterOrders = (cb) => {
  const q = query(collection(db, 'orders'), orderBy('timestamp', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    cb(orders.filter(o => o.status === 'ready' || o.status === 'pending_bar'));
  });
};

export const streamCambusaOrders = streamOrders;
export const streamCashOrders = streamOrders;
export const confirmCashPayment = async (id) => updateOrderStatus(id, 'paid');

// ==========================================
// 📊 ANALYTICS & EVENTI (FIRESTORE)
// ==========================================

export const logAppAccess = async (user) => {
  if (!user) return;
  const staffRoles = ['pr', 'capo_pr', 'immagine', 'cambusa', 'cameriere', 'security', 'bodyguard', 'cassa', 'admin', 'fotografo', 'direzione'];
  if (staffRoles.includes(user.role?.toLowerCase())) return;
  await addDoc(collection(db, 'analytics_accesses'), {
    userId: user.id || user.email || 'Anonimo',
    role: user.role || 'cliente',
    timestamp: serverTimestamp()
  });
};

export const recordEntry = async (type, gender) => {
  await addDoc(collection(db, 'analytics_entries'), { type, gender, timestamp: serverTimestamp() });
};

export const recordIncident = async (type) => {
  await addDoc(collection(db, 'analytics_incidents'), { type, timestamp: serverTimestamp() });
};

export const streamAnalytics = (cb) => {
  // Ritorno mock per l'UI finchè non si usa una Function aggregante.
  const emptyAnalytics = {
    entries: [], incidents: [], iceRequests: 0, cansSoldBottles: 0, cansSoldExtra: 0, 
    sosAlerts: 0, uberCalls: 0, appAccesses: [], tableBookings: []
  };
  cb(emptyAnalytics);
  return () => {}; 
};

// ==========================================
// 👥 UTENTI & PR (FIRESTORE)
// ==========================================

export const streamUsers = (cb) => {
  const q = query(collection(db, 'users'));
  return onSnapshot(q, (snapshot) => {
    cb(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  });
};

export const updateUser = async (id, data) => {
  const userRef = doc(db, 'users', id);
  await updateDoc(userRef, data);
};

export const getUserProfile = async (id) => {
  const docSnap = await getDoc(doc(db, 'users', id));
  if(docSnap.exists()) return docSnap.data();
  return null;
};

// ==========================================
// 🛠 COMPATIBILITY STUBS (Funzioni Secondarie)
// ==========================================
export const recordIceRequest = async () => {};
export const recordCansSold = async () => {};
export const recordSOS = async () => {};
export const recordUberCall = async () => {};
export const streamStaffMessages = (cb) => { cb([]); return () => {}; };
export const sendStaffMessage = async () => {};
export const streamSystemState = (cb) => { cb({ emergencyMode: false }); return () => {}; };
export const updateSystemState = async () => {};
export const streamReviews = (cb) => { cb([]); return () => {}; };
export const saveReview = async () => {};
export const streamPrStats = (id, cb) => { cb({ revenue: 0 }); return () => {}; };
export const updatePrStats = async () => {};
export const validateEntryQR = async () => ({ success: true });
export const validateBottleQR = async () => ({ success: true });
export const redeemDrinkQR = async () => ({ success: true });
export const streamChat = (cb) => { cb([]); return () => {}; };
export const sendSilentMessage = async () => {};
export const streamServiceCalls = (cb) => { cb([]); return () => {}; };
export const completeServiceCall = async () => {};
export const saveReservation = async () => {};
export const triggerHelpCambusa = async () => {};
export const createUserProfile = async () => {};
export const recordTableBooking = () => {};
export const recordServiceCall = async (type, details = {}) => {
  console.log('Record Service Call via Firebase (Stub):', type, details);
};
