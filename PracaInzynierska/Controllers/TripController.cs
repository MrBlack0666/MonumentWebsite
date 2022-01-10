using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Enums;
using API.Services;
using API.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TripController : ControllerBase
    {
        private ITripService tripService;
        IAuthService authService;

        public TripController(ITripService tripService, IAuthService authService)
        {
            this.tripService = tripService;
            this.authService = authService;
        }

        [Route("addtrip")]
        [HttpPost]
        public IActionResult AddTrip([FromBody] TripViewModel trip)
        {
            try
            {
                var result = tripService.AddTrip(trip.Name, trip.Description, trip.UserName, trip.SightseeingTime, trip.Monuments);
                return result ? (IActionResult)Ok() : NotFound();
            }
            catch
            {
                return NotFound();
            }
        }

        [Route("edittrip")]
        [HttpPost]
        public IActionResult EditTrip([FromBody] TripViewModel trip)
        {
            try
            {
                var result = tripService.EditTrip(trip.TripId, trip.Name, trip.Description, trip.UserName, trip.SightseeingTime, trip.Monuments);
                return result? (IActionResult) Ok() : NotFound();
            }
            catch(Exception e)
            {
                return NotFound();
            }
        }

        [Route("deletetrip")]
        [HttpPost]
        public IActionResult DeleteTrip([FromBody] TripViewModel trip)
        {
            try
            {
                var userId = authService.GetUserId(trip.UserName);
                var isUserAdmin = authService.IsUserAdmin(trip.UserName);
                tripService.DeleteTrip(trip.TripId, userId, isUserAdmin);
                return Ok();
            }
            catch(Exception e)
            {
                return NotFound();
            }
        }

        [Route("gettrips")]
        [HttpPost]
        public IActionResult GetTrips([FromBody] TripFilterViewModel filters)
        {
            try
            {
                var trips = tripService.GetTrips(filters.LastBlockNumber, filters.Name, filters.OnlyFree, filters.SightseeingTimes, filters.CitiesIds);
                return Ok(trips);
            }
            catch
            {
                return NotFound();
            }
        }
        [Route("gettripdetails/{id}")]
        [HttpGet]
        public IActionResult GetTripDetails([FromRoute] long id)
        {
            try
            {
                var trip = tripService.GetTripDetails(id);
                return Ok(trip);
            }
            catch
            {
                return NotFound();
            }
        }

        [Route("getsightseeingtimes")]
        [HttpGet]
        public IActionResult GetSightseeingTimes()
        {
            try
            {
                return Ok(tripService.GetSightseeingTimes());
            }
            catch
            {
                return NotFound();
            }
        }
    }
}