// Angular modules.
import { ActivatedRoute, Router, RouterLinkActive } from '@angular/router';
import { animate, animateChild, query, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';

// Interfaces.
import { IFilm } from '_interfaces/film.interface';
import { IPeople } from '_interfaces/people.interface';

// Services.
import { HttpService } from '_services/http/http.service';
import { nextTick } from 'q';

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
export class CharactersComponent implements OnDestroy, OnInit {

  // Class of current body.
  bodyClass: string = 'characters_page';

  // Movie related.
  filmeId: number;
  film: IFilm;
  characters: IPeople[] = [];

  // Drag and drop related.
  droppedData: string;
  dropOverActive: boolean = false;
  selCharacters: IPeople[] = [];
  nextZindex: number = 1200;

  // Status.
  isLoading: boolean = false;

  // Constructor method.
  constructor(
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
        this.filmeId = parseInt(params['id'], 10);

        // Get film data.
        this.http.getFilmCharacters(this.filmeId).subscribe(
          result => {

            // Store film data.
            this.film = <IFilm>result.body;
            console.log(this.film);

            // Get all characters.
            this.http.getCharacters().subscribe(
              res => {

                // Store items.
                res.body.results.forEach((item) => {
                  this.characters.push(<IPeople>item);
                });

                // Loader.
                this.isLoading = false;

              },
              err => {

                // Show error.
                alert('Search characters error.');
                console.log(err);

                // Loader.
                this.isLoading = false;

              }
            );

          },
          error => {

            // Show error.
            alert('Search film error.');
            console.log(error);

            // Loader.
            this.isLoading = false;

          }
        );

      }

    });

  }

  // When component is destroyed.
  public ngOnDestroy() {

    // Remove class from <body>.
    this.renderer.removeClass(document.body, this.bodyClass);

  }

  // On init.
  ngOnInit() {}

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

  // Return to home screen.
  public goToHome(): void {

    this.router.navigate(['']);

  }

}
