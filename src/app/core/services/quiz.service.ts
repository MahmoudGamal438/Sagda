import { Injectable, computed, inject, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { QUIZ_QUESTIONS, QuizCategory, QuizLevel, QuizQuestion } from '../data/quiz.data';

export interface QuizProgress {
  taken: number;
  answered: number;
  correct: number;
  points: number;
  dailyDates: string[];
  bestStreak: number;
}

const DEFAULTS: QuizProgress = {
  taken: 0,
  answered: 0,
  correct: 0,
  points: 0,
  dailyDates: [],
  bestStreak: 0
};

@Injectable({ providedIn: 'root' })
export class QuizService {
  private storage = inject(StorageService);
  readonly progress = signal<QuizProgress>({ ...DEFAULTS, ...this.storage.get('quiz-progress', {}) });
  readonly accuracy = computed(() => {
    const p = this.progress();
    return p.answered ? Math.round((p.correct / p.answered) * 100) : 0;
  });

  questions(category: QuizCategory, level: QuizLevel): QuizQuestion[] {
    return QUIZ_QUESTIONS.filter((q) => q.category === category && q.level === level);
  }

  dailyQuestion(date = new Date()): QuizQuestion {
    const seed = date.getFullYear() * 1000 + date.getMonth() * 40 + date.getDate();
    return QUIZ_QUESTIONS[seed % QUIZ_QUESTIONS.length];
  }

  dailyDone(date = new Date()): boolean {
    return this.progress().dailyDates.includes(this.dateKey(date));
  }

  record(result: { answered: number; correct: number; streak: number }): void {
    this.progress.update((p) => {
      const next: QuizProgress = {
        ...p,
        taken: p.taken + 1,
        answered: p.answered + result.answered,
        correct: p.correct + result.correct,
        points: p.points + result.correct * 10,
        bestStreak: Math.max(p.bestStreak, result.streak)
      };
      this.storage.set('quiz-progress', next);
      return next;
    });
  }

  markDaily(date = new Date()): void {
    this.progress.update((p) => {
      if (p.dailyDates.includes(this.dateKey(date))) {
        return p;
      }
      const next = { ...p, dailyDates: [...p.dailyDates, this.dateKey(date)] };
      this.storage.set('quiz-progress', next);
      return next;
    });
  }

  reset(): void {
    this.progress.set({ ...DEFAULTS });
    this.storage.set('quiz-progress', { ...DEFAULTS });
  }

  private dateKey(date: Date): string {
    return date.toISOString().slice(0, 10);
  }
}
