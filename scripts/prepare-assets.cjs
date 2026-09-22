// Run after editing CSS or JavaScript and before publishing this static site.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
for (const [stem, extension] of [['styles', 'css'], ['site', 'js']]) {
  const bytes = fs.readFileSync(path.join(root, 'assets', `${stem}.${extension}`));
  const hash = crypto.createHash('sha256').update(bytes).digest('hex').slice(0, 12);
  const filename = `${stem}.${hash}.${extension}`;
  fs.writeFileSync(path.join(root, 'assets', filename), bytes);
  for (const page of ['index.html', 'el/index.html', '404.html']) {
    const file = path.join(root, page);
    const html = fs.readFileSync(file, 'utf8');
    const pattern = new RegExp(`assets/${stem}(?:\\.[a-f0-9]{12})?\\.${extension}`, 'g');
    fs.writeFileSync(file, html.replace(pattern, `assets/${filename}`));
  }
  console.log(filename);
}
