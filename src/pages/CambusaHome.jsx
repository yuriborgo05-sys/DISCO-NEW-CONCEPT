import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { streamCambusaOrders, updateOrderStatus, triggerHelpCambusa } from '../services/db';
import { LogOut, PackageOpen, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';

export function CambusaHome() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ completed: 12, pending: 0 });

  useEffect(() => {
    const unsub = streamCambusaOrders((data) => {
      setOrders(data);
      setStats(prev => ({ ...prev, pending: data.filter(o => o.status !== 'ready' && o.status !== 'delivered').length }));
    });
    return () => unsub();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    // Optimistic update for UI responsiveness
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    if (newStatus === 'ready') {
      addNotification('Ordine Pronto', 'I camerieri sono stati avvisati per il ritiro.', 'success');
      // In a real app we would call a backend function to immediately alert waiters via push notification.
    }
  };

  const handleHelpPress = async () => {
    await triggerHelpCambusa();
    addNotification('Aiuto Richiesto', 'Un cameriere sta arrivando per darti una mano.', 'warning');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, paddingBottom: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '44px', height: '44px', background: 'var(--accent-glow)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--accent-light)' }}>
             <PackageOpen size={24} color="var(--accent-light)" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', margin: 0 }}>CAMBUSA CORE</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', margin: 0 }}>{user?.name || 'Operatore'}</p>
          </div>
        </div>
        <button onClick={() => { logout(); navigate('/login'); }} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-secondary)', p: '0.5rem', borderRadius: '10px', cursor: 'pointer' }}>
          <LogOut size={20} />
        </button>
      </header>

      {/* Stats Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
         <Card style={{ padding: '0.75rem', textAlign: 'center', background: 'rgba(124,58,237,0.05)' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>In Arrivo</span>
            <p style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0 }}>{stats.pending}</p>
         </Card>
         <Card style={{ padding: '0.75rem', textAlign: 'center', background: 'rgba(16,185,129,0.05)', borderColor: 'rgba(16,185,129,0.2)' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Evasi (Top)</span>
            <p style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0, color: 'var(--success)' }}>{stats.completed}</p>
         </Card>
      </div>

      {/* Aiuto Button */}
      <Button variant="secondary" onClick={handleHelpPress} style={{ width: '100%', borderColor: 'var(--error)', color: 'var(--error)', display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
         <AlertTriangle size={18} /> Spartisci Mole Lavoro (Chiama Cameriere)
      </Button>

      {/* Orders List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {orders.length === 0 && <p style={{textAlign: 'center', color: 'gray', marginTop:'2rem'}}>Nessun ordine in arrivo.</p>}
        {orders.map(order => (
          <Card key={order.id} style={{ 
            padding: '1rem', 
            borderLeft: order.status === 'ready' ? '4px solid var(--success)' : 
                       order.status === 'preparing' ? '4px solid var(--warning)' : '4px solid var(--error)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div>
                <h3 style={{ margin: 0 }}>Tavolo {order.tableId}</h3>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.2rem' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}><Clock size={10} style={{display:'inline', marginRight: '4px'}}/> {order.time}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--accent-light)', fontWeight: 700 }}>PR: {order.pr || 'Organico'}</span>
                </div>
              </div>
              <span style={{ 
                fontSize: '0.75rem', fontWeight: 'bold', padding: '0.2rem 0.5rem', borderRadius: '4px',
                background: order.status === 'ready' ? 'rgba(0,255,100,0.1)' : order.status === 'preparing' ? 'rgba(255,200,0,0.1)' : 'rgba(255,0,0,0.1)',
                color: order.status === 'ready' ? 'var(--success)' : order.status === 'preparing' ? 'var(--warning)' : 'var(--error)'
              }}>
                {order.status === 'pending' ? 'IN ATTESA' : order.status === 'preparing' ? 'IN PREPARAZIONE' : 'PRONTO'}
              </span>
            </div>

            {/* Order Contents */}
            {order.status !== 'ready' && (
              <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong style={{fontSize: '0.8rem', color: 'var(--accent-light)', textTransform: 'uppercase', letterSpacing: '0.5px'}}>📦 Bottiglie</strong>
                  <ul style={{ margin: '0.4rem 0 0 0', paddingLeft: '1.2rem', fontSize: '0.9rem', color: 'white', fontWeight: 600 }}>
                    {order.bottles?.map((b, i) => <li key={i}>{b.qty}x {b.name || b.id}</li>)}
                  </ul>
                </div>
                <div>
                  <strong style={{fontSize: '0.8rem', color: 'var(--warning)', textTransform: 'uppercase', letterSpacing: '0.5px'}}>🥤 Lattine / Analcolici (Mixers)</strong>
                  <ul style={{ margin: '0.4rem 0 0 0', paddingLeft: '1.2rem', fontSize: '0.9rem', color: 'white', fontWeight: 600 }}>
                    {order.mixers?.map((m, i) => <li key={i}>{m.qty}x {m.name}</li>)}
                  </ul>
                </div>
              </div>
            )}

            {/* Actions */}
            {order.status === 'pending' && (
              <Button variant="secondary" onClick={() => handleStatusUpdate(order.id, 'preparing')} style={{ width: '100%', borderColor: 'var(--warning)', color: 'var(--warning)' }}>
                 <PackageOpen size={16} style={{marginRight: '8px'}}/> Conferma Ricezione
              </Button>
            )}
            {order.status === 'preparing' && (
              <Button variant="primary" onClick={() => handleStatusUpdate(order.id, 'ready')} style={{ width: '100%' }}>
                 <CheckCircle size={16} style={{marginRight: '8px'}}/> Segna come PRONTO
              </Button>
            )}
            {order.status === 'ready' && (
              <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--success)', margin: 0 }}>In attesa del ritiro cameriere...</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
