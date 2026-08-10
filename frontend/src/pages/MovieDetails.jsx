import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format, isSameDay, addDays } from 'date-fns';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const FALLBACK_POSTER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450"><rect width="100%" height="100%" fill="#161a23"/><text x="50%" y="50%" fill="#6b7282" font-family="sans-serif" font-size="18" text-anchor="middle">No Poster</text></svg>`
  );

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [movieRes, showsRes] = await Promise.all([
          api.get(`/movies/${id}`),
          api.get('/shows', { params: { movieId: id } }),
        ]);
        setMovie(movieRes.data);
        setShows(showsRes.data);
      } catch {
        toast.error('Could not load movie details.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const dateOptions = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(new Date(), i)), []);

  const showsForDate = shows.filter((s) => isSameDay(new Date(s.showTime), selectedDate));

  const showsByTheater = showsForDate.reduce((acc, s) => {
    const key = s.theaterName + '__' + s.theaterId;
    if (!acc[key]) acc[key] = { theaterName: s.theaterName, theaterCity: s.theaterCity, shows: [] };
    acc[key].shows.push(s);
    return acc;
  }, {});

  const handleSelectShow = (showId) => {
    if (!user) {
      toast('Please log in to book tickets.');
      navigate('/login', { state: { from: `/book/${showId}` } });
      return;
    }
    navigate(`/book/${showId}`);
  };

  if (loading) return <div className="spinner" />;
  if (!movie) return <div className="empty-state"><h3>Movie not found</h3></div>;

  return (
    <div className="page">
      <div className="container">
        <div style={styles.top}>
          <img
            src={movie.posterUrl || FALLBACK_POSTER}
            alt={movie.title}
            style={styles.poster}
            onError={(e) => { e.currentTarget.src = FALLBACK_POSTER; }}
          />
          <div style={styles.info}>
            <h1 style={{ marginBottom: 10 }}>{movie.title}</h1>
            <div style={styles.badgesRow}>
              {movie.rating != null && <span className="badge badge-gold">★ {movie.rating}</span>}
              {movie.censorRating && <span className="badge badge-neutral">{movie.censorRating}</span>}
              {movie.genre && <span className="badge badge-neutral">{movie.genre}</span>}
              {movie.language && <span className="badge badge-neutral">{movie.language}</span>}
              {movie.durationMinutes && <span className="badge badge-neutral">{movie.durationMinutes} min</span>}
            </div>
            <p style={{ maxWidth: 640 }}>{movie.description || 'No description available.'}</p>
          </div>
        </div>

        <div className="section-title" style={{ marginTop: 40 }}>
          <span className="accent-bar" />
          <span>Select Date</span>
        </div>
        <div style={styles.dateRow}>
          {dateOptions.map((d) => (
            <button
              key={d.toISOString()}
              onClick={() => setSelectedDate(d)}
              style={{
                ...styles.dateChip,
                ...(isSameDay(d, selectedDate) ? styles.dateChipActive : {}),
              }}
            >
              <span style={styles.dateDay}>{format(d, 'EEE')}</span>
              <span style={styles.dateNum}>{format(d, 'd MMM')}</span>
            </button>
          ))}
        </div>

        <div className="section-title" style={{ marginTop: 32 }}>
          <span className="accent-bar" />
          <span>Showtimes</span>
        </div>

        {Object.keys(showsByTheater).length === 0 ? (
          <div className="empty-state">
            <h3>No shows on this date</h3>
            <p>Try selecting a different date.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {Object.values(showsByTheater).map((group) => (
              <div key={group.theaterName} className="card" style={styles.theaterCard}>
                <div style={styles.theaterHeader}>
                  <strong>{group.theaterName}</strong>
                  {group.theaterCity && <span style={styles.theaterCity}>{group.theaterCity}</span>}
                </div>
                <div style={styles.showTimeRow}>
                  {group.shows
                    .sort((a, b) => new Date(a.showTime) - new Date(b.showTime))
                    .map((s) => (
                      <button
                        key={s.id}
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleSelectShow(s.id)}
                        style={styles.showTimeBtn}
                      >
                        {format(new Date(s.showTime), 'hh:mm a')}
                        <span style={styles.showTimePrice}>₹{s.price} · {s.screenType}</span>
                      </button>
                    ))}
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
  top: { display: 'flex', gap: 32, flexWrap: 'wrap' },
  poster: { width: 220, borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', objectFit: 'cover', aspectRatio: '2/3' },
  info: { flex: 1, minWidth: 280 },
  badgesRow: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 },
  dateRow: { display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 },
  dateChip: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
    padding: '10px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)',
    background: 'var(--bg-card)', color: 'var(--text-secondary)', cursor: 'pointer', minWidth: 72,
  },
  dateChipActive: { background: 'var(--accent)', color: '#fff', borderColor: 'var(--accent)' },
  dateDay: { fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.8 },
  dateNum: { fontSize: '0.88rem', fontWeight: 700 },
  theaterCard: { padding: 20 },
  theaterHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: 14 },
  theaterCity: { color: 'var(--text-muted)', fontSize: '0.85rem' },
  showTimeRow: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  showTimeBtn: { flexDirection: 'column', gap: 2, padding: '8px 16px' },
  showTimePrice: { fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 400 },
};
