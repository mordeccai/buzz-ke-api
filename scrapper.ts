import {
  DOMParser,
  HTMLDocument,
} from 'https://deno.land/x/deno_dom/deno-dom-wasm.ts';

const url = 'https://www.kenyabuzz.com/lifestyle';

let parseDocument = async (tag: string, { page = 1, isArticle = false }) => {
  const res = !isArticle
    ? await fetch(`${url}/category/${tag}/page/${page}`)
    : await fetch(`${url}/${tag}`);
  const html = await res.text();

  const doc: HTMLDocument | null = new DOMParser().parseFromString(
    html,
    'text/html'
  );
  return doc;
};

let scrapBuzzContent = (doc: any) => {
  let items: any = [];
  let listings = doc.querySelectorAll('.ls-list-container > .list-c-box');
  listings.forEach((item: any) => {
    const image_url = item
      .querySelector('a > .c-box-bg')
      .getAttribute('style')
      .toString()
      .replace('background-image:', '')
      .replace('url(', '')
      .replace(')', '')
      .trim();
    const title = item.querySelector('h3 > a').textContent;
    const article = item
      .querySelector('h3 > a')
      .getAttribute('href')
      .split('/lifestyle/')[1]
      .replace('/', '');
    const date = item.querySelector('.box-bottom-c').textContent.trim();

    items.push({
      title,
      date,
      image_url,
      article,
    });
  });
  return items;
};

let scrapBuzzCategories = (doc: any) => {
  let categories: any = [];
  let categoryListing = doc.querySelectorAll('.nav-tabs-link > ul > li');
  categoryListing.forEach((category: any) => {
    const url = category.querySelector('a').getAttribute('href');
    const title = category.querySelector('a').textContent.trim();
    categories.push({
      title,
      tag: url.split('/')[url.split('/').length - 1],
    });
  });
  return categories;
};

let scrapBuzzArticle = (doc: any) => {
  let title = doc.querySelector(
    'body > .article-content-page > .article-c-intro > div > h1'
  ).textContent;
  let author = doc.querySelector(
    'body > .article-content-page > .article-c-intro > div > div > .meta-author > a'
  ).textContent;
  let date = doc.querySelector(
    'body > .article-content-page > .article-c-intro > div > div > .meta-posted > span:nth-child(2)'
  ).textContent;
  let article_banner = doc
    .querySelector(
      'body > .article-content-page > .article-main-content > .article-m-banner'
    )
    .getAttribute('style')
    .toString()
    .replace('background-image:', '')
    .replace('url(', '')
    .replace(')', '')
    .trim();
  let content = doc.querySelector(
    'body > div.article-content-page > div.article-main-content > div.article-para'
  ).innerHTML.toString().replaceAll("   ", "").replaceAll("\n", "").trim();

  return {
    title,
    author,
    date,
    article_banner,
    content,
  };
};

export {
  url,
  parseDocument,
  scrapBuzzContent,
  scrapBuzzCategories,
  scrapBuzzArticle,
};
