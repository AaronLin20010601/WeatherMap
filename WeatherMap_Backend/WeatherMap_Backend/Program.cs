var builder = WebApplication.CreateBuilder(args);

builder.Services.AddMemoryCache();
// 註冊 DI
// Weather Service

// 註冊 http client
builder.Services.AddHttpClient();

// 設置 CORS，允許跨域請求
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAnyOrigin",
        builder => builder.WithOrigins("http://localhost:5173")
                          .AllowAnyMethod()
                          .AllowAnyHeader());
});

// 其他服務註冊
builder.Services.AddControllers();

var app = builder.Build();

// 設置跨域中間件
app.UseCors("AllowAnyOrigin");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run("http://localhost:5200");
