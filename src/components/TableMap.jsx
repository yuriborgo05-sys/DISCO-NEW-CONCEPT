import React from 'react';

export function TableMap({ selectedTableId, onSelectTable }) {
  const getStyle = (id, type) => {
    const isSelected = selectedTableId === id;
    const baseColor = type === 'dancefloor' ? 'var(--success)' : type === 'prive' ? 'var(--warning)' : 'var(--error)';
    return {
      width: 'clamp(28px, 8vw, 42px)', 
      height: 'clamp(28px, 8vw, 42px)', 
      borderRadius: '50%', 
      backgroundColor: baseColor,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 'clamp(0.6rem, 2vw, 0.9rem)', 
      fontWeight: 800, color: 'black',
      border: isSelected ? '3px solid white' : '2px solid rgba(0,0,0,0.5)',
      boxShadow: isSelected ? `0 0 20px ${baseColor}` : '0 2px 5px rgba(0,0,0,0.4)',
      cursor: 'pointer',
      transform: isSelected ? 'scale(1.1)' : 'scale(1)',
      transition: 'all 0.2s', flexShrink: 0
    };
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', background: 'radial-gradient(circle at center, #1a1a1a 0%, #000 100%)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: 'inset 0 0 30px rgba(0,0,0,0.8)' }}>
        
        <h4 style={{ textAlign: 'center', color: 'var(--text-secondary)', letterSpacing: '0.2em', opacity: 0.6, fontSize: '0.8rem', margin: 0 }}>DANCE FLOOR AREA</h4>

        {/* Dancefloor Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 5%' }}>
          {/* Left Col */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
             {[110, 109, 108, 107, 106].map(id => <div key={id} onClick={() => onSelectTable(id)} style={getStyle(id, 'dancefloor')}>{id}</div>)}
          </div>
          {/* Right Col */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
             {[105, 104, 103, 102, 101].map(id => <div key={id} onClick={() => onSelectTable(id)} style={getStyle(id, 'dancefloor')}>{id}</div>)}
          </div>
        </div>

        {/* CONSOLE */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10%', marginTop: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
             {[14, 13].map(id => <div key={id} onClick={() => onSelectTable(id)} style={getStyle(id, 'console')}>{id}</div>)}
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', width: '30%', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <h3 style={{ margin: 0, fontSize: 'clamp(0.8rem, 3vw, 1.2rem)', letterSpacing: '0.05em' }}>CONSOLE</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
             {[12, 11].map(id => <div key={id} onClick={() => onSelectTable(id)} style={getStyle(id, 'console')}>{id}</div>)}
          </div>
        </div>

        <h4 style={{ textAlign: 'center', color: 'var(--text-secondary)', letterSpacing: '0.2em', opacity: 0.6, fontSize: '0.8rem', margin: '1rem 0 0' }}>PRIVE AREA</h4>

        {/* Prive U-Shape */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            {/* Top Row */}
            <div style={{ display: 'flex', gap: '20%' }}>
               <div onClick={() => onSelectTable(5)} style={getStyle(5, 'prive')}>{5}</div>
               <div onClick={() => onSelectTable(4)} style={getStyle(4, 'prive')}>{4}</div>
            </div>

            {/* Middle & Bottom Rows via Flex Space-Between */}
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '70%', alignItems: 'flex-end' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                   {[6, 7, 8].map(id => <div key={id} onClick={() => onSelectTable(id)} style={getStyle(id, 'prive')}>{id}</div>)}
                </div>
                
                <div style={{ display: 'flex', gap: '15%', paddingBottom: '0.5rem' }}>
                   <div onClick={() => onSelectTable(9)} style={getStyle(9, 'prive')}>{9}</div>
                   <div onClick={() => onSelectTable(10)} style={getStyle(10, 'prive')}>{10}</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                   {[3, 2, 1].map(id => <div key={id} onClick={() => onSelectTable(id)} style={getStyle(id, 'prive')}>{id}</div>)}
                </div>
            </div>
        </div>

        {/* BAR */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', textAlign: 'center', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', marginTop: '1.5rem', width: '60%', alignSelf: 'center' }}>
           <h3 style={{ margin: 0, color: 'var(--text-secondary)', letterSpacing: '0.3em', fontSize: '1rem' }}>BAR</h3>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10%', marginTop: '-0.5rem' }}>
           <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>USCITA</span>
           <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>INGRESSO</span>
        </div>
    </div>
  );
}
