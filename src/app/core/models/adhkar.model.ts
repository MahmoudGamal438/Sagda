export interface DhikrItem {
  id: string;
  text: string;
  repeat: number;
  source: string;
  grade?: string;
  meaning?: string;
}

export interface DhikrCategory {
  id: string;
  title: string;
  description: string;
  timeHint?: 'morning' | 'evening' | 'sleep' | 'prayer' | 'anytime';
  items: DhikrItem[];
}

export interface DhikrProgress {
  categoryId: string;
  counts: Record<string, number>;
  completed: boolean;
  updatedAt: number;
}
