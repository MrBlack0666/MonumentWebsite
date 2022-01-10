using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class AddMonumetCreator : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CreatorId",
                table: "Monuments",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Monuments_CreatorId",
                table: "Monuments",
                column: "CreatorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Monuments_AspNetUsers_CreatorId",
                table: "Monuments",
                column: "CreatorId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Monuments_AspNetUsers_CreatorId",
                table: "Monuments");

            migrationBuilder.DropIndex(
                name: "IX_Monuments_CreatorId",
                table: "Monuments");

            migrationBuilder.DropColumn(
                name: "CreatorId",
                table: "Monuments");
        }
    }
}
