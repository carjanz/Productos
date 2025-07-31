using FixedsApp.Application.Common.Marker;

namespace FixedsApp.Infrastructure.Identity.DTOs
{
    public class UserDto : IDto
    {
        public Guid Id { get; set; }
        public string ImageUrl { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public bool IsActive { get; set; }
        public string PhoneNumber { get; set; }
        public string RoleId { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
