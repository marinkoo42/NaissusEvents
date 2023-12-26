using System.ComponentModel.DataAnnotations;

namespace Authentication
{
    public class Register
    {

        [Required(ErrorMessage = "Polje ime je obavezno")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Polje prezime je obavezno")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "Polje username je obavezno")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "Polje lozinka je obavezno!")]

        public string Password { get; set; }

        [Required(ErrorMessage = "Polje broj telefona je obavezno")]
        [StringLength(13, MinimumLength = 10)]
        [Phone]
        public string Phone { get; set; }

        [Required(ErrorMessage = "Polje email je obavezno!")]
        [EmailAddress]
        public string Email { get; set; }
    }
}
