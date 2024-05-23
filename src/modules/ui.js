import UNITS from "./units.json";
import { UIDashboard } from "./dashboard";
import { UIBackground } from "./background";
import { UIFooter } from "./footer";

export { UIComponent };

class UIComponent {
  window;
  #background;
  #dashboard;
  #footer;
  #displayUnits = UNITS.metric;

  constructor() {
    const body = document.querySelector("body");

    //Create elements
    this.window = document.createElement("div");
    this.#background = new UIBackground();
    this.#footer = new UIFooter();

    this.#dashboard = new UIDashboard();

    //Set attributes
    this.window.id = "window";
    this.#dashboard.setUnits(this.#displayUnits);

    //Append Elements
    this.window.append(this.#dashboard.element);
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

      this.#dashboard.setUnits(this.#displayUnits);
    });

    this.window.addEventListener("load-start", () => {
      this.#dashboard.startLoading();
    });
  }

  updateDashboard(update) {
    this.#dashboard.update(update);
  }
}
