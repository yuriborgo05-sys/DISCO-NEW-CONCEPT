import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useNox } from '../context/NoxContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, GlassWater, ShieldCheck } from 'lucide-react';

export function Register() {
  const navigate = useNavigate();
  const { registerUser } = useAuth();
  const { config } = useNox();
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    role: 'cliente', // Default Role: cliente (matching route)
    gender: '',
    age: '',
    city: '',
    occupation: '',
    frequenza: '',
    music: '',
    eventType: '',
    comments: ''
  });

  const handleRegister = async () => {
    if(!formData.email || !formData.password || !formData.name) {
      setError('Nome, Email e Password sono obbligatori.');
      return;
    }

    try {
      await registerUser(formData.email, formData.password, {
        name: formData.name,
        surname: formData.surname,
        gender: formData.gender,
        age: formData.age,
        city: formData.city,
        occupation: formData.occupation,
        frequenza: formData.frequenza,
        music: formData.music,
        eventType: formData.eventType,
        comments: formData.comments,
        role: formData.role
      });

      if(formData.frequenza === 'Prima volta') {
          setShowPopup(true);
      } else {
          navigate('/');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const update = (field, val) => setFormData(prev => ({...prev, [field]: val}));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '1rem', paddingBottom: '2rem', flex: 1 }}>
      {showPopup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', animation: 'fadeIn 0.3s ease' }}>
           <div style={{ background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.4) 0%, #111 100%)', padding: '2rem', borderRadius: '24px', textAlign: 'center', border: '1px solid var(--success)', width: '100%', maxWidth: '400px', boxShadow: '0 0 50px rgba(16, 185, 129, 0.2)' }}>
             <GlassWater size={64} color="var(--success)" style={{ marginBottom: '1rem', filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.8))' }} />
             <h2 style={{ color: 'white', marginBottom: '0.5rem', fontSize: '1.8rem' }}>Benvenuto! 🎉</h2>
             <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem', lineHeight: 1.5 }}>Essendo la tua prima volta al <strong>{config?.clubName || 'Locale'}</strong>, ti abbiamo accreditato un <strong style={{color: 'var(--success)'}}>Drink Omaggio Digitale</strong> nel profilo!<br/><br/>Lo troverai nella tua area personale.</p>
              <Button variant="primary" onClick={() => navigate('/')} style={{ width: '100%' }}>Inizia la Serata</Button>
           </div>
        </div>
      )}

      <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', alignSelf: 'flex-start', marginBottom: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
         <ArrowLeft size={20} /> Torna al Login
      </button>
      
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <Sparkles className="icon-glow" size={32} color="var(--accent-color)" style={{ margin: '0 auto 1rem' }} />
          <h2>Creazione Profilo</h2>
          {error && <p style={{ color: 'var(--error)', fontSize: '0.85rem', marginTop: '0.5rem' }}>{error}</p>}
      </div>

       <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
         {/* Anagrafica */}
         <h4 style={{ color: 'var(--accent-color)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>1. Dati Obbligatori</h4>
         <input type="text" placeholder="Nome" className="input-base" value={formData.name} onChange={e => update('name', e.target.value)} />
         <input type="text" placeholder="Cognome" className="input-base" value={formData.surname} onChange={e => update('surname', e.target.value)} />
         <input type="email" placeholder="Email" className="input-base" value={formData.email} onChange={e => update('email', e.target.value)} />
         <input type="password" placeholder="Password scelta" className="input-base" value={formData.password} onChange={e => update('password', e.target.value)} />
         
         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
             <select className="input-base" value={formData.gender} onChange={e => update('gender', e.target.value)}>
                 <option value="" disabled style={{color: 'black'}}>Sesso</option>
                 <option value="Uomo" style={{color: 'black'}}>Uomo</option>
                 <option value="Donna" style={{color: 'black'}}>Donna</option>
             </select>
             <input type="number" placeholder="Età" className="input-base" value={formData.age} onChange={e => update('age', e.target.value)} />
         </div>

         <input type="text" placeholder="Città / Residenza" className="input-base" value={formData.city} onChange={e => update('city', e.target.value)} />

         <select className="input-base" value={formData.occupation} onChange={e => update('occupation', e.target.value)}>
            <option value="" disabled style={{color: 'black'}}>Studi o Lavori?</option>
            <option value="Studio" style={{color: 'black'}}>Studio</option>
            <option value="Lavoro" style={{color: 'black'}}>Lavoro</option>
            <option value="Entrambi" style={{color: 'black'}}>Entrambi</option>
         </select>

          {/* RUOLO PROFESSIONALE */}
          <h4 style={{ color: 'var(--success)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '1rem' }}>2. Ruolo nel Club</h4>
          <select className="input-base" value={formData.role} onChange={e => update('role', e.target.value)} style={{ border: '1px solid var(--success)' }}>
             <option value="cliente" style={{color: 'black'}}>Cliente VIP</option>
             <option value="pr" style={{color: 'black'}}>PR (Promoter)</option>
             <option value="capo_pr" style={{color: 'black'}}>Capo PR (Manager)</option>
             <option value="immagine" style={{color: 'black'}}>Ragazza Immagine (Hostess)</option>
             <option value="fotografo" style={{color: 'black'}}>Fotografo Ufficiale</option>
             <option value="security" style={{color: 'black'}}>Security (Bodyguard)</option>
             <option value="admin" style={{color: 'black'}}>Amministrazione / Cassa</option>
             <option value="cameriere" style={{color: 'black'}}>Cameriere (Service)</option>
             <option value="cambusa" style={{color: 'black'}}>Operatore Cambusa (Bar)</option>
          </select>
          <div style={{ fontSize: '0.7rem', color: 'gray', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <ShieldCheck size={12} /> L'accesso ai ruoli staff richiede approvazione admin.
          </div>

         <select className="input-base" value={formData.frequenza} onChange={(e) => update('frequenza', e.target.value)} style={{ borderColor: formData.frequenza === 'Prima volta' ? 'var(--success)' : '' }}>
            <option value="" disabled style={{color: 'black'}}>Sei già stato qui?</option>
            <option value="Abituale" style={{color: 'black'}}>Sono cliente abituale</option>
            <option value="Prima volta" style={{color: 'black'}}>È la mia prima volta</option>
         </select>

         {/* Preferenze */}
         <h4 style={{ color: 'var(--warning)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '1rem' }}>3. Preferenze Serate</h4>
         
         <select className="input-base" value={formData.music} onChange={e => update('music', e.target.value)}>
            <option value="" disabled style={{color: 'black'}}>Musica Preferita</option>
            <option value="Reggaeton" style={{color: 'black'}}>Reggaeton / Trap</option>
            <option value="House" style={{color: 'black'}}>House / Commerciale</option>
            <option value="Techno" style={{color: 'black'}}>Techno</option>
            <option value="Hits" style={{color: 'black'}}>Hit del passato</option>
         </select>

         <select className="input-base" value={formData.eventType} onChange={e => update('eventType', e.target.value)}>
            <option value="" disabled style={{color: 'black'}}>Tipo di serata preferita</option>
            <option value="Tranquilla" style={{color: 'black'}}>Tranquilla (Tavolo e amici)</option>
            <option value="Pista" style={{color: 'black'}}>Pista scatenata</option>
            <option value="Tema" style={{color: 'black'}}>Eventi a Tema</option>
         </select>

         <textarea placeholder="Eventuali commenti..." className="input-base" value={formData.comments} onChange={e => update('comments', e.target.value)} style={{ height: '80px', resize: 'none' }}></textarea>

         <Button variant="primary" style={{ marginTop: '1rem' }} onClick={handleRegister}>
            Conferma Registrazione
         </Button>
       </Card>

       <style>{`
          @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
       `}</style>
    </div>
  );
}
