import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={styles.header}>
      <div className="container" style={styles.inner}>
        <Link to="/" style={styles.brand}>
          <span style={styles.brandIcon}>🎬</span>
          <span>Cine<span style={{ color: 'var(--accent)' }}>Book</span></span>
        </Link>

        <nav style={styles.nav}>
          <Link to="/" style={styles.link}>Movies</Link>
          {user && <Link to="/bookings" style={styles.link}>My Bookings</Link>}
          {isAdmin && <Link to="/admin" style={styles.link}>Admin Panel</Link>}
        </nav>

        <div style={styles.actions}>
          {user ? (
            <div style={styles.userMenuWrap}>
              <button style={styles.userChip} onClick={() => setMenuOpen((o) => !o)}>
                <span style={styles.avatar}>{user.fullName?.[0]?.toUpperCase() || 'U'}</span>
                <span style={styles.userName}>{user.fullName?.split(' ')[0]}</span>
              </button>
              {menuOpen && (
                <div style={styles.dropdown} onMouseLeave={() => setMenuOpen(false)}>
                  <div style={styles.dropdownEmail}>{user.email}</div>
                  <Link to="/bookings" style={styles.dropdownItem} onClick={() => setMenuOpen(false)}>My Bookings</Link>
                  {isAdmin && <Link to="/admin" style={styles.dropdownItem} onClick={() => setMenuOpen(false)}>Admin Panel</Link>}
                  <button style={styles.dropdownLogout} onClick={handleLogout}>Log out</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Log in</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    height: 'var(--header-height)',
    borderBottom: '1px solid var(--border-subtle)',
    background: 'rgba(11, 13, 18, 0.85)',
    backdropFilter: 'blur(10px)',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  inner: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: '1.25rem',
    fontWeight: 800,
    letterSpacing: '-0.02em',
  },
  brandIcon: { fontSize: '1.4rem' },
  nav: {
    display: 'flex',
    gap: 28,
    flex: 1,
    justifyContent: 'center',
  },
  link: {
    color: 'var(--text-secondary)',
    fontWeight: 600,
    fontSize: '0.92rem',
    transition: 'color 0.15s ease',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  userMenuWrap: { position: 'relative' },
  userChip: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'var(--bg-card)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 999,
    padding: '6px 14px 6px 6px',
    cursor: 'pointer',
    color: 'var(--text-primary)',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--accent), #8f1c20)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '0.8rem',
  },
  userName: { fontWeight: 600, fontSize: '0.88rem' },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: 'calc(100% + 8px)',
    background: 'var(--bg-card)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-lg)',
    minWidth: 200,
    overflow: 'hidden',
  },
  dropdownEmail: {
    padding: '12px 16px',
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    borderBottom: '1px solid var(--border-subtle)',
  },
  dropdownItem: {
    display: 'block',
    padding: '10px 16px',
    fontSize: '0.88rem',
    color: 'var(--text-primary)',
  },
  dropdownLogout: {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    padding: '10px 16px',
    fontSize: '0.88rem',
    color: 'var(--danger)',
    background: 'none',
    border: 'none',
    borderTop: '1px solid var(--border-subtle)',
    cursor: 'pointer',
  },
};
