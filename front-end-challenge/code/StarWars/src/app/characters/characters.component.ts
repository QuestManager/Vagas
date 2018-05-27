// Angular modules.
import { ActivatedRoute, Router, RouterLinkActive } from '@angular/router';
import { animate, animateChild, query, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';

// Interfaces.
import { IPeople } from '_interfaces/people.interface';

// Services.
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

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss'],
  animations: [enterAnimation, homeLinkAnimation]
})
export class CharactersComponent implements OnDestroy, OnInit {

  // Class of current body.
  bodyClass: string = 'characters_page';

  // Movie related.
  filmeId: number;
  characters: IPeople[] = [];

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

      // Get product ID.
      if (params['id']) {

        this.filmeId = parseInt(params['id'], 10);

        this.http.getCharacters().subscribe(
          res => {

            console.log(res.body.result);
            res.body.results.forEach((item) => {
              this.characters.push(<IPeople>item);
            });
            console.log(this.characters);
            this.isLoading = false;

          },
          err => {

            alert('Search error.');
            console.log(err);
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

  // Return to home screen.
  public goToHome(): void {

    this.router.navigate(['']);

  }

}
