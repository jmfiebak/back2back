import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-spiel-erstellen',
  templateUrl: './spiel-erstellen.component.html',
  styleUrls: ['./spiel-erstellen.component.scss']
})
export class SpielErstellenComponent {
  players: string[] = ['', ''];
  questionsPerPair: number = 5;
  numberOfRounds: number = 3;
  // Optionen für Dropdowns
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
    // Mindestens 2 Spieler mit Namen
    const validPlayers = this.players.filter(p => p.trim().length > 0);
    return validPlayers.length >= 2;
  }

  startGame() {
    if (!this.isValid()) {
      return;
    }

    // Nur Spieler mit Namen behalten
    const validPlayers = this.players.filter(p => p.trim().length > 0);

    const gameConfig = {
      players: validPlayers,
      questionsPerPair: this.questionsPerPair,
      numberOfRounds: this.numberOfRounds
    };

    console.log('Game Config:', gameConfig);

    // Später: Navigation zur Game-Page mit Config
    // this.router.navigate(['/game'], { state: { config: gameConfig } });

    alert('Spiel wird gestartet!\n\n' + JSON.stringify(gameConfig, null, 2));
  }
}
