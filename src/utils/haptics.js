/**
 * Bamboo Haptic Engine — Centralized Vibration Patterns
 * Distinct tactile signatures for each key event.
 */

const vibrate = (pattern) => {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};

/** Double soft tap — Check-in OK */
export const hapticCheckIn = () => vibrate([100, 50, 100]);

/** Festive rhythm — Bottiglia consegnata */
export const hapticBottleDelivered = () => vibrate([50, 30, 50, 30, 200]);

/** Long single buzz — Frode / errore grave */
export const hapticFraud = () => vibrate([500]);

/** Triple light tap — Drink omaggio riscattato */
export const hapticGiftDrink = () => vibrate([80, 40, 80, 40, 80]);

/** Single soft pop — Azione generica (aggiunta al carrello) */
export const hapticSoftPop = () => vibrate([40]);

/** Double tap light — Punti guadagnati */
export const hapticPoints = () => vibrate([60, 30, 60]);
