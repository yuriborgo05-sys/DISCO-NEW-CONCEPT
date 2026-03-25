import { streamStaffMessages, sendStaffMessage, streamOrders, streamReviews } from '../services/db';
import { formatTime } from '../utils/formatTime';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { LogOut, Trophy, BellRing, MessageSquare, MapPin, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TableMap } from '../components/TableMap';

export function HeadPRHome() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [callText, setCallText] = useState('');
  const [activeChat, setActiveChat] = useState([]);
  const [liveOrders, setLiveOrders] = useState([]);
  const [liveReviews, setLiveReviews] = useState([]);

  useEffect(() => {
    const unsubChat = streamStaffMessages(setActiveChat);
    const unsubOrders = streamOrders(setLiveOrders);
    const unsubReviews = streamReviews(setLiveReviews);
    return () => { unsubChat(); unsubOrders(); unsubReviews(); };
  }, []);

  // Derive PR rankings for the overview
  const prRankings = liveOrders.reduce((acc, order) => {
    const prName = order.pr || 'Organico';
    if (!acc[prName]) acc[prName] = { name: prName, fatturato: 0 };
    acc[prName].fatturato += order.total || 0;
    return acc;
  }, {});

  const sortedPRs = Object.values(prRankings)
    .sort((a, b) => b.fatturato - a.fatturato)
    .slice(0, 2);

  const handleCall = async () => {
    if(!callText.trim() && !window.confirm("Vuoi inviare una chiamata vuota al tavolo?")) return;
    
    await sendStaffMessage({ 
       sender: 'Capo PR', 
       text: callText.trim() ? callText : '📍 Chiamata Silenziosa al Tavolo.'
    });
    setCallText('');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1, paddingBottom: '3rem' }}>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '1.25rem', 
        borderRadius: '24px', 
        background: 'linear-gradient(135deg, rgba(30,30,40,0.8), rgba(15,15,20,0.95))',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.6)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              background: 'linear-gradient(45deg, var(--accent-color), #4f46e5)', 
              borderRadius: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(99,102,241,0.4)'
            }}>
                <span style={{ fontWeight: 900, fontSize: '1.2rem', color: 'white' }}>{user?.name?.charAt(0)}</span>
            </div>
            <div>
                <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 900, letterSpacing: '1px', color: 'white' }}>MISSION CONTROL</h2>
                <p style={{ color: 'var(--accent-light)', fontSize: '0.7rem', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '1.5px' }}>RANK: CAPO PR / REGIA</p>
            </div>
        </div>
        <button onClick={() => { logout(); navigate('/login'); }} style={{ background: 'rgba(255,69,58,0.1)', border: '1px solid rgba(255,69,58,0.2)', color: '#ff453a', padding: '0.6rem 1rem', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.8rem' }}>
          <LogOut size={16} /> ESCI
        </button>
      </header>

      {/* --- SECTION 1: LIVE OVERVIEW --- */}
      <div>
          <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.75rem', fontWeight: 800 }}>Overview Serata Live</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
              {/* Table Map Integration */}
              <Card style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '1rem' }}><MapPin size={18} color="var(--accent-color)" /> Mappa Interattiva</h3>
                    <span style={{ fontSize: '0.7rem', color: 'var(--success)', fontWeight: 700 }}>● 24 TAVOLI ATTIVI</span>
                </div>
                <TableMap selectedTableId={null} onSelectTable={(id) => alert(`Analisi Tavolo #${id} in tempo reale...`)} />
              </Card>

              {/* Top PR Stats */}
              <Card style={{ padding: '1.25rem', background: 'rgba(99,102,241,0.03)', borderColor: 'rgba(99,102,241,0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '1rem' }}><Trophy size={18} color="gold" /> Top Performance PR</h3>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Fatturato Live</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    {sortedPRs.length > 0 ? sortedPRs.map((pr, i) => (
                      <div key={pr.name} style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', borderLeft: `3px solid ${i === 0 ? 'gold' : 'silver'}` }}>
                          <span style={{ display: 'block', fontSize: '0.7rem', color: 'gray' }}>POS {i+1}</span>
                          <strong style={{ fontSize: '0.9rem', color: 'white', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pr.name}</strong>
                          <p style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: 'var(--accent-light)' }}>€ {pr.fatturato}</p>
                      </div>
                    )) : (
                      <p style={{ gridColumn: 'span 2', textAlign: 'center', fontSize: '0.8rem', color: 'gray' }}>In attesa di dati...</p>
                    )}
                </div>
              </Card>
          </div>
      </div>

      {/* --- SECTION 2: STAFF OPERATIONS --- */}
      <div>
          <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.75rem', fontWeight: 800 }}>Coordinamento Operativo</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Regia Image Girls */}
              <Card style={{ padding: '1.25rem', borderColor: 'rgba(255, 159, 10, 0.2)' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '1rem' }}>
                  <BellRing size={18} color="var(--warning)" /> Regia Ragazze Immagine
                </h3>
                
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <select className="input-base" style={{ flex: 1, padding: '0.6rem', fontSize: '0.8rem', background: 'rgba(0,0,0,0.4)' }}>
                        <option style={{color:'black'}}>Tavolo VIP 1 (Alex Rossi)</option>
                        <option style={{color:'black'}}>Pista 4 (Marco T.)</option>
                    </select>
                </div>
                
                <div style={{ position: 'relative' }}>
                    <textarea 
                      maxLength={999}
                      value={callText}
                      onChange={(e) => setCallText(e.target.value)}
                      placeholder="Scrivi qui il comando per lo staff..." 
                      className="input-base"
                      style={{ minHeight: '80px', marginBottom: '0.5rem', padding: '0.75rem', fontSize: '0.85rem', background: 'rgba(0,0,0,0.5)' }}
                    />
                    <button onClick={handleCall} style={{ position: 'absolute', bottom: '1.2rem', right: '0.75rem', background: 'var(--accent-color)', border: 'none', color: 'white', padding: '0.4rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Send size={16} />
                    </button>
                </div>

                {/* Chat Operativa Minimalist */}
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '200px', overflowY: 'auto' }}>
                        {activeChat.map((msg, i) => (
                            <div key={i} style={{ borderLeft: `2px solid ${msg.sender === 'Capo PR' ? 'var(--accent-color)' : 'var(--warning)'}`, paddingLeft: '0.75rem', marginBottom: '0.2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                                    <strong style={{ fontSize: '0.65rem', color: msg.sender === 'Capo PR' ? 'var(--accent-light)' : 'var(--warning)' }}>{msg.sender.toUpperCase()}</strong>
                                    <span style={{ fontSize: '0.6rem', color: 'gray' }}>{formatTime(msg.timestamp)}</span>
                                </div>
                                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.9)' }}>{msg.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
              </Card>

              {/* Recensioni Flash */}
              <Card style={{ padding: '1.25rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '1rem' }}>
                  <MessageSquare size={18} color="var(--success)" /> Live Staff & Customer Feedback
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto' }}>
                    {liveReviews.length > 0 ? liveReviews.map(rev => (
                      <div key={rev.id} style={{ padding: '0.8rem', background: rev.type === 'staff' ? 'rgba(99,102,241,0.05)' : 'rgba(16,185,129,0.05)', borderRadius: '12px', border: `1px solid ${rev.type === 'staff' ? 'rgba(99,102,241,0.1)' : 'rgba(16,185,129,0.1)'}` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                              <strong style={{ fontSize: '0.75rem', color: rev.type === 'staff' ? 'var(--accent-light)' : 'var(--success)' }}>
                                {rev.tag || 'Generale'} - {rev.rating || 'OK'}
                              </strong>
                              <span style={{ fontSize: '0.6rem', color: 'gray' }}>{formatTime(rev.timestamp)}</span>
                          </div>
                          <p style={{ fontSize: '0.75rem', margin: 0, color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>"{rev.comment || rev.text}" - {rev.user || rev.sender || 'Anonimo'}</p>
                      </div>
                    )) : (
                      <p style={{ textAlign: 'center', color: 'gray', fontSize: '0.8rem' }}>Nessun feedback recente.</p>
                    )}
                </div>
              </Card>
          </div>
      </div>
    </div>
  );
}
