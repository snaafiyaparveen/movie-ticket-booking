import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export default function AdminOverview() {
  const [stats, setStats] = useState({ movies: 0, theaters: 0, shows: 0 });

  useEffect(() => {
    (async () => {
      try {
        const [movies, theaters, shows] = await Promise.all([
          api.get('/movies'),
          api.get('/theaters'),
          api.get('/shows'),
        ]);
        setStats({ movies: movies.data.length, theaters: theaters.data.length, shows: shows.data.length });
      } catch {
        // ignore
      }
    })();
  }, []);

  return (
    <div>
      <div className="section-title">
        <span className="accent-bar" />
        <span>Overview</span>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 32 }}>
        <StatCard label="Movies" value={stats.movies} to="/admin/movies" icon="🎞️" />
        <StatCard label="Theaters" value={stats.theaters} to="/admin/theaters" icon="🏛️" />
        <StatCard label="Shows" value={stats.shows} to="/admin/shows" icon="🕒" />
      </div>

      <div className="card" style={{ padding: 24 }}>
        <h4 style={{ marginBottom: 10 }}>Getting started</h4>
        <p>1. Add a movie in the Movies tab.</p>
        <p>2. Add a theater with its seat layout in the Theaters tab.</p>
        <p>3. Create a show linking a movie + theater + showtime + price in the Shows tab.</p>
        <p>Users will then be able to browse, select seats, and book tickets for that show.</p>
      </div>
    </div>
  );
}

function StatCard({ label, value, to, icon }) {
  return (
    <Link to={to} className="card card-hover" style={styles.stat}>
      <span style={styles.statIcon}>{icon}</span>
      <div>
        <div style={styles.statValue}>{value}</div>
        <div style={styles.statLabel}>{label}</div>
      </div>
    </Link>
  );
}

const styles = {
  stat: { display: 'flex', alignItems: 'center', gap: 16, padding: 22 },
  statIcon: { fontSize: '1.8rem' },
  statValue: { fontSize: '1.6rem', fontWeight: 800 },
  statLabel: { fontSize: '0.8rem', color: 'var(--text-muted)' },
};
