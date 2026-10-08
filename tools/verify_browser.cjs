const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function verify() {
  console.log('Launching Chrome...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--ignore-gpu-blocklist']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('Browser console error:', msg.text());
      errors.push(msg.text());
    } else {
      console.log('Browser log:', msg.text());
    }
  });
  page.on('pageerror', err => {
    console.error('Page error:', err.message);
    errors.push(err.message);
  });

  console.log('Navigating to http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

  // Wait for iframe
  console.log('Waiting for iframe...');
  await page.waitForSelector('iframe');
  const iframeElement = await page.$('iframe');
  const frame = await iframeElement.contentFrame();

  if (!frame) {
    throw new Error('Failed to access iframe contentFrame');
  }

  // Wait for iframe DOM to be ready
  await frame.waitForSelector('#gl');
  console.log('Found #gl canvas inside iframe!');

  // Wait for Three.js initialization and __kage object
  await frame.waitForFunction(() => window.__kage !== undefined, { timeout: 10000 });
  console.log('window.__kage is defined inside iframe!');

  const kageDetails = await frame.evaluate(() => {
    const kage = window.__kage;
    const canvas = document.querySelector('#gl');
    const title = document.title;
    const chapters = document.querySelectorAll('.chapter').length;
    const wordmark = document.querySelector('.wm')?.textContent;
    return {
      hasKage: !!kage,
      hasRenderer: !!kage?.renderer,
      hasScene: !!kage?.scene,
      hasCamera: !!kage?.camera,
      canvasWidth: canvas?.width,
      canvasHeight: canvas?.height,
      title,
      chapters,
      wordmark,
    };
  });
  console.log('Kage details:', JSON.stringify(kageDetails, null, 2));

  // Take initial screenshot
  const screenshotDir = path.resolve(__dirname, '..', 'screenshots');
  fs.mkdirSync(screenshotDir, { recursive: true });
  await page.screenshot({ path: path.join(screenshotDir, 'initial.png') });
  console.log('Saved initial.png screenshot');

  // Test scrolling interaction
  console.log('Simulating scroll interaction in iframe...');
  await frame.evaluate(() => {
    window.scrollTo({ top: 1200, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(screenshotDir, 'scrolled-1200.png') });
  console.log('Saved scrolled-1200.png screenshot');

  await frame.evaluate(() => {
    window.scrollTo({ top: 3000, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(screenshotDir, 'scrolled-3000.png') });
  console.log('Saved scrolled-3000.png screenshot');

  await browser.close();
  console.log('Verification completed successfully!');
}

verify().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
