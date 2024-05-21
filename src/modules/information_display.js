export { UIInformationDisplay };

class UIInformationDisplay {
  element;
  conditionComponent;
  feelsLikeComponent;
  windComponent;
  humidityComponent;

  activeUnits = {};
  data; //{condition, feelsLikeTemperature {c: , f: ,}, wind {kph: , mph: ,}, humidity,}

  constructor() {
    //Create Elements
    this.element = document.createElement("div");

    this.conditionComponent = new UIInformationComponent("condition");
    this.feelsLikeComponent = new UIInformationComponent("feels-like");
    this.windComponent = new UIInformationComponent("wind");
    this.humidityComponent = new UIInformationComponent("humidity");

    //Append Elements
    this.element.append(
      this.conditionComponent.element,
      this.feelsLikeComponent.element,
      this.windComponent.element,
      this.humidityComponent.element,
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
      const condition = this.data.condition;
      const feelsLike =
        this.data.feelsLike[this.activeUnits.temperature] +
        " °" +
        this.activeUnits.temperature.toUpperCase();
      const wind =
        this.data.wind[this.activeUnits.wind] +
        " " +
        this.activeUnits.wind.toUpperCase();
      const humidity = this.data.humidity;

      this.conditionComponent.setContent(condition);
      this.feelsLikeComponent.setContent(feelsLike);
      this.windComponent.setContent(wind);
      this.humidityComponent.setContent(humidity);
    }
  }
}

class UIInformationComponent {
  element;
  iconContainer;
  icon;
  content;

  constructor(className) {
    //Create Elements
    this.element = document.createElement("div");

    this.iconContainer = document.createElement("div");
    this.icon = document.createElement("div");
    this.content = document.createElement("div");

    //Set Attributes
    this.element.className = className;

    this.iconContainer.className = "icon-container";
    this.icon.className = "icon";

    this.content.className = "content";

    //Append Elements
    this.iconContainer.append(this.icon);
    this.element.append(this.iconContainer, this.content);
  }

  setContent(text) {
    this.content.textContent = text;
  }
}
