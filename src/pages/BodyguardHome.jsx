import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { LogOut, ScanLine, CheckCircle2, AlertTriangle, Shield, Radio, Users, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function BodyguardHome() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [scanResult, setScanResult] = useState(null);
  const [alertSent, setAlertSent] = useState(false);

  const [exitLogs, setExitLogs] = useState([
    { id: '1', time: '02:15', name: 'Marco T.', status: 'Uscita Confermata', type: 'QR Uscita' },
    { id: '2', time: '01:48', name: 'Giulia R.', status: 'QR Non Valido', type: 'QR Uscita' },
    { id: '3', time: '01:22', name: 'Alessandro B.', status: 'Uscita Confermata', type: 'QR Uscita' },
  ]);

  // Hardware Scanner Integration (USB / HID)
  const qrBuffer = useRef('');
  const qrTimeout = useRef(null);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'Enter') {
        const code = qrBuffer.current.trim();
        if (code.length > 3) {
           const timeStr = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
           setScanResult({ status: 'ok', msg: `PASS VALIDO: ${code}` });
           setExitLogs(prev => [{ id: Date.now().toString(), time: timeStr, name: 'Cliente (Scanner HW)', status: 'Uscita Confermata', type: 'Hardware USB' }, ...prev]);
           setTimeout(() => setScanResult(null), 4000);
           addNotification('Scanner Ottico', 'Accesso rilevato automaticamente.', 'success');
        }
        qrBuffer.current = '';
        return;
      }

      if (e.key.length === 1) {
         qrBuffer.current += e.key;
         clearTimeout(qrTimeout.current);
         qrTimeout.current = setTimeout(() => { qrBuffer.current = ''; }, 150);
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
      clearTimeout(qrTimeout.current);
    };
  }, []);

  const handleScanExit = () => {
    const timeStr = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    setScanResult({ status: 'ok', msg: `QR Uscita Validato — ${timeStr}` });
    addNotification("Uscita Validata", "Il cliente può lasciare il locale.", "success");
    setExitLogs(prev => [{ id: Date.now().toString(), time: timeStr, name: 'Cliente Verificato', status: 'Uscita Confermata', type: 'QR Uscita' }, ...prev]);
    setTimeout(() => setScanResult(null), 4000);
  };

  const handleCallBackup = () => {
    setAlertSent(true);
    addNotification("🚨 RINFORZI CHIAMATI", "Tutti i bodyguard sono stati allertati sulla tua posizione.", "error");
    setTimeout(() => setAlertSent(false), 5000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, paddingBottom: '2rem' }}>
      
      {/* Header */}
      <header style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1rem 1.25rem', borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(30,30,40,0.9), rgba(10,10,15,0.95))',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            width: 44, height: 44, borderRadius: '14px',
            background: 'linear-gradient(135deg, #ff3b30, #cc2d25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px rgba(255,59,48,0.3)',
          }}>
            <Shield size={22} color="white" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 900, letterSpacing: '0.5px' }}>SECURITY</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', margin: 0 }}>{user?.name}</p>
          </div>
        </div>
        <button onClick={() => { logout(); navigate('/login'); }} style={{ 
          background: 'rgba(255,69,58,0.1)', border: 'none', color: '#ff453a', 
          padding: '0.5rem 0.8rem', borderRadius: '10px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700 
        }}>
          <LogOut size={16} /> ESCI
        </button>
      </header>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <Card style={{ padding: '1rem', textAlign: 'center', borderTop: '3px solid var(--success)' }}>
          <CheckCircle2 size={22} color="var(--success)" style={{ margin: '0 auto 0.4rem' }} />
          <strong style={{ fontSize: '1.4rem', display: 'block', color: 'white' }}>{exitLogs.filter(l => l.status.includes('Confermata')).length}</strong>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Uscite Validate</span>
        </Card>
        <Card style={{ padding: '1rem', textAlign: 'center', borderTop: '3px solid var(--error)' }}>
          <AlertTriangle size={22} color="var(--error)" style={{ margin: '0 auto 0.4rem' }} />
          <strong style={{ fontSize: '1.4rem', display: 'block', color: 'white' }}>{exitLogs.filter(l => !l.status.includes('Confermata')).length}</strong>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>QR Rifiutati</span>
        </Card>
      </div>

      {/* Scanner QR Uscita */}
      <Card style={{ padding: '1.25rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '1rem' }}>
          <ScanLine size={20} color="var(--accent-color)" /> Verifica QR Uscita
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Scansiona il QR del cliente che sta uscendo dal locale.
        </p>

        {scanResult && (
          <div style={{
            padding: '0.85rem', borderRadius: '14px', marginBottom: '1rem',
            background: scanResult.status === 'ok' ? 'rgba(16,185,129,0.1)' : 'rgba(255,59,48,0.1)',
            border: `1px solid ${scanResult.status === 'ok' ? 'rgba(16,185,129,0.3)' : 'rgba(255,59,48,0.3)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          }}>
            <CheckCircle2 size={18} color="var(--success)" />
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--success)' }}>{scanResult.msg}</span>
          </div>
        )}

        <button onClick={handleScanExit} style={{
          width: '100%', padding: '1rem', borderRadius: '16px', border: 'none',
          background: 'linear-gradient(135deg, var(--accent-color), #4f46e5)',
          color: 'white', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(99,102,241,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
        }}>
          <ScanLine size={20} /> SCANSIONA QR USCITA
        </button>
      </Card>

      {/* Allerta Rapida */}
      <Card style={{ padding: '1.25rem', background: 'rgba(255,59,48,0.04)', border: '1px solid rgba(255,59,48,0.15)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '1rem', color: 'var(--error)' }}>
          <Radio size={20} /> Allerta Rapida
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Invia un alert immediato a tutti i bodyguard in servizio.
        </p>

        {!alertSent ? (
          <button onClick={handleCallBackup} style={{
            width: '100%', padding: '1rem', borderRadius: '16px', border: 'none',
            background: 'linear-gradient(135deg, #ff3b30, #cc2200)',
            color: 'white', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(255,59,48,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          }}>
            <Radio size={20} /> RICHIAMO RINFORZI
          </button>
        ) : (
          <div style={{
            width: '100%', padding: '1rem', borderRadius: '16px',
            background: 'rgba(255,59,48,0.15)', border: '1px solid rgba(255,59,48,0.3)',
            color: '#ff453a', fontWeight: 800, fontSize: '0.85rem', textAlign: 'center',
            animation: 'pulse 1.5s infinite',
          }}>
            🚨 ALLERTA IN CORSO — Rinforzi in arrivo
          </div>
        )}
      </Card>

      {/* Storico uscite */}
      <Card style={{ padding: '1rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '1rem' }}>
          <Clock size={18} /> Registro Uscite
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '300px', overflowY: 'auto' }}>
          {exitLogs.map(log => (
            <div key={log.id} style={{ 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '0.75rem', borderRadius: '10px',
              background: 'rgba(255,255,255,0.02)',
              borderLeft: `3px solid ${log.status.includes('Confermata') ? 'var(--success)' : 'var(--error)'}`,
            }}>
              <div>
                <strong style={{ fontSize: '0.85rem', display: 'block' }}>{log.name}</strong>
                <span style={{ fontSize: '0.7rem', color: log.status.includes('Confermata') ? 'var(--success)' : 'var(--error)', fontWeight: 600 }}>{log.status}</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{log.time}</span>
            </div>
          ))}
        </div>
      </Card>

      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 59, 48, 0.4); }
          70% { box-shadow: 0 0 0 12px rgba(255, 59, 48, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 59, 48, 0); }
        }
      `}</style>
    </div>
  );
}
