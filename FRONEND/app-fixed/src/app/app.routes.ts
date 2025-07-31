import { Route } from '@angular/router';
import { AuthGuard } from './core/auth/guards/auth.guard';
import { NoAuthGuard } from './core/auth/guards/noAuth.guard';

export const appRoutes: Route[] = [
  // RUTAS PÚBLICAS (SIN AUTENTICACIÓN)
{
  path: '',
  loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
  data: { layout: 'empty' },
  children: [
    {
      path: '',
      loadComponent: () => import('./features/welcome/welcome.component').then(m => m.WelcomeComponent)
      // 🔓 Sin NoAuthGuard → accesible por todos
    },
    {
      path: 'login',
      loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent),
      canActivate: [NoAuthGuard],
    },
    {
      path: 'register',
      loadComponent: () => import('./features/register/register.component').then(m => m.RegisterComponent),
      canActivate: [NoAuthGuard],
    }

  ]
},


  // RUTAS PRIVADAS (REQUIEREN AUTENTICACIÓN)
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    data: { layout: 'internal' },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./features/products/products.component').then(m => m.ProductsComponent)
      },
      {
        path: 'products/:productId',
        loadComponent: () => import('./features/products-detail/products-detail.component').then(m => m.ProductsDetailComponent)
      },
      {
        path: 'calendar',
        loadComponent: () => import('./features/calendar/calendar.component').then(m => m.CalendarComponent)
      }
      // 🔁 A futuro: otras secciones protegidas
    ]
  },

  // Fallback
  {
    path: '**',
    redirectTo: ''
  }
];
