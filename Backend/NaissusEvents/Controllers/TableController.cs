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
    public class TableController : ControllerBase
    {
          private  NaissusEventsContext context {get; set;}
          public TableController(NaissusEventsContext context)
          {
              this.context=context;
          }
        

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [Authorize(Roles = "Moderator,Admin")]
        [HttpGet]
        [Route("VratiSto/{idTable}")]
        public  ActionResult<Table> GetTable(int idTable)
        {
          var tbl = context.Tables.Where(p=>p.Id==idTable).FirstOrDefault();

          if (tbl == null)
          {
            return BadRequest("Ne postoji sto sa ovim idjem");
          }

          return tbl;
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [Authorize(Roles = "Admin")]
        [HttpGet]
        [Route("VratiStolove")]
        public async Task<ActionResult<IEnumerable<Table>>> GetTables()
        {
          return await context.Tables.ToListAsync();
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [Authorize(Roles = "Moderator")]
        [HttpGet]
        [Route("VratiStoloveObjekta/{idHosting}")]
        public async Task<ActionResult<IEnumerable<Table>>> GetTableOfHostingObject(int idHosting)
        {
          var tbl = await context.Tables.Where(p=>p.hostingObject.Id==idHosting).Include(p=> p.hostingObject).ToListAsync();

          if (tbl == null)
          {
            return NotFound();
          }

          return tbl;
        }
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [Authorize(Roles = "Moderator,Admin")]
        [HttpDelete]
        [Route("ObrisiSto/{idTable}")]
        public async Task<ActionResult> DeleteTable(int idTable)
        {
            
              if(idTable<=0)
                {
                    return BadRequest("Pogresan ID");

                }
                try
                {   
                
                var rezervacije = await context.Reservations.Where(res => res.Table.Id == idTable).ToListAsync();
                foreach(var res in rezervacije)
                {
                  context.Reservations.Remove(res);
                }
                //obrisi sve rezervacije sa stola


                var tbl = await context.Tables.Where(tbl => tbl.Id == idTable).Include(t=> t.hostingObject).FirstOrDefaultAsync();
                var hostingObjectID = tbl.hostingObject.Id;
                context.Tables.Remove(tbl);
                await context.SaveChangesAsync();

                
                return Ok(hostingObjectID);
                }
                catch (Exception e)
                {
                    
                    return BadRequest(e.Message);
                }
            
        }


        
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [Authorize(Roles = "Moderator")]
        [HttpPost]
        [Route("DodajSto")]
        public async Task<ActionResult<Table>> PostTable([FromBody] Table table)
        {


          var obj = await context.HostingObjects.FindAsync(table.hostingObject.Id);
          {
            Table newTable = new Table{
              
              hostingObject = obj,
              TableCapacity = table.TableCapacity,
              tableType = table.tableType
             
            };
            
                try
                {
                    context.Tables.Add(newTable);
                    await context.SaveChangesAsync();
                }

                catch (Exception)
                {
                    return BadRequest("Nije moguce dodati sto!");
                }
  

            return newTable;
          }
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("VratiNerezervisaneStoloveObjekta/{idEv}")]
        public  List<Table> GetTablesOfHostingObject(int idEv)
        {


         var ev =  context.Events.Where(p => p.Id == idEv).Include(p => p.hostingObject).FirstOrDefault();

         var stoloviIzObjekta =  context.Tables.Where(p => p.hostingObject.Id == ev.hostingObject.Id).ToList();
        

          List<Reservation> rezervacije =  context.Reservations.Where(p => p.Event.Id == idEv).Include(t=> t.Table).ToList();
          
          
          if(rezervacije.Count()!=0)
          {
            foreach(var res in rezervacije)
            {
            var sto = context.Tables.Find(res.Table.Id);
            if(sto!=null)
            stoloviIzObjekta.Remove(sto);
            }
          }
          var retVal = stoloviIzObjekta.Select(t => new Table{
           Id = t.Id,
           tableType = t.tableType,
           TableCapacity = t.TableCapacity
         }).ToList();
          
          return retVal;
          

        
        
        }
        

         
    




    }
}