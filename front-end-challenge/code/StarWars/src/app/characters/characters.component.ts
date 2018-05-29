// Angular modules.
import { ActivatedRoute, Router, RouterLinkActive } from '@angular/router';
import { animate, animateChild, query, state, style, transition, trigger } from '@angular/animations';
import { Component, OnChanges, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { nextTick } from 'q';

// Interfaces.
import { IFilm } from '_interfaces/film.interface';
import { ILocalFilm } from '_interfaces/localfilm.interface';
import { IPeople } from '_interfaces/people.interface';
import { IPlanet } from '_interfaces/planet.interface';
import { ISpecies } from '_interfaces/species.interface';
import { IStarship } from '_interfaces/starship.interface';
import { IVehicle } from '_interfaces/vehicle.interface';

// Services.
import { FilmService } from '_services/film/film.service';
import { HttpService } from '_services/http/http.service';

// Render generic animation.
const enterAnimation =

  trigger(
    'enterAnimation', [
      transition(':enter', [
        style({opacity: 0, 'margin-top': '100%'}),
        animate('200ms ease-in-out', style({opacity: 0.3, 'margin-top': '50%'})),
        animate('500ms ease-in-out', style({opacity: 1, 'margin-top': 0})),
      ]),
      transition(':leave', [
        style({top: '50%', opacity: 1}),
        animate('300ms', style({top: '0', opacity: 0}))
      ])
    ]
  );

// Characters details.
const charDetailsAnimation =

  trigger(
    'charDetailsAnimation', [
      transition(':enter', [
        style({opacity: 0}),
        animate('200ms ease-in-out', style({opacity: 0.3})),
        animate('500ms ease-in-out', style({opacity: 1})),
      ]),
      transition(':leave', [
        style({top: '0', opacity: 1}),
        animate('300ms', style({opacity: 0.5, marginTop: '-300px'}))
      ])
    ]
  );

// Render content animation.
const contentAnimation =

  trigger(
    'contentAnimation', [
      transition(':enter', [
        style({opacity: 0}),
        animate('500ms', style({opacity: 1})),
      ]),
      transition(':leave', [
        style({opacity: 1}),
        animate('300ms', style({opacity: 0}))
      ])
    ]
  );

// Show link to home.
const homeLinkAnimation =

  trigger(
    'homeLinkAnimation', [
      transition(':enter', [
        style({opacity: 0, 'margin-top': '100%'}),
        animate('200ms ease-in-out', style({opacity: 0.3, 'margin-top': '-50%'})),
        animate('500ms ease-in-out', style({opacity: 1, 'margin-top': 0})),
      ]),
      transition(':leave', [
        style({top: '0', opacity: 1}),
        animate('300ms', style({top: '-50%', opacity: 0}))
      ])
    ]
  );

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss'],
  animations: [enterAnimation, charDetailsAnimation, contentAnimation, homeLinkAnimation]
})
export class CharactersComponent implements OnChanges, OnDestroy, OnInit {

  // Class of current body.
  bodyClass: string = 'characters_page';

  // Movie related.
  lastId: number;
  filmId: number;
  activeFilm: IFilm;
  films: IFilm[] = [];
  rawCharacters: string[] = [];
  characters: IPeople[] = [];

  // Drag and drop related.
  droppedData: string;
  dropOverActive: boolean = false;
  selCharacters: IPeople[] = [];
  nextZindex: number = 1200;

  // Mobile only related.
  selCharacterMobile: IPeople;

  // Status.
  isLoading: boolean = false;
  charsToLoad: number = 0;
  charsLoaded: number = 1;
  loadHomeworld: boolean = false;
  loadSpecies: boolean = false;
  loadFilms: boolean = false;
  loadVehicles: boolean = false;
  loadStarships: boolean = false;
  waitingForCharData: boolean = false;

  // Constructor method.
  constructor(
    private filmService: FilmService,
    private http: HttpService,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router
  ) {

    // Loader.
    this.isLoading = true;

    // Change <body> class.
    this.renderer.addClass(document.body, this.bodyClass);

    // Get item ID from route parameters.
    this.route.params.subscribe(params => {

      // Get film ID.
      if (params['id']) {

        // Store film ID.
        this.filmId = parseInt(params['id'], 10);

        this.getAllData();

      }

    });

  }

