import UNITS from "./units.json";
import { UIBackground } from "./background";
import { UIDashboard } from "./dashboard";
import { UIDailyForecastContainer } from "./forecast-daily";
import { UIHourlyForecastContainer } from "./forecast-hourly";
import { UIFooter } from "./footer";

export { UIComponent };

class UIComponent {
  window;
  #background;
  #dashboard;
  #dailyForecast;
  #hourlyForecast;
  #footer;
  #displayUnits = UNITS.metric;

  constructor() {
    const body = document.querySelector("body");

    //Create elements
    this.window = document.createElement("div");
    this.#background = new UIBackground();
    this.#footer = new UIFooter();

    this.#dashboard = new UIDashboard();
    this.#dailyForecast = new UIDailyForecastContainer();
    this.#hourlyForecast = new UIHourlyForecastContainer();

    //Set attributes
    this.window.id = "window";
    this.window.className = "window";
    this.updateUnits();

    //Append Elements
    this.window.append(
      this.#dashboard.element,
      this.#dailyForecast.element,
      this.#hourlyForecast.element,
    );
    body.append(this.#background.element, this.window, this.#footer.element);

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

      this.updateUnits();
    });

    this.window.addEventListener("load-start", () => {
      this.#dashboard.startLoading();
    });
  }

  updateUnits() {
    this.#dashboard.setUnits(this.#displayUnits);
    this.#dailyForecast.setUnits(this.#displayUnits);
    this.#hourlyForecast.setUnits(this.#displayUnits);
  }

  updateDashboard(update) {
    this.#dashboard.update(update);
  }

  updateDailyForecast(update) {
    this.#dailyForecast.update(update);
  }

  updateHourlyForecast(update) {
    this.#hourlyForecast.update(update);
  }
}
