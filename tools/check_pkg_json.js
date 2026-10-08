const zlib = require('zlib');

async function main() {
  const res = await fetch('https://registry.npmjs.org/@designcodeio/threeui/-/threeui-1.2.0.tgz');
  const buf = Buffer.from(await res.arrayBuffer());
  const unzipped = zlib.gunzipSync(buf);
  
  const marker = 'package/lib-dist/index.d.ts';
  const idx = unzipped.indexOf(marker);
  if (idx !== -1) {
    const content = unzipped.slice(idx + marker.length, idx + marker.length + 3000).toString('utf8');
    console.log('index.d.ts exports KageLandingPage?', content.includes('KageLandingPage'));
    console.log(content.slice(0, 500));
  }
}

main().catch(console.error);

