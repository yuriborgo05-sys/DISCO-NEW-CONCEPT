import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Accordion } from '../components/Accordion';
import { QrCode, Ticket, Settings, Star, Users, Clock, Wine, CreditCard, ChevronRight, Music, ShieldAlert, Heart, MapPin, Phone, Car, AlertCircle, MessageSquare, Lock, Camera, Trophy, EyeOff, Eye, Sparkles, LogOut, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../components/Avatar';
import { playCheckInSound, playFraudAlertSound } from '../utils/audio';
import { hapticCheckIn, hapticFraud, hapticSoftPop } from '../utils/haptics';
import { EmergencyPanel } from '../components/EmergencyPanel';
import { streamChat, sendSilentMessage, streamSystemState } from '../services/db';
import { HackerModeOverlay } from '../components/HackerModeOverlay';

export function CustomerHome() {
  const { user, logout, hasEntered, setHasEntered, entryTime, setEntryTime } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  const [hostess, setHostess] = useState(null);
  const [privacyShield, setPrivacyShield] = useState(false);

  // Silent Chat State
  const [chatMsg, setChatMsg] = useState('');
  const [silentMessages, setSilentMessages] = useState([]);

  const [hackerMode, setHackerMode] = useState(false);
  const [strobeMode, setStrobeMode] = useState(false);

  useEffect(() => {
    const unsubChat = streamChat(setSilentMessages);
    const unsubHacker = streamSystemState((state) => {
      setHackerMode(state.hackerMode);
      setStrobeMode(state.strobeMode);
    });
    return () => { unsubChat(); unsubHacker(); };
  }, []);

  // Angel Mode & FOMO States
  const [angelAlert, setAngelAlert] = useState(false);
  const [angelTimer, setAngelTimer] = useState(15);
  const [fomoOrders] = useState([
    { name: 'M****o T.', item: 'Dom Pérignon 6L' },
    { name: 'G****a R.', item: 'Belvedere 1.75L' },
    { name: 'A****o S.', item: 'Cristal Rosé' },
    { name: 'S****a B.', item: 'Grey Goose 3L' }
  ]);

  // Long press timer for SOS
  const [sosTimer, setSosTimer] = useState(null);

  const startSosTimer = () => {
    setSosTimer(setTimeout(() => {
        hapticFraud();
        addNotification("SOS SILENZIOSO", "Centrale operativa allertata. La security sta arrivando al tuo tavolo.", "error");
    }, 3000));
  };

  const clearSosTimer = () => {
    if(sosTimer) clearTimeout(sosTimer);
    setSosTimer(null);
  };

  // Live viewer FOMO counter
  const [viewers, setViewers] = useState(28);
  useEffect(() => {
    const interval = setInterval(() => {
      setViewers(v => Math.max(15, v + Math.floor(Math.random() * 5) - 2));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // FOMO push after 3.5s
  useEffect(() => {
    const timer = setTimeout(() => {
      addNotification("🔥 Serata sold-out in 20 min", "Lorenzo ha aperto Magnum Dom Pérignon al Tavolo 4!", "warning");
    }, 3500);
    return () => clearTimeout(timer);
  }, [addNotification]);

  // ─── VIP PROGRESSION (Demo State) ───
  const [totalSpend, setTotalSpend] = useState(2500); 
  const goldTarget = 1000;
  const progress = Math.min(100, Math.round((totalSpend / goldTarget) * 100));

  // ─── RESERVATION TIMER (Demo) ───
  const countdownMin = "14";
  const countdownSec = "52";
  const isUrgent = false;

  // 1. ANGEL MODE: Accelerometer Detection
  useEffect(() => {
    const handleMotion = (e) => {
        if (!e.accelerationIncludingGravity) return;
        const { x, y, z } = e.accelerationIncludingGravity;
        const totalAccel = Math.sqrt(x*x + y*y + z*z);
        if (totalAccel > 35 && !angelAlert) { // Threshold for impact/fight
            setAngelAlert(true);
            setAngelTimer(15);
            hapticFraud();
            playFraudAlertSound();
        }
    };
    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [angelAlert]);

  // 2. ANGEL MODE: Countdown Logic
  useEffect(() => {
    let interval;
    if (angelAlert && angelTimer > 0) {
        interval = setInterval(() => setAngelTimer(t => t - 1), 1000);
    } else if (angelAlert && angelTimer === 0) {
        addNotification("ALERT SECURITY", "Segnale SOS inviato per impatto rilevato. Security in arrivo.", "error");
        setAngelAlert(false);
    }
    return () => clearInterval(interval);
  }, [angelAlert, angelTimer]);

  // 3. PREDICTIVE STOCK: 20 min notice
  useEffect(() => {
      if (hasEntered) {
          const stockTimer = setTimeout(() => {
              addNotification("💡 Rifornimento?", "La tua bottiglia è al 10%. Lorenzo (PR) consiglia di ordinarne un'altra già ghiacciata!", "warning");
          }, 20 * 60 * 1000); // 20 minutes
          return () => clearTimeout(stockTimer);
      }
  }, [hasEntered, addNotification]);

  const simulateEntry = () => {
    if (!hasEntered) {
      playCheckInSound();
      hapticCheckIn();
      setHasEntered(true);
      setEntryTime(new Date().toLocaleTimeString().slice(0, 5));
      addNotification("✅ Ingresso Confermato", "Benvenuto al Bamboo! Le bottiglie sono ora disponibili.", "success");
    } else {
      setHasEntered(false);
      setEntryTime(null);
    }
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, paddingBottom: '2rem' }}>
      <HackerModeOverlay active={hackerMode} />
      
      {/* GLOBAL STROBE OVERLAY */}
      {strobeMode && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          zIndex: 10000, 
          background: 'white', 
          animation: 'strobeEffect 0.08s infinite alternate',
          pointerEvents: 'none'
        }} />
      )}

      {/* ─── HEADER ─── */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div 
            className="vip-avatar-container" 
            onDoubleClick={() => { hapticCheckIn(); addNotification('Angel Shot Inviato', 'La sicurezza è stata allertata silenziosamente verso il tuo tavolo.', 'error'); }}
            onMouseDown={startSosTimer}
            onMouseUp={clearSosTimer}
            onTouchStart={startSosTimer}
            onTouchEnd={clearSosTimer}
            style={{ cursor: 'pointer', position: 'relative' }}
          >
            <Avatar name={user?.name || 'Cliente'} size={44} />
            {sosTimer && <div style={{ position: 'absolute', inset: -4, border: '2px solid var(--error)', borderRadius: '50%', animation: 'ripple 1s infinite' }}></div>}
          </div>
          <div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Benvenuto</p>
            <h2 style={{ fontSize: '1.3rem', margin: 0, lineHeight: 1.2 }}>{user?.name?.split(' ')[0] || 'Cliente'}</h2>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Live Counter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'var(--error-bg)', padding: '0.3rem 0.6rem', borderRadius: '20px', border: '1px solid rgba(255,59,92,0.25)' }}>
            <span style={{ height: 6, width: 6, borderRadius: '50%', background: 'var(--error)', animation: 'heartbeat 1.5s infinite', display: 'inline-block' }}></span>
            <span style={{ fontSize: '0.72rem', color: 'var(--error)', fontWeight: 700 }}>{viewers}</span>
          </div>
          <button onClick={() => { setPrivacyShield(!privacyShield); hapticSoftPop(); addNotification('Privacy Shield', privacyShield ? 'Visibilità ripristinata' : 'Ora sei invisibile ai PR', 'info'); }} style={{ background: privacyShield ? 'var(--accent-color)' : 'var(--bg-card)', border: '1px solid var(--border-card)', color: privacyShield ? 'white' : 'var(--text-secondary)', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            {privacyShield ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          <button onClick={() => { logout(); navigate('/login'); }} style={{ background: 'rgba(255,69,58,0.1)', border: 'none', color: '#ff453a', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <LogOut size={18} />
          </button>
          <button onClick={() => navigate('/customer/profile')} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', color: 'var(--text-secondary)', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* ─── CANCEL TABLE AUCTION (Asta Ceca) ─── */}
      {!hasEntered && (
         <div style={{ background: 'linear-gradient(90deg, #ff3b5c, #ff9500)', borderRadius: '14px', padding: '1rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 15px rgba(255, 59, 92, 0.4)', animation: 'heartbeat 2s infinite' }}>
            <div>
               <strong style={{ display: 'block', fontSize: '1rem' }}>🔥 Asta VIP Live</strong>
               <span style={{ fontSize: '0.8rem' }}>Tavolo Console libero! Fai la tua offerta.</span>
            </div>
            <Button variant="secondary" style={{ background: 'white', color: 'var(--error)', padding: '0.6rem 1rem', fontSize: '0.85rem', border: 'none' }} onClick={() => addNotification('Asta', 'Offerta da 1500€ piazzata!', 'success')}>Offri</Button>
         </div>
      )}

      {/* ─── FOMO WALL (Real-time Feed) ─── */}
      <div className="fomo-marquee">
         <div className="fomo-track">
            {[...fomoOrders, ...fomoOrders].map((o, idx) => (
               <div key={idx} className="fomo-item">
                  <span>🔥 LIVE:</span> {o.name} ha ordinato <strong>{o.item}</strong>
               </div>
            ))}
         </div>
      </div>

      {/* ─── HERO: STATUS CARD ─── */}
      <div style={{
        background: hasEntered
          ? 'linear-gradient(135deg, var(--success-bg), rgba(0,0,0,0.2))'
          : 'linear-gradient(135deg, var(--accent-glow), rgba(0,0,0,0.2))',
        border: `1px solid ${hasEntered ? 'rgba(0,208,132,0.3)' : 'rgba(124,58,237,0.3)'}`,
        borderRadius: '20px',
        padding: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0 0 0.2rem 0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {hasEntered ? 'Stato Ingresso' : 'Prenotazione'}
          </p>
          <strong style={{ fontSize: '1.1rem', color: hasEntered ? 'var(--success)' : 'var(--text-primary)' }}>
            {hasEntered ? `✅ Entrato alle ${entryTime}` : '⏳ In attesa di ingresso'}
          </strong>
          {!hasEntered && (
            <p style={{ margin: '0.3rem 0 0', fontSize: '0.8rem', color: isUrgent ? 'var(--error)' : 'var(--warning)', fontWeight: 600 }}>
              <Clock size={12} style={{ verticalAlign: 'middle', marginRight: '0.2rem' }} />
              Prenotazione scade in {countdownMin}:{countdownSec} {isUrgent && '⚠️'}
            </p>
          )}
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: '0 0 0.2rem 0' }}>Console VIP 14</p>
          <strong style={{ color: 'var(--gold)', fontSize: '0.9rem' }}>BLACK CARD</strong>
        </div>
      </div>

      {/* ─── PRIMARY CTA ─── */}
      <Button
        variant={hasEntered ? 'primary' : 'secondary'}
        onClick={() => navigate('/customer/bottles')}
        style={{
          width: '100%', height: '58px', fontSize: '1.05rem', fontWeight: 700,
          background: hasEntered ? 'linear-gradient(135deg, var(--accent-color), var(--accent-hover))' : 'rgba(255,255,255,0.05)',
          color: hasEntered ? 'white' : 'var(--text-primary)',
          border: hasEntered ? 'none' : '1px solid var(--border-card)',
          boxShadow: hasEntered ? '0 4px 24px var(--accent-glow)' : 'none',
          cursor: 'pointer',
          borderRadius: '14px',
          animation: hasEntered ? 'heartbeat 2.5s infinite' : 'none'
        }}
      >
        {hasEntered ? '🍾 Ordina al Tavolo' : '🛒 Visiona e Pre-Ordina'}
      </Button>

      {/* ─── ACCORDION SECTIONS ─── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      
      {hasEntered && totalSpend >= 2000 && (
          <Accordion title="Servizio Fotografo VIP" icon={<Camera size={16} />} badge="Chiamata Rapida" badgeColor="var(--accent-color)" borderColor="var(--accent-light)">
             <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Richiedi il fotografo ufficiale al tuo tavolo per uno shooting privato.</p>
             <Button variant="primary" style={{ width: '100%', padding: '0.8rem', fontSize: '0.9rem' }} onClick={() => { hapticCheckIn(); addNotification('Foto Alert', 'Il fotografo è stato avvisato e sta arrivando!', 'success');}}>Richiama Fotografo Ora</Button>
          </Accordion>
      )}

      {/* Silent Table Chat */}
      {hasEntered && totalSpend >= 500 && (
          <Accordion title="Silent Chat VIP" icon={<MessageSquare size={16} />} borderColor="var(--accent-color)" badge="LIVE" badgeColor="var(--accent-color)">
             <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Scegli un tavolo e rompi il ghiaccio in totale anonimato.</p>
             
             {/* Table Selector Pills */}
             <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '0.5rem', scrollbarWidth: 'none' }}>
                {['Tavolo 5', 'Tavolo 12', 'Prive A-3', 'Console 10', 'Tavolo 22'].map(t => (
                  <button key={t} onClick={() => { hapticSoftPop(); setChatMsg(`Hey ${t}, `); }} style={{ padding: '0.4rem 0.8rem', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.75rem', whiteSpace: 'nowrap', cursor: 'pointer' }}>
                    {t}
                  </button>
                ))}
             </div>

             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '180px', overflowY: 'auto', marginBottom: '1rem', paddingRight: '0.5rem' }}>
                {silentMessages.map((m, i) => (
                   <div key={i} style={{ alignSelf: m.from === 'Tavolo 14' ? 'flex-end' : 'flex-start', background: m.from === 'Tavolo 14' ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '12px', fontSize: '0.85rem', maxWidth: '90%', border: m.from === 'Tavolo 14' ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-tertiary)', marginBottom: '0.3rem', gap: '1rem' }}>
                         <span style={{ fontWeight: 800, color: m.from === 'Tavolo 14' ? 'var(--accent-light)' : 'var(--text-secondary)' }}>{m.from} → {m.to}</span>
                         <span>{m.time}</span>
                      </div>
                      {m.msg}
                   </div>
                ))}
             </div>

             <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input 
                  type="text" 
                  className="input-base" 
                  placeholder="Scrivi un messaggio segreto..." 
                  value={chatMsg}
                  onChange={e => setChatMsg(e.target.value)}
                  style={{ fontSize: '0.85rem', padding: '0.75rem', flex: 1 }} 
                />
                <Button variant="primary" onClick={async () => { 
                    if(!chatMsg) return; 
                    await sendSilentMessage({ from: 'Tavolo 14', to: 'Tavolo Scelto', msg: chatMsg });
                    setChatMsg(''); 
                    hapticCheckIn(); 
                 }} style={{ height: '44px', width: '44px', padding: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Send size={18} />
                </Button>
             </div>

             <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <Button variant="secondary" onClick={() => { hapticCheckIn(); addNotification('Gift Alert', 'Seleziona una bottiglia da regalare al Tavolo Scelto', 'info'); navigate('/customer/bottles?gift=true'); }} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--gold)', borderColor: 'var(--gold)', background: 'rgba(255,208,96,0.05)' }}>
                    <Wine size={16} /> OFFRI UNA BOTTIGLIA AL TAVOLO
                </Button>
             </div>
          </Accordion>
      )}

      {/* Jukebox VIP */}
      {hasEntered && totalSpend >= 500 && (
          <Accordion title="Jukebox Privé (Esclusiva VIP)" icon={<Music size={16} />} badge="250€" badgeColor="var(--accent-color)" borderColor="var(--accent-light)">
             <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Salta la coda del DJ della Main Room. Paga ora e fai scoppiare la tua traccia preferita su tutto il locale.</p>
             <Button variant="primary" style={{ width: '100%', padding: '0.8rem', fontSize: '0.9rem' }} onClick={() => { hapticCheckIn(); addNotification('DJ Alert', 'Richiesta VIP inviata in Console.', 'success');}}>Scegli Canzone & Paga</Button>
          </Accordion>
      )}

      <Accordion
        title="Prenotazione Tavolo"
        icon={<Ticket size={16} />}
        defaultOpen={true}
        borderColor="var(--accent-color)"
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {[
            { label: 'Tavolo', value: 'Console VIP 14', color: 'var(--accent-light)' },
            { label: 'Persone', value: '6 Ospiti', color: 'var(--text-primary)' },
            { label: 'Spesa Minima', value: '€ 500', color: 'var(--warning)' },
            { label: 'PR Titolare', value: 'Sara B.', color: 'var(--text-primary)' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '10px' }}>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: '0 0 0.2rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
              <strong style={{ color }}>{value}</strong>
            </div>
          ))}
        </div>
        {!hasEntered && (
          <button onClick={() => navigate('/customer/reservation')} style={{ width: '100%', marginTop: '1rem', padding: '0.75rem', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: 'var(--accent-light)', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            Modifica Prenotazione <ChevronRight size={16} />
          </button>
        )}
      </Accordion>

      <Accordion
        title="Progressione VIP"
        icon={<Star size={16} />}
        badge="GOLD"
        badgeColor="var(--gold)"
        borderColor="var(--gold)"
      >
        <div style={{ marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Spesa Totale: <strong style={{ color: 'var(--text-primary)' }}>€ {totalSpend}</strong></span>
            <span style={{ fontSize: '0.82rem', color: 'var(--gold)' }}>Target GOLD: € {goldTarget}</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '8px', height: '10px', overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, var(--gold), #ff9500)', borderRadius: '8px', transition: 'width 1s ease', boxShadow: '0 0 8px rgba(255,208,96,0.5)' }}></div>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>Ancora <strong style={{ color: 'var(--gold)' }}>€ {goldTarget - totalSpend}</strong> per raggiungere il livello GOLD 🏆</p>
        </div>
      </Accordion>

      <Accordion title="Billionaire Leaderboard" icon={<Trophy size={16} />} badge="ANNUALE" badgeColor="var(--gold)" borderColor="var(--gold)">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
             {[
               { pos: 1, name: 'Davide B.', val: '€ 45.300', isMe: false },
               { pos: 2, name: 'Lorenzo M.', val: '€ 38.100', isMe: false },
               { pos: 3, name: 'Tu (Mario)', val: '€ 2.500', isMe: true },
             ].map(r => (
                <div key={r.pos} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem', background: r.isMe ? 'rgba(255,208,96,0.1)' : 'transparent', borderRadius: '8px' }}>
                   <span style={{ fontSize: '0.9rem', color: r.pos === 1 ? 'var(--gold)' : 'white' }}>#{r.pos} {r.name}</span>
                   <strong style={{ color: r.isMe ? 'var(--gold)' : 'white' }}>{r.val}</strong>
                </div>
             ))}
             <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '0.5rem' }}>Il #1 vince un viaggio VIP a Dubai a fine stagione.</p>
          </div>
      </Accordion>

      <Accordion
        title="QR & Drink Omaggio"
        icon={<QrCode size={16} />}
        badge="1"
        badgeColor="var(--success)"
        borderColor="var(--success)"
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ background: 'white', padding: '1rem', borderRadius: '14px', display: 'inline-block', marginBottom: '1rem', boxShadow: '0 0 30px rgba(0,208,132,0.2)' }}>
            <QrCode size={140} color="black" />
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Mostra questo QR all'ingresso. Viene bruciato all'accesso.</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.6rem', background: 'var(--success-bg)', borderRadius: '8px', border: '1px solid rgba(0,208,132,0.3)' }}>
            <span style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: 600 }}>🍹 Drink Omaggio disponibile in cassa</span>
          </div>
        </div>
      </Accordion>

      {hasEntered && totalSpend >= 1500 && (
          <Accordion title="Premium Hostess Selection" icon={<Heart size={16} />} badge="Esclusiva" badgeColor="#ff3b5c" borderColor="#ff3b5c">
             <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Seleziona la Ragazza Immagine che preferisci per il servizio al tuo tavolo.</p>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                {[
                  { name: 'Elena', img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop' },
                  { name: 'Sofia', img: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=100&h=100&fit=crop' },
                  { name: 'Chiara', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' }
                ].map(h => (
                   <div 
                    key={h.name} 
                    onClick={() => { hapticCheckIn(); setHostess(h.name); addNotification('Hostess', `${h.name} servirà la tua prossima bottiglia!`, 'success'); }}
                    style={{ 
                      textAlign: 'center', 
                      opacity: hostess === h.name ? 1 : 0.6, 
                      transform: hostess === h.name ? 'scale(1.1)' : 'scale(1)',
                      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      cursor: 'pointer'
                    }}
                   >
                      <img src={h.img} alt={h.name} style={{ width: '100%', borderRadius: '12px', border: hostess === h.name ? '2px solid #ff3b5c' : '1px solid rgba(255,255,255,0.1)' }} />
                      <p style={{ fontSize: '0.7rem', marginTop: '0.3rem', fontWeight: hostess === h.name ? 700 : 400 }}>{h.name}</p>
                   </div>
                ))}
             </div>
          </Accordion>
      )}

      {hasEntered && totalSpend >= 1500 && hostess && (
          <div style={{ marginTop: '-0.5rem', marginBottom: '0.75rem', animation: 'fadeIn 0.5s ease-out' }}>
              <Button 
                variant="primary" 
                style={{ width: '100%', background: 'linear-gradient(135deg, #7c3aed, #db2777)', boxShadow: '0 0 20px rgba(124,58,237,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', borderRadius: '12px', padding: '1rem' }}
                onClick={() => navigate(`/customer/ar-hostess?name=${hostess}`)}
              >
                  <Sparkles size={18} /> PROIETTA OLOGRAMMA {hostess.toUpperCase()}
              </Button>
          </div>
      )}

      {hasEntered && (
          <Accordion title="Chiama Servizio" icon={<Wine size={16} />} borderColor="var(--accent-color)">
           <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Richiedi assistenza immediata al tuo tavolo.</p>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <Button variant="secondary" onClick={() => addNotification('Ghiaccio', 'Il cameriere sta arrivando', 'success')} style={{ padding: '0.75rem', fontSize: '0.8rem' }}>🧊 Ghiaccio</Button>
              <Button variant="secondary" onClick={() => addNotification('Lattine', 'Il cameriere sta arrivando', 'success')} style={{ padding: '0.75rem', fontSize: '0.8rem' }}>🥤 Lattine</Button>
              <Button variant="secondary" onClick={() => addNotification('Pulizia', 'Il cameriere sta arrivando', 'success')} style={{ padding: '0.75rem', fontSize: '0.8rem' }}>🧹 Pulizia Tavolo</Button>
              <Button variant="secondary" onClick={() => addNotification('PR', 'Il tuo PR è stato avvisato', 'success')} style={{ padding: '0.75rem', fontSize: '0.8rem', color: 'var(--accent-light)', borderColor: 'var(--accent-color)' }}>⭐ Chiama PR</Button>
           </div>
        </Accordion>
      )}

      <Accordion
        title="Ordini & Pagamenti"
        icon={<Wine size={16} />}
        badge="1 attivo"
        badgeColor="var(--warning)"
        borderColor="var(--warning)"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255,184,48,0.06)', borderRadius: '10px', border: '1px solid rgba(255,184,48,0.2)' }}>
          <div>
            <strong style={{ display: 'block', fontSize: '0.95rem' }}>Dom Pérignon Vintage</strong>
            <span style={{ fontSize: '0.78rem', color: 'var(--warning)' }}>⏳ In preparazione</span>
          </div>
          <strong style={{ color: 'var(--accent-light)' }}>€ 500</strong>
        </div>
        <button onClick={() => navigate('/customer/profile')} style={{ width: '100%', marginTop: '0.75rem', padding: '0.65rem', background: 'transparent', border: '1px solid var(--border-card)', color: 'var(--text-secondary)', borderRadius: '10px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
          Vai allo Storico Completo <ChevronRight size={14} />
        </button>
      </Accordion>

      <Accordion
        title="Lascia Recensione"
        icon={<Star size={16} />}
        borderColor="var(--text-tertiary)"
      >
        <button onClick={() => navigate('/customer/reviews')} style={{ width: '100%', padding: '0.75rem', background: 'transparent', border: '1px solid var(--border-card)', color: 'var(--text-secondary)', borderRadius: '10px', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          ⭐ Valuta Serata, Servizio e Esperienza
        </button>
      </Accordion>

      <Accordion title="Contatti & Info" icon={<MapPin size={16} />} borderColor="rgba(255,255,255,0.2)">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '12px' }}>
                <MapPin size={18} color="var(--accent-light)" />
                <div>
                  <p style={{ fontSize: '0.85rem', margin: 0, fontWeight: 600 }}>Corso Moncalieri, 145</p>
                  <p style={{ fontSize: '0.75rem', margin: 0, color: 'var(--text-secondary)' }}>10100 Torino TO</p>
                </div>
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '12px' }}>
                <Phone size={18} color="var(--success)" />
                <div>
                  <p style={{ fontSize: '0.85rem', margin: 0, fontWeight: 600 }}>+39 335 675 7894</p>
                  <p style={{ fontSize: '0.75rem', margin: 0, color: 'var(--text-secondary)' }}>Prenotazioni & Info 24/7</p>
                </div>
             </div>
             <div style={{ padding: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '0.5rem' }}>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0 }}>
                   <strong>Orari:</strong> Mer, Dom 23:30-04 | Ven, Sab 21:00-04
                </p>
             </div>
          </div>
      </Accordion>

      <EmergencyPanel />

      {/* ANGEL MODE MODAL overlay */}
      {angelAlert && (
        <div className="angel-overlay">
           <div className="angel-timer-ring shake">
              {angelTimer}
           </div>
           <h2 style={{ color: 'var(--error)', fontSize: '1.8rem', marginBottom: '1rem' }}>URTO RILEVATO!</h2>
           <p style={{ color: 'white', fontSize: '1.1rem', marginBottom: '2rem', maxWidth: '300px' }}>Tutto bene? Se non rispondi entro 15 secondi allertiamo la security del Bamboo.</p>
           <Button variant="primary" onClick={() => setAngelAlert(false)} style={{ width: '100%', marginBottom: '1rem', padding: '1.2rem', fontSize: '1.1rem' }}>STO BENE, ANNULLA</Button>
           <Button variant="secondary" onClick={() => { setAngelTimer(0); }} style={{ color: 'var(--error)', borderColor: 'var(--error)', width: '100%' }}>AIUTO, CHIAMA ORA!</Button>
        </div>
      )}

      </div>

      {/* Dev Only */}
      <p onClick={simulateEntry} style={{ fontSize: '0.65rem', textAlign: 'center', color: 'rgba(255,255,255,0.12)', textDecoration: 'underline', cursor: 'pointer', marginTop: '0.5rem' }}>
        [Dev: Simula Check-in]
      </p>

      <style>{`@keyframes heartbeat { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.08);opacity:.85} }
        @keyframes strobeEffect { 0% { opacity: 0; } 100% { opacity: 1; } }
      `}</style>
    </div>
  );
}
