import { NavLink, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    // Shared app shell around every route.
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <h1 className="app-title">Customer Manager</h1>
          {/* Main navigation between list and add screens. */}
          <nav className="app-nav" aria-label="Main navigation">
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
        {/* Routed page content appears here. */}
        <Outlet />
      </main>
    </div>
  );
}
