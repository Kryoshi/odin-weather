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
    this.toggleUnit();

    this.#fahrenheitButton.className = "fahrenheit";
    this.#fahrenheitButton.textContent = "°F";

    //Append Elements
    this.#unitsElement.append(this.#celsiusButton, this.#fahrenheitButton);
    this.element.append(this.#temperatureElement, this.#unitsElement);

    //Add listeners
    this.#unitsElement.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") {
        if (e.target.classList.contains("celsius")) {
          this.setCelsiusActive();
        } else {
          this.setFahrenheitActive();
        }
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

  setCelsiusActive() {
    this.#activeUnit = "c";

    this.#celsiusButton.classList.add("active");
    this.#fahrenheitButton.classList.remove("active");

    this.updateDisplay();
  }

  setFahrenheitActive() {
    this.#activeUnit = "f";

    this.#fahrenheitButton.classList.add("active");
    this.#celsiusButton.classList.remove("active");

    this.updateDisplay();
  }

  toggleUnit() {
    if (this.#activeUnit === "c") {
      this.setFahrenheitActive();
    } else {
      this.setCelsiusActive();
    }
  }
}