  // On changes.
  public ngOnChanges() {

    if (this.filmId !== this.lastId) {
      this.isLoading = true;
      this.getAllData();
    }

  }

  // When component is destroyed.
  public ngOnDestroy() {

    // Remove class from <body>.
    this.renderer.removeClass(document.body, this.bodyClass);

  }

  // On init.
  ngOnInit() {}

  // Get all data.
  private getAllData(): void {

    // Clear previous data.
    this.activeFilm = null;
    this.films = [];
    this.rawCharacters = [];
    this.characters = [];
    this.selCharacters = [];
    this.charsToLoad = 0;
    this.charsLoaded = 1;

    // Search for local films list.
    let filmsFoundLocally: boolean = false;
    const localFilmsStr: string = localStorage.getItem('home_movies');

    if (localFilmsStr) {

      this.films = JSON.parse(localFilmsStr);
      this.films.forEach(item => {
        if (this.filmId === this.filmService.getFilmId(item.url)) {
          this.activeFilm = item;
          return;
        }
      });
      filmsFoundLocally = true;

    }

    // Search for local current film data.
    let movieFoundLocally: boolean = false;
    const localMoviesStr: string = localStorage.getItem('movies_data');

    if (localMoviesStr) {

      const localMovies: ILocalFilm[] = JSON.parse(localMoviesStr);

      localMovies.forEach(item => {

        if (item.id === this.activeFilm.episode_id) {

          this.rawCharacters = item.rawCharacters || [];
          this.characters = item.characters || [];
          this.selCharacters = item.selCharacters || [];
          this.activeFilm = <IFilm>{
            episode_id: item.id,
            title: item.title,
            url: item.url
          };

          // Update last ID.
          this.lastId = this.filmId;

          // Movie is found.
          movieFoundLocally = true;

        }

      });

      if (filmsFoundLocally && movieFoundLocally) {

        // Get all characters data.
        if (this.characters.length === 0) {
          this.getCharactersData();
        } else {
          this.isLoading = false;
        }

      }

    }

    if (!filmsFoundLocally) {

      // Get all films.
      this.http.getAllFilms().subscribe(
        result => {

          // this.films = {...<IFilm>res.body.results};
          result.body.results.forEach((item) => {
            this.films.push(<IFilm>item);
          });
          this.films.sort((a, b) => a.episode_id - b.episode_id).slice();

        },
        error => {

          // Show error.
          alert('Search films error');
          console.log(error);

          // Loader.
          this.isLoading = false;

        }
      );

    }

    if (!movieFoundLocally) {

      // Get film data.
      this.http.getFilmCharacters(this.filmId).subscribe(
        res => {

          // Store film data.
          this.activeFilm = <IFilm>res.body;

          // Store characters of current film.
          this.rawCharacters = this.activeFilm.characters;
          this.charsToLoad = this.rawCharacters.length;

          // Update last ID.
          this.lastId = this.filmId;

          // Store locally.
          const mv = <ILocalFilm>{
            id: this.activeFilm.episode_id,
            title: this.activeFilm.title,
            url: this.activeFilm.url,
            rawCharacters: this.rawCharacters,
            characters: [],
            selCharacters: []
          };

          let lMovies: ILocalFilm[] = [];
          if (localMoviesStr) {
            lMovies = JSON.parse(localMoviesStr);
            lMovies.push(mv);
          } else {
            lMovies.push(mv);
          }

          localStorage.setItem('movies_data', JSON.stringify(lMovies));

          // Get all characters data.
          this.getCharactersData();

        },
        err => {

          // Show error.
          alert('Search film error.');
          console.log(err);

          // Loader.
          this.isLoading = false;

        }
      );

    }

  }

