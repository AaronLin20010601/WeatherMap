using Microsoft.AspNetCore.Mvc;

namespace WeatherMap_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WeatherController : ControllerBase
    {
        [HttpGet("current")]
        public IActionResult GetCurrentWeather()
        {
            var mockWeathers = new[]
            {
                new {
                    location = "Taipei",
                    latitude = 25.0330,
                    longitude = 121.5654,
                    temperature = "28°C",
                    windSpeed = "15 km/h"
                },
                new {
                    location = "Taichung",
                    latitude = 24.1477,
                    longitude = 120.6736,
                    temperature = "27°C",
                    windSpeed = "10 km/h"
                },
                new {
                    location = "Kaohsiung",
                    latitude = 22.6273,
                    longitude = 120.3014,
                    temperature = "30°C",
                    windSpeed = "12 km/h"
                }
            };

            return Ok(mockWeathers);
        }
    }
}
