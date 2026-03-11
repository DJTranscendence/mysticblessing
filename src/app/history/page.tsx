
"use client"

import React, { useState } from 'react';
import BackgroundEffects from '@/components/mystic/BackgroundEffects';
import { ArrowLeft, History, Search, Filter, Trash2, ExternalLink, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useFirebase, useCollection, useMemoFirebase, deleteDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';

export default function HistoryPage() {
  const { firestore, user } = useFirebase();
  const [searchTerm, setSearchTerm] = useState("");

  // Memoize the query for the user's fortunes
  const fortunesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'users', user.uid, 'fortunes'),
      orderBy('createdAt', 'desc')
    );
  }, [firestore, user]);

  const { data: fortunes, isLoading } = useCollection(fortunesQuery);

  const handleDelete = (fortuneId: string) => {
    if (!firestore || !user) return;
    const fortuneRef = doc(firestore, 'users', user.uid, 'fortunes', fortuneId);
    deleteDocumentNonBlocking(fortuneRef);
  };

  const filteredFortunes = fortunes?.filter(f => 
    f.intention?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <main className="min-h-screen flex flex-col relative">
      <BackgroundEffects />
      
      <nav className="relative z-10 p-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-headline text-xl">Return to Oracle</span>
        </Link>
      </nav>

      <div className="flex-1 relative z-10 px-6 py-12 max-w-5xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div className="space-y-2">
            <h1 className="font-headline text-4xl font-bold flex items-center gap-3">
              <History className="text-primary" /> Your Prophecy Hall
            </h1>
            <p className="text-muted-foreground">Every word spoken by the oracle is etched here for eternity.</p>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input 
                placeholder="Search intentions..." 
                className="pl-10 bg-background/40"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon"><Filter size={18} /></Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Sparkles className="animate-spin text-primary" size={48} />
            <p className="font-headline text-xl animate-pulse">Consulting the archives...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFortunes.length > 0 ? (
              filteredFortunes.map((item) => (
                <Card key={item.id} className="glass-card hover:border-primary/50 transition-colors group cursor-pointer">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-xs text-accent font-bold uppercase tracking-widest">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.id);
                          }}
                        >
                          <Trash2 size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><ExternalLink size={14} /></Button>
                      </div>
                    </div>
                    <CardTitle className="font-headline text-xl group-hover:text-primary transition-colors">{item.intention}</CardTitle>
                    <CardDescription className="font-body italic text-muted-foreground line-clamp-3">
                      "{item.blessing || item.generatedBlessingText}"
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-2">
                       <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                        {item.name ? item.name[0] : '?'}
                       </div>
                       <span className="text-sm font-body">{item.name || 'Anonymous Seeker'}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                <History className="text-muted-foreground mb-4 opacity-20" size={64} />
                <p className="font-headline text-2xl text-muted-foreground">The hall is empty.</p>
                <p className="text-muted-foreground mb-6">No prophecies have been forged yet.</p>
                <Button asChild variant="outline">
                  <Link href="/">Invoke the Oracle</Link>
                </Button>
              </div>
            )}
            
            {filteredFortunes.length > 0 && (
              <Link href="/" className="glass-card border-dashed border-2 p-8 rounded-2xl flex flex-col items-center justify-center gap-4 hover:bg-white/5 transition-colors text-muted-foreground text-center">
                 <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                   <Sparkles className="text-primary" />
                 </div>
                 <p className="font-headline text-lg">Consult the Oracle Again</p>
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
