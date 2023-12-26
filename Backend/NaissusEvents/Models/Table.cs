using System.ComponentModel.DataAnnotations;



namespace Models
{

    public class Table
    {
        [Key]
        public int Id { get; set; }

        public TableType tableType { get; set;}

        public int TableCapacity {get;set;}

        public HostingObject hostingObject {get;set;}



        

        
    }
}
