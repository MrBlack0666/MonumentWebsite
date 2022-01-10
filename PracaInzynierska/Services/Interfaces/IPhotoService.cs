using API.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Services
{
    public interface IPhotoService
    {
        bool AddOldPhoto(long monumentId, IFormFile oldPhoto, int? date, string source);
        void DeleteOldPhoto(long oldPhotoId);
        bool AddNewPhoto(long monumentId, IFormFile newPhoto, string source);
        void DeleteNewPhoto(long newPhotoId);
        List<NewPhoto> GetNewPhotos(long monumentId);
        List<OldPhoto> GetOldPhotos(long monumentId);
    }
}
