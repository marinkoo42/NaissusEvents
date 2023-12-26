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
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;


namespace Controllers
{

    [ApiController]
    [Route("Controller")]
    public class HostingObjectController : ControllerBase
    {
        private  NaissusEventsContext context {get; set;}
        private readonly UserManager<AppUser> userManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly IConfiguration _configuration;
        public static IWebHostEnvironment _webHostEnvironment;
        
        public HostingObjectController(NaissusEventsContext context, UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration, IWebHostEnvironment webHostEnvironment)
          {
            this.context=context;
            this.userManager = userManager;
            this.roleManager = roleManager;
            _configuration = configuration;
            _webHostEnvironment = webHostEnvironment;
          }


        [HttpGet]
        [Route("VratiKafice")]
        public async Task<ActionResult<IEnumerable<HostingObject>>> GetObject()
        {
           
          return await context.HostingObjects.Include(obj => obj.moderator).ToListAsync();

           

        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [Authorize(Roles = "Admin,Moderator")]
        [HttpGet]
        [Route("VratiKafic/{idHostingObject}")]
        public ActionResult<HostingObject> GetObjectById(int idHostingObject)
        {
           var hst = context.HostingObjects.Where(p=>p.Id==idHostingObject).Include(p=>p.Events).FirstOrDefault();

          if (hst == null)
          {
            return BadRequest("Ne postoji kafic sa ovim idjem");
          }

          return hst;
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [Authorize(Roles = "Admin")]
        [HttpPost]
        [Route("DodajKafic")]
        public async Task<ActionResult<HostingObject>> PostObject([FromBody] HostingObject oldObject)
        {
          {
            if (!ModelState.IsValid)
                return BadRequest("Broj telefona nije validan!");
                

            HostingObject newObject = new HostingObject
            {
              Name = oldObject.Name,
              Phone = oldObject.Phone,
              ReviewStars = 0.0,
              Adress = oldObject.Adress,
              Hours = oldObject.Hours,
              MapX = 0,
              MapY = 0,
              thumbnailPicture = oldObject.thumbnailPicture
            };
                try
                {
                    context.HostingObjects.Add(newObject);
                    await context.SaveChangesAsync();
                    return Ok(newObject);
                }
            
                catch (Exception)
                {
                    return BadRequest("Niste uneli validne podatke!");
                }

            
          }
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [Authorize(Roles = "Admin")]
        [HttpDelete]
        [Route("ObrisiObjekat/{idObject}")]
        public async Task<IActionResult> DeleteObject(int idObject)
        {
            
                if(idObject<=0)
                {
                    return BadRequest("Pogresan ID");

                }
                try
                {   
               
                var obj = await context.HostingObjects.FindAsync(idObject);
                    if(obj!=null)
                    {
                    //obrisi evente
                        var tc= new EventController(context,_webHostEnvironment);
                        var ev= await context.Events.Where(ev=>ev.hostingObject.Id==idObject).ToListAsync();
                        foreach(var e in ev)
                        {
                            await tc.DeleteEvent(e.Id);
                        }
                        await context.SaveChangesAsync();                

                        //obrisi slike
                        var hoSlike= new FileUploadController(context, _webHostEnvironment);
                        hoSlike.deleteHostingObjectPicture(idObject);

                        // var pc = new PicturesDataController(context);
                        // var slike = await context.PicturesDatas.Where(p => p.hostingObject.Id == idObject).ToListAsync();
                        // foreach(var slika in slike)
                        // {
                        //     await pc.DeletePicture(slika.Id);
                        // }

                        //obrisi stolove

                        var tbl = await context.Tables.Where(tbl=>tbl.hostingObject.Id==idObject).ToListAsync();
                        foreach (var t in tbl)
                        {
                            context.Tables.Remove(t);
                        }
                        
                    //obrisi moderatora

                        var uc = new UserController(context,  userManager,  roleManager, _configuration);
                        await uc.RemoveModerator(idObject);
                        // return Ok("Objekat postoji");

                        context.HostingObjects.Remove(obj);
                        await context.SaveChangesAsync();
                    }
                }
                catch (Exception e)
                {
                    
                    return BadRequest(e.Message);
                }
                return Ok();
            
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [Authorize(Roles = "Admin,Moderator")]
        [HttpPut]
        [Route("IzmeniKafic")]
        public  async Task<ActionResult> EditCafe([FromBody] HostingObject oldObject)//[FromBody]
        {

            // if(oldObject.Id)
          if (oldObject.Id <= 0)
            {
                return BadRequest("Pogresan ID!");
            }
            try
            {
                context.HostingObjects.Update(oldObject);
                context.Entry(oldObject).State = EntityState.Modified;
                await context.SaveChangesAsync();     
            }
             catch (Exception e)
            {
                if (!PostojiObjekat(oldObject.Id))
                {
                    return NotFound("Nije pronadjen objekat sa ovim id-jem");
                }
                else
                {
                    BadRequest(e.Message);
                }
            }

            return Ok();
         
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [Authorize(Roles = "Moderator,Admin")]
        [HttpGet]
        [Route("VratiKaficModeratora/{idModeratora}")]
        public ActionResult<HostingObject> GetObjectByIdOfModerator(string idModeratora)
        {
           var hst = context.HostingObjects.Where(host=>host.moderator.Id==idModeratora)
           .FirstOrDefault();

          if (hst == null)
          {
            return BadRequest("Ne postoji moderator");
          }

          return hst;
        }
        

        private bool PostojiObjekat(int id)
        {
            return context.HostingObjects.Any(p => p.Id == id);
        }
        


    }
}