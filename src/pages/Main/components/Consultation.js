const { LINKS } = require('../../../helpers/constants');
const { Button, Gap, Title, Description } = require('./UiKit');

module.exports = function(t) {
  return `
    <section class="consulting">
      ${Title(t("consultation.title"), "black")}
      ${Description(t("consultation.description"), "black")}
      ${Gap()}
      ${Gap()}
      ${Button(t("consultation.youtube"), LINKS.YOUTUBE_PAGE, "button_green")}
      ${Button(t("consultation.form"), LINKS.TG, "button_blue")}
      <img class="consulting_bg consulting_bg_1" src="../assets/images/main/consulting1.png"/>
      <img class="consulting_bg consulting_bg_2" src="../assets/images/main/consulting2.png"/>
    </section>
`;
}
