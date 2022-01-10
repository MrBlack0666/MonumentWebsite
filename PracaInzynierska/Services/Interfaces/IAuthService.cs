using API.ViewModels;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;

namespace API.Services
{
    public interface IAuthService
    {
        Task<int> Register(RegisterViewModel registerViewModel);
        Task<string> Login(LoginViewModel loginViewModel);
        Task<bool> ChangePassword(ChangePasswordViewModel changePasswordViewModel);
        string GetUserId(string userName);
        bool IsUserAdmin(string userName);
        Task<bool> AddUserToRole(string userName, string role);
        Task<GetUsersViewModel> GetUsers(UserFilterViewModel filters);
    }
}
