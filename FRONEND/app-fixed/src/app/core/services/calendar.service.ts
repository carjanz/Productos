import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, throwError  } from 'rxjs';
import { CalendarDay } from '../interfaces/calendar.interface';// Asegúrate de tener este modelo definido
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../interfaces/api-response';// Asegúrate de tener este modelo definido

@Injectable({ providedIn: 'root' })
export class CalendarService {
  private calendarData = new BehaviorSubject<CalendarDay[]>([]);
  calendarData$ = this.calendarData.asObservable();

  constructor(private http: HttpClient) {}

getCalendar(year: number, month: number) {
  return this.http
    .get<ApiResponse<CalendarDay[]>>(`${environment.END_POINT_APP}/Calendars?year=${year}&month=${month}`)
    .pipe(
      map(response => {
        this.calendarData.next(response.data);
        return response.data;
      }),
      catchError(error => {
        const msg = error?.error?.message || 'Error al obtener calendario';
        return throwError(() => new Error(msg));
      })
    );
}


}
