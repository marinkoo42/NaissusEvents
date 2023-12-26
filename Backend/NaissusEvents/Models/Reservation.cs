
using System.ComponentModel.DataAnnotations;


namespace Models
{

    public class Reservation
    {
        [Key]
        public int Id { get; set; }

        public virtual Event Event { get; set; }


        public Table Table {get; set;}
        
        public virtual AppUser MyUser {get;set;}

    }
}
