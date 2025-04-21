const Head = require('../../components/Head/index');
const PrevNext = require('../../components/PrevNext/index');
const Recommendation = require('../../components/Recommendation/index');
const Title = require('../../components/Title/index');
const YouTube = require('../../components/YouTube/index');
const Footer = require('../../components/Footer/index');
const jsonToHtml = require('../../helpers/jsonToHtml');
const { updateLanguage } = require('../../helpers/translations');
const Analytics = require("../../components/Analytics");


module.exports = function (json, meta) {
  updateLanguage(meta.language);

  const recommendations = meta.recommendations.map((data) => {
    return Recommendation(data.title, data.description.long, `./${data.id}`);
  }).join('');

  return `
    <!DOCTYPE html>
    <html lang="${meta.language}">
      ${Head(meta)}
      <body>
        <main>
          <article class="article">
            ${jsonToHtml(json)}
          </article>
        </main>
        ${PrevNext(meta)}
        <section class="section">
          ${Title('Рекомендуем почитать')}
          ${recommendations}
          ${Title('Рекомендуем посмотреть')}
          ${YouTube(meta.youtube)}
        </section>
        ${Footer(meta)}
      </body>
    </html>`;
}
