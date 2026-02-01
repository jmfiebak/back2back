import { Category } from './category.model';
import { Player } from './player.model';
import { Question } from './question.model';

export interface GameConfig {
    players: Player[];
    questionsPerPair: number;
    numberOfRounds: number;
    selectedCategories: Category[];
    pairs?: Array<[Player, Player]>;
    questions?: Array<Question>;
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