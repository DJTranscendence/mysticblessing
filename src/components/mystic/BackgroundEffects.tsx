"use client"

import React, { useEffect, useState } from 'react';

export default function BackgroundEffects() {
  const [particles, setParticles] = useState<{ id: number; left: string; top: string; size: string; delay: string; duration: string }[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 3 + 1}px`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 10 + 10}s`,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#26202B]">
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background opacity-80" />
      
      {/* Mystic Radial Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[120px] animate-pulse-mystic" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-[120px] animate-pulse-mystic" style={{ animationDelay: '2s' }} />
      
      {/* Slow spinning Mandala/Starfield in background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <div className="w-[150vmax] h-[150vmax] animate-spin-slow border-[1px] border-primary/20 rounded-full" />
        <div className="absolute w-[120vmax] h-[120vmax] animate-spin-slow border-[1px] border-accent/10 rounded-full" style={{ animationDirection: 'reverse' }} />
      </div>

      {/* Floating Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bg-white/40 rounded-full animate-float"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}
