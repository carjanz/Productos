using FixedsApp.Application.Common.Marker;

namespace FixedsApp.Infrastructure.Auth.JWT.DTOs
{
    public class TokenResponse : IDto
    {
        public string Token { get; set; }
        public string RefreshToken { get; set; }
        public DateTime RefreshTokenExpiryTime { get; set; }

    }
}
