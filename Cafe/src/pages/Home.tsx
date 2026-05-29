import { useEffect } from 'react';
import { seedData } from '@/lib/data';
import Hero from '@/sections/Hero';
import Atmosphere from '@/sections/Atmosphere';
import Philosophy from '@/sections/Philosophy';
import MenuWheel from '@/sections/MenuWheel';
import Reviews from '@/sections/Reviews';
import Footer from '@/sections/Footer';

export default function Home() {
  useEffect(() => {
    seedData();
  }, []);

  return (
    <main>
      <Hero />
      <Atmosphere />
      <Philosophy />
      <MenuWheel />
      <Reviews />
      <Footer />
    </main>
  );
}