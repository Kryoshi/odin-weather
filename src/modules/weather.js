import { storageAvailable } from "./storage";
import WEATHERCONDITIONS from "../weather_api/weather_conditions";
import C from "./constants.json";

const REFRESH_INTERVAL = C.REFRESH_MINUTES * 60 * 1000; //(ms)

export { Weather };

class Weather {
  #data;
  #locationURL;
  #epoch_seconds;
  searchCounter = 0;

  async getCurrentData() {
    const currentData = {};

    const iconURL = await this.getCurrentIconURL();
    const location = await this.getLocation();
    const temperature = await this.getCurrentTemperature();
    const miscData = await this.getWeatherMiscData();

    if (iconURL) {
      currentData.iconURL = iconURL;
    }

    if (location) {
      currentData.location = location;
    }

    if (temperature) {
      currentData.temperature = temperature;
    }

    if (miscData) {
      currentData.miscData = miscData;
    }

    return currentData;
  }

  async getLocation() {
    if (await this.loadData()) {
      return this.#data.location.name;
    }
  }

  async getCurrentTemperature() {
    if (await this.loadData()) {
      return { c: this.#data.current.temp_c, f: this.#data.current.temp_f };
    }
  }

  async getCurrentIconURL() {
    if (await this.loadData()) {
      return this.#generateIconURL(this.#data.current);
    }
  }

  async getWeatherMiscData() {
    if (await this.loadData()) {
      const isDay = this.#data.current.is_day;
      const condition = this.#data.current.condition.text;
      const feelsLike = {
        c: this.#data.current.feelslike_c,
        f: this.#data.current.feelslike_f,
      };
      const wind = {
        kph: this.#data.current.wind_kph,
        mph: this.#data.current.wind_mph,
      };
      const humidity = this.#data.current.humidity;
      const sunrise = this.#data.forecast.forecastday[0].astro.sunrise;
      const sunset = this.#data.forecast.forecastday[0].astro.sunset;
      const precipitationChance = await this.getCurrentPrecipitationChance();

      return {
        isDay,
        condition,
        feelsLike,
        wind,
        humidity,
        sunrise,
        sunset,
        precipitationChance,
      };
    }
  }

  async getCurrentPrecipitationChance() {
    if (await this.loadData()) {
      const precipitationChance = {};

      const day = 0;
      for (let hour = 0; hour < C.DAILY_HOURS; ++hour) {
        let currentForecast = this.#data.forecast.forecastday[day].hour[hour];

        if (
          this.#epoch_seconds - C.HOUR_SECONDS / 2 <
          currentForecast.time_epoch
        ) {
          precipitationChance.rain = currentForecast.chance_of_rain;
          precipitationChance.snow = currentForecast.chance_of_snow;
          break;
        }
      }

      return precipitationChance;
    }
  }

  async getAirQuality() {
    if (await this.loadData()) {
      const aqi = this.#data.current.air_quality;
      if (aqi) {
        return aqi;
      }
    }
  }

  async getDailyForecast() {
    if (await this.loadData()) {
      const dailyForecast = [];

      for (let day of this.#data.forecast.forecastday) {
        let dayForecast = day.day;
        dailyForecast.push({
          date: day.date,
          maxTemperature: {
            c: dayForecast.maxtemp_c,
            f: dayForecast.maxtemp_f,
          },
          minTemperature: {
            c: dayForecast.mintemp_c,
            f: dayForecast.mintemp_f,
          },
          precipitationChance: {
            rain: dayForecast.daily_chance_of_rain,
            snow: dayForecast.daily_chance_of_snow,
          },
          iconURL: this.#generateIconURL(dayForecast),
        });
      }

      return dailyForecast;
    }
  }

  async getHourlyForecastNow() {
    if (await this.loadData()) {
      const hourlyForecast = [];

      const maxHours = C.DAILY_HOURS;

      let countedHours = 0;
      let hour = 0;
      let day = 0;

      const checkEndofDay = () => {
        if (hour === C.DAILY_HOURS) {
          hour = 0;
          day++;
        }
      };

      while (countedHours < maxHours) {
        let currentForecast = this.#data.forecast.forecastday[day].hour[hour];
        if (this.#epoch_seconds > currentForecast.time_epoch) {
          hour++;
          checkEndofDay();
          continue;
        } else {
          hourlyForecast.push({
            time: currentForecast.time.split(" ")[1],
            temperature: {
              c: currentForecast.temp_c,
              f: currentForecast.temp_f,
            },
            precipitationChance: {
              rain: currentForecast.chance_of_rain,
              snow: currentForecast.chance_of_snow,
            },
            iconURL: this.#generateIconURL(currentForecast),
          });
          countedHours++;
          hour++;
          checkEndofDay();
        }
      }

      return hourlyForecast;
    }
  }

  #generateIconURL(forecastData) {
    let dayStatus;
    if (forecastData.is_day != null && forecastData.is_day != undefined) {
      dayStatus = forecastData.is_day ? "day" : "night";
    } else {
      dayStatus = "day";
    }
    const iconCode = WEATHERCONDITIONS[forecastData.condition.code].icon;

    const iconURL = `./weather_icons/${dayStatus}/${iconCode}.png`;

    return iconURL;
  }

