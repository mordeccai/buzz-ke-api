import { opine } from 'https://deno.land/x/opine@1.1.0/mod.ts';
import { DOMParser, HTMLDocument } from 'https://deno.land/x/deno_dom/deno-dom-wasm.ts';
import * as flags from 'https://deno.land/std/flags/mod.ts';
import {parseDocument, scrapBuzzCategories, scrapBuzzContent, scrapBuzzArticle, url} from './scrapper.ts';


const app = opine();
const DEFAULT_PORT = 8080;
const argsPort = flags.parse(Deno.args).port;
const port = argsPort ? Number(argsPort): DEFAULT_PORT;

const res = await fetch(url);
const html = await res.text();
const doc:HTMLDocument | null = new DOMParser().parseFromString(html, 'text/html');
console.log("Up and runnin...");

app.get('/categories', async function(req, res) {
  let categories = scrapBuzzCategories(doc);
  res.send(categories);
});


app.get('/articles/:article', async function(req, res) {
  let doc = await parseDocument(req.params.article, {isArticle: true});
  let article = scrapBuzzArticle(doc);
  res.send(article);
});


app.get('/:tag', async function(req, res) {
  let doc = await parseDocument(req.params.tag, {page: req.query.page ?? 1});
  let contents = scrapBuzzContent(doc);
  res.send(contents);
});

app.listen(port);
