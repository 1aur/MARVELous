import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MarvelInfo from './components/MarvelInfo';
import CharacterDetail from './components/CharacterDetail';
import Search from './components/Search';
import About from './components/About';
import './App.css';

function App() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main
        style={{
          marginLeft: 240,
          width: '100%',
          minHeight: '100vh',
          padding: '3rem 2rem 2rem 2rem',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Routes>
          <Route path="/" element={<MarvelInfo />} />
          <Route path="/character/:id" element={<CharacterDetail />} />
          <Route path="/search" element={<Search />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
