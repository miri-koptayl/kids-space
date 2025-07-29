﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.DATA.Migrations
{
    /// <inheritdoc />
    public partial class AddProfilePictureUrlToUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AwardedBy",
                table: "UserAchievements");

            migrationBuilder.AddColumn<string>(
                name: "ProfilePictureUrl",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProfilePictureUrl",
                table: "Users");

            migrationBuilder.AddColumn<int>(
                name: "AwardedBy",
                table: "UserAchievements",
                type: "int",
                nullable: true);
        }
    }
}
