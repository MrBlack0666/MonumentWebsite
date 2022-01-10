using API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.ViewModels
{
    public class ReturnedMonumentsViewModel
    {
        public List<ReturnedMonumentViewModel> Monuments { get; set; }
        public int BlockNumber { get; set; }
        public int AllBlocks { get; set; }
    }
}
