using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class AddCreatorToTitbit : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CreatorId",
                table: "Titbits",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Titbits_CreatorId",
                table: "Titbits",
                column: "CreatorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Titbits_AspNetUsers_CreatorId",
                table: "Titbits",
                column: "CreatorId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Titbits_AspNetUsers_CreatorId",
                table: "Titbits");

            migrationBuilder.DropIndex(
                name: "IX_Titbits_CreatorId",
                table: "Titbits");

            migrationBuilder.DropColumn(
                name: "CreatorId",
                table: "Titbits");
        }
    }
}
