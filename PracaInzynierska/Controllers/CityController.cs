using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CityController : ControllerBase
    {
        private ICityService cityService;
        public CityController(ICityService cityService)
        {
            this.cityService = cityService;
        }

        [Route("addcity")]
        [HttpPost]
        public IActionResult AddCity([FromBody] string name)
        {
            try
            {
                var result = cityService.AddCity(name);
                return result ? (IActionResult)Ok() : NotFound();
            }
            catch (Exception e)
            {
                return NotFound();
            }
        }

        [Route("getcities")]
        [HttpGet]
        public IActionResult GetCities()
        {
            try
            {
                return Ok(cityService.GetCities());
            }
            catch (Exception e)
            {
                return NotFound();
            }
        }
    }
}