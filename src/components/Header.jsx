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
          <span className="header__icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              <line x1="8" y1="7" x2="16" y2="7"/>
              <line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          </span>
          <span className="header__title">PageNotes</span>
          <span className="header__descriptor">Reading planner</span>
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
