import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GameBoardComponent } from './game-board.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  { path: '', component: GameBoardComponent }
];

@NgModule({
  declarations: [GameBoardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class GameBoardModule { }
