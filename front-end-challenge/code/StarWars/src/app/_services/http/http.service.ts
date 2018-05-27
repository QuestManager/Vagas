// Angular modules.
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaces.
import { IFilm, IFilmBasic } from '_interfaces/film.interface';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  // Endpoints.
  api: string = 'https://swapi.co/api/';
  apiFilms: string = this.api + 'films/';
  apiPeople: string = this.api + 'people/';
  apiPlanets: string = this.api + 'planets/';
  apiSpecies: string = this.api + 'species/';
  apiStarships: string = this.api + 'starships/';
  apiVehicles: string = this.api + 'vehicles/';

  // Constructor method.
  constructor(private http: HttpClient) { }

  // Get current films.
  public getFilmsFull(): Observable<HttpResponse<any>> {

    return this.http.get<any>(this.apiFilms, { observe: 'response' });

  }

  // Get all characters.
  public getCharacters(): Observable<HttpResponse<any>> {

    return this.http.get<any>(this.apiPeople, { observe: 'response' });

  }

  // Get characters for a film.
  public getFilmCharacters(episodeId: number): Observable<HttpResponse<any>> {

    return this.http.get<any>(this.apiFilms + episodeId, { observe: 'response' });

  }

}
