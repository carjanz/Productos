using FluentValidation;

namespace FixedsApp.Infrastructure.Identity.DTOs
{
    public class ChangePasswordRequest
    {
        public string Password { get; set; }
        public string NewPassword { get; set; }
        public string ConfirmNewPassword { get; set; }
    }

    public class ChangePasswordRequestValidator : AbstractValidator<ChangePasswordRequest>
    {
        public ChangePasswordRequestValidator()
        {
            _ = RuleFor(p => p.Password)
                .NotEmpty();
            _ = RuleFor(p => p.NewPassword)
                .NotEmpty();
            _ = RuleFor(p => p.ConfirmNewPassword)
                .Equal(p => p.NewPassword)
                    .WithMessage("Passwords do not match.");
        }
    }
}
