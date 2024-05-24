import { UIWeatherIcon } from "./weather_icon.js";
import { UIInformationComponent } from "./information_component.js";
import { createButton } from "./create_button.js";
import C from "./constants.json";

export { UIHourlyForecastContainer };

class UIHourlyForecastContainer {
  element;
  #textElement;
  #expandButton;
  #forecastsElement;
  #forecastComponents = [];

  constructor() {
    this.element = document.createElement("div");
    this.#expandButton = createButton("expand");
    this.#textElement = document.createElement("div");
    this.#forecastsElement = document.createElement("div");

    this.element.className = "forecast";
    this.#textElement.className = "forecast-heading";
    this.#textElement.textContent = "Hourly Forecast";
    this.#forecastsElement.className = "forecast-container";

    for (let i = 0; i < C.DAILY_HOURS; ++i) {
      const forecastComponent = new UIForecastHourly();
      this.#forecastComponents.push(forecastComponent);
      this.#forecastsElement.append(forecastComponent.element);
    }

    this.#expandButton.append(this.#textElement);
    this.element.append(this.#expandButton, this.#forecastsElement);

    this.#expandButton.addEventListener("click", () => {
      this.element.classList.toggle("expanded");
    });
  }

  setUnits(units) {
    for (let forecastComponent of this.#forecastComponents) {
      forecastComponent.setActiveUnits(units);
    }
  }
  update(forecast) {
    for (let day in forecast) {
      this.#forecastComponents[day].update(forecast[day]);
    }
  }
}

class UIForecastHourly {
  element;
  #timeElement;
  #weatherContainer;
  #weatherIcon;
  #informationElement;
  #temperatureContainer;
  #temperatureComponent;
  #precipitationContainer;
  #rainChanceComponent;
  #snowChanceComponent;

  #activeUnits = {};
  #data;
  /** {
   time,
   temperature: {c: , f: },
   precipitationChance: {rain: , snow: },
   iconURL,
  } **/

  constructor() {
    //Create Elements
    this.element = document.createElement("button");

    this.#timeElement = document.createElement("div");
    this.#weatherContainer = document.createElement("div");
    this.#weatherIcon = new UIWeatherIcon();
    this.#informationElement = document.createElement("div");

    this.#temperatureContainer = document.createElement("div");
    this.#temperatureComponent = new UIInformationComponent(
      "current-temperature",
    );

    this.#precipitationContainer = document.createElement("div");
    this.#rainChanceComponent = new UIInformationComponent("rain-chance");
    this.#snowChanceComponent = new UIInformationComponent("snow-chance");

    //Set attributes
    this.element.className = "forecast-unit";
    this.#weatherContainer.className = "forecast-info hourly";
    this.#timeElement.className = "date";
    this.#informationElement.className = "information";

    this.#temperatureComponent.setLabel("Temp: ");
    this.#rainChanceComponent.setLabel("Rain: ");
    this.#snowChanceComponent.setLabel("Snow: ");

    //Append Elements
    this.#temperatureContainer.append(this.#temperatureComponent.element);

    this.#precipitationContainer.append(
      this.#rainChanceComponent.element,
      this.#snowChanceComponent.element,
    );

    this.#informationElement.append(
      this.#temperatureContainer,
      this.#precipitationContainer,
    );

    this.#weatherContainer.append(
      this.#weatherIcon.element,
      this.#informationElement,
    );

    this.element.append(this.#timeElement, this.#weatherContainer);
  }

  update(data) {
    this.#data = data;
    this.updateDisplay();
  }

  setActiveUnits(units) {
    this.#activeUnits = units;
    this.updateDisplay();
  }

  updateDisplay() {
    if (this.#data) {
      const time = this.#data.time;
      const iconURL = this.#data.iconURL;

      const temperature = this.#data.temperature[this.#activeUnits.temperature];
      const rainChance = `${this.#data.precipitationChance.rain}%`;
      const snowChance = `${this.#data.precipitationChance.snow}%`;

      this.#timeElement.textContent = time;
      this.#weatherIcon.setURL(iconURL);

      this.#temperatureComponent.setContent(temperature);
      this.#rainChanceComponent.setContent(rainChance);
      this.#snowChanceComponent.setContent(snowChance);
    }
  }
}
