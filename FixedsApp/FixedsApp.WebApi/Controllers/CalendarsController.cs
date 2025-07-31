using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FixedsApp.Application.Services.CalendarService;

namespace FixedsApp.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CalendarsController : ControllerBase
    {
        private readonly ICalendarService _CalendarService;

        public CalendarsController(ICalendarService CalendarService)
        {
            _CalendarService = CalendarService;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetCalendarsAsync(int? year = null, int? month = null)
        {
            int selectedYear = year ?? DateTime.UtcNow.Year;
            int selectedMonth = month ?? DateTime.UtcNow.Month;

            var result = await _CalendarService.GetCalendarsByMonthAsync(selectedYear, selectedMonth);
            return Ok(result);
        }

    }
}
