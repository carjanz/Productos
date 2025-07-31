using AutoMapper;
using FixedsApp.Application.Common;
using FixedsApp.Application.Common.Images;
using FixedsApp.Application.Common.Wrapper;
using FixedsApp.Application.Utility;
using FixedsApp.Infrastructure.Identity.DTOs;
using FixedsApp.Infrastructure.Mailer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace FixedsApp.Infrastructure.Identity
{
    public class IdentityService : IIdentityService // identity service (user management, profiles, password, preferences)
    {
        private readonly IMapper _mapper;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ICurrentTenantUserService _currentTenantUserService;
        private readonly IMailService _mailService;
        private readonly IImageService _imageService;

        public IdentityService(IMapper mapper, UserManager<ApplicationUser> userManager, ICurrentTenantUserService currentTenantUserService, IMailService mailService, IImageService imageService)
        {
            _userManager = userManager; // user manager (service provided by aspnetcore.identity)
            _currentTenantUserService = currentTenantUserService; // current tenant & user service (with values set in middleware)
            _mailService = mailService; // mail service - forgotten password, confirm user
            _imageService = imageService; // image service - profile image upload
            _mapper = mapper; // automapper
        }

        // USER MANAGEMENT (admin-level permissions)
        #region [-- USER MANAGEMENT --]
        // get user list -- client-side pagination
        public async Task<Response<IEnumerable<UserDto>>> GetUsersAsync()
        {

            List<ApplicationUser> usersList = await _userManager.Users.OrderByDescending(x => x.CreatedOn).ToListAsync();
            foreach (ApplicationUser user in usersList)
            {
                Task<IList<string>> roles = _userManager.GetRolesAsync(user);
                string roleId = roles.Result.FirstOrDefault();
                user.RoleId = roleId; // RoleId is a non-mapped property in the applicationUser class, the DTOs returned will have role ID
            }

            List<UserDto> dtoList = _mapper.Map<List<UserDto>>(usersList);

            return Response<IEnumerable<UserDto>>.Success(dtoList);
        }

        // get user details
        public async Task<Response<UserDto>> GetUserDetailsAsync(Guid id)
        {
            ApplicationUser user = await _userManager.Users.Where(x => x.Id == Convert.ToString(id)).FirstOrDefaultAsync();
            if (user == null)
            {
                return Response<UserDto>.Fail("User doesn't exist");
            }

            Task<IList<string>> roles = _userManager.GetRolesAsync(user);
            string roleId = roles.Result.FirstOrDefault();
            user.RoleId = roleId;

            UserDto responseDto = _mapper.Map(user, new UserDto());

            return Response<UserDto>.Success(responseDto);

        }

        // register new user 
        public async Task<Response<UserDto>> RegisterUserAsync(RegisterUserRequest request)
        {
            ApplicationUser userExist = await _userManager.FindByEmailAsync(request.Email);
            if (userExist != null)
            {
                return Response<UserDto>.Fail("User already exists");
            }

            ApplicationUser user = new()
            {
                UserName = request.Email + "." + NanoHelpers.GenerateHex(4),
                FirstName = request.FirstName,
                LastName = request.LastName,
                PhoneNumber = request.PhoneNumber,
                Email = request.Email,
                EmailConfirmed = true,
                IsActive = true
            };

            IdentityResult result = await _userManager.CreateAsync(user, request.Password); // create user with password
            if (result.Succeeded)
            {
                _ = await _userManager.AddToRoleAsync(user, request.RoleId);
                user.RoleId = request.RoleId; // populate the role id value for the response object

                UserDto responseDto = _mapper.Map(user, new UserDto()); // map the application user (with role) to a user dto for response

                return Response<UserDto>.Success(responseDto);
            }
            else
            {
                List<string> messages = new();
                foreach (IdentityError error in result.Errors)
                {
                    messages.Add(error.Description);
                }
                return Response<UserDto>.Fail(messages);
            }
        }

        // update user
        public async Task<Response<UserDto>> UpdateUserAsync(UpdateUserRequest request, Guid id)
        {

            ApplicationUser user = await _userManager.FindByIdAsync(id.ToString());

            if (user == null)
            {
                return Response<UserDto>.Fail("Not found");
            }

            IList<string> roles = await _userManager.GetRolesAsync(user);
            if (roles.FirstOrDefault() == "root") // prevent editing root user
            {
                return Response<UserDto>.Fail("Cannot edit root user");
            }

            if (id == Guid.Parse(_currentTenantUserService.UserId)) // prevent editing current user
            {
                return Response<UserDto>.Fail("Cannot update current user");
            }


            if (request.Email != user.Email) // check if email already in use
            {
                ApplicationUser userExist = await _userManager.FindByEmailAsync(request.Email);
                if (userExist != null)
                {
                    return Response<UserDto>.Fail("Email already in use");
                }
            }


            ApplicationUser updatedUser = _mapper.Map(request, user); // map to application user           
            IdentityResult result = await _userManager.UpdateAsync(updatedUser); // save the changes

            if (result.Succeeded)
            {
                UserDto updatedUserDTO = _mapper.Map(updatedUser, new UserDto()); // map to UserDto for response object

                _ = await _userManager.RemoveFromRolesAsync(user, roles.ToArray()); // remove from all roles
                _ = await _userManager.AddToRoleAsync(user, request.RoleId); // then add to new role

                return Response<UserDto>.Success(updatedUserDTO);
            }
            else
            {
                List<string> messages = new();
                foreach (IdentityError error in result.Errors)
                {
                    messages.Add(error.Description);
                }
                return Response<UserDto>.Fail(messages);
            }
        }

        // delete user
        public async Task<Response<Guid>> DeleteUserAsync(Guid id)
        {
            try
            {
                ApplicationUser user = await _userManager.FindByIdAsync(id.ToString());
                if (user == null)
                {
                    return Response<Guid>.Fail("Not found");
                }

                if (id == Guid.Parse(_currentTenantUserService.UserId)) // prevent editing current user
                {
                    return Response<Guid>.Fail("Cannot delete current user");
                }

                _ = await _userManager.DeleteAsync(user);

                return Response<Guid>.Success(id);
            }
            catch (Exception ex)
            {
                return Response<Guid>.Fail(ex.Message);
            }
        }
        #endregion [-- USER MANAGEMENT --]

        // PROFILE (basic-level permissions)
        #region [-- PROFILE --]
        // get profile
        public async Task<Response<UserDto>> GetProfileDetailsAsync()
        {
            ApplicationUser currentUser = await _userManager.Users.Where(x => x.Id == _currentTenantUserService.UserId).FirstOrDefaultAsync();

            Task<IList<string>> roles = _userManager.GetRolesAsync(currentUser);
            string roleId = roles.Result.FirstOrDefault();
            currentUser.RoleId = roleId;

            UserDto dtoUser = _mapper.Map(currentUser, new UserDto());

            return Response<UserDto>.Success(dtoUser);
        }

        // update profile
        public async Task<Response<UserDto>> UpdateProfileAsync(UpdateProfileRequest request)
        {
            ApplicationUser userInDb = await _userManager.FindByIdAsync(_currentTenantUserService.UserId); // check current user ID
            if (userInDb == null)
            {
                return Response<UserDto>.Fail("User Not Found");
            }

            ApplicationUser userWithEmail = await _userManager.FindByEmailAsync(request.Email); // check email in the request


            if (userWithEmail == userInDb) // set to null if match is the current user
            {
                userWithEmail = null;
            }


            if (userWithEmail != null) // check if email is in use already
            {
                return Response<UserDto>.Fail("Email already in use");
            }


            ApplicationUser updatedAppUser = _mapper.Map(request, userInDb); // update all fields


            _ = await _userManager.UpdateAsync(updatedAppUser); // save changes to db


            UserDto responseDto = _mapper.Map(updatedAppUser, new UserDto()); // response dto
            responseDto.RoleId = _userManager.GetRolesAsync(updatedAppUser).Result.FirstOrDefault(); // include the role in the dto

            return Response<UserDto>.Success(responseDto);
        }

        // change password
        public async Task<Response<string>> ChangePasswordAsync(ChangePasswordRequest request)
        {
            ApplicationUser user = await _userManager.FindByIdAsync(_currentTenantUserService.UserId);
            if (user == null)
            {
                return Response<string>.Fail("Not found");
            }

            IdentityResult result = await _userManager.ChangePasswordAsync(user, request.Password, request.NewPassword);
            if (result.Succeeded)
            {
                return Response<string>.Success("Password updated");
            }
            else
            {
                List<string> errorList = new();
                foreach (IdentityError error in result.Errors)
                {
                    errorList.Add(error.Description);
                }
                return Response<string>.Fail(errorList);
            }
        }

        // change profile image
        public async Task<Response<string>> ChangeProfileImageAsync(ImageUploadRequest request)
        {
            ApplicationUser userInDb = await _userManager.FindByIdAsync(_currentTenantUserService.UserId); // check current user ID
            if (userInDb == null)
            {
                return Response<string>.Fail("User Not Found");
            }

            string currentImage = userInDb.ImageUrl ?? "";


            if (request.ImageFile != null)
            {
                string imageResult = await _imageService.AddImage(request.ImageFile, 300, 300); // handle image upload (cloudinary)
                userInDb.ImageUrl = imageResult; // write the external image url to user 

                if (currentImage != "")
                {
                    _ = await _imageService.DeleteImage(currentImage); // delete the old image
                }
            }

            if (request.DeleteCurrentImage && currentImage != "")
            {
                _ = await _imageService.DeleteImage(currentImage);
                userInDb.ImageUrl = "";
            }

            _ = await _userManager.UpdateAsync(userInDb);
            return Response<string>.Success(userInDb.ImageUrl);
        }
        #endregion [-- PROFILE --]

        // FORGOT/RESET PASSWORD (anonymous permissions -- tenant ID from header or subdomain)
        #region [-- FORGOT/RESET PASSWORD --]
        // forgot password
        public async Task<Response<string>> ForgotPasswordAsync(ForgotPasswordRequest request, string origin, string route)
        {

            ApplicationUser user = await _userManager.FindByEmailAsync(request.Email.Normalize());
            if (user is null || user.IsActive == false)
            {
                return Response<string>.Fail("Not found");
            }


            string code = await _userManager.GeneratePasswordResetTokenAsync(user);

            Uri endpointUri = new(string.Concat($"{origin}/", route));


            MailRequest mailRequest = new()
            {
                To = request.Email,
                Subject = "Reset Password",
                Body = $"Your password reset token is '{code}'. You can reset your password using the {endpointUri} endpoint.",
            };


            await _mailService.SendAsync(mailRequest);

            return Response<string>.Success("Password reset has been sent to your email.");
        }

        // reset password
        public async Task<Response<string>> ResetPasswordAsync(ResetPasswordRequest request)
        {
            ApplicationUser user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null || user.IsActive == false)
            {
                return Response<string>.Fail("Not found");
            }

            IdentityResult result = await _userManager.ResetPasswordAsync(user, request.Token, request.Password);
            if (result.Succeeded)
            {
                return Response<string>.Success("Password reset");
            }
            else
            {
                //return result.errors
                return Response<string>.Fail("Password reset fail");
            }
        }
        #endregion [-- FORGOT/RESET PASSWORD --]
    }
}
