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
    this.loadConfig();
  }

  /**
   * Creates a new game config and saves it
   */
  createGame(config: GameConfig): void {
    const configWithTimestamp = {
      ...config,
      createdAt: new Date()
    };

    this.storage.set(this.STORAGE_KEY, configWithTimestamp);
    this.gameConfigSubject.next(configWithTimestamp);

    console.log('Game Config saved:', configWithTimestamp);
  }

  /**
   * Loads the current game config from storage
   */
  loadConfig(): GameConfig | null {
    const config = this.storage.get<GameConfig>(this.STORAGE_KEY);
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
  clearConfig(): void {
    this.storage.remove(this.STORAGE_KEY);
    this.gameConfigSubject.next(null);
  }

  /**
   * Checks if an active game exists
   */
  hasActiveGame(): boolean {
    return this.storage.has(this.STORAGE_KEY);
  }

  /**
   * Generates player pairs based on config
   */
  generatePairs(players: Player[]): Array<[Player, Player]> {
    const pairs: Array<[Player, Player]> = [];

    for (let i = 0; i < players.length; i++) {
      for (let j = i + 1; j < players.length; j++) {
        pairs.push([players[i], players[j]]);
      }
    }

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
