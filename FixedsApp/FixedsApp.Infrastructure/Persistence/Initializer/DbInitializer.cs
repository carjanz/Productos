using FixedsApp.Infrastructure.Identity;
using FixedsApp.Infrastructure.Persistence.Contexts;
using Microsoft.AspNetCore.Identity;

namespace FixedsApp.Infrastructure.Persistence.Initializer
{
    public static class DbInitializer // class for seeding database with non-static data (users and roles)
    {
        public static void SeedAll(ApplicationDbContext context)
        {
            SeedAdminAndRoles(context);
            CalendarSeeder.SeedCalendar(context);
        }
        public static void SeedAdminAndRoles(ApplicationDbContext context)
        {
            ArgumentNullException.ThrowIfNull(context, nameof(context));
            if (context.Users.Any())
            {
                return;
            }

            ApplicationUser user = new() // create admin user
            {
                Id = "55555555-5555-5555-5555-555555555555",
                Email = "admin@email.com",
                NormalizedEmail = "ADMIN@EMAIL.COM",
                UserName = "admin@email.com.root",
                FirstName = "Default",
                LastName = "Admin",
                NormalizedUserName = "ADMIN@EMAIL.COM.ROOT",
                PhoneNumber = null,
                EmailConfirmed = true,
                PhoneNumberConfirmed = true,
                SecurityStamp = Guid.NewGuid().ToString("D")
            };

            PasswordHasher<ApplicationUser> password = new();
            string hashed = password.HashPassword(user, "Password123!");
            user.PasswordHash = hashed;
            _ = context.Users.Add(user);


            List<IdentityRole> roles = new() // create default roles
            {
                new IdentityRole() { Id = "1", Name = "admin", ConcurrencyStamp = Guid.NewGuid().ToString("D"), NormalizedName = "ADMIN" },
                new IdentityRole() { Id = "2", Name = "editor", ConcurrencyStamp = Guid.NewGuid().ToString("D"), NormalizedName = "EDITOR" },
                new IdentityRole() { Id = "3", Name = "basic", ConcurrencyStamp = Guid.NewGuid().ToString("D"), NormalizedName = "BASIC" }
            };
            context.Roles.AddRange(roles);

            IdentityUserRole<string> rootAdmin = new() { RoleId = "1", UserId = "55555555-5555-5555-5555-555555555555" }; // add admin user
            _ = context.UserRoles.Add(rootAdmin);

            _ = context.SaveChanges();
        }
    }
}
