export const noxMenu = [
  { category: 'Champagne', items: [
    { name: 'Moet & Chandon Reserve Imperial', price: 150, passPrice: 180 },
    { name: 'Clicquot Brut', price: 160, passPrice: 190 },
    { name: 'Moet & Chandon N.I.R. Rosè', price: 200, passPrice: 220 },
    { name: 'Moet & Chandon ICE Imperial', price: 200, passPrice: 220 },
    { name: 'R di Ruinart', price: 170, passPrice: 200 },
    { name: 'Ruinart Blanc de Blanc', price: 220, passPrice: 250 },
    { name: 'Ruinart Rosè', price: 220, passPrice: 250 },
    { name: 'Perrier Jouet Grand Brut', price: 170, passPrice: 200 },
    { name: 'Perrier Jouet Blason Rosè', price: 200, passPrice: 220 },
    { name: 'Perrier Jouet Belle Epoque', price: 500, passPrice: 550 },
    { name: 'Dom Perignon Vintage', price: 500, passPrice: 550 },
    { name: 'Dom Perignon Vintage Fluo', price: 550, passPrice: 600, inventory_count: 0 },
    { name: 'Dom Perignon Vintage Rosè', price: 700, passPrice: 750 },
    { name: 'Cristal Brut', price: 600, passPrice: 650 },
    { name: 'Cristal Brut Rosè', price: 800, passPrice: 850 },
    { name: 'Krug Grande Cuvée', price: 600, passPrice: 650 },
    { name: 'Armand De Brignac Brut Gold', price: 700, passPrice: 750 },
    { name: 'Magnum Moet Imperial', price: 350, passPrice: 400 },
    { name: 'Magnum Moet N.I.R. Rosè', price: 500, passPrice: 550 },
    { name: 'Magnum Moet ICE Imperial', price: 500, passPrice: 550 },
    { name: 'Magnum Dom Perignon Vintage', price: 1500, passPrice: 1550 },
    { name: 'Moet Imperial 3L', price: 800, passPrice: 850 },
    { name: 'Moet N.I.R. Rosè 3L', price: 1500, passPrice: 1550 }
  ]},
  { category: 'Vodka', items: [
    { name: 'Grey Goose', price: 150, passPrice: 180 },
    { name: 'Grey Goose Altius', price: 350, passPrice: 400 },
    { name: 'Au fruttati', price: 150, passPrice: 180 },
    { name: 'Magnum Grey Goose', price: 400, passPrice: 450 },
    { name: 'Grey Goose 3L', price: 750, passPrice: 800 },
    { name: 'Grey Goose 6L', price: 1500, passPrice: 1700 }
  ]},
  { category: 'Tequila', items: [
    { name: 'Patron Silver', price: 160, passPrice: 180 },
    { name: 'Patron Anejo', price: 160, passPrice: 180 },
    { name: 'Patron Reposado', price: 160, passPrice: 180 },
    { name: 'Patron "El Alto"', price: 500, passPrice: 550 },
    { name: 'Tequiero Reposado', price: 180, passPrice: 200 },
    { name: 'Don Julio Reposado', price: 200, passPrice: 230 },
    { name: 'Don Julio 1942', price: 550, passPrice: 600 },
    { name: 'Clase Azul Plata', price: 500, passPrice: 550 },
    { name: 'Clase Azul Reposado', price: 600, passPrice: 650 },
    { name: 'Clase Azul Durango', price: 1500, passPrice: 1550 }
  ]},
  { category: 'Rum', items: [
    { name: 'Havana Club 7Y', price: 150, passPrice: 180 },
    { name: 'Santa Teresa', price: 170, passPrice: 200 },
    { name: 'Zacapa 23', price: 200, passPrice: 220 },
    { name: 'Barcelo Imperial', price: 200, passPrice: 220 },
    { name: 'Brugal Leyenda', price: 220, passPrice: 250 }
  ]},
  { category: 'Gin', items: [
    { name: 'Bombay Premiere Cru', price: 150, passPrice: 180 },
    { name: 'Mare', price: 160, passPrice: 180 },
    { name: 'Hendrick\'s', price: 160, passPrice: 180 },
    { name: 'Barbarasa', price: 150, passPrice: 180 }
  ]},
  { category: 'Whisky & Cognac', items: [
    { name: 'Jack Daniel\'s Tennessee', price: 150, passPrice: 180 },
    { name: 'Fireball', price: 150, passPrice: 180 },
    { name: 'Aberfeldy 12 YO', price: 180, passPrice: 200 },
    { name: 'Jhonnie Walker Black Label', price: 180, passPrice: 200 },
    { name: 'Jhonnie Walker Gold Label', price: 220, passPrice: 250 },
    { name: 'Hennessy', price: 170, passPrice: 200 }
  ]},
  { category: 'Analcolici', items: [
    { name: 'Coca Cola', price: 5, passPrice: 5 },
    { name: 'Lemon Soda', price: 5, passPrice: 5 },
    { name: 'Succo Arancia', price: 5, passPrice: 5 },
    { name: 'Succo Ananas', price: 5, passPrice: 5 },
    { name: 'Tonica Schweppes', price: 5, passPrice: 5 },
    { name: 'Red Bull', price: 8, passPrice: 8 },
    { name: 'Acqua Naturale', price: 3, passPrice: 3 },
    { name: 'Acqua Frizzante', price: 3, passPrice: 3 }
  ]}
];

