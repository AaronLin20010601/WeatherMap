var builder = WebApplication.CreateBuilder(args);

builder.Services.AddMemoryCache();
// ���U DI
// Weather Service

// ���U http client
builder.Services.AddHttpClient();

// �]�m CORS�A���\���ШD
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAnyOrigin",
        builder => builder.WithOrigins("http://localhost:5173")
                          .AllowAnyMethod()
                          .AllowAnyHeader());
});

// ��L�A�ȵ��U
builder.Services.AddControllers();

var app = builder.Build();

// �]�m��줤����
app.UseCors("AllowAnyOrigin");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run("http://localhost:5200");
