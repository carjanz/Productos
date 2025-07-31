import { Component, OnInit,computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Layout } from './layouts.types';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { FuseLoadingBarComponent  } from 'src/app/core/loading-bar';
import { RouterOutlet } from '@angular/router';
import { MenuDashboardComponent } from '../features/menu-dashboard/menu-dashboard.component';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  imports: [RouterOutlet,CommonModule,SidebarComponent,FuseLoadingBarComponent,MenuDashboardComponent],
})
export class LayoutComponent implements OnInit {
    toastMessage = '';
  showToast = false;
  private activatedRoute = inject(ActivatedRoute);

    layout = toSignal(
    this.activatedRoute.data.pipe(map(data => data['layout'] as Layout)),
    { initialValue: 'empty' as Layout }
  );

    constructor(private router: Router) {}



  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    const message = navigation?.extras?.state?.['message'] ?? history.state?.message;
    if (message) {
      this.toastMessage = message;
      this.showToast = true;
      setTimeout(() => this.showToast = false, 3000);
    }

   
  }


  showFooter = computed(() => this.layout() === 'internal');
}
