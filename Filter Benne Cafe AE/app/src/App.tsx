import { useState, useEffect, useCallback } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Navigation from './components/Navigation';
import Hero from './sections/Hero';
import About from './sections/About';
import Ambience from './sections/Ambience';
import Menu from './sections/Menu';
import VideoFeature from './sections/VideoFeature';
import Footer from './sections/Footer';
import AdminPanel from './components/AdminPanel';
import FoodShowcase from './sections/FoodShowcase';

function App() {
  const [loading, setLoading] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'a') {
      e.preventDefault();
      setShowAdmin(prev => !prev);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="relative w-full overflow-x-hidden">
      <Navigation scrolled={scrolled} onAdminToggle={() => setShowAdmin(!showAdmin)} />
      
      <main>
        <Hero />
        <About />
        <Ambience />
        <FoodShowcase />
        <Menu />
        <VideoFeature />
      </main>

      <Footer />

      {showAdmin && (
        <AdminPanel onClose={() => setShowAdmin(false)} />
      )}

      {/* Admin hint */}
      <div className="fixed bottom-4 right-4 z-40 opacity-30 hover:opacity-100 transition-opacity">
        <button
          onClick={() => setShowAdmin(!showAdmin)}
          className="text-[10px] uppercase tracking-widest text-brown hover:text-burnt-orange transition-colors"
        >
          Admin
        </button>
      </div>
    </div>
  );
}

export default App;
