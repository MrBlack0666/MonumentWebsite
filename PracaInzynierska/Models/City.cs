using System;
using System.Collections.Generic;
using System.Text;

namespace API.Models
{
    public class City
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public virtual ICollection<Monument> Monumets { get; set; }
    }
}
