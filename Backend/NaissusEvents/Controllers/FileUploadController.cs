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
    public class FileUploadController : ControllerBase
    {
 
        public NaissusEventsContext context{ get; set; }
        public static IWebHostEnvironment _webHostEnvironment;
        public FileUploadController(NaissusEventsContext context, IWebHostEnvironment webHostEnvironment)
        {
            this.context=context;
            _webHostEnvironment = webHostEnvironment;
        }



 
        [Route("PostPictureHostingObject/{id:int}")]
        [HttpPost]
        public IActionResult HostingObjectPost([FromRoute]int id, [FromForm]IFormFile file)
        {
            try
            {
                if (file.Length > 0)
                {
                    string path = _webHostEnvironment.WebRootPath + "\\" + id + "\\";
                    if (!System.IO.Directory.Exists(path))
                    {
                        System.IO.Directory.CreateDirectory(path);
                    }
                    using (FileStream fileStream = System.IO.File.Create(path + file.FileName))
                    {
                        file.CopyTo(fileStream);
                        fileStream.Flush();
                        return Ok("Upload done");
                    }
                }
                else
                {
                    return BadRequest("Upload failed");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }




        
        [HttpGet("GetPictureHostingObject/{id}")]
        public  IActionResult HostingObjectGet(int id)
        {
            string path = _webHostEnvironment.WebRootPath + "\\" + id + "\\";
            var images = Directory.GetFiles(path, "*.*", SearchOption.AllDirectories).ToList();
            var files = new List<byte[]>();
            foreach (var image in images)
            {
                 byte[] b = System.IO.File.ReadAllBytes(image);
                 files.Add(b);
            }
            return Ok(files);
        }

        [Route("PostPictureEvent/{id:int}")]
        [HttpPost]
        public IActionResult eventPost([FromRoute]int id, [FromForm]IFormFile file)
        {
            try
            {
                if (file.Length > 0)
                {
                    string path = _webHostEnvironment.WebRootPath + "\\event" + id + "\\";
                    if (!System.IO.Directory.Exists(path))
                    {
                        System.IO.Directory.CreateDirectory(path);
                    }
                    using (FileStream fileStream = System.IO.File.Create(path + file.FileName))
                    {
                        file.CopyTo(fileStream);
                        fileStream.Flush();
                        return Ok("Upload done");
                    }
                }
                else
                {
                    return BadRequest("Upload failed");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetPictureEvent/{id}")]
        public  IActionResult EventGet(int id)
        {
            string path = _webHostEnvironment.WebRootPath + "\\event" + id + "\\";
            var images = Directory.GetFiles(path, "*.*", SearchOption.AllDirectories).ToList();
            var files = new List<byte[]>();
            foreach (var image in images)
            {
                 byte[] b = System.IO.File.ReadAllBytes(image);
                 files.Add(b);
            }
            return Ok(files);
        }

        [Route("DeletePictureEvent/{id:int}")]
        [HttpDelete]
        public IActionResult deleteEventPicture(int id)
        {
            try
            {
                    string path = _webHostEnvironment.WebRootPath + "\\event" + id + "\\";
                    if (System.IO.Directory.Exists(path))
                    {
                        var images = Directory.GetFiles(path,"*.*",SearchOption.AllDirectories).ToList();

                        foreach (var image in images)
                        {
                            System.IO.File.Delete(image);
                        }
                        System.IO.Directory.Delete(path);
                        return Ok("Deleted");
                    }
                    else
                    {
                        return BadRequest("Delete failed");
                    }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

         [Route("DeletePictureHostingObject/{id:int}")]
        [HttpDelete]
        public IActionResult deleteHostingObjectPicture(int id)
        {
            try
            {
                    string path = _webHostEnvironment.WebRootPath + "\\" + id + "\\";
                    if (System.IO.Directory.Exists(path))
                    {
                        var images = Directory.GetFiles(path,"*.*",SearchOption.AllDirectories).ToList();
                        foreach (var image in images)
                        {
                            System.IO.File.Delete(image);
                        }
                        System.IO.Directory.Delete(path);
                        return Ok("Deleted");
                    }
                    else
                    {
                        return BadRequest("Delete failed");
                    }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }








    }



}