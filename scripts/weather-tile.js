function cToF(celsius) {
  if (celsius === null || celsius === undefined) return null;
  return Math.round((celsius * 9 / 5) + 32);
}

function heatIndexF(tempF, humidity) {
  if (tempF === null || humidity === null) return tempF;
  if (tempF < 80 || humidity < 40) return tempF;
  const T = tempF;
  const R = humidity;
  return Math.round(
    -42.379 + 2.04901523 * T + 10.14333127 * R - 0.22475541 * T * R -
    0.00683783 * T * T - 0.05481717 * R * R + 0.00122874 * T * T * R +
    0.00085282 * T * R * R - 0.00000199 * T * T * R * R
  );
}

function iconForForecast(text) {
  const value = String(text || "").toLowerCase();
  if (value.includes("thunder")) return "⛈️";
  if (value.includes("rain") || value.includes("showers") || value.includes("drizzle")) return "🌧️";
  if (value.includes("snow") || value.includes("flurries")) return "❄️";
  if (value.includes("fog") || value.includes("mist")) return "🌫️";
  if (value.includes("cloudy") || value.includes("overcast")) return "☁️";
  if (value.includes("partly") || value.includes("mostly sunny")) return "🌤️";
  if (value.includes("sunny") || value.includes("clear")) return "☀️";
  return "⛅";
}

function formatTimeForZone(timeZone) {
  return new Date().toLocaleTimeString("en-US", { timeZone, hour: "numeric", minute: "2-digit" });
}

async function getLatestObservationFromStations(stations) {
  for (const stationFeature of stations.features) {
    const stationId = stationFeature.properties.stationIdentifier;
    const observationUrl = `https://api.weather.gov/stations/${stationId}/observations/latest`;
    try {
      const response = await fetch(observationUrl);
      if (!response.ok) continue;
      const data = await response.json();
      if (data?.properties?.temperature?.value !== null && data?.properties?.temperature?.value !== undefined) return data;
    } catch (error) { continue; }
  }
  throw new Error("No usable observation stations found");
}

function updateLocalClock(city) {
  const element = document.getElementById("localTime");
  if (element) element.textContent = formatTimeForZone(city.timeZone);
}

async function loadWeather() {
  const city = window.RYANOS_WEATHER_TILE;
  if (!city) return;
  const errorElement = document.getElementById("weatherError");
  try {
    const pointUrl = `https://api.weather.gov/points/${city.weatherLat},${city.weatherLon}`;
    const pointResponse = await fetch(pointUrl);
    if (!pointResponse.ok) throw new Error("Unable to load weather point data");
    const pointData = await pointResponse.json();
    const [forecastResponse, stationsResponse] = await Promise.all([
      fetch(pointData.properties.forecast),
      fetch(pointData.properties.observationStations)
    ]);
    if (!forecastResponse.ok || !stationsResponse.ok) throw new Error("Unable to load forecast or station data");
    const forecastData = await forecastResponse.json();
    const stationsData = await stationsResponse.json();
    const observationData = await getLatestObservationFromStations(stationsData);
    const current = observationData.properties;
    const periods = forecastData.properties.periods;
    const currentTempF = cToF(current.temperature.value);
    const humidity = current.relativeHumidity?.value !== null && current.relativeHumidity?.value !== undefined
      ? Math.round(current.relativeHumidity.value)
      : null;
    const feelsLike = humidity !== null ? heatIndexF(currentTempF, humidity) : currentTempF;
    const currentForecast = periods[0];
    const tomorrowDay = periods.find(period => {
      const periodDate = new Date(period.startTime);
      const now = new Date();
      return period.isDaytime && periodDate.getDate() !== now.getDate();
    });
    const tomorrowNight = periods.find(period => {
      if (!tomorrowDay) return false;
      const periodDate = new Date(period.startTime);
      const tomorrowDate = new Date(tomorrowDay.startTime);
      return !period.isDaytime && periodDate.getDate() === tomorrowDate.getDate();
    });

    document.getElementById("weatherTemp").textContent = currentTempF ?? "--";
    document.getElementById("weatherFeels").textContent = feelsLike ?? "--";
    document.getElementById("weatherHumidity").textContent = humidity ?? "--";
    document.getElementById("weatherCondition").textContent = currentForecast.shortForecast || "Current conditions";
    document.getElementById("weatherIcon").textContent = iconForForecast(currentForecast.shortForecast);
    if (tomorrowDay && tomorrowNight) {
      document.getElementById("weatherTomorrow").textContent = `${tomorrowDay.temperature}° / ${tomorrowNight.temperature}°`;
    }
    if (errorElement) errorElement.textContent = "";
  } catch (error) {
    console.error(`${city.main} weather error:`, error);
    if (errorElement) errorElement.textContent = "Weather unavailable";
  }
}

const city = window.RYANOS_WEATHER_TILE;
if (city) {
  document.getElementById("locationMain").textContent = city.main;
  document.getElementById("locationSub").textContent = `${city.sub} · ${city.airport}`;
  updateLocalClock(city);
  loadWeather();
  setInterval(() => updateLocalClock(city), 1000);
  setInterval(loadWeather, 15 * 60 * 1000);
}
