using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class editMonument : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "IsDue",
                table: "Monuments",
                nullable: true,
                oldClrType: typeof(bool));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "IsDue",
                table: "Monuments",
                nullable: false,
                oldClrType: typeof(bool),
                oldNullable: true);
        }
    }
}
