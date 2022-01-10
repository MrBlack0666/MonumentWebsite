using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace API.Models
{
    public class Titbit
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        public long MonumentId { get; set; }
        [ForeignKey("MonumentId")]
        public virtual Monument Monument { get; set; }

        public string CreatorId { get; set; }
        [ForeignKey("CreatorId")]
        public virtual User Creator { get; set; }
    }
}
