import React from 'react';
import { Home, Wine, Ticket, Star, ShieldCheck } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hapticSoftPop } from '../utils/haptics';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  if (!user || user.role !== 'cliente') return null;
  // Solo visualizzato nelle route principali del cliente, scompare in checkout ecc per focus
  const showNavPaths = ['/customer', '/customer/bottles', '/customer/reservation', '/customer/profile'];
  if (!showNavPaths.includes(location.pathname)) return null;

  const tabs = [
    { id: 'home', icon: Home, label: 'Home', path: '/customer' },
    { id: 'bottle', icon: Wine, label: 'Ordina', path: '/customer/bottles' },
    { id: 'vip', icon: Star, label: 'VIP', path: '/customer/profile' },
  ];

  const handleNav = (path) => {
    hapticSoftPop();
    navigate(path);
  };

  return (
    <div className="dynamic-island-nav">
      {tabs.map((t) => {
        const Icon = t.icon;
        const active = location.pathname === t.path;
        return (
          <div key={t.id} className={`nav-item ${active ? 'active' : ''}`} onClick={() => handleNav(t.path)}>
             <Icon size={active ? 24 : 20} strokeWidth={active ? 2.5 : 2} style={{ transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }} />
             <span style={{ transform: active ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.3s' }}>{t.label}</span>
          </div>
        );
      })}
    </div>
  );
}
