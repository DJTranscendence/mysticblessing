"use client"

import React, { useEffect } from 'react';
import BackgroundEffects from '@/components/mystic/BackgroundEffects';
import { Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative p-6">
      <BackgroundEffects />
      
      <div className="relative z-10 glass-card p-12 rounded-3xl max-w-md w-full text-center space-y-8 mystic-glow border-primary/20">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle className="text-primary" size={48} />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="font-headline text-4xl font-bold text-primary-foreground">Offering Accepted</h1>
          <p className="text-muted-foreground font-body text-lg">
            The stars have aligned. Your Celestial Credits have been added to your account.
          </p>
        </div>

        <Button asChild className="w-full py-6 text-lg font-headline">
          <Link href="/">
            Return to Oracle <ArrowRight className="ml-2" />
          </Link>
        </Button>
      </div>
    </main>
  );
}
