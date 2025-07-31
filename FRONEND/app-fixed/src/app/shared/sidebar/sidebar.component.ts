import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [CommonModule]
})
export class SidebarComponent {
  @Input() role: string | null = null;

  modules = [
    {
      name: 'Inicio',
      route: '/dashboard',
      roles: ['admin', 'analyst'],
      icon: '🏠',
      children: []
    },
    {
      name: 'Usuarios',
      route: '/users',
      roles: ['admin'],
      icon: '👥',
      children: [
        { name: 'Lista', route: '/users/list', roles: ['admin'] },
        { name: 'Crear', route: '/users/create', roles: ['admin'] },
      ]
    },
    {
      name: 'Reportes',
      route: '/reports',
      roles: ['admin', 'analyst'],
      icon: '📊',
      children: [
        { name: 'Resumen', route: '/reports/summary', roles: ['admin', 'analyst'] },
        { name: 'Avanzado', route: '/reports/advanced', roles: ['admin'] },
      ]
    }
  ];

  isVisible(roles: string[]) {
    return !this.role || roles.includes(this.role);
  }
}

