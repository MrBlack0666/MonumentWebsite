using API.Models;
using API.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Services
{
    public interface IMonumentService
    {
        bool? AddMonument(AddMonumentViewModel addMonument);
        bool? EditMonumentUser(EditMonumentUserViewModel editMonument);
        bool DeleteMonument(long id, string username);
        void AcceptAddedMonument(long monumentId, bool acceptation);
        List<MapMonumentDetailsViewModel> GetAllMonumentsForMap(MonumentMapFilterViewModel filters);
        ReturnedMonumentsViewModel GetMonuments(MonumentFilterViewModel filters);
        Monument GetMonumentDetails(long monumentId);
        List<Monument> GetUnverifiedMonuments();
        bool? IsMonumentVerified(long monumentId);
        ICollection<string> GetMonumentTypes();
        List<SelectMonumentTypeViewModel> GetMonumentTypesToSelect();
        List<Monument> GetYourUnverifiedMonuments(string username);
        List<SelectViewModel> GetMonumentsSelect();
        List<MonumentSelectViewModel> GetMonumentsToAddTrip();
    }
}
