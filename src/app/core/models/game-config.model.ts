import { Player } from './player.model';

export interface GameConfig {
    players: Player[];
    questionsPerPair: number;
    numberOfRounds: number;
    selectedCategories: string[];
}

export type GameDifficulty = 'kurz' | 'mittel' | 'lang';

export const DIFFICULTY_QUESTIONS: Record<GameDifficulty, number> = {
    kurz: 3,
    mittel: 5,
    lang: 7
};