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

  const doc: any = new DOMParser().parseFromString(html, 'text/html');
  return doc;
};

let scrapBuzzContent = (doc: any) => {
  let items: any = [];
  let listings = doc.querySelectorAll('.ls-list-container > .list-c-box');
  listings.forEach((item: any) => {
    //const url = item.querySelector('a').getAttribute('href');
    const image_url = item
      .querySelector('a > .c-box-bg')
      .getAttribute('style')
      .toString()
      .replace('background-image:', '')
      .replace('url(', '')
      .replace(')', '')
      .trim();
    const title = item.querySelector('h3 > a').textContent;
    const article = item.querySelector('h3 > a').getAttribute('href'); //.split("/lifestyle/")[1].replace("/", "");
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

export {url, parseDocument, scrapBuzzContent, scrapBuzzCategories};
