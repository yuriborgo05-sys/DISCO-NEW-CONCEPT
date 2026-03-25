import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { EmergencyPanel } from '../components/EmergencyPanel';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { LogOut, ScanLine, CheckCircle2, AlertCircle, Users, History, QrCode, Wine, Star, Zap, ShieldAlert, Signal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import { playCheckInSound, playBottleDeliveredSound, playGiftDrinkSound, playFraudAlertSound } from '../utils/audio';
import { hapticCheckIn, hapticBottleDelivered, hapticGiftDrink, hapticFraud } from '../utils/haptics';
import { validateEntryQR, validateBottleQR, redeemDrinkQR, updateSystemState } from '../services/db';
import { formatTime } from '../utils/formatTime';

export function AdminHome() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState(null);
  const { addNotification } = useNotification();
  
  // Dummy local state to preserve history during the session
  const [history, setHistory] = useState([
     { id: '1', time: '23:15:42', date: new Date().toLocaleDateString(), event: 'Venerdì TOO MUCH', venue: 'Bamboo', guestName: 'Marco T.', status: 'Entrato regolarmente', operator: user?.name || 'Admin', type: 'QR Ingresso' },
     { id: '2', time: '23:10:05', date: new Date().toLocaleDateString(), event: 'Venerdì TOO MUCH', venue: 'Bamboo', guestName: 'Giulia R.', status: 'Annullato (Bannata)', operator: user?.name || 'Admin', type: 'QR Ingresso' }
  ]);  const performRealScan = async (type, targetId) => {
    const timeStr = formatTime({ seconds: Date.now() / 1000 });

    try {
      let data;
      if (type === 'ingresso') {
        data = await validateEntryQR(targetId || 'test_user_id');
        playCheckInSound(); hapticCheckIn();
        setScanResult({ status: 'ok', msg: `Ingresso Validato: ${data.name || 'Ospite'} (${timeStr})` });
        addNotification("Accesso Consentito", "Il QR Visitatore è stato validato con successo.", "success");
      }
      if (type === 'bottle') {
        data = await validateBottleQR(targetId || 'test_order_id');
        playBottleDeliveredSound(); hapticBottleDelivered();
        setScanResult({ status: 'ok', msg: `Bottiglia Consegnata! (${timeStr})` });
        addNotification("Ordine Evaso", "Consegna confermata. Il QR Bottiglia Univoco è stato invalidato.", "success");
      }
      if (type === 'drink') {
        data = await redeemDrinkQR(targetId || 'test_user_id');
        playGiftDrinkSound(); hapticGiftDrink();
        setScanResult({ status: 'ok', msg: `Drink Omaggio Riscattato! (${timeStr})` });
        addNotification("Drink Riscattato", "Promozione attivata, drink assegnato in cassa.", "success");
      }

      const newLog = { 
        id: Date.now().toString(), 
        time: timeStr, 
        date: new Date().toLocaleDateString(), 
        event: 'Venerdì TOO MUCH', 
        venue: 'Bamboo', 
        guestName: data?.name || 'Utente Verificato', 
        status: 'Validato OK', 
        operator: user?.name || 'Admin', 
        type: type.toUpperCase() 
      };
      setHistory(prev => [newLog, ...prev]);
    } catch (err) {
      playFraudAlertSound(); hapticFraud();
      setScanResult({ status: 'error', msg: `ERRORE: ${err.message} (${timeStr})` });
      addNotification("Allerta Validazione", err.message, "error");
    }
    setTimeout(() => setScanResult(null), 4000);
  };

   const triggerFlashlightHack = async () => {
       hapticCheckIn();
       addNotification('STROBO ATTIVO', 'Strobo attivato sui telefoni in Pista', 'error');
       await updateSystemState({ strobeMode: true });
       setTimeout(() => updateSystemState({ strobeMode: false }), 4000);
   };

   const triggerHackerMode = async () => {
     hapticFraud();
     addNotification('HACKER MODE', 'Disagio segnale sincronizzato su tutti i client', 'warning');
     await updateSystemState({ hackerMode: true });
     setTimeout(() => {
         updateSystemState({ hackerMode: false });
         addNotification('HACKER MODE', 'Segnale ripristinato (Momento Instagram)', 'success');
     }, 10000);
   };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, paddingBottom: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>Strumenti Cassa</h2>
          <select className="input-base" style={{ padding: '0.4rem', marginTop: '0.3rem', fontSize: '0.85rem' }}>
             <option style={{color:'black'}}>Evento: Venerdì TOO MUCH</option>
             <option style={{color:'black'}}>Evento: Sabato Prive Club</option>
             <option style={{color:'black'}}>Evento: Domenica Relax</option>
          </select>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.5rem' }}>Operatore: {user?.name}</p>
        </div>
        <button onClick={() => { logout(); navigate('/login'); }} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <LogOut size={24} />
        </button>
      </header>

      {/* Advanced Scanner Mock */}
      <Card style={{ padding: '1.25rem 1rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
           <ScanLine size={24} color="var(--accent-color)" /> Validazione Terminale
        </h3>

        {scanResult && (
          <div style={{ 
            padding: '1rem', 
            borderRadius: '12px', 
            background: scanResult.status === 'ok' ? 'var(--success-bg)' : 'var(--error-bg)',
            border: `1px solid ${scanResult.status === 'ok' ? 'rgba(0,208,132,0.3)' : 'rgba(255,59,92,0.3)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
            animation: 'fadeIn 0.2s ease-out',
            marginBottom: '1rem'
          }}>
            {scanResult.status === 'ok' ? <CheckCircle2 color="var(--success)" /> : <AlertCircle color="var(--error)" />}
            <span style={{ fontWeight: 800, fontSize: '0.85rem', color: scanResult.status === 'ok' ? 'var(--success)' : 'var(--error)' }}>{scanResult.msg}</span>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Accordion title="1. Scansione Ingressi Porta" icon={<QrCode size={16} />} defaultOpen={true} borderColor="var(--success)">
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Verifica ticket e validazione code.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
                <Button variant="secondary" onClick={() => performRealScan('ingresso')} style={{ borderColor: 'var(--success)', color: 'var(--success)', padding: '0.85rem 0.5rem', fontSize: '0.8rem' }}>✓ Scansiona QR Ingresso</Button>
            </div>
          </Accordion>
 
          <Accordion title="2. Validazione Drink Omaggio" icon={<Wine size={16} />} borderColor="var(--warning)">
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Riscatto premium pass o consumazione omaggio in cassa.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
                <Button variant="secondary" onClick={() => performRealScan('drink')} style={{ borderColor: 'var(--warning)', color: 'var(--warning)', padding: '0.85rem 0.5rem', fontSize: '0.8rem' }}>🍹 Scansiona QR Drink</Button>
            </div>
          </Accordion>
 
          <Accordion title="3. Consegna Bottiglie" icon={<Star size={16} />} borderColor="var(--accent-color)">
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Invalidazione del QR unico al momento del servizio al tavolo.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
                <Button variant="secondary" onClick={() => performRealScan('bottle')} style={{ borderColor: 'var(--accent-light)', color: 'var(--text-primary)', padding: '0.85rem 0.5rem', fontSize: '0.8rem' }}>🍾 Scansiona QR Bottiglia</Button>
            </div>
          </Accordion>
        </div>
      </Card>

      {/* HACK & SICUREZZA */}
      <Card style={{ padding: '1rem', marginBottom: '1.5rem', background: 'rgba(255, 0, 0, 0.05)', border: '1px solid rgba(255,0,0,0.2)' }}>
         <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--error)' }}>
             <ShieldAlert size={20} /> Master Control & Sicurezza
         </h3>
         <Button variant="secondary" onClick={triggerFlashlightHack} style={{ width: '100%', borderColor: 'var(--error)', color: 'var(--error)', display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
             <Zap size={18} /> Attiva Flashlight Hack (Pista)
         </Button>
         <Button variant="secondary" onClick={triggerHackerMode} style={{ width: '100%', borderColor: 'var(--warning)', color: 'var(--warning)', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
             <Signal size={18} /> Signal Disrupter (Hacker Mode)
         </Button>
         <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', textAlign: 'center' }}>Hackeraggio simulato: simula l'assenza di segnale per forzare il distacco dai telefoni. Momento Instagram a seguire.</p>
      </Card>

      {/* Storico Scansioni Rigoroso */}
      <Card style={{ padding: '1rem' }}>
         <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
             <History size={20} /> Storico Scansioni Ingressi
         </h3>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {history.map(log => (
                <div key={log.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '8px', borderLeft: `3px solid ${log.status.includes('Entrato') ? 'var(--success)' : 'var(--error)'}` }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                      <strong style={{ fontSize: '0.9rem' }}>{log.guestName} <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>({log.type})</span></strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{log.time}</span>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <span>Stato: <strong style={{color: log.status.includes('Entrato') ? 'var(--success)' : 'var(--warning)'}}>{log.status}</strong></span>
                      <span>Op: {log.operator}</span>
                   </div>
                   <div style={{ fontSize: '0.7rem', color: 'gray', marginTop: '0.3rem' }}>{log.event} @ {log.venue} ({log.date})</div>
                </div>
            ))}
         </div>
      </Card>

      {/* Deep Dive Action Modules */}
      <Card style={{ marginTop: '1rem', cursor: 'pointer', borderColor: 'var(--accent-color)' }} onClick={() => navigate('/admin/customers')}>
         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
               <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <Users size={20} color="var(--accent-color)" /> Pannello dei Clienti
               </h3>
               <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Ricerca, banna, o ispeziona The Log List Database.</p>
            </div>
         </div>
      </Card>

      <Button variant="primary" onClick={() => navigate('/admin/management')} style={{ marginTop: '1rem', padding: '1rem' }}>Apri Gestione Tavoli/Ordini</Button>

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
