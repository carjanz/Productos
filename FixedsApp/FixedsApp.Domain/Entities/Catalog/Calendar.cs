using FixedsApp.Domain.Entities.Common;

namespace FixedsApp.Domain.Entities.Catalog
{
    public class Calendar : BaseEntity<Guid>
    {

        public DateTime Fecha { get; set; }

        public int Year { get; set; }
        public int Month { get; set; }
        public int Day { get; set; }
        public string DayName { get; set; } = string.Empty;

        public bool IsWeekend { get; set; }
        public bool IsHoliday { get; set; }
        public string? HolidayName { get; set; }
        public bool IsBusinessDay => !IsWeekend && !IsHoliday;

    }
}
