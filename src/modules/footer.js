export { UIFooter };

class UIFooter {
  element;
  #bgAttribution;

  constructor() {
    //Create Elements
    this.element = document.createElement("div");
    this.#bgAttribution = new UIBackgroundAttribution();

    //Set Attributes
    this.element.id = "footer";

    //Append Elements
    this.element.append(this.#bgAttribution.element);
  }
}

class UIBackgroundAttribution {
  element;
  #authorAnchor;
  #imageAnchor;
  #apiAnchor;

  #authorName = "Łukasz Łada";
  #authorURL =
    "https://unsplash.com/@lukaszlada?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash";
  #imageURL =
    "https://unsplash.com/photos/sea-of-clouds-LtWFFVi1RXQ?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash";
  #apiURL = "https://unsplash.com/?utm_medium=referral&utm_source=unsplash";

  constructor() {
    //Create Elements
    this.element = document.createElement("span");
    this.#imageAnchor = document.createElement("a");
    this.#authorAnchor = document.createElement("a");
    this.#apiAnchor = document.createElement("a");

    const firstComma = document.createTextNode(", ");
    const secondComma = document.createTextNode(", ");

    //Set Attributes
    this.element.className = "background-attribution";

    this.#imageAnchor.textContent = "Photo";

    this.updateBackgroundAttribution();

    this.#apiAnchor.textContent = "Unsplash";
    this.#apiAnchor.href = this.#apiURL;

    this.#imageAnchor.target = "_blank";
    this.#authorAnchor.target = "_blank";
    this.#apiAnchor.target = "_blank";

    this.#imageAnchor.rel = "noopener noreferrer";
    this.#authorAnchor.rel = "noopener noreferrer";
    this.#apiAnchor.rel = "noopener noreferrer";

    //Append Elements
    this.element.append(
      this.#imageAnchor,
      firstComma,
      this.#authorAnchor,
      secondComma,
      this.#apiAnchor,
    );
  }

  updateBackgroundAttribution() {
    this.#imageAnchor.href = this.#imageURL;

    this.#authorAnchor.textContent = this.#authorName;
    this.#authorAnchor.href = this.#authorURL;
  }
}
