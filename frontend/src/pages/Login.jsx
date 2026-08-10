import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      const redirectTo = location.state?.from || '/';
      navigate(redirectTo);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={styles.wrap}>
      <div className="card fade-in" style={styles.card}>
        <div style={styles.header}>
          <span style={styles.icon}>🎬</span>
          <h2>Welcome back</h2>
          <p>Log in to continue booking your favorite movies.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              required
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              required
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button className="btn btn-primary btn-block" disabled={loading} type="submit">
            {loading ? 'Logging in…' : 'Log In'}
          </button>
        </form>

        <p style={styles.footerText}>
          Don't have an account? <Link to="/register" style={styles.link}>Sign up</Link>
        </p>

        <div style={styles.demoBox}>
          <strong>Demo Admin:</strong> admin@movieticket.com / Admin@123
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrap: { display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: 60 },
  card: { width: '100%', maxWidth: 420, padding: 36 },
  header: { textAlign: 'center', marginBottom: 28 },
  icon: { fontSize: '2rem', display: 'block', marginBottom: 8 },
  footerText: { textAlign: 'center', marginTop: 20, fontSize: '0.88rem', color: 'var(--text-secondary)' },
  link: { color: 'var(--accent)', fontWeight: 600 },
  demoBox: {
    marginTop: 20,
    padding: '10px 14px',
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    textAlign: 'center',
  },
};
