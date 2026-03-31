import React from 'react';
import { useNoxStore } from '../../store';

export function CustomerStatusCard({ user }) {
  const { hasEntered, liveDuration, userTable, prAssigned } = useNoxStore();

  return (
    <div style={{
      background: hasEntered
        ? 'linear-gradient(135deg, var(--success-bg), rgba(0,0,0,0.2))'
        : 'linear-gradient(135deg, var(--accent-glow), rgba(0,0,0,0.2))',
      border: `1px solid ${hasEntered ? 'rgba(0,208,132,0.3)' : 'rgba(124,58,237,0.3)'}`,
      borderRadius: '20px', padding: '1.25rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
    }}>
      <div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0 0 0.2rem 0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {hasEntered ? 'Stato Ingresso' : 'Prenotazione'}
        </p>
        <strong style={{ fontSize: '1.1rem', color: hasEntered ? 'var(--success)' : 'var(--text-primary)', display: 'block' }}>
          {hasEntered ? '✅ Entrato' : '⏳ In attesa di ingresso'}
        </strong>
        {hasEntered && <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 600 }}>Tempo: {liveDuration} min</span>}
      </div>
      <div style={{ textAlign: 'right' }}>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: '0 0 0.2rem 0' }}>{userTable || 'Pista'}</p>
        <strong style={{ color: 'var(--accent-light)', fontSize: '0.85rem' }}>PR: {user?.prAssigned || prAssigned || 'Staff'}</strong>
      </div>
    </div>
  );
}
