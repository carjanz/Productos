using FixedsApp.Application.Utility;
using FixedsApp.Infrastructure.Auth.JWT;
using FixedsApp.Infrastructure.Identity;
using FixedsApp.Infrastructure.Images;
using FixedsApp.Infrastructure.Mailer;
using FixedsApp.Infrastructure.Mapper;
using FixedsApp.Infrastructure.Persistence.Contexts;
using FixedsApp.Infrastructure.Persistence.Extensions;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;



namespace FixedsApp.WebApi.Extensions
{
    public static class ServiceCollectionExtensions // configure application services
    {

        public static void ConfigureApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            #region [-- CORS --]
            _ = services.AddCors(p => p.AddPolicy("defaultPolicy", builder =>
            {
                _ = builder.WithOrigins("*").AllowAnyMethod().AllowAnyHeader();
            }));
            #endregion

            #region [-- ADD CONTROLLERS AND SERVICES --]

            _ = services.AddControllers(opt =>
            {
                var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
                opt.Filters.Add(new AuthorizeFilter(policy)); // makes so that all the controllers require authorization by default

            }).AddFluentValidation(fv =>
            {
                fv.ImplicitlyValidateChildProperties = true;
                fv.ImplicitlyValidateRootCollectionElements = true;

                fv.RegisterValidatorsFromAssemblyContaining<IRequestValidator>(); // auto registers all fluent validation classes, in all assemblies with an IRequestValidator class
                fv.RegisterValidatorsFromAssemblyContaining<Infrastructure.Utility.IRequestValidator>();
            });

            _ = services.AddEndpointsApiExplorer();
            _ = services.AddAutoMapper(typeof(MappingProfiles));
            _ = services.Configure<MailSettings>(configuration.GetSection("MailSettings"));
            _ = services.Configure<CloudinarySettings>(configuration.GetSection("Cloudinary"));

            _ = services.AddServices(); // dynamic services registration

            //----------- Add Services (Dependency Injection) -------------------------------------------

            // From DynamicServiceRegistrationExtensions
            // Auto registers scoped/transient marked services 

            // ICurrentTenantUserService -- registered as Scoped (resolve the tenant/user from token/header)
            // IIdentityService, ITokenService, IRepositoryAsync, ITenantManagementService -- registered as Transient

            // Any additional app services should be registered as Transient

            //---------------------------------------------------------------------------

            #endregion

            #region [-- REGISTERING DB CONTEXT SERVICE --]
            _ = services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));
            _ = services.AddAndMigrateDatabase<ApplicationDbContext>(configuration);
            #endregion

            #region [-- SETTING UP IDENTITY CONFIGURATIONS --]

            _ = services.AddIdentity<ApplicationUser, IdentityRole>(o =>
            {
                o.SignIn.RequireConfirmedAccount = false; // password requirements - set as needed
                o.Password.RequiredLength = 6;
                o.Password.RequireDigit = false;
                o.Password.RequireLowercase = false;
                o.Password.RequireUppercase = false;
                o.Password.RequireNonAlphanumeric = false;
            }).AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();


            #endregion

            #region [-- JWT SETTINGS --]

            _ = services.Configure<JWTSettings>(configuration.GetSection("JWTSettings")); // get settings from appsettings.json
            _ = services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
               .AddJwtBearer(o =>
               {
                   o.RequireHttpsMetadata = false;
                   o.SaveToken = false;
                   o.TokenValidationParameters = new TokenValidationParameters
                   {
                       ValidateIssuerSigningKey = true,
                       ValidateIssuer = true,
                       ValidateAudience = true,
                       ValidateLifetime = true,
                       ClockSkew = TimeSpan.Zero,
                       ValidIssuer = configuration["JWTSettings:Issuer"],
                       ValidAudience = configuration["JWTSettings:Audience"],
                       IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWTSettings:Key"]))
                   };
                   o.Events = new JwtBearerEvents()
                   {
                       OnChallenge = context =>
                       {
                           context.HandleResponse();

                           context.Response.ContentType = "application/json";
                           context.Response.StatusCode = 401;

                           return context.Response.WriteAsync("Not Authorized");
                       },
                       OnForbidden = context =>
                       {
                           context.Response.StatusCode = 403;
                           context.Response.ContentType = "application/json";

                           return context.Response.WriteAsync("Not Authorized");
                       },
                   };
               });

            #endregion

        }
    }
}
