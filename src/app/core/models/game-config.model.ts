import { Player } from './player.model';

export interface GameConfig {
    players: Player[];
    questionsPerPair: number;
    numberOfRounds: number;
    selectedCategories: string[];
}

export type GameSize = 'short' | 'medium' | 'long';

export interface GameSizeConfig {
    questionsPerPair: number;
    pairingsPerGame: number;
}

export const GAME_SIZE_CONFIG: Record<GameSize, GameSizeConfig> = {
    short: { questionsPerPair: 3, pairingsPerGame: 5 },
    medium: { questionsPerPair: 5, pairingsPerGame: 7 },
    long: { questionsPerPair: 7, pairingsPerGame: 10 }
};