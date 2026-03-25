/**
 * BAMBOO SYSTEM (TOO MUCH) - Database Schema e Modello Dati Base
 * Punto 26 / 27 / 28 delle specifiche del cliente
 */

// ENTITÀ / COLLEZIONI
export const collections = {
  Users: [
    { id: 'usr_1', role: 'cliente', firstName: 'Mario', lastName: 'Rossi', gender: 'Uomo', age: 24, is_checked_in: false, created_at: Date.now() },
    { id: 'usr_2', role: 'pr', firstName: 'Alex', lastName: 'Rossi', generated_revenue: 1200 },
  ],
  TableReservations: [
    { id: 'tbl_1', user_id: 'usr_1', pr_id: 'usr_2', event_id: 'evt_1', people_count: 5, minimum_spend: 200, status: 'pending' /* pending, validated, no-show */ }
  ],
  CheckIns: [],
  EntryQRCodes: [
    { id: 'qr_1', user_id: 'usr_1', qr_string: 'TM-BAMBOO-VIP-123', status: 'active' /* active, used, expired */ }
  ],
  GiftDrinks: [
    { id: 'gft_1', user_id: 'usr_1', status: 'available' /* available, redeemed */ }
  ],
  BottleOrders: [
     // Ordine inseribile SOLO se associato a check-in confermato o se l'utente risulta IN LOCALE.
    { id: 'ord_1', user_id: 'usr_1', table_id: 'tbl_1', total_amount: 350, items: [{id: 2, quantity: 1}], status: 'paid' /* pending_payment, paid, preparing, delivered */ }
  ],
  BottleDeliveryQRCodes: [],
  ImageGirlCalls: [
    { id: 'call_1', head_pr_id: 'usr_3', image_girl_id: 'usr_4', table_id: 'tbl_1', message: "Facciamo festa!", status: 'sent' /* sent, read, closed */ }
  ]
};

// RELAZIONI E BUSINESS RULES (PUNTI 5 e 6 DELL'OBBIETTIVO)
export const validateEntryAndUnlockBottles = (userId, qrString) => {
   // 1. Cerca il QR in EntryQRCodes
   const qr = collections.EntryQRCodes.find(q => q.qr_string === qrString && q.user_id === userId);
   if(!qr || qr.status !== 'active') return { success: false, msg: 'QR non valido o già usato' };
   
   // 2. Transizione stato Entità (Regole di ingresso pre vs post)
   qr.status = 'used'; // Non riutilizzabile e irrevocabile
   
   // 3. Modifica stato utente per abilitare Checkout Bottiglie dall'app
   const user = collections.Users.find(u => u.id === userId);
   if(user) user.is_checked_in = true;

   collections.CheckIns.push({ id: Date.now(), user_id: userId, timestamp: Date.now() });
   
   return { success: true, msg: 'Ingresso registrato. Area Ordine Bottiglie app cliente SBLOCCATA.' };
};

export const redeemGiftDrink = (userId) => {
   const gift = collections.GiftDrinks.find(g => g.user_id === userId && g.status === 'available');
   if(!gift) return false;
   gift.status = 'redeemed'; // Non più disponibile per sessioni future
   return true;
};
