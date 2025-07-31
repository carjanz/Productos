import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarDay } from 'src/app/core/interfaces/calendar.interface';
import { CalendarService } from 'src/app/core/services/calendar.service';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; // asegúrate de importar esto


@Component({
  standalone: true,
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  imports: [CommonModule, RouterModule]
})
export class CalendarComponent implements OnInit {
  currentDate: Date = new Date();
  selectedMonth: number = new Date().getMonth();
  selectedYear: number = new Date().getFullYear();
  daysInMonth: CalendarDay[] = [];
  calendarMatrix: (CalendarDay | null)[] = [];

  constructor(private calendarService: CalendarService,private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadCalendar();
  }

changeMonth(offset: number): void {
  const today = new Date();
  const newDate = new Date(this.selectedYear, this.selectedMonth + offset);

  // Bloquea meses futuros
  if (
    newDate.getFullYear() > today.getFullYear() ||
    (newDate.getFullYear() === today.getFullYear() && newDate.getMonth() > today.getMonth())
  ) {
    this.toastr.warning('No puedes ver meses futuros', 'Advertencia');
    return;
  }

  this.selectedMonth = newDate.getMonth();
  this.selectedYear = newDate.getFullYear();
  this.currentDate = newDate;
  this.loadCalendar();
}

  loadCalendar(): void {
    this.calendarService.getCalendar(this.selectedYear, this.selectedMonth + 1).subscribe(response => {
     this.daysInMonth = response.map(day => ({
    ...day,
    labelM: true,
    labelR: true,
    bgColor: this.getBackgroundColor(day),
    link: `/detalle-dia/${day.year}-${day.month}-${day.day}`
  }));

      this.buildCalendarMatrix();
    });
  }

  buildCalendarMatrix(): void {
    const firstDayOfWeek = new Date(this.selectedYear, this.selectedMonth, 1).getDay(); // 0 = domingo
    const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Ajustar a lunes = 0

    const matrix: (CalendarDay | null)[] = Array(offset).fill(null).concat(this.daysInMonth);
    this.calendarMatrix = matrix;
  }

 getBackgroundColor(day: CalendarDay): string {
    console.log(day);
  if (day.isHoliday) return '#f8d7da';      // rojo pastel
  if (day.isWeekend) return '#d1ecf1';      // azul pastel
  return '#ffffff';                         // blanco por defecto
}
}
