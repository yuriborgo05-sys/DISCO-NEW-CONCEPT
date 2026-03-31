import React, { createContext, useContext, useState } from 'react';
import { Bell } from 'lucide-react';

const NotificationContext = createContext({});

export const useNotification = () => useContext(NotificationContext);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (title, message, type = 'default') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, title, message, type }]);
    
    // Auto remove after 5s
    setTimeout(() => {
       setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      {/* GLOBAL TOASTER UI (Dynamic Island Slim Style) */}
      <div style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', pointerEvents: 'none' }}>
         {notifications.map(n => (
            <div key={n.id} className="notif-pill">
               <div style={{ background: n.type === 'success' ? 'var(--success)' : n.type === 'error' ? 'var(--error)' : 'var(--accent-color)', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bell size={12} color="white" />
               </div>
               <div style={{ paddingRight: '0.5rem' }}>
                  <span style={{ display: 'block', fontSize: '0.85rem', color: 'white', fontWeight: 600 }}>{n.title}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginTop: '-2px' }}>{n.message}</span>
               </div>
            </div>
         ))}
      </div>
      <style>{`
         @keyframes slideDown {
            from { transform: translateY(-100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
         }
      `}</style>
    </NotificationContext.Provider>
  );
}
