function Button(text, link, className) {
  return `
    <a href="${link}" target="_blank" rel="noreferrer" role="button" class="button ${className || ''}">
      ${text}
    </a>`;
}

function Title(text, mode) {
  const className = mode ? "title_black" : "";
  return `
    <h1 class="title ${className || ''}">
      ${text}
    </h1>`;
}

function Description(text, mode) {
  const className = mode ? "text_black" : "";
  return `
    <p class="text ${className || ''}">
      ${text}
    </p>`;
}

function Gap(count) {
  return count
    ? (new Array(count)).fill("<br />").join("")
    : "<br />";
}

function Rectangle(className) {
  const customClass = className ? `rectangle_${className}` : '';
  return `<img class="rectangle ${customClass}" src="../assets/images/main/rectangle.svg" />`;
}

module.exports = { Button, Title, Description, Gap, Rectangle };
