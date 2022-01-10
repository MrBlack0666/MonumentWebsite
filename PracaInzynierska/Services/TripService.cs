using API.Database;
using API.Enums;
using API.Models;
using API.ViewModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Services
{
    public class TripService : ITripService
    {
        private DatabaseContext db;
        private IMonumentService monumentService;
        private IAuthService authService;

        private const int MAX_NAME_LENGTH = 50;
        private const int MAX_DESCRIPTION_LENGTH = 2000;
        private const int NUMBER_OF_TRIPS_IN_BLOCK = 30;

        public TripService(DatabaseContext db, IMonumentService monumentService, IAuthService authService)
        {
            this.db = db;
            this.monumentService = monumentService;
            this.authService = authService;
        }

        public bool AddTrip(string name, string description, string userName, SightseeingTime sightseeingTime, TripMonumentIdPositionViewModel[] monuments)
        {
            if (name.Length <= 0 && name.Length > MAX_NAME_LENGTH || description.Length > MAX_DESCRIPTION_LENGTH)
                return false;

            var userId = authService.GetUserId(userName);

            List<MonumentTrip> monumentTrips = new List<MonumentTrip>();

            var trip = new Trip()
            {
                CreatorId = userId,
                Description = description,
                Name = name,
                SightseeingTime = sightseeingTime
            };


            foreach (var monument in monuments)
            {
                if (monumentService.IsMonumentVerified(monument.MonumentId) != true)
                    return false;

                monumentTrips.Add(new MonumentTrip()
                {
                    MonumentId = monument.MonumentId,
                    Position = monument.Position,
                    Trip = trip
                });
            }

            trip.Monuments = monumentTrips;

            db.Trips.Add(trip);
            db.SaveChanges();

            return true;
        }

        public bool EditTrip(long tripId, string name, string description, string userName, SightseeingTime sightseeingTime, TripMonumentIdPositionViewModel[] monuments)
        {
            if (name.Length <= 0 && name.Length > MAX_NAME_LENGTH || description.Length > MAX_DESCRIPTION_LENGTH)
                return false;

            var userId = authService.GetUserId(userName);

            var trip = db.Trips.FirstOrDefault(t => t.Id == tripId);

            if (trip == null || trip.CreatorId != userId)
                return false;

            trip.Description = description;
            trip.Name = name;
            trip.SightseeingTime = sightseeingTime;

            List<MonumentTrip> monumentTrips = new List<MonumentTrip>();

            var tripMonumentList = db.MonumentsTrips.Where(mt => mt.TripId == tripId).ToList();

            db.MonumentsTrips.RemoveRange(tripMonumentList);

            foreach (var monument in monuments)
            {
                if (monumentService.IsMonumentVerified(monument.MonumentId) != true)
                    return false;

                monumentTrips.Add(new MonumentTrip()
                {
                    MonumentId = monument.MonumentId,
                    Position = monument.Position,
                    Trip = trip
                });
            }

            trip.Monuments = monumentTrips;

            db.SaveChanges();

            return true;
        }

        public void DeleteTrip(long tripId, string userId, bool isUserAdmin)
        {
            var trip = db.Trips.Find(tripId);

            if (userId != trip.CreatorId && !isUserAdmin)
                return;

            db.Trips.Remove(trip);
            db.SaveChanges();
        }

        public GetTripsViewModel GetTrips(int lastBlockNumber, string name, bool onlyFree, SightseeingTime[] sightseeingTimes, int[] citiesIds)
        {
            var trips = db.Trips.Include(t => t.Creator).Include(t => t.Monuments).ThenInclude(mt => mt.Monument)
                .ThenInclude(m => m.City).Where(t => (string.IsNullOrWhiteSpace(name) || t.Name.Contains(name.ToLower())) && (sightseeingTimes == null || sightseeingTimes.Length <= 0 || sightseeingTimes.Contains(t.SightseeingTime))
                && (citiesIds == null || citiesIds.Length <= 0 || t.Monuments.Any(m => citiesIds.Contains(m.Monument.CityId)))
                && (!onlyFree || !t.Monuments.Any(m => m.Monument.IsDue == true)) ).ToList();

            List<GetTripViewModel> returnedTrips = new List<GetTripViewModel>();

            long min = (lastBlockNumber + 1) * NUMBER_OF_TRIPS_IN_BLOCK;
            long max = (lastBlockNumber + 2) * NUMBER_OF_TRIPS_IN_BLOCK;
            long i = 0;
            foreach (var t in trips)
            {
                string cityNames = "";
                List<MonumentInTripViewModel> monuments = new List<MonumentInTripViewModel>();
                List<int> cities = new List<int>();
                int j = 0;
                foreach(var mon in t.Monuments.OrderBy(m => m.Position))
                {
                    if(!cities.Contains(mon.Monument.CityId))
                    {
                        cities.Add(mon.Monument.CityId);

                        cityNames += mon.Monument.City.Name + ", ";
                    }

                    if(j < 2)
                    {
                        j++;
                        monuments.Add(new MonumentInTripViewModel()
                        {
                            Id = mon.Monument.Id,
                            Name = mon.Monument.Name,
                            MainPhoto = mon.Monument.MainPhoto
                        });
                    }
                }
                if(cityNames.Length > 2)
                    cityNames = cityNames.Substring(0, cityNames.Length - 2);

                if (i >= min && i < max)
                {
                    returnedTrips.Add(new GetTripViewModel()
                    {
                        Id = t.Id,
                        Creator = t.Creator.UserName,
                        Name = t.Name,
                        SightseeingTime = t.SightseeingTime,
                        Monuments = monuments,
                        NumberOfMonuments = t.Monuments.Count,
                        CityNames = cityNames,
                    });
                }
                if (i >= max)
                    break;
                i++;
            }

            var returnedValue = new GetTripsViewModel()
            {
                AllBlocks = (int)Math.Ceiling(Convert.ToDecimal(trips.Count / (double)NUMBER_OF_TRIPS_IN_BLOCK)),
                BlockNumber = lastBlockNumber + 1,
                Trips = returnedTrips
            };

            return returnedValue;
        }

        public Trip GetTripDetails(long tripId)
        {
            return db.Trips.Include(t => t.Creator).Include(t => t.Monuments).ThenInclude(mt => mt.Monument)
                .ThenInclude(m => m.City).FirstOrDefault(t => t.Id == tripId);
        }

        public List<SelectViewModel> GetSightseeingTimes()
        {
            var types = new List<SelectViewModel>();
            foreach (var type in Enum.GetValues(typeof(SightseeingTime)))
            {
                types.Add(new SelectViewModel()
                {
                    Value = (int)type,
                    Label = StringValueClass.GetStringValue((Enum)type)
                });
            }
            return types;
        }
    }
}
