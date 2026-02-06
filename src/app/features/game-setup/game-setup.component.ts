import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Category, GameService, Player } from 'src/app/core';
import { CATEGORIES } from 'src/app/core/data/categories.data';
import { GameConfig, GameSize, GAME_SIZE_CONFIG } from 'src/app/core/models/game-config.model';


@Component({
  selector: 'app-game-setup',
  templateUrl: './game-setup.component.html',
  styleUrls: ['./game-setup.component.scss']
})
export class GameSetupComponent implements OnInit {
  availableCategories: Category[] = CATEGORIES;
  gameForm = new FormGroup({
    players: new FormArray([
      new FormControl('', Validators.required),
      new FormControl('', Validators.required),
    ]),
    gameSize: new FormControl<GameSize>('medium', Validators.required),
    categories: new FormControl<Category[]>([], Validators.required),
  });

  constructor(private router: Router, private gameService: GameService) { }

  ngOnInit(): void {
    this.loadSavedConfig();
  }

  /**
   * Loads existing game config and populates the form
   */
  private loadSavedConfig(): void {
    const savedConfig = this.gameService.getCurrentConfig();
    if (!savedConfig) {
      return;
    }

    // Populate players
    if (savedConfig.players && savedConfig.players.length > 0) {
      // Clear existing player fields
      this.players.clear();

      // Add a field for each saved player
      savedConfig.players.forEach(player => {
        this.players.push(new FormControl(player.name, Validators.required));
      });
    }

    // Determine game size from questionsPerPair
    const gameSize = this.getGameSizeFromConfig(savedConfig);
    if (gameSize) {
      this.gameForm.patchValue({ gameSize });
    }

    // Populate categories - match by ID
    if (savedConfig.selectedCategories && savedConfig.selectedCategories.length > 0) {
      const categoryIds = savedConfig.selectedCategories.map(c => c.id);
      const matchedCategories = this.availableCategories.filter(c => categoryIds.includes(c.id));
      this.gameForm.patchValue({ categories: matchedCategories });
    }
  }

  /**
   * Determines the game size based on questionsPerPair
   */
  private getGameSizeFromConfig(config: GameConfig): GameSize | null {
    for (const [size, sizeConfig] of Object.entries(GAME_SIZE_CONFIG)) {
      if (sizeConfig.questionsPerPair === config.questionsPerPair) {
        return size as GameSize;
      }
    }
    return null;
  }

  get players(): FormArray {
    return this.gameForm.get('players') as FormArray;
  }

  addPlayer() {
    this.players.push(new FormControl('', Validators.required));
  }

  removePlayer(index: number) {
    if (this.players.length > 2) {
      this.players.removeAt(index);
    }
  }

  startGame() {
    if (this.gameForm.invalid) {
      console.log(this.gameForm);
      return;
    }

    const { players, gameSize, categories } = this.gameForm.value;
    const sizeConfig = GAME_SIZE_CONFIG[gameSize!];

    const gameConfig: GameConfig = {
      players: players!
        .filter((name: string | null) => name?.trim())
        .map((name: string | null, index: number) => ({
          id: `player-${index + 1}`,
          name: name!.trim()
        })),
      questionsPerPair: sizeConfig.questionsPerPair,
      numberOfRounds: sizeConfig.pairingsPerGame,
      selectedCategories: categories!
    };

    this.gameService.createGame(gameConfig);
    return this.router.navigate(['/game-board']);
  }

  trackByIndex(index: number): number {
    return index;
  }

}
