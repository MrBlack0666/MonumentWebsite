using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Services
{
    public interface ITitbitService
    {
        bool AddTitbit(string name, string description, long monumentId, string userId);
        bool EditTitbit(long titbitId, string name, string description, string userId, bool isUserAdmin);
        void DeleteTitbit(long titbitId, string userId, bool isUserAdmin);
    }
}
