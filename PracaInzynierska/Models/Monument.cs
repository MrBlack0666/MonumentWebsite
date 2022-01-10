using API.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace API.Models
{
    public class Monument
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string CreationDate { get; set; }
        public decimal Longitude { get; set; }
        public decimal Latitude { get; set; }
        public decimal AverageMark { get; set; }
        public string Description { get; set; }
        public MonumentType MonumentType { get; set; }
        public bool? IsDue { get; set; }
        public bool IsVerified { get; set; }
        public string Address { get; set; }
        public byte[] MainPhoto { get; set; }

        public int CityId { get; set; }
        [ForeignKey("CityId")]
        public virtual City City { get; set; }

        public string CreatorId { get; set; }
        [ForeignKey("CreatorId")]
        public virtual User Creator { get; set; }

        public virtual ICollection<Titbit> Titbits { get; set; }
        public virtual ICollection<Mark> Marks { get; set; }
        public virtual ICollection<OldPhoto> OldPhotos { get; set; }
        public virtual ICollection<NewPhoto> NewPhotos { get; set; }
        public virtual ICollection<MonumentTrip> Trips { get; set; }
    }
}
