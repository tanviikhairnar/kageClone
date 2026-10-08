const fs = require('fs');

const html = fs.readFileSync('public/landing-pages/kage.html', 'utf8');
const lines = html.split('\n');
lines.forEach((line, i) => {
  if (line.includes('href') && line.includes('#') || line.includes('scrollTo') || line.includes('scrollIntoView')) {
    console.log(`Line ${i+1}: ${line.trim()}`);
  }
});

