using API.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace API.Models
{
    public class Trip
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public SightseeingTime SightseeingTime { get; set; }

        public string CreatorId { get; set; }
        [ForeignKey("CreatorId")]
        public virtual User Creator { get; set; }

        public virtual ICollection<MonumentTrip> Monuments { get; set; }
    }
}
