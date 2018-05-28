// Import interfaces.
import { IPeople } from './people.interface';

// Interface for films stored locally.
export interface ILocalFilm {
  id: number; // Episode ID.
  title: string; // Film title.
  url: string; // Film URL.
  rawCharacters: string[]; // Characters URL.
  characters: IPeople[]; // Characters list of current film.
}
