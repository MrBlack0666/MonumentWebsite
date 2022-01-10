using API.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.ViewModels
{
    public class TripFilterViewModel
    {
        public int LastBlockNumber { get; set; }
        public string Name { get; set; }
        public bool OnlyFree { get; set; }
        public SightseeingTime[] SightseeingTimes { get; set; }
        public int[] CitiesIds { get; set; }
    }
}
