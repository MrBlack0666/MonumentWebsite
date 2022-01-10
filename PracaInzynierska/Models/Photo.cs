using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace API.Models
{
    public class Photo
    {
        public long Id { get; set; }
        public byte[] Picture { get; set; }
        public string Source { get; set; }

        public long MonumentId { get; set; }
        [ForeignKey("MonumentId")]
        public virtual Monument Monument { get; set; }
    }
}
