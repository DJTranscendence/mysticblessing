"use client"

import React from 'react';
import BackgroundEffects from '@/components/mystic/BackgroundEffects';
import { XCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PaymentCancelPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative p-6">
      <BackgroundEffects />
      
      <div className="relative z-10 glass-card p-12 rounded-3xl max-w-md w-full text-center space-y-8 border-destructive/20">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
            <XCircle className="text-destructive" size={48} />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="font-headline text-4xl font-bold">Ritual Interrupted</h1>
          <p className="text-muted-foreground font-body text-lg">
            The flow was broken. Your offering was not completed.
          </p>
        </div>

        <Button asChild variant="outline" className="w-full py-6 text-lg font-headline">
          <Link href="/">
            <ArrowLeft className="mr-2" /> Try Again
          </Link>
        </Button>
      </div>
    </main>
  );
}
