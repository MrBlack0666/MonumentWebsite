using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace API.Models
{
    public class MonumentTrip
    {
        [Key][Column(Order = 0)]
        public long TripId { get; set; }
        [ForeignKey("TripId")]
        public Trip Trip { get; set; }

        [Key][Column(Order = 1)]
        public long MonumentId { get; set; }
        [ForeignKey("MonumentId")]
        public Monument Monument { get; set; }

        public int Position { get; set; }
    }
}