  // Get data of current film characters.
  private getCharactersData(): void {

    if (this.rawCharacters.length > 0) {

      this.http.getCharacter(this.rawCharacters[0]).subscribe(
        result => {

          // Store character.
          this.characters.push(<IPeople>result.body);

          // Remove item from raw list.
          this.rawCharacters.shift();

          // Increment total loaded.
          this.charsLoaded++;

          // Get next character data.
          this.getCharactersData();

        },
        error => {

          // Show error.
          alert('Error while searching character');
          console.log(error);

        }
      );

    } else {

      const localFilmsStr: string = localStorage.getItem('movies_data');

      if (localFilmsStr) {

        const localMovies: ILocalFilm[] = JSON.parse(localFilmsStr);

        localMovies.forEach((item, index) => {

          if (item.id === this.activeFilm.episode_id) {
            localMovies[index].characters = this.characters;
            localStorage.setItem('movies_data', JSON.stringify(localMovies));
            return;
          }

        });

      }

      // Loader.
      this.isLoading = false;

    }

  }

  // Show tooltip.
  public showTooltip() {

    // Get tooltip element.
    const tooltip: HTMLElement = document.getElementById('tooltipo-home');

    // Configure position and show it.
    tooltip.style.left = '55px';
    tooltip.style.top = '17px';
    tooltip.style.visibility = 'visible';

  }

  // Hide tooltip.
  public hideTooltip() {

    // Get tooltip element and hide it.
    const tooltip: HTMLElement = document.getElementById('tooltipo-home');
    tooltip.style.visibility = 'hidden';

  }

  // Show previous film.
  public previousFilm(): void {

    // Loader.
    this.isLoading = true;

    // Current episode ID.
    const curId: number = this.activeFilm.episode_id;

    // List length.
    const listLen: number = this.films.length;

    // Get and select previous.
    for (let i = 0; i < listLen; i++) {
      if (this.films[i].episode_id === curId) {
        this.activeFilm = i === 0 ? this.films[listLen - 1] : this.films[i - 1];
        break;
      }
    }

    // Go to previous film.
    const nextId: number = this.filmService.getFilmId(this.activeFilm.url);
    this.router.navigate(['characters', nextId]);

  }

  // Show next film.
  public nextFilm(): void {

    // Loader.
    this.isLoading = true;

    // Current episode ID.
    const curId: number = this.activeFilm.episode_id;

    // List length.
    const listLen: number = this.films.length;

    // Get and select previous.
    for (let i = 0; i < listLen; i++) {
      if (this.films[i].episode_id === curId) {
        this.activeFilm = i === (listLen - 1) ? this.films[0] : this.films[i + 1];
        break;
      }
    }

    // Go to next film.
    const nextId: number = this.filmService.getFilmId(this.activeFilm.url);
    this.router.navigate(['characters', nextId]);

  }

  // When a draggable element is dropped.
  public dragEnd(event): void {

    // console.log(this.droppedData);

  }

  // When a droppable element receive an item.
  public dropped(data: any): void {

    // Get dropped item.
    this.droppedData = data;

    // Add dropped item to selected list if isn't already selected.
    if (this.selCharacters.filter((x) => x.url === this.droppedData ).length === 0) {

      // Add item to selected list.
      this.selCharacters.unshift(this.characters.filter((c) => c.url === this.droppedData)[0]);

      // Get all character's data.
      this.getAllCharactersData(this.selCharacters[0]);

      // Change list item style and attributes.
      const listItem: HTMLElement = document.getElementById(this.droppedData);
      listItem.classList.add('selectedCharItem');
      listItem.removeAttribute('mwlDraggable');

      // Set drop over as inactive.
      this.dropOverActive = false;

      setTimeout(() => {

        // Change new item details styles and attributes.
        const detailsItem: HTMLElement = document.getElementById('details-' + this.droppedData);
        detailsItem.style.zIndex = (this.nextZindex).toString();

        // Increase next z-index value.
        this.nextZindex++;

        // Remove dropped data.
        this.droppedData = null;

      }, 100);

    }

  }

  // When a character is selected on mobile.
  public mobileSelect(url: string): void {

    this.selCharacterMobile = null;
    this.selCharacterMobile = this.characters.filter(x => x.url === url)[0];

    // Get all character's data.
    this.getAllCharactersData(this.selCharacterMobile, true);

  }

