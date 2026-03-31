---
description: Workflow real-time di invio chiamate a Ragazze Immagine partendo dal Capo PR.
---
# Workflow Chiamata Immagine da Direzionale
1. Il Capo PR sorveglia l'andamento del club dalla vista `HeadPRHome`.
2. Identifica un tavolo alto spendente che necessita intrattenimento (es. `Tavolo VIP 1`).
3. Seleziona il target dal selettore e pigia `Chiama Ragazze Immagine`.
4. Un record in `ImageGirlCalls` viene propagato all'istante verso Firebase con status = `sent` potendo contenere max 999 string characters inviati assieme al comando.
5. Tutte le istanze PWA sui telefoni delle Ragazze Immagine ricevono una notifica Firebase Cloud Messaging in background e/o una Pulse Animation CSS3 (Card rossa vista nell'app).
6. La prima Ragazza Immagine a cliccare "Segna come Letta" scatena l'aggiornamento real-time transitando lo status in `read` ed eleggendosi assegnataria (mostrando riscontro al Capo PR senza invadenza in pista).
