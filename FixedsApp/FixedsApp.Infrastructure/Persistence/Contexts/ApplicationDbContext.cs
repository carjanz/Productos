
using FixedsApp.Application.Common;
using FixedsApp.Domain.Entities.Catalog;
using FixedsApp.Domain.Entities.Common;
using FixedsApp.Infrastructure.Identity;
using FixedsApp.Infrastructure.Persistence.Extensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;



//---------------------------------- CLI COMMANDS --------------------------------------------------

// Set default project to FixedsApp.Infrastructure in Package Manager Console
// When scaffolding database migrations, you must specify which context (ApplicationDbContext), use the following command:

// add-migration -Context ApplicationDbContext -o Persistence/Migrations MigrationName
// update-database -Context ApplicationDbContext

// NOTE: if you use the update-database command, you'll likely see 'No migrations were applied. The database is already up to date' because the migrations are applied programatically during the build.

//--------------------------------------------------------------------------------------------------

namespace FixedsApp.Infrastructure.Persistence.Contexts
{
    public class ApplicationRoles : IdentityRole
    {
    }

    public class ApplicationDbContext : IdentityDbContext<ApplicationUser> // main context class -- migrations are run using this context
    {

        public string CurrentUserId { get; set; }
        private readonly ICurrentTenantUserService _currentTenantService;

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) // default constructor for IDesignTimeDbContextFactory
        {
        }

        public ApplicationDbContext(ICurrentTenantUserService currentTenantUserService, DbContextOptions<ApplicationDbContext> options) : base(options)
        {
            _currentTenantService = currentTenantUserService;
            CurrentUserId = _currentTenantService.UserId;
        }

        // -- add DbSets here for new application entities
        public DbSet<Product> Products { get; set; }
        public DbSet<Calendar> Calendars { get; set; }
        protected override void OnModelCreating(ModelBuilder builder) // apply global query filters, rename tables, and run seeders
        {
            base.OnModelCreating(builder);

            // rename identity tables
            builder.ApplyIdentityConfiguration();

            // query filters
            _ = builder.AppendGlobalQueryFilter<ISoftDelete>(s => s.DeletedOn == null); // filter out deleted entities (soft delete)

            builder.SeedStaticData();
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken()) // handle audit fields (createdOn, createdBy, modifiedBy, modifiedOn) and handle soft delete on save changes
        {
            this.AuditFields(CurrentUserId);
            int result = await base.SaveChangesAsync(cancellationToken);
            return result;
        }
    }
}


