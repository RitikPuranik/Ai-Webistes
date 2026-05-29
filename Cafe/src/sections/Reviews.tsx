import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star } from 'lucide-react';
import { getReviews } from '@/lib/data';
import type { Review } from '@/types';

gsap.registerPlugin(ScrollTrigger);

export default function Reviews() {
  const sectionRef = useRef<HTMLElement>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    setReviews(getReviews());

    const handleStorage = () => setReviews(getReviews());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reviews.length === 0) return;

    const cards = gsap.utils.toArray<HTMLElement>('.review-card');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 60%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.fromTo(
      '.reviews-title',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    );

    cards.forEach((card) => {
      tl.fromTo(
        card,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: 'power3.out',
        },
        `-=${0.5}`
      );
    });

    return () => { tl.kill(); };
  }, [reviews]);

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-40 overflow-hidden paper-texture"
      style={{ backgroundColor: '#f8ebd5' }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="text-center mb-16">
          <h2
            className="reviews-title font-display text-charcoal opacity-0"
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
          >
            What Our Guests Say
          </h2>
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={18}
                  className={
                    s <= Math.round(Number(avgRating))
                      ? 'text-saddle fill-saddle'
                      : 'text-sand'
                  }
                />
              ))}
            </div>
            <span className="font-body text-warmgray text-sm">
              {avgRating} from {reviews.length} reviews
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="review-card bg-sand/40 rounded-lg p-8 opacity-0 backdrop-blur-sm border border-sand/60"
            >
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={16}
                    className={
                      s <= review.rating
                        ? 'text-saddle fill-saddle'
                        : 'text-sand'
                    }
                  />
                ))}
              </div>
              <p className="font-body text-charcoal leading-relaxed mb-6">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <span className="font-body text-sm text-charcoal font-medium">
                  {review.name}
                </span>
                <span className="font-body text-xs text-warmgray">
                  {review.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}