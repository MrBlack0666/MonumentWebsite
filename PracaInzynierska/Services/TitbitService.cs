using API.Database;
using API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Services
{
    public class TitbitService : ITitbitService
    {
        private DatabaseContext db;
        private IMonumentService monumentService;

        private const int MAX_TITBIT_LENGTH = 2000;
        private const int MAX_NAME_LENGTH = 40;

        public TitbitService(DatabaseContext db, IMonumentService monumentService)
        {
            this.db = db;
            this.monumentService = monumentService;
        }

        public bool AddTitbit(string name, string description, long monumentId, string userId)
        {
            if(description.Length > MAX_TITBIT_LENGTH || description.Length <= 0 ||
                name.Length > MAX_NAME_LENGTH || name.Length <= 0)
                return false;

            var isMonumentVerified = monumentService.IsMonumentVerified(monumentId);

            if (isMonumentVerified != true)
                return false;

            db.Titbits.Add(new Titbit()
            {
                Name = name,
                Description = description,
                MonumentId = monumentId,
                CreatorId = userId
            });
            db.SaveChanges();

            return true;
        }

        public bool EditTitbit(long titbitId, string name, string description, string userId, bool isUserAdmin)
        {
            if (description.Length > MAX_TITBIT_LENGTH || description.Length <= 0 ||
                name.Length > MAX_NAME_LENGTH || name.Length <= 0)
                return false;

            var titbit = db.Titbits.FirstOrDefault(t => t.Id == titbitId);

            if (titbit == null || (titbit.CreatorId != userId && !isUserAdmin))
                return false;

            titbit.Name = name;
            titbit.Description = description;
            db.SaveChanges();

            return true;
        }

        public void DeleteTitbit(long titbitId, string userId, bool isUserAdmin)
        {
            var titbit = db.Titbits.Find(titbitId);

            if (titbit.CreatorId != userId && !isUserAdmin)
                return;

            db.Titbits.Remove(titbit);
            db.SaveChanges();
        }
    }
}
