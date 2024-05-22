export { UIInformationDisplay };

class UIInformationDisplay {
  element;
  conditionComponent;
  feelsLikeComponent;
  windComponent;
  humidityComponent;
  sunriseComponent;
  sunsetComponent;

  activeUnits = {};
  data; //{isDay, condition, feelsLikeTemperature {c: , f: ,}, wind {kph: , mph: ,}, humidity, sunrise, sunset}

  constructor() {
    //Create Elements
    this.element = document.createElement("div");

    this.conditionComponent = new UIInformationComponent("condition");
    this.feelsLikeComponent = new UIInformationComponent("feels-like");
    this.windComponent = new UIInformationComponent("wind");
    this.humidityComponent = new UIInformationComponent("humidity");
    this.sunriseComponent = new UIInformationComponent("sunrise");
    this.sunsetComponent = new UIInformationComponent("sunset");

    //Set Attributes
    this.element.className = "weather-info";

    this.feelsLikeComponent.setLabel("Feels Like: ");
    this.windComponent.setLabel("Wind Speed: ");
    this.humidityComponent.setLabel("Humidity: ");
    this.sunriseComponent.setLabel("Sunrise: ");
    this.sunsetComponent.setLabel("Sunset: ");

    //Append Elements
    this.element.append(
      this.conditionComponent.element,
      this.feelsLikeComponent.element,
      this.windComponent.element,
      this.humidityComponent.element,
      this.sunriseComponent.element,
      this.sunsetComponent.element,
    );
  }

  update(data) {
    this.data = data;
    this.updateDisplay();
  }

  setActiveUnits(units) {
    this.activeUnits = units;
    this.updateDisplay();
  }

  updateDisplay() {
    if (this.data) {
      const addStatus = this.data.isDay ? "day" : "night";
      const removeStatus = this.data.isDay ? "night" : "day";

      const condition = this.data.condition;
      const feelsLike =
        this.data.feelsLike[this.activeUnits.temperature] +
        " °" +
        this.activeUnits.temperature.toUpperCase();
      const wind =
        this.data.wind[this.activeUnits.wind] +
        " " +
        this.activeUnits.wind.toUpperCase();
      const humidity = `${this.data.humidity}%`;
      const sunrise = this.data.sunrise;
      const sunset = this.data.sunset;

      this.conditionComponent.addClass(addStatus);
      this.conditionComponent.removeClass(removeStatus);

      this.conditionComponent.setContent(condition);
      this.feelsLikeComponent.setContent(feelsLike);
      this.windComponent.setContent(wind);
      this.humidityComponent.setContent(humidity);
      this.sunriseComponent.setContent(sunrise);
      this.sunsetComponent.setContent(sunset);
    }
  }
}

class UIInformationComponent {
  element;
  iconContainer;
  icon;
  textContainer;
  label;
  content;

  constructor(className) {
    //Create Elements
    this.element = document.createElement("div");

    this.iconContainer = document.createElement("div");
    this.icon = document.createElement("div");

    this.textContainer = document.createElement("div");
    this.label = document.createElement("span");
    this.content = document.createElement("span");

    //Set Attributes
    this.element.className = `item ${className}`;

    this.iconContainer.className = "icon-container";
    this.icon.className = "icon";

    this.label.className = "label";
    this.content.className = "content";

    //Append Elements
    this.iconContainer.append(this.icon);
    this.textContainer.append(this.label, this.content);
    this.element.append(this.iconContainer, this.textContainer);
  }

  setLabel(text) {
    this.label.textContent = text;
  }

  setContent(text) {
    this.content.textContent = text;
  }

  addClass(className) {
    this.element.classList.add(className);
  }

  removeClass(className) {
    this.element.classList.remove(className);
  }
}
