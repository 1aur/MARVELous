import React, { useState } from 'react';
import md5 from 'blueimp-md5';
import { Link } from 'react-router-dom';

const MARVEL_API = 'https://gateway.marvel.com/v1/public/characters';
const PUBLIC_KEY = import.meta.env.VITE_MARVEL_PUBLIC_KEY;
const PRIVATE_KEY = import.meta.env.VITE_MARVEL_PRIVATE_KEY;

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    setError(null);
    const ts = new Date().getTime();
    const hash = md5(ts + PRIVATE_KEY + PUBLIC_KEY);
    const url = `${MARVEL_API}?nameStartsWith=${encodeURIComponent(query)}&limit=20&ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      setResults(data.data.results);
    } catch {
      setError('Failed to fetch results.');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontFamily: `'Bebas Neue', 'Anton', Impact, Arial, sans-serif'` }}>Search Marvel Characters</h1>
      <form onSubmit={handleSearch} style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
        <input
          type="text"
          placeholder="Enter character name..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ padding: '0.5rem 1rem', borderRadius: 5, border: '2px solid #b71c1c', background: '#2d0a0a', color: '#fff', fontSize: '1rem', width: 300 }}
        />
        <button type="submit" style={{ padding: '0.5rem 1.5rem', borderRadius: 5, border: 'none', background: '#b71c1c', color: '#fff', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}>Search</button>
      </form>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div className="list">
        {results.map(char => (
          <Link key={char.id} to={`/character/${char.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card">
              <img src={
                char.thumbnail.path.includes('image_not_available')
                  ? '/image-not-found.png'
                  : `${char.thumbnail.path}/standard_xlarge.${char.thumbnail.extension}`
              } alt={char.name} />
              <div>
                <h2>{char.name}</h2>
                <p>Comics: {char.comics.available}</p>
                <p>{char.description ? char.description.slice(0, 100) + (char.description.length > 100 ? '...' : '') : 'No description.'}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Search; 