import { NavLink, Outlet } from 'react-router-dom';

export default function Layout() {
  // NavLink provides route awareness so we can style the active page link.
  const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    textDecoration: 'none',
    color: isActive ? '#0f172a' : '#334155',
    fontWeight: isActive ? 700 : 500,
    padding: '0.375rem 0.625rem',
    borderRadius: '0.375rem',
    backgroundColor: isActive ? '#e2e8f0' : 'transparent',
  });

  return (
    // Shared app shell around every route.
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <header
        style={{
          borderBottom: '1px solid #cbd5e1',
          backgroundColor: '#ffffff',
        }}
      >
        <div
          style={{
            maxWidth: '960px',
            margin: '0 auto',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <h1 style={{ margin: 0, fontSize: '1.25rem' }}>Customer Manager</h1>
          {/* Main navigation between list and add screens. */}
          <nav style={{ display: 'flex', gap: '1rem' }} aria-label="Main navigation">
            <NavLink to="/" end style={navLinkStyle}>
              Customers
            </NavLink>
            <NavLink to="/add" style={navLinkStyle}>
              Add Customer
            </NavLink>
          </nav>
        </div>
      </header>

      <main
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: '1.5rem 1.25rem',
        }}
      >
        {/* Routed page content appears here. */}
        <Outlet />
      </main>
    </div>
  );
}
