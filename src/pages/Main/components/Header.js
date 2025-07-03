const { LINKS } = require('../../../helpers/constants');
const HeaderSelect = require('./HeaderSelect');

function Link(title, url, type) {
  return `
    <a href="${url}" class="header_link" target="${type || ''}">
      ${title}
    </a>`;
}

module.exports = function(t, meta) {
  const { language } = meta;
  return `
    <header class="header">
      <img src="../assets/logo.svg" class="header_logo" alt="${t('header.logo')}"/>
      ${Link(t("header.demo"), LINKS.DEMO)}
      ${Link("GitHub", LINKS.GITHUB, "_blank")}
      ${Link("Docker", LINKS.DOCKER, "_blank")}
      ${language === 'ru' ? Link(t("header.blog"), "./blog/") : ''}
      ${HeaderSelect(language)}
    </header>`;
}
