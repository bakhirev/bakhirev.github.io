const { Button, Gap, Title, Description, Rectangle } = require('./UiKit');
const { LINKS } = require('../../../helpers/constants');

module.exports = function(t, meta) {
  const { language } = meta;
  const className = language === 'ru'
    ? 'banner banner_short'
    : 'banner';

  return `
    ${Rectangle('top_right')}
    <section class="${className}">
      ${Title(t("banner.title"))}
      ${Description(t("banner.description"))}
      ${language === 'ru' ? Gap(2) : ''}
      ${language === 'ru' ? Button(t("banner.example"), LINKS.THEMES, "button_green") : ''}
    </section>
`;
}
