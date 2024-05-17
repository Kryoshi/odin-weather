import { SearchComponent } from "./search_component";

export { UIComponent };

class UIComponent {
  window;
  #searchComponent;

  constructor() {
    const body = document.querySelector("body");

    //Create elements
    this.window = document.createElement("div");

    this.#searchComponent = new SearchComponent();

    //Set attributes
    this.window.id = "window";

    //Append Elements
    this.window.append(this.#searchComponent.element);
    body.append(this.window);

    //Add listeners
    this.window.addEventListener("search-query-success", (e) => {
      if (e.detail) {
        this.#searchComponent.updateResults(e.detail);
      }
    });
  }
}
