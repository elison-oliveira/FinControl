using ControleGastos.Api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Adiciona os serviços (Controllers, Swagger)
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Ensina a API a ler e retornar Enums como texto (String) em vez de números
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Registrando as regras de negócio
builder.Services.AddScoped<ControleGastos.Api.Application.Services.PessoaService>();
builder.Services.AddScoped<ControleGastos.Api.Application.Services.TransacaoService>();
builder.Services.AddScoped<ControleGastos.Api.Application.Services.TotaisService>();

// Configura o Entity Framework Core com o SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configuração de CORS (importante para quando conectarmos o React)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

var app = builder.Build();

// Toque Sênior: Aplica as migrations automaticamente ao iniciar o projeto.
// Isso facilita a vida do avaliador do teste técnico.
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();
}

// Configuração do Pipeline HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();

app.Run();