import { storageAvailable } from "./storage";

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
  #location;

  async getData(location) {
    if (!this.#canRefresh()) {
      if (location === this.#location && this.#data) {
        console.log("loading... from memory");
        return this.#data;
      } else if (this.#matchCacheLocation(location) && this.#loadCache()) {
        console.log("loading... from cache");
        return this.#data;
      }
    }

    console.log("loading... from web");
    this.#location = location;
    const data = await this.#fetchData();
    if (data) {
      this.#saveCache();
      return this.#data;
    }
  }
  async search(query) {
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
      const request_url = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${this.#location}&days=3`;
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

  #matchCacheLocation(location) {
    if (storageAvailable) {
      const cacheLocation = localStorage.getItem(STORAGE_KEYS.location);
      console.log(cacheLocation);
      if (cacheLocation) {
        if (location === cacheLocation) {
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

  #canRefresh() {
    if (storageAvailable) {
      const time = localStorage.getItem(STORAGE_KEYS.timestamp);

      if (Date.now() - time < REFRESH_INTERVAL) {
        console.log("no refresh");
        return false;
      } else {
        console.log("refresh");
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
      console.log("caching: " + Date.now());
      const dataString = JSON.stringify(this.#data);

      localStorage.setItem(STORAGE_KEYS.timestamp, Date.now());
      localStorage.setItem(STORAGE_KEYS.location, this.#location);
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
