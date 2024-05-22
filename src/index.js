import "./index.css";

import { Weather } from "./modules/weather";
import { UIComponent } from "./modules/ui";

(async () => {
  const weather = new Weather();
  const uiInstance = new UIComponent();

  initListeners();

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
        const locations = await weather.search(e.detail);

        if (locations[0]) {
          const url = locations[0].url;

          const event = new CustomEvent("submit-location", {
            detail: url,
          });
          uiInstance.window.dispatchEvent(event);
        }
      }
    });

    uiInstance.window.addEventListener("submit-location", async (e) => {
      if (e.detail) {
        const url = e.detail;

        if (await weather.loadData(url)) {
          const event = new Event("load-success");
          uiInstance.window.dispatchEvent(event);
        }
      }
    });

    uiInstance.window.addEventListener("load-success", async () => {
      console.log("success");
      const dashboardUpdate = {};

      const iconURL = await weather.getIconURL();
      const location = await weather.getLocation();
      const temperature = await weather.getCurrentTemperature();
      const miscData = await weather.getWeatherMiscData();

      if (iconURL) {
        dashboardUpdate.iconURL = iconURL;
      }

      if (location) {
        dashboardUpdate.location = location;
      }

      if (temperature) {
        dashboardUpdate.temperature = temperature;
      }

      if (miscData) {
        dashboardUpdate.miscData = miscData;
      }

      uiInstance.updateDashboard(dashboardUpdate);
    });
  }

  uiInstance.window.addEventListener("refresh", async () => {
    if (await weather.refresh()) {
      const event = new Event("load-success");
      uiInstance.window.dispatchEvent(event);
    }
  });
})();
