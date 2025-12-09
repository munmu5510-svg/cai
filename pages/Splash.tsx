import React, { useEffect } from 'react';

interface SplashProps {
  onComplete: () => void;
}

export const Splash: React.FC<SplashProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="h-screen w-screen bg-vision-black flex flex-col items-center justify-center z-50">
      <div className="relative">
        <div className="absolute inset-0 bg-electric-blue blur-3xl opacity-20 animate-pulse rounded-full"></div>
        <h1 className="relative text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500 tracking-tighter animate-fade-in z-10">
          WySider
        </h1>
      </div>
      <p className="mt-4 text-gray-500 font-light tracking-widest uppercase text-sm animate-slide-up">
        Vision • Innovation • Disruption
      </p>
    </div>
  );
};