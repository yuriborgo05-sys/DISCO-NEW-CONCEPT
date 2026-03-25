import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Accordion — Bamboo Design System
 * Collapsible section with premium animation.
 * Props:
 *   title: string
 *   icon: ReactNode (optional)
 *   badge: string (optional, e.g. "3" for count indicators)
 *   badgeColor: CSS color string (default: accent)
 *   defaultOpen: boolean (default: false)
 *   children: ReactNode
 *   borderColor: CSS color (optional accent border on left)
 */
export function Accordion({ title, icon, badge, badgeColor, defaultOpen = false, children, borderColor }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-card)',
      borderLeft: borderColor ? `3px solid ${borderColor}` : '1px solid var(--border-card)',
      borderRadius: '16px',
      overflow: 'hidden',
      transition: 'border-color 0.2s'
    }}>
      {/* Header */}
      <button
        onClick={() => setIsOpen(o => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.25rem',
          background: 'none',
          border: 'none',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          gap: '0.75rem',
          textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1 }}>
          {icon && <span style={{ color: 'var(--accent-color)', display: 'flex', alignItems: 'center' }}>{icon}</span>}
          <span style={{ fontWeight: 600, fontSize: '0.95rem', letterSpacing: '0.01em' }}>{title}</span>
          {badge !== undefined && (
            <span style={{
              background: badgeColor || 'var(--accent-color)',
              color: 'white',
              fontSize: '0.65rem',
              fontWeight: 800,
              padding: '0.15rem 0.45rem',
              borderRadius: '20px',
              letterSpacing: '0.02em'
            }}>{badge}</span>
          )}
        </div>
        <ChevronDown
          size={18}
          color="var(--text-secondary)"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s ease',
            flexShrink: 0
          }}
        />
      </button>

      {/* Body */}
      <div style={{
        maxHeight: isOpen ? '2000px' : '0',
        overflow: 'hidden',
        transition: 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <div style={{ padding: '0 1.25rem 1.25rem 1.25rem', borderTop: '1px solid var(--border-card)' }}>
          <div style={{ paddingTop: '1rem' }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
