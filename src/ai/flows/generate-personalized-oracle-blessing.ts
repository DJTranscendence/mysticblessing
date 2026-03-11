'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

/* ------------------------------------------------ */
/* SCHEMAS */
/* ------------------------------------------------ */

const GenerateBlessingInputSchema = z.object({
  name: z.string().optional(),
  birthMonth: z.string().optional(),
  intention: z.string().optional(),
  mood: z.string().optional(),
  interests: z.array(z.string()).optional(),
  favoriteColor: z.string().optional(),
  userId: z.string().optional(),
});

export type GenerateBlessingInput = z.infer<typeof GenerateBlessingInputSchema>;

const GenerateBlessingOutputSchema = z.object({
  blessing: z.string(),
  oracle: z.string(),
  sacredNumber: z.number().optional(),
});

export type GenerateBlessingOutput = z.infer<typeof GenerateBlessingOutputSchema>;

/* ------------------------------------------------ */
/* SYMBOL DATABASE */
/* ------------------------------------------------ */

type BirthSymbol = {
  element: string;
  season: string;
  symbol: string;
  animal: string;
  celestial: string;
};

const birthMonthMappings: Record<string, BirthSymbol> = {
  january: { element: 'Earth', season: 'Winter', symbol: 'Ice Shard', animal: 'Wolf', celestial: 'Waxing Crescent' },
  february: { element: 'Air', season: 'Winter', symbol: 'Frozen Lake', animal: 'Owl', celestial: 'Gibbous Moon' },
  march: { element: 'Fire', season: 'Spring', symbol: 'Budding Branch', animal: 'Falcon', celestial: 'New Moon' },
  april: { element: 'Earth', season: 'Spring', symbol: 'Blooming Flower', animal: 'Ram', celestial: 'Waxing Gibbous' },
  may: { element: 'Earth', season: 'Spring', symbol: 'Green Leaf', animal: 'Bull', celestial: 'Full Moon' },
  june: { element: 'Water', season: 'Summer', symbol: 'River', animal: 'Deer', celestial: 'Waning Gibbous' },
  july: { element: 'Water', season: 'Summer', symbol: 'Ocean Wave', animal: 'Crab', celestial: 'Last Quarter' },
  august: { element: 'Fire', season: 'Summer', symbol: 'Fiery Sun', animal: 'Lion', celestial: 'Balsamic Moon' },
  september: { element: 'Air', season: 'Autumn', symbol: 'Lantern', animal: 'Crane', celestial: 'New Moon' },
  october: { element: 'Water', season: 'Autumn', symbol: 'Bare Tree', animal: 'Scorpion', celestial: 'Waxing Crescent' },
  november: { element: 'Fire', season: 'Autumn', symbol: 'Whirlwind', animal: 'Phoenix', celestial: 'Gibbous Moon' },
  december: { element: 'Earth', season: 'Winter', symbol: 'Evergreen', animal: 'Pine', celestial: 'Full Moon' },
};

const moodMappings: Record<string, string> = {
  uncertain: 'mist',
  hopeful: 'sunrise',
  tired: 'fading ember',
  ambitious: 'rising flame',
  calm: 'still waters',
  anxious: 'restless wind',
  joyful: 'blooming flower',
  determined: 'rooted oak',
};

const colorMappings: Record<string, string> = {
  blue: 'deep waters',
  red: 'transforming fire',
  green: 'growing life',
  gold: 'destiny',
  black: 'hidden depths',
  white: 'pure potential',
  purple: 'ancient wisdom',
  silver: 'lunar glow',
};

const interestMappings: Record<string, string> = {
  art: 'painted mirror',
  music: 'singing string',
  nature: 'old forest',
  science: 'shimmering prism',
  philosophy: 'ancient library',
  travel: 'open road',
  technology: 'clockwork star',
};

/* ------------------------------------------------ */
/* ORACLE ARCHETYPES */
/* ------------------------------------------------ */

type OraclePersona = {
  name: string;
  tone: string;
  symbolism: string;
};

const oracles: OraclePersona[] = [
  {
    name: 'Forest Oracle',
    tone: 'patient earthy wisdom',
    symbolism: 'roots moss stone rivers',
  },
  {
    name: 'Star Oracle',
    tone: 'cosmic distant clarity',
    symbolism: 'stars constellations void light',
  },
  {
    name: 'Temple Oracle',
    tone: 'ancient ceremonial authority',
    symbolism: 'pillars incense bells sacred halls',
  },
];

/* ------------------------------------------------ */
/* UTILITIES */
/* ------------------------------------------------ */

function normalize(v?: string) {
  return v?.trim().toLowerCase();
}

function getBirthSymbols(month?: string) {
  if (!month) return {};
  return birthMonthMappings[normalize(month)!] ?? {};
}

function getMoodSymbol(mood?: string) {
  if (!mood) return undefined;
  return moodMappings[normalize(mood)!];
}

function getColorMeaning(color?: string) {
  if (!color) return undefined;
  return colorMappings[normalize(color)!];
}

function getInterestSymbol(interests?: string[]) {
  if (!interests?.length) return undefined;
  return interestMappings[normalize(interests[0])!];
}

