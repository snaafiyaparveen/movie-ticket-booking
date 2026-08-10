import { NavLink, Outlet } from 'react-router-dom';

const LINKS = [
  { to: '/admin', label: 'Overview', end: true, icon: '📊' },
  { to: '/admin/movies', label: 'Movies', icon: '🎞️' },
  { to: '/admin/theaters', label: 'Theaters', icon: '🏛️' },
  { to: '/admin/shows', label: 'Shows', icon: '🕒' },
];

export default function AdminLayout() {
  return (
    <div className="page">
      <div className="container" style={styles.wrap}>
        <aside className="card" style={styles.sidebar}>
          <div style={styles.sidebarTitle}>Admin Panel</div>
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              style={({ isActive }) => ({
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {}),
              })}
            >
              <span>{link.icon}</span> {link.label}
            </NavLink>
          ))}
        </aside>

        <div style={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrap: { display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24, alignItems: 'flex-start' },
  sidebar: { padding: 16, position: 'sticky', top: 88 },
  sidebarTitle: { fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', padding: '8px 10px 14px' },
  navItem: {
    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 'var(--radius-sm)',
    color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: 4,
  },
  navItemActive: { background: 'var(--accent-soft)', color: 'var(--accent)' },
  content: { minWidth: 0 },
};
