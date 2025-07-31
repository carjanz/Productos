using FixedsApp.Application.Common.Marker;
using FixedsApp.Application.Common.Wrapper;
using FixedsApp.Infrastructure.Auth.JWT.DTOs;

namespace FixedsApp.Infrastructure.Auth.JWT
{
    public interface ITokenService : ITransientService
    {
        Task<Response<TokenResponse>> GetTokenAsync(TokenRequest request);
        Task<Response<TokenResponse>> RefreshTokenAsync(string refreshToken);
    }
}
