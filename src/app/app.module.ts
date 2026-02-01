import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartseiteComponent } from './startseite/startseite.component';
import { SpielErstellenComponent } from './spiel-erstellen/spiel-erstellen.component';
import { ThemeTestComponent } from './theme-test/theme-test.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { SpielbrettComponent } from './spielbrett/spielbrett.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@NgModule({
  declarations: [
    AppComponent,
    StartseiteComponent,
    SpielErstellenComponent,
    ThemeTestComponent,
    SpielbrettComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CommonModule,

    // Material Modules
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatExpansionModule,
    MatButtonToggleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }