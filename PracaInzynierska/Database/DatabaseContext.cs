using API.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Database
{
    public class DatabaseContext : IdentityDbContext<User, UserRole, string>
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options)
            : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<MonumentTrip>().HasKey(k => new { k.TripId, k.MonumentId });
            modelBuilder.Entity<Monument>()
                .Property(l => l.Longitude)
                .HasColumnType("decimal(15,12)");
            modelBuilder.Entity<Monument>()
                .Property(l => l.Latitude)
                .HasColumnType("decimal(15,12)");
        }

        public DbSet<BannedWord> BannedWords { get; set; }
        public DbSet<City> Cities { get; set; }
        public DbSet<Mark> Marks { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Monument> Monuments { get; set; }
        public DbSet<MonumentTrip> MonumentsTrips { get; set; }
        public DbSet<NewPhoto> NewPhotos { get; set; }
        public DbSet<OldPhoto> OldPhotos { get; set; }
        public DbSet<Titbit> Titbits { get; set; }
        public DbSet<Trip> Trips { get; set; }
    }
}
