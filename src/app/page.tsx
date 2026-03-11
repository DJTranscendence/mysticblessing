"use client"

import React, { useState, useEffect } from "react"
import BackgroundEffects from "@/components/mystic/BackgroundEffects"
import OracleForm from "@/components/mystic/OracleForm"
import RitualSequence from "@/components/mystic/RitualSequence"
import FortuneDisplay from "@/components/mystic/FortuneDisplay"
import UpgradeCredits from "@/components/mystic/UpgradeCredits"
import { generatePersonalizedOracleBlessing } from "@/ai/flows/generate-personalized-oracle-blessing"
import { Reading } from "@/lib/types"
import { Sparkles, Scroll, History, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import {
  useFirebase,
  initiateAnonymousSignIn,
  setDocumentNonBlocking,
  useDoc,
  useMemoFirebase
} from "@/firebase"
import { doc } from "firebase/firestore"

export default function Home() {

  const { auth, firestore, user, isUserLoading } = useFirebase()

  const [reading, setReading] = useState<Reading | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isRitualizing, setIsRitualizing] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    if (!isUserLoading && !user && auth) {
      initiateAnonymousSignIn(auth)
    }
  }, [user, isUserLoading, auth])

  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null
    return doc(firestore, "users", user.uid)
  }, [firestore, user])

  const { data: profile } = useDoc(userProfileRef)

  const handleConsultOracle = async (values: any) => {

    if (!user) {
      toast({
        variant: "destructive",
        title: "Connection Required",
        description: "You must be signed in before consulting the oracle."
      })
      return
    }

    // Start the ritual
    generateBlessing(values)
  }

  async function generateBlessing(values: any) {

    if (!user || !firestore) return

    setIsRitualizing(true)
    setIsLoading(true)

    try {

      const interestsArray = typeof values.interests === 'string'
        ? values.interests.split(",").map((s: string) => s.trim())
        : []

      const result = await generatePersonalizedOracleBlessing({
        name: values.name,
        birthMonth: values.birthMonth,
        intention: values.intention,
        mood: values.mood,
        interests: interestsArray,
        favoriteColor: values.favoriteColor,
        userId: user.uid
      })

      if (!result?.blessing) {
        throw new Error("Oracle returned empty prophecy")
      }

      const fortuneId = Math.random().toString(36).substring(2, 9)

      const newReading: Reading = {
        id: fortuneId,
        name: values.name,
        birthMonth: values.birthMonth,
        intention: values.intention,
        mood: values.mood,
        interests: interestsArray,
        favoriteColor: values.favoriteColor,
        blessing: result.blessing,
        createdAt: Date.now()
      }

      const fortuneRef = doc(firestore, "users", user.uid, "fortunes", fortuneId)

      setDocumentNonBlocking(
        fortuneRef,
        {
          ...newReading,
          userId: user.uid,
          generatedBlessingText: result.blessing,
          generatedSymbols: JSON.stringify({
            mood: values.mood,
            month: values.birthMonth
          }),
          oraclePersonaUsed: result.oracle || "Celestial Seer",
          isPremiumFortune: false
        },
        { merge: true }
      )

      setReading(newReading)

    } catch (error: any) {

      console.error(error)

      toast({
        variant: "destructive",
        title: "The Oracle is Silent",
        description: error.message || "Mystical disturbance detected."
      })

    } finally {
      // Small delay for atmosphere
      setTimeout(() => {
        setIsRitualizing(false)
        setIsLoading(false)
      }, 1500)
    }
  }

  return (

    <main className="min-h-screen flex flex-col relative">

      <BackgroundEffects />

      <nav className="relative z-10 p-6 flex items-center justify-between">

        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="p-2 bg-primary rounded-lg mystic-glow group-hover:scale-110 transition-transform">
            <Sparkles className="text-white" size={24} />
          </div>
          <span className="font-headline text-2xl font-bold tracking-tight">
            Mystic Forge AI
          </span>
        </div>

        <div className="flex items-center gap-4">

          <div className="hidden lg:flex items-center gap-4 px-4 py-2 bg-white/5 rounded-full border border-white/10">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-accent" />
              <span className="text-xs font-bold uppercase tracking-widest">
                {profile?.credits ?? 0} Credits
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground hidden md:flex"
            asChild
          >
            <Link href="/history" className="flex items-center gap-2">
              <History size={18} /> Past Readings
            </Link>
          </Button>

          <Button
            variant="outline"
            className="border-primary/50 text-primary-foreground hidden md:flex"
          >
            {user?.isAnonymous
              ? "Seeker Detected"
              : user?.displayName || "Adept"}
          </Button>

        </div>
      </nav>

      <div className="flex-1 relative z-10 flex flex-col items-center justify-center px-6 py-12">

        {isRitualizing && <RitualSequence />}

        {!reading ? (

          <div className="w-full space-y-12 text-center">

            <div className="max-w-3xl mx-auto space-y-4 animate-float">

              <h1 className="font-headline text-5xl md:text-7xl font-black text-primary-foreground text-shadow-glow leading-tight">
                Whispers of Fate
                <br />
                <span className="text-accent italic">
                  Forged in Intelligence
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground font-body max-w-2xl mx-auto leading-relaxed">
                Speak your intention. The oracle listens.
              </p>

            </div>

            <div className="flex flex-col lg:flex-row items-start justify-center gap-12 max-w-6xl mx-auto">

              <OracleForm
                onSubmit={handleConsultOracle}
                isLoading={isLoading}
              />

              <div className="w-full lg:w-auto flex flex-col gap-6 items-center">

                <UpgradeCredits />

                <div className="glass-card p-6 rounded-2xl w-full max-w-sm text-left space-y-4">

                  <h3 className="font-headline text-lg flex items-center gap-2">
                    <User size={18} className="text-primary" />
                    Ritual Status
                  </h3>

                  <div className="space-y-2">

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Soul Identity
                      </span>
                      <span>
                        {user?.isAnonymous ? "Anonymous" : "Bonded"}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Ether Reserve
                      </span>
                      <span className="text-accent font-bold">
                        {profile?.credits ?? 0} Credits
                      </span>
                    </div>

                  </div>

                </div>

              </div>

            </div>

            <div className="pt-12 flex flex-col items-center gap-6 opacity-60">

              <div className="flex items-center gap-8 grayscale brightness-200">
                <Scroll size={32} />
                <Sparkles size={32} />
                <History size={32} />
              </div>

              <p className="font-body text-sm uppercase tracking-widest">
                Endorsed by the High Oracles of Silicon
              </p>

            </div>

          </div>

        ) : (

          <FortuneDisplay
            reading={reading}
            onReset={() => setReading(null)}
          />

        )}

      </div>

      <footer className="relative z-10 p-8 border-t border-white/5 text-center text-muted-foreground font-body text-sm">
        <p>
          © {new Date().getFullYear()} Mystic Forge AI
        </p>
      </footer>

    </main>

  )
}
