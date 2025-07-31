using FixedsApp.Application.Common.Marker;
using FixedsApp.Application.Common.Wrapper;
using FixedsApp.Application.Services.ProductService.DTOs;
using FixedsApp.Application.Services.ProductService.Filters;

namespace FixedsApp.Application.Services.ProductService
{
    public interface IProductService : ITransientService
    {
        Task<Response<IEnumerable<ProductDTO>>> GetProductsAsync(string keyword = "");
        Task<PaginatedResponse<ProductDTO>> GetProductsPaginatedAsync(ProductTableFilter filter);
        Task<Response<ProductDTO>> GetProductAsync(Guid id);
        Task<Response<Guid>> CreateProductAsync(CreateProductRequest request);
        Task<Response<Guid>> UpdateProductAsync(UpdateProductRequest request, Guid id);
        Task<Response<Guid>> DeleteProductAsync(Guid id);

    }
}
