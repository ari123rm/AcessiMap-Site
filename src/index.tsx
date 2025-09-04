import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // 1. Importe o BrowserRouter
import App from './App';
import { AuthProvider } from './context/AuthContext'; // 2. Importe o AuthProvider
import './index.scss';

import * as serviceWorkerRegistration from './services/serviceWorkerRegistration';
import { CustomThemeProvider } from './context/ThemeContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

serviceWorkerRegistration.register();

root.render(
  <React.StrictMode>
    <BrowserRouter> 
      <AuthProvider> 
         <CustomThemeProvider>
          <App />
        </CustomThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

