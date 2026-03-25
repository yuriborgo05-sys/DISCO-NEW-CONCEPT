import { Routes, Route, Navigate } from 'react-router-dom';
import { NotificationProvider } from './context/NotificationContext';
import { Sparkles } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { CustomerHome } from './pages/CustomerHome';
import { PRHome } from './pages/PRHome';
import { HeadPRHome } from './pages/HeadPRHome';
import { ImageGirlHome } from './pages/ImageGirlHome';
import { AdminHome } from './pages/AdminHome';
import { Register } from './pages/Register';
import { OracleProvider } from './context/OracleContext';
import { TableReservation } from './pages/TableReservation';
import { BottleCatalog } from './pages/BottleCatalog';
import { ForgotPassword } from './pages/ForgotPassword';
import { CustomerProfile } from './pages/CustomerProfile';
import { CustomerReviews } from './pages/CustomerReviews';
import { AdminManagement } from './pages/AdminManagement';
import { AdminCustomers } from './pages/AdminCustomers';
import { DirectionAnalytics } from './pages/DirectionAnalytics';
import { WaiterHome } from './pages/WaiterHome';
import { PhotographerHome } from './pages/PhotographerHome';
import { ARHostess } from './pages/ARHostess';
import { BottomNav } from './components/BottomNav';
import { VirtualAssistant } from './components/VirtualAssistant';

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function MainApp() {
  const { user } = useAuth();

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={
           !user ? (
            <div className="glass-panel" style={{ textAlign: 'center', margin: 'auto' }}>
              <Sparkles className="icon-glow" size={48} color="var(--accent-color)" style={{ margin: '0 auto 1rem' }} />
              <h1>Bamboo</h1>
              <p>TOO MUCH Agencies</p>
              <div style={{ marginTop: '2rem' }}>
                 <Navigate to="/login" replace />
              </div>
            </div>
          ) : <Navigate to={
            (user.role === 'admin' || user.role === 'regia' || user.role === 'direzione') ? '/admin' :
            (user.role === 'head_pr' || user.role === 'capo_pr') ? '/head-pr' : 
            (user.role === 'image_girl' || user.role === 'immagine') ? '/image-girl' : 
            (user.role === 'user' || user.role === 'cliente') ? '/customer' : 
            (user.role === 'waiter' || user.role === 'cameriere') ? '/waiter' :
            (user.role === 'bodyguard' || user.role === 'security') ? '/security' :
            (user.role === 'photographer' || user.role === 'fotografo') ? '/photographer' :
            (user.role === 'cashier' || user.role === 'cassa') ? '/admin' :
            `/${user.role}`
          } replace />
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Protected Routes */}
        <Route path="/customer" element={ <ProtectedRoute roles={['cliente', 'user']}><CustomerHome /></ProtectedRoute> } />
        <Route path="/customer/reservation" element={ <ProtectedRoute roles={['cliente', 'user']}><TableReservation /></ProtectedRoute> } />
        <Route path="/customer/bottles" element={ <ProtectedRoute roles={['cliente', 'user']}><BottleCatalog /></ProtectedRoute> } />
        <Route path="/customer/ar-hostess" element={ <ProtectedRoute roles={['cliente', 'user']}><ARHostess /></ProtectedRoute> } />
        <Route path="/ar-hostess" element={ <ProtectedRoute roles={['cliente', 'user']}><ARHostess /></ProtectedRoute> } />
        <Route path="/customer/profile" element={ <ProtectedRoute roles={['cliente', 'user']}><CustomerProfile /></ProtectedRoute> } />
        <Route path="/customer/reviews" element={ <ProtectedRoute roles={['cliente', 'user']}><CustomerReviews /></ProtectedRoute> } />
        
        <Route path="/pr" element={ <ProtectedRoute roles={['pr']}><PRHome /></ProtectedRoute> } />
        <Route path="/head-pr" element={ <ProtectedRoute roles={['head_pr', 'capo_pr']}><HeadPRHome /></ProtectedRoute> } />
        
        {/* Admin and Direction Routes */}
        <Route path="/admin" element={ <ProtectedRoute roles={['admin', 'regia', 'cashier', 'cassa']}><AdminHome /></ProtectedRoute> } />
        <Route path="/admin/management" element={ <ProtectedRoute roles={['admin', 'regia']}><AdminManagement /></ProtectedRoute> } />
        <Route path="/admin/customers" element={ <ProtectedRoute roles={['admin', 'regia']}><AdminCustomers /></ProtectedRoute> } />
        <Route path="/direzione" element={ <ProtectedRoute roles={['direzione', 'admin']}><DirectionAnalytics /></ProtectedRoute> } />
        
        <Route path="/immagine" element={ <ProtectedRoute roles={['image_girl', 'immagine']}><ImageGirlHome /></ProtectedRoute> } />
        <Route path="/image-girl" element={ <ProtectedRoute roles={['image_girl', 'immagine']}><ImageGirlHome /></ProtectedRoute> } />
        
        <Route path="/waiter" element={ <ProtectedRoute roles={['waiter', 'cameriere']}><WaiterHome /></ProtectedRoute> } />
        <Route path="/cameriere" element={ <ProtectedRoute roles={['waiter', 'cameriere']}><WaiterHome /></ProtectedRoute> } />
        
        <Route path="/photographer" element={ <ProtectedRoute roles={['photographer', 'fotografo']}><PhotographerHome /></ProtectedRoute> } />
        <Route path="/fotografo" element={ <ProtectedRoute roles={['photographer', 'fotografo']}><PhotographerHome /></ProtectedRoute> } />
        
        <Route path="/security" element={ <ProtectedRoute roles={['bodyguard', 'security']}><div className="app-container p-4"><h2>SECURITY COMMAND</h2><p style={{color:'var(--error)'}}>Monitoraggio SOS in tempo reale ATTIVO.</p></div></ProtectedRoute> } />
        <Route path="/bodyguard" element={ <ProtectedRoute roles={['bodyguard', 'security']}><div className="app-container p-4"><h2>SECURITY COMMAND</h2><p style={{color:'var(--error)'}}>Monitoraggio SOS in tempo reale ATTIVO.</p></div></ProtectedRoute> } />
      </Routes>
      <BottomNav />
      <VirtualAssistant />
    </div>
  );
}


export default function App() {
  return (
    <AuthProvider>
      <OracleProvider>
        <NotificationProvider>
          <MainApp />
        </NotificationProvider>
      </OracleProvider>
    </AuthProvider>
  );
}
