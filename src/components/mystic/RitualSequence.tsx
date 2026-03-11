"use client"

import React, { useEffect, useState } from 'react';
import { Sparkles, Moon, Sun, Wind, Flame } from "lucide-react";

export default function RitualSequence() {
  const [stage, setStage] = useState(0);
  const messages = [
    "The oracle listens...",
    "The threads of fate are being gathered.",
    "Whispers of the ancient wind emerge.",
    "The celestial alignment is shifting.",
    "Your blessing is taking form..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStage((prev) => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-12">
        {/* Animated Ritual Circle */}
        <div className="w-64 h-64 border-2 border-primary/30 rounded-full animate-spin-slow flex items-center justify-center">
          <div className="w-48 h-48 border-[1px] border-accent/20 rounded-full animate-spin flex items-center justify-center" style={{ animationDuration: '3s' }} />
        </div>
        
        {/* Icons Floating */}
        <Moon className="absolute top-0 left-0 text-primary animate-pulse-mystic" size={32} />
        <Sun className="absolute top-0 right-0 text-accent animate-pulse-mystic" style={{ animationDelay: '1s' }} size={32} />
        <Wind className="absolute bottom-0 left-0 text-muted-foreground animate-pulse-mystic" style={{ animationDelay: '2s' }} size={32} />
        <Flame className="absolute bottom-0 right-0 text-destructive animate-pulse-mystic" style={{ animationDelay: '1.5s' }} size={32} />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="text-primary-foreground animate-bounce" size={48} />
        </div>
      </div>

      <div className="space-y-4 max-w-md">
        <h3 className="font-headline text-3xl text-primary-foreground text-shadow-glow transition-all duration-1000">
          {messages[stage]}
        </h3>
        <p className="text-muted-foreground font-body italic">Stay present. The universe reveals itself in its own time.</p>
        
        <div className="w-48 h-1 bg-secondary rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-primary animate-[progress_10s_ease-in-out_infinite]" style={{ width: '100%' }} />
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
