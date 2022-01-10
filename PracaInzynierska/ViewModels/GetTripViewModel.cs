using API.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.ViewModels
{
    public class GetTripViewModel
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public SightseeingTime SightseeingTime { get; set; }
        public string CityNames { get; set; }
        public string Creator { get; set; }
        public List<MonumentInTripViewModel> Monuments { get; set; }
        public int NumberOfMonuments { get; set; }
    }
}
