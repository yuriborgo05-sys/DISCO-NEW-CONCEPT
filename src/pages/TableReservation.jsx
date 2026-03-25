import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Info, MapPin } from 'lucide-react';
import { TableMap } from '../components/TableMap';
import { bambooTables } from '../data/bambooData';
import { saveReservation } from '../services/db';
import { useAuth } from '../context/AuthContext';

export function TableReservation() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [people, setPeople] = useState(4);
  const [pr, setPr] = useState('');
  const [tableId, setTableId] = useState(null);

  const handleSubmit = async () => {
    try {
      await saveReservation({
        userId: user?.id || 'guest',
        userName: user?.name || 'Guest',
        people,
        pr,
        tableId,
        minSpend: calculateMinimumSpend()
      });
      navigate('/customer');
    } catch (error) {
       console.error("Reservation failed:", error);
    }
  }

  const calculateMinimumSpend = () => {
    // Regola base the il cliente menziona: 4 persone = 180 (quindi base 180 + 45 per ogni extra)
    let base = 180 + Math.max(0, people - 4) * 45; 
    
    // Regola Mappa: Se la spesa minima del tavolo assegnato batte la base, mostrala.
    if(tableId) {
       const table = bambooTables.find(t => t.id === tableId);
       if(table && base < table.minSpend) base = table.minSpend;
    }
    return base;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '1rem', paddingBottom: '2rem', flex: 1 }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button onClick={() => navigate('/customer')} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
          <ArrowLeft size={24} />
        </button>
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Prenota Tavolo</h2>
      </header>

      {/* Map Interactive Module */}
      <Card style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <h3 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
           <MapPin size={20} color="var(--accent-color)" /> Mappa Interattiva
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
           Scegli un tavolo cliccando i pallini colorati. Il colore indica la fascia di spesa minima del tavolo VIP richiesto.
        </p>
        
        <TableMap selectedTableId={tableId} onSelectTable={setTableId} />
        
        {tableId && (
           <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'rgba(94, 92, 230, 0.15)', borderRadius: '12px', textAlign: 'center' }}>
              <strong style={{ color: 'var(--accent-color)' }}>✅ Hai richiesto il Tavolo #{tableId}</strong>
           </div>
        )}
      </Card>

      <Card style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600 }}>Chi è il tuo PR?</label>
        <select className="input-base" style={{ marginBottom: '1.5rem' }} value={pr} onChange={(e) => setPr(e.target.value)}>
          <option value="" disabled style={{ color: 'black' }}>Seleziona un PR</option>
          <option value="nessuno" style={{ color: 'black' }}>Nessuno - Non ho un PR di riferimento</option>
          <option value="alex" style={{ color: 'black' }}>Alex Rossi</option>
          <option value="sara" style={{ color: 'black' }}>Sara Bianchi</option>
        </select>

        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600 }}>Numero Persone (Min. 4)</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <button onClick={() => setPeople(Math.max(4, people - 1))} style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', fontSize: '1.5rem' }}>-</button>
            <div style={{ flex: 1, textAlign: 'center', fontSize: '1.5rem', fontWeight: 800 }}>{people}</div>
            <button onClick={() => setPeople(people + 1)} style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', fontSize: '1.5rem' }}>+</button>
        </div>

        <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--warning)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
           <Info color="var(--warning)" size={40} />
           <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Spesa minima totale richiesta (aggiornata in base al tavolo scelto o agli ospiti):</p>
              <h3 style={{ color: 'var(--warning)', margin: '0.5rem 0 0 0', fontSize: '1.4rem' }}>€ {calculateMinimumSpend()}</h3>
           </div>
        </div>
      </Card>

      <Button variant="primary" onClick={handleSubmit} style={{ marginTop: 'auto' }}>Procedi con la Prenotazione</Button>
    </div>
  );
}
