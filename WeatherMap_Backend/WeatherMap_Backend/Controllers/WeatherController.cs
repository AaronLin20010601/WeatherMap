﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace WeatherMap_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WeatherController : ControllerBase
    {
        private readonly IMemoryCache _cache;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _config;

        public WeatherController(IMemoryCache cache, IHttpClientFactory httpClientFactory, IConfiguration config)
        {
            _cache = cache;
            _httpClientFactory = httpClientFactory;
            _config = config;
        }

        [HttpGet("{layer}/{z:int}/{x:int}/{y:int}.png")]
        public async Task<IActionResult> GetWeatherTile(string layer, int z, int x, int y)
        {
            string cacheKey = $"{layer}_{z}_{x}_{y}";

            if (_cache.TryGetValue<byte[]>(cacheKey, out var cachedData))
            {
                Console.WriteLine($"[CACHE HIT] {cacheKey} @ {DateTime.Now}");
                return File(cachedData, "image/png");
            }

            var apiKey = _config["OpenWeatherMap:ApiKey"];
            string url = $"https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid={apiKey}";

            var client = _httpClientFactory.CreateClient();
            var response = await client.GetAsync(url);

            if (!response.IsSuccessStatusCode)
                return NotFound();

            var tileBytes = await response.Content.ReadAsByteArrayAsync();

            // 快取保留至下個整點
            DateTimeOffset now = DateTimeOffset.Now;
            DateTimeOffset nextHour = new DateTimeOffset(
                now.Year, now.Month, now.Day, now.Hour, 0, 0, now.Offset
            ).AddHours(1);

            var cacheEntryOptions = new MemoryCacheEntryOptions
            {
                AbsoluteExpiration = nextHour
            };

            _cache.Set(cacheKey, tileBytes, cacheEntryOptions);

            return File(tileBytes, "image/png");
        }
    }
}
