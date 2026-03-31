import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Wine, Info, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { placeOrder } from '../services/db';

const BOTTLES_CATALOG = [
  { id: 'b_belvedere', name: 'Belvedere 1L' },
  { id: 'b_moet', name: 'Moët & Chandon' },
  { id: 'b_dom', name: 'Dom Pérignon Luminous' },
];

const MIXERS_CATALOG = ['Coca Cola', 'Lemon Soda', 'Succo Arancia/Ananas', 'Tonica', 'Red Bull'];

export function ManualTableCreate({ prName }) {
  const [tableInfo, setTableInfo] = useState({ name: '', pax: 5, target: 'Pista' });
  const [bottles, setBottles] = useState([]); // {id, name, qty}
  const [mixers, setMixers] = useState([]);   // {name, qty}
  const { addNotification } = useNotification();

  const totalBottles = bottles.reduce((sum, b) => sum + b.qty, 0);
  const totalMixers = mixers.reduce((sum, m) => sum + m.qty, 0);
  const requiredMixers = totalBottles * 6;
  const missingMixers = requiredMixers - totalMixers;

  const addBottle = (bottleId) => {
    const template = BOTTLES_CATALOG.find(b => b.id === bottleId);
    setBottles(prev => {
      const existing = prev.find(b => b.id === bottleId);
      if (existing) return prev.map(b => b.id === bottleId ? { ...b, qty: b.qty + 1 } : b);
      return [...prev, { ...template, qty: 1 }];
    });
  };

  const removeBottle = (bottleId) => {
    setBottles(prev => prev.map(b => b.id === bottleId ? { ...b, qty: b.qty - 1 } : b).filter(b => b.qty > 0));
  };

  const updateMixer = (mixerName, delta) => {
    setMixers(prev => {
      const existing = prev.find(m => m.name === mixerName);
      if (existing) {
        return prev.map(m => m.name === mixerName ? { ...m, qty: m.qty + delta } : m).filter(m => m.qty > 0);
      }
      if (delta > 0) return [...prev, { name: mixerName, qty: 1 }];
      return prev;
    });
  };

  const getMixerQty = (name) => mixers.find(m => m.name === name)?.qty || 0;

  const handleCreate = async () => {
    if (!tableInfo.name) {
      addNotification("Errore", "Inserisci il nome del tavolo.", "error"); return;
    }
    if (totalBottles > 0 && totalMixers !== requiredMixers) {
      addNotification("Regola Analcolici", `Devi selezionare esattamente ${requiredMixers} analcolici per le bottiglie scelte (${totalMixers} selezionati).`, "warning"); return;
    }
    
    // Simulate DB save
    const orderData = { tableInfo, bottles, mixers, pr: prName };
    console.log("Creazione Tavolo:", orderData);
    await placeOrder(orderData); 
    addNotification("Tavolo Creato", `Il tavolo ${tableInfo.name} è stato aperto con successo.`, "success");
    setTableInfo({ name: '', pax: 5, target: 'Pista' });
    setBottles([]);
    setMixers([]);
  };

  return (
    <Card style={{ padding: '1.25rem' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
         <Wine size={18} color="var(--accent-color)" /> Manual Table Setup
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
        <input className="input-base" placeholder="Nome Tavolo (es. Rossi Addio Celiabato)" value={tableInfo.name} onChange={e => setTableInfo({...tableInfo, name: e.target.value})} />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
           <input type="number" className="input-base" placeholder="Persone" value={tableInfo.pax} onChange={e => setTableInfo({...tableInfo, pax: e.target.value})} style={{flex: 1}} />
           <select className="input-base" value={tableInfo.target} onChange={e => setTableInfo({...tableInfo, target: e.target.value})} style={{flex: 2}}>
             <option style={{color:'black'}} value="dj">Dietro DJ (P1-P4)</option>
             <option style={{color:'black'}} value="lateral">Laterali Pista (P5-P8)</option>
             <option style={{color:'black'}} value="bar">Fronte Bar (P9-P10)</option>
             <option style={{color:'black'}} value="entrance">Angoli Entrate (P11-P12)</option>
           </select>
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '1rem' }}>
        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem' }}>Aggiungi Bottiglie</h4>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {BOTTLES_CATALOG.map(b => (
             <Button key={b.id} variant="secondary" onClick={() => addBottle(b.id)} style={{ fontSize: '0.75rem', padding: '0.4rem 0.6rem' }}><Plus size={12} style={{marginRight: 4}}/>{b.name}</Button>
          ))}
        </div>
        {bottles.length > 0 && (
           <div style={{ marginTop: '0.75rem' }}>
              {bottles.map(b => (
                 <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                    <span>{b.qty}x {b.name}</span>
                    <Trash2 size={14} color="var(--error)" onClick={() => removeBottle(b.id)} style={{cursor: 'pointer'}} />
                 </div>
              ))}
           </div>
        )}
      </div>

      {totalBottles > 0 && (
        <div style={{ background: missingMixers > 0 ? 'rgba(239, 68, 68, 0.05)' : 'rgba(16, 185, 129, 0.05)', padding: '1rem', borderRadius: '12px', border: missingMixers > 0 ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: totalMixers !== requiredMixers ? 'var(--error)' : 'var(--success)' }}>
            Mixer Obbligatori: Selezionati {totalMixers} su {requiredMixers} (Esattamente 6 per bottiglia)
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {MIXERS_CATALOG.map(mixer => (
              <div key={mixer} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.5)', padding: '0.3rem 0.5rem', borderRadius: '6px' }}>
                 <span style={{fontSize: '0.75rem'}}>{mixer}</span>
                 <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <button onClick={() => updateMixer(mixer, -1)} style={{background: 'none', border:'none', color:'white', fontSize:'1rem', padding: '0 4px'}}>-</button>
                    <span style={{fontSize:'0.75rem', fontWeight:'bold'}}>{getMixerQty(mixer)}</span>
                    <button onClick={() => updateMixer(mixer, 1)} style={{background: 'none', border:'none', color:'white', fontSize:'1rem', padding: '0 4px'}}>+</button>
                 </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button variant="primary" onClick={handleCreate} style={{ width: '100%', marginTop: '1rem' }} disabled={totalBottles === 0 || totalMixers !== requiredMixers}>
         Crea Tavolo & Invia a Cambusa
      </Button>
    </Card>
  );
}
