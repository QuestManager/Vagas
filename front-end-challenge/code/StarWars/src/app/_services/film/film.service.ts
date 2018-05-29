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

  // Get episode number in roman format.
  public getRomanNumeral(episode: number): string {

    let roman: string;

    switch (episode) {

      case 1: roman = 'I'; break;
      case 2: roman = 'II'; break;
      case 3: roman = 'III'; break;
      case 4: roman = 'IV'; break;
      case 5: roman = 'V'; break;
      case 6: roman = 'VI'; break;
      case 7: roman = 'VII'; break;
      case 8: roman = 'VIII'; break;
      case 9: roman = 'IX'; break;
      case 10: roman = 'X'; break;
      case 11: roman = 'XI'; break;
      case 12: roman = 'XII'; break;
      case 13: roman = 'XIII'; break;
      case 14: roman = 'XIV'; break;
      case 15: roman = 'XV'; break;
      case 16: roman = 'XVI'; break;
      case 17: roman = 'XVII'; break;
      case 18: roman = 'XVIII'; break;
      case 19: roman = 'XIX'; break;
      case 20: roman = 'XX'; break;
      default: roman = episode.toString();

    }

    return roman;

  }

}
