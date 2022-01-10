using API.Enums;
using API.Models;
using API.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Services
{
    public interface ITripService
    {
        bool AddTrip(string name, string description, string userName, SightseeingTime sightseeingTime, TripMonumentIdPositionViewModel[] monuments);
        bool EditTrip(long tripId, string name, string description, string userName, SightseeingTime sightseeingTime, TripMonumentIdPositionViewModel[] monuments);
        void DeleteTrip(long tripId, string userId, bool isUserAdmin);
        GetTripsViewModel GetTrips(int lastBlockNumber, string name, bool onlyFree, SightseeingTime[] sightseeingTimes, int[] citiesIds);
        Trip GetTripDetails(long tripId);
        List<SelectViewModel> GetSightseeingTimes();
    }
}
