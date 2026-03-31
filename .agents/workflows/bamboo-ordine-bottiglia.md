---
description: Workflow per la catena del valore e logistica di un acquisto bottiglia al tavolo.
---
# Workflow Ordine logistico Bottiglie
1. Il Cliente, comodamente seduto al tavolo durante la serata, naviga in `/customer/bottles` dalla home.
2. Effettua il tap su una o più bottiglie generando il carrello e prosegue pagando tramite Checkout PWA (Apple Pay / Stripe).
3. Il sistema cloud di Bamboo registra il pagamento e genera un record in `BottleOrders`, contrassegnandolo inizialmente come `paid`.
4. Viene scatenato il workflow asincrono che inietta l'ordine al Runner.
5. In contemporanea viene generato il corrispondente `BottleDeliveryQRCodes` associato all'Id ordine. 
6. Un QR Code speciale per quell'ordine appare luminoso nella PWA del Cliente sottoforma di countdown.
7. Il Runner dello staff prepara le bottiglie in magazzino/bar e si reca al PR responsabile del tavolo.
8. Una volta raggiunti i clienti per la consegna fisica, il Runner o Capo PR USA LO SCANNER dalla dashboard admin PWA.
9. Scannerizza il QR code apparso prima.
10. La cassa verifica il matching, transita lo stato del QR a `scanned` e chiude permanentemente lo stato dell'ordine in `delivered`, garantendo anti-frode ai tavoli.
