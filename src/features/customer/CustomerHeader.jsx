import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function CustomerHeader({ privacyShield, setPrivacyShield }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header style={{ 
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
      marginBottom: '1rem', padding: '0.75rem', borderRadius: '24px', 
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
      backdropFilter: 'blur(20px)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div 
          onClick={() => setPrivacyShield(!privacyShield)}
          style={{ 
            width: '52px', height: '52px', background: 'var(--accent-gradient)', 
            borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 25px rgba(124,58,237,0.4)', position: 'relative', cursor: 'pointer',
            transition: 'transform 0.2s', transform: privacyShield ? 'scale(0.95)' : 'scale(1)'
          }}
        >
          <span style={{ fontWeight: 900, fontSize: '1.4rem', color: 'white' }}>{user?.name?.charAt(0) || 'U'}</span>
        </div>
        <div>
          <h2 style={{ fontSize: '1.4rem', margin: 0, fontWeight: 900, letterSpacing: '0.5px' }}>{privacyShield ? 'Ospite VIP' : user?.name?.split(' ')[0]}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '2px 0 0 0' }}>Benvenuto al NOX</p>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button onClick={() => { logout(); navigate('/login'); }} style={{ 
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', 
          color: 'white', padding: '0.6rem', borderRadius: '14px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44
        }}>
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
