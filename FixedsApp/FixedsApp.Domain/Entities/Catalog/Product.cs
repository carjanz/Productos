using FixedsApp.Domain.Entities.Common;

namespace FixedsApp.Domain.Entities.Catalog
{
    public class Product : AuditableEntity // sample business entity
    {
        public string Name { get; set; }
        public string Description { get; set; }
    }
}
