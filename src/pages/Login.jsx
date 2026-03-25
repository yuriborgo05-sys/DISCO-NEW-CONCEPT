import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Sparkles, User, KeyRound, Music, Clock } from 'lucide-react';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('real'); // Default to 'real' for production
  const [role, setRole] = useState('cliente');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      let profile;
      if (mode === 'demo') {
        login(role);
        profile = { role };
      } else {
        profile = await login(email, password);
      }

      // Role-based redirection logic
      const targetRole = profile?.role || 'cliente';
      
      const routes = {
        cliente: '/customer',
        pr: '/pr',
        head_pr: '/head-pr',
        image_girl: '/image-girl',
        waiter: '/waiter',
        admin: '/admin',
        direzione: '/direzione',
        fotografo: '/photographer',
        bodyguard: '/admin', // Security usually uses Admin Tools
        cashier: '/admin'
      };

      navigate(routes[targetRole] || '/customer');
    } catch (err) {
      setError('Credenziali non valide o errore di connessione.');
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card style={{ width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <Sparkles className="icon-glow" size={32} color="var(--accent-color)" style={{ margin: '0 auto 1rem' }} />
          <h2>Accedi a Bamboo</h2>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
            <button onClick={() => setMode('demo')} style={{ padding: '0.4rem 0.8rem', borderRadius: '15px', border: 'none', background: mode === 'demo' ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)', color: 'white', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>QUICK DEMO</button>
            <button onClick={() => setMode('real')} style={{ padding: '0.4rem 0.8rem', borderRadius: '15px', border: 'none', background: mode === 'real' ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)', color: 'white', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>REAL AUTH</button>
          </div>
        </div>

        {error && <p style={{ color: 'var(--error)', textAlign: 'center', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mode === 'demo' ? (
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="input-base"
              style={{ padding: '1rem', appearance: 'none' }}
            >
              <option value="cliente" style={{color: 'black'}}>Cliente</option>
              <option value="pr" style={{color: 'black'}}>PR Normale</option>
              <option value="capo_pr" style={{color: 'black'}}>Capo PR</option>
              <option value="ragazza_immagine" style={{color: 'black'}}>Ragazza Immagine</option>
              <option value="cameriere" style={{color: 'black'}}>Cameriere di Sala</option>
              <option value="admin" style={{color: 'black'}}>Cassa / Security / Admin</option>
              <option value="direzione" style={{color: 'black'}}>Direzione / Analytics KPI</option>
              <option value="fotografo" style={{color: 'black'}}>Fotografo Ufficiale</option>
            </select>
          ) : (
            <>
              <input type="email" placeholder="Email aziendale / cliente" className="input-base" value={email} onChange={e => setEmail(e.target.value)} required />
              <input type="password" placeholder="Password" className="input-base" value={password} onChange={e => setPassword(e.target.value)} required />
            </>
          )}

          <Button type="submit" variant="primary" style={{ marginTop: '0.5rem' }}>
            {mode === 'demo' ? 'Entra in Demo' : 'Accedi'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/register')} style={{ marginTop: '0.5rem' }}>Nuovo Cliente? Registrati</Button>
        </form>

        {/* ─── PRE-PARTY "GET READY" EXPERIENCE ─── */}
        <div style={{ marginTop: '2.5rem', padding: '1rem', borderTop: '1px solid var(--border-card)', textAlign: 'center' }}>
           <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Music size={16} color="var(--accent-color)" /> Bamboo Experience
           </h3>
           <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Preparati alla serata con la playlist ufficiale di <strong>DJ Bamboo</strong>.</p>
           <a 
            href="https://spotify.com" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
              background: '#1DB954', color: 'black', padding: '0.6rem', borderRadius: '30px',
              fontSize: '0.8rem', fontWeight: 800, textDecoration: 'none'
            }}
           >
             ASCOLTA SU SPOTIFY
           </a>
           <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--warning)', fontSize: '0.7rem', fontWeight: 600 }}>
              <Clock size={14} /> APERTURA TRA: 02:45:12
           </div>
        </div>
        <button onClick={() => navigate('/forgot-password')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', width: '100%', marginTop: '1.5rem', cursor: 'pointer', textDecoration: 'underline' }}>
           Password Dimenticata?
        </button>
      </Card>
    </div>
  );
}
