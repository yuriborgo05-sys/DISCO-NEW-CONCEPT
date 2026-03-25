import React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';

export function ForgotPassword() {
  const navigate = useNavigate();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '1rem', flex: 1, justifyContent: 'center' }}>
       <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', alignSelf: 'flex-start', marginBottom: '2rem', cursor: 'pointer', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
         <ArrowLeft size={20} /> Torna indietro
       </button>
       <Card style={{ padding: '2.5rem 1.5rem', textAlign: 'center' }}>
          <Mail size={48} color="var(--accent-color)" style={{ marginBottom: '1rem' }} className="icon-glow" />
          <h2 style={{ marginBottom: '0.5rem' }}>Recupera Password</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Inserisci l'email associata al tuo account per ricevere il link di ripristino sicuro.</p>
          <input type="email" placeholder="Indirizzo Email" className="input-base" style={{ marginBottom: '1rem' }} />
          <Button variant="primary" style={{ width: '100%' }} onClick={() => navigate('/login')}>Invia Link</Button>
       </Card>
    </div>
  );
}
