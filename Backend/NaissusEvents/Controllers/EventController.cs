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
    public class EventController : ControllerBase
    {
          private  NaissusEventsContext context {get; set;}
          public static IWebHostEnvironment _webHostEnvironment;
          public EventController(NaissusEventsContext context, IWebHostEnvironment webHostEnvironment)
          {
              this.context=context;
              _webHostEnvironment = webHostEnvironment;
          }


        [AllowAnonymous]
        [HttpGet]
        [Route("VratiEvente")]
        public async Task<ActionResult<IEnumerable<Event>>> GetEvents()
        {

           return await context.Events.Include(p=>p.hostingObject).ToListAsync();

        }

         [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [Authorize(Roles = "Admin,Moderator")]
        [HttpGet]
        [Route("VratiEventeObjekta/{idObject}")]
        public async Task<ActionResult<IEnumerable<Event>>> GetEventsOfHostingObject(int idObject)
        {
       
        return await context.Events.Where(p=>p.hostingObject.Id==idObject).Include(p=>p.hostingObject).ToListAsync();
      
        }

         [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [Authorize(Roles = "Admin,Moderator")]
         [HttpGet]
        [Route("VratiEvent/{idEv}")]
        public  ActionResult<Event> GetEvent(int idEv)
        {
          var ev = context.Events.Where(p=>p.Id==idEv).Include(p=>p.hostingObject).FirstOrDefault();

          if (ev == null)
          {
            return BadRequest("Ne postoji event sa ovim idjem");
          }

          return ev;
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [Authorize(Roles = "Admin,Moderator")]
        [HttpDelete]
        [Route("ObrisiEvent/{idEv}")]
        public async Task<IActionResult> DeleteEvent(int idEv)
        {
            
                if(idEv<=0)
                {
                    return BadRequest("Pogresan ID");

                }
                try
                {   

                var tc= new FileUploadController(context, _webHostEnvironment);
                tc.deleteEventPicture(idEv);

                var res = await context.Reservations.Where(reservation=> reservation.Event.Id==idEv).ToListAsync();

                
                foreach(var r in res)
                {
                    context.Reservations.Remove(r);
                }
                await context.SaveChangesAsync();
               
                var obj = await context.Events.FindAsync(idEv);
                context.Events.Remove(obj);
                await context.SaveChangesAsync();
                
                }
                catch (Exception e)
                {
                    
                    return BadRequest(e.Message);
                }
                return Ok(idEv);
            
        }
        

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [Authorize(Roles = "Admin,Moderator")]
        [Route("DodajEventZaObjekat/{idObjekta}/{imeDogadjaja}/{opisDogadjaja}/{datumDogadjaja}")]
        [HttpPost]
        public async Task<ActionResult> DodajEventZaObjekat(int idObjekta, string imeDogadjaja, string opisDogadjaja,DateTime datumDogadjaja)
        {
            if (idObjekta <= 0)
            {
                return BadRequest(new { Poruka = "Hotel ne postoji!"});
            }

            

            if (string.IsNullOrWhiteSpace(imeDogadjaja) || imeDogadjaja.Length > 50)
            {
                return BadRequest(new { Poruka = "Pogrešno ime!"});
            }

            if (string.IsNullOrWhiteSpace(opisDogadjaja) || opisDogadjaja.Length > 200)
            {
                return BadRequest(new { Poruka = "Pogrešnan opis!"});
            }
            

            try
            {
                var obj = context.HostingObjects.Find(idObjekta);

                if (obj is null)
                {
                    return BadRequest("Objekat ne postoji!");
                }


                var newEvent = new Event();
                newEvent.eventName = imeDogadjaja;
                newEvent.eventDescription = opisDogadjaja;
                newEvent.eventDate = datumDogadjaja;
                newEvent.hostingObject = obj;
               
                context.Events.Add(newEvent);
                await context.SaveChangesAsync();
                 return Ok(newEvent);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
            
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [Authorize(Roles = "Admin,Moderator")]
        [HttpPut]
        [Route("IzmeniEvent")]
        public  async Task<ActionResult> EditEvent([FromBody] Event oldEvent)
        {
          if (oldEvent.Id <= 0)
            {
                return BadRequest("Pogresan ID!");
            }
            try
            {
                context.Events.Update(oldEvent);
                context.Entry(oldEvent).State = EntityState.Modified;
                await context.SaveChangesAsync();     
            }
             catch (Exception e)
            {
                if (!PostojiEvent(oldEvent.Id))
                {
                    return NotFound("Nije pronadjen event sa ovim id-jem");
                }
                else
                {
                    BadRequest(e.Message);
                }
            }

            return Ok();
         
        }
        private bool PostojiEvent(int id)
        {
            return context.Events.Any(p => p.Id == id);
        }

        


    }
}