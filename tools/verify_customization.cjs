const puppeteer = require('puppeteer-core');

async function verifyCustomization() {
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

  const customizationInfo = await frame.evaluate(() => {
    // Check for injected style tag with threeui customization
    const styles = Array.from(document.querySelectorAll('style')).map(s => s.textContent || '');
    const customStyle = styles.find(s => s.includes('--vermilion') || s.includes('#e0231c') || s.includes('threeui-customization') || s.includes('46px'));
    
    // Check computed styles on headings and body
    const h1 = document.querySelector('h1') || document.querySelector('.di');
    const h1Style = h1 ? window.getComputedStyle(h1) : null;
    const bodyStyle = window.getComputedStyle(document.body);

    return {
      customStyleSnippet: customStyle ? customStyle.slice(0, 300) : 'none found',
      allStylesCount: styles.length,
      bodyFontSize: bodyStyle.fontSize,
      bodyFontWeight: bodyStyle.fontWeight,
      h1FontSize: h1Style ? h1Style.fontSize : null,
      h1FontWeight: h1Style ? h1Style.fontWeight : null,
      h1LetterSpacing: h1Style ? h1Style.letterSpacing : null,
      rootVermilion: window.getComputedStyle(document.documentElement).getPropertyValue('--vermilion'),
    };
  });

  console.log('Customization Info:', JSON.stringify(customizationInfo, null, 2));
  await browser.close();
}

verifyCustomization().catch(console.error);

