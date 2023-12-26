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
    public class ReservationController : ControllerBase
    {
          private  NaissusEventsContext context {get; set;}

          public ReservationController(NaissusEventsContext context)
          {
              this.context=context;

          }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [Authorize(Roles = "Admin,Moderator,LogedIn")]
        [HttpDelete]
        [Route("ObrisiRezervaciju/{idRes}")]
        public async Task<ActionResult> DeleteReservation(int idRes)
        {
            
                if(idRes<=0)
                {
                    return BadRequest("Pogresan ID");

                }
                try
                {   
               
                var res = await context.Reservations.FindAsync(idRes);
                context.Reservations.Remove(res);
                await context.SaveChangesAsync();

                return Ok("Uspesno izbrisana rezervacija");
                
                }
                catch (Exception e)
                {
                    
                    return BadRequest(e.Message);
                }
            
        }
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [Authorize(Roles = "Moderator,Admin")]
        [HttpGet]
        [Route("VratiRezervacijeEventa/{idEv}")]
        public async Task<ActionResult<IEnumerable<Reservation>>> GetReservationsOfEvent(int idEv)
        {
          var res = await context.Reservations.Where(p=> p.Event.Id==idEv)
          .Include(res => res.Table)
          .Include(res=> res.MyUser)
          .Select( (res) => new{
            id = res.Id,
            Table = new{ 
              tableType = res.Table.tableType,
              TableCapacity = res.Table.TableCapacity
            },
            MyUser = new{
              Name = res.MyUser.Name,
              LastName = res.MyUser.LastName,
              UserName = res.MyUser.UserName
            }
          })
          .ToListAsync();
          if (res == null)
          {
             return NotFound();
          }

          return Ok(res);
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [Authorize(Roles = "Admin,Moderator")]
        [HttpGet]
        [Route("VratiRezervaciju/{idRes}")]
        public async Task<ActionResult<Reservation>> GetReservation(int idRes)
        {
          var res = await context.Reservations.FindAsync(idRes);

          if (res == null)
          {
            return BadRequest("Ne postoji rezervacija sa ovim idjem");
          }

          return res;
        }

        

        
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [Authorize(Roles = "Admin,Moderator,LogedIn")]
        [Route("DodajRezervaciju/{eventId}/{userId}/{tableType}/{tableCapacity}")]
        [HttpPost]
        public async Task<ActionResult> DodajRezervaciju(int eventId , string userId, TableType tableType, int tableCapacity)
        {
          if(ModelState.IsValid)
          {
            if (eventId <= 0)
            {
              return BadRequest("Unesi validan id eventa!");
            }         
            if (tableCapacity <= 0)
            {
              return BadRequest("Unesi validan kapacitet stola!");
            }
           
             if (string.IsNullOrWhiteSpace(userId))
            {
              return BadRequest("Unesi validanid korisnika!");
            }
            
          }

            try
            {
                var ev =await context.Events.FindAsync(eventId);
                if(ev==null)
                {
                  return BadRequest("ne postoji event!");
                }
                var user = await context.AppUsers.FindAsync(userId);
                if(user==null)
                {
                  return BadRequest("Ne postoji user");
                } 

                List<Table> tbl= new TableController(context).GetTablesOfHostingObject(eventId);

                if(tbl.Count()==0)
                {
                  return BadRequest("Nema slobodnih stolova");
                }
               var table = tbl.Find( s => s.TableCapacity == tableCapacity && s.tableType == tableType);

                if (table ==null)
                {
                    return BadRequest("Ne postoji sto sa ovim parametrima!");
                }
               var sto = await context.Tables.FindAsync(table.Id);


                var newRes = new Reservation{
                  Event = ev,
                  Table=sto,
                  MyUser=user
                };
               
                 context.Reservations.Add(newRes);
                
                 await context.SaveChangesAsync();
              
               return Ok("Uspesno napravljena rezervacija");
            }
        
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [Authorize(Roles = "Moderator,LogedIn,Admin")]
        [HttpGet]
        [Route("VratiRezervacijeUsera/{idUsera}")]
        public async Task<ActionResult<IEnumerable<Reservation>>> GetReservationsOfEvent(string idUsera)
        {
          var res = await context.Reservations.Where(reservation=> reservation.MyUser.Id==idUsera).Include(reservation=>reservation.Event).ThenInclude(ev => ev.hostingObject).ToListAsync();
          if (res == null)
          {
             return NotFound("Rezervacije nisu pronadjene");
          }

          return Ok(res);
        }




    }
}