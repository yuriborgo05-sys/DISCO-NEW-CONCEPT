import React, { useState, useEffect } from 'react';
import { streamOrders, streamAnalytics } from '../services/db';
import { useAuth } from '../context/AuthContext';
import { EmergencyPanel } from '../components/EmergencyPanel';
import { Card } from '../components/Card';
import { Accordion } from '../components/Accordion';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, PieChart, TrendingUp, Download, Users, Crown, Star, Wine, 
  BarChart3, Filter, MapPin, AlertCircle, Snowflake, Package, Siren, Car 
} from 'lucide-react';
import { useNox } from '../context/NoxContext';

const TABS = ['KPI & Clientela', 'Logistica & Sicurezza', 'Bottiglie & Bar', 'Heatmap', 'Staff Performance'];

const LEADERBOARD_CATEGORIES = [
  { key: 'fatturato', label: 'Fatturato', unit: '€', decimals: 0 },
  { key: 'bottiglie', label: 'Bottiglie', unit: '', decimals: 0 },
  { key: 'tavoli', label: 'Tavoli', unit: '', decimals: 0 },
  { key: 'persone', label: 'Persone', unit: '', decimals: 0 },
  { key: 'mediaSpesa', label: 'Media €/Tav', unit: '€', decimals: 0 },
];

const PR_DATA = [
  { name: 'Alex Rossi', avatar: 'AR', fatturato: 8200, bottiglie: 24, tavoli: 10, persone: 85, mediaSpesa: 820 },
  { name: 'Marco T.', avatar: 'MT', fatturato: 6100, bottiglie: 19, tavoli: 8, persone: 70, mediaSpesa: 762 },
  { name: 'Giulia B.', avatar: 'GB', fatturato: 5400, bottiglie: 14, tavoli: 14, persone: 120, mediaSpesa: 385 },
  { name: 'Francesca N.', avatar: 'FN', fatturato: 3200, bottiglie: 9, tavoli: 6, persone: 95, mediaSpesa: 533 },
  { name: 'Luca V.', avatar: 'LV', fatturato: 1800, bottiglie: 5, tavoli: 3, persone: 30, mediaSpesa: 600 },
];

