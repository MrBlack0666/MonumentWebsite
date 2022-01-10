using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Models;
using API.Services;
using API.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TitbitController : ControllerBase
    {
        private ITitbitService titbitService;
        private IAuthService authService;
        public TitbitController(ITitbitService titbitService, IAuthService authService)
        {
            this.titbitService = titbitService;
            this.authService = authService;
        }

        [Route("addtitbit")]
        [HttpPost]
        public IActionResult AddTitbit([FromBody] Titbit titbit)
        {
            try
            {
                var userId = authService.GetUserId(titbit.CreatorId);
                var result = titbitService.AddTitbit(titbit.Name, titbit.Description, titbit.MonumentId, userId);
                return result ? (IActionResult)Ok() : NotFound();
            }
            catch
            {
                return NotFound();
            }
        }

        [Route("edittitbit")]
        [HttpPost]
        public IActionResult EditTitbit([FromBody] Titbit titbit)
        {
            try
            {
                var userId = authService.GetUserId(titbit.CreatorId);
                var isAdmin = authService.IsUserAdmin(titbit.CreatorId);
                var result = titbitService.EditTitbit(titbit.Id, titbit.Name, titbit.Description, userId, isAdmin);
                return result ? (IActionResult)Ok() : NotFound();
            }
            catch
            {
                return NotFound();
            }
        }

        [Route("deletetitbit")]
        [HttpPost]
        public IActionResult DeleteTitbit([FromBody] DeleteTitbitViewModel titbit)
        {
            try
            {
                var userId = authService.GetUserId(titbit.Username);
                var isAdmin = authService.IsUserAdmin(titbit.Username);
                titbitService.DeleteTitbit(titbit.Id, userId, isAdmin);
                return Ok();
            }
            catch
            {
                return NotFound();
            }
        }
    }
}