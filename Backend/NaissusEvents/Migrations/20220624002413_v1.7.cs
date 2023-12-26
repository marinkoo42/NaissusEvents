using Microsoft.EntityFrameworkCore.Migrations;

namespace NaissusEvents.Migrations
{
    public partial class v17 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AppUser",
                table: "HostingObjects",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "thumbnailPicture",
                table: "HostingObjects",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_HostingObjects_AppUser",
                table: "HostingObjects",
                column: "AppUser",
                unique: true,
                filter: "[AppUser] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_HostingObjects_AspNetUsers_AppUser",
                table: "HostingObjects",
                column: "AppUser",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HostingObjects_AspNetUsers_AppUser",
                table: "HostingObjects");

            migrationBuilder.DropIndex(
                name: "IX_HostingObjects_AppUser",
                table: "HostingObjects");

            migrationBuilder.DropColumn(
                name: "AppUser",
                table: "HostingObjects");

            migrationBuilder.DropColumn(
                name: "thumbnailPicture",
                table: "HostingObjects");
        }
    }
}
