using AutoMapper;
using FixedsApp.Application.Services.ProductService.DTOs;
using FixedsApp.Domain.Entities.Catalog;
using FixedsApp.Infrastructure.Identity;
using FixedsApp.Infrastructure.Identity.DTOs;

namespace FixedsApp.Infrastructure.Mapper
{
    public class MappingProfiles : Profile // automapper mapping configurations
    {
        public MappingProfiles()
        {
            // user mappings
            _ = CreateMap<ApplicationUser, UserDto>();
            _ = CreateMap<UpdateProfileRequest, ApplicationUser>();
            _ = CreateMap<UpdateUserRequest, ApplicationUser>();
            _ = CreateMap<RegisterUserRequest, ApplicationUser>()
                .ForMember(x => x.UserName, o => o.MapFrom(s => s.Email));
            _ = CreateMap<UserDto, UpdateProfileRequest>();

            // product mappings
            _ = CreateMap<Product, ProductDTO>();
            _ = CreateMap<CreateProductRequest, Product>();
            _ = CreateMap<UpdateProductRequest, Product>();


            // add new entity mappings here...

        }
    }
}
