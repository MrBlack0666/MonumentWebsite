using API.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace API.Models
{
    public class Message
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public ReportingReason ReportingReason { get; set; }
        public bool WasRead { get; set; }

        public string SenderId { get; set; }
        [ForeignKey("SenderId")]
        public virtual User Sender { get; set; }
    }
}
