using API.Enums;
using API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.ViewModels
{
    public class ReturnedMonumentViewModel
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public decimal AverageMark { get; set; }
        public MonumentType MonumentType { get; set; }
        public byte[] MainPhoto { get; set; }
        public bool? IsDue { get; set; }
        public int CityId { get; set; }
        public City City { get; set; }
    }
}
