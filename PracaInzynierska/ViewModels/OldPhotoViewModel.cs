using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.ViewModels
{
    public class OldPhotoViewModel
    {
        public long MonumentId { get; set; }
        public IFormFile OldPhoto { get; set; }
        public int? Date { get; set; }
        public string Source { get; set; }
    }
}
