const { LINKS } = require('../../../helpers/constants');
const { Button, Title, Description } = require('./UiKit');

module.exports = function(t) {
  return `
    <main class="main">
      ${Title(t("main.title"))}
      ${Description(t("main.description"))}
      <nav class="main_nav">
        ${Button(t("main.demo"), "/demo/")}
        ${Button(t("main.demoWithData"), LINKS.DEMO, "button_blue")}
      </nav>
      <video width="90%" preload autoplay muted loop="loop" class="main_screenshot">
        <source src="../assets/images/index.webm" type="video/webm">
      </video>
    </main>`;
  // <img src="../assets/images/index.gif" alt="screenshot" className="main_screenshot"/>
}
