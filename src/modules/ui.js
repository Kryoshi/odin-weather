import UNITS from "./units.json";
import { UIDashboard } from "./dashboard";

export { UIComponent };

class UIComponent {
  window;
  #dashboard;
  #displayUnits = UNITS.metric;

  constructor() {
    const body = document.querySelector("body");

    //Create elements
    this.window = document.createElement("div");

    this.#dashboard = new UIDashboard();

    //Set attributes
    this.window.id = "window";
    this.#dashboard.setUnits(this.#displayUnits);

    //Append Elements
    this.window.append(this.#dashboard.element);
    body.append(this.window);

    //Add listeners
    this.window.addEventListener("search-query-success", (e) => {
      if (e.detail) {
        this.#dashboard.updateSearch(e.detail);
      }
    });

    this.window.addEventListener("unit-toggle", () => {
      if (this.#displayUnits === UNITS.metric) {
        this.#displayUnits = UNITS.imperial;
      } else {
        this.#displayUnits = UNITS.metric;
      }

      this.#dashboard.setUnits(this.#displayUnits);
    });
  }

  updateDashboard({ iconURL, location, temperature, miscData } = {}) {
    if (iconURL) {
      this.#dashboard.updateIcon(iconURL);
    }
    if (location) {
      this.#dashboard.updateLocation(location);
    }
    if (temperature) {
      this.#dashboard.updateTemperature(temperature);
    }
    if (miscData) {
      this.#dashboard.updateMiscData(miscData);
    }
  }
}
