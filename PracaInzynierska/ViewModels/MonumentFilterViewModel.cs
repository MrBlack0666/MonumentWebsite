using API.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.ViewModels
{
    public class MonumentFilterViewModel
    {
        public int LastBlockNumber { get; set; }
        public string Name { get; set; }
        public int[] CitiesIds { get; set; }
        public int MinAverageMark { get; set; }
        public MonumentType[] MonumentTypes { get; set; }
        public bool OnlyFree { get; set; }
        public string SortingName { get; set; }
        public bool Descending { get; set; }
    }
}
