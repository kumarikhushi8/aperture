const tempDisplay = document.querySelector('.temp-display');
const conditionText = document.querySelector('.condition-text');
const feelsLikeText = document.querySelector('.feels-like-text');
const statHumidity = document.querySelector('.stat-humidity');
const statWind = document.querySelector('.stat-wind');
const statPressure = document.querySelector('.stat-pressure');
const statUV = document.querySelector('.stat-uv');


const searchForm = document.querySelector('.nameplate-search');

searchForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // stops the browser's default "reload the page" behavior on form submit
  
  const cityInput = searchForm.querySelector('input');
  const cityName = cityInput.value.trim(); // .trim() removes accidental leading/trailing spaces
  
  if (!cityName) return; // guard clause: don't bother fetching if the input is empty
  
  try {
  const location = await getCoordinates(cityName);
  const weather = await getWeather(location.latitude, location.longitude);
  const weatherInfo = getWeatherInfo(weather.current.weather_code);
  const timePhase = getTimePhase(weather.current.time, weather.daily.sunrise[0], weather.daily.sunset[0]);

  updateDisplay(weather, location.name);
  applySceneState(weatherInfo, timePhase);
} catch (error) {
  console.error('Something went wrong:', error.message);
}
});


function updateDisplay(weather, locationName) {
  const current = weather.current;
  const weatherInfo = getWeatherInfo(current.weather_code);

  tempDisplay.textContent = `${Math.round(current.temperature_2m)}°`;
  conditionText.textContent = weatherInfo.label;
  feelsLikeText.textContent = `Feels like ${Math.round(current.apparent_temperature)}°`;

  statHumidity.textContent = `${Math.round(current.relative_humidity_2m)}%`;
  statWind.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
  statPressure.textContent = `${Math.round(current.surface_pressure)} hPa`;
  statUV.textContent = current.uv_index !== undefined ? current.uv_index.toFixed(1) : '--';

  function applySceneState(weatherInfo, timePhase) {
  const sceneStage = document.querySelector('.scene-stage');
  sceneStage.dataset.weather = weatherInfo.category;
  sceneStage.dataset.phase = timePhase;
}
}