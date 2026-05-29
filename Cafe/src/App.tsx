import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router';
import LoadingScreen from '@/components/LoadingScreen';
import Navigation from '@/components/Navigation';

const Home = lazy(() => import('@/pages/Home'));
const Admin = lazy(() => import('@/pages/Admin'));

function App() {
  const [loading, setLoading] = useState(true);
  const [minTimePassed, setMinTimePassed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinTimePassed(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLoadComplete = () => {
    if (minTimePassed) {
      setLoading(false);
    } else {
      const check = setInterval(() => {
        if (minTimePassed) {
          setLoading(false);
          clearInterval(check);
        }
      }, 100);
    }
  };

  return (
    <>
      {loading && <LoadingScreen onComplete={handleLoadComplete} />}
      <Navigation />
      <Suspense
        fallback={
          <div
            className="min-h-screen flex items-center justify-center"
            style={{ backgroundColor: '#f8ebd5' }}
          >
            <div className="font-display text-charcoal text-xl animate-pulse">
              Linden
            </div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;