const zlib = require('zlib');

function parseTar(buffer) {
  const files = [];
  let offset = 0;
  while (offset < buffer.length - 512) {
    const header = buffer.slice(offset, offset + 512);
    if (header.every(b => b === 0)) break;
    let nameEnd = header.indexOf(0);
    if (nameEnd < 0 || nameEnd > 100) nameEnd = 100;
    let name = header.slice(0, nameEnd).toString('utf8');
    if (header.slice(257, 262).toString('ascii') === 'ustar') {
      let prefixEnd = header.indexOf(0, 345);
      if (prefixEnd < 0 || prefixEnd > 500) prefixEnd = 500;
      let prefix = header.slice(345, prefixEnd).toString('utf8');
      if (prefix) name = prefix + '/' + name;
    }
    const size = parseInt(header.slice(124, 136).toString('utf8').trim(), 8);
    offset += 512;
    if (!isNaN(size) && size > 0) {
      files.push({ name, size, data: buffer.slice(offset, offset + size) });
      offset += Math.ceil(size / 512) * 512;
    }
  }
  return files;
}

async function main() {
  const res = await fetch('https://registry.npmjs.org/@designcodeio/threeui/-/threeui-1.2.0.tgz');
  const buf = Buffer.from(await res.arrayBuffer());
  const files = parseTar(zlib.gunzipSync(buf));
  const kage = files.find(f => f.name.endsWith('landing-pages/kage.html'));
  const text = kage.data.toString('utf8');
  
  console.log('--- kage.html head lines ---');
  console.log(text.split('\n').slice(0, 30).join('\n'));

  console.log('--- script tags in kage.html ---');
  const scripts = text.match(/<script[\s\S]*?<\/script>/gi);
  if (scripts) {
    scripts.forEach((s, i) => console.log(`Script ${i}:`, s.slice(0, 150)));
  }
}

main().catch(console.error);

