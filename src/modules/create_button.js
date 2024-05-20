export { createButton };

function createButton(className) {
  const button = document.createElement("button");
  const icon = document.createElement("div");

  button.className = className;
  icon.className = "icon";

  button.append(icon);

  return button;
}
