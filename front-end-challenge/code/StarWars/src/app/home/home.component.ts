// Angular modules.
import { ActivatedRoute, Router, RouterLinkActive } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';

// Interfaces.
import { IFilm } from '_interfaces/film.interface';

// Services.
import { EffectsService } from '_services/effects/effects.service';
import { HttpService } from '_services/http/http.service';

// Render page animation.
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

// Transiction progress bar.
const progressBarAnimation =

  trigger(
    'progressBarAnimation', [
      transition(':enter', [
        style({opacity: 1}),
        animate('200ms ease-in-out', style({opacity: 1, width: 0})),
        animate('3000ms ease-in-out', style({opacity: 1, width: '100%'})),
      ])
    ]
  );

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [enterAnimation, homeLinkAnimation, progressBarAnimation]
})
export class HomeComponent implements OnDestroy, OnInit {

  // Movies related.
  activeFilm: IFilm;
  films: IFilm[] = [];

  // Body's class.
  bodyClass: string = 'page_intro';

  // Status.
  isLoading: boolean = false;
  presentationScreen: boolean = false;
  onTransiction: boolean = false;

  // Constructor method.
  constructor(
    private effects: EffectsService,
    private http: HttpService,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router
  ) {

    // Loader.
    this.isLoading = true;

    // Reference for this.
    // const _t: any = this;

    // Change <body> class.
    this.renderer.addClass(document.body, this.bodyClass);

    // Generate background stars.
    this.generateStars();

    this.http.getFilmsFull().subscribe(
      res => {

        // this.films = {...<IFilm>res.body.results};
        res.body.results.forEach((item) => {
          this.films.push(<IFilm>item);
        });
        this.films.sort((a, b) => a.episode_id - b.episode_id).slice();
        this.activeFilm = this.films[0];

        // Loader.
        this.isLoading = false;

      },
      err => {

        // Show error.
        alert('Erro ao carregar os filmes');
        console.log(err);

      }
    );

  }

  // When component is destroyed.
  public ngOnDestroy() {

    // Remove class from <body>.
    this.renderer.removeClass(document.body, this.bodyClass);

  }

  // When component inits.
  public ngOnInit() {}

  // Generate background stars.
  public generateStars(): void {

    this.effects.configBgStars();

  }

  // Called when window is resized.
  public onResize(): void {

    // Generate background stars.
    setTimeout(() => { this.generateStars(); }, 100);

  }

}
