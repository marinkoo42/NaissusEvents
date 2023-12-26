using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Models
{
  
  public class Review
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("hosting_object_id")]
        public int HostingObjectId { get; set; }

        [Column("user_id")]
        public string UserId { get; set; }

        public int ReviewValue { get; set; }

    }
}
