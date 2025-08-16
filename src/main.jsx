import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.jsx';
import { InstanceProvider } from './context/InstanceContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <InstanceProvider>
        <App />
      </InstanceProvider>
    </AuthProvider>
  </React.StrictMode>,
);
