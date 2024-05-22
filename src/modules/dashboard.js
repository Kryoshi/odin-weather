import { UIWeatherIcon } from "./weather_icon.js";
import { UISearchComponent } from "./search_component";
import { UITemperatureDisplay } from "./temperature_display";
import { UIInformationDisplay } from "./information_display";

export { UIDashboard };

class UIDashboard {
  element;
  weatherIcon;
  searchComponent;
  temperatureDisplay;
  informationDisplay;

  currentData;

  constructor() {
    //Create Elements
    this.element = document.createElement("div");
    this.weatherIcon = new UIWeatherIcon();
    this.searchComponent = new UISearchComponent();
    this.temperatureDisplay = new UITemperatureDisplay();
    this.informationDisplay = new UIInformationDisplay();

    //Set Attributes
    this.element.className = "dashboard";

    //Append Elements
    this.element.append(
      this.weatherIcon.element,
      this.searchComponent.element,
      this.temperatureDisplay.element,
      this.informationDisplay.element,
    );
  }

  updateIcon(url) {
    this.weatherIcon.setURL(url);
  }

  updateSearch(results) {
    this.searchComponent.updateResults(results);
  }

  updateLocation(location) {
    this.searchComponent.lockLocation(location);
  }

  updateTemperature(temperature) {
    this.temperatureDisplay.update(temperature);
  }

  updateMiscData(data) {
    this.informationDisplay.update(data);
  }

  setUnits(units) {
    this.temperatureDisplay.setActiveUnits(units);
    this.informationDisplay.setActiveUnits(units);
  }
}
