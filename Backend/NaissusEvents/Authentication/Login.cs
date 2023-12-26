using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Authentication
{
    public class Login
    {
        [Required(ErrorMessage = "Polje username je obavezno")]
        public String UserName { get; set; }

        [Required(ErrorMessage = "Polje lozinka je obavezno!")]
        public string Password { get; set; }
    }
}
