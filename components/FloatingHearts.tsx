
import React, { useEffect, useState } from 'react';
import { HeartData } from '../types';

const FloatingHearts: React.FC = () => {
  const [hearts, setHearts] = useState<HeartData[]>([]);

  useEffect(() => {
    // Generate a set of hearts with staggered delays to prevent them from appearing all at once
    const generateHearts = () => {
      const newHearts: HeartData[] = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        duration: 8 + Math.random() * 12,
        size: 15 + Math.random() * 35,
        color: Math.random() > 0.5 ? 'text-pink-400' : 'text-purple-400',
        delay: Math.random() * 20, // Spread the start times over 20 seconds
      }));
      setHearts(newHearts);
    };

    generateHearts();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className={`absolute bottom-[-100px] transition-opacity duration-1000 ${heart.color}`}
          style={{
            left: `${heart.left}%`,
            animation: `floatUp ${heart.duration}s linear infinite`,
            animationDelay: `${heart.delay}s`,
            opacity: 0, // Starts invisible
          }}
        >
          <svg
            width={heart.size}
            height={heart.size}
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(0.5) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          90% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(-120vh) scale(1.5) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default FloatingHearts;
