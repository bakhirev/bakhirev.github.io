class BlockLikeList {
  constructor(code = '-') {
    this.code = code;
    this.content = [];
  }

  update(code, text, json) {
    if (code === this.code) {
      this.content.push(text);
      return true;
    } else if (this.content.length) {
      json.push({ tag: 'li', content: this.content });
      this.content = [];
      return false;
    }
  }

  close(json) {
    if (!this.content.length) return;
    json.push({ tag: 'li', content: this.content });
    this.content = [];
  }
}

class BlockLikeCode {
  constructor(code = '```') {
    this.code = code;
    this.isOpen = false;
    this.content = [];
  }

  update(code, line, json) {
    if (code === this.code) {
      if (this.isOpen) {
        json.push({ tag: 'pre', content: this.content });
        this.content = [];
      }
      this.isOpen = !this.isOpen;
      return true;
    }

    if (this.isOpen) {
      this.content.push(line);
      return true;
    }

    return false;
  }
}

function getSEO() {
  return {
    title: '',
    template: '',
    description: {
      short: '',
      long: '',
    },
    keywords: [],
    recommendations: [],
    youtube: '',
  }
}

function removeQuotationMarks(text) {
  return text.slice(1, text.length - 2).trim();
}

function getImageJson(text) {
  const parse = part => {
    const parts = part.split('=');
    const key = parts?.[0] || '';
    const value = parts?.[1]?.replace(/"/gim, '');
    return [key, value];
  };
  const entries = text.substring(5, text.length - 3).split(/"\s/gim).map(parse);
  const attributes = Object.fromEntries(entries);
  return {
    tag: 'img',
    src: attributes.src || '',
    title: attributes.title || '',
    alt: attributes.alt || attributes.title || '',
  };
}

function getJsonFromMarkdown(markdownText) {
  const json = [];
  const seo = getSEO();
  const li = new BlockLikeList();
  const pre = new BlockLikeCode();

  (markdownText || '').split('\n').forEach((line) => {
    if (!line[0]) return;

    const parts = (line || '').split(' ');
    const code = parts.shift();
    const content = parts.join(' ');

    if (code === '<a') return;
    if (li.update(code, content, json)) return;
    if (pre.update(code, line, json)) return;

    if (code === '>') json.push({ warning: content });
    else if (code === '[title]:#') seo.title = removeQuotationMarks(content);
    else if (code === '[short]:#') seo.description.short = removeQuotationMarks(content);
    else if (code === '[long]:#') seo.description.long = removeQuotationMarks(content);
    else if (code === '[tags]:#') seo.keywords = removeQuotationMarks(content);
    else if (code === '[layout]:#') seo.template = removeQuotationMarks(content);
    else if (code === '[youtube]:#') seo.youtube = removeQuotationMarks(content);
    else if (code === '[recommendations]:#') {
      seo.recommendations = removeQuotationMarks(content).split(',').map(v => v.trim()).filter(v => v);
    } else if (code === '#') json.push({ tag: 'h1', content });
    else if (code === '##') json.push({ tag: 'h2', content });
    else if (code === '###') json.push({ tag: 'h3', content });
    else if (code === '####') json.push({ tag: 'h4', content });
    else if (code === '#####') json.push({ tag: 'h5', content });
    else if (code === '>>') json.push({ tag: 'div', isOpen: true });
    else if (code === '<<') json.push({ tag: 'div', isOpen: false });
    else if (code === '<img') json.push(getImageJson(line));
    else if (line) json.push({ tag: 'p', content: line });
  });

  li.close(json);

  return { seo, json };
}

module.exports = getJsonFromMarkdown;
