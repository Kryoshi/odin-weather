import "./index.css";

import { Weather } from "./modules/weather";
import { UIComponent } from "./modules/ui";

(async () => {
  const weather = new Weather();
  const uiInstance = new UIComponent();

  uiInstance.window.addEventListener("search-query", async (e) => {
    if (e.detail) {
      const locations = await weather.search(e.detail);

      if (locations) {
        const locationNames = [];
        for (let location of locations) {
          const locationDetails = {
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

      console.log(url);

      const data = await weather.getData(url);

      if (data) {
        const event = new CustomEvent("load-success", {
          detail: data,
        });
        uiInstance.window.dispatchEvent(event);
      }
    }
  });

  uiInstance.window.addEventListener("load-success", (e) => {
    if (e.detail) {
      console.log("success");
      console.log(e.detail);
    }
  });
})();
