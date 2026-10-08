const zlib = require('zlib');

async function main() {
  const res = await fetch('https://registry.npmjs.org/@designcodeio/threeui/-/threeui-1.2.0.tgz');
  const buf = Buffer.from(await res.arrayBuffer());
  const unzipped = zlib.gunzipSync(buf);
  
  const str = unzipped.toString('utf8');
  console.log('Includes KageLandingPage?', str.includes('KageLandingPage'));
  if (str.includes('KageLandingPage')) {
    let idx = 0;
    while ((idx = str.indexOf('KageLandingPage', idx)) !== -1) {
      console.log('Occurrence:', str.slice(Math.max(0, idx - 100), idx + 100));
      idx += 'KageLandingPage'.length;
    }
  }
}

main().catch(console.error);

