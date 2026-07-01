import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { CustomerProvider } from './context/CustomerContext';

// Bootstraps the React app and mounts it into <div id="root"> in index.html.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Makes customer data/functions available to all pages/components. */}
    <CustomerProvider>
      {/* Enables URL-based navigation (/, /add, /edit/:id). */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CustomerProvider>
  </StrictMode>
);
