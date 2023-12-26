using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace NaissusEvents.Migrations
{
    public partial class V11 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Event",
                table: "HostingObjects");

            migrationBuilder.CreateTable(
                name: "Event",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    eventName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    eventDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    eventDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    HostingObjectId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Event", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Event_HostingObjects_HostingObjectId",
                        column: x => x.HostingObjectId,
                        principalTable: "HostingObjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Event_HostingObjectId",
                table: "Event",
                column: "HostingObjectId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Event");

            migrationBuilder.AddColumn<string>(
                name: "Event",
                table: "HostingObjects",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
