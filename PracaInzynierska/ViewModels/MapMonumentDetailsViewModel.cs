using API.Enums;
using API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.ViewModels
{
    public class MapMonumentDetailsViewModel
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string CreationDate { get; set; }
        public decimal Longitude { get; set; }
        public decimal Latitude { get; set; }
        public decimal AverageMark { get; set; }
        public string Description { get; set; }
        public MonumentType MonumentType { get; set; }
        public bool? IsDue { get; set; }
        public string Address { get; set; }
        public byte[] MainPhoto { get; set; }

        public int CityId { get; set; }
        public string CityName { get; set; }
    }
}
