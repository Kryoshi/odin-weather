export { UIInformationComponent };

class UIInformationComponent {
  element;
  #iconContainer;
  #icon;
  #textContainer;
  #label;
  #content;

  constructor(className) {
    //Create Elements
    this.element = document.createElement("div");

    this.#iconContainer = document.createElement("div");
    this.#icon = document.createElement("div");

    this.#textContainer = document.createElement("div");
    this.#label = document.createElement("span");
    this.#content = document.createElement("span");

    //Set Attributes
    this.element.className = `item ${className}`;

    this.#iconContainer.className = "icon-container";
    this.#icon.className = "icon";

    this.#label.className = "label";
    this.#content.className = "content";

    //Append Elements
    this.#iconContainer.append(this.#icon);
    this.#textContainer.append(this.#label, this.#content);
    this.element.append(this.#iconContainer, this.#textContainer);
  }

  setLabel(text) {
    this.#label.textContent = text;
  }

  setContent(text) {
    this.#content.textContent = text;
  }

  addClass(className) {
    this.element.classList.add(className);
  }

  removeClass(className) {
    this.element.classList.remove(className);
  }
}
