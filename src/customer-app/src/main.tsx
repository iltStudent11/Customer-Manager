import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { CustomerProvider } from './context/CustomerContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CustomerProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CustomerProvider>
  </StrictMode>
);
