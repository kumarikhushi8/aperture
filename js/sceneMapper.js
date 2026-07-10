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

function getTimePhase(currentTime, sunrise, sunset, nextSunrise) {
  const now = new Date(currentTime).getTime();
  const sunriseTime = new Date(sunrise).getTime();
  const sunsetTime = new Date(sunset).getTime();
  const nextSunriseTime = new Date(nextSunrise).getTime();

  const THIRTY_MIN = 30 * 60 * 1000;
  const NINETY_MIN = 90 * 60 * 1000;
  const FOUR_HOURS = 4 * 60 * 60 * 1000;

  if (now >= sunriseTime - THIRTY_MIN && now <= sunriseTime + THIRTY_MIN) {
    return "dawn";
  }
  if (now > sunriseTime + THIRTY_MIN && now < sunsetTime - NINETY_MIN) {
    return "day";
  }
  if (now >= sunsetTime - NINETY_MIN && now <= sunsetTime + THIRTY_MIN) {
    return "dusk";
  }
  if (now > sunsetTime + THIRTY_MIN && now < sunsetTime + FOUR_HOURS) {
    return "night";
  }
  // Anything left is either late night after sunset, or early morning before tomorrow's sunrise
  return "deep-night";
}

function getCelestialPosition(progress) {
  // progress: 0 to 1, representing how far through daylight (or night) we are
  const path = document.getElementById('sun-moon-arc');
  const pathLength = path.getTotalLength();
  const point = path.getPointAtLength(progress * pathLength);
  
  return { x: point.x, y: point.y }; // these are in the SVG's viewBox coordinate units (0-100)
}

function getCelestialProgress(currentTime, sunrise, sunset, nextSunrise) {
  const now = new Date(currentTime).getTime();
  const sunriseTime = new Date(sunrise).getTime();
  const sunsetTime = new Date(sunset).getTime();
  const nextSunriseTime = new Date(nextSunrise).getTime();

  if (now >= sunriseTime && now <= sunsetTime) {
    // Daytime: progress through the sun's arc, sunrise -> sunset
    const dayLength = sunsetTime - sunriseTime;
    const elapsed = now - sunriseTime;
    return { progress: elapsed / dayLength, isDaytime: true };
  } else {
    // Nighttime: progress through the moon's arc, sunset -> next sunrise
    const nightLength = nextSunriseTime - sunsetTime;
    const elapsed = now - sunsetTime;
    return { progress: elapsed / nightLength, isDaytime: false };
  }
}

function getTerrainType(population) {
  return population > 200000 ? "urban" : "rural";
}