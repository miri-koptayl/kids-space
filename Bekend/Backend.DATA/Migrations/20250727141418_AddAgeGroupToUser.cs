using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.DATA.Migrations
{
    /// <inheritdoc />
    public partial class AddAgeGroupToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Agegroup",
                table: "Users",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Agegroup",
                table: "Users");
        }
    }
}
