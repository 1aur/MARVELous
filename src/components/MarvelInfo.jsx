import React, { useEffect, useState } from 'react';
import md5 from 'blueimp-md5';
import { Link } from 'react-router-dom';
import '../App.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const MARVEL_API = 'https://gateway.marvel.com/v1/public/characters';
const PUBLIC_KEY = import.meta.env.VITE_MARVEL_PUBLIC_KEY;
const PRIVATE_KEY = import.meta.env.VITE_MARVEL_PRIVATE_KEY;

const MarvelInfo = () => {
  const [characters, setCharacters] = useState([]);
  const [search, setSearch] = useState('');
  const [minComics, setMinComics] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      const ts = new Date().getTime();
      const hash = md5(ts + PRIVATE_KEY + PUBLIC_KEY);
      const url = `${MARVEL_API}?limit=50&ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        setCharacters(data.data.results);
      } catch {
        setCharacters([]);
      }
      setLoading(false);
    };
    fetchCharacters();
  }, []);

  const filtered = characters.filter(char =>
    char.name.toLowerCase().includes(search.toLowerCase()) &&
    char.comics.available >= minComics
  );

  const total = characters.length;
  const withDescription = characters.filter(c => c.description).length;
  const avgComics = total ? (characters.reduce((sum, c) => sum + c.comics.available, 0) / total).toFixed(1) : 0;

  const top10 = [...characters]
    .sort((a, b) => b.comics.available - a.comics.available)
    .slice(0, 10)
    .map(c => ({ name: c.name, comics: c.comics.available }));
  const withDesc = characters.filter(c => c.description).length;
  const withoutDesc = characters.length - withDesc;
  const pieData = [
    { name: 'With Description', value: withDesc },
    { name: 'No Description', value: withoutDesc }
  ];
  const pieColors = ['#b71c1c', '#888'];

  return (
    <div className="App">
      <header>
        <h1 style={{ fontFamily: `'Bebas Neue', 'Anton', Impact, Arial, sans-serif'` }}>Marvel Characters Dashboard</h1>
      </header>
      <section className="stats" style={{ fontFamily: `'Bebas Neue', 'Anton', Impact, Arial, sans-serif'` }}>
        <div>TOTAL CHARACTERS: {total}</div>
        <div>WITH DESCRIPTION: {withDescription}</div>
        <div>AVG COMICS/CHARACTER: {avgComics}</div>
      </section>
      <section style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center', marginBottom: '2rem' }}>
        <div style={{ width: 350, background: 'rgba(0,0,0,0.15)', borderRadius: 12, padding: 16 }}>
          <h3 style={{ textAlign: 'center', fontFamily: 'Bebas Neue, Anton, Impact, Arial, sans-serif' }}>Top 10 by Comics</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={top10} layout="vertical">
              <XAxis type="number" allowDecimals={false} />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="comics" fill="#b71c1c" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ width: 350, background: 'rgba(0,0,0,0.15)', borderRadius: 12, padding: 16 }}>
          <h3 style={{ textAlign: 'center', fontFamily: 'Bebas Neue, Anton, Impact, Arial, sans-serif' }}>Description Coverage</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {pieData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={pieColors[idx % pieColors.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>
      <section className="controls">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <label>
          MIN COMICS:
          <select value={minComics} onChange={e => setMinComics(Number(e.target.value))}>
            <option value={0}>All</option>
            <option value={10}>10+</option>
            <option value={50}>50+</option>
            <option value={100}>100+</option>
          </select>
        </label>
      </section>
      <section className="list">
        {loading ? (
          <div>Loading...</div>
        ) : (
          filtered.slice(0, 20).map(char => (
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
          ))
        )}
      </section>
    </div>
  );
};

export default MarvelInfo; 