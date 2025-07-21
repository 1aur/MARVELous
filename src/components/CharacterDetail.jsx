import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import md5 from 'blueimp-md5';

const MARVEL_API = 'https://gateway.marvel.com/v1/public/characters';
const PUBLIC_KEY = import.meta.env.VITE_MARVEL_PUBLIC_KEY;
const PRIVATE_KEY = import.meta.env.VITE_MARVEL_PRIVATE_KEY;

const CharacterDetail = () => {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      setLoading(true);
      setError(null);
      const ts = new Date().getTime();
      const hash = md5(ts + PRIVATE_KEY + PUBLIC_KEY);
      const url = `${MARVEL_API}/${id}?ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.data.results.length > 0) {
          setCharacter(data.data.results[0]);
        } else {
          setError('Character not found.');
        }
      } catch {
        setError('Failed to fetch character.');
      }
      setLoading(false);
    };
    fetchCharacter();
  }, [id]);

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>{error}</div>;
  if (!character) return null;

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontFamily: `'Bebas Neue', 'Anton', Impact, Arial, sans-serif'` }}>{character.name}</h1>
      <img
        src={`${character.thumbnail.path}/standard_fantastic.${character.thumbnail.extension}`}
        alt={character.name}
        style={{ width: 200, borderRadius: 12, border: '3px solid #fff', marginBottom: 20 }}
      />
      <p><strong>Description:</strong> {character.description || 'No description available.'}</p>
      <p><strong>Comics:</strong> {character.comics.available}</p>
      <p><strong>Series:</strong> {character.series.available}</p>
      <p><strong>Stories:</strong> {character.stories.available}</p>
      <p><strong>Events:</strong> {character.events.available}</p>
      <div style={{ marginTop: 20 }}>
        <h3>Series List (first 5):</h3>
        <ul>
          {character.series.items.slice(0, 5).map((s, i) => (
            <li key={i}>{s.name}</li>
          ))}
        </ul>
      </div>
      <div style={{ marginTop: 20 }}>
        <h3>Comics List (first 5):</h3>
        <ul>
          {character.comics.items.slice(0, 5).map((c, i) => (
            <li key={i}>{c.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CharacterDetail; 