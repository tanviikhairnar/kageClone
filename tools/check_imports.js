async function checkImports() {
  const res = await fetch('https://threeui.com/source-code/kage-landing-page.json');
  const data = await res.json();
  data.files.forEach(f => {
    if (f.code) {
      console.log('=== ' + f.path + ' ===');
      const imports = f.code.split('\n').filter(l => l.startsWith('import '));
      imports.forEach(i => console.log('  ' + i));
    }
  });
}

checkImports().catch(console.error);

