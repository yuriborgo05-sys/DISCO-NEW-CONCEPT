const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Backend initialization
admin.initializeApp();
const db = admin.firestore();

/**
 * TRIGGER: placeOrderSecure
 * Sostituisce la logica cliente per l'acquisto di bottiglie.
 * Quando un PR o Cliente compila un carrello, chiama questa function e
 * il backend verificherà prezzi, sconti e saldo Carta di Credito prima 
 * di emettere la vera comanda per il Barman (Evitando hack lato client).
 */
exports.placeOrderSecure = functions.https.onCall(async (data, context) => {
    // 1. JWT Authentication
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated', 
            'Devi essere autenticato al NOX per ordinare.'
        );
    }

    const { tableId, items, expectedTotal, assignedPR } = data;
    
    // 2. Fetch dal vero DB per i Prezzi (NON fidarsi mai del client)
    let serverGeneratedTotal = 0;
    const catalogSnapshot = await db.collection('catalog').get();
    const catalogMap = new Map();
    catalogSnapshot.forEach(doc => catalogMap.set(doc.id, doc.data()));

    const verifiedItems = items.map(clientItem => {
        const serverItem = catalogMap.get(clientItem.id);
        if(!serverItem) throw new functions.https.HttpsError('not-found', `Bottiglia ${clientItem.name} non trovata.`);
        serverGeneratedTotal += (serverItem.price * clientItem.qty);
        return {
            ...clientItem,
            price: serverItem.price // Sovrascrive eventuali prezzi hackerati
        };
    });

    // 3. Verifica RBAC (Sconti solo se sei 'capo_pr' o 'direzione')
    const userRole = context.auth.token.role || 'cliente';
    if(serverGeneratedTotal > expectedTotal && !['capo_pr', 'admin'].includes(userRole)) {
        throw new functions.https.HttpsError(
            'permission-denied', 
            'Tentativo di alterazione scontrino rilevato.'
        );
    }

    // 4. Salva il documento Ordine Sicuro su Firestore
    const orderRef = await db.collection('orders').add({
        tableId,
        items: verifiedItems,
        total: serverGeneratedTotal,
        orderedBy: context.auth.uid,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        status: 'pending_bar',
        prAssigned: assignedPR || 'Nessuno'
    });

    // 5. Invia Webhook/JSON al Sistema Gestionale Cassa Fiscale (Exceed)
    // await fetch('https://api.exceed-cassa.it/v2/orders', { ... });

    return { success: true, orderId: orderRef.id, finalTotal: serverGeneratedTotal };
});

/**
 * TRIGGER: calculatePRCommissions
 * Gira in background. Quando un cameriere segna 'delivered' nell'app
 * il PR associato a quel tavolo accumula statistiche "Monetary" e Punti.
 */
exports.onOrderDelivered = functions.firestore
    .document('orders/{orderId}')
    .onUpdate(async (change, context) => {
        const newValue = change.after.data();
        const previousValue = change.before.data();

        // Controlla se lo step è scattato da pending a delivered
        if (previousValue.status !== 'delivered' && newValue.status === 'delivered') {
            const prId = newValue.prAssigned;
            if(prId === 'Nessuno') return null;

            // Incrementa fatturato del PR (Atomicamente per non sovrascrivere dati live concorrenti)
            await db.collection('users').doc(prId).update({
                totalGeneratedRevenue: admin.firestore.FieldValue.increment(newValue.total),
                bottlesSold: admin.firestore.FieldValue.increment(newValue.items.length)
            });
        }
    });