function PRLeaderboard({ data }) {
  const [catIdx, setCatIdx] = useState(0);
  const cat = LEADERBOARD_CATEGORIES[catIdx];
  const sorted = [...data].sort((a, b) => b[cat.key] - a[cat.key]);
  const topValue = sorted[0][cat.key];
  const medals = ['🥇', '🥈', '🥉'];
  const medalColors = ['var(--gold)', 'rgba(200,200,220,0.8)', '#cd7f32'];

  const fmt = (v) => {
    const int = Math.round(v);
    return cat.unit === '€' ? `€ ${int.toLocaleString('it-IT')}` : `${int} ${cat.unit}`.trim();
  };

  return (
    <div>
      {/* Category Selector */}
      <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.75rem', scrollbarWidth: 'none', marginBottom: '0.5rem' }}>
        {LEADERBOARD_CATEGORIES.map((c, i) => (
          <button key={c.key} onClick={() => setCatIdx(i)} style={{
            padding: '0.35rem 0.75rem', borderRadius: '16px', whiteSpace: 'nowrap', fontSize: '0.78rem',
            fontWeight: 600, cursor: 'pointer', border: 'none', flexShrink: 0, transition: 'all 0.2s',
            background: catIdx === i ? 'var(--accent-color)' : 'rgba(255,255,255,0.06)',
            color: catIdx === i ? 'white' : 'var(--text-secondary)',
            boxShadow: catIdx === i ? '0 2px 10px var(--accent-glow)' : 'none',
          }}>{c.label}</button>
        ))}
      </div>

      {/* Ranking Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {sorted.map((pr, idx) => {
          const value = pr[cat.key];
          const barWidth = Math.round((value / topValue) * 100);
          const gap = idx === 0 ? null : sorted[0][cat.key] - value;
          const isFirst = idx === 0;

          return (
            <div key={pr.name} style={{
              background: isFirst
                ? 'linear-gradient(135deg, var(--gold-bg), rgba(18,18,30,0.9))'
                : 'var(--bg-card)',
              border: `1px solid ${isFirst ? 'rgba(255,208,96,0.3)' : 'var(--border-card)'}`,
              borderRadius: '14px',
              padding: '0.85rem 1rem',
              boxShadow: isFirst ? '0 4px 20px rgba(255,208,96,0.08)' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {/* Medal / Rank */}
                <div style={{ width: '32px', textAlign: 'center', flexShrink: 0 }}>
                  {idx < 3
                    ? <span style={{ fontSize: '1.4rem' }}>{medals[idx]}</span>
                    : <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-tertiary)' }}>#{idx + 1}</span>
                  }
                </div>

                {/* Avatar */}
                <div style={{
                  width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
                  background: isFirst ? 'var(--gold)' : 'var(--accent-color)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem', fontWeight: 800, color: isFirst ? '#000' : 'white',
                  border: `2px solid ${isFirst ? 'rgba(255,208,96,0.6)' : 'rgba(124,58,237,0.4)'}`,
                }}>{pr.avatar}</div>

                {/* Name + Bar */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
                    <strong style={{ fontSize: '0.92rem', color: isFirst ? 'var(--gold)' : 'var(--text-primary)' }}>{pr.name}</strong>
                    <strong style={{ fontSize: '1rem', color: isFirst ? 'var(--gold)' : medalColors[idx] || 'var(--text-secondary)' }}>{fmt(value)}</strong>
                  </div>
                  {/* Progress Bar */}
                  <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '6px', height: '6px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${barWidth}%`, height: '100%', borderRadius: '6px',
                      background: isFirst
                        ? 'linear-gradient(90deg, var(--gold), #ff9500)'
                        : `linear-gradient(90deg, var(--accent-color), var(--accent-light))`,
                      transition: 'width 0.5s ease',
                      boxShadow: isFirst ? '0 0 6px rgba(255,208,96,0.4)' : 'none',
                    }}></div>
                  </div>
                  {/* Gap to first */}
                  {gap !== null && (
                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                      Distacco da 🥇: <span style={{ color: 'var(--error)' }}>- {fmt(gap)}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <EmergencyPanel />
    </div>
  );
}

