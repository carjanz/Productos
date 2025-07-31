import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-app-snack-bar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,     // ✅ Importar MatIconModule
    MatButtonModule    // ✅ Importar MatButtonModule para el botón de cierre
  ],
  templateUrl: './app-snack-bar.component.html',
  styleUrls: ['./app-snack-bar.component.scss']
})
export class AppSnackBarComponent {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}

  get getIcon() {
    switch (this.data.snackType) {
      case 'success':
        return { type: this.data.snackType, icon: 'mat_outline:check_circle' };
      case 'error':
        return { type: this.data.snackType, icon: 'heroicons_solid:x-circle' };
      case 'warning':
        return { type: this.data.snackType, icon: 'heroicons_solid:exclamation' };
      case 'info':
      default:
        return { type: this.data.snackType, icon: 'heroicons_solid:information-circle' };
    }
  }

  closeSnackbar() {
    this.data.snackBar.dismiss();
  }
}
