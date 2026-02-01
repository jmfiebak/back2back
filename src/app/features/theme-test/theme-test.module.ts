import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ThemeTestComponent } from './theme-test.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  { path: '', component: ThemeTestComponent }
];

@NgModule({
  declarations: [ThemeTestComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class ThemeTestModule { }
