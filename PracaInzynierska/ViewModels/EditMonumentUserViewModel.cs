using API.Enums;
using API.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.ViewModels
{
    public class EditMonumentUserViewModel
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string CreationDate { get; set; }
        public string Longitude { get; set; }
        public string Latitude { get; set; }
        public string Description { get; set; }
        public MonumentType MonumentType { get; set; }
        public int IsDue { get; set; }
        public string Address { get; set; }
        public string CityName { get; set; }
        public IFormFile Picture { get; set; }
    }
}
