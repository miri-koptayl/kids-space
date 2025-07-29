using Backend.CORE.Interfaces;
using Backend.CORE.IRepositories;
using Backend.CORE.Iservices;
using Backend.DATA;
using Backend.DATA.Repository;
using Backend.SERVER;
using Backend.SERVER.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Runtime;
using System.Text;
using System.Text.Json.Serialization;
using Backend.API;


namespace Backend.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("---- הדפסת כל ההגדרות ----");

            var builder = WebApplication.CreateBuilder(args);
            var configurationRoot = builder.Configuration;
            Console.WriteLine("---- הדפסת כל ההגדרות ----");
            foreach (var kvp in configurationRoot.AsEnumerable())
            {
                Console.WriteLine($"{kvp.Key} = {kvp.Value}");
            }
            Console.WriteLine("--------------------------");

            // זהו קוד פנימי שעושה:
            // builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

            // קריאת המפתח לסימטרית לחתימה על הטוקן מהקובץ appsettings.json
            var jwtKey = builder.Configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(jwtKey))
            {
                throw new Exception("JWT key is missing or empty in configuration.");
            }
            var keyBytes = Encoding.UTF8.GetBytes(jwtKey);
            Console.WriteLine($"JWT Secret: '{jwtKey}'");

            // הוספת אימות JWT (Bearer Authentication)
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = false, // ניתן להוסיף אימות על issuer במידת הצורך
                        ValidateAudience = false, // ניתן להוסיף אימות audience במידת הצורך
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(keyBytes),
                        ValidateLifetime = true
                    };
                });

            // הוספת תמיכה ב-JSON + המרת Enum ל-String ב-API
            builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                });

            // הוספת Swagger עם תמיכה באבטחת JWT
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Backend API", Version = "v1" });

                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Description = "יש להזין 'Bearer' ואחריו רווח ואז הטוקן",
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        Array.Empty<string>()
                    }
                });
            });

            // הוספת DbContext של Entity Framework
            builder.Services.AddDbContext<DataContext>();

            // הזרקת תלויות - שירותי מערכת ו-Repository
            builder.Services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

            builder.Services.AddScoped<IActivitiesRepository, ActivitiesRepository>();
            builder.Services.AddScoped<IActivitiesService, ActivitiesService>();

            builder.Services.AddScoped<IAchievementsRepository, AchievementsRepository>();
            builder.Services.AddScoped<IAchievementsService, AchievementsService>();

            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<IUserService, UserService>();

            builder.Services.AddScoped<IUserAchievementsRepository, UserAchievementsRepository>();
            builder.Services.AddScoped<IUserAchievementsService, UserAchievementsService>();

            // הגדרת מדיניות CORS המאפשרת גישה מכתובת ה-Angular
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAngularClient", policy =>
                {
                    policy.WithOrigins("http://localhost:4200")
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });

            var app = builder.Build();

            app.UseStaticFiles();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseCors("AllowAngularClient");

            app.UseAuthentication(); // חובה לפני Authorization
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
