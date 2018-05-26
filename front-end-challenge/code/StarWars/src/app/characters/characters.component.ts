// Angular modules.
import { ActivatedRoute, Router, RouterLinkActive } from '@angular/router';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss']
})
export class CharactersComponent implements OnDestroy, OnInit {

  // Class of current body.
  bodyClass: string = 'characters_page';

  // Constructor method.
  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute
  ) {

    // Change <body> class.
    this.renderer.addClass(document.body, this.bodyClass);

    // Get item ID from route parameters.
    this.route.params.subscribe(params => {

      // Get product ID.
      if (params['id']) {

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

}
