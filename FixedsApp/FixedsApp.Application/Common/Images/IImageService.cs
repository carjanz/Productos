﻿using FixedsApp.Application.Common.Marker;
using Microsoft.AspNetCore.Http;

namespace FixedsApp.Application.Common.Images
{
    public interface IImageService : ITransientService
    {
        Task<string> AddImage(IFormFile file, int height, int width);
        Task<string> DeleteImage(string url);
    }
}
