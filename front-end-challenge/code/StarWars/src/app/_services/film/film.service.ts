// Angular modules.
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilmService {

  // Constructor method.
  constructor() { }

  // Get film ID based on his endpoint URL.
  public getFilmId(url: string): number {

    const split: string[] = url.split('/');
    return parseInt(split[split.length - 2], 10);

  }

}
