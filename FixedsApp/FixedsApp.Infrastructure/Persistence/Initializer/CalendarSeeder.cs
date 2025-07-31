using FixedsApp.Domain.Entities.Catalog;
using FixedsApp.Infrastructure.Persistence.Contexts;


namespace FixedsApp.Infrastructure.Persistence.Initializer
{

    public static class CalendarSeeder
    {
        public static void SeedCalendar(ApplicationDbContext context, int startYear = 2025, int endYear = 2030)
        {
            if (context.Calendars.Any()) return;

            List<Calendar> calendarEntries = new();

            for (var year = startYear; year <= endYear; year++)
            {
                for (var month = 1; month <= 12; month++)
                {
                    var daysInMonth = DateTime.DaysInMonth(year, month);

                    for (var day = 1; day <= daysInMonth; day++)
                    {
                        var date = new DateTime(year, month, day);
                        var dayOfWeek = date.DayOfWeek;

                        calendarEntries.Add(new Calendar
                        {
                            Fecha = date,
                            Year = year,
                            Month = month,
                            Day = day,
                            DayName = System.Globalization.CultureInfo.GetCultureInfo("es-ES").DateTimeFormat.GetDayName(dayOfWeek),
                            IsWeekend = dayOfWeek == DayOfWeek.Saturday || dayOfWeek == DayOfWeek.Sunday,
                            IsHoliday = false,
                            HolidayName = null,

                        });
                    }
                }
            }

            context.Calendars.AddRange(calendarEntries);
            context.SaveChanges();
        }
    }
}