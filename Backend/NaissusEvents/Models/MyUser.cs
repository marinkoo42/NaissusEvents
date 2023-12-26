using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace Models
{
    public class MyUser
    {
        public string Id { get; set; }
        
        public string Role { get; set; }


        public string Token { get; set; }

        public string ValidTo { get; set; }

        [Required(ErrorMessage = "Polje ime je obavezno")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Polje prezime je obavezno")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "Polje username je obavezno")]
        public string UserName { get; set; }

        //[Required(ErrorMessage = "Polje lozinka je obavezno!")]

        public string Password { get; set; }

        [Required(ErrorMessage = "Polje broj telefona je obavezno")]

        public string Phone { get; set; }

        [Required(ErrorMessage = "Polje email je obavezno!")]
        public string Email { get; set; }

        public virtual ICollection<Reservation> Reservations { get; set; }
    }
}
