using Ardalis.Specification;
using FixedsApp.Domain.Entities.Catalog;

namespace FixedsApp.Application.Services.CalendarService.Specifications
{

    public class CalendarByMonthSpecification : Specification<Calendar>
    {
        public CalendarByMonthSpecification(int year, int month)
        {
            _ = Query.Where(c => c.Year == year && c.Month == month).OrderBy(c => c.Day); // ✅ Orden dentro del constructor

        }
    }

}
