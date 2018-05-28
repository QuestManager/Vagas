// Angular modules.
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, ObservableLike } from 'rxjs';

// Interfaces.
import { IFilm, IFilmBasic } from '_interfaces/film.interface';
import { IPeople } from '_interfaces/people.interface';

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

  tempCharacters: any[] = [];

  // Constructor method.
  constructor(private http: HttpClient) { }

  // Get API root.
  public getApiAddress(resource?: string): string {

    let address: string = this.api;

    switch (resource.toLowerCase()) {

      case 'films': address = this.apiFilms; break;
      case 'people': address = this.apiPeople; break;
      case 'planets': address = this.apiPlanets; break;
      case 'species': address = this.apiSpecies; break;
      case 'starships': address = this.apiStarships; break;
      case 'vehicles': address = this.apiVehicles; break;
      default: address = this.api;

    }

    return address;

  }

  // Get current films.
  public getAllFilms(): Observable<HttpResponse<any>> {

    return this.http.get<any>(this.apiFilms, { observe: 'response' });

  }

  // Get film data.
  public getFilm(url: string): Observable<HttpResponse<any>> {

    return this.http.get<any>(url, { observe: 'response' });

  }

  // Get all characters.
  public getCharacters(): Observable<HttpResponse<any>> {

    return this.http.get<any>(this.apiPeople, { observe: 'response' });

  }

  // Get characters for a film.
  public getFilmCharacters(episodeId: number): Observable<HttpResponse<any>> {

    return this.http.get<any>(this.apiFilms + episodeId, { observe: 'response' });

  }

  // Get character info.
  public getCharacter(url: string): Observable<HttpResponse<any>> {

    return this.http.get<any>(url, { observe: 'response' });

  }

  // Get homeworld info.
  public getHomeworld(url: string): Observable<HttpResponse<any>> {

    return this.http.get<any>(url, { observe: 'response' });

  }

  // Get species info.
  public getSpecies(url: string): Observable<HttpResponse<any>> {

    return this.http.get<any>(url, { observe: 'response' });

  }

  // Get vehicle info.
  public getVehicle(url: string): Observable<HttpResponse<any>> {

    return this.http.get<any>(url, { observe: 'response' });

  }

  // Get starship info.
  public getStarship(url: string): Observable<HttpResponse<any>> {

    return this.http.get<any>(url, {observe: 'response' });

  }

}
