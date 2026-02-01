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
    // Start the game session when entering the game board
    this.sessionService.startSession();

    // Redirect if no game config exists
    this.gameView$.pipe(takeUntil(this.destroy$)).subscribe(view => {
      if (view === null && !this.sessionService.getCurrentSession()) {
        // No session could be started (no config) - redirect to setup
        this.router.navigate(['/game-setup']);
      }
    });
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
