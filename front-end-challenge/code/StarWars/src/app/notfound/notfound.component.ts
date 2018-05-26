// Angular modules.
import { ActivatedRoute, Router, RouterLinkActive } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.scss']
})
export class NotfoundComponent implements OnInit {

  // Constructor method.
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  // On init.
  ngOnInit() {}

  // Go to home page.
  public goToHome(): void {

    this.router.navigate(['']);

  }

}
