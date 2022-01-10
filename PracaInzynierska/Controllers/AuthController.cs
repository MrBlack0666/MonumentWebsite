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
    public class AuthController : ControllerBase
    {
        private IAuthService authService;
        public AuthController(IAuthService authService)
        {
            this.authService = authService;
        }

        [Route("register")]
        [HttpPost]
        public async Task<IActionResult> Register([FromBody] RegisterViewModel user)
        {
            try
            {
                var result = await authService.Register(user);

                if (result == 0)
                    return NotFound();
                else
                    return Ok(result);
            }
            catch (Exception e)
            {
                return NotFound();
            }
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginViewModel user)
        {
            try
            {
                var result = await authService.Login(user);

                return result != "" ? (IActionResult)Ok(result) : Unauthorized();
            }
            catch (Exception e)
            {
                return NotFound();
            }
        }

        [Route("changepassword")]
        [HttpPost]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordViewModel changePasswordViewModel)
        {
            try
            {
                var result = await authService.ChangePassword(changePasswordViewModel);

                return result ? (IActionResult)Ok() : Unauthorized();
            }
            catch (Exception e)
            {
                return NotFound();
            }
        }

        [Route("addusertorole")]
        [HttpPost]
        public async Task<IActionResult> AddUserToRole([FromBody] AddUserToRoleViewModel user)
        {
            try
            {
                var result = await authService.AddUserToRole(user.UserName, user.Role);

                return result ? (IActionResult)Ok() : NotFound();
            }
            catch
            {
                return NotFound();
            }
        }

        [Route("getusers")]
        [HttpPost]
        public async Task<IActionResult> GetUsers([FromBody] UserFilterViewModel filters)
        {
            try
            {
                var result = await authService.GetUsers(filters);

                return Ok(result);
            }
            catch
            {
                return NotFound();
            }
        }
    }
}