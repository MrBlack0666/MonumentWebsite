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
    public class MarkController : ControllerBase
    {
        private IMarkService markService;
        IAuthService authService;
        public MarkController(IMarkService markService, IAuthService authService)
        {
            this.markService = markService;
            this.authService = authService;
        }

        [Route("addmark")]
        [HttpPost]
        public IActionResult AddMark([FromBody] MarkViewModel mark)
        {
            try
            {
                var result = markService.AddMark(mark.Grade, mark.Comment, mark.MonumentId, mark.UserName);
                return result ? (IActionResult)Ok() : NotFound();
            }
            catch (Exception e)
            {
                return NotFound();
            }
        }

        [Route("editmark")]
        [HttpPost]
        public IActionResult EditMark([FromBody] MarkViewModel mark)
        {
            try
            {
                var result = markService.EditMark(mark.MarkId, mark.Grade, mark.Comment, mark.UserName);
                return result ? (IActionResult)Ok() : NotFound();
            }
            catch (Exception e)
            {
                return NotFound();
            }
        }

        [Route("deleteMark")]
        [HttpPost]
        public IActionResult DeleteMark([FromBody] MarkViewModel mark)
        {
            try
            {
                var userId = authService.GetUserId(mark.UserName);
                var isUserAdmin = authService.IsUserAdmin(mark.UserName);

                markService.DeleteMark(mark.MarkId, userId, isUserAdmin);
                return Ok();
            }
            catch (Exception e)
            {
                return NotFound();
            }
        }

        [Route("getyourmarks")]
        [HttpGet]
        public IActionResult GetYourMarks([FromQuery] string userName)
        {
            try
            {
                return Ok(markService.GetYourMarks(userName));
            }
            catch (Exception e)
            {
                return NotFound();
            }
        }
    }
}