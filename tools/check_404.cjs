const puppeteer = require('puppeteer-core');

async function checkRequests() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  page.on('response', resp => {
    if (resp.status() >= 400) {
      console.log(`HTTP ${resp.status()}: ${resp.url()}`);
    }
  });

  page.on('requestfailed', req => {
    console.log(`Failed request: ${req.url()} (${req.failure().errorText})`);
  });

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
}

checkRequests().catch(console.error);

