using FixedsApp.Application.Common;

namespace FixedsApp.WebApi.Middleware
{
    public class UserResolver
    {
        private readonly RequestDelegate _next;
        public UserResolver(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, ICurrentTenantUserService currentUserService, IWebHostEnvironment env)
        {
            currentUserService.SetUser();
            await _next(context);
        }

    }
}
