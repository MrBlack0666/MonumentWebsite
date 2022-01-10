using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.ViewModels
{
    public class BannedWordFilterViewModel
    {
        public int? RenderPageNumber { get; set; }
        public string Name { get; set; }
        public bool Descending { get; set; }
    }
}
