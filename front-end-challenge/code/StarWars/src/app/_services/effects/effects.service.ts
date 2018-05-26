// Angular modules.
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EffectsService {

  // Element class name.
  className: string = 'page_intro-star';

  // Constructor method.
  constructor() { }

  // Manage stars from intro background.
  public configBgStars(): void {

    // Sets the number of stars we wish to display
    const totalStars = 100;

    // Remove current stars.
    this.removeBgStars();

    // For every star we want to display
    for (let i = 0; i < totalStars; i++) {

      // Create a new star element.
      const star: HTMLElement = document.createElement('div');
      star.className = this.className;

      // Get and set a random position for this new star.
      const position = this.getRandomPosition();
      star.style.left = position[0] + 'px';
      star.style.top = position[1] + 'px';

      // Get and set current star size.
      const size = this.getRandomSize(5);
      star.style.height = size + 'px';
      star.style.width = size + 'px';

      // Append star to document.
      document.body.appendChild(star);

    }

  } // configBgStars().

  // Get a random left/top position based on window container.
  private getRandomPosition(): number[] {

    // Get window width and height.
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Generate random values for left and top positions.
    const left = Math.floor(Math.random() * w);
    const top = Math.floor(Math.random() * h);

    // Return values.
    return [left, top];

  }

  // Get a random size between a given limit.
  private getRandomSize(limit: number = 10): number {

    return Math.floor(Math.random() * limit) + 1;

  }

  // Remove current stars.
  public removeBgStars(): void {

    const curStars: HTMLCollectionOf<Element> = document.getElementsByClassName(this.className);
    while (curStars[0]) {
      curStars[0].parentNode.removeChild(curStars[0]);
    }

  }

}
