using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class decimalcoord : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "Longitude",
                table: "Monuments",
                type: "decimal(15,12)",
                nullable: false,
                oldClrType: typeof(decimal));

            migrationBuilder.AlterColumn<decimal>(
                name: "Latitude",
                table: "Monuments",
                type: "decimal(15,12)",
                nullable: false,
                oldClrType: typeof(decimal));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "Longitude",
                table: "Monuments",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(15,12)");

            migrationBuilder.AlterColumn<decimal>(
                name: "Latitude",
                table: "Monuments",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(15,12)");
        }
    }
}
