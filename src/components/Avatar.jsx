import React from 'react';

export function Avatar({ name, size = 48 }) {
  const initial = name ? name.charAt(0).toUpperCase() : 'U';
  
  // A palette of vibrant IOS-like gradients
  const colors = [
    ['#f43f5e', '#be123c'], // Rose
    ['#8b5cf6', '#6d28d9'], // Violet
    ['#3b82f6', '#1d4ed8'], // Blue
    ['#10b981', '#047857'], // Emerald
    ['#f59e0b', '#b45309'], // Amber
    ['#ec4899', '#be185d']  // Pink
  ];
  
  // Simple deterministic hash
  const hash = name ? [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length : 0;
  
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `linear-gradient(135deg, ${colors[hash][0]} 0%, ${colors[hash][1]} 100%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 800, fontSize: size * 0.45, color: 'white', 
      border: '2px solid rgba(255,255,255,0.15)', flexShrink: 0,
      boxShadow: `0 4px 10px ${colors[hash][1]}40`
    }}>
      {initial}
    </div>
  );
}
