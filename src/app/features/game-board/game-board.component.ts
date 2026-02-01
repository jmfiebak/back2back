import { Component, OnInit } from '@angular/core';
import { GameConfig, GameService } from 'src/app/core';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {
  gameConfig: GameConfig | null = null;

  constructor(private gameService: GameService) {

  }

  ngOnInit(): void {
    this.gameConfig = this.gameService.getCurrentConfig();
    console.log(this.gameConfig);
  }
}
