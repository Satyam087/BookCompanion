import './LoadingState.css';

export default function LoadingState({ count = 6 }) {
  return (
    <div className="loading-state" id="loading-state">
      <div className="loading-state__grid book-grid">
        {Array.from({ length: count }).map((_, i) => (
          <div className="skeleton-card card" key={i}>
            <div className="skeleton-card__cover skeleton" />
            <div className="skeleton-card__body">
              <div className="skeleton skeleton-card__line skeleton-card__line--title" />
              <div className="skeleton skeleton-card__line skeleton-card__line--author" />
              <div className="skeleton skeleton-card__line skeleton-card__line--year" />
              <div className="skeleton-card__tags-row">
                <div className="skeleton skeleton-card__tag" />
                <div className="skeleton skeleton-card__tag" />
              </div>
              <div className="skeleton-card__btn-row">
                <div className="skeleton skeleton-card__btn-ph" />
                <div className="skeleton skeleton-card__btn-ph" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
