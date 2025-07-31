import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], // 👈 ojo: styleUrls (plural), no styleUrl
  imports: [
    RouterOutlet,       // 👈 Necesario para <router-outlet>
    NavbarComponent,
    HttpClientModule
  ]
})
export class AppComponent implements OnInit {
  title = 'client';

  constructor(private _router: Router, private _activatedRoute: ActivatedRoute) {}

  ngOnInit() {

  }
}
