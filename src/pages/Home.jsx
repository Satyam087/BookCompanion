import SearchBar from '../components/SearchBar';
import TopicChips from '../components/TopicChips';
import { getRecentSearches } from '../utils/storage';
import { navigate } from '../utils/helpers';
import './Home.css';

export default function Home() {
  const recentSearches = getRecentSearches();

  return (
    <div className="page home" id="home-page">
      <div className="container">
        {/* Hero Section */}
        <section className="home__hero">
          <h1 className="home__heading">
            Your structured reading path<br />starts here
          </h1>
          <p className="home__subtitle">
            Search any topic and get a curated reading plan with books organized
            from beginner to advanced. Save your picks, track your progress,
            and read with purpose.
          </p>

          <div className="home__search-wrap">
            <SearchBar size="large" />
          </div>

          <TopicChips />
        </section>

        {/* How It Works */}
        <section className="home__how" id="how-it-works">
          <h2 className="home__section-title">How it works</h2>
          <div className="home__steps">
            <div className="home__step">
              <span className="home__step-num">1</span>
              <h3 className="home__step-title">Search a topic</h3>
              <p className="home__step-desc">
                Enter any subject you want to learn about. PageNotes searches
                the Open Library catalog for relevant books.
              </p>
            </div>
            <div className="home__step">
              <span className="home__step-num">2</span>
              <h3 className="home__step-title">Get a reading path</h3>
              <p className="home__step-desc">
                Books are automatically grouped into Beginner, Intermediate,
                and Advanced levels so you know where to start.
              </p>
            </div>
            <div className="home__step">
              <span className="home__step-num">3</span>
              <h3 className="home__step-title">Track your journey</h3>
              <p className="home__step-desc">
                Save books to your personal list and track your reading status
                as you work through your learning path.
              </p>
            </div>
          </div>
        </section>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <section className="home__recent" id="recent-searches">
            <h2 className="home__section-title">Recent searches</h2>
            <div className="home__recent-list">
              {recentSearches.map((topic, i) => (
                <button
                  key={i}
                  className="home__recent-item"
                  onClick={() => navigate(`/topic/${encodeURIComponent(topic)}`)}
                >
                  <span className="home__recent-icon" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </span>
                  {topic}
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
