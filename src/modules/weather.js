import { storageAvailable } from "./storage";

export { Weather };

const API_KEY = "48d87e7905c448d39ba95320241305";
const STORAGE_KEYS = {
  timestamp: "time",
  location: "location",
  data: "data",
};
const REFRESH_MINUTES = 2.5;
const REFRESH_INTERVAL = REFRESH_MINUTES * 60 * 1000; //(ms)

class Weather {
  #data;
  #location;

  async getData(location) {
    if (!this.#canRefresh()) {
      if (location == this.#location && this.#data) {
        return this.#data;
      } else if (this.#loadCacheLocation() && this.#loadCache()) {
        return this.#data;
      }
    }

    this.#location = location;
    const data = await this.#fetchData();
    if (data) {
      if (this.#parseData(data)) {
        this.#cacheData();
        return this.#data;
      }
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

      return weatherData;
    } catch (error) {
      this.#signalError(error.message);
      return false;
    }
  }

  #parseData(data) {
    try {
      if (data.error) {
        throw new Error(data.error.message);
      }
      this.#data = {
        location: data.location.name,
        country: data.location.country,
        sun: data.current.is_day ? "day" : "night",
        code: data.current.condition.code,
        temp: {
          current: {
            f: data.current.temp_f,
            c: data.current.temp_c,
          },
          feelslike: {
            f: data.current.feelslike_f,
            c: data.current.feelslike_c,
          },
        },
        humidity: data.current.humidity,
      };
      return true;
    } catch (error) {
      this.#signalError(error.message);
      return false;
    }
  }

  #loadCacheLocation() {
    if (storageAvailable) {
      const location = localStorage.getItem(STORAGE_KEYS.location);
      if (location == this.#location) {
        return true;
      } else {
        this.#location = location;
        return false;
      }
    } else {
      this.#signalError("Browser does not allow cache");
      return true;
    }
  }

  #canRefresh() {
    if (storageAvailable) {
      const time = localStorage.getItem(STORAGE_KEYS.timestamp);
      if (Date.now() - time > REFRESH_INTERVAL) {
        return true;
      } else {
        return false;
      }
    } else {
      this.#signalError("Browser does not allow cache");
      return true;
    }
  }

  #loadCache() {
    if (storageAvailable) {
      const data = localStorage.getItem(STORAGE_KEYS.data);
      this.#data = data;
      return true;
    } else {
      this.#signalError("Browser does not allow cache");
      return false;
    }
  }

  #cacheData() {
    if (storageAvailable) {
      const dataString = JSON.stringify(this.#data);

      localStorage.setItem(STORAGE_KEYS.timestamp, Date.now());
      localStorage.setItem(STORAGE_KEYS.location, this.#location);
      localStorage.setItem(STORAGE_KEYS.data, dataString);
    } else {
      this.#signalError("Browser does not allow cache");
    }
  }

  #signalError(message) {
    console.log(message);
  }
}
