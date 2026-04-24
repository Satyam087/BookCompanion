import './ErrorState.css';

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="error-state" id="error-state">
      <div className="error-state__icon" aria-hidden="true">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="20" stroke="#B85C38" strokeWidth="2" fill="#FDF0EB"/>
          <line x1="24" y1="14" x2="24" y2="28" stroke="#B85C38" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="24" cy="34" r="1.5" fill="#B85C38"/>
        </svg>
      </div>
      <h3 className="error-state__heading">Something went wrong</h3>
      <p className="error-state__message">{message || 'We could not load the data. Please check your connection and try again.'}</p>
      {onRetry && (
        <button className="btn btn-secondary" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}
