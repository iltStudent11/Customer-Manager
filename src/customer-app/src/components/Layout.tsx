import { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export default function Layout() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = isDarkMode ? 'dark' : 'light';
    window.localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <h1 className="app-title">Customer Manager</h1>
          <nav className="app-nav" aria-label="Main navigation">
            <button
              type="button"
              className="app-nav-toggle"
              onClick={() => setIsDarkMode((prev) => !prev)}
            >
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <NavLink
              to="/"
              end
              className={({ isActive }) => `app-nav-link ${isActive ? 'active' : ''}`.trim()}
            >
              Customers
            </NavLink>
            <NavLink
              to="/add"
              className={({ isActive }) => `app-nav-link ${isActive ? 'active' : ''}`.trim()}
            >
              Add Customer
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
