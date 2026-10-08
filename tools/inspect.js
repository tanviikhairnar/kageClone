const crypto = require('crypto');
const fs = require('fs');

async function testReverse() {
  const res = await fetch('https://threeui.com/landing-pages/kage.html');
  let text = await res.text();
  const expectedHash = 'c8e06b90397ac246baf0ab6f32f5f6b570acc6fe03c7009f711b579fb72d9f49';
  const expectedBytes = 243963;
  const expectedLines = 4821;

  // Let's inspect the lines around head
  const lines = text.split('\n');
  console.log('Line 0:', JSON.stringify(lines[0]));
  console.log('Line 1:', JSON.stringify(lines[1]));
  console.log('Line 2:', JSON.stringify(lines[2]));
  console.log('Line 3:', JSON.stringify(lines[3]));

  // In fetched:
  // Line 2 (index 2): <head><script>function __threeuiStorageImage...
  // Line 3 (index 3): </script>
  // Let's replace index 2 with '<head>' and remove index 3!
  if (lines[2].startsWith('<head><script>function __threeuiStorageImage') && lines[3] === '</script>') {
    lines[2] = '<head>';
    lines.splice(3, 1);
  }

  let restored = lines.join('\n');

  // Replace supabase urls
  restored = restored.replaceAll('https://ublctyddhtbgaersvxxb.supabase.co/storage/v1/object/public/threeui-media/scene-images/6884c5281949d2c3530ad4cf/', 'secret-pathways-assets/generated/');
  restored = restored.replaceAll('https://ublctyddhtbgaersvxxb.supabase.co/storage/v1/object/public/threeui-media/scene-images/35388445965f970fa28af333/', 'secret-pathways-assets/foreground/png/');

  // Replace crossorigin="anonymous" 
  restored = restored.replaceAll('crossorigin="anonymous" ', '');

  console.log('Restored lines:', restored.split('\n').length, 'Expected:', expectedLines);
  console.log('Restored bytes (utf8):', Buffer.byteLength(restored, 'utf8'), 'Expected:', expectedBytes);

  const hash = crypto.createHash('sha256').update(restored).digest('hex');
  console.log('Restored hash:', hash);
  console.log('Expected hash:', expectedHash);
  console.log('Match:', hash === expectedHash);

  if (hash !== expectedHash) {
    console.log('Byte diff:', Buffer.byteLength(restored, 'utf8') - expectedBytes);
  }
}

testReverse().catch(console.error);

