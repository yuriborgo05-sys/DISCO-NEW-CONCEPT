// Haptic Feedback Utility (Full version for build stability)

export const vibrate = (pattern = 50) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

export const vibrateSuccess = () => vibrate([30, 50, 30]);
export const vibrateError = () => vibrate([100, 50, 100]);
export const vibrateWarning = () => vibrate(100);
export const vibrateClick = () => vibrate(10);

// Specialized Aliases for Bamboo
export const hapticCheckIn = () => vibrateSuccess();
export const hapticFraud = () => vibrateError();
export const hapticSoftPop = () => vibrate(10);
export const hapticSOS = () => vibrate([500, 100, 500, 100, 500]);
export const hapticIce = () => vibrate([50, 50, 50]);

// Missing exports that caused the Identifier.bind error
export const hapticBottleDelivered = () => vibrateSuccess();
export const hapticGiftDrink = () => vibrate([30, 30, 30]);
