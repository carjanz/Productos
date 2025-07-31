using FixedsApp.Application.Services.CalendarService.DTOs;
using FixedsApp.Application.Common.Wrapper;
using FixedsApp.Application.Common;
using FixedsApp.Domain.Entities.Catalog;
using FixedsApp.Application.Services.CalendarService.Specifications;

namespace FixedsApp.Application.Services.CalendarService
{
    public class CalendarService : ICalendarService
    {
        private readonly IRepositoryAsync _repository;

        public CalendarService(IRepositoryAsync repository)
        {
            _repository = repository;
        }

        public async Task<Response<IEnumerable<CalendarDTO>>> GetCalendarsByMonthAsync(int year, int month)
        {
            CalendarByMonthSpecification spec = new(year, month);
            IEnumerable<Calendar> list = await _repository.GetListAsync<Calendar, Guid>(spec);

            IEnumerable<CalendarDTO> dtoList = list.Select(c => new CalendarDTO
            {
                Id = c.Id,
                Fecha = c.Fecha,
                Year = c.Year,
                Month = c.Month,
                Day = c.Day,
                DayName = c.DayName,
                IsWeekend = c.IsWeekend,
                IsHoliday = c.IsHoliday,
                HolidayName = c.HolidayName,
                IsBusinessDay = !c.IsWeekend && !c.IsHoliday
            });

            return Response<IEnumerable<CalendarDTO>>.Success(dtoList);
        }
    }
}

