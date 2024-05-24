import "./index.css";

import { Weather } from "./modules/weather";
import { UIComponent } from "./modules/ui";

(async () => {
  const loader = document.querySelector(".pre-loader");
  loader.remove();

  const weather = new Weather();
  const uiInstance = new UIComponent();

  initListeners();

  signalLoadStart();
  if (await weather.loadData()) {
    const event = new Event("load-success");
    uiInstance.window.dispatchEvent(event);
  }

  function initListeners() {
    uiInstance.window.addEventListener("search-query", async (e) => {
      if (e.detail) {
        const counter = weather.searchCounter;
        const locations = await weather.search(e.detail);
        if (counter !== weather.searchCounter - 1) {
          return;
        }

        if (locations) {
          const locationNames = [];
          for (let location of locations) {
            const locationDetails = location.region
              ? {
                  name: `${location.name}, ${location.region}, ${location.country}`,
                  url: location.url,
                }
              : {
                  name: `${location.name}, ${location.country}`,
                  url: location.url,
                };
            locationNames.push(locationDetails);
          }

          const event = new CustomEvent("search-query-success", {
            detail: locationNames,
          });
          uiInstance.window.dispatchEvent(event);
        }
      }
    });

    uiInstance.window.addEventListener("search-submit", async (e) => {
      if (e.detail) {
        signalLoadStart();
        const locations = await weather.search(e.detail);

        if (locations[0]) {
          const url = locations[0].url;

          const event = new CustomEvent("submit-location", {
            detail: url,
          });
          uiInstance.window.dispatchEvent(event);
        } else {
          signalError("No matching location found");
        }
      }
    });

    uiInstance.window.addEventListener("submit-location", async (e) => {
      if (e.detail) {
        const url = e.detail;

        signalLoadStart();
        if (await weather.loadData(url)) {
          const event = new Event("load-success");
          uiInstance.window.dispatchEvent(event);
        }
      }
    });

    uiInstance.window.addEventListener("load-success", async () => {
      uiInstance.updateDashboard(await weather.getCurrentData());
      uiInstance.updateDailyForecast(await weather.getDailyForecast());
      uiInstance.updateHourlyForecast(await weather.getHourlyForecastNow());
    });
  }

  uiInstance.window.addEventListener("refresh", async () => {
    signalLoadStart();
    if (await weather.refresh()) {
      const event = new Event("load-success");
      uiInstance.window.dispatchEvent(event);
    }
  });

  function signalLoadStart() {
    const event = new Event("load-start");
    uiInstance.window.dispatchEvent(event);
  }

  function signalError(message) {
    const event = new CustomEvent("display-error", { detail: message });
    uiInstance.window.dispatchEvent(event);
  }
})();
