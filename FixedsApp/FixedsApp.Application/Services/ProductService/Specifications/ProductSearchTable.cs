using Ardalis.Specification;
using FixedsApp.Application.Common.Specification;
using FixedsApp.Domain.Entities.Catalog;

namespace FixedsApp.Application.Services.ProductService.Specifications
{
    public class ProductSearchTable : Specification<Product>
    {
        public ProductSearchTable(string? name = "", string? dynamicOrder = "")
        {

            // filters
            if (!string.IsNullOrWhiteSpace(name))
            {
                _ = Query.Where(x => x.Name.Contains(name));
            }


            // sort order
            if (string.IsNullOrEmpty(dynamicOrder))
            {
                _ = Query.OrderByDescending(x => x.CreatedOn); // default sort order
            }
            else
            {
                _ = Query.OrderBy(dynamicOrder); // dynamic (JQDT) sort order
            }


        }
    }
}
