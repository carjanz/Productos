using FixedsApp.Infrastructure.Persistence.Contexts;
using FixedsApp.Infrastructure.Persistence.Initializer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace FixedsApp.Infrastructure.Persistence.Extensions
{
    // apply pending migrations, seed database
    public static class DatabaseInitializationExtensions
    {
        public static IServiceCollection AddAndMigrateDatabase<T>(this IServiceCollection services, IConfiguration configuration)
            where T : ApplicationDbContext
        {

            // apply migrations to DB
            using IServiceScope scopeBase = services.BuildServiceProvider().CreateScope();
            T applicationDbContext = scopeBase.ServiceProvider.GetRequiredService<T>();
            if (applicationDbContext.Database.GetPendingMigrations().Any())
            {
                applicationDbContext.Database.Migrate(); // apply any pending migrations
            }
            DbInitializer.SeedAll(applicationDbContext);

            return services;
        }
    }
}
