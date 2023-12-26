using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Models
{
    public class AppUser : IdentityUser
    {

       
        [Required(ErrorMessage = "Polje ime je obavezno")]
        public string Name { get; set; }

       
        [Required(ErrorMessage = "Polje prezime je obavezno")]
        public string LastName { get; set; }


         public ICollection<Reservation> Reservations { get; set; }

        public virtual HostingObject HostingObject {get;set;}
        
    }
}
