using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Services;
using API.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BannedWordController : ControllerBase
    {
        private IBannedWordService bannedWordService;
        public BannedWordController(IBannedWordService bannedWordService)
        {
            this.bannedWordService = bannedWordService;
        }

        [Route("addbannedword")]
        [HttpPost]
        public IActionResult AddBannedWord([FromBody] BannedWordViewModel word)
        {
            try
            {
                var result = bannedWordService.AddBannedWord(word.Word);

                return result ? (IActionResult)Ok() : Unauthorized();
            }
            catch (Exception e)
            {
                return NotFound();
            }
        }

        [Route("deletebannedword")]
        [HttpPost]
        public IActionResult DeleteBannedWord([FromBody] BannedWordViewModel word)
        {
            try
            {
                bannedWordService.DeleteBannedWord(word.Word);

                return Ok();
            }
            catch (Exception e)
            {
                return NotFound();
            }
        }

        [Route("getbannedwords")]
        [HttpGet]
        public IActionResult GetBannedWords([FromQuery] BannedWordFilterViewModel filters)
        {
            try
            {
                return Ok(bannedWordService.GetBannedWords(filters));
            }
            catch (Exception e)
            {
                return NotFound();
            }
        }

        [Route("doestextcontainsbannedwords")]
        [HttpPost]
        public IActionResult DoesTextContainsBannedWords([FromBody] CheckTextViewModel text)
        {
            try
            {
                return Ok(bannedWordService.DoesTextContainsBannedWords(text.Text));
            }
            catch (Exception e)
            {
                return NotFound();
            }
        }
    }
}