function seededHash(seed?: string) {
  if (!seed) return Math.random();
  let h = 0;
  for (const c of seed) {
    h = (h << 5) - h + c.charCodeAt(0);
    h |= 0;
  }
  return Math.abs(h) / 2147483647;
}

function pickSeeded(arr: any[], seed?: string) {
  const r = seededHash(seed);
  const i = Math.floor(r * arr.length);
  return arr[i];
}

function sacredNumber(name?: string, month?: string) {
  let s = 0;
  for (const c of (name || '') + (month || '')) {
    s += c.charCodeAt(0);
  }
  if (s === 0) return undefined;
  return (s % 9) + 1;
}

function timeOmen() {
  const h = new Date().getHours();
  if (h < 12) return 'rising light of morning';
  if (h < 17) return 'bright eye of afternoon';
  if (h < 21) return 'long shadows of sunset';
  return 'deep breath of night';
}

/* ------------------------------------------------ */
/* PROMPT INPUT */
/* ------------------------------------------------ */

const PromptInputSchema = GenerateBlessingInputSchema.extend({
  element: z.string().optional(),
  season: z.string().optional(),
  symbol: z.string().optional(),
  animal: z.string().optional(),
  celestial: z.string().optional(),
  moodSymbol: z.string().optional(),
  colorMeaning: z.string().optional(),
  interestSymbol: z.string().optional(),
  oracle: z.string(),
  oracleTone: z.string(),
  oracleWorld: z.string(),
  sacredNumber: z.number().optional(),
  timeOmen: z.string(),
});

type PromptInput = z.infer<typeof PromptInputSchema>;

/* ------------------------------------------------ */
/* PROMPT */
/* ------------------------------------------------ */

const blessingPrompt = ai.definePrompt({
  name: 'oracleBlessing',
  model: 'vertexai/gemini-1.5-flash-002',
  input: { schema: PromptInputSchema },
  output: { schema: GenerateBlessingOutputSchema },
  prompt: `
You are a mystical oracle speaking prophecy.

Oracle nature: {{oracle}}  
Tone: {{oracleTone}}  
Symbolic world: {{oracleWorld}}

Symbols surrounding seeker:
Name: {{name}}
Element: {{element}}
Season: {{season}}
Animal: {{animal}}
Sacred symbol: {{symbol}}
Celestial: {{celestial}}

Mood: {{moodSymbol}}
Color: {{colorMeaning}}
Interest: {{interestSymbol}}

Sacred number: {{sacredNumber}}
Time omen: {{timeOmen}}

Write a poetic prophecy.

Structure:
- invocation of seeker  
- interpretation of symbols  
- recognition of hidden tension  
- guidance forward  
- short prophetic closing

Rules:
- no markdown  
- no headings  
- 150-220 words  

Return JSON with "blessing", "oracle", and "sacredNumber" fields.
`,
});

/* ------------------------------------------------ */
/* FALLBACK GENERATOR */
/* ------------------------------------------------ */

function fallbackBlessing(input: PromptInput): GenerateBlessingOutput {
  const name = input.name ?? 'seeker';
  return {
    blessing: `${name}, the signs gather quietly around you. The ${input.symbol ?? 'hidden symbol'} and the presence of ${input.animal ?? 'a watchful guide'} speak of a path that is still unfolding. The air carries the mood of ${input.moodSymbol ?? 'change'}, and beneath it a deeper rhythm moves like ${input.colorMeaning ?? 'a quiet current'}. What appears uncertain is not emptiness but preparation. Walk steadily. The next step reveals itself only when the previous one is taken. Remember the number ${input.sacredNumber ?? 7}. It marks a turning point rather than an ending. The oracle has spoken.`,
    oracle: input.oracle,
    sacredNumber: input.sacredNumber,
  };
}

/* ------------------------------------------------ */
/* FLOW */
/* ------------------------------------------------ */

const generateBlessingFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedOracleBlessingFlow',
    inputSchema: GenerateBlessingInputSchema,
    outputSchema: GenerateBlessingOutputSchema,
  },
  async (input) => {
    const birth = getBirthSymbols(input.birthMonth);
    const persona = pickSeeded(oracles, input.userId || input.name);

    const promptInput: PromptInput = {
      ...input,
      ...birth,
      moodSymbol: getMoodSymbol(input.mood),
      colorMeaning: getColorMeaning(input.favoriteColor),
      interestSymbol: getInterestSymbol(input.interests),
      oracle: persona.name,
      oracleTone: persona.tone,
      oracleWorld: persona.symbolism,
      sacredNumber: sacredNumber(input.name, input.birthMonth),
      timeOmen: timeOmen(),
    };

    try {
      const { output } = await blessingPrompt(promptInput);
      if (output?.blessing) {
        return output;
      }
      return fallbackBlessing(promptInput);
    } catch (err) {
      console.error('Oracle invocation failed:', err);
      return fallbackBlessing(promptInput);
    }
  }
);

/* ------------------------------------------------ */
/* EXPORT */
/* ------------------------------------------------ */

export async function generatePersonalizedOracleBlessing(
  input: GenerateBlessingInput
): Promise<GenerateBlessingOutput> {
  return generateBlessingFlow(input);
}