  // Remove a selected item.
  public removeItem(item: string): void {

    // Get index of selected item and remove it from list.
    const index: number = this.selCharacters.findIndex((c) => c.url === item);
    if (index > -1) {
      this.selCharacters.splice(index, 1);
    }

    // Change list item style and attributes.
    const listItem: HTMLElement = document.getElementById(item);
    listItem.classList.remove('selectedCharItem');
    listItem.setAttribute('mwlDraggable', '');

    // Remove from storage.
    const localMovieData: string = localStorage.getItem('movies_data');
    if (localMovieData) {

      const localMovies: ILocalFilm[] = JSON.parse(localMovieData);
      localMovies.forEach((el, ind) => {
        if (el.id === this.activeFilm.episode_id) {
          const localMovie: ILocalFilm = el;
          localMovies.splice(ind, 1);
          localMovie.selCharacters = this.selCharacters;
          localMovies.push(localMovie);
          localStorage.setItem('movies_data', JSON.stringify(localMovies));
          this.waitingForCharData = false;
        }
      });

    }

    // Decrease next z-index value.
    this.nextZindex--;

  }

  // Load characters data.
  private getAllCharactersData(char: IPeople, isMobile: boolean = false): void {

    this.waitingForCharData = true;

    // Get homeworld.
    if (char.homeworld) {
      this.getHomeworld(char, isMobile);
    } else {
      char.homeworld = 'N/A';
      char.loadedHomeworld = true;
    }

    // Get species.
    if (char.species.length > 0) {
      this.getSpecies(char, isMobile);
    } else {
      char.species.push('N/A');
      char.loadedSpecies = true;
    }

    // Get films.
    if (char.films.length > 0) {
      this.getFilms(char, isMobile);
    } else {
      char.films.push('N/A');
      char.loadedFilms = true;
    }

    // Get vehicles.
    if (char.vehicles.length > 0) {
      this.getVehicles(char, isMobile);
    } else {
      char.vehicles.push('N/A');
      char.loadedVehicles = true;
    }

    // Get starships.
    if (char.starships.length > 0) {
      this.getStarships(char, isMobile);
    } else {
      char.starships.push('N/A');
      char.loadedStarships = true;
    }

  }

  // Store locally character data.
  private storeCharacterData(char: IPeople): void {

    if (
      this.waitingForCharData &&
      char.loadedFilms &&
      char.loadedHomeworld &&
      char.loadedSpecies &&
      char.loadedStarships &&
      char.loadedVehicles
    ) {

      const localMovieData: string = localStorage.getItem('movies_data');

      if (localMovieData) {

        const localMovies: ILocalFilm[] = JSON.parse(localMovieData);
        localMovies.forEach((item, index) => {
          if (item.id === this.activeFilm.episode_id) {
            const localMovie: ILocalFilm = item;
            localMovies.splice(index, 1);
            localMovie.selCharacters = this.selCharacters;
            localMovies.push(localMovie);
            localStorage.setItem('movies_data', JSON.stringify(localMovies));
            this.waitingForCharData = false;
          }
        });

      }

    } else {

      setTimeout(() => {
        if (this.waitingForCharData) {
          this.storeCharacterData(char);
        }
      }, 1000);

    }

  }

  // Get homeworld data.
  private getHomeworld(char: IPeople, isMobile: boolean = false): void {

    this.http.getHomeworld(char.homeworld).subscribe(
      result => {

        // Store planet data.
        const planet: IPlanet = <IPlanet>result.body;

        // Update character value.
        if (isMobile) {

          this.selCharacterMobile.homeworld = planet.name;
          this.selCharacterMobile.loadedHomeworld = true;
          this.storeCharacterData(char);

        } else {

          for (let i = 0; i < this.selCharacters.length; i++) {
            if (this.selCharacters[i].url === char.url) {
              this.selCharacters[i].homeworld = planet.name;
              this.selCharacters[i].loadedHomeworld = true;
              this.storeCharacterData(char);
              return;
            }
          }

        }

      },
      error => {

        // Show error.
        alert('Error while searching homeworld');
        console.log(error);

      }
    );

  }

