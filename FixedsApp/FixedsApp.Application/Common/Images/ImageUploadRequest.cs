﻿using FixedsApp.Application.Common.Marker;
using Microsoft.AspNetCore.Http;

namespace FixedsApp.Application.Common.Images
{
    public class ImageUploadRequest : IDto
    {
        public IFormFile ImageFile { get; set; }
        public bool DeleteCurrentImage { get; set; }
    }
}
