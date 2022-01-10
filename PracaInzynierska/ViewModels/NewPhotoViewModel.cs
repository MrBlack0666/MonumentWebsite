using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.ViewModels
{
    public class NewPhotoViewModel
    {
        public long MonumentId { get; set; }
        public IFormFile NewPhoto { get; set; }
        public string Source { get; set; }
    }
}
