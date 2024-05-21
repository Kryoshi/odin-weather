import { storageAvailable } from "./storage";
import WEATHERCONDITIONS from "../weather_api/weather_conditions";

export { Weather };

const API_KEY = "48d87e7905c448d39ba95320241305";
const STORAGE_KEYS = {
  timestamp: "time",
  location: "location",
  data: "data",
};
const REFRESH_MINUTES = 1;
const REFRESH_INTERVAL = REFRESH_MINUTES * 60 * 1000; //(ms)

class Weather {
  #data;
  #locationURL;
  searchCounter = 0;

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

  async getIconURL() {
    if (await this.loadData()) {
      const dayStatus = this.#data.current.is_day ? "day" : "night";
      const iconCode =
        WEATHERCONDITIONS[this.#data.current.condition.code].icon;

      const iconURL = `./weather_icons/${dayStatus}/${iconCode}.png`;

      return iconURL;
    }
  }

  async getWeatherMiscData() {
    if (await this.loadData()) {
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

      return { condition, feelsLike, wind, humidity };
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

  async loadData(locationURL = this.#locationURL) {
    if (!locationURL) {
      if (this.#loadCacheLocation()) {
        locationURL = this.#locationURL;
      }
    }

    if (!this.#canRefresh()) {
      if (locationURL === this.#locationURL && this.#data) {
        console.log("loading... from memory");
        return true;
      } else if (this.#matchCacheLocation(locationURL) && this.#loadCache()) {
        console.log("loading... from cache");
        return true;
      }
    }

    console.log("loading... from web");
    this.#locationURL = locationURL;
    const data = await this.#fetchData();
    if (data) {
      this.#saveCache();
      return true;
    }
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
      const request_url = `http://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${query}`;
      const response = await fetch(request_url, { mode: "cors" });
      const weatherData = await response.json();

      return weatherData;
    } catch (error) {
      this.#signalError(error.message);
      return false;
    }
  }

  async #fetchData() {
    try {
      const request_url = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${this.#locationURL}&days=3&aqi=yes`;
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
      const cacheLocation = localStorage.getItem(STORAGE_KEYS.location);
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
      const cacheLocation = localStorage.getItem(STORAGE_KEYS.location);
      if (cacheLocation) {
        console.log(cacheLocation);
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
      const time = localStorage.getItem(STORAGE_KEYS.timestamp);

      if (Date.now() - time < REFRESH_INTERVAL) {
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
      const data = localStorage.getItem(STORAGE_KEYS.data);
      const dataObject = JSON.parse(data);
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

      localStorage.setItem(STORAGE_KEYS.timestamp, Date.now());
      localStorage.setItem(STORAGE_KEYS.location, this.#locationURL);
      localStorage.setItem(STORAGE_KEYS.data, dataString);
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
