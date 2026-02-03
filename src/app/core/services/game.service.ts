import { Injectable } from '@angular/core';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { Category, GameConfig, Player, Question } from '../models';
import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root'
})
export class GameService {
    private readonly STORAGE_KEY = 'current_game_config';

    private gameConfigSubject = new BehaviorSubject<GameConfig | null>(null);
    public gameConfig$: Observable<GameConfig | null> = this.gameConfigSubject.asObservable();

    constructor(private storage: StorageService) {
        this.loadConfig();
    }

    /**
     * Creates a new game config and saves it
     */
    async createGame(formData: GameConfig): Promise<void> {
        const configWithTimestamp = {
            ...formData,
            pairs: this.generatePairs(formData.players, formData.numberOfRounds),
            questions: this.generateQuestions(formData.selectedCategories, formData.numberOfRounds, formData.questionsPerPair),
            createdAt: new Date()
        };

        await this.storage.set(this.STORAGE_KEY, configWithTimestamp);
        this.gameConfigSubject.next(configWithTimestamp);

        console.log('Game Config saved:', configWithTimestamp);
    }

    /**
     * Loads the current game config from storage
     */
    async loadConfig(): Promise<GameConfig | null> {
        const config = await this.storage.get<GameConfig>(this.STORAGE_KEY);
        this.gameConfigSubject.next(config);
        return config;
    }

    /**
     * Returns the current game config (synchronous)
     */
    getCurrentConfig(): GameConfig | null {
        return this.gameConfigSubject.value;
    }

    /**
     * Clears the current game config
     */
    async clearConfig(): Promise<void> {
        await this.storage.remove(this.STORAGE_KEY);
        this.gameConfigSubject.next(null);
    }

    /**
     * Checks if an active game exists
     */
    async hasActiveGame(): Promise<boolean> {
        return this.storage.has(this.STORAGE_KEY);
    }

    /**
     * Generates player pairs based on config
     */
    generatePairs(players: Player[], numberOfRounds: number): Array<[Player, Player]> {
        const pairs: Array<[Player, Player]> = [];
        console.log('Generating pairs for players:', players);
        console.log('Number of Rounds:', numberOfRounds);

        for (let round = 0; round < numberOfRounds; round++) {
            const lastPair = pairs[pairs.length - 1];
            const shuffledPlayers = this.shuffle(players);
            const nextPair = shuffledPlayers.slice(0, 2) as [Player, Player];
            // Ensure no immediate repeats
            if (lastPair && lastPair.includes(nextPair[0]) && lastPair.includes(nextPair[1])) {
                pairs.push(shuffledPlayers.slice(shuffledPlayers.length - 2) as [Player, Player]);
            } else {
                pairs.push(nextPair);
            }
        }
        console.log(pairs);

        return pairs;
    }

    generateQuestions(selectedCategories: Category[], numberOfRounds: number, questionsPerPair: number): Array<Question> {
        const targetLength = numberOfRounds * questionsPerPair;
        const categoryQuestionArrays = selectedCategories.map(cat => this.shuffle(cat.questions));

        return this.shuffle(this.mergeArraysEvenly(categoryQuestionArrays, targetLength));

    }

    shuffle(array: Array<any>): Array<any> {
        let currentIndex = array.length;

        // While there remain elements to shuffle...
        while (currentIndex != 0) {

            // Pick a remaining element...
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    mergeArraysEvenly<T>(arrays: T[][], targetLength: number): T[] {
        // Filtere leere Arrays heraus
        const nonEmptyArrays = arrays.filter(arr => arr.length > 0);

        if (nonEmptyArrays.length === 0) {
            return [];
        }

        const result: T[] = [];
        const indices: number[] = new Array(nonEmptyArrays.length).fill(0);

        // Berechne, wie viele Elemente pro Array genommen werden sollen
        const elementsPerArray = targetLength / nonEmptyArrays.length;

        for (let i = 0; i < targetLength; i++) {
            // Bestimme, aus welchem Array das nächste Element kommt
            const arrayIndex = Math.floor(i / elementsPerArray) % nonEmptyArrays.length;

            // Hole das nächste Element aus dem gewählten Array
            const currentArray = nonEmptyArrays[arrayIndex];
            const elementIndex = indices[arrayIndex] % currentArray.length;

            result.push(currentArray[elementIndex]);
            indices[arrayIndex]++;
        }

        return result;
    }
}
