import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../api/axios';

const STATUS_BADGE = {
  CONFIRMED: 'badge-success',
  PENDING: 'badge-warning',
  CANCELLED: 'badge-danger',
  EXPIRED: 'badge-neutral',
};

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/bookings/history');
      setBookings(data);
    } catch {
      toast.error('Could not load booking history.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking? This cannot be undone.')) return;
    setCancelingId(id);
    try {
      await api.post(`/bookings/${id}/cancel`);
      toast.success('Booking cancelled.');
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not cancel booking.');
    } finally {
      setCancelingId(null);
    }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="page">
      <div className="container">
        <div className="section-title">
          <span className="accent-bar" />
          <span>My Bookings</span>
        </div>

        {bookings.length === 0 ? (
          <div className="empty-state">
            <h3>No bookings yet</h3>
            <p>Your booked tickets will show up here.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {bookings.map((b) => (
              <div key={b.id} className="card fade-in" style={styles.card}>
                <div style={styles.left}>
                  <div style={styles.movieRow}>
                    <h4>{b.movieTitle}</h4>
                    <span className={`badge ${STATUS_BADGE[b.status] || 'badge-neutral'}`}>{b.status}</span>
                  </div>
                  <p style={styles.meta}>{b.theaterName}</p>
                  <p style={styles.meta}>{format(new Date(b.showTime), 'EEE, dd MMM yyyy · hh:mm a')}</p>
                  <p style={styles.meta}>Seats: {b.seatLabels.join(', ')}</p>
                  <p style={styles.ref}>Ref: {b.bookingReference}</p>
                </div>
                <div style={styles.right}>
                  <div style={styles.amount}>₹{b.totalAmount}</div>
                  {b.status === 'CONFIRMED' && (
                    <button
                      className="btn btn-danger btn-sm"
                      disabled={cancelingId === b.id}
                      onClick={() => handleCancel(b.id)}
                    >
                      {cancelingId === b.id ? 'Cancelling…' : 'Cancel'}
                    </button>
                  )}
                  {b.status === 'PENDING' && (
                    <a className="btn btn-primary btn-sm" href={`/payment/${b.id}`}>Complete Payment</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: { display: 'flex', justifyContent: 'space-between', padding: 22, gap: 16, flexWrap: 'wrap' },
  left: { flex: 1, minWidth: 240 },
  movieRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 },
  meta: { fontSize: '0.85rem', marginBottom: 2 },
  ref: { fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 },
  right: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, justifyContent: 'center' },
  amount: { fontWeight: 800, fontSize: '1.2rem', color: 'var(--gold)' },
};
