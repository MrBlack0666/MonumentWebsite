using API.Database;
using API.Models;
using API.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Services
{
    public class CityService : ICityService
    {
        private readonly DatabaseContext db;

        public CityService(DatabaseContext db)
        {
            this.db = db;
        }

        public bool AddCity(string name)
        {
            var cityExists = db.Cities.Any(c => c.Name.ToLower() == name.ToLower());
            if (cityExists)
                return false;

            db.Cities.Add(new City()
            {
                Name = name
            });
            db.SaveChanges();

            return true;
        }

        public int GetCityId(string name)
        {
            return db.Cities.FirstOrDefault(c => c.Name.ToLower() == name.ToLower()).Id;
        }

        public List<SelectViewModel> GetCities()
        {
            var list = db.Cities.ToList();

            List<SelectViewModel> cities = new List<SelectViewModel>();

            foreach(var city in list)
            {
                cities.Add(new SelectViewModel()
                {
                    Value = city.Id,
                    Label = city.Name
                });
            }

            return cities;
        }
    }
}
