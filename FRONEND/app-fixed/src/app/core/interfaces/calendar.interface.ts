export interface CalendarDay {
  id: string; // ISO date (ej. "2025-07-03")
  year: number;
  month: number;
  day: number;
  dayName?: string;
  isWeekend?: boolean;
  isHoliday?: boolean;
  holidayName?: string;
  notes?: string;

  // 🔽 Añade estas propiedades extras para el calendario visual
  bgColor?: string;
  link?: string;
  labelM?: boolean;
  labelR?: boolean;
}
