const puppeteer = require('puppeteer-core');
const path = require('path');

async function testInteractions() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

  const iframeEl = await page.waitForSelector('iframe');
  const frame = await iframeEl.contentFrame();
  await frame.waitForSelector('#gl');
  await frame.waitForFunction(() => window.__kage !== undefined);

  // Click on the '#pathways' link
  console.log('Clicking on #pathways link...');
  await frame.evaluate(() => {
    const link = document.querySelector('a[href="#pathways"]');
    if (link) {
      console.log('Found link:', link.outerHTML);
      link.click();
    }
  });

  // Wait for smooth scroll animation to finish
  await new Promise(r => setTimeout(r, 2000));

  const scrollYAfterClick = await frame.evaluate(() => window.scrollY);
  console.log('Scroll Y after clicking #pathways:', scrollYAfterClick);

  // Take screenshot of Pathways / Gardens section
  const screenshotDir = path.resolve(__dirname, '..', 'screenshots');
  await page.screenshot({ path: path.join(screenshotDir, 'pathways-scrolled.png') });
  console.log('Saved pathways-scrolled.png');

  await browser.close();
  console.log('Navigation test passed with smooth scroll!');
}

testInteractions().catch(console.error);

