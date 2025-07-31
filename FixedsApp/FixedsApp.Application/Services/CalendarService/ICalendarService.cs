using FixedsApp.Application.Common.Marker;
using FixedsApp.Application.Common.Wrapper;
using FixedsApp.Application.Services.CalendarService.DTOs;

namespace FixedsApp.Application.Services.CalendarService
{
    public interface ICalendarService : ITransientService
    {
        Task<Response<IEnumerable<CalendarDTO>>> GetCalendarsByMonthAsync(int year, int month);
    }
}