  // Get species data.
  private getSpecies(char: IPeople, isMobile: boolean = false, list?: string[]): void {

    // Initialize list if none.
    list = list || [];

    this.http.getSpecies(char.species[0]).subscribe(
      result => {

        // Get current value.
        const curValue: ISpecies = <ISpecies>result.body;

        // Store current value.
        list.push(curValue.name);

        // Remove current from waiting list.
        char.species.shift();

        if (char.species.length > 0) {

          this.getSpecies(char, isMobile, list);

        } else {

          // Update character value.
          if (isMobile) {

            this.selCharacterMobile.species = list;
            this.selCharacterMobile.loadedSpecies = true;
            this.storeCharacterData(char);

          } else {

            for (let i = 0; i < this.selCharacters.length; i++) {
              if (this.selCharacters[i].url === char.url) {
                this.selCharacters[i].species = list;
                this.selCharacters[i].loadedSpecies = true;
                this.storeCharacterData(char);
                return;
              }
            }

          }

        }

      },
      error => {

        // Show error.
        alert('Error while searching species');
        console.log(error);

      }
    );

  }

  // Get films data.
  private getFilms(char: IPeople, isMobile: boolean = false, list?: string[]): void {

    // Initialize list if none.
    list = list || [];

    this.http.getFilm(char.films[0]).subscribe(
      result => {

        // Get current value.
        const curValue: IFilm = <IFilm>result.body;

        // Store current value.
        const year: number = new Date(curValue.release_date).getFullYear();
        const episode: string = this.filmService.getRomanNumeral(curValue.episode_id);
        list.push('(' + year + ') ' + episode + ' - ' + (curValue.title).replace(',', ''));

        // Remove current from waiting list.
        char.films.shift();

        if (char.films.length > 0) {

          this.getFilms(char, isMobile, list);

        } else {

          list.sort();

          // Update character value.
          if (isMobile) {

            this.selCharacterMobile.films = list;
            this.selCharacterMobile.loadedFilms = true;
            this.storeCharacterData(char);

          } else {

            for (let i = 0; i < this.selCharacters.length; i++) {
              if (this.selCharacters[i].url === char.url) {
                this.selCharacters[i].films = list;
                this.selCharacters[i].loadedFilms = true;
                this.storeCharacterData(char);
                return;
              }
            }

          }

        }

      },
      error => {

        // Show error.
        alert('Error while searching films');
        console.log(error);

      }
    );

  }

  // Get vechicles data.
  private getVehicles(char: IPeople, isMobile: boolean = false, list?: string[]): void {

    // Initialize list if none.
    list = list || [];

    this.http.getVehicle(char.vehicles[0]).subscribe(
      result => {

        // Get current value.
        const curValue: IVehicle = <IVehicle>result.body;

        // Store current value.
        list.push(curValue.name);

        // Remove current from waiting list.
        char.vehicles.shift();

        if (char.vehicles.length > 0) {

          this.getVehicles(char, isMobile, list);

        } else {

          // Update character value.
          if (isMobile) {

            this.selCharacterMobile.vehicles = list;
            this.selCharacterMobile.loadedVehicles = true;
            this.storeCharacterData(char);

          } else {

            for (let i = 0; i < this.selCharacters.length; i++) {
              if (this.selCharacters[i].url === char.url) {
                this.selCharacters[i].vehicles = list;
                this.selCharacters[i].loadedVehicles = true;
                this.storeCharacterData(char);
                return;
              }
            }

          }

        }

      },
      error => {

        // Show error.
        alert('Error while searching vehicles');
        console.log(error);

      }
    );

  }

  // Get starships data.
  private getStarships(char: IPeople, isMobile: boolean = false, list?: string[]): void {

    // Initialize list if none.
    list = list || [];

    this.http.getStarship(char.starships[0]).subscribe(
      result => {

        // Get current value.
        const curValue: IStarship = <IStarship>result.body;

        // Store current value.
        list.push(curValue.name);

        // Remove current from waiting list.
        char.starships.shift();

        if (char.starships.length > 0) {

          this.getStarships(char, isMobile, list);

        } else {

          // Update character value.
          if (isMobile) {

            this.selCharacterMobile.starships = list;
            this.selCharacterMobile.loadedStarships = true;
            this.storeCharacterData(char);

          } else {

            for (let i = 0; i < this.selCharacters.length; i++) {
              if (this.selCharacters[i].url === char.url) {
                this.selCharacters[i].starships = list;
                this.selCharacters[i].loadedStarships = true;
                this.storeCharacterData(char);
                return;
              }
            }

          }

        }

      },
      error => {

        // Show error.
        alert('Error while searching starships');
        console.log(error);

      }
    );

  }

  // Return to home screen.
  public goToHome(): void {

    this.router.navigate(['']);

  }

}
