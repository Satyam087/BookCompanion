import './EmptyState.css';

export default function EmptyState({ heading, message, actionLabel, onAction }) {
  return (
    <div className="empty-state" id="empty-state">
      <div className="empty-state__icon" aria-hidden="true">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <rect x="14" y="8" width="36" height="48" rx="3" stroke="#C4B8A8" strokeWidth="2" fill="#F3EDE4"/>
          <line x1="22" y1="20" x2="42" y2="20" stroke="#C4B8A8" strokeWidth="2"/>
          <line x1="22" y1="28" x2="38" y2="28" stroke="#E0D8CE" strokeWidth="1.5"/>
          <line x1="22" y1="36" x2="34" y2="36" stroke="#E0D8CE" strokeWidth="1"/>
        </svg>
      </div>
      <h3 className="empty-state__heading">{heading || 'Nothing here yet'}</h3>
      <p className="empty-state__message">{message || 'Try searching for a topic to get started.'}</p>
      {actionLabel && onAction && (
        <button className="btn btn-primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
