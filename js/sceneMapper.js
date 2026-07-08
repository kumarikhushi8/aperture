const WEATHER_CODE_MAP = {
  0: { label: "Clear Sky", category: "clear" },
  1: { label: "Mainly Clear", category: "clear" },
  2: { label: "Partly Cloudy", category: "partly-cloudy" },
  3: { label: "Overcast", category: "overcast" },
  45: { label: "Fog", category: "fog" },
  48: { label: "Depositing Rime Fog", category: "fog" },
  51: { label: "Light Drizzle", category: "drizzle" },
  53: { label: "Drizzle", category: "drizzle" },
  55: { label: "Dense Drizzle", category: "drizzle" },
  56: { label: "Light Freezing Drizzle", category: "drizzle" },
  57: { label: "Dense Freezing Drizzle", category: "drizzle" },
  61: { label: "Slight Rain", category: "rain" },
  63: { label: "Rain", category: "rain" },
  65: { label: "Heavy Rain", category: "rain" },
  66: { label: "Light Freezing Rain", category: "rain" },
  67: { label: "Heavy Freezing Rain", category: "rain" },
  71: { label: "Slight Snow", category: "snow" },
  73: { label: "Snow", category: "snow" },
  75: { label: "Heavy Snow", category: "snow" },
  77: { label: "Snow Grains", category: "snow" },
  80: { label: "Slight Rain Showers", category: "rain" },
  81: { label: "Rain Showers", category: "rain" },
  82: { label: "Violent Rain Showers", category: "rain" },
  85: { label: "Slight Snow Showers", category: "snow" },
  86: { label: "Heavy Snow Showers", category: "snow" },
  95: { label: "Thunderstorm", category: "thunderstorm" },
  96: { label: "Thunderstorm with Slight Hail", category: "thunderstorm" },
  99: { label: "Thunderstorm with Heavy Hail", category: "thunderstorm" }
};

function getWeatherInfo(code) {
  return WEATHER_CODE_MAP[code] || { label: "Unknown", category: "clear" };
}