import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NoxProvider } from './context/NoxContext';

// Core Pages (Lazy Loaded for Performance & Code Splitting)
const Login = React.lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const LoginStaff = React.lazy(() => import('./pages/LoginStaff').then(m => ({ default: m.LoginStaff })));
const Register = React.lazy(() => import('./pages/Register').then(m => ({ default: m.Register })));
const CustomerHome = React.lazy(() => import('./pages/CustomerHome').then(m => ({ default: m.CustomerHome })));
const AdminHome = React.lazy(() => import('./pages/AdminHome').then(m => ({ default: m.AdminHome })));
const AdminManagement = React.lazy(() => import('./pages/AdminManagement').then(m => ({ default: m.AdminManagement })));
const AdminCustomers = React.lazy(() => import('./pages/AdminCustomers').then(m => ({ default: m.AdminCustomers })));
const DirectionAnalytics = React.lazy(() => import('./pages/DirectionAnalytics').then(m => ({ default: m.DirectionAnalytics })));
const BottleCatalog = React.lazy(() => import('./pages/BottleCatalog').then(m => ({ default: m.BottleCatalog })));
const TableReservation = React.lazy(() => import('./pages/TableReservation').then(m => ({ default: m.TableReservation })));
const CustomerProfile = React.lazy(() => import('./pages/CustomerProfile').then(m => ({ default: m.CustomerProfile })));
const CustomerReviews = React.lazy(() => import('./pages/CustomerReviews').then(m => ({ default: m.CustomerReviews })));
const PRHome = React.lazy(() => import('./pages/PRHome').then(m => ({ default: m.PRHome })));
const HeadPRHome = React.lazy(() => import('./pages/HeadPRHome').then(m => ({ default: m.HeadPRHome })));
const WaiterHome = React.lazy(() => import('./pages/WaiterHome').then(m => ({ default: m.WaiterHome })));
const CambusaHome = React.lazy(() => import('./pages/CambusaHome').then(m => ({ default: m.CambusaHome })));
const ImageGirlHome = React.lazy(() => import('./pages/ImageGirlHome').then(m => ({ default: m.ImageGirlHome })));
const PhotographerHome = React.lazy(() => import('./pages/PhotographerHome').then(m => ({ default: m.PhotographerHome })));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const BodyguardHome = React.lazy(() => import('./pages/BodyguardHome').then(m => ({ default: m.BodyguardHome })));

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="app-container flex items-center justify-center"><h2>Caricamento...</h2></div>;
  if (!user) return <Navigate to="/login" replace />;
  
  const userRole = (user.role || 'cliente').toLowerCase();
  if (roles && !roles.map(r => r.toLowerCase()).includes(userRole)) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <ErrorBoundary>
      <NoxProvider>
        <AuthProvider>
          <NotificationProvider>
            <Suspense fallback={<div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)'}}><h3>Inizializzazione Modulo...</h3></div>}>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/staff" element={<LoginStaff />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* Protected Routes */}
              <Route path="/customer" element={ <ProtectedRoute roles={['cliente']}><CustomerHome /></ProtectedRoute> } />
              <Route path="/catalog" element={ <ProtectedRoute roles={['cliente', 'pr', 'capo_pr']}><BottleCatalog /></ProtectedRoute> } />
              <Route path="/reservation" element={ <ProtectedRoute roles={['cliente']}><TableReservation /></ProtectedRoute> } />
              <Route path="/profile" element={ <ProtectedRoute roles={['cliente']}><CustomerProfile /></ProtectedRoute> } />
              <Route path="/reviews" element={ <ProtectedRoute roles={['cliente']}><CustomerReviews /></ProtectedRoute> } />
              
              <Route path="/pr" element={ <ProtectedRoute roles={['pr', 'capo_pr']}><PRHome /></ProtectedRoute> } />
              <Route path="/head-pr" element={ <ProtectedRoute roles={['head_pr', 'capo_pr', 'admin']}><HeadPRHome /></ProtectedRoute> } />
              
              <Route path="/admin" element={ <ProtectedRoute roles={['admin', 'regia', 'cashier', 'cassa', 'direzione']}><AdminHome /></ProtectedRoute> } />
              <Route path="/admin/management" element={ <ProtectedRoute roles={['admin', 'regia', 'direzione', 'cassa']}><AdminManagement /></ProtectedRoute> } />
              <Route path="/admin/customers" element={ <ProtectedRoute roles={['admin', 'regia', 'direzione', 'cassa']}><AdminCustomers /></ProtectedRoute> } />
              <Route path="/direzione" element={ <ProtectedRoute roles={['direzione', 'admin', 'cassa']}><DirectionAnalytics /></ProtectedRoute> } />
              
              <Route path="/bodyguard" element={ <ProtectedRoute roles={['bodyguard', 'security']}><BodyguardHome /></ProtectedRoute> } />
              
              <Route path="/waiter" element={ <ProtectedRoute roles={['cameriere', 'admin', 'cassa']}><WaiterHome /></ProtectedRoute> } />
              <Route path="/cambusa" element={ <ProtectedRoute roles={['cambusa', 'admin', 'cassa']}><CambusaHome /></ProtectedRoute> } />
              <Route path="/immagine" element={ <ProtectedRoute roles={['immagine', 'admin', 'cassa']}><ImageGirlHome /></ProtectedRoute> } />
              <Route path="/photographer" element={ <ProtectedRoute roles={['fotografo', 'admin', 'cassa']}><PhotographerHome /></ProtectedRoute> } />
              
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
            </Suspense>
          </NotificationProvider>
      </AuthProvider>
      </NoxProvider>
    </ErrorBoundary>
  );
}

export default App;