export function DirectionAnalytics() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { config } = useNox();
  const [activeTab, setActiveTab] = useState(0);
  const [liveOrders, setLiveOrders] = useState([]);
  const [stats, setStats] = useState({ entries: [], incidents: [], iceRequests: 0, cansSoldBottles: 0, cansSoldExtra: 0, sosAlerts: 0, uberCalls: 0, appAccesses: [], tableBookings: [] });

  useEffect(() => {
    const unsubOrders = streamOrders(setLiveOrders);
    const unsubAnalytics = streamAnalytics(setStats);
    return () => { unsubOrders(); unsubAnalytics(); };
  }, []);

  // Derive PR statistics from live orders
  const derivedPrData = liveOrders.reduce((acc, order) => {
    const prName = order.pr || 'Organico';
    if (!acc[prName]) {
      acc[prName] = { name: prName, avatar: prName.charAt(0), fatturato: 0, bottiglie: 0, tavoli: new Set(), persone: 0, mediaSpesa: 0 };
    }
    acc[prName].fatturato += order.total || 0;
    acc[prName].bottiglie += order.items?.reduce((sum, i) => sum + i.qty, 0) || 0;
    acc[prName].tavoli.add(order.table);
    acc[prName].persone += order.people || 0;
    return acc;
  }, {});

  const prList = Object.values(derivedPrData).map(pr => ({
    ...pr,
    tavoli: pr.tavoli.size,
    mediaSpesa: pr.tavoli.size > 0 ? pr.fatturato / pr.tavoli.size : 0
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingBottom: '3rem' }}>

      {/* ─── HEADER ─── */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '48px', height: '48px', background: 'var(--gold-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--gold)' }}>
                <span style={{ fontWeight: 900, fontSize: '1rem', color: 'var(--gold)' }}>{user?.name?.charAt(0) || 'D'}</span>
            </div>
            <div>
                <h2 style={{ fontSize: '1.1rem', margin: 0, color: 'white', letterSpacing: '0.05em' }}>DIREZIONE MASTER</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0 }}>Ecosistema {config?.clubName || 'NOX'} v2.0</p>
            </div>
        </div>
        <button onClick={() => { logout(); navigate('/login'); }} style={{ background: 'rgba(255,69,58,0.15)', border: '1px solid rgba(255,69,58,0.3)', color: '#ff453a', padding: '0.7rem 1.2rem', borderRadius: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LogOut size={20} />
          <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>ESCI</span>
        </button>
      </header>

      {/* ─── GLOBAL FILTERS (Compact) ─── */}
      <Accordion title="Filtri Globali" icon={<Filter size={15} />} defaultOpen={false}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {[
            { label: 'Periodo', opts: ['Ultimi 6 Mesi (Storico)', 'Mese Corrente', 'Oggi', 'Ieri', 'Ultima Settimana'] },
            { label: 'Locale', opts: ['Tutti i Locali', `${config?.clubName || 'NOX'} Club`] },
            { label: 'Evento', opts: ['Tutti gli Eventi', `Venerdì ${config?.clubName || 'NOX'}`, 'Sabato Privé'] },
            { label: 'PR', opts: ['Tutti i PR', 'Alex Rossi', 'Giulia B.', 'Marco T.'] },
            { label: 'Tipologia Cliente', opts: ['Tutti', 'Prima Volta', 'Abituali', 'VIP'] },
          ].map(({ label, opts }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', minWidth: '110px' }}>{label}</span>
              <select className="input-base" style={{ flex: 1, padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}>
                {opts.map(o => <option key={o} style={{ color: 'black' }}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
      </Accordion>

      {/* ─── TAB BAR ─── */}
      <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', padding: '1rem 0 0.75rem', scrollbarWidth: 'none' }}>
        {TABS.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)} style={{
            padding: '0.45rem 0.85rem', borderRadius: '20px', whiteSpace: 'nowrap', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', border: 'none', flexShrink: 0,
            background: activeTab === i ? 'var(--accent-color)' : 'var(--bg-card)',
            color: activeTab === i ? 'white' : 'var(--text-secondary)',
            boxShadow: activeTab === i ? '0 2px 12px var(--accent-glow)' : 'none',
            transition: 'all 0.2s ease'
          }}>{tab}</button>
        ))}
      </div>

      {/* ─── TAB CONTENT ─── */}

      {/* TAB 0: KPI & Clientela */}
      {activeTab === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Cliente del Mese */}
          <Card style={{ padding: '1.25rem', background: 'linear-gradient(135deg, var(--gold-bg), rgba(0,0,0,0.3))', borderColor: 'rgba(255,208,96,0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Crown size={36} color="var(--gold)" />
              <div>
                <p style={{ fontSize: '0.72rem', color: 'var(--gold)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Cliente del Mese</p>
                <strong style={{ fontSize: '1.4rem', display: 'block', marginTop: '0.1rem' }}>Davide Bianchi</strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Spesa: <strong style={{ color: 'var(--gold)' }}>€ 5.400</strong> — Console VIP</span>
              </div>
            </div>
          </Card>

          {/* Entry Types KPI */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {(() => {
                const totalEntries = stats.entries.length || 1;
                const normal = stats.entries.filter(e => e.type === 'normale').length;
                const table = stats.entries.filter(e => e.type === 'tavolo').length;
                return (
                  <>
                  <Card style={{ padding: '1rem' }}>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', margin: '0 0 0.3rem' }}>Ingresso Normale</p>
                    <strong style={{ fontSize: '1.2rem', color: 'var(--accent-light)' }}>{Math.round((normal/totalEntries)*100)}% <small style={{fontSize:'0.7rem', opacity:0.6}}>({normal})</small></strong>
                  </Card>
                  <Card style={{ padding: '1rem' }}>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', margin: '0 0 0.3rem' }}>Ingresso Tavolo</p>
                    <strong style={{ fontSize: '1.2rem', color: 'var(--warning)' }}>{Math.round((table/totalEntries)*100)}% <small style={{fontSize:'0.7rem', opacity:0.6}}>({table})</small></strong>
                  </Card>
                  </>
                );
            })()}
          </div>

          {/* Gender Breakdown detailed */}
          <Card style={{ padding: '1.25rem' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Dettaglio Genere per Tipologia</p>
              {['normale', 'tavolo'].map(type => {
                  const items = stats.entries.filter(e => e.type === type);
                  const total = items.length || 1;
                  const m = items.filter(e => e.gender === 'U').length;
                  const f = items.filter(e => e.gender === 'D').length;
                  return (
                    <div key={type} style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
                            <span style={{ textTransform: 'capitalize' }}>{type === 'normale' ? 'Lista / Ingresso' : 'Tavoli'}</span>
                            <span>{m} M / {f} F</span>
                        </div>
                        <div style={{ display: 'flex', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                            <div style={{ width: `${(m/total)*100}%`, background: '#3b82f6' }}></div>
                            <div style={{ width: `${(f/total)*100}%`, background: '#ec4899' }}></div>
                        </div>
                    </div>
                  );
              })}
          </Card>

          {/* App Conversion */}
          <Card style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-glow)' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Conversione App &rarr; Tavolo</p>
              {(() => {
                  const uniqueAccess = new Set(stats.appAccesses.map(a => a.userId)).size;
                  const bookings = stats.tableBookings.length;
                  const totalBottles = stats.tableBookings.reduce((s, b) => s + b.bottles, 0);
                  const totalPeople = stats.tableBookings.reduce((s, b) => s + b.people, 0);
                  return (
                    <div style={{ marginTop: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong style={{ fontSize: '1.5rem' }}>{uniqueAccess > 0 ? Math.round((bookings/uniqueAccess)*100) : 0}%</strong>
                            <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                <div>{uniqueAccess} Accessi Unici</div>
                                <div style={{ color: 'var(--success)' }}>{bookings} Prenotazioni stasera</div>
                            </div>
                        </div>
                        <p style={{ fontSize: '0.7rem', color: 'gray', marginTop: '0.5rem' }}>Volume: {totalBottles} Bottiglie / {totalPeople} Persone portate.</p>
                    </div>
                  );
              })()}
          </Card>
        </div>
      )}

      {/* TAB 1: Logistica & Sicurezza */}
      {activeTab === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Incidents Report */}
          <Card style={{ borderLeft: '4px solid var(--error)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Incidenti e Risse</p>
                    <strong style={{ fontSize: '1.5rem', color: 'var(--error)' }}>{stats.incidents.length} segnalati</strong>
                </div>
                <AlertCircle size={32} color="var(--error)" />
            </div>
          </Card>

          {/* Logistics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <Card style={{ padding: '1rem' }}>
                <Snowflake size={18} color="var(--accent-light)" style={{ marginBottom: '0.5rem' }} />
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0 }}>Richieste Ghiaccio</p>
                <strong style={{ fontSize: '1.2rem' }}>{stats.iceRequests}</strong>
            </Card>
            <Card style={{ padding: '1rem' }}>
                <Package size={18} color="var(--warning)" style={{ marginBottom: '0.5rem' }} />
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0 }}>Lattine Complessive</p>
                <strong style={{ fontSize: '1.2rem' }}>{stats.cansSoldBottles + stats.cansSoldExtra}</strong>
            </Card>
          </div>

          {/* Cans Breakdown */}
          <Accordion title="Dettaglio Lattine" icon={<Package size={15} />} borderColor="var(--warning)" defaultOpen={true}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                  <span style={{ fontSize: '0.85rem' }}>Lattine con Bottiglie</span>
                  <strong style={{ color: 'var(--success)' }}>{stats.cansSoldBottles}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                  <span style={{ fontSize: '0.85rem' }}>Lattine Ordinazioni Extra</span>
                  <strong style={{ color: 'var(--warning)' }}>{stats.cansSoldExtra}</strong>
              </div>
          </Accordion>

          {/* Emergency Services */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <Card style={{ padding: '1rem', borderTop: '2px solid #ff0000' }}>
                <Siren size={18} color="#ff0000" style={{ marginBottom: '0.5rem' }} />
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0 }}>SOS Inviati</p>
                <strong style={{ fontSize: '1.2rem' }}>{stats.sosAlerts}</strong>
            </Card>
            <Card style={{ padding: '1rem', borderTop: '2px solid #000' }}>
                <Car size={18} color="white" style={{ marginBottom: '0.5rem' }} />
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0 }}>Chiamate UBER</p>
                <strong style={{ fontSize: '1.2rem' }}>{stats.uberCalls}</strong>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: Bottiglie */}
      {activeTab === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Accordion title="Economia Bottiglie" icon={<Wine size={15} />} defaultOpen={true} borderColor="var(--warning)">
            {[
              { label: 'Prenotate (Pre-Serata)', value: '45', sub: '€ 8.500', color: 'var(--text-primary)' },
              { label: 'Extra Live (Upsell In-App)', value: '18', sub: '€ 3.200', color: 'var(--accent-light)' },
              { label: 'Consegnate (QR Validato)', value: '60 / 63', sub: '95% delivery rate', color: 'var(--success)' },
              { label: 'Non Evase / Annullate', value: '3', sub: '- € 450', color: 'var(--error)' },
            ].map(({ label, value, sub, color }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem' }}>{label}</span>
                <div style={{ textAlign: 'right' }}>
                  <strong style={{ color, fontSize: '1rem', display: 'block' }}>{value}</strong>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{sub}</span>
                </div>
              </div>
            ))}
          </Accordion>

          <Accordion title="Top Bottiglie Vendute" icon={<TrendingUp size={15} />} borderColor="var(--accent-color)">
            {[
              ['Dom Pérignon Vintage', 24, 'var(--gold)'],
              ['Belvedere Vodka 1L', 18, 'var(--accent-light)'],
              ['Moët & Chandon Ice', 12, 'var(--success)'],
              ['Gin Bombay Sapphire', 6, 'var(--text-secondary)'],
            ].map(([name, count, color], i) => (
              <div key={name} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-card)', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem' }}>{i + 1}. {name}</span>
                <strong style={{ color }}>{count} pz</strong>
              </div>
            ))}
            <button style={{ width: '100%', marginTop: '0.75rem', padding: '0.65rem', background: 'transparent', border: '1px solid var(--border-card)', color: 'var(--text-secondary)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
              <Download size={15} /> Esporta CSV Completo
            </button>
          </Accordion>

          <Accordion title="Top Mixers (Analcolici)" icon={<Wine size={15} />} borderColor="var(--warning)">
            {[
              ['Red Bull', 1420, 'var(--accent-color)'],
              ['Schweppes Lemon', 850, 'var(--warning)'],
              ['Tonica', 640, 'var(--success)'],
              ['Coca-Cola', 420, 'var(--error)'],
            ].map(([name, count, color], i) => (
              <div key={name} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-card)', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem' }}>{i + 1}. {name}</span>
                <strong style={{ color }}>{count} lattine</strong>
              </div>
            ))}
          </Accordion>
        </div>
      )}

      {/* TAB 3: Heatmap */}
      {activeTab === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Mappa interattiva della sala. I colori indicano la spesa attiva per tavolo in tempo reale.</p>
          <Card style={{ background: '#050508', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.6rem', position: 'relative', padding: '2.5rem 0.75rem 0.75rem' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center', padding: '0.4rem', background: 'var(--accent-color)', borderRadius: '10px 10px 0 0' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em', color: 'white' }}>🎵 DJ BOOTH</span>
              </div>
              {[
                { id: 'T1', level: 1 }, { id: 'T2', level: 3 }, { id: 'T3', level: 1 }, { id: 'T4', level: 4 },
                { id: 'T5', level: 0 }, { id: 'T6', level: 1 }, { id: 'T7', level: 2 }, { id: 'T8', level: 0 },
              ].map(({ id, level }) => {
                const bgMap = ['rgba(255,255,255,0.03)', 'rgba(59,130,246,0.2)', 'rgba(245,158,11,0.4)', 'rgba(239,68,68,0.5)', 'rgba(239,68,68,0.85)'];
                const borderMap = ['transparent', 'rgba(59,130,246,0.5)', 'rgba(245,158,11,0.7)', 'rgba(239,68,68,0.7)', 'red'];
                const shadowMap = ['none', 'none', '0 0 8px rgba(245,158,11,0.3)', '0 0 14px rgba(239,68,68,0.4)', '0 0 24px red'];
                const emoji = ['', '', '⭐', '🔥', '💣'];
                return (
                  <div key={id} style={{ height: '52px', borderRadius: '10px', background: bgMap[level], border: `1px solid ${borderMap[level]}`, boxShadow: shadowMap[level], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: level === 0 ? 'var(--text-tertiary)' : 'white' }}>
                    {id} {emoji[level]}
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '1rem', fontSize: '0.72rem', color: 'var(--text-secondary)', padding: '0.5rem 0.75rem', borderTop: '1px solid var(--border-card)' }}>
              <span>⬜ Vuoto</span><span style={{ color: '#3b82f6' }}>◼ Attivo</span><span style={{ color: 'var(--warning)' }}>◼ Caldo</span><span style={{ color: 'var(--error)' }}>◼ Fuoco</span>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 4: PR Performance */}
      {activeTab === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Barbershop-style Ranked Leaderboard */}
          <Card style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Crown size={18} color="var(--gold)" />
              <strong style={{ fontSize: '1rem' }}>Classifica PR Live</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: 'auto' }}>Basata su ordini validati</span>
            </div>
            {prList.length > 0 ? (
               <PRLeaderboard data={prList} />
            ) : (
               <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Nessun dato PR disponibile per questa sessione.</p>
            )}
          </Card>

          {/* Upselling Analysis */}
          <Accordion title="Analisi Upselling Live" icon={<TrendingUp size={15} />} borderColor="var(--success)">
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Bottiglie extra ordinate dal cliente dopo l'ingresso (misura la vera capacità di vendita al tavolo).
            </p>
            {[
              { name: 'Alex Rossi', pre: 18, extra: 6, total: 24 },
              { name: 'Marco T.', pre: 16, extra: 3, total: 19 },
              { name: 'Giulia B.', pre: 12, extra: 2, total: 14 },
              { name: 'Francesca N.', pre: 8, extra: 1, total: 9 },
            ].map(({ name, pre, extra, total }) => (
              <div key={name} style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <strong style={{ fontSize: '0.92rem' }}>{name}</strong>
                  <strong style={{ color: 'var(--accent-light)' }}>Tot: {total} bott.</strong>
                </div>
                {/* Stacked bar */}
                <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.35rem' }}>
                  <div style={{ width: `${Math.round((pre / total) * 100)}%`, background: 'var(--accent-color)', transition: 'width 0.5s' }}></div>
                  <div style={{ flex: 1, background: 'var(--success)', opacity: 0.85 }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.73rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>■ Prenotate: {pre}</span>
                  <span style={{ color: 'var(--success)', fontWeight: 600 }}>■ Extra Live: +{extra}</span>
                </div>
              </div>
            ))}
          </Accordion>

          {/* Top Image Girls */}
          <Accordion title="Top Ragazze Immagine" icon={<Star size={15} />} borderColor="#ff3b5c">
             <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Basata su tavoli serviti storicamente e feedback clienti.</p>
             {[
               { name: 'Elena', tavoli: 142, rating: '4.9', color: '#ff3b5c' },
               { name: 'Sofia', tavoli: 110, rating: '4.7', color: 'var(--accent-light)' },
               { name: 'Chiara', tavoli: 85, rating: '4.5', color: 'var(--warning)' },
             ].map((ig, i) => (
               <div key={ig.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                     <span style={{ fontWeight: 800, color: i === 0 ? 'var(--gold)' : 'var(--text-secondary)' }}>#{i+1}</span>
                     <strong style={{ fontSize: '0.9rem' }}>{ig.name}</strong>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                     <strong style={{ color: ig.color, fontSize: '0.9rem', display: 'block' }}>{ig.tavoli} Tavoli</strong>
                     <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>⭐ {ig.rating} Avg</span>
                  </div>
               </div>
             ))}
          </Accordion>

        </div>
      )}
    </div>
  );
}
