import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    localStorage.clear();
    window.location.href = '/';
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '2rem', 
          textAlign: 'center', 
          background: 'var(--bg-main)',
          color: 'white'
        }}>
          <AlertCircle size={64} color="var(--error)" style={{ marginBottom: '1.5rem' }} />
          <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Ops! Qualcosa è andato storto</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>
            Il sistema ha riscontrato un errore inaspettato. Abbiamo messo in sicurezza i tuoi dati.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '300px' }}>
            <button 
              onClick={() => window.location.reload()} 
              className="btn-primary"
              style={{ padding: '1rem', width: '100%', borderRadius: '12px', border: 'none', background: 'var(--accent-color)', color: 'white', fontWeight: 800, cursor: 'pointer' }}
            >
              <RefreshCw size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> Riprova
            </button>
            <button 
              onClick={this.handleReset} 
              className="btn-secondary"
              style={{ padding: '0.8rem', width: '100%', borderRadius: '12px', border: '1px solid var(--error)', background: 'transparent', color: 'var(--error)', fontWeight: 600, cursor: 'pointer' }}
            >
              Reset Totale
            </button>
          </div>
          
          <p style={{ marginTop: '2rem', fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)' }}>
            Error ID: {Date.now()}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
