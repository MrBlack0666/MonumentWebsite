using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace API.Models
{
    public class User : IdentityUser
    {
        public User() : base()
        {

        }
        public override string Id { get; set; }
        public override string UserName { get; set; }
        public override string Email { get; set; }

        public virtual ICollection<Monument> MonumentsCreated { get; set; }
        public virtual ICollection<Message> Messages { get; set; }
        public virtual ICollection<Mark> Marks { get; set; }
        public virtual ICollection<Titbit> Titbits { get; set; }
    }
}
