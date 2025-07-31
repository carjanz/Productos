﻿using FixedsApp.Application.Common.Marker;

namespace FixedsApp.Application.Services.ProductService.DTOs
{
    public class ProductDTO : IDto
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedOn { get; set; }

    }
}

