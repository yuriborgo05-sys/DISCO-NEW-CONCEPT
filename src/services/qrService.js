/**
 * QR Service — Sistema QR Entrata/Uscita collegato a Exceed
 * 
 * Flusso:
 * 1. generateEntryQR(userId, ticketType) → crea QR ingresso
 * 2. validateEntryQR(qrCode) → registra ingresso, genera QR uscita
 * 3. validateExitQR(qrCode) → registra uscita
 * 
 * Stati tracciabili:
 * - pending: QR creato, non ancora usato
 * - entry_validated: ingresso confermato
 * - exit_enabled: QR uscita abilitato
 * - exit_completed: uscita registrata
 * - invalid: QR non riconosciuto
 * - already_used: QR già consumato
 */

// In-memory store (in produzione: Firestore)
const qrStore = new Map();
const auditLog = [];

/**
 * Genera un QR di ingresso per un utente
 * @param {string} userId - ID dell'utente
 * @param {'omaggio'|'pagamento'} ticketType - Tipo di titolo di accesso
 * @returns {object} QR entry data
 */
export function generateEntryQR(userId, ticketType = 'omaggio') {
  const qrCode = `ENTRY-${userId}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  
  const entry = {
    qrCode,
    userId,
    ticketType,
    status: 'pending',
    createdAt: Date.now(),
    validatedAt: null,
    exitQR: null,
  };
  
  qrStore.set(qrCode, entry);
  
  addAuditLog('QR_ENTRY_CREATED', { qrCode, userId, ticketType });
  
  return entry;
}

/**
 * Valida un QR di ingresso alla porta
 * @param {string} qrCode - QR scansionato
 * @param {string} operator - Nome dell'operatore (cassa)
 * @returns {object} Risultato validazione + QR uscita generato
 */
export function validateEntryQR(qrCode, operator = 'Cassa') {
  const entry = qrStore.get(qrCode);
  
  if (!entry) {
    addAuditLog('QR_INVALID', { qrCode, operator });
    return { success: false, status: 'invalid', message: 'QR non riconosciuto' };
  }
  
  if (entry.status !== 'pending') {
    addAuditLog('QR_ALREADY_USED', { qrCode, operator, previousStatus: entry.status });
    return { success: false, status: 'already_used', message: 'QR già utilizzato' };
  }
  
  // Genera QR uscita
  const exitQR = `EXIT-${entry.userId}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  
  entry.status = 'entry_validated';
  entry.validatedAt = Date.now();
  entry.exitQR = exitQR;
  
  // Registra QR uscita nello store
  qrStore.set(exitQR, {
    qrCode: exitQR,
    userId: entry.userId,
    entryQR: qrCode,
    status: 'exit_enabled',
    createdAt: Date.now(),
    validatedAt: null,
  });
  
  addAuditLog('ENTRY_VALIDATED', { qrCode, exitQR, userId: entry.userId, operator });
  
  return {
    success: true,
    status: 'entry_validated',
    message: 'Ingresso validato con successo',
    exitQR,
    userId: entry.userId,
    ticketType: entry.ticketType,
  };
}

/**
 * Valida un QR di uscita (bodyguard)
 * @param {string} qrCode - QR uscita scansionato
 * @param {string} operator - Nome del bodyguard
 * @returns {object} Risultato validazione
 */
export function validateExitQR(qrCode, operator = 'Bodyguard') {
  const exit = qrStore.get(qrCode);
  
  if (!exit) {
    addAuditLog('EXIT_QR_INVALID', { qrCode, operator });
    return { success: false, status: 'invalid', message: 'QR uscita non riconosciuto' };
  }
  
  if (exit.status === 'exit_completed') {
    addAuditLog('EXIT_QR_ALREADY_USED', { qrCode, operator });
    return { success: false, status: 'already_used', message: 'QR uscita già utilizzato' };
  }
  
  if (exit.status !== 'exit_enabled') {
    addAuditLog('EXIT_QR_WRONG_STATUS', { qrCode, operator, status: exit.status });
    return { success: false, status: 'invalid', message: `QR in stato non valido: ${exit.status}` };
  }
  
  exit.status = 'exit_completed';
  exit.validatedAt = Date.now();
  
  addAuditLog('EXIT_VALIDATED', { qrCode, userId: exit.userId, operator });
  
  return {
    success: true,
    status: 'exit_completed',
    message: 'Uscita registrata con successo',
    userId: exit.userId,
  };
}

/**
 * @returns {Array} Storico audit trail
 */
export function getAuditLog() {
  return [...auditLog];
}

/**
 * @returns {Map} Stato attuale di tutti i QR
 */
export function getQRStore() {
  return new Map(qrStore);
}

function addAuditLog(event, data) {
  auditLog.push({
    id: Date.now().toString(),
    event,
    timestamp: Date.now(),
    time: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    ...data,
  });
}
