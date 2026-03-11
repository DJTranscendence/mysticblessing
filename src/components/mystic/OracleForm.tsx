"use client"

import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Sparkles, Moon, Sun, Hand, User, BookOpen, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(2, "The oracle requires a name to address you."),
  birthMonth: z.string().min(1, "The stars need your birth month."),
  intention: z.string().min(5, "Tell the oracle what you seek."),
  mood: z.string().min(1, "Speak of your current state."),
  interests: z.string().optional(),
  favoriteColor: z.string().optional(),
});

interface OracleFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isLoading: boolean;
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const moods = [
  "uncertain", "hopeful", "tired", "ambitious", "calm", "anxious", "joyful", "determined"
];

const mysticalColors = [
  "Blue", "Red", "Green", "Gold", "Black", "White", "Purple", "Silver", "Other (Describe your own hue)"
];

const presetIntentions = [
  "Career Clarity & Professional Path",
  "Love, Romance & Soul Connection",
  "Inner Peace, Healing & Well-being",
  "Creative Inspiration & Artistic Flow",
  "Financial Abundance & Prosperity",
  "Spiritual Growth & Hidden Wisdom",
  "Navigating Life Transitions",
  "Other (Enter your own path below)"
];

const presetInterests = [
  "Ancient History & Mythology",
  "Stargazing & Astronomy",
  "Music, Melodies & Rhythms",
  "Art, Design & Visual Creation",
  "Nature, Forests & Earthly Wonders",
  "Meditation, Mindfulness & Spirit",
  "Travel, Exploration & New Horizons",
  "Philosophy, Logic & Wisdom",
  "Other (Describe your own affinities)"
];

export default function OracleForm({ onSubmit, isLoading }: OracleFormProps) {
  const [showCustomIntention, setShowCustomIntention] = useState(false);
  const [showCustomInterests, setShowCustomInterests] = useState(false);
  const [showCustomColor, setShowCustomColor] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      birthMonth: "",
      intention: "",
      mood: "",
      interests: "",
      favoriteColor: "",
    },
  });

  const handleIntentionSelect = (value: string) => {
    if (value === "Other (Enter your own path below)") {
      setShowCustomIntention(true);
      form.setValue("intention", "");
    } else {
      setShowCustomIntention(false);
      form.setValue("intention", value);
    }
  };

  const handleInterestsSelect = (value: string) => {
    if (value === "Other (Describe your own affinities)") {
      setShowCustomInterests(true);
      form.setValue("interests", "");
    } else {
      setShowCustomInterests(false);
      form.setValue("interests", value);
    }
  };

  const handleColorSelect = (value: string) => {
    if (value === "Other (Describe your own hue)") {
      setShowCustomColor(true);
      form.setValue("favoriteColor", "");
    } else {
      setShowCustomColor(false);
      form.setValue("favoriteColor", value.toLowerCase());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto glass-card p-8 rounded-2xl mystic-glow">
      <div className="mb-8 text-center">
        <h2 className="font-headline text-3xl mb-2 text-primary-foreground text-shadow-glow flex items-center justify-center gap-2">
          <Sparkles className="text-accent" /> Consult the Oracle
        </h2>
        <p className="text-muted-foreground font-body">The more you reveal, the deeper the prophecy will cut through the veil of time.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><User size={16} /> Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="How shall the oracle address you?" {...field} className="bg-background/40" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birthMonth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><Moon size={16} /> Birth Month</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background/40">
                        <SelectValue placeholder="When were you born?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {months.map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormItem>
              <FormLabel className="flex items-center gap-2"><Hand size={16} /> Your Intention</FormLabel>
              <Select onValueChange={handleIntentionSelect}>
                <FormControl>
                  <SelectTrigger className="bg-background/40">
                    <SelectValue placeholder="What goal or path do you seek clarity on?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {presetIntentions.map((intent) => (
                    <SelectItem key={intent} value={intent}>{intent}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Choose a preset path or define your own unique journey.</FormDescription>
            </FormItem>

            {showCustomIntention && (
              <FormField
                control={form.control}
                name="intention"
                render={({ field }) => (
                  <FormItem className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <FormControl>
                      <Textarea 
                        placeholder="Tell the oracle specifically what you seek..." 
                        {...field} 
                        className="bg-background/40 min-h-[100px]" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {!showCustomIntention && (
              <FormField
                control={form.control}
                name="intention"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="mood"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><Sun size={16} /> Emotional State</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background/40">
                        <SelectValue placeholder="How do you feel?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {moods.map((m) => (
                        <SelectItem key={m} value={m} className="capitalize">{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormItem>
                <FormLabel className="flex items-center gap-2"><Heart size={16} /> Favorite Color</FormLabel>
                <Select onValueChange={handleColorSelect}>
                  <FormControl>
                    <SelectTrigger className="bg-background/40">
                      <SelectValue placeholder="A color that resonates..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mysticalColors.map((color) => (
                      <SelectItem key={color} value={color} className="capitalize">
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>

              {showCustomColor && (
                <FormField
                  control={form.control}
                  name="favoriteColor"
                  render={({ field }) => (
                    <FormItem className="animate-in fade-in slide-in-from-top-2 duration-300">
                      <FormControl>
                        <Input placeholder="Describe your unique color resonance..." {...field} className="bg-background/40" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {!showCustomColor && (
                <FormField
                  control={form.control}
                  name="favoriteColor"
                  render={({ field }) => (
                    <FormItem className="hidden">
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>

          <div className="space-y-4">
            <FormItem>
              <FormLabel className="flex items-center gap-2"><BookOpen size={16} /> Interests & Affinities</FormLabel>
              <Select onValueChange={handleInterestsSelect}>
                <FormControl>
                  <SelectTrigger className="bg-background/40">
                    <SelectValue placeholder="What matters to your soul?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {presetInterests.map((interest) => (
                    <SelectItem key={interest} value={interest}>{interest}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Select a resonance or describe your unique affinities.</FormDescription>
            </FormItem>

            {showCustomInterests && (
              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <FormControl>
                      <Input placeholder="e.g. travel, music, ancient history" {...field} className="bg-background/40" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {!showCustomInterests && (
              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full py-6 text-lg font-headline mystic-glow transition-all hover:scale-[1.02]"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2 animate-pulse">
                <Sparkles className="animate-spin" size={20} /> Gathering Fate...
              </span>
            ) : (
              "Invoke the Oracle"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
