export { UIWeatherConditionWidget };

class UIWeatherConditionWidget {
  element;
  #imageElement;
  #textElement;

  #conditionData = {
    text: "",
    iconURL: "",
  };

  constructor(url = this.#conditionData.iconURL) {
    this.element = document.createElement("div");
    this.#imageElement = document.createElement("img");
    this.#textElement = document.createElement("span");

    this.element.className = "condition-widget";

    this.#imageElement.className = "image";
    this.#imageElement.url = url;

    this.#textElement.className = "text";
    this.#textElement.textContent = "";

    this.element.append(this.#imageElement, this.#textElement);
  }

  update(condition) {
    this.#conditionData = condition;

    this.#textElement.textContent = condition.text;
    this.#imageElement.src = this.#conditionData.iconURL;
  }
}
