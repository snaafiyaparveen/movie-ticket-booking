import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const EMPTY_FORM = { movieId: '', theaterId: '', showTime: '', price: '', screenType: '2D' };

export default function AdminShows() {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [showsRes, moviesRes, theatersRes] = await Promise.all([
        api.get('/shows'),
        api.get('/movies'),
        api.get('/theaters'),
      ]);
      setShows(showsRes.data);
      setMovies(moviesRes.data);
      setTheaters(theatersRes.data);
    } catch {
      toast.error('Could not load shows.');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.movieId || !form.theaterId || !form.showTime || !form.price) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setSaving(true);
    try {
      await api.post('/shows', {
        movieId: Number(form.movieId),
        theaterId: Number(form.theaterId),
        showTime: form.showTime,
        price: Number(form.price),
        screenType: form.screenType,
      });
      toast.success('Show created.');
      setShowForm(false);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this show?')) return;
    try {
      await api.delete(`/shows/${id}`);
      toast.success('Show deleted.');
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed.');
    }
  };

  return (
    <div>
      <div style={styles.headerRow}>
        <div className="section-title" style={{ marginBottom: 0 }}>
          <span className="accent-bar" />
          <span>Shows</span>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openCreate}>+ Add Show</button>
      </div>

      {showForm && (
        <form className="card fade-in" onSubmit={handleSubmit} style={styles.form}>
          <h4 style={{ marginBottom: 16 }}>New Show</h4>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Movie</label>
              <select className="form-select" required value={form.movieId} onChange={(e) => setForm({ ...form, movieId: e.target.value })}>
                <option value="">Select a movie</option>
                {movies.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Theater</label>
              <select className="form-select" required value={form.theaterId} onChange={(e) => setForm({ ...form, theaterId: e.target.value })}>
                <option value="">Select a theater</option>
                {theaters.map((t) => <option key={t.id} value={t.id}>{t.name} {t.city ? `(${t.city})` : ''}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Show Time</label>
              <input className="form-input" type="datetime-local" required value={form.showTime} onChange={(e) => setForm({ ...form, showTime: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Price (₹)</label>
              <input className="form-input" type="number" min="1" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Screen Type</label>
              <select className="form-select" value={form.screenType} onChange={(e) => setForm({ ...form, screenType: e.target.value })}>
                <option value="2D">2D</option>
                <option value="3D">3D</option>
                <option value="IMAX">IMAX</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-primary" disabled={saving} type="submit">{saving ? 'Saving…' : 'Save Show'}</button>
            <button className="btn btn-ghost" type="button" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      {loading ? <div className="spinner" /> : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Movie</th>
                <th style={styles.th}>Theater</th>
                <th style={styles.th}>Show Time</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}></th>
              </tr>
            </thead>
            <tbody>
              {shows.map((s) => (
                <tr key={s.id}>
                  <td style={styles.td}>{s.movieTitle}</td>
                  <td style={styles.td}>{s.theaterName}</td>
                  <td style={styles.td}>{format(new Date(s.showTime), 'dd MMM yyyy, hh:mm a')}</td>
                  <td style={styles.td}>₹{s.price} · {s.screenType}</td>
                  <td style={{ ...styles.td, textAlign: 'right' }}>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {shows.length === 0 && (
                <tr><td style={styles.td} colSpan={5}>No shows yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  form: { padding: 24, marginBottom: 24 },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '14px 20px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' },
  td: { padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.88rem' },
};
