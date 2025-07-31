using FixedsApp.Application.Common.Wrapper;
using FixedsApp.Infrastructure.Auth.JWT.DTOs;
using FixedsApp.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace FixedsApp.Infrastructure.Auth.JWT // token service - on login returns JWT tokens to authenticated users
{
    public class TokenService : ITokenService
    {
        private readonly JWTSettings _jwtSettings;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;


        public TokenService(
            IOptions<JWTSettings> JWTSettings,
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager
            )
        {
            _jwtSettings = JWTSettings.Value;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        // JWT auth token
        public async Task<Response<TokenResponse>> GetTokenAsync(TokenRequest request)
        {
            ApplicationUser user = await _userManager.FindByEmailAsync(request.Email);

            if (user == null)
                return Response<TokenResponse>.Fail("Invalid user");

            if (user.IsActive == false)
                return Response<TokenResponse>.Fail("User account deactivated");

            SignInResult result = await _signInManager.PasswordSignInAsync(user.UserName, request.Password, false, lockoutOnFailure: false);

            if (!result.Succeeded)
                return Response<TokenResponse>.Fail("Unauthorized");

            if (!user.EmailConfirmed)
                return Response<TokenResponse>.Fail("Unauthorized");

            // create refresh token
            string refreshToken = GenerateRefreshToken();
            DateTime refreshTokenExpiryTime = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenDurationInDays);
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = refreshTokenExpiryTime;
            _ = await _userManager.UpdateAsync(user);

            JwtSecurityToken jwtSecurityToken = await GenerateJWTToken(user);
            TokenResponse response = new()
            {
                Token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken),
                RefreshToken = refreshToken,
                RefreshTokenExpiryTime = refreshTokenExpiryTime
            };
            return Response<TokenResponse>.Success(response);
        }

        // refresh token
        public async Task<Response<TokenResponse>> RefreshTokenAsync(string refreshToken)
        {
            ApplicationUser user = _userManager.Users.FirstOrDefault(u => u.RefreshToken == refreshToken);
            if (user == null)
            {
                return Response<TokenResponse>.Fail("Invalid token");
            }

            if (user.RefreshTokenExpiryTime < DateTime.UtcNow)
            {
                return Response<TokenResponse>.Fail("Refresh token expired");
            }

            // create token response
            JwtSecurityToken jwtSecurityToken = await GenerateJWTToken(user);
            TokenResponse response = new()
            {
                Token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken),
                RefreshToken = user.RefreshToken,
                RefreshTokenExpiryTime = user.RefreshTokenExpiryTime
            };
            return Response<TokenResponse>.Success(response);
        }


        private async Task<JwtSecurityToken> GenerateJWTToken(ApplicationUser user)
        {
            IList<string> roles = await _userManager.GetRolesAsync(user);

            List<Claim> roleClaims = new();
            for (int i = 0; i < roles.Count; i++)
            {
                roleClaims.Add(new Claim("roles", roles[i]));
            }


            IEnumerable<Claim> claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("uid", user.Id),
            }
            .Union(roleClaims);

            SymmetricSecurityKey symmetricSecurityKey = new(Encoding.UTF8.GetBytes(_jwtSettings.Key));
            SigningCredentials signingCredentials = new(symmetricSecurityKey, SecurityAlgorithms.HmacSha256);

            // create JWT token with claims (roles, userid, tenantid) that expires after time set in appsettings.json
            JwtSecurityToken jwtSecurityToken = new(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_jwtSettings.AuthTokenDurationInMinutes),
                signingCredentials: signingCredentials);

            return jwtSecurityToken;
        }

        private string GenerateRefreshToken()
        {
            byte[] randomNumber = new byte[32];
            using RandomNumberGenerator generator = RandomNumberGenerator.Create();
            generator.GetBytes(randomNumber);
            string refreshToken = Convert.ToBase64String(randomNumber)
                .TrimEnd('=')
                .Replace('+', '-')
                .Replace('/', '_');
            return refreshToken;
        }
    }
}


