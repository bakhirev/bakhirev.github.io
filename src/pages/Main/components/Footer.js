const { LINKS } = require('../../../helpers/constants');
const { t, LANGUAGES } = require('../../../helpers/translations');

const Wrapper = require('../../../components/Footer/components/Wrapper');
const Column = require('../../../components/Footer/components/Column');

module.exports = function() {
  const items = LANGUAGES.map((item) => ({ ...item, url: `../${item.id}/` }));

  return Wrapper(`
    ${Column(t('footer.assayo.about'), [
      { title: t('footer.bakhirev.github.io'), url: LINKS.TRY },
      { title: t('footer.assayo.demo'), url: LINKS.DEMO },
    ])}

    ${Column(t('footer.install.title'), [
      { title: 'Github', url: LINKS.GITHUB },
      { title: 'Docker', url: LINKS.DOCKER },
      { title: 'NodeJS', url: LINKS.NPM },
      { title: 'PHP', url: LINKS.COMPOSER },
      { title: 'Python', url: LINKS.PIP },
      { title: 'Ruby', url: LINKS.GEM },
      { title: 'Goland', url: LINKS.GO },
    ])}

    ${Column(t('footer.articles.title'), [
      { title: 'YouTube', url: LINKS.YOUTUBE },
      { title: 'Habr', url: LINKS.HABR },
      { title: 'VC', url: LINKS.VC },
      { title: 'Reddit', url: LINKS.REDDIT },
    ])}

    ${Column(t('footer.languages'), items)}
  `);
}
