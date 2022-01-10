using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Services;
using API.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MonumentController : ControllerBase
    {
        private IMonumentService monumentService;

        public MonumentController(IMonumentService monumentService)
        {
            this.monumentService = monumentService;
        }

        [Route("addmonument")]
        [HttpPost]
        public IActionResult AddMonument([FromForm] AddMonumentViewModel monument)
        {
            try
            {
                var result = monumentService.AddMonument(monument);

                if (result == true)
                    return (IActionResult)Ok();
                else if (result == false)
                    return NotFound();
                else
                    return NoContent();
            }
            catch
            {
                return NotFound();
            }
        }

        [Route("editmonument")]
        [HttpPost]
        public IActionResult EditMonumentUser([FromForm] EditMonumentUserViewModel editMonumentUserVM)
        {
            try
            {
                var result = monumentService.EditMonumentUser(editMonumentUserVM);

                if (result == true)
                    return (IActionResult)Ok();
                else if (result == false)
                    return NotFound();
                else
                    return NoContent();
            }
            catch
            {
                return NotFound();
            }
        }

        [Route("deletemonument")]
        [HttpPost]
        public IActionResult DeleteMonument([FromBody] DeleteMonumentViewModel monument)
        {
            try
            {
                monumentService.DeleteMonument(monument.MonumentId, monument.UserName);

                return Ok();
            }
            catch
            {
                return NotFound();
            }
        }

        [Route("acceptaddedmonument/{id}/{acceptation}")]
        [HttpPost]
        public IActionResult AcceptAddedMonument([FromRoute] long id,[FromRoute] bool acceptation)
        {
            try
            {
                monumentService.AcceptAddedMonument(id, acceptation);

                return Ok();
            }
            catch
            {
                return NotFound();
            }
        }

        [Route("getmonuments")]
        [HttpPost]
        public IActionResult GetMonuments([FromBody] MonumentFilterViewModel filters)
        {
            try
            {
                var result = monumentService.GetMonuments(filters);
                return Ok(result);
            }
            catch
            {
                return NotFound();
            }
        }

        [Route("getmonumentdetails/{id}")]
        [HttpGet]
        public IActionResult GetMonumentDetails([FromRoute] long id)
        {
            try
            {
                return Ok(monumentService.GetMonumentDetails(id));
            }
            catch
            {
                return NotFound();
            }
        }

        [Route("getunverifiedmonuments")]
        [HttpGet]
        public IActionResult GetUnverifiedMonuments()
        {
            try
            {
                return Ok(monumentService.GetUnverifiedMonuments());
            }
            catch
            {
                return NotFound();
            }
        }

        [Route("getallmonumentsformap")]
        [HttpPost]
        public IActionResult GetAllMonumentsForMap([FromBody] MonumentMapFilterViewModel filters)
        {
            try
            {
                return Ok(monumentService.GetAllMonumentsForMap(filters));
            }
            catch
            {
                return NotFound();
            }
        }

        [Route("getmonumenttypes")]
        [HttpGet]
        public IActionResult GetMonumentTypes()
        {
            try
            {
                return Ok(monumentService.GetMonumentTypes());
            }
            catch
            {
                return NotFound();
            }
        }

        [Route("getmonumenttypestoselect")]
        [HttpGet]
        public IActionResult GetMonumentTypesToSelect()
        {
            try
            {
                return Ok(monumentService.GetMonumentTypesToSelect());
            }
            catch
            {
                return NotFound();
            }
        }

        [Route("getyourunverifiedmonuments")]
        [HttpGet]
        public IActionResult GetYourUnverifiedMonuments([FromQuery] YourUndefinedMonumentsViewModel user)
        {
            try
            {
                return Ok(monumentService.GetYourUnverifiedMonuments(user.UserName));
            }
            catch
            {
                return NotFound();
            }
        }

        [Route("getmonumentsselect")]
        [HttpGet]
        public IActionResult GetMonumentsSelect()
        {
            try
            {
                return Ok(monumentService.GetMonumentsSelect());
            }
            catch
            {
                return NotFound();
            }
        }

        [Route("getmonumentstoaddtrip")]
        [HttpGet]
        public IActionResult GetMonumentsToSelect()
        {
            try
            {
                return Ok(monumentService.GetMonumentsToAddTrip());
            }
            catch
            {
                return NotFound();
            }
        }
    }
}