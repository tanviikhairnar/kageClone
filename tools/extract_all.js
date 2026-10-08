const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
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

const EXPECTED_HASHES = {
  // Required registered files
  'src/shaders/landing-pages/LandingPages.tsx': '4d379461ad00eb4de7900df312878035383de7e1ed4e13283b8143a2eea9d30a',
  'src/shaders/landing-pages/pageTypography.ts': '809cc65797d531cd3b3ca5a56815d55d24b3ee8d293e4e4bad6fdfe6c83244cc',
  'src/shaders/landing-pages/pageRecipes.ts': 'c9d9849cc255bac2d1d938d088c50917f84916f1c516d2bbb27fcfd803523233',
  'src/shaders/landing-pages/LandingPageFrame.tsx': '61de2cc50888aac4ac5557420b07fa47ed3543bb57c1e0055fafdefa53dbaa78',
  'public/landing-pages/kage.html': 'c8e06b90397ac246baf0ab6f32f5f6b570acc6fe03c7009f711b579fb72d9f49',
  'public/landing-pages/secret-pathways-assets/fonts.css': '985f85a904a4096f92c06552b06f42a45973ac004af4780d68f18af65ddcc1b0',
  'public/landing-pages/secret-pathways-assets/three.min.js': '8a5f7249903b54d30f79f708699d2fed2d6a1d0741a4cd41377d1f01bb5a2271',
  'src/shaders/threeui.css': 'efe4447139f1358dd8e9be68edf6fa46cbefbd1de423a4d6c439ca61d2c8eccf',

  // Required binary assets
  'public/landing-pages/secret-pathways-assets/generated/kage-sanmon-preview.webp': '23937f8c8350c55730c3bd17066a250548b2d29aad0e6ffb96218c1354b6db43',
  'public/landing-pages/secret-pathways-assets/generated/kage-approach.webp': '39ff338936097e1bde0c4eadcf09805b9890862703186e67314942de7e0bc36c',
  'public/landing-pages/secret-pathways-assets/generated/kage-lantern-court.webp': 'c0a6ff7da1cd6909d66e2f3f690b0d524a693e01d2222ab846d0074a90f47471',
  'public/landing-pages/secret-pathways-assets/generated/kage-moonwater.webp': 'b8c8060c51c87a103bae619b3a4cc8b8b80632649d83f1f2c2299051e7f9b400',
  'public/landing-pages/secret-pathways-assets/foreground/png/temple-wall.webp': '41c00f017e4ecf2147ee468d74da955bb4e2dad773f75a575022842eaf7609ce',
  'public/landing-pages/secret-pathways-assets/foreground/png/pine-tree.webp': '79b233716d067bbc64c1507f79e4a30ba5f445995158c78562cc5b81f607ede7',
  'public/landing-pages/secret-pathways-assets/foreground/png/tall-grass.webp': '8db0b5fbd160a7225391a6283a99681e346e205f24191031657285ef85ef12d2',
  'public/landing-pages/secret-pathways-assets/foreground/png/sakura-branch.webp': '48564194d40496090dbf3bba2a68785cf91fafb655dc8d43ac16f6678aff196d',
  'public/landing-pages/secret-pathways-assets/foreground/png/maple-leaves.webp': '35a90fec62c1a6bbfbbe73cd5d7b1acb889e80546d404182ef9a45fe417b531f',
  'public/landing-pages/secret-pathways-assets/foreground/png/stone-lantern.webp': 'd5f3c881bc9d92b72eaaff2b709614d66e21a19e14025d2b9b16a15ab52df3bc',
  'public/landing-pages/secret-pathways-assets/foreground/png/garden-bush.webp': '707e2516ebc0108041fe0ddc26d8bff0a69dc9700641f837765018b64e9ff15e',
  'public/landing-pages/secret-pathways-assets/foreground/png/basalt-stones.webp': '150f1c87e181d651c318168c271bb65c9c8abac6dea6f2421fdd081c5b740471',
  'public/landing-pages/secret-pathways-assets/foreground/png/hill.webp': 'ffba816244bcba98e4e33c6ee56165edfe4048db4af122ef3f5822180a85edbc',
  'public/landing-pages/secret-pathways-assets/foreground/png/shrine-ruins.webp': '77006e58f2066e6fa9bfc504df396db49b1c7977858fa52d34dd2dad5feced77',
};

