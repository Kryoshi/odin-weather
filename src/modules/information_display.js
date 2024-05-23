import { UIInformationComponent } from "./information_component.js";

export { UIInformationDisplay };

class UIInformationDisplay {
  element;
  #conditionComponent;
  #feelsLikeComponent;
  #windComponent;
  #humidityComponent;
  #sunriseComponent;
  #sunsetComponent;
  #rainChanceComponent;
  #snowChanceComponent;

  #activeUnits = {};
  #data;
  /** {
    isDay,
    condition,
    feelsLikeTemperature {c: , f: ,},
    wind {kph: , mph: ,},
    humidity,
    sunrise,
    sunset,
    precipitationChance,
  } **/

  constructor() {
    //Create Elements
    this.element = document.createElement("div");

    this.#conditionComponent = new UIInformationComponent("condition");
    this.#feelsLikeComponent = new UIInformationComponent("feels-like");
    this.#windComponent = new UIInformationComponent("wind");
    this.#humidityComponent = new UIInformationComponent("humidity");
    this.#sunriseComponent = new UIInformationComponent("sunrise");
    this.#sunsetComponent = new UIInformationComponent("sunset");
    this.#rainChanceComponent = new UIInformationComponent("rain-chance");
    this.#snowChanceComponent = new UIInformationComponent("snow-chance");

    //Set Attributes
    this.element.className = "weather-info";

    this.#feelsLikeComponent.setLabel("Feels Like: ");
    this.#windComponent.setLabel("Wind Speed: ");
    this.#humidityComponent.setLabel("Humidity: ");
    this.#sunriseComponent.setLabel("Sunrise: ");
    this.#sunsetComponent.setLabel("Sunset: ");
    this.#rainChanceComponent.setLabel("Chance of Rain: ");
    this.#snowChanceComponent.setLabel("Chance of Snow: ");

    //Append Elements
    this.element.append(
      this.#conditionComponent.element,
      this.#feelsLikeComponent.element,
      this.#windComponent.element,
      this.#humidityComponent.element,
      this.#sunriseComponent.element,
      this.#sunsetComponent.element,
      this.#rainChanceComponent.element,
      this.#snowChanceComponent.element,
    );
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
      const addStatus = this.#data.isDay ? "day" : "night";
      const removeStatus = this.#data.isDay ? "night" : "day";

      const condition = this.#data.condition;
      const feelsLike =
        this.#data.feelsLike[this.#activeUnits.temperature] +
        " °" +
        this.#activeUnits.temperature.toUpperCase();
      const wind =
        this.#data.wind[this.#activeUnits.wind] +
        " " +
        this.#activeUnits.wind.toUpperCase();
      const humidity = `${this.#data.humidity}%`;
      const sunrise = this.#data.sunrise;
      const sunset = this.#data.sunset;
      const rainChance = `${this.#data.precipitationChance.rain}%`;
      const snowChance = `${this.#data.precipitationChance.snow}%`;

      this.#conditionComponent.addClass(addStatus);
      this.#conditionComponent.removeClass(removeStatus);

      this.#conditionComponent.setContent(condition);
      this.#feelsLikeComponent.setContent(feelsLike);
      this.#windComponent.setContent(wind);
      this.#humidityComponent.setContent(humidity);
      this.#sunriseComponent.setContent(sunrise);
      this.#sunsetComponent.setContent(sunset);
      this.#rainChanceComponent.setContent(rainChance);
      this.#snowChanceComponent.setContent(snowChance);
    }
  }
}
