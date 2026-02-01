import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameConfig, Player } from '../models';
import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root'
})
export class GameService {
    private readonly STORAGE_KEY = 'current_game_config';

    private gameConfigSubject = new BehaviorSubject<GameConfig | null>(null);
    public gameConfig$: Observable<GameConfig | null> = this.gameConfigSubject.asObservable();

    constructor(private storage: StorageService) {
        // Beim Start: Lade gespeicherte Config (falls vorhanden)
        this.loadConfig();
    }

    /**
     * Erstellt eine neue Game Config und speichert sie
     */
    createGame(config: GameConfig): void {
        const configWithTimestamp = {
            ...config,
            createdAt: new Date()
        };

        this.storage.set(this.STORAGE_KEY, configWithTimestamp);
        this.gameConfigSubject.next(configWithTimestamp);

        console.log('Game Config gespeichert:', configWithTimestamp);
    }

    /**
     * Lädt die aktuelle Game Config aus dem Storage
     */
    loadConfig(): GameConfig | null {
        const config = this.storage.get<GameConfig>(this.STORAGE_KEY);
        this.gameConfigSubject.next(config);
        return config;
    }

    /**
     * Gibt die aktuelle Game Config zurück (synchron)
     */
    getCurrentConfig(): GameConfig | null {
        return this.gameConfigSubject.value;
    }

    /**
     * Löscht die aktuelle Game Config
     */
    clearConfig(): void {
        this.storage.remove(this.STORAGE_KEY);
        this.gameConfigSubject.next(null);
    }

    /**
     * Prüft ob ein aktives Spiel existiert
     */
    hasActiveGame(): boolean {
        return this.storage.has(this.STORAGE_KEY);
    }

    /**
     * Generiert Spielerpaare basierend auf Config
     */
    generatePairs(players: Player[]): Array<[Player, Player]> {
        const pairs: Array<[Player, Player]> = [];

        for (let i = 0; i < players.length; i++) {
            for (let j = i + 1; j < players.length; j++) {
                pairs.push([players[i], players[j]]);
            }
        }

        // Zufällig mischen
        return this.shuffleArray(pairs);
    }

    /**
     * Fisher-Yates Shuffle
     */
    private shuffleArray<T>(array: T[]): T[] {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}