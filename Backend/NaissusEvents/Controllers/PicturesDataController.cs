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
    public class PicturesDataController : ControllerBase
    {
          private  NaissusEventsContext context {get; set;}
          public PicturesDataController(NaissusEventsContext context)
          {
              this.context=context;
          }



         [HttpGet]
        [Route("VratiSlike")]
        public async Task<ActionResult<IEnumerable<PicturesData>>> GetPicturesData()
        {
          return await context.PicturesDatas.ToListAsync();
        }

          [HttpPost]
        [Route("DodajSliku")]
        public async Task<ActionResult<PicturesData>> PostPicture([FromBody] PicturesData pictData)
        {
          
            

            var obj= await context.HostingObjects.FindAsync(pictData.hostingObject.Id);
            PicturesData picData2 = new PicturesData
            {
              hostingObject = obj,
              Pictures = pictData.Pictures
            };
                try
                {
                    context.PicturesDatas.Add(picData2);
                    await context.SaveChangesAsync();
                }

                catch (Exception)
                {
                    return BadRequest("Doslo je do greske!");
                }
           

            return CreatedAtAction("GetPicturesData", new { id = picData2.Id }, picData2);
          
        }
        [HttpGet]
        [Route("VratiSliku/{idPict}")]
        public async Task<ActionResult<PicturesData>> GetPicturesData(int idPict)
        {

           if(idPict < 0)
          {
            return BadRequest("Pogresan id!");
          }
          var picData = await context.PicturesDatas.FindAsync(idPict);

          if (picData == null)
          {
            return NotFound("Nije pronadjena slika!");
          }

          return picData;
        }


        [HttpGet]
        [Route("FunkcijaZaSlikeObjekta/{idObjekta}")]
        public async Task<ActionResult<IEnumerable<PicturesData>>> VratiGalerije(int idObjekta)
        {
          if(idObjekta < 0)
          {
            return BadRequest("Pogresan id!");
          }

           var slike =await context.PicturesDatas.Where(p=>p.hostingObject.Id==idObjekta).ToListAsync();

          if (slike == null)
          {
            return BadRequest("Ne postoje slike za ovaj objekat");
          }

          return Ok(slike);


         
        }
    

     //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
         //[Authorize(Roles = "Admin,Moderatori")]
        [HttpDelete]
        [Route("ObrisiSliku/{idPicture}")]
        public async Task<ActionResult> DeletePicture(int idPicture)
        {
            
              if(idPicture<=0)
                {
                    return BadRequest("Pogresan ID");
                }
                try
                {           
                var pictureData = await context.PicturesDatas.FindAsync(idPicture);
                context.PicturesDatas.Remove(pictureData);
                await context.SaveChangesAsync();  
                }
                catch (Exception e)
                {
                    
                    return BadRequest(e.Message);
                }
                return Ok($"Uspesno izbrisana slika");
            
        }


    }
}