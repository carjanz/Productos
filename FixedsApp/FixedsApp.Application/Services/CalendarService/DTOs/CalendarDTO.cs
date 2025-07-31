using FixedsApp.Application.Common.Marker;

namespace FixedsApp.Application.Services.CalendarService.DTOs
{
    public class CalendarDTO : IDto
    {
        public Guid Id { get; set; }
        public DateTime Fecha { get; set; }

        public int Year { get; set; }
        public int Month { get; set; }
        public int Day { get; set; }

        public string DayName { get; set; } = string.Empty;

        public bool IsWeekend { get; set; }
        public bool IsHoliday { get; set; }
        public string? HolidayName { get; set; }
        public bool IsBusinessDay { get; set; }
    }
}

