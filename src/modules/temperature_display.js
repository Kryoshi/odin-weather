import UNITS from "./units.json";

export { UITemperatureDisplay };

class UITemperatureDisplay {
  element;
  #temperatureElement;
  #unitsElement;
  #celsiusButton;
  #fahrenheitButton;

  #activeUnit = "";
  #temperatureData = {}; // {c: , f: }

  constructor() {
    //Create Elements
    this.element = document.createElement("div");
    this.#temperatureElement = document.createElement("span");

    this.#unitsElement = document.createElement("span");
    this.#celsiusButton = document.createElement("button");
    this.#fahrenheitButton = document.createElement("button");

    //Set Attributes
    this.element.className = "temperature";

    this.#temperatureElement.className = "value";

    this.#unitsElement.className = "units";
    this.#celsiusButton.className = "celsius";
    this.#celsiusButton.textContent = "°C";

    this.#fahrenheitButton.className = "fahrenheit";
    this.#fahrenheitButton.textContent = "°F";

    //Append Elements
    this.#unitsElement.append(this.#celsiusButton, this.#fahrenheitButton);
    this.element.append(this.#temperatureElement, this.#unitsElement);

    //Add listeners
    this.#unitsElement.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") {
        const event = new CustomEvent("unit-toggle", { bubbles: true });
        this.element.dispatchEvent(event);
      }
    });
  }

  update(temperature) {
    this.#temperatureData = temperature;
    this.updateDisplay();
  }

  updateDisplay() {
    if (this.#temperatureData[this.#activeUnit]) {
      this.#temperatureElement.textContent =
        this.#temperatureData[this.#activeUnit];
    } else {
      this.#temperatureElement.textContent = "0";
    }
  }

  setActiveUnits(units) {
    this.#activeUnit = units.temperature;
    this.updateUnitDisplay();
  }

  updateUnitDisplay() {
    if (this.#activeUnit === UNITS.metric.temperature) {
      this.setCelsiusActive();
    } else {
      this.setFahrenheitActive();
    }
    this.updateDisplay();
  }

  setCelsiusActive() {
    this.#celsiusButton.classList.add("active");
    this.#fahrenheitButton.classList.remove("active");
  }

  setFahrenheitActive() {
    this.#fahrenheitButton.classList.add("active");
    this.#celsiusButton.classList.remove("active");
  }
}
