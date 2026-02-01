import { Component } from '@angular/core';
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
export class GameSetupComponent {
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
