import React from 'react';
import { Card } from './Card';
import { ShieldAlert, ShieldCheck, HeartPulse, Car } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { useNox } from '../context/NoxContext';
import { hapticFraud } from '../utils/haptics';

export function EmergencyPanel() {
  const { addNotification } = useNotification();
  const { config } = useNox();

  const handleSOS = (type) => {
    hapticFraud();
    const msgs = {
      security: "Allerta sicurezza inviata. La security è stata attivata nella tua zona.",
      medical: "Emergenza medica segnalata. Il personale di soccorso è in arrivo.",
      escort: "Richiesta scorta completata. Un addetto alla security ti accompagnerà in sicurezza."
    };
    addNotification(
      "SOS INVIATO", 
      msgs[type] || "Richiesta aiuto SOS inviata.", 
      type === 'escort' ? "success" : "error"
    );
  };

  const handleSafeExit = () => {
    hapticFraud();
    addNotification("SCORTA SICURA", "Ricerca vettura in corso... La security è stata avvisata.", "warning");
    setTimeout(() => handleSOS('escort'), 3000);
  };

  const btnBase = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.6rem',
    padding: '1rem 1.25rem',
    borderRadius: '16px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '0.82rem',
    letterSpacing: '0.03em',
    color: 'white',
    transition: 'all 0.2s ease',
    width: '100%',
  };

  return (
    <Card style={{ 
      background: 'rgba(255, 59, 92, 0.04)', 
      border: '1px solid rgba(255, 59, 92, 0.15)',
      padding: '1rem',
      marginTop: '1.5rem',
      marginBottom: '1rem'
    }}>
      <h3 style={{ 
        display: 'flex', alignItems: 'center', gap: '0.5rem', 
        color: 'var(--error)', fontSize: '0.9rem', marginBottom: '1rem',
        fontWeight: 800, letterSpacing: '0.02em'
      }}>
        <ShieldAlert size={18} /> Emergenze
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {/* Sicurezza */}
        <button 
          onClick={() => handleSOS('security')} 
          style={{ 
            ...btnBase, 
            background: 'linear-gradient(135deg, #ff3b30, #cc2d25)',
            boxShadow: '0 4px 16px rgba(255, 59, 48, 0.35)',
          }}
        >
          <ShieldCheck size={20} /> SICUREZZA
        </button>

        {/* Malore */}
        <button 
          onClick={() => handleSOS('medical')} 
          style={{ 
            ...btnBase, 
            background: 'linear-gradient(135deg, #ff9500, #e68600)',
            boxShadow: '0 4px 16px rgba(255, 149, 0, 0.35)',
          }}
        >
          <HeartPulse size={20} /> MALORE
        </button>

        {/* Scorta Sicura */}
        <button 
          onClick={handleSafeExit} 
          style={{ 
            ...btnBase, 
            background: 'linear-gradient(135deg, #5856d6, #4a48b8)',
            boxShadow: '0 4px 16px rgba(88, 86, 214, 0.35)',
          }}
        >
          <Car size={20} /> SCORTA SICURA
        </button>
      </div>

      <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '0.8rem', textAlign: 'center', opacity: 0.7 }}>
        L'abuso delle segnalazioni comporta il ban immediato.
      </p>
    </Card>
  );
}
