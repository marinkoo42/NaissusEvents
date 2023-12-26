using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Authentication;
using Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;


namespace Controllers
{

    [ApiController]
    [Route("Controller")]
    public class AccountController : ControllerBase
    {

        private UserManager<AppUser> userManager;
        private RoleManager<IdentityRole> roleManager;
        private IConfiguration _configuration;
        private NaissusEventsContext context {get; set;}

          public AccountController(NaissusEventsContext context,UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration)
          {
              this.context=context;
              this.userManager = userManager;
              this.roleManager = roleManager;
              _configuration = configuration;
          }



        [AllowAnonymous]
        [HttpPost]
        [Route("Register")]
        public async Task<IActionResult> Registration([FromBody] Register reg)
        {

            if (ModelState.IsValid)
            {
                var userExist = await userManager.FindByNameAsync(reg.UserName);
                if (userExist != null)
                    return BadRequest("Ovaj username je vec u upotrebi!");

                var userEmail = await userManager.FindByEmailAsync(reg.Email);
                if (userEmail != null)
                    return BadRequest("Ovaj email je vec u upotrebi!");

                var applicationUser = new AppUser()
                {
                    Name = reg.Name,
                    Email = reg.Email,
                    LastName = reg.LastName,
                    UserName = reg.UserName,
                    PhoneNumber = reg.Phone
                };
                if (!await roleManager.RoleExistsAsync(UserRole.Admin))
                {
                    await roleManager.CreateAsync(new IdentityRole(UserRole.Admin));
                }

                if (!await roleManager.RoleExistsAsync(UserRole.Moderator))
                {
                    await roleManager.CreateAsync(new IdentityRole(UserRole.Moderator));
                }
                if (!await roleManager.RoleExistsAsync(UserRole.LogedIn))
                {
                    await roleManager.CreateAsync(new IdentityRole(UserRole.LogedIn));
                }

                try
                {
                    var result = await userManager.CreateAsync(applicationUser, reg.Password);
                    await userManager.AddToRoleAsync(applicationUser, UserRole.LogedIn);
                    return Ok(result);
                }

                catch (Exception)
                {
                    return BadRequest("Sifra mora da sadrzi najmanje 6 karaktera, da sadrzi jedno veliko slovo, jedan broj i jedan specijalni znak!");
                }
            }
            else
                return BadRequest("Podaci nisu validni!");

        }

        [AllowAnonymous]
        [HttpPost]
        [Route("Login")]
        public async Task<ActionResult<String>> Login([FromBody] Login log)
        {
            if (ModelState.IsValid)
            {
                var user = await userManager.FindByNameAsync(log.UserName);
                if (user != null && await userManager.CheckPasswordAsync(user, log.Password))
                {
                    var userRoles = await userManager.GetRolesAsync(user);
                    var uloga = userRoles.FirstOrDefault();
                    var authClaims = new List<Claim>
                        {
                            new Claim(ClaimTypes.Name, user.Name),
                            new Claim(ClaimTypes.Surname, user.LastName),
                            new Claim("userName", user.UserName),
                            new Claim(ClaimTypes.Email, user.Email),
                            new Claim(ClaimTypes.HomePhone, user.PhoneNumber),
                            new Claim("userId", user.Id),
                            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                        };
                    foreach (var userRole in userRoles)
                    {
                        authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                    }
                    var authSigninKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_configuration["JWT:Secret"]));
                    var token = new JwtSecurityToken(
                        issuer: _configuration["JWT:ValidIssuer"],
                        audience: _configuration["JWT:ValidAudience"],
                        expires: DateTime.Now.AddDays(1),
                        claims: authClaims,
                        signingCredentials: new SigningCredentials(authSigninKey, SecurityAlgorithms.HmacSha256Signature)
                        );
                    return Ok(new JwtSecurityTokenHandler().WriteToken(token));
                }
            }
            return BadRequest("Pogresan username ili password");
        }

        




          
    }

}