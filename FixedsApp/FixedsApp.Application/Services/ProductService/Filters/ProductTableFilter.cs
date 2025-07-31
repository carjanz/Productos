using FixedsApp.Application.Common.Filter;

namespace FixedsApp.Application.Services.ProductService.Filters
{
    public class ProductTableFilter : PaginationFilter
    {
        public string? Keyword { get; set; }
    }
}
