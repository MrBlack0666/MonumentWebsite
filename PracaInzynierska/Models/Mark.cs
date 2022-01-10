using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace API.Models
{
    public class Mark
    {
        public long Id { get; set; }
        public int Grade { get; set; }
        public string Comment { get; set; }
        public DateTime CreationDate { get; set; }

        public long MonumentId { get; set; }
        [ForeignKey("MonumentId")]
        public virtual Monument Monument { get; set; }

        public string UserId { get; set; }
        [ForeignKey("UserId")]
        public virtual User User { get; set; }
    }
}