  async loadData(locationURL = this.#locationURL) {
    if (!locationURL) {
      if (this.#loadCacheLocation()) {
        locationURL = this.#locationURL;
      }
    }

    if (this.#localLoad(locationURL)) {
      return true;
    }

    if (await this.#webLoad(locationURL)) {
      return true;
    }

    return false;
  }

  async refresh() {
    let locationURL = this.#locationURL;
    if (!locationURL) {
      if (this.#loadCacheLocation()) {
        locationURL = this.#locationURL;
      }
    }

    if (locationURL) {
      if (await this.#webLoad(locationURL)) {
        return true;
      }
    }
    return false;
  }

  #localLoad(locationURL) {
    if (!this.#canRefresh()) {
      if (locationURL === this.#locationURL && this.#data) {
        return true;
      } else if (this.#matchCacheLocation(locationURL) && this.#loadCache()) {
        return true;
      }
    }
    return false;
  }

  async #webLoad(locationURL) {
    this.#locationURL = locationURL;
    const data = await this.#fetchData();
    if (data) {
      this.#saveCache();
      return true;
    }
    return false;
  }

  async search(query) {
    this.searchCounter++;
    const locations = this.#fetchLocations(query);
    if (locations && !locations.error) {
      return locations;
    }
  }

  async #fetchLocations(query) {
    try {
      const request_url =
        "https://api.weatherapi.com/v1/search.json?" +
        `key=${C.API_KEY}` +
        `&q=${query}`;
      const response = await fetch(request_url, { mode: "cors" });
      const locationData = await response.json();

      return locationData;
    } catch (error) {
      this.#signalError(error.message);
      return false;
    }
  }

  async #fetchData() {
    try {
      const request_url =
        "https://api.weatherapi.com/v1/forecast.json?" +
        `key=${C.API_KEY}` +
        `&q=${this.#locationURL}` +
        `&days=${C.FORECAST_DAYS}` +
        `&aqi=yes`;
      const response = await fetch(request_url, { mode: "cors" });
      const weatherData = await response.json();

      if (weatherData.error) {
        throw new Error(weatherData.error.message);
      } else {
        this.#data = weatherData;
        return true;
      }
    } catch (error) {
      this.#signalError(error.message);
      return false;
    }
  }

  #matchCacheLocation(locationURL) {
    if (storageAvailable) {
      const cacheLocation = localStorage.getItem(C.STORAGE_KEYS.location);
      if (cacheLocation) {
        if (locationURL === cacheLocation) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      this.#signalError("Browser does not allow cache");
      return false;
    }
  }

  #loadCacheLocation() {
    if (storageAvailable) {
      const cacheLocation = localStorage.getItem(C.STORAGE_KEYS.location);
      if (cacheLocation) {
        this.#locationURL = cacheLocation;
        return true;
      } else {
        return false;
      }
    } else {
      this.#signalError("Browser does not allow cache");
      return false;
    }
  }

  #canRefresh() {
    if (storageAvailable) {
      const cacheTimestamp = localStorage.getItem(C.STORAGE_KEYS.timestamp);

      if (Date.now() - cacheTimestamp < REFRESH_INTERVAL) {
        return false;
      } else {
        return true;
      }
    } else {
      this.#signalError("Browser does not allow cache");
      return true;
    }
  }

  #loadCache() {
    if (storageAvailable) {
      const cacheTimestamp = localStorage.getItem(C.STORAGE_KEYS.timestamp);
      const dataString = localStorage.getItem(C.STORAGE_KEYS.data);
      const dataObject = JSON.parse(dataString);

      this.#epoch_seconds = Math.floor(cacheTimestamp / 1000);
      this.#data = dataObject;
      return true;
    } else {
      this.#signalError("Browser does not allow cache");
      return false;
    }
  }

  #saveCache() {
    if (storageAvailable) {
      const dataString = JSON.stringify(this.#data);
      const cacheTimestamp = Date.now();
      this.#epoch_seconds = Math.floor(cacheTimestamp / 1000);

      localStorage.setItem(C.STORAGE_KEYS.timestamp, cacheTimestamp);
      localStorage.setItem(C.STORAGE_KEYS.location, this.#locationURL);
      localStorage.setItem(C.STORAGE_KEYS.data, dataString);
    } else {
      this.#signalError("Browser does not allow cache");
    }
  }

  clearCache() {
    if (storageAvailable) {
      localStorage.clear();
    } else {
      this.#signalError("Browser does not allow cache");
    }
  }

  #signalError(message) {
    console.log(message);
  }
}
