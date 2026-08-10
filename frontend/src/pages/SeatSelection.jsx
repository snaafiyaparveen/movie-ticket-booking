import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../api/axios';
import SeatMap from '../components/SeatMap';

export default function SeatSelection() {
  const { showId } = useParams();
  const navigate = useNavigate();

  const [show, setShow] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [showRes, seatsRes] = await Promise.all([
          api.get(`/shows/${showId}`),
          api.get(`/seats/show/${showId}`),
        ]);
        setShow(showRes.data);
        setSeats(seatsRes.data);
      } catch {
        toast.error('Could not load seat map.');
      } finally {
        setLoading(false);
      }
    })();
  }, [showId]);

  const toggleSeat = (seat) => {
    if (seat.status !== 'AVAILABLE' && !selected.includes(seat.seatLabel)) return;
    setSelected((prev) =>
      prev.includes(seat.seatLabel) ? prev.filter((l) => l !== seat.seatLabel) : [...prev, seat.seatLabel]
    );
  };

  const totalAmount = show ? (show.price * selected.length).toFixed(2) : 0;

  const handleProceed = async () => {
    if (selected.length === 0) {
      toast.error('Select at least one seat.');
      return;
    }
    setSubmitting(true);
    try {
      // Lock the seats first (temporary hold while user confirms payment)
      const lockRes = await api.post('/seats/lock', { showId: Number(showId), seatLabels: selected });
      const seatIds = lockRes.data.map((s) => s.id);

      const bookingRes = await api.post('/bookings', { showId: Number(showId), seatIds });
      navigate(`/payment/${bookingRes.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Some seats were just taken. Please reselect.');
      // Refresh seat map
      const seatsRes = await api.get(`/seats/show/${showId}`);
      setSeats(seatsRes.data);
      setSelected([]);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="spinner" />;
  if (!show) return <div className="empty-state"><h3>Show not found</h3></div>;

  return (
    <div className="page">
      <div className="container">
        <div style={styles.header}>
          <h2>{show.movieTitle}</h2>
          <p>{show.theaterName} · {format(new Date(show.showTime), 'EEE, dd MMM yyyy · hh:mm a')} · {show.screenType}</p>
        </div>

        <div className="card" style={styles.seatCard}>
          <SeatMap seats={seats} selected={selected} onToggle={toggleSeat} />
        </div>

        <div className="card" style={styles.summaryBar}>
          <div>
            <div style={styles.summaryLabel}>Selected Seats</div>
            <div style={styles.summaryValue}>{selected.length > 0 ? selected.join(', ') : 'None'}</div>
          </div>
          <div>
            <div style={styles.summaryLabel}>Total</div>
            <div style={styles.summaryTotal}>₹{totalAmount}</div>
          </div>
          <button className="btn btn-primary" disabled={submitting || selected.length === 0} onClick={handleProceed}>
            {submitting ? 'Locking seats…' : `Proceed to Pay (${selected.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  header: { marginBottom: 24 },
  seatCard: { padding: '32px 20px', marginBottom: 24 },
  summaryBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px 24px',
    flexWrap: 'wrap',
    gap: 16,
  },
  summaryLabel: { fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' },
  summaryValue: { fontWeight: 600 },
  summaryTotal: { fontWeight: 800, fontSize: '1.3rem', color: 'var(--gold)' },
};
