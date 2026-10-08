const zlib = require('zlib');
const crypto = require('crypto');

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
    
    const sizeStr = header.slice(124, 136).toString('utf8').trim();
    const size = parseInt(sizeStr, 8);
    
    offset += 512;
    if (!isNaN(size) && size > 0) {
      const data = buffer.slice(offset, offset + size);
      files.push({ name, size, data });
      offset += Math.ceil(size / 512) * 512;
    }
  }
  return files;
}

async function main() {
  const res = await fetch('https://registry.npmjs.org/@designcodeio/threeui/-/threeui-1.2.0.tgz');
  const buf = Buffer.from(await res.arrayBuffer());
  const unzipped = zlib.gunzipSync(buf);
  const files = parseTar(unzipped);

  console.log('HTML files or exact hash in npm:');
  const targetHash = 'c8e06b90397ac246baf0ab6f32f5f6b570acc6fe03c7009f711b579fb72d9f49';
  files.forEach(f => {
    const hash = crypto.createHash('sha256').update(f.data).digest('hex');
    if (hash === targetHash) {
      console.log('FOUND EXACT HASH:', f.name);
    }
    if (f.name.endsWith('.html')) {
      console.log('HTML:', f.name, f.size, hash);
    }
  });
}

main().catch(console.error);

