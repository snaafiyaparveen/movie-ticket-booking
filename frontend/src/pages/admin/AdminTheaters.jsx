import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const EMPTY_FORM = { name: '', address: '', city: '', totalRows: 8, seatsPerRow: 10 };

export default function AdminTheaters() {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchTheaters(); }, []);

  const fetchTheaters = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/theaters');
      setTheaters(data);
    } catch {
      toast.error('Could not load theaters.');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (theater) => {
    setForm({
      name: theater.name, address: theater.address, city: theater.city || '',
      totalRows: theater.totalRows, seatsPerRow: theater.seatsPerRow,
    });
    setEditingId(theater.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, totalRows: Number(form.totalRows), seatsPerRow: Number(form.seatsPerRow) };
    try {
      if (editingId) {
        await api.put(`/theaters/${editingId}`, payload);
        toast.success('Theater updated.');
      } else {
        await api.post('/theaters', payload);
        toast.success('Theater created.');
      }
      setShowForm(false);
      fetchTheaters();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this theater?')) return;
    try {
      await api.delete(`/theaters/${id}`);
      toast.success('Theater deleted.');
      fetchTheaters();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed.');
    }
  };

  return (
    <div>
      <div style={styles.headerRow}>
        <div className="section-title" style={{ marginBottom: 0 }}>
          <span className="accent-bar" />
          <span>Theaters</span>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openCreate}>+ Add Theater</button>
      </div>

      {showForm && (
        <form className="card fade-in" onSubmit={handleSubmit} style={styles.form}>
          <h4 style={{ marginBottom: 16 }}>{editingId ? 'Edit Theater' : 'New Theater'}</h4>
          <div className="grid grid-2">
            <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
            <Field label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
          </div>
          <Field label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} required />
          <div className="grid grid-2">
            <Field label="Rows" type="number" value={form.totalRows} onChange={(v) => setForm({ ...form, totalRows: v })} />
            <Field label="Seats per Row" type="number" value={form.seatsPerRow} onChange={(v) => setForm({ ...form, seatsPerRow: v })} />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-primary" disabled={saving} type="submit">{saving ? 'Saving…' : 'Save Theater'}</button>
            <button className="btn btn-ghost" type="button" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      {loading ? <div className="spinner" /> : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>City</th>
                <th style={styles.th}>Layout</th>
                <th style={styles.th}></th>
              </tr>
            </thead>
            <tbody>
              {theaters.map((t) => (
                <tr key={t.id}>
                  <td style={styles.td}>{t.name}</td>
                  <td style={styles.td}>{t.city || '—'}</td>
                  <td style={styles.td}>{t.totalRows} × {t.seatsPerRow} ({t.totalRows * t.seatsPerRow} seats)</td>
                  <td style={{ ...styles.td, textAlign: 'right' }}>
                    <button className="btn btn-secondary btn-sm" style={{ marginRight: 8 }} onClick={() => openEdit(t)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {theaters.length === 0 && (
                <tr><td style={styles.td} colSpan={4}>No theaters yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', required }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input className="form-input" type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} />
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
