import { Link } from 'react-router-dom';

const FALLBACK_POSTER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450"><rect width="100%" height="100%" fill="#161a23"/><text x="50%" y="50%" fill="#6b7282" font-family="sans-serif" font-size="18" text-anchor="middle">No Poster</text></svg>`
  );

export default function MovieCard({ movie }) {
  return (
    <Link to={`/movies/${movie.id}`} className="card card-hover fade-in" style={styles.card}>
      <div style={styles.posterWrap}>
        <img
          src={movie.posterUrl || FALLBACK_POSTER}
          alt={movie.title}
          style={styles.poster}
          onError={(e) => { e.currentTarget.src = FALLBACK_POSTER; }}
        />
        {movie.rating != null && (
          <span className="badge badge-gold" style={styles.ratingBadge}>★ {movie.rating}</span>
        )}
      </div>
      <div style={styles.body}>
        <h4 style={styles.title}>{movie.title}</h4>
        <p style={styles.meta}>
          {movie.genre || 'Various'} {movie.durationMinutes ? `· ${movie.durationMinutes}m` : ''}
        </p>
      </div>
    </Link>
  );
}

const styles = {
  card: {
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  posterWrap: {
    position: 'relative',
    aspectRatio: '2 / 3',
    background: 'var(--bg-elevated)',
  },
  poster: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  ratingBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backdropFilter: 'blur(4px)',
  },
  body: {
    padding: '12px 14px 16px',
  },
  title: {
    fontSize: '0.98rem',
    marginBottom: 4,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  meta: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
  },
};
