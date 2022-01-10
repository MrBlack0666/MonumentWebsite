using API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.ViewModels
{
    public class ReturnedBannedWordsViewModel
    {
        public List<BannedWord> BannedWords { get; set; }
        public int PageNumber { get; set; }
        public int AllPages { get; set; }
    }
}