async function main() {
  console.log('Fetching JSON source bundle...');
  const jsonRes = await fetch('https://threeui.com/source-code/kage-landing-page.json');
  const bundle = await jsonRes.json();

  console.log('Fetching @designcodeio/threeui package tarball...');
  const pkgRes = await fetch('https://registry.npmjs.org/@designcodeio/threeui/-/threeui-1.2.0.tgz');
  const pkgBuf = Buffer.from(await pkgRes.arrayBuffer());
  const pkgFiles = parseTar(zlib.gunzipSync(pkgBuf));
  console.log(`Unpacked ${pkgFiles.length} files from tarball.`);

  const workspaceRoot = path.resolve(__dirname, '..');

  function writeFile(relPath, buffer) {
    const fullPath = path.join(workspaceRoot, relPath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, buffer);
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    const expected = EXPECTED_HASHES[relPath];
    const match = hash === expected;
    console.log(`${relPath}: ${buffer.length} bytes | sha256: ${hash.slice(0, 12)}... | MATCH: ${match}`);
    if (!match) {
      throw new Error(`Hash mismatch for ${relPath}: got ${hash}, expected ${expected}`);
    }
  }

  // 1. Files from JSON bundle
  bundle.files.forEach(f => {
    if (f.code) {
      writeFile(f.path, Buffer.from(f.code, 'utf8'));
    }
  });

  // 2. Files from package tarball
  const tarballMappings = {
    'package/lib-dist/assets/landing-pages/kage.html': 'public/landing-pages/kage.html',
    'package/lib-dist/assets/landing-pages/secret-pathways-assets/fonts.css': 'public/landing-pages/secret-pathways-assets/fonts.css',
    'package/lib-dist/assets/landing-pages/secret-pathways-assets/three.min.js': 'public/landing-pages/secret-pathways-assets/three.min.js',
    'package/lib-dist/assets/landing-pages/secret-pathways-assets/generated/kage-sanmon-preview.webp': 'public/landing-pages/secret-pathways-assets/generated/kage-sanmon-preview.webp',
    'package/lib-dist/assets/landing-pages/secret-pathways-assets/generated/kage-approach.webp': 'public/landing-pages/secret-pathways-assets/generated/kage-approach.webp',
    'package/lib-dist/assets/landing-pages/secret-pathways-assets/generated/kage-lantern-court.webp': 'public/landing-pages/secret-pathways-assets/generated/kage-lantern-court.webp',
    'package/lib-dist/assets/landing-pages/secret-pathways-assets/generated/kage-moonwater.webp': 'public/landing-pages/secret-pathways-assets/generated/kage-moonwater.webp',
    'package/lib-dist/assets/landing-pages/secret-pathways-assets/foreground/png/temple-wall.webp': 'public/landing-pages/secret-pathways-assets/foreground/png/temple-wall.webp',
    'package/lib-dist/assets/landing-pages/secret-pathways-assets/foreground/png/pine-tree.webp': 'public/landing-pages/secret-pathways-assets/foreground/png/pine-tree.webp',
    'package/lib-dist/assets/landing-pages/secret-pathways-assets/foreground/png/tall-grass.webp': 'public/landing-pages/secret-pathways-assets/foreground/png/tall-grass.webp',
    'package/lib-dist/assets/landing-pages/secret-pathways-assets/foreground/png/sakura-branch.webp': 'public/landing-pages/secret-pathways-assets/foreground/png/sakura-branch.webp',
    'package/lib-dist/assets/landing-pages/secret-pathways-assets/foreground/png/maple-leaves.webp': 'public/landing-pages/secret-pathways-assets/foreground/png/maple-leaves.webp',
    'package/lib-dist/assets/landing-pages/secret-pathways-assets/foreground/png/stone-lantern.webp': 'public/landing-pages/secret-pathways-assets/foreground/png/stone-lantern.webp',
    'package/lib-dist/assets/landing-pages/secret-pathways-assets/foreground/png/garden-bush.webp': 'public/landing-pages/secret-pathways-assets/foreground/png/garden-bush.webp',
    'package/lib-dist/assets/landing-pages/secret-pathways-assets/foreground/png/basalt-stones.webp': 'public/landing-pages/secret-pathways-assets/foreground/png/basalt-stones.webp',
    'package/lib-dist/assets/landing-pages/secret-pathways-assets/foreground/png/hill.webp': 'public/landing-pages/secret-pathways-assets/foreground/png/hill.webp',
    'package/lib-dist/assets/landing-pages/secret-pathways-assets/foreground/png/shrine-ruins.webp': 'public/landing-pages/secret-pathways-assets/foreground/png/shrine-ruins.webp',
  };

  for (const [pkgPath, destPath] of Object.entries(tarballMappings)) {
    const entry = pkgFiles.find(f => f.name === pkgPath || f.name.endsWith(pkgPath));
    if (!entry) {
      throw new Error(`File not found in tarball: ${pkgPath}`);
    }
    writeFile(destPath, entry.data);
  }

  console.log('\n--- VERIFICATION SUMMARY ---');
  let allMatched = true;
  for (const [relPath, expected] of Object.entries(EXPECTED_HASHES)) {
    const fullPath = path.join(workspaceRoot, relPath);
    if (!fs.existsSync(fullPath)) {
      console.error(`MISSING: ${relPath}`);
      allMatched = false;
      continue;
    }
    const buf = fs.readFileSync(fullPath);
    const hash = crypto.createHash('sha256').update(buf).digest('hex');
    if (hash !== expected) {
      console.error(`MISMATCH: ${relPath}`);
      allMatched = false;
    }
  }

  if (allMatched) {
    console.log(`ALL ${Object.keys(EXPECTED_HASHES).length} REQUIRED FILES AND ASSETS MATCH EXACTLY!`);
  } else {
    throw new Error('Some files did not match!');
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

