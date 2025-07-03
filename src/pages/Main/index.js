const Head = require('../../components/Head/index');
const Header = require('./components/Header');
const Main = require('./components/Main');
const Tariffs = require('./components/Tariffs');
const Banner = require('./components/Banner');
const Footer = require('./components/Footer');
const Analytics = require("../../components/Analytics");
const Console = require("./components/Console");
const Consultation = require("./components/Consultation");
const { updateLanguage } = require("../../helpers/translations");

module.exports = function (json, meta) {
  updateLanguage(meta.language);
  const t = (id) => json[id];

  return `
    <!DOCTYPE html>
    <html lang="${meta.language}">
      ${Head(meta)}
      <body>
        <div class="background"></div>
        ${Header(t, meta)}
        ${Main(t)}
        ${Consultation(t)}
        ${Console(t)}
        ${Tariffs(t, json, meta)}
        ${Banner(t, meta)}
        ${Footer()}
        ${Analytics(meta)}
      </body>
    </html>`;
}
