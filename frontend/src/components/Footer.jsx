export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div className="container" style={styles.inner}>
        <span style={styles.brand}>🎬 CineBook</span>
        <span style={styles.text}>© {new Date().getFullYear()} CineBook. Built for GUVI × HCL Capstone.</span>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    borderTop: '1px solid var(--border-subtle)',
    padding: '24px 0',
    marginTop: 40,
  },
  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  brand: { fontWeight: 700, color: 'var(--text-secondary)' },
  text: { fontSize: '0.82rem', color: 'var(--text-muted)' },
};
