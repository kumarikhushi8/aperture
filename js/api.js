async function getCoordinates(cityName) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=5&language=en&format=json`;

  let response;
  try {
    response = await fetch(url);
  } catch (networkError) {
    // fetch() itself only throws on true network failures (offline, DNS failure, CORS block, etc.)
    throw new Error("NETWORK_ERROR");
  }

  if (!response.ok) {
    // response came back, but with a bad HTTP status (rare for this API, but good practice)
    throw new Error("API_ERROR");
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error("CITY_NOT_FOUND");
  }

  return data.results[0];
}

async function getWeather(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,surface_pressure,uv_index&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`;

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