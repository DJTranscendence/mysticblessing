"use client"

import React, { useState, useEffect } from 'react';
import { Scroll, Share2, ArrowLeft, Download, Bookmark, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reading } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

interface FortuneDisplayProps {
  reading: Reading;
  onReset: () => void;
}

export default function FortuneDisplay({ reading, onReset }: FortuneDisplayProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < reading.blessing.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + reading.blessing[index]);
        setIndex((prev) => prev + 1);
      }, 15);
      return () => clearTimeout(timeout);
    }
  }, [index, reading.blessing]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'A Blessing from Mystic Forge AI',
          text: reading.blessing,
          url: window.location.href,
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      navigator.clipboard.writeText(reading.blessing);
      toast({
        title: "Copied to clipboard",
        description: "Your blessing is ready to be shared with the world.",
      });
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 pb-20">
      <div className="glass-card rounded-3xl p-8 md:p-12 mystic-glow relative overflow-hidden border-primary/20">
        {/* Atmospheric overlays */}
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Scroll size={120} className="rotate-12" />
        </div>
        
        <div className="relative z-10 space-y-8">
          <div className="flex items-center justify-between border-b border-primary/20 pb-6">
            <div>
              <p className="text-accent font-body uppercase tracking-widest text-sm mb-1">Revelation for</p>
              <h1 className="font-headline text-4xl md:text-5xl text-primary-foreground text-shadow-glow">{reading.name}</h1>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground text-sm font-body">{new Date(reading.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              <p className="text-primary font-bold text-sm">Divine Reading</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <div className="font-body text-xl leading-relaxed text-foreground/90 whitespace-pre-wrap italic">
              {displayedText}
              {index < reading.blessing.length && <span className="inline-block w-2 h-6 bg-primary ml-1 animate-pulse" />}
            </div>
          </div>

          <div className="pt-8 border-t border-primary/20 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleShare} className="gap-2 bg-background/20 hover:bg-primary/20">
                <Share2 size={16} /> Share
              </Button>
              <Button variant="outline" size="sm" className="gap-2 bg-background/20 hover:bg-primary/20">
                <Download size={16} /> Save Image
              </Button>
            </div>
            
            <div className="flex gap-3">
               <Button onClick={onReset} variant="ghost" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft size={16} className="mr-2" /> New Reading
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
            <Bookmark className="text-primary" />
          </div>
          <h3 className="font-headline text-lg mb-1">Your Sacred Number</h3>
          <p className="text-3xl font-bold text-primary">{(reading.name.length + reading.blessing.length) % 9 + 1}</p>
        </div>
        <div className="glass-card p-6 rounded-2xl flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mb-4">
            <Moon className="text-accent" />
          </div>
          <h3 className="font-headline text-lg mb-1">Guiding Symbol</h3>
          <p className="text-xl capitalize text-accent">{reading.birthMonth}</p>
        </div>
        <div className="glass-card p-6 rounded-2xl flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-muted/40 rounded-full flex items-center justify-center mb-4">
            <Scroll className="text-muted-foreground" />
          </div>
          <h3 className="font-headline text-lg mb-1">Oracle Persona</h3>
          <p className="text-xl text-muted-foreground">The Celestial Seer</p>
        </div>
      </div>
    </div>
  );
}
