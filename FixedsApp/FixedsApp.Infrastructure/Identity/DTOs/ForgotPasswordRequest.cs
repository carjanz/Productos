using FluentValidation;

namespace FixedsApp.Infrastructure.Identity.DTOs
{
    public class ForgotPasswordRequest
    {
        public string Email { get; set; }
    }

    public class ForgotPasswordValidator : AbstractValidator<ForgotPasswordRequest>
    {
        public ForgotPasswordValidator()
        {
            _ = RuleFor(x => x.Email).NotEmpty().EmailAddress();
        }
    }
}
