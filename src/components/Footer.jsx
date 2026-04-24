import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="footer__inner container">
        <div className="footer__brand">
          <span className="footer__icon" aria-hidden="true">📖</span>
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
