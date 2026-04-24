import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="footer__inner container">
        <div className="footer__brand">
          <span className="footer__icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </span>
          <span className="footer__name">PageNotes</span>
        </div>
        <p className="footer__tagline">
          A structured reading path for curious minds.
        </p>
        <p className="footer__credit">
          Book data powered by{' '}
          <a href="https://openlibrary.org" target="_blank" rel="noopener noreferrer">
            Open Library
          </a>
        </p>
      </div>
    </footer>
  );
}
