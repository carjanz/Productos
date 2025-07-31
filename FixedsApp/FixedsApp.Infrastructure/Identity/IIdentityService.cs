using FixedsApp.Application.Common.Images;
using FixedsApp.Application.Common.Marker;
using FixedsApp.Application.Common.Wrapper;
using FixedsApp.Infrastructure.Identity.DTOs;

namespace FixedsApp.Infrastructure.Identity
{
    public interface IIdentityService : ITransientService
    {
        Task<Response<IEnumerable<UserDto>>> GetUsersAsync(); // get user list (full list for client-side pagination)
        Task<Response<UserDto>> GetUserDetailsAsync(Guid id); // get user details
        Task<Response<UserDto>> RegisterUserAsync(RegisterUserRequest request); // register new user 
        Task<Response<UserDto>> UpdateUserAsync(UpdateUserRequest request, Guid id); // update user
        Task<Response<Guid>> DeleteUserAsync(Guid id); // delete user
        Task<Response<UserDto>> GetProfileDetailsAsync(); // get profile
        Task<Response<UserDto>> UpdateProfileAsync(UpdateProfileRequest request); // update profile
        Task<Response<string>> ChangeProfileImageAsync(ImageUploadRequest request); // change profile image
        Task<Response<string>> ChangePasswordAsync(ChangePasswordRequest request); // change password
        Task<Response<string>> ForgotPasswordAsync(ForgotPasswordRequest request, string origin, string route); // forgot password
        Task<Response<string>> ResetPasswordAsync(ResetPasswordRequest request); // reset password
    }
}
