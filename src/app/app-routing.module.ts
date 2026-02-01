import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThemeTestComponent } from './theme-test/theme-test.component';
import { SpielErstellenComponent } from './spiel-erstellen/spiel-erstellen.component';
import { StartseiteComponent } from './startseite/startseite.component';
import { SpielbrettComponent } from './spielbrett/spielbrett.component';

const routes: Routes = [
  {
    path: '',
    component: StartseiteComponent
  },
  {
    path: 'theme-test',
    component: ThemeTestComponent
  },
  {
    path: 'spiel-erstellen',
    component: SpielErstellenComponent
  },
  {
    path: 'spielbrett',
    component: SpielbrettComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
