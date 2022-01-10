using API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.ViewModels
{
    public class GetTripsViewModel
    {
        public int BlockNumber { get; set; }
        public int AllBlocks { get; set; }
        public List<GetTripViewModel> Trips { get; set; }
    }
}
