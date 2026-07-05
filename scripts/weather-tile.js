(function () {
  const city = window.RYANOS_WEATHER_TILE;

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  }

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
      -42.379 +
      2.04901523 * T +
      10.14333127 * R -
      0.22475541 * T * R -
      0.00683783 * T * T -
      0.05481717 * R * R +
      0.00122874 * T * T * R +
      0.00085282 * T * R * R -
      0.00000199 * T * T * R * R
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
    return new Date().toLocaleTimeString("en-US", {
      timeZone,
      hour: "numeric",
      minute: "2-digit"
    });
  }

  function updateLocalClock() {
    if (!city) return;
    setText("localTime", formatTimeForZone(city.timeZone));
  }

  async function getLatestObservationFromStations(stations) {
    for (const stationFeature of stations.features) {
      const stationId = stationFeature.properties.stationIdentifier;
      const observationUrl = `https://api.weather.gov/stations/${stationId}/observations/latest`;

      try {
        const response = await fetch(observationUrl);
        if (!response.ok) continue;

        const data = await response.json();

        if (
          data &&
          data.properties &&
          data.properties.temperature &&
          data.properties.temperature.value !== null
        ) {
          return data;
        }
      } catch (error) {
        continue;
      }
    }

    throw new Error("No usable observation stations found");
  }

  async function loadWeather() {
    if (!city) {
      setText("weatherError", "Weather tile not configured");
      return;
    }

    try {
      const pointUrl = `https://api.weather.gov/points/${city.weatherLat},${city.weatherLon}`;
      const pointResponse = await fetch(pointUrl);

      if (!pointResponse.ok) {
        throw new Error("Unable to load weather point data");
      }

      const pointData = await pointResponse.json();
      const forecastUrl = pointData.properties.forecast;
      const stationsUrl = pointData.properties.observationStations;

      const [forecastResponse, stationsResponse] = await Promise.all([
        fetch(forecastUrl),
        fetch(stationsUrl)
      ]);

      if (!forecastResponse.ok || !stationsResponse.ok) {
        throw new Error("Unable to load forecast or station data");
      }

      const forecastData = await forecastResponse.json();
      const stationsData = await stationsResponse.json();
      const observationData = await getLatestObservationFromStations(stationsData);

      const current = observationData.properties;
      const periods = forecastData.properties.periods;
      const currentTempF = cToF(current.temperature.value);

      const humidity =
        current.relativeHumidity && current.relativeHumidity.value !== null
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

      setText("weatherTemp", currentTempF ?? "--");
      setText("weatherFeels", feelsLike ?? "--");
      setText("weatherHumidity", humidity ?? "--");
      setText("weatherCondition", currentForecast.shortForecast || "Current conditions");
      setText("weatherIcon", iconForForecast(currentForecast.shortForecast));

      if (tomorrowDay && tomorrowNight) {
        setText("weatherTomorrow", `${tomorrowDay.temperature}° / ${tomorrowNight.temperature}°`);
      }

      setText("weatherError", "");
    } catch (error) {
      console.error(`${city.main} weather error:`, error);
      setText("weatherError", "Weather unavailable");
    }
  }

  if (city) {
    setText("locationMain", city.main);
    setText("locationSub", `${city.sub} · ${city.airport}`);
    updateLocalClock();
    loadWeather();
    setInterval(updateLocalClock, 1000);
    setInterval(loadWeather, 15 * 60 * 1000);
  }
})();
