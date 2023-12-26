using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Http;

namespace Models
{

    public class FileUpload
    {
        
            public IFormFile File {get;set;}

            public int? id {get;set;}
    }
}