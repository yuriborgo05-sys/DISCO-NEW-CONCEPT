import React, { useState, useEffect } from 'react';
import { ArrowLeft, UserCheck, ShieldAlert, Sparkles, UserMinus, UserPlus } from 'lucide-react';
import { streamUsers, updateUser } from '../services/db';
import { useNotification } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

export function AdminCustomers() {
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const unsubscribe = streamUsers(setUsers);
    return () => unsubscribe();
  }, []);

  const handleAction = async (userId, data, label) => {
    try {
      await updateUser(userId, data);
      addNotification("Azione Completata", `${label} eseguito con successo.`, "success");
    } catch (err) {
      addNotification("Errore", err.message, "error");
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '1rem', paddingBottom: '2rem', flex: 1 }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate('/admin')} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
          <ArrowLeft size={24} />
        </button>
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Pannello Clienti</h2>
      </header>

      <Card style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Ricerca Rapida Cliente</h3>
        <input 
          type="text" 
          placeholder="Cerca per nome o email..." 
          className="input-base" 
          style={{ marginBottom: '1rem' }}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div style={{ fontSize: '0.8rem', color: 'gray' }}>Mostrando {filteredUsers.length} utenti</div>
      </Card>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredUsers.length > 0 ? filteredUsers.map(u => (
            <Card key={u.id} style={{ borderLeft: `4px solid ${u.isBanned ? 'var(--error)' : 'var(--success)'}`, padding: '1rem' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                   <div>
                      <h4 style={{ margin: 0 }}>{u.name}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.2rem 0' }}>{u.email} • {u.role || 'Cliente'}</p>
                      <p style={{ fontSize: '0.75rem', margin: 0 }}>Tavolo: {u.tableId || 'In Pista'} • PR: {u.prName || 'Nessuno'}</p>
                   </div>
                   <span style={{ fontSize: '0.7rem', background: u.hasEntered ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 159, 10, 0.2)', color: u.hasEntered ? 'var(--success)' : 'var(--warning)', padding: '0.2rem 0.5rem', borderRadius: '8px', fontWeight: 700 }}>
                    {u.hasEntered ? 'NEL LOCALE' : 'IN CODA / ASSENTE'}
                   </span>
               </div>
               
               <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                  <Button 
                    variant="secondary" 
                    onClick={() => handleAction(u.id, { menuLocked: !u.menuLocked }, u.menuLocked ? 'Menu Sbloccato' : 'Menu Bloccato')}
                    style={{ padding: '0.5rem', fontSize: '0.75rem', flex: '1 1 45%' }}
                  >
                    <UserCheck size={14}/> {u.menuLocked ? 'Sblocca Menu' : 'Blocca Menu'}
                  </Button>
                  
                  <Button 
                    variant="secondary" 
                    onClick={() => handleAction(u.id, { isBanned: !u.isBanned }, u.isBanned ? 'Utente Sbloccato' : 'Utente Bannato')}
                    style={{ padding: '0.5rem', fontSize: '0.75rem', flex: '1 1 45%', borderColor: 'var(--error)', color: 'var(--error)' }}
                  >
                    {u.isBanned ? <UserPlus size={14}/> : <UserMinus size={14}/>} {u.isBanned ? 'Unban' : 'Banna'}
                  </Button>

                  {u.isFirstTime && !u.drinkRedeemed && (
                    <Button 
                      variant="primary" 
                      onClick={() => handleAction(u.id, { drinkRedeemed: true }, 'Drink Assegnato')}
                      style={{ padding: '0.5rem', fontSize: '0.75rem', width: '100%', marginTop: '0.25rem' }}
                    >
                      <Sparkles size={14}/> Assegna Drink Omaggio (Promozione)
                    </Button>
                  )}
               </div>
            </Card>
          )) : (
            <p style={{ textAlign: 'center', color: 'gray', padding: '2rem' }}>Nessun cliente trovato.</p>
          )}
      </div>
    </div>
  );
}
