using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.ViewModels
{
    public class MonumentInTripViewModel
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public byte[] MainPhoto { get; set; }
    }
}
