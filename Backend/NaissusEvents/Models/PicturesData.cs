using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;



namespace Models
{
    
    public class PicturesData
    {
        [Key]
        public int Id { get; set; }
        public string Pictures { get; set; }
        public HostingObject hostingObject {get;set;}


    }
}
