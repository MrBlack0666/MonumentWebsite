using API.Database;
using API.Models;
using API.ViewModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace API.Services
{
    public class AuthService : IAuthService
    {
        private UserManager<User> userManager;
        private RoleManager<UserRole> roleManager;
        private DatabaseContext db;

        public AuthService(UserManager<User> userManager, RoleManager<UserRole> roleManager, DatabaseContext db)
        {
            this.userManager = userManager;
            this.roleManager = roleManager;
            this.db = db;
        }

        public async Task<int> Register(RegisterViewModel registerViewModel)
        {
            int error = 0;

            if (await userManager.FindByEmailAsync(registerViewModel.Email) != null)
                error += -2;

            if (await userManager.FindByNameAsync(registerViewModel.UserName) == null)
            {
                if (error < 0)
                    return error;

                var user = new User
                {
                    UserName = registerViewModel.UserName,
                    Email = registerViewModel.Email,
                };

                var result = await userManager.CreateAsync(user, registerViewModel.Password);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, "User");
                    return 1;
                }

                return 0;
            }
            else
                error += -1;

            return error;
        }

        public async Task<string> Login(LoginViewModel loginViewModel)
        {
            var user = await userManager.FindByNameAsync(loginViewModel.UserName);

            if (user != null)
            {
                var role = await userManager.GetRolesAsync(user);

                if (user != null && await userManager.CheckPasswordAsync(user, loginViewModel.Password))
                {
                    var claims = new[]
                    {
                    new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim("role", role.SingleOrDefault())
                };

                    var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("supersilnehaslo1"));

                    var token = new JwtSecurityToken(
                        issuer: "http://localhost:5000",
                        audience: "http://localhost:5000",
                        claims: claims,
                        expires: DateTime.UtcNow.AddHours(10000),
                        signingCredentials: new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256)
                        );

                    return new JwtSecurityTokenHandler().WriteToken(token);
                }
            }

            return "";
        }

        public async Task<bool> ChangePassword(ChangePasswordViewModel changePasswordViewModel)
        {
            var user = await userManager.FindByNameAsync(changePasswordViewModel.UserName);

            if (await userManager.CheckPasswordAsync(user, changePasswordViewModel.OldPassword))
            {
                await userManager.RemovePasswordAsync(user);
                await userManager.AddPasswordAsync(user, changePasswordViewModel.NewPassword);

                return true;
            }

            return false;
        }

        public string GetUserId(string userName)
        {
            var user = userManager.FindByNameAsync(userName).Result;

            return user.Id;
        }

        public bool IsUserAdmin(string userName)
        {
            var user = userManager.FindByNameAsync(userName).Result;
            var result = userManager.IsInRoleAsync(user, "Admin").Result;

            return result;
        }

        public async Task<bool> AddUserToRole(string userName, string role)
        {
            if (userName == "admin")
                return false;

            string deletedRole;

            if(role == "Admin")
            {
                deletedRole = "User";
            }
            else
            {
                deletedRole = "Admin";
            }

            var user = await userManager.FindByNameAsync(userName);
            var result = await userManager.RemoveFromRoleAsync(user, deletedRole);

            if (!result.Succeeded)
                return false;

            if (role == "Admin")
            {
                var resultAdd = await userManager.AddToRoleAsync(user, role);
            }
            else
            {
                var resultAdd = await userManager.AddToRoleAsync(user, role);
            }

            return true;
        }

        public async Task<GetUsersViewModel> GetUsers(UserFilterViewModel filters)
        {
            var users = db.Users.Where(u => string.IsNullOrWhiteSpace(filters.Name) || u.UserName.Contains(filters.Name) || u.Email.Contains(filters.Name))
                .OrderBy(u => u.UserName).ToList();
            GetUsersViewModel returnedValue = new GetUsersViewModel()
            {
                Users = new List<UserViewModel>()
            };

            long i = 0;
            long min = (long)(filters.Page - 1) * 10;
            long max = (long)filters.Page * 10;

            returnedValue.Page = filters.Page;
            returnedValue.AllPages = (int)Math.Ceiling(users.Count / (double)10);

            foreach(var user in users)
            {
                if(i >= min && i < max)
                {
                    var roles = await userManager.GetRolesAsync(user);
                    returnedValue.Users.Add(new UserViewModel()
                    {
                        UserName = user.UserName,
                        Email = user.Email,
                        IsAdmin = roles[0] == "Admin"
                    });
                }
                else if(i >= max)
                {
                    break;
                }

                i++;
            }

            return returnedValue;
        }
    }
}
