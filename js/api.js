const CITY_ALIASES = {
  "bangalore": "Bengaluru",
  "bombay": "Mumbai",
  "madras": "Chennai",
  "calcutta": "Kolkata",
  "poona": "Pune",
  "cochin": "Kochi"
};

function resolveCityAlias(cityName) {
  const normalized = cityName.trim().toLowerCase();
  return CITY_ALIASES[normalized] || cityName;
}

async function getCoordinates(cityName) {
  const resolvedName = resolveCityAlias(cityName);
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(resolvedName)}&count=5&language=en&format=json`;

  let response;
  try {
    response = await fetch(url);
  } catch (networkError) {
    throw new Error("NETWORK_ERROR");
  }

  if (!response.ok) {
    throw new Error("API_ERROR");
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error("CITY_NOT_FOUND");
  }

  const bestMatch = data.results.reduce((best, current) => {
    const bestPop = best.population || 0;
    const currentPop = current.population || 0;
    return currentPop > bestPop ? current : best;
  });

  return bestMatch;
}

async function getWeather(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,surface_pressure,uv_index&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto&forecast_hours=48`;

  let response;
  try {
    response = await fetch(url);
  } catch (networkError) {
    throw new Error("NETWORK_ERROR");
  }

  if (!response.ok) {
    throw new Error("API_ERROR");
  }

  return await response.json();
}