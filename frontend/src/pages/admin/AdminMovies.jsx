import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const EMPTY_FORM = {
  title: '', genre: '', language: '', durationMinutes: '', rating: '',
  censorRating: 'U/A', posterUrl: '', description: '',
};

export default function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchMovies(); }, []);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/movies');
      setMovies(data);
    } catch {
      toast.error('Could not load movies.');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (movie) => {
    setForm({
      title: movie.title || '',
      genre: movie.genre || '',
      language: movie.language || '',
      durationMinutes: movie.durationMinutes || '',
      rating: movie.rating ?? '',
      censorRating: movie.censorRating || 'U/A',
      posterUrl: movie.posterUrl || '',
      description: movie.description || '',
    });
    setEditingId(movie.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      durationMinutes: Number(form.durationMinutes),
      rating: form.rating === '' ? null : Number(form.rating),
    };
    try {
      if (editingId) {
        await api.put(`/movies/${editingId}`, payload);
        toast.success('Movie updated.');
      } else {
        await api.post('/movies', payload);
        toast.success('Movie created.');
      }
      setShowForm(false);
      fetchMovies();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this movie? Existing bookings are preserved.')) return;
    try {
      await api.delete(`/movies/${id}`);
      toast.success('Movie deleted.');
      fetchMovies();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed.');
    }
  };

  return (
    <div>
      <div style={styles.headerRow}>
        <div className="section-title" style={{ marginBottom: 0 }}>
          <span className="accent-bar" />
          <span>Movies</span>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openCreate}>+ Add Movie</button>
      </div>

      {showForm && (
        <form className="card fade-in" onSubmit={handleSubmit} style={styles.form}>
          <h4 style={{ marginBottom: 16 }}>{editingId ? 'Edit Movie' : 'New Movie'}</h4>
          <div className="grid grid-2">
            <Field label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
            <Field label="Genre" value={form.genre} onChange={(v) => setForm({ ...form, genre: v })} />
            <Field label="Language" value={form.language} onChange={(v) => setForm({ ...form, language: v })} />
            <Field label="Duration (min)" type="number" value={form.durationMinutes} onChange={(v) => setForm({ ...form, durationMinutes: v })} required />
            <Field label="Rating (0-10)" type="number" step="0.1" value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} />
            <div className="form-group">
              <label className="form-label">Censor Rating</label>
              <select className="form-select" value={form.censorRating} onChange={(e) => setForm({ ...form, censorRating: e.target.value })}>
                <option value="U">U</option>
                <option value="U/A">U/A</option>
                <option value="A">A</option>
              </select>
            </div>
          </div>
          <Field label="Poster URL" value={form.posterUrl} onChange={(v) => setForm({ ...form, posterUrl: v })} />
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-primary" disabled={saving} type="submit">{saving ? 'Saving…' : 'Save Movie'}</button>
            <button className="btn btn-ghost" type="button" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      {loading ? <div className="spinner" /> : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Genre</th>
                <th style={styles.th}>Duration</th>
                <th style={styles.th}>Rating</th>
                <th style={styles.th}></th>
              </tr>
            </thead>
            <tbody>
              {movies.map((m) => (
                <tr key={m.id}>
                  <td style={styles.td}>{m.title}</td>
                  <td style={styles.td}>{m.genre || '—'}</td>
                  <td style={styles.td}>{m.durationMinutes} min</td>
                  <td style={styles.td}>{m.rating != null ? `★ ${m.rating}` : '—'}</td>
                  <td style={{ ...styles.td, textAlign: 'right' }}>
                    <button className="btn btn-secondary btn-sm" style={{ marginRight: 8 }} onClick={() => openEdit(m)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {movies.length === 0 && (
                <tr><td style={styles.td} colSpan={5}>No movies yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', required, step }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        className="form-input"
        type={type}
        step={step}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
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
