import React, { useState, useEffect } from 'react';
import { streamOrders, streamStaffMessages, sendStaffMessage } from '../services/db';
import { formatTime } from '../utils/formatTime';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Accordion } from '../components/Accordion';
import { useNavigate } from 'react-router-dom';
import { LogOut, Camera, Zap, MessageSquare, Users, Star, Flame, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { EmergencyPanel } from '../components/EmergencyPanel';
import { hapticSoftPop } from '../utils/haptics';

export function PhotographerHome() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [hotTables, setHotTables] = useState([]);
  const [chats, setChats] = useState([]);
  const [msgInput, setMsgInput] = useState('');

  useEffect(() => {
    const unsub1 = streamOrders((orders) => {
      const highValue = orders
        .filter(o => o.total >= 500)
        .map(o => ({ 
          id: o.id, 
          name: o.table, 
          spend: `€ ${o.total}`, 
          activity: `Recente: ${o.items?.[0]?.name || 'Bottiglia'}`, 
          priority: o.total >= 1000 ? 'High' : 'Medium' 
        }));
      setHotTables(highValue);
    });

    const unsub2 = streamStaffMessages(setChats);
    return () => { unsub1(); unsub2(); };
  }, []);

  const handleSend = async () => {
    if(!msgInput.trim()) return;
    await sendStaffMessage({ sender: 'Fotografo', text: msgInput });
    setMsgInput('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingBottom: '3rem' }}>
      
      {/* ─── HEADER ─── */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', background: 'var(--accent-glow)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--accent-light)' }}>
                <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{user?.name?.charAt(0)}</span>
            </div>
            <div>
                <h2 style={{ fontSize: '1rem', margin: 0, color: 'white' }}>VIP LENS CORE</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0 }}>{user?.name}</p>
            </div>
        </div>
        <button onClick={() => { logout(); navigate('/login'); }} style={{ background: 'rgba(255,69,58,0.1)', border: 'none', color: '#ff453a', padding: '0.6rem', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <LogOut size={18} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>ESCI</span>
        </button>
      </header>

      {/* ─── HOT TABLES (FLASH HEATMAP) ─── */}
      <Accordion title="Flash Heatmap (Tavoli Caldi)" icon={<Flame size={16} color="var(--warning)" />} defaultOpen={true} borderColor="var(--warning)">
         <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {hotTables.map(t => (
               <div key={t.id} style={{ 
                background: 'rgba(255,149,0,0.05)', 
                border: t.priority === 'High' ? '1px solid rgba(255,149,0,0.4)' : '1px solid rgba(255,255,255,0.05)',
                padding: '1rem',
                borderRadius: '12px',
                position: 'relative',
                overflow: 'hidden'
               }}>
                  {t.priority === 'High' && <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--warning)', color: 'black', fontSize: '0.65rem', padding: '0.2rem 0.5rem', fontWeight: 800, borderRadius: '0 0 0 8px' }}>VIP PRIORITY</div>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                     <strong style={{ fontSize: '1.05rem' }}>{t.name}</strong>
                     <span style={{ color: 'var(--success)', fontWeight: 700 }}>{t.spend}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>{t.activity}</p>
                  <Button variant="primary" style={{ width: '100%', marginTop: '0.8rem', padding: '0.6rem', fontSize: '0.85rem' }} onClick={() => hapticSoftPop()}>
                     VADO AL TAVOLO
                  </Button>
               </div>
            ))}
         </div>
      </Accordion>

      {/* ─── SOCIAL COORDINATION CHAT ─── */}
      <Accordion title="Coordinamento Staff" icon={<MessageSquare size={16} />} borderColor="var(--accent-color)">
         <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {chats.map((c, i) => (
               <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                     <strong style={{ fontSize: '0.8rem', color: 'var(--accent-light)' }}>{c.sender}</strong>
                     <span style={{ fontSize: '0.7rem', color: 'gray' }}>{formatTime(c.timestamp)}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', margin: 0 }}>{c.text}</p>
               </div>
            ))}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                className="input-base" 
                placeholder="Scrivi allo staff..." 
                value={msgInput}
                onChange={e => setMsgInput(e.target.value)}
                style={{ fontSize: '0.85rem', padding: '0.6rem', flex: 1 }} 
              />
              <Button variant="primary" onClick={handleSend} style={{ padding: '0.6rem' }}><CheckCircle2 size={18}/></Button>
            </div>
         </div>
      </Accordion>

      <EmergencyPanel />
    </div>
  );
}
