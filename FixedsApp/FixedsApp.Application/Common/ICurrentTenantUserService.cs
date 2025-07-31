using FixedsApp.Application.Common.Marker;

namespace FixedsApp.Application.Common
{
    public interface ICurrentTenantUserService : IScopedService
    {
        public void SetUser();
        string? UserId { get; set; }
    }
}

