using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using System.IO;
using System.Data;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System.Linq;
using Authentication;

namespace Controllers
{

    [ApiController]
    [Route("Controller")]
    public class UserController : ControllerBase
    {

        private  NaissusEventsContext context {get; set;}
        private readonly UserManager<AppUser> userManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly IConfiguration _configuration;

        public UserController(NaissusEventsContext context, UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration)
        {
            this.context = context;
            this.userManager = userManager;
            this.roleManager = roleManager;
            _configuration = configuration;
        }



        


        
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [Authorize(Roles = "Admin")]
        [HttpGet]
        [Route("VratiKorisnika/{id}")]
        public MyUser GetKorisnik(string id) //vraca konkretnog korisnika
        {

            MyUser kor = new MyUser();
            SqlConnectionStringBuilder builder = new SqlConnectionStringBuilder();
            builder.ConnectionString = "Server=(localdb)\\NaissusEventsDatabase;Database=NaissusEventsdb";
            
             
            using (SqlConnection connection = new SqlConnection(builder.ConnectionString))
                {                    
                    connection.Open();       

                    String sql = "SELECT * FROM aspnetusers WHERE id = @id";
                    

                    using (SqlCommand command = new SqlCommand(sql, connection))
                    {
                        command.Parameters.Add("@id", SqlDbType.VarChar);
                        command.Parameters["@id"].Value = id;
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                
                                kor.Id = reader["Id"].ToString();
                                kor.Name = reader["Name"].ToString();
                                kor.LastName = reader["LastName"].ToString();
                                kor.UserName = reader["UserName"].ToString();
                                kor.Phone = reader["PhoneNumber"].ToString();
                                kor.Email = reader["Email"].ToString();
                                
                            }
                        }
                    }                    
                }
            

