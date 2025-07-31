import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common'; // ⬅️ Agrega esto

@Component({
  selector: 'app-menu-dashboard',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor], // ⬅️ Incluye NgIf y NgFor aquí
  templateUrl: './menu-dashboard.component.html',
  styleUrls: ['./menu-dashboard.component.css']
})
export class MenuDashboardComponent {
  options: string[] = ['Selecciona una opcion...','calendar', 'Products', 'Settings', 'Profile'];
  selectedIndex: number = 0;
  hover = false;

  selectOption(index: number): void {
    const temp = this.options[this.selectedIndex];
    this.options[this.selectedIndex] = this.options[index];
    this.options[index] = temp;
    console.log(this.options[this.selectedIndex]);
  }

  formatRoute(label: string): string {
    return '/' + label.toLowerCase().replace(/\s+/g, '-');
  }
}
