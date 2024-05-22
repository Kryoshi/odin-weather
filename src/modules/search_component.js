import { createButton } from "./create_button";

export { UISearchComponent };

class UISearchComponent {
  element;
  #buttonsElement;
  #refreshButton;
  #lockButton;
  #inputElement;
  #resultsElement;

  #resultComponents = [];
  #selectedOptionIndex = -1;

  #locationCache = "";

  constructor() {
    //Create elements
    this.element = document.createElement("div");
    this.#buttonsElement = document.createElement("div");
    this.#lockButton = createButton("lock");
    this.#refreshButton = createButton("refresh");
    this.#inputElement = document.createElement("input");
    this.#resultsElement = document.createElement("ul");

    //Set attributes
    this.element.className = "search";

    this.#buttonsElement.className = "buttons";

    this.#inputElement.className = "input";
    this.#inputElement.type = "text";
    this.#inputElement.minLength = 3;
    this.#inputElement.placeholder = "Location...";

    this.#resultsElement.className = "results";

    //Append Elements

    this.#buttonsElement.append(this.#refreshButton, this.#lockButton);
    this.element.append(
      this.#buttonsElement,
      this.#inputElement,
      this.#resultsElement,
    );

    //Add listeners
    this.element.addEventListener("submit-ui", () => {
      this.escapeFocus();
    });

    this.#refreshButton.addEventListener("click", () => {
      this.lock();
      const event = new Event("refresh", {
        bubbles: true,
      });
      this.element.dispatchEvent(event);
    });

    this.#lockButton.addEventListener("click", () => {
      this.toggleLock();
    });

    this.#inputElement.addEventListener("input", () => {
      if (this.#inputElement.value.length > 2) {
        const event = new CustomEvent("search-query", {
          detail: this.#inputElement.value,
          bubbles: true,
        });

        this.element.dispatchEvent(event);
      } else {
        this.clearResults();
      }
    });

    this.#inputElement.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "Escape":
          this.escapeFocus();
          break;
        case "ArrowDown":
          event.preventDefault();
          this.moveSelectionDown();
          break;
        case "ArrowUp":
          event.preventDefault();
          this.moveSelectionUp();
          break;
        case "Enter":
          this.confirmSelection();
          break;
        default:
          break;
      }
    });

    this.#inputElement.addEventListener("focus", () => {
      this.#selectedOptionIndex = -1;
      this.focusSelection();
    });
  }

  //Keyboard Navigation Functions
  escapeFocus() {
    this.#inputElement.focus();
    this.#inputElement.blur();
  }

  moveSelectionDown() {
    if (this.#selectedOptionIndex === this.#resultComponents.length - 1) {
      this.#selectedOptionIndex = -1;
    } else {
      this.#selectedOptionIndex++;
    }
    this.focusSelection();
  }

  moveSelectionUp() {
    if (this.#selectedOptionIndex === -1) {
      this.#selectedOptionIndex = this.#resultComponents.length - 1;
    } else {
      this.#selectedOptionIndex--;
    }
    this.focusSelection();
  }

  focusSelection() {
    this.#inputElement.classList.remove("selected");
    for (let resultComponent of this.#resultComponents) {
      resultComponent.removeSelected();
    }

    if (this.#selectedOptionIndex === -1) {
      if (this.#resultComponents[0]) {
        this.#resultComponents[0].scrollTo();
      }
      this.#inputElement.focus();
      this.#inputElement.classList.add("selected");
    } else {
      this.#resultComponents[this.#selectedOptionIndex].setSelected();
    }
  }

  confirmSelection() {
    if (this.#selectedOptionIndex === -1) {
      this.submitSearch();
    } else {
      this.#resultComponents[this.#selectedOptionIndex].submitResult();
    }
  }

  //Internal Functions
  submitSearch() {
    if (this.#inputElement.value.length >= this.#inputElement.minLength) {
      const uiEvent = new CustomEvent("submit-ui", {
        bubbles: true,
      });
      const submitEvent = new CustomEvent("search-submit", {
        detail: this.#inputElement.value,
        bubbles: true,
      });

      this.element.dispatchEvent(uiEvent);
      this.element.dispatchEvent(submitEvent);
    }
  }

  updateResults(locations) {
    this.clearResults();
    for (let location of locations) {
      const resultComponent = new UISearchResult(location);
      this.#resultsElement.append(resultComponent.element);
      this.#resultComponents.push(resultComponent);
    }
  }

  clearResults() {
    this.#selectedOptionIndex = -1;
    this.#resultComponents = [];
    removeChildren(this.#resultsElement);
  }

  lockLocation(location) {
    this.#locationCache = location;
    this.lock();
  }

  toggleLock() {
    if (this.element.classList.contains("locked")) {
      this.unlock();
    } else {
      this.lock();
    }
  }

  lock() {
    this.clearResults();
    this.element.classList.add("locked");
    this.#inputElement.disabled = true;

    this.element.blur();
    this.#lockButton.blur();
    this.#refreshButton.blur();
    this.#inputElement.value = this.#locationCache;
  }

  unlock() {
    this.clearResults();
    this.element.classList.remove("locked");
    this.#inputElement.disabled = false;
    this.#inputElement.focus();
  }
}

class UISearchResult {
  element;
  #submitButton;
  #textSpan;
  #location;

  constructor(location) {
    this.#location = location;

    //Create Elements
    this.element = document.createElement("li");
    this.#submitButton = document.createElement("button");
    this.#textSpan = document.createElement("span");

    //Set attributes
    this.element.className = "option";
    this.#textSpan.textContent = this.#location.name;

    //Append Elements
    this.#submitButton.append(this.#textSpan);
    this.element.append(this.#submitButton);

    //Add listeners
    this.#submitButton.addEventListener("click", () => {
      this.submitResult();
    });
  }

  submitResult() {
    const uiEvent = new CustomEvent("submit-ui", {
      bubbles: true,
    });
    const submitEvent = new CustomEvent("submit-location", {
      detail: this.#location.url,
      bubbles: true,
    });

    this.element.dispatchEvent(uiEvent);
    this.element.dispatchEvent(submitEvent);
  }

  removeSelected() {
    this.element.classList.remove("selected");
  }

  setSelected() {
    this.element.focus();
    this.scrollTo();
    this.element.classList.add("selected");
  }

  scrollTo() {
    this.element.scrollIntoView();
  }
}

function removeChildren(element) {
  if (element instanceof Element) {
    let child = element.lastElementChild;
    while (child) {
      child.remove();
      child = element.lastElementChild;
    }
  }
}
