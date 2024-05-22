export { UIWeatherIcon };

class UIWeatherIcon {
  element;
  #imageElement;
  #imageURL = "";

  constructor(url = this.#imageURL) {
    //Create Elements
    this.element = document.createElement("div");
    this.#imageElement = document.createElement("img");

    this.element.className = "weather-icon";

    this.#imageElement.className = "image";
    this.#imageElement.src = url;

    this.element.append(this.#imageElement);
  }

  setURL(url) {
    this.#imageURL = url;
    this.#imageElement.src = this.#imageURL;
  }

  startLoader() {
    this.element.classList.add("loader");
  }

  stopLoader() {
    this.element.classList.remove("loader");
  }
}
