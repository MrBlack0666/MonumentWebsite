using API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Services
{
    public interface IMarkService
    {
        bool AddMark(int grade, string comment, long monumentId, string userName);
        bool EditMark(long markId, int grade, string comment, string userName);
        void DeleteMark(long markId, string userId, bool isUserAdmin);
        void UpdateAverageMark(long monumentId);
        List<Mark> GetYourMarks(string userName);
    }
}
