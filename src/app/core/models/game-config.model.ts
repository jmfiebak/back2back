import { Player } from './player.model';

export interface GameConfig {
  players: Player[];
  questionsPerPair: number;
  numberOfRounds: number;
  selectedCategories: string[];
}

export type GameDifficulty = 'short' | 'medium' | 'long';

export const DIFFICULTY_QUESTIONS: Record<GameDifficulty, number> = {
  short: 3,
  medium: 5,
  long: 7
};
