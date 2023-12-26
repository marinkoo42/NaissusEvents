using Microsoft.EntityFrameworkCore.Migrations;

namespace NaissusEvents.Migrations
{
    public partial class v14 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PicturesDatas_HostingObjects_HostingObjectId",
                table: "PicturesDatas");

            migrationBuilder.DropColumn(
                name: "user",
                table: "Tables");

            migrationBuilder.RenameColumn(
                name: "HostingObjectId",
                table: "PicturesDatas",
                newName: "hostingObjectId");

            migrationBuilder.RenameIndex(
                name: "IX_PicturesDatas_HostingObjectId",
                table: "PicturesDatas",
                newName: "IX_PicturesDatas_hostingObjectId");

            migrationBuilder.AddColumn<string>(
                name: "MyUserId",
                table: "Reservations",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TableId",
                table: "Reservations",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_MyUserId",
                table: "Reservations",
                column: "MyUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_TableId",
                table: "Reservations",
                column: "TableId");

            migrationBuilder.AddForeignKey(
                name: "FK_PicturesDatas_HostingObjects_hostingObjectId",
                table: "PicturesDatas",
                column: "hostingObjectId",
                principalTable: "HostingObjects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_MyUsers_MyUserId",
                table: "Reservations",
                column: "MyUserId",
                principalTable: "MyUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_Tables_TableId",
                table: "Reservations",
                column: "TableId",
                principalTable: "Tables",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PicturesDatas_HostingObjects_hostingObjectId",
                table: "PicturesDatas");

            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_MyUsers_MyUserId",
                table: "Reservations");

            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_Tables_TableId",
                table: "Reservations");

            migrationBuilder.DropIndex(
                name: "IX_Reservations_MyUserId",
                table: "Reservations");

            migrationBuilder.DropIndex(
                name: "IX_Reservations_TableId",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "MyUserId",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "TableId",
                table: "Reservations");

            migrationBuilder.RenameColumn(
                name: "hostingObjectId",
                table: "PicturesDatas",
                newName: "HostingObjectId");

            migrationBuilder.RenameIndex(
                name: "IX_PicturesDatas_hostingObjectId",
                table: "PicturesDatas",
                newName: "IX_PicturesDatas_HostingObjectId");

            migrationBuilder.AddColumn<string>(
                name: "user",
                table: "Tables",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_PicturesDatas_HostingObjects_HostingObjectId",
                table: "PicturesDatas",
                column: "HostingObjectId",
                principalTable: "HostingObjects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