          return kor;
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [Authorize(Roles = "Admin")]
        [AllowAnonymous]
        [HttpGet]
        [Route("VratiKorisnike")]
        public async Task<List<MyUser>> VratiKorisnike() 
        {
            List<MyUser> korisnici = new List<MyUser>();
           
            SqlConnectionStringBuilder builder = new SqlConnectionStringBuilder();
            builder.ConnectionString = "Server=(localdb)\\NaissusEventsDatabase;Database=NaissusEventsdb";
           using (SqlConnection connection = new SqlConnection(builder.ConnectionString))
           {
            connection.Open();       

                    String sql = "SELECT aspnetusers.Id, aspnetusers.UserName, aspnetusers.Email, aspnetusers.Name, aspnetusers.PhoneNumber, aspnetusers.LastName FROM aspnetusers";
                    

                    using (SqlCommand command = new SqlCommand(sql, connection))
                    {
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                
                                korisnici.Add(new MyUser
                                {
                                Id = reader["Id"].ToString(),                         
                                Name = reader["Name"].ToString(),
                                LastName = reader["LastName"].ToString(),
                                UserName = reader["UserName"].ToString(),
                                Phone = reader["PhoneNumber"].ToString(),
                                Email = reader["Email"].ToString()

                                });
                            }
                            foreach(MyUser kor in korisnici){
                                var appUser = await userManager.FindByIdAsync(kor.Id);
                                var userRoles = await userManager.GetRolesAsync(appUser);
                                var uloga = userRoles.FirstOrDefault();
                                kor.Role = uloga;
                            }                        
                        }
                    }
           }
            return korisnici;
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [Authorize(Roles = "Admin")]
        [HttpDelete]
        [Route("ObrisiKorisnika/{id}")]
        public async Task<IActionResult> DeleteUser(string id) 
        {


            var hst= await context.HostingObjects.Where(hst=>hst.moderator.Id==id).Include(hst => hst.moderator).ToListAsync();

            foreach(var h in hst)
            {
                h.moderator=null;
            }

            var res = await context.Reservations.Where(reservation=> reservation.MyUser.Id==id).ToListAsync();
            foreach(var r in res)
            {
                context.Reservations.Remove(r);
            }
            await context.SaveChangesAsync();
            SqlConnectionStringBuilder builder = new SqlConnectionStringBuilder();
            builder.ConnectionString = "Server=(localdb)\\NaissusEventsDatabase;Database=NaissusEventsdb";
            using (SqlConnection connection = new SqlConnection(builder.ConnectionString))
            {
            connection.Open(); 
            String sql = "DELETE FROM aspnetusers WHERE id = @id";
            try
            {
                using (SqlCommand command = new SqlCommand(sql, connection))
                {
                    command.Parameters.Add("@id", SqlDbType.VarChar);
                    command.Parameters["@id"].Value = id;
                    command.ExecuteNonQuery();  
                }
            }
            catch(Exception e)
            {

                return BadRequest(e);
            }

            return Ok();
 
            }


          
        }


        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [Authorize(Roles = "LogedIn, Admin")]
        [HttpPut]
        [Route("IzmeniKorisnika")]///{id}
        public async Task<ActionResult<MyUser>> EditUser([FromBody] MyUser kor)
        {
            var applicationUser = await userManager.FindByIdAsync(kor.Id);
            if (await userManager.IsInRoleAsync(applicationUser, UserRole.Admin))
            return BadRequest("Ne mozes da menjas admina!"); 


            applicationUser.Name = kor.Name;
            applicationUser.Email = kor.Email;
            applicationUser.LastName = kor.LastName;
            applicationUser.UserName = kor.UserName;
            applicationUser.PhoneNumber = kor.Phone;
            



            if (ModelState.IsValid)
            {
                List<MyUser> users = await VratiKorisnike();

                bool i = false;                                                     
                foreach (MyUser u in users)
                {
                    if (u.Id != kor.Id)
                    {
                        if (u.UserName == kor.UserName)
                        {
                            i = true;
                            return BadRequest("Ovaj username je vec u upotrebi!");
                        }
                        if (u.Email == kor.Email)
                        {
                            i = true;
                            return BadRequest("Ovaj email je vec u upotrebi!");
                        }
                    }

                }
                if (i == false)
                {


                    await userManager.UpdateAsync(applicationUser);
                }

            }
            else
                return BadRequest("Podaci nisu validni");
           
            var retKor = new MyUser
                                {
                                Id = applicationUser.Id.ToString(),                         
                                Name = applicationUser.Name.ToString(),
                                LastName = applicationUser.LastName.ToString(),
                                UserName = applicationUser.UserName.ToString(),
                                Phone = applicationUser.PhoneNumber.ToString(),
                                Email = applicationUser.Email.ToString()

                                };

                                var appUser = await userManager.FindByIdAsync(kor.Id);
                                var userRoles = await userManager.GetRolesAsync(appUser);
                                var uloga = userRoles.FirstOrDefault();
                                retKor.Role = uloga;
          
           return Ok(retKor);

        }




        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [Authorize(Roles = "Admin")]
        [HttpPut]
        [Route("DodajModeratora/{userID}/{hostingObjectId}")]
        public async Task<IActionResult> AddModerator(string userID, int hostingObjectId)
        {
            var applicationUser = await userManager.FindByIdAsync(userID);
            var HostingObject = await context.HostingObjects.FindAsync(hostingObjectId);

            if(HostingObject == null)
            {
                return BadRequest("Nije pronadjen objekat");
            }
            if (await userManager.IsInRoleAsync(applicationUser, UserRole.LogedIn) == false) 
                return BadRequest("Doslo je do greske!");


            
            if(HostingObject.moderator == null){
            await userManager.RemoveFromRoleAsync(applicationUser, UserRole.LogedIn);
            await userManager.AddToRoleAsync(applicationUser, UserRole.Moderator);

            applicationUser.HostingObject = HostingObject;
            await userManager.UpdateAsync(applicationUser);
            }
            else {
                return BadRequest("Vec ima moderatora!");
            }

           
           return Ok();

        }


        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [Authorize(Roles = "Admin")]
        [HttpPut]
        [Route("ObrisiModeratora/{idObjekta}")]
        public  async Task<IActionResult> RemoveModerator(int idObjekta) 
        {
            var hst =  context.HostingObjects.Where(p=>p.Id==idObjekta).Include(p=>p.moderator).FirstOrDefault();
            if(hst!=null)
            {
                if(hst.moderator!=null){
                    var modId = hst.moderator.Id; 
                    
                    var applicationUser = await userManager.FindByIdAsync(modId);
                    if(applicationUser!= null)
                    {
                        if (await userManager.IsInRoleAsync(applicationUser, UserRole.Moderator) == false) 
                            return BadRequest("Doslo je do greske!");

                        await userManager.RemoveFromRoleAsync(applicationUser, UserRole.Moderator);
                        await userManager.AddToRoleAsync(applicationUser, UserRole.LogedIn);
                        await userManager.UpdateAsync(applicationUser);

                        hst.moderator=null;
                        await context.SaveChangesAsync();
                        return Ok();
                    }
                    return BadRequest("Ne postoji korisnik!");
                }
                return Ok();
            }
            return BadRequest("Ne postoji objekat sa ovim id-jem!");

          
        }




    }
}