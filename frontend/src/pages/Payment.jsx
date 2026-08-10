import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../api/axios';

const METHODS = [
  { key: 'CARD', label: 'Credit / Debit Card', icon: '💳' },
  { key: 'UPI', label: 'UPI', icon: '📱' },
  { key: 'NETBANKING', label: 'Net Banking', icon: '🏦' },
  { key: 'WALLET', label: 'Wallet', icon: '👛' },
];

export default function Payment() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState('CARD');
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/bookings/${bookingId}`);
        setBooking(data);
        if (data.status !== 'PENDING') {
          toast('This booking is no longer awaiting payment.');
        }
      } catch {
        toast.error('Booking not found.');
      } finally {
        setLoading(false);
      }
    })();
  }, [bookingId]);

  const handlePay = async () => {
    setPaying(true);
    try {
      await api.post('/payments', { bookingId: Number(bookingId), method });
      toast.success('Payment successful! Booking confirmed.');
      navigate('/bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <div className="spinner" />;
  if (!booking) return <div className="empty-state"><h3>Booking not found</h3></div>;

  return (
    <div className="page">
      <div className="container" style={styles.wrap}>
        <div className="card" style={styles.summaryCard}>
          <h3 style={{ marginBottom: 16 }}>Order Summary</h3>
          <SummaryRow label="Movie" value={booking.movieTitle} />
          <SummaryRow label="Theater" value={booking.theaterName} />
          <SummaryRow label="Show Time" value={format(new Date(booking.showTime), 'EEE, dd MMM yyyy · hh:mm a')} />
          <SummaryRow label="Seats" value={booking.seatLabels.join(', ')} />
          <SummaryRow label="Reference" value={booking.bookingReference} />
          <div style={styles.divider} />
          <SummaryRow label="Total Amount" value={`₹${booking.totalAmount}`} big />
        </div>

        <div className="card" style={styles.paymentCard}>
          <h3 style={{ marginBottom: 16 }}>Choose Payment Method</h3>
          <div style={styles.methodGrid}>
            {METHODS.map((m) => (
              <button
                key={m.key}
                onClick={() => setMethod(m.key)}
                style={{
                  ...styles.methodBtn,
                  ...(method === m.key ? styles.methodBtnActive : {}),
                }}
              >
                <span style={{ fontSize: '1.4rem' }}>{m.icon}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>

          <p style={styles.simNote}>
            This is a simulated payment for demo purposes — no real transaction will occur.
          </p>

          <button
            className="btn btn-primary btn-block"
            disabled={paying || booking.status !== 'PENDING'}
            onClick={handlePay}
          >
            {paying ? 'Processing…' : `Pay ₹${booking.totalAmount}`}
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, big }) {
  return (
    <div style={styles.row}>
      <span style={styles.rowLabel}>{label}</span>
      <span style={big ? styles.rowValueBig : styles.rowValue}>{value}</span>
    </div>
  );
}

const styles = {
  wrap: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 900 },
  summaryCard: { padding: 28 },
  paymentCard: { padding: 28 },
  row: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '0.9rem' },
  rowLabel: { color: 'var(--text-muted)' },
  rowValue: { fontWeight: 600, textAlign: 'right' },
  rowValueBig: { fontWeight: 800, fontSize: '1.3rem', color: 'var(--gold)' },
  divider: { height: 1, background: 'var(--border-subtle)', margin: '12px 0' },
  methodGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 },
  methodBtn: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
    padding: '16px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)',
    background: 'var(--bg-input)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
  },
  methodBtnActive: { borderColor: 'var(--accent)', background: 'var(--accent-soft)', color: 'var(--text-primary)' },
  simNote: { fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 20, textAlign: 'center' },
};
