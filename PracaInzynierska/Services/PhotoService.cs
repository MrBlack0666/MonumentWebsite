using API.Database;
using API.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace API.Services
{
    public class PhotoService : IPhotoService
    {
        private DatabaseContext db;
        private IMonumentService monumentService;

        private const int MAX_TITBIT_LENGTH = 300;

        public PhotoService(DatabaseContext db, IMonumentService monumentService)
        {
            this.db = db;
            this.monumentService = monumentService;
        }

        public bool AddOldPhoto(long monumentId, IFormFile oldPhoto, int? date, string source)
        {
            var isMonumentVerified = monumentService.IsMonumentVerified(monumentId);

            if (isMonumentVerified != true)
                return false;

            if (date == null || date > DateTime.Now.AddYears(-10).Year)
                date = null;

            byte[] photo;
            using (var binaryReader = new BinaryReader(oldPhoto.OpenReadStream()))
            {
                photo = binaryReader.ReadBytes((int)oldPhoto.Length);
            }

            db.OldPhotos.Add(new OldPhoto()
            {
                Date = date,
                Source = source,
                MonumentId = monumentId,
                Picture = photo
            });

            db.SaveChanges();

            return true;
        }

        public void DeleteOldPhoto(long oldPhotoId)
        {
            var photo = db.OldPhotos.Find(oldPhotoId);

            db.OldPhotos.Remove(photo);
            db.SaveChanges();
        }

        public bool AddNewPhoto(long monumentId, IFormFile newPhoto, string source)
        {
            var isMonumentVerified = monumentService.IsMonumentVerified(monumentId);

            if (isMonumentVerified != true)
                return false;

            byte[] photo;
            using (var binaryReader = new BinaryReader(newPhoto.OpenReadStream()))
            {
                photo = binaryReader.ReadBytes((int)newPhoto.Length);
            }

            db.NewPhotos.Add(new NewPhoto()
            {
                Source = source,
                MonumentId = monumentId,
                Picture = photo
            });

            db.SaveChanges();

            return true;
        }

        public void DeleteNewPhoto(long newPhotoId)
        {
            var photo = db.NewPhotos.Find(newPhotoId);

            db.NewPhotos.Remove(photo);
            db.SaveChanges();
        }

        public List<NewPhoto> GetNewPhotos(long monumentId)
        {
            return db.NewPhotos.Where(p => p.MonumentId == monumentId).ToList();
        }

        public List<OldPhoto> GetOldPhotos(long monumentId)
        {
            return db.OldPhotos.Where(p => p.MonumentId == monumentId).ToList();
        }
    }
}
