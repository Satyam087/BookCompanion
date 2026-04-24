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

        {/* Editorial Two-Column Hero */}
        <section className="home__hero">
          <div className="home__hero-content">
            <span className="home__eyebrow">Structured topic reading for self-learners</span>
            <h1 className="home__heading">
              Study any topic.<br />Read in the right order.
            </h1>
            <p className="home__subtitle">
              Enter a subject and PageNotes turns the Open Library catalog 
              into a structured path, from beginner books to advanced reads.
            </p>

            <div className="home__search-wrap">
              <SearchBar size="large" />
            </div>

            <div className="home__chips-wrap">
              <TopicChips />
            </div>
          </div>

          <div className="home__hero-visual">
            <div className="home__study-desk">
              <div className="home__desk-book">
                <div className="home__desk-book-cover">
                  <span className="home__desk-book-title">The Design of Everyday Things</span>
                  <span className="home__desk-book-author">Don Norman</span>
                </div>
              </div>
              
              <div className="home__desk-note home__desk-note--1">
                <div className="home__desk-pin"></div>
                <p>Start with chapters 1-3 for foundational concepts.</p>
              </div>

              <div className="home__desk-note home__desk-note--2">
                <div className="home__desk-pin"></div>
                <p>A classic in UX design and psychology.</p>
              </div>

              <div className="home__desk-note home__desk-note--3">
                <div className="home__desk-pin"></div>
                <p>Level: Beginner</p>
              </div>
            </div>
          </div>
        </section>

        {/* Product Steps */}
        <section className="home__how" id="how-it-works">
          <h2 className="home__section-title">How it works</h2>
          <div className="home__steps">
            <div className="home__step">
              <span className="home__step-num">1</span>
              <h3 className="home__step-title">Pick a topic</h3>
              <p className="home__step-desc">
                Search for any broad subject. We map the Open Library catalog and pull the most relevant books.
              </p>
            </div>
            <div className="home__step">
              <span className="home__step-num">2</span>
              <h3 className="home__step-title">See a reading path</h3>
              <p className="home__step-desc">
                Books are automatically sorted into Beginner, Intermediate, and Advanced tiers so you always know where to start.
              </p>
            </div>
            <div className="home__step">
              <span className="home__step-num">3</span>
              <h3 className="home__step-title">Save your journey</h3>
              <p className="home__step-desc">
                Add books to your personal dashboard. Track progress, write notes, and build a lasting reading journey.
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
                  className="home__recent-tab"
                  onClick={() => navigate(`/topic/${encodeURIComponent(topic)}`)}
                >
                  <span className="home__recent-dot"></span>
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