// ═══════════════════════════════════════════════════════════
//  REAL VENUE TABLE LAYOUT — TOO MUCH / NOX CLUB
//
//  SECTION 1: DANCE FLOOR (10 tavoli pista + 4 console VIP)
//             → Mantenuti come nell'originale
//
//  SECTION 2: PRIVÉ (12 tavoli nella disposizione reale)
//    ZONE A: "Dietro DJ"     — 4 tavoli orizzontali
//    ZONE B: "Laterali"      — 4 tavoli sui lati (2 sx, 2 dx)
//    ZONE C: "Fronte Bar"    — 2 tavoli avanti al bar
//    ZONE D: "Angoli Entrate"— 2 tavoli agli angoli delle entrate
// ═══════════════════════════════════════════════════════════

export const VENUE_ZONES = [
  { id: 'dancefloor', label: 'Pista',            color: '#10b981' },
  { id: 'console',    label: 'Console VIP',      color: '#ef4444' },
  { id: 'dj',         label: 'Dietro DJ',        color: '#a855f7' },
  { id: 'lateral',    label: 'Laterali Pista',   color: '#3b82f6' },
  { id: 'bar',        label: 'Fronte Bar',       color: '#f59e0b' },
  { id: 'entrance',   label: 'Angoli Entrate',   color: '#ef4444' },
];

// ─── DANCE FLOOR TABLES (Originali) ─────────────────────
export const dancefloorTables = [
  ...[101, 102, 103, 104, 105, 106, 107, 108, 109, 110].map(id => ({
    id: String(id), label: String(id), zone: 'dancefloor',
    name: `Dance Floor ${id}`, type: 'dancefloor', minSpend: 360, capacity: 6
  })),
];

// ─── CONSOLE VIP TABLES (Originali) ─────────────────────
export const consoleTables = [
  ...[11, 12, 13, 14].map(id => ({
    id: String(id), label: String(id), zone: 'console',
    name: `Console VIP ${id}`, type: 'console', minSpend: 2000, capacity: 12
  })),
];

// ─── PRIVÉ TABLES (Disposizione Reale del Locale) ───────
export const priveTables = [
  // ZONE A: Dietro DJ (4 tavoli orizzontali)
  { id: 'P1',  label: 'P1',  zone: 'dj',       name: 'Privé 1',  type: 'prive', minSpend: 1000, capacity: 10 },
  { id: 'P2',  label: 'P2',  zone: 'dj',       name: 'Privé 2',  type: 'prive', minSpend: 1000, capacity: 10 },
  { id: 'P3',  label: 'P3',  zone: 'dj',       name: 'Privé 3',  type: 'prive', minSpend: 1000, capacity: 10 },
  { id: 'P4',  label: 'P4',  zone: 'dj',       name: 'Privé 4',  type: 'prive', minSpend: 1000, capacity: 10 },

  // ZONE B: Laterali Pista (2 sinistri + 2 destri)
  { id: 'P5',  label: 'P5',  zone: 'lateral',  name: 'Privé 5',  type: 'prive', minSpend: 800,  capacity: 8 },
  { id: 'P6',  label: 'P6',  zone: 'lateral',  name: 'Privé 6',  type: 'prive', minSpend: 800,  capacity: 8 },
  { id: 'P7',  label: 'P7',  zone: 'lateral',  name: 'Privé 7',  type: 'prive', minSpend: 800,  capacity: 8 },
  { id: 'P8',  label: 'P8',  zone: 'lateral',  name: 'Privé 8',  type: 'prive', minSpend: 800,  capacity: 8 },

  // ZONE C: Fronte Bar (2 tavoli)
  { id: 'P9',  label: 'P9',  zone: 'bar',      name: 'Privé 9',  type: 'prive', minSpend: 600,  capacity: 6 },
  { id: 'P10', label: 'P10', zone: 'bar',      name: 'Privé 10', type: 'prive', minSpend: 600,  capacity: 6 },

  // ZONE D: Angoli Entrate (2 tavoli)
  { id: 'P11', label: 'P11', zone: 'entrance', name: 'Privé 11', type: 'prive', minSpend: 500,  capacity: 6 },
  { id: 'P12', label: 'P12', zone: 'entrance', name: 'Privé 12', type: 'prive', minSpend: 500,  capacity: 6 },
];

// Tutti i tavoli unificati
export const noxTables = [...dancefloorTables, ...consoleTables, ...priveTables];

// Helpers
export const getTableById = (id) => noxTables.find(t => t.id === String(id));
export const getZoneById = (id) => VENUE_ZONES.find(z => z.id === id);
