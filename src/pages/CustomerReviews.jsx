import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Send, MessageSquareHeart } from 'lucide-react';
import { saveReview } from '../services/db';
import { useAuth } from '../context/AuthContext';

const RatingPicker = ({ label, value, onChange }) => (
  <div style={{ marginBottom: '1.5rem' }}>
    <p style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.95rem' }}>{label}</p>
    <div style={{ display: 'flex', gap: '0.5rem' }}>
       {[1, 2, 3, 4, 5].map(star => (
         <Star 
           key={star} 
           onClick={() => onChange(star)}
           size={32} 
           color={star <= value ? 'var(--warning)' : 'rgba(255,255,255,0.1)'} 
           fill={star <= value ? 'var(--warning)' : 'transparent'}
           style={{ cursor: 'pointer', transition: 'all 0.2s', transform: star <= value ? 'scale(1.1)' : 'scale(1)' }}
         />
       ))}
    </div>
  </div>
);

export function CustomerReviews() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reviews, setReviews] = useState({ serata: 0, servizio: 0, esperienza: 0 });
  const [suggestions, setSuggestions] = useState({ musica: '', tiposerata: '', commenti: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    try {
      await saveReview({
         userId: user?.id || 'guest',
         userName: user?.name || 'Guest',
         ratings: reviews,
         suggestions: suggestions
      });
      setSubmitted(true);
    } catch (e) {
      console.error(e);
    }
  };

  if(submitted) {
      return (
         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', flex: 1, textAlign: 'center' }}>
            <MessageSquareHeart color="var(--accent-color)" size={80} style={{ marginBottom: '1.5rem', filter: 'drop-shadow(0 0 20px var(--accent-glow))' }} />
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Grazie!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.5 }}>Le tue recensioni e i tuoi suggerimenti musicali sono stati inviati direttamente alla Direzione.<br/>Il tuo feedback aiuta il TOO MUCH a migliorare ogni volta.</p>
            <Button variant="primary" style={{ width: '100%' }} onClick={() => navigate('/customer')}>Torna alla Home</Button>
         </div>
      );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '1rem', flex: 1, paddingBottom: '2rem' }}>
       <header style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
          <button onClick={() => navigate('/customer')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><ArrowLeft size={24} /></button>
          <h2 style={{ margin: 0 }}>Recensione Serata</h2>
       </header>

       <Card style={{ marginBottom: '1.5rem', borderTop: '4px solid var(--warning)' }}>
          <h3 style={{ marginBottom: '0.5rem', fontSize: '1.3rem' }}>Come sta andando?</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Lascia una valutazione da 1 a 5 stelle sugli aspetti principali del locale. Il tuo voto è anonimo.</p>
          
          <RatingPicker label="Valutazione Serata (Intrattenimento)" value={reviews.serata} onChange={(v) => setReviews({...reviews, serata: v})} />
          <RatingPicker label="Servizio al Tavolo e Cassa" value={reviews.servizio} onChange={(v) => setReviews({...reviews, servizio: v})} />
          <RatingPicker label="Esperienza Generale Locale" value={reviews.esperienza} onChange={(v) => setReviews({...reviews, esperienza: v})} />
       </Card>

       <Card style={{ marginBottom: '1.5rem', borderTop: '4px solid var(--accent-color)' }}>
          <h3 style={{ marginBottom: '0.5rem', fontSize: '1.3rem' }}>Suggerimenti Futuri</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Cosa vorresti vedere di più nelle prossime edizioni del TOO MUCH?</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', display: 'block' }}>Ti piacerebbe ascoltare più...</label>
                  <select className="input-base" value={suggestions.musica} onChange={(e) => setSuggestions({...suggestions, musica: e.target.value})}>
                     <option value="" disabled style={{color:'black'}}>Scegli Genere Musicale</option>
                     <option style={{color:'black'}}>Più Reggaeton/Trap</option>
                     <option style={{color:'black'}}>Più House/Techno</option>
                     <option style={{color:'black'}}>Più Hit Commerciali</option>
                  </select>
              </div>

              <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', display: 'block' }}>Preferiresti serate strutturate come...</label>
                  <select className="input-base" value={suggestions.tiposerata} onChange={(e) => setSuggestions({...suggestions, tiposerata: e.target.value})}>
                     <option value="" disabled style={{color:'black'}}>Scegli Tipologia</option>
                     <option style={{color:'black'}}>Party a Tema specifici (es. Fluo, Anni 90)</option>
                     <option style={{color:'black'}}>Ospiti VIP / Dj Internazionali</option>
                     <option style={{color:'black'}}>Noche Latina classica</option>
                  </select>
              </div>

              <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', display: 'block' }}>Commenti Aggiuntivi</label>
                  <textarea 
                     className="input-base" 
                     placeholder="Raccontaci qui..." 
                     style={{ resize: 'none', height: '100px' }}
                     value={suggestions.commenti}
                     onChange={(e) => setSuggestions({...suggestions, commenti: e.target.value})}
                  />
              </div>
          </div>
       </Card>

       <Button 
          variant="primary" 
          onClick={handleSubmit} 
          style={{ width: '100%', padding: '1.2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', opacity: reviews.esperienza === 0 ? 0.5 : 1 }}
          disabled={reviews.esperienza === 0}
       >
          <Send size={20} /> Invia Valutazione
       </Button>
    </div>
  );
}
