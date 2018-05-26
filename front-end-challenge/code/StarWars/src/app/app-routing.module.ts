// Angular modules.
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Custom components.
import { CharactersComponent } from './characters/characters.component';
import { HomeComponent } from './home/home.component';
import { NotfoundComponent } from './notfound/notfound.component';

// Routes config.
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'characters/:id', component: CharactersComponent },
  { path: '**', component: NotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
