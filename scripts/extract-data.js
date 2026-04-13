const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

async function extractData() {
  const filePath = path.join(__dirname, '../info.html');
  const html = fs.readFileSync(filePath, 'utf-8');
  const $ = cheerio.load(html);

  // Extract biography text (all paragraphs after the first heading)
  const bio = [];
  $('.mw-parser-output > p').each((i, el) => {
    const text = $(el).text().trim();
    if (text) bio.push(text);
  });

  // Extract from the infobox (Positions)
  const positions = [];
  $('.infobox tr').each((i, el) => {
    const th = $(el).find('th').text().trim();
    const td = $(el).find('td').text().trim();
    if (th && td && td.length > 2) {
      positions.push({ role: th, detail: td.replace(/\n+/g, ' ') });
    }
  });

  const output = {
    biography: bio,
    positions: positions
  };

  const outputDir = path.join(__dirname, '../src/data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  fs.writeFileSync(path.join(outputDir, 'cv.json'), JSON.stringify(output, null, 2), 'utf-8');
  console.log('Successfully extracted data from info.html to src/data/cv.json');
}

extractData().catch(console.error);
