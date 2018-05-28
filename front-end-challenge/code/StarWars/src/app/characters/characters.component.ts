// Angular modules.
import { ActivatedRoute, Router, RouterLinkActive } from '@angular/router';
import { animate, animateChild, query, state, style, transition, trigger } from '@angular/animations';
import { Component, OnChanges, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { nextTick } from 'q';

// Interfaces.
import { IFilm } from '_interfaces/film.interface';
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

  // Status.
  isLoading: boolean = false;
  charsToLoad: number = 0;
  charsLoaded: number = 1;
  loadHomeworld: boolean = false;
  loadSpecies: boolean = false;
  loadFilms: boolean = false;
  loadVehicles: boolean = false;
  loadStarships: boolean = false;

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
    this.charsToLoad = 0;
    this.charsLoaded = 1;

    // Get all films.
    this.http.getAllFilms().subscribe(
      result => {

        // this.films = {...<IFilm>res.body.results};
        result.body.results.forEach((item) => {
          this.films.push(<IFilm>item);
        });
        this.films.sort((a, b) => a.episode_id - b.episode_id).slice();

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

      },
      error => {

        // Show error.
        alert('Search films error');
        console.log(error);

      }
    );

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
    console.log(this.selCharacters);

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

    // Decrease next z-index value.
    this.nextZindex--;

  }

  // Load characters data.
  private getAllCharactersData(char: IPeople): void {

    // Get homeworld.
    if (char.homeworld) {
      this.getHomeworld(char);
    } else {
      char.homeworld = 'N/A';
      char.loadedHomeworld = true;
    }

    // Get species.
    if (char.species.length > 0) {
      this.getSpecies(char);
    } else {
      char.species.push('N/A');
      char.loadedSpecies = true;
    }

    // Get films.
    if (char.films.length > 0) {
      this.getFilms(char);
    } else {
      char.films.push('N/A');
      char.loadedFilms = true;
    }

    // Get vehicles.
    if (char.vehicles.length > 0) {
      this.getVehicles(char);
    } else {
      char.vehicles.push('N/A');
      char.loadedVehicles = true;
    }

    // Get starships.
    if (char.starships.length > 0) {
      this.getStarships(char);
    } else {
      char.starships.push('N/A');
      char.loadedStarships = true;
    }

  }

  // Get homeworld data.
  private getHomeworld(char: IPeople): void {

    this.http.getHomeworld(char.homeworld).subscribe(
      result => {

        // Store planet data.
        const planet: IPlanet = <IPlanet>result.body;

        // Update character value.
        for (let i = 0; i < this.selCharacters.length; i++) {
          if (this.selCharacters[i].url === char.url) {
            this.selCharacters[i].homeworld = planet.name;
            this.selCharacters[i].loadedHomeworld = true;
            return;
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
  private getSpecies(char: IPeople, list?: string[]): void {

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

          this.getSpecies(char, list);

        } else {

          // Update character value.
          for (let i = 0; i < this.selCharacters.length; i++) {
            if (this.selCharacters[i].url === char.url) {
              this.selCharacters[i].species = list;
              this.selCharacters[i].loadedSpecies = true;
              return;
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
  private getFilms(char: IPeople, list?: string[]): void {

    // Initialize list if none.
    list = list || [];

    this.http.getFilm(char.films[0]).subscribe(
      result => {

        // Get current value.
        const curValue: IFilm = <IFilm>result.body;

        // Store current value.
        list.push(curValue.title);

        // Remove current from waiting list.
        char.films.shift();

        if (char.films.length > 0) {

          this.getFilms(char, list);

        } else {

          // Update character value.
          for (let i = 0; i < this.selCharacters.length; i++) {
            if (this.selCharacters[i].url === char.url) {
              this.selCharacters[i].films = list;
              this.selCharacters[i].loadedFilms = true;
              return;
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
  private getVehicles(char: IPeople, list?: string[]): void {

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

          this.getVehicles(char, list);

        } else {

          // Update character value.
          for (let i = 0; i < this.selCharacters.length; i++) {
            if (this.selCharacters[i].url === char.url) {
              this.selCharacters[i].vehicles = list;
              this.selCharacters[i].loadedVehicles = true;
              return;
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
  private getStarships(char: IPeople, list?: string[]): void {

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

          this.getStarships(char, list);

        } else {

          // Update character value.
          for (let i = 0; i < this.selCharacters.length; i++) {
            if (this.selCharacters[i].url === char.url) {
              this.selCharacters[i].starships = list;
              this.selCharacters[i].loadedStarships = true;
              return;
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
