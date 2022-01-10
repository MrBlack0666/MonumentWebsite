using API.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.ViewModels
{
    public class TripViewModel
    {
        public long TripId { get; set; }
        public string Name { get; set; }
        public SightseeingTime SightseeingTime { get; set; }
        public string Description { get; set; }
        public string UserName { get; set; }
        public TripMonumentIdPositionViewModel[] Monuments { get; set; }
    }
}
