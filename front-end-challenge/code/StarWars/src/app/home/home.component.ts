// Angular modules.
import { ActivatedRoute, Router, RouterLinkActive } from '@angular/router';
import { animate, animateChild, query, state, style, transition, trigger } from '@angular/animations';
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

// Render page animation.
const transictionAnimation =

  trigger(
      'transictionAnimation', [
        transition(':enter', [
          query('*', [
            style({opacity: 0, 'margin-top': '100%'}),
            animate('200ms ease-in-out', style({opacity: 0.3, 'margin-top': '60%'})),
            animate('300ms ease-in-out', style({opacity: 0.6, 'margin-top': '30%'})),
            animate('400ms ease-in-out', style({opacity: 1, 'margin-top': 0})),
          ]),
          query('@progressBarAnimation', [
            animateChild()
          ])
        ]),
        transition(':leave', [
          style({top: '50%', opacity: 1}),
          animate('300ms', style({top: '0', opacity: 0}))
        ])
      ]
    );

// Transiction progress bar.
const progressBarAnimation =

  trigger(
    'progressBarAnimation', [
      transition(':enter', [
        style({opacity: 1}),
        animate('1200ms ease-in-out', style({opacity: 1, width: 0})),
        animate('5000ms ease-in-out', style({opacity: 1, width: '100%'})),
      ])
    ]
  );

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [enterAnimation, homeLinkAnimation, progressBarAnimation, transictionAnimation]
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
  allowTransiction: boolean = false;

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

  // Show previous film.
  public previousFilm(): void {

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

  }

  // Show next film.
  public nextFilm(): void {

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

  }

  // Show film presentation.
  public showPresentation(): void {

    // Show crawl text.
    this.presentationScreen = true;

    // Allow transiction.
    this.allowTransiction = true;

    // Go to characters page after crawl text.
    setTimeout(() => { this.beforeTransiction(); }, 40000);

  }

  // Return to home screen.
  public goToHome(): void {

    this.presentationScreen = false;
    this.onTransiction = false;
    this.allowTransiction = false;
    this.hideTooltip();

  }

  // Go to another page.
  public goToPage(page: string): void {

    switch (page.toLowerCase()) {

      case 'characters':
        this.router.navigate(['characters', this.activeFilm.episode_id]);
        break;

      default:
        this.goToHome();

    }

  }

  // Before transiction to characters page.
  public beforeTransiction(): void {

    if (this.allowTransiction) {

      // Change status.
      this.isLoading = false;
      this.presentationScreen = false;
      this.onTransiction = true;

      // Change container style.
      const container: HTMLElement = document.getElementById('crawl-container');
      container.classList.add('crawl-transiction');

      // Volume down.
      this.volumeDown();

    }

  }

  // Turn down audio volume.
  public volumeDown(level: number = 0.8): void {

    const audio: HTMLAudioElement = <HTMLAudioElement>document.getElementById('startwars_theme');
    audio.volume = level > 0 ? level : 0;

    if (audio.volume > 0) {

      setTimeout(() => { this.volumeDown(level - 0.2); }, 1500);

    } else {

      // Change page.
      setTimeout(() => { this.goToPage('characters'); }, 1000);

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

  // Skip crawl intro.
  public skipCrawl(): void {

    this.allowTransiction = false;
    this.volumeDown(0.4);

  }

  // Called when window is resized.
  public onResize(): void {

    // Generate background stars.
    setTimeout(() => { this.generateStars(); }, 100);

  }

}
