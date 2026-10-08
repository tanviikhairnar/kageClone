const zlib = require('zlib');
const crypto = require('crypto');
const fs = require('fs');

// Simple tar reader
function parseTar(buffer) {
  const files = [];
  let offset = 0;
  while (offset < buffer.length - 512) {
    const header = buffer.slice(offset, offset + 512);
    // If block is all zeros, tar is done
    if (header.every(b => b === 0)) break;
    
    // File name is at offset 0, 100 bytes null-terminated
    const nameEnd = header.indexOf(0);
    const name = header.slice(0, nameEnd > 0 && nameEnd <= 100 ? nameEnd : 100).toString('utf8').trim();
    
    // File size is at offset 124, 12 bytes octal
    const sizeStr = header.slice(124, 136).toString('utf8').trim();
    const size = parseInt(sizeStr, 8);
    
    const typeFlag = header[156]; // 0 or '0' for normal file
    
    offset += 512;
    if (!isNaN(size) && size > 0) {
      const data = buffer.slice(offset, offset + size);
      files.push({ name, size, data, typeFlag: String.fromCharCode(typeFlag) });
      offset += Math.ceil(size / 512) * 512;
    }
  }
  return files;
}

async function checkNpm(version) {
  console.log(`Checking version ${version}...`);
  const url = `https://registry.npmjs.org/@designcodeio/threeui/-/threeui-${version}.tgz`;
  const res = await fetch(url);
  if (!res.ok) {
    console.log(`Failed to fetch ${version}:`, res.status);
    return;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const unzipped = zlib.gunzipSync(buf);
  const files = parseTar(unzipped);
  console.log(`Files count in ${version}:`, files.length);
  files.forEach(f => {
    const hash = crypto.createHash('sha256').update(f.data).digest('hex');
    console.log(`  ${f.name} (${f.size} bytes) sha256: ${hash}`);
  });
}

async function run() {
  for (const v of ['1.2.0', '1.1.0', '1.0.0', '0.3.0']) {
    await checkNpm(v);
  }
}

run().catch(console.error);

