using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class DeleteArticlesAndUpdateTitbit : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ArticlesAttachment");

            migrationBuilder.DropTable(
                name: "ArticlesUrlAddress");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Titbits",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "Titbits");

            migrationBuilder.CreateTable(
                name: "ArticlesAttachment",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Attachment = table.Column<byte[]>(nullable: true),
                    MonumentId = table.Column<long>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    Source = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ArticlesAttachment", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ArticlesAttachment_Monuments_MonumentId",
                        column: x => x.MonumentId,
                        principalTable: "Monuments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ArticlesUrlAddress",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    MonumentId = table.Column<long>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    Source = table.Column<string>(nullable: true),
                    Url = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ArticlesUrlAddress", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ArticlesUrlAddress_Monuments_MonumentId",
                        column: x => x.MonumentId,
                        principalTable: "Monuments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ArticlesAttachment_MonumentId",
                table: "ArticlesAttachment",
                column: "MonumentId");

            migrationBuilder.CreateIndex(
                name: "IX_ArticlesUrlAddress_MonumentId",
                table: "ArticlesUrlAddress",
                column: "MonumentId");
        }
    }
}
