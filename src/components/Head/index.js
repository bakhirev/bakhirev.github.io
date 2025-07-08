const { DOMAIN, VERSION } = require('../../helpers/constants');
const { LANGUAGES } = require('../../helpers/translations');

function getAvailableLanguages(meta) {
  if (meta.template !== 'main') return 'ru';
  return LANGUAGES
    .map(({ id }) => id)
    .join(', ');
}

function getLink(meta) {
  const page = meta.id === 'index' ? '' : meta.id;
  return {
    main: `${DOMAIN}/${meta.language}/`,
    blog: `${DOMAIN}/${meta.language}/blog/`,
    article: `${DOMAIN}/${meta.language}/blog/${meta.category}/${page}`
  }[meta.template || 'main'];
}

function getAlternate(meta, link) {
  const baseUrl = `${DOMAIN}/${meta.language}`;
  const byLang = LANGUAGES.map((item) => {
    const newLink = link.replace(baseUrl, `${DOMAIN}/${item.id}`);
    return `<link rel="alternate" href="${newLink}" hrefLang="${item.id}" />`
  });
  const newLink = link.replace(baseUrl, `${DOMAIN}/en`);
  const forAll = `<link rel="alternate" href="${newLink}" hrefLang="x-default" />`
  return [forAll, ...byLang].join('');
}

module.exports = function (meta) {
  const title = meta.title.long;
  const ogTitle = meta.title.short || meta.title.long || meta.description.short;
  const description = meta.description.short;
  const keywords = meta.keywords;
  const link = getLink(meta);
  const cssName = meta.template === 'main' ? 'main' : 'article';
  const availableLanguages = getAvailableLanguages(meta);
  const alternate = getAlternate(meta, link);
  // user-scalable=no, maximum-scale=1.0
  return `
    <head>
      <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0">
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <meta http-equiv="Cache-Control" content="no-cache">
      <meta http-equiv="cleartype" content="on">
      <meta name="HandheldFriendly" content="True">
      <meta name="format-detection" content="telephone=no">
      <meta name="format-detection" content="address=no">
      <meta name="mobile-web-app-capable" content="yes">
      <meta name="apple-mobile-web-app-status-bar-style" content="default">
      <meta name="theme-color" content="white"/>
  
      <meta name="availableLanguages" content="${availableLanguages}">
      <link rel="canonical" href="${link}">
      ${meta.template === 'main' ? alternate : ''}

      <link rel="icon" href="${DOMAIN}/assets/icons/small.svg" />
      <link rel="apple-touch-icon" href="${DOMAIN}/assets/icons/big.svg" />
  
      <title>${title}</title>
      <meta name="description" content="${meta.description.long}">
      <meta name="keywords" content="${keywords}">
      <meta name="author" content="Bakhirev Aleksei">
      <meta name="copyright" content="(c) Bakhirev Aleksei">
  
      <meta name="application-name" content="${title}">
      <meta name="msapplication-tooltip" content="${description}">
  
      <meta property="og:type" content="website" />
      <meta property="og:title" content="${ogTitle}">
      <meta property="og:description" content="${description}">
      <meta property="og:image" content="${DOMAIN}/assets/icons/1200x630.png">
      <meta property="og:url" content="${link}">
      <meta property="og:locale" content="${meta.language}">
      <meta property="og:video" content="${DOMAIN}/assets/images/index.webm">

      <meta name="twitter:card" content="summary">
      <meta name="twitter:title" content="${ogTitle}">
      <meta name="twitter:description" content="${description}">
      <meta name="twitter:creator" content="Bakhirev Aleksei">
      <meta name="twitter:image:src" content="${DOMAIN}/assets/icons/1200x630.png">
      <meta name="twitter:domain" content="bakhirev.github.io">

      <meta itemprop="name" content="${title}">
      <meta itemprop="description" content="${description}">
      <meta itemprop="image" content="${DOMAIN}/assets/icons/1200x630.png">

      <link href="%CSS_PATH%/assets/css/${cssName}.css?v=${VERSION}" rel="stylesheet">
    </head>`;
}
