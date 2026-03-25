import { streamStaffMessages, sendStaffMessage, streamOrders, saveReview } from '../services/db';
import { formatTime } from '../utils/formatTime';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { LogOut, Volume2, Star, ThumbsUp, ThumbsDown, Send, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ImageGirlHome() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Chat tracking
  const [isRead, setIsRead] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [chat, setChat] = useState([]);
  const [liveOrders, setLiveOrders] = useState([]);
  const [reviewSent, setReviewSent] = useState(false);
  const [reviewData, setReviewData] = useState({ table: '', text: '', rating: 'POSITIVA' });

  useEffect(() => {
    const unsubChat = streamStaffMessages((messages) => {
      setChat(messages);
      if (messages.length > 0 && messages[0].sender !== 'Tu') {
        setIsRead(false);
      }
    });
    const unsubOrders = streamOrders(setLiveOrders);
    return () => { unsubChat(); unsubOrders(); };
  }, []);

  // Derive top 2 spending tables
  const topTables = liveOrders
    .filter(o => o.status !== 'cancelled')
    .reduce((acc, o) => {
      const existing = acc.find(t => t.table === o.table);
      if (existing) {
        existing.spend += o.total || 0;
        existing.bottles += o.items?.reduce((s, i) => s + i.qty, 0) || 0;
      } else {
        acc.push({ table: o.table, client: o.name, pr: o.pr, spend: o.total || 0, bottles: o.items?.reduce((s, i) => s + i.qty, 0) || 0 });
      }
      return acc;
    }, [])
    .sort((a, b) => b.spend - a.spend)
    .slice(0, 2);

  const handleReply = async () => {
     if(!replyText.trim()) return;
     await sendStaffMessage({ sender: 'Tu', text: replyText });
     setReplyText('');
     setIsRead(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, paddingBottom: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', background: 'var(--accent-glow)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--accent-light)' }}>
                <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{user?.name?.charAt(0)}</span>
            </div>
            <div>
                <h2 style={{ fontSize: '1rem', margin: 0, color: 'white' }}>IMAGE TEAM</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0 }}>{user?.name}</p>
            </div>
        </div>
        <button onClick={() => { logout(); navigate('/login'); }} style={{ background: 'rgba(255,69,58,0.1)', border: 'none', color: '#ff453a', padding: '0.6rem', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <LogOut size={18} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>ESCI</span>
        </button>
      </header>

      {/* CHIAMATA E CHAT BIDIREZIONALE */}
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', marginTop: '1rem' }}>
          <Volume2 size={24} className={!isRead ? "icon-glow" : ""} color={!isRead ? "var(--error)" : "white"} /> 
          Centrale Operativa
      </h3>
      
      <Card style={{ background: !isRead ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-card)', borderColor: !isRead ? 'var(--error)' : 'var(--border-card)', animation: !isRead ? 'pulse 2s infinite' : 'none' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem' }}>
           {chat.map((msg, idx) => (
             <div key={idx} style={{ alignSelf: msg.sender === 'Tu' ? 'flex-end' : 'flex-start', background: msg.sender === 'Tu' ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: msg.sender === 'Tu' ? '16px 16px 0 16px' : '16px 16px 16px 0', border: msg.sender === 'Capo PR' && !isRead ? '1px solid var(--error)' : 'none', maxWidth: '85%' }}>
                 <strong style={{ fontSize: '0.8rem', color: msg.sender === 'Capo PR' ? 'var(--warning)' : 'white', display: 'block', marginBottom: '0.4rem' }}>{msg.sender} • {formatTime(msg.timestamp)}</strong>
                 <p style={{ fontSize: '1rem', margin: 0 }}>{msg.text}</p>
             </div>
           ))}
        </div>

        {!isRead && (
            <Button variant="primary" onClick={() => setIsRead(true)} style={{ width: '100%', background: 'var(--error)', marginBottom: '1rem' }}>Segna Chiamata come Letta</Button>
        )}

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
            <input 
               type="text" 
               className="input-base" 
               placeholder="Rispondi alla regia..." 
               value={replyText}
               onChange={e => setReplyText(e.target.value)}
               style={{ flex: 1, marginBottom: 0 }}
            />
            <Button variant="primary" onClick={handleReply} style={{ padding: '0.8rem 1.2rem' }}><Send size={18}/></Button>
        </div>
      </Card>

      {/* TAVOLI TOP SPESA */}
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', marginTop: '1.5rem', marginBottom: '0.2rem' }}>
          <Star size={20} color="var(--accent-color)" /> Focus Serata (Top Tavoli)
      </h3>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>I tavoli con la spesa bottiglie più elevata. Priorità assoluta di animazione.</p>
      <Card style={{ marginBottom: '1.5rem', padding: '0.5rem 1rem' }}>
         {topTables.length > 0 ? topTables.map(t => (
           <div key={t.table} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <strong style={{ display: 'block' }}>Tavolo {t.table}</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Cliente: {t.client} - PR: {t.pr || 'Organico'}</span>
              </div>
              <strong style={{ color: 'var(--accent-color)' }}>{t.bottles} Bottiglie</strong>
           </div>
         )) : (
           <p style={{ textAlign: 'center', color: 'gray', padding: '1rem', fontSize: '0.8rem' }}>Nessun tavolo attivo rilevante.</p>
         )}
      </Card>

      {/* RECENSIONE TAVOLI INTERNA RIGIDA */}
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', marginTop: '1.5rem', marginBottom: '0.2rem' }}>
          <ThumbsUp size={20} color="var(--success)" /> Rapporto Sicurezza / PR
      </h3>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Scegli il tavolo e compila il rapporto per avvisare regia e PR di spese o problemi.</p>
        
      {!reviewSent ? (
          <Card>
            <select 
              className="input-base" 
              style={{ marginBottom: '0.75rem' }}
              value={reviewData.table}
              onChange={e => setReviewData({...reviewData, table: e.target.value})}
            >
               <option value="" disabled style={{color:'black'}}>Seleziona Tavolo Target...</option>
               {liveOrders.map(o => (
                 <option key={o.id} value={o.table} style={{color:'black'}}>Tavolo {o.table} (Cliente: {o.name})</option>
               ))}
               <option value="Generale" style={{color:'black'}}>Feedback Generale Serata</option>
            </select>
            <textarea 
              maxLength={999}
              placeholder="Scrivi una nota (max 999 car). Es. 'Tutto bene, offrono tanto'..."
              className="input-base"
              style={{ minHeight: '80px', resize: 'vertical', marginBottom: '0.2rem' }}
              value={reviewData.text}
              onChange={e => setReviewData({...reviewData, text: e.target.value})}
            />
            <div style={{ textAlign: 'right', fontSize: '0.7rem', color: 'gray', marginBottom: '1rem' }}>Max 999 caratteri</div>
            
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Esito dell'Esperienza Cliente:</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    saveReview({ ...reviewData, rating: 'POSITIVA', type: 'staff', sender: user?.name, tag: `TAV ${reviewData.table}` });
                    setReviewSent(true);
                  }} 
                  style={{ flex: 1, borderColor: 'var(--success)', background: 'rgba(16,185,129,0.1)', color: 'var(--success)', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <ThumbsUp size={16} /> POSITIVA
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    saveReview({ ...reviewData, rating: 'NEGATIVA', type: 'staff', sender: user?.name, tag: `TAV ${reviewData.table}` });
                    setReviewSent(true);
                  }} 
                  style={{ flex: 1, borderColor: 'var(--error)', background: 'rgba(239,68,68,0.1)', color: 'var(--error)', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <ThumbsDown size={16} /> NEGATIVA
                </Button>
            </div>
          </Card>
      ) : (
          <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
              <CheckCircle2 size={48} color="var(--success)" style={{ marginBottom: '1rem' }} />
              <h4 style={{ margin: 0, marginBottom: '0.5rem' }}>Rapporto Inviato in Regia</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>Grazie per la tua segnalazione operativa.</p>
              <Button variant="secondary" onClick={() => setReviewSent(false)} style={{ marginTop: '1.5rem' }}>Nuova Segnalazione</Button>
          </Card>
      )}

      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
      `}</style>
      <EmergencyPanel />
    </div>
  );
}
