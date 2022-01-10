using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class AddPropToPhoto : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Date",
                table: "OldPhotos",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Source",
                table: "OldPhotos",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Source",
                table: "NewPhotos",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Date",
                table: "OldPhotos");

            migrationBuilder.DropColumn(
                name: "Source",
                table: "OldPhotos");

            migrationBuilder.DropColumn(
                name: "Source",
                table: "NewPhotos");
        }
    }
}
