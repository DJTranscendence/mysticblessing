export interface Reading {
  id: string;
  name: string;
  birthMonth: string;
  intention: string;
  mood: string;
  interests: string[];
  favoriteColor?: string;
  blessing: string;
  createdAt: number;
}
