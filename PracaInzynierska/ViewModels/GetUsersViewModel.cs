using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.ViewModels
{
    public class GetUsersViewModel
    {
        public int Page { get; set; }
        public int AllPages { get; set; }
        public List<UserViewModel> Users { get; set; }
    }
}
