using API.Database;
using API.Enums;
using API.Models;
using API.ViewModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace API.Services
{
    public class MonumentService : IMonumentService
    {
        private readonly DatabaseContext db;
        private ICityService cityService;
        private IAuthService authService;

        private const int NUMBER_OF_MONUMENTS_IN_BLOCK = 30;

        public MonumentService(DatabaseContext db, ICityService cityService, IAuthService authService)
        {
            this.db = db;
            this.cityService = cityService;
            this.authService = authService;
        }

        public bool? AddMonument(AddMonumentViewModel addMonument)
        {
            var clone = (CultureInfo)CultureInfo.CurrentCulture.Clone();
            clone.NumberFormat.NumberDecimalSeparator = ".";

            if (addMonument.Latitude.Length <= 0 && addMonument.Longitude.Length <= 0)
                return false;

            decimal lat, lng;
            lat = Convert.ToDecimal(addMonument.Latitude, clone);
            lng = Convert.ToDecimal(addMonument.Longitude, clone);

            if (addMonument.Picture == null || addMonument.Picture.Length <= 0)
                return false;

            byte[] img = null;
            using (var binaryReader = new BinaryReader(addMonument.Picture.OpenReadStream()))
            {
                img = binaryReader.ReadBytes((int)addMonument.Picture.Length);
            }

            if (string.IsNullOrEmpty(addMonument.Name) || string.IsNullOrWhiteSpace(addMonument.Name)
                || addMonument.Description.Length > 2000 && addMonument.Name.Length > 40 || addMonument.CreationDate.Length > 30
                || addMonument.CityName.Length <= 0 && addMonument.Address.Length <= 0)
                return false;

            bool isVerified = authService.IsUserAdmin(addMonument.UserName);

            var userId = authService.GetUserId(addMonument.UserName);

            var sameMonumentName = db.Monuments.Any(m => m.Name == addMonument.Name);

            if (sameMonumentName)
                return null;

            cityService.AddCity(addMonument.CityName);

            var cityId = cityService.GetCityId(addMonument.CityName);

            bool? isDue = null;
            if(addMonument.IsDue == 1)
            {
                isDue = false;
            }
            else if(addMonument.IsDue == 2)
            {
                isDue = true;
            }

            var mx = new Monument()
            {
                Name = addMonument.Name,
                CreationDate = addMonument.CreationDate,
                Longitude = lng,
                Latitude = lat,
                AverageMark = 0,
                Description = addMonument.Description,
                MonumentType = addMonument.MonumentType,
                IsDue = isDue,
                IsVerified = isVerified,
                Address = addMonument.Address,
                CityId = cityId,
                MainPhoto = img,
                CreatorId = userId
            };
            db.Monuments.Add(mx);
            db.SaveChanges();

            return true;
        }

        public bool? EditMonumentUser(EditMonumentUserViewModel editMonument)
        {
            var monument = db.Monuments.FirstOrDefault(m => m.Id == editMonument.Id);

            if (monument == null)
                return false;

            var sameMonumentName = db.Monuments.Any(m => m.Name == editMonument.Name && m.Id != editMonument.Id);

            if (sameMonumentName)
                return null;

            if (string.IsNullOrEmpty(editMonument.Name) || string.IsNullOrWhiteSpace(editMonument.Name)
                || editMonument.Description.Length > 2000 && editMonument.Name.Length > 40 || editMonument.CreationDate.Length > 30
                || editMonument.CityName.Length <= 0 && editMonument.Address.Length <= 0)
                return false;

            var clone = (CultureInfo)CultureInfo.CurrentCulture.Clone();
            clone.NumberFormat.NumberDecimalSeparator = ".";

            if (editMonument.Latitude.Length <= 0 && editMonument.Longitude.Length <= 0)
                return false;

            decimal lat, lng;
            lat = Convert.ToDecimal(editMonument.Latitude, clone);
            lng = Convert.ToDecimal(editMonument.Longitude, clone);

            byte[] img = null;
            if (editMonument.Picture != null && editMonument.Picture.Length > 0)
            {
                using (var binaryReader = new BinaryReader(editMonument.Picture.OpenReadStream()))
                {
                    img = binaryReader.ReadBytes((int)editMonument.Picture.Length);
                }
            }
               

            cityService.AddCity(editMonument.CityName);

            var cityId = cityService.GetCityId(editMonument.CityName);

            bool? isDue = null;
            if (editMonument.IsDue == 1)
            {
                isDue = false;
            }
            else if (editMonument.IsDue == 2)
            {
                isDue = true;
            }

            monument.Name = editMonument.Name;
            monument.CreationDate = editMonument.CreationDate;
            monument.Longitude = lng;
            monument.Latitude = lat;
            monument.AverageMark = 0;
            monument.Description = editMonument.Description;
            monument.MonumentType = editMonument.MonumentType;
            monument.IsDue = isDue;
            monument.Address = editMonument.Address;
            monument.CityId = cityId;

            if(img != null)
            {
                monument.MainPhoto = img;
            }

            db.SaveChanges();

            return true;
        }

        public bool DeleteMonument(long id, string username)
        {
            if (!authService.IsUserAdmin(username))
                return false;

            var monument = db.Monuments.Find(id);

            db.Monuments.Remove(monument);
            db.SaveChanges();
            return true;
        }

        public void AcceptAddedMonument(long monumentId, bool acceptation)
        {
            var monument = db.Monuments.FirstOrDefault(m => m.Id == monumentId);

            if (monument == null)
                return;

            if(acceptation)
            {
                monument.IsVerified = true;
                db.SaveChanges();
            }
            else
            {
                DeleteMonument(monumentId, "admin");
            }
        }

        public List<MapMonumentDetailsViewModel> GetAllMonumentsForMap(MonumentMapFilterViewModel filters)
        {
            var mon = db.Monuments.Include(m => m.City).Where(m => m.IsVerified);

            //filters
            mon = mon.Where(m => (string.IsNullOrEmpty(filters.Name) || m.Name.Contains(filters.Name)) && (filters.CitiesIds == null || filters.CitiesIds.Length <= 0 || filters.CitiesIds.Contains(m.CityId)) &&
                        m.AverageMark >= filters.MinAverageMark && (filters.MonumentTypes == null || filters.MonumentTypes.Length <= 0 || filters.MonumentTypes.Contains(m.MonumentType)));

            if (filters.OnlyFree)
                mon = mon.Where(m => m.IsDue != true);

            var monuments = mon.ToList();

            List<MapMonumentDetailsViewModel> monumentsVM = new List<MapMonumentDetailsViewModel>();

            foreach(var monument in monuments)
            {
                monumentsVM.Add(new MapMonumentDetailsViewModel()
                {
                    Id = monument.Id,
                    Address = monument.Address,
                    AverageMark = monument.AverageMark,
                    CityId = monument.CityId,
                    CityName = monument.City.Name,
                    CreationDate = monument.CreationDate,
                    Description = monument.Description,
                    IsDue = monument.IsDue,
                    Latitude = monument.Latitude,
                    Longitude = monument.Longitude,
                    MainPhoto = monument.MainPhoto,
                    MonumentType = monument.MonumentType,
                    Name = monument.Name
                });

            }

            return monumentsVM;
        }

        public ReturnedMonumentsViewModel GetMonuments(MonumentFilterViewModel filters)
        {
            var mon = db.Monuments.Include(m => m.City).Where(m => m.IsVerified);

            //filters
            mon = mon.Where(m => (string.IsNullOrWhiteSpace(filters.Name) || m.Name.Contains(filters.Name)) && (filters.CitiesIds == null || filters.CitiesIds.Length <=0 || filters.CitiesIds.Contains(m.CityId)) &&
                        m.AverageMark >= filters.MinAverageMark && (filters.MonumentTypes == null || filters.MonumentTypes.Length <= 0 || filters.MonumentTypes.Contains(m.MonumentType)));

            if (filters.OnlyFree)
                mon = mon.Where(m => m.IsDue != true);

            //sort
            if(!string.IsNullOrWhiteSpace(filters.SortingName))
            {
                switch (filters.SortingName.ToLower())
                {
                    case "name":
                        if (!filters.Descending)
                            mon = mon.OrderBy(m => m.Name);
                        else
                            mon = mon.OrderByDescending(m => m.Name);
                        break;
                    case "averagemark":
                        if (!filters.Descending)
                            mon = mon.OrderBy(m => m.AverageMark);
                        else
                            mon = mon.OrderByDescending(m => m.AverageMark);
                        break;
                    case "isdue":
                        if (!filters.Descending)
                            mon = mon.OrderBy(m => m.IsDue);
                        else
                            mon = mon.OrderByDescending(m => m.IsDue);
                        break;
                    case "city":
                        if (!filters.Descending)
                            mon = mon.OrderBy(m => m.City.Name);
                        else
                            mon = mon.OrderByDescending(m => m.City.Name);
                        break;
                }
            }

            var monuments = mon.ToList();

            ReturnedMonumentsViewModel returnedMonuments = new ReturnedMonumentsViewModel()
            {
                AllBlocks = (int)Math.Ceiling(Convert.ToDecimal(monuments.Count / (double)NUMBER_OF_MONUMENTS_IN_BLOCK)),
                BlockNumber = filters.LastBlockNumber + 1,
                Monuments = new List<ReturnedMonumentViewModel>()
            };

            long min = (filters.LastBlockNumber + 1) * NUMBER_OF_MONUMENTS_IN_BLOCK;
            long max = (filters.LastBlockNumber + 2) * NUMBER_OF_MONUMENTS_IN_BLOCK;

            long i = 0;

            foreach(var monument in monuments)
            {
                if(i >= min && i < max)
                {
                    returnedMonuments.Monuments.Add(new ReturnedMonumentViewModel()
                    {
                        Id = monument.Id,
                        AverageMark = monument.AverageMark,
                        City = monument.City,
                        CityId = monument.CityId,
                        IsDue = monument.IsDue,
                        MainPhoto = monument.MainPhoto,
                        MonumentType = monument.MonumentType,
                        Name = monument.Name
                    });
                }
                if (i >= max)
                    break;
                i++;
            }

            return returnedMonuments;
        }

        public Monument GetMonumentDetails(long monumentId)
        {
            var monument = db.Monuments
                .Include(m => m.City).Include(m => m.Creator).Include(m => m.Marks).ThenInclude(mark => mark.User).Include(m => m.NewPhotos)
                .Include(m => m.OldPhotos).Include(m => m.Titbits).ThenInclude(t => t.Creator).Include(m => m.Trips).ThenInclude(t => t.Trip)
                .FirstOrDefault(m => m.Id == monumentId);
            return monument;
        }

        public List<Monument> GetUnverifiedMonuments()
        {
            var monuments = db.Monuments.Include(m => m.City).Include(m => m.Creator).Where(m => !m.IsVerified).ToList();
            return monuments;
        }

        public bool? IsMonumentVerified(long monumentId)
        {
            var monument = db.Monuments.FirstOrDefault(m => m.Id == monumentId);

            if (monument == null)
                return null;

            return monument.IsVerified;
        }

        public ICollection<string> GetMonumentTypes()
        {
            var types = new Dictionary<int, string>();

            foreach(var type in Enum.GetValues(typeof(MonumentType)))
            {
                types.Add((int)type, type.ToString());
            }
            return types.Values;
        }

        public List<SelectMonumentTypeViewModel> GetMonumentTypesToSelect()
        {
            List<SelectMonumentTypeViewModel> types = new List<SelectMonumentTypeViewModel>();
            foreach (var type in Enum.GetValues(typeof(MonumentType)))
            {
                types.Add(new SelectMonumentTypeViewModel()
                {
                    Value = (int)type,
                    Label = type.ToString()
            
                });
            }
            return types;
        }

        public List<Monument> GetYourUnverifiedMonuments(string username)
        {
            return db.Monuments.Include(m => m.City).Include(m => m.Creator).Where(m => m.IsVerified != true && m.Creator.UserName == username).ToList();
        }

        public List<SelectViewModel> GetMonumentsSelect()
        {
            var monuments = new List<SelectViewModel>();

            var mon = db.Monuments.Include(m => m.City).Where(m => m.IsVerified).OrderBy(m => m.Name).ToList();

            foreach(var m in mon)
            {
                monuments.Add(new SelectViewModel()
                {
                    Value = m.Id,
                    Label = m.Name +", " + m.City.Name
                });
            }

            return monuments;
        }

        public List<MonumentSelectViewModel> GetMonumentsToAddTrip()
        {
            var monuments = new List<MonumentSelectViewModel>();

            var mon = db.Monuments.Include(m => m.City).Where(m => m.IsVerified).OrderBy(m => m.Name).ToList();

            foreach (var m in mon)
            {
                monuments.Add(new MonumentSelectViewModel()
                {
                    Id = m.Id,
                    Value = m.Id,
                    Label = m.Name,
                    CityName = m.City.Name,
                    Latitude = m.Latitude,
                    Longitude = m.Longitude
                });
            }

            return monuments;
        }
    }
}
