using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System;

namespace Models
{

    public class Event
    {
        [Key]
        public int Id { get; set; }

        public string eventName { get; set;}

        [Required]
        public string eventDescription { get; set;}

        [Required]
        public DateTime eventDate { get; set; }

        public HostingObject hostingObject{get;set;}

        public ICollection<Reservation> Reservations { get; set; }

        public string eventPicture { get ; set;}

    }
}
