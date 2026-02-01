import { Player } from './player.model';
import { Question } from './question.model';

export type GamePhase = 'pairing' | 'question' | 'finished';

export interface GameSession {
    currentRoundIndex: number;
    currentQuestionInRoundIndex: number;
    phase: GamePhase;
}

export interface GameView {
    phase: GamePhase;
    currentPair: [Player, Player] | null;
    currentQuestion: Question | null;
    roundNumber: number;
    questionNumberInRound: number;
    totalRounds: number;
    questionsPerRound: number;
}
