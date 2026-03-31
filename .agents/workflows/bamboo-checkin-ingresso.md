---
description: Workflow d'ingresso PWA con validazione del QR in cassa.
---
# Workflow Check-In Ingresso Cliente
Questo workflow è pensato per automatizzare l'operatore di cassa o sicurezza tramite la PWA Bamboo al momento dell'ingresso nel locale.

1. L'Admin accede al path `/admin` sulla dashboard PWA e seleziona il bottone "Avvia Fotocamera".
2. Scannerizza il string format `EntryQRCode` inquadrato sullo smartphone del Cliente (visibile cliccando l'apposita card in Area Profile).
3. Il sistema richiama la funzione `validateEntryAndUnlockBottles(userId, qrString)` del modulo dbSchema API.
4. L'algoritmo verifica a DB se lo `status` del QRCode in questione risulta strettamente `active` (impedendo screenshot riciclabili).
5. Se l'esito è valido:
   - Aggiorna il nodo del DB `status` transitandolo in `used`.
   - Genera record storico d'audit in `CheckIns` marcando data e `admin_id`.
   - Scatena Webhook real-time per sbloccare l'interfaccia cliente: imposta globalmente `is_checked_in: true` nel suo utente.
   // turbo
   6. Echo visivo con Toast verde di Success sulla dashboard dell'Admin.
7. Da questo esatto istante l'app del cliente abilita i bottoni in `BottleCatalog` (Business Rule N° 6 soddisfatta e protetta).
