const { LINKS } = require('../../../helpers/constants');
const { Button } = require('./UiKit');

function Feature(title, hasFeature) {
  const className = hasFeature ? '' : ' class="tariff_no"';
  return `<li${className}>${title}</li>`;
}

module.exports = function(t, json, meta) {
  const list = Array.isArray(json.features)
    ? json.features
    : json.features.split('\n');
  const features = (f) => list.map(f).join('');
  const personal = (title, i) => Feature(title, i < 7);
  const company = (title) => Feature(title, true);
  const link = meta.language === 'ru' ? LINKS.FORM.RU : LINKS.FORM.EN;

  return `
    <h2 class="tariff_title">
      ${t("tariff")}
    </h2>
    <section class="tariff">
      <article class="tariff_item">
        <h3>
          ${t("tariff.personal.title")}
        </h3>
        <ul>
          ${features(personal)}
        </ul>
        <span class="button button_disabled">
          ${t("tariff.personal.button")}
        </span>
      </article>
  
      <article class="tariff_item">
        <h3>
          ${t("tariff.company.title")}
        </h3>
        <ul>
          ${features(company)}
        </ul>
        ${Button(t("tariff.company.button"), link, "button_green")}
      </article>
    </section>`;
}
