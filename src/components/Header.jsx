import { useState } from 'react';
import { navigate } from '../utils/helpers';
import './Header.css';

export default function Header({ currentPath }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/' && (currentPath === '/' || currentPath === '')) return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  const handleNav = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <header className="header" id="header">
      <div className="header__inner container">
        <button className="header__brand" onClick={() => handleNav('/')} aria-label="Go to home page">
          <span className="header__icon" aria-hidden="true">📖</span>
          <span className="header__title">PageNotes</span>
        </button>

        <nav className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`} aria-label="Main navigation">
          <button
            className={`header__link ${isActive('/') ? 'header__link--active' : ''}`}
            onClick={() => handleNav('/')}
          >
            Home
          </button>
          <button
            className={`header__link ${isActive('/journey') ? 'header__link--active' : ''}`}
            onClick={() => handleNav('/journey')}
          >
            My Journey
          </button>
        </nav>

        <button
          className="header__hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className={`header__hamburger-line ${menuOpen ? 'open' : ''}`} />
          <span className={`header__hamburger-line ${menuOpen ? 'open' : ''}`} />
          <span className={`header__hamburger-line ${menuOpen ? 'open' : ''}`} />
        </button>
      </div>
    </header>
  );
}
