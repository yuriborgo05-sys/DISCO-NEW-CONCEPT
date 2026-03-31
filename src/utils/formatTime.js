/**
 * Formats a Firestore timestamp accurately across the "Billionaire Ecosystem".
 * Handles both ISO Strings (legacy) and Firestore Timestamp Objects.
 * @param {any} timestamp 
 * @returns {string} Formatted time (HH:MM)
 */
export function formatTime(timestamp) {
  if (!timestamp) return '--:--';
  
  // Handle Firestore Timestamp object
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  }

  // Handle seconds property if .toDate() is missing
  if (timestamp.seconds) {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  }

  // Handle JavaScript Date object
  if (timestamp instanceof Date) {
    return timestamp.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  }
  
  // Handle ISO string fallback
  if (typeof timestamp === 'string') {
    return timestamp.split('T')[1]?.slice(0, 5) || '--:--';
  }
  
  return '--:--';
}
