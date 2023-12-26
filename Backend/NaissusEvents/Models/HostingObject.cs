using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;



#nullable disable

namespace Models
{
  
  public class HostingObject
  {
  

    [Key]
    public int Id { get; set; }
    public string Name { get; set; }

    public string Adress { get; set; }

    public string Hours{get;set;}

    public double? ReviewStars{get;set;}  

   
    [StringLength(13, MinimumLength = 6)]
    [Phone]
    public string Phone { get; set; }

    public float MapX{get;set;}
    public float MapY{get;set;}

  
    public ICollection<Event> Events { get; set; }

   
    public ICollection<Table> Tables { get; set; }

    public ICollection<PicturesData> Pictures { get; set; }

    public string thumbnailPicture { get ; set;}

    [ForeignKey("AppUser")]
    public AppUser moderator {get; set;}

 

 

   
   
   

  
        
  }
}
