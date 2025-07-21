import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Dashboard', icon: '🏠' },
  { to: '/search', label: 'Search', icon: '🔍' },
  { to: '/about', label: 'About', icon: 'ℹ️' },
];

const Sidebar = () => {
  const location = useLocation();
  return (
    <aside style={{
      width: '220px',
      background: 'rgba(123,24,24,0.97)',
      color: '#fff',
      minHeight: '100vh',
      padding: '2rem 1rem',
      boxShadow: '2px 0 12px #1a0000cc',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 10,
      borderRight: '5px solid #b71c1c',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{
          fontFamily: `'Bebas Neue', 'Anton', Impact, Arial, sans-serif'`,
          fontSize: '2.5rem',
          margin: 0,
          letterSpacing: '2px',
          color: '#fff',
          textShadow: '2px 2px 0 #b71c1c, 4px 4px 12px #000',
          border: '3px solid #fff',
          borderRadius: '8px',
          padding: '0.3rem 1rem',
          background: 'rgba(183,28,28,0.85)',
          boxShadow: '0 2px 12px #1a0000cc',
          display: 'inline-block',
        }}>MARVEL</h2>
      </div>
      <nav style={{ width: '100%' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {navLinks.map(link => (
            <li key={link.to} style={{ marginBottom: '1.5rem' }}>
              <Link
                to={link.to}
                style={{
                  color: location.pathname === link.to ? '#b71c1c' : '#fff',
                  background: location.pathname === link.to ? '#fff' : 'none',
                  borderRadius: '6px',
                  padding: '0.5rem 1rem',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  letterSpacing: '1px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.7rem',
                  transition: 'background 0.2s, color 0.2s',
                }}
              >
                <span>{link.icon}</span> {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar; 