import { createWriteStream, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { Readable } from 'node:stream';
import { finished } from 'node:stream/promises';

const ROOT_URL = 'https://adventofcode.com/';

const { YEAR, SESSION_TOKEN } = process.env;

if (!YEAR) {
  console.error('No year defined! Set it up the variable YEAR in the file .env');
  process.exit(1);
}
if (!SESSION_TOKEN) {
  console.error('No session token defined! Set it up the variable SESSION_TOKEN in the file .env');
  process.exit(2);
}

const download = async (url, filePath) => {
  const res = await fetch(url, { headers: { Cookie: `session=${SESSION_TOKEN}` } });
  if (res.status !== 200) {
    throw Error(`Cannot get '${url}'`);
  }
  const dlStream = createWriteStream(filePath);
  return finished(Readable.fromWeb(res.body).pipe(dlStream));
};

const getPage = async (url) => {
  const res = await fetch(url, { headers: { Cookie: `session=${SESSION_TOKEN}` } });
  if (res.status !== 200) {
    throw Error(`Cannot get '${url}'`);
  }
  return res.text();
};

const [ , , day = new Date().getDate() ] = process.argv;
if (!day) {
  console.error('No day given! Usage:\n  retrieve ##');
  process.exit(3);
}
if (+day < 1 || day > 25) {
  console.error('Incorrect day! Please use an integer between 1 and 25');
  process.exit(3);
}

const outDir = `./day-${day}`;
if (!existsSync(outDir)) {
  mkdirSync(outDir);
}

const BASE_URL = `${ROOT_URL}${YEAR}/day/${day}`;
Promise.all([
  download(BASE_URL + '/input', outDir + '/input.txt'),
  getPage(BASE_URL).then(page => {
    const re = /<article class="day-desc">[\s\S]+?<\/article>/g;
    const readme = (page.match(re) || []).join('')
      .replace(/<pre><code>(?=[^<]*?<em)([\s\S]+?)<\/code><\/pre>/g, (_, m1) => `<pre>${m1.replace(/<(\/?)em>/g, '<$1b>')}</pre>`)
      .replace(/<pre><code>\n*|\n*<\/code><\/pre>/g, '\n```\n')
      .replace(/<code><em>([^<]+)<\/em><\/code>/g, '**`$1`**')
      .replace(/<span class="quiet">([^<]+?)<\/span>/g, '*$1*')
      .replace(/<\/?code>/g, '`')
      .replace(/<\/?em>/g, '**')
      .replace(/<p>/g, '\n')
      .replace(/<\/p>|<\/li>/g, '')
      .replace(/<\/?ul>/g, '')
      .replace(/<li>/g, '* ')
      .replace(/<a .*?href="([^"]+)".*?>([^<]+)<\/a>/g, '[$2]($1)')
      .replace(/ ---<\/h2>/g, '\n')
      .replace(/<\/?article[^>]*>/g, '')
      .replace('<h2 id="part2">---', '\n\n##')
      .replace(/<h2>--- ([^\n]+)/,'# $1\n\n## Part One');
    writeFileSync(outDir + '/readme.md', readme);
  })
]).then(() => {
  console.log('Done!');
});
