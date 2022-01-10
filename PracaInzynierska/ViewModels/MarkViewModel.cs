using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.ViewModels
{
    public class MarkViewModel
    {
        public long MarkId { get; set; }
        public int Grade { get; set; }
        public string Comment { get; set; }
        public long MonumentId { get; set; }
        public string UserName { get; set; }
    }
}
