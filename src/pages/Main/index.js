const Head = require('../../components/Head/index');
const Header = require('./components/Header');
const Main = require('./components/Main');
const Tariffs = require('./components/Tariffs');
const Banner = require('./components/Banner');
const Footer = require('./components/Footer');
const Analytics = require("../../components/Analytics");
const { updateLanguage } = require("../../helpers/translations");

module.exports = function (json, meta) {
  updateLanguage(meta.language);

  return `
    <!DOCTYPE html>
    <html lang="${meta.language}">
      ${Head(meta)}
      <body>
        <div class="background"></div>
        ${Header(json, meta)}
        ${Main(json)}
        ${Tariffs(json, meta)}
        ${Banner(json, meta)}
        ${Footer()}
        ${Analytics(meta)}
      </body>
    </html>`;
}
