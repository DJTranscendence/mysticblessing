"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Coins, Loader2 } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { useFirebase } from '@/firebase';
import { toast } from '@/hooks/use-toast';

// Use public key from env or a placeholder for now
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

export default function UpgradeCredits() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useFirebase();

  const handleUpgrade = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Disconnected",
        description: "You must be logged in to purchase credits.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          email: user.email,
        }),
      });

      const { sessionId, error } = await response.json();
      
      if (error) throw new Error(error);

      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (stripeError) throw new Error(stripeError.message);
    } catch (err: any) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Ritual Error",
        description: err.message || "Something went wrong with the transaction.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 rounded-2xl border-accent/20 flex flex-col items-center gap-4 text-center max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
        <Coins className="text-accent" />
      </div>
      <div className="space-y-1">
        <h3 className="font-headline text-lg font-bold">Celestial Credits</h3>
        <p className="text-sm text-muted-foreground font-body">
          Purchase 10 credits for $15.00 NZD to unlock premium prophecies.
        </p>
      </div>
      <Button 
        onClick={handleUpgrade} 
        disabled={isLoading}
        className="w-full bg-accent hover:bg-accent/90 text-white font-headline"
      >
        {isLoading ? (
          <Loader2 className="animate-spin mr-2" />
        ) : (
          <Sparkles className="mr-2" size={16} />
        )}
        Buy Credits
      </Button>
    </div>
  );
}
