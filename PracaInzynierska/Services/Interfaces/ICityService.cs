using API.Models;
using API.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Services
{
    public interface ICityService
    {
        bool AddCity(string name);
        int GetCityId(string name);
        List<SelectViewModel> GetCities();
    }
}
