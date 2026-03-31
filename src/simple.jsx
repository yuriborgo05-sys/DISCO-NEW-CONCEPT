import React from 'react'
import ReactDOM from 'react-dom/client'

const SimpleApp = () => (
  <div style={{ background: 'blue', color: 'white', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
    SIMPLE TEST: REACT IS ALIVE
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SimpleApp />
  </React.StrictMode>
)
