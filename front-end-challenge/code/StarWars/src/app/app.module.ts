// Angular modules.
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';

// Third-party components.
import { DragAndDropModule } from 'angular-draggable-droppable';

// Custom components.
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CharactersComponent } from './characters/characters.component';
import { NotfoundComponent } from './notfound/notfound.component';

// Custom pipes.
import { ArrayJoinPipe } from '_pipes/arrayjoin.pipe';
import { PersonHeightPipe } from '_pipes/personheight.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ArrayJoinPipe,
    HomeComponent,
    CharactersComponent,
    NotfoundComponent,
    PersonHeightPipe
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    DragAndDropModule.forRoot(),
    HttpClientModule
  ],
  providers: [HttpClientModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
