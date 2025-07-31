using FixedsApp.Domain.Entities.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;


namespace FixedsApp.Infrastructure.Persistence.Extensions
{
    public static class OnSaveChangesExtensions
    {
        public static void AuditFields<TContext>(this TContext context, string CurrentUserId) where TContext : DbContext
        {
            ChangeTracker changeTracker = context.ChangeTracker;
            foreach (var entry in changeTracker.Entries<IAuditableEntity>().ToList()) // auditable fields / soft delete on tables with IAuditableEntity
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        entry.Entity.CreatedOn = DateTime.UtcNow;
                        entry.Entity.CreatedBy = CurrentUserId != null ? Guid.Parse(CurrentUserId) : Guid.Empty;
                        break;

                    case EntityState.Modified:
                        entry.Entity.LastModifiedOn = DateTime.UtcNow;
                        entry.Entity.LastModifiedBy = CurrentUserId != null ? Guid.Parse(CurrentUserId) : Guid.Empty;
                        break;

                    case EntityState.Deleted:
                        if (entry.Entity is ISoftDelete softDelete) // intercept delete requests, forward as modified on tables with ISoftDelete
                        {
                            softDelete.DeletedOn = DateTime.UtcNow;
                            softDelete.DeletedBy = CurrentUserId != null ? Guid.Parse(CurrentUserId) : Guid.Empty;
                            entry.State = EntityState.Modified;
                        }

                        break;
                }
            }
        }
    }
}

