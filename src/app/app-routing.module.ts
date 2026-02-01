import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'game-setup',
    loadChildren: () => import('./features/game-setup/game-setup.module').then(m => m.GameSetupModule)
  },
  {
    path: 'game-board',
    loadChildren: () => import('./features/game-board/game-board.module').then(m => m.GameBoardModule)
  },
  {
    path: 'theme-test',
    loadChildren: () => import('./features/theme-test/theme-test.module').then(m => m.ThemeTestModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
