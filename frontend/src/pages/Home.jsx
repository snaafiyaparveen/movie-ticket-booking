import { useEffect, useState } from 'react';
import api from '../api/axios';
import MovieCard from '../components/MovieCard';

const GENRES = ['All', 'Action', 'Drama', 'Comedy', 'Sci-Fi', 'Thriller', 'Romance', 'Animation', 'Horror'];

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genre, setGenre] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genre]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const params = {};
      if (genre !== 'All') params.genre = genre;
      const { data } = await api.get('/movies', { params });
      setMovies(data);
    } catch {
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const params = search ? { title: search } : {};
      const { data } = await api.get('/movies', { params });
      setMovies(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div style={styles.hero}>
          <h1 style={styles.heroTitle}>Now Showing</h1>
          <p style={styles.heroSubtitle}>Browse movies, pick a showtime, and book your seats in seconds.</p>

          <form onSubmit={handleSearch} style={styles.searchBar}>
            <input
              className="form-input"
              placeholder="Search movies by title…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ maxWidth: 380 }}
            />
            <button className="btn btn-primary" type="submit">Search</button>
          </form>
        </div>

        <div style={styles.genreRow}>
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => setGenre(g)}
              className={g === genre ? 'badge badge-danger' : 'badge badge-neutral'}
              style={styles.genreChip}
            >
              {g}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="spinner" />
        ) : movies.length === 0 ? (
          <div className="empty-state">
            <h3>No movies found</h3>
            <p>Try a different genre or search term.</p>
          </div>
        ) : (
          <div className="grid grid-movies">
            {movies.map((m) => <MovieCard key={m.id} movie={m} />)}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  hero: { marginBottom: 32 },
  heroTitle: { fontSize: '2.4rem', marginBottom: 8 },
  heroSubtitle: { marginBottom: 20, fontSize: '1rem' },
  searchBar: { display: 'flex', gap: 10 },
  genreRow: { display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 },
  genreChip: { border: 'none', cursor: 'pointer', fontSize: '0.75rem' },
};
