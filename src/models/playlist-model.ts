export interface Song {
  id: number;
  name: string;
  singer: string;
  duration?: number;
}

export const playlist: Song[] = [
  { id: 1, name: "Shape of You", singer: "Ed Sheeran", duration: 3.53 },
  { id: 2, name: "Levitating", singer: "Dua Lipa", duration: 3.23 }
];