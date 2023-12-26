
using Authentication;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace Models
{

    public class NaissusEventsContext : IdentityDbContext<AppUser>
    {
        public DbSet<HostingObject> HostingObjects { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<AppUser> AppUsers { get; set; }
        public DbSet<Table> Tables { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Event> Events{get;set;}
        public DbSet<PicturesData> PicturesDatas {get;set;}
        //public DbSet<MyUser> MyUsers{get;set;}

        public NaissusEventsContext(DbContextOptions<NaissusEventsContext> options) : base(options)
        {
             
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }

}