import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import TopicResults from './pages/TopicResults';
import BookDetails from './pages/BookDetails';
import ReadingJourney from './pages/ReadingJourney';

function parseHash() {
  const hash = window.location.hash.replace('#', '') || '/';
  return hash;
}

function matchRoute(path) {
  if (path === '/' || path === '') {
    return { page: 'home', params: {} };
  }

  // /topic/:query
  const topicMatch = path.match(/^\/topic\/(.+)$/);
  if (topicMatch) {
    return { page: 'topic', params: { topic: topicMatch[1] } };
  }

  // /book/:workId
  const bookMatch = path.match(/^\/book\/(.+)$/);
  if (bookMatch) {
    return { page: 'book', params: { workId: bookMatch[1] } };
  }

  // /journey
  if (path === '/journey') {
    return { page: 'journey', params: {} };
  }

  return { page: 'home', params: {} };
}

export default function App() {
  const [currentPath, setCurrentPath] = useState(parseHash());

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(parseHash());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const route = matchRoute(currentPath);

  const renderPage = () => {
    switch (route.page) {
      case 'topic':
        return <TopicResults key={route.params.topic} topic={route.params.topic} />;
      case 'book':
        return <BookDetails key={route.params.workId} workId={route.params.workId} />;
      case 'journey':
        return <ReadingJourney />;
      case 'home':
      default:
        return <Home />;
    }
  };

  return (
    <div className="app">
      <Header currentPath={currentPath} />
      <main>{renderPage()}</main>
      <Footer />
    </div>
  );
}
