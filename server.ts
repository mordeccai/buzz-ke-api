import { opine } from 'https://deno.land/x/opine@1.1.0/mod.ts';
import { DOMParser } from 'https://deno.land/x/deno_dom/deno-dom-wasm.ts';
import * as flags from 'https://deno.land/std/flags/mod.ts';

const app = opine();
const DEFAULT_PORT = 8080;
const argsPort = flags.parse(Deno.args).port;
const port = argsPort ? Number(argsPort): DEFAULT_PORT;

const url = 'https://www.kenyabuzz.com/lifestyle';
const res = await fetch(url);
const html = await res.text();
const doc: any = new DOMParser().parseFromString(html, 'text/html');

let parseDocument = async (tag: string, { page = 1, isArticle = false}) => {
  const res = (!isArticle)?await fetch(`${url}/category/${tag}/page/${page}`):await fetch(`${url}/${tag}`);
  const html = await res.text();

  const doc: any = new DOMParser().parseFromString(html, 'text/html');
  return doc;
};

app.get('/categories', async function(req, res) {
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

  res.send(categories);
});


app.get('/:tag', async function(req, res) {
  let doc = await parseDocument(req.params.tag, {page: req.query.page ?? 1});
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
    const title = item
      .querySelector('h3 > a')
      .textContent;
    const article = item
      .querySelector('h3 > a')
      .getAttribute('href');//.split("/lifestyle/")[1].replace("/", "");
    const date = item
      .querySelector('.box-bottom-c')
      .textContent.trim();

    items.push({
      title,
      date,
      image_url,
      article,
    });
  });

  res.send(items);
});

app.listen(port);
