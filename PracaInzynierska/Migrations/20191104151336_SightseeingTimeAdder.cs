using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class SightseeingTimeAdder : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SightseeingTime",
                table: "Trips",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SightseeingTime",
                table: "Trips");
        }
    }
}
