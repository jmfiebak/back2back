import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GameSession, GameView, GamePhase, Player, Question } from '../models';
import { GameService } from './game.service';

@Injectable({
    providedIn: 'root'
})
export class GameSessionService {
    private sessionSubject = new BehaviorSubject<GameSession | null>(null);

    public session$: Observable<GameSession | null> = this.sessionSubject.asObservable();

    /**
     * Observable that provides a view-friendly representation of the current game state
     */
    public gameView$: Observable<GameView | null> = this.session$.pipe(
        map(session => this.buildGameView(session))
    );

    constructor(private gameService: GameService) {}

    /**
     * Starts a new game session based on the current GameConfig
     */
    startSession(): void {
        const config = this.gameService.getCurrentConfig();
        if (!config) {
            console.error('Cannot start session: No game config found');
            return;
        }

        const initialSession: GameSession = {
            currentRoundIndex: 0,
            currentQuestionInRoundIndex: 0,
            phase: 'pairing'
        };

        this.sessionSubject.next(initialSession);
    }

    /**
     * Advances to the next state in the game
     * pairing -> question (first question) -> question (next) -> ... -> pairing (next round) -> ... -> finished
     */
    next(): void {
        const session = this.sessionSubject.value;
        const config = this.gameService.getCurrentConfig();

        if (!session || !config) {
            return;
        }

        switch (session.phase) {
            case 'pairing':
                // Move from pairing announcement to first question
                this.sessionSubject.next({
                    ...session,
                    phase: 'question'
                });
                break;

            case 'question':
                const isLastQuestionInRound = session.currentQuestionInRoundIndex >= config.questionsPerPair - 1;
                const isLastRound = session.currentRoundIndex >= config.numberOfRounds - 1;

                if (isLastQuestionInRound) {
                    if (isLastRound) {
                        // Game finished
                        this.sessionSubject.next({
                            ...session,
                            phase: 'finished'
                        });
                    } else {
                        // Move to next round (show pairing first)
                        this.sessionSubject.next({
                            currentRoundIndex: session.currentRoundIndex + 1,
                            currentQuestionInRoundIndex: 0,
                            phase: 'pairing'
                        });
                    }
                } else {
                    // Next question in same round
                    this.sessionSubject.next({
                        ...session,
                        currentQuestionInRoundIndex: session.currentQuestionInRoundIndex + 1
                    });
                }
                break;

            case 'finished':
                // Do nothing, game is over
                break;
        }
    }

    /**
     * Returns the current session state synchronously
     */
    getCurrentSession(): GameSession | null {
        return this.sessionSubject.value;
    }

    /**
     * Ends the current session
     */
    endSession(): void {
        this.sessionSubject.next(null);
    }

    /**
     * Builds a view-friendly representation of the game state
     */
    private buildGameView(session: GameSession | null): GameView | null {
        const config = this.gameService.getCurrentConfig();

        if (!session || !config) {
            return null;
        }

        // Calculate the global question index from the flat questions array
        const globalQuestionIndex =
            session.currentRoundIndex * config.questionsPerPair +
            session.currentQuestionInRoundIndex;

        const currentPair = config.pairs?.[session.currentRoundIndex] ?? null;
        const currentQuestion = config.questions?.[globalQuestionIndex] ?? null;

        return {
            phase: session.phase,
            currentPair,
            currentQuestion,
            roundNumber: session.currentRoundIndex + 1,
            questionNumberInRound: session.currentQuestionInRoundIndex + 1,
            totalRounds: config.numberOfRounds,
            questionsPerRound: config.questionsPerPair
        };
    }
}
