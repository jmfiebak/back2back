import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GameSize } from 'src/app/core/models/game-config.model';


@Component({
  selector: 'app-game-setup',
  templateUrl: './game-setup.component.html',
  styleUrls: ['./game-setup.component.scss']
})
export class GameSetupComponent {
  gameForm = new FormGroup({
    players: new FormArray([
      new FormControl('', Validators.required),
      new FormControl('', Validators.required),

    ]),
    gameSize: new FormControl<GameSize>('medium', Validators.required),

  });
  players: string[] = ['', ''];
  questionsPerPair: number = 5;
  numberOfRounds: number = 3;

  questionsOptions = [5, 6, 7, 8, 9, 10];
  roundsOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(private router: Router) { }

  addPlayer() {
    this.players.push('');
  }

  removePlayer(index: number) {
    if (this.players.length > 2) {
      this.players.splice(index, 1);
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  isValid(): boolean {
    const validPlayers = this.players.filter(p => p.trim().length > 0);
    return validPlayers.length >= 2;
  }

  startGame() {
    if (!this.isValid()) {
      return;
    }

    const validPlayers = this.players.filter(p => p.trim().length > 0);

    const gameConfig = {
      players: validPlayers,
      questionsPerPair: this.questionsPerPair,
      numberOfRounds: this.numberOfRounds
    };

    console.log('Game Config:', gameConfig);
    this.router.navigate(['/game-board']);
  }
}
