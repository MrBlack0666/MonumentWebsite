using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace API.Models
{
    public class BannedWord
    {
        [Key]
        public string Word { get; set; }
    }
}
