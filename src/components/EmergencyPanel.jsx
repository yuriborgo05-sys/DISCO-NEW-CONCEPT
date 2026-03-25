import React from 'react';
import { Card } from './Card';
import { ShieldAlert, UserX, HeartPulse, Zap, Car, ShieldCheck } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { hapticFraud } from '../utils/haptics';

export function EmergencyPanel() {
  const { addNotification } = useNotification();

  const handleSOS = (type) => {
    hapticFraud();
    const msgs = {
      fight: "Rissa segnalata. La security è stata inviata alle tue coordinate.",
      medical: "Emergenza medica segnalata. Il personale di soccorso è in arrivo.",
      general: "Richiesta aiuto SOS inviata alla centrale operativa.",
      exit: "Richiesta scorta completata. Un addetto alla security ti aspetta all'uscita per accompagnarti all'auto/Uber."
    };
    addNotification("SOS INVIATO", msgs[type] || msgs.general, type === 'exit' ? "success" : "error");
  };

  const handleSafeExit = () => {
    hapticFraud();
    addNotification("RICHIESTA UBER & SCORTA", "Ricerca vettura in corso... La security è stata avvisata del tuo spostamento.", "warning");
    setTimeout(() => {
        handleSOS('exit');
    }, 3000);
  };

  return (
    <Card style={{ 
      background: 'rgba(255, 59, 92, 0.05)', 
      border: '1px solid rgba(255, 59, 92, 0.2)',
      padding: '1rem',
      marginTop: '1.5rem',
      marginBottom: '1rem'
    }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--error)', fontSize: '1rem', marginBottom: '1rem' }}>
        <ShieldAlert size={20} /> Centro Emergenze Bamboo
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <button className="sos-btn" onClick={() => handleSOS('fight')} style={{ fontSize: '0.8rem' }}>
          <UserX size={16} /> RISSA
        </button>
        <button className="sos-btn" onClick={() => handleSOS('medical')} style={{ background: 'linear-gradient(135deg, #ff9500, #ff5e00)', boxShadow: '0 4px 20px rgba(255, 149, 0, 0.4)', fontSize: '0.8rem' }}>
          <HeartPulse size={16} /> MALORE
        </button>
        <button className="sos-btn" onClick={handleSafeExit} style={{ background: 'linear-gradient(135deg, #5856d6, #af52de)', boxShadow: '0 4px 20px rgba(88, 86, 214, 0.4)', fontSize: '0.8rem', gridColumn: 'span 2' }}>
          <Car size={16} /> PORTAMI VIA (SCORTA & UBER)
        </button>
      </div>
      <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.8rem', textAlign: 'center' }}>
        L'abuso delle segnalazioni SOS comporta il ban immediato dal locale e sanzioni.
      </p>
    </Card>
  );
}
