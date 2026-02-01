import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GameSetupComponent } from './game-setup.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  { path: '', component: GameSetupComponent }
];

@NgModule({
  declarations: [GameSetupComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class GameSetupModule { }
