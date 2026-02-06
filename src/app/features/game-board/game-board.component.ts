import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GameSessionService, GameView } from 'src/app/core';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit, OnDestroy {
  gameView$: Observable<GameView | null>;

  private destroy$ = new Subject<void>();

  constructor(
    private sessionService: GameSessionService,
    private router: Router
  ) {
    this.gameView$ = this.sessionService.gameView$;
  }

  ngOnInit(): void {
    // Check if we have a valid session
    const currentSession = this.sessionService.getCurrentSession();
    if (!currentSession) {
      // Try to start a new session
      this.sessionService.startSession();

      // If still no session (no config), redirect to setup
      if (!this.sessionService.getCurrentSession()) {
        this.router.navigate(['/game-setup']);
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Called when user clicks to continue (dismiss pairing or question)
   */
  onContinue(): void {
    this.sessionService.next();
  }

  /**
   * Called when user wants to end the game and return to setup
   */
  onEndGame(): void {
    this.sessionService.endSession();
    this.router.navigate(['/game-setup']);
  }
}
